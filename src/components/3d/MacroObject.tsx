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
      case 'diamond-gem':
        return createDiamondGemGeometry();
      case 'graphite-pencil':
        return createGraphitePencilGeometry();
      case 'salt-cube':
        return createSaltCubeGeometry();
      case 'quartz-crystal':
        return createQuartzCrystalGeometry();
      case 'mxene-capacitor':
      case 'ice-crystal':
        return createMxeneCapacitorGeometry();
      case 'gold-ingot':
        return createGoldIngotGeometry();
      case 'copper-coil':
        return createCopperCoilGeometry();
      case 'iron-beam':
        return createIronBeamGeometry();
      case 'aluminum-wing':
        return createAluminumWingGeometry();
      case 'titanium-implant':
        return createTitaniumImplantGeometry();
      case 'silicon-chip':
        return createSiliconChipGeometry();
      case 'teflon-pan':
        return createTeflonPanGeometry();
      case 'lithium-battery':
        return createLithiumBatteryGeometry();
      case 'ceramic-blade':
        return createCeramicBladeGeometry();
      case 'rubber-tyre':
        return createRubberTyreGeometry();
      // Advanced Nano Materials
      case 'nanotube-coil':
      case 'nanotube':
        return createNanotubeCoilGeometry();
      case 'buckyball-cage':
        return createBuckyballGeometry();
      case 'solar-panel':
        return createSolarPanelGeometry();
      case 'aerogel-block':
        return createAerogelBlockGeometry();
      case 'nitinol-stent':
        return createNitinolStentGeometry();
      // Backward compatibility aliases
      case 'graphene-sheet':
        return createGraphitePencilGeometry();
      case 'gold-bar':
        return createGoldIngotGeometry();
      case 'silicon-wafer':
        return createSiliconChipGeometry();
      case 'turbine-blade':
        return createAluminumWingGeometry();
      default:
        return createDiamondGemGeometry();
    }
  }, [material.geometry]);

  const wireGeometry = useMemo(() => {
    return new THREE.EdgesGeometry(geometry, 22);
  }, [geometry]);

  const wireMat = useMemo(() => {
    return new THREE.LineBasicMaterial({
      color: material.emissive || '#38bdf8',
      transparent: true,
      opacity: 0,
    });
  }, [material.emissive]);

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

// ── 1. Kim Cương Tự Nhiên: Giác Cắt Tròn Rực Rỡ (Brilliant Cut 16 Cạnh) ──────
function createDiamondGemGeometry(): THREE.BufferGeometry {
  const parts: THREE.BufferGeometry[] = [];

  // Table (Mặt phẳng tròn đỉnh 16 cạnh)
  const table = new THREE.CircleGeometry(0.95, 16);
  table.rotateX(-Math.PI / 2);
  table.translate(0, 0.64, 0);
  parts.push(table);

  // Crown (Tầng vương miện từ y = 0.04 đến y = 0.64, 16 cạnh)
  const crown = new THREE.CylinderGeometry(0.95, 1.62, 0.6, 16, 1);
  crown.translate(0, 0.34, 0);
  parts.push(crown);

  // Girdle (Vành đai giữa từ y = -0.04 đến y = 0.04, 16 cạnh)
  const girdle = new THREE.CylinderGeometry(1.63, 1.63, 0.08, 16, 1);
  parts.push(girdle);

  // Pavilion (Tầng chóp đáy từ y = -1.54 đến y = -0.04, 16 cạnh)
  const pavilion = new THREE.CylinderGeometry(1.62, 0.04, 1.5, 16, 1);
  pavilion.translate(0, -0.79, 0);
  parts.push(pavilion);

  const merged = mergeGeometries(parts) || crown;
  merged.center();
  return merged;
}

// ── 2. Than Chì & Graphene: Ruột Bút Chì Lục Giác & Ngòi Chì ──────────────────
function createGraphitePencilGeometry(): THREE.BufferGeometry {
  const parts: THREE.BufferGeometry[] = [];

  // Thân bút chì lục giác (y: -1.1 đến +0.9)
  const body = new THREE.CylinderGeometry(0.52, 0.52, 2.0, 6);
  body.translate(0, -0.1, 0);
  parts.push(body);

  // Phần gỗ gọt hình nón cụt (y: +0.9 đến +1.6)
  const shavedWood = new THREE.CylinderGeometry(0.18, 0.52, 0.7, 6);
  shavedWood.translate(0, 1.25, 0);
  parts.push(shavedWood);

  // Ngòi chì nhọn nối tiếp đỉnh nón cụt (y: +1.6 đến +2.05)
  const leadTip = new THREE.ConeGeometry(0.18, 0.45, 16);
  leadTip.translate(0, 1.825, 0);
  parts.push(leadTip);

  // Đai kim loại đuôi bút có gân (y: -1.5 đến -1.1)
  const ferrule = new THREE.CylinderGeometry(0.535, 0.535, 0.4, 24);
  ferrule.translate(0, -1.3, 0);
  parts.push(ferrule);

  // 2 Gân nổi trên đai kim loại
  const rib1 = new THREE.TorusGeometry(0.54, 0.018, 12, 24);
  rib1.rotateX(Math.PI / 2);
  rib1.translate(0, -1.2, 0);
  const rib2 = new THREE.TorusGeometry(0.54, 0.018, 12, 24);
  rib2.rotateX(Math.PI / 2);
  rib2.translate(0, -1.4, 0);
  parts.push(rib1, rib2);

  // Cục tẩy bo tròn ở đuôi bút
  const eraser = new THREE.CylinderGeometry(0.49, 0.49, 0.28, 24);
  eraser.translate(0, -1.64, 0);
  parts.push(eraser);

  const eraserCap = new THREE.SphereGeometry(0.49, 24, 12, 0, Math.PI * 2, 0, Math.PI * 0.5);
  eraserCap.rotateX(Math.PI);
  eraserCap.translate(0, -1.78, 0);
  parts.push(eraserCap);

  const merged = mergeGeometries(parts) || body;
  merged.center();
  return merged;
}

