import { MaterialData } from '@/store/useStore';

// ── 22. Graphene Đơn Lớp (2D) ─────────────────────────────────────────────
export const grapheneMaterial: MaterialData = {
    id: 'graphene',
    name: 'Monolayer Graphene',
    nameVi: 'Graphene Đơn Lớp (2D)',
    formula: 'C (sp² 2D)',
    category: 'nano',
    categoryLabel: 'Vật liệu Nano & Tương lai',
    objectName: 'Ultra-lightweight Carbon Racket',
    objectNameVi: 'Khung Vợt Sợi Carbon & Graphene',
    icon: '🎾',
    color: '#0f172a',
    roughness: 0.15,
    metalness: 0.9,
    transmission: 0,
    clearcoat: 0.95,
    emissive: '#0284c7',
    emissiveIntensity: 0.25,
    macroInfo: {
      applications: [
        'Vợt thể thao chuyên nghiệp và khung xe đạp đua Tour de France siêu cứng nhẹ',
        'Màng lọc thẩm thấu ngược khử muối nước biển và tách khí CO₂ công nghiệp',
        'Màn hình cảm ứng mềm dẻo trong suốt và bóng bán dẫn lượng tử thế hệ sau Silicon',
      ],
      mechanicalStrength: 'Độ bền kéo lý thuyết 130 GPa (Bền gấp 200 lần thép hợp kim cứng nhất)',
      thermalConductivity: '5000 W/(m·K) (Vua dẫn nhiệt trong vũ trụ, gấp đôi kim cương)',
      electricalConductivity: '10⁸ S/m (Hạt tải điện chuyển động không khối lượng Dirac Fermion)',
      density: '2.26 g/cm³ (Độ dày chỉ đúng 1 lớp nguyên tử 0.335 nm)',
    },
    metrics: {
      hardness: 99,
      thermal: 100,
      electrical: 99,
      density: 22,
      corrosion: 98,
    },
    molecularInfo: {
      latticeType: 'Mạng tổ ong phẳng 2D một lớp nguyên tử (Monolayer Honeycomb Lattice)',
      bondLength: 'C–C: 1.42 Å (Liên kết cộng hóa trị sp² siêu ngắn)',
      bondAngle: '120.0° (Góc tam giác phẳng hoàn mỹ)',
      crystalSystem: 'Lục giác 2D (Hexagonal P6/mmm)',
      atomTypes: [{ element: 'C', color: '#38bdf8', radius: 0.32 }],
      bonds: {
        type: 'Cộng hóa trị σ nội mạng cực mạnh kết hợp đám mây obitan π giải tỏa tự do',
        color: '#7dd3fc',
        hybridization: 'Lai hóa sp² tam giác phẳng đối xứng tuyệt đối',
        coordinationGeometry: 'Phối trí 3 tọa độ phẳng (CN=3)',
        bondEnergy: '524 kJ/mol (Cần lực xé khổng lồ để làm rách mạng lưới)',
        interlayerForce: 'Đơn lớp nguyên tử độc lập (Single Atomic Sheet)',
        descriptionVi:
          'Đoạt giải Nobel Vật lý 2010, Graphene là vật liệu 2 chiều đầu tiên được khám phá trong lịch sử nhân loại. Chỉ dày duy nhất một lớp nguyên tử Carbon xếp theo hình tổ ong, các electron di chuyển trong mạng tinh thể này như những hạt phi khối lượng (Dirac Fermions) với tốc độ đạt 1/300 vận tốc ánh sáng, tạo nên độ dẫn điện và dẫn nhiệt vô địch vũ trụ.',
      },
    },
    structure: {
      type: 'graphene',
      latticeConstant: 2.46,
      repeatX: 3,
      repeatY: 3,
      repeatZ: 1,
    },
    geometry: 'racket',
  };

export default grapheneMaterial;
