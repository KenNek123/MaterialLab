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
 * MicroUnitCell - Level 2 (Vi mô / Ô mạng tinh thể cơ sở):
 * Displays crystallography unit cell bounds and corners.
 * Completely ignored by raycaster to prevent interfering with atom clicks.
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
  const size = 3.6;
  const isHex =
    structure.type === 'hexagonal' ||
    structure.type === 'graphene' ||
    structure.type === 'mxene' ||
    structure.type === 'hcp' ||
    structure.type === 'cnt';

  const color =
    material.category === 'metal'
      ? '#f59e0b'
      : material.category === 'tech'
      ? '#38bdf8'
      : material.category === 'polymer'
      ? '#10b981'
      : material.category === 'nano'
      ? '#a855f7'
      : '#38bdf8';

  // Outer cage geometry
  const cageGeo = useMemo(() => {
    if (isHex) {
      const shape = new THREE.BufferGeometry();
      const verts: number[] = [];
      const r = size * 0.6;
      const h = size * 0.45;
      for (let i = 0; i < 6; i++) {
        const a0 = (i * Math.PI) / 3;
        const a1 = ((i + 1) * Math.PI) / 3;
        // Bottom hex
        verts.push(Math.cos(a0) * r, -h, Math.sin(a0) * r, Math.cos(a1) * r, -h, Math.sin(a1) * r);
        // Top hex
        verts.push(Math.cos(a0) * r, h, Math.sin(a0) * r, Math.cos(a1) * r, h, Math.sin(a1) * r);
        // Verticals
        verts.push(Math.cos(a0) * r, -h, Math.sin(a0) * r, Math.cos(a0) * r, h, Math.sin(a0) * r);
      }
      shape.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
      return shape;
    }
    return new THREE.EdgesGeometry(new THREE.BoxGeometry(size, size, size));
  }, [size, isHex]);

  // Inner nested cage for depth
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

  // Corner atom positions
  const cornerPositions = useMemo(() => {
    const half = size / 2;
    const corners: [number, number, number][] = [
      [-half, -half, -half],
      [half, -half, -half],
      [-half, half, -half],
      [half, half, -half],
      [-half, -half, half],
      [half, -half, half],
      [-half, half, half],
      [half, half, half],
    ];
    if (!isHex) {
      corners.push(
        [0, half, 0],
        [0, -half, 0],
        [half, 0, 0],
        [-half, 0, 0],
        [0, 0, half],
        [0, 0, -half]
      );
    }
    return corners;
  }, [size, isHex]);

  // Materials
  const cageMat = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity: 0,
      }),
    [color]
  );

  const innerCageMat = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity: 0,
      }),
    [color]
  );

  const planeMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    [color]
  );

  const cornerMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    [color]
  );

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
    groupRef.current.rotation.set(0, 0, 0);

    const t = clock.elapsedTime;
    const cageOp = curOpacity * 0.85;
    const planeOp = curOpacity * (isLow ? 0.07 : 0.13);
    const cornerOp = curOpacity * 0.55;

    if (cageRef.current?.material) {
      (cageRef.current.material as THREE.Material).opacity = cageOp;
    }
    if (innerCageRef.current?.material) {
      (innerCageRef.current.material as THREE.Material).opacity = cageOp * (0.4 + 0.15 * Math.sin(t * 1.8));
    }
    if (planeRef.current?.material) {
      (planeRef.current.material as THREE.Material).opacity = planeOp;
    }
    if (cornerMeshRef.current?.material) {
      (cornerMeshRef.current.material as THREE.Material).opacity = cornerOp;
    }
  });

  return (
    <group ref={groupRef} raycast={() => null}>
      <lineSegments ref={cageRef} raycast={() => null} geometry={cageGeo} material={cageMat} />

      {!isLow && (
        <lineSegments ref={innerCageRef} raycast={() => null} geometry={innerCageGeo} material={innerCageMat} />
      )}

      {!isLow && <mesh ref={planeRef} raycast={() => null} geometry={planeGeo} material={planeMat} />}

      <instancedMesh
        ref={cornerMeshRef}
        raycast={() => null}
        args={[undefined, undefined, cornerPositions.length]}
        material={cornerMat}
        frustumCulled={false}
      >
        <sphereGeometry args={[isLow ? 0.065 : 0.08, 8, 8]} />
      </instancedMesh>
    </group>
  );
}
