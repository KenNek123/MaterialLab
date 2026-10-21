import { MaterialData } from '@/store/useStore';

// ── 1. Kim Cương Tự Nhiên (Carbon sp³) ─────────────────────────────────────
export const diamondMaterial: MaterialData = {
    id: 'diamond',
    name: 'Diamond',
    nameVi: 'Kim Cương',
    formula: 'C (sp³)',
    category: 'crystal',
    categoryLabel: 'Gốm & Tinh thể',
    objectName: 'Brilliant Cut Diamond',
    objectNameVi: 'Viên Kim Cương Đa Giác Lấp Lánh',
    icon: '💎',
    color: '#e0f2fe',
    roughness: 0.05,
    metalness: 0.1,
    transmission: 0.85,
    clearcoat: 1.0,
    emissive: '#38bdf8',
    emissiveIntensity: 0.15,
    macroInfo: {
      applications: [
        'Trang sức đá quý cao cấp có độ tán sắc và lấp lánh quang học vĩnh cửu',
        'Mũi khoan địa chất sâu, lưỡi cưa cắt đá hoa cương và đĩa mài kim loại cứng',
        'Cửa sổ quang học laser công suất lớn và tấm tản nhiệt cho vi chip lượng tử',
      ],
      mechanicalStrength: 'Độ cứng Mohs 10/10 (Vật liệu tự nhiên cứng nhất hành tinh)',
      thermalConductivity: '2200 W/(m·K) (Dẫn nhiệt gấp 5 lần kim loại Đồng)',
      electricalConductivity: '10⁻¹³ S/m (Chất cách điện hoàn hảo tuyệt đối)',
      density: '3.51 g/cm³',
    },
    metrics: {
      hardness: 100,
      thermal: 92,
      electrical: 5,
      density: 35,
      corrosion: 100,
    },
    molecularInfo: {
      latticeType: 'Mạng tinh thể lập phương kim cương (Diamond Cubic Lattice)',
      bondLength: 'C–C: 1.54 Å (Liên kết đơn cộng hóa trị cực ngắn và bền vững)',
      bondAngle: '109.5° (Góc tứ diện đều lý tưởng)',
      crystalSystem: 'Lập phương (Cubic Fd-3m)',
      atomTypes: [{ element: 'C', color: '#93c5fd', radius: 0.35 }],
      bonds: {
        type: 'Cộng hóa trị đơn tứ diện σ (lai hóa sp³ bền tuyệt đối)',
        color: '#bfdbfe',
        hybridization: 'Lai hóa sp³ tứ diện 4 phương đối xứng',
        coordinationGeometry: 'Phối trí tứ diện 4 đỉnh đều đặn (CN=4)',
        bondEnergy: '348 kJ/mol',
        interlayerForce: 'Mạng không gian 3 chiều đẳng hướng (không có mặt trượt)',
        descriptionVi:
          'Mỗi nguyên tử Carbon lai hóa sp³ sử dụng toàn bộ 4 electron hóa trị để liên kết với 4 nguyên tử Carbon xung quanh tạo thành mạng lưới tứ diện không gian 3D bất khả xâm phạm. Không có electron tự do nên kim cương cách điện hoàn toàn nhưng truyền dao động âm (phonon) dẫn nhiệt siêu nhanh.',
      },
    },
    structure: {
      type: 'diamond',
      latticeConstant: 3.57,
      repeatX: 2,
      repeatY: 2,
      repeatZ: 2,
    },
    geometry: 'diamond-gem',
  };

export default diamondMaterial;
