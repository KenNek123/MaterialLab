'use client';

import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { MaterialData, useStore, StoreState } from '@/store/useStore';
import { zoomState } from './zoomState';

interface MicroUnitCellProps {
  material: MaterialData;
}

type UnitCellType = 'none' | 'hex-prism' | '2d-sheet' | 'cubic';

function getUnitCellType(material: MaterialData): UnitCellType {
  const { structure, id } = material;
  const t = structure.type;

  // 1. Non-crystalline / Polymers / Disordered / Isolated molecules: NO rigid crystal box cage!
  if (
    id === 'glass' ||
    id === 'aerogel' ||
    id === 'rubber' ||
    id === 'teflon' ||
    id === 'kevlar' ||
    id === 'buckyball' ||
    id === 'cnt' ||
    t === 'teflon' ||
    t === 'polymer-rubber' ||
    t === 'aerogel' ||
    t === 'kevlar' ||
    t === 'buckyball' ||
    t === 'cnt'
  ) {
    return 'none';
  }

  // 2. 2D Layered materials: flat sheet boundary
  if (t === 'graphene' || t === 'mxene') {
    return '2d-sheet';
  }

  // 3. Hexagonal & Trigonal 3D systems
  if (
    t === 'hcp' ||
    t === 'tungsten-carbide' ||
    t === 'corundum' ||
    t === 'battery' ||
    t === 'ice' ||
    t === 'hexagonal'
  ) {
    return 'hex-prism';
  }

  // 4. Cubic Bravais crystal systems (FCC, BCC, Diamond, Rocksalt, Perovskite, B2)
  return 'cubic';
}

/**
 * MicroUnitCell - Level 2 (Vi mô / Ô mạng tinh thể cơ sở):
 * Displays authentic crystallographic unit cell bounds and Bravais symmetry nodes.
 * Completely hidden for amorphous networks, polymers, and isolated molecules.
 * Hexagonal prism for hexagonal/trigonal crystals; true cubic cage for cubic systems.
 * Completely ignored by raycaster to prevent interfering with atom clicks.
 */
