import * as THREE from 'three';
import { MaterialData } from '@/store/useStore';

export interface AtomInstance {
  position: THREE.Vector3;
  element: string;
  color: string;
  radius: number;
}

export interface BondInstance {
  start: THREE.Vector3;
  end: THREE.Vector3;
  color: string;
}

/**
 * Spatial deduplication helper: removes duplicate atoms within a tiny tolerance threshold
 */
function deduplicateAtomsAndBonds(
  rawAtoms: AtomInstance[],
  rawBonds: BondInstance[]
): { atoms: AtomInstance[]; bonds: BondInstance[] } {
  const uniqueAtoms: AtomInstance[] = [];
  const atomRemap = new Map<number, number>();
  const tolSq = 0.0036; // ~0.06 Å distance threshold

  for (let i = 0; i < rawAtoms.length; i++) {
    const a = rawAtoms[i];
    let found = -1;
    for (let u = 0; u < uniqueAtoms.length; u++) {
      if (uniqueAtoms[u].position.distanceToSquared(a.position) < tolSq) {
        found = u;
        break;
      }
    }
    if (found === -1) {
      atomRemap.set(i, uniqueAtoms.length);
      uniqueAtoms.push(a);
    } else {
      atomRemap.set(i, found);
    }
  }

  // Deduplicate bonds using undirected edge set
  const uniqueBonds: BondInstance[] = [];
  const bondSet = new Set<string>();

  for (const b of rawBonds) {
    let uA = -1;
    let uB = -1;
    let minDA = tolSq;
    let minDB = tolSq;

    for (let u = 0; u < uniqueAtoms.length; u++) {
      const dA = uniqueAtoms[u].position.distanceToSquared(b.start);
      if (dA < minDA) {
        minDA = dA;
        uA = u;
      }
      const dB = uniqueAtoms[u].position.distanceToSquared(b.end);
      if (dB < minDB) {
        minDB = dB;
        uB = u;
      }
    }

    if (uA !== -1 && uB !== -1 && uA !== uB) {
      const key = uA < uB ? `${uA}-${uB}` : `${uB}-${uA}`;
      if (!bondSet.has(key)) {
        bondSet.add(key);
        uniqueBonds.push({
          start: uniqueAtoms[uA].position.clone(),
          end: uniqueAtoms[uB].position.clone(),
          color: b.color,
        });
      }
    }
  }

  return { atoms: uniqueAtoms, bonds: uniqueBonds };
}

/**
 * Universal Crystal Structure Generator for 26 Real-World Materials.
 * Generates authentic crystallographic lattices and molecular geometries matching VESTA / Materials Project standards.
 */
export function generateCrystalStructure(
  material: MaterialData,
  layerCount: 1 | 2 | 3 = 1
): {
  atoms: AtomInstance[];
  bonds: BondInstance[];
} {
  const { structure, molecularInfo } = material;
  const a = structure.latticeConstant || 3.5;
  const rx = structure.repeatX || 2;
  const ry = structure.repeatY || 2;
  const rz = layerCount; // Dynamic structural layer count (1, 2, 3)

  let result: { atoms: AtomInstance[]; bonds: BondInstance[] };

  switch (structure.type) {
    case 'cnt':
      result = generateCarbonNanotube(a, rx, ry, layerCount, molecularInfo);
      break;
    case 'buckyball':
      result = generateBuckyballC60(a, layerCount, molecularInfo);
      break;
    case 'perovskite':
      result = generatePerovskite(a, rx, ry, rz, molecularInfo);
      break;
    case 'aerogel':
      result = generateAerogel(a, rx, ry, layerCount, molecularInfo);
      break;
    case 'nitinol':
      result = generateNitinolB2(a, rx, ry, rz, molecularInfo);
      break;
    case 'diamond':
      result = generateDiamond(a, rx, ry, rz, molecularInfo);
      break;
    case 'graphene':
      result = generateGraphite(a, Math.max(3, rx), Math.max(3, ry), layerCount, molecularInfo);
      break;
    case 'nacl':
      result = generateNaCl(a, rx, ry, rz, molecularInfo);
      break;
    case 'silica':
      result =
        material.id === 'glass'
          ? generateGlassAmorphous(a, rx, ry, layerCount, molecularInfo)
          : generateQuartz(a, rx, ry, rz, molecularInfo);
      break;
    case 'mxene':
      result = generateMXene(a, rx, ry, layerCount, molecularInfo);
      break;
    case 'ice':
      result = generateIce(a, rx, ry, rz, molecularInfo);
      break;
    case 'kevlar':
      result = generateKevlar(a, rx, ry, layerCount, molecularInfo);
      break;
    case 'fcc':
      result = generateFCC(a, rx, ry, rz, molecularInfo);
      break;
    case 'bcc':
      result = generateBCC(a, rx, ry, rz, molecularInfo);
      break;
    case 'steel':
      result = generateSteel(a, rx, ry, rz, molecularInfo);
      break;
    case 'stainless-steel':
      result = generateStainlessSteel(a, rx, ry, rz, molecularInfo);
      break;
    case 'duralumin':
      result = generateDuralumin(a, rx, ry, rz, molecularInfo);
      break;
    case 'tungsten-carbide':
      result = generateTungstenCarbide(a, rx, ry, rz, molecularInfo);
      break;
    case 'hcp':
      result = generateHCP(a, rx, ry, rz, molecularInfo);
      break;
    case 'teflon':
      result = generateTeflon(a, rx, ry, layerCount, molecularInfo);
      break;
    case 'battery':
      result = generateBatteryLCO(a, rx, ry, rz, molecularInfo);
      break;
    case 'corundum':
      result = generateAlumina(a, rx, ry, rz, molecularInfo);
      break;
    case 'polymer-rubber':
      result = generateVulcanizedRubber(a, rx, ry, layerCount, molecularInfo);
      break;
    default:
      result = generateDiamond(a, rx, ry, rz, molecularInfo);
      break;
  }

  // Deduplicate shared boundaries
  const deduped = deduplicateAtomsAndBonds(result.atoms, result.bonds);

  // Normalize, Center & Scale with VESTA/Materials Project standard ball-and-stick proportions
  if (deduped.atoms.length > 0) {
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;
    let minZ = Infinity, maxZ = -Infinity;

    for (let i = 0; i < deduped.atoms.length; i++) {
      const p = deduped.atoms[i].position;
      if (p.x < minX) minX = p.x;
      if (p.x > maxX) maxX = p.x;
      if (p.y < minY) minY = p.y;
      if (p.y > maxY) maxY = p.y;
      if (p.z < minZ) minZ = p.z;
      if (p.z > maxZ) maxZ = p.z;
    }

    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;
    const centerZ = (minZ + maxZ) / 2;

    const spanX = maxX - minX;
    const spanY = maxY - minY;
    const spanZ = maxZ - minZ;
    const maxSpan = Math.max(spanX, spanY, spanZ, 0.4);

    // Target visual span in Three.js viewport
    const targetSpan = 3.6;
    const scale = targetSpan / maxSpan;

    for (let i = 0; i < deduped.atoms.length; i++) {
      const atom = deduped.atoms[i];
      atom.position.x = (atom.position.x - centerX) * scale;
      atom.position.y = (atom.position.y - centerY) * scale;
      atom.position.z = (atom.position.z - centerZ) * scale;
      // Preserve relative element sizes, scaled nicely for ball-and-stick
      const r = atom.radius || 0.35;
      atom.radius = Math.max(0.08, Math.min(0.24, r * scale * 0.42));
    }

    for (let i = 0; i < deduped.bonds.length; i++) {
      const bond = deduped.bonds[i];
      bond.start.x = (bond.start.x - centerX) * scale;
      bond.start.y = (bond.start.y - centerY) * scale;
      bond.start.z = (bond.start.z - centerZ) * scale;
      bond.end.x = (bond.end.x - centerX) * scale;
      bond.end.y = (bond.end.y - centerY) * scale;
      bond.end.z = (bond.end.z - centerZ) * scale;
    }
  }

  return deduped;
}

