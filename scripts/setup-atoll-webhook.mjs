import { readFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join, resolve } from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";

export const WEBHOOK_NAME = "Tetiaroa Atoll Guide revalidation";
export const API_VERSION = "2025-02-19";
export const WEBHOOK_FILTER = 'coalesce(after()._type, before()._type) in ["speciesGuide", "atollCategory", "atollHub", "impactEntry"]';
export const WEBHOOK_PROJECTION = `{
  "_id": coalesce(after()._id, before()._id),
  "_type": coalesce(after()._type, before()._type),
  "slug": coalesce(after().slug, before().slug),
  "category": coalesce(after().category, before().category),
  "english": {"slug": coalesce(after().english.slug, before().english.slug)},
  "french": {"slug": coalesce(after().french.slug, before().french.slug)}
}`;

export function validateEndpoint(value, allowLocal = false) {
  let url;
  try { url = new URL(value); } catch { throw new Error("Provide --url with the confirmed new-site /api/revalidate endpoint."); }
  const local = ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
  if (url.protocol !== "https:" && !(allowLocal && local && url.protocol === "http:")) {
    throw new Error("The webhook requires HTTPS; HTTP loopback is allowed only for --test-endpoint.");
  }
  if (url.username || url.password || url.search || url.hash || url.pathname !== "/api/revalidate") {
    throw new Error("Use a plain /api/revalidate endpoint without credentials, query parameters, or a fragment.");
  }
  return url.href;
}

export function desiredWebhook({ url, dataset, secret, disabled = false }) {
  return {
    type: "document",
    name: WEBHOOK_NAME,
    description: "Refresh the bilingual atoll guide, related Impact stories, listings, and sitemap after published content changes.",
    url,
    dataset,
    rule: { on: ["create", "update", "delete"], filter: WEBHOOK_FILTER, projection: WEBHOOK_PROJECTION },
    apiVersion: `v${API_VERSION}`,
    httpMethod: "POST",
    includeDrafts: false,
    includeAllVersions: false,
    headers: {},
    secret,
    isDisabledByUser: disabled,
  };
}

const normalizedGroq = (value) => (value ?? "").replace(/\s+/g, "").replace(/,}/g, "}");

export function planWebhook(hooks, desired) {
  const matches = hooks.filter((hook) => hook.name === WEBHOOK_NAME && !hook.deletedAt);
  if (matches.length > 1) throw new Error("Multiple Atoll Guide hooks exist. Resolve the duplicate names in Sanity before continuing.");
  const existing = matches[0];
  if (!existing) return { action: "create", existing: null, differences: [] };
  const differences = [];
  for (const key of ["type", "url", "dataset", "apiVersion", "httpMethod"]) {
    if (existing[key] !== desired[key]) differences.push(key);
  }
  for (const key of ["includeDrafts", "includeAllVersions"]) {
    if (Boolean(existing[key]) !== desired[key]) differences.push(key);
  }
  if ([...(existing.rule?.on ?? [])].sort().join() !== [...desired.rule.on].sort().join()) differences.push("rule.on");
  for (const key of ["filter", "projection"]) {
    if (normalizedGroq(existing.rule?.[key]) !== normalizedGroq(desired.rule[key])) differences.push(`rule.${key}`);
  }
  // Never replace secrets or modify an existing hook's destination automatically.
  if (differences.length) return { action: "review", existing, differences };
  if (Boolean(existing.isDisabledByUser) !== desired.isDisabledByUser) return { action: "toggle", existing, differences: [] };
  return { action: "none", existing, differences: [] };
}

export async function applyWebhookPlan({ plan, desired, request }) {
  if (plan.action === "review") throw new Error(`Existing Atoll Guide hook differs in: ${plan.differences.join(", ")}. Review it in Sanity; no hook was changed.`);
  if (plan.action === "create") return request("", { method: "POST", body: JSON.stringify(desired) });
  if (plan.action === "toggle") {
    return request(`/${encodeURIComponent(plan.existing.id)}`, {
      method: "PATCH", body: JSON.stringify({ isDisabledByUser: desired.isDisabledByUser }),
    });
  }
  return plan.existing;
}

