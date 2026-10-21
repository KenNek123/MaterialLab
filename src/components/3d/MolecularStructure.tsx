'use client';

import React, { useRef, useMemo, useEffect, useCallback } from 'react';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import { Billboard } from '@react-three/drei';
import * as THREE from 'three';
import { MaterialData, useStore, StoreState } from '@/store/useStore';
import { generateCrystalStructure } from '@/lib/crystalGenerator';
import { getElementInfo } from '@/data/elements';
import { sound } from '@/lib/soundFx';
import { zoomState } from './zoomState';

interface MolecularStructureProps {
  material: MaterialData;
  opacity?: number;
  scale?: number;
}

interface EnrichedBond {
  start: THREE.Vector3;
  end: THREE.Vector3;
  startAtomIdx: number;
  endAtomIdx: number;
  startRadius: number;
  endRadius: number;
  colorA: THREE.Color;
  colorB: THREE.Color;
}

// Pre-allocated reusable objects to avoid garbage collection in useFrame (Zero GC)
const tempBondObjects = {
  dummy: new THREE.Object3D(),
  up: new THREE.Vector3(0, 1, 0),
  dir: new THREE.Vector3(),
  unitDir: new THREE.Vector3(),
  quat: new THREE.Quaternion(),
  midA: new THREE.Vector3(),
  midB: new THREE.Vector3(),
};

const tempAtomObjects = {
  dummy: new THREE.Object3D(),
};

function computeHalfBondMatrices(
  pA: THREE.Vector3,
  pB: THREE.Vector3,
  rA: number,
  rB: number,
  thickness: number,
  bondIdx: number,
  mesh: THREE.InstancedMesh
) {
  const { dummy, up, dir, unitDir, quat, midA, midB } = tempBondObjects;

  dir.subVectors(pB, pA);
  const L = dir.length();
  if (L < 0.0001) {
    dummy.scale.set(0, 0, 0);
    dummy.updateMatrix();
    mesh.setMatrixAt(bondIdx * 2, dummy.matrix);
    mesh.setMatrixAt(bondIdx * 2 + 1, dummy.matrix);
    return;
  }

  unitDir.copy(dir).divideScalar(L);
  quat.setFromUnitVectors(up, unitDir);

  // Split distance between atom surfaces
  const splitDist = THREE.MathUtils.clamp((L + rA - rB) * 0.5, L * 0.25, L * 0.75);

  // Half-Bond A: starts at pA + unitDir * (rA * 0.3), ends at pA + unitDir * (splitDist + 0.0015)
  const startDistA = rA * 0.3;
  const endDistA = splitDist + 0.0015;
  const lenA = Math.max(0.001, endDistA - startDistA);
  const midDistA = (startDistA + endDistA) * 0.5;
  midA.copy(pA).addScaledVector(unitDir, midDistA);

  dummy.position.copy(midA);
  dummy.quaternion.copy(quat);
  dummy.scale.set(thickness, lenA, thickness);
  dummy.updateMatrix();
  mesh.setMatrixAt(bondIdx * 2, dummy.matrix);

  // Half-Bond B: starts at pA + unitDir * (splitDist - 0.0015), ends at pB - unitDir * (rB * 0.3)
  const startDistB = splitDist - 0.0015;
  const endDistB = L - rB * 0.3;
  const lenB = Math.max(0.001, endDistB - startDistB);
  const midDistB = (startDistB + endDistB) * 0.5;
  midB.copy(pA).addScaledVector(unitDir, midDistB);

  dummy.position.copy(midB);
  dummy.quaternion.copy(quat);
  dummy.scale.set(thickness, lenB, thickness);
  dummy.updateMatrix();
  mesh.setMatrixAt(bondIdx * 2 + 1, dummy.matrix);
}