// ── 3. Muối Ăn Tinh Khiết (NaCl): Tinh Thể Muối Lập Phương Bậc Thang ──────────
function createSaltCubeGeometry(): THREE.BufferGeometry {
  const parts: THREE.BufferGeometry[] = [];

  // Khối lập phương chính
  const mainCube = new THREE.BoxGeometry(1.9, 1.9, 1.9);
  parts.push(mainCube);

  // Các bậc tinh thể Hopper phát triển đồng tâm trên 6 mặt
  const step1X = new THREE.BoxGeometry(2.06, 1.45, 1.45);
  const step2X = new THREE.BoxGeometry(2.18, 1.0, 1.0);
  const step3X = new THREE.BoxGeometry(2.28, 0.55, 0.55);

  const step1Y = new THREE.BoxGeometry(1.45, 2.06, 1.45);
  const step2Y = new THREE.BoxGeometry(1.0, 2.18, 1.0);
  const step3Y = new THREE.BoxGeometry(0.55, 2.28, 0.55);

  const step1Z = new THREE.BoxGeometry(1.45, 1.45, 2.06);
  const step2Z = new THREE.BoxGeometry(1.0, 1.0, 2.18);
  const step3Z = new THREE.BoxGeometry(0.55, 0.55, 2.28);

  parts.push(step1X, step2X, step3X, step1Y, step2Y, step3Y, step1Z, step2Z, step3Z);

  const merged = mergeGeometries(parts) || mainCube;
  merged.center();
  return merged;
}

// ── 4. Thạch Anh & Thủy Tinh (SiO₂): Trụ Thạch Anh Lục Lăng Kèm Chóp Nhọn ─────
function createQuartzCrystalGeometry(): THREE.BufferGeometry {
  const parts: THREE.BufferGeometry[] = [];

  // Trụ lục lăng chính ở trung tâm
  const mainPrism = new THREE.CylinderGeometry(0.78, 0.78, 2.2, 6);
  mainPrism.translate(0, -0.1, 0);
  parts.push(mainPrism);

  // Chóp kim tự tháp 6 mặt trên đỉnh
  const mainTip = new THREE.ConeGeometry(0.78, 1.05, 6);
  mainTip.translate(0, 1.525, 0);
  parts.push(mainTip);

  // Đế khoáng vật (Mineral Base Matrix)
  const baseMatrix = new THREE.CylinderGeometry(1.35, 1.55, 0.6, 8);
  baseMatrix.translate(0, -1.4, 0);
  parts.push(baseMatrix);

  // Tinh thể phụ bên trái mọc nghiêng từ đế khoáng vật
  const sideLeft = new THREE.CylinderGeometry(0.38, 0.38, 1.2, 6);
  const sideLeftTip = new THREE.ConeGeometry(0.38, 0.55, 6);
  sideLeftTip.translate(0, 0.875, 0);
  const leftCluster = mergeGeometries([sideLeft, sideLeftTip]);
  if (leftCluster) {
    leftCluster.rotateZ(0.42);
    leftCluster.translate(-0.72, -0.55, 0.15);
    parts.push(leftCluster);
  }

  // Tinh thể phụ bên phải mọc nghiêng từ đế khoáng vật
  const sideRight = new THREE.CylinderGeometry(0.34, 0.34, 1.05, 6);
  const sideRightTip = new THREE.ConeGeometry(0.34, 0.48, 6);
  sideRightTip.translate(0, 0.765, 0);
  const rightCluster = mergeGeometries([sideRight, sideRightTip]);
  if (rightCluster) {
    rightCluster.rotateZ(-0.46);
    rightCluster.translate(0.72, -0.62, -0.12);
    parts.push(rightCluster);
  }

  // Tinh thể phụ nhỏ phía trước
  const sideFront = new THREE.CylinderGeometry(0.24, 0.24, 0.8, 6);
  const sideFrontTip = new THREE.ConeGeometry(0.24, 0.38, 6);
  sideFrontTip.translate(0, 0.59, 0);
  const frontCluster = mergeGeometries([sideFront, sideFrontTip]);
  if (frontCluster) {
    frontCluster.rotateX(0.4);
    frontCluster.translate(0.15, -0.75, 0.75);
    parts.push(frontCluster);
  }

  const merged = mergeGeometries(parts) || mainPrism;
  merged.center();
  return merged;
}

// ── 5. Siêu Tụ Điện MXene: Cuộn Màng Mỏng Nano Tích Điện Siêu Tụ ──────────────
function createMxeneCapacitorGeometry(): THREE.BufferGeometry {
  const parts: THREE.BufferGeometry[] = [];

  // Lõi trục trung tâm
  const core = new THREE.CylinderGeometry(0.4, 0.4, 2.3, 28);
  parts.push(core);

  // Các lớp màng mỏng 2D xếp bậc (Telescoped concentric layers)
  const radii = [0.64, 0.88, 1.12, 1.32];
  const heights = [2.05, 1.82, 1.6, 1.38];

  for (let i = 0; i < radii.length; i++) {
    const cyl = new THREE.CylinderGeometry(radii[i], radii[i], heights[i], 32);
    parts.push(cyl);
  }

  // Tấm màng mỏng 2D mở ra ngoài từ vỏ
  const flap = new THREE.BoxGeometry(0.95, 1.36, 0.05);
  flap.rotateY(-0.35);
  flap.translate(1.38, 0, 0.52);
  parts.push(flap);

  // 2 Cực điện Dương & Âm trên đỉnh
  const tabPos = new THREE.BoxGeometry(0.18, 0.5, 0.08);
  tabPos.translate(-0.22, 1.35, 0);
  const tabNeg = new THREE.BoxGeometry(0.18, 0.5, 0.08);
  tabNeg.translate(0.22, 1.35, 0);
  parts.push(tabPos, tabNeg);

  const merged = mergeGeometries(parts) || core;
  merged.center();
  return merged;
}

