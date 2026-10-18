import * as THREE from 'three';
import { mergeGeometries } from './geometryUtils';

// ── 1. Kim Cương Tự Nhiên: Giác Cắt Tròn Rực Rỡ (Brilliant Cut 16 Cạnh) ──────
export function createDiamondGemGeometry(): THREE.BufferGeometry {
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

// ── 2. Thạch Anh & Thủy Tinh (SiO₂): Trụ Thạch Anh Lục Lăng Kèm Chóp Nhọn ─────
export function createQuartzCrystalGeometry(): THREE.BufferGeometry {
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

// ── 3. Muối Ăn Tinh Khiết (NaCl): Tinh Thể Muối Lập Phương Bậc Thang ──────────
export function createSaltCubeGeometry(): THREE.BufferGeometry {
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

// ── 4. Khói Đông Lạnh Aerogel: Khối Tinh Thể Siêu Nhẹ Khói Xanh Rayleigh ────
export function createAerogelBlockGeometry(): THREE.BufferGeometry {
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

// ── 5. Băng Tuyết: Tinh Thể Bông Tuyết 6 Cánh (Snowflake) ──────────────────
export function createSnowflakeGeometry(): THREE.BufferGeometry {
  const parts: THREE.BufferGeometry[] = [];

  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI) / 3;

    // Cánh chính
    const arm = new THREE.BoxGeometry(0.12, 1.4, 0.05);
    arm.rotateZ(angle);
    arm.translate(Math.cos(angle + Math.PI / 2) * 0.7, Math.sin(angle + Math.PI / 2) * 0.7, 0);
    parts.push(arm);

    // Nhánh phụ 1
    const branch1 = new THREE.BoxGeometry(0.08, 0.5, 0.04);
    branch1.rotateZ(angle + Math.PI / 6);
    branch1.translate(
      Math.cos(angle + Math.PI / 2) * 0.5 + Math.cos(angle + Math.PI / 2 + Math.PI / 6) * 0.2,
      Math.sin(angle + Math.PI / 2) * 0.5 + Math.sin(angle + Math.PI / 2 + Math.PI / 6) * 0.2,
      0
    );
    parts.push(branch1);

    // Nhánh phụ 2
    const branch2 = new THREE.BoxGeometry(0.08, 0.5, 0.04);
    branch2.rotateZ(angle - Math.PI / 6);
    branch2.translate(
      Math.cos(angle + Math.PI / 2) * 0.5 + Math.cos(angle + Math.PI / 2 - Math.PI / 6) * 0.2,
      Math.sin(angle + Math.PI / 2) * 0.5 + Math.sin(angle + Math.PI / 2 - Math.PI / 6) * 0.2,
      0
    );
    parts.push(branch2);
  }

  const center = new THREE.CylinderGeometry(0.24, 0.24, 0.06, 6);
  parts.push(center);

  const merged = mergeGeometries(parts) || center;
  merged.center();
  return merged;
}
