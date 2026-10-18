import { MaterialData } from '@/store/useStore';

// ── 25. Thủy Tinh Quang Học (SiO₂) ─────────────────────────────────────────
export const glassMaterial: MaterialData = {
    id: 'glass',
    name: 'Optical Silica Glass',
    nameVi: 'Thủy Tinh Quang Học (SiO₂)',
    formula: 'SiO₂ (Vô định hình)',
    category: 'crystal',
    categoryLabel: 'Gốm & Tinh thể',
    objectName: 'High-Precision Optical Camera Lens',
    objectNameVi: 'Thấu Kính Quang Học Máy Ảnh Leica',
    icon: '🔍',
    color: '#e0f2fe',
    roughness: 0.02,
    metalness: 0.05,
    transmission: 0.94,
    clearcoat: 1.0,
    emissive: '#38bdf8',
    emissiveIntensity: 0.15,
    macroInfo: {
      applications: [
        'Hệ thấu kính máy ảnh nhiếp ảnh gia Leica, Carl Zeiss và kính thiên văn James Webb',
        'Sợi cáp quang truyền dẫn internet tốc độ ánh sáng xuyên đáy đại dương liên lục địa',
        'Kính cường lực màn hình điện thoại Gorilla Glass chống trầy xước và nứt vỡ va đập',
      ],
      mechanicalStrength: 'Độ bền nén cực cao ~1000 MPa, nhưng giòn và nhạy cảm với vết nứt tế vi',
      thermalConductivity: '1.05 W/(m·K) (Vật liệu cách nhiệt quang học)',
      electricalConductivity: '10⁻¹² S/m (Chất cách điện hoàn hảo)',
      density: '2.20 g/cm³',
    },
    metrics: {
      hardness: 65,
      thermal: 18,
      electrical: 8,
      density: 22,
      corrosion: 96,
    },
    molecularInfo: {
      latticeType: 'Mạng không gian vô định hình ngẫu nhiên (Amorphous Random Network)',
      bondLength: 'Si–O: 1.62 Å',
      bondAngle: 'Si–O–Si: 120° – 180° (Phân bố góc liên tục vô trật tự xa)',
      crystalSystem: 'Vô định hình (Amorphous Glass State)',
      atomTypes: [
        { element: 'Si', color: '#38bdf8', radius: 0.32 },
        { element: 'O', color: '#ef4444', radius: 0.26 },
      ],
      bonds: {
        type: 'Cộng hóa trị phân cực Si-O tạo các tứ diện [SiO₄] nối ngẫu nhiên',
        color: '#bae6fd',
        hybridization: 'Lai hóa tứ diện sp³ của Silic',
        coordinationGeometry: 'Tứ diện [SiO₄] có trật tự gần nhưng mất trật tự tuần hoàn xa',
        bondEnergy: '460 kJ/mol (Rất trơ hóa học, không bị nước hay axit ăn mòn)',
        interlayerForce: 'Mạng lưới 3D vô định hình đẳng hướng về mọi mặt quang học',
        descriptionVi:
          'Khác với đá thạch anh có mạng tinh thể tam phương tuần hoàn, thủy tinh quang học được tạo ra bằng cách làm nguội nhanh dịch nóng chảy silica để các tứ diện [SiO₄] bị "đông cứng" ở trạng thái mạng lưới ngẫu nhiên (Amorphous Network). Do không có các mặt tinh thể tuần hoàn hay ranh giới hạt để tán xạ ánh sáng, thủy tinh hoàn toàn trong suốt và có tính đẳng hướng quang học tuyệt đối, cho phép ánh sáng truyền qua với độ suy hao tối thiểu.',
      },
    },
    structure: {
      type: 'silica',
      latticeConstant: 4.8,
      repeatX: 2,
      repeatY: 2,
      repeatZ: 2,
    },
    geometry: 'lens',
  };

export default glassMaterial;
