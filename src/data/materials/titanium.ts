import { MaterialData } from '@/store/useStore';

// ── 10. Titan Y Tế & Hàng Không (Ti) ────────────────────────────────────────
export const titaniumMaterial: MaterialData = {
    id: 'titanium',
    name: 'Medical Titanium',
    nameVi: 'Titan Y Tế & Hàng Không (Ti)',
    formula: 'Ti',
    category: 'metal',
    categoryLabel: 'Kim loại & Hợp kim',
    objectName: 'Prosthetic Joint & iPhone Frame',
    objectNameVi: 'Khớp Xương Nhân Tạo & Khung iPhone',
    icon: '🦾',
    color: '#94a3b8',
    roughness: 0.28,
    metalness: 0.92,
    transmission: 0,
    clearcoat: 0.9,
    emissive: '#06b6d4',
    emissiveIntensity: 0.18,
    macroInfo: {
      applications: [
        'Cấy ghép y tế vĩnh viễn: trụ răng Implant, khớp háng nhân tạo, nẹp vít xương',
        'Khung viền điện thoại thông minh cao cấp iPhone 15/16 Pro siêu nhẹ và chống trầy',
        'Động cơ phản lực máy bay chiến đấu và tàu ngầm lặn sâu dưới đáy đại dương',
      ],
      mechanicalStrength: 'Tỉ số sức bền trên trọng lượng cao nhất trong mọi kim loại kết cấu',
      thermalConductivity: '22 W/(m·K)',
      electricalConductivity: '2.4 × 10⁶ S/m (Trơ hóa học hoàn toàn trong cơ thể người)',
      density: '4.50 g/cm³',
    },
    metrics: {
      hardness: 82,
      thermal: 40,
      electrical: 50,
      density: 45,
      corrosion: 99,
    },
    molecularInfo: {
      latticeType: 'Mạng lục giác xếp chặt (HCP - Hexagonal Close-Packed)',
      bondLength: 'Ti–Ti: 2.89 Å',
      bondAngle: '120.0° trong mặt phẳng đáy',
      crystalSystem: 'Lục giác (Hexagonal P6₃/mmc)',
      atomTypes: [{ element: 'Ti', color: '#94a3b8', radius: 0.38 }],
      bonds: {
        type: 'Liên kết kim loại chuyển tiếp dải 3d² 4s²',
        color: '#cbd5e1',
        hybridization: 'Lai hóa electron kim loại chuyển tiếp',
        coordinationGeometry: 'Phối trí lục giác xếp chặt 12 nguyên tử (CN=12)',
        bondEnergy: '470 kJ/mol (Rất bền nhiệt nóng chảy tới 1668°C)',
        interlayerForce: 'Màng oxit TiO₂ sinh học tự liền bảo vệ bề mặt',
        descriptionVi:
          'Titan ở nhiệt độ phòng có cấu trúc mạng lục giác xếp chặt HCP. Điểm kỳ diệu nhất của Titan là tính tương thích sinh học (Osseointegration): xương người có thể tự phát triển và bám chặt vào bề mặt kim loại Titan mà không gây phản ứng đào thải hay dị ứng. Lớp màng mỏng TiO₂ tự nhiên ngăn chặn hoàn toàn sự ăn mòn bởi dịch tế bào.',
      },
    },
    structure: {
      type: 'hcp',
      latticeConstant: 2.95,
      repeatX: 2,
      repeatY: 2,
      repeatZ: 2,
    },
    geometry: 'titanium-implant',
  };

export default titaniumMaterial;
