import { MaterialData } from '@/store/useStore';

// ── 13. Pin Điện Thoại Lithium (LiCoO₂) ────────────────────────────────────
export const batteryLcoMaterial: MaterialData = {
    id: 'battery-lco',
    name: 'Lithium Battery Material',
    nameVi: 'Vật Liệu Pin Lithium (LCO)',
    formula: 'LiCoO₂',
    category: 'molecular',
    categoryLabel: 'Cấu trúc Phân tử',
    objectName: 'Smartphone Battery Cell',
    objectNameVi: 'Thỏi Pin Điện Thoại & Xe Điện',
    icon: '🔋',
    color: '#0284c7',
    roughness: 0.2,
    metalness: 0.7,
    transmission: 0,
    clearcoat: 0.9,
    emissive: '#10b981',
    emissiveIntensity: 0.22,
    macroInfo: {
      applications: [
        'Vật liệu cực dương trữ điện trong thỏi pin điện thoại iPhone, Samsung và tablet',
        'Cung cấp năng lượng cho máy bay không người lái drone và thiết bị y tế cầm tay',
        'Bộ tích điện năng lượng dự phòng PowerBank gọn nhẹ sạc nhanh',
      ],
      mechanicalStrength: 'Dạng bột tinh thể ép kết khối, ổn định chu kỳ sạc xả hơn 1000 lần',
      thermalConductivity: '4.0 W/(m·K)',
      electricalConductivity: 'Dẫn đồng thời cả electron và ion Liti (Mixed Conductor)',
      density: '5.06 g/cm³ (Mật độ năng lượng thể tích cực cao)',
    },
    metrics: {
      hardness: 60,
      thermal: 55,
      electrical: 85,
      density: 51,
      corrosion: 88,
    },
    molecularInfo: {
      latticeType: 'Mạng tinh thể oxit xếp lớp chèn xen (Layered Rhombohedral Lattice)',
      bondLength: 'Co–O: 1.92 Å; Li–O: 2.10 Å',
      bondAngle: 'O–Co–O: 90.0°',
      crystalSystem: 'Tam phương (Rhombohedral R-3m)',
      atomTypes: [
        { element: 'Co', color: '#3b82f6', radius: 0.35 },
        { element: 'O', color: '#ef4444', radius: 0.28 },
        { element: 'Li', color: '#10b981', radius: 0.24 },
      ],
      bonds: {
        type: 'Liên kết phối trí bát diện [CoO₆] xen kẽ tầng ion Liti Li⁺ linh động',
        color: '#6ee7b7',
        hybridization: 'Lai hóa d²sp³ của kim loại chuyển tiếp Coban',
        coordinationGeometry: 'Bát diện đều xếp lớp xen kẽ',
        bondEnergy: 'Phối trí Co-O: 420 kJ/mol; Lực giữ ion Li⁺: ~200 kJ/mol',
        interlayerForce: 'Lớp Liti có thể trượt thoát ra và chui vào trở lại khi cắm sạc',
        descriptionVi:
          'LiCoO₂ có cấu trúc bánh kẹp nhiều lớp: tầng trên là các bát diện CoO₂ vững chắc, ở giữa là một xa lộ cho các ion Liti (Li⁺). Khi bạn cắm sạc điện thoại, các ion Li⁺ tách khỏi lớp này chạy sang cực âm than chì tích trữ điện; khi bạn dùng điện thoại lướt mạng, các ion Li⁺ chạy ngược trở về giải phóng dòng điện nuôi máy.',
      },
    },
    structure: {
      type: 'battery',
      latticeConstant: 2.82,
      repeatX: 2,
      repeatY: 2,
      repeatZ: 2,
    },
    geometry: 'lithium-battery',
  };

export default batteryLcoMaterial;
