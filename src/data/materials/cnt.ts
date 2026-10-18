import { MaterialData } from '@/store/useStore';

// ── 16. Ống Nano Carbon Đơn Vách (SWCNT) ──────────────────────────────────
export const cntMaterial: MaterialData = {
    id: 'cnt',
    name: 'Single-Walled Carbon Nanotube',
    nameVi: 'Ống Nano Carbon Đơn Vách (SWCNT)',
    formula: 'C (SWCNT)',
    category: 'nano',
    categoryLabel: 'Vật liệu Nano & Tương lai',
    objectName: 'Carbon Nanotube Coaxial Bundle',
    objectNameVi: 'Bó Sợi Cáp Siêu Bền Nano Carbon',
    icon: '🧪',
    color: '#0284c7',
    roughness: 0.18,
    metalness: 0.9,
    transmission: 0,
    clearcoat: 0.95,
    emissive: '#38bdf8',
    emissiveIntensity: 0.25,
    macroInfo: {
      applications: [
        'Dây cáp thang máy không gian (Space Elevator) chịu tải trọng gấp 100 lần thép ở cùng trọng lượng',
        'Transistor nano siêu tốc thay thế silicon trong vi chip siêu máy tính thế hệ dưới 1 nanomet',
        'Vật liệu composite siêu nhẹ gia cường thân vỏ tàu vũ trụ và vợt tennis thi đấu chuyên nghiệp',
      ],
      mechanicalStrength: 'Độ bền kéo lý thuyết tới 100 GPa (Bền gấp 100 lần thép hợp kim cứng nhất)',
      thermalConductivity: '3500 – 6000 W/(m·K) (Dẫn nhiệt đạn đạo, cao hơn mọi tinh thể tự nhiên)',
      electricalConductivity: '10⁸ S/m (Tải mật độ dòng điện gấp 1000 lần dây đồng mà không bị quá nhiệt)',
      density: '1.30 – 1.40 g/cm³ (Cực kỳ nhẹ, chỉ bằng 1/6 khối lượng thép)',
    },
    metrics: {
      hardness: 99,
      thermal: 98,
      electrical: 96,
      density: 14,
      corrosion: 98,
    },
    molecularInfo: {
      latticeType: 'Mạng ống trụ tổ ong cuộn liền (Armchair (6,6) Chiral Nanotube)',
      bondLength: 'C–C: 1.42 Å (Liên kết cộng hóa trị sp² cong)',
      bondAngle: '120.0° trên mặt cong hình trụ nano',
      crystalSystem: 'Lục giác cuộn tròn (Chiral Cylindrical Space Group)',
      atomTypes: [{ element: 'C', color: '#38bdf8', radius: 0.32 }],
      bonds: {
        type: 'Cộng hóa trị σ nội mạng sp² cong kết hợp obitan π định phi xuyên suốt',
        color: '#7dd3fc',
        hybridization: 'Lai hóa sp² uốn cong hình học nano',
        coordinationGeometry: 'Phối trí 3 tọa độ trên mặt cong hình trụ (CN=3)',
        bondEnergy: '500 kJ/mol (Một trong những liên kết hóa học bền nhất tự nhiên)',
        interlayerForce: 'Ống nano độc lập hoặc liên kết thành bó bằng lực van der Waals',
        descriptionVi:
          'Ống nano carbon SWCNT là một tấm Graphene đơn lớp được cuộn tròn thành một ống hình trụ rỗng hoàn hảo với đường kính chỉ khoảng 1 - 2 nanomet. Nhờ sự liên tục liền mạch không có bất kỳ khuyết tật hay đầu mép hở nào dọc theo chiều dài, các electron chuyển động theo cơ chế đạn đạo (Ballistic Conduction) không va chạm, mang lại độ dẫn điện và sức bền cơ học kỷ lục của nhân loại.',
      },
    },
    structure: {
      type: 'cnt',
      latticeConstant: 2.46,
      repeatX: 3,
      repeatY: 3,
      repeatZ: 3,
    },
    geometry: 'nanotube-coil',
  };

export default cntMaterial;