// ── 1. Kim Cương & Silic (Mạng lập phương Kim Cương Diamond Cubic Fd-3m) ──────
function generateDiamond(
  a: number,
  rx: number,
  ry: number,
  rz: number,
  info: MaterialData['molecularInfo']
): { atoms: AtomInstance[]; bonds: BondInstance[] } {
  const atoms: AtomInstance[] = [];
  const bonds: BondInstance[] = [];
  const atomType = info.atomTypes[0];
  const bondColor = info.bonds.color;

  // Generate with boundary closure to ensure complete interlocking cyclohexane chair rings
  for (let ix = 0; ix <= rx; ix++) {
    for (let iy = 0; iy <= ry; iy++) {
      for (let iz = 0; iz <= rz; iz++) {
        // Primary FCC lattice corners
        atoms.push({
          position: new THREE.Vector3(ix * a, iy * a, iz * a),
          element: atomType.element,
          color: atomType.color,
          radius: atomType.radius,
        });

        // Face centers
        if (ix < rx && iy < ry) {
          atoms.push({
            position: new THREE.Vector3((ix + 0.5) * a, (iy + 0.5) * a, iz * a),
            element: atomType.element,
            color: atomType.color,
            radius: atomType.radius,
          });
        }
        if (ix < rx && iz < rz) {
          atoms.push({
            position: new THREE.Vector3((ix + 0.5) * a, iy * a, (iz + 0.5) * a),
            element: atomType.element,
            color: atomType.color,
            radius: atomType.radius,
          });
        }
        if (iy < ry && iz < rz) {
          atoms.push({
            position: new THREE.Vector3(ix * a, (iy + 0.5) * a, (iz + 0.5) * a),
            element: atomType.element,
            color: atomType.color,
            radius: atomType.radius,
          });
        }

        // Sublattice tetrahedrally shifted atoms (inside cell)
        if (ix < rx && iy < ry && iz < rz) {
          const origin = new THREE.Vector3(ix * a, iy * a, iz * a);
          const sub1 = origin.clone().add(new THREE.Vector3(0.25, 0.25, 0.25).multiplyScalar(a));
          const sub2 = origin.clone().add(new THREE.Vector3(0.75, 0.75, 0.25).multiplyScalar(a));
          const sub3 = origin.clone().add(new THREE.Vector3(0.75, 0.25, 0.75).multiplyScalar(a));
          const sub4 = origin.clone().add(new THREE.Vector3(0.25, 0.75, 0.75).multiplyScalar(a));
          atoms.push({ position: sub1, element: atomType.element, color: atomType.color, radius: atomType.radius });
          atoms.push({ position: sub2, element: atomType.element, color: atomType.color, radius: atomType.radius });
          atoms.push({ position: sub3, element: atomType.element, color: atomType.color, radius: atomType.radius });
          atoms.push({ position: sub4, element: atomType.element, color: atomType.color, radius: atomType.radius });
        }
      }
    }
  }

  // Connect nearest tetrahedral neighbors (d = a * sqrt(3) / 4)
  const dTetra = (a * Math.sqrt(3)) / 4;
  const cutoff = dTetra * 1.15;
  for (let i = 0; i < atoms.length; i++) {
    for (let j = i + 1; j < atoms.length; j++) {
      const dist = atoms[i].position.distanceTo(atoms[j].position);
      if (dist > 0.05 && dist < cutoff) {
        bonds.push({
          start: atoms[i].position.clone(),
          end: atoms[j].position.clone(),
          color: bondColor,
        });
      }
    }
  }

  return { atoms, bonds };
}

// ── 2. Than Chì & Graphene (Mạng tổ ong lục giác 2D nhiều tầng) ───────────────
function generateGraphite(
  a: number,
  rx: number,
  ry: number,
  layers: number,
  info: MaterialData['molecularInfo']
): { atoms: AtomInstance[]; bonds: BondInstance[] } {
  const atoms: AtomInstance[] = [];
  const bonds: BondInstance[] = [];
  const atomType = info.atomTypes[0];
  const bondColor = info.bonds.color;
  const dCC = a / Math.sqrt(3);

  const a1 = new THREE.Vector3(a, 0, 0);
  const a2 = new THREE.Vector3(a / 2, 0, (a * Math.sqrt(3)) / 2);
  const b1 = new THREE.Vector3(0, 0, 0);
  const b2 = new THREE.Vector3(a / 2, 0, a / (2 * Math.sqrt(3)));
  const layerGap = 3.35;

  for (let l = 0; l < layers; l++) {
    const yOff = (l - (layers - 1) / 2) * layerGap;
    const stackOffset = l % 2 === 1 ? new THREE.Vector3(0, 0, dCC) : new THREE.Vector3(0, 0, 0);
    const startIdx = atoms.length;

    for (let i = 0; i < rx; i++) {
      for (let j = 0; j < ry; j++) {
        const origin = new THREE.Vector3()
          .addScaledVector(a1, i)
          .addScaledVector(a2, j)
          .add(stackOffset);

        atoms.push({
          position: new THREE.Vector3(origin.x + b1.x, yOff, origin.z + b1.z),
          element: 'C',
          color: atomType.color,
          radius: atomType.radius,
        });

        atoms.push({
          position: new THREE.Vector3(origin.x + b2.x, yOff, origin.z + b2.z),
          element: 'C',
          color: atomType.color,
          radius: atomType.radius,
        });
      }
    }

    const endIdx = atoms.length;
    const cutoff = dCC * 1.18;
    for (let m = startIdx; m < endIdx; m++) {
      for (let n = m + 1; n < endIdx; n++) {
        if (atoms[m].position.distanceTo(atoms[n].position) < cutoff) {
          bonds.push({
            start: atoms[m].position.clone(),
            end: atoms[n].position.clone(),
            color: bondColor,
          });
        }
      }
    }
  }

  return { atoms, bonds };
}

// ── 3. Muối Ăn Tinh Khiết (NaCl - Mạng Lập phương tâm diện đá muối Rocksalt) ──
function generateNaCl(
  a: number,
  rx: number,
  ry: number,
  rz: number,
  info: MaterialData['molecularInfo']
): { atoms: AtomInstance[]; bonds: BondInstance[] } {
  const atoms: AtomInstance[] = [];
  const bonds: BondInstance[] = [];
  const naType = info.atomTypes.find((t) => t.element === 'Na') || info.atomTypes[0];
  const clType = info.atomTypes.find((t) => t.element === 'Cl') || info.atomTypes[1] || naType;
  const bondColor = info.bonds.color;
  const halfA = a * 0.5;

  // Interpenetrating Na+ and Cl- FCC sublattices with closed boundaries
  const stepsX = rx * 2;
  const stepsY = ry * 2;
  const stepsZ = rz * 2;

  for (let ix = 0; ix <= stepsX; ix++) {
    for (let iy = 0; iy <= stepsY; iy++) {
      for (let iz = 0; iz <= stepsZ; iz++) {
        const isNa = (ix + iy + iz) % 2 === 0;
        const pos = new THREE.Vector3(ix * halfA, iy * halfA, iz * halfA);

        atoms.push({
          position: pos,
          element: isNa ? 'Na' : 'Cl',
          color: isNa ? naType.color : clType.color,
          radius: isNa ? naType.radius : clType.radius,
        });
      }
    }
  }

  // Connect nearest Na-Cl ionic bonds along cartesian axes
  const cutoff = halfA * 1.08;
  for (let i = 0; i < atoms.length; i++) {
    for (let j = i + 1; j < atoms.length; j++) {
      if (atoms[i].element !== atoms[j].element) {
        const dist = atoms[i].position.distanceTo(atoms[j].position);
        if (dist > 0.05 && dist < cutoff) {
          bonds.push({
            start: atoms[i].position.clone(),
            end: atoms[j].position.clone(),
            color: bondColor,
          });
        }
      }
    }
  }

  return { atoms, bonds };
}

// ── 4. Tinh Thể Thạch Anh (α-SiO₂ Quartz Tam phương Trigonal P3₁21) ──────────
function generateQuartz(
  a: number,
  rx: number,
  ry: number,
  rz: number,
  info: MaterialData['molecularInfo']
): { atoms: AtomInstance[]; bonds: BondInstance[] } {
  const atoms: AtomInstance[] = [];
  const bonds: BondInstance[] = [];
  const siType = info.atomTypes.find((t) => t.element === 'Si') || info.atomTypes[0];
  const oType = info.atomTypes.find((t) => t.element === 'O') || info.atomTypes[1] || siType;
  const bondColor = info.bonds.color;

  const c = a * 1.10; // c/a ratio for alpha-quartz

  for (let ix = 0; ix < rx; ix++) {
    for (let iy = 0; iy < ry; iy++) {
      for (let iz = 0; iz < rz; iz++) {
        const xBase = ix * a + (iy % 2) * (a * 0.5);
        const zBase = iy * ((a * Math.sqrt(3)) / 2);
        const yBase = iz * c;

        // Si positions in helical channel
        const si1 = new THREE.Vector3(xBase + a * 0.47, yBase, zBase);
        const si2 = new THREE.Vector3(xBase, yBase + c * 0.33, zBase + (a * Math.sqrt(3)) / 4);
        const si3 = new THREE.Vector3(xBase + a * 0.53, yBase + c * 0.67, zBase + (a * Math.sqrt(3)) / 3);

        atoms.push({ position: si1, element: 'Si', color: siType.color, radius: siType.radius });
        atoms.push({ position: si2, element: 'Si', color: siType.color, radius: siType.radius });
        atoms.push({ position: si3, element: 'Si', color: siType.color, radius: siType.radius });

        // Bridging Oxygen atoms
        const o1 = si1.clone().lerp(si2, 0.45).add(new THREE.Vector3(0, 0.2, 0));
        const o2 = si2.clone().lerp(si3, 0.45).add(new THREE.Vector3(0, -0.2, 0));
        const o3 = si3.clone().lerp(si1, 0.45).add(new THREE.Vector3(0.2, 0, 0));

        atoms.push({ position: o1, element: 'O', color: oType.color, radius: oType.radius });
        atoms.push({ position: o2, element: 'O', color: oType.color, radius: oType.radius });
        atoms.push({ position: o3, element: 'O', color: oType.color, radius: oType.radius });

        bonds.push({ start: si1.clone(), end: o1.clone(), color: bondColor });
        bonds.push({ start: o1.clone(), end: si2.clone(), color: bondColor });
        bonds.push({ start: si2.clone(), end: o2.clone(), color: bondColor });
        bonds.push({ start: o2.clone(), end: si3.clone(), color: bondColor });
        bonds.push({ start: si3.clone(), end: o3.clone(), color: bondColor });
        bonds.push({ start: o3.clone(), end: si1.clone(), color: bondColor });
      }
    }
  }

  return { atoms, bonds };
}

