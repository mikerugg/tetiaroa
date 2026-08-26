"use client";

import {
  type RefObject,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
} from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export const SUBMERSIBLE_DEPTH = 175;

const MODEL_SCALE = 0.45;
const PREVIEW_LIFT = 0.34;
const VISIBILITY_BAND = 70;
const INSPECTION_TURN_START = 140;
const INSPECTION_TURN_END = 168;
const INSPECTION_RETURN_START = 205;
const INSPECTION_RETURN_END = 235;
const BOW_LIGHT_FADE_IN_START = 110;
const BOW_LIGHT_FADE_IN_END = 135;
const BOW_LIGHT_FADE_OUT_START = 225;
const BOW_LIGHT_FADE_OUT_END = 245;
const BOW_LIGHT_INTENSITY = 320;
const Y_AXIS = new THREE.Vector3(0, 1, 0);

type Point = [x: number, y: number, z: number];
type Beam = { start: Point; end: Point; radius: number };
type Bar = { start: Point; end: Point; thickness: number };
type HullSection = {
  z: number;
  y: number;
  radiusX: number;
  radiusY: number;
};
type TaperedProfilePoint = readonly [
  z: number,
  y: number,
  halfWidth: number,
];

const HULL_SECTIONS: readonly HullSection[] = [
  { z: 0.53, y: -0.01, radiusX: 0.29, radiusY: 0.4 },
  { z: 0.3, y: 0.035, radiusX: 0.37, radiusY: 0.49 },
  { z: -0.2, y: 0.015, radiusX: 0.4, radiusY: 0.49 },
  { z: -0.58, y: -0.045, radiusX: 0.37, radiusY: 0.415 },
  { z: -0.84, y: -0.075, radiusX: 0.265, radiusY: 0.32 },
];

// Side outline plus plan-view taper: the roof reads as a vehicle from above,
// rather than as the rectangular slab exposed by the first Model Lab pass.
const CANOPY_PROFILE: readonly TaperedProfilePoint[] = [
  [-0.5, 0.35, 0.2],
  [0.34, 0.36, 0.265],
  [0.55, 0.49, 0.25],
  [0.22, 0.65, 0.29],
  [-0.3, 0.63, 0.275],
  [-0.54, 0.47, 0.205],
];

const CANOPY_LIP_PROFILE: readonly TaperedProfilePoint[] = [
  [0.27, 0.355, 0.285],
  [0.56, 0.475, 0.265],
  [0.53, 0.515, 0.275],
  [0.25, 0.395, 0.3],
];

const SHOULDER_MOUNT_PROFILE = [
  [-0.68, -0.1],
  [-0.47, -0.06],
  [-0.08, -0.04],
  [0.08, 0.07],
  [0.015, 0.21],
  [-0.46, 0.205],
  [-0.72, 0.055],
] as const;

const SHOULDER_PROFILE = [
  [-0.53, -0.11],
  [-0.43, -0.075],
  [-0.35, 0.005],
  [-0.075, 0.02],
  [0.025, 0.09],
  [-0.035, 0.15],
  [-0.4, 0.145],
  [-0.57, 0.015],
] as const;

const LOWER_PANEL_PROFILE = [
  [-0.76, -0.32],
  [-0.18, -0.38],
  [0.2, -0.3],
  [0.3, -0.12],
  [-0.52, -0.105],
  [-0.77, -0.18],
] as const;

const DOME_BRACE_PROFILE = [
  [0.48, -0.27],
  [0.38, -0.45],
  [0.18, -0.49],
  [0.27, -0.35],
] as const;

const KEEL_PROFILE = [
  [-0.3, -0.39],
  [0.31, -0.39],
  [0.39, -0.46],
  [0.05, -0.51],
  [-0.27, -0.47],
] as const;

