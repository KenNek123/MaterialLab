import { MaterialData } from '@/store/useStore';

// ── 5. Vật Liệu Siêu Tích Điện MXene (Ti₃C₂Tₓ) ─────────────────────────────
export const mxeneMaterial: MaterialData = {
    id: 'mxene',
    name: 'MXene',
    nameVi: 'MXene',
    formula: 'Ti₃C₂Tₓ',
    category: 'nano',
    categoryLabel: 'Vật liệu Nano & Tương lai',
    objectName: 'MXene Film Capacitor Roll',
    objectNameVi: 'Cuộn Màng Mỏng Siêu Tích Điện MXene',
    icon: '⚡',
    color: '#06b6d4',
    roughness: 0.22,
    metalness: 0.85,
    transmission: 0.0,
    clearcoat: 0.9,
    emissive: '#0891b2',
    emissiveIntensity: 0.22,
    macroInfo: {
      applications: [
        'Siêu tụ điện sạc pin điện thoại và xe điện siêu tốc chỉ trong vài giây',
        'Màng mỏng chắn sóng điện từ (EMI Shielding) bảo vệ vi mạch 5G và thiết bị hàng không',
        'Cảm biến sinh học độ nhạy cao và màng lọc nano khử muối nước biển',
      ],
      mechanicalStrength: 'Mô-đun đàn hồi đơn lớp ~330 GPa (Độ bền màng ~570 MPa), dẻo dai gấp uốn hàng triệu lần',
      thermalConductivity: '55 W/(m·K) (Dẫn nhiệt kim loại nội lớp)',
      electricalConductivity: '1.5 × 10⁶ S/m (15,000 S/cm, độ dẫn điện cao nhất trong các vật liệu 2D gia công ướt)',
      density: '3.1 – 3.2 g/cm³',
    },
    metrics: {
      hardness: 88,
      thermal: 82,
      electrical: 94,
      density: 32,
      corrosion: 92,
    },
    molecularInfo: {
      latticeType: 'Mạng bánh kẹp 5 tầng 2D (Layered Hexagonal Sandwich Ti–C–Ti–C–Ti)',
      bondLength: 'Liên kết Ti–C: 2.12 Å; Khoảng cách bề mặt Ti–F/OH: 1.88 Å',
      bondAngle: 'Góc phối trí bát diện Ti–C–Ti: 90° và 180°',
      crystalSystem: 'Lục giác 2D (Hexagonal P6₃/mmc)',
      atomTypes: [
        { element: 'Ti', color: '#06b6d4', radius: 0.38 },
        { element: 'C', color: '#475569', radius: 0.26 },
      ],
      bonds: {
        type: 'Liên kết hỗn hợp Kim loại – Cộng hóa trị Ti-C kết hợp Phối tử bề mặt',
        color: '#22d3ee',
        hybridization: 'Lai hóa d²sp³ của Titan (Ti) xen phủ orbital 2p của Cacbon (C)',
        coordinationGeometry: 'Bát diện 6 phối trí: mỗi nguyên tử Carbon nằm ở tâm bát diện tạo bởi 6 nguyên tử Titan',
        bondEnergy: '~760 kJ/mol (Ti–C)',
        interlayerForce: 'Tương tác Van der Waals và cầu liên kết hydro giữa các tầng 2D',
        descriptionVi:
          'MXene Ti₃C₂ được tạo ra bằng cách khắc bóc tách hóa học lớp Nhôm khỏi pha MAX (Ti₃AlC₂). Cấu trúc gồm 5 tầng nguyên tử xếp chặt theo trật tự Ti-C-Ti-C-Ti: các nguyên tử Carbon nằm lọt trong các hốc bát diện giữa hai tấm Titan kim loại. Cấu trúc độc nhất vô nhị này kết hợp hoàn hảo tính dẫn điện cực nhanh của kim loại với diện tích bề mặt khổng lồ của vật liệu 2D, mở đường cho pin và siêu tụ điện sạc đầy trong chớp mắt.',
      },
    },
    structure: {
      type: 'mxene',
      latticeConstant: 3.05,
      repeatX: 3,
      repeatY: 1,
      repeatZ: 3,
    },
    geometry: 'mxene-capacitor',
  };

export default mxeneMaterial;
