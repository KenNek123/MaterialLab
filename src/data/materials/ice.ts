import { MaterialData } from '@/store/useStore';

// ── 21. Băng Đá Tự Nhiên (Ice Ih) ──────────────────────────────────────────
export const iceMaterial: MaterialData = {
    id: 'ice',
    name: 'Natural Hexagonal Ice (Ice Ih)',
    nameVi: 'Băng Đá Tự Nhiên (Ice Ih)',
    formula: 'H₂O (Ice Ih)',
    category: 'molecular',
    categoryLabel: 'Cấu trúc Phân tử',
    objectName: 'Stellar Snowflake Crystal',
    objectNameVi: 'Bông Tuyết Tinh Thể Lục Giác',
    icon: '❄️',
    color: '#e0f2fe',
    roughness: 0.08,
    metalness: 0.05,
    transmission: 0.9,
    clearcoat: 1.0,
    emissive: '#38bdf8',
    emissiveIntensity: 0.2,
    macroInfo: {
      applications: [
        'Cấu trúc băng vĩnh cửu tại hai địa cực Trái Đất điều hòa khí hậu toàn cầu',
        'Băng tầng đóng băng bảo tồn mẫu vật sinh học và cổ sinh vật học hàng triệu năm',
        'Hiện tượng nổi trên nước lỏng bảo vệ hệ sinh thái thủy sinh dưới đáy hồ vào mùa đông',
      ],
      mechanicalStrength: 'Dễ nứt gãy cơ học, biến dạng dẻo trượt băng hà dưới áp lực lớn',
      thermalConductivity: '2.22 W/(m·K)',
      electricalConductivity: '10⁻⁸ S/m (Chất điện môi cách điện ở nhiệt độ âm)',
      density: '0.917 g/cm³ (Nhẹ hơn nước lỏng 1.0 g/cm³, hiện tượng giãn nở dị thường)',
    },
    metrics: {
      hardness: 15,
      thermal: 25,
      electrical: 5,
      density: 9,
      corrosion: 65,
    },
    molecularInfo: {
      latticeType: 'Mạng tinh thể lục giác lồng rỗng (Hexagonal Ice Ih Lattice)',
      bondLength: 'O–H cộng hóa trị: 0.96 Å; Liên kết hydro O···H: 1.76 Å',
      bondAngle: '104.5° nội phân tử; 109.5° tứ diện liên kết hydro',
      crystalSystem: 'Lục giác (Hexagonal P6₃/mmc)',
      atomTypes: [
        { element: 'O', color: '#ef4444', radius: 0.35 },
        { element: 'H', color: '#f8fafc', radius: 0.22 },
      ],
      bonds: {
        type: 'Cộng hóa trị phân cực O–H kết hợp mạng lưới liên kết Hydro tứ diện',
        color: '#7dd3fc',
        hybridization: 'Lai hóa sp³ của Oxy với hai cặp electron không chia',
        coordinationGeometry: 'Mỗi phân tử nước liên kết hydro với đúng 4 phân tử nước láng giềng',
        bondEnergy: 'Cộng hóa trị O–H: 460 kJ/mol; Cầu liên kết Hydro: 21 kJ/mol',
        interlayerForce: 'Mạng lục giác lồng rỗng chứa nhiều thể tích trống khiến băng đá nhẹ hơn nước lỏng',
        descriptionVi:
          'Trong tinh thể băng đá Ice Ih, các phân tử nước H₂O xếp thành các vòng lục giác 6 cạnh đều đặn qua các cầu liên kết Hydro định hướng. Cấu trúc lồng rỗng này tạo nên các khoang rỗng lớn trong không gian, làm cho tỷ trọng của băng đá nhẹ hơn nước lỏng (0.917 g/cm³). Khi nhiệt độ hạ xuống dưới 0°C, các tinh thể tuyết phát triển theo 6 nhánh đối xứng tạo nên những bông tuyết lục giác tuyệt đẹp.',
      },
    },
    structure: {
      type: 'ice',
      latticeConstant: 4.52,
      repeatX: 2,
      repeatY: 2,
      repeatZ: 2,
    },
    geometry: 'snowflake',
  };

export default iceMaterial;
