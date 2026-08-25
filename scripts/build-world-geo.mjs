/**
 * Turns the world-atlas TopoJSON into a small GeoJSON land mesh for the SWAC
 * globe. Run at build time, never in the browser: this keeps topojson-client
 * and the atlas itself out of the client bundle entirely.
 *
 *   node scripts/build-world-geo.mjs
 */
import { mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { feature } from "topojson-client";

const require = createRequire(import.meta.url);
const topology = require("world-atlas/land-110m.json");

const OUTPUT = path.join(process.cwd(), "public", "swac", "world.json");
/** Degrees of precision to keep. Three is ~100 m, far finer than a 34rem globe. */
const PRECISION = 2;

function roundCoordinates(node) {
  if (typeof node[0] === "number") {
    return node.map((value) => Number(value.toFixed(PRECISION)));
  }
  return node.map(roundCoordinates);
}

const land = feature(topology, topology.objects.land);

const trimmed = {
  type: "FeatureCollection",
  features: land.features.map((item) => ({
    type: "Feature",
    properties: {},
    geometry: {
      type: item.geometry.type,
      coordinates: roundCoordinates(item.geometry.coordinates),
    },
  })),
};

await mkdir(path.dirname(OUTPUT), { recursive: true });
await writeFile(OUTPUT, JSON.stringify(trimmed));

const bytes = JSON.stringify(trimmed).length;
console.log(
  `wrote ${OUTPUT} — ${trimmed.features.length} features, ${(bytes / 1024).toFixed(0)} kB`,
);
