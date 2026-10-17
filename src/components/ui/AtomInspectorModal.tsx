'use client';

import React, { useEffect } from 'react';
import { useStore, StoreState } from '@/store/useStore';
import { X, MousePointer2, Orbit, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AtomInspectorModal() {
  const inspectedAtom = useStore((s: StoreState) => s.inspectedAtom);
  const setInspectedAtom = useStore((s: StoreState) => s.setInspectedAtom);
  const selectedMaterial = useStore((s: StoreState) => s.selectedMaterial);

  // Close modal immediately if material changes
  useEffect(() => {
    setInspectedAtom(null);
  }, [selectedMaterial, setInspectedAtom]);

  if (!inspectedAtom) return null;

  return (
    <AnimatePresence>
      <button
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setInspectedAtom(null)}
        aria-label="Đóng bảng nguyên tử"
        type="button"
      />
      <aside className="fixed bottom-6 right-6 z-50 w-full max-w-sm sm:max-w-md pointer-events-auto" aria-label="Hồ sơ nguyên tử">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: 'spring', damping: 24, stiffness: 320 }}
          className="relative rounded-2xl border-2 border-cyan-400/50 bg-slate-950/95 p-5 shadow-2xl shadow-cyan-950/50 overflow-hidden space-y-4"
        >
          {/* Top highlight line */}
          <div
            className="absolute top-0 left-0 right-0 h-1 shadow-sm"
            style={{
              background: `linear-gradient(90deg, ${inspectedAtom.color}, #38bdf8, #a855f7)`,
            }}
          />

          {/* Header with Periodic Tile */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-3.5">
              <div
                className="w-12 h-12 rounded-xl flex flex-col items-center justify-center font-mono border-2 shadow-lg"
                style={{
                  backgroundColor: `${inspectedAtom.color}20`,
                  borderColor: inspectedAtom.color,
                  boxShadow: `0 0 16px ${inspectedAtom.color}40`,
                }}
              >
                <span className="text-[10px] font-bold opacity-80 leading-none">
                  {inspectedAtom.atomicNumber}
                </span>
                <span
                  className="text-xl font-black leading-tight"
                  style={{ color: inspectedAtom.color }}
                >
                  {inspectedAtom.element}
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black text-white tracking-wide">
                    {inspectedAtom.nameVi}
                  </h3>
                  <span className="text-xs text-slate-400 font-mono font-bold">
                    ({inspectedAtom.nameEn})
                  </span>
                </div>
                <span className="text-[11px] text-cyan-300 font-bold uppercase tracking-wider block mt-0.5">
                  {inspectedAtom.categoryVi}
                </span>
              </div>
            </div>

            <button
              onClick={() => setInspectedAtom(null)}
              className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-400 hover:text-white transition-colors"
              title="Đóng bảng soi nguyên tử"
              type="button"
            >
              <X size={16} />
            </button>
          </div>

          {/* Atom Specs Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col">
              <span className="text-[10px] uppercase font-mono text-slate-400 font-bold">
                Khối lượng nguyên tử
              </span>
              <span className="font-mono font-black text-cyan-300 text-sm mt-0.5">
                {inspectedAtom.atomicMass}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col">
              <span className="text-[10px] uppercase font-mono text-slate-400 font-bold">
                Bán kính nguyên tử
              </span>
              <span className="font-mono font-black text-emerald-300 text-sm mt-0.5">
                {inspectedAtom.atomicRadiusPm} pm
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col">
              <span className="text-[10px] uppercase font-mono text-slate-400 font-bold">
                Cấu hình electron
              </span>
              <span className="font-mono font-bold text-fuchsia-300 text-xs mt-0.5 truncate">
                {inspectedAtom.electronConfig}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col">
              <span className="text-[10px] uppercase font-mono text-slate-400 font-bold">
                Độ âm điện (Pauling)
              </span>
              <span className="font-mono font-black text-amber-300 text-sm mt-0.5">
                {inspectedAtom.electronegativity || 'N/A'}
              </span>
            </div>
          </div>

          {/* Coordination & Bond Details */}
          <div className="p-3 rounded-xl bg-slate-900/70 border border-cyan-500/20 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-300">
                <Orbit size={15} className="text-cyan-400" />
                Hình học phối trí:
              </span>
              <strong className="text-white font-bold">{inspectedAtom.coordination}</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-300">
                <ShieldCheck size={15} className="text-emerald-400" />
                Bản chất liên kết:
              </span>
              <strong className="text-emerald-200 font-bold">{inspectedAtom.bondType}</strong>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/40 p-3 rounded-xl border border-slate-800">
            {inspectedAtom.descriptionVi}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <MousePointer2 size={13} className="text-cyan-400" />
              Chạm nguyên tử khác để đổi tiêu điểm
            </span>
            <span className="font-mono font-bold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
              #{inspectedAtom.element}-{inspectedAtom.index + 1}
            </span>
          </div>
        </motion.div>
      </aside>
    </AnimatePresence>
  );
}
