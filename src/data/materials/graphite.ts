import { MaterialData } from '@/store/useStore';

// ── 2. Than Chì & Graphene (Carbon sp²) ─────────────────────────────────────
export const graphiteMaterial: MaterialData = {
    id: 'graphite',
    name: 'Hexagonal Graphite',
    nameVi: 'Than Chì Lục Giác',
    formula: 'C (sp²)',
    category: 'crystal',
    categoryLabel: 'Gốm & Tinh thể',
    objectName: 'Graphite Pencil Core',
    objectNameVi: 'Ruột Bút Chì Than Chì',
    icon: '✏️',
    color: '#334155',
    roughness: 0.35,
    metalness: 0.8,
    transmission: 0,
    clearcoat: 0.9,
    emissive: '#0ea5e9',
    emissiveIntensity: 0.18,
    macroInfo: {
      applications: [
        'Ruột bút chì viết học tập hằng ngày nhờ các lớp trượt êm ái trên mặt giấy',
        'Điện cực âm (Anode) trong 100% pin sạc Lithium-ion của điện thoại và xe điện',
        'Màng tản nhiệt carbon siêu mỏng làm mát lưng điện thoại thông minh và laptop',
      ],
      mechanicalStrength: 'Dễ tách lớp bôi trơn theo chiều ngang, nhưng từng lớp bền hơn thép',
      thermalConductivity: '1500 – 4000 W/(m·K) (Dẫn nhiệt dọc theo mặt phẳng)',
      electricalConductivity: '3.0 × 10⁵ S/m (Dẫn điện tốt tương đương kim loại)',
      density: '2.26 g/cm³',
    },
    metrics: {
      hardness: 20,
      thermal: 90,
      electrical: 85,
      density: 23,
      corrosion: 95,
    },
    molecularInfo: {
      latticeType: 'Mạng tổ ong 2D nhiều tầng (Layered Hexagonal Honeycomb)',
      bondLength: 'C–C trong lớp: 1.42 Å; Khoảng cách giữa các lớp: 3.35 Å',
      bondAngle: '120.0° (Lục giác đều phẳng)',
      crystalSystem: 'Lục giác (Hexagonal P6₃/mmc)',
      atomTypes: [{ element: 'C', color: '#64748b', radius: 0.32 }],
      bonds: {
        type: 'Cộng hóa trị σ nội tầng + Lực van der Waals yếu giữa các tầng',
        color: '#94a3b8',
        hybridization: 'Lai hóa sp² phẳng tam giác',
        coordinationGeometry: 'Phối trí tam giác phẳng 3 tọa độ (CN=3)',
        bondEnergy: 'Nội tầng: 470 kJ/mol (cực mạnh); Ngoại tầng: ~15 kJ/mol (rất yếu)',
        interlayerForce: 'Lực hút van der Waals giữa các tầng cho phép bong tách thành graphene',
        descriptionVi:
          'Trong mỗi tầng, các nguyên tử Carbon liên kết cộng hóa trị sp² thành các vòng lục giác tổ ong siêu bền. Electron thứ 4 tạo đám mây π tự do giúp dẫn điện tốt. Giữa các tầng chỉ là lực hút van der Waals yếu ớt, cho phép các lớp than chì dễ dàng trượt lên nhau để lại vệt chữ trên giấy khi ta viết bút chì.',
      },
    },
    structure: {
      type: 'graphene',
      latticeConstant: 2.46,
      repeatX: 3,
      repeatY: 3,
      repeatZ: 2,
    },
    geometry: 'graphite-pencil',
  };

export default graphiteMaterial;
