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

export function MolecularStructure({ material, opacity, scale }: MolecularStructureProps) {
  const groupRef = useRef<THREE.Group>(null);
  const atomMeshRef = useRef<THREE.InstancedMesh>(null);
  const bondMeshRef = useRef<THREE.InstancedMesh>(null);
  const glowMeshRef = useRef<THREE.InstancedMesh>(null);
  const atomMatRef = useRef<THREE.Material>(null);
  const bondMatRef = useRef<THREE.Material>(null);
  const glowMatRef = useRef<THREE.Material>(null);

  const graphicsQuality = useStore((s: StoreState) => s.graphicsQuality);
  const structureLayerCount = useStore((s: StoreState) => s.structureLayerCount);
  const cameraAngle = useStore((s: StoreState) => s.cameraAngle);
  const inspectedAtom = useStore((s: StoreState) => s.inspectedAtom);
  const setInspectedAtom = useStore((s: StoreState) => s.setInspectedAtom);
  const isLow = graphicsQuality === 'low';

  const { atoms, bonds } = useMemo(() => {
    const structure = generateCrystalStructure(material, structureLayerCount);
    if (cameraAngle !== 'top') return structure;

    // A readable ball-and-stick diagram: flatten depth and add breathing room.
    structure.atoms.forEach((atom) => {
      atom.position.x *= 1.2;
      atom.position.y *= 0.04;
      atom.position.z *= 1.2;
      atom.radius *= 0.82;
    });
    structure.bonds.forEach((bond) => {
      bond.start.x *= 1.2;
      bond.start.y *= 0.04;
      bond.start.z *= 1.2;
      bond.end.x *= 1.2;
      bond.end.y *= 0.04;
      bond.end.z *= 1.2;
    });
    return structure;
  }, [cameraAngle, material, structureLayerCount]);

  const atomColors = useMemo(() => atoms.map((a) => new THREE.Color(a.color)), [atoms]);
  const upVector = useMemo(() => new THREE.Vector3(0, 1, 0), []);

  // Setup atom instanced mesh
  useEffect(() => {
    if (!atomMeshRef.current || atoms.length === 0) return;
    const mesh = atomMeshRef.current;
    mesh.count = atoms.length;
    const dummy = new THREE.Object3D();
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

  // Setup glow instances (high mode only)
  useEffect(() => {
    if (isLow || !glowMeshRef.current || atoms.length === 0) return;
    const mesh = glowMeshRef.current;
    mesh.count = atoms.length;
    const dummy = new THREE.Object3D();
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

  // Setup bond instances with exact mathematical quaternion orientation (no gimbal lock)
  useEffect(() => {
    if (!bondMeshRef.current || bonds.length === 0) return;
    const mesh = bondMeshRef.current;
    mesh.count = bonds.length;
    const dummy = new THREE.Object3D();
    const bondBaseColor = new THREE.Color(material.molecularInfo.bonds.color);

    for (let i = 0; i < bonds.length; i++) {
      const bond = bonds[i];
      const dir = new THREE.Vector3().subVectors(bond.end, bond.start);
      const length = dir.length();
      if (length < 0.0001) continue;

      const mid = new THREE.Vector3().addVectors(bond.start, bond.end).multiplyScalar(0.5);
      dummy.position.copy(mid);

      const bondThickness = cameraAngle === 'top' ? 0.06 : isLow ? 0.046 : 0.054;
      dummy.scale.set(bondThickness, length, bondThickness);

      const bondDir = dir.clone().normalize();
      dummy.quaternion.setFromUnitVectors(upVector, bondDir);
      dummy.updateMatrix();

      mesh.setMatrixAt(i, dummy.matrix);
      const col = bond.color ? new THREE.Color(bond.color) : bondBaseColor.clone();
      mesh.setColorAt(i, col);
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [bonds, cameraAngle, material.molecularInfo.bonds.color, isLow, upVector]);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const curOpacity = opacity ?? zoomState.molecularOpacity;
    const curScale = scale ?? zoomState.molecularScale;

    const isVisible = curOpacity > 0.005;
    groupRef.current.visible = isVisible;
    if (!isVisible) return;

    groupRef.current.scale.setScalar(curScale);
    // Maintain 100% spatial alignment with Macro and MicroUnitCell layers
    groupRef.current.rotation.set(0, 0, 0);

    if (atomMatRef.current) {
      atomMatRef.current.opacity = curOpacity;
      atomMatRef.current.transparent = curOpacity < 0.99;
    }
    if (bondMatRef.current) {
      bondMatRef.current.opacity = Math.min(0.95, curOpacity * 0.88);
      bondMatRef.current.transparent = true;
    }
    if (glowMatRef.current) {
      glowMatRef.current.opacity = curOpacity * 0.14;
    }

    // High mode only: subtle quantum thermal vibration that maintains solid bond connection
    if (isLow || !atomMeshRef.current || atoms.length === 0) return;
    const mesh = atomMeshRef.current;
    const glow = glowMeshRef.current;
    const dummy = new THREE.Object3D();
    const t = clock.elapsedTime;

    const maxVibrate = Math.min(atoms.length, 250);
    const v = 0.006;
    for (let i = 0; i < maxVibrate; i++) {
      const atom = atoms[i];
      dummy.position.set(
        atom.position.x + Math.sin(t * 3.1 + i * 1.73) * v,
        atom.position.y + Math.sin(t * 2.7 + i * 2.31) * v,
        atom.position.z + Math.cos(t * 2.9 + i * 1.17) * v
      );
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
  });

  const inspectAtomAtIndex = useCallback((id: number) => {
    if (id < 0 || id >= atoms.length) return;
    const atom = atoms[id];
    const elem = getElementInfo(atom.element);
    sound.playAtomPing();
    setInspectedAtom({
      element: atom.element,
      nameVi: elem.nameVi,
      nameEn: elem.nameEn,
      atomicNumber: elem.atomicNumber,
      atomicMass: elem.atomicMass,
      electronConfig: elem.electronConfig,
      electronegativity: elem.electronegativity,
      atomicRadiusPm: elem.atomicRadiusPm,
      categoryVi: elem.categoryVi,
      color: atom.color,
      descriptionVi: elem.descriptionVi,
      coordination: material.molecularInfo.latticeType,
      bondType: material.molecularInfo.bonds.type,
      position: [atom.position.x, atom.position.y, atom.position.z],
      index: id,
    });
  }, [atoms, material, setInspectedAtom]);

  const handleAtomSelect = (e: ThreeEvent<MouseEvent | PointerEvent>) => {
    if (zoomState.molecularOpacity < 0.35) return;
    if (e.instanceId !== undefined) {
      e.stopPropagation();
      inspectAtomAtIndex(e.instanceId);
    }
  };

  if (atoms.length === 0) return null;

  return (
    <group ref={groupRef}>
      {/* Atom spheres - higher poly for clarity */}
      <instancedMesh
        ref={atomMeshRef}
        args={[undefined, undefined, atoms.length]}
        frustumCulled={false}
        onClick={handleAtomSelect}
        onDoubleClick={handleAtomSelect}
      >
        <sphereGeometry args={[1, isLow ? 14 : 22, isLow ? 14 : 22]} />
        {isLow ? (
          <meshStandardMaterial
            ref={atomMatRef}
            color="#ffffff"
            transparent
            opacity={1}
            roughness={0.25}
            metalness={0.3}
          />
        ) : (
          <meshPhysicalMaterial
            ref={atomMatRef}
            color="#ffffff"
            transparent
            opacity={1}
            roughness={0.15}
            metalness={0.35}
            clearcoat={0.7}
            clearcoatRoughness={0.1}
            envMapIntensity={1.2}
          />
        )}
      </instancedMesh>

      {/* Selected Atom Holographic Reticle */}
      {inspectedAtom && (
        <Billboard position={inspectedAtom.position}>
          <mesh>
            <ringGeometry args={[0.20, 0.24, 32]} />
            <meshBasicMaterial color="#22d3ee" side={THREE.DoubleSide} transparent opacity={0.9} />
          </mesh>
          <mesh>
            <ringGeometry args={[0.29, 0.31, 32]} />
            <meshBasicMaterial color="#a855f7" side={THREE.DoubleSide} transparent opacity={0.6} />
          </mesh>
        </Billboard>
      )}

      {/* Atom glow halos (high quality only) */}
      {!isLow && (
        <instancedMesh
          ref={glowMeshRef}
          args={[undefined, undefined, atoms.length]}
          frustumCulled={false}
        >
          <sphereGeometry args={[1, 10, 10]} />
          <meshBasicMaterial
            ref={glowMatRef}
            transparent
            opacity={0.12}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </instancedMesh>
      )}

      {/* Bond cylinders - thicker and more visible */}
      {bonds.length > 0 && (
        <instancedMesh
          ref={bondMeshRef}
          args={[undefined, undefined, bonds.length]}
          frustumCulled={false}
        >
          <cylinderGeometry args={[1, 1, 1, isLow ? 6 : 10]} />
          <meshStandardMaterial
            ref={bondMatRef}
            color="#ffffff"
            transparent
            opacity={0.9}
            roughness={0.35}
            metalness={0.2}
          />
        </instancedMesh>
      )}
    </group>
  );
}