async function credentials() {
  const values = [];
  if (process.env.SANITY_WEBHOOK_TOKEN) values.push({ label: "SANITY_WEBHOOK_TOKEN", token: process.env.SANITY_WEBHOOK_TOKEN });
  const paths = [
    join(process.env.XDG_CONFIG_HOME || join(homedir(), ".config"), "sanity", "config.json"),
    join(homedir(), "Library", "Preferences", "sanity", "config.json"),
  ];
  for (const path of paths) {
    try {
      const config = JSON.parse(await readFile(path, "utf8"));
      if (config.authToken) values.push({ label: "Sanity CLI login", token: config.authToken });
    } catch { /* No saved CLI login at this location. */ }
  }
  if (process.env.SANITY_API_TOKEN) values.push({ label: "SANITY_API_TOKEN", token: process.env.SANITY_API_TOKEN });
  return values;
}

async function connect(projectId) {
  const base = `https://${projectId}.api.sanity.io/v${API_VERSION}/hooks/projects/${projectId}`;
  for (const credential of await credentials()) {
    const headers = { Authorization: `Bearer ${credential.token}`, "Content-Type": "application/json" };
    const response = await fetch(base, { headers, signal: AbortSignal.timeout(15000) });
    if ([401, 403].includes(response.status)) continue;
    if (!response.ok) throw new Error(`Sanity webhook listing returned HTTP ${response.status}.`);
    const hooks = await response.json();
    if (!Array.isArray(hooks)) throw new Error("Sanity returned an unexpected webhook-list response.");
    return {
      hooks,
      credential: credential.label,
      request: async (suffix, options = {}) => {
        const result = await fetch(`${base}${suffix}`, { ...options, headers, signal: AbortSignal.timeout(15000) });
        // API errors may contain request data: report only status, never a body or secret.
        if (!result.ok) throw new Error(`Sanity webhook ${options.method ?? "GET"} returned HTTP ${result.status}. Check webhook permissions and configuration in Sanity.`);
        return result.json();
      },
    };
  }
  throw new Error("No credential can read project webhooks. Run pnpm exec sanity login, or supply SANITY_WEBHOOK_TOKEN with project webhook permissions; a content-write token may lack them.");
}

export async function testEndpoint(url, secret, fetcher = fetch) {
  if (!secret) throw new Error("SANITY_REVALIDATE_SECRET is required for a signed endpoint check.");
  const require = createRequire(import.meta.url);
  const webhookRequire = createRequire(require.resolve("next-sanity/webhook"));
  const { encodeSignatureHeader, SIGNATURE_HEADER_NAME } = webhookRequire("@sanity/webhook");
  const results = [];
  for (const type of ["speciesGuide", "atollCategory", "atollHub"]) {
    const body = JSON.stringify({ _id: "atoll-webhook-verification", _type: type, category: "birds", slug: { current: "verification" } });
    const signature = await encodeSignatureHeader(body, Date.now(), secret.trim());
    const response = await fetcher(url, {
      method: "POST", redirect: "error", signal: AbortSignal.timeout(30000),
      headers: { "Content-Type": "application/json", [SIGNATURE_HEADER_NAME]: signature }, body,
    });
    const data = await response.json().catch(() => null);
    if (!response.ok || data?.revalidated !== true || data.type !== type) {
      throw new Error(`Signed ${type} endpoint check failed (HTTP ${response.status}). Verify the deployed handler, environment secret, and deployment access.`);
    }
    results.push({ type, status: response.status });
  }
  const rejected = await fetcher(url, {
    method: "POST", redirect: "error", signal: AbortSignal.timeout(15000),
    headers: { "Content-Type": "application/json", [SIGNATURE_HEADER_NAME]: "t=1,v1=invalid" },
    body: JSON.stringify({ _type: "speciesGuide" }),
  });
  if (rejected.status !== 401) throw new Error(`Invalid-signature endpoint check expected HTTP 401, received ${rejected.status}.`);
  return [...results, { type: "invalid signature", status: rejected.status }];
}

