import * as THREE from 'three';
import { mergeGeometries, createStrutBetween } from './geometryUtils';

// ── 1. Vàng: Thỏi Vàng Đúc Chuẩn (Fine Gold 999.9) ───────────────────────────
export function createGoldIngotGeometry(): THREE.BufferGeometry {
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

// ── 2. Đồng Đỏ Dẫn Điện (Cu): Cuộn Dây Cáp Đồng & Lõi Đồng Dẫn Điện ──────────
export function createCopperCoilGeometry(): THREE.BufferGeometry {
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

// ── 3. Thép Xây Dựng & Sắt (Fe-C): Dầm Thép Hình Chữ I Công Trình ────────────
export function createIronBeamGeometry(): THREE.BufferGeometry {
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

// ── 4. Nhôm Hàng Không (Al): Cánh Phụ Khí Động Học Máy Bay (Winglet) ─────────
export function createAluminumWingGeometry(): THREE.BufferGeometry {
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

// ── 5. Titan Y Tế Siêu Bền (Ti): Khớp Háng Nhân Tạo Cấy Ghép (Hip Implant) ──
export function createTitaniumImplantGeometry(): THREE.BufferGeometry {
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

// ── 6. Hợp Kim Nhớ Hình Nitinol: Stent Mạch Vành Tim Quả Trám Tự Bung ────────
export function createNitinolStentGeometry(): THREE.BufferGeometry {
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

// ── 7. Siêu Hợp Kim Inconel 718: Cánh Tuabin Tên Lửa Vũ Trụ ───────────────
export function createTurbineBladeGeometry(): THREE.BufferGeometry {
  const parts: THREE.BufferGeometry[] = [];

  // Đế gắn chân tuabin (Fir-tree Root / Base Block)
  const base = new THREE.BoxGeometry(0.9, 0.4, 0.7);
  base.translate(0, -1.2, 0);
  parts.push(base);

  // Thân cánh tuabin khí động học xoắn (Twisted Aerodynamic Airfoil Blade)
  const numSlices = 10;
  for (let i = 0; i < numSlices; i++) {
    const t = i / (numSlices - 1);
    const y = -0.9 + t * 2.2;
    const twistAngle = -0.35 + t * 0.75;
    const chord = 1.1 - t * 0.35;
    const thickness = 0.16 - t * 0.08;

    const slice = new THREE.BoxGeometry(chord, 0.25, thickness);
    slice.rotateY(twistAngle);
    slice.translate(0, y, 0);
    parts.push(slice);
  }

  const merged = mergeGeometries(parts) || base;
  merged.center();
  return merged;
}

// ── 8. Thép Carbon C45: Bánh Răng Cơ Khí & Trục Truyền Động Công Nghiệp ──────
export function createSteelGearGeometry(): THREE.BufferGeometry {
  const parts: THREE.BufferGeometry[] = [];

  // Vành bánh răng chính (Gear Rim)
  const rim = new THREE.CylinderGeometry(1.65, 1.65, 0.6, 40);
  parts.push(rim);

  // 16 Răng nghiêng ăn khớp cơ khí xung quanh chu vi (16 Helical/Spur Gear Teeth)
  const numTeeth = 16;
  for (let i = 0; i < numTeeth; i++) {
    const angle = (i * 2 * Math.PI) / numTeeth;
    const tooth = new THREE.BoxGeometry(0.28, 0.6, 0.48);
    // Vát góc côn đầu răng
    tooth.rotateY(angle);
    tooth.translate(Math.cos(angle) * 1.76, 0, Math.sin(angle) * 1.76);
    parts.push(tooth);
  }

  // Moay-ơ trục trung tâm lồi cao (Axle Hub)
  const hub = new THREE.CylinderGeometry(0.72, 0.72, 0.95, 32);
  parts.push(hub);

  // Vành gờ khóa trục
  const hubCollar = new THREE.TorusGeometry(0.72, 0.08, 12, 32);
  hubCollar.rotateX(Math.PI / 2);
  hubCollar.translate(0, 0.42, 0);
  parts.push(hubCollar);

  // Lỗ xỏ trục máy (Bore)
  const boreBevel = new THREE.TorusGeometry(0.38, 0.04, 10, 24);
  boreBevel.rotateX(Math.PI / 2);
  boreBevel.translate(0, 0.48, 0);
  const boreBevelBot = new THREE.TorusGeometry(0.38, 0.04, 10, 24);
  boreBevelBot.rotateX(Math.PI / 2);
  boreBevelBot.translate(0, -0.48, 0);
  parts.push(boreBevel, boreBevelBot);

  // Rãnh then truyền mô-men xoắn (Shaft Keyway)
  const keyway = new THREE.BoxGeometry(0.12, 0.98, 0.16);
  keyway.translate(0.36, 0, 0);
  parts.push(keyway);

  // 4 Lỗ khoét giảm khối lượng trên thân bánh răng (4 Lightening Holes)
  for (let k = 0; k < 4; k++) {
    const holeAngle = (k * Math.PI) / 2 + Math.PI / 4;
    const hx = Math.cos(holeAngle) * 1.18;
    const hz = Math.sin(holeAngle) * 1.18;
    const holeRing = new THREE.TorusGeometry(0.22, 0.05, 10, 24);
    holeRing.rotateX(Math.PI / 2);
    holeRing.translate(hx, 0.28, hz);
    const holeRingBot = new THREE.TorusGeometry(0.22, 0.05, 10, 24);
    holeRingBot.rotateX(Math.PI / 2);
    holeRingBot.translate(hx, -0.28, hz);
    parts.push(holeRing, holeRingBot);
  }

  const merged = mergeGeometries(parts) || rim;
  merged.center();
  return merged;
}

// ── 9. Thép Không Gỉ Inox 304: Mặt Bích Cao Áp & Van Đường Ống Công Nghiệp ────
export function createStainlessSteelFlangeGeometry(): THREE.BufferGeometry {
  const parts: THREE.BufferGeometry[] = [];

  // Thân ống dẫn chính Inox
  const mainPipe = new THREE.CylinderGeometry(0.68, 0.68, 2.4, 36);
  parts.push(mainPipe);

  // Mặt bích đĩa đúc chịu lực cao áp (Flange Disc)
  const flangeDisc = new THREE.CylinderGeometry(1.68, 1.68, 0.38, 40);
  flangeDisc.translate(0, 0.25, 0);
  parts.push(flangeDisc);

  // Gờ làm kín lắp gioăng đệm làm kín chống rò rỉ (Raised Face Gasket Ring)
  const gasketFace = new THREE.CylinderGeometry(1.15, 1.15, 0.12, 36);
  gasketFace.translate(0, 0.48, 0);
  parts.push(gasketFace);

  // 8 Bu-lông siết đai ốc đối xứng cường độ cao (8 Bolt Studs & Nuts)
  const numBolts = 8;
  for (let b = 0; b < numBolts; b++) {
    const bAngle = (b * 2 * Math.PI) / numBolts;
    const bx = Math.cos(bAngle) * 1.42;
    const bz = Math.sin(bAngle) * 1.42;
    // Thân bu lông
    const stud = new THREE.CylinderGeometry(0.08, 0.08, 0.68, 16);
    stud.translate(bx, 0.35, bz);
    // Đai ốc lục giác đúc Inox
    const nut = new THREE.CylinderGeometry(0.14, 0.14, 0.16, 6);
    nut.translate(bx, 0.52, bz);
    parts.push(stud, nut);
  }

  // Cổ hàn côn chịu ứng suất uốn (Welding Neck)
  const weldNeck = new THREE.CylinderGeometry(0.74, 1.15, 0.45, 36);
  weldNeck.translate(0, -0.15, 0);
  parts.push(weldNeck);

  // Tay gạt van khóa dòng chảy (Valve Actuator Wheel)
  const wheelHub = new THREE.CylinderGeometry(0.18, 0.18, 0.4, 16);
  wheelHub.rotateZ(Math.PI / 2);
  wheelHub.translate(0.85, 0.85, 0);
  const handwheel = new THREE.TorusGeometry(0.55, 0.06, 12, 32);
  handwheel.rotateY(Math.PI / 2);
  handwheel.translate(1.15, 0.85, 0);
  parts.push(wheelHub, handwheel);

  const merged = mergeGeometries(parts) || mainPipe;
  merged.center();
  return merged;
}

// ── 10. Hợp Kim Duralumin Nhôm Hàng Không: Cánh Quạt Tuabin Phản Lực & Sườn Cánh ─
export function createDuraluminWingGeometry(): THREE.BufferGeometry {
  const parts: THREE.BufferGeometry[] = [];

  // Chân đế mộng mang cá cài đĩa tuabin (Fir-tree Dovetail Root)
  const rootBase = new THREE.BoxGeometry(0.95, 0.5, 0.75);
  rootBase.translate(0, -1.2, 0);
  parts.push(rootBase);

  // Rãnh mộng chống tuột ly tâm hàng không
  const tooth1 = new THREE.BoxGeometry(1.15, 0.1, 0.72);
  tooth1.translate(0, -1.25, 0);
  const tooth2 = new THREE.BoxGeometry(1.08, 0.1, 0.72);
  tooth2.translate(0, -1.05, 0);
  parts.push(tooth1, tooth2);

  // Mặt nền cách nhiệt (Airfoil Platform)
  const platform = new THREE.BoxGeometry(1.45, 0.14, 1.15);
  platform.translate(0, -0.88, 0);
  parts.push(platform);

  // Thân cánh khí động học uốn xoắn 3D (Twisted Aerodynamic Airfoil Blade)
  const numSlices = 12;
  for (let i = 0; i < numSlices; i++) {
    const t = i / (numSlices - 1);
    const y = -0.78 + t * 2.2;
    const twistAngle = 0.48 - t * 0.75; // Góc xoắn khí động học tối ưu dòng khí
    const chord = 1.25 - t * 0.42;     // Thuôn dần về phía đầu mút cánh
    const thickness = 0.18 - t * 0.09; // Dày ở gốc, mỏng ở đầu mút

    const slice = new THREE.BoxGeometry(chord, 0.22, thickness);
    slice.rotateY(twistAngle);
    // Độ cong profile cánh hút lực nâng
    slice.translate(Math.sin(t * Math.PI * 0.5) * 0.18, y, 0);
    parts.push(slice);
  }

  // Đầu mút cánh khí động học có gờ giảm xoáy (Wingtip Shroud Winglet)
  const tipShroud = new THREE.BoxGeometry(0.78, 0.08, 0.45);
  tipShroud.rotateY(-0.25);
  tipShroud.translate(0.18, 1.48, 0);
  parts.push(tipShroud);

  const merged = mergeGeometries(parts) || rootBase;
  merged.center();
  return merged;
}

// ── 11. Hợp Kim Cứng Vonfram Cacbua (WC): Mảnh Dao Tiện Phay CNC & Mũi Khoan Địa Chất ─
export function createCarbideInsertGeometry(): THREE.BufferGeometry {
  const parts: THREE.BufferGeometry[] = [];

  // Mảnh dao tiện hợp kim cứng tam giác Trigon (WNMG/TNMG Indexable Cutting Insert)
  // Thân chính hình lăng trụ tam giác đều bo tròn 3 góc cắt
  const basePrism = new THREE.CylinderGeometry(1.5, 1.5, 0.55, 3);
  basePrism.rotateY(Math.PI / 6);
  parts.push(basePrism);

  // 3 Mũi dao cắt định hình chính xác tại 3 góc (3 Cutting Tool Nose Radii)
  for (let c = 0; c < 3; c++) {
    const cornerAngle = (c * 2 * Math.PI) / 3;
    const cx = Math.cos(cornerAngle) * 1.32;
    const cz = Math.sin(cornerAngle) * 1.32;
    // Mũi dao bo tròn R0.8mm gia công tinh chịu va đập
    const nose = new THREE.CylinderGeometry(0.24, 0.24, 0.55, 16);
    nose.translate(cx, 0, cz);
    parts.push(nose);
  }

  // Lỗ xỏ vít kẹp tâm định vị mâm dao tiện CNC (Countersunk Center Clamping Hole)
  const holeRim = new THREE.TorusGeometry(0.48, 0.06, 12, 32);
  holeRim.rotateX(Math.PI / 2);
  holeRim.translate(0, 0.28, 0);
  const holeRimBot = new THREE.TorusGeometry(0.48, 0.06, 12, 32);
  holeRimBot.rotateX(Math.PI / 2);
  holeRimBot.translate(0, -0.28, 0);
  parts.push(holeRim, holeRimBot);

  // Côn kẹp vít định vị (Conical Seat)
  const coneSeat = new THREE.CylinderGeometry(0.38, 0.52, 0.18, 24);
  coneSeat.translate(0, 0.22, 0);
  parts.push(coneSeat);

  // 3 Rãnh thoát phoi tạo góc cắt dương uốn gãy phoi kim loại (3 Chipbreaker Grooves)
  for (let g = 0; g < 3; g++) {
    const grooveAngle = (g * 2 * Math.PI) / 3 + Math.PI / 3;
    const gx = Math.cos(grooveAngle) * 0.78;
    const gz = Math.sin(grooveAngle) * 0.78;
    const groove = new THREE.BoxGeometry(0.65, 0.08, 0.14);
    groove.rotateY(grooveAngle);
    groove.translate(gx, 0.28, gz);
    const grooveBot = new THREE.BoxGeometry(0.65, 0.08, 0.14);
    grooveBot.rotateY(grooveAngle);
    grooveBot.translate(gx, -0.28, gz);
    parts.push(groove, grooveBot);
  }

  // 3 Chấu bẻ phoi chống dập nát bề mặt chi tiết (Chip Bumps)
  for (let m = 0; m < 3; m++) {
    const mAngle = (m * 2 * Math.PI) / 3;
    const mx = Math.cos(mAngle) * 1.05;
    const mz = Math.sin(mAngle) * 1.05;
    const bump = new THREE.SphereGeometry(0.08, 12, 12);
    bump.translate(mx, 0.29, mz);
    const bumpBot = new THREE.SphereGeometry(0.08, 12, 12);
    bumpBot.translate(mx, -0.29, mz);
    parts.push(bump, bumpBot);
  }

  const merged = mergeGeometries(parts) || basePrism;
  merged.center();
  return merged;
}