// ── 6. Vàng Ròng 24K: Thỏi Vàng Đúc Chuẩn (Fine Gold 999.9) ───────────────────
function createGoldIngotGeometry(): THREE.BufferGeometry {
  const parts: THREE.BufferGeometry[] = [];

  // Khối thỏi vàng hình chóp cụt chữ nhật
  const base = new THREE.CylinderGeometry(1.18, 1.5, 0.65, 4);
  base.rotateY(Math.PI / 4);
  base.scale(1.48, 1.0, 0.88);
  parts.push(base);

  // Mặt bảng phía trên
  const topPlate = new THREE.BoxGeometry(2.05, 0.06, 1.05);
  topPlate.translate(0, 0.34, 0);
  parts.push(topPlate);

  // Viền nổi quanh mặt trên
  const borderZ1 = new THREE.BoxGeometry(2.08, 0.06, 0.07);
  borderZ1.translate(0, 0.37, 0.5);
  const borderZ2 = new THREE.BoxGeometry(2.08, 0.06, 0.07);
  borderZ2.translate(0, 0.37, -0.5);
  const borderX1 = new THREE.BoxGeometry(0.07, 0.06, 1.0);
  borderX1.translate(1.0, 0.37, 0);
  const borderX2 = new THREE.BoxGeometry(0.07, 0.06, 1.0);
  borderX2.translate(-1.0, 0.37, 0);
  parts.push(borderZ1, borderZ2, borderX1, borderX2);

  // Mộc tròn dập nổi
  const mintStamp = new THREE.CylinderGeometry(0.24, 0.24, 0.05, 24);
  mintStamp.translate(-0.54, 0.38, 0);
  const stampRing = new THREE.TorusGeometry(0.16, 0.02, 10, 24);
  stampRing.rotateX(Math.PI / 2);
  stampRing.translate(-0.54, 0.40, 0);
  parts.push(mintStamp, stampRing);

  // Ký hiệu 999.9 dập nổi
  const d1 = new THREE.BoxGeometry(0.14, 0.04, 0.22);
  d1.translate(0.05, 0.38, 0);
  const d2 = new THREE.BoxGeometry(0.14, 0.04, 0.22);
  d2.translate(0.26, 0.38, 0);
  const d3 = new THREE.BoxGeometry(0.14, 0.04, 0.22);
  d3.translate(0.47, 0.38, 0);
  const dot = new THREE.BoxGeometry(0.05, 0.04, 0.05);
  dot.translate(0.58, 0.38, -0.07);
  const d4 = new THREE.BoxGeometry(0.14, 0.04, 0.22);
  d4.translate(0.72, 0.38, 0);
  parts.push(d1, d2, d3, dot, d4);

  const merged = mergeGeometries(parts) || base;
  merged.center();
  return merged;
}

// ── 7. Đồng Đỏ Dẫn Điện (Cu): Cuộn Dây Cáp Đồng & Lõi Đồng Dẫn Điện ──────────
function createCopperCoilGeometry(): THREE.BufferGeometry {
  const parts: THREE.BufferGeometry[] = [];

  // Lõi cuộn Rulo
  const spool = new THREE.CylinderGeometry(0.6, 0.6, 2.4, 32);
  parts.push(spool);

  // 2 Mặt bích giữ dây ở hai đầu
  const topFlange = new THREE.CylinderGeometry(1.42, 1.42, 0.14, 36);
  topFlange.translate(0, 1.15, 0);
  const botFlange = new THREE.CylinderGeometry(1.42, 1.42, 0.14, 36);
  botFlange.translate(0, -1.15, 0);
  parts.push(topFlange, botFlange);

  // 10 Vòng dây đồng xoắn chặt quanh trục
  const numRings = 10;
  for (let i = 0; i < numRings; i++) {
    const y = (i - (numRings - 1) / 2) * 0.215;
    const ring = new THREE.TorusGeometry(1.05, 0.105, 16, 36);
    ring.rotateX(Math.PI / 2);
    ring.translate(0, y, 0);
    parts.push(ring);
  }

  // Đầu cáp đồng vươn ra theo phương tiếp tuyến
  const lead = new THREE.CylinderGeometry(0.11, 0.11, 0.75, 16);
  lead.rotateX(Math.PI / 2);
  lead.translate(1.05, 0.88, 0.45);
  parts.push(lead);

  // Đầu cáp đồng lộ 7 sợi lõi bện (1 sợi trung tâm + 6 sợi quấn quanh)
  const coreStrand = new THREE.CylinderGeometry(0.025, 0.025, 0.32, 12);
  coreStrand.rotateX(Math.PI / 2);
  coreStrand.translate(1.05, 0.88, 0.92);
  parts.push(coreStrand);

  for (let k = 0; k < 6; k++) {
    const angle = (k * 2 * Math.PI) / 6;
    const sx = 1.05 + Math.cos(angle) * 0.054;
    const sy = 0.88 + Math.sin(angle) * 0.054;
    const strand = new THREE.CylinderGeometry(0.024, 0.024, 0.32, 12);
    strand.rotateX(Math.PI / 2);
    strand.translate(sx, sy, 0.92);
    parts.push(strand);
  }

  const merged = mergeGeometries(parts) || spool;
  merged.center();
  return merged;
}