// ── 4B. Thủy Tinh Quang Học (SiO₂ Vô Định Hình - Mạng Ngẫu Nhiên Zachariasen CRN) ──
function generateGlassAmorphous(
  a: number,
  _rx: number,
  _ry: number,
  layers: number,
  info: MaterialData['molecularInfo']
): { atoms: AtomInstance[]; bonds: BondInstance[] } {
  const atoms: AtomInstance[] = [];
  const bonds: BondInstance[] = [];
  const siType = info.atomTypes.find((t) => t.element === 'Si') || info.atomTypes[0];
  const oType = info.atomTypes.find((t) => t.element === 'O') || info.atomTypes[1] || siType;
  const bondColor = info.bonds.color || '#bae6fd';

  // Zachariasen Continuous Random Network (CRN): corner-sharing [SiO4] tetrahedra with disordered Si-O-Si angles
  const numSi = 14 * Math.min(Math.max(1, layers), 3);
  const siNodes: THREE.Vector3[] = [];

  let seed = 42;
  const pseudoRandom = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  const radius = a * (1.1 + layers * 0.25);
  for (let i = 0; i < numSi; i++) {
    const phi = Math.acos(1 - 2 * ((i + 0.5) / numSi));
    const theta = Math.PI * (1 + Math.sqrt(5)) * i;
    const rWiggle = radius * (0.45 + 0.55 * pseudoRandom());
    const x = rWiggle * Math.sin(phi) * Math.cos(theta);
    const y = rWiggle * Math.cos(phi);
    const z = rWiggle * Math.sin(phi) * Math.sin(theta);
    siNodes.push(new THREE.Vector3(x, y, z));
  }

  for (const pt of siNodes) {
    atoms.push({
      position: pt.clone(),
      element: 'Si',
      color: siType.color,
      radius: siType.radius,
    });
  }

  const cutoff = radius * 0.72;
  for (let i = 0; i < siNodes.length; i++) {
    for (let j = i + 1; j < siNodes.length; j++) {
      const dist = siNodes[i].distanceTo(siNodes[j]);
      if (dist > 0.4 && dist < cutoff) {
        const midO = siNodes[i].clone().lerp(siNodes[j], 0.5);
        const perp = new THREE.Vector3(
          pseudoRandom() - 0.5,
          pseudoRandom() - 0.5,
          pseudoRandom() - 0.5
        ).normalize().multiplyScalar(dist * 0.22);
        midO.add(perp);

        atoms.push({
          position: midO,
          element: 'O',
          color: oType.color,
          radius: oType.radius,
        });

        bonds.push({ start: siNodes[i].clone(), end: midO.clone(), color: bondColor });
        bonds.push({ start: midO.clone(), end: siNodes[j].clone(), color: bondColor });
      }
    }
  }

  return { atoms, bonds };
}

// ── 5. Siêu Tụ Điện MXene (Ti₃C₂Tₓ - Mạng Bánh Kẹp 5 Tầng Hexagonal 2D) ───────
function generateMXene(
  a: number,
  rx: number,
  ry: number,
  layers: number,
  info: MaterialData['molecularInfo']
): { atoms: AtomInstance[]; bonds: BondInstance[] } {
  const atoms: AtomInstance[] = [];
  const bonds: BondInstance[] = [];
  const tiType = info.atomTypes.find((t) => t.element === 'Ti') || info.atomTypes[0];
  const cType = info.atomTypes.find((t) => t.element === 'C') || info.atomTypes[1] || tiType;
  const bondColor = info.bonds.color;

  const a1 = new THREE.Vector3(a, 0, 0);
  const a2 = new THREE.Vector3(a * 0.5, 0, (a * Math.sqrt(3)) * 0.5);

  const dy = 1.15;
  const layerSheetGap = 4.8;

  for (let l = 0; l < layers; l++) {
    const yCenter = (l - (layers - 1) * 0.5) * layerSheetGap;
    const sheetStartIndex = atoms.length;

    for (let i = 0; i < rx; i++) {
      for (let j = 0; j < ry; j++) {
        const ptOrigin = new THREE.Vector3().addScaledVector(a1, i).addScaledVector(a2, j);

        // Sublayer 1: Bottom Ti
        atoms.push({
          position: new THREE.Vector3(ptOrigin.x, yCenter - 2 * dy, ptOrigin.z),
          element: 'Ti',
          color: tiType.color,
          radius: tiType.radius,
        });

        // Sublayer 2: Lower C
        const ptB = ptOrigin.clone().addScaledVector(a1, 1 / 3).addScaledVector(a2, 2 / 3);
        atoms.push({
          position: new THREE.Vector3(ptB.x, yCenter - dy, ptB.z),
          element: 'C',
          color: cType.color,
          radius: cType.radius,
        });

        // Sublayer 3: Center Ti
        const ptC = ptOrigin.clone().addScaledVector(a1, 2 / 3).addScaledVector(a2, 1 / 3);
        atoms.push({
          position: new THREE.Vector3(ptC.x, yCenter, ptC.z),
          element: 'Ti',
          color: tiType.color,
          radius: tiType.radius,
        });

        // Sublayer 4: Upper C
        atoms.push({
          position: new THREE.Vector3(ptOrigin.x, yCenter + dy, ptOrigin.z),
          element: 'C',
          color: cType.color,
          radius: cType.radius,
        });

        // Sublayer 5: Top Ti
        atoms.push({
          position: new THREE.Vector3(ptB.x, yCenter + 2 * dy, ptB.z),
          element: 'Ti',
          color: tiType.color,
          radius: tiType.radius,
        });
      }
    }

    const cutoff = 2.45;
    const sheetEndIndex = atoms.length;
    for (let u = sheetStartIndex; u < sheetEndIndex; u++) {
      for (let v = u + 1; v < sheetEndIndex; v++) {
        if (
          (atoms[u].element === 'Ti' && atoms[v].element === 'C') ||
          (atoms[u].element === 'C' && atoms[v].element === 'Ti')
        ) {
          const d = atoms[u].position.distanceTo(atoms[v].position);
          if (d > 0.1 && d <= cutoff) {
            bonds.push({
              start: atoms[u].position.clone(),
              end: atoms[v].position.clone(),
              color: bondColor,
            });
          }
        }
      }
    }
  }

  return { atoms, bonds };
}

// ── 6. Kim Loại Lập Phương Tâm Diện (FCC - Vàng Au, Đồng Cu, Nhôm Al, Inconel) ─
function generateFCC(
  a: number,
  rx: number,
  ry: number,
  rz: number,
  info: MaterialData['molecularInfo']
): { atoms: AtomInstance[]; bonds: BondInstance[] } {
  const atoms: AtomInstance[] = [];
  const bonds: BondInstance[] = [];
  const atomType = info.atomTypes[0];
  const bondColor = info.bonds.color;

  // Complete closed FCC unit cells with all corners and all 6 face centers on boundary faces
  for (let ix = 0; ix <= rx; ix++) {
    for (let iy = 0; iy <= ry; iy++) {
      for (let iz = 0; iz <= rz; iz++) {
        // Corners
        atoms.push({
          position: new THREE.Vector3(ix * a, iy * a, iz * a),
          element: atomType.element,
          color: atomType.color,
          radius: atomType.radius,
        });

        // Face centers
        if (ix < rx && iy < ry) {
          atoms.push({
            position: new THREE.Vector3((ix + 0.5) * a, (iy + 0.5) * a, iz * a),
            element: atomType.element,
            color: atomType.color,
            radius: atomType.radius,
          });
        }
        if (ix < rx && iz < rz) {
          atoms.push({
            position: new THREE.Vector3((ix + 0.5) * a, iy * a, (iz + 0.5) * a),
            element: atomType.element,
            color: atomType.color,
            radius: atomType.radius,
          });
        }
        if (iy < ry && iz < rz) {
          atoms.push({
            position: new THREE.Vector3(ix * a, (iy + 0.5) * a, (iz + 0.5) * a),
            element: atomType.element,
            color: atomType.color,
            radius: atomType.radius,
          });
        }
      }
    }
  }

  // Connect nearest close-packed neighbors along face diagonals (d = a / sqrt(2))
  const dFCC = a / Math.SQRT2;
  const cutoff = dFCC * 1.10;

  for (let i = 0; i < atoms.length; i++) {
    for (let j = i + 1; j < atoms.length; j++) {
      const dist = atoms[i].position.distanceTo(atoms[j].position);
      if (dist > 0.05 && dist < cutoff) {
        bonds.push({
          start: atoms[i].position.clone(),
          end: atoms[j].position.clone(),
          color: bondColor,
        });
      }
    }
  }

  return { atoms, bonds };
}

// ── 7. Kim Loại Lập Phương Tâm Khối (BCC - Sắt Nguyên Chất α-Fe) ─────────────
function generateBCC(
  a: number,
  rx: number,
  ry: number,
  rz: number,
  info: MaterialData['molecularInfo']
): { atoms: AtomInstance[]; bonds: BondInstance[] } {
  const atoms: AtomInstance[] = [];
  const bonds: BondInstance[] = [];
  const atomType = info.atomTypes[0];
  const bondColor = info.bonds.color;

  // 1. Generate all boundary corners
  for (let ix = 0; ix <= rx; ix++) {
    for (let iy = 0; iy <= ry; iy++) {
      for (let iz = 0; iz <= rz; iz++) {
        atoms.push({
          position: new THREE.Vector3(ix * a, iy * a, iz * a),
          element: atomType.element,
          color: atomType.color,
          radius: atomType.radius,
        });
      }
    }
  }

  // 2. Generate central body atoms and connect 8 body-diagonal bonds directly to 8 surrounding corners
  for (let ix = 0; ix < rx; ix++) {
    for (let iy = 0; iy < ry; iy++) {
      for (let iz = 0; iz < rz; iz++) {
        const centerPos = new THREE.Vector3((ix + 0.5) * a, (iy + 0.5) * a, (iz + 0.5) * a);
        atoms.push({
          position: centerPos,
          element: atomType.element,
          color: atomType.color,
          radius: atomType.radius,
        });

        // 8 body-diagonal bonds radiating to 8 corners of this cube
        for (let dx = 0; dx <= 1; dx++) {
          for (let dy = 0; dy <= 1; dy++) {
            for (let dz = 0; dz <= 1; dz++) {
              const cornerPos = new THREE.Vector3((ix + dx) * a, (iy + dy) * a, (iz + dz) * a);
              bonds.push({
                start: centerPos.clone(),
                end: cornerPos,
                color: bondColor,
              });
            }
          }
        }
      }
    }
  }

  return { atoms, bonds };
}

