'use client';

import React, { useState } from 'react';
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
  CheckCircle2,
  Scale,
  Atom,
  ChevronDown,
  ChevronUp,
  BookOpen,
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
  const setIsDetailOpen = useStore((s: StoreState) => s.setIsDetailOpen);

  // Collapsible Minimize state
  const [isMinimized, setIsMinimized] = useState(false);

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
      icon: Flame,
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
      icon: Scale,
      valA: matA.metrics.density,
      valB: matB.metrics.density,
      textA: matA.macroInfo.density,
      textB: matB.macroInfo.density,
    },
    {
      key: 'corrosion' as const,
      label: 'Chống ăn mòn & Độ trơ',
      icon: Sparkles,
      valA: matA.metrics.corrosion,
      valB: matB.metrics.corrosion,
      textA: `${matA.metrics.corrosion} / 100`,
      textB: `${matB.metrics.corrosion} / 100`,
    },
  ];

  return (
    <AnimatePresence>
      {isMinimized ? (
        /* Minimized State: Sleek pill at bottom center */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          onClick={() => {
            sound.playClick();
            setIsMinimized(false);
          }}
          className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-full border border-blue-200/90 shadow-lg flex items-center gap-3 cursor-pointer hover:scale-105 active:scale-95 transition-all text-slate-800"
          title="Chạm để mở lại bảng so sánh"
        >
          <div className="flex items-center -space-x-1.5">
            <MaterialBadge material={matA} size="sm" />
            <MaterialBadge material={matB} size="sm" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold text-slate-900 truncate">
              {matA.nameVi} <span className="text-blue-600 font-mono">vs</span> {matB.nameVi}
            </span>
            <span className="text-[10px] text-blue-600 flex items-center gap-1 truncate font-semibold">
              <Sparkles size={11} className="text-blue-600 shrink-0" />
              Chạm để mở lại bảng so sánh
            </span>
          </div>
          <ChevronUp size={18} className="text-blue-600 shrink-0 ml-1" />
        </motion.div>
      ) : (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-900/40 backdrop-blur-sm">
          {/* Backdrop dismiss */}
          <div
            className="fixed inset-0 -z-10"
            onClick={() => {
              sound.playClick();
              setIsCompareOpen(false);
            }}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 14 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            className="relative w-full max-w-5xl max-h-[92dvh] flex flex-col overflow-hidden shadow-2xl shadow-blue-900/15 z-10 border-2 border-blue-200/90 bg-white rounded-2xl sm:rounded-3xl"
          >
            {/* Top highlight bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-600 z-10" />

            {/* Header */}
            <div className="flex items-center justify-between px-3.5 sm:px-6 py-3 border-b border-slate-200 bg-slate-50 shrink-0 gap-2">
              <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0 flex-1">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0 shadow-sm">
                  <Atom size={20} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                    <h2 className="text-sm sm:text-base md:text-lg font-black text-slate-900 tracking-wide truncate">
                      Bảng So Sánh Vật Liệu & Liên Kết
                    </h2>
                    <span className="text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 whitespace-nowrap">
                      Dual Matrix
                    </span>
                  </div>
                  <p className="text-[10px] sm:text-xs text-slate-500 truncate mt-0.5 hidden xs:block">
                    Đối chiếu cấu trúc mạng nguyên tử, bản chất liên kết hóa học và cơ tính
                  </p>
                </div>
              </div>

              {/* Header Right Actions: Dual View Toggle, Minimize, Close */}
              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                <button
                  onClick={() => {
                    sound.playClick();
                    setIsDual3DView(!isDual3DView);
                  }}
                  className={`px-2.5 sm:px-3 py-1.5 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all border shadow-sm min-h-[40px] cursor-pointer ${
                    isDual3DView
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                  type="button"
                  title="Bật/tắt chế độ xem 2 mô hình 3D song song trên không gian chính"
                >
                  <span className="hidden sm:inline">Xem Kép 3D</span>
                  <span className="sm:hidden">Kép 3D</span>
                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-black ${
                      isDual3DView ? 'bg-white text-blue-700' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {isDual3DView ? 'ON' : 'OFF'}
                  </span>
                </button>

                {/* Minimize Button */}
                <button
                  onClick={() => {
                    sound.playClick();
                    setIsMinimized(true);
                  }}
                  className="p-2 sm:p-2.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 rounded-xl transition-all active:scale-95 shadow-sm min-w-[40px] min-h-[40px] flex items-center justify-center cursor-pointer"
                  title="Thu nhỏ để quan sát mô hình 3D"
                  type="button"
                >
                  <ChevronDown size={17} />
                </button>

                <button
                  onClick={() => {
                    sound.playClick();
                    setIsCompareOpen(false);
                  }}
                  className="p-2 sm:p-2.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 rounded-xl transition-all active:scale-95 shadow-sm min-w-[40px] min-h-[40px] flex items-center justify-center cursor-pointer"
                  title="Đóng bảng so sánh (Esc)"
                  type="button"
                >
                  <X size={17} />
                </button>
              </div>
            </div>

            {/* Material Selectors Bar */}
            <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-2.5 sm:gap-3 p-3 sm:p-4 bg-white border-b border-slate-200 items-center shrink-0">
              {/* Material A Selector */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 bg-blue-50/50 p-3 rounded-2xl border border-blue-200/70 shadow-sm min-w-0">
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <MaterialBadge material={matA} size="md" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[9px] uppercase font-mono tracking-widest text-blue-700 font-black">
                        VẬT LIỆU A
                      </span>
                      <span className="text-[9px] px-2 py-0.2 rounded-full bg-blue-100 text-blue-800 border border-blue-200 font-bold truncate">
                        {matA.categoryLabel}
                      </span>
                    </div>
                    <select
                      value={compareMaterialA}
                      onChange={(e) => {
                        sound.playClick();
                        setCompareMaterialA(e.target.value);
                      }}
                      className="w-full bg-white text-slate-800 font-bold text-xs sm:text-sm focus:outline-none cursor-pointer mt-1 px-2 py-1 rounded-lg border border-slate-200 truncate"
                    >
                      {MATERIALS.map((m) => (
                        <option key={`opt-a-${m.id}`} value={m.id} className="text-slate-800 font-bold">
                          {m.nameVi} ({m.formula})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <button
                  onClick={() => {
                    sound.playClick();
                    setSelectedMaterial(matA.id);
                    setIsCompareOpen(false);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-extrabold uppercase tracking-wider shrink-0 transition-transform active:scale-95 shadow-sm self-end sm:self-auto min-h-[36px] cursor-pointer"
                  title="Quan sát vật liệu A trên 3D Canvas"
                  type="button"
                >
                  XEM 3D
                </button>
              </div>

              {/* Swap Button */}
              <div className="flex justify-center my-0.5 md:my-0">
                <button
                  onClick={() => {
                    sound.playClick();
                    swapCompareMaterials();
                  }}
                  className="w-10 h-10 rounded-2xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-blue-600 flex items-center justify-center transition-all hover:scale-105 active:rotate-180 shadow-sm min-h-[44px] min-w-[44px] cursor-pointer"
                  title="Đổi chỗ hai vật liệu"
                  type="button"
                  aria-label="Đổi chỗ hai vật liệu"
                >
                  <ArrowRightLeft size={16} />
                </button>
              </div>

              {/* Material B Selector */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 bg-indigo-50/50 p-3 rounded-2xl border border-indigo-200/70 shadow-sm min-w-0">
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <MaterialBadge material={matB} size="md" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[9px] uppercase font-mono tracking-widest text-indigo-700 font-black">
                        VẬT LIỆU B
                      </span>
                      <span className="text-[9px] px-2 py-0.2 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200 font-bold truncate">
                        {matB.categoryLabel}
                      </span>
                    </div>
                    <select
                      value={compareMaterialB}
                      onChange={(e) => {
                        sound.playClick();
                        setCompareMaterialB(e.target.value);
                      }}
                      className="w-full bg-white text-slate-800 font-bold text-xs sm:text-sm focus:outline-none cursor-pointer mt-1 px-2 py-1 rounded-lg border border-slate-200 truncate"
                    >
                      {MATERIALS.map((m) => (
                        <option key={`opt-b-${m.id}`} value={m.id} className="text-slate-800 font-bold">
                          {m.nameVi} ({m.formula})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <button
                  onClick={() => {
                    sound.playClick();
                    setSelectedMaterial(matB.id);
                    setIsCompareOpen(false);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-extrabold uppercase tracking-wider shrink-0 transition-transform active:scale-95 shadow-sm self-end sm:self-auto min-h-[36px] cursor-pointer"
                  title="Quan sát vật liệu B trên 3D Canvas"
                  type="button"
                >
                  XEM 3D
                </button>
              </div>
            </div>

            {/* Body Content */}
            <div className="flex-1 min-h-0 overflow-y-auto px-3.5 sm:px-6 pt-4 pb-6 space-y-6 custom-scrollbar bg-slate-50/40">
              {/* SECTION 1: Cấu trúc & Liên kết */}
              <div>
                <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2 font-bold">
                  <Atom size={16} className="text-blue-600" />
                  ĐỐI CHIẾU BẢN CHẤT LIÊN KẾT HÓA HỌC & MẠNG TINH THỂ
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {/* Material A Bonding Card */}
                  <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-blue-200/80 space-y-3 shadow-sm min-w-0">
                    <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <MaterialBadge material={matA} size="sm" />
                        <div className="min-w-0 flex-1">
                          <div className="text-xs sm:text-sm font-black text-slate-900 truncate">
                            {matA.nameVi}
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono truncate">
                            {matA.formula} · {matA.categoryLabel}
                          </div>
                        </div>
                      </div>
                      {matA.molecularInfo.bonds.bondEnergy && (
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 shrink-0 ml-1">
                          {matA.molecularInfo.bonds.bondEnergy}
                        </span>
                      )}
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[9px] uppercase font-mono tracking-wider text-blue-600 font-extrabold block">
                        Kiểu liên kết hóa học cốt lõi
                      </span>
                      <span className="text-xs sm:text-sm text-slate-800 font-bold mt-0.5 block break-words">
                        {matA.molecularInfo.bonds.type}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 min-w-0">
                        <span className="text-[9px] text-slate-500 uppercase font-mono font-bold block truncate">
                          Kiểu mạng tinh thể
                        </span>
                        <strong className="text-slate-800 font-bold mt-0.5 block text-[11px] sm:text-xs leading-snug break-words">
                          {matA.molecularInfo.latticeType}
                        </strong>
                      </div>

                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 min-w-0">
                        <span className="text-[9px] text-slate-500 uppercase font-mono font-bold block truncate">
                          Hệ tinh thể
                        </span>
                        <strong className="text-slate-800 font-bold mt-0.5 block text-[11px] sm:text-xs leading-snug break-words">
                          {matA.molecularInfo.crystalSystem}
                        </strong>
                      </div>

                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 min-w-0">
                        <span className="text-[9px] text-slate-500 uppercase font-mono font-bold block truncate">
                          Độ dài liên kết
                        </span>
                        <span className="font-mono text-blue-700 font-bold mt-0.5 block text-[11px] sm:text-xs truncate">
                          {matA.molecularInfo.bondLength}
                        </span>
                      </div>

                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 min-w-0">
                        <span className="text-[9px] text-slate-500 uppercase font-mono font-bold block truncate">
                          Góc liên kết
                        </span>
                        <span className="font-mono text-blue-700 font-bold mt-0.5 block text-[11px] sm:text-xs truncate">
                          {matA.molecularInfo.bondAngle}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Material B Bonding Card */}
                  <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-indigo-200/80 space-y-3 shadow-sm min-w-0">
                    <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <MaterialBadge material={matB} size="sm" />
                        <div className="min-w-0 flex-1">
                          <div className="text-xs sm:text-sm font-black text-slate-900 truncate">
                            {matB.nameVi}
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono truncate">
                            {matB.formula} · {matB.categoryLabel}
                          </div>
                        </div>
                      </div>
                      {matB.molecularInfo.bonds.bondEnergy && (
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 shrink-0 ml-1">
                          {matB.molecularInfo.bonds.bondEnergy}
                        </span>
                      )}
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[9px] uppercase font-mono tracking-wider text-indigo-600 font-extrabold block">
                        Kiểu liên kết hóa học cốt lõi
                      </span>
                      <span className="text-xs sm:text-sm text-slate-800 font-bold mt-0.5 block break-words">
                        {matB.molecularInfo.bonds.type}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 min-w-0">
                        <span className="text-[9px] text-slate-500 uppercase font-mono font-bold block truncate">
                          Kiểu mạng tinh thể
                        </span>
                        <strong className="text-slate-800 font-bold mt-0.5 block text-[11px] sm:text-xs leading-snug break-words">
                          {matB.molecularInfo.latticeType}
                        </strong>
                      </div>

                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 min-w-0">
                        <span className="text-[9px] text-slate-500 uppercase font-mono font-bold block truncate">
                          Hệ tinh thể
                        </span>
                        <strong className="text-slate-800 font-bold mt-0.5 block text-[11px] sm:text-xs leading-snug break-words">
                          {matB.molecularInfo.crystalSystem}
                        </strong>
                      </div>

                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 min-w-0">
                        <span className="text-[9px] text-slate-500 uppercase font-mono font-bold block truncate">
                          Độ dài liên kết
                        </span>
                        <span className="font-mono text-indigo-700 font-bold mt-0.5 block text-[11px] sm:text-xs truncate">
                          {matB.molecularInfo.bondLength}
                        </span>
                      </div>

                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 min-w-0">
                        <span className="text-[9px] text-slate-500 uppercase font-mono font-bold block truncate">
                          Góc liên kết
                        </span>
                        <span className="font-mono text-indigo-700 font-bold mt-0.5 block text-[11px] sm:text-xs truncate">
                          {matB.molecularInfo.bondAngle}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 2: Chỉ số Cơ - Lý - Hóa */}
              <div>
                <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2 font-bold">
                  <Scale size={16} className="text-blue-600" />
                  ĐỐI CHIẾU CHỈ SỐ CƠ - LÝ - HÓA (THANG ĐIỂM CHUẨN HÓA 0 - 100)
                </h3>

                <div className="space-y-3">
                  {metricsConfig.map((metric) => {
                    const Icon = metric.icon;
                    const delta = metric.valA - metric.valB;
                    const winner = delta > 0 ? 'A' : delta < 0 ? 'B' : 'EQUAL';

                    return (
                      <div
                        key={`metric-${metric.key}`}
                        className="p-3 sm:p-4 rounded-2xl bg-white border border-slate-200 space-y-2.5 shadow-sm min-w-0"
                      >
                        <div className="flex items-center justify-between text-xs min-w-0 gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <Icon size={16} className="text-slate-500 shrink-0" />
                            <span className="font-bold text-slate-800 truncate">{metric.label}</span>
                          </div>
                          {winner !== 'EQUAL' && (
                            <span
                              className={`text-[10px] font-black px-2 py-0.5 rounded-md shrink-0 ${
                                winner === 'A'
                                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                  : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                              }`}
                            >
                              {winner === 'A' ? matA.nameVi : matB.nameVi} vượt trội (+{Math.abs(delta)})
                            </span>
                          )}
                        </div>

                        {/* Dual Bar Comparison */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          {/* Bar A */}
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="text-slate-700 font-semibold truncate">{matA.nameVi}</span>
                              <span className="font-mono font-bold text-blue-700">{metric.valA} / 100</span>
                            </div>
                            <div className="h-2 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${metric.valA}%` }}
                                transition={{ duration: 0.5, ease: 'easeOut' }}
                                className="h-full rounded-full bg-blue-600"
                              />
                            </div>
                            <div className="text-[10px] text-slate-500 truncate">{metric.textA}</div>
                          </div>

                          {/* Bar B */}
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="text-slate-700 font-semibold truncate">{matB.nameVi}</span>
                              <span className="font-mono font-bold text-indigo-700">{metric.valB} / 100</span>
                            </div>
                            <div className="h-2 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${metric.valB}%` }}
                                transition={{ duration: 0.5, ease: 'easeOut' }}
                                className="h-full rounded-full bg-indigo-600"
                              />
                            </div>
                            <div className="text-[10px] text-slate-500 truncate">{metric.textB}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* SECTION 3: Ứng dụng thực tiễn */}
              <div>
                <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2 font-bold">
                  <Sparkles size={16} className="text-blue-600" />
                  ỨNG DỤNG TIÊU BIỂU TRONG KHOA HỌC & ĐỜI SỐNG
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  <div className="p-3.5 rounded-2xl bg-white border border-blue-200/80 space-y-2 shadow-sm">
                    <span className="text-[11px] font-black text-blue-700 uppercase font-mono block">
                      Ứng dụng của {matA.nameVi}
                    </span>
                    <ul className="space-y-1.5 text-xs text-slate-700">
                      {matA.macroInfo.applications.map((app, idx) => (
                        <li key={`app-a-${idx}`} className="flex items-start gap-2">
                          <CheckCircle2 size={13} className="text-blue-600 shrink-0 mt-0.5" />
                          <span>{app}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white border border-indigo-200/80 space-y-2 shadow-sm">
                    <span className="text-[11px] font-black text-indigo-700 uppercase font-mono block">
                      Ứng dụng của {matB.nameVi}
                    </span>
                    <ul className="space-y-1.5 text-xs text-slate-700">
                      {matB.macroInfo.applications.map((app, idx) => (
                        <li key={`app-b-${idx}`} className="flex items-start gap-2">
                          <CheckCircle2 size={13} className="text-indigo-600 shrink-0 mt-0.5" />
                          <span>{app}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer Controls */}
            <div className="px-3.5 sm:px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3 shrink-0">
              <button
                onClick={() => {
                  sound.playClick();
                  setSelectedMaterial(matA.id);
                  setIsCompareOpen(false);
                  setIsDetailOpen(true);
                }}
                className="py-2 px-3 sm:px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center gap-2 border border-slate-200 shadow-sm transition-all min-h-[44px] cursor-pointer"
                type="button"
                title="Mở hồ sơ chi tiết của vật liệu A"
              >
                <BookOpen size={15} className="text-blue-600 shrink-0" />
                <span className="truncate">Hồ sơ {matA.nameVi}</span>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  setIsCompareOpen(false);
                }}
                className="py-2 px-6 sm:px-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs uppercase tracking-wider shadow-md shadow-blue-500/20 transition-transform active:scale-95 min-h-[44px] cursor-pointer"
                type="button"
              >
                Đóng Bảng So Sánh
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
