import * as THREE from "three";

/**
 * Sculptural ÉPURE serum vessel.
 *
 * The body is a closed surface of revolution that is then gently twisted:
 * an elliptical section rotates through the belly, one side carries a soft
 * fullness, and the centreline leans before returning to a circular,
 * tooled neck and foot. The cap is a turned champagne-metal closure.
 */

export const VESSEL = {
  bodyHeight: 1.92,
  radialSegments: 128,
  heightSegments: 96,
  serumFill: 0.575,
  serumInset: 0.915,
  capOverlap: 0.058,
  punt: 0.04,
} as const;

const TWIST = 0.24;

function smoothstep(edge0: number, edge1: number, value: number) {
  const t = Math.min(1, Math.max(0, (value - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

/** One continuous teardrop: stable foot, full belly, long shoulder, tooled neck. */
function profileRadius(t: number) {
  const foot = smoothstep(0, 0.055, t);
  const base = 0.19 + foot * 0.062;
  const rise = Math.sin(Math.PI * Math.min(t / 0.72, 1));
  const belly = base + Math.pow(Math.max(rise, 0), 0.78) * 0.2;
  const neckBlend = smoothstep(0.58, 0.86, t);
  const lip = Math.exp(-((t - 0.962) ** 2) / 0.00028) * 0.012;
  const neck = 0.104 + lip;
  return belly * (1 - neckBlend) + neck * neckBlend;
}

function bodyMask(t: number) {
  return smoothstep(0.045, 0.16, t) * (1 - smoothstep(0.66, 0.84, t));
}

function centerline(t: number) {
  const mask = bodyMask(t);
  return {
    x: Math.sin(Math.PI * t) * 0.02 * mask,
    z: Math.sin(t * Math.PI * 0.85 + 0.4) * 0.008 * mask,
  };
}

function frameAt(t: number, theta: number, radiusScale: number) {
  const mask = bodyMask(t);
  const twist = TWIST * smoothstep(0.08, 0.8, t);
  const radius = profileRadius(t) * radiusScale;
  const flow = 1 + Math.cos(theta + 0.25) * 0.018 * mask;
  const ripple = 1 + Math.sin(theta * 2 + t * 7) * 0.0016 * mask;
  const rx = radius * (1 + 0.026 * mask) * flow * ripple;
  const rz = radius * (1 - 0.012 * mask) * flow * ripple;
  const lx = Math.cos(theta) * rx;
  const lz = Math.sin(theta) * rz;
  const cos = Math.cos(twist);
  const sin = Math.sin(twist);
  const center = centerline(t);
  return {
    x: center.x + lx * cos - lz * sin,
    y: t * VESSEL.bodyHeight,
    z: center.z + lx * sin + lz * cos,
  };
}

function toGeometry(
  positions: number[],
  uvs: number[],
  indices: number[],
) {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3),
  );
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function flipRange(
  geometry: THREE.BufferGeometry,
  indexStart: number,
  indexCount: number,
) {
  const index = geometry.getIndex();
  if (!index || indexCount <= 0) return;
  const array = index.array;
  for (let i = indexStart; i < indexStart + indexCount; i += 3) {
    const tmp = array[i + 1];
    array[i + 1] = array[i + 2];
    array[i + 2] = tmp;
  }
  index.needsUpdate = true;
}

/** Keep side normals pointing out of the vessel, then recompute. */
function orientSides(
  geometry: THREE.BufferGeometry,
  indexStart: number,
  indexCount: number,
) {
  const position = geometry.getAttribute("position");
  const normal = geometry.getAttribute("normal");
  const index = geometry.getIndex();
  if (!index) return;
  let outward = 0;
  let samples = 0;
  const array = index.array;
  const end = Math.min(indexStart + indexCount, array.length);
  for (let i = indexStart; i < end; i += 9) {
    const vertex = array[i];
    const nx = normal.getX(vertex);
    const nz = normal.getZ(vertex);
    if (nx * nx + nz * nz < 0.35) continue;
    outward += position.getX(vertex) * nx + position.getZ(vertex) * nz;
    samples += 1;
  }
  if (samples > 0 && outward < 0) {
    flipRange(geometry, indexStart, indexCount);
    geometry.computeVertexNormals();
  }
}

function orientAxis(
  geometry: THREE.BufferGeometry,
  indexStart: number,
  indexCount: number,
  sign: 1 | -1,
) {
  const normal = geometry.getAttribute("normal");
  const index = geometry.getIndex();
  if (!index || indexCount <= 0) return;
  const array = index.array;
  let accum = 0;
  const end = Math.min(indexStart + indexCount, array.length);
  for (let i = indexStart; i < end; i += 1) {
    accum += normal.getY(array[i]);
  }
  if (accum !== 0 && Math.sign(accum) !== sign) {
    flipRange(geometry, indexStart, indexCount);
    geometry.computeVertexNormals();
  }
}

function pushRing(
  positions: number[],
  uvs: number[],
  t: number,
  radiusScale: number,
  cols: number,
  yOffset = 0,
  radial = 1,
) {
  const start = positions.length / 3;
  for (let col = 0; col < cols; col += 1) {
    const theta = (col / cols) * Math.PI * 2;
    const point = frameAt(t, theta, radiusScale);
    const center = centerline(t);
    positions.push(
      center.x + (point.x - center.x) * radial,
      point.y + yOffset,
      center.z + (point.z - center.z) * radial,
    );
    uvs.push(col / cols, t);
  }
  return start;
}

function bridgeRings(
  indices: number[],
  innerStart: number,
  outerStart: number,
  cols: number,
  outward: boolean,
) {
  for (let col = 0; col < cols; col += 1) {
    const next = (col + 1) % cols;
    const a = innerStart + col;
    const b = outerStart + col;
    const c = innerStart + next;
    const d = outerStart + next;
    if (outward) indices.push(a, b, c, b, d, c);
    else indices.push(a, c, b, c, d, b);
  }
}

export function createVesselBodyGeometry() {
  const cols = VESSEL.radialSegments;
  const rows = VESSEL.heightSegments;
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  for (let row = 0; row <= rows; row += 1) {
    const t = row / rows;
    for (let col = 0; col < cols; col += 1) {
      const theta = (col / cols) * Math.PI * 2;
      const point = frameAt(t, theta, 1);
      positions.push(point.x, point.y, point.z);
      uvs.push(col / cols, t);
    }
  }

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const a = row * cols + col;
      const b = a + cols;
      const next = (col + 1) % cols;
      const d = row * cols + next;
      const c = d + cols;
      indices.push(a, b, d, b, c, d);
    }
  }
  const sideIndexCount = indices.length;

  const foot = pushRing(positions, uvs, 0, 1, cols);
  const mid = pushRing(positions, uvs, 0, 1, cols, VESSEL.punt * 0.45, 0.52);
  const hub = positions.length / 3;
  const center = centerline(0);
  positions.push(center.x, VESSEL.punt, center.z);
  uvs.push(0.5, 0);

  const bottomStart = indices.length;
  bridgeRings(indices, mid, foot, cols, false);
  for (let col = 0; col < cols; col += 1) {
    const next = (col + 1) % cols;
    indices.push(hub, mid + next, mid + col);
  }
  const bottomCount = indices.length - bottomStart;

  const lip = pushRing(positions, uvs, 1, 1, cols);
  const crown = positions.length / 3;
  const topCenter = centerline(1);
  positions.push(topCenter.x, VESSEL.bodyHeight, topCenter.z);
  uvs.push(0.5, 1);
  const topStart = indices.length;
  for (let col = 0; col < cols; col += 1) {
    const next = (col + 1) % cols;
    indices.push(lip + col, lip + next, crown);
  }
  const topCount = indices.length - topStart;

  const geometry = toGeometry(positions, uvs, indices);
  orientSides(geometry, 0, sideIndexCount);
  orientAxis(geometry, bottomStart, bottomCount, -1);
  orientAxis(geometry, topStart, topCount, 1);
  geometry.name = "epure-vessel-glass";
  return geometry;
}

export function createSerumGeometry() {
  const cols = VESSEL.radialSegments;
  const rows = 56;
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];
  const t0 = 0.02;
  const t1 = VESSEL.serumFill;

  for (let row = 0; row <= rows; row += 1) {
    const v = row / rows;
    const t = t0 + (t1 - t0) * v;
    for (let col = 0; col < cols; col += 1) {
      const point = frameAt(t, (col / cols) * Math.PI * 2, VESSEL.serumInset);
      positions.push(point.x, point.y, point.z);
      uvs.push(col / cols, v);
    }
  }

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const a = row * cols + col;
      const b = a + cols;
      const next = (col + 1) % cols;
      const d = row * cols + next;
      const c = d + cols;
      indices.push(a, b, d, b, c, d);
    }
  }

  const geometry = toGeometry(positions, uvs, indices);
  orientSides(geometry, 0, indices.length);
  geometry.name = "epure-serum";
  return geometry;
}