// ── 8. Thép Xây Dựng & Sắt (Fe-C): Dầm Thép Hình Chữ I Công Trình ────────────
function createIronBeamGeometry(): THREE.BufferGeometry {
  const parts: THREE.BufferGeometry[] = [];
  const length = 2.75;

  // Bản bụng dọc (Web)
  const web = new THREE.BoxGeometry(0.18, 1.76, length);
  parts.push(web);

  // Bản cánh trên và dưới (Flanges)
  const topFlange = new THREE.BoxGeometry(1.6, 0.22, length);
  topFlange.translate(0, 0.99, 0);
  const botFlange = new THREE.BoxGeometry(1.6, 0.22, length);
  botFlange.translate(0, -0.99, 0);
  parts.push(topFlange, botFlange);

  // Mối hàn góc lượn (fillet welds) tại giao tuyến giữa bản bụng và bản cánh
  const weldCoords = [
    [0.11, 0.86],
    [-0.11, 0.86],
    [0.11, -0.86],
    [-0.11, -0.86],
  ];
  for (const [wx, wy] of weldCoords) {
    const weld = new THREE.CylinderGeometry(0.045, 0.045, length, 12);
    weld.rotateX(Math.PI / 2);
    weld.translate(wx, wy, 0);
    parts.push(weld);
  }

  // Gân tăng cứng chạm khít bản bụng và 2 cánh
  for (let i = -1; i <= 1; i++) {
    const zPos = i * 0.9;
    const stiffR = new THREE.BoxGeometry(0.66, 1.76, 0.12);
    stiffR.translate(0.42, 0, zPos);
    const stiffL = new THREE.BoxGeometry(0.66, 1.76, 0.12);
    stiffL.translate(-0.42, 0, zPos);
    parts.push(stiffR, stiffL);
  }

  // 2 Hàng bulông lục giác trên bản cánh
  for (let z = -1.1; z <= 1.1; z += 0.55) {
    const boltL = new THREE.CylinderGeometry(0.07, 0.07, 0.28, 6);
    boltL.translate(-0.5, 1.02, z);
    const boltR = new THREE.CylinderGeometry(0.07, 0.07, 0.28, 6);
    boltR.translate(0.5, 1.02, z);
    parts.push(boltL, boltR);
  }

  const merged = mergeGeometries(parts) || web;
  merged.center();
  return merged;
}

// ── 9. Nhôm Hàng Không (Al): Cánh Phụ Khí Động Học Máy Bay (Winglet) ─────────
function createAluminumWingGeometry(): THREE.BufferGeometry {
  const parts: THREE.BufferGeometry[] = [];

  // Biên dạng cánh khí động học vát xéo
  const wingShape = new THREE.Shape();
  wingShape.moveTo(-1.1, -1.25);
  wingShape.lineTo(0.45, -1.25);
  wingShape.quadraticCurveTo(0.85, -0.4, 1.15, 1.25);
  wingShape.lineTo(0.35, 1.35);
  wingShape.quadraticCurveTo(-0.35, 0.2, -1.1, -1.25);
  wingShape.closePath();

  const wing = new THREE.ExtrudeGeometry(wingShape, {
    depth: 0.24,
    bevelEnabled: true,
    bevelThickness: 0.07,
    bevelSize: 0.07,
    bevelSegments: 4,
  });
  wing.translate(0, 0, -0.12);
  wing.rotateY(0.35);
  parts.push(wing);

  // Winglet uốn cong vươn cao ở đầu mút cánh
  const wingletTip = new THREE.CylinderGeometry(0.08, 0.14, 0.65, 16);
  wingletTip.rotateZ(-0.45);
  wingletTip.translate(0.95, 1.48, 0.05);
  parts.push(wingletTip);

  // Đế gá CNC hợp kim nhôm ở gốc cánh
  const rootBase = new THREE.BoxGeometry(1.95, 0.24, 0.85);
  rootBase.translate(-0.25, -1.35, 0);
  parts.push(rootBase);

  // Gân chịu lực CNC trên đế gá
  const rib1 = new THREE.BoxGeometry(0.08, 0.28, 0.65);
  rib1.translate(-0.75, -1.18, 0);
  const rib2 = new THREE.BoxGeometry(0.08, 0.28, 0.65);
  rib2.translate(-0.25, -1.18, 0);
  const rib3 = new THREE.BoxGeometry(0.08, 0.28, 0.65);
  rib3.translate(0.25, -1.18, 0);
  parts.push(rib1, rib2, rib3);

  const merged = mergeGeometries(parts) || wing;
  merged.center();
  return merged;
}

// ── 10. Titan Y Tế Siêu Bền (Ti): Khớp Háng Nhân Tạo Cấy Ghép (Hip Implant) ──
function createTitaniumImplantGeometry(): THREE.BufferGeometry {
  const parts: THREE.BufferGeometry[] = [];

  // Thân trụ cắm xương đùi thuôn dưới, to trên
  const stem = new THREE.CylinderGeometry(0.42, 0.16, 2.1, 24);
  stem.translate(0.25, -0.55, 0);
  parts.push(stem);

  // Các vòng gờ nhám tích hợp xương
  for (let i = -2; i <= 2; i++) {
    const r = 0.31 + i * 0.032;
    const rib = new THREE.TorusGeometry(r, 0.025, 12, 24);
    rib.rotateX(Math.PI / 2);
    rib.translate(0.25, -0.35 + i * 0.24, 0);
    parts.push(rib);
  }

  // Cổ khớp nối liền mạch đúng hướng vào tâm chỏm cầu (-0.52, 1.2, 0)
  const neck = createStrutBetween(
    new THREE.Vector3(0.25, 0.42, 0),
    new THREE.Vector3(-0.52, 1.2, 0),
    0.22
  );
  if (neck) parts.push(neck);

  // Vành vai cổ khớp
  const collar = new THREE.TorusGeometry(0.38, 0.05, 14, 24);
  collar.rotateX(Math.PI / 2);
  collar.rotateZ(Math.PI / 4);
  collar.translate(0.12, 0.55, 0);
  parts.push(collar);

  // Chỏm cầu khớp xoay (Femoral Ball Head)
  const head = new THREE.SphereGeometry(0.54, 32, 32);
  head.translate(-0.52, 1.2, 0);
  parts.push(head);

  // Chén ổ cối (Acetabular Cup) bao phía trên chỏm cầu
  const cup = new THREE.SphereGeometry(0.63, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.52);
  cup.rotateZ(-0.35);
  cup.translate(-0.52, 1.2, 0);
  parts.push(cup);

  const cupRim = new THREE.TorusGeometry(0.63, 0.04, 14, 32);
  cupRim.rotateX(Math.PI / 2);
  cupRim.rotateZ(-0.35);
  cupRim.translate(-0.52, 1.2, 0);
  parts.push(cupRim);

  const merged = mergeGeometries(parts) || stem;
  merged.center();
  return merged;
}

