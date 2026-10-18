'use client';

import React, { useEffect, useCallback } from 'react';
import { useStore, StoreState } from '@/store/useStore';
import { MATERIAL_MAP } from '@/data/materials';
import { Pause, Play, Film, X } from 'lucide-react';
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
                <span
                  className={`w-2 h-2 rounded-full shrink-0 ${
                    isTourPaused ? 'bg-amber-400' : 'bg-[#58cc02] animate-ping'
                  }`}
                />
              </div>
              <span className="text-[10px] sm:text-xs text-white/70 block font-bold truncate">
                {isTourPaused ? (
                  <span className="text-amber-300 font-extrabold">
                    Đang tạm dừng · Bạn có thể tự do dùng chuột/tay xoay ngắm 3D
                  </span>
                ) : (
                  `${material.nameVi} (${material.formula})`
                )}
              </span>
            </div>
          </div>

          {/* Action cluster: Nút Tạm dừng / Tiếp tục & Nút Đóng */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              onClick={() => {
                sound.playClick();
                toggleTourPause();
              }}
              className={`px-3 sm:px-4 py-1.5 rounded-xl border-2 border-b-4 text-white text-[11px] sm:text-xs font-extrabold flex items-center gap-1.5 transition-all active:translate-y-0.5 active:border-b-2 shadow-md cursor-pointer ${
                isTourPaused
                  ? 'bg-[#58cc02] border-[#58cc02] border-b-[#46a302] hover:bg-[#46a302]'
                  : 'bg-[#ff9600] border-[#ff9600] border-b-[#e07b00] hover:bg-[#e07b00]'
              }`}
              title={
                isTourPaused
                  ? 'Tiếp tục trình chiếu (Camera bắt đầu lia & zoom tiếp)'
                  : 'Tạm dừng để tự do xoay quanh ngắm mô hình'
              }
              type="button"
            >
              {isTourPaused ? (
                <>
                  <Play size={12} className="fill-white text-white" />
                  <span>Tiếp tục</span>
                </>
              ) : (
                <>
                  <Pause size={12} className="fill-white text-white" />
                  <span>Tạm dừng</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                sound.playClick();
                setIsTourActive(false);
              }}
              className="p-1.5 sm:p-2 rounded-xl bg-slate-800/90 hover:bg-rose-600 border border-slate-700/80 hover:border-rose-600 text-slate-300 hover:text-white transition-all cursor-pointer"
              title="Dừng trình chiếu (ESC)"
              type="button"
              aria-label="Dừng trình chiếu"
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Phase Flow Indicator (Clickable Chunky 3D Badges) */}
        <div className="grid grid-cols-3 gap-1.5 sm:gap-2 text-center text-[10px] sm:text-xs">
          <button
            type="button"
            onClick={() => handlePhaseClick('macro')}
            className={`py-1.5 sm:py-2 px-1 rounded-xl border-2 border-b-3 transition-all font-extrabold truncate cursor-pointer ${
              tourPhase === 'macro'
                ? 'bg-[#1cb0f6] border-[#1cb0f6] border-b-[#1899d6] text-white shadow-md scale-102'
                : 'bg-[#14232a] hover:bg-[#1c303a] border-[#253945] border-b-[#19262e] text-white/50'
            }`}
            title="Chuyển đến Cấp độ 1: Vĩ mô"
          >
            <span className="hidden sm:inline">1. Vĩ mô (Macro)</span>
            <span className="sm:hidden">1. Vĩ mô</span>
          </button>

          <button
            type="button"
            onClick={() => handlePhaseClick('micro')}
            className={`py-1.5 sm:py-2 px-1 rounded-xl border-2 border-b-3 transition-all font-extrabold truncate cursor-pointer ${
              tourPhase === 'micro'
                ? 'bg-[#ce82ff] border-[#ce82ff] border-b-[#a855f7] text-white shadow-md scale-102'
                : 'bg-[#14232a] hover:bg-[#1c303a] border-[#253945] border-b-[#19262e] text-white/50'
            }`}
            title="Chuyển đến Cấp độ 2: Ô mạng cơ sở"
          >
            <span className="hidden sm:inline">2. Tinh thể (Micro)</span>
            <span className="sm:hidden">2. Ô mạng</span>
          </button>

          <button
            type="button"
            onClick={() => handlePhaseClick('molecular')}
            className={`py-1.5 sm:py-2 px-1 rounded-xl border-2 border-b-3 transition-all font-extrabold truncate cursor-pointer ${
              tourPhase === 'molecular'
                ? 'bg-[#58cc02] border-[#58cc02] border-b-[#46a302] text-white shadow-md scale-102'
                : 'bg-[#14232a] hover:bg-[#1c303a] border-[#253945] border-b-[#19262e] text-white/50'
            }`}
            title="Chuyển đến Cấp độ 3: Cấp độ nguyên tử"
          >
            <span className="hidden sm:inline">3. Phân tử (Nano)</span>
            <span className="sm:hidden">3. Nguyên tử</span>
          </button>
        </div>

        {/* Chunky Duolingo Progress Bar - Interactive & Always Visible */}
        <div
          className="w-full h-3 sm:h-3.5 rounded-full bg-[#14232a] border border-[#2b4452] overflow-hidden relative cursor-pointer shadow-inner group"
          onClick={handleProgressClick}
          title="Nhấp vào thanh tiến trình để tua nhanh thời gian trình chiếu"
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#1cb0f6] via-[#ce82ff] to-[#58cc02] transition-[width] duration-150 relative shadow-sm"
            style={{ width: `${Math.max(2, Math.min(100, Math.round(tourProgress * 100)))}%` }}
          >
            {/* Subtle animated highlight on progress fill */}
            <div className="absolute inset-0 bg-white/20 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