export function createMeniscusGeometry() {
  const cols = VESSEL.radialSegments;
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];
  const t = VESSEL.serumFill;
  const center = frameAt(t, 0, 0);
  positions.push(center.x, center.y + 0.014, center.z);
  uvs.push(0.5, 0.5);

  for (let col = 0; col < cols; col += 1) {
    const theta = (col / cols) * Math.PI * 2;
    const point = frameAt(t, theta, VESSEL.serumInset);
    positions.push(point.x, point.y + 0.001, point.z);
    uvs.push(0.5 + Math.cos(theta) * 0.5, 0.5 + Math.sin(theta) * 0.5);
  }

  for (let col = 0; col < cols; col += 1) {
    const next = (col + 1) % cols;
    indices.push(1 + col, 1 + next, 0);
  }

  const geometry = toGeometry(positions, uvs, indices);
  orientAxis(geometry, 0, indices.length, 1);
  geometry.name = "epure-meniscus";
  return geometry;
}

export function createCapGeometry() {
  const points: THREE.Vector2[] = [];
  const wallTop = 0.246;
  const radius = 0.132;
  const flange = 0.146;

  points.push(new THREE.Vector2(0, 0));
  points.push(new THREE.Vector2(flange, 0));
  points.push(new THREE.Vector2(flange, 0.014));
  points.push(new THREE.Vector2(radius, 0.03));

  const steps = 36;
  for (let i = 0; i <= steps; i += 1) {
    const y = 0.03 + (i / steps) * (wallTop - 0.03);
    const groove =
      0.0062 * Math.exp(-((y - 0.055) ** 2) / (2 * 0.007 ** 2)) +
      0.0054 * Math.exp(-((y - 0.188) ** 2) / (2 * 0.0065 ** 2));
    points.push(new THREE.Vector2(radius - groove, y));
  }

  const domeSteps = 14;
  const domeHeight = 0.032;
  for (let i = 1; i <= domeSteps; i += 1) {
    const u = i / domeSteps;
    const angle = u * Math.PI * 0.5;
    points.push(
      new THREE.Vector2(
        radius * Math.cos(angle),
        wallTop + domeHeight * Math.sin(angle),
      ),
    );
  }

  const geometry = new THREE.LatheGeometry(points, 96);
  geometry.computeVertexNormals();
  try {
    geometry.computeTangents();
  } catch {
    // Anisotropy degrades to an isotropic highlight if tangents are unavailable.
  }
  geometry.name = "epure-cap";
  return geometry;
}

