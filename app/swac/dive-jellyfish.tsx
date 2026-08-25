"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/*
 * A drift of bioluminescent jellyfish through the mesophotic, scattered in
 * both position and depth around 250 m.
 *
 * Built from cubes rather than lofted surfaces. That is the defining feature
 * of the reference: a chunky voxel dome of dark navy blocks, a bright ragged
 * column of oral arms beneath it, and blocky tentacles ending in glowing
 * nodes. A smooth mesh cannot get there no matter how it is shaded.
 *
 * Each part is baked into a single merged geometry and then instanced, so the
 * whole school is four draw calls and only a handful of matrices move per
 * frame.
 */

export const JELLY_DEPTH = 250;

const COUNT = 14;
/** Edge length of one voxel, in world units. */
const CELL = 0.1;
/** Bell radius, in cells. */
const BELL_R = 7;
/** Bell dome height, in cells. */
const BELL_H = 4;

function seeded(seed: number) {
  let state = seed;
  return () => {
    state += 0x6d2b79f5;
    let value = Math.imul(state ^ (state >>> 15), 1 | state);
    value ^= value + Math.imul(value ^ (value >>> 7), 61 | value);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

/** Accumulates axis-aligned boxes into one geometry. */
function voxels() {
  const positions: number[] = [];
  const indices: number[] = [];

  const CORNERS: Array<[number, number, number]> = [
    [-1, -1, -1],
    [1, -1, -1],
    [1, 1, -1],
    [-1, 1, -1],
    [-1, -1, 1],
    [1, -1, 1],
    [1, 1, 1],
    [-1, 1, 1],
  ];
  // Outward-facing, verified per face rather than guessed.
  const FACES = [
    4, 5, 6, 4, 6, 7, // +z
    1, 0, 3, 1, 3, 2, // -z
    5, 1, 2, 5, 2, 6, // +x
    0, 4, 7, 0, 7, 3, // -x
    7, 6, 2, 7, 2, 3, // +y
    0, 1, 5, 0, 5, 4, // -y
  ];

  const add = (
    x: number,
    y: number,
    z: number,
    sx: number,
    sy = sx,
    sz = sx,
  ) => {
    const base = positions.length / 3;
    for (const [cx, cy, cz] of CORNERS) {
      positions.push(x + (cx * sx) / 2, y + (cy * sy) / 2, z + (cz * sz) / 2);
    }
    for (const index of FACES) {
      indices.push(base + index);
    }
  };

  const finish = () => {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(positions), 3),
    );
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    return geometry;
  };

  return { add, finish };
}

/** Walks the disc of cells the bell occupies. */
function overBell(visit: (i: number, j: number, distance: number) => void) {
  for (let i = -BELL_R; i <= BELL_R; i += 1) {
    for (let j = -BELL_R; j <= BELL_R; j += 1) {
      const distance = Math.hypot(i, j);
      if (distance > BELL_R + 0.35) {
        continue;
      }
      visit(i, j, distance);
    }
  }
}

function buildJellyfish() {
  const random = seeded(0x9e11);

  const shell = voxels();
  const glow = voxels();
  const trail = voxels();
  const tips = voxels();

  // --- Dome: a stepped shell of cubes, deliberately ragged at the crown ---
  overBell((i, j, distance) => {
    const top = Math.round(
      BELL_H * Math.sqrt(Math.max(0, 1 - (distance / BELL_R) ** 2)),
    );
    const from = Math.max(1, top - (random() < 0.5 ? 1 : 0));
    for (let k = from; k <= top; k += 1) {
      // A few blocks pushed proud, which is what makes it look built.
      const jut = random() < 0.12 ? CELL * 0.5 : 0;
      shell.add(i * CELL, k * CELL + jut, j * CELL, CELL);
    }
  });

  // --- Underside: the flat plate, and the brightest surface on the animal ---
  overBell((i, j) => {
    glow.add(i * CELL, 0, j * CELL, CELL);
  });

  // --- Oral arms: a ragged tapering column, brighter than the dome ---
  const columnDepth = 17;
  for (let level = 1; level <= columnDepth; level += 1) {
    const t = level / columnDepth;
    const radius = 3.4 * (1 - t) + 0.4;
    for (let i = -4; i <= 4; i += 1) {
      for (let j = -4; j <= 4; j += 1) {
        if (Math.hypot(i, j) > radius) {
          continue;
        }
        // Holes: the reference's column is broken up, not a solid cone.
        if (random() < 0.32) {
          continue;
        }
        glow.add(i * CELL, -level * CELL, j * CELL, CELL);
      }
    }
  }

  // --- Tentacles: blocky strands from the rim, some short, some very long ---
  const strands = 11;
  for (let s = 0; s < strands; s += 1) {
    const angle = (s / strands) * Math.PI * 2 + random() * 0.35;
    const ring = (BELL_R - 0.6 - random() * 2.2) * CELL;
    let x = Math.cos(angle) * ring;
    let z = Math.sin(angle) * ring;
    // A third of them stop just below the bell; the rest stream a long way.
    const long = s % 3 !== 0;
    const length = long ? 26 + Math.floor(random() * 16) : 7 + Math.floor(random() * 5);
    const width = CELL * (long ? 0.7 : 0.95);

    for (let k = 1; k <= length; k += 1) {
      // Wander, and drift outward as they fall.
      x += (random() - 0.5) * CELL * 0.55 + Math.cos(angle) * CELL * 0.06;
      z += (random() - 0.5) * CELL * 0.55 + Math.sin(angle) * CELL * 0.06;
      if (random() < 0.1) {
        continue;
      }
      trail.add(x, -k * CELL, z, width, CELL, width);
    }

    tips.add(x, -(length + 1) * CELL, z, CELL * 1.25);
  }

  return {
    shell: shell.finish(),
    glow: glow.finish(),
    trail: trail.finish(),
    tips: tips.finish(),
  };
}