// Interactive Pulsing Attention Beacon on a selected atom in molecular view
function PulsingAtomBeacon({
  position,
  radius,
  onClick,
}: {
  position: THREE.Vector3;
  radius: number;
  onClick: () => void;
}) {
  const outerRippleRef = useRef<THREE.Mesh>(null);
  const innerRingRef = useRef<THREE.Mesh>(null);
  const glowSphereRef = useRef<THREE.Mesh>(null);
  const beaconPinRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    // Sonar pulse wave expanding and fading out
    const wave = (t * 1.5) % 1;
    const waveScale = 1.0 + wave * 1.6;
    const waveAlpha = Math.max(0, (1 - wave) * 0.9);

    if (outerRippleRef.current) {
      outerRippleRef.current.scale.setScalar(waveScale);
      (outerRippleRef.current.material as THREE.MeshBasicMaterial).opacity = waveAlpha;
    }

    if (innerRingRef.current) {
      // Rapid heartbeat pulse
      const breathe = 1.0 + Math.sin(t * 5.0) * 0.18;
      innerRingRef.current.scale.setScalar(breathe);
      (innerRingRef.current.material as THREE.MeshBasicMaterial).opacity =
        0.75 + Math.sin(t * 5.0) * 0.25;
    }

    if (glowSphereRef.current) {
      // Shimmering wireframe aura
      const s = 1.08 + Math.sin(t * 3.5) * 0.12;
      glowSphereRef.current.scale.setScalar(s);
      (glowSphereRef.current.material as THREE.MeshBasicMaterial).opacity =
        0.4 + Math.sin(t * 3.5) * 0.2;
    }

    if (beaconPinRef.current) {
      // Gentle floating bob for the attention pin
      beaconPinRef.current.position.y = radius * 1.5 + 0.22 + Math.sin(t * 3.0) * 0.04;
    }
  });

  const baseRingR = Math.max(radius * 1.35, 0.24);

  return (
    <group position={position}>
      {/* 3D Pulsing Glow Aura */}
      <mesh ref={glowSphereRef} raycast={() => null}>
        <sphereGeometry args={[radius * 1.25, 16, 16]} />
        <meshBasicMaterial color="#38bdf8" wireframe transparent opacity={0.4} />
      </mesh>

      {/* Billboard Rings & Attention Pin */}
      <Billboard>
        {/* Sonar Ripple Ring */}
        <mesh ref={outerRippleRef} raycast={() => null}>
          <ringGeometry args={[baseRingR, baseRingR + 0.045, 32]} />
          <meshBasicMaterial color="#06b6d4" side={THREE.DoubleSide} transparent opacity={0.8} />
        </mesh>

        {/* Inner Breathing Ring */}
        <mesh ref={innerRingRef} raycast={() => null}>
          <ringGeometry args={[baseRingR * 0.8, baseRingR * 0.95, 32]} />
          <meshBasicMaterial color="#38bdf8" side={THREE.DoubleSide} transparent opacity={0.9} />
        </mesh>

        {/* Small Golden Glowing Attention Beacon Pin */}
        <group ref={beaconPinRef}>
          <mesh raycast={() => null}>
            <circleGeometry args={[0.045, 16]} />
            <meshBasicMaterial color="#f59e0b" side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0, -0.06, 0]} raycast={() => null}>
            <coneGeometry args={[0.03, 0.06, 16]} />
            <meshBasicMaterial color="#f59e0b" />
          </mesh>
        </group>
      </Billboard>

      {/* Click target sphere covering the beacon */}
      <mesh
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onPointerOver={() => {
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto';
        }}
        visible={false}
      >
        <sphereGeometry args={[radius * 2.2, 8, 8]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </group>
  );
}

