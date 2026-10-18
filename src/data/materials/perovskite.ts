import { MaterialData } from '@/store/useStore';

// ── 18. Tinh Thể Perovskite Pin Mặt Trời (CH₃NH₃PbI₃) ───────────────────────
export const perovskiteMaterial: MaterialData = {
    id: 'perovskite',
    name: 'Perovskite Solar Material',
    nameVi: 'Tinh Thể Perovskite Pin Mặt Trời',
    formula: 'CH₃NH₃PbI₃',
    category: 'nano',
    categoryLabel: 'Vật liệu Nano & Tương lai',
    objectName: 'High-Efficiency Perovskite Tandem Cell',
    objectNameVi: 'Mô-đun Pin Năng Lượng Perovskite Tandem',
    icon: '☀️',
    color: '#f59e0b',
    roughness: 0.15,
    metalness: 0.6,
    transmission: 0,
    clearcoat: 0.95,
    emissive: '#d97706',
    emissiveIntensity: 0.25,
    macroInfo: {
      applications: [
        'Pin quang điện mặt trời thế hệ mới đạt hiệu suất kỷ lục trên 33% khi kết hợp với Silicon',
        'Màn hình hiển thị LED phát quang nano siêu sáng với độ tinh khiết màu sắc cực cao',
        'Cảm biến thu hoạch bức xạ X-quang y tế độ nhạy cao giảm 90% liều chiếu xạ cho bệnh nhân',
      ],
      mechanicalStrength: 'Dẻo dai cơ học cao, có thể in phun lên màng nhựa uốn dẻo dán lên kính tòa nhà',
      thermalConductivity: '0.5 W/(m·K)',
      electricalConductivity: 'Chất dẫn quang điện ưu việt: độ dài khuếch tán hạt tải điện vượt 1 µm',
      density: '4.16 g/cm³',
    },
    metrics: {
      hardness: 40,
      thermal: 20,
      electrical: 88,
      density: 42,
      corrosion: 75,
    },
    molecularInfo: {
      latticeType: 'Mạng lập phương Perovskite bát diện nối đỉnh (Cubic Perovskite Lattice)',
      bondLength: 'Pb–I: 3.16 Å; Kích thước ô mạng a = 6.32 Å',
      bondAngle: 'Pb–I–Pb: 180.0°; I–Pb–I: 90.0°',
      crystalSystem: 'Lập phương (Cubic Pm-3m)',
      atomTypes: [
        { element: 'Pb', color: '#94a3b8', radius: 0.36 },
        { element: 'I', color: '#a855f7', radius: 0.32 },
        { element: 'MA', color: '#fbbf24', radius: 0.28 },
      ],
      bonds: {
        type: 'Liên kết phối trí ion - cộng hóa trị Pb-I tạo khung bát diện [PbI₆] chia sẻ đỉnh',
        color: '#fde047',
        hybridization: 'Lai hóa obitan 6p của Pb và 5p của I xen phủ trực tiếp',
        coordinationGeometry: 'Bát diện [PbI₆] phối trí 6 đỉnh bao bọc cation hữu cơ MA⁺ ở tâm khối',
        bondEnergy: 'Pb–I: 230 kJ/mol (Tương tác ion mềm linh động)',
        interlayerForce: 'Khung 3D lập phương nối tiếp vô tận',
        descriptionVi:
          'Vật liệu Perovskite MAPbI₃ tạo nên cuộc cách mạng năng lượng xanh lớn nhất thế kỷ 21. Khung tinh thể được xây dựng từ các bát diện [PbI₆]⁴⁻ nối đỉnh nhau ở 8 góc, ở chính giữa là cation hữu cơ Methylammonium (CH₃NH₃⁺). Cấu trúc độc đáo này giúp vật liệu hấp thụ ánh sáng mặt trời mạnh gấp 10 lần silicon và giải phóng các cặp electron-lỗ trống tự do gần như không có rào cản năng lượng.',
      },
    },
    structure: {
      type: 'perovskite',
      latticeConstant: 6.32,
      repeatX: 2,
      repeatY: 2,
      repeatZ: 2,
    },
    geometry: 'solar-panel',
  };

export default perovskiteMaterial;
