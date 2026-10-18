import { MaterialData } from '@/store/useStore';

// ── 14. Gốm Sứ Kỹ Thuật (Al₂O₃) ───────────────────────────────────────────
export const ceramicMaterial: MaterialData = {
    id: 'ceramic',
    name: 'Technical Ceramic',
    nameVi: 'Gốm Sứ Kỹ Thuật (Al₂O₃)',
    formula: 'Al₂O₃',
    category: 'crystal',
    categoryLabel: 'Gốm & Tinh thể',
    objectName: 'Ceramic Knife & Spark Plug',
    objectNameVi: 'Lưỡi Dao Gốm & Bugi Đánh Lửa',
    icon: '🔪',
    color: '#f8fafc',
    roughness: 0.12,
    metalness: 0.15,
    transmission: 0.1,
    clearcoat: 0.95,
    emissive: '#f43f5e',
    emissiveIntensity: 0.14,
    macroInfo: {
      applications: [
        'Lưỡi dao gốm nhà bếp sắc bén gấp 10 lần dao thép, cắt thái không bao giờ cùn hay rỉ',
        'Vỏ cách điện bugi đánh lửa động cơ xe máy chịu lửa điện hàng vạn Vôn ở 2000°C',
        'Mặt kính đồng hồ cao cấp Sapphire (tinh thể Al₂O₃ tinh khiết chống trầy tuyệt đối)',
      ],
      mechanicalStrength: 'Độ cứng Mohs 9/10 (Chỉ đứng sau Kim cương), chịu nén cực đại',
      thermalConductivity: '30 W/(m·K)',
      electricalConductivity: '10⁻¹⁴ S/m (Cách điện cao áp tuyệt hảo)',
      density: '3.98 g/cm³',
    },
    metrics: {
      hardness: 95,
      thermal: 65,
      electrical: 5,
      density: 40,
      corrosion: 100,
    },
    molecularInfo: {
      latticeType: 'Mạng tinh thể Corundum bát diện tam phương (Corundum Trigonal Lattice)',
      bondLength: 'Al–O: 1.86 – 1.97 Å',
      bondAngle: 'Khoảng 90.0° / 180.0°',
      crystalSystem: 'Tam phương (Trigonal R-3c)',
      atomTypes: [
        { element: 'Al', color: '#cbd5e1', radius: 0.34 },
        { element: 'O', color: '#ef4444', radius: 0.28 },
      ],
      bonds: {
        type: 'Liên kết hỗn hợp ion - cộng hóa trị cực kỳ mạnh mẽ',
        color: '#fca5a5',
        hybridization: 'Lai hóa phối trí bát diện d²sp³',
        coordinationGeometry: 'Mỗi nguyên tử Al phối trí với 6 nguyên tử O',
        bondEnergy: '510 kJ/mol (Cần nhiệt độ trên 2072°C để nóng chảy)',
        interlayerForce: 'Mạng 3 chiều siêu khóa chặt',
        descriptionVi:
          'Gốm kỹ thuật Alumina gồm các ion nhôm Al³⁺ chui vào 2/3 các hốc bát diện do các anion oxy O²⁻ xếp chặt tạo thành. Liên kết cộng hóa trị pha ion này ngắn và cực kỳ cứng rắn, khiến dao gốm có thể giữ cạnh sắc bén trong nhiều năm mà không cần mài lại, đồng thời chống chịu được nhiệt độ cháy nổ trong động cơ xe máy.',
      },
    },
    structure: {
      type: 'corundum',
      latticeConstant: 4.76,
      repeatX: 2,
      repeatY: 2,
      repeatZ: 2,
    },
    geometry: 'ceramic-blade',
  };

export default ceramicMaterial;
