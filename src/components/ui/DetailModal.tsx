'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore, StoreState } from '@/store/useStore';
import { MATERIAL_MAP } from '@/data/materials';
import {
  X,
  Shield,
  FlaskConical,
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
  Info,
  Activity,
  Layers3,
  Award,
} from 'lucide-react';
import { sound } from '@/lib/soundFx';
import MaterialBadge from '@/components/ui/MaterialBadge';

export default function DetailModal() {
  const isDetailOpen = useStore((s: StoreState) => s.isDetailOpen);
  const setIsDetailOpen = useStore((s: StoreState) => s.setIsDetailOpen);
  const selectedMaterial = useStore((s: StoreState) => s.selectedMaterial);
  const setIsCompareOpen = useStore((s: StoreState) => s.setIsCompareOpen);
  const setCompareMaterialA = useStore((s: StoreState) => s.setCompareMaterialA);

  const [activeTab, setActiveTab] = useState<'bonds' | 'metrics' | 'apps'>('bonds');

  const material = MATERIAL_MAP.get(selectedMaterial);

  if (!isDetailOpen || !material) return null;

  const handleOpenCompare = () => {
    sound.playClick();
    setCompareMaterialA(material.id);
    setIsDetailOpen(false);
    setIsCompareOpen(true);
  };

  // Category Theme Colors & Accents
  const theme =
    material.category === 'metal'
      ? {
          banner: 'from-amber-500/25 via-yellow-600/15 to-orange-700/25',
          border: 'border-amber-400/60',
          accent: 'text-amber-300',
          badge: 'bg-amber-500/20 text-amber-300 border-amber-400/40',
          glow: 'rgba(245, 158, 11, 0.4)',
        }
      : material.category === 'tech'
      ? {
          banner: 'from-cyan-500/25 via-blue-600/15 to-indigo-700/25',
          border: 'border-cyan-400/60',
          accent: 'text-cyan-300',
          badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40',
          glow: 'rgba(6, 182, 212, 0.4)',
        }
      : material.category === 'polymer'
      ? {
          banner: 'from-emerald-500/25 via-teal-600/15 to-green-700/25',
          border: 'border-emerald-400/60',
          accent: 'text-emerald-300',
          badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40',
          glow: 'rgba(16, 185, 129, 0.4)',
        }
      : {
          banner: 'from-sky-500/25 via-blue-600/15 to-purple-700/25',
          border: 'border-sky-400/60',
          accent: 'text-sky-300',
          badge: 'bg-sky-500/20 text-sky-300 border-sky-400/40',
          glow: 'rgba(56, 189, 248, 0.4)',
        };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-5">
        {/* Dim backdrop with blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            sound.playClick();
            setIsDetailOpen(false);
          }}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 16 }}
          transition={{ type: 'spring', damping: 28, stiffness: 350 }}
          className={`relative w-full max-w-3xl max-h-[92dvh] flex flex-col duo-card overflow-hidden z-10 shadow-2xl shadow-black/95 border-2 ${theme.border} bg-slate-950/95`}
        >
          {/* Top candy highlight line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-purple-500 to-amber-400" />

          {/* Modal Header */}
          <div
            className={`px-4 sm:px-6 py-4 border-b-2 border-slate-800/80 bg-gradient-to-r ${theme.banner} flex items-center justify-between shrink-0`}
          >
            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
              <MaterialBadge material={material} size="lg" showSub />
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-base sm:text-xl font-black text-white tracking-wide truncate drop-shadow">
                    {material.nameVi}
                  </h2>
                  <span className="text-[11px] sm:text-xs font-mono font-black px-2.5 py-0.5 rounded-full bg-slate-900/90 text-cyan-300 border border-cyan-400/50 shadow-sm">
                    {material.formula}
                  </span>
                  <span
                    className={`text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full font-bold border shadow-sm ${theme.badge}`}
                  >
                    {material.categoryLabel}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] sm:text-xs text-slate-300 mt-1 flex-wrap">
                  <span>
                    Tên quốc tế: <strong className="text-white">{material.name}</strong>
                  </span>
                  <span className="text-slate-600">|</span>
                  <span>
                    Mô hình 3D: <strong className="text-sky-300">{material.objectNameVi}</strong>
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                sound.playClick();
                setIsDetailOpen(false);
              }}
              className="p-2 sm:p-2.5 bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-white/80 hover:text-white rounded-xl sm:rounded-2xl shrink-0 ml-2 transition-transform hover:scale-105 active:scale-95 shadow-md"
              title="Đóng cửa sổ chi tiết (Esc)"
              type="button"
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation Tabs Bar: Colorful Pills */}
          <div className="grid grid-cols-3 gap-1.5 w-full border-b-2 border-slate-800/80 bg-slate-950 px-3 sm:px-5 py-2 shrink-0">
            <TabButton
              active={activeTab === 'bonds'}
              onClick={() => {
                sound.playClick();
                setActiveTab('bonds');
              }}
              icon={Atom}
              label="Cấu trúc & Bản chất Liên kết"
              mobileLabel="Cấu trúc & Liên kết"
              activeColor="bg-cyan-500/20 text-cyan-300 border-cyan-400/80 shadow-[0_0_12px_rgba(6,182,212,0.35)]"
            />
            <TabButton
              active={activeTab === 'metrics'}
              onClick={() => {
                sound.playClick();
                setActiveTab('metrics');
              }}
              icon={BarChart3}
              label="Chỉ số Cơ - Lý - Hóa"
              mobileLabel="Chỉ số Cơ lý"
              activeColor="bg-amber-500/20 text-amber-300 border-amber-400/80 shadow-[0_0_12px_rgba(245,158,11,0.35)]"
            />
            <TabButton
              active={activeTab === 'apps'}
              onClick={() => {
                sound.playClick();
                setActiveTab('apps');
              }}
              icon={Sparkles}
              label="Ứng dụng Đột phá & Đời sống"
              mobileLabel="Ứng dụng Thực tế"
              activeColor="bg-emerald-500/20 text-emerald-300 border-emerald-400/80 shadow-[0_0_12px_rgba(16,185,129,0.35)]"
            />
          </div>

          {/* Modal Scrollable Content */}
          <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 space-y-5 custom-scrollbar bg-slate-950/70">
            {/* ══════════════════════════════════════════════════════════════════
                TAB 1: CẤU TRÚC TINH THỂ & BẢN CHẤT LIÊN KẾT NGUYÊN TỬ
            ══════════════════════════════════════════════════════════════════ */}
            {activeTab === 'bonds' && (
              <div className="space-y-4">
                {/* 1. Main Chemical Bonding Card */}
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-cyan-950/40 via-slate-900/90 to-blue-950/40 border-2 border-cyan-500/35 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-cyan-500/30">
                        <Atom size={22} />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-extrabold block">
                          Bản chất liên kết hóa học cốt lõi
                        </span>
                        <h4 className="text-sm sm:text-base font-black text-white leading-snug">
                          {material.molecularInfo.bonds.type}
                        </h4>
                      </div>
                    </div>
                    {material.molecularInfo.bonds.bondEnergy && (
                      <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 text-amber-300 border border-amber-500/30 text-xs font-mono font-bold shadow-sm">
                        <Flame size={14} className="text-amber-400" />
                        {material.molecularInfo.bonds.bondEnergy}
                      </span>
                    )}
                  </div>

                  {/* Sub-Parameters Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {material.molecularInfo.bonds.hybridization && (
                      <div className="p-3.5 rounded-xl bg-slate-900/80 border border-cyan-500/30 flex items-start gap-3 shadow-sm">
                        <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center shrink-0">
                          <Orbit size={18} />
                        </div>
                        <div>
                          <div className="text-[10px] uppercase font-mono tracking-wider text-cyan-400/90 font-bold">
                            Trạng thái lai hóa orbital
                          </div>
                          <div className="text-xs font-bold text-white mt-0.5">
                            {material.molecularInfo.bonds.hybridization}
                          </div>
                        </div>
                      </div>
                    )}

                    {material.molecularInfo.bonds.coordinationGeometry && (
                      <div className="p-3.5 rounded-xl bg-slate-900/80 border border-purple-500/30 flex items-start gap-3 shadow-sm">
                        <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center shrink-0">
                          <Compass size={18} />
                        </div>
                        <div>
                          <div className="text-[10px] uppercase font-mono tracking-wider text-purple-400/90 font-bold">
                            Hình học phối trí (Geometry)
                          </div>
                          <div className="text-xs font-bold text-white mt-0.5">
                            {material.molecularInfo.bonds.coordinationGeometry}
                          </div>
                        </div>
                      </div>
                    )}

                    {material.molecularInfo.bonds.bondEnergy && (
                      <div className="sm:hidden p-3.5 rounded-xl bg-slate-900/80 border border-amber-500/30 flex items-start gap-3 shadow-sm">
                        <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0">
                          <Flame size={18} />
                        </div>
                        <div>
                          <div className="text-[10px] uppercase font-mono tracking-wider text-amber-400/90 font-bold">
                            Năng lượng liên kết
                          </div>
                          <div className="text-xs font-mono font-bold text-white mt-0.5">
                            {material.molecularInfo.bonds.bondEnergy}
                          </div>
                        </div>
                      </div>
                    )}

                    {material.molecularInfo.bonds.interlayerForce && (
                      <div className="p-3.5 rounded-xl bg-slate-900/80 border border-emerald-500/30 flex items-start gap-3 sm:col-span-2 shadow-sm">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
                          <Layers3 size={18} />
                        </div>
                        <div>
                          <div className="text-[10px] uppercase font-mono tracking-wider text-emerald-400/90 font-bold">
                            Tương tác liên tầng / Lực liên kết phụ
                          </div>
                          <div className="text-xs font-medium text-slate-200 mt-0.5">
                            {material.molecularInfo.bonds.interlayerForce}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Deep Scientific Explanation */}
                  {material.molecularInfo.bonds.descriptionVi && (
                    <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/60 to-indigo-950/50 border border-blue-400/30 text-xs text-blue-100 leading-relaxed shadow-inner">
                      <div className="flex items-center gap-1.5 font-bold text-cyan-300 mb-1.5 text-[11px] uppercase tracking-wide">
                        <Info size={15} />
                        Cơ chế lượng tử & cấu trúc điện tử:
                      </div>
                      <p>{material.molecularInfo.bonds.descriptionVi}</p>
                    </div>
                  )}
                </div>

                {/* 2. Crystal Lattice Parameters Grid */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-2">
                    <FlaskConical size={15} className="text-purple-400" />
                    Thông số hình học ô mạng & tinh thể học
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <SpecCard
                      icon={Layers}
                      label="Kiểu mạng tinh thể"
                      value={material.molecularInfo.latticeType}
                      gradient="from-indigo-600/15 via-purple-600/10 to-slate-900/90"
                      borderColor="border-indigo-400/40"
                      iconBg="bg-indigo-500/20"
                      iconColor="text-indigo-300"
                    />
                    <SpecCard
                      icon={Compass}
                      label="Hệ tinh thể (Crystal System)"
                      value={material.molecularInfo.crystalSystem}
                      gradient="from-purple-600/15 via-pink-600/10 to-slate-900/90"
                      borderColor="border-purple-400/40"
                      iconBg="bg-purple-500/20"
                      iconColor="text-purple-300"
                    />
                    <SpecCard
                      icon={Atom}
                      label="Độ dài liên kết chính xác"
                      value={material.molecularInfo.bondLength}
                      gradient="from-cyan-600/15 via-teal-600/10 to-slate-900/90"
                      borderColor="border-cyan-400/40"
                      iconBg="bg-cyan-500/20"
                      iconColor="text-cyan-300"
                    />
                    <SpecCard
                      icon={Orbit}
                      label="Góc liên kết nguyên tử"
                      value={material.molecularInfo.bondAngle}
                      gradient="from-emerald-600/15 via-teal-600/10 to-slate-900/90"
                      borderColor="border-emerald-400/40"
                      iconBg="bg-emerald-500/20"
                      iconColor="text-emerald-300"
                    />
                  </div>
                </div>

                {/* 3. Constituent Element Tiles */}
                <div className="p-4 rounded-2xl bg-slate-900/80 border-2 border-slate-800 space-y-2.5 shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-slate-300 font-bold block">
                      Nguyên tố cấu thành ô mạng tinh thể:
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">Bán kính nguyên tử pm</span>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {material.molecularInfo.atomTypes.map((atom, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-800/90 border border-slate-700 shadow-sm hover:border-slate-500 transition-colors"
                      >
                        <span
                          className="w-4 h-4 rounded-full inline-block shadow-md border border-white/20"
                          style={{ backgroundColor: atom.color }}
                        />
                        <span className="font-mono font-black text-sm text-white">
                          {atom.element}
                        </span>
                        <span className="text-[11px] font-mono text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded-md border border-cyan-500/30">
                          r = {(atom.radius * 100).toFixed(0)} pm
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ══════════════════════════════════════════════════════════════════
                TAB 2: CHỈ SỐ CƠ - LÝ - HÓA (ĐỘ CỨNG, NHIỆT, ĐIỆN, ĂN MÒN)
            ══════════════════════════════════════════════════════════════════ */}
            {activeTab === 'metrics' && (
              <div className="space-y-4">
                {/* 5 Normalized Metric Bars with Vibrant Glow */}
                <div className="space-y-3.5 bg-slate-900/80 p-5 rounded-2xl border-2 border-slate-800 shadow-xl">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-2">
                    <Activity size={15} className="text-amber-400" />
                    Thang đo hiệu năng vật liệu chuẩn hóa (0 – 100 điểm)
                  </h4>
                  <MetricRow
                    label="Độ cứng & Bền cơ học"
                    score={material.metrics.hardness}
                    barGradient="from-blue-500 via-sky-400 to-cyan-300"
                    textColor="text-cyan-300"
                    note={material.macroInfo.mechanicalStrength}
                  />
                  <MetricRow
                    label="Độ dẫn nhiệt"
                    score={material.metrics.thermal}
                    barGradient="from-red-500 via-orange-400 to-amber-300"
                    textColor="text-amber-300"
                    note={material.macroInfo.thermalConductivity}
                  />
                  <MetricRow
                    label="Độ dẫn điện"
                    score={material.metrics.electrical}
                    barGradient="from-emerald-500 via-teal-400 to-cyan-300"
                    textColor="text-emerald-300"
                    note={material.macroInfo.electricalConductivity}
                  />
                  <MetricRow
                    label="Khối lượng riêng & Tỷ trọng"
                    score={material.metrics.density}
                    barGradient="from-purple-500 via-fuchsia-400 to-pink-300"
                    textColor="text-purple-300"
                    note={material.macroInfo.density}
                  />
                  <MetricRow
                    label="Chống ăn mòn & Bền hóa học"
                    score={material.metrics.corrosion}
                    barGradient="from-rose-500 via-pink-400 to-red-400"
                    textColor="text-rose-300"
                    note="Độ trơ bề mặt trong môi trường axit, kiềm và nhiệt độ khắc nghiệt"
                  />
                </div>

                {/* Macro Physical Specs Grid */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-2">
                    <Shield size={15} className="text-blue-400" />
                    Thông số cơ lý định lượng thực tế
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <SpecCard
                      icon={Shield}
                      label="Độ bền cơ học"
                      value={material.macroInfo.mechanicalStrength}
                      gradient="from-blue-600/15 via-indigo-600/10 to-slate-900/90"
                      borderColor="border-blue-400/40"
                      iconBg="bg-blue-500/20"
                      iconColor="text-blue-300"
                    />
                    <SpecCard
                      icon={Flame}
                      label="Độ dẫn nhiệt định lượng"
                      value={material.macroInfo.thermalConductivity}
                      gradient="from-amber-600/15 via-orange-600/10 to-slate-900/90"
                      borderColor="border-amber-400/40"
                      iconBg="bg-amber-500/20"
                      iconColor="text-amber-300"
                    />
                    <SpecCard
                      icon={Zap}
                      label="Độ dẫn điện định lượng"
                      value={material.macroInfo.electricalConductivity}
                      gradient="from-cyan-600/15 via-teal-600/10 to-slate-900/90"
                      borderColor="border-cyan-400/40"
                      iconBg="bg-cyan-500/20"
                      iconColor="text-cyan-300"
                    />
                    <SpecCard
                      icon={Layers}
                      label="Khối lượng riêng thực tế"
                      value={material.macroInfo.density}
                      gradient="from-purple-600/15 via-pink-600/10 to-slate-900/90"
                      borderColor="border-purple-400/40"
                      iconBg="bg-purple-500/20"
                      iconColor="text-purple-300"
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
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-2">
                    <Sparkles size={15} className="text-emerald-400" />
                    Các lĩnh vực ứng dụng then chốt của {material.nameVi}
                  </h4>
                  <div className="grid grid-cols-1 gap-3">
                    {material.macroInfo.applications.map((app, i) => (
                      <div
                        key={i}
                        className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900/90 to-teal-950/30 border-2 border-emerald-500/30 flex items-start gap-3.5 hover:border-emerald-400/60 transition-colors shadow-md"
                      >
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 text-slate-950 flex items-center justify-center font-black shrink-0 mt-0.5 shadow-md shadow-emerald-500/30">
                          <CheckCircle2 size={18} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-extrabold block">
                              Ứng dụng trọng tâm #{i + 1}
                            </span>
                            <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                              Thực tế
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm text-slate-100 font-semibold leading-relaxed mt-1">
                            {app}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Technology Classification Banner */}
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900/90 via-blue-950/40 to-slate-900/90 border-2 border-slate-700/80 space-y-2.5 shadow-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5">
                      <Award size={14} className="text-cyan-400" />
                      Phân loại Khoa học & Công nghệ Vật liệu
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold border shadow-sm ${theme.badge}`}
                    >
                      {material.categoryLabel}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Sự kết hợp giữa liên kết hóa học{' '}
                    <strong className="text-white">{material.molecularInfo.bonds.type}</strong> và cấu trúc ô mạng{' '}
                    <strong className="text-cyan-300">{material.molecularInfo.latticeType}</strong> tạo nên những đặc tính cơ lý vượt trội, giúp vật liệu đóng vai trò nền tảng trong đời sống và các ngành công nghệ cao.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer Controls */}
          <div className="px-4 sm:px-6 py-3.5 border-t-2 border-slate-800/80 bg-slate-950 flex items-center justify-between gap-3 shrink-0">
            <button
              onClick={handleOpenCompare}
              className="py-2.5 px-4 sm:px-5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-purple-600/30 transition-transform active:scale-95"
              type="button"
              title="Mở bảng so sánh vật liệu này với vật liệu khác"
            >
              <ArrowRightLeft size={15} />
              <span>So sánh đối chiếu</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                setIsDetailOpen(false);
              }}
              className="py-2.5 px-6 sm:px-8 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-blue-600/30 transition-transform active:scale-95"
              type="button"
            >
              Đóng
            </button>
          </div>
        </motion.div>
      </div>
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
      className={`py-2 px-2 sm:px-3 text-xs font-bold border rounded-xl transition-all flex items-center justify-center gap-1.5 min-w-0 ${
        active
          ? `${activeColor}`
          : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:text-white hover:bg-slate-800/60'
      }`}
      type="button"
    >
      <Icon size={16} className="shrink-0" />
      <span className="hidden sm:inline truncate">{label}</span>
      <span className="sm:hidden truncate text-[11px]">{mobileLabel}</span>
    </button>
  );
}

function SpecCard({
  icon: Icon,
  label,
  value,
  gradient,
  borderColor,
  iconBg,
  iconColor,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  gradient: string;
  borderColor: string;
  iconBg: string;
  iconColor: string;
}) {
  return (
    <div
      className={`p-3.5 rounded-2xl bg-gradient-to-br ${gradient} border-2 ${borderColor} flex items-start gap-3 shadow-md`}
    >
      <div className={`w-9 h-9 rounded-xl ${iconBg} ${iconColor} flex items-center justify-center shrink-0 shadow-sm`}>
        <Icon size={19} />
      </div>
      <div className="min-w-0 flex-1">
        <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-bold block">
          {label}
        </span>
        <strong className="text-xs sm:text-sm text-white font-bold block mt-0.5 leading-snug">
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
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-200 font-semibold">{label}</span>
        <span className={`font-mono font-black ${textColor}`}>
          {score}
          <span className="text-slate-500 font-normal text-[10px]"> / 100</span>
        </span>
      </div>
      <div className="h-2.5 rounded-full bg-slate-800 overflow-hidden p-0.5 border border-slate-700/60">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className={`h-full rounded-full bg-gradient-to-r ${barGradient} shadow-sm`}
        />
      </div>
      <div className="text-[11px] text-slate-400 italic leading-tight">{note}</div>
    </div>
  );
}
