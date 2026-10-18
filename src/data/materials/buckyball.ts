import { MaterialData } from '@/store/useStore';

// ── 17. Quả Cầu Buckyball C₆₀ (Fullerene) ──────────────────────────────────
export const buckyballMaterial: MaterialData = {
    id: 'buckyball',
    name: 'Buckminsterfullerene C₆₀',
    nameVi: 'Quả Cầu Buckyball C₆₀ (Fullerene)',
    formula: 'C₆₀',
    category: 'nano',
    categoryLabel: 'Vật liệu Nano & Tương lai',
    objectName: 'C₆₀ Nanocage Drug Carrier',
    objectNameVi: 'Khung Lồng Nano C₆₀ Vận Chuyển Thuốc',
    icon: '⚽',
    color: '#8b5cf6',
    roughness: 0.2,
    metalness: 0.85,
    transmission: 0,
    clearcoat: 0.9,
    emissive: '#a855f7',
    emissiveIntensity: 0.22,
    macroInfo: {
      applications: [
        'Lồng nano phân tử bọc thuốc đặc trị ung thư hướng đích, vận chuyển an toàn đến tế bào đích',
        'Chất chống oxy hóa tế bào siêu mạnh ("bọt biển thu gom gốc tự do" trong y sinh và mỹ phẩm)',
        'Vật liệu nhận electron (Acceptor) hiệu suất cao trong pin mặt trời hữu cơ thế hệ mới',
      ],
      mechanicalStrength: 'Chịu được áp suất nén khổng lồ hơn 200,000 atm mà không bị vỡ lồng cầu',
      thermalConductivity: '0.4 W/(m·K)',
      electricalConductivity: 'Bán dẫn vùng cấm Eg = 1.6 eV; Trở thành chất siêu dẫn khi pha tạp kim loại kiềm (K₃C₆₀)',
      density: '1.65 g/cm³',
    },
    metrics: {
      hardness: 90,
      thermal: 25,
      electrical: 45,
      density: 17,
      corrosion: 96,
    },
    molecularInfo: {
      latticeType: 'Khối 20 mặt cụt đối xứng cụm phân tử (Truncated Icosahedron Ih)',
      bondLength: 'Nối đôi lục-lục: 1.40 Å; Nối đơn lục-ngũ: 1.45 Å',
      bondAngle: 'Ngũ giác 108.0°, Lục giác 120.0°',
      crystalSystem: 'Đối xứng khối 20 mặt cụt 60 đỉnh (Icosahedral Ih)',
      atomTypes: [{ element: 'C', color: '#c084fc', radius: 0.32 }],
      bonds: {
        type: 'Cộng hóa trị sp² cong khép kín tạo 12 mặt ngũ giác và 20 mặt lục giác',
        color: '#d8b4fe',
        hybridization: 'Lai hóa sp² cong đối xứng hình cầu hoàn mỹ',
        coordinationGeometry: 'Mỗi nguyên tử Carbon liên kết với đúng 3 nguyên tử Carbon xung quanh (CN=3)',
        bondEnergy: '480 kJ/mol (Cấu trúc rỗng khép kín không có biên)',
        interlayerForce: 'Các quả cầu C₆₀ liên kết với nhau bằng lực van der Waals thành tinh thể Fullerite',
        descriptionVi:
          'Được trao giải Nobel Hóa học năm 1996, Buckyball C₆₀ gồm đúng 60 nguyên tử Carbon sắp xếp thành một hình khối đa diện cụt tuyệt đối giống hệt quả bóng đá: gồm 12 mặt ngũ giác và 20 mặt lục giác. Cấu trúc lồng rỗng kín này hoàn toàn không có nguyên tử biên hay hóa trị tự do, tạo nên độ bền hóa học và khả năng chứa các nguyên tử kim loại quý bên trong lòng quả cầu.',
      },
    },
    structure: {
      type: 'buckyball',
      latticeConstant: 7.1,
      repeatX: 1,
      repeatY: 1,
      repeatZ: 1,
    },
    geometry: 'buckyball-cage',
  };

export default buckyballMaterial;