// ── 8. Thép Carbon C45 (Mạng Ferrite BCC + Nguyên Tử Carbon Xen Kẽ Lỗ Bát Diện) ──
function generateSteel(
  a: number,
  rx: number,
  ry: number,
  rz: number,
  info: MaterialData['molecularInfo']
): { atoms: AtomInstance[]; bonds: BondInstance[] } {
  const atoms: AtomInstance[] = [];
  const bonds: BondInstance[] = [];
  const feType = info.atomTypes[0]; // Fe
  const cType = info.atomTypes[1] || { element: 'C', color: '#1e293b', radius: 0.22 };
  const bondColor = info.bonds.color;

  // 1. Host BCC Ferrite matrix
  for (let ix = 0; ix <= rx; ix++) {
    for (let iy = 0; iy <= ry; iy++) {
      for (let iz = 0; iz <= rz; iz++) {
        atoms.push({
          position: new THREE.Vector3(ix * a, iy * a, iz * a),
          element: feType.element,
          color: feType.color,
          radius: feType.radius,
        });
      }
    }
  }

  for (let ix = 0; ix < rx; ix++) {
    for (let iy = 0; iy < ry; iy++) {
      for (let iz = 0; iz < rz; iz++) {
        const centerPos = new THREE.Vector3((ix + 0.5) * a, (iy + 0.5) * a, (iz + 0.5) * a);
        atoms.push({
          position: centerPos,
          element: feType.element,
          color: feType.color,
          radius: feType.radius,
        });

        // 8 Fe-Fe body diagonal bonds
        for (let dx = 0; dx <= 1; dx++) {
          for (let dy = 0; dy <= 1; dy++) {
            for (let dz = 0; dz <= 1; dz++) {
              const cornerPos = new THREE.Vector3((ix + dx) * a, (iy + dy) * a, (iz + dz) * a);
              bonds.push({
                start: centerPos.clone(),
                end: cornerPos,
                color: bondColor,
              });
            }
          }
        }
      }
    }
  }

  // 2. Interstitial Carbon atoms in octahedral sites (face centers & edge centers)
  const interstitialSites: THREE.Vector3[] = [
    new THREE.Vector3(0.5 * a, 0.5 * a, 0),         // Front face center
    new THREE.Vector3(0.5 * a, a, 0.5 * a),         // Top face center
    new THREE.Vector3(a, 0.5 * a, 0.5 * a),         // Right face center
    new THREE.Vector3((rx - 0.5) * a, 0.5 * a, (rz - 0.5) * a),
  ];

  for (const cPos of interstitialSites) {
    atoms.push({
      position: cPos.clone(),
      element: cType.element,
      color: '#38bdf8', // Glowing cyan strain accent
      radius: 0.20,
    });

    // Connect interstitial Carbon to neighboring Fe atoms (dislocation pinning strain bonds)
    for (let i = 0; i < atoms.length; i++) {
      if (atoms[i].element === 'Fe') {
        const d = cPos.distanceTo(atoms[i].position);
        if (d > 0.05 && d <= a * 0.72) {
          bonds.push({
            start: cPos.clone(),
            end: atoms[i].position.clone(),
            color: '#38bdf8', // Pinning bond
          });
        }
      }
    }
  }

  return { atoms, bonds };
}

// ── 9. Thép Không Gỉ Inox 304 (Mạng Austenit FCC Dung Dịch Rắn Thay Thế Fe-Cr-Ni) ──
function generateStainlessSteel(
  a: number,
  rx: number,
  ry: number,
  rz: number,
  info: MaterialData['molecularInfo']
): { atoms: AtomInstance[]; bonds: BondInstance[] } {
  const atoms: AtomInstance[] = [];
  const bonds: BondInstance[] = [];
  const feType = info.atomTypes[0]; // Fe
  const crType = info.atomTypes[1] || { element: 'Cr', color: '#10b981', radius: 0.35 };
  const niType = info.atomTypes[2] || { element: 'Ni', color: '#a855f7', radius: 0.35 };
  const bondColor = info.bonds.color;

  let siteIndex = 0;

  // Complete FCC lattice with substitutional Chromium (18%) and Nickel (8%)
  for (let ix = 0; ix <= rx; ix++) {
    for (let iy = 0; iy <= ry; iy++) {
      for (let iz = 0; iz <= rz; iz++) {
        const addSubAtom = (pos: THREE.Vector3) => {
          siteIndex++;
          const mod = siteIndex % 11;
          let spec = feType;
          if (mod === 2 || mod === 7) {
            spec = crType; // ~18% Chromium (emerald-cyan)
          } else if (mod === 5) {
            spec = niType; // ~9% Nickel (platinum-violet)
          }

          atoms.push({
            position: pos,
            element: spec.element,
            color: spec.color,
            radius: spec.radius,
          });
        };

        // Corners
        addSubAtom(new THREE.Vector3(ix * a, iy * a, iz * a));

        // Face centers
        if (ix < rx && iy < ry) {
          addSubAtom(new THREE.Vector3((ix + 0.5) * a, (iy + 0.5) * a, iz * a));
        }
        if (ix < rx && iz < rz) {
          addSubAtom(new THREE.Vector3((ix + 0.5) * a, iy * a, (iz + 0.5) * a));
        }
        if (iy < ry && iz < rz) {
          addSubAtom(new THREE.Vector3(ix * a, (iy + 0.5) * a, (iz + 0.5) * a));
        }
      }
    }
  }

  // Connect nearest neighbors (d = a / sqrt(2))
  const dFCC = a / Math.SQRT2;
  const cutoff = dFCC * 1.10;

  for (let i = 0; i < atoms.length; i++) {
    for (let j = i + 1; j < atoms.length; j++) {
      const dist = atoms[i].position.distanceTo(atoms[j].position);
      if (dist > 0.05 && dist < cutoff) {
        bonds.push({
          start: atoms[i].position.clone(),
          end: atoms[j].position.clone(),
          color: bondColor,
        });
      }
    }
  }

  return { atoms, bonds };
}

// ── 10. Hợp Kim Duralumin Nhôm Hàng Không (Al Matrix + Vùng Guinier-Preston GP Zone) ──
function generateDuralumin(
  a: number,
  rx: number,
  ry: number,
  rz: number,
  info: MaterialData['molecularInfo']
): { atoms: AtomInstance[]; bonds: BondInstance[] } {
  const atoms: AtomInstance[] = [];
  const bonds: BondInstance[] = [];
  const alType = info.atomTypes[0]; // Al
  const cuType = info.atomTypes[1] || { element: 'Cu', color: '#f97316', radius: 0.34 };
  const mgType = info.atomTypes[2] || { element: 'Mg', color: '#06b6d4', radius: 0.35 };
  const bondColor = info.bonds.color;

  // Complete FCC lattice with Guinier-Preston precipitate zone on central {100} plane (iy = 1)
  for (let ix = 0; ix <= rx; ix++) {
    for (let iy = 0; iy <= ry; iy++) {
      for (let iz = 0; iz <= rz; iz++) {
        const addAtom = (pos: THREE.Vector3, isGpCandidate: boolean) => {
          let spec = alType;

          // GP Zone: coherent disc of Copper atoms on {010} plane
          if (isGpCandidate) {
            const distFromCenter = Math.sqrt(
              Math.pow(pos.x - (rx * a * 0.5), 2) + Math.pow(pos.z - (rz * a * 0.5), 2)
            );
            if (distFromCenter < a * 0.85) {
              spec = cuType; // Copper GP zone precipitate
            }
          } else if ((ix * 3 + iy * 5 + iz * 7) % 17 === 0) {
            spec = mgType; // Magnesium solid solution
          }

          atoms.push({
            position: pos,
            element: spec.element,
            color: spec.color,
            radius: spec.radius,
          });
        };

        // Corners
        addAtom(new THREE.Vector3(ix * a, iy * a, iz * a), iy === 1);

        // Face centers
        if (ix < rx && iy < ry) {
          addAtom(new THREE.Vector3((ix + 0.5) * a, (iy + 0.5) * a, iz * a), iy === 1);
        }
        if (ix < rx && iz < rz) {
          addAtom(new THREE.Vector3((ix + 0.5) * a, iy * a, (iz + 0.5) * a), iy === 1);
        }
        if (iy < ry && iz < rz) {
          addAtom(new THREE.Vector3(ix * a, (iy + 0.5) * a, (iz + 0.5) * a), iy === 1);
        }
      }
    }
  }

  // Connect FCC bonds
  const dFCC = a / Math.SQRT2;
  const cutoff = dFCC * 1.10;

  for (let i = 0; i < atoms.length; i++) {
    for (let j = i + 1; j < atoms.length; j++) {
      const dist = atoms[i].position.distanceTo(atoms[j].position);
      if (dist > 0.05 && dist < cutoff) {
        bonds.push({
          start: atoms[i].position.clone(),
          end: atoms[j].position.clone(),
          color: bondColor,
        });
      }
    }
  }

  return { atoms, bonds };
}

