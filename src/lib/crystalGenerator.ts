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
 * Universal Crystal Structure Generator for 15 Familiar Real-World Materials.
 * Generates textbook-accurate crystallographic lattices with authentic VESTA/Materials Project proportions.
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
  const rz = structure.repeatZ || 2;

  let result: { atoms: AtomInstance[]; bonds: BondInstance[] };

  switch (structure.type) {
    case 'cnt':
      result = generateCarbonNanotube(a, rx, ry, molecularInfo);
      break;
    case 'buckyball':
      result = generateBuckyballC60(a, molecularInfo);
      break;
    case 'perovskite':
      result = generatePerovskite(a, rx, ry, rz, molecularInfo);
      break;
    case 'aerogel':
      result = generateAerogel(a, rx, ry, rz, molecularInfo);
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
      result = generateQuartz(a, rx, ry, rz, molecularInfo);
      break;
    case 'mxene':
    case 'ice':
      result = generateMXene(a, rx, ry, layerCount, molecularInfo);
      break;
    case 'fcc':
      result = generateFCC(a, rx, ry, rz, molecularInfo);
      break;
    case 'bcc':
      result = generateBCC(a, rx, ry, rz, molecularInfo);
      break;
    case 'hcp':
      result = generateHCP(a, rx, ry, rz, molecularInfo);
      break;
    case 'teflon':
      result = generateTeflon(a, rx, ry, molecularInfo);
      break;
    case 'battery':
      result = generateBatteryLCO(a, rx, ry, rz, molecularInfo);
      break;
    case 'corundum':
      result = generateAlumina(a, rx, ry, rz, molecularInfo);
      break;
    case 'polymer-rubber':
      result = generateVulcanizedRubber(a, rx, ry, molecularInfo);
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

    // Calculate average bond length after scaling
    let avgBondLen = 0.35;
    if (deduped.bonds.length > 0) {
      let totalLen = 0;
      for (const b of deduped.bonds) {
        totalLen += b.start.distanceTo(b.end) * scale;
      }
      avgBondLen = totalLen / deduped.bonds.length;
    }

    // Atom ball radius: strictly 28% to 32% of bond length for elegant Ball-and-Stick clarity
    const targetRadius = Math.max(0.052, Math.min(0.082, avgBondLen * 0.32));

    for (let i = 0; i < deduped.atoms.length; i++) {
      const atom = deduped.atoms[i];
      atom.position.x = (atom.position.x - centerX) * scale;
      atom.position.y = (atom.position.y - centerY) * scale;
      atom.position.z = (atom.position.z - centerZ) * scale;
      atom.radius = targetRadius;
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

// ── 1. Kim Cương & Silic (Mạng lập phương Kim Cương Diamond Cubic) ───────────
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

  // 8 Basis positions in standard diamond cubic unit cell
  const basis = [
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0.5, 0.5, 0),
    new THREE.Vector3(0.5, 0, 0.5),
    new THREE.Vector3(0, 0.5, 0.5),
    new THREE.Vector3(0.25, 0.25, 0.25),
    new THREE.Vector3(0.75, 0.75, 0.25),
    new THREE.Vector3(0.75, 0.25, 0.75),
    new THREE.Vector3(0.25, 0.75, 0.75),
  ];

  for (let ix = 0; ix < rx; ix++) {
    for (let iy = 0; iy < ry; iy++) {
      for (let iz = 0; iz < rz; iz++) {
        const origin = new THREE.Vector3(ix * a, iy * a, iz * a);
        for (const pt of basis) {
          const pos = origin.clone().add(pt.clone().multiplyScalar(a));
          atoms.push({
            position: pos,
            element: atomType.element,
            color: atomType.color,
            radius: atomType.radius,
          });
        }
      }
    }
  }

  // Connect nearest tetrahedral neighbors (bond distance = a * sqrt(3) / 4)
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

  // Interpenetrating Na+ and Cl- FCC sublattices
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

// ── 4. Đá Thạch Anh & Thủy Tinh (SiO₂ - Tinh thể Tam phương Quartz) ───────────
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

  // Hexagonal vectors in XZ plane
  const a1 = new THREE.Vector3(a, 0, 0);
  const a2 = new THREE.Vector3(a * 0.5, 0, (a * Math.sqrt(3)) * 0.5);

  // Sublayer heights within 5-layer Ti-C-Ti-C-Ti sheet
  const dy = 1.15;
  const layerSheetGap = 4.8;

  for (let l = 0; l < layers; l++) {
    const yCenter = (l - (layers - 1) * 0.5) * layerSheetGap;
    const sheetStartIndex = atoms.length;

    for (let i = 0; i < rx; i++) {
      for (let j = 0; j < ry; j++) {
        const ptOrigin = new THREE.Vector3().addScaledVector(a1, i).addScaledVector(a2, j);

        // Sublayer 1: Bottom Ti (site A)
        atoms.push({
          position: new THREE.Vector3(ptOrigin.x, yCenter - 2 * dy, ptOrigin.z),
          element: 'Ti',
          color: tiType.color,
          radius: tiType.radius,
        });

        // Sublayer 2: Lower C (site B)
        const ptB = ptOrigin.clone().addScaledVector(a1, 1 / 3).addScaledVector(a2, 2 / 3);
        atoms.push({
          position: new THREE.Vector3(ptB.x, yCenter - dy, ptB.z),
          element: 'C',
          color: cType.color,
          radius: cType.radius,
        });

        // Sublayer 3: Center Ti (site C)
        const ptC = ptOrigin.clone().addScaledVector(a1, 2 / 3).addScaledVector(a2, 1 / 3);
        atoms.push({
          position: new THREE.Vector3(ptC.x, yCenter, ptC.z),
          element: 'Ti',
          color: tiType.color,
          radius: tiType.radius,
        });

        // Sublayer 4: Upper C (site A)
        atoms.push({
          position: new THREE.Vector3(ptOrigin.x, yCenter + dy, ptOrigin.z),
          element: 'C',
          color: cType.color,
          radius: cType.radius,
        });

        // Sublayer 5: Top Ti (site B)
        atoms.push({
          position: new THREE.Vector3(ptB.x, yCenter + 2 * dy, ptB.z),
          element: 'Ti',
          color: tiType.color,
          radius: tiType.radius,
        });
      }
    }

    // Connect Ti-C octahedral bonds (cutoff ~2.45 Å)
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

// ── 6. Kim Loại Lập Phương Tâm Diện (FCC - Vàng Au, Đồng Cu, Nhôm Al) ─────────
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

  const fccBasis = [
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0.5, 0.5, 0),
    new THREE.Vector3(0.5, 0, 0.5),
    new THREE.Vector3(0, 0.5, 0.5),
  ];

  for (let ix = 0; ix < rx; ix++) {
    for (let iy = 0; iy < ry; iy++) {
      for (let iz = 0; iz < rz; iz++) {
        const origin = new THREE.Vector3(ix * a, iy * a, iz * a);
        for (const pt of fccBasis) {
          const pos = origin.clone().add(pt.clone().multiplyScalar(a));
          atoms.push({
            position: pos,
            element: atomType.element,
            color: atomType.color,
            radius: atomType.radius,
          });
        }
      }
    }
  }

  // Connect nearest neighbors (bond distance = a / sqrt(2))
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

// ── 7. Kim Loại Lập Phương Tâm Khối (BCC - Sắt & Thép Fe) ─────────────────────
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

  const bccBasis = [
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0.5, 0.5, 0.5),
  ];

  for (let ix = 0; ix < rx; ix++) {
    for (let iy = 0; iy < ry; iy++) {
      for (let iz = 0; iz < rz; iz++) {
        const origin = new THREE.Vector3(ix * a, iy * a, iz * a);
        for (const pt of bccBasis) {
          const pos = origin.clone().add(pt.clone().multiplyScalar(a));
          atoms.push({
            position: pos,
            element: atomType.element,
            color: atomType.color,
            radius: atomType.radius,
          });
        }
      }
    }
  }

  // Connect body center to 8 corners (bond distance = a * sqrt(3) / 2)
  const dBCC = (a * Math.sqrt(3)) / 2;
  const cutoff = dBCC * 1.10;

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