type Jelly = {
  home: THREE.Vector3;
  scale: number;
  phase: number;
  pulseRate: number;
  driftRate: number;
  spin: number;
};

export function JellyfishSchool({
  depth,
  anchor,
  axis,
  preview = false,
}: {
  depth: { get: () => number };
  anchor?: THREE.Vector3;
  axis?: THREE.Vector3;
  preview?: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const shellRef = useRef<THREE.InstancedMesh>(null);
  const glowRef = useRef<THREE.InstancedMesh>(null);
  const trailRef = useRef<THREE.InstancedMesh>(null);
  const tipRef = useRef<THREE.InstancedMesh>(null);

  const parts = useMemo(() => buildJellyfish(), []);

  const school = useMemo<Jelly[]>(() => {
    const random = seeded(0x1e11);
    return Array.from({ length: preview ? 1 : COUNT }, () => ({
      home: new THREE.Vector3(
        (random() - 0.5) * 26,
        // Scattered through roughly 250 m plus or minus fifty.
        (random() - 0.5) * 10,
        (random() - 0.5) * 16,
      ),
      scale: 0.5 + random() * 0.75,
      phase: random() * Math.PI * 2,
      pulseRate: 0.45 + random() * 0.4,
      driftRate: 0.1 + random() * 0.12,
      spin: (random() - 0.5) * 0.25,
    }));
  }, [preview]);

  const bellDummy = useMemo(() => new THREE.Object3D(), []);
  const trailDummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    const group = groupRef.current;
    const shell = shellRef.current;
    const glow = glowRef.current;
    const trail = trailRef.current;
    const tips = tipRef.current;
    if (!group || !shell || !glow || !trail || !tips) {
      return;
    }

    if (!preview) {
      group.visible = Math.abs(depth.get() - JELLY_DEPTH) < 220;
      if (!group.visible) {
        return;
      }
      if (anchor) {
        group.position.copy(anchor);
      }
      if (axis) {
        group.quaternion.setFromUnitVectors(new THREE.Vector3(1, 0, 0), axis);
      }
    }

    const time = state.clock.elapsedTime;

    school.forEach((jelly, index) => {
      const pulse = Math.sin(time * jelly.pulseRate + jelly.phase);
      const yaw = time * jelly.spin;
      const x =
        jelly.home.x + Math.cos(time * jelly.driftRate * 0.7) * 0.5;
      const y =
        jelly.home.y +
        Math.sin(time * jelly.driftRate + jelly.phase) * 0.9;

      // The bell squashes and spreads as it pumps.
      bellDummy.position.set(x, y, jelly.home.z);
      bellDummy.rotation.set(0, yaw, 0);
      bellDummy.scale.set(
        jelly.scale * (1 - pulse * 0.1),
        jelly.scale * (1 + pulse * 0.16),
        jelly.scale * (1 - pulse * 0.1),
      );
      bellDummy.updateMatrix();
      shell.setMatrixAt(index, bellDummy.matrix);
      glow.setMatrixAt(index, bellDummy.matrix);

      // The trail keeps its length — squashing it with the bell would make
      // the tentacles concertina, which reads as rubber.
      trailDummy.position.set(x, y, jelly.home.z);
      trailDummy.rotation.set(
        Math.sin(time * 0.35 + jelly.phase) * 0.06,
        yaw,
        Math.cos(time * 0.29 + jelly.phase) * 0.06,
      );
      trailDummy.scale.setScalar(jelly.scale);
      trailDummy.updateMatrix();
      trail.setMatrixAt(index, trailDummy.matrix);
      tips.setMatrixAt(index, trailDummy.matrix);
    });

    shell.instanceMatrix.needsUpdate = true;
    glow.instanceMatrix.needsUpdate = true;
    trail.instanceMatrix.needsUpdate = true;
    tips.instanceMatrix.needsUpdate = true;
  });

  const total = school.length;

  return (
    <group ref={groupRef}>
      {/* Dome: dark navy blocks, lit mostly by their own faint glow */}
      <instancedMesh
        ref={shellRef}
        args={[parts.shell, undefined, total]}
        frustumCulled={false}
      >
        <meshStandardMaterial
          color="#0c2c47"
          emissive="#1f7fbe"
          emissiveIntensity={0.85}
          roughness={0.5}
          transparent
          opacity={0.9}
          flatShading
        />
      </instancedMesh>

      {/* Underside plate and oral column: the bright core */}
      <instancedMesh
        ref={glowRef}
        args={[parts.glow, undefined, total]}
        frustumCulled={false}
      >
        <meshStandardMaterial
          color="#0e4a68"
          emissive="#7fe6ff"
          emissiveIntensity={2.5}
          roughness={0.25}
          transparent
          opacity={0.85}
          flatShading
          toneMapped={false}
        />
      </instancedMesh>

      {/* Tentacles */}
      <instancedMesh
        ref={trailRef}
        args={[parts.trail, undefined, total]}
        frustumCulled={false}
      >
        <meshStandardMaterial
          color="#0b3348"
          emissive="#4cc9f0"
          emissiveIntensity={1.5}
          roughness={0.35}
          transparent
          opacity={0.72}
          flatShading
          toneMapped={false}
        />
      </instancedMesh>

      {/* Glowing nodes at the tentacle ends */}
      <instancedMesh
        ref={tipRef}
        args={[parts.tips, undefined, total]}
        frustumCulled={false}
      >
        <meshStandardMaterial
          color="#cdf6ff"
          emissive="#a6f2ff"
          emissiveIntensity={5}
          roughness={0.2}
          toneMapped={false}
        />
      </instancedMesh>
    </group>
  );
}
