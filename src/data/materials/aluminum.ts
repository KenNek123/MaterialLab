import { MaterialData } from '@/store/useStore';

// ── 9. Nhôm Hàng Không (Al) ─────────────────────────────────────────────────
export const aluminumMaterial: MaterialData = {
    id: 'aluminum',
    name: 'Aluminum',
    nameVi: 'Nhôm',
    formula: 'Al',
    category: 'metal',
    categoryLabel: 'Kim loại & Hợp kim',
    objectName: 'Aircraft Winglet & Metal Shell',
    objectNameVi: 'Vỏ Máy Bay & Khung Hợp Kim',
    icon: '✈️',
    color: '#e2e8f0',
    roughness: 0.25,
    metalness: 0.85,
    transmission: 0,
    clearcoat: 0.9,
    emissive: '#38bdf8',
    emissiveIntensity: 0.12,
    macroInfo: {
      applications: [
        'Vỏ thân và cánh máy bay hành khách Boeing, Airbus và tên lửa vũ trụ',
        'Vỏ máy tính xách tay MacBook nhôm nguyên khối (Unibody) và khung smartphone',
        'Lon nước ngọt Coca-Cola, giấy bạc bọc nướng thực phẩm và khung cửa kính',
      ],
      mechanicalStrength: 'Bền nhẹ vượt trội: nhẹ bằng 1/3 sắt thép nhưng siêu cứng khi pha hợp kim',
      thermalConductivity: '237 W/(m·K) (Dẫn nhiệt nhanh gấp 3 lần thép)',
      electricalConductivity: '3.77 × 10⁷ S/m (Dùng làm dây cáp điện cao thế trên cao vì nhẹ)',
      density: '2.70 g/cm³ (Siêu nhẹ, giúp tiết kiệm nhiên liệu máy bay)',
    },
    metrics: {
      hardness: 45,
      thermal: 82,
      electrical: 88,
      density: 27,
      corrosion: 90,
    },
    molecularInfo: {
      latticeType: 'Mạng tinh thể lập phương tâm diện (FCC - Face Centered Cubic)',
      bondLength: 'Al–Al: 2.86 Å',
      bondAngle: '90.0° / 60.0°',
      crystalSystem: 'Lập phương (Cubic Fm-3m)',
      atomTypes: [{ element: 'Al', color: '#cbd5e1', radius: 0.36 }],
      bonds: {
        type: 'Liên kết kim loại dải dẫn 3s² 3p¹',
        color: '#e2e8f0',
        hybridization: 'Biển electron tự do 3 valence electrons/nguyên tử',
        coordinationGeometry: 'Phối trí xếp chặt 12 nguyên tử láng giềng (CN=12)',
        bondEnergy: '330 kJ/mol',
        interlayerForce: 'Màng oxit Al₂O₃ tự nhiên siêu mỏng ngăn chặn ăn mòn',
        descriptionVi:
          'Nhôm có mạng tinh thể lập phương tâm diện với mật độ xếp chặt cao nhưng trọng lượng riêng lại cực kỳ nhẹ. Đặc biệt, khi tiếp xúc với không khí, nhôm lập tức tự sinh ra một lớp màng oxit Al₂O₃ dày vài nanomet siêu kín, trơ và trong suốt, đóng vai trò như lớp áo giáp tự bảo vệ khiến nhôm không bao giờ bị rỉ mục rữa như sắt thép.',
      },
    },
    structure: {
      type: 'fcc',
      latticeConstant: 4.05,
      repeatX: 2,
      repeatY: 2,
      repeatZ: 2,
    },
    geometry: 'aluminum-wing',
  };

export default aluminumMaterial;
