import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export type Ring = {
  z: number;
  r: number;
  yScale?: number;
  /** 0 is a circle, 1 is close to a rectangle. */
  square?: number;
  /** Lifts a ring off the centreline for an asymmetrical silhouette. */
  yOffset?: number;
};

/** Builds a faceted body along +Z from a series of authored cross-sections. */
export function loft(
  rings: Ring[],
  segments = 12,
  alternateDiagonals = false,
) {
  const positions: number[] = [];
  const indices: number[] = [];

  rings.forEach((ring) => {
    // Superellipse: exponent 1 is a circle, lower values square it off.
    const exponent = 1 - (ring.square ?? 0) * 0.72;
    for (let segment = 0; segment < segments; segment += 1) {
      const angle = (segment / segments) * Math.PI * 2;
      const cosine = Math.cos(angle);
      const sine = Math.sin(angle);
      positions.push(
        Math.sign(cosine) * Math.pow(Math.abs(cosine), exponent) * ring.r,
        Math.sign(sine) *
          Math.pow(Math.abs(sine), exponent) *
          ring.r *
          (ring.yScale ?? 1) +
          (ring.yOffset ?? 0),
        ring.z,
      );
    }
  });

  for (let ring = 0; ring < rings.length - 1; ring += 1) {
    for (let segment = 0; segment < segments; segment += 1) {
      const a = ring * segments + segment;
      const b = ring * segments + ((segment + 1) % segments);
      const c = (ring + 1) * segments + segment;
      const d = (ring + 1) * segments + ((segment + 1) % segments);

      if (alternateDiagonals && (ring + segment) % 2 === 0) {
        indices.push(a, b, d, a, d, c);
      } else {
        indices.push(a, b, c, b, d, c);
      }
    }
  }

  const front = positions.length / 3;
  const frontRing = rings[rings.length - 1];
  positions.push(0, frontRing.yOffset ?? 0, frontRing.z);
  const last = (rings.length - 1) * segments;
  for (let segment = 0; segment < segments; segment += 1) {
    indices.push(front, last + segment, last + ((segment + 1) % segments));
  }

  const back = positions.length / 3;
  positions.push(0, rings[0].yOffset ?? 0, rings[0].z);
  for (let segment = 0; segment < segments; segment += 1) {
    indices.push(back, (segment + 1) % segments, segment);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(new Float32Array(positions), 3),
  );
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

/** Shared by visibility and animation gates so their depth boundaries agree. */
export function isWithinDepthBand(
  value: number,
  centre: number,
  band: number,
) {
  return Math.abs(value - centre) < band;
}

/** Fades a creature in only while the camera is near its authored depth. */
export function useDepthBand(
  depth: { get: () => number },
  centre: number,
  band: number,
) {
  const ref = useRef<THREE.Group>(null);
  useFrame(() => {
    const group = ref.current;
    if (group) {
      group.visible = isWithinDepthBand(depth.get(), centre, band);
    }
  });
  return ref;
}
