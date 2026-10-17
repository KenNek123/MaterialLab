'use client';

import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { useStore, StoreState } from '@/store/useStore';
import { zoomState } from './zoomState';

export function CrystallographyOverlays() {
  const activeLayer = useStore((s: StoreState) => s.activeLayer);
  const showLatticeCage = useStore((s: StoreState) => s.showLatticeCage);
  const showMillerPlanes = useStore((s: StoreState) => s.showMillerPlanes);
  const groupRef = useRef<THREE.Group>(null);

  const isVisible = (activeLayer === 'micro' || activeLayer === 'molecular') && (showLatticeCage || showMillerPlanes);

  // Box Cage Wireframe Geometry (scaled to match normalized lattice span ~2.4)
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
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    return geo;
  }, [half]);

  // Miller Plane (111) triangle geometry
  const plane111Geo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const vertices = new Float32Array([
      half, -half, -half,  // (1, 0, 0) relative to corner
      -half, half, -half,  // (0, 1, 0)
      -half, -half, half,  // (0, 0, 1)
    ]);
    geo.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geo.computeVertexNormals();
    return geo;
  }, [half]);

  useFrame(() => {
    if (!groupRef.current) return;
    const op = Math.max(zoomState.microOpacity, zoomState.molecularOpacity);
    groupRef.current.visible = isVisible && op > 0.05;
  });

  if (!isVisible) return null;

  return (
    <group ref={groupRef}>
      {/* Unit Cell Bounding Cage */}
      {showLatticeCage && (
        <group>
          {/* Wireframe box lines */}
          <lineSegments geometry={boxLines}>
            <lineBasicMaterial color="#38bdf8" transparent opacity={0.35} linewidth={1} />
          </lineSegments>

          {/* Crystallographic Axes Origin Marker at (-half, -half, -half) */}
          <group position={[-half, -half, -half]}>
            {/* Axis a (X - Red) */}
            <mesh position={[0.45, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
              <cylinderGeometry args={[0.015, 0.015, 0.9, 8]} />
              <meshBasicMaterial color="#ef4444" />
            </mesh>
            <mesh position={[0.92, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
              <coneGeometry args={[0.04, 0.12, 8]} />
              <meshBasicMaterial color="#ef4444" />
            </mesh>
            <Html position={[1.1, 0, 0]} center className="pointer-events-none select-none">
              <span className="text-[10px] font-bold font-mono text-red-400 bg-black/60 px-1 py-0.5 rounded border border-red-500/30">
                a (x)
              </span>
            </Html>

            {/* Axis b (Y - Green) */}
            <mesh position={[0, 0.45, 0]}>
              <cylinderGeometry args={[0.015, 0.015, 0.9, 8]} />
              <meshBasicMaterial color="#10b981" />
            </mesh>
            <mesh position={[0, 0.92, 0]}>
              <coneGeometry args={[0.04, 0.12, 8]} />
              <meshBasicMaterial color="#10b981" />
            </mesh>
            <Html position={[0, 1.1, 0]} center className="pointer-events-none select-none">
              <span className="text-[10px] font-bold font-mono text-emerald-400 bg-black/60 px-1 py-0.5 rounded border border-emerald-500/30">
                b (y)
              </span>
            </Html>

            {/* Axis c (Z - Blue) */}
            <mesh position={[0, 0, 0.45]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.015, 0.015, 0.9, 8]} />
              <meshBasicMaterial color="#3b82f6" />
            </mesh>
            <mesh position={[0, 0, 0.92]} rotation={[Math.PI / 2, 0, 0]}>
              <coneGeometry args={[0.04, 0.12, 8]} />
              <meshBasicMaterial color="#3b82f6" />
            </mesh>
            <Html position={[0, 0, 1.1]} center className="pointer-events-none select-none">
              <span className="text-[10px] font-bold font-mono text-blue-400 bg-black/60 px-1 py-0.5 rounded border border-blue-500/30">
                c (z)
              </span>
            </Html>
          </group>
        </group>
      )}

      {/* Miller Slicing Planes */}
      {showMillerPlanes && (
        <group>
          {/* Miller Plane (100) - YZ Slicing Plane at X = 0 */}
          <mesh position={[0, 0, 0]}>
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
          <Html position={[0, half * 0.8, half * 0.8]} center className="pointer-events-none select-none">
            <div className="cyber-glass px-2 py-0.5 rounded-lg border border-cyan-400/50 text-[10px] font-mono font-bold text-cyan-300 shadow-md">
              Mặt (100)
            </div>
          </Html>

          {/* Miller Plane (110) - Diagonal X=Y Plane */}
          <mesh position={[0, 0, 0]} rotation={[0, Math.PI / 4, 0]}>
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
          <Html position={[half * 0.7, half * 0.7, 0]} center className="pointer-events-none select-none">
            <div className="cyber-glass px-2 py-0.5 rounded-lg border border-purple-400/50 text-[10px] font-mono font-bold text-purple-300 shadow-md">
              Mặt (110)
            </div>
          </Html>

          {/* Miller Plane (111) - Close Packed Octahedral Triangle Plane */}
          <mesh geometry={plane111Geo}>
            <meshStandardMaterial
              color="#34d399"
              transparent
              opacity={0.28}
              side={THREE.DoubleSide}
              roughness={0.2}
              depthWrite={false}
            />
          </mesh>
          <Html position={[-half * 0.3, -half * 0.3, -half * 0.3]} center className="pointer-events-none select-none">
            <div className="cyber-glass px-2 py-0.5 rounded-lg border border-emerald-400/50 text-[10px] font-mono font-bold text-emerald-300 shadow-md">
              Mặt (111)
            </div>
          </Html>
        </group>
      )}
    </group>
  );
}