// ── 11. Hợp Kim Cứng Vonfram Cacbua (WC - Lăng Trụ Tam Giác Trigonal Prismatic P-6m2) ──
function generateTungstenCarbide(
  a: number,
  _rx: number,
  _ry: number,
  _rz: number,
  info: MaterialData['molecularInfo']
): { atoms: AtomInstance[]; bonds: BondInstance[] } {
  const atoms: AtomInstance[] = [];
  const bonds: BondInstance[] = [];
  const wType = info.atomTypes[0]; // W
  const cType = info.atomTypes[1] || { element: 'C', color: '#1e293b', radius: 0.22 };
  const bondColor = info.bonds.color;
  const cLattice = a * 0.976;

  // Build cluster of 3 interlocked trigonal prisms forming the complete hexagonal cell
  const halfH = cLattice * 0.5;
  const hexAngles = [0, Math.PI / 3, (2 * Math.PI) / 3, Math.PI, (4 * Math.PI) / 3, (5 * Math.PI) / 3];

  const wPosList: THREE.Vector3[] = [
    new THREE.Vector3(0, -halfH, 0),
    new THREE.Vector3(0, halfH, 0),
  ];

  for (const angle of hexAngles) {
    wPosList.push(new THREE.Vector3(a * Math.cos(angle), -halfH, a * Math.sin(angle)));
    wPosList.push(new THREE.Vector3(a * Math.cos(angle), halfH, a * Math.sin(angle)));
  }

  for (const pos of wPosList) {
    atoms.push({
      position: pos,
      element: wType.element,
      color: wType.color,
      radius: wType.radius,
    });
  }

  // Carbon atoms in centers of alternating trigonal prisms
  const cAngles = [Math.PI / 6, (5 * Math.PI) / 6, (9 * Math.PI) / 6];
  const cRadius = a * 0.577; // a / sqrt(3)

  for (const angle of cAngles) {
    const cPos = new THREE.Vector3(cRadius * Math.cos(angle), 0, cRadius * Math.sin(angle));
    atoms.push({
      position: cPos,
      element: cType.element,
      color: cType.color,
      radius: cType.radius,
    });

    // 6 strong covalent-metallic bonds from central Carbon to 6 surrounding W vertices
    for (const wPos of wPosList) {
      const d = cPos.distanceTo(wPos);
      if (d > 0.05 && d <= a * 0.95) {
        bonds.push({
          start: cPos.clone(),
          end: wPos.clone(),
          color: '#38bdf8',
        });
      }
    }
  }

  // Connect W-W framework edges
  for (let i = 0; i < wPosList.length; i++) {
    for (let j = i + 1; j < wPosList.length; j++) {
      const d = wPosList[i].distanceTo(wPosList[j]);
      if (d > 0.05 && d <= a * 1.05) {
        bonds.push({
          start: wPosList[i].clone(),
          end: wPosList[j].clone(),
          color: bondColor,
        });
      }
    }
  }

  return { atoms, bonds };
}

// ── 12. Kim Loại Lục Giác Xếp Chặt (HCP - Titan Ti Chuẩn Giáo Khoa Lăng Trụ ABAB) ──
function generateHCP(
  a: number,
  _rx: number,
  _ry: number,
  rz: number,
  info: MaterialData['molecularInfo']
): { atoms: AtomInstance[]; bonds: BondInstance[] } {
  const atoms: AtomInstance[] = [];
  const bonds: BondInstance[] = [];
  const atomType = info.atomTypes[0];
  const bondColor = info.bonds.color;
  const c = a * 1.587; // Ideal c/a ratio for Titanium

  const numPrisms = Math.min(Math.max(1, rz), 2);

  for (let p = 0; p < numPrisms; p++) {
    const yBase = (p - (numPrisms - 1) * 0.5) * c;
    const yBot = yBase - c * 0.5;
    const yMid = yBase;
    const yTop = yBase + c * 0.5;

    // Layer A (Bottom): 6 perimeter atoms + 1 center atom
    const botCenter = new THREE.Vector3(0, yBot, 0);
    atoms.push({ position: botCenter, element: atomType.element, color: atomType.color, radius: atomType.radius });

    const botRing: THREE.Vector3[] = [];
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3;
      const pt = new THREE.Vector3(a * Math.cos(angle), yBot, a * Math.sin(angle));
      atoms.push({ position: pt, element: atomType.element, color: atomType.color, radius: atomType.radius });
      botRing.push(pt);
      bonds.push({ start: botCenter.clone(), end: pt.clone(), color: bondColor });
    }
    for (let i = 0; i < 6; i++) {
      bonds.push({ start: botRing[i].clone(), end: botRing[(i + 1) % 6].clone(), color: bondColor });
    }

    // Layer B (Middle): 3 atoms nestled in alternating hollows
    const midRing: THREE.Vector3[] = [];
    const midRadius = a / Math.sqrt(3);
    for (let i = 0; i < 3; i++) {
      const angle = (i * 2 * Math.PI) / 3 + Math.PI / 6; // 30°, 150°, 270°
      const pt = new THREE.Vector3(midRadius * Math.cos(angle), yMid, midRadius * Math.sin(angle));
      atoms.push({ position: pt, element: atomType.element, color: atomType.color, radius: atomType.radius });
      midRing.push(pt);
    }
    for (let i = 0; i < 3; i++) {
      bonds.push({ start: midRing[i].clone(), end: midRing[(i + 1) % 3].clone(), color: bondColor });
    }

    // Layer A (Top): 6 perimeter atoms + 1 center atom
    const topCenter = new THREE.Vector3(0, yTop, 0);
    atoms.push({ position: topCenter, element: atomType.element, color: atomType.color, radius: atomType.radius });

    const topRing: THREE.Vector3[] = [];
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3;
      const pt = new THREE.Vector3(a * Math.cos(angle), yTop, a * Math.sin(angle));
      atoms.push({ position: pt, element: atomType.element, color: atomType.color, radius: atomType.radius });
      topRing.push(pt);
      bonds.push({ start: topCenter.clone(), end: pt.clone(), color: bondColor });
      bonds.push({ start: botRing[i].clone(), end: pt.clone(), color: bondColor });
    }
    for (let i = 0; i < 6; i++) {
      bonds.push({ start: topRing[i].clone(), end: topRing[(i + 1) % 6].clone(), color: bondColor });
    }

    // Connect Middle Layer B to Top & Bottom Layer A (12-coordination bonds)
    for (let m = 0; m < 3; m++) {
      const pMid = midRing[m];
      for (let b = 0; b < 6; b++) {
        if (pMid.distanceTo(botRing[b]) < a * 1.08) {
          bonds.push({ start: pMid.clone(), end: botRing[b].clone(), color: bondColor });
        }
        if (pMid.distanceTo(topRing[b]) < a * 1.08) {
          bonds.push({ start: pMid.clone(), end: topRing[b].clone(), color: bondColor });
        }
      }
      bonds.push({ start: pMid.clone(), end: botCenter.clone(), color: bondColor });
      bonds.push({ start: pMid.clone(), end: topCenter.clone(), color: bondColor });
    }
  }

  return { atoms, bonds };
}

// ── 13. Chống Dính Teflon (PTFE - Chuỗi Polyme Xoắn 13/6 Bọc Flo Kín) ────────
function generateTeflon(
  _a: number,
  _rx: number,
  _ry: number,
  layers: number,
  info: MaterialData['molecularInfo']
): { atoms: AtomInstance[]; bonds: BondInstance[] } {
  const atoms: AtomInstance[] = [];
  const bonds: BondInstance[] = [];
  const cType = info.atomTypes.find((t) => t.element === 'C') || info.atomTypes[0];
  const fType = info.atomTypes.find((t) => t.element === 'F') || info.atomTypes[1] || cType;
  const bondColor = info.bonds.color;

  const numChains = Math.min(Math.max(1, layers), 3);
  const chainLen = 14; // Authentic 13/6 helix period
  const dCC = 1.54;
  const dCF = 1.35;
  const rHelix = 0.42;

  const chainOffsets: [number, number][] =
    layers === 1
      ? [[0, 0]]
      : layers === 2
      ? [[-1.5, 0], [1.5, 0]]
      : [[-1.6, -0.92], [1.6, -0.92], [0, 1.84]];

  for (let ch = 0; ch < numChains; ch++) {
    const [xChain, zChain] = chainOffsets[ch] || [0, 0];
    let prevC: THREE.Vector3 | null = null;

    for (let i = 0; i < chainLen; i++) {
      const theta = (i * 6 * 2 * Math.PI) / 13;
      const y = (i - chainLen * 0.5) * (dCC * 0.88);
      const xC = xChain + Math.cos(theta) * rHelix;
      const zC = zChain + Math.sin(theta) * rHelix;
      const cPos = new THREE.Vector3(xC, y, zC);

      atoms.push({ position: cPos, element: 'C', color: cType.color, radius: cType.radius });

      if (prevC) {
        bonds.push({ start: prevC.clone(), end: cPos.clone(), color: bondColor });
      }
      prevC = cPos;

      const fAngle1 = theta + 1.15;
      const fAngle2 = theta - 1.15;
      const f1 = new THREE.Vector3(
        xC + Math.cos(fAngle1) * dCF,
        y + 0.22,
        zC + Math.sin(fAngle1) * dCF
      );
      const f2 = new THREE.Vector3(
        xC + Math.cos(fAngle2) * dCF,
        y - 0.22,
        zC + Math.sin(fAngle2) * dCF
      );

      atoms.push({ position: f1, element: 'F', color: fType.color, radius: fType.radius });
      atoms.push({ position: f2, element: 'F', color: fType.color, radius: fType.radius });

      bonds.push({ start: cPos.clone(), end: f1.clone(), color: '#38bdf8' });
      bonds.push({ start: cPos.clone(), end: f2.clone(), color: '#38bdf8' });
    }
  }

  return { atoms, bonds };
}

