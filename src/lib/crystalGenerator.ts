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

export function generateCrystalStructure(
  material: MaterialData,
  layerCount: 1 | 2 | 3 = 3
): {
  atoms: AtomInstance[];
  bonds: BondInstance[];
} {
  const { structure, molecularInfo } = material;
  const { latticeConstant: a, repeatX: rx, repeatY: ry, repeatZ: originalRz } = structure;

  // For 3D view use at least 3 repeats, for 2 use 2, for 1 use 1
  // Also enforce minimum repeats for a clear overview: at least 3x3x3
  const minRepeat = 3;
  const effectiveRx = layerCount === 1 ? Math.max(3, rx) : Math.max(minRepeat, rx);
  const effectiveRy = layerCount === 1 ? Math.max(3, ry) : Math.max(minRepeat, ry);
  const rz = layerCount === 1 ? 1 : layerCount === 2 ? 2 : Math.max(minRepeat, originalRz);

  let result: { atoms: AtomInstance[]; bonds: BondInstance[] };

  switch (structure.type) {
    case 'fcc':
      result = generateFCC(a, effectiveRx, effectiveRy, rz, molecularInfo);
      break;
    case 'bcc':
      result = generateBCC(a, effectiveRx, effectiveRy, rz, molecularInfo);
      break;
    case 'diamond':
      result = generateDiamond(a, effectiveRx, effectiveRy, rz, molecularInfo);
      break;
    case 'silica':
      result = generateSilica(a, effectiveRx, effectiveRy, rz, molecularInfo);
      break;
    case 'nacl':
      result = generateNaCl(a, effectiveRx, effectiveRy, rz, molecularInfo);
      break;
    case 'hexagonal':
    case 'graphene':
      result = generateGraphene(a, Math.max(4, effectiveRx), Math.max(4, effectiveRy), layerCount, molecularInfo);
      break;
    case 'ice':
      result = generateIce(a, effectiveRx, effectiveRy, rz, molecularInfo);
      break;
    case 'hcp':
      result = generateHCP(a, effectiveRx, effectiveRy, rz, molecularInfo);
      break;
    case 'cnt':
      result = generateCNT(a, effectiveRx, effectiveRy, layerCount, molecularInfo);
      break;
    default:
      result = generateFCC(a, effectiveRx, effectiveRy, rz, molecularInfo);
      break;
  }

  // ── Normalize & Center Lattice for 100% Guaranteed Frustum Overview ───────
  // Regardless of lattice constant (1.4Å to 5.4Å), bounds are normalized so
  // max span is ~2.7 units. At camera distance 3.8, it fills 65% of screen height.
  // This completely eliminates clipping and giant atom blobs at max zoom!
  if (result.atoms.length > 0) {
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;
    let minZ = Infinity, maxZ = -Infinity;

    for (let i = 0; i < result.atoms.length; i++) {
      const p = result.atoms[i].position;
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

    const targetSpan = 2.3;
    const scale = targetSpan / maxSpan;

    for (let i = 0; i < result.atoms.length; i++) {
      const atom = result.atoms[i];
      atom.position.x = (atom.position.x - centerX) * scale;
      atom.position.y = (atom.position.y - centerY) * scale;
      atom.position.z = (atom.position.z - centerZ) * scale;
      // Proportional atom radius (ball-and-stick model)
      atom.radius = Math.max(0.09, Math.min(0.17, atom.radius * scale * 1.05));
    }

    for (let i = 0; i < result.bonds.length; i++) {
      const bond = result.bonds[i];
      bond.start.x = (bond.start.x - centerX) * scale;
      bond.start.y = (bond.start.y - centerY) * scale;
      bond.start.z = (bond.start.z - centerZ) * scale;
      bond.end.x = (bond.end.x - centerX) * scale;
      bond.end.y = (bond.end.y - centerY) * scale;
      bond.end.z = (bond.end.z - centerZ) * scale;
    }
  }

  return result;
}

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
  const center = new THREE.Vector3((rx * a) / 2, (ry * a) / 2, (rz * a) / 2);

  const basis = [
    [0, 0, 0],
    [0.5, 0.5, 0],
    [0.5, 0, 0.5],
    [0, 0.5, 0.5],
  ];

  for (let ix = 0; ix < rx; ix++) {
    for (let iy = 0; iy < ry; iy++) {
      for (let iz = 0; iz < rz; iz++) {
        for (const [bx, by, bz] of basis) {
          const pos = new THREE.Vector3(
            (ix + bx) * a - center.x,
            (iy + by) * a - center.y,
            (iz + bz) * a - center.z
          );
          atoms.push({ position: pos, element: atomType.element, color: atomType.color, radius: atomType.radius });
        }
      }
    }
  }

  const cutoff = a * 0.75;
  for (let i = 0; i < atoms.length; i++) {
    for (let j = i + 1; j < atoms.length; j++) {
      const dist = atoms[i].position.distanceTo(atoms[j].position);
      if (dist < cutoff && dist > 0.01) {
        bonds.push({ start: atoms[i].position.clone(), end: atoms[j].position.clone(), color: info.bonds.color });
      }
    }
  }

  return { atoms, bonds };
}

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
  const center = new THREE.Vector3((rx * a) / 2, (ry * a) / 2, (rz * a) / 2);

  const basis = [
    [0, 0, 0],
    [0.5, 0.5, 0.5],
  ];

  for (let ix = 0; ix < rx; ix++) {
    for (let iy = 0; iy < ry; iy++) {
      for (let iz = 0; iz < rz; iz++) {
        for (const [bx, by, bz] of basis) {
          const pos = new THREE.Vector3(
            (ix + bx) * a - center.x,
            (iy + by) * a - center.y,
            (iz + bz) * a - center.z
          );
          atoms.push({ position: pos, element: atomType.element, color: atomType.color, radius: atomType.radius });
        }
      }
    }
  }

  const cutoff = a * 0.9;
  for (let i = 0; i < atoms.length; i++) {
    for (let j = i + 1; j < atoms.length; j++) {
      const dist = atoms[i].position.distanceTo(atoms[j].position);
      if (dist < cutoff && dist > 0.01) {
        bonds.push({ start: atoms[i].position.clone(), end: atoms[j].position.clone(), color: info.bonds.color });
      }
    }
  }

  return { atoms, bonds };
}

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
  const center = new THREE.Vector3((rx * a) / 2, (ry * a) / 2, (rz * a) / 2);

  const basis = [
    [0, 0, 0],
    [0.5, 0.5, 0],
    [0.5, 0, 0.5],
    [0, 0.5, 0.5],
    [0.25, 0.25, 0.25],
    [0.75, 0.75, 0.25],
    [0.75, 0.25, 0.75],
    [0.25, 0.75, 0.75],
  ];

  for (let ix = 0; ix < rx; ix++) {
    for (let iy = 0; iy < ry; iy++) {
      for (let iz = 0; iz < rz; iz++) {
        for (const [bx, by, bz] of basis) {
          const pos = new THREE.Vector3(
            (ix + bx) * a - center.x,
            (iy + by) * a - center.y,
            (iz + bz) * a - center.z
          );
          atoms.push({ position: pos, element: atomType.element, color: atomType.color, radius: atomType.radius });
        }
      }
    }
  }

  const cutoff = a * 0.5;
  for (let i = 0; i < atoms.length; i++) {
    for (let j = i + 1; j < atoms.length; j++) {
      const dist = atoms[i].position.distanceTo(atoms[j].position);
      if (dist < cutoff && dist > 0.01) {
        bonds.push({ start: atoms[i].position.clone(), end: atoms[j].position.clone(), color: info.bonds.color });
      }
    }
  }

  return { atoms, bonds };
}

