'use client';

import React, { useEffect } from 'react';
import { useStore, StoreState } from '@/store/useStore';
import { X, MousePointer2, Orbit, ShieldCheck, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { sound } from '@/lib/soundFx';

export default function AtomInspectorModal() {
  const inspectedAtom = useStore((s: StoreState) => s.inspectedAtom);
  const setInspectedAtom = useStore((s: StoreState) => s.setInspectedAtom);
  const selectedMaterial = useStore((s: StoreState) => s.selectedMaterial);

  // Close modal immediately if material changes
  useEffect(() => {
    setInspectedAtom(null);
  }, [selectedMaterial, setInspectedAtom]);

  if (!inspectedAtom) return null;

  const handleClose = () => {
    sound.playClick();
    setInspectedAtom(null);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 pointer-events-none">
        {/* Backdrop - subtle blur & dim so user can still see 3D molecular lattice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs cursor-default pointer-events-auto"
          aria-label="Đóng bảng soi nguyên tử"
        />

        {/* Centered Modal Card */}
        <motion.aside
          initial={{ opacity: 0, scale: 0.92, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 16 }}
          transition={{ type: 'spring', damping: 25, stiffness: 340 }}
          className="relative z-10 w-[min(92vw,420px)] max-h-[86vh] pointer-events-auto flex flex-col rounded-2xl sm:rounded-3xl border-2 border-blue-200/90 bg-white/95 backdrop-blur-xl p-4 sm:p-5 shadow-2xl shadow-blue-950/30 overflow-y-auto space-y-3.5 custom-scrollbar"
          role="dialog"
          aria-modal="true"
          aria-label="Hồ sơ nguyên tử"
        >
          {/* Top Candy Gradient Line */}
          <div
            className="absolute top-0 left-0 right-0 h-1.5 shadow-xs"
            style={{
              background: `linear-gradient(90deg, ${inspectedAtom.color}, #38bdf8, #6366f1)`,
            }}
          />

          {/* Header with Periodic Element Tile */}
          <div className="flex items-start justify-between pb-3.5 border-b border-slate-100 gap-3">
            <div className="flex items-center gap-3.5 min-w-0">
              <div
                className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl flex flex-col items-center justify-center font-mono border-2 shadow-md shrink-0 relative overflow-hidden"
                style={{
                  backgroundColor: `${inspectedAtom.color}15`,
                  borderColor: inspectedAtom.color,
                  boxShadow: `0 4px 16px ${inspectedAtom.color}35`,
                }}
              >
                <span className="text-[10px] font-extrabold text-slate-500 leading-none">
                  {inspectedAtom.atomicNumber}
                </span>
                <span
                  className="text-2xl font-black leading-tight tracking-tight"
                  style={{ color: inspectedAtom.color }}
                >
                  {inspectedAtom.element}
                </span>
              </div>

              <div className="min-w-0">
                <div className="flex items-baseline gap-1.5 flex-wrap">
                  <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-snug">
                    {inspectedAtom.nameVi}
                  </h3>
                  <span className="text-xs font-mono font-bold text-slate-400">
                    ({inspectedAtom.nameEn})
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 inline-block mt-1">
                  {inspectedAtom.categoryVi}
                </span>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-400 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer shrink-0 shadow-xs"
              title="Đóng bảng soi nguyên tử"
              type="button"
            >
              <X size={16} />
            </button>
          </div>

          {/* 4 Quantitative Atomic Specs Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-2xl bg-slate-50/90 border border-slate-200/80 flex flex-col">
              <span className="text-[9px] uppercase font-mono text-slate-400 font-bold tracking-wider">
                Khối lượng nguyên tử
              </span>
              <span className="font-mono font-black text-blue-700 text-sm mt-0.5">
                {inspectedAtom.atomicMass}
              </span>
            </div>

            <div className="p-2.5 rounded-2xl bg-slate-50/90 border border-slate-200/80 flex flex-col">
              <span className="text-[9px] uppercase font-mono text-slate-400 font-bold tracking-wider">
                Bán kính nguyên tử
              </span>
              <span className="font-mono font-black text-emerald-700 text-sm mt-0.5">
                {inspectedAtom.atomicRadiusPm} pm
              </span>
            </div>

            <div className="p-2.5 rounded-2xl bg-slate-50/90 border border-slate-200/80 flex flex-col">
              <span className="text-[9px] uppercase font-mono text-slate-400 font-bold tracking-wider">
                Cấu hình electron
              </span>
              <span className="font-mono font-bold text-indigo-700 text-xs mt-0.5 break-words leading-tight">
                {inspectedAtom.electronConfig}
              </span>
            </div>

            <div className="p-2.5 rounded-2xl bg-slate-50/90 border border-slate-200/80 flex flex-col">
              <span className="text-[9px] uppercase font-mono text-slate-400 font-bold tracking-wider">
                Độ âm điện (Pauling)
              </span>
              <span className="font-mono font-black text-amber-700 text-sm mt-0.5">
                {inspectedAtom.electronegativity || 'N/A'}
              </span>
            </div>
          </div>

          {/* Coordination Geometry & Core Bond Nature */}
          <div className="p-3 rounded-2xl bg-blue-50/70 border border-blue-200/80 space-y-2 text-xs">
            <div className="flex items-start justify-between gap-2">
              <span className="flex items-center gap-1.5 text-slate-600 font-medium shrink-0 mt-0.5">
                <Orbit size={15} className="text-blue-600 shrink-0" />
                <span>Hình học phối trí:</span>
              </span>
              <strong className="text-slate-900 font-bold text-right leading-snug break-words">
                {inspectedAtom.coordination}
              </strong>
            </div>

            <div className="flex items-start justify-between gap-2 pt-1 border-t border-blue-200/40">
              <span className="flex items-center gap-1.5 text-slate-600 font-medium shrink-0 mt-0.5">
                <ShieldCheck size={15} className="text-emerald-600 shrink-0" />
                <span>Bản chất liên kết:</span>
              </span>
              <strong className="text-blue-800 font-bold text-right leading-snug break-words">
                {inspectedAtom.bondType}
              </strong>
            </div>
          </div>

          {/* Scientific Description */}
          <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-200/80 break-words">
            {inspectedAtom.descriptionVi}
          </p>

          {/* Footer Interactive Hint */}
          <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500">
            <span className="flex items-center gap-1.5 font-medium">
              <MousePointer2 size={13} className="text-blue-600" />
              <span>Chạm nguyên tử khác để đổi tiêu điểm</span>
            </span>
            <span className="font-mono font-bold text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded-lg border border-blue-200 text-[10px]">
              #{inspectedAtom.element}-{inspectedAtom.index + 1}
            </span>
          </div>
        </motion.aside>
      </div>
    </AnimatePresence>
  );
}