// ── 14. Pin Điện Thoại Lithium (LiCoO₂ - Cấu Trúc Lớp O3 Khe Xen Kẽ Li+ Rộng Mở) ──
function generateBatteryLCO(
  a: number,
  _rx: number,
  _ry: number,
  _rz: number,
  info: MaterialData['molecularInfo']
): { atoms: AtomInstance[]; bonds: BondInstance[] } {
  const atoms: AtomInstance[] = [];
  const bonds: BondInstance[] = [];
  const coType = info.atomTypes.find((t) => t.element === 'Co') || info.atomTypes[0];
  const oType = info.atomTypes.find((t) => t.element === 'O') || info.atomTypes[1] || coType;
  const liType = info.atomTypes.find((t) => t.element === 'Li') || info.atomTypes[2] || coType;
  const bondColor = info.bonds.color;

  const dx = a * 0.95;
  const dz = (a * Math.sqrt(3) * 0.95) * 0.5;

  const slabLevels = [-1.4, 1.4];

  for (const yCo of slabLevels) {
    const yOTop = yCo + 0.62;
    const yOBot = yCo - 0.62;

    for (let r = -1; r <= 1; r++) {
      for (let c = -1; c <= 1; c++) {
        const x = c * dx + (r % 2) * (dx * 0.5);
        const z = r * dz;

        const coPos = new THREE.Vector3(x, yCo, z);
        atoms.push({ position: coPos, element: 'Co', color: coType.color, radius: coType.radius });

        const oTop1 = new THREE.Vector3(x + dx * 0.33, yOTop, z + dz * 0.33);
        const oTop2 = new THREE.Vector3(x - dx * 0.33, yOTop, z - dz * 0.33);
        const oBot1 = new THREE.Vector3(x + dx * 0.33, yOBot, z - dz * 0.33);
        const oBot2 = new THREE.Vector3(x - dx * 0.33, yOBot, z + dz * 0.33);

        atoms.push({ position: oTop1, element: 'O', color: oType.color, radius: oType.radius });
        atoms.push({ position: oTop2, element: 'O', color: oType.color, radius: oType.radius });
        atoms.push({ position: oBot1, element: 'O', color: oType.color, radius: oType.radius });
        atoms.push({ position: oBot2, element: 'O', color: oType.color, radius: oType.radius });

        bonds.push({ start: coPos.clone(), end: oTop1.clone(), color: bondColor });
        bonds.push({ start: coPos.clone(), end: oTop2.clone(), color: bondColor });
        bonds.push({ start: coPos.clone(), end: oBot1.clone(), color: bondColor });
        bonds.push({ start: coPos.clone(), end: oBot2.clone(), color: bondColor });
      }
    }
  }

  // Interlayer Lithium ions in the open 2D intercalation channel
  for (let r = -1; r <= 1; r++) {
    for (let c = -1; c <= 1; c++) {
      const xLi = c * dx + (r % 2) * (dx * 0.5) + dx * 0.5;
      const zLi = r * dz + dz * 0.5;
      const liPos = new THREE.Vector3(xLi, 0, zLi);

      atoms.push({
        position: liPos,
        element: 'Li',
        color: liType.color || '#22c55e',
        radius: 0.22,
      });
    }
  }

  return { atoms, bonds };
}

// ── 15. Gốm Sứ Kỹ Thuật (Al₂O₃ - Tinh Thể Corundum Cặp Bát Diện AlO₆ Trục C) ───
function generateAlumina(
  a: number,
  _rx: number,
  _ry: number,
  _rz: number,
  info: MaterialData['molecularInfo']
): { atoms: AtomInstance[]; bonds: BondInstance[] } {
  const atoms: AtomInstance[] = [];
  const bonds: BondInstance[] = [];
  const alType = info.atomTypes.find((t) => t.element === 'Al') || info.atomTypes[0];
  const oType = info.atomTypes.find((t) => t.element === 'O') || info.atomTypes[1] || alType;
  const bondColor = info.bonds.color;
  const c = a * 2.73;

  const numLevels = 3;
  for (let l = 0; l < numLevels; l++) {
    const yCenter = (l - (numLevels - 1) * 0.5) * (c * 0.38);

    const al1 = new THREE.Vector3(0, yCenter - 0.45, 0);
    const al2 = new THREE.Vector3(0, yCenter + 0.45, 0);
    atoms.push({ position: al1, element: 'Al', color: alType.color, radius: alType.radius });
    atoms.push({ position: al2, element: 'Al', color: alType.color, radius: alType.radius });

    const oRing: THREE.Vector3[] = [];
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3 + (l % 2) * (Math.PI / 6);
      const rO = a * 0.72;
      const yO = yCenter + (i % 2 === 0 ? 0.25 : -0.25);
      const oPos = new THREE.Vector3(rO * Math.cos(angle), yO, rO * Math.sin(angle));
      atoms.push({ position: oPos, element: 'O', color: oType.color, radius: oType.radius });
      oRing.push(oPos);

      bonds.push({ start: al1.clone(), end: oPos.clone(), color: bondColor });
      bonds.push({ start: al2.clone(), end: oPos.clone(), color: bondColor });
    }

    for (let i = 0; i < 6; i++) {
      bonds.push({ start: oRing[i].clone(), end: oRing[(i + 1) % 6].clone(), color: '#ef4444' });
    }
  }

  return { atoms, bonds };
}

// ── 16. Cao Su Lưu Hóa Đàn Hồi (Mạng Polyme Nối Chéo Cầu Lưu Huỳnh –S–S–) ────
function generateVulcanizedRubber(
  _a: number,
  _rx: number,
  _ry: number,
  layers: number,
  info: MaterialData['molecularInfo']
): { atoms: AtomInstance[]; bonds: BondInstance[] } {
  const atoms: AtomInstance[] = [];
  const bonds: BondInstance[] = [];
  const cType = info.atomTypes.find((t) => t.element === 'C') || info.atomTypes[0];
  const sType = info.atomTypes.find((t) => t.element === 'S') || info.atomTypes[2] || cType;
  const bondColor = info.bonds.color;

  const numChains = Math.min(Math.max(1, layers), 3);
  const nodesPerChain = 8;
  const chainNodes: THREE.Vector3[][] = [];

  const chainOffsets: [number, number][] =
    layers === 1
      ? [[0, 0]]
      : layers === 2
      ? [[-1.6, 0], [1.6, 0]]
      : [[-2.5, 0], [0, 0], [2.5, 0]];

  for (let ch = 0; ch < numChains; ch++) {
    const [xBase, zBase] = chainOffsets[ch] || [0, 0];
    const currentChain: THREE.Vector3[] = [];

    let prevPos: THREE.Vector3 | null = null;
    for (let i = 0; i < nodesPerChain; i++) {
      const y = (i - nodesPerChain / 2) * 0.85;
      const xWiggle = xBase + Math.sin(i * 1.6 + ch * 1.3) * 0.45;
      const zWiggle = zBase + Math.cos(i * 1.4 + ch * 1.3) * 0.45;
      const pos = new THREE.Vector3(xWiggle, y, zWiggle);

      atoms.push({ position: pos, element: 'C', color: cType.color, radius: cType.radius });
      currentChain.push(pos);

      if (prevPos) {
        bonds.push({ start: prevPos.clone(), end: pos.clone(), color: bondColor });
      }
      prevPos = pos;
    }
    chainNodes.push(currentChain);
  }

  // Crosslinking sulfur bridges –S–S– between adjacent chains
  for (let ch = 0; ch < numChains - 1; ch++) {
    const chainA = chainNodes[ch];
    const chainB = chainNodes[ch + 1];

    const connectIdx = ch % 2 === 0 ? 3 : 4;
    const pA = chainA[connectIdx];
    const pB = chainB[connectIdx];

    const s1 = pA.clone().lerp(pB, 0.35);
    const s2 = pA.clone().lerp(pB, 0.65);

    atoms.push({ position: s1, element: 'S', color: sType.color, radius: sType.radius });
    atoms.push({ position: s2, element: 'S', color: sType.color, radius: sType.radius });

    bonds.push({ start: pA.clone(), end: s1.clone(), color: '#facc15' });
    bonds.push({ start: s1.clone(), end: s2.clone(), color: '#eab308' });
    bonds.push({ start: s2.clone(), end: pB.clone(), color: '#facc15' });
  }

  return { atoms, bonds };
}

