'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useStore, StoreState } from '@/store/useStore';
import { MATERIALS, MATERIAL_MAP } from '@/data/materials';
import {
  Info,
  ChevronLeft,
  ChevronRight,
  Shield,
  Thermometer,
  Zap,
} from 'lucide-react';
import { sound } from '@/lib/soundFx';
import MaterialBadge from '@/components/ui/MaterialBadge';

export default function InfoPanel() {
  const selectedMaterial = useStore((s: StoreState) => s.selectedMaterial);
  const setSelectedMaterial = useStore((s: StoreState) => s.setSelectedMaterial);
  const setIsDetailOpen = useStore((s: StoreState) => s.setIsDetailOpen);
  const isDual3DView = useStore((s: StoreState) => s.isDual3DView);
  const compareMaterialA = useStore((s: StoreState) => s.compareMaterialA);
  const compareMaterialB = useStore((s: StoreState) => s.compareMaterialB);
  const swapCompareMaterials = useStore((s: StoreState) => s.swapCompareMaterials);

  const material = MATERIAL_MAP.get(selectedMaterial);
  const matA = MATERIAL_MAP.get(compareMaterialA);
  const matB = MATERIAL_MAP.get(compareMaterialB);

  const currentIndex = MATERIALS.findIndex((m) => m.id === selectedMaterial);
  const prevMaterial = MATERIALS[(currentIndex - 1 + MATERIALS.length) % MATERIALS.length];
  const nextMaterial = MATERIALS[(currentIndex + 1) % MATERIALS.length];

  if (!material) return null;

  return (
    <motion.div
      initial={{ x: -30, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-3.5 sm:top-5 left-3 sm:left-5 z-30 w-[calc(100vw-1.5rem)] sm:w-[430px] md:w-[460px] select-none pointer-events-auto"
    >
      <div className="duo-card p-4 sm:p-5 flex flex-col gap-3 relative overflow-hidden shadow-2xl">
        {isDual3DView && matA && matB && (
          <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-blue-500/15 border border-blue-400/30 text-xs text-blue-200">
            <span className="font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              So sánh: {matA.nameVi} vs {matB.nameVi}
            </span>
            <button
              onClick={swapCompareMaterials}
              className="text-blue-300 hover:text-white underline font-mono text-[10px] font-bold"
              title="Đổi vị trí 2 vật liệu"
              type="button"
            >
              Hoán đổi
            </button>
          </div>
        )}

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <MaterialBadge material={material} size="lg" showSub />
            <div className="min-w-0">
              <span className="text-[11px] font-bold text-sky-400 uppercase tracking-wider block">
                {material.categoryLabel}
              </span>
              <h1 className="text-base sm:text-xl font-extrabold text-white tracking-tight truncate">
                {material.nameVi}
              </h1>
              <p className="text-xs text-slate-400 font-mono font-medium truncate">
                {material.formula} · {material.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => {
                sound.playClick();
                setSelectedMaterial(prevMaterial.id);
              }}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700"
              title="Vật liệu trước"
              type="button"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setSelectedMaterial(nextMaterial.id);
              }}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700"
              title="Vật liệu tiếp theo"
              type="button"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Quick specs overview */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
          <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
            <Shield size={14} className="mx-auto text-blue-400 mb-1" />
            <span className="text-[10px] text-slate-400 block">Độ bền</span>
            <strong className="text-white text-xs">{material.metrics.hardness}/100</strong>
          </div>
          <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
            <Thermometer size={14} className="mx-auto text-amber-400 mb-1" />
            <span className="text-[10px] text-slate-400 block">Dẫn nhiệt</span>
            <strong className="text-white text-xs">{material.metrics.thermal}/100</strong>
          </div>
          <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
            <Zap size={14} className="mx-auto text-cyan-400 mb-1" />
            <span className="text-[10px] text-slate-400 block">Dẫn điện</span>
            <strong className="text-white text-xs">{material.metrics.electrical}/100</strong>
          </div>
        </div>

        {/* Single clean Action Button */}
        <button
          onClick={() => {
            sound.playClick();
            setIsDetailOpen(true);
          }}
          className="w-full py-2.5 px-4 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-sky-500/20"
          type="button"
        >
          <Info size={15} />
          <span>Hồ sơ chi tiết vật liệu</span>
        </button>
      </div>
    </motion.div>
  );
}