async function main() {
  const { values } = parseArgs({ options: {
    url: { type: "string" }, apply: { type: "boolean" }, check: { type: "boolean" },
    disabled: { type: "boolean" }, "test-endpoint": { type: "boolean" }, help: { type: "boolean" },
  } });
  if (values.help) {
    console.log("Usage: node scripts/setup-atoll-webhook.mjs --url https://NEW-SITE/api/revalidate [--check | --apply] [--disabled]\n       node scripts/setup-atoll-webhook.mjs --url http://localhost:3298/api/revalidate --test-endpoint\nDefault: read-only plan. --apply creates the dedicated hook or toggles its enabled state.\nEnabling requires a passing signed endpoint check. --disabled stages it without delivery.\nNo command changes other hooks, rotates secrets, provisions Vercel variables, or deploys.");
    return;
  }
  if (values.apply && values.check) throw new Error("Choose --apply or --check.");
  if (values["test-endpoint"] && (values.apply || values.check)) throw new Error("Run --test-endpoint separately from --apply/--check.");
  for (const path of [".env.local", ".env"]) {
    try { process.loadEnvFile(path); } catch (error) { if (error.code !== "ENOENT") throw error; }
  }
  const url = validateEndpoint(values.url || process.env.ATOLL_REVALIDATE_URL, Boolean(values["test-endpoint"]));
  const secret = process.env.SANITY_REVALIDATE_SECRET?.trim();
  if (values["test-endpoint"]) {
    console.log(JSON.stringify({ endpoint: url, checks: await testEndpoint(url, secret) }, null, 2));
    return;
  }
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_DATASET || "production";
  if (!projectId || !/^[a-z0-9-]+$/.test(projectId)) throw new Error("Set a valid NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_PROJECT_ID.");
  const desired = desiredWebhook({ url, dataset, secret, disabled: Boolean(values.disabled) });
  const connection = await connect(projectId);
  const plan = planWebhook(connection.hooks, desired);
  const report = {
    mode: values.apply ? "apply" : values.check ? "check" : "dry run",
    projectId, dataset, endpoint: url, credential: connection.credential,
    name: WEBHOOK_NAME, action: plan.action, differences: plan.differences,
    disabled: desired.isDisabledByUser, secretConfiguredLocally: Boolean(secret),
    otherHooksPreserved: connection.hooks.filter((hook) => hook.name !== WEBHOOK_NAME).length,
    rule: desired.rule,
  };
  if (values.apply) {
    if (!secret) throw new Error("SANITY_REVALIDATE_SECRET is required to create or activate the hook.");
    if (plan.action === "review") throw new Error(`Existing Atoll Guide hook differs in: ${plan.differences.join(", ")}. Review it in Sanity; no hook was changed.`);
    if (!desired.isDisabledByUser) report.endpointChecks = await testEndpoint(url, secret);
    const result = await applyWebhookPlan({ plan, desired, request: connection.request });
    report.hookId = result?.id;
    report.applied = plan.action !== "none";
  }
  if (values.check && plan.existing) {
    const attempts = await connection.request(`/${encodeURIComponent(plan.existing.id)}/attempts`);
    report.recentAttempts = (Array.isArray(attempts) ? attempts : []).slice(0, 10).map((attempt) => ({
      createdAt: attempt.createdAt, status: attempt.resultCode, failure: attempt.isFailure, inProgress: attempt.inProgress,
    }));
    report.disabledBySanity = Boolean(plan.existing.isDisabled && !plan.existing.isDisabledByUser);
  }
  console.log(JSON.stringify(report, null, 2));
  if (values.check && (plan.action !== "none" || report.disabledBySanity)) process.exitCode = 1;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