export function MolecularStructure({ material, opacity, scale }: MolecularStructureProps) {
  const groupRef = useRef<THREE.Group>(null);
  const atomMeshRef = useRef<THREE.InstancedMesh>(null);
  const bondMeshRef = useRef<THREE.InstancedMesh>(null);
  const glowMeshRef = useRef<THREE.InstancedMesh>(null);

  const graphicsQuality = useStore((s: StoreState) => s.graphicsQuality);
  const structureLayerCount = useStore((s: StoreState) => s.structureLayerCount);
  const cameraAngle = useStore((s: StoreState) => s.cameraAngle);
  const activeLayer = useStore((s: StoreState) => s.activeLayer);
  const inspectedAtom = useStore((s: StoreState) => s.inspectedAtom);
  const setInspectedAtom = useStore((s: StoreState) => s.setInspectedAtom);
  const isLow = graphicsQuality === 'low';

  // Generate structure & match bond endpoints to atom indices BEFORE flattening for 'top' view
  const { atoms, enrichedBonds } = useMemo(() => {
    const raw = generateCrystalStructure(material, structureLayerCount);
    const baseBondColor = new THREE.Color(material.molecularInfo.bonds.color);

    // Match each bond endpoint to its atom index in 3D space
    const findAtomIdx = (pt: THREE.Vector3): number => {
      let bestIdx = -1;
      let minDistSq = 0.05;
      for (let i = 0; i < raw.atoms.length; i++) {
        const dSq = raw.atoms[i].position.distanceToSquared(pt);
        if (dSq < minDistSq) {
          minDistSq = dSq;
          bestIdx = i;
        }
      }
      return bestIdx;
    };

    const matched: { idxA: number; idxB: number }[] = raw.bonds.map((b) => ({
      idxA: findAtomIdx(b.start),
      idxB: findAtomIdx(b.end),
    }));

    // Apply top-view flattening if active
    if (cameraAngle === 'top') {
      raw.atoms.forEach((atom) => {
        atom.position.x *= 1.2;
        atom.position.y *= 0.04;
        atom.position.z *= 1.2;
        atom.radius *= 0.82;
      });
      raw.bonds.forEach((bond) => {
        bond.start.x *= 1.2;
        bond.start.y *= 0.04;
        bond.start.z *= 1.2;
        bond.end.x *= 1.2;
        bond.end.y *= 0.04;
        bond.end.z *= 1.2;
      });
    }

    const processedBonds: EnrichedBond[] = [];
    for (let i = 0; i < raw.bonds.length; i++) {
      const b = raw.bonds[i];
      if (b.start.distanceToSquared(b.end) < 0.0001) continue;

      const { idxA, idxB } = matched[i];
      const rA = idxA !== -1 ? raw.atoms[idxA].radius : 0.14;
      const rB = idxB !== -1 ? raw.atoms[idxB].radius : 0.14;

      // Color A and Color B for Bicolor Split-Bond
      const atomColorA = idxA !== -1 ? new THREE.Color(raw.atoms[idxA].color) : baseBondColor.clone();
      const atomColorB = idxB !== -1 ? new THREE.Color(raw.atoms[idxB].color) : baseBondColor.clone();

      const colorA = atomColorA.clone().lerp(baseBondColor, 0.22);
      const colorB = atomColorB.clone().lerp(baseBondColor, 0.22);

      processedBonds.push({
        start: b.start.clone(),
        end: b.end.clone(),
        startAtomIdx: idxA,
        endAtomIdx: idxB,
        startRadius: rA,
        endRadius: rB,
        colorA,
        colorB,
      });
    }

    return { atoms: raw.atoms, enrichedBonds: processedBonds };
  }, [cameraAngle, material, structureLayerCount]);

  const atomColors = useMemo(() => atoms.map((a) => new THREE.Color(a.color)), [atoms]);

  // Setup atom instanced mesh
  useEffect(() => {
    if (!atomMeshRef.current || atoms.length === 0) return;
    const mesh = atomMeshRef.current;
    mesh.count = atoms.length;
    const { dummy } = tempAtomObjects;
    dummy.rotation.set(0, 0, 0);
    for (let i = 0; i < atoms.length; i++) {
      dummy.position.copy(atoms[i].position);
      dummy.scale.setScalar(atoms[i].radius);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      mesh.setColorAt(i, atomColors[i]);
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [atoms, atomColors]);

  // Setup glow instances (high quality only)
  useEffect(() => {
    if (isLow || !glowMeshRef.current || atoms.length === 0) return;
    const mesh = glowMeshRef.current;
    mesh.count = atoms.length;
    const { dummy } = tempAtomObjects;
    dummy.rotation.set(0, 0, 0);
    for (let i = 0; i < atoms.length; i++) {
      dummy.position.copy(atoms[i].position);
      dummy.scale.setScalar(atoms[i].radius * 1.45);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      mesh.setColorAt(i, atomColors[i]);
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [atoms, atomColors, isLow]);

  // Setup bond instances (Bicolor Split-Bonds)
  useEffect(() => {
    if (!bondMeshRef.current || enrichedBonds.length === 0) return;
    const mesh = bondMeshRef.current;
    mesh.count = enrichedBonds.length * 2;
    const isCnt = material.id === 'cnt';
    const baseThickness = isCnt ? 0.022 : isLow ? 0.026 : 0.030;
    const bondThickness = cameraAngle === 'top' ? baseThickness * 1.15 : baseThickness;

    for (let i = 0; i < enrichedBonds.length; i++) {
      const b = enrichedBonds[i];
      computeHalfBondMatrices(b.start, b.end, b.startRadius, b.endRadius, bondThickness, i, mesh);
      mesh.setColorAt(i * 2, b.colorA);
      mesh.setColorAt(i * 2 + 1, b.colorB);
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [enrichedBonds, cameraAngle, isLow, material.id]);

  // Materials
  const atomMat = useMemo(() => {
    if (isLow) {
      return new THREE.MeshStandardMaterial({
        color: '#ffffff',
        transparent: true,
        opacity: 1,
        roughness: 0.25,
        metalness: 0.3,
      });
    }
    return new THREE.MeshPhysicalMaterial({
      color: '#ffffff',
      transparent: true,
      opacity: 1,
      roughness: 0.15,
      metalness: 0.35,
      clearcoat: 0.7,
      clearcoatRoughness: 0.1,
      envMapIntensity: 1.2,
    });
  }, [isLow]);

  const bondMat = useMemo(() => {
    if (isLow) {
      return new THREE.MeshStandardMaterial({
        color: '#ffffff',
        transparent: true,
        opacity: 0.92,
        roughness: 0.3,
        metalness: 0.25,
      });
    }
    return new THREE.MeshPhysicalMaterial({
      color: '#ffffff',
      transparent: true,
      opacity: 0.94,
      roughness: 0.2,
      metalness: 0.3,
      clearcoat: 0.6,
      clearcoatRoughness: 0.15,
      envMapIntensity: 1.2,
    });
  }, [isLow]);

  const glowMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0.12,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    []
  );

  const animatedPositionsRef = useRef<THREE.Vector3[]>([]);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const curOpacity = opacity ?? zoomState.molecularOpacity;
    const curScale = scale ?? zoomState.molecularScale;

    const isVisible = curOpacity > 0.005;
    groupRef.current.visible = isVisible;
    if (!isVisible) return;

    groupRef.current.scale.setScalar(curScale);
    groupRef.current.rotation.set(0, 0, 0);

    if (atomMeshRef.current?.material) {
      const m = atomMeshRef.current.material as THREE.Material;
      m.opacity = curOpacity;
      m.transparent = true;
    }
    if (bondMeshRef.current?.material) {
      const m = bondMeshRef.current.material as THREE.Material;
      m.opacity = Math.min(0.95, curOpacity * 0.9);
      m.transparent = true;
    }
    if (glowMeshRef.current?.material) {
      const m = glowMeshRef.current.material as THREE.Material;
      m.opacity = curOpacity * 0.14;
    }

    if (isLow || !atomMeshRef.current || atoms.length === 0) return;
    const mesh = atomMeshRef.current;
    const glow = glowMeshRef.current;
    const bMesh = bondMeshRef.current;
    const { dummy } = tempAtomObjects;
    const t = clock.elapsedTime;

    if (animatedPositionsRef.current.length !== atoms.length) {
      animatedPositionsRef.current = atoms.map((a) => a.position.clone());
    }

    const maxVibrate = Math.min(atoms.length, 250);
    const v = 0.0055;
    dummy.rotation.set(0, 0, 0);

    for (let i = 0; i < maxVibrate; i++) {
      const atom = atoms[i];
      const ax = atom.position.x + Math.sin(t * 3.1 + i * 1.73) * v;
      const ay = atom.position.y + Math.sin(t * 2.7 + i * 2.31) * v;
      const az = atom.position.z + Math.cos(t * 2.9 + i * 1.17) * v;

      animatedPositionsRef.current[i].set(ax, ay, az);

      dummy.position.set(ax, ay, az);
      dummy.scale.setScalar(atom.radius);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      if (glow) {
        dummy.scale.setScalar(atom.radius * 1.45);
        dummy.updateMatrix();
        glow.setMatrixAt(i, dummy.matrix);
      }
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (glow) glow.instanceMatrix.needsUpdate = true;

    // Sync bond endpoints with vibrating atoms (Zero GC)
    if (bMesh && enrichedBonds.length > 0) {
      const isCnt = material.id === 'cnt';
      const baseThickness = isCnt ? 0.022 : isLow ? 0.026 : 0.030;
      const bondThickness = cameraAngle === 'top' ? baseThickness * 1.15 : baseThickness;
      for (let i = 0; i < enrichedBonds.length; i++) {
        const b = enrichedBonds[i];
        const pA =
          b.startAtomIdx !== -1 && b.startAtomIdx < maxVibrate
            ? animatedPositionsRef.current[b.startAtomIdx]
            : b.start;
        const pB =
          b.endAtomIdx !== -1 && b.endAtomIdx < maxVibrate
            ? animatedPositionsRef.current[b.endAtomIdx]
            : b.end;

        computeHalfBondMatrices(pA, pB, b.startRadius, b.endRadius, bondThickness, i, bMesh);
      }
      bMesh.instanceMatrix.needsUpdate = true;
    }
  });

  const inspectAtomAtIndex = useCallback(
    (id: number) => {
      if (id < 0 || id >= atoms.length) return;
      const atom = atoms[id];
      if (!atom || !atom.element) return;

      const elem = getElementInfo(atom.element);
      if (!elem) return;

      sound.playAtomPing();
      setInspectedAtom({
        element: elem.symbol,
        nameVi: elem.nameVi,
        nameEn: elem.nameEn,
        atomicNumber: elem.atomicNumber,
        atomicMass: elem.atomicMass,
        electronConfig: elem.electronConfig,
        electronegativity: elem.electronegativity,
        atomicRadiusPm: elem.atomicRadiusPm,
        categoryVi: elem.categoryVi,
        color: atom.color || elem.color,
        descriptionVi: elem.descriptionVi,
        coordination: elem.coordination || material.molecularInfo.latticeType,
        bondType: elem.bondType || material.molecularInfo.bonds.type,
        position: [atom.position.x, atom.position.y, atom.position.z],
        index: id,
      });
    },
    [atoms, material, setInspectedAtom]
  );

  const handleAtomSelect = (e: ThreeEvent<MouseEvent | PointerEvent>) => {
    if (zoomState.molecularOpacity < 0.35) return;
    if (e.instanceId !== undefined && e.instanceId >= 0 && e.instanceId < atoms.length) {
      e.stopPropagation();
      inspectAtomAtIndex(e.instanceId);
    }
  };

  // Synchronize reticle position with atom position across all angles (iso, side, top)
  const reticlePosition = useMemo(() => {
    if (!inspectedAtom) return null;
    if (inspectedAtom.index !== undefined && atoms[inspectedAtom.index]) {
      return atoms[inspectedAtom.index].position;
    }
    return inspectedAtom.position;
  }, [inspectedAtom, atoms]);

  // Find central/prominent atom to pulse as an interactive invitation cue in molecular view
  const beaconAtom = useMemo(() => {
    if (atoms.length === 0) return null;
    let bestIdx = 0;
    let minDistSq = Infinity;
    for (let i = 0; i < atoms.length; i++) {
      const dSq = atoms[i].position.lengthSq();
      if (dSq < minDistSq) {
        minDistSq = dSq;
        bestIdx = i;
      }
    }
    return {
      index: bestIdx,
      position: atoms[bestIdx].position,
      radius: atoms[bestIdx].radius || 0.18,
    };
  }, [atoms]);

  if (atoms.length === 0) return null;

  return (
    <group ref={groupRef}>
      {/* Atom spheres - the ONLY interactive target */}
      <instancedMesh
        key={`atoms-${material.id}-${structureLayerCount}-${atoms.length}`}
        ref={atomMeshRef}
        args={[undefined, undefined, atoms.length]}
        material={atomMat}
        frustumCulled={false}
        onClick={handleAtomSelect}
        onDoubleClick={handleAtomSelect}
      >
        <sphereGeometry args={[1, isLow ? 14 : 24, isLow ? 14 : 24]} />
      </instancedMesh>

      {/* Selected Atom Holographic Reticle */}
      {inspectedAtom && reticlePosition && (
        <Billboard position={reticlePosition}>
          <mesh raycast={() => null}>
            <ringGeometry args={[0.2, 0.24, 32]} />
            <meshBasicMaterial color="#22d3ee" side={THREE.DoubleSide} transparent opacity={0.9} />
          </mesh>
          <mesh raycast={() => null}>
            <ringGeometry args={[0.29, 0.31, 32]} />
            <meshBasicMaterial color="#a855f7" side={THREE.DoubleSide} transparent opacity={0.6} />
          </mesh>
        </Billboard>
      )}

      {/* Pulsing Attention Beacon on a selected atom in molecular view to invite user exploration */}
      {!inspectedAtom && beaconAtom && (activeLayer === 'molecular' || zoomState.molecularOpacity > 0.35) && (
        <PulsingAtomBeacon
          position={beaconAtom.position}
          radius={beaconAtom.radius}
          onClick={() => inspectAtomAtIndex(beaconAtom.index)}
        />
      )}

      {/* Atom glow halos (high quality only) - ignore raycast */}
      {!isLow && (
        <instancedMesh
          key={`glow-${material.id}-${structureLayerCount}-${atoms.length}`}
          ref={glowMeshRef}
          raycast={() => null}
          args={[undefined, undefined, atoms.length]}
          material={glowMat}
          frustumCulled={false}
        >
          <sphereGeometry args={[1, 10, 10]} />
        </instancedMesh>
      )}

      {/* Bond cylinders - Bicolor Ball-and-Stick (2 half-bonds per bond) */}
      {enrichedBonds.length > 0 && (
        <instancedMesh
          key={`bonds-${material.id}-${structureLayerCount}-${enrichedBonds.length}`}
          ref={bondMeshRef}
          raycast={() => null}
          args={[undefined, undefined, enrichedBonds.length * 2]}
          material={bondMat}
          frustumCulled={false}
        >
          <cylinderGeometry args={[1, 1, 1, isLow ? 8 : 14]} />
        </instancedMesh>
      )}
    </group>
  );
}