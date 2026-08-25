"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";

type Point = readonly [x: number, y: number, z: number];
type Beam = {
  start: Point;
  end: Point;
  radius: number;
};

const Y_AXIS = new THREE.Vector3(0, 1, 0);
const FRAME_BASE_Y = -3.14;
const PREVIEW_LIFT = 3.23;

function circularPoint(radius: number, y: number, angle: number): Point {
  return [Math.cos(angle) * radius, y, Math.sin(angle) * radius];
}

const CAGE_BEAMS: readonly Beam[] = [
  ...Array.from({ length: 12 }, (_, index) => {
    const angle = (index / 12) * Math.PI * 2;
    return {
      start: circularPoint(1.04, -1.12, angle),
      end: circularPoint(0.82, -1.94, angle),
      radius: 0.035,
    };
  }),
  ...Array.from({ length: 6 }, (_, index) => {
    const angle = (index / 6) * Math.PI * 2;
    return {
      start: [0, -1.94, 0] as const,
      end: circularPoint(0.82, -1.94, angle),
      radius: 0.03,
    };
  }),
];

const FRAME_CORNERS = [
  [-1.82, FRAME_BASE_Y, -1.36],
  [1.82, FRAME_BASE_Y, -1.36],
  [1.82, FRAME_BASE_Y, 1.36],
  [-1.82, FRAME_BASE_Y, 1.36],
] as const satisfies readonly Point[];

const FRAME_BEAMS: readonly Beam[] = [
  ...FRAME_CORNERS.map((corner) => {
    const xSign = Math.sign(corner[0]);
    const zSign = Math.sign(corner[2]);
    return {
      start: [xSign * 0.72, -1.08, zSign * 0.72] as const,
      end: corner,
      radius: 0.085,
    };
  }),
  ...FRAME_CORNERS.map((corner, index) => ({
    start: corner,
    end: FRAME_CORNERS[(index + 1) % FRAME_CORNERS.length],
    radius: 0.09,
  })),
  {
    start: FRAME_CORNERS[0],
    end: FRAME_CORNERS[2],
    radius: 0.065,
  },
  {
    start: FRAME_CORNERS[1],
    end: FRAME_CORNERS[3],
    radius: 0.065,
  },
];

function beamMatrix({ start, end, radius }: Beam) {
  const from = new THREE.Vector3(...start);
  const to = new THREE.Vector3(...end);
  const direction = to.clone().sub(from);
  const length = direction.length();
  const midpoint = from.clone().add(to).multiplyScalar(0.5);
  const quaternion = new THREE.Quaternion().setFromUnitVectors(
    Y_AXIS,
    direction.normalize(),
  );

  return new THREE.Matrix4().compose(
    midpoint,
    quaternion,
    new THREE.Vector3(radius, length, radius),
  );
}

function InstancedBeams({
  beams,
  color,
  roughness,
  metalness,
}: {
  beams: readonly Beam[];
  color: string;
  roughness: number;
  metalness: number;
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const matrices = useMemo(() => beams.map(beamMatrix), [beams]);

  useLayoutEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) {
      return;
    }
    matrices.forEach((matrix, index) => mesh.setMatrixAt(index, matrix));
    mesh.instanceMatrix.needsUpdate = true;
  }, [matrices]);

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, beams.length]}
      frustumCulled={false}
    >
      <cylinderGeometry args={[1, 1, 1, 6]} />
      <meshStandardMaterial
        color={color}
        roughness={roughness}
        metalness={metalness}
        flatShading
      />
    </instancedMesh>
  );
}

/**
 * The local-origin model used by both the dive and Model Lab. Its connector is
 * centred at y=0; `preview` only lifts the skid frame onto the lab's ground grid.
 */
export function PipeIntake({ preview = false }: { preview?: boolean }) {
  return (
    <group position={[0, preview ? PREVIEW_LIFT : 0, 0]}>
      {/* Oversized coupling hides the slight angle where the slope pipe ends. */}
      <mesh position={[0, -0.12, 0]}>
        <cylinderGeometry args={[0.34, 0.34, 0.42, 12]} />
        <meshStandardMaterial
          color="#314e56"
          roughness={0.5}
          metalness={0.48}
          flatShading
        />
      </mesh>
      <mesh position={[0, -0.31, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.13, 12]} />
        <meshStandardMaterial
          color="#789097"
          roughness={0.42}
          metalness={0.62}
          flatShading
        />
      </mesh>

      {/* A correctly oriented bell: narrow at the pipe, broad at the mouth. */}
      <mesh position={[0, -0.72, 0]}>
        <cylinderGeometry args={[0.38, 1.08, 0.82, 12, 2, true]} />
        <meshStandardMaterial
          color="#25434b"
          roughness={0.56}
          metalness={0.38}
          side={THREE.DoubleSide}
          flatShading
        />
      </mesh>

      {/* The recessed inner cone gives the mouth depth instead of paper walls. */}
      <mesh position={[0, -0.76, 0]}>
        <cylinderGeometry args={[0.23, 0.73, 0.54, 12, 1, true]} />
        <meshStandardMaterial
          color="#071b22"
          roughness={0.82}
          metalness={0.18}
          side={THREE.DoubleSide}
          flatShading
        />
      </mesh>

      {/* Subtle working rim: visible at 900 m without becoming a neon hoop. */}
      <mesh position={[0, -1.13, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.08, 0.065, 6, 12]} />
        <meshStandardMaterial
          color="#6ca59f"
          emissive="#59e8dc"
          emissiveIntensity={0.24}
          roughness={0.4}
          metalness={0.58}
          flatShading
        />
      </mesh>

      {/* A basket screen: perimeter bars and a six-spoke lower guard. */}
      <InstancedBeams
        beams={CAGE_BEAMS}
        color="#769097"
        roughness={0.46}
        metalness={0.62}
      />
      <mesh position={[0, -1.95, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.82, 0.055, 6, 12]} />
        <meshStandardMaterial
          color="#607a81"
          roughness={0.5}
          metalness={0.6}
          flatShading
        />
      </mesh>
      <mesh position={[0, -1.95, 0]}>
        <cylinderGeometry args={[0.14, 0.14, 0.12, 8]} />
        <meshStandardMaterial
          color="#607a81"
          roughness={0.5}
          metalness={0.6}
          flatShading
        />
      </mesh>

      {/* Splayed truss and crossed skid frame rest directly on the seabed. */}
      <InstancedBeams
        beams={FRAME_BEAMS}
        color="#425d64"
        roughness={0.56}
        metalness={0.56}
      />
    </group>
  );
}
