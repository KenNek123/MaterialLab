import { MaterialData } from '@/store/useStore';

// ── 24. Siêu Hợp Kim Inconel 718 (Ni–Cr–Fe) ───────────────────────────────
export const inconelMaterial: MaterialData = {
    id: 'inconel',
    name: 'Inconel 718',
    nameVi: 'Inconel 718',
    formula: 'Ni–Cr–Fe',
    category: 'metal',
    categoryLabel: 'Kim loại & Hợp kim',
    objectName: 'Rocket Turbine Blade',
    objectNameVi: 'Cánh Tuabin Buồng Đốt Tên Lửa Vũ Trụ',
    icon: '🚀',
    color: '#64748b',
    roughness: 0.22,
    metalness: 0.95,
    transmission: 0,
    clearcoat: 0.85,
    emissive: '#0284c7',
    emissiveIntensity: 0.18,
    macroInfo: {
      applications: [
        'Cánh tuabin buồng đốt tên lửa vũ trụ SpaceX Falcon 9 và động cơ phản lực F-35',
        'Lõi lò phản ứng hạt nhân thế hệ mới chịu bức xạ neutron và ăn mòn hóa học',
        'Bộ phận tăng áp turbo ô tô đua hiệu năng cao hoạt động liên tục ở 700°C – 1000°C',
      ],
      mechanicalStrength: 'Độ bền kéo 1240 – 1400 MPa, chống rão nhiệt (Creep Resistance) vô địch',
      thermalConductivity: '11.4 W/(m·K)',
      electricalConductivity: '1.3 × 10⁶ S/m',
      density: '8.19 g/cm³',
    },
    metrics: {
      hardness: 88,
      thermal: 25,
      electrical: 20,
      density: 85,
      corrosion: 98,
    },
    molecularInfo: {
      latticeType: 'Mạng nền Austenit FCC gia cường kết tủa liên kim γ″ (Ni₃Nb)',
      bondLength: 'Ni–Ni / Ni–Cr: 2.49 Å',
      bondAngle: '90.0° và 60.0° (Lập phương tâm diện)',
      crystalSystem: 'Lập phương (Cubic Fm-3m)',
      atomTypes: [
        { element: 'Ni', color: '#a78bfa', radius: 0.36 },
        { element: 'Cr', color: '#38bdf8', radius: 0.34 },
        { element: 'Fe', color: '#94a3b8', radius: 0.35 },
      ],
      bonds: {
        type: 'Liên kết kim loại chuyển tiếp d dải dẫn khóa bền bởi pha kết tủa kết hợp',
        color: '#cbd5e1',
        hybridization: 'Xen phủ obitan dải d kim loại chuyển tiếp nhiệt độ cao',
        coordinationGeometry: 'Phối trí lập phương tâm diện 12 hạt (CN=12)',
        bondEnergy: '430 kJ/mol',
        interlayerForce: 'Các hạt nano kết tủa γ″ ghim chặt chuyển vị khiến mạng không thể trượt',
        descriptionVi:
          'Inconel 718 là siêu hợp kim gốc Niken chế tạo buồng đốt tên lửa vũ trụ. Bí quyết sức mạnh của nó nằm ở cơ chế gia cường kết tủa (Precipitation Hardening): pha liên kim nano γ″ (Ni₃Nb) phân tán đều đặn ghim chặt các mặt trượt tinh thể của nền Niken FCC. Nhờ đó, vật liệu không bị mềm hóa, chảy dẻo hay rão rão ngay cả khi đỏ lửa ở nhiệt độ hơn 700°C trong luồng khí phụt tên lửa.',
      },
    },
    structure: {
      type: 'fcc',
      latticeConstant: 3.6,
      repeatX: 2,
      repeatY: 2,
      repeatZ: 2,
    },
    geometry: 'turbine-blade',
  };

export default inconelMaterial;
