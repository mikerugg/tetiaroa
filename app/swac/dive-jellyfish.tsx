"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { UNITS_PER_METRE } from "./dive-coordinates";

/*
 * A drift of bioluminescent jellyfish through the mesophotic, with bell
 * centres scattered from 300 to 375 metres.
 *
 * Built from deliberately sparse geometry: a faceted bell, five polygonal
 * oral arms, and triangular tentacles ending in glowing nodes. The silhouette
 * stays organic while the broad planes make the low-poly construction clear.
 *
 * Each part is baked into a single merged geometry and then instanced, so the
 * whole school is four geometry draw calls. A small pool of point lights
 * travels with the largest jellyfish to cast real cyan light onto nearby forms.
 */

export const JELLY_MIN_DEPTH = 300;
export const JELLY_MAX_DEPTH = 375;
export const JELLY_DEPTH = (JELLY_MIN_DEPTH + JELLY_MAX_DEPTH) / 2;

const COUNT = 14;
const DEPTH_EDGE_MARGIN = 2.5;
const TENTACLE_COUNT = 11;
const BELL_RADIUS = 0.7;
const BELL_SEGMENTS = 12;
const X_AXIS = new THREE.Vector3(1, 0, 0);

function seeded(seed: number) {
  let state = seed;
  return () => {
    state += 0x6d2b79f5;
    let value = Math.imul(state ^ (state >>> 15), 1 | state);
    value ^= value + Math.imul(value ^ (value >>> 7), 61 | value);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

/** A tiny triangle-soup builder. Unshared vertices keep every face crisp. */
function facets() {
  const positions: number[] = [];

  const addTriangle = (
    first: THREE.Vector3,
    second: THREE.Vector3,
    third: THREE.Vector3,
    inside?: THREE.Vector3,
  ) => {
    let b = second;
    let c = third;

    if (inside) {
      const centre = first.clone().add(second).add(third).multiplyScalar(1 / 3);
      const normal = second
        .clone()
        .sub(first)
        .cross(third.clone().sub(first));
      if (normal.dot(centre.sub(inside)) < 0) {
        b = third;
        c = second;
      }
    }

    positions.push(...first.toArray(), ...b.toArray(), ...c.toArray());
  };

  const addQuad = (
    a: THREE.Vector3,
    b: THREE.Vector3,
    c: THREE.Vector3,
    d: THREE.Vector3,
    inside?: THREE.Vector3,
  ) => {
    addTriangle(a, b, c, inside);
    addTriangle(b, d, c, inside);
  };

  const finish = () => {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(positions), 3),
    );
    geometry.computeVertexNormals();
    return geometry;
  };

  return { addTriangle, addQuad, finish };
}

type Facets = ReturnType<typeof facets>;

function ring(
  radius: number,
  y: number,
  segments: number,
  phase = 0,
  ripple = 0,
) {
  return Array.from({ length: segments }, (_, segment) => {
    const angle = (segment / segments) * Math.PI * 2 + phase;
    const edge = radius * (1 + Math.sin(segment * 2.73 + y * 9) * ripple);
    return new THREE.Vector3(
      Math.cos(angle) * edge,
      y + Math.sin(segment * 1.91) * ripple * 0.08,
      Math.sin(angle) * edge,
    );
  });
}

function connectRings(
  geometry: Facets,
  upper: readonly THREE.Vector3[],
  lower: readonly THREE.Vector3[],
  inside: THREE.Vector3,
) {
  for (let segment = 0; segment < upper.length; segment += 1) {
    const next = (segment + 1) % upper.length;
    geometry.addQuad(
      upper[segment],
      upper[next],
      lower[segment],
      lower[next],
      inside,
    );
  }
}

