import * as THREE from 'three';

/**
 * Creates a connecting cylinder between two 3D vector points.
 */
export function createStrutBetween(
  p1: THREE.Vector3,
  p2: THREE.Vector3,
  radius: number
): THREE.BufferGeometry | null {
  const dir = new THREE.Vector3().subVectors(p2, p1);
  const length = dir.length();
  if (length < 0.001) return null;

  const geo = new THREE.CylinderGeometry(radius, radius, length, 16, 1, false);
  const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
  const quaternion = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    dir.clone().normalize()
  );

  const matrix = new THREE.Matrix4().compose(mid, quaternion, new THREE.Vector3(1, 1, 1));
  geo.applyMatrix4(matrix);
  return geo;
}

/**
 * Merges multiple BufferGeometries into a single BufferGeometry,
 * normalizing vertices and normals without memory leaks.
 * Disposes transient parts if disposeParts is true.
 */
export function mergeGeometries(
  geos: (THREE.BufferGeometry | null | undefined)[],
  disposeParts = true
): THREE.BufferGeometry | null {
  const validGeos = geos.filter((g): g is THREE.BufferGeometry => !!g);
  if (validGeos.length === 0) return null;

  const posArrays: Float32Array[] = [];
  const normArrays: Float32Array[] = [];
  let totalVertices = 0;
  const transientGeos: THREE.BufferGeometry[] = [];

  for (const rawGeo of validGeos) {
    if (!rawGeo.getAttribute('normal')) {
      rawGeo.computeVertexNormals();
    } else {
      rawGeo.normalizeNormals();
    }

    const geo = rawGeo.index ? rawGeo.toNonIndexed() : rawGeo.clone();
    transientGeos.push(geo);

    const pos = geo.getAttribute('position');
    const norm = geo.getAttribute('normal');

    if (pos && pos.count > 0 && norm && norm.count > 0) {
      posArrays.push(new Float32Array(pos.array));
      normArrays.push(new Float32Array(norm.array));
      totalVertices += pos.count;
    }
  }

  // Dispose transient extracted geometries to prevent memory leaks
  for (const tGeo of transientGeos) {
    tGeo.dispose();
  }

  // Also dispose raw input parts if requested
  if (disposeParts) {
    for (const rGeo of validGeos) {
      rGeo.dispose();
    }
  }

  if (totalVertices === 0) return null;

  const mergedPos = new Float32Array(totalVertices * 3);
  const mergedNorm = new Float32Array(totalVertices * 3);
  let offset = 0;

  for (let i = 0; i < posArrays.length; i++) {
    mergedPos.set(posArrays[i], offset);
    mergedNorm.set(normArrays[i], offset);
    offset += posArrays[i].length;
  }

  const merged = new THREE.BufferGeometry();
  merged.setAttribute('position', new THREE.BufferAttribute(mergedPos, 3));
  merged.setAttribute('normal', new THREE.BufferAttribute(mergedNorm, 3));
  return merged;
}
