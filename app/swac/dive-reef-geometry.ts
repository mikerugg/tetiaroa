import * as THREE from "three";

/*
 * Procedural reef geometry. Everything here is built once and reused through
 * InstancedMesh, so a coral can afford real structure — forking branches, a
 * lattice fan, a thick-walled barrel — instead of being a scaled primitive.
 *
 * Scaled cones and discs were the previous approach and they read as litter:
 * what makes a coral recognisable is branching and irregularity, neither of
 * which a cone has.
 */

type Buffers = { positions: number[]; indices: number[] };

function makeRandom(seed: number) {
  let state = seed;
  return () => {
    state += 0x6d2b79f5;
    let value = Math.imul(state ^ (state >>> 15), 1 | state);
    value ^= value + Math.imul(value ^ (value >>> 7), 61 | value);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function finish({ positions, indices }: Buffers) {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(new Float32Array(positions), 3),
  );
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

/** Appends a tapered tube between two points, in any orientation. */
function appendSegment(
  buffers: Buffers,
  from: THREE.Vector3,
  to: THREE.Vector3,
  radiusFrom: number,
  radiusTo: number,
  sides = 5,
) {
  const direction = new THREE.Vector3().subVectors(to, from);
  if (direction.lengthSq() === 0) {
    return;
  }
  direction.normalize();

  const reference =
    Math.abs(direction.y) > 0.9
      ? new THREE.Vector3(1, 0, 0)
      : new THREE.Vector3(0, 1, 0);
  const u = new THREE.Vector3().crossVectors(reference, direction).normalize();
  const v = new THREE.Vector3().crossVectors(direction, u).normalize();

  const base = buffers.positions.length / 3;

  for (const [origin, radius] of [
    [from, radiusFrom],
    [to, radiusTo],
  ] as const) {
    for (let i = 0; i < sides; i += 1) {
      const a = (i / sides) * Math.PI * 2;
      const cx = Math.cos(a);
      const cy = Math.sin(a);
      buffers.positions.push(
        origin.x + (u.x * cx + v.x * cy) * radius,
        origin.y + (u.y * cx + v.y * cy) * radius,
        origin.z + (u.z * cx + v.z * cy) * radius,
      );
    }
  }

  for (let i = 0; i < sides; i += 1) {
    const a0 = base + i;
    const a1 = base + ((i + 1) % sides);
    const b0 = base + sides + i;
    const b1 = base + sides + ((i + 1) % sides);
    // Outward winding. (a0, b0, a1) faces inward, which front-face culls the
    // near surface and lights the mesh from the inside.
    buffers.indices.push(a0, a1, b0, a1, b1, b0);
  }
}

/**
 * Staghorn. Grows upward, forking two or three ways and thinning as it goes —
 * the fork is the whole silhouette.
 */
export function createBranchingCoralGeometry(seed = 0x51a6) {
  const random = makeRandom(seed);
  const buffers: Buffers = { positions: [], indices: [] };

  const grow = (
    from: THREE.Vector3,
    direction: THREE.Vector3,
    length: number,
    radius: number,
    depth: number,
  ) => {
    const to = from.clone().addScaledVector(direction, length);
    appendSegment(buffers, from, to, radius, radius * 0.68, 5);
    if (depth <= 0) {
      return;
    }
    const forks = random() < 0.45 ? 3 : 2;
    for (let i = 0; i < forks; i += 1) {
      const next = direction.clone();
      const axis = new THREE.Vector3(
        random() - 0.5,
        random() * 0.25,
        random() - 0.5,
      ).normalize();
      next.applyAxisAngle(axis, 0.42 + random() * 0.5);
      // Keep a bias upward; coral grows towards the light, not sideways.
      next.y = Math.abs(next.y) * 0.55 + 0.55;
      next.normalize();
      grow(to, next, length * (0.62 + random() * 0.16), radius * 0.66, depth - 1);
    }
  };

  grow(new THREE.Vector3(), new THREE.Vector3(0, 1, 0), 0.36, 0.07, 3);
  return finish(buffers);
}

/**
 * Gorgonian sea fan: a lattice that forks in one plane. Rendered flat, because
 * a fan is a mesh you can see through, not a solid paddle.
 */
export function createSeaFanGeometry(seed = 0xfa2) {
  const random = makeRandom(seed);
  const buffers: Buffers = { positions: [], indices: [] };

  const grow = (
    from: THREE.Vector3,
    angle: number,
    length: number,
    width: number,
    depth: number,
  ) => {
    const to = new THREE.Vector3(
      from.x + Math.sin(angle) * length,
      from.y + Math.cos(angle) * length,
      0,
    );
    appendSegment(buffers, from, to, width, width * 0.74, 4);
    if (depth <= 0) {
      return;
    }
    for (const side of [-1, 1]) {
      grow(
        to,
        angle + side * (0.26 + random() * 0.22),
        length * (0.74 + random() * 0.12),
        width * 0.74,
        depth - 1,
      );
    }
  };

  grow(new THREE.Vector3(0, -0.5, 0), 0, 0.3, 0.028, 4);
  return finish(buffers);
}

/** Plate coral: a broad, faintly domed disc with a ragged rim, on a stub. */
export function createPlateCoralGeometry(seed = 0x91a7) {
  const random = makeRandom(seed);
  const buffers: Buffers = { positions: [], indices: [] };
  const rim = 18;

  buffers.positions.push(0, 0.1, 0);
  for (let i = 0; i < rim; i += 1) {
    const a = (i / rim) * Math.PI * 2;
    const radius = 0.78 + random() * 0.26;
    buffers.positions.push(
      Math.cos(a) * radius,
      -0.09 * radius * radius + (random() - 0.5) * 0.05,
      Math.sin(a) * radius,
    );
  }
  for (let i = 0; i < rim; i += 1) {
    buffers.indices.push(0, 1 + ((i + 1) % rim), 1 + i);
  }

  appendSegment(
    buffers,
    new THREE.Vector3(0, -0.3, 0),
    new THREE.Vector3(0, 0.06, 0),
    0.08,
    0.14,
    6,
  );
  return finish(buffers);
}

/** Brain coral: a hemisphere carrying meandering ridges. */
export function createMoundCoralGeometry(seed = 0xb3a1) {
  const random = makeRandom(seed);
  const buffers: Buffers = { positions: [], indices: [] };
  const cols = 18;
  const rows = 9;

  for (let r = 0; r <= rows; r += 1) {
    const phi = (r / rows) * (Math.PI / 2);
    for (let c = 0; c < cols; c += 1) {
      const theta = (c / cols) * Math.PI * 2;
      // Ridges: a fast sine over the surface, which is what reads as "brain".
      const ridge =
        1 + Math.sin(theta * 5 + phi * 6) * 0.07 + (random() - 0.5) * 0.02;
      buffers.positions.push(
        Math.cos(theta) * Math.cos(phi) * ridge,
        Math.sin(phi) * 0.72 * ridge,
        Math.sin(theta) * Math.cos(phi) * ridge,
      );
    }
  }

  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      const a = r * cols + c;
      const b = r * cols + ((c + 1) % cols);
      const d = (r + 1) * cols + c;
      const e = (r + 1) * cols + ((c + 1) % cols);
      buffers.indices.push(a, d, b, b, d, e);
    }
  }
  return finish(buffers);
}

