import * as THREE from 'three';
import { mergeGeometries, createStrutBetween } from './geometryUtils';

// ── 1. Than Chì & Graphene: Ruột Bút Chì Lục Giác & Ngòi Chì ──────────────────
export function createGraphitePencilGeometry(): THREE.BufferGeometry {
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

// ── 2. Silic Tinh Khiết Bán Dẫn (Si): Đĩa Bán Dẫn Silicon Wafer 300mm ───────
export function createSiliconChipGeometry(): THREE.BufferGeometry {
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

// ── 3. Mô-đun Pin Năng Lượng Mặt Trời Perovskite Tandem Đa Lớp ──────────────
export function createSolarPanelGeometry(): THREE.BufferGeometry {
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

// ── 4. Pin Điện Thoại Lithium (LiCoO₂): Khối Pin Sạc Lithium Smartphone ─────
export function createLithiumBatteryGeometry(): THREE.BufferGeometry {
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

// ── 5. Gốm Sứ Kỹ Thuật (Al₂O₃): Lưỡi Dao Gốm Sắc Bén & Cán Dao ─────────────
export function createCeramicBladeGeometry(): THREE.BufferGeometry {
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

// ── 6. Nhựa Chống Dính Teflon (PTFE): Chảo Chiên Chống Dính & Tay Cầm ───────
export function createTeflonPanGeometry(): THREE.BufferGeometry {
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

// ── 7. Cao Su Tự Nhiên Đàn Hồi (Polymer): Lốp Xe Ô Tô Hoa Văn Rãnh Gai ──────
export function createRubberTyreGeometry(): THREE.BufferGeometry {
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

// ── 8. Thủy Tinh Silicat: Thấu Kính Hội Tụ Quang Học (Optical Convex Lens) ───
export function createLensGeometry(): THREE.BufferGeometry {
  const lens = new THREE.SphereGeometry(1.25, 48, 48);
  lens.scale(1, 0.32, 1);
  lens.center();
  return lens;
}