const FRAME_BEAMS: readonly Beam[] = [
  // Twin skids, crossmembers, and four chassis supports.
  { start: [-0.34, -0.66, -0.72], end: [-0.34, -0.66, 0.6], radius: 0.052 },
  { start: [0.34, -0.66, -0.72], end: [0.34, -0.66, 0.6], radius: 0.052 },
  { start: [-0.34, -0.66, 0.6], end: [-0.34, -0.54, 0.75], radius: 0.05 },
  { start: [0.34, -0.66, 0.6], end: [0.34, -0.54, 0.75], radius: 0.05 },
  { start: [-0.34, -0.66, -0.72], end: [-0.34, -0.55, -0.84], radius: 0.05 },
  { start: [0.34, -0.66, -0.72], end: [0.34, -0.55, -0.84], radius: 0.05 },
  { start: [-0.34, -0.66, -0.48], end: [0.34, -0.66, -0.48], radius: 0.04 },
  { start: [-0.34, -0.66, 0.42], end: [0.34, -0.66, 0.42], radius: 0.04 },
  { start: [-0.25, -0.35, -0.4], end: [-0.34, -0.66, -0.4], radius: 0.045 },
  { start: [0.25, -0.35, -0.4], end: [0.34, -0.66, -0.4], radius: 0.045 },
  { start: [-0.25, -0.38, 0.32], end: [-0.34, -0.66, 0.32], radius: 0.045 },
  { start: [0.25, -0.38, 0.32], end: [0.34, -0.66, 0.32], radius: 0.045 },
  // Bow-mounted floodlight stalks and their cross-car bridge.
  { start: [-0.16, 0.25, 0.38], end: [-0.16, 0.46, 0.7], radius: 0.04 },
  { start: [0.16, 0.25, 0.38], end: [0.16, 0.46, 0.7], radius: 0.04 },
  { start: [-0.16, 0.46, 0.7], end: [0.16, 0.46, 0.7], radius: 0.038 },
  // Short pylons connect the rear-facing ducts to the stern corners.
  { start: [-0.25, -0.06, -0.68], end: [-0.42, -0.08, -0.78], radius: 0.055 },
  { start: [0.25, -0.06, -0.68], end: [0.42, -0.08, -0.78], radius: 0.055 },
  // Thick two-link manipulator and open claw.
  { start: [-0.44, -0.14, 0.34], end: [-0.49, -0.34, 0.58], radius: 0.08 },
  { start: [-0.49, -0.34, 0.58], end: [-0.49, -0.54, 0.79], radius: 0.072 },
  { start: [-0.49, -0.54, 0.79], end: [-0.49, -0.58, 0.94], radius: 0.055 },
  { start: [-0.49, -0.58, 0.94], end: [-0.49, -0.43, 1.04], radius: 0.045 },
  { start: [-0.49, -0.43, 1.04], end: [-0.49, -0.49, 1.16], radius: 0.038 },
  { start: [-0.49, -0.58, 0.94], end: [-0.49, -0.73, 1.04], radius: 0.045 },
  { start: [-0.49, -0.73, 1.04], end: [-0.49, -0.67, 1.16], radius: 0.038 },
];

const ARM_JOINTS: readonly Point[] = [
  [-0.44, -0.14, 0.34],
  [-0.49, -0.34, 0.58],
  [-0.49, -0.54, 0.79],
  [-0.49, -0.58, 0.94],
];

