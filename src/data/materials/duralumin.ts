import { MaterialData } from '@/store/useStore';

// ── 25. Hợp Kim Nhôm Hàng Không Duralumin (Al-Cu-Mg) ─────────────────────────
export const duraluminMaterial: MaterialData = {
  id: 'duralumin',
  name: 'Duralumin (Alloy 2024)',
  nameVi: 'Hợp Kim Duralumin (Nhôm 2024)',
  formula: 'Al–4.4Cu–1.5Mg',
  category: 'metal',
  categoryLabel: 'Kim loại & Hợp kim',
  objectName: 'Aerospace Turbine Fan Blade & Wing Spar',
  objectNameVi: 'Cánh Quạt Tuabin & Khung Sườn Máy Bay Siêu Nhẹ',
  geometry: 'duralumin-wing',
  icon: '✈️',
  color: '#93c5fd',
  roughness: 0.2,
  metalness: 0.92,
  transmission: 0,
  clearcoat: 0.85,
  emissive: '#0284c7',
  emissiveIntensity: 0.1,
  macroInfo: {
    applications: [
      'Vỏ ngoài thân máy bay, dầm cánh chính (Wing Spar), đinh tán tán nguội máy bay Boeing & Airbus',
      'Vỏ thùng chứa nhiên liệu lỏng tên lửa đẩy vệ tinh vũ trụ và thân tàu con thoi',
      'Bánh đà xe đua thể thao F1, khung xe đạp đua Tour de France chịu lực rung động cao',
    ],
    mechanicalStrength: 'Độ bền kéo 450 – 500 MPa (tương đương thép mềm) nhưng khối lượng chỉ bằng 1/3 thép',
    thermalConductivity: '120 – 150 W/(m·K)',
    electricalConductivity: '1.8 × 10⁷ S/m',
    density: '2.78 g/cm³ (Siêu nhẹ, là nền móng ngành công nghiệp hàng không)',
  },
  metrics: {
    hardness: 78,
    thermal: 75,
    electrical: 72,
    density: 28,
    corrosion: 85,
  },
  molecularInfo: {
    latticeType: 'Mạng FCC Nhôm kết tủa hóa già phân tán cụm Guinier-Preston (Precipitation Hardening)',
    bondLength: 'Al–Al: 2.86 Å, Al–Cu: 2.72 Å',
    bondAngle: '90.0° và 60.0° (Lập phương tâm diện)',
    crystalSystem: 'Lập phương tâm diện (FCC Fm-3m)',
    atomTypes: [
      { element: 'Al', color: '#93c5fd', radius: 0.36 },
      { element: 'Cu', color: '#f97316', radius: 0.34 },
      { element: 'Mg', color: '#06b6d4', radius: 0.35 },
    ],
    bonds: {
      type: 'Liên kết kim loại dải dẫn d-sp với kết tủa pha gián đoạn Al₂Cu (Pha θ\')',
      color: '#bfdbfe',
      hybridization: 'Biển electron tự do dải 3s² 3p¹ lai hóa kim loại màu',
      coordinationGeometry: 'Phối trí 12 hạt lập phương tâm diện đặc khít (CN=12)',
      bondEnergy: '330 kJ/mol',
      interlayerForce: 'Cụm hạt nano phân tán Al₂Cu sinh ra trường ứng suất cản trở trượt mặt tinh thể',
      descriptionVi:
        'Bài học về Hợp kim nhôm trong SGK Công nghệ 11: Nhôm nguyên chất rất nhẹ nhưng quá mềm, không thể chế tạo chi tiết chịu lực. Năm 1906, Alfred Wilm phát hiện ra hiện tượng "Hóa già nhân tạo": khi hòa tan 4.4% Đồng và 1.5% Magie vào Nhôm ở 500°C rồi tôi lạnh, các nguyên tử Đồng ngưng tụ thành các phiến nano siêu nhỏ (cụm Guinier-Preston và pha Al₂Cu) găm chằng chịt trong mạng tinh thể Nhôm. Kết quả tạo ra Duralumin: nhẹ bằng 1/3 thép nhưng cứng và bền ngang thép kết cấu, mở ra kỷ nguyên hàng không nhân loại.',
    },
  },
  structure: {
    type: 'duralumin',
    latticeConstant: 4.05,
    repeatX: 2,
    repeatY: 2,
    repeatZ: 2,
  },
};
