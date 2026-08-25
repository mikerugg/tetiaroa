import * as THREE from "three";
import { MAX_DIVE_DEPTH } from "./swac-content";

/** One world unit is ten metres, which keeps the camera numbers sane. */
export const UNITS_PER_METRE = 0.1;

/** Where the reef shelf tips over into the wall. The lagoon ends here. */
export const SHELF_TOP_DEPTH = 22;

/** Seabed centreline at a given depth in metres. */
export function slopePoint(metres: number, target: THREE.Vector3) {
  const t = Math.min(1, Math.max(0, metres / MAX_DIVE_DEPTH));
  return target.set(
    2.6 + t * t * 15,
    -metres * UNITS_PER_METRE,
    -2.8 - t * t * 7,
  );
}

/** Horizontal direction along the reef face, perpendicular to its fall line. */
export function slopeAcross(metres: number, target: THREE.Vector3) {
  const a = slopePoint(Math.max(0, metres - 12), new THREE.Vector3());
  const b = slopePoint(
    Math.min(MAX_DIVE_DEPTH, metres + 12),
    new THREE.Vector3(),
  );
  const dx = b.x - a.x;
  const dz = b.z - a.z;
  const length = Math.hypot(dx, dz) || 1;
  return target.set(-dz / length, 0, dx / length);
}

export type ReefFrame = {
  origin: THREE.Vector3;
  across: THREE.Vector3;
  ocean: THREE.Vector3;
};

/** Stable local axes for paths that must remain seaward of the reef geometry. */
export function reefFrameAtDepth(metres: number): ReefFrame {
  const origin = slopePoint(metres, new THREE.Vector3());
  const across = slopeAcross(metres, new THREE.Vector3());
  const ocean = new THREE.Vector3(-across.z, 0, across.x);
  return { origin, across, ocean };
}
