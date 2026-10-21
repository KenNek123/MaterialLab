import { MaterialData } from '@/store/useStore';

// ── 23. Sợi Kevlar Chống Đạn (Aramid) ───────────────────────────────────────
export const kevlarMaterial: MaterialData = {
    id: 'kevlar',
    name: 'Kevlar',
    nameVi: 'Kevlar',
    formula: '(C₁₄H₁₀N₂O₂)ₙ',
    category: 'molecular',
    categoryLabel: 'Cấu trúc Phân tử',
    objectName: 'Ballistic Armor Composite Shield',
    objectNameVi: 'Tấm Giáp Chống Đạn & Cáp Siêu Tải',
    icon: '🧵',
    color: '#eab308',
    roughness: 0.45,
    metalness: 0.1,
    transmission: 0,
    clearcoat: 0.7,
    emissive: '#ca8a04',
    emissiveIntensity: 0.2,
    macroInfo: {
      applications: [
        'Áo giáp chống đạn quân sự bảo vệ sinh mạng binh lính và lực lượng an ninh',
        'Dây cáp cứu sinh chịu tải trọng hàng trăm tấn cho giàn khoan dầu ngoài khơi',
        'Lớp lót chống đâm thủng cho lốp xe đua F1 và vỏ thân tàu ngầm quân sự',
      ],
      mechanicalStrength: 'Độ bền kéo 3.6 GPa (Bền gấp 5 lần sợi thép ở cùng khối lượng)',
      thermalConductivity: '0.04 W/(m·K) (Vật liệu cách nhiệt và chống cháy tuyệt vời)',
      electricalConductivity: '10⁻¹⁴ S/m (Cách điện hoàn toàn)',
      density: '1.44 g/cm³ (Rất nhẹ, nổi bồng bềnh trên nước khi dệt màng)',
    },
    metrics: {
      hardness: 92,
      thermal: 12,
      electrical: 5,
      density: 15,
      corrosion: 88,
    },
    molecularInfo: {
      latticeType: 'Mạng chuỗi aramid tinh thể định hướng (Liquid-Crystalline Poly-Aramid)',
      bondLength: 'C–C thơm: 1.39 Å; C–N: 1.34 Å; C=O: 1.23 Å; N–H···O: 1.95 Å',
      bondAngle: 'Vòng benzen 120.0°; Nhóm peptit 122.0°',
      crystalSystem: 'Đơn tà định hướng (Monoclinic P2₁/n)',
      atomTypes: [
        { element: 'C', color: '#64748b', radius: 0.32 },
        { element: 'N', color: '#3b82f6', radius: 0.28 },
        { element: 'O', color: '#ef4444', radius: 0.26 },
        { element: 'H', color: '#f8fafc', radius: 0.18 },
      ],
      bonds: {
        type: 'Cộng hóa trị chuỗi poly-paraphenylene nối chéo bằng cầu liên kết hydro',
        color: '#facc15',
        hybridization: 'Lai hóa sp² vòng thơm liên hợp xen phủ nhóm amit phẳng',
        coordinationGeometry: 'Chuỗi mạch thẳng duỗi thẳng hàng song song tuyệt đối',
        bondEnergy: '420 kJ/mol (C–C)',
        interlayerForce: 'Cầu liên kết Hydro N–H···O=C ken đặc khóa chặt các chuỗi song song',
        descriptionVi:
          'Kevlar (poly-paraphenylene terephthalamide) có cấu trúc phân tử mạch thẳng gồm các vòng benzen cứng nhắc xen kẽ nhóm liên kết amit. Nhờ quá trình kéo sợi từ dung dịch tinh thể lỏng, các chuỗi polymer sắp xếp song song thẳng tắp và được "hàn chặt" với nhau bởi vô số cầu liên kết hydro cực kỳ dày đặc. Khi đầu đạn chạm vào, mạng lưới này phân tán động năng xung kích tức thì ra toàn bộ diện tích bề mặt, ngăn chặn viên đạn xuyên qua.',
      },
    },
    structure: {
      type: 'kevlar',
      latticeConstant: 5.2,
      repeatX: 2,
      repeatY: 2,
      repeatZ: 2,
    },
    geometry: 'racket',
  };

export default kevlarMaterial;