export function MicroUnitCell({ material }: MicroUnitCellProps) {
  const groupRef = useRef<THREE.Group>(null);
  const cageRef = useRef<THREE.LineSegments>(null);
  const cornerMeshRef = useRef<THREE.InstancedMesh>(null);

  const graphicsQuality = useStore((s: StoreState) => s.graphicsQuality);
  const isLow = graphicsQuality === 'low';

  const cellType = useMemo(() => getUnitCellType(material), [material]);

  const color = useMemo(() => {
    if (material.category === 'metal') return '#f59e0b';
    if (material.category === 'tech') return '#38bdf8';
    if (material.category === 'polymer') return '#10b981';
    if (material.category === 'nano') return '#a855f7';
    return '#38bdf8';
  }, [material.category]);

  // Determine aspect ratio for hexagonal/trigonal prism
  const hexDimensions = useMemo(() => {
    const t = material.structure.type;
    let r = 1.85;
    let h = 2.6;

    if (t === 'hcp') {
      // Titanium c/a ≈ 1.587
      r = 1.85;
      h = 2.9;
    } else if (t === 'tungsten-carbide') {
      // WC c/a ≈ 0.976
      r = 1.95;
      h = 1.9;
    } else if (t === 'corundum') {
      // Al2O3 c/a ≈ 2.73
      r = 1.7;
      h = 3.3;
    } else if (t === 'battery') {
      // LiCoO2 layered trigonal slab
      r = 1.8;
      h = 3.0;
    } else if (t === 'ice') {
      // Hexagonal Ice Ih
      r = 1.8;
      h = 2.9;
    }
    return { r, h };
  }, [material.structure.type]);

  // Unit cell cage geometry based on authentic crystallographic system
  const { cageGeo, cornerPositions } = useMemo(() => {
    if (cellType === 'none') {
      return { cageGeo: null, cornerPositions: [] };
    }

    if (cellType === 'hex-prism') {
      const shape = new THREE.BufferGeometry();
      const verts: number[] = [];
      const { r, h } = hexDimensions;
      const halfH = h * 0.5;
      const corners: [number, number, number][] = [];

      // 6 bottom vertices and 6 top vertices
      for (let i = 0; i < 6; i++) {
        const a0 = (i * Math.PI) / 3;
        const a1 = ((i + 1) * Math.PI) / 3;
        const x0 = Math.cos(a0) * r;
        const z0 = Math.sin(a0) * r;
        const x1 = Math.cos(a1) * r;
        const z1 = Math.sin(a1) * r;

        // Bottom hexagon edge
        verts.push(x0, -halfH, z0, x1, -halfH, z1);
        // Top hexagon edge
        verts.push(x0, halfH, z0, x1, halfH, z1);
        // Vertical pillar edge
        verts.push(x0, -halfH, z0, x0, halfH, z0);

        // Store corners
        corners.push([x0, -halfH, z0]);
        corners.push([x0, halfH, z0]);
      }

      // Add center points of basal planes
      corners.push([0, -halfH, 0]);
      corners.push([0, halfH, 0]);

      shape.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
      return { cageGeo: shape, cornerPositions: corners };
    }

    if (cellType === '2d-sheet') {
      const shape = new THREE.BufferGeometry();
      const verts: number[] = [];
      const r = 2.3;
      const corners: [number, number, number][] = [];

      for (let i = 0; i < 6; i++) {
        const a0 = (i * Math.PI) / 3;
        const a1 = ((i + 1) * Math.PI) / 3;
        const x0 = Math.cos(a0) * r;
        const z0 = Math.sin(a0) * r;
        const x1 = Math.cos(a1) * r;
        const z1 = Math.sin(a1) * r;

        verts.push(x0, 0, z0, x1, 0, z1);
        corners.push([x0, 0, z0]);
      }
      shape.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
      return { cageGeo: shape, cornerPositions: corners };
    }

    // Cubic unit cell
    const cubeSize = 3.2;
    const half = cubeSize / 2;
    const boxGeo = new THREE.EdgesGeometry(new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize));
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

    // For FCC / BCC crystals, add face centers or body center as Bravais nodes
    if (material.structure.type === 'fcc' || material.structure.type === 'stainless-steel') {
      corners.push(
        [0, half, 0],
        [0, -half, 0],
        [half, 0, 0],
        [-half, 0, 0],
        [0, 0, half],
        [0, 0, -half]
      );
    } else if (material.structure.type === 'bcc' || material.structure.type === 'steel' || material.structure.type === 'nitinol') {
      corners.push([0, 0, 0]); // Body center
    }

    return { cageGeo: boxGeo, cornerPositions: corners };
  }, [cellType, hexDimensions, material.structure.type]);

  const cageMat = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity: 0,
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
    if (!cornerMeshRef.current || cornerPositions.length === 0) return;
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

  useFrame(() => {
    if (!groupRef.current) return;
    const curOpacity = zoomState.microOpacity;
    const curScale = zoomState.microScale;
    const isVisible = cellType !== 'none' && curOpacity > 0.005;

    groupRef.current.visible = isVisible;
    if (!isVisible) return;

    groupRef.current.scale.setScalar(curScale);
    groupRef.current.rotation.set(0, 0, 0);

    const cageOp = curOpacity * 0.75;
    const cornerOp = curOpacity * 0.55;

    if (cageRef.current?.material) {
      (cageRef.current.material as THREE.Material).opacity = cageOp;
    }
    if (cornerMeshRef.current?.material) {
      (cornerMeshRef.current.material as THREE.Material).opacity = cornerOp;
    }
  });

  if (cellType === 'none' || !cageGeo) {
    return null;
  }

  return (
    <group ref={groupRef} raycast={() => null}>
      <lineSegments ref={cageRef} raycast={() => null} geometry={cageGeo} material={cageMat} />

      {cornerPositions.length > 0 && (
        <instancedMesh
          ref={cornerMeshRef}
          raycast={() => null}
          args={[undefined, undefined, cornerPositions.length]}
          material={cornerMat}
          frustumCulled={false}
        >
          <sphereGeometry args={[isLow ? 0.055 : 0.07, 8, 8]} />
        </instancedMesh>
      )}
    </group>
  );
}
