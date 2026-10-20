'use client';

import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useStore, StoreState } from '@/store/useStore';
import { zoomState } from './zoomState';

/**
 * CrystallographyOverlays:
 * Displays bounding cage and optional Miller slicing planes.
 * NOTE: 3D coordinate axes, arrows, and floating axis HTML tags are completely removed
 * to eliminate obstruction over atom spheres and UI panels.
 */
import { MATERIAL_MAP } from '@/data/materials';

export function CrystallographyOverlays() {
  const selectedMaterial = useStore((s: StoreState) => s.selectedMaterial);
  const activeLayer = useStore((s: StoreState) => s.activeLayer);
  const showLatticeCage = useStore((s: StoreState) => s.showLatticeCage);
  const showMillerPlanes = useStore((s: StoreState) => s.showMillerPlanes);
  const groupRef = useRef<THREE.Group>(null);

  const mat = MATERIAL_MAP.get(selectedMaterial);
  const isNonCrystalline =
    !mat ||
    mat.id === 'glass' ||
    mat.id === 'aerogel' ||
    mat.id === 'rubber' ||
    mat.id === 'teflon' ||
    mat.id === 'kevlar' ||
    mat.id === 'buckyball' ||
    mat.id === 'cnt';

  const isVisible =
    !isNonCrystalline &&
    (activeLayer === 'micro' || activeLayer === 'molecular') &&
    (showLatticeCage || showMillerPlanes);

  const cageSize = 2.4;
  const half = cageSize / 2;

  const boxLines = useMemo(() => {
    const points: THREE.Vector3[] = [
      // Bottom face
      new THREE.Vector3(-half, -half, -half), new THREE.Vector3(half, -half, -half),
      new THREE.Vector3(half, -half, -half), new THREE.Vector3(half, -half, half),
      new THREE.Vector3(half, -half, half), new THREE.Vector3(-half, -half, half),
      new THREE.Vector3(-half, -half, half), new THREE.Vector3(-half, -half, -half),
      // Top face
      new THREE.Vector3(-half, half, -half), new THREE.Vector3(half, half, -half),
      new THREE.Vector3(half, half, -half), new THREE.Vector3(half, half, half),
      new THREE.Vector3(half, half, half), new THREE.Vector3(-half, half, half),
      new THREE.Vector3(-half, half, half), new THREE.Vector3(-half, half, -half),
      // Vertical pillars
      new THREE.Vector3(-half, -half, -half), new THREE.Vector3(-half, half, -half),
      new THREE.Vector3(half, -half, -half), new THREE.Vector3(half, half, -half),
      new THREE.Vector3(half, -half, half), new THREE.Vector3(half, half, half),
      new THREE.Vector3(-half, -half, half), new THREE.Vector3(-half, half, half),
    ];
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [half]);

  const plane111Geo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const vertices = new Float32Array([
      half, -half, -half,
      -half, half, -half,
      -half, -half, half,
    ]);
    geo.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geo.computeVertexNormals();
    return geo;
  }, [half]);

  useFrame(() => {
    if (!groupRef.current) return;
    const op = Math.max(zoomState.microOpacity, zoomState.molecularOpacity);
    groupRef.current.visible = isVisible && op > 0.05;
    // Smooth continuous scale following crystallography unit cell
    const targetScale = zoomState.microScale;
    groupRef.current.scale.setScalar(targetScale);
  });

  if (!isVisible) return null;

  return (
    <group ref={groupRef} raycast={() => null}>
      {/* Unit Cell Bounding Cage Wireframe */}
      {showLatticeCage && (
        <lineSegments geometry={boxLines} raycast={() => null}>
          <lineBasicMaterial color="#38bdf8" transparent opacity={0.35} linewidth={1} />
        </lineSegments>
      )}

      {/* Miller Slicing Planes without obstructing labels */}
      {showMillerPlanes && (
        <group raycast={() => null}>
          {/* Miller Plane (100) */}
          <mesh position={[0, 0, 0]} raycast={() => null}>
            <planeGeometry args={[cageSize * 0.96, cageSize * 0.96]} />
            <meshStandardMaterial
              color="#22d3ee"
              transparent
              opacity={0.22}
              side={THREE.DoubleSide}
              roughness={0.2}
              depthWrite={false}
            />
          </mesh>

          {/* Miller Plane (110) */}
          <mesh position={[0, 0, 0]} rotation={[0, Math.PI / 4, 0]} raycast={() => null}>
            <planeGeometry args={[cageSize * 1.35, cageSize * 0.96]} />
            <meshStandardMaterial
              color="#c084fc"
              transparent
              opacity={0.18}
              side={THREE.DoubleSide}
              roughness={0.2}
              depthWrite={false}
            />
          </mesh>

          {/* Miller Plane (111) */}
          <mesh geometry={plane111Geo} raycast={() => null}>
            <meshStandardMaterial
              color="#34d399"
              transparent
              opacity={0.28}
              side={THREE.DoubleSide}
              roughness={0.2}
              depthWrite={false}
            />
          </mesh>
        </group>
      )}
    </group>
  );
}
