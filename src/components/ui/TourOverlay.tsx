'use client';

import React, { useEffect } from 'react';
import { useStore, StoreState } from '@/store/useStore';
import { MATERIAL_MAP } from '@/data/materials';
import { Square, Film } from 'lucide-react';
import { sound } from '@/lib/soundFx';

export default function TourOverlay() {
  const isTourActive = useStore((s: StoreState) => s.isTourActive);
  const setIsTourActive = useStore((s: StoreState) => s.setIsTourActive);
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

  if (!isTourActive || !material) return null;

  return (
    <div className="fixed top-[max(64px,calc(env(safe-area-inset-top)+56px))] sm:top-20 left-1/2 -translate-x-1/2 z-40 max-w-xl w-[calc(100vw-1.25rem)] sm:w-[calc(100vw-2rem)] animate-in fade-in slide-in-from-top-3 duration-300 pointer-events-auto select-none">
      <div className="duo-card p-3 sm:p-5 flex flex-col gap-2.5 sm:gap-3 shadow-2xl">
        {/* Header row */}
        <div className="flex items-center justify-between gap-2 sm:gap-3">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-[#ce82ff] border-2 border-b-4 border-[#a855f7] flex items-center justify-center shadow-lg shrink-0">
              <Film size={16} className="text-white animate-pulse" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-[11px] sm:text-sm font-extrabold text-[#ce82ff] tracking-wide uppercase truncate">
                  <span className="hidden sm:inline">TRÌNH DIỄN ĐA TẦNG CINEMATIC</span>
                  <span className="sm:hidden">TRÌNH CHIẾU ĐA TẦNG</span>
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#58cc02] animate-ping shrink-0" />
              </div>
              <span className="text-[10px] sm:text-xs text-white/60 block font-bold truncate">
                {material.nameVi} ({material.formula})
              </span>
            </div>
          </div>

          {/* Stop Button */}
          <button
            onClick={() => {
              sound.playClick();
              setIsTourActive(false);
            }}
            className="px-2.5 sm:px-3.5 py-1.5 rounded-xl bg-[#ff4b4b] border-2 border-[#ff4b4b] border-b-4 border-[#ea2b2b] text-white text-[11px] sm:text-xs font-extrabold flex items-center gap-1 sm:gap-1.5 transition-all active:translate-y-0.5 active:border-b-2 shadow-md shrink-0"
            title="Dừng trình diễn tự động (ESC)"
          >
            <Square size={11} className="fill-white text-white" />
            <span>Dừng</span>
          </button>
        </div>

        {/* Phase Flow Indicator (Chunky 3D Badges) */}
        <div className="grid grid-cols-3 gap-1.5 sm:gap-2 text-center text-[10px] sm:text-xs">
          <div
            className={`py-1.5 sm:py-2 px-1 rounded-xl border-2 border-b-3 transition-all font-extrabold truncate ${
              tourPhase === 'macro'
                ? 'bg-[#1cb0f6] border-[#1cb0f6] border-b-[#1899d6] text-white shadow-md'
                : 'bg-[#14232a] border-[#253945] border-b-[#19262e] text-white/40'
            }`}
          >
            <span className="hidden sm:inline">1. Vĩ mô (Macro)</span>
            <span className="sm:hidden">1. Vĩ mô</span>
          </div>

          <div
            className={`py-1.5 sm:py-2 px-1 rounded-xl border-2 border-b-3 transition-all font-extrabold truncate ${
              tourPhase === 'micro'
                ? 'bg-[#ce82ff] border-[#ce82ff] border-b-[#a855f7] text-white shadow-md'
                : 'bg-[#14232a] border-[#253945] border-b-[#19262e] text-white/40'
            }`}
          >
            <span className="hidden sm:inline">2. Tinh thể (Micro)</span>
            <span className="sm:hidden">2. Ô mạng</span>
          </div>

          <div
            className={`py-1.5 sm:py-2 px-1 rounded-xl border-2 border-b-3 transition-all font-extrabold truncate ${
              tourPhase === 'molecular'
                ? 'bg-[#58cc02] border-[#58cc02] border-b-[#46a302] text-white shadow-md'
                : 'bg-[#14232a] border-[#253945] border-b-[#19262e] text-white/40'
            }`}
          >
            <span className="hidden sm:inline">3. Phân tử (Nano)</span>
            <span className="sm:hidden">3. Nguyên tử</span>
          </div>
        </div>

        {/* Chunky Duolingo Progress Bar */}
        <div className="w-full duo-progress-track h-3 sm:h-3.5 border border-[#2b4452]">
          <div
            className="duo-progress-fill bg-gradient-to-r from-[#1cb0f6] via-[#ce82ff] to-[#58cc02] transition-all duration-150"
            style={{ width: `${Math.round(tourProgress * 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}

