'use client';

import React, { useEffect, useCallback } from 'react';
import { useStore, StoreState } from '@/store/useStore';
import { MATERIAL_MAP } from '@/data/materials';
import { Pause, Play, X, Film } from 'lucide-react';
import { sound } from '@/lib/soundFx';

export default function TourOverlay() {
  const isTourActive = useStore((s: StoreState) => s.isTourActive);
  const setIsTourActive = useStore((s: StoreState) => s.setIsTourActive);
  const isTourPaused = useStore((s: StoreState) => s.isTourPaused);
  const toggleTourPause = useStore((s: StoreState) => s.toggleTourPause);
  const tourPhase = useStore((s: StoreState) => s.tourPhase);
  const tourProgress = useStore((s: StoreState) => s.tourProgress);
  const selectedMaterial = useStore((s: StoreState) => s.selectedMaterial);

  const material = MATERIAL_MAP.get(selectedMaterial);

  // Press ESC to immediately stop tour
  useEffect(() => {
    if (!isTourActive) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        sound.playClick();
        setIsTourActive(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTourActive, setIsTourActive]);

  const handlePhaseClick = useCallback((phase: 'macro' | 'micro' | 'molecular') => {
    sound.playClick();
    window.dispatchEvent(
      new CustomEvent('material-tour-seek', {
        detail: { phase },
      })
    );
  }, []);

  const handleProgressClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const progress = Math.max(0, Math.min(1, clickX / rect.width));
    sound.playClick();
    window.dispatchEvent(
      new CustomEvent('material-tour-seek', {
        detail: { progress },
      })
    );
  }, []);

  if (!isTourActive || !material) return null;

  return (
    <aside
      className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 w-[min(94%,660px)] animate-in fade-in slide-in-from-bottom-3 duration-300 pointer-events-auto select-none"
      aria-label="Thanh điều khiển trình chiếu đa tầng"
    >
      <div className="duo-card p-2 sm:px-4 sm:py-2.5 flex flex-col gap-2 sm:gap-2.5 shadow-2xl border border-white/20 bg-[#0f172a]/95 backdrop-blur-xl rounded-2xl">
        {/* Row 1: Play/Pause button + 3 Phase buttons + Close button (+ Material info on desktop) */}
        <div className="flex items-center gap-2 sm:gap-2.5 justify-between">
          {/* Nút Tạm dừng / Tiếp tục */}
          <button
            onClick={() => {
              sound.playClick();
              toggleTourPause();
            }}
            className={`px-3 py-1.5 sm:px-3.5 sm:py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-md cursor-pointer shrink-0 whitespace-nowrap active:scale-95 ${
              isTourPaused
                ? 'bg-emerald-500 hover:bg-emerald-600 text-white border border-emerald-400'
                : 'bg-amber-500 hover:bg-amber-600 text-white border border-amber-400'
            }`}
            title={
              isTourPaused
                ? 'Tiếp tục trình chiếu (Camera tiếp tục chuyển động)'
                : 'Tạm dừng để tự do xoay ngắm 3D'
            }
            type="button"
          >
            {isTourPaused ? (
              <>
                <Play size={13} className="fill-white text-white" />
                <span>Tiếp tục</span>
              </>
            ) : (
              <>
                <Pause size={13} className="fill-white text-white" />
                <span>Tạm dừng</span>
              </>
            )}
          </button>

          {/* Phase Switcher (1. Vĩ mô · 2. Ô mạng · 3. Nguyên tử) */}
          <div className="flex items-center gap-1 sm:gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-700/70 shrink-0">
            <button
              type="button"
              onClick={() => handlePhaseClick('macro')}
              className={`px-2.5 sm:px-3 py-1 rounded-lg text-[11px] sm:text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap ${
                tourPhase === 'macro'
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
              title="Chuyển đến Cấp độ 1: Vĩ mô (Macro)"
            >
              1. Vĩ mô
            </button>

            <button
              type="button"
              onClick={() => handlePhaseClick('micro')}
              className={`px-2.5 sm:px-3 py-1 rounded-lg text-[11px] sm:text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap ${
                tourPhase === 'micro'
                  ? 'bg-purple-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
              title="Chuyển đến Cấp độ 2: Ô mạng cơ sở (Micro)"
            >
              2. Ô mạng
            </button>

            <button
              type="button"
              onClick={() => handlePhaseClick('molecular')}
              className={`px-2.5 sm:px-3 py-1 rounded-lg text-[11px] sm:text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap ${
                tourPhase === 'molecular'
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
              title="Chuyển đến Cấp độ 3: Cấp độ nguyên tử (Nano)"
            >
              3. Nguyên tử
            </button>
          </div>

          {/* Material Name badge (Chỉ hiển thị trên tablet/desktop, tránh chiếm chỗ trên điện thoại) */}
          <div className="hidden md:flex items-center gap-1.5 border-l border-white/15 pl-2.5 shrink-0 whitespace-nowrap">
            <span className="text-xs select-none shrink-0">{material.icon}</span>
            <span className="text-xs font-bold text-white/90 whitespace-nowrap">
              {material.nameVi}
            </span>
            <span className="font-mono text-[10px] text-sky-400 font-semibold bg-sky-950/60 px-1 py-0.2 rounded border border-sky-800/50 hidden lg:inline-block shrink-0">
              {material.formula}
            </span>
          </div>

          {/* Nút Thoát / Dừng trình chiếu */}
          <button
            onClick={() => {
              sound.playClick();
              setIsTourActive(false);
            }}
            className="p-1.5 sm:p-2 rounded-xl bg-rose-500/15 hover:bg-rose-600 border border-rose-500/30 hover:border-rose-500 text-rose-300 hover:text-white transition-all cursor-pointer shrink-0 ml-0.5 active:scale-95"
            title="Dừng trình chiếu (ESC)"
            type="button"
            aria-label="Dừng trình chiếu"
          >
            <X size={16} strokeWidth={2.4} />
          </button>
        </div>

        {/* Row 2: Thanh tiến trình Interactive Scrubber */}
        <div
          className="w-full h-2 sm:h-2.5 rounded-full bg-slate-800 border border-slate-700/60 overflow-hidden relative cursor-pointer group shadow-inner"
          onClick={handleProgressClick}
          title="Nhấp vào thanh tiến trình để tua nhanh trình chiếu"
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-sky-400 via-purple-400 to-emerald-400 transition-[width] duration-150 relative"
            style={{ width: `${Math.max(2, Math.min(100, Math.round(tourProgress * 100)))}%` }}
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse" />
          </div>
        </div>
      </div>
    </aside>
  );
}