/** Adds a coarse tapered tube along a mostly vertical path. */
function appendTube(
  geometry: Facets,
  points: readonly THREE.Vector3[],
  radii: readonly number[],
  sides: number,
  phase: number,
) {
  const rings = points.map((point, pointIndex) =>
    ring(
      radii[pointIndex],
      point.y,
      sides,
      phase + pointIndex * 0.17,
    ).map((vertex) => {
      vertex.x += point.x;
      vertex.z += point.z;
      return vertex;
    }),
  );

  for (let pointIndex = 0; pointIndex < rings.length - 1; pointIndex += 1) {
    const centre = points[pointIndex]
      .clone()
      .add(points[pointIndex + 1])
      .multiplyScalar(0.5);
    connectRings(
      geometry,
      rings[pointIndex],
      rings[pointIndex + 1],
      centre,
    );
  }
}

function appendOctahedron(
  geometry: Facets,
  centre: THREE.Vector3,
  radius: number,
) {
  const top = centre.clone().add(new THREE.Vector3(0, radius, 0));
  const bottom = centre.clone().add(new THREE.Vector3(0, -radius, 0));
  const equator = [
    new THREE.Vector3(radius, 0, 0),
    new THREE.Vector3(0, 0, radius),
    new THREE.Vector3(-radius, 0, 0),
    new THREE.Vector3(0, 0, -radius),
  ].map((vertex) => vertex.add(centre));

  for (let side = 0; side < equator.length; side += 1) {
    const next = (side + 1) % equator.length;
    geometry.addTriangle(top, equator[side], equator[next], centre);
    geometry.addTriangle(bottom, equator[next], equator[side], centre);
  }
}

function buildBell(geometry: Facets) {
  const apex = new THREE.Vector3(0, 0.5, 0);
  const profiles = [
    ring(0.16, 0.46, BELL_SEGMENTS, 0, 0.025),
    ring(0.39, 0.34, BELL_SEGMENTS, 0, 0.025),
    ring(0.59, 0.17, BELL_SEGMENTS, 0, 0.025),
    ring(BELL_RADIUS, 0, BELL_SEGMENTS, 0, 0.025),
  ];
  const inside = new THREE.Vector3(0, -0.18, 0);

  for (let segment = 0; segment < BELL_SEGMENTS; segment += 1) {
    const next = (segment + 1) % BELL_SEGMENTS;
    geometry.addTriangle(
      apex,
      profiles[0][segment],
      profiles[0][next],
      inside,
    );
  }

  for (let profile = 0; profile < profiles.length - 1; profile += 1) {
    connectRings(
      geometry,
      profiles[profile],
      profiles[profile + 1],
      inside,
    );
  }
}

function buildUnderside(geometry: Facets) {
  const centre = new THREE.Vector3(0, 0.045, 0);
  const inner = ring(
    0.24,
    0.025,
    BELL_SEGMENTS,
    Math.PI / BELL_SEGMENTS,
  );
  const rim = ring(BELL_RADIUS * 0.96, -0.025, BELL_SEGMENTS, 0, 0.025);
  const above = new THREE.Vector3(0, 0.35, 0);

  for (let segment = 0; segment < BELL_SEGMENTS; segment += 1) {
    const next = (segment + 1) % BELL_SEGMENTS;
    geometry.addTriangle(
      centre,
      inner[next],
      inner[segment],
      above,
    );
  }
  connectRings(geometry, inner, rim, above);
}

function buildOralArms(geometry: Facets, random: () => number) {
  const arms = 5;

  for (let arm = 0; arm < arms; arm += 1) {
    const angle = (arm / arms) * Math.PI * 2 + 0.35;
    const length = 1.35 + random() * 0.45;
    const steps = 6;
    const startRadius = 0.13 + random() * 0.025;
    const points = Array.from({ length: steps }, (_, step) => {
      const t = step / (steps - 1);
      const curl = Math.sin(t * Math.PI * 1.4 + arm) * (0.035 + t * 0.08);
      const spread = 0.16 + t * 0.1;
      return new THREE.Vector3(
        Math.cos(angle) * spread + Math.cos(angle + Math.PI / 2) * curl,
        -0.04 - t * length,
        Math.sin(angle) * spread + Math.sin(angle + Math.PI / 2) * curl,
      );
    });
    const radii = points.map((_, step) =>
      THREE.MathUtils.lerp(startRadius, 0.035, step / (steps - 1)),
    );
    appendTube(geometry, points, radii, 5, angle);
  }
}