/** Barrel sponge: thick walls and an open osculum, with an uneven rim. */
export function createBarrelSpongeGeometry(seed = 0x5a08) {
  const random = makeRandom(seed);
  const buffers: Buffers = { positions: [], indices: [] };
  const sides = 13;
  const jitter = Array.from({ length: sides }, () => 0.88 + random() * 0.24);

  const ring = (radius: number, y: number, scaleByJitter: boolean) => {
    const base = buffers.positions.length / 3;
    for (let i = 0; i < sides; i += 1) {
      const a = (i / sides) * Math.PI * 2;
      const r = radius * (scaleByJitter ? jitter[i] : 1);
      buffers.positions.push(Math.cos(a) * r, y, Math.sin(a) * r);
    }
    return base;
  };

  const outerBottom = ring(0.62, -0.5, false);
  const outerTop = ring(1, 0.5, true);
  const innerTop = ring(0.68, 0.44, true);
  const innerBottom = ring(0.4, -0.34, false);

  const stitch = (a: number, b: number, flip = false) => {
    for (let i = 0; i < sides; i += 1) {
      const a0 = a + i;
      const a1 = a + ((i + 1) % sides);
      const b0 = b + i;
      const b1 = b + ((i + 1) % sides);
      if (flip) {
        buffers.indices.push(a0, a1, b0, a1, b1, b0);
      } else {
        buffers.indices.push(a0, a1, b0, a1, b1, b0);
      }
    }
  };

  stitch(outerBottom, outerTop);
  stitch(outerTop, innerTop);
  stitch(innerTop, innerBottom, true);
  return finish(buffers);
}