// ── 11. Silic Tinh Khiết Bán Dẫn (Si): Đĩa Bán Dẫn Silicon Wafer 300mm ───────
function createSiliconChipGeometry(): THREE.BufferGeometry {
  const parts: THREE.BufferGeometry[] = [];
  const R = 1.58;

  // Đĩa bán dẫn tròn siêu phẳng
  const wafer = new THREE.CylinderGeometry(R, R, 0.08, 64);
  parts.push(wafer);

  // Vành bo viền mép đĩa wafer
  const rim = new THREE.TorusGeometry(R, 0.024, 12, 64);
  rim.rotateX(Math.PI / 2);
  parts.push(rim);

  // Khấc định vị mép đĩa (Alignment Notch)
  const notch = new THREE.BoxGeometry(0.12, 0.1, 0.28);
  notch.translate(R - 0.04, 0, 0);
  parts.push(notch);

  // Lưới đường mạch quang khắc cắt chuẩn theo chiều dài dây cung 2 * sqrt(R^2 - d^2)
  const maxR = R - 0.06;
  for (let i = -3; i <= 3; i++) {
    if (i === 0) continue;
    const d = i * 0.36;
    const chord = 2 * Math.sqrt(Math.max(0, maxR * maxR - d * d));
    const lineX = new THREE.BoxGeometry(chord, 0.02, 0.03);
    lineX.translate(0, 0.05, d);
    const lineZ = new THREE.BoxGeometry(0.03, 0.02, chord);
    lineZ.translate(d, 0.05, 0);
    parts.push(lineX, lineZ);
  }

  // Đế chip CPU ở tâm
  const die = new THREE.BoxGeometry(0.88, 0.06, 0.88);
  die.translate(0, 0.06, 0);
  const dieCap = new THREE.BoxGeometry(0.68, 0.03, 0.68);
  dieCap.translate(0, 0.095, 0);
  parts.push(die, dieCap);

  const merged = mergeGeometries(parts) || wafer;
  merged.center();
  return merged;
}

// ── 12. Nhựa Chống Dính Teflon (PTFE): Chảo Chiên Chống Dính & Tay Cầm ───────
function createTeflonPanGeometry(): THREE.BufferGeometry {
  const parts: THREE.BufferGeometry[] = [];

  // Đáy chảo phẳng
  const base = new THREE.CylinderGeometry(1.15, 1.05, 0.12, 36);
  base.translate(0, -0.25, 0);
  parts.push(base);

  // Đáy từ (Magnetic Induction Bottom Plate)
  const inductionPlate = new THREE.CylinderGeometry(1.02, 1.02, 0.03, 36);
  inductionPlate.translate(0, -0.32, 0);
  parts.push(inductionPlate);

  // Vòng dẫn nhiệt đồng tâm dưới đáy
  const ring1 = new THREE.TorusGeometry(0.85, 0.02, 12, 36);
  ring1.rotateX(Math.PI / 2);
  ring1.translate(0, -0.32, 0);
  const ring2 = new THREE.TorusGeometry(0.5, 0.02, 12, 36);
  ring2.rotateX(Math.PI / 2);
  ring2.translate(0, -0.32, 0);
  parts.push(ring1, ring2);

  // Thành chảo loe rộng (outer & inner wall để có độ dày thực tế)
  const outerWall = new THREE.CylinderGeometry(1.42, 1.15, 0.52, 36, 1, true);
  outerWall.translate(0, 0.05, 0);
  const innerWall = new THREE.CylinderGeometry(1.36, 1.09, 0.52, 36, 1, true);
  innerWall.translate(0, 0.05, 0);
  parts.push(outerWall, innerWall);

  // Vành miệng chảo bo tròn
  const rim = new THREE.TorusGeometry(1.39, 0.045, 14, 36);
  rim.rotateX(Math.PI / 2);
  rim.translate(0, 0.31, 0);
  parts.push(rim);

  // Khâu gắn kim loại tiếp xúc thành chảo
  const connector = new THREE.CylinderGeometry(0.12, 0.12, 0.32, 16);
  connector.rotateX(Math.PI / 2);
  connector.translate(0, 0.16, 1.45);
  parts.push(connector);

  // Tay cầm dài gắn khít vào thành chảo
  const handle = createStrutBetween(
    new THREE.Vector3(0, 0.16, 1.45),
    new THREE.Vector3(0, 0.46, 2.75),
    0.13
  );
  if (handle) parts.push(handle);

  const handleGrip = new THREE.CylinderGeometry(0.15, 0.13, 0.38, 16);
  handleGrip.rotateX(Math.PI / 2);
  handleGrip.translate(0, 0.44, 2.65);
  parts.push(handleGrip);

  const merged = mergeGeometries(parts) || base;
  merged.center();
  return merged;
}

