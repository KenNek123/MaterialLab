import { MaterialData } from '@/store/useStore';

// ── 26. Hợp Kim Cứng Vonfram Cacbua (Tungsten Carbide / WC) ──────────────────
export const tungstenCarbideMaterial: MaterialData = {
  id: 'tungsten-carbide',
  name: 'Tungsten Carbide (WC)',
  nameVi: 'Vonfram Cacbua (WC)',
  formula: 'WC',
  category: 'metal',
  categoryLabel: 'Kim loại & Hợp kim',
  objectName: 'CNC Lathe Cutting Insert & Precision Endmill',
  objectNameVi: 'Mảnh Dao Tiện Phay CNC & Mũi Khoan Địa Chất',
  geometry: 'carbide-insert',
  icon: '🔪',
  color: '#334155',
  roughness: 0.22,
  metalness: 0.94,
  transmission: 0,
  clearcoat: 0.8,
  emissive: '#f59e0b',
  emissiveIntensity: 0.15,
  macroInfo: {
    applications: [
      'Mảnh dao tiện, dao phay ngón CNC gọt cắt kim loại tốc độ cao trong cơ khí chế tạo chính xác',
      'Đầu mũi khoan khai thác mỏ địa chất, mũi khoan hầm xuyên núi và giếng dầu khí sâu dưới đáy biển',
      'Khuôn dập nguội dập nóng kim loại, viên bi đầu bút bi siêu bền và áo giáp chống đạn xuyên giáp',
    ],
    mechanicalStrength: 'Độ cứng 90 – 94 HRA (~1800 – 2400 HV, đứng số 1 kim loại chỉ sau kim cương), chịu nén tới 6000 MPa',
    thermalConductivity: '110 W/(m·K) (Dẫn nhiệt tốt giúp tản nhiệt phôi cắt siêu tốc)',
    electricalConductivity: '5.0 × 10⁶ S/m',
    density: '15.6 g/cm³ (Nặng gấp đôi thép, cảm giác cầm đầm tay vượt trội)',
  },
  metrics: {
    hardness: 98,
    thermal: 82,
    electrical: 55,
    density: 96,
    corrosion: 92,
  },
  molecularInfo: {
    latticeType: 'Mạng lục giác nguyên thủy WC lăng trụ tam giác (Primitive Hexagonal P-6m2)',
    bondLength: 'W–C: 2.20 Å (Liên kết lai hóa cộng hóa trị – kim loại cực ngắn)',
    bondAngle: 'Lăng trụ tam giác phối trí 6 hạt 120.0° và 90.0°',
    crystalSystem: 'Lục giác (Hexagonal P-6m2 Số 187)',
    atomTypes: [
      { element: 'W', color: '#94a3b8', radius: 0.38 },
      { element: 'C', color: '#1e293b', radius: 0.22 },
    ],
    bonds: {
      type: 'Liên kết lai hóa d-p cộng hóa trị cực ngắn kết hợp liên kết kim loại chịu nhiệt 1000°C',
      color: '#cbd5e1',
      hybridization: 'Xen phủ mạnh obitan 5d⁴ của Vonfram và 2p² của Carbon',
      coordinationGeometry: 'Mỗi nguyên tử Carbon nằm ở tâm của một lăng trụ tam giác đều tạo bởi 6 nguyên tử W (CN=6)',
      bondEnergy: '680 kJ/mol (Một trong những liên kết phân tử bền nhiệt nhất hành tinh)',
      interlayerForce: 'Mạng tinh thể khép kín với mật độ liên kết định hướng dày đặc không có mặt trượt yếu',
      descriptionVi:
        'Bài "Vật liệu làm dụng cụ cắt gọt kim loại" trong SGK Công nghệ 11: Được mệnh danh là "Widia" (viết tắt từ tiếng Đức "Wie Diamant" nghĩa là "Cứng như kim cương"). Trong tinh thể WC, nguyên tử Vonfram nặng liên kết với Carbon qua obitan 5d-2p cực ngắn, tạo nên cấu trúc lăng trụ tam giác không có bất kỳ mặt trượt tự nhiên nào. Nhờ đó, dao hợp kim cứng có thể gọt cắt thép tôi cứng ở tốc độ hàng trăm mét/phút, dù đầu mũi dao nóng đỏ rực tới 1000°C vẫn không hề bị mềm đi hay mòn vẹt.',
    },
  },
  structure: {
    type: 'tungsten-carbide',
    latticeConstant: 2.91,
    repeatX: 2,
    repeatY: 2,
    repeatZ: 2,
  },
};
