'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { MaterialData, useStore, StoreState } from '@/store/useStore';
import { zoomState } from './zoomState';

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

  const geometry = useMemo(() => {
    switch (material.geometry) {
      case 'diamond-ring':
        return createDiamondRingGeometry();
      case 'coil':
        return createCoilGeometry();
      case 'racket':
        return createRacketGeometry();
      case 'lens':
        return createLensGeometry();
      case 'crystal-cube':
        return createCrystalCubeGeometry();
      case 'snowflake':
        return createSnowflakeGeometry();
      case 'fuselage':
        return createFuselageGeometry();
      case 'gold-bar':
        return createGoldBarGeometry();
      case 'titanium-bracket':
        return createTitaniumBracketGeometry();
      case 'silicon-wafer':
        return createSiliconWaferGeometry();
      case 'nanotube':
        return createNanotubeGeometry();
      case 'iron-core':
        return createIronCoreGeometry();
      default:
        return new THREE.SphereGeometry(1.5, isLow ? 32 : 64, isLow ? 32 : 64);
    }
  }, [material.geometry, isLow]);

  const wireGeometry = useMemo(() => {
    return new THREE.EdgesGeometry(geometry, 15);
  }, [geometry]);

  const wireMat = useMemo(() => {
    return new THREE.LineBasicMaterial({
      color: '#88ccff',
      transparent: true,
      opacity: 0,
    });
  }, []);

  const mat = useMemo(() => {
    if (isLow) {
      // Lightweight MeshStandardMaterial for smooth performance on phones and weak PCs
      return new THREE.MeshStandardMaterial({
        color: material.color,
        roughness: Math.max(0.2, material.roughness),
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
      transmission: material.transmission,
      clearcoat: material.clearcoat,
      transparent: true,
      opacity: 1,
      side: THREE.DoubleSide,
      envMapIntensity: 1.6,
      ...(material.emissive
        ? {
            emissive: material.emissive,
            emissiveIntensity: material.emissiveIntensity || 0.15,
          }
        : {}),
    });
  }, [material, isLow]);

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
      const meshMat = meshRef.current.material;
      if (meshMat instanceof THREE.Material) {
        meshMat.opacity = curOpacity;
        meshMat.transparent = curOpacity < 0.99;
      }
    }
    if (wireRef.current) {
      wireRef.current.visible = isWireVisible;
      const currentWireMat = wireRef.current.material;
      if (currentWireMat instanceof THREE.Material) {
        currentWireMat.opacity = curWire * 0.5;
      }
    }
  });

  return (
    <group ref={groupRef}>
      <mesh
        ref={meshRef}
        geometry={geometry}
        material={mat}
        castShadow={!isLow}
        receiveShadow={!isLow}
      />
      {wireGeometry && (
        <lineSegments ref={wireRef} geometry={wireGeometry} material={wireMat} />
      )}
    </group>
  );
}

function createDiamondRingGeometry(): THREE.BufferGeometry {
  const ringGeo = new THREE.TorusGeometry(1.2, 0.14, 32, 64);
  // Sharp natural crystal facets for authentic diamond brilliance
  const diamondGeo = new THREE.OctahedronGeometry(0.58, 0);
  diamondGeo.translate(0, 1.2 + 0.44, 0);

  const parts: THREE.BufferGeometry[] = [ringGeo, diamondGeo];
  // 4 jewelry prongs
  const prongGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.45, 12);
  const prongOffsets = [
    [0.22, 1.2 + 0.22, 0.22],
    [-0.22, 1.2 + 0.22, 0.22],
    [0.22, 1.2 + 0.22, -0.22],
    [-0.22, 1.2 + 0.22, -0.22],
  ];
  for (const [px, py, pz] of prongOffsets) {
    const prong = prongGeo.clone();
    prong.translate(px, py, pz);
    parts.push(prong);
  }

  const merged = mergeGeometries(parts);
  return merged || ringGeo;
}

function createCoilGeometry(): THREE.BufferGeometry {
  const points: THREE.Vector3[] = [];
  const turns = 8;
  const radius = 1.0;
  const tubeRadius = 0.5;

  for (let i = 0; i <= 360; i += 2) {
    const angle = (i * Math.PI) / 180;
    const coilAngle = angle * turns;
    const x = (radius + tubeRadius * Math.cos(coilAngle)) * Math.cos(angle);
    const y = tubeRadius * Math.sin(coilAngle);
    const z = (radius + tubeRadius * Math.cos(coilAngle)) * Math.sin(angle);
    points.push(new THREE.Vector3(x, y, z));
  }

  const curve = new THREE.CatmullRomCurve3(points, true);
  return new THREE.TubeGeometry(curve, 200, 0.08, 12, true);
}

