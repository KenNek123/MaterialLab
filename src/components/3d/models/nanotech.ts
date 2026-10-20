import * as THREE from 'three';
import { mergeGeometries } from './geometryUtils';

// ── 1. Siêu Tụ Điện MXene: Cuộn Màng Mỏng Nano Tích Điện Siêu Tụ ──────────────
export function createMxeneCapacitorGeometry(): THREE.BufferGeometry {
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

// ── 2. Ống Nano Carbon Đơn Vách: Mô Hình Trụ Rỗng Hexagonal SWCNT ──────────
export function createNanotubeCoilGeometry(): THREE.BufferGeometry {
  const parts: THREE.BufferGeometry[] = [];

  const radiusOuter = 0.85;
  const radiusInner = 0.79;
  const length = 3.4;

  // 1. Vỏ trụ ngoài rỗng 2 đầu với 16 phân đoạn chu vi & 12 phân đoạn chiều dài
  // Giúp EdgesGeometry trong MacroObject hiển thị khung lưới tổ ong nano sắc nét
  const outerTube = new THREE.CylinderGeometry(radiusOuter, radiusOuter, length, 16, 12, true);
  parts.push(outerTube);

  // 2. Thành lòng ống bên trong rỗng 2 đầu (tạo độ dày thành ống thực tế)
  const innerTube = new THREE.CylinderGeometry(radiusInner, radiusInner, length, 16, 12, true);
  parts.push(innerTube);

  // 3. Vành miệng ống tròn mượt ở 2 đầu (hở hoàn toàn, nhìn xuyên thấu lõi ống)
  const rimRadius = (radiusOuter + radiusInner) * 0.5;
  const rimThickness = (radiusOuter - radiusInner) * 0.5;

  const topRim = new THREE.TorusGeometry(rimRadius, rimThickness, 12, 32);
  topRim.rotateX(Math.PI / 2);
  topRim.translate(0, length * 0.5, 0);
  parts.push(topRim);

  const botRim = new THREE.TorusGeometry(rimRadius, rimThickness, 12, 32);
  botRim.rotateX(Math.PI / 2);
  botRim.translate(0, -length * 0.5, 0);
  parts.push(botRim);

  // 4. Các vòng gân liên kết cộng hóa trị chu vi (Chiral Honeycomb Ribs)
  const numRibs = 10;
  for (let i = 0; i < numRibs; i++) {
    const y = -length * 0.45 + (i * length * 0.9) / (numRibs - 1);
    const rib = new THREE.TorusGeometry(radiusOuter + 0.006, 0.016, 8, 32);
    rib.rotateX(Math.PI / 2);
    rib.translate(0, y, 0);
    parts.push(rib);
  }

  const merged = mergeGeometries(parts) || outerTube;

  // Xoay ngang và nghiêng phối cảnh đồng nhất với mô hình nguyên tử (Molecular Layer)
  merged.rotateZ(Math.PI / 2);
  merged.rotateY(-0.36);
  merged.rotateZ(0.14);

  merged.center();
  return merged;
}

// ── 3. Quả Cầu Buckyball C₆₀: Khung Lồng Đa Diện Geodesic Nano ─────────────
export function createBuckyballGeometry(): THREE.BufferGeometry {
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

// ── 4. Khung Sợi Graphene & Kevlar: Vợt Thể Thao Siêu Nhẹ (Racket Frame) ─────
export function createRacketGeometry(): THREE.BufferGeometry {
  const parts: THREE.BufferGeometry[] = [];

  // Vành khung vợt oval
  const headTorus = new THREE.TorusGeometry(0.95, 0.08, 16, 48);
  headTorus.scale(0.85, 1.25, 1);
  headTorus.translate(0, 0.55, 0);
  parts.push(headTorus);

  // Cán vợt
  const shaft = new THREE.CylinderGeometry(0.07, 0.08, 1.3, 16);
  shaft.translate(0, -0.85, 0);
  parts.push(shaft);

  // Đốc tay cầm
  const grip = new THREE.CylinderGeometry(0.1, 0.1, 0.55, 16);
  grip.translate(0, -1.2, 0);
  parts.push(grip);

  const merged = mergeGeometries(parts) || headTorus;
  merged.center();
  return merged;
}