export function createPlinthGeometry() {
  const points: THREE.Vector2[] = [];
  const radius = 0.68;
  const lip = 0.02;
  const depth = 0.05;
  points.push(new THREE.Vector2(0, 0));
  points.push(new THREE.Vector2(radius - lip, 0));
  const bevel = 8;
  for (let i = 0; i <= bevel; i += 1) {
    const angle = (i / bevel) * Math.PI * 0.5;
    points.push(
      new THREE.Vector2(
        radius - lip + Math.sin(angle) * lip,
        -(1 - Math.cos(angle)) * lip,
      ),
    );
  }
  points.push(new THREE.Vector2(radius * 0.9, -depth));
  points.push(new THREE.Vector2(0, -depth));
  const geometry = new THREE.LatheGeometry(points, 80);
  geometry.computeVertexNormals();
  geometry.name = "epure-plinth";
  return geometry;
}

/** Frosted wordmark, hugged to the front of the belly. */
export function createWordmarkGeometry() {
  const cols = 42;
  const rows = 14;
  const t0 = 0.41;
  const t1 = 0.53;
  const half = 0.5;
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];
  const stride = cols + 1;

  for (let row = 0; row <= rows; row += 1) {
    const v = row / rows;
    const t = t0 + (t1 - t0) * v;
    const center = centerline(t);
    for (let col = 0; col <= cols; col += 1) {
      const u = col / cols;
      const theta = Math.PI / 2 - half + u * half * 2;
      const point = frameAt(t, theta, 1);
      const ox = point.x - center.x;
      const oz = point.z - center.z;
      const length = Math.hypot(ox, oz) || 1;
      const lift = 0.0075;
      positions.push(
        point.x + (ox / length) * lift,
        point.y,
        point.z + (oz / length) * lift,
      );
      uvs.push(1 - u, v);
    }
  }

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const a = row * stride + col;
      const b = a + stride;
      const d = a + 1;
      const c = b + 1;
      indices.push(a, b, d, b, c, d);
    }
  }

  const geometry = toGeometry(positions, uvs, indices);
  orientSides(geometry, 0, indices.length);
  geometry.name = "epure-wordmark";
  return geometry;
}

export function inspectVessel() {
  const body = createVesselBodyGeometry();
  const cap = createCapGeometry();
  body.computeBoundingBox();
  cap.computeBoundingBox();
  const position = body.getAttribute("position");
  const normal = body.getAttribute("normal");
  let outward = 0;
  let samples = 0;
  let nan = 0;
  for (let i = 0; i < position.count; i += 1) {
    const x = position.getX(i);
    const y = position.getY(i);
    const z = position.getZ(i);
    if (!Number.isFinite(x + y + z)) nan += 1;
    if (i % 19 !== 0) continue;
    const nx = normal.getX(i);
    const nz = normal.getZ(i);
    if (nx * nx + nz * nz < 0.35) continue;
    outward += x * nx + z * nz;
    samples += 1;
  }
  const box = body.boundingBox;
  const capBox = cap.boundingBox;
  const summary = {
    vertices: position.count,
    triangles: (body.getIndex()?.count ?? 0) / 3,
    outward,
    samples,
    nan,
    minY: box?.min.y ?? 0,
    maxY: box?.max.y ?? 0,
    width: box ? box.max.x - box.min.x : 0,
    depth: box ? box.max.z - box.min.z : 0,
    capHeight: capBox ? capBox.max.y - capBox.min.y : 0,
  };
  body.dispose();
  cap.dispose();
  return summary;
}