function buildTentacles(
  geometry: Facets,
  tips: Facets,
  random: () => number,
) {
  const tipPositions: THREE.Vector3[] = [];

  for (let strand = 0; strand < TENTACLE_COUNT; strand += 1) {
    const angle =
      (strand / TENTACLE_COUNT) * Math.PI * 2 +
      (random() - 0.5) * 0.18;
    const long = strand % 3 !== 0;
    const length = long ? 2.7 + random() * 1.35 : 0.9 + random() * 0.35;
    const steps = long ? 8 : 5;
    const startDistance = 0.48 + random() * 0.14;
    const bend = (random() - 0.5) * 0.26;
    const wave = 0.045 + random() * 0.07;
    const points = Array.from({ length: steps }, (_, step) => {
      const t = step / (steps - 1);
      const outward = startDistance + t * (0.12 + random() * 0.018);
      const cross = Math.sin(t * Math.PI * 2 + strand * 1.7) * wave;
      return new THREE.Vector3(
        Math.cos(angle) * outward +
          Math.cos(angle + Math.PI / 2) * cross +
          bend * t * t,
        -0.035 - t * length,
        Math.sin(angle) * outward +
          Math.sin(angle + Math.PI / 2) * cross -
          bend * 0.35 * t * t,
      );
    });
    const startWidth = long ? 0.026 : 0.036;
    const radii = points.map((_, step) =>
      THREE.MathUtils.lerp(startWidth, startWidth * 0.45, step / (steps - 1)),
    );
    appendTube(geometry, points, radii, 3, angle + Math.PI / 6);
    const tip = points[points.length - 1];
    const tipRadius = long ? 0.065 : 0.055;
    appendOctahedron(tips, tip, tipRadius);
    tipPositions.push(tip.clone());
  }

  return tipPositions;
}

function createGlowTexture() {
  const size = 48;
  const data = new Uint8Array(size * size * 4);

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const dx = (x + 0.5) / size - 0.5;
      const dy = (y + 0.5) / size - 0.5;
      const distance = Math.sqrt(dx * dx + dy * dy) * 2;
      const falloff = Math.pow(Math.max(0, 1 - distance), 2.4);
      const offset = (y * size + x) * 4;
      data[offset] = 255;
      data[offset + 1] = 255;
      data[offset + 2] = 255;
      data[offset + 3] = Math.round(falloff * 255);
    }
  }

  const texture = new THREE.DataTexture(
    data,
    size,
    size,
    THREE.RGBAFormat,
  );
  texture.needsUpdate = true;
  return texture;
}

function buildJellyfish() {
  const random = seeded(0x9e11);

  const shell = facets();
  const glow = facets();
  const trail = facets();
  const tips = facets();

  buildBell(shell);
  buildUnderside(glow);
  buildOralArms(glow, random);
  const tipPositions = buildTentacles(trail, tips, random);

  return {
    shell: shell.finish(),
    glow: glow.finish(),
    trail: trail.finish(),
    tips: tips.finish(),
    tipPositions,
  };
}

