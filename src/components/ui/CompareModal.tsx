'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore, StoreState } from '@/store/useStore';
import { MATERIALS, MATERIAL_MAP } from '@/data/materials';
import {
  X,
  ArrowRightLeft,
  Zap,
  Flame,
  Shield,
  Sparkles,
  Award,
  Atom,
  CheckCircle2,
  Scale,
  Crown,
} from 'lucide-react';
import { sound } from '@/lib/soundFx';
import MaterialBadge from '@/components/ui/MaterialBadge';

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
      colorA: '#22d3ee',
      colorB: '#e879f9',
    },
    {
      key: 'thermal' as const,
      label: 'Độ dẫn nhiệt',
      icon: Flame,
      valA: matA.metrics.thermal,
      valB: matB.metrics.thermal,
      textA: matA.macroInfo.thermalConductivity,
      textB: matB.macroInfo.thermalConductivity,
      colorA: '#38bdf8',
      colorB: '#f472b6',
    },
    {
      key: 'electrical' as const,
      label: 'Độ dẫn điện',
      icon: Zap,
      valA: matA.metrics.electrical,
      valB: matB.metrics.electrical,
      textA: matA.macroInfo.electricalConductivity,
      textB: matB.macroInfo.electricalConductivity,
      colorA: '#06b6d4',
      colorB: '#c084fc',
    },
    {
      key: 'density' as const,
      label: 'Khối lượng riêng',
      icon: Scale,
      valA: matA.metrics.density,
      valB: matB.metrics.density,
      textA: matA.macroInfo.density,
      textB: matB.macroInfo.density,
      colorA: '#60a5fa',
      colorB: '#a855f7',
    },
    {
      key: 'corrosion' as const,
      label: 'Chống ăn mòn & Độ trơ',
      icon: Sparkles,
      valA: matA.metrics.corrosion,
      valB: matB.metrics.corrosion,
      textA: `${matA.metrics.corrosion} / 100`,
      textB: `${matB.metrics.corrosion} / 100`,
      colorA: '#34d399',
      colorB: '#fb7185',
    },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-5 md:p-6 bg-black/85 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 16 }}
          transition={{ type: 'spring', damping: 26, stiffness: 320 }}
          className="relative w-full max-w-5xl max-h-[92dvh] flex flex-col duo-card overflow-hidden shadow-2xl shadow-black/95 z-10 border-2 border-slate-700/80 bg-slate-950"
        >
          {/* Top highlight bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-sky-500 to-fuchsia-500" />

          {/* Header */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b-2 border-slate-800 bg-slate-900/90 shrink-0">
            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-fuchsia-500/20 border-2 border-cyan-400/40 text-cyan-300 flex items-center justify-center shrink-0 shadow-md">
                <Atom size={22} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-base sm:text-lg font-black text-white tracking-wide truncate">
                    Bảng So Sánh Vật Liệu & Liên Kết Đa Tầng
                  </h2>
                  <span className="text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full bg-gradient-to-r from-cyan-500/20 to-fuchsia-500/20 text-cyan-200 border border-cyan-400/30">
                    Dual Material Matrix
                  </span>
                </div>
                <p className="text-[10px] sm:text-xs text-slate-400 truncate mt-0.5">
                  Đối chiếu cấu trúc mạng nguyên tử, bản chất liên kết hóa học và cơ tính định lượng
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-2">
              <button
                onClick={() => {
                  sound.playClick();
                  setIsDual3DView(!isDual3DView);
                }}
                className={`px-3 sm:px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-2 transition-all border shadow-sm ${
                  isDual3DView
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white hover:bg-slate-750'
                }`}
                type="button"
                title="Bật/tắt chế độ xem 2 mô hình 3D song song trên không gian chính"
              >
                <span>Xem Kép 3D</span>
                <span
                  className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-black ${
                    isDual3DView ? 'bg-white text-slate-950' : 'bg-slate-700 text-slate-400'
                  }`}
                >
                  {isDual3DView ? 'ON' : 'OFF'}
                </span>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  setIsCompareOpen(false);
                }}
                className="p-2 sm:p-2.5 bg-slate-800 hover:bg-slate-750 border border-slate-700 text-white/80 hover:text-white rounded-xl sm:rounded-2xl transition-transform active:scale-95 shadow-md"
                title="Đóng (Esc)"
                type="button"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Material Selectors Bar (Side-by-side with Swap in Middle) */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-3 p-4 bg-slate-950 border-b-2 border-slate-800 items-center shrink-0">
            {/* Material A Selector (Cyan Neon Theme) */}
            <div className="flex items-center gap-3 bg-gradient-to-r from-cyan-950/40 via-slate-900/90 to-slate-900/80 p-3.5 rounded-2xl border-2 border-cyan-400/50 shadow-lg min-w-0">
              <MaterialBadge material={matA} size="lg" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-cyan-400 font-black">
                    VẬT LIỆU A
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold truncate">
                    {matA.categoryLabel}
                  </span>
                </div>
                <select
                  value={compareMaterialA}
                  onChange={(e) => {
                    sound.playClick();
                    setCompareMaterialA(e.target.value);
                  }}
                  className="w-full bg-transparent text-white font-black text-sm focus:outline-none cursor-pointer mt-1 truncate"
                >
                  {MATERIALS.map((m) => (
                    <option key={`opt-a-${m.id}`} value={m.id} className="bg-slate-900 text-white font-bold">
                      {m.nameVi} ({m.formula})
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
                className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-black uppercase tracking-wider shrink-0 transition-transform active:scale-95 shadow-md shadow-cyan-500/30"
                title="Quan sát vật liệu A trên 3D Canvas"
                type="button"
              >
                Xem 3D
              </button>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center">
              <button
                onClick={() => {
                  sound.playClick();
                  swapCompareMaterials();
                }}
                className="w-10 h-10 rounded-2xl bg-slate-800 hover:bg-slate-700 border-2 border-slate-600 text-white flex items-center justify-center transition-all hover:scale-105 active:rotate-180 shadow-md"
                title="Đổi chỗ hai vật liệu"
                type="button"
              >
                <ArrowRightLeft size={17} className="text-cyan-300" />
              </button>
            </div>

            {/* Material B Selector (Fuchsia Neon Theme) */}
            <div className="flex items-center gap-3 bg-gradient-to-r from-fuchsia-950/40 via-slate-900/90 to-slate-900/80 p-3.5 rounded-2xl border-2 border-fuchsia-400/50 shadow-lg min-w-0">
              <MaterialBadge material={matB} size="lg" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-fuchsia-400 font-black">
                    VẬT LIỆU B
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30 font-bold truncate">
                    {matB.categoryLabel}
                  </span>
                </div>
                <select
                  value={compareMaterialB}
                  onChange={(e) => {
                    sound.playClick();
                    setCompareMaterialB(e.target.value);
                  }}
                  className="w-full bg-transparent text-white font-black text-sm focus:outline-none cursor-pointer mt-1 truncate"
                >
                  {MATERIALS.map((m) => (
                    <option key={`opt-b-${m.id}`} value={m.id} className="bg-slate-900 text-white font-bold">
                      {m.nameVi} ({m.formula})
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
                className="px-3 py-1.5 rounded-xl bg-fuchsia-500 hover:bg-fuchsia-400 text-slate-950 text-xs font-black uppercase tracking-wider shrink-0 transition-transform active:scale-95 shadow-md shadow-fuchsia-500/30"
                title="Quan sát vật liệu B trên 3D Canvas"
                type="button"
              >
                Xem 3D
              </button>
            </div>
          </div>

          {/* Body Content */}
          <div className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-6 pt-4 pb-6 space-y-6 custom-scrollbar bg-slate-950/60">
            {/* ══════════════════════════════════════════════════════════════════
                SECTION 1: ĐỐI CHIẾU BẢN CHẤT LIÊN KẾT & CẤU TRÚC MẠNG
            ══════════════════════════════════════════════════════════════════ */}
            <div>
              <h3 className="text-xs font-mono uppercase tracking-wider text-slate-300 mb-3.5 flex items-center gap-2 font-bold">
                <Atom size={17} className="text-cyan-400" />
                ĐỐI CHIẾU BẢN CHẤT LIÊN KẾT HÓA HỌC & MẠNG TINH THỂ
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Material A Bonding Card */}
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-cyan-950/40 via-slate-900/90 to-blue-950/30 border-2 border-cyan-400/40 space-y-3.5 shadow-xl">
                  <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <MaterialBadge material={matA} size="sm" />
                      <div className="min-w-0">
                        <div className="text-sm font-black text-cyan-200 truncate">
                          {matA.nameVi}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono truncate">
                          {matA.formula} · {matA.categoryLabel}
                        </div>
                      </div>
                    </div>
                    {matA.molecularInfo.bonds.bondEnergy && (
                      <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shrink-0">
                        {matA.molecularInfo.bonds.bondEnergy}
                      </span>
                    )}
                  </div>

                  {/* Primary Bond Type */}
                  <div className="p-3 rounded-xl bg-cyan-950/50 border border-cyan-500/30">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-cyan-400 font-extrabold block">
                      Kiểu liên kết hóa học cốt lõi
                    </span>
                    <span className="text-xs sm:text-sm text-white font-bold mt-0.5 block">
                      {matA.molecularInfo.bonds.type}
                    </span>
                  </div>

                  {/* Grid of parameters */}
                  <div className="grid grid-cols-2 gap-2.5 text-xs">
                    <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-700/80">
                      <span className="text-[10px] text-cyan-400 uppercase font-mono font-bold block">
                        Kiểu mạng tinh thể
                      </span>
                      <strong className="text-white font-bold mt-1 block text-xs leading-snug">
                        {matA.molecularInfo.latticeType}
                      </strong>
                    </div>

                    <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-700/80">
                      <span className="text-[10px] text-cyan-400 uppercase font-mono font-bold block">
                        Hệ tinh thể
                      </span>
                      <strong className="text-white font-bold mt-1 block text-xs leading-snug">
                        {matA.molecularInfo.crystalSystem}
                      </strong>
                    </div>

                    <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-700/80">
                      <span className="text-[10px] text-slate-400 uppercase font-mono font-bold block">
                        Độ dài liên kết
                      </span>
                      <span className="font-mono text-cyan-300 font-bold mt-0.5 block">
                        {matA.molecularInfo.bondLength}
                      </span>
                    </div>

                    <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-700/80">
                      <span className="text-[10px] text-slate-400 uppercase font-mono font-bold block">
                        Góc liên kết
                      </span>
                      <span className="font-mono text-cyan-300 font-bold mt-0.5 block">
                        {matA.molecularInfo.bondAngle}
                      </span>
                    </div>

                    <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-700/80">
                      <span className="text-[10px] text-slate-400 uppercase font-mono font-bold block">
                        Lai hóa orbital
                      </span>
                      <span className="text-slate-200 font-semibold mt-0.5 block text-[11px]">
                        {matA.molecularInfo.bonds.hybridization || 'Mạng khối liên tục'}
                      </span>
                    </div>

                    <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-700/80">
                      <span className="text-[10px] text-slate-400 uppercase font-mono font-bold block">
                        Hình học phối trí
                      </span>
                      <span className="text-slate-200 font-semibold mt-0.5 block text-[11px]">
                        {matA.molecularInfo.bonds.coordinationGeometry || matA.molecularInfo.crystalSystem}
                      </span>
                    </div>
                  </div>

                  {matA.molecularInfo.bonds.interlayerForce && (
                    <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
                      <span className="text-[10px] uppercase font-mono tracking-wider text-cyan-400 font-bold block">
                        Tương tác liên tầng / Lực phụ
                      </span>
                      <span className="text-slate-300 text-[11px] mt-0.5 block">
                        {matA.molecularInfo.bonds.interlayerForce}
                      </span>
                    </div>
                  )}
                </div>

                {/* Material B Bonding Card */}
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-fuchsia-950/40 via-slate-900/90 to-purple-950/30 border-2 border-fuchsia-400/40 space-y-3.5 shadow-xl">
                  <div className="flex items-center justify-between pb-3 border-b border-fuchsia-500/20">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <MaterialBadge material={matB} size="sm" />
                      <div className="min-w-0">
                        <div className="text-sm font-black text-fuchsia-200 truncate">
                          {matB.nameVi}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono truncate">
                          {matB.formula} · {matB.categoryLabel}
                        </div>
                      </div>
                    </div>
                    {matB.molecularInfo.bonds.bondEnergy && (
                      <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-xl bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/40 shrink-0">
                        {matB.molecularInfo.bonds.bondEnergy}
                      </span>
                    )}
                  </div>

                  {/* Primary Bond Type */}
                  <div className="p-3 rounded-xl bg-fuchsia-950/50 border border-fuchsia-500/30">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-fuchsia-400 font-extrabold block">
                      Kiểu liên kết hóa học cốt lõi
                    </span>
                    <span className="text-xs sm:text-sm text-white font-bold mt-0.5 block">
                      {matB.molecularInfo.bonds.type}
                    </span>
                  </div>

                  {/* Grid of parameters */}
                  <div className="grid grid-cols-2 gap-2.5 text-xs">
                    <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-700/80">
                      <span className="text-[10px] text-fuchsia-400 uppercase font-mono font-bold block">
                        Kiểu mạng tinh thể
                      </span>
                      <strong className="text-white font-bold mt-1 block text-xs leading-snug">
                        {matB.molecularInfo.latticeType}
                      </strong>
                    </div>

                    <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-700/80">
                      <span className="text-[10px] text-fuchsia-400 uppercase font-mono font-bold block">
                        Hệ tinh thể
                      </span>
                      <strong className="text-white font-bold mt-1 block text-xs leading-snug">
                        {matB.molecularInfo.crystalSystem}
                      </strong>
                    </div>

                    <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-700/80">
                      <span className="text-[10px] text-slate-400 uppercase font-mono font-bold block">
                        Độ dài liên kết
                      </span>
                      <span className="font-mono text-fuchsia-300 font-bold mt-0.5 block">
                        {matB.molecularInfo.bondLength}
                      </span>
                    </div>

                    <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-700/80">
                      <span className="text-[10px] text-slate-400 uppercase font-mono font-bold block">
                        Góc liên kết
                      </span>
                      <span className="font-mono text-fuchsia-300 font-bold mt-0.5 block">
                        {matB.molecularInfo.bondAngle}
                      </span>
                    </div>

                    <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-700/80">
                      <span className="text-[10px] text-slate-400 uppercase font-mono font-bold block">
                        Lai hóa orbital
                      </span>
                      <span className="text-slate-200 font-semibold mt-0.5 block text-[11px]">
                        {matB.molecularInfo.bonds.hybridization || 'Mạng khối liên tục'}
                      </span>
                    </div>

                    <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-700/80">
                      <span className="text-[10px] text-slate-400 uppercase font-mono font-bold block">
                        Hình học phối trí
                      </span>
                      <span className="text-slate-200 font-semibold mt-0.5 block text-[11px]">
                        {matB.molecularInfo.bonds.coordinationGeometry || matB.molecularInfo.crystalSystem}
                      </span>
                    </div>
                  </div>

                  {matB.molecularInfo.bonds.interlayerForce && (
                    <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
                      <span className="text-[10px] uppercase font-mono tracking-wider text-fuchsia-400 font-bold block">
                        Tương tác liên tầng / Lực phụ
                      </span>
                      <span className="text-slate-300 text-[11px] mt-0.5 block">
                        {matB.molecularInfo.bonds.interlayerForce}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ══════════════════════════════════════════════════════════════════
                SECTION 2: ĐẤU CHỈ SỐ CƠ LÝ (METRIC DUEL BARS)
            ══════════════════════════════════════════════════════════════════ */}
            <div>
              <h3 className="text-xs font-mono uppercase tracking-wider text-slate-300 mb-3.5 flex items-center gap-2 font-bold">
                <Award size={17} className="text-amber-400" />
                ĐỐI ĐẦU CHỈ SỐ HIỆU NĂNG CƠ LÝ (0 – 100 ĐIỂM)
              </h3>

              <div className="space-y-4 bg-slate-900/80 p-4 sm:p-5 rounded-2xl border-2 border-slate-800 shadow-xl">
                {metricsConfig.map((m) => {
                  const Icon = m.icon;
                  const isAWinner = m.valA > m.valB;
                  const isBWinner = m.valB > m.valA;
                  const isEqual = m.valA === m.valB;

                  return (
                    <div key={m.key} className="space-y-2">
                      <div className="flex items-center justify-between text-xs sm:text-sm">
                        <div className="flex items-center gap-2 font-bold text-white">
                          <Icon size={16} className="text-amber-400" />
                          <span>{m.label}</span>
                        </div>

                        {/* Winner/Advantage Badge */}
                        <div className="flex items-center gap-2">
                          {isAWinner && (
                            <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/40">
                              <Crown size={12} className="text-cyan-400" />
                              {matA.nameVi} vượt trội
                            </span>
                          )}
                          {isBWinner && (
                            <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-400/40">
                              <Crown size={12} className="text-fuchsia-400" />
                              {matB.nameVi} vượt trội
                            </span>
                          )}
                          {isEqual && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                              Ngang ngửa
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Side-by-side battle progress bar */}
                      <div className="grid grid-cols-2 gap-2 h-4 items-center">
                        {/* A Bar (facing right) */}
                        <div className="flex items-center gap-2 justify-end">
                          <span className="font-mono font-black text-xs text-cyan-300">
                            {m.valA}
                          </span>
                          <div className="w-full h-3 rounded-full bg-slate-800 p-0.5 border border-slate-700 overflow-hidden flex justify-end">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${m.valA}%` }}
                              transition={{ duration: 0.6 }}
                              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.4)]"
                            />
                          </div>
                        </div>

                        {/* B Bar (facing right) */}
                        <div className="flex items-center gap-2 justify-start">
                          <div className="w-full h-3 rounded-full bg-slate-800 p-0.5 border border-slate-700 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${m.valB}%` }}
                              transition={{ duration: 0.6 }}
                              className="h-full rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-400 shadow-[0_0_8px_rgba(217,70,239,0.4)]"
                            />
                          </div>
                          <span className="font-mono font-black text-xs text-fuchsia-300">
                            {m.valB}
                          </span>
                        </div>
                      </div>

                      {/* Specific quantified text comparison */}
                      <div className="grid grid-cols-2 gap-4 text-[11px] text-slate-400 pt-0.5">
                        <div className="truncate text-right text-cyan-200/80 italic">{m.textA}</div>
                        <div className="truncate text-left text-fuchsia-200/80 italic">{m.textB}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ══════════════════════════════════════════════════════════════════
                SECTION 3: TỔNG KẾT ƯU THẾ KHOA HỌC (VERDICT)
            ══════════════════════════════════════════════════════════════════ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-400/30 space-y-2">
                <span className="text-[10px] uppercase font-mono tracking-wider text-cyan-400 font-bold block flex items-center gap-1.5">
                  <CheckCircle2 size={14} />
                  Thế mạnh then chốt của {matA.nameVi}
                </span>
                <p className="text-xs text-slate-200 leading-relaxed">
                  Đặc trưng bởi cấu trúc ô mạng <strong className="text-white">{matA.molecularInfo.latticeType}</strong>, mang lại thế mạnh nổi bật về{' '}
                  <strong className="text-cyan-300">{matA.macroInfo.mechanicalStrength}</strong> và phục vụ tối ưu trong các lĩnh vực: {matA.macroInfo.applications[0]}.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-fuchsia-950/30 border border-fuchsia-400/30 space-y-2">
                <span className="text-[10px] uppercase font-mono tracking-wider text-fuchsia-400 font-bold block flex items-center gap-1.5">
                  <CheckCircle2 size={14} />
                  Thế mạnh then chốt của {matB.nameVi}
                </span>
                <p className="text-xs text-slate-200 leading-relaxed">
                  Đặc trưng bởi cấu trúc ô mạng <strong className="text-white">{matB.molecularInfo.latticeType}</strong>, nổi trội với đặc tính{' '}
                  <strong className="text-fuchsia-300">{matB.macroInfo.mechanicalStrength}</strong> và đóng vai trò thiết yếu trong: {matB.macroInfo.applications[0]}.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-4 sm:px-6 py-3.5 border-t-2 border-slate-800 bg-slate-950 flex items-center justify-end shrink-0">
            <button
              onClick={() => {
                sound.playClick();
                setIsCompareOpen(false);
              }}
              className="py-2.5 px-7 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-blue-600/30 transition-transform active:scale-95"
              type="button"
            >
              Đóng Bảng So Sánh
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
