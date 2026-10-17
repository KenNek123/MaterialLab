'use client';

import React, { useMemo } from 'react';
import { useStore, StoreState } from '@/store/useStore';
import { Ruler } from 'lucide-react';

export default function ScaleRuler() {
  const activeLayer = useStore((s: StoreState) => s.activeLayer);
  const zoomProgress = useStore((s: StoreState) => s.zoomProgress);

  // Calculate real-world physical scale estimate
  const scaleInfo = useMemo(() => {
    if (activeLayer === 'macro') {
      // 10 to 18 units: ~50 mm to ~10 mm
      const mm = Math.round(10 + (1 - zoomProgress) * 40);
      return {
        label: `${mm} mm`,
        subtext: 'Thang đo Đời sống (Vĩ mô)',
        barWidth: '72px',
        unit: 'mm',
      };
    } else if (activeLayer === 'micro') {
      // ~5000 nm to ~200 nm
      const nm = Math.round(200 + (1 - (zoomProgress - 0.45) / 0.4) * 4800);
      return {
        label: nm >= 1000 ? `${(nm / 1000).toFixed(1)} µm` : `${nm} nm`,
        subtext: 'Ô mạng Tinh thể (Vi mô)',
        barWidth: '60px',
        unit: 'µm / nm',
      };
    } else {
      // Molecular / Nano: Angstrom / Sub-nanometer
      const angstrom = (1.5 + (1 - zoomProgress) * 5.0).toFixed(1);
      const nm = (parseFloat(angstrom) / 10).toFixed(2);
      return {
        label: `${angstrom} Å (${nm} nm)`,
        subtext: 'Bán kính & Liên kết Nguyên tử (Nano)',
        barWidth: '50px',
        unit: 'Å',
      };
    }
  }, [activeLayer, zoomProgress]);

  return (
    <div className="fixed bottom-3.5 sm:bottom-5 left-12 sm:left-14 z-30 pointer-events-auto select-none">
      {/* Sleek Duolingo Physical Scale Badge */}
      <div className="duo-card px-3.5 py-2 sm:py-2.5 flex items-center gap-3 shadow-xl">
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <Ruler size={14} className="text-[#1cb0f6] shrink-0" />
            <span className="text-xs sm:text-sm font-mono font-extrabold text-[#1cb0f6] leading-none">
              {scaleInfo.label}
            </span>
          </div>
          <span className="text-[10px] text-white/50 font-bold mt-0.5 leading-none">
            {scaleInfo.subtext}
          </span>
        </div>

        {/* Graphical Chunky Ruler Bar with Center Calibration Tick */}
        <div className="flex flex-col items-center pl-2 border-l border-white/10 shrink-0">
          <div
            className="h-2.5 duo-progress-track relative border border-[#2b4452]"
            style={{ width: scaleInfo.barWidth }}
          >
            <div
              className="h-full duo-progress-fill bg-gradient-to-r from-[#1cb0f6] to-[#58cc02]"
              style={{ width: '100%' }}
            />
            <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-0.5 h-3.5 bg-white shadow-sm" />
          </div>
        </div>
      </div>
    </div>
  );

}
