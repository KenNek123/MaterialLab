'use client';

import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { MaterialData, useStore, StoreState } from '@/store/useStore';
import { zoomState } from './zoomState';

interface MicroUnitCellProps {
  material: MaterialData;
}

/**
 * MicroUnitCell - Layer 2 (Vi mô / Trung gian):
 * Holographic crystalline unit cell cage bridging macro↔nano.
 * Now with animated lattice planes and glowing particle corners.
 */
export function MicroUnitCell({ material }: MicroUnitCellProps) {
  const groupRef = useRef<THREE.Group>(null);
  const cageRef = useRef<THREE.LineSegments>(null);
  const cornerMeshRef = useRef<THREE.InstancedMesh>(null);
  const planeRef = useRef<THREE.Mesh>(null);
  const innerCageRef = useRef<THREE.LineSegments>(null);

  const graphicsQuality = useStore((s: StoreState) => s.graphicsQuality);
  const isLow = graphicsQuality === 'low';

  const { structure } = material;
  const size = 2.3; // Exactly frames the 2.3 normalized molecular lattice
  const isHex = structure.type === 'hexagonal' || structure.type === 'graphene';

  const color = material.category === 'metal' ? '#f59e0b'
    : material.category === 'nano' ? '#a855f7'
    : material.category === 'molecular' ? '#34d399'
    : '#38bdf8';

  // Outer cage geometry
  const cageGeo = useMemo(() => {
    if (isHex) {
      // Hexagonal prism wireframe for graphene/CNT
      const shape = new THREE.BufferGeometry();
      const verts: number[] = [];
      const r = size * 0.6;
      const h = size * 0.4;
      for (let i = 0; i < 6; i++) {
        const a0 = (i * Math.PI) / 3;
        const a1 = ((i + 1) * Math.PI) / 3;
        // Bottom hex
        verts.push(Math.cos(a0) * r, -h, Math.sin(a0) * r,
                   Math.cos(a1) * r, -h, Math.sin(a1) * r);
        // Top hex
        verts.push(Math.cos(a0) * r, h, Math.sin(a0) * r,
                   Math.cos(a1) * r, h, Math.sin(a1) * r);
        // Verticals
        verts.push(Math.cos(a0) * r, -h, Math.sin(a0) * r,
                   Math.cos(a0) * r, h, Math.sin(a0) * r);
      }
      shape.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
      return shape;
    }
    return new THREE.EdgesGeometry(new THREE.BoxGeometry(size, size, size));
  }, [size, isHex]);

  // Inner nested cage (half-size) for depth
  const innerCageGeo = useMemo(() => {
    const box = new THREE.BoxGeometry(size * 0.5, size * 0.5, size * 0.5);
    return new THREE.EdgesGeometry(box);
  }, [size]);

  // Miller plane (110) highlight
  const planeGeo = useMemo(() => {
    const geo = new THREE.PlaneGeometry(size * Math.SQRT2, size);
    geo.rotateY(Math.PI / 4);
    return geo;
  }, [size]);

  // Corner atom positions (8 BCC-style corners + face centers for FCC)
  const cornerPositions = useMemo(() => {
    const half = size / 2;
    const corners: [number, number, number][] = [
      [-half, -half, -half], [half, -half, -half],
      [-half, half, -half], [half, half, -half],
      [-half, -half, half], [half, -half, half],
      [-half, half, half], [half, half, half],
    ];
    // Add face center atoms for visual richness
    if (!isHex) {
      corners.push(
        [0, half, 0], [0, -half, 0],
        [half, 0, 0], [-half, 0, 0],
        [0, 0, half], [0, 0, -half],
      );
    }
    return corners;
  }, [size, isHex]);

  // Materials
  const cageMat = useMemo(() => new THREE.LineBasicMaterial({
    color, transparent: true, opacity: 0,
  }), [color]);

  const innerCageMat = useMemo(() => new THREE.LineBasicMaterial({
    color, transparent: true, opacity: 0,
  }), [color]);

  const planeMat = useMemo(() => new THREE.MeshBasicMaterial({
    color, transparent: true, opacity: 0,
    side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false,
  }), [color]);

  const cornerMatRef = useRef<THREE.MeshBasicMaterial>(null);

  // Initialize corner instance matrices
  useEffect(() => {
    if (!cornerMeshRef.current) return;
    const mesh = cornerMeshRef.current;
    const dummy = new THREE.Object3D();
    cornerPositions.forEach(([x, y, z], i) => {
      dummy.position.set(x, y, z);
      dummy.scale.setScalar(1);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  }, [cornerPositions]);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const curOpacity = zoomState.microOpacity;
    const curScale = zoomState.microScale;
    const isVisible = curOpacity > 0.005;

    groupRef.current.visible = isVisible;
    if (!isVisible) return;

    groupRef.current.scale.setScalar(curScale);
    // 100% synchronized orientation with Macro and Molecular layers
    groupRef.current.rotation.set(0, 0, 0);

    const t = clock.elapsedTime;

    const cageOp = curOpacity * 0.85;
    const planeOp = curOpacity * (isLow ? 0.07 : 0.13);
    const cornerOp = curOpacity * 0.55;

    const cageMaterial = cageRef.current?.material;
    if (cageMaterial instanceof THREE.Material) cageMaterial.opacity = cageOp;

    const innerCageMaterial = innerCageRef.current?.material;
    if (innerCageMaterial instanceof THREE.Material) {
      // Inner cage pulses slightly
      innerCageMaterial.opacity = cageOp * (0.4 + 0.15 * Math.sin(t * 1.8));
    }

    const planeMaterial = planeRef.current?.material;
    if (planeMaterial instanceof THREE.Material) planeMaterial.opacity = planeOp;

    if (cornerMatRef.current) cornerMatRef.current.opacity = cornerOp;
  });

  return (
    <group ref={groupRef}>
      {/* Outer unit cell wireframe */}
      <lineSegments ref={cageRef} geometry={cageGeo} material={cageMat} />

      {/* Inner nested cage for depth illusion */}
      {!isLow && (
        <lineSegments ref={innerCageRef} geometry={innerCageGeo} material={innerCageMat} />
      )}

      {/* Miller plane (110) semi-transparent */}
      {!isLow && (
        <mesh ref={planeRef} geometry={planeGeo} material={planeMat} />
      )}

      {/* Corner atom glows - instanced for performance */}
      <instancedMesh
        ref={cornerMeshRef}
        args={[undefined, undefined, cornerPositions.length]}
        frustumCulled={false}
      >
        <sphereGeometry args={[isLow ? 0.065 : 0.08, 8, 8]} />
        <meshBasicMaterial
          ref={cornerMatRef}
          color={color}
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </instancedMesh>

      {/* Crystal axes at origin corner */}
      <group position={[-size / 2, -size / 2, -size / 2]}>
        <axesHelper args={[size * 0.38]} />
      </group>
    </group>
  );
}
