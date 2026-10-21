import { MaterialData } from '@/store/useStore';

// ── 6. Vàng Ròng 24K (Au) ───────────────────────────────────────────────────
export const goldMaterial: MaterialData = {
    id: 'gold',
    name: 'Gold',
    nameVi: 'Vàng',
    formula: 'Au',
    category: 'metal',
    categoryLabel: 'Kim loại & Hợp kim',
    objectName: 'Fine Gold Bullion Bar',
    objectNameVi: 'Thỏi Vàng Đúc Sáng Bóng',
    icon: '🪙',
    color: '#fbbf24',
    roughness: 0.18,
    metalness: 0.98,
    transmission: 0,
    clearcoat: 0.8,
    emissive: '#d97706',
    emissiveIntensity: 0.22,
    macroInfo: {
      applications: [
        'Dự trữ tài chính quốc gia, tiền tệ thanh toán quốc tế và trang sức quý tộc',
        'Mạ chân tiếp xúc vi mạch máy tính, chip CPU và đầu nối cáp âm thanh cao cấp',
        'Lớp phủ phản xạ tia hồng ngoại trên kính bảo hộ phi hành gia NASA',
      ],
      mechanicalStrength: 'Dẻo nhất trong mọi kim loại: 1 chỉ vàng (3.75g) dát mỏng được 2m²',
      thermalConductivity: '318 W/(m·K)',
      electricalConductivity: '4.1 × 10⁷ S/m (Dẫn điện cực tốt và vĩnh viễn không bao giờ rỉ sét)',
      density: '19.3 g/cm³ (Rất nặng, nặng gấp 2.5 lần sắt thép)',
    },
    metrics: {
      hardness: 30,
      thermal: 88,
      electrical: 95,
      density: 98,
      corrosion: 100,
    },
    molecularInfo: {
      latticeType: 'Mạng tinh thể lập phương tâm diện (FCC - Face Centered Cubic)',
      bondLength: 'Au–Au: 2.88 Å (Khoảng cách giữa hai tâm nguyên tử sát nhau)',
      bondAngle: '90.0° và 60.0° (Đối xứng mặt tinh thể lập phương)',
      crystalSystem: 'Lập phương (Cubic Fm-3m)',
      atomTypes: [{ element: 'Au', color: '#f59e0b', radius: 0.38 }],
      bonds: {
        type: 'Liên kết kim loại quý với hiệu ứng co tương đối tính (Relativistic Effect)',
        color: '#fde047',
        hybridization: 'Biển electron tự do 6s¹ phân tán dải dẫn',
        coordinationGeometry: 'Phối trí 12 hạt tiếp xúc xung quanh (CN=12)',
        bondEnergy: '368 kJ/mol',
        interlayerForce: 'Mạng lập phương trượt dẻo hoàn hảo trên các mặt phẳng {111}',
        descriptionVi:
          'Nguyên tử Vàng xếp theo kiểu lập phương tâm diện xếp chặt với 12 nguyên tử láng giềng. Nhờ hiệu ứng tương đối tính làm co orbital s và dãn orbital d, vàng hấp thụ ánh sáng xanh lam và phản xạ mạnh ánh sáng vàng-đỏ rực rỡ. Năng lượng ion hóa cao khiến vàng hoàn toàn không bị oxy hóa bởi không khí hay axit thông thường.',
      },
    },
    structure: {
      type: 'fcc',
      latticeConstant: 4.08,
      repeatX: 2,
      repeatY: 2,
      repeatZ: 2,
    },
    geometry: 'gold-ingot',
  };

export default goldMaterial;