function createRacketGeometry(): THREE.BufferGeometry {
  const headShape = new THREE.Shape();
  headShape.ellipse(0, 0.5, 0.82, 1.12, 0, Math.PI * 2, false, 0);

  // Real hollow cutout inside the racket frame
  const hole = new THREE.Path();
  hole.ellipse(0, 0.5, 0.68, 0.98, 0, Math.PI * 2, true, 0);
  headShape.holes.push(hole);

  const headGeo = new THREE.ExtrudeGeometry(headShape, {
    depth: 0.14,
    bevelEnabled: true,
    bevelThickness: 0.02,
    bevelSize: 0.02,
    bevelSegments: 4,
  });
  headGeo.translate(0, 0, -0.07);

  const handleGeo = new THREE.CylinderGeometry(0.09, 0.11, 1.25, 16);
  handleGeo.translate(0, -0.85, 0);

  const gripCap = new THREE.CylinderGeometry(0.12, 0.12, 0.08, 16);
  gripCap.translate(0, -1.48, 0);

  const merged = mergeGeometries([headGeo, handleGeo, gripCap]);
  return merged || headGeo;
}

function createLensGeometry(): THREE.BufferGeometry {
  const lens = new THREE.SphereGeometry(1.2, 48, 48);
  lens.scale(1, 0.28, 1);
  const mountRing = new THREE.TorusGeometry(1.22, 0.06, 16, 64);
  mountRing.rotateX(Math.PI / 2);
  const merged = mergeGeometries([lens, mountRing]);
  return merged || lens;
}

function createCrystalCubeGeometry(): THREE.BufferGeometry {
  const mainCube = new THREE.BoxGeometry(1.5, 1.5, 1.5);
  // Intergrown secondary cubic crystal stepped on face (authentic natural halite specimen)
  const subCube1 = new THREE.BoxGeometry(0.85, 0.85, 0.85);
  subCube1.translate(0.5, 0.5, 0.5);
  const subCube2 = new THREE.BoxGeometry(0.55, 0.55, 0.55);
  subCube2.translate(-0.55, -0.45, 0.55);
  return mergeGeometries([mainCube, subCube1, subCube2]) || mainCube;
}

function createSnowflakeGeometry(): THREE.BufferGeometry {
  const arms: THREE.BufferGeometry[] = [];

  for (let i = 0; i < 6; i++) {
    const angle = (i * 60 * Math.PI) / 180;

    const arm = new THREE.BoxGeometry(0.12, 1.4, 0.04);
    arm.rotateZ(angle);
    arm.translate(Math.cos(angle + Math.PI / 2) * 0.7, Math.sin(angle + Math.PI / 2) * 0.7, 0);
    arms.push(arm);

    const branch1 = new THREE.BoxGeometry(0.08, 0.5, 0.03);
    branch1.rotateZ(angle + Math.PI / 6);
    branch1.translate(
      Math.cos(angle + Math.PI / 2) * 0.5 + Math.cos(angle + Math.PI / 2 + Math.PI / 6) * 0.2,
      Math.sin(angle + Math.PI / 2) * 0.5 + Math.sin(angle + Math.PI / 2 + Math.PI / 6) * 0.2,
      0
    );
    arms.push(branch1);

    const branch2 = new THREE.BoxGeometry(0.08, 0.5, 0.03);
    branch2.rotateZ(angle - Math.PI / 6);
    branch2.translate(
      Math.cos(angle + Math.PI / 2) * 0.5 + Math.cos(angle + Math.PI / 2 - Math.PI / 6) * 0.2,
      Math.sin(angle + Math.PI / 2) * 0.5 + Math.sin(angle + Math.PI / 2 - Math.PI / 6) * 0.2,
      0
    );
    arms.push(branch2);
  }

  const center = new THREE.CylinderGeometry(0.2, 0.2, 0.05, 6);
  center.rotateX(Math.PI / 2);
  arms.push(center);

  return mergeGeometries(arms) || arms[0];
}

function createFuselageGeometry(): THREE.BufferGeometry {
  // Aerodynamic aerospace fuselage nacelle with nose cone and winglets
  const body = new THREE.CylinderGeometry(0.68, 0.72, 2.2, 32);
  const nose = new THREE.ConeGeometry(0.68, 0.85, 32);
  nose.translate(0, 1.52, 0);
  const tail = new THREE.CylinderGeometry(0.72, 0.42, 0.75, 32);
  tail.translate(0, -1.47, 0);

  const wingShape = new THREE.Shape();
  wingShape.moveTo(0, -0.4);
  wingShape.lineTo(1.6, -0.15);
  wingShape.lineTo(1.5, 0.15);
  wingShape.lineTo(0, 0.4);
  wingShape.closePath();

  const wing = new THREE.ExtrudeGeometry(wingShape, { depth: 0.05, bevelEnabled: true, bevelThickness: 0.015, bevelSize: 0.015 });
  wing.rotateY(Math.PI / 2);
  wing.translate(0.5, 0, 0);

  const wing2 = wing.clone();
  wing2.rotateY(Math.PI);
  wing2.translate(-1.0, 0, 0);

  return mergeGeometries([body, nose, tail, wing, wing2]) || body;
}

