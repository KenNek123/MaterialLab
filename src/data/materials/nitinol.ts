import { MaterialData } from '@/store/useStore';

// ── 20. Hợp Kim Nhớ Hình Nitinol (NiTi) ────────────────────────────────────
export const nitinolMaterial: MaterialData = {
    id: 'nitinol',
    name: 'Nitinol',
    nameVi: 'Nitinol',
    formula: 'NiTi',
    category: 'metal',
    categoryLabel: 'Kim loại & Hợp kim',
    objectName: 'Smart Nitinol Coronary Stent',
    objectNameVi: 'Stent Mạch Vành Tim & Khớp Nhớ Hình',
    icon: '🧬',
    color: '#94a3b8',
    roughness: 0.22,
    metalness: 0.95,
    transmission: 0,
    clearcoat: 0.9,
    emissive: '#06b6d4',
    emissiveIntensity: 0.2,
    macroInfo: {
      applications: [
        'Stent mạch vành tim tự nong rộng trong lòng mạch máu cứu sống hàng triệu bệnh nhân nhồi máu cơ tim',
        'Dây cung chỉnh nha niềng răng thông minh tạo lực kéo sinh học êm ái liên tục không đổi',
        'Khớp nối thông minh ống dẫn nhiên liệu máy bay tiêm kích và cơ nhân tạo cho robot tương lai',
      ],
      mechanicalStrength: 'Siêu đàn hồi (Superelasticity): biến dạng uốn cong tới 8% vẫn tự bung về vị trí cũ',
      thermalConductivity: '18 W/(m·K)',
      electricalConductivity: '1.2 × 10⁶ S/m',
      density: '6.45 g/cm³',
    },
    metrics: {
      hardness: 78,
      thermal: 35,
      electrical: 52,
      density: 65,
      corrosion: 97,
    },
    molecularInfo: {
      latticeType: 'Mạng lập phương trật tự B2 CsCl (Ordered Cubic B2 Austenite)',
      bondLength: 'Ni–Ti: 2.61 Å (Khoảng cách tâm khối tới 8 đỉnh)',
      bondAngle: '90.0° vuông lập phương và 109.5° đường chéo không gian',
      crystalSystem: 'Lập phương (Cubic Pm-3m)',
      atomTypes: [
        { element: 'Ni', color: '#a78bfa', radius: 0.35 },
        { element: 'Ti', color: '#06b6d4', radius: 0.36 },
      ],
      bonds: {
        type: 'Liên kết kim loại chuyển pha không khuếch tán (Martensitic Transformation)',
        color: '#c4b5fd',
        hybridization: 'Xen phủ obitan d giải tỏa dải dẫn kim loại',
        coordinationGeometry: 'Mỗi nguyên tử Ti ở tâm khối phối trí với 8 nguyên tử Ni ở các đỉnh (CN=8)',
        bondEnergy: '390 kJ/mol',
        interlayerForce: 'Mặt phẳng tinh thể có thể trượt song tinh đảo chiều mà không phá vỡ liên kết',
        descriptionVi:
          'Hợp kim Nitinol (Nickel Titanium) sở hữu hai "ký ức" hình dạng nhờ sự chuyển pha tinh thể rắn không khuếch tán: ở nhiệt độ thấp là pha Martensite dẻo dễ uốn, khi được làm ấm đến nhiệt độ cơ thể người (37°C), toàn bộ các nguyên tử lập tức trượt chuyển pha đồng loạt về mạng lập phương Austenite B2, tự động khôi phục 100% hình dạng ban đầu. Tính chất siêu đàn hồi này giúp các stent tim mạch bung mở hoàn hảo trong lòng động mạch.',
      },
    },
    structure: {
      type: 'nitinol',
      latticeConstant: 3.015,
      repeatX: 2,
      repeatY: 2,
      repeatZ: 2,
    },
    geometry: 'nitinol-stent',
  };

export default nitinolMaterial;