/** Sea whip: a long, gently curved, tapering rod. */
export function createSeaWhipGeometry(seed = 0x77a5) {
  const random = makeRandom(seed);
  const buffers: Buffers = { positions: [], indices: [] };
  const steps = 7;
  const bend = (random() - 0.5) * 0.5;

  let previous = new THREE.Vector3(0, -0.5, 0);
  for (let i = 1; i <= steps; i += 1) {
    const t = i / steps;
    const next = new THREE.Vector3(
      Math.sin(t * Math.PI * 0.5) * bend,
      -0.5 + t,
      Math.sin(t * Math.PI * 0.4) * bend * 0.6,
    );
    appendSegment(buffers, previous, next, 0.06 * (1 - (t - 1 / steps) * 0.8), 0.06 * (1 - t * 0.8), 4);
    previous = next;
  }
  return finish(buffers);
}

/** A clump of algal blades, tapering and curving away from the rock. */
export function createAlgaeGeometry(seed = 0xa16a) {
  const random = makeRandom(seed);
  const buffers: Buffers = { positions: [], indices: [] };
  const blades = 5;
  const segments = 5;

  for (let b = 0; b < blades; b += 1) {
    const a = (b / blades) * Math.PI * 2 + random() * 0.6;
    const lean = 0.3 + random() * 0.45;
    const height = 0.7 + random() * 0.5;
    const base = buffers.positions.length / 3;

    for (let i = 0; i <= segments; i += 1) {
      const t = i / segments;
      const x = Math.cos(a) * lean * t * t;
      const z = Math.sin(a) * lean * t * t;
      const y = -0.5 + t * height;
      const halfWidth = 0.075 * Math.sin(Math.PI * Math.min(1, t * 1.2)) * (1 - t * 0.4);
      buffers.positions.push(
        x - Math.sin(a) * halfWidth,
        y,
        z + Math.cos(a) * halfWidth,
        x + Math.sin(a) * halfWidth,
        y,
        z - Math.cos(a) * halfWidth,
      );
    }

    for (let i = 0; i < segments; i += 1) {
      const p = base + i * 2;
      buffers.indices.push(p, p + 2, p + 1, p + 1, p + 2, p + 3);
    }
  }
  return finish(buffers);
}

/**
 * Starfish. The outline is built explicitly rather than from a polar function.
 *
 * A smooth radius like |cos(2.5t)| gives thin arms with sharp notches, which
 * reads as a snowflake. A starfish is the opposite: fat arms that keep most of
 * their width along their length, blunt rounded tips, and ROUNDED valleys
 * between them. So each arm is walked as a tapered lozenge with a semicircular
 * tip, and the gaps are filled with a disc arc rather than a point.
 */