function generateSilica(
  a: number,
  rx: number,
  ry: number,
  rz: number,
  info: MaterialData['molecularInfo']
): { atoms: AtomInstance[]; bonds: BondInstance[] } {
  const atoms: AtomInstance[] = [];
  const bonds: BondInstance[] = [];
  const siType = info.atomTypes[0];
  const oType = info.atomTypes[1] || { element: 'O', color: '#eb4d4b', radius: 0.28 };
  const center = new THREE.Vector3((rx * a) / 2, (ry * a) / 2, (rz * a) / 2);

  // Silicon sublattice (Diamond cubic basis)
  const basis = [
    [0, 0, 0],
    [0.5, 0.5, 0],
    [0.5, 0, 0.5],
    [0, 0.5, 0.5],
    [0.25, 0.25, 0.25],
    [0.75, 0.75, 0.25],
    [0.75, 0.25, 0.75],
    [0.25, 0.75, 0.75],
  ];

  const siPositions: THREE.Vector3[] = [];

  for (let ix = 0; ix < rx; ix++) {
    for (let iy = 0; iy < ry; iy++) {
      for (let iz = 0; iz < rz; iz++) {
        for (const [bx, by, bz] of basis) {
          const pos = new THREE.Vector3(
            (ix + bx) * a - center.x,
            (iy + by) * a - center.y,
            (iz + bz) * a - center.z
          );
          siPositions.push(pos);
          atoms.push({
            position: pos,
            element: siType.element,
            color: siType.color,
            radius: siType.radius,
          });
        }
      }
    }
  }

  // Oxygen atoms bridge nearest-neighbor Si-Si pairs (tetrahedral coordination SiO4)
  const cutoff = a * 0.5;
  const oSet = new Set<string>();

  for (let i = 0; i < siPositions.length; i++) {
    for (let j = i + 1; j < siPositions.length; j++) {
      const p1 = siPositions[i];
      const p2 = siPositions[j];
      const dist = p1.distanceTo(p2);

      if (dist < cutoff && dist > 0.01) {
        // Oxygen position at midpoint between Si atoms with realistic 144 deg bent angle
        const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
        const bondVec = new THREE.Vector3().subVectors(p2, p1).normalize();
        const perp = new THREE.Vector3(bondVec.y, -bondVec.x, bondVec.z).normalize();
        if (perp.length() < 0.1) perp.set(0, bondVec.z, -bondVec.y).normalize();
        mid.addScaledVector(perp, 0.06);

        const key = `${mid.x.toFixed(2)}_${mid.y.toFixed(2)}_${mid.z.toFixed(2)}`;
        if (!oSet.has(key)) {
          oSet.add(key);
          atoms.push({
            position: mid,
            element: oType.element,
            color: oType.color,
            radius: oType.radius,
          });

          // Si1 - O bond
          bonds.push({
            start: p1.clone(),
            end: mid.clone(),
            color: info.bonds.color,
          });
          // O - Si2 bond
          bonds.push({
            start: mid.clone(),
            end: p2.clone(),
            color: info.bonds.color,
          });
        }
      }
    }
  }

  return { atoms, bonds };
}