// ── 8. Kim Loại Lục Giác Xếp Chặt (HCP - Titan Ti) ───────────────────────────
function generateHCP(
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
  const c = a * 1.587; // Ideal Ti c/a ratio

  for (let iz = 0; iz < rz; iz++) {
    const yBase = iz * c;
    for (let iy = 0; iy < ry; iy++) {
      const zBase = iy * ((a * Math.sqrt(3)) / 2);
      for (let ix = 0; ix < rx; ix++) {
        const xBase = ix * a + (iy % 2) * (a * 0.5);

        // Layer A
        const ptA = new THREE.Vector3(xBase, yBase, zBase);
        atoms.push({ position: ptA, element: atomType.element, color: atomType.color, radius: atomType.radius });

        // Layer B
        const ptB = new THREE.Vector3(xBase + a / 3, yBase + c * 0.5, zBase + (a * Math.sqrt(3)) / 6);
        atoms.push({ position: ptB, element: atomType.element, color: atomType.color, radius: atomType.radius });
      }
    }
  }

  const cutoff = a * 1.05;
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

// ── 9. Chống Dính Teflon (PTFE - Chuỗi Polyme Xoắn Bọc Flo) ─────────────────
function generateTeflon(
  a: number,
  rx: number,
  ry: number,
  info: MaterialData['molecularInfo']
): { atoms: AtomInstance[]; bonds: BondInstance[] } {
  const atoms: AtomInstance[] = [];
  const bonds: BondInstance[] = [];
  const cType = info.atomTypes.find((t) => t.element === 'C') || info.atomTypes[0];
  const fType = info.atomTypes.find((t) => t.element === 'F') || info.atomTypes[1] || cType;
  const bondColor = info.bonds.color;

  const numChains = rx * ry;
  const chainLen = 8;
  const dCC = 1.54;
  const dCF = 1.35;

  for (let ch = 0; ch < numChains; ch++) {
    const xChain = (ch % rx - (rx - 1) / 2) * 2.8;
    const zChain = (Math.floor(ch / rx) - (ry - 1) / 2) * 2.8;

    let prevC: THREE.Vector3 | null = null;

    for (let i = 0; i < chainLen; i++) {
      const y = (i - chainLen / 2) * (dCC * 0.85);
      const angle = (i * Math.PI) / 3;
      const xC = xChain + Math.cos(angle) * 0.35;
      const zC = zChain + Math.sin(angle) * 0.35;
      const cPos = new THREE.Vector3(xC, y, zC);

      atoms.push({ position: cPos, element: 'C', color: cType.color, radius: cType.radius });

      if (prevC) {
        bonds.push({ start: prevC.clone(), end: cPos.clone(), color: bondColor });
      }
      prevC = cPos;

      // Two Fluorine atoms surrounding each Carbon
      const f1 = cPos.clone().add(new THREE.Vector3(Math.cos(angle + 1.2) * dCF, 0.2, Math.sin(angle + 1.2) * dCF));
      const f2 = cPos.clone().add(new THREE.Vector3(Math.cos(angle - 1.2) * dCF, -0.2, Math.sin(angle - 1.2) * dCF));

      atoms.push({ position: f1, element: 'F', color: fType.color, radius: fType.radius });
      atoms.push({ position: f2, element: 'F', color: fType.color, radius: fType.radius });

      bonds.push({ start: cPos.clone(), end: f1.clone(), color: '#38bdf8' });
      bonds.push({ start: cPos.clone(), end: f2.clone(), color: '#38bdf8' });
    }
  }

  return { atoms, bonds };
}

// ── 10. Pin Điện Thoại Lithium (LiCoO₂ - Mạng Oxit Lớp Chèn Xen) ──────────────
function generateBatteryLCO(
  a: number,
  rx: number,
  ry: number,
  rz: number,
  info: MaterialData['molecularInfo']
): { atoms: AtomInstance[]; bonds: BondInstance[] } {
  const atoms: AtomInstance[] = [];
  const bonds: BondInstance[] = [];
  const coType = info.atomTypes.find((t) => t.element === 'Co') || info.atomTypes[0];
  const oType = info.atomTypes.find((t) => t.element === 'O') || info.atomTypes[1] || coType;
  const liType = info.atomTypes.find((t) => t.element === 'Li') || info.atomTypes[2] || coType;
  const bondColor = info.bonds.color;

  const dx = a;
  const dz = (a * Math.sqrt(3)) / 2;
  const layerGap = 2.6;

  for (let l = 0; l < rz; l++) {
    const yBase = (l - (rz - 1) / 2) * layerGap;

    const yO_top = yBase + 0.65;
    const yCo = yBase;
    const yO_bot = yBase - 0.65;
    const yLi = yBase + layerGap * 0.5;

    for (let r = 0; r < ry; r++) {
      for (let c = 0; c < rx; c++) {
        const x = c * dx + (r % 2) * (dx / 2);
        const z = r * dz;

        const coPos = new THREE.Vector3(x, yCo, z);
        atoms.push({ position: coPos, element: 'Co', color: coType.color, radius: coType.radius });

        const oTop = new THREE.Vector3(x + dx * 0.33, yO_top, z + dz * 0.33);
        const oBot = new THREE.Vector3(x + dx * 0.33, yO_bot, z + dz * 0.33);
        atoms.push({ position: oTop, element: 'O', color: oType.color, radius: oType.radius });
        atoms.push({ position: oBot, element: 'O', color: oType.color, radius: oType.radius });

        bonds.push({ start: coPos.clone(), end: oTop.clone(), color: bondColor });
        bonds.push({ start: coPos.clone(), end: oBot.clone(), color: bondColor });

        // Mobile Li+ ions in the intermediate channel
        if (l < rz - 1) {
          const liPos = new THREE.Vector3(x + dx * 0.66, yLi, z + dz * 0.66);
          atoms.push({ position: liPos, element: 'Li', color: liType.color, radius: liType.radius });
        }
      }
    }
  }

  return { atoms, bonds };
}

// ── 11. Gốm Sứ Kỹ Thuật (Al₂O₃ - Tinh Thể Corundum Siêu Bền) ─────────────────
function generateAlumina(
  a: number,
  rx: number,
  ry: number,
  rz: number,
  info: MaterialData['molecularInfo']
): { atoms: AtomInstance[]; bonds: BondInstance[] } {
  const atoms: AtomInstance[] = [];
  const bonds: BondInstance[] = [];
  const alType = info.atomTypes.find((t) => t.element === 'Al') || info.atomTypes[0];
  const oType = info.atomTypes.find((t) => t.element === 'O') || info.atomTypes[1] || alType;
  const bondColor = info.bonds.color;
  const c = a * 2.73;

  for (let ix = 0; ix < rx; ix++) {
    for (let iy = 0; iy < ry; iy++) {
      for (let iz = 0; iz < rz; iz++) {
        const xBase = ix * a + (iy % 2) * (a * 0.5);
        const zBase = iy * ((a * Math.sqrt(3)) / 2);
        const yBase = iz * c * 0.33;

        const al1 = new THREE.Vector3(xBase, yBase, zBase);
        const al2 = new THREE.Vector3(xBase + a * 0.33, yBase + c * 0.16, zBase + (a * Math.sqrt(3)) / 6);
        atoms.push({ position: al1, element: 'Al', color: alType.color, radius: alType.radius });
        atoms.push({ position: al2, element: 'Al', color: alType.color, radius: alType.radius });

        const o1 = new THREE.Vector3(xBase + a * 0.5, yBase + c * 0.08, zBase);
        const o2 = new THREE.Vector3(xBase - a * 0.2, yBase + c * 0.08, zBase + (a * Math.sqrt(3)) / 4);
        const o3 = new THREE.Vector3(xBase + a * 0.2, yBase + c * 0.24, zBase - (a * Math.sqrt(3)) / 4);

        atoms.push({ position: o1, element: 'O', color: oType.color, radius: oType.radius });
        atoms.push({ position: o2, element: 'O', color: oType.color, radius: oType.radius });
        atoms.push({ position: o3, element: 'O', color: oType.color, radius: oType.radius });

        bonds.push({ start: al1.clone(), end: o1.clone(), color: bondColor });
        bonds.push({ start: al1.clone(), end: o2.clone(), color: bondColor });
        bonds.push({ start: al2.clone(), end: o1.clone(), color: bondColor });
        bonds.push({ start: al2.clone(), end: o3.clone(), color: bondColor });
      }
    }
  }

  return { atoms, bonds };
}

// ── 12. Cao Su Lưu Hóa Đàn Hồi (Mạng Polyme Nối Chéo Cầu Lưu Huỳnh –S–S–) ────
function generateVulcanizedRubber(
  a: number,
  rx: number,
  ry: number,
  info: MaterialData['molecularInfo']
): { atoms: AtomInstance[]; bonds: BondInstance[] } {
  const atoms: AtomInstance[] = [];
  const bonds: BondInstance[] = [];
  const cType = info.atomTypes.find((t) => t.element === 'C') || info.atomTypes[0];
  const sType = info.atomTypes.find((t) => t.element === 'S') || info.atomTypes[2] || cType;
  const bondColor = info.bonds.color;

  const chainNodes: THREE.Vector3[][] = [];
  const numChains = rx * ry;
  const nodesPerChain = 7;

  for (let ch = 0; ch < numChains; ch++) {
    const xBase = (ch % rx - (rx - 1) / 2) * 2.5;
    const zBase = (Math.floor(ch / rx) - (ry - 1) / 2) * 2.5;
    const currentChain: THREE.Vector3[] = [];

    let prevPos: THREE.Vector3 | null = null;
    for (let i = 0; i < nodesPerChain; i++) {
      const y = (i - nodesPerChain / 2) * 0.85;
      const xWiggle = xBase + Math.sin(i * 1.6 + ch) * 0.5;
      const zWiggle = zBase + Math.cos(i * 1.4 + ch) * 0.5;
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

    const midIdx = Math.floor(nodesPerChain / 2);
    const pA = chainA[midIdx];
    const pB = chainB[midIdx];

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

// ── 13. Ống Nano Carbon Đơn Vách (SWCNT Armchair (6,6) Chuẩn Wikipedia) ─────
function generateCarbonNanotube(
  _a: number,
  rx: number,
  _ry: number,
  info: MaterialData['molecularInfo']
): { atoms: AtomInstance[]; bonds: BondInstance[] } {
  const atoms: AtomInstance[] = [];
  const bonds: BondInstance[] = [];
  const atomType = info.atomTypes[0];
  const bondColor = info.bonds.color;

  const n = 6;
  const numAtomsPerRing = n * 2; // 12 atoms around circumference
  const dCC = 1.42;
  const radius = (n * Math.sqrt(3) * dCC) / (2 * Math.PI); // ≈ 2.35 Å
  const numLayers = Math.max(10, rx * 5);

  for (let l = 0; l < numLayers; l++) {
    const yBase = (l - numLayers / 2) * (dCC * 0.866);
    const isOdd = l % 2 === 1;

    for (let i = 0; i < numAtomsPerRing; i++) {
      const angleOffset = isOdd ? Math.PI / numAtomsPerRing : 0;
      const theta = (i * 2 * Math.PI) / numAtomsPerRing + angleOffset;
      const x = radius * Math.cos(theta);
      const z = radius * Math.sin(theta);

      atoms.push({
        position: new THREE.Vector3(x, yBase, z),
        element: atomType.element,
        color: atomType.color,
        radius: atomType.radius,
      });
    }
  }

  // Connect nearest neighbors (bond distance ≈ 1.42 Å)
  const cutoff = dCC * 1.25;
  for (let i = 0; i < atoms.length; i++) {
    for (let j = i + 1; j < atoms.length; j++) {
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

  return { atoms, bonds };
}

// ── 14. Buckyball Fullerene C₆₀ (Khối 20 Mặt Cụt Chuẩn Wikipedia) ───────────
function generateBuckyballC60(
  _a: number,
  info: MaterialData['molecularInfo']
): { atoms: AtomInstance[]; bonds: BondInstance[] } {
  const atoms: AtomInstance[] = [];
  const bonds: BondInstance[] = [];
  const atomType = info.atomTypes[0];
  const bondColor = info.bonds.color;

  const phi = (1 + Math.sqrt(5)) / 2; // Tỷ lệ vàng Golden Ratio ≈ 1.6180339887
  const rawCoords: [number, number, number][] = [];
  const signs = [-1, 1];

  // Nhóm 1: Các hoán vị chẵn của (0, ±1, ±3phi) -> 12 đỉnh
  for (const s1 of signs) {
    for (const s2 of signs) {
      rawCoords.push([0, s1 * 1, s2 * 3 * phi]);
      rawCoords.push([s2 * 3 * phi, 0, s1 * 1]);
      rawCoords.push([s1 * 1, s2 * 3 * phi, 0]);
    }
  }

  // Nhóm 2: Các hoán vị chẵn của (±2, ±(1+2phi), ±phi) -> 24 đỉnh
  for (const s1 of signs) {
    for (const s2 of signs) {
      for (const s3 of signs) {
        rawCoords.push([s1 * 2, s2 * (1 + 2 * phi), s3 * phi]);
        rawCoords.push([s3 * phi, s1 * 2, s2 * (1 + 2 * phi)]);
        rawCoords.push([s2 * (1 + 2 * phi), s3 * phi, s1 * 2]);
      }
    }
  }

  // Nhóm 3: Các hoán vị chẵn của (±1, ±(2+phi), ±2phi) -> 24 đỉnh
  for (const s1 of signs) {
    for (const s2 of signs) {
      for (const s3 of signs) {
        rawCoords.push([s1 * 1, s2 * (2 + phi), s3 * 2 * phi]);
        rawCoords.push([s3 * 2 * phi, s1 * 1, s2 * (2 + phi)]);
        rawCoords.push([s2 * (2 + phi), s3 * 2 * phi, s1 * 1]);
      }
    }
  }

  // Bán kính phân tử C60 thực nghiệm theo crystallography = 3.54 Å
  const baseNorm = Math.sqrt(1 + 9 * phi * phi);
  const scale = 3.54 / baseNorm;

  for (const c of rawCoords) {
    atoms.push({
      position: new THREE.Vector3(c[0] * scale, c[1] * scale, c[2] * scale),
      element: atomType.element,
      color: atomType.color,
      radius: atomType.radius,
    });
  }

  // Trong C60, mỗi nguyên tử liên kết với đúng 3 nguyên tử kề (khoảng cách 1.40 - 1.45 Å)
  const cutoff = 1.62;
  for (let i = 0; i < atoms.length; i++) {
    for (let j = i + 1; j < atoms.length; j++) {
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

  return { atoms, bonds };
}

// ── 15. Tinh Thể Perovskite Quang Điện (Cubic Pm-3m - CH₃NH₃PbI₃) ─────────────
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

        // Cation B (Pb²⁺) tại các góc (0,0,0)
        const bPos = new THREE.Vector3(ox, oy, oz);
        atoms.push({ position: bPos, element: bType.element, color: bType.color, radius: bType.radius });

        // Anion X (I⁻) tại trung điểm 12 cạnh
        const x1 = new THREE.Vector3(ox + half, oy, oz);
        const x2 = new THREE.Vector3(ox, oy + half, oz);
        const x3 = new THREE.Vector3(ox, oy, oz + half);
        atoms.push({ position: x1, element: xType.element, color: xType.color, radius: xType.radius });
        atoms.push({ position: x2, element: xType.element, color: xType.color, radius: xType.radius });
        atoms.push({ position: x3, element: xType.element, color: xType.color, radius: xType.radius });

        // Liên kết phối trí bát diện Pb-I
        bonds.push({ start: bPos.clone(), end: x1.clone(), color: bondColor });
        bonds.push({ start: bPos.clone(), end: x2.clone(), color: bondColor });
        bonds.push({ start: bPos.clone(), end: x3.clone(), color: bondColor });

        // Cation A (MA⁺ / CH₃NH₃⁺) tại tâm khối lập phương
        const aPos = new THREE.Vector3(ox + half, oy + half, oz + half);
        atoms.push({ position: aPos, element: aType.element, color: aType.color, radius: aType.radius });
      }
    }
  }

  // Bổ sung các đỉnh biên để hoàn chỉnh lồng bát diện
  const maxBx = rx * a;
  const maxBy = ry * a;
  const maxBz = rz * a;
  atoms.push({ position: new THREE.Vector3(maxBx, 0, 0), element: bType.element, color: bType.color, radius: bType.radius });
  atoms.push({ position: new THREE.Vector3(0, maxBy, 0), element: bType.element, color: bType.color, radius: bType.radius });
  atoms.push({ position: new THREE.Vector3(0, 0, maxBz), element: bType.element, color: bType.color, radius: bType.radius });
  atoms.push({ position: new THREE.Vector3(maxBx, maxBy, maxBz), element: bType.element, color: bType.color, radius: bType.radius });

  return { atoms, bonds };
}

// ── 16. Khói Đông Lạnh Aerogel (Mạng Xốp 3D Tứ Diện Nanoporous Silica Fractal) ─
function generateAerogel(
  a: number,
  _rx: number,
  _ry: number,
  _rz: number,
  info: MaterialData['molecularInfo']
): { atoms: AtomInstance[]; bonds: BondInstance[] } {
  const atoms: AtomInstance[] = [];
  const bonds: BondInstance[] = [];
  const siType = info.atomTypes.find((t) => t.element === 'Si') || info.atomTypes[0];
  const oType = info.atomTypes.find((t) => t.element === 'O') || info.atomTypes[1] || siType;
  const bondColor = info.bonds.color;

  const nodes: THREE.Vector3[] = [];
  const span = a * 2.2;

  // Tạo khung mạng nano xốp fractal 3D bất đối xứng với khoảng rỗng lớn
  for (let i = 0; i < 28; i++) {
    const angle = i * 2.39996; // Golden angle spiral
    const r = (0.65 + (i % 4) * 0.35) * span * 0.42;
    const y = ((i - 14) / 14) * span * 0.6;
    const x = r * Math.cos(angle);
    const z = r * Math.sin(angle);
    nodes.push(new THREE.Vector3(x, y, z));
  }

  for (const n of nodes) {
    atoms.push({ position: n.clone(), element: 'Si', color: siType.color, radius: siType.radius });
  }

  const cutoff = span * 0.52;
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

// ── 17. Hợp Kim Nhớ Hình Nitinol (Mạng Lập Phương Trật Tự B2 NiTi - CsCl Type) ──
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

        // Ni tại 8 đỉnh ô mạng
        const niPos = new THREE.Vector3(ox, oy, oz);
        atoms.push({ position: niPos, element: 'Ni', color: niType.color, radius: niType.radius });

        // Ti tại tâm khối (CsCl B2)
        const tiPos = new THREE.Vector3(ox + half, oy + half, oz + half);
        atoms.push({ position: tiPos, element: 'Ti', color: tiType.color, radius: tiType.radius });

        // Liên kết kim loại từ tâm khối Ti tới các đỉnh Ni
        bonds.push({ start: niPos.clone(), end: tiPos.clone(), color: bondColor });
      }
    }
  }

  // Kết nối phối trí 8 phương
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
