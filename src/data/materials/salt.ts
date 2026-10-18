import { MaterialData } from '@/store/useStore';

// ── 3. Muối Ăn Tinh Khiết (NaCl) ───────────────────────────────────────────
export const saltMaterial: MaterialData = {
    id: 'salt',
    name: 'Table Salt',
    nameVi: 'Muối Ăn Tinh Khiết (NaCl)',
    formula: 'NaCl',
    category: 'crystal',
    categoryLabel: 'Gốm & Tinh thể',
    objectName: 'Cubic Salt Crystal',
    objectNameVi: 'Hạt Tinh Thể Muối Lập Phương',
    icon: '🧂',
    color: '#f8fafc',
    roughness: 0.15,
    metalness: 0.05,
    transmission: 0.75,
    clearcoat: 0.9,
    emissive: '#a855f7',
    emissiveIntensity: 0.12,
    macroInfo: {
      applications: [
        'Gia vị nấu ăn thiết yếu hằng ngày cung cấp ion Natri cho cơ thể sống',
        'Bảo quản thực phẩm (ướp cá thịt, làm nước mắm, muối dưa cà truyền thống)',
        'Nguyên liệu công nghiệp sản xuất xút ăn da (NaOH), khí Clo và xà phòng',
      ],
      mechanicalStrength: 'Dễ vỡ vụn theo các mặt phẳng tinh thể vuông góc (Cát khai 90°)',
      thermalConductivity: '6.5 W/(m·K)',
      electricalConductivity: 'Chất rắn cách điện; Tan trong nước thành dung dịch điện ly siêu dẫn',
      density: '2.16 g/cm³',
    },
    metrics: {
      hardness: 25,
      thermal: 15,
      electrical: 75,
      density: 22,
      corrosion: 40,
    },
    molecularInfo: {
      latticeType: 'Mạng lập phương tâm diện đá muối (Rocksalt FCC Lattice)',
      bondLength: 'Na–Cl: 2.82 Å (Khoảng cách giữa hai tâm ion trái dấu)',
      bondAngle: '90.0° (Góc vuông lập phương đối xứng 3 chiều)',
      crystalSystem: 'Lập phương (Cubic Fm-3m)',
      atomTypes: [
        { element: 'Na', color: '#818cf8', radius: 0.30 },
        { element: 'Cl', color: '#22c55e', radius: 0.38 },
      ],
      bonds: {
        type: 'Liên kết ion hút tĩnh điện cực mạnh giữa cation Na⁺ và anion Cl⁻',
        color: '#cbd5e1',
        hybridization: 'Hút tĩnh điện thuần khiết không định hướng',
        coordinationGeometry: 'Bát diện đều phối trí 6: mỗi ion Na⁺ được bao quanh bởi 6 ion Cl⁻',
        bondEnergy: '787 kJ/mol (Năng lượng mạng tinh thể cực cao)',
        interlayerForce: 'Mạng khối 3D lập phương đan xen đều đặn',
        descriptionVi:
          'Nguyên tử Natri nhường 1 electron ngoài cùng cho nguyên tử Clo tạo thành cation Na⁺ và anion Cl⁻. Lực hút tĩnh điện giữa các điện tích trái dấu sắp xếp các ion thành một khối lập phương hoàn mỹ. Khi hòa tan vào nước, các phân tử nước tách rời ion Na⁺ và Cl⁻ giúp dung dịch dẫn điện dễ dàng.',
      },
    },
    structure: {
      type: 'nacl',
      latticeConstant: 5.64,
      repeatX: 2,
      repeatY: 2,
      repeatZ: 2,
    },
    geometry: 'salt-cube',
  };

export default saltMaterial;