// Geometry-only block lettering holds the reference's identity without a font
// request or texture at runtime.
const HONU_GUIDES: readonly Bar[] = [
  { start: [0, 0.22, 0.04], end: [0, 0.315, 0.04], thickness: 0.018 },
  { start: [0, 0.22, -0.04], end: [0, 0.315, -0.04], thickness: 0.018 },
  { start: [0, 0.2675, 0.04], end: [0, 0.2675, -0.04], thickness: 0.018 },
  { start: [0, 0.22, -0.09], end: [0, 0.315, -0.09], thickness: 0.018 },
  { start: [0, 0.22, -0.17], end: [0, 0.315, -0.17], thickness: 0.018 },
  { start: [0, 0.22, -0.09], end: [0, 0.22, -0.17], thickness: 0.018 },
  { start: [0, 0.315, -0.09], end: [0, 0.315, -0.17], thickness: 0.018 },
  { start: [0, 0.22, -0.22], end: [0, 0.315, -0.22], thickness: 0.018 },
  { start: [0, 0.22, -0.3], end: [0, 0.315, -0.3], thickness: 0.018 },
  { start: [0, 0.315, -0.22], end: [0, 0.22, -0.3], thickness: 0.018 },
  { start: [0, 0.24, -0.35], end: [0, 0.315, -0.35], thickness: 0.018 },
  { start: [0, 0.24, -0.43], end: [0, 0.315, -0.43], thickness: 0.018 },
  { start: [0, 0.22, -0.37], end: [0, 0.22, -0.41], thickness: 0.018 },
  { start: [0, 0.22, -0.35], end: [0, 0.24, -0.37], thickness: 0.018 },
  { start: [0, 0.22, -0.41], end: [0, 0.24, -0.43], thickness: 0.018 },
];

function starboardHullX(y: number, z: number) {
  let front = HULL_SECTIONS[0];
  let rear = HULL_SECTIONS.at(-1)!;

  for (let index = 0; index < HULL_SECTIONS.length - 1; index += 1) {
    const candidateFront = HULL_SECTIONS[index];
    const candidateRear = HULL_SECTIONS[index + 1];
    if (z <= candidateFront.z && z >= candidateRear.z) {
      front = candidateFront;
      rear = candidateRear;
      break;
    }
  }

  const span = front.z - rear.z;
  const progress = span === 0 ? 0 : THREE.MathUtils.clamp((front.z - z) / span, 0, 1);
  const centreY = THREE.MathUtils.lerp(front.y, rear.y, progress);
  const radiusX = THREE.MathUtils.lerp(front.radiusX, rear.radiusX, progress);
  const radiusY = THREE.MathUtils.lerp(front.radiusY, rear.radiusY, progress);
  const chamfer = Math.min(radiusX, radiusY) * 0.28;
  const upperSideY = centreY + radiusY - chamfer;
  const lowerSideY = centreY - radiusY + chamfer;
  const chamferInset =
    y > upperSideY
      ? y - upperSideY
      : y < lowerSideY
        ? lowerSideY - y
        : 0;

  return radiusX - THREE.MathUtils.clamp(chamferInset, 0, chamfer);
}

const HONU_BARS: readonly Bar[] = HONU_GUIDES.map(
  ({ start: [, startY, startZ], end: [, endY, endZ], thickness }) => ({
    start: [starboardHullX(startY, startZ) + 0.0035, startY, startZ],
    end: [starboardHullX(endY, endZ) + 0.0035, endY, endZ],
    thickness,
  }),
);

