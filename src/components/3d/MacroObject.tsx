'use client';

import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { MaterialData, useStore, StoreState } from '@/store/useStore';
import { zoomState } from './zoomState';
import { getModelGeometry } from './models/modelRegistry';

interface MacroObjectProps {
  material: MaterialData;
  opacity?: number;
  wireframeOpacity?: number;
}

export function MacroObject({ material, opacity, wireframeOpacity }: MacroObjectProps) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const wireRef = useRef<THREE.LineSegments>(null);

  const graphicsQuality = useStore((s: StoreState) => s.graphicsQuality);
  const isLow = graphicsQuality === 'low';

  // 1. Obtain geometry from modular registry factory
  const geometry = useMemo(() => {
    return getModelGeometry(material.geometry);
  }, [material.geometry]);

  // 2. Generate wireframe edge geometry with proper lifecycle disposal (Task 10)
  const wireGeometry = useMemo(() => {
    return new THREE.EdgesGeometry(geometry, 22);
  }, [geometry]);

  useEffect(() => {
    return () => {
      wireGeometry.dispose();
    };
  }, [wireGeometry]);

  // 3. Materials with proper lifecycle disposal (Task 10)
  const wireMat = useMemo(() => {
    return new THREE.LineBasicMaterial({
      color: material.emissive || '#38bdf8',
      transparent: true,
      opacity: 0,
    });
  }, [material.emissive]);

  useEffect(() => {
    return () => {
      wireMat.dispose();
    };
  }, [wireMat]);

  const mat = useMemo(() => {
    if (isLow) {
      return new THREE.MeshStandardMaterial({
        color: material.color,
        roughness: Math.max(0.15, material.roughness),
        metalness: material.metalness,
        transparent: true,
        opacity: 1,
        side: THREE.DoubleSide,
        ...(material.emissive
          ? {
              emissive: material.emissive,
              emissiveIntensity: material.emissiveIntensity || 0.15,
            }
          : {}),
      });
    }

    return new THREE.MeshPhysicalMaterial({
      color: material.color,
      roughness: material.roughness,
      metalness: material.metalness,
      transmission: material.transmission || 0,
      clearcoat: material.clearcoat || 0.8,
      transparent: true,
      opacity: 1,
      side: THREE.DoubleSide,
      envMapIntensity: 1.8,
      ior: material.id === 'diamond' ? 2.42 : material.id === 'ice' ? 1.31 : 1.5,
      ...(material.emissive
        ? {
            emissive: material.emissive,
            emissiveIntensity: material.emissiveIntensity || 0.15,
          }
        : {}),
    });
  }, [material, isLow]);

  useEffect(() => {
    return () => {
      mat.dispose();
    };
  }, [mat]);

  // 4. Smooth scale and opacity damping during zoom transitions
  useFrame(() => {
    const curOpacity = opacity ?? zoomState.macroOpacity;
    const curWire = wireframeOpacity ?? zoomState.wireframeOpacity;
    const curScale = zoomState.macroScale;

    const isMeshVisible = curOpacity > 0.01;
    const isWireVisible = curWire > 0.01;

    if (groupRef.current) {
      groupRef.current.scale.setScalar(curScale);
      groupRef.current.visible = isMeshVisible || isWireVisible;
    }

    if (meshRef.current) {
      meshRef.current.visible = isMeshVisible;
      if (meshRef.current.material) {
        const m = meshRef.current.material as THREE.Material;
        m.opacity = curOpacity;
        m.transparent = curOpacity < 0.99;
        m.depthWrite = curOpacity > 0.85;
      }
    }
    if (wireRef.current) {
      wireRef.current.visible = isWireVisible;
      if (wireRef.current.material) {
        const wm = wireRef.current.material as THREE.LineBasicMaterial;
        wm.opacity = curWire * 0.45;
      }
    }
  });

  return (
    <group ref={groupRef} raycast={() => null}>
      <mesh
        ref={meshRef}
        raycast={() => null}
        geometry={geometry}
        material={mat}
        castShadow={!isLow}
        receiveShadow={!isLow}
      />
      {wireGeometry && (
        <lineSegments ref={wireRef} raycast={() => null} geometry={wireGeometry} material={wireMat} />
      )}
    </group>
  );
}

export default MacroObject;