// ── 17. Ống Nano Carbon Đơn/Đa Vách (SWCNT/DWCNT/MWCNT Armchair Chuẩn) ───────
function generateCarbonNanotube(
  _a: number,
  _rx: number,
  _ry: number,
  layers: number,
  info: MaterialData['molecularInfo']
): { atoms: AtomInstance[]; bonds: BondInstance[] } {
  const atoms: AtomInstance[] = [];
  const bonds: BondInstance[] = [];
  const atomType = info.atomTypes[0];
  const bondColor = info.bonds.color;

  const aCC = 1.42; // C-C bond length in Å
  const T = Math.sqrt(3) * aCC; // Axial repeat unit length ≈ 2.4595 Å
  const numPeriods = 13;
  const totalLength = numPeriods * T;

  const wallConfigs = [
    { n: 8, radius: (3 * 8 * aCC) / (2 * Math.PI) },
    { n: 13, radius: (3 * 13 * aCC) / (2 * Math.PI) },
    { n: 18, radius: (3 * 18 * aCC) / (2 * Math.PI) },
  ];

  const totalWalls = Math.min(Math.max(1, layers), 3);
  const tiltEuler = new THREE.Euler(0.08, -0.36, 0.14);
  const tiltMatrix = new THREE.Matrix4().makeRotationFromEuler(tiltEuler);

  for (let w = 0; w < totalWalls; w++) {
    const { n, radius } = wallConfigs[w];
    const wallStartIdx = atoms.length;
    const dTheta = (2 * Math.PI) / (3 * n);

    for (let k = 0; k < numPeriods; k++) {
      const xBase = k * T - totalLength * 0.5;

      for (let j = 0; j < n; j++) {
        const atomSpecs = [
          { theta: 3 * j * dTheta, x: xBase },
          { theta: (3 * j + 1) * dTheta, x: xBase },
          { theta: (3 * j + 1.5) * dTheta, x: xBase + 0.5 * T },
          { theta: (3 * j + 2.5) * dTheta, x: xBase + 0.5 * T },
        ];

        for (const spec of atomSpecs) {
          const rawPos = new THREE.Vector3(
            spec.x,
            radius * Math.cos(spec.theta),
            radius * Math.sin(spec.theta)
          );
          rawPos.applyMatrix4(tiltMatrix);

          atoms.push({
            position: rawPos,
            element: atomType.element,
            color: atomType.color,
            radius: atomType.radius || 0.4,
          });
        }
      }
    }

    const wallEndIdx = atoms.length;
    const cutoff = aCC * 1.18;
    for (let i = wallStartIdx; i < wallEndIdx; i++) {
      const posI = atoms[i].position;
      for (let j = i + 1; j < wallEndIdx; j++) {
        const dist = posI.distanceTo(atoms[j].position);
        if (dist > 0.1 && dist < cutoff) {
          bonds.push({
            start: posI.clone(),
            end: atoms[j].position.clone(),
            color: bondColor,
          });
        }
      }
    }
  }

  return { atoms, bonds };
}

// ── 18. Buckyball Fullerene C₆₀ (Khối 20 Mặt Cụt & Cụm Tinh Thể Fullerite) ──
function generateBuckyballC60(
  _a: number,
  layers: number,
  info: MaterialData['molecularInfo']
): { atoms: AtomInstance[]; bonds: BondInstance[] } {
  const atoms: AtomInstance[] = [];
  const bonds: BondInstance[] = [];
  const atomType = info.atomTypes[0];
  const bondColor = info.bonds.color;

  const phi = (1 + Math.sqrt(5)) / 2; // Golden Ratio ≈ 1.6180339887
  const baseNorm = Math.sqrt(1 + 9 * phi * phi);
  const scale = 3.54 / baseNorm;
  const signs = [-1, 1];

  const singleCageCoords: THREE.Vector3[] = [];

  // Group 1: Even permutations of (0, ±1, ±3phi) -> 12 vertices
  for (const s1 of signs) {
    for (const s2 of signs) {
      singleCageCoords.push(new THREE.Vector3(0, s1 * 1, s2 * 3 * phi).multiplyScalar(scale));
      singleCageCoords.push(new THREE.Vector3(s2 * 3 * phi, 0, s1 * 1).multiplyScalar(scale));
      singleCageCoords.push(new THREE.Vector3(s1 * 1, s2 * 3 * phi, 0).multiplyScalar(scale));
    }
  }

  // Group 2: Even permutations of (±2, ±(1+2phi), ±phi) -> 24 vertices
  for (const s1 of signs) {
    for (const s2 of signs) {
      for (const s3 of signs) {
        singleCageCoords.push(new THREE.Vector3(s1 * 2, s2 * (1 + 2 * phi), s3 * phi).multiplyScalar(scale));
        singleCageCoords.push(new THREE.Vector3(s3 * phi, s1 * 2, s2 * (1 + 2 * phi)).multiplyScalar(scale));
        singleCageCoords.push(new THREE.Vector3(s2 * (1 + 2 * phi), s3 * phi, s1 * 2).multiplyScalar(scale));
      }
    }
  }

  // Group 3: Even permutations of (±1, ±(2+phi), ±2phi) -> 24 vertices
  for (const s1 of signs) {
    for (const s2 of signs) {
      for (const s3 of signs) {
        singleCageCoords.push(new THREE.Vector3(s1 * 1, s2 * (2 + phi), s3 * 2 * phi).multiplyScalar(scale));
        singleCageCoords.push(new THREE.Vector3(s3 * 2 * phi, s1 * 1, s2 * (2 + phi)).multiplyScalar(scale));
        singleCageCoords.push(new THREE.Vector3(s2 * (2 + phi), s3 * 2 * phi, s1 * 1).multiplyScalar(scale));
      }
    }
  }

  const cageCenters: THREE.Vector3[] =
    layers === 1
      ? [new THREE.Vector3(0, 0, 0)]
      : layers === 2
      ? [new THREE.Vector3(-4.8, 0, 0), new THREE.Vector3(4.8, 0, 0)]
      : [
          new THREE.Vector3(-4.8, -2.77, 0),
          new THREE.Vector3(4.8, -2.77, 0),
          new THREE.Vector3(0, 5.54, 0),
        ];

  for (const center of cageCenters) {
    const cageStartIdx = atoms.length;
    for (const pt of singleCageCoords) {
      atoms.push({
        position: pt.clone().add(center),
        element: atomType.element,
        color: atomType.color,
        radius: atomType.radius,
      });
    }

    const cageEndIdx = atoms.length;
    const cutoff = 1.62;
    for (let i = cageStartIdx; i < cageEndIdx; i++) {
      for (let j = i + 1; j < cageEndIdx; j++) {
        const dist = atoms[i].position.distanceTo(atoms[j].position);
        if (dist > 0.1 && dist < cutoff) {
          bonds.push({
            start: atoms[i].position.clone(),
            end: atoms[j].position.clone(),
            color: bondColor,
          });
        }
      }
    }
  }

  return { atoms, bonds };
}

// ── 19. Tinh Thể Perovskite Quang Điện (Cubic Pm-3m - CH₃NH₃PbI₃) ─────────────
function generatePerovskite(
  a: number,
  rx: number,
  ry: number,
  rz: number,
  info: MaterialData['molecularInfo']
): { atoms: AtomInstance[]; bonds: BondInstance[] } {
  const atoms: AtomInstance[] = [];
  const bonds: BondInstance[] = [];
  const bType = info.atomTypes.find((t) => t.element === 'Pb') || info.atomTypes[0];
  const xType = info.atomTypes.find((t) => t.element === 'I') || info.atomTypes[1] || bType;
  const aType = info.atomTypes.find((t) => t.element === 'MA' || t.element === 'Cs' || t.element === 'Ca') || info.atomTypes[2] || bType;
  const bondColor = info.bonds.color;

  const half = a * 0.5;

  for (let ix = 0; ix < rx; ix++) {
    for (let iy = 0; iy < ry; iy++) {
      for (let iz = 0; iz < rz; iz++) {
        const ox = ix * a;
        const oy = iy * a;
        const oz = iz * a;

        const bPos = new THREE.Vector3(ox, oy, oz);
        atoms.push({ position: bPos, element: bType.element, color: bType.color, radius: bType.radius });

        const x1 = new THREE.Vector3(ox + half, oy, oz);
        const x2 = new THREE.Vector3(ox, oy + half, oz);
        const x3 = new THREE.Vector3(ox, oy, oz + half);
        atoms.push({ position: x1, element: xType.element, color: xType.color, radius: xType.radius });
        atoms.push({ position: x2, element: xType.element, color: xType.color, radius: xType.radius });
        atoms.push({ position: x3, element: xType.element, color: xType.color, radius: xType.radius });

        bonds.push({ start: bPos.clone(), end: x1.clone(), color: bondColor });
        bonds.push({ start: bPos.clone(), end: x2.clone(), color: bondColor });
        bonds.push({ start: bPos.clone(), end: x3.clone(), color: bondColor });

        const aPos = new THREE.Vector3(ox + half, oy + half, oz + half);
        atoms.push({ position: aPos, element: aType.element, color: aType.color, radius: aType.radius });
      }
    }
  }

  const maxBx = rx * a;
  const maxBy = ry * a;
  const maxBz = rz * a;
  atoms.push({ position: new THREE.Vector3(maxBx, 0, 0), element: bType.element, color: bType.color, radius: bType.radius });
  atoms.push({ position: new THREE.Vector3(0, maxBy, 0), element: bType.element, color: bType.color, radius: bType.radius });
  atoms.push({ position: new THREE.Vector3(0, 0, maxBz), element: bType.element, color: bType.color, radius: bType.radius });
  atoms.push({ position: new THREE.Vector3(maxBx, maxBy, maxBz), element: bType.element, color: bType.color, radius: bType.radius });

  return { atoms, bonds };
}

// ── 20. Khói Đông Lạnh Aerogel (Mạng Xốp 3D Tứ Diện Nanoporous Silica Fractal) ─
function generateAerogel(
  a: number,
  _rx: number,
  _ry: number,
  layers: number,
  info: MaterialData['molecularInfo']
): { atoms: AtomInstance[]; bonds: BondInstance[] } {
  const atoms: AtomInstance[] = [];
  const bonds: BondInstance[] = [];
  const siType = info.atomTypes.find((t) => t.element === 'Si') || info.atomTypes[0];
  const oType = info.atomTypes.find((t) => t.element === 'O') || info.atomTypes[1] || siType;
  const bondColor = info.bonds.color;

  const totalNodes = 14 * Math.min(Math.max(1, layers), 3);
  const nodes: THREE.Vector3[] = [];
  const span = a * (1.8 + layers * 0.35);

  for (let i = 0; i < totalNodes; i++) {
    const angle = i * 2.39996;
    const r = (0.55 + (i % 4) * 0.35) * span * 0.42;
    const y = ((i - totalNodes / 2) / (totalNodes / 2)) * span * 0.6;
    const x = r * Math.cos(angle);
    const z = r * Math.sin(angle);
    nodes.push(new THREE.Vector3(x, y, z));
  }

  for (const n of nodes) {
    atoms.push({ position: n.clone(), element: 'Si', color: siType.color, radius: siType.radius });
  }

  const cutoff = span * 0.48;
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dist = nodes[i].distanceTo(nodes[j]);
      if (dist > 0.4 && dist < cutoff) {
        const midO = nodes[i].clone().lerp(nodes[j], 0.5);
        const offset = new THREE.Vector3(nodes[i].y * 0.15, -nodes[i].x * 0.15, nodes[i].z * 0.15);
        midO.add(offset);

        atoms.push({ position: midO, element: 'O', color: oType.color, radius: oType.radius });

        bonds.push({ start: nodes[i].clone(), end: midO.clone(), color: bondColor });
        bonds.push({ start: midO.clone(), end: nodes[j].clone(), color: bondColor });
      }
    }
  }

  return { atoms, bonds };
}