function createChamferedHull(sections: readonly HullSection[]) {
  const positions: number[] = [];
  const indices: number[] = [];
  const ringSize = 8;

  for (const { z, y, radiusX, radiusY } of sections) {
    const chamfer = Math.min(radiusX, radiusY) * 0.28;
    const ring = [
      [radiusX, y + radiusY - chamfer],
      [radiusX - chamfer, y + radiusY],
      [-radiusX + chamfer, y + radiusY],
      [-radiusX, y + radiusY - chamfer],
      [-radiusX, y - radiusY + chamfer],
      [-radiusX + chamfer, y - radiusY],
      [radiusX - chamfer, y - radiusY],
      [radiusX, y - radiusY + chamfer],
    ];
    for (const [x, ringY] of ring) {
      positions.push(x, ringY, z);
    }
  }

  for (let section = 0; section < sections.length - 1; section += 1) {
    const current = section * ringSize;
    const next = (section + 1) * ringSize;
    for (let edge = 0; edge < ringSize; edge += 1) {
      const following = (edge + 1) % ringSize;
      indices.push(current + edge, next + edge, current + following);
      indices.push(current + following, next + edge, next + following);
    }
  }

  const frontCentre = positions.length / 3;
  positions.push(0, sections[0].y, sections[0].z);
  const rearCentre = positions.length / 3;
  const rear = sections.at(-1)!;
  positions.push(0, rear.y, rear.z);
  const rearStart = (sections.length - 1) * ringSize;
  for (let edge = 0; edge < ringSize; edge += 1) {
    const following = (edge + 1) % ringSize;
    indices.push(frontCentre, edge, following);
    indices.push(rearCentre, rearStart + following, rearStart + edge);
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

function createTaperedPrism(profile: readonly TaperedProfilePoint[]) {
  const positions: number[] = [];
  const indices: number[] = [];
  const count = profile.length;

  for (const [z, y, halfWidth] of profile) {
    positions.push(halfWidth, y, z);
  }
  for (const [z, y, halfWidth] of profile) {
    positions.push(-halfWidth, y, z);
  }

  for (let index = 1; index < count - 1; index += 1) {
    indices.push(0, index + 1, index);
    indices.push(count, count + index, count + index + 1);
  }
  for (let index = 0; index < count; index += 1) {
    const next = (index + 1) % count;
    indices.push(index, next, count + index);
    indices.push(next, count + next, count + index);
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

function createSidePrism(
  profile: readonly (readonly [z: number, y: number])[],
  width: number,
) {
  return createTaperedPrism(
    profile.map(([z, y]) => [z, y, width / 2] as const),
  );
}

function segmentMatrix(start: Point, end: Point, thickness: number) {
  const from = new THREE.Vector3(...start);
  const to = new THREE.Vector3(...end);
  const direction = to.clone().sub(from);
  const midpoint = from.clone().add(to).multiplyScalar(0.5);
  const quaternion = new THREE.Quaternion().setFromUnitVectors(
    Y_AXIS,
    direction.clone().normalize(),
  );
  return new THREE.Matrix4().compose(
    midpoint,
    quaternion,
    new THREE.Vector3(thickness, direction.length(), thickness),
  );
}

function flatBarMatrix(start: Point, end: Point, thickness: number) {
  const from = new THREE.Vector3(...start);
  const to = new THREE.Vector3(...end);
  const direction = to.clone().sub(from);
  const lineAxis = direction.clone().normalize();
  const midpoint = from.clone().add(to).multiplyScalar(0.5);
  const surfaceNormal = new THREE.Vector3(1, 0, 0)
    .addScaledVector(lineAxis, -lineAxis.x)
    .normalize();
  const strokeAxis = new THREE.Vector3()
    .crossVectors(surfaceNormal, lineAxis)
    .normalize();
  const basis = new THREE.Matrix4().makeBasis(
    surfaceNormal,
    lineAxis,
    strokeAxis,
  );
  const quaternion = new THREE.Quaternion().setFromRotationMatrix(basis);

  return new THREE.Matrix4().compose(
    midpoint,
    quaternion,
    // Local X follows the tapered hull normal. At six millimetres in model
    // space the wordmark reads as paint/applique, not freestanding type.
    new THREE.Vector3(0.006, direction.length(), thickness),
  );
}

function InstancedBeams({ beams }: { beams: readonly Beam[] }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const matrices = useMemo(
    () =>
      beams.map(({ start, end, radius }) =>
        segmentMatrix(start, end, radius),
      ),
    [beams],
  );

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
        color="#12191d"
        roughness={0.72}
        metalness={0.42}
        flatShading
      />
    </instancedMesh>
  );
}

function InstancedBars({ bars }: { bars: readonly Bar[] }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const matrices = useMemo(
    () =>
      bars.map(({ start, end, thickness }) =>
        flatBarMatrix(start, end, thickness),
      ),
    [bars],
  );

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
      args={[undefined, undefined, bars.length]}
      frustumCulled={false}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color="#171d21"
        roughness={0.66}
        metalness={0.34}
        flatShading
      />
    </instancedMesh>
  );
}

function RearThruster({
  x,
  propellerRef,
}: {
  x: number;
  propellerRef: RefObject<THREE.Group | null>;
}) {
  return (
    <group position={[x, -0.08, -0.79]}>
      {/* Every cylinder is aligned to local Z: its open face points aft. */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.145, 0.145, 0.15, 10, 1, true]} />
        <meshStandardMaterial
          color="#efb316"
          roughness={0.48}
          metalness={0.24}
          flatShading
        />
      </mesh>
      <mesh position={[0, 0, -0.082]}>
        <torusGeometry args={[0.12, 0.025, 5, 10]} />
        <meshStandardMaterial
          color="#efb316"
          roughness={0.48}
          metalness={0.24}
          flatShading
        />
      </mesh>
      <mesh position={[0, 0, -0.02]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.108, 0.108, 0.12, 10]} />
        <meshStandardMaterial
          color="#10171b"
          roughness={0.65}
          metalness={0.38}
          flatShading
        />
      </mesh>
      <group ref={propellerRef} position={[0, 0, -0.11]}>
        {Array.from({ length: 7 }, (_, index) => {
          const angle = (index / 7) * Math.PI * 2;
          return (
            <group key={index} rotation={[0, 0, angle]}>
              <mesh position={[0, 0.05, 0]} rotation={[0, 0, 0.18]}>
                <boxGeometry args={[0.038, 0.09, 0.018]} />
                <meshStandardMaterial
                  color="#263137"
                  roughness={0.62}
                  metalness={0.42}
                  flatShading
                />
              </mesh>
            </group>
          );
        })}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.035, 8]} />
          <meshStandardMaterial
            color="#0d1418"
            roughness={0.58}
            metalness={0.46}
            flatShading
          />
        </mesh>
      </group>
    </group>
  );
}