function generateNaCl(
  a: number,
  rx: number,
  ry: number,
  rz: number,
  info: MaterialData['molecularInfo']
): { atoms: AtomInstance[]; bonds: BondInstance[] } {
  const atoms: AtomInstance[] = [];
  const bonds: BondInstance[] = [];
  const center = new THREE.Vector3((rx * a) / 2, (ry * a) / 2, (rz * a) / 2);

  for (let ix = 0; ix < rx; ix++) {
    for (let iy = 0; iy < ry; iy++) {
      for (let iz = 0; iz < rz; iz++) {
        const naBasis = [
          [0, 0, 0],
          [0.5, 0.5, 0],
          [0.5, 0, 0.5],
          [0, 0.5, 0.5],
        ];
        for (const [bx, by, bz] of naBasis) {
          const pos = new THREE.Vector3(
            (ix + bx) * a - center.x,
            (iy + by) * a - center.y,
            (iz + bz) * a - center.z
          );
          atoms.push({
            position: pos,
            element: info.atomTypes[0].element,
            color: info.atomTypes[0].color,
            radius: info.atomTypes[0].radius,
          });
        }
        const clBasis = [
          [0.5, 0, 0],
          [0, 0.5, 0],
          [0, 0, 0.5],
          [0.5, 0.5, 0.5],
        ];
        for (const [bx, by, bz] of clBasis) {
          const pos = new THREE.Vector3(
            (ix + bx) * a - center.x,
            (iy + by) * a - center.y,
            (iz + bz) * a - center.z
          );
          atoms.push({
            position: pos,
            element: info.atomTypes[1].element,
            color: info.atomTypes[1].color,
            radius: info.atomTypes[1].radius,
          });
        }
      }
    }
  }

  const cutoff = a * 0.55;
  for (let i = 0; i < atoms.length; i++) {
    for (let j = i + 1; j < atoms.length; j++) {
      if (atoms[i].element !== atoms[j].element) {
        const dist = atoms[i].position.distanceTo(atoms[j].position);
        if (dist < cutoff && dist > 0.01) {
          bonds.push({ start: atoms[i].position.clone(), end: atoms[j].position.clone(), color: info.bonds.color });
        }
      }
    }
  }

  return { atoms, bonds };
}

