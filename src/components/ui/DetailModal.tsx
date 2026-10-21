'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore, StoreState } from '@/store/useStore';
import { MATERIALS, MATERIAL_MAP } from '@/data/materials';
import {
  X,
  Shield,
  BarChart3,
  Sparkles,
  CheckCircle2,
  Atom,
  Orbit,
  Zap,
  ArrowRightLeft,
  Compass,
  Layers,
  Flame,
  Activity,
  Layers3,
  Award,
  ChevronDown,
  ChevronUp,
  Columns2,
  Scale,
} from 'lucide-react';
import { sound } from '@/lib/soundFx';
import MaterialBadge from '@/components/ui/MaterialBadge';

export default function DetailModal() {
  const isDetailOpen = useStore((s: StoreState) => s.isDetailOpen);
  const setIsDetailOpen = useStore((s: StoreState) => s.setIsDetailOpen);
  const selectedMaterial = useStore((s: StoreState) => s.selectedMaterial);
  const setSelectedMaterial = useStore((s: StoreState) => s.setSelectedMaterial);
  const compareMaterialA = useStore((s: StoreState) => s.compareMaterialA);
  const compareMaterialB = useStore((s: StoreState) => s.compareMaterialB);
  const setCompareMaterialA = useStore((s: StoreState) => s.setCompareMaterialA);
  const setCompareMaterialB = useStore((s: StoreState) => s.setCompareMaterialB);
  const swapCompareMaterials = useStore((s: StoreState) => s.swapCompareMaterials);
  const isDual3DView = useStore((s: StoreState) => s.isDual3DView);
  const setIsDual3DView = useStore((s: StoreState) => s.setIsDual3DView);

  // 4 Tabs: bonds, metrics, apps, and compare (Synchronized with store)
  const detailTab = useStore((s: StoreState) => s.detailTab);
  const setDetailTab = useStore((s: StoreState) => s.setDetailTab);
  const activeTab = detailTab || 'bonds';
  const setActiveTab = setDetailTab;

  // Collapsible Minimize state
  const [isMinimized, setIsMinimized] = useState(false);

  const material = MATERIAL_MAP.get(selectedMaterial);
  const matA = MATERIAL_MAP.get(compareMaterialA) || material || MATERIALS[0];
  const matB = MATERIAL_MAP.get(compareMaterialB) || MATERIALS[1];

  if (!isDetailOpen || !material) return null;

  // Category Theme Colors & Accents (Gam màu Giáo dục: Clean White & Education Blue)
  const theme =
    material.category === 'metal'
      ? {
          banner: 'from-amber-50/90 via-yellow-50/60 to-orange-50/70',
          border: 'border-amber-200/90',
          accent: 'text-amber-800',
          badge: 'bg-amber-50 text-amber-800 border-amber-200',
        }
      : material.category === 'tech'
      ? {
          banner: 'from-blue-50/90 via-sky-50/60 to-indigo-50/70',
          border: 'border-blue-200/90',
          accent: 'text-blue-800',
          badge: 'bg-blue-50 text-blue-700 border-blue-200',
        }
      : material.category === 'crystal'
      ? {
          banner: 'from-sky-50/90 via-blue-50/60 to-indigo-50/70',
          border: 'border-sky-200/90',
          accent: 'text-sky-800',
          badge: 'bg-sky-50 text-sky-800 border-sky-200',
        }
      : material.category === 'polymer'
      ? {
          banner: 'from-emerald-50/90 via-teal-50/60 to-green-50/70',
          border: 'border-emerald-200/90',
          accent: 'text-emerald-800',
          badge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        }
      : material.category === 'nano'
      ? {
          banner: 'from-purple-50/90 via-violet-50/60 to-fuchsia-50/70',
          border: 'border-purple-200/90',
          accent: 'text-purple-800',
          badge: 'bg-purple-50 text-purple-800 border-purple-200',
        }
      : {
          banner: 'from-blue-50/90 via-sky-50/60 to-slate-50/80',
          border: 'border-blue-200/90',
          accent: 'text-blue-800',
          badge: 'bg-blue-50 text-blue-700 border-blue-200',
        };

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
          title="Chạm để mở lại hồ sơ vật liệu"
        >
          <MaterialBadge material={material} size="sm" />
          <div className="flex flex-col min-w-0">
            {activeTab === 'compare' ? (
              <span className="text-xs font-bold text-slate-900 truncate">
                {matA.nameVi} <span className="text-blue-600 font-mono">vs</span> {matB.nameVi}
              </span>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900 truncate">{material.nameVi}</span>
                <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200/70 truncate">
                  {material.formula}
                </span>
              </div>
            )}
            <span className="text-[10px] text-blue-600 font-semibold flex items-center gap-1 truncate">
              <Sparkles size={11} className="text-blue-600 shrink-0" />
              {activeTab === 'compare' ? 'Chạm để mở lại bảng so sánh' : 'Chạm để xem chi tiết hồ sơ'}
            </span>
          </div>
          <ChevronUp size={18} className="text-blue-600 shrink-0 ml-1" />
        </motion.div>
      ) : (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
          {/* Dim backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              sound.playClick();
              setIsMinimized(true);
            }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
          />

          {/* Modal Dialog (Responsive Clean White & Education Blue) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 14 }}
            transition={{ type: 'spring', damping: 28, stiffness: 350 }}
            className={`relative w-[95%] sm:w-[92%] md:w-[88%] lg:w-[84%] max-w-5xl max-h-[min(90dvh,92%)] flex flex-col overflow-hidden z-10 shadow-2xl shadow-blue-900/15 border-2 ${theme.border} bg-white rounded-2xl sm:rounded-3xl`}
          >
            {/* Top candy highlight line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-sky-400 to-indigo-600 z-10" />

            {/* Modal Header */}
            <div
              className={`px-3.5 sm:px-6 py-2.5 sm:py-3.5 border-b border-slate-200/80 bg-gradient-to-r ${theme.banner} flex items-center justify-between shrink-0 gap-2`}
            >
              <div className="flex items-center gap-2.5 sm:gap-4 min-w-0 flex-1">
                <MaterialBadge material={material} size="md" showSub />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                    <h2 className="text-sm sm:text-lg md:text-xl font-black text-slate-900 tracking-wide break-words">
                      {material.nameVi}
                    </h2>
                    <span className="text-[10px] sm:text-xs font-mono font-black px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 shadow-sm whitespace-nowrap shrink-0">
                      {material.formula}
                    </span>
                    <span
                      className={`text-[9px] sm:text-xs px-2.5 py-0.5 rounded-full font-bold border shadow-sm break-words hidden xs:inline ${theme.badge}`}
                    >
                      {material.categoryLabel}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] sm:text-xs text-slate-600 mt-0.5 flex-wrap">
                    <span className="break-words">
                      Mô hình: <strong className="text-blue-700 font-bold">{material.objectNameVi}</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Header Right Actions: Minimize & Close */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => {
                    sound.playClick();
                    setIsMinimized(true);
                  }}
                  className="p-2 sm:p-2.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 rounded-xl transition-all active:scale-95 shadow-sm min-w-[40px] min-h-[40px] flex items-center justify-center cursor-pointer"
                  title="Thu nhỏ để ngắm mô hình 3D"
                  type="button"
                >
                  <ChevronDown size={17} />
                </button>

                <button
                  onClick={() => {
                    sound.playClick();
                    setIsDetailOpen(false);
                  }}
                  className="p-2 sm:p-2.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 rounded-xl transition-all active:scale-95 shadow-sm min-w-[40px] min-h-[40px] flex items-center justify-center cursor-pointer"
                  title="Đóng cửa sổ chi tiết (Esc)"
                  type="button"
                >
                  <X size={17} />
                </button>
              </div>
            </div>

            {/* Navigation Tabs Bar: 4 Pills with Compare Tab */}
            <div className="grid grid-cols-4 gap-1 sm:gap-2 w-full border-b border-slate-200 bg-slate-50 px-2 sm:px-5 py-2 shrink-0">
              <TabButton
                active={activeTab === 'bonds'}
                onClick={() => {
                  sound.playClick();
                  setActiveTab('bonds');
                }}
                icon={Atom}
                label="Cấu trúc & Liên kết"
                mobileLabel="Cấu trúc"
                activeColor="bg-blue-600 text-white border-blue-600 shadow-sm"
              />
              <TabButton
                active={activeTab === 'metrics'}
                onClick={() => {
                  sound.playClick();
                  setActiveTab('metrics');
                }}
                icon={BarChart3}
                label="Chỉ số Cơ - Lý - Hóa"
                mobileLabel="Chỉ số"
                activeColor="bg-blue-600 text-white border-blue-600 shadow-sm"
              />
              <TabButton
                active={activeTab === 'apps'}
                onClick={() => {
                  sound.playClick();
                  setActiveTab('apps');
                }}
                icon={Sparkles}
                label="Ứng dụng Đột phá"
                mobileLabel="Ứng dụng"
                activeColor="bg-blue-600 text-white border-blue-600 shadow-sm"
              />
              <TabButton
                active={activeTab === 'compare'}
                onClick={() => {
                  sound.playClick();
                  setCompareMaterialA(material.id);
                  setActiveTab('compare');
                }}
                icon={Columns2}
                label="So sánh Đối chiếu"
                mobileLabel="So sánh"
                activeColor="bg-blue-600 text-white border-blue-600 shadow-sm"
              />
            </div>

            {/* Modal Scrollable Content */}
            <div className="flex-1 min-h-0 overflow-y-auto p-3.5 sm:p-6 space-y-5 custom-scrollbar bg-slate-50/40">
              {/* ══════════════════════════════════════════════════════════════════
                  TAB 1: CẤU TRÚC TINH THỂ & BẢN CHẤT LIÊN KẾT NGUYÊN TỬ
              ══════════════════════════════════════════════════════════════════ */}
              {activeTab === 'bonds' && (
                <div className="space-y-4">
                  {/* 1. Main Chemical Bonding Card */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 space-y-4 shadow-sm">
                    {/* Header Row: Responsive flex - NEVER squeezes title vertically */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-black shadow-md shadow-blue-500/20 shrink-0">
                          <Atom size={22} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-[11px] font-mono uppercase tracking-wider text-blue-600 font-bold block break-words">
                            Bản chất liên kết hóa học cốt lõi
                          </span>
                          <h4 className="text-sm sm:text-base font-extrabold text-slate-900 leading-snug break-words">
                            {material.molecularInfo.bonds.type}
                          </h4>
                        </div>
                      </div>
                      {material.molecularInfo.bonds.bondEnergy && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 text-xs font-mono font-bold shadow-sm self-start sm:self-auto shrink-0">
                          <Flame size={14} className="text-amber-500" />
                          {material.molecularInfo.bonds.bondEnergy}
                        </span>
                      )}
                    </div>

                    {/* Sub-Parameters Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {material.molecularInfo.bonds.hybridization && (
                        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3 shadow-sm min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                            <Orbit size={18} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-[10px] uppercase font-mono tracking-wider text-slate-500 font-bold break-words leading-tight">
                              Trạng thái lai hóa orbital
                            </div>
                            <div className="text-xs font-bold text-slate-800 mt-0.5 break-words">
                              {material.molecularInfo.bonds.hybridization}
                            </div>
                          </div>
                        </div>
                      )}

                      {material.molecularInfo.bonds.coordinationGeometry && (
                        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3 shadow-sm min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                            <Compass size={18} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-[10px] uppercase font-mono tracking-wider text-slate-500 font-bold break-words leading-tight">
                              Hình học phối trí (Geometry)
                            </div>
                            <div className="text-xs font-bold text-slate-800 mt-0.5 break-words">
                              {material.molecularInfo.bonds.coordinationGeometry}
                            </div>
                          </div>
                        </div>
                      )}

                      {material.molecularInfo.bonds.interlayerForce && (
                        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3 sm:col-span-2 shadow-sm min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                            <Layers3 size={18} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-[10px] uppercase font-mono tracking-wider text-slate-500 font-bold break-words leading-tight">
                              Lực liên kết giữa các tầng lớp (Interlayer Force)
                            </div>
                            <div className="text-xs font-semibold text-slate-700 mt-0.5 leading-relaxed break-words">
                              {material.molecularInfo.bonds.interlayerForce}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Scientific Deep-Dive Description */}
                    {material.molecularInfo.bonds.descriptionVi && (
                      <div className="p-3.5 sm:p-4 rounded-xl bg-blue-50/70 border border-blue-100 leading-relaxed text-xs sm:text-sm text-slate-700">
                        <span className="font-bold text-blue-900 block mb-1">
                          Giải thích cơ chế liên kết lượng tử:
                        </span>
                        {material.molecularInfo.bonds.descriptionVi}
                      </div>
                    )}
                  </div>

                  {/* 2. Crystallographic Parameters */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <SpecCard
                      icon={Layers}
                      label="Kiểu mạng tinh thể"
                      value={material.molecularInfo.latticeType}
                      iconBg="bg-blue-100"
                      iconColor="text-blue-700"
                    />
                    <SpecCard
                      icon={Compass}
                      label="Hệ tinh thể"
                      value={material.molecularInfo.crystalSystem}
                      iconBg="bg-indigo-100"
                      iconColor="text-indigo-700"
                    />
                    <SpecCard
                      icon={Activity}
                      label="Độ dài liên kết"
                      value={material.molecularInfo.bondLength}
                      iconBg="bg-sky-100"
                      iconColor="text-sky-700"
                    />
                  </div>
                </div>
              )}

              {/* ══════════════════════════════════════════════════════════════════
                  TAB 2: CHỈ SỐ CƠ - LÝ - HÓA ĐỊNH LƯỢNG
              ══════════════════════════════════════════════════════════════════ */}
              {activeTab === 'metrics' && (
                <div className="space-y-4">
                  <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 space-y-4 shadow-sm">
                    <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center font-black shadow-md shadow-amber-500/20 shrink-0">
                        <BarChart3 size={22} />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-widest text-amber-600 font-extrabold block">
                          Chỉ số định lượng chuẩn hóa
                        </span>
                        <h4 className="text-sm sm:text-base font-extrabold text-slate-900">
                          Cơ tính & Đặc tính vật lý (Thang điểm 0 - 100)
                        </h4>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <MetricRow
                        label="Độ cứng & Bền cơ học"
                        score={material.metrics.hardness}
                        barGradient="from-blue-600 via-sky-500 to-cyan-400"
                        textColor="text-blue-700"
                        note={material.macroInfo.mechanicalStrength}
                      />
                      <MetricRow
                        label="Độ dẫn nhiệt"
                        score={material.metrics.thermal}
                        barGradient="from-amber-500 via-orange-400 to-yellow-400"
                        textColor="text-amber-700"
                        note={material.macroInfo.thermalConductivity}
                      />
                      <MetricRow
                        label="Độ dẫn điện"
                        score={material.metrics.electrical}
                        barGradient="from-blue-500 via-indigo-400 to-sky-400"
                        textColor="text-blue-700"
                        note={material.macroInfo.electricalConductivity}
                      />
                      <MetricRow
                        label="Khối lượng riêng"
                        score={material.metrics.density}
                        barGradient="from-purple-500 via-fuchsia-400 to-indigo-400"
                        textColor="text-purple-700"
                        note={material.macroInfo.density}
                      />
                      <MetricRow
                        label="Độ trơ hóa học & Chống ăn mòn"
                        score={material.metrics.corrosion}
                        barGradient="from-emerald-500 via-teal-400 to-green-400"
                        textColor="text-emerald-700"
                        note={`${material.metrics.corrosion} / 100 - Khả năng chống chịu axit, kiềm và oxi hóa`}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ══════════════════════════════════════════════════════════════════
                  TAB 3: ỨNG DỤNG ĐỘT PHÁ & BỐI CẢNH ĐỜI SỐNG THỰC TẾ
              ══════════════════════════════════════════════════════════════════ */}
              {activeTab === 'apps' && (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
                      <Sparkles size={15} className="text-blue-600" />
                      Các lĩnh vực ứng dụng then chốt của {material.nameVi}
                    </h4>
                    <div className="grid grid-cols-1 gap-3">
                      {material.macroInfo.applications.map((app, i) => (
                        <div
                          key={i}
                          className="p-4 rounded-2xl bg-white border border-slate-200/90 flex items-start gap-3.5 hover:border-blue-300 transition-colors shadow-sm"
                        >
                          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-black shrink-0 mt-0.5 border border-blue-200/60">
                            <CheckCircle2 size={18} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-mono uppercase tracking-wider text-blue-600 font-extrabold block">
                                Ứng dụng trọng tâm #{i + 1}
                              </span>
                              <span className="text-[9px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-bold">
                                Thực tiễn
                              </span>
                            </div>
                            <p className="text-xs sm:text-sm text-slate-800 font-semibold leading-relaxed mt-1">
                              {app}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Technology Classification Banner */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 space-y-2.5 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold flex items-center gap-1.5">
                        <Award size={14} className="text-blue-600" />
                        Phân loại Khoa học & Công nghệ Vật liệu
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold border shadow-sm ${theme.badge}`}
                      >
                        {material.categoryLabel}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Sự kết hợp giữa liên kết hóa học{' '}
                      <strong className="text-slate-900">{material.molecularInfo.bonds.type}</strong> và cấu trúc ô mạng{' '}
                      <strong className="text-blue-700">{material.molecularInfo.latticeType}</strong> tạo nên những đặc tính cơ lý vượt trội, giúp vật liệu đóng vai trò nền tảng trong đời sống và các ngành công nghệ cao.
                    </p>
                  </div>
                </div>
              )}

              {/* ══════════════════════════════════════════════════════════════════
                  TAB 4: SO SÁNH ĐỐI CHIẾU (DUAL MATRIX - SYNCHRONIZED TAB)
              ══════════════════════════════════════════════════════════════════ */}
              {activeTab === 'compare' && (
                <div className="space-y-5">
                  {/* Selectors Bar */}
                  <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-2.5 sm:gap-3 p-3 rounded-2xl bg-white border border-slate-200 items-center shadow-sm">
                    {/* Material A */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 bg-blue-50/50 p-2.5 rounded-xl border border-blue-200/60 min-w-0">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <MaterialBadge material={matA} size="sm" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[9px] uppercase font-mono tracking-widest text-blue-700 font-bold block">
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
                            className="w-full bg-white text-slate-800 font-bold text-xs focus:outline-none cursor-pointer mt-0.5 px-2 py-1 rounded border border-slate-200 truncate"
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
                        }}
                        className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-extrabold uppercase tracking-wider shrink-0 transition-transform active:scale-95 shadow-sm self-end sm:self-auto cursor-pointer"
                        title="Đặt vật liệu A làm mô hình 3D chính"
                        type="button"
                      >
                        XEM 3D
                      </button>
                    </div>

                    {/* Swap */}
                    <div className="flex justify-center my-0.5 md:my-0">
                      <button
                        onClick={() => {
                          sound.playClick();
                          swapCompareMaterials();
                        }}
                        className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-blue-600 flex items-center justify-center transition-all hover:scale-105 active:rotate-180 cursor-pointer"
                        title="Đổi chỗ hai vật liệu"
                        type="button"
                      >
                        <ArrowRightLeft size={15} />
                      </button>
                    </div>

                    {/* Material B */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 bg-indigo-50/50 p-2.5 rounded-xl border border-indigo-200/60 min-w-0">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <MaterialBadge material={matB} size="sm" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[9px] uppercase font-mono tracking-widest text-indigo-700 font-bold block">
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
                            className="w-full bg-white text-slate-800 font-bold text-xs focus:outline-none cursor-pointer mt-0.5 px-2 py-1 rounded border border-slate-200 truncate"
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
                        }}
                        className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-extrabold uppercase tracking-wider shrink-0 transition-transform active:scale-95 shadow-sm self-end sm:self-auto cursor-pointer"
                        title="Đặt vật liệu B làm mô hình 3D chính"
                        type="button"
                      >
                        XEM 3D
                      </button>
                    </div>
                  </div>

                  {/* Dual 3D View Toggle */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 shadow-sm">
                    <span className="text-xs text-slate-700">
                      Chế độ quan sát 3D: <strong className="text-slate-900">{isDual3DView ? 'Xem hai mô hình song song' : 'Xem mô hình đơn'}</strong>
                    </span>
                    <button
                      onClick={() => {
                        sound.playClick();
                        setIsDual3DView(!isDual3DView);
                      }}
                      className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                        isDual3DView
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                          : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                      }`}
                      type="button"
                    >
                      {isDual3DView ? 'Tắt xem kép 3D' : 'Bật xem kép 3D'}
                    </button>
                  </div>

                  {/* SECTION 1: Bond & Lattice Matrix */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Material A Card */}
                    <div className="p-4 rounded-2xl bg-white border border-blue-200/80 space-y-3 min-w-0 shadow-sm">
                      <div className="flex items-center justify-between gap-2.5 border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          <MaterialBadge material={matA} size="sm" />
                          <div className="min-w-0 flex-1">
                            <span className="text-sm font-black text-slate-900 block truncate whitespace-nowrap leading-tight">{matA.nameVi}</span>
                            <span className="text-[11px] font-mono text-slate-500 block truncate mt-0.5">{matA.formula} · {matA.categoryLabel}</span>
                          </div>
                        </div>
                        {matA.molecularInfo.bonds.bondEnergy && (
                          <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 shrink-0 whitespace-nowrap">
                            {matA.molecularInfo.bonds.bondEnergy.split('(')[0].trim()}
                          </span>
                        )}
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/80">
                        <span className="text-[9px] uppercase font-mono tracking-wider text-blue-600 font-extrabold block">
                          Kiểu liên kết cốt lõi
                        </span>
                        <strong className="text-xs sm:text-sm text-slate-800 block mt-1 leading-snug break-words">
                          {matA.molecularInfo.bonds.type}
                        </strong>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-200/80 min-w-0">
                          <span className="text-[9px] text-slate-400 uppercase font-mono font-bold block tracking-wider leading-tight">
                            Kiểu mạng
                          </span>
                          <strong className="text-slate-800 block mt-1 text-xs font-semibold leading-snug break-words">
                            {matA.molecularInfo.latticeType}
                          </strong>
                        </div>
                        <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-200/80 min-w-0">
                          <span className="text-[9px] text-slate-400 uppercase font-mono font-bold block tracking-wider leading-tight">
                            Hệ tinh thể
                          </span>
                          <strong className="text-slate-800 block mt-1 text-xs font-semibold leading-snug break-words">
                            {matA.molecularInfo.crystalSystem}
                          </strong>
                        </div>
                        <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-200/80 min-w-0">
                          <span className="text-[9px] text-slate-400 uppercase font-mono font-bold block tracking-wider leading-tight">
                            Độ dài liên kết
                          </span>
                          <span className="font-mono text-blue-700 font-bold block mt-1 text-xs leading-snug break-words">
                            {matA.molecularInfo.bondLength}
                          </span>
                        </div>
                        <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-200/80 min-w-0">
                          <span className="text-[9px] text-slate-400 uppercase font-mono font-bold block tracking-wider leading-tight">
                            Góc liên kết
                          </span>
                          <span className="font-mono text-blue-700 font-bold block mt-1 text-xs leading-snug break-words">
                            {matA.molecularInfo.bondAngle}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Material B Card */}
                    <div className="p-4 rounded-2xl bg-white border border-indigo-200/80 space-y-3 min-w-0 shadow-sm">
                      <div className="flex items-center justify-between gap-2.5 border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          <MaterialBadge material={matB} size="sm" />
                          <div className="min-w-0 flex-1">
                            <span className="text-sm font-black text-slate-900 block truncate whitespace-nowrap leading-tight">{matB.nameVi}</span>
                            <span className="text-[11px] font-mono text-slate-500 block truncate mt-0.5">{matB.formula} · {matB.categoryLabel}</span>
                          </div>
                        </div>
                        {matB.molecularInfo.bonds.bondEnergy && (
                          <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 shrink-0 whitespace-nowrap">
                            {matB.molecularInfo.bonds.bondEnergy.split('(')[0].trim()}
                          </span>
                        )}
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/80">
                        <span className="text-[9px] uppercase font-mono tracking-wider text-indigo-600 font-extrabold block">
                          Kiểu liên kết cốt lõi
                        </span>
                        <strong className="text-xs sm:text-sm text-slate-800 block mt-1 leading-snug break-words">
                          {matB.molecularInfo.bonds.type}
                        </strong>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-200/80 min-w-0">
                          <span className="text-[9px] text-slate-400 uppercase font-mono font-bold block tracking-wider leading-tight">
                            Kiểu mạng
                          </span>
                          <strong className="text-slate-800 block mt-1 text-xs font-semibold leading-snug break-words">
                            {matB.molecularInfo.latticeType}
                          </strong>
                        </div>
                        <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-200/80 min-w-0">
                          <span className="text-[9px] text-slate-400 uppercase font-mono font-bold block tracking-wider leading-tight">
                            Hệ tinh thể
                          </span>
                          <strong className="text-slate-800 block mt-1 text-xs font-semibold leading-snug break-words">
                            {matB.molecularInfo.crystalSystem}
                          </strong>
                        </div>
                        <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-200/80 min-w-0">
                          <span className="text-[9px] text-slate-400 uppercase font-mono font-bold block tracking-wider leading-tight">
                            Độ dài liên kết
                          </span>
                          <span className="font-mono text-indigo-700 font-bold block mt-1 text-xs leading-snug break-words">
                            {matB.molecularInfo.bondLength}
                          </span>
                        </div>
                        <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-200/80 min-w-0">
                          <span className="text-[9px] text-slate-400 uppercase font-mono font-bold block tracking-wider leading-tight">
                            Góc liên kết
                          </span>
                          <span className="font-mono text-indigo-700 font-bold block mt-1 text-xs leading-snug break-words">
                            {matB.molecularInfo.bondAngle}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 2: Quantitative Metrics Comparison */}
                  <div className="space-y-3">
                    <span className="text-xs font-mono uppercase tracking-wider text-slate-500 block font-bold">
                      ĐỐI CHIẾU 5 CHỈ SỐ CƠ - LÝ - HÓA (0 - 100)
                    </span>
                    {metricsConfig.map((metric) => {
                      const Icon = metric.icon;
                      const delta = metric.valA - metric.valB;
                      return (
                        <div key={`compare-metric-${metric.key}`} className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-2.5 shadow-sm">
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              <Icon size={15} className="text-slate-500 shrink-0" />
                              <span className="font-bold text-slate-800">{metric.label}</span>
                            </div>
                            <span className="text-[10px] font-mono text-slate-500 shrink-0">
                              Chênh lệch: <strong className={delta > 0 ? 'text-blue-600' : delta < 0 ? 'text-indigo-600' : 'text-slate-500'}>{Math.abs(delta)} điểm</strong>
                            </span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                            <div className="space-y-1.5 min-w-0">
                              <div className="flex justify-between text-[11px] text-slate-700 gap-2">
                                <span className="font-semibold truncate">{matA.nameVi}</span>
                                <span className="font-mono font-bold shrink-0 text-blue-700">{metric.valA}</span>
                              </div>
                              <div className="h-2 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                                <div className="h-full rounded-full bg-blue-600" style={{ width: `${metric.valA}%` }} />
                              </div>
                              <div className="text-[10px] text-slate-500 break-words leading-snug">{metric.textA}</div>
                            </div>
                            <div className="space-y-1.5 min-w-0">
                              <div className="flex justify-between text-[11px] text-slate-700 gap-2">
                                <span className="font-semibold truncate">{matB.nameVi}</span>
                                <span className="font-mono font-bold shrink-0 text-indigo-700">{metric.valB}</span>
                              </div>
                              <div className="h-2 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                                <div className="h-full rounded-full bg-indigo-600" style={{ width: `${metric.valB}%` }} />
                              </div>
                              <div className="text-[10px] text-slate-500 break-words leading-snug">{metric.textB}</div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* SECTION 3: Applications Comparison */}
                  <div className="space-y-3">
                    <span className="text-xs font-mono uppercase tracking-wider text-slate-500 block font-bold">
                      ỨNG DỤNG THỰC TIỄN & ĐỘT PHÁ CÔNG NGHỆ
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div className="p-3.5 rounded-2xl bg-white border border-blue-200/80 space-y-2 shadow-sm min-w-0">
                        <span className="text-[11px] font-black text-blue-700 uppercase font-mono block">
                          Ứng dụng của {matA.nameVi}
                        </span>
                        <ul className="space-y-1.5 text-xs text-slate-700">
                          {matA.macroInfo.applications.map((app, idx) => (
                            <li key={`app-a-${idx}`} className="flex items-start gap-2">
                              <CheckCircle2 size={13} className="text-blue-600 shrink-0 mt-0.5" />
                              <span className="leading-snug break-words">{app}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-white border border-indigo-200/80 space-y-2 shadow-sm min-w-0">
                        <span className="text-[11px] font-black text-indigo-700 uppercase font-mono block">
                          Ứng dụng của {matB.nameVi}
                        </span>
                        <ul className="space-y-1.5 text-xs text-slate-700">
                          {matB.macroInfo.applications.map((app, idx) => (
                            <li key={`app-b-${idx}`} className="flex items-start gap-2">
                              <CheckCircle2 size={13} className="text-indigo-600 shrink-0 mt-0.5" />
                              <span className="leading-snug break-words">{app}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer Controls */}
            <div className="px-3.5 sm:px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3 shrink-0">
              <button
                onClick={() => {
                  sound.playClick();
                  if (activeTab === 'compare') {
                    setActiveTab('bonds');
                  } else {
                    setActiveTab('compare');
                  }
                }}
                className="py-2.5 px-4 sm:px-5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs uppercase tracking-wider flex items-center gap-2 border border-slate-200 shadow-sm transition-all min-h-[44px] cursor-pointer"
                type="button"
              >
                <ArrowRightLeft size={15} className="text-blue-600" />
                <span>{activeTab === 'compare' ? 'Về Hồ sơ Cấu trúc' : 'So sánh Đối chiếu'}</span>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  setIsDetailOpen(false);
                }}
                className="py-2.5 px-5 sm:px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs uppercase tracking-wider transition-all active:scale-95 shadow-md shadow-blue-500/20 min-h-[44px] cursor-pointer"
                type="button"
              >
                Đóng
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function TabButton({
  active,
  onClick,
  icon: Icon,
  label,
  mobileLabel,
  activeColor,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ElementType;
  label: string;
  mobileLabel: string;
  activeColor: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`py-2 px-1.5 sm:px-3 text-xs font-bold border rounded-xl transition-all flex items-center justify-center gap-1.5 min-w-0 min-h-[40px] cursor-pointer ${
        active
          ? `${activeColor}`
          : 'border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100'
      }`}
      type="button"
    >
      <Icon size={15} className="shrink-0" />
      <span className="hidden md:inline truncate">{label}</span>
      <span className="md:hidden truncate text-[11px]">{mobileLabel}</span>
    </button>
  );
}

function SpecCard({
  icon: Icon,
  label,
  value,
  iconBg,
  iconColor,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  iconBg: string;
  iconColor: string;
}) {
  return (
    <div
      className="p-3.5 rounded-2xl bg-white border border-slate-200/90 flex items-start gap-3 shadow-sm min-w-0 h-full"
    >
      <div className={`w-9 h-9 rounded-xl ${iconBg} ${iconColor} flex items-center justify-center shrink-0 shadow-sm`}>
        <Icon size={19} />
      </div>
      <div className="min-w-0 flex-1">
        <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 font-bold block break-words leading-tight">
          {label}
        </span>
        <strong className="text-xs sm:text-sm text-slate-800 font-bold block mt-0.5 leading-snug break-words">
          {value}
        </strong>
      </div>
    </div>
  );
}

function MetricRow({
  label,
  score,
  barGradient,
  textColor,
  note,
}: {
  label: string;
  score: number;
  barGradient: string;
  textColor: string;
  note: string;
}) {
  return (
    <div className="space-y-1.5 min-w-0">
      <div className="flex items-center justify-between text-xs min-w-0 gap-2">
        <span className="text-slate-800 font-bold break-words">{label}</span>
        <span className={`font-mono font-black shrink-0 ${textColor}`}>
          {score}
          <span className="text-slate-400 font-normal text-[10px]"> / 100</span>
        </span>
      </div>
      <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden p-0.5 border border-slate-200">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className={`h-full rounded-full bg-gradient-to-r ${barGradient} shadow-sm`}
        />
      </div>
      <div className="text-[11px] text-slate-500 italic leading-tight break-words">{note}</div>
    </div>
  );
}