function LowerTank({
  x,
  radius,
  bodyLength,
}: {
  x: number;
  radius: number;
  bodyLength: number;
}) {
  const capLength = radius * 0.72;
  const capOffset = bodyLength / 2 + capLength / 2;

  return (
    <group position={[x, -0.435, -0.25]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[radius, radius, bodyLength, 8]} />
        <meshStandardMaterial
          color="#c8cdca"
          roughness={0.68}
          metalness={0.18}
          flatShading
        />
      </mesh>
      <mesh
        position={[0, 0, capOffset]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <cylinderGeometry
          args={[radius * 0.63, radius, capLength, 8]}
        />
        <meshStandardMaterial
          color="#c8cdca"
          roughness={0.68}
          metalness={0.18}
          flatShading
        />
      </mesh>
      <mesh
        position={[0, 0, -capOffset]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <cylinderGeometry
          args={[radius, radius * 0.63, capLength, 8]}
        />
        <meshStandardMaterial
          color="#c8cdca"
          roughness={0.68}
          metalness={0.18}
          flatShading
        />
      </mesh>
      <mesh position={[0, 0, -bodyLength * 0.16]}>
        <torusGeometry args={[radius * 1.015, radius * 0.13, 5, 8]} />
        <meshStandardMaterial
          color="#182024"
          roughness={0.7}
          metalness={0.38}
          flatShading
        />
      </mesh>
    </group>
  );
}

function useSubmersibleGeometries() {
  const geometries = useMemo(
    () => ({
      canopy: createTaperedPrism(CANOPY_PROFILE),
      canopyLip: createTaperedPrism(CANOPY_LIP_PROFILE),
      hull: createChamferedHull(HULL_SECTIONS),
      keel: createSidePrism(KEEL_PROFILE, 0.44),
      lowerPanel: createSidePrism(LOWER_PANEL_PROFILE, 0.025),
      domeBrace: createSidePrism(DOME_BRACE_PROFILE, 0.055),
      shoulder: createSidePrism(SHOULDER_PROFILE, 0.055),
      shoulderMount: createSidePrism(SHOULDER_MOUNT_PROFILE, 0.065),
    }),
    [],
  );

  useEffect(
    () => () => {
      geometries.canopy.dispose();
      geometries.canopyLip.dispose();
      geometries.hull.dispose();
      geometries.keel.dispose();
      geometries.lowerPanel.dispose();
      geometries.domeBrace.dispose();
      geometries.shoulder.dispose();
      geometries.shoulderMount.dispose();
    },
    [geometries],
  );
  return geometries;
}

export function Submersible({
  depth,
  anchor,
  axis,
  inspectionTarget,
  preview = false,
}: {
  depth: { get: () => number };
  anchor?: THREE.Vector3;
  axis?: THREE.Vector3;
  inspectionTarget?: THREE.Vector3;
  preview?: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const portPropellerRef = useRef<THREE.Group>(null);
  const starboardPropellerRef = useRef<THREE.Group>(null);
  const portLightRef = useRef<THREE.SpotLight>(null);
  const starboardLightRef = useRef<THREE.SpotLight>(null);
  const lightTargetRef = useRef<THREE.Object3D>(null);
  const ahead = useMemo(() => new THREE.Vector3(), []);
  const orientationHelper = useMemo(() => new THREE.Object3D(), []);
  const restQuaternion = useMemo(() => new THREE.Quaternion(), []);
  const inspectionQuaternion = useMemo(() => new THREE.Quaternion(), []);
  const toeInQuaternion = useMemo(
    () => new THREE.Quaternion().setFromAxisAngle(Y_AXIS, 0.68),
    [],
  );
  const geometries = useSubmersibleGeometries();

  useLayoutEffect(() => {
    const target = lightTargetRef.current;
    if (!target) {
      return;
    }
    if (portLightRef.current) {
      portLightRef.current.target = target;
    }
    if (starboardLightRef.current) {
      starboardLightRef.current.target = target;
    }
  }, []);

  useFrame((state) => {
    const group = groupRef.current;
    if (!group) {
      return;
    }

    const time = state.clock.elapsedTime;
    const metres = depth.get();
    if (!preview) {
      group.visible =
        Math.abs(metres - SUBMERSIBLE_DEPTH) < VISIBILITY_BAND;
      if (!group.visible) {
        return;
      }
      if (anchor && axis) {
        group.position
          .copy(anchor)
          .addScaledVector(axis, Math.sin(time * 0.12) * 0.16);
        group.position.y = anchor.y + Math.sin(time * 0.42) * 0.035;
        ahead.copy(group.position).addScaledVector(axis, -1);

        // Start and finish in the reference's front-starboard 3/4 pose. As
        // the reader reaches the sub, pivot the local +Z bow toward the pipe;
        // the attached spotlights therefore sweep the wall before settling on
        // the inspection target. The depth envelope reverses cleanly when the
        // reader scrolls upward.
        orientationHelper.position.copy(group.position);
        orientationHelper.lookAt(ahead);
        restQuaternion
          .copy(orientationHelper.quaternion)
          .multiply(toeInQuaternion);

        const turnIn = THREE.MathUtils.smoothstep(
          metres,
          INSPECTION_TURN_START,
          INSPECTION_TURN_END,
        );
        const turnOut =
          1 -
          THREE.MathUtils.smoothstep(
            metres,
            INSPECTION_RETURN_START,
            INSPECTION_RETURN_END,
          );
        const inspection = Math.min(turnIn, turnOut);

        if (inspectionTarget) {
          orientationHelper.lookAt(inspectionTarget);
          inspectionQuaternion.copy(orientationHelper.quaternion);
          group.quaternion
            .copy(restQuaternion)
            .slerp(inspectionQuaternion, inspection);
          // A small live scan keeps the light pool moving across the pipe once
          // the main turn has completed.
          group.rotateY(Math.sin(time * 0.72) * 0.055 * inspection);
        } else {
          group.quaternion.copy(restQuaternion);
        }
        group.rotateZ(Math.sin(time * 0.31) * 0.025);
      }
    }

    const bowLightLevel = preview
      ? 0.45
      : THREE.MathUtils.smoothstep(
          metres,
          BOW_LIGHT_FADE_IN_START,
          BOW_LIGHT_FADE_IN_END,
        ) *
        (1 -
          THREE.MathUtils.smoothstep(
            metres,
            BOW_LIGHT_FADE_OUT_START,
            BOW_LIGHT_FADE_OUT_END,
          ));
    if (portLightRef.current) {
      portLightRef.current.intensity = BOW_LIGHT_INTENSITY * bowLightLevel;
    }
    if (starboardLightRef.current) {
      starboardLightRef.current.intensity =
        BOW_LIGHT_INTENSITY * bowLightLevel;
    }
    if (portPropellerRef.current) {
      portPropellerRef.current.rotation.z = time * 2.8;
    }
    if (starboardPropellerRef.current) {
      starboardPropellerRef.current.rotation.z = time * 2.8;
    }
  });

  return (
    <group
      ref={groupRef}
      position={[0, preview ? PREVIEW_LIFT : 0, 0]}
      scale={MODEL_SCALE}
    >
      <mesh geometry={geometries.hull}>
        <meshStandardMaterial
          color="#ebebe7"
          roughness={0.58}
          metalness={0.16}
          flatShading
        />
      </mesh>
      <mesh geometry={geometries.canopy}>
        <meshStandardMaterial
          color="#efb316"
          roughness={0.5}
          metalness={0.2}
          flatShading
        />
      </mesh>

      {/* The dark underside gives the roof a substantial forward overhang. */}
      <mesh geometry={geometries.canopyLip}>
        <meshStandardMaterial
          color="#242a2d"
          roughness={0.62}
          metalness={0.3}
          flatShading
        />
      </mesh>

      {/* A separate lower panel breaks up the reference's two-tone cabin. */}
      <mesh geometry={geometries.lowerPanel} position={[0.405, 0, 0]}>
        <meshStandardMaterial
          color="#c6cac7"
          roughness={0.66}
          metalness={0.15}
          flatShading
        />
      </mesh>

      {/* The viewport is centred on the bow and projects along local +Z. */}
      <mesh position={[0, -0.09, 0.51]} scale={[1, 1, 0.94]}>
        <icosahedronGeometry args={[0.4, 1]} />
        <meshStandardMaterial
          color="#315f69"
          emissive="#12343b"
          emissiveIntensity={0.1}
          roughness={0.28}
          metalness={0.08}
          flatShading
        />
      </mesh>
      <mesh position={[0, -0.09, 0.575]}>
        <torusGeometry args={[0.405, 0.052, 5, 12]} />
        <meshStandardMaterial
          color="#11181c"
          roughness={0.62}
          metalness={0.48}
          flatShading
        />
      </mesh>

      {/* Chunky collar feet tie the panoramic dome into the chassis. */}
      {[-0.35, 0.35].map((x) => (
        <mesh key={x} geometry={geometries.domeBrace} position={[x, 0, 0]}>
          <meshStandardMaterial
            color="#12191d"
            roughness={0.68}
            metalness={0.4}
            flatShading
          />
        </mesh>
      ))}

      {/* Broad white mount under the swept, downward-hooked yellow fairing. */}
      <mesh geometry={geometries.shoulderMount} position={[0.407, 0, 0]}>
        <meshStandardMaterial color="#f0f1ed" roughness={0.58} metalness={0.14} flatShading />
      </mesh>
      <mesh geometry={geometries.shoulder} position={[0.445, 0, 0]}>
        <meshStandardMaterial color="#efb316" roughness={0.5} metalness={0.2} flatShading />
      </mesh>
      <mesh position={[0.48, 0.1, -0.06]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.018, 0.018, 0.018, 8]} />
        <meshStandardMaterial color="#20272b" roughness={0.64} metalness={0.36} />
      </mesh>

      <mesh geometry={geometries.keel}>
        <meshStandardMaterial color="#e1a612" roughness={0.56} metalness={0.18} flatShading />
      </mesh>

      {/* A low tower integrated into the roof. */}
      <mesh position={[0, 0.63, -0.18]}>
        <cylinderGeometry args={[0.085, 0.1, 0.1, 6]} />
        <meshStandardMaterial color="#192126" roughness={0.6} metalness={0.4} flatShading />
      </mesh>
      <mesh position={[0, 0.7, -0.18]}>
        <cylinderGeometry args={[0.081, 0.086, 0.06, 6]} />
        <meshStandardMaterial
          color="#91ad32"
          emissive="#536d16"
          emissiveIntensity={0.45}
          roughness={0.5}
          flatShading
        />
      </mesh>
      <mesh position={[0, 0.82, -0.18]}>
        <coneGeometry args={[0.078, 0.16, 6]} />
        <meshStandardMaterial color="#171e22" roughness={0.62} metalness={0.38} flatShading />
      </mesh>

      {/* Two bow lights face local +Z and span the vehicle's width. */}
      {[-0.16, 0.16].map((x) => (
        <group key={x} position={[x, 0.46, 0.7]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.105, 0.105, 0.14, 8]} />
            <meshStandardMaterial color="#151c20" roughness={0.64} metalness={0.4} flatShading />
          </mesh>
          <mesh position={[0, 0, 0.08]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.095, 0.095, 0.04, 8]} />
            <meshStandardMaterial color="#efb316" roughness={0.48} metalness={0.24} flatShading />
          </mesh>
          <mesh position={[0, 0, 0.104]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.071, 0.071, 0.012, 8]} />
            <meshStandardMaterial
              color="#e6fff8"
              emissive="#b9fff2"
              emissiveIntensity={3.2}
              roughness={0.22}
              toneMapped={false}
              flatShading
            />
          </mesh>
        </group>
      ))}

      {/* Real, shadowless floods. A shared local +Z target makes both beams
          turn with the hull instead of gimbaling independently toward the pipe. */}
      <spotLight
        ref={portLightRef}
        position={[-0.16, 0.46, 0.815]}
        color="#c8fff2"
        intensity={0}
        distance={16}
        decay={1.7}
        angle={0.25}
        penumbra={0.62}
        castShadow={false}
      />
      <spotLight
        ref={starboardLightRef}
        position={[0.16, 0.46, 0.815]}
        color="#c8fff2"
        intensity={0}
        distance={16}
        decay={1.7}
        angle={0.25}
        penumbra={0.62}
        castShadow={false}
      />
      <object3D ref={lightTargetRef} position={[0, 0, 20]} />

      {/* Paired stern turbines both open toward local -Z. */}
      <RearThruster x={-0.42} propellerRef={portPropellerRef} />
      <RearThruster x={0.42} propellerRef={starboardPropellerRef} />

      {/* Two octagonal service ports remain on the starboard side. */}
      {[-0.38, -0.52].map((z) => (
        <group key={z} position={[0.42, -0.1, z]}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.057, 0.057, 0.035, 8]} />
            <meshStandardMaterial color="#151c20" roughness={0.64} metalness={0.4} flatShading />
          </mesh>
          <mesh position={[0.022, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.027, 0.027, 0.015, 8]} />
            <meshStandardMaterial
              color="#d7a216"
              emissive="#75530a"
              emissiveIntensity={0.35}
              flatShading
            />
          </mesh>
        </group>
      ))}

      {/* The near tank dominates the quarter view; its mate stays tucked inboard. */}
      <LowerTank x={0.42} radius={0.125} bodyLength={0.48} />
      <LowerTank x={-0.3} radius={0.1} bodyLength={0.4} />

      {ARM_JOINTS.map((position, index) => (
        <group key={index} position={position}>
          <mesh>
            <icosahedronGeometry args={[index === 0 ? 0.11 : 0.09, 0]} />
            <meshStandardMaterial color="#192126" roughness={0.65} metalness={0.42} flatShading />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[index === 0 ? 0.085 : 0.07, index === 0 ? 0.085 : 0.07, 0.075, 8]} />
            <meshStandardMaterial color="#2b3235" roughness={0.62} metalness={0.46} flatShading />
          </mesh>
        </group>
      ))}

      <InstancedBars bars={HONU_BARS} />
      <InstancedBeams beams={FRAME_BEAMS} />
    </group>
  );
}