function generateGraphene(
  a: number,
  rx: number,
  ry: number,
  layerCount: number,
  info: MaterialData['molecularInfo']
): { atoms: AtomInstance[]; bonds: BondInstance[] } {
  const atoms: AtomInstance[] = [];
  const bonds: BondInstance[] = [];
  const atomType = info.atomTypes[0];

  // Scale up lattice constant for visibility (graphene bonds are tiny in real units)
  const aScaled = a * 0.85;
  const a1 = new THREE.Vector3(aScaled * Math.sqrt(3), 0, 0);
  const a2 = new THREE.Vector3((aScaled * Math.sqrt(3)) / 2, aScaled * 1.5, 0);

  const basis = [
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3((aScaled * Math.sqrt(3)) / 2, aScaled * 0.5, 0),
  ];

  const centerX = (rx * aScaled * Math.sqrt(3)) / 2;
  const centerY = (ry * aScaled * 1.5) / 2;

  const layers = Math.min(3, Math.max(1, layerCount || 1));
  const layerSpacing = aScaled * 1.4;

  for (let layer = 0; layer < layers; layer++) {
    const shiftX = layer % 2 === 1 ? (aScaled * Math.sqrt(3)) / 3 : 0;
    const yPos = (layer - (layers - 1) / 2) * layerSpacing;

    for (let ix = 0; ix < rx; ix++) {
      for (let iy = 0; iy < ry; iy++) {
        for (const b of basis) {
          const pos = new THREE.Vector3(
            a1.x * ix + a2.x * iy + b.x - centerX + shiftX,
            yPos,
            a1.y * ix + a2.y * iy + b.y - centerY
          );
          atoms.push({
            position: pos,
            element: atomType.element,
            color: atomType.color,
            radius: Math.max(0.18, atomType.radius * 0.75),
          });
        }
      }
    }
  }

  // Intra-layer covalent bonds
  const cutoff = aScaled * 1.15;
  for (let i = 0; i < atoms.length; i++) {
    for (let j = i + 1; j < atoms.length; j++) {
      if (Math.abs(atoms[i].position.y - atoms[j].position.y) < 0.15) {
        const dist = atoms[i].position.distanceTo(atoms[j].position);
        if (dist < cutoff && dist > 0.01) {
          bonds.push({ start: atoms[i].position.clone(), end: atoms[j].position.clone(), color: info.bonds.color });
        }
      }
    }
  }

  return { atoms, bonds };
}

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
  const c = a * 1.633; // c/a ideal ratio for HCP

  const a1 = new THREE.Vector3(a, 0, 0);
  const a2 = new THREE.Vector3(a * 0.5, a * (Math.sqrt(3) / 2), 0);

  const centerX = (rx * a) / 2;
  const centerY = (ry * a * (Math.sqrt(3) / 2)) / 2;
  const centerZ = (rz * c) / 2;

  for (let iz = 0; iz < rz; iz++) {
    const isOdd = iz % 2 === 1;
    for (let ix = 0; ix < rx; ix++) {
      for (let iy = 0; iy < ry; iy++) {
        // Base atom
        const pos = new THREE.Vector3(
          ix * a1.x + iy * a2.x - centerX + (isOdd ? a * 0.5 : 0),
          ix * a1.y + iy * a2.y - centerY + (isOdd ? (a * Math.sqrt(3)) / 6 : 0),
          iz * (c / 2) - centerZ
        );
        atoms.push({ position: pos, element: atomType.element, color: atomType.color, radius: atomType.radius });
      }
    }
  }

  const cutoff = a * 1.05;
  for (let i = 0; i < atoms.length; i++) {
    for (let j = i + 1; j < atoms.length; j++) {
      const dist = atoms[i].position.distanceTo(atoms[j].position);
      if (dist < cutoff && dist > 0.01) {
        bonds.push({ start: atoms[i].position.clone(), end: atoms[j].position.clone(), color: info.bonds.color });
      }
    }
  }

  return { atoms, bonds };
}

