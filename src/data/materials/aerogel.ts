import { MaterialData } from '@/store/useStore';

// ── 19. Khói Đông Lạnh Aerogel (Silica Aerogel) ────────────────────────────
export const aerogelMaterial: MaterialData = {
    id: 'aerogel',
    name: 'Silica Aerogel',
    nameVi: 'Aerogel',
    formula: 'SiO₂ (Khung nano xốp)',
    category: 'nano',
    categoryLabel: 'Vật liệu Nano & Tương lai',
    objectName: 'Aerogel Insulation Block',
    objectNameVi: 'Khối Vật Liệu Cách Nhiệt Aerogel',
    icon: '🌫️',
    color: '#e0f2fe',
    roughness: 0.08,
    metalness: 0.05,
    transmission: 0.92,
    clearcoat: 1.0,
    emissive: '#38bdf8',
    emissiveIntensity: 0.3,
    macroInfo: {
      applications: [
        'Vật liệu cách nhiệt tuyệt đối bảo vệ xe tự hành thám hiểm Sao Hỏa NASA Mars Rover (-140°C)',
        'Màng lọc hạt bụi sao chổi vũ trụ trên tàu không gian Stardust mà không làm vỡ mẫu vật',
        'Bộ đồ lặn thám hiểm biển sâu và lớp lót áo chống rét thám hiểm Nam Cực siêu nhẹ mỏng',
      ],
      mechanicalStrength: 'Có thể đỡ vật nặng gấp 4000 lần trọng lượng của chính nó',
      thermalConductivity: '0.013 – 0.015 W/(m·K) (Dẫn nhiệt thấp hơn cả không khí tĩnh 0.026 W/mK)',
      electricalConductivity: '10⁻¹⁵ S/m (Cách điện hoàn hảo)',
      density: '0.001 – 0.003 g/cm³ (Vật liệu rắn nhẹ nhất thế giới, 99.8% thể tích là không khí)',
    },
    metrics: {
      hardness: 30,
      thermal: 10,
      electrical: 5,
      density: 2,
      corrosion: 98,
    },
    molecularInfo: {
      latticeType: 'Mạng xốp nano fractal 3 chiều (Nanoporous Fractal Silica Network)',
      bondLength: 'Si–O: 1.61 Å; Kích thước lỗ xốp nano: 10 – 50 nm',
      bondAngle: 'Si–O–Si: 144.0° uốn khúc tạo mạng bọt khí rỗng',
      crystalSystem: 'Vô định hình xốp nano (Amorphous Nanoporous Foam)',
      atomTypes: [
        { element: 'Si', color: '#38bdf8', radius: 0.30 },
        { element: 'O', color: '#ef4444', radius: 0.25 },
      ],
      bonds: {
        type: 'Cộng hóa trị phân cực Si-O tạo các chuỗi hạt silica đường kính vài nanomet',
        color: '#bae6fd',
        hybridization: 'Lai hóa sp³ tứ diện tạo khung liên kết chuỗi hạt',
        coordinationGeometry: 'Tứ diện [SiO₄] liên kết chuỗi xoắn rỗng',
        bondEnergy: '460 kJ/mol',
        interlayerForce: 'Mạng fractal 3D bẫy giữ phân tử không khí không thể đối lưu',
        descriptionVi:
          'Được mệnh danh là "Khói đông lạnh", Aerogel được tạo ra bằng phương pháp sấy siêu tới hạn để hút sạch chất lỏng khỏi gel silica mà không làm sập khung nano. Với 99.8% thể tích là các lỗ rỗng nano nhỏ hơn quãng đường tự do trung bình của phân tử khí, nhiệt lượng và âm thanh hoàn toàn không thể truyền qua được. Khối aerogel màu xanh lam mờ ảo do hiệu ứng tán xạ Rayleigh tương tự như màu của bầu trời ban ngày.',
      },
    },
    structure: {
      type: 'aerogel',
      latticeConstant: 5.0,
      repeatX: 2,
      repeatY: 2,
      repeatZ: 2,
    },
    geometry: 'aerogel-block',
  };

export default aerogelMaterial;
