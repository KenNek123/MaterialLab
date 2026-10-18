import { MaterialData } from '@/store/useStore';

// ── 12. Chống Dính Teflon (PTFE) ───────────────────────────────────────────
export const teflonMaterial: MaterialData = {
    id: 'teflon',
    name: 'Teflon PTFE',
    nameVi: 'Chống Dính Teflon (PTFE)',
    formula: '(C₂F₄)ₙ',
    category: 'molecular',
    categoryLabel: 'Cấu trúc Phân tử',
    objectName: 'Non-stick Coated Pan',
    objectNameVi: 'Lòng Chảo Chống Dính Cao Cấp',
    icon: '🍳',
    color: '#334155',
    roughness: 0.3,
    metalness: 0.1,
    transmission: 0,
    clearcoat: 0.6,
    emissive: '#10b981',
    emissiveIntensity: 0.15,
    macroInfo: {
      applications: [
        'Lớp phủ chống dính bề mặt lòng chảo chiên xào gia đình, chiên trứng không cần dầu',
        'Ống dẫn hóa chất và van chịu axit đặc ăn mòn trong công nghiệp dược phẩm',
        'Màng lọc vải thở chống thấm nước Gore-Tex cho áo khoác leo núi ngoài trời',
      ],
      mechanicalStrength: 'Dẻo dai, hệ số ma sát trượt thấp kỷ lục (0.04 - chỉ sau băng đá ướt)',
      thermalConductivity: '0.25 W/(m·K)',
      electricalConductivity: '10⁻¹⁶ S/m (Chất cách điện siêu đẳng, không thấm nước)',
      density: '2.20 g/cm³',
    },
    metrics: {
      hardness: 20,
      thermal: 30,
      electrical: 5,
      density: 22,
      corrosion: 100,
    },
    molecularInfo: {
      latticeType: 'Mạng chuỗi xoắn polyme mạch thẳng (Helical Polymer Chain)',
      bondLength: 'C–C: 1.54 Å; C–F: 1.35 Å (Liên kết bền nhất trong hóa học hữu cơ)',
      bondAngle: 'C–C–C: 112.0°; F–C–F: 108.0°',
      crystalSystem: 'Tam phương / Bán tinh thể (Trigonal)',
      atomTypes: [
        { element: 'C', color: '#64748b', radius: 0.32 },
        { element: 'F', color: '#38bdf8', radius: 0.28 },
      ],
      bonds: {
        type: 'Cộng hóa trị phân cực cực bền C-F bao bọc ngoài trục carbon',
        color: '#a7f3d0',
        hybridization: 'Lai hóa sp³ mạch thẳng xoắn ốc',
        coordinationGeometry: 'Trục Carbon bọc kín bởi các nguyên tử Flo bán kính nhỏ',
        bondEnergy: '485 kJ/mol (Cực kỳ khó bị bẻ gãy)',
        interlayerForce: 'Lực hút giữa các chuỗi polyme gần như bằng 0, không dính thứ gì',
        descriptionVi:
          'Teflon gồm một xương sống các nguyên tử Carbon liên kết với nhau, và mỗi Carbon được gắn với hai nguyên tử Flo. Vì nguyên tử Flo có độ âm điện cực cao và bán kính nhỏ gọn, chúng xếp kín xung quanh trục carbon tạo thành một "áo giáp điện tử âm tính" đồng nhất. Lớp áo này đẩy lùi mọi phân tử thức ăn, dầu mỡ và nước, khiến thức ăn không bao giờ dính chặt vào đáy chảo.',
      },
    },
    structure: {
      type: 'teflon',
      latticeConstant: 5.6,
      repeatX: 2,
      repeatY: 2,
      repeatZ: 2,
    },
    geometry: 'teflon-pan',
  };

export default teflonMaterial;