// ── 13. Pin Điện Thoại Lithium (LiCoO₂): Khối Pin Sạc Lithium Smartphone ─────
function createLithiumBatteryGeometry(): THREE.BufferGeometry {
  const parts: THREE.BufferGeometry[] = [];

  // Khối thân pin chữ nhật bo cạnh
  const body = new THREE.BoxGeometry(1.75, 2.45, 0.42);
  parts.push(body);

  // Viền hàn kín bao quanh thân pin
  const seal = new THREE.BoxGeometry(1.86, 2.56, 0.08);
  parts.push(seal);

  // Cụm mạch bảo vệ và cáp kết nối ở đầu trên
  const flexRibbon = new THREE.BoxGeometry(0.85, 0.28, 0.12);
  flexRibbon.translate(0, 1.36, 0);
  parts.push(flexRibbon);

  // 2 Chân tiếp xúc cực Dương (+) và Âm (-)
  const pin1 = new THREE.BoxGeometry(0.18, 0.2, 0.14);
  pin1.translate(-0.28, 1.54, 0);
  const pin2 = new THREE.BoxGeometry(0.18, 0.2, 0.14);
  pin2.translate(0.28, 1.54, 0);
  parts.push(pin1, pin2);

  // Van an toàn (Safety Vent Disk)
  const vent = new THREE.CylinderGeometry(0.13, 0.13, 0.05, 20);
  vent.translate(0.62, 1.25, 0);
  parts.push(vent);

  // 4 Vạch dung lượng nổi trên mặt pin
  for (let i = 0; i < 4; i++) {
    const bar = new THREE.BoxGeometry(0.48, 0.06, 0.04);
    bar.translate(0, -0.45 + i * 0.18, 0.22);
    parts.push(bar);
  }

  const merged = mergeGeometries(parts) || body;
  merged.center();
  return merged;
}

// ── 14. Gốm Sứ Kỹ Thuật (Al₂O₃): Lưỡi Dao Gốm Sắc Bén & Cán Dao ─────────────
function createCeramicBladeGeometry(): THREE.BufferGeometry {
  const parts: THREE.BufferGeometry[] = [];

  // Lưỡi dao gốm có cạnh cong sắc bén
  const bladeShape = new THREE.Shape();
  bladeShape.moveTo(-0.35, -0.38);
  bladeShape.lineTo(1.35, -0.34);
  bladeShape.lineTo(1.7, 0.02);
  bladeShape.lineTo(-0.35, 0.34);
  bladeShape.closePath();

  const blade = new THREE.ExtrudeGeometry(bladeShape, {
    depth: 0.07,
    bevelEnabled: true,
    bevelThickness: 0.025,
    bevelSize: 0.025,
    bevelSegments: 3,
  });
  blade.translate(0, 0, -0.035);
  parts.push(blade);

  // Khâu dao (Bolster) đặt đúng tại gốc lưỡi dao (x = -0.42)
  const bolster = new THREE.BoxGeometry(0.2, 0.62, 0.22);
  bolster.translate(-0.42, 0, 0);
  parts.push(bolster);

  // Cán dao nối tiếp phía sau khâu dao
  const handle = new THREE.BoxGeometry(1.15, 0.42, 0.18);
  handle.translate(-1.05, 0.05, 0);
  parts.push(handle);

  // 3 Đinh tán đính trên cán dao
  for (let i = -1; i <= 1; i++) {
    const rivet = new THREE.CylinderGeometry(0.045, 0.045, 0.22, 16);
    rivet.rotateX(Math.PI / 2);
    rivet.translate(-1.05 + i * 0.32, 0.05, 0);
    parts.push(rivet);
  }

  const merged = mergeGeometries(parts) || blade;
  merged.center();
  return merged;
}

// ── 15. Cao Su Tự Nhiên Đàn Hồi (Polymer): Lốp Xe Ô Tô Hoa Văn Rãnh Gai ──────
function createRubberTyreGeometry(): THREE.BufferGeometry {
  const parts: THREE.BufferGeometry[] = [];

  // Thân lốp cao su hình xuyến
  const tyreTorus = new THREE.TorusGeometry(1.22, 0.48, 24, 48);
  parts.push(tyreTorus);

  // Rãnh gai chữ V (directional V-chevron treads) trải rộng hết mặt lốp
  const numTreads = 22;
  for (let i = 0; i < numTreads; i++) {
    const angle = (i * 2 * Math.PI) / numTreads;
    const sinA = Math.sin(angle);
    const cosA = Math.cos(angle);

    // Cánh V bên trái
    const treadL = new THREE.BoxGeometry(0.12, 0.18, 0.32);
    treadL.rotateY(0.42);
    treadL.rotateZ(angle);
    treadL.translate(cosA * 1.66, sinA * 1.66, -0.16);

    // Cánh V bên phải
    const treadR = new THREE.BoxGeometry(0.12, 0.18, 0.32);
    treadR.rotateY(-0.42);
    treadR.rotateZ(angle);
    treadR.translate(cosA * 1.66, sinA * 1.66, 0.16);

    parts.push(treadL, treadR);
  }

  // Vành mâm hợp kim
  const rimBead = new THREE.TorusGeometry(0.78, 0.08, 16, 36);
  parts.push(rimBead);

  const rimBarrel = new THREE.CylinderGeometry(0.76, 0.76, 0.54, 36, 1, true);
  rimBarrel.rotateX(Math.PI / 2);
  parts.push(rimBarrel);

  // May-ơ trung tâm
  const hub = new THREE.CylinderGeometry(0.28, 0.28, 0.38, 24);
  hub.rotateX(Math.PI / 2);
  parts.push(hub);

  // 5 Ốc may-ơ (hexagonal lug nuts)
  for (let k = 0; k < 5; k++) {
    const na = (k * 2 * Math.PI) / 5;
    const nut = new THREE.CylinderGeometry(0.032, 0.032, 0.42, 6);
    nut.rotateX(Math.PI / 2);
    nut.translate(Math.cos(na) * 0.17, Math.sin(na) * 0.17, 0);
    parts.push(nut);
  }

  // 5 Chấu kép nối liền mạch từ may-ơ đến vành mâm
  for (let i = 0; i < 5; i++) {
    const a = (i * 2 * Math.PI) / 5;
    // Chấu 1
    const p1A = new THREE.Vector3(Math.cos(a - 0.09) * 0.24, Math.sin(a - 0.09) * 0.24, 0);
    const p2A = new THREE.Vector3(Math.cos(a - 0.09) * 0.76, Math.sin(a - 0.09) * 0.76, 0);
    const spokeA = createStrutBetween(p1A, p2A, 0.055);
    if (spokeA) parts.push(spokeA);

    // Chấu 2
    const p1B = new THREE.Vector3(Math.cos(a + 0.09) * 0.24, Math.sin(a + 0.09) * 0.24, 0);
    const p2B = new THREE.Vector3(Math.cos(a + 0.09) * 0.76, Math.sin(a + 0.09) * 0.76, 0);
    const spokeB = createStrutBetween(p1B, p2B, 0.055);
    if (spokeB) parts.push(spokeB);
  }

  const merged = mergeGeometries(parts) || tyreTorus;
  merged.center();
  return merged;
}

