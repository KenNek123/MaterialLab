import { MaterialData } from '@/store/useStore';

// ── 11. Silic Vi Mạch Bán Dẫn (Si) ──────────────────────────────────────────
export const siliconMaterial: MaterialData = {
    id: 'silicon',
    name: 'Semiconductor Silicon',
    nameVi: 'Silic Vi Mạch Bán Dẫn (Si)',
    formula: 'Si',
    category: 'crystal',
    categoryLabel: 'Gốm & Tinh thể',
    objectName: 'Silicon Wafer & AI CPU Chip',
    objectNameVi: 'Phiến Wafer & Con Chip CPU AI',
    icon: '💻',
    color: '#0284c7',
    roughness: 0.12,
    metalness: 0.88,
    transmission: 0,
    clearcoat: 0.95,
    emissive: '#38bdf8',
    emissiveIntensity: 0.25,
    macroInfo: {
      applications: [
        'Trái tim của hàng tỷ vi xử lý máy tính (CPU Intel, GPU Nvidia AI, chip Apple M)',
        'Tấm pin quang điện năng lượng mặt trời biến đổi ánh sáng thành điện sạch',
        'Cảm biến hình ảnh CMOS camera trong điện thoại thông minh chụp ảnh sắc nét',
      ],
      mechanicalStrength: 'Dễ vỡ như thủy tinh khi va đập, nhưng cực phẳng mịn ở mức độ nguyên tử',
      thermalConductivity: '149 W/(m·K)',
      electricalConductivity: 'Bán dẫn điều khiển được: 10⁻⁴ S/m (tinh khiết) → 10⁴ S/m (pha tạp)',
      density: '2.33 g/cm³',
    },
    metrics: {
      hardness: 75,
      thermal: 78,
      electrical: 60,
      density: 23,
      corrosion: 95,
    },
    molecularInfo: {
      latticeType: 'Mạng lập phương kim cương bán dẫn (Diamond Cubic Silicon)',
      bondLength: 'Si–Si: 2.35 Å',
      bondAngle: '109.5° (Tứ diện đều)',
      crystalSystem: 'Lập phương (Cubic Fd-3m)',
      atomTypes: [{ element: 'Si', color: '#38bdf8', radius: 0.35 }],
      bonds: {
        type: 'Cộng hóa trị tứ diện sp³ có vùng cấm bán dẫn lý tưởng (Eg = 1.12 eV)',
        color: '#7dd3fc',
        hybridization: 'Lai hóa sp³ tứ diện 4 phương',
        coordinationGeometry: 'Phối trí tứ diện 4 nguyên tử bao quanh (CN=4)',
        bondEnergy: '326 kJ/mol',
        interlayerForce: 'Mạng tinh thể khối 3D độ tinh khiết tới 99.9999999% (9 số 9)',
        descriptionVi:
          'Silic có cấu trúc tinh thể tứ diện tương tự kim cương nhưng khoảng cách liên kết dài hơn và liên kết yếu hơn. Điểm độc nhất vô nhị của Silic là độ rộng vùng cấm 1.12 eV: ở nhiệt độ thường nó cách điện, nhưng chỉ cần cấy một lượng cực nhỏ tạp chất (Photpho hoặc Bo) thì có thể điều khiển dòng điện đóng/ngắt hàng tỷ lần mỗi giây tạo nên các bóng bán dẫn (transistor) trong vi chip CPU máy tính.',
      },
    },
    structure: {
      type: 'diamond',
      latticeConstant: 5.43,
      repeatX: 2,
      repeatY: 2,
      repeatZ: 2,
    },
    geometry: 'silicon-chip',
  };

export default siliconMaterial;
