import { MaterialData } from '@/store/useStore';

// ── 24. Thép Không Gỉ Inox 304 (Austenitic Stainless Steel / Fe-Cr-Ni) ───────
export const stainlessSteelMaterial: MaterialData = {
  id: 'stainless-steel',
  name: 'Stainless Steel 304',
  nameVi: 'Thép Không Gỉ (Inox 304)',
  formula: 'Fe–18Cr–8Ni',
  category: 'metal',
  categoryLabel: 'Kim loại & Hợp kim',
  objectName: 'Industrial High-Pressure Flange & Valve',
  objectNameVi: 'Mặt Bích Cao Áp & Van Công Nghiệp Inox 304',
  geometry: 'stainless-flange',
  icon: '🛡️',
  color: '#cbd5e1',
  roughness: 0.18,
  metalness: 0.95,
  transmission: 0,
  clearcoat: 0.9,
  emissive: '#06b6d4',
  emissiveIntensity: 0.1,
  macroInfo: {
    applications: [
      'Dụng cụ y tế, dao phẫu thuật, khay vô trùng và thiết bị cấy ghép phẫu thuật chỉnh hình',
      'Đường ống dẫn hóa chất, bồn chứa thực phẩm, sữa tươi, bia rượu và dược phẩm chuẩn GMP',
      'Chi tiết máy bơm hóa chất, cánh tuabin hơi nước, van xả áp lực và thiết bị hàng hải',
    ],
    mechanicalStrength: 'Độ bền kéo 515 – 700 MPa, độ giãn dài vượt trội ≥ 40% (dễ dập uốn sâu)',
    thermalConductivity: '16.2 W/(m·K) (Thấp hơn thép thường do mạng Austenit)',
    electricalConductivity: '1.4 × 10⁶ S/m (Thép phi từ tính, không hút nam châm)',
    density: '7.93 g/cm³',
  },
  metrics: {
    hardness: 75,
    thermal: 38,
    electrical: 42,
    density: 79,
    corrosion: 96,
  },
  molecularInfo: {
    latticeType: 'Mạng Austenit lập phương tâm diện (Austenitic FCC γ-Phase Solid Solution)',
    bondLength: 'Fe–Cr/Ni: 2.54 Å (Khoảng cách giữa các hạt tiếp xúc sát nhau)',
    bondAngle: '90.0° và 60.0° (Đối xứng mặt tinh thể lập phương tâm diện)',
    crystalSystem: 'Lập phương tâm diện (FCC Fm-3m)',
    atomTypes: [
      { element: 'Fe', color: '#94a3b8', radius: 0.36 },
      { element: 'Cr', color: '#38bdf8', radius: 0.35 },
      { element: 'Ni', color: '#a78bfa', radius: 0.35 },
    ],
    bonds: {
      type: 'Liên kết kim loại dải dẫn d với màng thụ động hóa Cr₂O₃ tự phục hồi',
      color: '#e2e8f0',
      hybridization: 'Biển electron tự do dải d mở rộng phối hợp Fe-Cr-Ni',
      coordinationGeometry: 'Phối trí xếp chặt lập phương tâm diện 12 hạt tiếp xúc (CN=12)',
      bondEnergy: '425 kJ/mol',
      interlayerForce: 'Màng oxit Cr₂O₃ dày chỉ 1 – 3 nm bảo vệ ngăn cách tuyệt đối nguyên tử oxi và nước',
      descriptionVi:
        'Thép không gỉ Inox 304 là kiệt tác của ngành luyện kim học thế kỷ 20: nhờ thêm 18% Chromium và 8% Nickel vào nền sắt, mạng tinh thể chuyển hẳn từ Ferrite BCC sang pha Austenite FCC phi từ tính (không hút nam châm). Khi tiếp xúc với không khí, các nguyên tử Chromium ở bề mặt lập tức phản ứng với Oxi tạo thành màng Chromium Oxide (Cr₂O₃) mỏng chỉ 2-3 nanomet nhưng kín khít tuyệt đối. Nếu bề mặt bị trầy xước va chạm, màng oxit này tự động phục hồi tức thì trong vài phần triệu giây, ngăn chặn 100% rỉ sét.',
    },
  },
  structure: {
    type: 'stainless-steel',
    latticeConstant: 3.59,
    repeatX: 2,
    repeatY: 2,
    repeatZ: 2,
  },
};
