import { MaterialData } from '@/store/useStore';

// ── 23. Thép Carbon Kết Cấu (Carbon Steel C45 / Fe-C) ────────────────────────
export const steelMaterial: MaterialData = {
  id: 'steel',
  name: 'Carbon Steel (C45)',
  nameVi: 'Thép Carbon (C45)',
  formula: 'Fe–C',
  category: 'metal',
  categoryLabel: 'Kim loại & Hợp kim',
  objectName: 'Industrial Mechanical Gear & Shaft',
  objectNameVi: 'Bánh Răng Cơ Khí & Trục Truyền Động C45',
  geometry: 'steel-gear',
  icon: '⚙️',
  color: '#475569',
  roughness: 0.28,
  metalness: 0.92,
  transmission: 0,
  clearcoat: 0.8,
  emissive: '#0284c7',
  emissiveIntensity: 0.1,
  macroInfo: {
    applications: [
      'Chế tạo bánh răng cơ khí hộp số, trục khuỷu động cơ, thanh truyền và bu-lông cường độ cao',
      'Dầm thép kết cấu nhà xưởng công nghiệp, cầu vượt thép chịu tải trọng hàng chục ngàn tấn',
      'Dụng cụ cơ khí cầm tay: cờ-lê, kìm, búa, mũi đột và chi tiết máy gia công cơ khí chính xác',
    ],
    mechanicalStrength: 'Độ bền kéo 600 – 850 MPa, giới hạn chảy 355 – 490 MPa (Sau nhiệt luyện tôi + ram đạt 50 – 58 HRC)',
    thermalConductivity: '50 – 54 W/(m·K)',
    electricalConductivity: '5.8 × 10⁶ S/m',
    density: '7.85 g/cm³',
  },
  metrics: {
    hardness: 82,
    thermal: 52,
    electrical: 58,
    density: 78,
    corrosion: 48,
  },
  molecularInfo: {
    latticeType: 'Mạng Ferrite α-Fe (BCC) kết hợp nguyên tử Carbon xen kẽ (Interstitial Solid Solution)',
    bondLength: 'Fe–Fe: 2.48 Å, Fe–C xen kẽ: 1.95 Å',
    bondAngle: '109.5° và 70.5° (Khối lập phương tâm khối biến dạng vi mô)',
    crystalSystem: 'Lập phương tâm khối (Cubic Im-3m)',
    atomTypes: [
      { element: 'Fe', color: '#64748b', radius: 0.36 },
      { element: 'C', color: '#1e293b', radius: 0.22 },
    ],
    bonds: {
      type: 'Liên kết kim loại dải dẫn d với hiệu ứng ghim lệch mạng (Dislocation Pinning)',
      color: '#94a3b8',
      hybridization: 'Biển electron tự do dải 3d⁶ 4s² kết hợp liên kết cộng hóa trị vi mô Fe-C',
      coordinationGeometry: 'Fe phối trí 8 hạt ở đỉnh ô mạng; Carbon xen kẽ ở lỗ rỗng bát diện phối trí 6 hạt Fe lân cận',
      bondEnergy: '410 kJ/mol',
      interlayerForce: 'Ứng suất nén cục bộ xung quanh nguyên tử Carbon cản trở trượt lệch mạng',
      descriptionVi:
        'Bài học cốt lõi trong môn Công nghệ 11 (Vật liệu cơ khí): Sắt nguyên chất rất mềm và dễ biến dạng dẻo vì các mặt nguyên tử dễ trượt lên nhau. Khi pha thêm 0.45% Carbon (Thép C45), các nguyên tử Carbon có kích thước bé hơn nhiều sẽ chui vào nằm kẹt tại các lỗ rỗng bát diện giữa các khối Fe. Đám mây nguyên tử Carbon này tạo nên "hiệu ứng ghim" (Cottrell Atmosphere), khóa cứng các đường lệch mạng không cho trượt tự do, biến sắt thành Thép cứng, chịu tải trọng lớn gấp nhiều lần.',
    },
  },
  structure: {
    type: 'steel',
    latticeConstant: 2.87,
    repeatX: 2,
    repeatY: 2,
    repeatZ: 2,
  },
};
