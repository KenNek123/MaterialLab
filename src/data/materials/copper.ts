import { MaterialData } from '@/store/useStore';

// ── 7. Đồng Đỏ Dẫn Điện (Cu) ────────────────────────────────────────────────
export const copperMaterial: MaterialData = {
    id: 'copper',
    name: 'Electrolytic Copper',
    nameVi: 'Đồng Đỏ Dẫn Điện (Cu)',
    formula: 'Cu',
    category: 'metal',
    categoryLabel: 'Kim loại & Hợp kim',
    objectName: 'Copper Wire Spool',
    objectNameVi: 'Cuộn Dây Điện & Lõi Cáp Đồng',
    icon: '🔌',
    color: '#ea580c',
    roughness: 0.22,
    metalness: 0.95,
    transmission: 0,
    clearcoat: 0.85,
    emissive: '#c2410c',
    emissiveIntensity: 0.2,
    macroInfo: {
      applications: [
        'Lõi dây dẫn điện truyền tải trong mọi ngôi nhà, tòa cao ốc và nhà máy',
        'Cuộn dây đồng trong động cơ xe điện, máy biến áp và quạt điện',
        'Ống đồng dẫn gas làm lạnh máy điều hòa không khí và tản nhiệt CPU máy tính',
      ],
      mechanicalStrength: 'Dễ uốn cong, dẻo dai, dễ hàn nối và gia công kéo sợi chỉ mảnh',
      thermalConductivity: '401 W/(m·K) (Dẫn nhiệt cao thứ hai sau Bạc)',
      electricalConductivity: '5.96 × 10⁷ S/m (Chuẩn quốc tế IACS 100% dẫn điện)',
      density: '8.96 g/cm³',
    },
    metrics: {
      hardness: 35,
      thermal: 94,
      electrical: 98,
      density: 90,
      corrosion: 80,
    },
    molecularInfo: {
      latticeType: 'Mạng tinh thể lập phương tâm diện (FCC - Face Centered Cubic)',
      bondLength: 'Cu–Cu: 2.56 Å (Mật độ hạt đặc khít)',
      bondAngle: '90.0° / 60.0°',
      crystalSystem: 'Lập phương (Cubic Fm-3m)',
      atomTypes: [{ element: 'Cu', color: '#f97316', radius: 0.36 }],
      bonds: {
        type: 'Liên kết kim loại tự do dải dẫn 4s¹',
        color: '#fdba74',
        hybridization: 'Biển electron tự do mật độ cao chuyển động tự do',
        coordinationGeometry: 'Phối trí xếp chặt 12 nguyên tử láng giềng (CN=12)',
        bondEnergy: '338 kJ/mol',
        interlayerForce: 'Liên kết kim loại khối đa phương',
        descriptionVi:
          'Trong tinh thể đồng đỏ, mỗi nguyên tử giải phóng 1 electron hóa trị vào biển electron tự do chung. Khi có điện áp đặt vào, dòng electron này trôi dạt với lực cản cực nhỏ, tạo nên khả năng dẫn dòng điện khổng lồ mà ít bị nóng dây. Mạng lập phương tâm diện cho phép kim loại trượt dẻo mà không đứt gãy, giúp người thợ dễ uốn luồn ống dây điện.',
      },
    },
    structure: {
      type: 'fcc',
      latticeConstant: 3.61,
      repeatX: 2,
      repeatY: 2,
      repeatZ: 2,
    },
    geometry: 'copper-coil',
  };

export default copperMaterial;