// ── 21. Hợp Kim Nhớ Hình Nitinol (Mạng Lập Phương Trật Tự B2 NiTi - CsCl Type) ──
function generateNitinolB2(
  a: number,
  rx: number,
  ry: number,
  rz: number,
  info: MaterialData['molecularInfo']
): { atoms: AtomInstance[]; bonds: BondInstance[] } {
  const atoms: AtomInstance[] = [];
  const bonds: BondInstance[] = [];
  const niType = info.atomTypes.find((t) => t.element === 'Ni') || info.atomTypes[0];
  const tiType = info.atomTypes.find((t) => t.element === 'Ti') || info.atomTypes[1] || niType;
  const bondColor = info.bonds.color;

  const half = a * 0.5;

  for (let ix = 0; ix < rx; ix++) {
    for (let iy = 0; iy < ry; iy++) {
      for (let iz = 0; iz < rz; iz++) {
        const ox = ix * a;
        const oy = iy * a;
        const oz = iz * a;

        const niPos = new THREE.Vector3(ox, oy, oz);
        atoms.push({ position: niPos, element: 'Ni', color: niType.color, radius: niType.radius });

        const tiPos = new THREE.Vector3(ox + half, oy + half, oz + half);
        atoms.push({ position: tiPos, element: 'Ti', color: tiType.color, radius: tiType.radius });

        bonds.push({ start: niPos.clone(), end: tiPos.clone(), color: bondColor });
      }
    }
  }

  const cutoff = a * Math.sqrt(3) * 0.5 * 1.12;
  for (let i = 0; i < atoms.length; i++) {
    for (let j = i + 1; j < atoms.length; j++) {
      if (atoms[i].element !== atoms[j].element) {
        const d = atoms[i].position.distanceTo(atoms[j].position);
        if (d > 0.1 && d <= cutoff) {
          bonds.push({
            start: atoms[i].position.clone(),
            end: atoms[j].position.clone(),
            color: bondColor,
          });
        }
      }
    }
  }

  return { atoms, bonds };
}

// ── 22. Băng Đá Tinh Thể (Hexagonal Ice Ih - H₂O Chuẩn Wikipedia) ───────────
function generateIce(
  a: number,
  rx: number,
  ry: number,
  rz: number,
  info: MaterialData['molecularInfo']
): { atoms: AtomInstance[]; bonds: BondInstance[] } {
  const atoms: AtomInstance[] = [];
  const bonds: BondInstance[] = [];
  const oType = info.atomTypes.find((t) => t.element === 'O') || info.atomTypes[0];
  const hType = info.atomTypes.find((t) => t.element === 'H') || info.atomTypes[1] || oType;
  const bondColor = info.bonds.color || '#74b9ff';

  const c = a * 1.63; // Ice Ih c/a ratio
  const hOffset = 0.32;

  for (let ix = 0; ix < rx; ix++) {
    for (let iy = 0; iy < ry; iy++) {
      for (let iz = 0; iz < rz; iz++) {
        const xBase = ix * a + (iy % 2) * (a * 0.5);
        const zBase = iy * ((a * Math.sqrt(3)) / 2);
        const yBase = iz * c;

        const oSites = [
          new THREE.Vector3(xBase, yBase, zBase),
          new THREE.Vector3(xBase + a * 0.33, yBase + c * 0.25, zBase + (a * Math.sqrt(3)) / 6),
          new THREE.Vector3(xBase + a * 0.33, yBase + c * 0.5, zBase + (a * Math.sqrt(3)) / 6),
          new THREE.Vector3(xBase, yBase + c * 0.75, zBase),
        ];

        for (const oPos of oSites) {
          atoms.push({ position: oPos, element: 'O', color: oType.color, radius: oType.radius });

          const h1 = oPos.clone().add(new THREE.Vector3(hOffset * 0.82, hOffset * 0.57, 0));
          const h2 = oPos.clone().add(new THREE.Vector3(-hOffset * 0.82, hOffset * 0.57, 0));
          atoms.push({ position: h1, element: 'H', color: hType.color, radius: hType.radius });
          atoms.push({ position: h2, element: 'H', color: hType.color, radius: hType.radius });

          bonds.push({ start: oPos.clone(), end: h1.clone(), color: bondColor });
          bonds.push({ start: oPos.clone(), end: h2.clone(), color: bondColor });
        }
      }
    }
  }

  const oAtoms = atoms.filter((at) => at.element === 'O');
  const hBondCutoff = a * 0.75;
  for (let i = 0; i < oAtoms.length; i++) {
    for (let j = i + 1; j < oAtoms.length; j++) {
      const d = oAtoms[i].position.distanceTo(oAtoms[j].position);
      if (d > 0.4 && d < hBondCutoff) {
        bonds.push({ start: oAtoms[i].position.clone(), end: oAtoms[j].position.clone(), color: '#93c5fd' });
      }
    }
  }

  return { atoms, bonds };
}

// ── 23. Sợi Siêu Bền Kevlar (Poly-para-phenylene terephthalamide) ────────────
function generateKevlar(
  _a: number,
  _rx: number,
  _ry: number,
  layers: number,
  info: MaterialData['molecularInfo']
): { atoms: AtomInstance[]; bonds: BondInstance[] } {
  const atoms: AtomInstance[] = [];
  const bonds: BondInstance[] = [];
  const cType = info.atomTypes.find((t) => t.element === 'C') || info.atomTypes[0];
  const nType = info.atomTypes.find((t) => t.element === 'N') || info.atomTypes[1] || cType;
  const oType = info.atomTypes.find((t) => t.element === 'O') || info.atomTypes[2] || cType;
  const bondColor = info.bonds.color || '#fde047';

  const numChains = Math.min(Math.max(1, layers), 3);
  const unitsPerChain = 3;

  const chainOffsets: [number, number][] =
    layers === 1
      ? [[0, 0]]
      : layers === 2
      ? [[-1.8, 0], [1.8, 0]]
      : [[-3.2, 0], [0, 0], [3.2, 0]];

  const chainNList: THREE.Vector3[][] = [];
  const chainOList: THREE.Vector3[][] = [];

  for (let ch = 0; ch < numChains; ch++) {
    const [xBase, zBase] = chainOffsets[ch] || [0, 0];
    let prevNode: THREE.Vector3 | null = null;
    const currentN: THREE.Vector3[] = [];
    const currentO: THREE.Vector3[] = [];

    for (let u = 0; u < unitsPerChain; u++) {
      const yCenter = (u - (unitsPerChain - 1) / 2) * 2.8;

      // Benzene ring 6 Carbons
      const ringAtoms: THREE.Vector3[] = [];
      for (let i = 0; i < 6; i++) {
        const theta = (i * Math.PI) / 3;
        const pos = new THREE.Vector3(xBase + Math.cos(theta) * 0.7, yCenter + Math.sin(theta) * 0.7, zBase);
        atoms.push({ position: pos, element: 'C', color: cType.color, radius: cType.radius });
        ringAtoms.push(pos);
      }

      for (let i = 0; i < 6; i++) {
        bonds.push({ start: ringAtoms[i].clone(), end: ringAtoms[(i + 1) % 6].clone(), color: bondColor });
      }

      // Amide bridges -NH- and -CO-
      const nPos = new THREE.Vector3(xBase, yCenter + 1.1, zBase);
      atoms.push({ position: nPos, element: 'N', color: nType.color, radius: nType.radius });
      bonds.push({ start: ringAtoms[1].clone(), end: nPos.clone(), color: bondColor });
      currentN.push(nPos);

      const cAmide = new THREE.Vector3(xBase, yCenter - 1.1, zBase);
      const oPos = new THREE.Vector3(xBase + 0.5, yCenter - 1.3, zBase);
      atoms.push({ position: cAmide, element: 'C', color: cType.color, radius: cType.radius });
      atoms.push({ position: oPos, element: 'O', color: oType.color, radius: oType.radius });
      bonds.push({ start: ringAtoms[4].clone(), end: cAmide.clone(), color: bondColor });
      bonds.push({ start: cAmide.clone(), end: oPos.clone(), color: '#ef4444' });
      currentO.push(oPos);

      if (prevNode) {
        bonds.push({ start: prevNode.clone(), end: cAmide.clone(), color: bondColor });
      }
      prevNode = nPos;
    }
    chainNList.push(currentN);
    chainOList.push(currentO);
  }

  // Inter-chain hydrogen bonding N···O between adjacent Kevlar chains
  for (let ch = 0; ch < numChains - 1; ch++) {
    const listA = chainNList[ch];
    const listB = chainOList[ch + 1];
    const minLen = Math.min(listA.length, listB.length);
    for (let u = 0; u < minLen; u++) {
      bonds.push({
        start: listA[u].clone(),
        end: listB[u].clone(),
        color: '#38bdf8',
      });
    }
  }

  return { atoms, bonds };
}