function createGoldBarGeometry(): THREE.BufferGeometry {
  const length = 2.2;
  const widthTop = 0.9;
  const widthBottom = 1.2;
  const height = 0.65;

  const shape = new THREE.Shape();
  shape.moveTo(-widthBottom / 2, -height / 2);
  shape.lineTo(widthBottom / 2, -height / 2);
  shape.lineTo(widthTop / 2, height / 2);
  shape.lineTo(-widthTop / 2, height / 2);
  shape.closePath();

  const barGeo = new THREE.ExtrudeGeometry(shape, {
    depth: length,
    bevelEnabled: true,
    bevelThickness: 0.06,
    bevelSize: 0.06,
    bevelSegments: 4,
  });
  barGeo.translate(0, 0, -length / 2);

  const stampGeo = new THREE.BoxGeometry(widthTop * 0.7, 0.02, length * 0.5);
  stampGeo.translate(0, height / 2 + 0.06, 0);

  return mergeGeometries([barGeo, stampGeo]) || barGeo;
}

function createTitaniumBracketGeometry(): THREE.BufferGeometry {
  const baseShape = new THREE.Shape();
  baseShape.moveTo(-1.2, -0.8);
  baseShape.lineTo(1.2, -0.8);
  baseShape.lineTo(1.2, -0.3);
  baseShape.lineTo(0.3, 1.1);
  baseShape.lineTo(-0.3, 1.1);
  baseShape.lineTo(-1.2, -0.3);
  baseShape.closePath();

  const hole = new THREE.Path();
  hole.moveTo(-0.5, -0.4);
  hole.lineTo(0.5, -0.4);
  hole.lineTo(0, 0.7);
  hole.closePath();
  baseShape.holes.push(hole);

  const bracket = new THREE.ExtrudeGeometry(baseShape, {
    depth: 0.4,
    bevelEnabled: true,
    bevelThickness: 0.04,
    bevelSize: 0.04,
    bevelSegments: 3,
  });
  bracket.translate(0, 0, -0.2);
  return bracket;
}

function createSiliconWaferGeometry(): THREE.BufferGeometry {
  const wafer = new THREE.CylinderGeometry(1.4, 1.4, 0.06, 64);
  const ring1 = new THREE.TorusGeometry(1.25, 0.015, 16, 64);
  ring1.rotateX(Math.PI / 2);
  const ring2 = new THREE.TorusGeometry(0.75, 0.012, 16, 64);
  ring2.rotateX(Math.PI / 2);
  const notch = new THREE.BoxGeometry(0.08, 0.07, 0.15);
  notch.translate(1.4, 0, 0);
  return mergeGeometries([wafer, ring1, ring2, notch]) || wafer;
}

function createNanotubeGeometry(): THREE.BufferGeometry {
  const tube = new THREE.CylinderGeometry(0.85, 0.85, 2.4, 32, 1, true);
  const elements: THREE.BufferGeometry[] = [tube];

  for (let i = -3; i <= 3; i++) {
    const ring = new THREE.TorusGeometry(0.86, 0.025, 12, 32);
    ring.rotateX(Math.PI / 2);
    ring.translate(0, i * 0.35, 0);
    elements.push(ring);
  }

  return mergeGeometries(elements) || tube;
}

function createIronCoreGeometry(): THREE.BufferGeometry {
  const parts: THREE.BufferGeometry[] = [];
  const back = new THREE.BoxGeometry(0.3, 2.0, 1.0);
  back.translate(-0.6, 0, 0);
  parts.push(back);

  const top = new THREE.BoxGeometry(1.2, 0.3, 1.0);
  top.translate(0.15, 0.85, 0);
  parts.push(top);

  const mid = new THREE.BoxGeometry(1.2, 0.45, 1.0);
  mid.translate(0.15, 0, 0);
  parts.push(mid);

  const bot = new THREE.BoxGeometry(1.2, 0.3, 1.0);
  bot.translate(0.15, -0.85, 0);
  parts.push(bot);

  return mergeGeometries(parts) || back;
}

function mergeGeometries(geos: THREE.BufferGeometry[]): THREE.BufferGeometry | null {
  if (geos.length === 0) return null;
  if (geos.length === 1) return geos[0];

  const posArrays: Float32Array[] = [];
  const normalArrays: Float32Array[] = [];
  let totalVertices = 0;

  for (const rawGeo of geos) {
    // Unroll indexed geometries to non-indexed triangles so concatenation preserves exact topology
    const geo = rawGeo.index ? rawGeo.toNonIndexed() : rawGeo;
    geo.computeVertexNormals();
    const pos = geo.getAttribute('position');
    const norm = geo.getAttribute('normal');
    if (pos) {
      posArrays.push(new Float32Array(pos.array));
      totalVertices += pos.count;
    }
    if (norm) {
      normalArrays.push(new Float32Array(norm.array));
    }
  }

  const mergedPos = new Float32Array(totalVertices * 3);
  const mergedNorm = new Float32Array(totalVertices * 3);
  let offset = 0;

  for (let i = 0; i < posArrays.length; i++) {
    mergedPos.set(posArrays[i], offset);
    if (normalArrays[i]) mergedNorm.set(normalArrays[i], offset);
    offset += posArrays[i].length;
  }

  const merged = new THREE.BufferGeometry();
  merged.setAttribute('position', new THREE.BufferAttribute(mergedPos, 3));
  merged.setAttribute('normal', new THREE.BufferAttribute(mergedNorm, 3));
  return merged;
}