// ── 16. Ống Nano Carbon Đơn Vách: Bó Sợi Đồng Trục Nano Siêu Bền (SWCNT) ────
function createNanotubeCoilGeometry(): THREE.BufferGeometry {
  const parts: THREE.BufferGeometry[] = [];

  // Ống trụ nano trung tâm (Inner Core Tube)
  const innerTube = new THREE.CylinderGeometry(0.42, 0.42, 2.5, 32, 1, true);
  parts.push(innerTube);

  // Vỏ trụ nano đồng trục bên ngoài (Outer Sheath)
  const outerTube = new THREE.CylinderGeometry(0.82, 0.82, 2.7, 32, 1, true);
  parts.push(outerTube);

  // 7 Vòng gân chiral nano quấn quanh thân ống
  for (let i = 0; i < 7; i++) {
    const y = -1.05 + i * 0.35;
    const ring = new THREE.TorusGeometry(0.85, 0.045, 12, 32);
    ring.rotateX(Math.PI / 2);
    ring.translate(0, y, 0);
    parts.push(ring);
  }

  // Khuyên khóa từ tính nano ở 2 đầu cáp
  const capTop = new THREE.CylinderGeometry(0.92, 0.92, 0.22, 32, 1);
  capTop.translate(0, 1.35, 0);
  parts.push(capTop);

  const capBot = new THREE.CylinderGeometry(0.92, 0.92, 0.22, 32, 1);
  capBot.translate(0, -1.35, 0);
  parts.push(capBot);

  const merged = mergeGeometries(parts) || innerTube;
  merged.center();
  return merged;
}

// ── 17. Quả Cầu Buckyball C₆₀: Khung Lồng Đa Diện Geodesic Nano ─────────────
function createBuckyballGeometry(): THREE.BufferGeometry {
  const parts: THREE.BufferGeometry[] = [];

  // Vỏ lồng ngoài 20 mặt cụt 60 đỉnh (Geodesic Truncated Icosahedron Facets)
  const buckyShell = new THREE.IcosahedronGeometry(1.35, 1);
  parts.push(buckyShell);

  // Lõi lượng tử nano phát sáng bên trong (Quantum Dot Core)
  const innerCore = new THREE.SphereGeometry(0.65, 24, 24);
  parts.push(innerCore);

  // Vòng quỹ đạo ổn định nano xích đạo
  const equatorRing = new THREE.TorusGeometry(1.5, 0.04, 12, 48);
  equatorRing.rotateX(Math.PI / 2);
  parts.push(equatorRing);

  const polarRing = new THREE.TorusGeometry(1.5, 0.04, 12, 48);
  polarRing.rotateY(Math.PI / 2);
  parts.push(polarRing);

  const merged = mergeGeometries(parts) || buckyShell;
  merged.center();
  return merged;
}

// ── 18. Mô-đun Pin Năng Lượng Mặt Trời Perovskite Tandem Đa Lớp ──────────────
function createSolarPanelGeometry(): THREE.BufferGeometry {
  const parts: THREE.BufferGeometry[] = [];

  // Tấm nền bán dẫn quang điện Perovskite (Active Absorber Layer)
  const panel = new THREE.BoxGeometry(2.4, 0.08, 2.4);
  parts.push(panel);

  // Khung viền nhôm bảo vệ 4 cạnh
  const borderX1 = new THREE.BoxGeometry(2.5, 0.14, 0.08);
  borderX1.translate(0, 0, 1.22);
  parts.push(borderX1);

  const borderX2 = new THREE.BoxGeometry(2.5, 0.14, 0.08);
  borderX2.translate(0, 0, -1.22);
  parts.push(borderX2);

  const borderZ1 = new THREE.BoxGeometry(0.08, 0.14, 2.4);
  borderZ1.translate(1.22, 0, 0);
  parts.push(borderZ1);

  const borderZ2 = new THREE.BoxGeometry(0.08, 0.14, 2.4);
  borderZ2.translate(-1.22, 0, 0);
  parts.push(borderZ2);

  // 5 Đường busbar dẫn điện mạ vàng trên mặt pin
  for (let i = 0; i < 5; i++) {
    const x = -0.9 + i * 0.45;
    const busbar = new THREE.BoxGeometry(0.04, 0.03, 2.3);
    busbar.translate(x, 0.05, 0);
    parts.push(busbar);
  }

  // Tấm đế gốm tản nhiệt phía dưới
  const base = new THREE.BoxGeometry(2.35, 0.06, 2.35);
  base.translate(0, -0.07, 0);
  parts.push(base);

  const merged = mergeGeometries(parts) || panel;
  merged.center();
  return merged;
}

