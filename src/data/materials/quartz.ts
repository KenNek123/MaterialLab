import { MaterialData } from '@/store/useStore';

// ── 4. Đá Thạch Anh Lục Lăng (SiO₂) ─────────────────────────────────────────
export const quartzMaterial: MaterialData = {
    id: 'quartz',
    name: 'Quartz Crystal',
    nameVi: 'Đá Thạch Anh Lục Lăng',
    formula: 'SiO₂',
    category: 'crystal',
    categoryLabel: 'Gốm & Tinh thể',
    objectName: 'Quartz Crystal Prism',
    objectNameVi: 'Trụ Tinh Thể Thạch Anh Lục Lăng',
    icon: '🔮',
    color: '#f1f5f9',
    roughness: 0.1,
    metalness: 0.1,
    transmission: 0.88,
    clearcoat: 1.0,
    emissive: '#38bdf8',
    emissiveIntensity: 0.14,
    macroInfo: {
      applications: [
        'Bộ dao động thạch anh giữ nhịp siêu chuẩn xác trong đồng hồ đeo tay và vi xử lý',
        'Thành phần chính của cát trắng nấu ra thủy tinh cửa kính, chai lọ và ống nghiệm',
        'Kéo thành sợi cáp quang truyền dẫn internet tốc độ ánh sáng vòng quanh thế giới',
      ],
      mechanicalStrength: 'Độ cứng Mohs 7/10 (Rạch xước được thủy tinh thường và thép)',
      thermalConductivity: '1.4 W/(m·K) (Vật liệu chịu sốc nhiệt tuyệt hảo)',
      electricalConductivity: '10⁻¹⁴ S/m (Cách điện cực tốt, hiệu ứng áp điện Piezoelectric)',
      density: '2.65 g/cm³',
    },
    metrics: {
      hardness: 70,
      thermal: 20,
      electrical: 10,
      density: 27,
      corrosion: 98,
    },
    molecularInfo: {
      latticeType: 'Mạng không gian tứ diện [SiO₄] nối đỉnh (Trigonal Quartz Network)',
      bondLength: 'Si–O: 1.61 Å (Liên kết cộng hóa trị phân cực bền chặt)',
      bondAngle: 'Si–O–Si: 144.0°; O–Si–O: 109.5°',
      crystalSystem: 'Tam phương (Trigonal P3₁21)',
      atomTypes: [
        { element: 'Si', color: '#38bdf8', radius: 0.32 },
        { element: 'O', color: '#ef4444', radius: 0.26 },
      ],
      bonds: {
        type: 'Cộng hóa trị phân cực mạnh pha 50% đặc tính ion giữa Si và O',
        color: '#fca5a5',
        hybridization: 'Lai hóa tứ diện sp³ của nguyên tử Silic',
        coordinationGeometry: 'Tứ diện [SiO₄] chia sẻ nguyên tử Oxy ở cả 4 đỉnh',
        bondEnergy: '460 kJ/mol (Cực kỳ trơ với axit, chỉ tan trong axit HF)',
        interlayerForce: 'Mạng lưới xoắn ốc liên tục 3 chiều',
        descriptionVi:
          'Mỗi nguyên tử Silic nằm ở tâm của một tứ diện và liên kết với 4 nguyên tử Oxy. Mỗi nguyên tử Oxy lại dùng chung giữa hai tứ diện lân cận theo góc gập 144°. Cấu trúc xoắn ốc tam giác này tạo ra tính chất áp điện: khi bị nén ép cơ học, tinh thể sinh ra điện tích, và ngược lại khi cấp điện thế thì rung ở tần số 32,768 Hz cực kỳ ổn định trong đồng hồ.',
      },
    },
    structure: {
      type: 'silica',
      latticeConstant: 4.91,
      repeatX: 2,
      repeatY: 2,
      repeatZ: 2,
    },
    geometry: 'quartz-crystal',
  };

export default quartzMaterial;
