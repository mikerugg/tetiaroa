#!/usr/bin/env node
/** Populate the three destinations without replacing unrelated hub/editorial content. */
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { createClient } from "@sanity/client";
import { atollCopy } from "../app/atoll/atoll-copy.ts";

for (const path of [".env.local", ".env"]) {
  try { process.loadEnvFile(path); } catch (error) { if (error.code !== "ENOENT") throw error; }
}
const write = process.argv.includes("--write") && !process.argv.includes("--dry-run");
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_TOKEN ?? process.env.SANITY_WRITE_TOKEN,
  apiVersion: "2026-07-02", useCdn: false,
});
const records = await client.fetch('*[_id in ["atoll-hub", "drafts.atoll-hub"]]');
const hub = records.find((record) => record._id === "atoll-hub");
if (!hub) throw new Error("The published atoll hub must exist before configuring its destinations.");
if (records.some((record) => record._id.startsWith("drafts."))) throw new Error("The atoll hub has an editorial draft. Reconcile it before updating the published destinations.");

async function image(path, alt) {
  const bytes = await readFile(path);
  const hash = createHash("sha1").update(bytes).digest("hex");
  let asset = await client.fetch('*[_type == "sanity.imageAsset" && sha1hash == $hash][0]{_id}', { hash });
  if (!asset && write) asset = await client.assets.upload("image", bytes, { filename: path.split("/").at(-1) });
  return { _type: "image", asset: { _type: "reference", _ref: asset?._id ?? `pending-${hash}` }, alt };
}

const images = {
  guide: await image("public/wildlife/green-sea-turtle.webp", ""),
  swac: await image("public/swac/cooling-preview.svg", ""),
};
const changes = {};
const preserved = [];
for (const locale of ["en", "fr"]) {
  const field = locale === "fr" ? "french" : "english";
  const copy = atollCopy[locale];
  const current = hub[field]?.experiences ?? [];
  const next = [...current];
  for (const path of ["guide", "geology", "swac"]) {
    const href = `${locale === "fr" ? "/fr" : ""}/island/${path}`;
    const index = next.findIndex((entry) => entry.href === href);
    const existing = index >= 0 ? next[index] : undefined;
    const title = path === "guide" ? copy.guide : path === "swac" ? "SWAC" : locale === "fr" ? "Géologie" : "Geology";
    const description = copy[`${path === "guide" ? "species" : path}DestinationDescription`];
    const entry = existing ? { ...existing } : { _key: path, href };
    for (const [key, value] of Object.entries({ title, description, linkLabel: title })) {
      const oldValue = path === "guide" ? undefined : copy[`${path}${key === "description" ? "Description" : key === "title" ? "Title" : "Link"}`];
      if (!entry[key] || entry[key] === oldValue || entry[key] === value) entry[key] = value;
      else preserved.push(`${field}.experiences.${path}.${key}`);
    }
    const oldSwacImage = "image-21feecc7dcbe7e6bfa8da728b159dcc7c1352b51-400x440-gif";
    if ((!entry.image && images[path]) || (path === "swac" && entry.image?.asset?._ref === oldSwacImage)) entry.image = images[path];
    if (index >= 0) next[index] = entry;
    else next.push(entry);
  }
  const order = ["guide", "geology", "swac"].map((path) => `${locale === "fr" ? "/fr" : ""}/island/${path}`);
  next.sort((a, b) => (order.includes(a.href) ? order.indexOf(a.href) : 3) - (order.includes(b.href) ? order.indexOf(b.href) : 3));
  if (JSON.stringify(current) !== JSON.stringify(next)) changes[`${field}.experiences`] = next;
}

if (write && Object.keys(changes).length) {
  await mkdir(".migration-cache", { recursive: true });
  await writeFile(`.migration-cache/atoll-gateway-before-${hub._rev}.json`, JSON.stringify(hub, null, 2), { flag: "wx" }).catch((error) => { if (error.code !== "EEXIST") throw error; });
  await client.patch(hub._id).ifRevisionId(hub._rev).set(changes).commit();
}
console.log(JSON.stringify({ mode: write ? "write" : "dry-run", changedFields: Object.keys(changes), preservedEditorialFields: preserved }, null, 2));
