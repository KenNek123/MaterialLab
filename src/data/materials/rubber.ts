import { MaterialData } from '@/store/useStore';

// ── 15. Cao Su Đàn Hồi Lưu Hóa ─────────────────────────────────────────────
export const rubberMaterial: MaterialData = {
    id: 'rubber',
    name: 'Vulcanized Rubber',
    nameVi: 'Cao Su Đàn Hồi Lưu Hóa',
    formula: '(C₅H₈)ₙ · S',
    category: 'molecular',
    categoryLabel: 'Cấu trúc Phân tử',
    objectName: 'Automotive Tire Tread Ring',
    objectNameVi: 'Lốp Xe Máy & Vòng Đệm Giảm Chấn',
    icon: '🛞',
    color: '#1e293b',
    roughness: 0.55,
    metalness: 0.2,
    transmission: 0,
    clearcoat: 0.4,
    emissive: '#eab308',
    emissiveIntensity: 0.15,
    macroInfo: {
      applications: [
        'Lốp xe máy, xe ô tô và bánh máy bay chịu ma sát mài mòn và bám đường an toàn',
        'Gioăng cao su đệm kín nắp nồi áp suất, gioăng cửa tủ lạnh ngăn thoát nhiệt',
        'Khối đệm cao su giảm chấn chống rung lắc động đất dưới móng các cây cầu lớn',
      ],
      mechanicalStrength: 'Đàn hồi siêu hạng: kéo dãn gấp 5 lần chiều dài ban đầu vẫn co về như cũ',
      thermalConductivity: '0.15 W/(m·K)',
      electricalConductivity: '10⁻¹⁴ S/m (Cách điện hoàn toàn, dùng làm găng tay thợ điện)',
      density: '1.15 g/cm³',
    },
    metrics: {
      hardness: 25,
      thermal: 15,
      electrical: 5,
      density: 12,
      corrosion: 85,
    },
    molecularInfo: {
      latticeType: 'Mạng lưới chuỗi polyme liên kết chéo lưu huỳnh (Crosslinked Polymer Network)',
      bondLength: 'C–C: 1.54 Å; C=C: 1.34 Å; C–S: 1.82 Å; S–S: 2.05 Å',
      bondAngle: 'C–C–C: 112.0°; C–S–S: 104.0°',
      crystalSystem: 'Vô định hình đàn hồi (Elastomer)',
      atomTypes: [
        { element: 'C', color: '#64748b', radius: 0.32 },
        { element: 'H', color: '#f8fafc', radius: 0.18 },
        { element: 'S', color: '#facc15', radius: 0.35 },
      ],
      bonds: {
        type: 'Cộng hóa trị chuỗi polyisoprene được nối chéo bằng cầu liên kết lưu huỳnh –S–S–',
        color: '#fde047',
        hybridization: 'sp³ kết hợp nối đôi sp² cục bộ',
        coordinationGeometry: 'Chuỗi xoắn tự do nối chéo không gian',
        bondEnergy: 'C–C: 348 kJ/mol; C–S: 272 kJ/mol; S–S: 226 kJ/mol',
        interlayerForce: 'Hiệu ứng entropy đàn hồi: khi kéo dãn chuỗi duỗi thẳng, thả ra tự co xoắn',
        descriptionVi:
          'Cao su tự nhiên gồm các chuỗi phân tử dài ngoằng cuộn xoắn như đống dây thừng. Khi Charles Goodyear phát minh ra phương pháp "lưu hóa" (nấu với lưu huỳnh), các nguyên tử Lưu huỳnh tạo thành các cây cầu nối –S–S– bắc ngang giữa các chuỗi kề nhau. Khi lốp xe bị kéo căng, các chuỗi duỗi ra; khi lực thôi tác dụng, các cây cầu lưu huỳnh lập tức kéo giật các chuỗi co xoắn về vị trí cũ, tạo nên tính đàn hồi bền bỉ cho lốp xe.',
      },
    },
    structure: {
      type: 'polymer-rubber',
      latticeConstant: 5.2,
      repeatX: 2,
      repeatY: 2,
      repeatZ: 2,
    },
    geometry: 'rubber-tyre',
  };

export default rubberMaterial;