function generateCNT(
  _a: number,
  _rx: number,
  _ry: number,
  layerCount: number,
  info: MaterialData['molecularInfo']
): { atoms: AtomInstance[]; bonds: BondInstance[] } {
  const atoms: AtomInstance[] = [];
  const bonds: BondInstance[] = [];
  const atomType = info.atomTypes[0];

  // Shell radiuses for 1-wall (SWCNT), 2-wall (DWCNT), or 3-wall (MWCNT)
  const shellCount = Math.min(3, Math.max(1, layerCount || 1));
  const radiuses = shellCount === 1 ? [1.0] : shellCount === 2 ? [0.72, 1.15] : [0.55, 0.88, 1.25];
  const rings = 12;
  const ringHeight = 0.35;

  for (let s = 0; s < shellCount; s++) {
    const radius = radiuses[s];
    const atomsPerRing = Math.round(10 * (radius / 1.0));

    for (let ring = 0; ring < rings; ring++) {
      const y = (ring - rings / 2) * ringHeight;
      const angleOffset = (ring % 2) * (Math.PI / atomsPerRing) + s * 0.3;

      for (let i = 0; i < atomsPerRing; i++) {
        const theta = (i * 2 * Math.PI) / atomsPerRing + angleOffset;
        const x = radius * Math.cos(theta);
        const z = radius * Math.sin(theta);
        atoms.push({
          position: new THREE.Vector3(x, y, z),
          element: atomType.element,
          color: atomType.color,
          radius: atomType.radius * (shellCount > 1 ? 0.8 : 1.0),
        });
      }
    }
  }

  const cutoff = 0.78;
  for (let i = 0; i < atoms.length; i++) {
    for (let j = i + 1; j < atoms.length; j++) {
      const r_i = Math.sqrt(atoms[i].position.x ** 2 + atoms[i].position.z ** 2);
      const r_j = Math.sqrt(atoms[j].position.x ** 2 + atoms[j].position.z ** 2);
      if (Math.abs(r_i - r_j) < 0.25) {
        const dist = atoms[i].position.distanceTo(atoms[j].position);
        if (dist < cutoff && dist > 0.01) {
          bonds.push({ start: atoms[i].position.clone(), end: atoms[j].position.clone(), color: info.bonds.color });
        }
      }
    }
  }

  return { atoms, bonds };
}

function generateIce(
  a: number,
  rx: number,
  ry: number,
  rz: number,
  info: MaterialData['molecularInfo']
): { atoms: AtomInstance[]; bonds: BondInstance[] } {
  const atoms: AtomInstance[] = [];
  const bonds: BondInstance[] = [];
  const center = new THREE.Vector3((rx * a) / 2, (ry * a) / 2, (rz * a) / 2);

  const oBasis = [
    [0, 0, 0],
    [0.5, 0.5, 0],
    [0.25, 0.25, 0.5],
    [0.75, 0.75, 0.5],
  ];

  for (let ix = 0; ix < rx; ix++) {
    for (let iy = 0; iy < ry; iy++) {
      for (let iz = 0; iz < rz; iz++) {
        for (const [bx, by, bz] of oBasis) {
          const oPos = new THREE.Vector3(
            (ix + bx) * a - center.x,
            (iy + by) * a - center.y,
            (iz + bz) * a - center.z
          );
          atoms.push({ position: oPos, element: 'O', color: info.atomTypes[0].color, radius: info.atomTypes[0].radius });

          const hOffset = 0.3;
          const h1Pos = oPos.clone().add(new THREE.Vector3(hOffset * 0.8, hOffset * 0.6, 0));
          const h2Pos = oPos.clone().add(new THREE.Vector3(-hOffset * 0.8, hOffset * 0.6, 0));
          atoms.push({ position: h1Pos, element: 'H', color: info.atomTypes[1].color, radius: info.atomTypes[1].radius });
          atoms.push({ position: h2Pos, element: 'H', color: info.atomTypes[1].color, radius: info.atomTypes[1].radius });

          bonds.push({ start: oPos.clone(), end: h1Pos.clone(), color: '#ffffff' });
          bonds.push({ start: oPos.clone(), end: h2Pos.clone(), color: '#ffffff' });
        }
      }
    }
  }

  const hBondCutoff = a * 0.65;
  const oAtoms = atoms.filter((at) => at.element === 'O');
  for (let i = 0; i < oAtoms.length; i++) {
    for (let j = i + 1; j < oAtoms.length; j++) {
      const dist = oAtoms[i].position.distanceTo(oAtoms[j].position);
      if (dist < hBondCutoff && dist > 0.3) {
        bonds.push({ start: oAtoms[i].position.clone(), end: oAtoms[j].position.clone(), color: info.bonds.color });
      }
    }
  }

  return { atoms, bonds };
}
