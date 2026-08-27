"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useDepthBand } from "./dive-creature-geometry";
import {
  WHALE_MOUTH_CYCLE_SECONDS,
  whaleMouthAngleAtTime,
  whaleSwimFrameAtTime,
} from "./dive-whale-motion";

/*
 * Authored nose towards +Z. Object3D.lookAt aims a mesh's +Z at its target,
 * so the model can follow its swim tangent without a corrective rotation.
 */

export const WHALE_DEPTH = 550;

const WORLD_UP = new THREE.Vector3(0, 1, 0);
const WHALE_FACET_PALETTE = {
  top: ["#71859b", "#788ba0", "#697e94"],
  flank: ["#4a5f77", "#536881", "#5b7088"],
  belly: ["#304258", "#374b61", "#3e5268"],
} as const;

/** Gives a flat outline real thickness for fins, flukes, and the jaw. */
function slab(points: Array<[number, number, number]>, thickness: number) {
  const half = thickness / 2;
  const positions: number[] = [];
  const indices: number[] = [];
  const count = points.length;

  for (const [x, y, z] of points) {
    positions.push(x, y + half, z);
  }
  for (const [x, y, z] of points) {
    positions.push(x, y - half, z);
  }

  for (let index = 1; index < count - 1; index += 1) {
    // Top fan faces +Y; the bottom is the same fan reversed.
    indices.push(0, index, index + 1);
    indices.push(count, count + index + 1, count + index);
  }

  for (let index = 0; index < count; index += 1) {
    const next = (index + 1) % count;
    indices.push(
      index,
      count + index,
      next,
      next,
      count + index,
      count + next,
    );
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

type WhaleSection = {
  z: number;
  width: number;
  top: number;
  side: number;
  bottom: number;
  /** Half-width of the broad crown, as a fraction of the full section. */
  crown: number;
  /** Half-width of the flatter belly plane, as a fraction of the section. */
  keel: number;
};

const WHALE_BODY_SECTIONS: WhaleSection[] = [
  // A short, lifted peduncle keeps the body substantial almost to the flukes.
  { z: -1.5, width: 0.06, top: 0.1, side: 0.045, bottom: 0.015, crown: 0.28, keel: 0.24 },
  { z: -1.34, width: 0.102, top: 0.152, side: 0.04, bottom: -0.055, crown: 0.27, keel: 0.24 },
  { z: -1.1, width: 0.17, top: 0.225, side: 0.03, bottom: -0.132, crown: 0.3, keel: 0.27 },
  { z: -0.78, width: 0.235, top: 0.3, side: 0.02, bottom: -0.227, crown: 0.34, keel: 0.3 },
  { z: -0.42, width: 0.28, top: 0.335, side: 0.01, bottom: -0.272, crown: 0.38, keel: 0.32 },
  { z: -0.05, width: 0.32, top: 0.38, side: 0, bottom: -0.318, crown: 0.42, keel: 0.34 },
  { z: 0.27, width: 0.365, top: 0.43, side: -0.005, bottom: -0.355, crown: 0.46, keel: 0.37 },
  // The case is tall and broad, but its crown rises behind the blunt forehead.
  { z: 0.59, width: 0.4, top: 0.482, side: 0, bottom: -0.41, crown: 0.54, keel: 0.43 },
  { z: 0.94, width: 0.405, top: 0.498, side: 0.01, bottom: -0.423, crown: 0.59, keel: 0.47 },
  { z: 1.2, width: 0.4, top: 0.49, side: 0.015, bottom: -0.415, crown: 0.6, keel: 0.48 },
  { z: 1.42, width: 0.375, top: 0.43, side: 0.005, bottom: -0.38, crown: 0.58, keel: 0.46 },
  // A smaller terminal section bevels into a broad, genuinely blunt face.
  { z: 1.5, width: 0.335, top: 0.385, side: -0.01, bottom: -0.34, crown: 0.54, keel: 0.44 },
];

// A sperm whale's nose is blunt, not planar: the middle of the terminal ring
// sits just ahead of its crown and chin when seen in profile.
const FOREHEAD_PROFILE_OFFSETS = [
  0.025, -0.012, -0.012, 0.025, 0.01, -0.015, -0.015, 0.01,
] as const;

/**
 * Builds the whale from authored octagonal sections rather than circular
 * rings. That lets the crown, vertical flanks, belly, and tail stock carry
 * independent silhouettes while keeping the deliberately low polygon count.
 */
function whaleBodyGeometry(sections: WhaleSection[]) {
  const positions: number[] = [];
  const indices: number[] = [];
  const segments = 8;

  sections.forEach((section, sectionIndex) => {
    const lowerShoulder =
      section.side + (section.bottom - section.side) * 0.62;
    const profile = [
      [section.width, section.side],
      [section.width * section.crown, section.top],
      [-section.width * section.crown, section.top],
      [-section.width, section.side],
      [-section.width * 0.84, lowerShoulder],
      [-section.width * section.keel, section.bottom],
      [section.width * section.keel, section.bottom],
      [section.width * 0.84, lowerShoulder],
    ] as const;

    profile.forEach(([x, y], segment) => {
      const terminal =
        sectionIndex === 0 || sectionIndex === sections.length - 1;
      const jitter = terminal
        ? 0
        : (((sectionIndex * 5 + segment * 3) % 7) - 3) * 0.0055;
      const foreheadOffset =
        sectionIndex === sections.length - 1
          ? FOREHEAD_PROFILE_OFFSETS[segment]
          : 0;
      positions.push(x, y, section.z + foreheadOffset + jitter);
    });
  });

  for (let section = 0; section < sections.length - 1; section += 1) {
    for (let segment = 0; segment < segments; segment += 1) {
      const a = section * segments + segment;
      const b = section * segments + ((segment + 1) % segments);
      const c = (section + 1) * segments + segment;
      const d = (section + 1) * segments + ((segment + 1) % segments);

      if ((section * 5 + segment * 3) % 7 < 3) {
        indices.push(a, b, d, a, d, c);
      } else {
        indices.push(a, b, c, b, d, c);
      }
    }
  }

  // Peeling triangles alternately from each side closes the hidden tail cap.
  const capTriangles = [
    [0, 1, 7],
    [1, 6, 7],
    [1, 2, 6],
    [2, 5, 6],
    [2, 3, 5],
    [3, 4, 5],
  ] as const;

  for (const [a, b, c] of capTriangles) {
    indices.push(c, b, a);
  }

  // Three shallow interior ridges bow the forehead forward without collapsing
  // its broad face into either a flat cut or a pointed centre fan.
  const frontStart = (sections.length - 1) * segments;
  const frontZ = sections.at(-1)?.z ?? 0;
  const upperRidge = positions.length / 3;
  positions.push(0, 0.22, frontZ + 0.025);
  const middleRidge = positions.length / 3;
  positions.push(0, 0.01, frontZ + 0.04);
  const lowerRidge = positions.length / 3;
  positions.push(0, -0.19, frontZ + 0.025);

  for (let segment = 0; segment < 3; segment += 1) {
    indices.push(
      upperRidge,
      frontStart + segment,
      frontStart + segment + 1,
    );
  }
  for (let segment = 3; segment < 8; segment += 1) {
    indices.push(
      lowerRidge,
      frontStart + segment,
      frontStart + ((segment + 1) % segments),
    );
  }
  indices.push(
    middleRidge,
    upperRidge,
    frontStart + 3,
    middleRidge,
    frontStart,
    upperRidge,
    middleRidge,
    lowerRidge,
    frontStart,
    middleRidge,
    frontStart + 3,
    lowerRidge,
  );

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(new Float32Array(positions), 3),
  );
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

/** Adds restrained slate variation to the whale's broad triangular planes. */
function whaleFacets(geometry: THREE.BufferGeometry) {
  const faceted = geometry.toNonIndexed();
  geometry.dispose();
  faceted.computeVertexNormals();

  const position = faceted.getAttribute("position");
  const normal = faceted.getAttribute("normal");
  const colours: number[] = [];

  for (let vertex = 0; vertex < position.count; vertex += 3) {
    const normalY = normal.getY(vertex);
    const palette =
      normalY > 0.35
        ? WHALE_FACET_PALETTE.top
        : normalY < -0.35
          ? WHALE_FACET_PALETTE.belly
          : WHALE_FACET_PALETTE.flank;
    const triangle = vertex / 3;
    const patch = Math.floor(triangle / 2);
    const centreZ =
      (position.getZ(vertex) +
        position.getZ(vertex + 1) +
        position.getZ(vertex + 2)) /
      3;
    const colour = new THREE.Color(
      palette[(patch * 5 + Math.floor(Math.abs(centreZ) * 11)) % palette.length],
    );

    for (let corner = 0; corner < 3; corner += 1) {
      colours.push(colour.r, colour.g, colour.b);
    }
  }

  faceted.setAttribute(
    "color",
    new THREE.BufferAttribute(new Float32Array(colours), 3),
  );
  return faceted;
}

/** A six-sided almond lying in local XY with its outward face along +Z. */
function eyeSocketGeometry() {
  const outline = [
    [-0.04, 0],
    [-0.018, -0.015],
    [0.018, -0.013],
    [0.04, 0],
    [0.018, 0.013],
    [-0.018, 0.015],
  ] as const;
  // Lift the centre just enough for six distinct planes without turning the
  // eye into a spherical bead on the otherwise planar cheek.
  const positions = [0, 0, 0.003];
  const indices: number[] = [];

  outline.forEach(([x, y]) => positions.push(x, y, 0));
  outline.forEach((_, index) => {
    indices.push(0, index + 1, ((index + 1) % outline.length) + 1);
  });

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(new Float32Array(positions), 3),
  );
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

const EYE_TRANSFORMS = ([1, -1] as const).map((side) => {
  const normal = new THREE.Vector3(side * 0.956, -0.259, -0.139).normalize();
  const vertical = WORLD_UP.clone()
    .addScaledVector(normal, -WORLD_UP.dot(normal))
    .normalize();
  const foreAft = new THREE.Vector3()
    .crossVectors(vertical, normal)
    .normalize();
  const basis = new THREE.Matrix4().makeBasis(foreAft, vertical, normal);

  return {
    side,
    quaternion: new THREE.Quaternion().setFromRotationMatrix(basis),
  };
});

/**
 * Low-poly sperm whale with a blunt spermaceti case, underslung jaw, swept
 * hump, narrow pectorals, and articulated flukes.
 */
export function SpermWhale({
  depth,
  anchor,
  axis,
  /** Holds it still at the origin, for inspecting the shape in Model Lab. */
  preview = false,
}: {
  depth: { get: () => number };
  anchor?: THREE.Vector3;
  axis?: THREE.Vector3;
  preview?: boolean;
}) {
  const groupRef = useDepthBand(depth, WHALE_DEPTH, preview ? Infinity : 210);
  const swimRef = useRef<THREE.Group>(null);
  const jawRef = useRef<THREE.Group>(null);
  const flukeRef = useRef<THREE.Group>(null);
  const flipperRefs = useRef<Array<THREE.Group | null>>([]);
  const ahead = useMemo(() => new THREE.Vector3(), []);
  const swimAxis = useMemo(
    () => axis?.clone().normalize() ?? new THREE.Vector3(),
    [axis],
  );
  const outward = useMemo(
    () => new THREE.Vector3().crossVectors(swimAxis, WORLD_UP).normalize(),
    [swimAxis],
  );

  const body = useMemo(
    () => whaleFacets(whaleBodyGeometry(WHALE_BODY_SECTIONS)),
    [],
  );

  const jaw = useMemo(
    () =>
      // Authored as a side profile in X/Z, then stood into the sagittal plane.
      whaleFacets(
        slab(
          [
            [0, 0, 0],
            [-0.025, 0, 0],
            [-0.055, 0, 0.12],
            [-0.065, 0, 0.54],
            [-0.035, 0, 0.72],
            [-0.005, 0, 0.68],
          ],
          0.065,
        ),
      ),
    [],
  );

  const mouthInterior = useMemo(
    () =>
      slab(
        [
          [-0.003, 0, 0.02],
          [-0.018, 0, 0.1],
          [-0.055, 0, 0.58],
          [-0.025, 0, 0.7],
          [0, 0, 0.64],
        ],
        0.064,
      ),
    [],
  );

  const dorsalHump = useMemo(
    () =>
      slab(
        [
          [0, 0, 0.18],
          [0.045, 0, 0.03],
          [0.03, 0, -0.09],
          [0, 0, -0.16],
        ],
        0.042,
      ),
    [],
  );

  const flukeLobe = useMemo(
    () =>
      whaleFacets(
        slab(
          [
            [0.018, 0, 0.035],
            [0.08, 0.004, 0.018],
            [0.34, 0.012, -0.055],
            [0.4, 0.01, -0.105],
            [0.29, 0, -0.18],
            [0.08, -0.002, -0.135],
            [0.025, 0, -0.055],
          ],
          0.03,
        ),
      ),
    [],
  );

  const flipper = useMemo(
    () =>
      whaleFacets(
        slab(
          [
            [0, 0, 0.05],
            [0.065, -0.018, 0.04],
            [0.18, -0.08, -0.045],
            [0.245, -0.12, -0.13],
            [0.225, -0.12, -0.175],
            [0.145, -0.075, -0.16],
            [0.045, -0.012, -0.09],
            [0, 0, -0.055],
          ],
          0.022,
        ),
      ),
    [],
  );

  const eyeSocket = useMemo(() => eyeSocketGeometry(), []);

  useFrame((state) => {
    const swim = swimRef.current;
    if (!swim) {
      return;
    }
    const time = state.clock.elapsedTime;
    if (!preview && anchor && axis) {
      const frame = whaleSwimFrameAtTime(time);

      swim.position
        .copy(anchor)
        .addScaledVector(swimAxis, frame.along)
        .addScaledVector(outward, frame.outward)
        .setY(anchor.y + Math.sin(time * 0.22) * 0.7);
      ahead
        .copy(swim.position)
        .addScaledVector(swimAxis, frame.tangentAlong * 2)
        .addScaledVector(outward, frame.tangentOutward * 2);
      swim.lookAt(ahead);
    }

    if (flukeRef.current) {
      // Whales beat vertically, unlike everything else down here.
      flukeRef.current.rotation.x = preview
        ? 0.16
        : Math.sin(time * 0.85) * 0.18;
      // A slight bank keeps both compact lobes legible from the reference
      // angle; the live animal rolls them much more subtly as it cruises.
      flukeRef.current.rotation.z = preview
        ? 0.12
        : Math.sin(time * 0.16) * 0.06;
    }

    if (jawRef.current) {
      // Start the live scene partway through the opening stroke so the motion
      // reads immediately; Model Lab stays fixed for repeatable comparisons.
      jawRef.current.rotation.x = preview
        ? 0.12
        : whaleMouthAngleAtTime(time + WHALE_MOUTH_CYCLE_SECONDS * 0.6);
    }

    const trim = preview ? 0 : Math.sin(time * 0.5) * 0.15;
    const sweep = preview ? 0 : Math.cos(time * 0.37) * 0.07;
    flipperRefs.current.forEach((group, index) => {
      if (!group) {
        return;
      }
      const side = index === 0 ? 1 : -1;
      group.rotation.z = side * trim;
      group.rotation.x = sweep;
    });
  });

  return (
    <group ref={groupRef}>
      <group ref={swimRef} scale={2.5}>
        <mesh geometry={body}>
          <meshStandardMaterial vertexColors roughness={0.84} flatShading />
        </mesh>

        <group position={[0, -0.425, 0.48]}>
          <mesh
            geometry={mouthInterior}
            position={[0, 0.003, 0]}
            rotation={[0, 0, Math.PI / 2]}
          >
            <meshStandardMaterial
              color="#172333"
              roughness={0.94}
              side={THREE.DoubleSide}
              flatShading
            />
          </mesh>

          <group ref={jawRef} rotation={[0.12, 0, 0]}>
            <mesh geometry={jaw} rotation={[0, 0, Math.PI / 2]}>
              <meshStandardMaterial
                color="#60748b"
                roughness={0.84}
                flatShading
              />
            </mesh>

            {[1, -1].flatMap((side) =>
              Array.from({ length: 13 }, (_, index) => {
                const progress = index / 12;
                return (
                  <mesh
                    key={`${side}-${index}`}
                    position={[
                      side * 0.029,
                      -0.008 - progress * 0.022,
                      0.1 + progress * 0.52,
                    ]}
                  >
                    <coneGeometry args={[0.008, 0.03, 3]} />
                    <meshStandardMaterial
                      color="#c7ced0"
                      roughness={0.78}
                      flatShading
                    />
                  </mesh>
                );
              }),
            )}
          </group>
        </group>

        {EYE_TRANSFORMS.map(({ side, quaternion }) => (
          <group
            key={side}
            position={[side * 0.336, -0.232, 0.499]}
            quaternion={quaternion}
          >
            <mesh geometry={eyeSocket}>
              <meshStandardMaterial
                color="#60758b"
                emissive="#101b26"
                emissiveIntensity={0.14}
                roughness={0.88}
                flatShading
              />
            </mesh>
            <mesh position={[0, 0, 0.007]} scale={[0.011, 0.0075, 0.005]}>
              <octahedronGeometry args={[1, 0]} />
              <meshStandardMaterial
                color="#070c12"
                emissive="#162838"
                emissiveIntensity={0.18}
                roughness={0.28}
                flatShading
              />
            </mesh>
            <mesh position={[-0.003, 0.003, 0.0125]}>
              <circleGeometry args={[0.0025, 3]} />
              <meshBasicMaterial color="#9bb7c2" toneMapped={false} />
            </mesh>
          </group>
        ))}

        <mesh
          geometry={dorsalHump}
          position={[0, 0.335, -0.36]}
          rotation={[0, 0, Math.PI / 2]}
        >
          <meshStandardMaterial color="#687e98" roughness={0.88} flatShading />
        </mesh>

        {[1, -1].map((side, index) => (
          <group
            key={side}
            ref={(element) => {
              flipperRefs.current[index] = element;
            }}
            position={[side * 0.29, -0.17, 0.22]}
          >
            <mesh geometry={flipper} scale={[side, 1, 1]}>
              <meshStandardMaterial
                color="#5b7088"
                roughness={0.84}
                side={THREE.DoubleSide}
                flatShading
              />
            </mesh>
          </group>
        ))}

        <group ref={flukeRef} position={[0, 0.05, -1.49]}>
          {[1, -1].map((side) => (
            <mesh key={side} geometry={flukeLobe} scale={[side, 1, 1]}>
              <meshStandardMaterial
                vertexColors
                roughness={0.84}
                side={THREE.DoubleSide}
                flatShading
              />
            </mesh>
          ))}
        </group>
      </group>
    </group>
  );
}