export function createStarfishGeometry(seed = 0x57a4) {
  const random = makeRandom(seed);
  const buffers: Buffers = { positions: [], indices: [] };

  const arms = 5;
  const samples = 5;
  const tipArc = 5;
  const notchArc = 4;
  const baseRadius = 0.36;
  const tipRadius = 1;
  const baseHalfWidth = 0.31;
  const tipHalfWidth = 0.13;

  const rim: Array<[number, number]> = [];

  for (let i = 0; i < arms; i += 1) {
    const a = (i / arms) * Math.PI * 2;
    const next = ((i + 1) / arms) * Math.PI * 2;
    const ux = Math.cos(a);
    const uz = Math.sin(a);
    const vx = -Math.sin(a);
    const vz = Math.cos(a);
    const wobble = 0.95 + random() * 0.1;

    const side = (t: number, sign: number): [number, number] => {
      const r = (baseRadius + (tipRadius - baseRadius) * t) * wobble;
      const w = baseHalfWidth + (tipHalfWidth - baseHalfWidth) * t;
      return [ux * r + sign * vx * w, uz * r + sign * vz * w];
    };

    for (let sIndex = 0; sIndex <= samples; sIndex += 1) {
      rim.push(side(sIndex / samples, -1));
    }

    // Blunt, semicircular tip.
    const cx = ux * tipRadius * wobble;
    const cz = uz * tipRadius * wobble;
    for (let k = 1; k < tipArc; k += 1) {
      const phi = -Math.PI / 2 + (k / tipArc) * Math.PI;
      const alongArm = Math.cos(phi) * tipHalfWidth;
      const acrossArm = Math.sin(phi) * tipHalfWidth;
      rim.push([
        cx + ux * alongArm + vx * acrossArm,
        cz + uz * alongArm + vz * acrossArm,
      ]);
    }

    for (let sIndex = samples; sIndex >= 0; sIndex -= 1) {
      rim.push(side(sIndex / samples, 1));
    }

    // Rounded valley across to the next arm, instead of a sharp notch.
    const from = side(0, 1);
    const toX = Math.cos(next) * baseRadius - Math.sin(next) * -baseHalfWidth;
    const toZ = Math.sin(next) * baseRadius + Math.cos(next) * -baseHalfWidth;
    const fromAngle = Math.atan2(from[1], from[0]);
    let toAngle = Math.atan2(toZ, toX);
    while (toAngle < fromAngle) {
      toAngle += Math.PI * 2;
    }
    const notchRadius = Math.hypot(from[0], from[1]);
    for (let k = 1; k < notchArc; k += 1) {
      const angle = fromAngle + ((toAngle - fromAngle) * k) / notchArc;
      rim.push([Math.cos(angle) * notchRadius, Math.sin(angle) * notchRadius]);
    }
  }

  const count = rim.length;

  buffers.positions.push(0, 0.19, 0);
  for (const [x, z] of rim) {
    buffers.positions.push(x * 0.44, 0.14, z * 0.44);
  }
  for (const [x, z] of rim) {
    buffers.positions.push(x, 0.04, z);
  }

  const mid = 1;
  const outer = 1 + count;

  for (let i = 0; i < count; i += 1) {
    buffers.indices.push(0, mid + ((i + 1) % count), mid + i);
  }
  for (let i = 0; i < count; i += 1) {
    const a0 = mid + i;
    const a1 = mid + ((i + 1) % count);
    const b0 = outer + i;
    const b1 = outer + ((i + 1) % count);
    buffers.indices.push(a0, a1, b0, a1, b1, b0);
  }

  const underside = buffers.positions.length / 3;
  buffers.positions.push(0, -0.02, 0);
  for (let i = 0; i < count; i += 1) {
    buffers.indices.push(underside, outer + i, outer + ((i + 1) % count));
  }

  return finish(buffers);
}
