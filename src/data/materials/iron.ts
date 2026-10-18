import { MaterialData } from '@/store/useStore';

// ── 8. Sắt & Thép Xây Dựng (Fe) ─────────────────────────────────────────────
export const ironMaterial: MaterialData = {
    id: 'iron',
    name: 'Iron & Structural Steel',
    nameVi: 'Sắt & Thép Xây Dựng (Fe)',
    formula: 'Fe',
    category: 'metal',
    categoryLabel: 'Kim loại & Hợp kim',
    objectName: 'Structural Steel I-Beam',
    objectNameVi: 'Thanh Thép Chữ I Chịu Lực',
    icon: '🏗️',
    color: '#64748b',
    roughness: 0.35,
    metalness: 0.9,
    transmission: 0,
    clearcoat: 0.7,
    emissive: '#0284c7',
    emissiveIntensity: 0.15,
    macroInfo: {
      applications: [
        'Cốt thép bê tông xây nhà cao tầng, cầu vượt, đường sắt và hầm vượt sông',
        'Thân vỏ xe ô tô, container hàng hải, vỏ tàu thủy viễn dương và máy công trình',
        'Chế tạo máy móc cơ khí, nồi niêu xoong chảo gang đúc truyền nhiệt bền bỉ',
      ],
      mechanicalStrength: 'Độ bền kéo 400 – 1200 MPa (Chịu tải trọng hàng chục ngàn tấn)',
      thermalConductivity: '80 W/(m·K)',
      electricalConductivity: '1.0 × 10⁷ S/m (Có từ tính sắt từ mạnh mẽ)',
      density: '7.87 g/cm³',
    },
    metrics: {
      hardness: 65,
      thermal: 60,
      electrical: 70,
      density: 78,
      corrosion: 45,
    },
    molecularInfo: {
      latticeType: 'Mạng lập phương tâm khối (BCC - Body Centered Cubic)',
      bondLength: 'Fe–Fe: 2.48 Å (Tâm khối nối tới 8 đỉnh)',
      bondAngle: '109.5° và 70.5°',
      crystalSystem: 'Lập phương (Cubic Im-3m)',
      atomTypes: [{ element: 'Fe', color: '#94a3b8', radius: 0.35 }],
      bonds: {
        type: 'Liên kết kim loại chuyển tiếp dải d với tương tác sắt từ',
        color: '#cbd5e1',
        hybridization: 'Biển electron dải 3d⁶ 4s² lai hóa',
        coordinationGeometry: 'Phối trí 8 nguyên tử ở đỉnh ô mạng (CN=8)',
        bondEnergy: '416 kJ/mol',
        interlayerForce: 'Mạng tinh thể liên kết đa phương chịu ứng suất lớn',
        descriptionVi:
          'Sắt nguyên chất ở nhiệt độ phòng có cấu trúc lập phương tâm khối (pha Ferrite α-Fe): mỗi nguyên tử nằm ở tâm khối lập phương liên kết chặt với 8 nguyên tử ở 8 đỉnh. Khi pha thêm một lượng nhỏ Carbon (0.1% - 0.8%), các nguyên tử Carbon len lỏi vào các lỗ trống chèn kẽ khóa chặt các mặt trượt, biến sắt dẻo thành Thép cứng chịu lực gấp hàng chục lần.',
      },
    },
    structure: {
      type: 'bcc',
      latticeConstant: 2.87,
      repeatX: 2,
      repeatY: 2,
      repeatZ: 2,
    },
    geometry: 'iron-beam',
  };

export default ironMaterial;