type Jelly = {
  home: THREE.Vector3;
  scale: number;
  pulsePhase: number;
  pulseRate: number;
  bobPhase: number;
  bobRate: number;
  bobAmplitude: number;
  driftPhaseX: number;
  driftPhaseZ: number;
  driftRate: number;
  driftAmplitude: number;
  swayPhaseX: number;
  swayPhaseZ: number;
  swayRate: number;
  swayAmplitude: number;
  yawPhase: number;
  yawRate: number;
  yawAmplitude: number;
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
  const tipGlowPointsRef = useRef<THREE.Points>(null);
  const tipLightRefs = useRef<Array<THREE.PointLight | null>>([]);

  const parts = useMemo(() => buildJellyfish(), []);

  const school = useMemo<Jelly[]>(() => {
    const random = seeded(0x1e11);
    const total = preview ? 1 : COUNT;

    return Array.from({ length: total }, (_, index) => {
      const bobAmplitude = 0.12 + random() * 0.12;
      // Stratification prevents a seeded random clump while leaving enough
      // room at either edge for the full bob to remain inside the layer.
      const depthSlot = (index + 0.1 + random() * 0.8) / total;
      const homeDepth =
        JELLY_MIN_DEPTH +
        DEPTH_EDGE_MARGIN +
        depthSlot *
          (JELLY_MAX_DEPTH - JELLY_MIN_DEPTH - DEPTH_EDGE_MARGIN * 2);

      return {
        home: preview
          ? new THREE.Vector3()
          : new THREE.Vector3(
              (random() - 0.5) * 15,
              (JELLY_DEPTH - homeDepth) * UNITS_PER_METRE,
              0.75 + random() * 2.25,
            ),
        scale: preview ? 1 : 0.32 + random() * 0.33,
        pulsePhase: random() * Math.PI * 2,
        pulseRate: 0.36 + random() * 0.32,
        bobPhase: random() * Math.PI * 2,
        bobRate: 0.13 + random() * 0.12,
        bobAmplitude,
        driftPhaseX: random() * Math.PI * 2,
        driftPhaseZ: random() * Math.PI * 2,
        driftRate: 0.045 + random() * 0.055,
        driftAmplitude: 0.25 + random() * 0.35,
        swayPhaseX: random() * Math.PI * 2,
        swayPhaseZ: random() * Math.PI * 2,
        swayRate: 0.18 + random() * 0.18,
        swayAmplitude: 0.035 + random() * 0.055,
        yawPhase: random() * Math.PI * 2,
        yawRate: 0.035 + random() * 0.04,
        yawAmplitude: 0.08 + random() * 0.17,
      };
    });
  }, [preview]);

  const litJellies = useMemo(() => {
    const candidates = school.map((jelly, index) => ({ index, jelly }));
    candidates.sort((a, b) => b.jelly.scale - a.jelly.scale);
    return candidates.slice(0, preview ? 1 : 4);
  }, [preview, school]);

  const tipGlowTexture = useMemo(() => createGlowTexture(), []);
  const tipGlowPointData = useMemo(
    () => new Float32Array(school.length * parts.tipPositions.length * 3),
    [parts.tipPositions.length, school.length],
  );
  useEffect(() => () => tipGlowTexture.dispose(), [tipGlowTexture]);

  const bellDummy = useMemo(() => new THREE.Object3D(), []);
  const trailDummy = useMemo(() => new THREE.Object3D(), []);
  const tipLightPosition = useMemo(() => new THREE.Vector3(), []);
  const tipGlowPosition = useMemo(() => new THREE.Vector3(), []);

  useFrame((state) => {
    const group = groupRef.current;
    const shell = shellRef.current;
    const glow = glowRef.current;
    const trail = trailRef.current;
    const tips = tipRef.current;
    const tipGlowPoints = tipGlowPointsRef.current;
    if (!group || !shell || !glow || !trail || !tips || !tipGlowPoints) {
      return;
    }
    const tipGlowAttribute = tipGlowPoints.geometry.getAttribute(
      "position",
    ) as THREE.BufferAttribute;
    const tipGlowPositions = tipGlowAttribute.array as Float32Array;

    if (!preview) {
      group.visible = Math.abs(depth.get() - JELLY_DEPTH) < 130;
      if (!group.visible) {
        return;
      }
      if (anchor) {
        group.position.copy(anchor);
      }
      if (axis) {
        group.quaternion.setFromUnitVectors(X_AXIS, axis);
      }
    }

    const time = state.clock.elapsedTime;

    school.forEach((jelly, index) => {
      const pulseAngle = time * jelly.pulseRate + jelly.pulsePhase;
      const pulse =
        Math.sin(pulseAngle) * 0.72 +
        Math.sin(pulseAngle * 2 - 0.8) * 0.28;
      const yaw =
        Math.sin(time * jelly.yawRate + jelly.yawPhase) * jelly.yawAmplitude;
      const x =
        jelly.home.x +
        Math.sin(time * jelly.driftRate + jelly.driftPhaseX) *
          jelly.driftAmplitude;
      const y =
        jelly.home.y +
        Math.sin(time * jelly.bobRate + jelly.bobPhase) * jelly.bobAmplitude;
      const z =
        jelly.home.z +
        Math.cos(time * jelly.driftRate * 0.73 + jelly.driftPhaseZ) *
          jelly.driftAmplitude *
          0.55;
      const swayX =
        Math.sin(time * jelly.swayRate + jelly.swayPhaseX) *
        jelly.swayAmplitude;
      const swayZ =
        Math.cos(time * jelly.swayRate * 0.83 + jelly.swayPhaseZ) *
        jelly.swayAmplitude;

      // The bell squashes and spreads as it pumps.
      bellDummy.position.set(x, y, z);
      bellDummy.rotation.set(swayX * 0.45, yaw, swayZ * 0.45);
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
      trailDummy.position.set(x, y, z);
      trailDummy.rotation.set(swayX * 1.45, yaw, swayZ * 1.45);
      trailDummy.scale.setScalar(jelly.scale);
      trailDummy.updateMatrix();
      trail.setMatrixAt(index, trailDummy.matrix);
      tips.setMatrixAt(index, trailDummy.matrix);

      parts.tipPositions.forEach((tip, tipIndex) => {
        tipGlowPosition.copy(tip).applyMatrix4(trailDummy.matrix);
        const offset =
          (index * parts.tipPositions.length + tipIndex) * 3;
        tipGlowPositions[offset] = tipGlowPosition.x;
        tipGlowPositions[offset + 1] = tipGlowPosition.y;
        tipGlowPositions[offset + 2] = tipGlowPosition.z;
      });

      const tipLight = tipLightRefs.current[index];
      if (tipLight) {
        // Long and short strands surround this centroid, so one local light
        // illuminates the full tip cluster without multiplying 154 lights.
        tipLightPosition.set(0, -2.55, 0).applyMatrix4(trailDummy.matrix);
        tipLight.position.copy(tipLightPosition);
        tipLight.distance = jelly.scale * 4;
        tipLight.intensity =
          (preview ? 6 : 5) * (0.88 + pulse * 0.12);
      }
    });

    shell.instanceMatrix.needsUpdate = true;
    glow.instanceMatrix.needsUpdate = true;
    trail.instanceMatrix.needsUpdate = true;
    tips.instanceMatrix.needsUpdate = true;
    tipGlowAttribute.needsUpdate = true;
  });

  const total = school.length;

  return (
    <group ref={groupRef}>
      {/* Faceted dome, lit mostly by its own faint glow */}
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

      {/* Underside membrane and polygonal oral arms: the bright core */}
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
          emissiveIntensity={0.35}
          roughness={0.35}
          transparent
          opacity={0.72}
          flatShading
          toneMapped={false}
        />
      </instancedMesh>

      {/* Brilliant cores at the tentacle ends. */}
      <instancedMesh
        ref={tipRef}
        args={[parts.tips, undefined, total]}
        frustumCulled={false}
      >
        <meshStandardMaterial
          color="#cdf6ff"
          emissive="#a6f2ff"
          emissiveIntensity={7}
          roughness={0.2}
          toneMapped={false}
        />
      </instancedMesh>

      {/* A soft point sprite visualises the falloff around each real source. */}
      <points ref={tipGlowPointsRef} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[tipGlowPointData, 3]}
            usage={THREE.DynamicDrawUsage}
          />
        </bufferGeometry>
        <pointsMaterial
          map={tipGlowTexture}
          color="#7af3ff"
          size={preview ? 0.52 : 0.38}
          sizeAttenuation
          transparent
          opacity={0.95}
          alphaTest={0.01}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </points>

      {litJellies.map(({ jelly, index }) => (
        <pointLight
          key={index}
          ref={(light) => {
            tipLightRefs.current[index] = light;
          }}
          color="#69efff"
          intensity={preview ? 6 : 5}
          distance={jelly.scale * 4}
          decay={2}
        />
      ))}
    </group>
  );
}