// ── 19. Khói Đông Lạnh Aerogel: Khối Tinh Thể Siêu Nhẹ Khói Xanh Rayleigh ────
function createAerogelBlockGeometry(): THREE.BufferGeometry {
  const parts: THREE.BufferGeometry[] = [];

  // Khối lập phương aerogel chính bo góc mềm
  const mainBlock = new THREE.BoxGeometry(1.85, 1.85, 1.85, 4, 4, 4);
  parts.push(mainBlock);

  // Đĩa chân đế công nghệ siêu mỏng
  const basePedestal = new THREE.CylinderGeometry(1.3, 1.35, 0.08, 32);
  basePedestal.translate(0, -1.0, 0);
  parts.push(basePedestal);

  // Khuyên phát quang nâng đỡ trọng lực (Anti-Gravity Nano Levitation Ring)
  const levRing = new THREE.TorusGeometry(1.4, 0.035, 12, 48);
  levRing.rotateX(Math.PI / 2);
  levRing.translate(0, -0.85, 0);
  parts.push(levRing);

  const merged = mergeGeometries(parts) || mainBlock;
  merged.center();
  return merged;
}

// ── 20. Hợp Kim Nhớ Hình Nitinol: Stent Mạch Vành Tim Quả Trám Tự Bung ────────
function createNitinolStentGeometry(): THREE.BufferGeometry {
  const parts: THREE.BufferGeometry[] = [];

  const stentRadius = 0.85;
  const numRings = 7;
  const strutsPerRing = 10;
  const ringHeight = 0.35;

  for (let r = 0; r < numRings; r++) {
    const yCenter = (r - (numRings - 1) / 2) * ringHeight;

    for (let s = 0; s < strutsPerRing; s++) {
      const a1 = (s * 2 * Math.PI) / strutsPerRing;
      const a2 = ((s + 1) * 2 * Math.PI) / strutsPerRing;

      const p1 = new THREE.Vector3(
        stentRadius * Math.cos(a1),
        yCenter - ringHeight * 0.45,
        stentRadius * Math.sin(a1)
      );
      const p2 = new THREE.Vector3(
        stentRadius * Math.cos((a1 + a2) * 0.5),
        yCenter + ringHeight * 0.45,
        stentRadius * Math.sin((a1 + a2) * 0.5)
      );
      const p3 = new THREE.Vector3(
        stentRadius * Math.cos(a2),
        yCenter - ringHeight * 0.45,
        stentRadius * Math.sin(a2)
      );

      const strut1 = createStrutBetween(p1, p2, 0.038);
      if (strut1) parts.push(strut1);

      const strut2 = createStrutBetween(p2, p3, 0.038);
      if (strut2) parts.push(strut2);

      // Cầu liên kết dọc giữa các vòng kề
      if (r < numRings - 1 && s % 2 === 0) {
        const nextY = yCenter + ringHeight;
        const pNext = new THREE.Vector3(
          stentRadius * Math.cos((a1 + a2) * 0.5),
          nextY - ringHeight * 0.45,
          stentRadius * Math.sin((a1 + a2) * 0.5)
        );
        const bridge = createStrutBetween(p2, pNext, 0.038);
        if (bridge) parts.push(bridge);
      }
    }
  }

  // Ống trụ nền bảo đảm an toàn
  const fallback = new THREE.CylinderGeometry(stentRadius, stentRadius, 2.5, 32, 1, true);
  const merged = mergeGeometries(parts) || fallback;
  merged.center();
  return merged;
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function createStrutBetween(
  p1: THREE.Vector3,
  p2: THREE.Vector3,
  radius: number
): THREE.BufferGeometry | null {
  const dir = new THREE.Vector3().subVectors(p2, p1);
  const length = dir.length();
  if (length < 0.001) return null;

  const geo = new THREE.CylinderGeometry(radius, radius, length, 16, 1, false);
  const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
  const quaternion = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    dir.clone().normalize()
  );

  const matrix = new THREE.Matrix4().compose(mid, quaternion, new THREE.Vector3(1, 1, 1));
  geo.applyMatrix4(matrix);
  return geo;
}

function mergeGeometries(geos: (THREE.BufferGeometry | null | undefined)[]): THREE.BufferGeometry | null {
  const validGeos = geos.filter((g): g is THREE.BufferGeometry => !!g);
  if (validGeos.length === 0) return null;

  const posArrays: Float32Array[] = [];
  const normArrays: Float32Array[] = [];
  let totalVertices = 0;

  for (const rawGeo of validGeos) {
    // 1. If rawGeo has no normal attribute, compute normals BEFORE toNonIndexed
    if (!rawGeo.getAttribute('normal')) {
      rawGeo.computeVertexNormals();
    } else {
      // 2. If it already has normals, normalize them to preserve smooth shading after transformations
      rawGeo.normalizeNormals();
    }

    // 3. Convert to non-indexed or clone
    const geo = rawGeo.index ? rawGeo.toNonIndexed() : rawGeo.clone();
    const pos = geo.getAttribute('position');
    const norm = geo.getAttribute('normal');

    if (pos && pos.count > 0 && norm && norm.count > 0) {
      posArrays.push(new Float32Array(pos.array));
      normArrays.push(new Float32Array(norm.array));
      totalVertices += pos.count;
    }
  }

  if (totalVertices === 0) return null;

  // 4. Copy both position and normal arrays into merged geometry without recomputing facet normals
  const mergedPos = new Float32Array(totalVertices * 3);
  const mergedNorm = new Float32Array(totalVertices * 3);
  let offset = 0;

  for (let i = 0; i < posArrays.length; i++) {
    mergedPos.set(posArrays[i], offset);
    mergedNorm.set(normArrays[i], offset);
    offset += posArrays[i].length;
  }

  const merged = new THREE.BufferGeometry();
  merged.setAttribute('position', new THREE.BufferAttribute(mergedPos, 3));
  merged.setAttribute('normal', new THREE.BufferAttribute(mergedNorm, 3));
  return merged;
}