'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore, StoreState } from '@/store/useStore';
import { MATERIALS, MATERIAL_MAP } from '@/data/materials';
import {
  X,
  ArrowRightLeft,
  Zap,
  Thermometer,
  Shield,
  Weight,
  Sparkles,
  Award,
  Layers,
  Eye,
} from 'lucide-react';
import { sound } from '@/lib/soundFx';

export default function CompareModal() {
  const isCompareOpen = useStore((s: StoreState) => s.isCompareOpen);
  const setIsCompareOpen = useStore((s: StoreState) => s.setIsCompareOpen);
  const compareMaterialA = useStore((s: StoreState) => s.compareMaterialA);
  const compareMaterialB = useStore((s: StoreState) => s.compareMaterialB);
  const setCompareMaterialA = useStore((s: StoreState) => s.setCompareMaterialA);
  const setCompareMaterialB = useStore((s: StoreState) => s.setCompareMaterialB);
  const swapCompareMaterials = useStore((s: StoreState) => s.swapCompareMaterials);
  const setSelectedMaterial = useStore((s: StoreState) => s.setSelectedMaterial);
  const isDual3DView = useStore((s: StoreState) => s.isDual3DView);
  const setIsDual3DView = useStore((s: StoreState) => s.setIsDual3DView);

  const matA = MATERIAL_MAP.get(compareMaterialA) || MATERIALS[0];
  const matB = MATERIAL_MAP.get(compareMaterialB) || MATERIALS[1];

  if (!isCompareOpen) return null;

  const metricsConfig = [
    {
      key: 'hardness' as const,
      label: 'Độ cứng & Bền cơ học',
      icon: Shield,
      valA: matA.metrics.hardness,
      valB: matB.metrics.hardness,
      textA: matA.macroInfo.mechanicalStrength,
      textB: matB.macroInfo.mechanicalStrength,
    },
    {
      key: 'thermal' as const,
      label: 'Độ dẫn nhiệt',
      icon: Thermometer,
      valA: matA.metrics.thermal,
      valB: matB.metrics.thermal,
      textA: matA.macroInfo.thermalConductivity,
      textB: matB.macroInfo.thermalConductivity,
    },
    {
      key: 'electrical' as const,
      label: 'Độ dẫn điện',
      icon: Zap,
      valA: matA.metrics.electrical,
      valB: matB.metrics.electrical,
      textA: matA.macroInfo.electricalConductivity,
      textB: matB.macroInfo.electricalConductivity,
    },
    {
      key: 'density' as const,
      label: 'Khối lượng riêng',
      icon: Weight,
      valA: matA.metrics.density,
      valB: matB.metrics.density,
      textA: matA.macroInfo.density,
      textB: matB.macroInfo.density,
    },
    {
      key: 'corrosion' as const,
      label: 'Chống ăn mòn & Ổn định hóa học',
      icon: Sparkles,
      valA: matA.metrics.corrosion,
      valB: matB.metrics.corrosion,
      textA: `${matA.metrics.corrosion}/100`,
      textB: `${matB.metrics.corrosion}/100`,
    },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-5 md:p-6 bg-black/75 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-5xl max-h-[92dvh] flex flex-col duo-card overflow-hidden shadow-2xl z-10"
        >
          {/* Top candy highlight line */}
          <div className="absolute top-0 left-8 right-8 h-1 bg-gradient-to-r from-[#1cb0f6] via-[#ce82ff] to-[#58cc02] rounded-full opacity-80" />

          {/* Header */}
          <div className="flex items-center justify-between px-3.5 sm:px-6 py-2.5 sm:py-4 border-b-2 border-slate-800/80 bg-slate-900/60 shrink-0">
            <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-[#1cb0f6]/15 border-2 border-b-4 border-[#1cb0f6]/40 text-[#1cb0f6] flex items-center justify-center shrink-0">
                <Layers size={20} />
              </div>
              <div className="min-w-0">
                <h2 className="text-sm sm:text-lg font-black text-white tracking-wide flex items-center gap-1.5 sm:gap-2 truncate">
                  So sánh Đa tầng
                  <span className="hidden sm:inline-block text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-xl bg-[#1cb0f6]/20 text-[#1cb0f6] border border-[#1cb0f6]/30">
                    Multi-Scale
                  </span>
                </h2>
                <p className="text-[10px] sm:text-xs text-white/50 truncate">
                  Phân tích cấu trúc mạng nguyên tử & cơ tính
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-3 shrink-0 ml-2">
              <button
                onClick={() => {
                  sound.playClick();
                  setIsDual3DView(!isDual3DView);
                }}
                className={`duo-btn-base flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-[11px] sm:text-xs font-extrabold uppercase tracking-wider ${
                  isDual3DView
                    ? 'duo-btn-blue text-white'
                    : 'bg-slate-800 hover:bg-slate-700 border-slate-700 border-b-slate-950 text-white/80'
                }`}
              >
                <Eye size={14} />
                <span className="hidden sm:inline">{isDual3DView ? 'Đang bật Xem Kép 3D' : 'Bật Xem Kép 3D'}</span>
                <span className="sm:hidden">{isDual3DView ? 'Kép: Bật' : 'Kép 3D'}</span>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  setIsCompareOpen(false);
                }}
                className="duo-btn-base p-1.5 sm:p-2.5 bg-slate-800 hover:bg-slate-700 border-slate-700 border-b-slate-950 text-white/80 hover:text-white rounded-xl sm:rounded-2xl transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Selector Bar - Responsive 3-Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-3 px-3.5 sm:px-6 py-2.5 sm:py-3.5 border-b-2 border-slate-800/80 bg-slate-950/70 shrink-0">
            {/* Material A Selector */}
            <div className="flex items-center gap-3 bg-slate-900/60 p-3 rounded-2xl border-2 border-b-4 border-slate-800/90 min-w-0">
              <span className="text-3xl shrink-0">{matA.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] uppercase font-mono tracking-widest text-[#1cb0f6] font-extrabold">
                  VẬT LIỆU A
                </div>
                <select
                  value={compareMaterialA}
                  onChange={(e) => {
                    sound.playClick();
                    setCompareMaterialA(e.target.value);
                  }}
                  className="w-full bg-transparent text-white font-bold text-xs sm:text-sm focus:outline-none cursor-pointer mt-0.5 truncate"
                >
                  {MATERIALS.map((m) => (
                    <option key={m.id} value={m.id} className="bg-slate-900 text-white">
                      {m.icon} {m.nameVi} ({m.formula})
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => {
                  sound.playClick();
                  setSelectedMaterial(matA.id);
                  setIsCompareOpen(false);
                }}
                className="duo-btn-base duo-btn-blue px-3 py-1.5 text-xs font-bold uppercase tracking-wider shrink-0"
                title="Xem trên 3D Canvas"
              >
                Xem 3D
              </button>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center shrink-0">
              <button
                onClick={() => {
                  sound.playClick();
                  swapCompareMaterials();
                }}
                className="duo-btn-base w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 border-slate-700 border-b-slate-950 text-white flex items-center justify-center shadow-lg"
                title="Đổi vị trí 2 vật liệu"
              >
                <ArrowRightLeft size={16} />
              </button>
            </div>

            {/* Material B Selector */}
            <div className="flex items-center gap-3 bg-slate-900/60 p-3 rounded-2xl border-2 border-b-4 border-slate-800/90 min-w-0">
              <span className="text-3xl shrink-0">{matB.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] uppercase font-mono tracking-widest text-[#ce82ff] font-extrabold">
                  VẬT LIỆU B
                </div>
                <select
                  value={compareMaterialB}
                  onChange={(e) => {
                    sound.playClick();
                    setCompareMaterialB(e.target.value);
                  }}
                  className="w-full bg-transparent text-white font-bold text-xs sm:text-sm focus:outline-none cursor-pointer mt-0.5 truncate"
                >
                  {MATERIALS.map((m) => (
                    <option key={m.id} value={m.id} className="bg-slate-900 text-white">
                      {m.icon} {m.nameVi} ({m.formula})
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => {
                  sound.playClick();
                  setSelectedMaterial(matB.id);
                  setIsCompareOpen(false);
                }}
                className="duo-btn-base duo-btn-purple px-3 py-1.5 text-xs font-bold uppercase tracking-wider shrink-0"
                title="Xem trên 3D Canvas"
              >
                Xem 3D
              </button>
            </div>
          </div>

          {/* Body Content - Scrollable with min-h-0 for proper flex shrinking */}
          <div className="flex-1 min-h-0 overflow-y-auto px-6 pt-6 pb-6 space-y-6 custom-scrollbar">
            {/* Section 1: Quantitative Metric Bars */}
            <div>
              <h3 className="text-xs font-mono uppercase tracking-wider text-white/50 mb-4 flex items-center gap-2 font-bold">
                <Award size={15} className="text-[#ffc800]" />
                Đối chiếu Các Chỉ số Hiệu năng Chuẩn hóa (0 - 100)
              </h3>

              <div className="space-y-4 bg-slate-900/60 p-4 sm:p-5 rounded-2xl border-2 border-b-4 border-slate-800/80">
                {metricsConfig.map((m) => {
                  const Icon = m.icon;
                  const isAWinner = m.valA > m.valB;
                  const isBWinner = m.valB > m.valA;

                  return (
                    <div key={m.key} className="space-y-2">
                      <div className="flex items-center justify-between text-xs sm:text-sm">
                        <div className="flex items-center gap-2 text-white font-bold">
                          <Icon size={15} className="text-white/60" />
                          <span>{m.label}</span>
                        </div>
                        <div className="flex items-center gap-4 font-mono text-xs">
                          <span
                            className={
                              isAWinner
                                ? 'text-[#1cb0f6] font-black'
                                : 'text-white/40 font-bold'
                            }
                          >
                            A: {m.valA}
                          </span>
                          <span className="text-white/20 font-bold">vs</span>
                          <span
                            className={
                              isBWinner
                                ? 'text-[#ce82ff] font-black'
                                : 'text-white/40 font-bold'
                            }
                          >
                            B: {m.valB}
                          </span>
                        </div>
                      </div>

                      {/* Opposing Comparison Bar */}
                      <div className="grid grid-cols-2 gap-2 h-4 sm:h-4.5 duo-progress-track p-0.5">
                        {/* A bar (fills right-to-left towards center) */}
                        <div className="flex justify-end">
                          <div
                            className="h-full rounded-full bg-gradient-to-l from-[#1cb0f6] to-[#00f2fe] duo-progress-fill transition-all duration-500"
                            style={{ width: `${m.valA}%` }}
                          />
                        </div>
                        {/* B bar (fills left-to-right from center) */}
                        <div className="flex justify-start">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[#ce82ff] to-[#ec4899] duo-progress-fill transition-all duration-500"
                            style={{ width: `${m.valB}%` }}
                          />
                        </div>
                      </div>

                      {/* Real-world values */}
                      <div className="flex justify-between text-[11px] text-white/50 px-1 font-mono">
                        <span className="truncate max-w-[48%] text-[#1cb0f6]/90 font-medium">
                          {m.textA}
                        </span>
                        <span className="truncate max-w-[48%] text-right text-[#ce82ff]/90 font-medium">
                          {m.textB}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Section 2: Crystallography & Molecular Grid */}
            <div>
              <h3 className="text-xs font-mono uppercase tracking-wider text-white/40 mb-3 flex items-center gap-2">
                <Layers size={14} className="text-cyan-400" />
                So sánh Cấu trúc Vi mô & Mạng Tinh thể Phân tử
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Material A Card */}
                <div className="p-4 rounded-2xl bg-gradient-to-b from-blue-950/20 to-black/40 border border-blue-500/20 space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-white/10">
                    <span className="text-xl">{matA.icon}</span>
                    <div>
                      <div className="text-sm font-semibold text-blue-300">
                        {matA.nameVi} ({matA.formula})
                      </div>
                      <div className="text-[11px] text-white/40 font-mono">
                        {matA.objectNameVi}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-white/[0.02] p-2 rounded-xl">
                      <div className="text-[10px] text-white/40 uppercase font-mono">
                        Kiểu mạng tinh thể
                      </div>
                      <div className="font-medium text-white/90 mt-0.5">
                        {matA.molecularInfo.latticeType}
                      </div>
                    </div>
                    <div className="bg-white/[0.02] p-2 rounded-xl">
                      <div className="text-[10px] text-white/40 uppercase font-mono">
                        Hệ tinh thể
                      </div>
                      <div className="font-medium text-white/90 mt-0.5">
                        {matA.molecularInfo.crystalSystem}
                      </div>
                    </div>
                    <div className="bg-white/[0.02] p-2 rounded-xl">
                      <div className="text-[10px] text-white/40 uppercase font-mono">
                        Độ dài liên kết
                      </div>
                      <div className="font-mono text-cyan-300 font-medium mt-0.5">
                        {matA.molecularInfo.bondLength}
                      </div>
                    </div>
                    <div className="bg-white/[0.02] p-2 rounded-xl">
                      <div className="text-[10px] text-white/40 uppercase font-mono">
                        Góc liên kết
                      </div>
                      <div className="font-mono text-cyan-300 font-medium mt-0.5">
                        {matA.molecularInfo.bondAngle}
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/[0.02] p-2.5 rounded-xl text-xs space-y-1">
                    <div className="text-[10px] text-white/40 uppercase font-mono">
                      Liên kết chủ đạo
                    </div>
                    <div className="text-white/80 font-medium">
                      {matA.molecularInfo.bonds.type}
                    </div>
                  </div>
                </div>

                {/* Material B Card */}
                <div className="p-4 rounded-2xl bg-gradient-to-b from-purple-950/20 to-black/40 border border-purple-500/20 space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-white/10">
                    <span className="text-xl">{matB.icon}</span>
                    <div>
                      <div className="text-sm font-semibold text-purple-300">
                        {matB.nameVi} ({matB.formula})
                      </div>
                      <div className="text-[11px] text-white/40 font-mono">
                        {matB.objectNameVi}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-white/[0.02] p-2 rounded-xl">
                      <div className="text-[10px] text-white/40 uppercase font-mono">
                        Kiểu mạng tinh thể
                      </div>
                      <div className="font-medium text-white/90 mt-0.5">
                        {matB.molecularInfo.latticeType}
                      </div>
                    </div>
                    <div className="bg-white/[0.02] p-2 rounded-xl">
                      <div className="text-[10px] text-white/40 uppercase font-mono">
                        Hệ tinh thể
                      </div>
                      <div className="font-medium text-white/90 mt-0.5">
                        {matB.molecularInfo.crystalSystem}
                      </div>
                    </div>
                    <div className="bg-white/[0.02] p-2 rounded-xl">
                      <div className="text-[10px] text-white/40 uppercase font-mono">
                        Độ dài liên kết
                      </div>
                      <div className="font-mono text-purple-300 font-medium mt-0.5">
                        {matB.molecularInfo.bondLength}
                      </div>
                    </div>
                    <div className="bg-white/[0.02] p-2 rounded-xl">
                      <div className="text-[10px] text-white/40 uppercase font-mono">
                        Góc liên kết
                      </div>
                      <div className="font-mono text-purple-300 font-medium mt-0.5">
                        {matB.molecularInfo.bondAngle}
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/[0.02] p-2.5 rounded-xl text-xs space-y-1">
                    <div className="text-[10px] text-white/40 uppercase font-mono">
                      Liên kết chủ đạo
                    </div>
                    <div className="text-white/80 font-medium">
                      {matB.molecularInfo.bonds.type}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Applications & Synthesis comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                <div className="text-[11px] font-mono text-blue-300 uppercase tracking-wider">
                  Ứng dụng tiêu biểu của {matA.nameVi}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {matA.macroInfo.applications.map((app, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-[11px] text-blue-300 border border-blue-500/20"
                    >
                      {app}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                <div className="text-[11px] font-mono text-purple-300 uppercase tracking-wider">
                  Ứng dụng tiêu biểu của {matB.nameVi}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {matB.macroInfo.applications.map((app, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-purple-500/10 text-[11px] text-purple-300 border border-purple-500/20"
                    >
                      {app}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer controls - fully opaque backdrop with border to prevent bleed-through */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 sm:px-7 py-4 border-t-2 border-slate-800/80 bg-slate-950/95 backdrop-blur-xl z-20 relative shrink-0">
            <div className="text-xs text-white/60 text-center sm:text-left">
              💡 Mẹo: Bật chế độ <strong className="text-white font-bold">Xem Kép 3D</strong> để quan sát cả 2 vật thể xoay cùng lúc trên màn hình.
            </div>
            <button
              onClick={() => {
                sound.playClick();
                setIsCompareOpen(false);
              }}
              className="w-full sm:w-auto duo-btn-base duo-btn-green py-3 px-7 text-xs font-black uppercase tracking-wider shrink-0 text-center shadow-lg"
            >
              Đóng Bảng So sánh
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
