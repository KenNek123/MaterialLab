'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore, StoreState } from '@/store/useStore';
import { MATERIAL_MAP } from '@/data/materials';
import {
  X,
  Shield,
  Thermometer,
  Zap,
  Weight,
  FlaskConical,
  Grid3X3,
  Ruler,
  TriangleRight,
  GitCompare,
  BarChart3,
  Layers,
  Sparkles,
  Info,
  CheckCircle2,
  Atom,
} from 'lucide-react';
import { sound } from '@/lib/soundFx';

export default function DetailModal() {
  const isDetailOpen = useStore((s: StoreState) => s.isDetailOpen);
  const setIsDetailOpen = useStore((s: StoreState) => s.setIsDetailOpen);
  const selectedMaterial = useStore((s: StoreState) => s.selectedMaterial);
  const setIsCompareOpen = useStore((s: StoreState) => s.setIsCompareOpen);
  const setCompareMaterialA = useStore((s: StoreState) => s.setCompareMaterialA);

  const [activeTab, setActiveTab] = useState<'macro' | 'crystal' | 'metrics'>('macro');

  const material = MATERIAL_MAP.get(selectedMaterial);

  if (!isDetailOpen || !material) return null;

  const handleOpenCompare = () => {
    sound.playClick();
    setCompareMaterialA(material.id);
    setIsDetailOpen(false);
    setIsCompareOpen(true);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5">
        {/* Dim backdrop with blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            sound.playClick();
            setIsDetailOpen(false);
          }}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 28, stiffness: 350 }}
          className="relative w-full max-w-3xl max-h-[90dvh] flex flex-col duo-card overflow-hidden z-10 shadow-2xl shadow-black/90"
        >
          {/* Top candy highlight line */}
          <div className="absolute top-0 left-8 right-8 h-1 bg-gradient-to-r from-[#1cb0f6] via-[#ce82ff] to-[#58cc02] rounded-full opacity-80" />

          {/* Modal Header */}
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b-2 border-slate-800/80 flex items-center justify-between bg-slate-900/60 shrink-0">
            <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
              <div className="w-10 h-10 sm:w-13 sm:h-13 rounded-2xl bg-[#1cb0f6]/15 border-2 border-b-4 border-[#1cb0f6]/40 flex items-center justify-center text-2xl sm:text-3xl shadow-lg shrink-0">
                {material.icon}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                  <h2 className="text-base sm:text-xl font-black text-white tracking-wide truncate">
                    {material.nameVi}
                  </h2>
                  <span className="text-[10px] sm:text-xs font-mono font-bold px-2 py-0.5 rounded-xl bg-[#1cb0f6]/20 text-[#1cb0f6] border border-[#1cb0f6]/40">
                    {material.formula}
                  </span>
                  <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-xl bg-slate-800 text-white/70 border border-slate-700 font-semibold">
                    {material.categoryLabel}
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-white/60 mt-0.5 truncate">
                  Tên: <span className="text-white font-bold">{material.name}</span> • Mô phỏng: <span className="text-white font-bold">{material.objectNameVi}</span>
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                sound.playClick();
                setIsDetailOpen(false);
              }}
              className="duo-btn-base p-2 sm:p-2.5 bg-slate-800 hover:bg-slate-700 border-slate-700 border-b-slate-950 text-white/80 hover:text-white rounded-xl sm:rounded-2xl shrink-0 ml-2"
              title="Đóng cửa sổ chi tiết (Esc)"
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation Tabs Bar */}
          <div className="flex border-b-2 border-slate-800/80 bg-slate-950/80 px-3 sm:px-6 gap-1 sm:gap-2 pt-2 sm:pt-2.5 shrink-0 overflow-x-auto custom-scrollbar">
            <TabButton
              active={activeTab === 'macro'}
              onClick={() => {
                sound.playClick();
                setActiveTab('macro');
              }}
              icon={Shield}
              label="Cơ lý & Ứng dụng"
              mobileLabel="Ứng dụng"
              color="text-[#1cb0f6]"
              activeBorder="border-[#1cb0f6]"
            />
            <TabButton
              active={activeTab === 'crystal'}
              onClick={() => {
                sound.playClick();
                setActiveTab('crystal');
              }}
              icon={FlaskConical}
              label="Cấu trúc Tinh thể & Hóa học"
              mobileLabel="Cấu trúc"
              color="text-[#ce82ff]"
              activeBorder="border-[#ce82ff]"
            />
            <TabButton
              active={activeTab === 'metrics'}
              onClick={() => {
                sound.playClick();
                setActiveTab('metrics');
              }}
              icon={BarChart3}
              label="Thang đo 100 Chỉ số"
              mobileLabel="Chỉ số 100"
              color="text-[#58cc02]"
              activeBorder="border-[#58cc02]"
            />
          </div>

          {/* Modal Scrollable Content */}
          <div className="flex-1 min-h-0 overflow-y-auto p-5 sm:p-6 space-y-6 custom-scrollbar">
            {activeTab === 'macro' && (
              <div className="space-y-5">
                {/* Applications Section */}
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-white/50 mb-3 flex items-center gap-2">
                    <Sparkles size={14} className="text-blue-400" />
                    Lĩnh vực ứng dụng thực tế
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {material.macroInfo.applications.map((app, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-2xl bg-blue-500/[0.06] border border-blue-400/20 flex items-start gap-2.5"
                      >
                        <CheckCircle2 size={16} className="text-blue-400 shrink-0 mt-0.5" />
                        <span className="text-xs text-blue-100 font-medium leading-relaxed">
                          {app}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Macro Physical Specs Grid */}
                <div className="pt-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-white/50 mb-3 flex items-center gap-2">
                    <Shield size={14} className="text-blue-400" />
                    Thông số vật lý vĩ mô
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <SpecCard
                      icon={Shield}
                      label="Độ bền cơ học & Độ cứng"
                      value={material.macroInfo.mechanicalStrength}
                      gradient="from-blue-500/10 to-indigo-500/10"
                      borderColor="border-blue-400/25"
                      iconColor="text-blue-400"
                    />
                    <SpecCard
                      icon={Thermometer}
                      label="Độ dẫn nhiệt"
                      value={material.macroInfo.thermalConductivity}
                      gradient="from-amber-500/10 to-orange-500/10"
                      borderColor="border-amber-400/25"
                      iconColor="text-amber-400"
                    />
                    <SpecCard
                      icon={Zap}
                      label="Độ dẫn điện"
                      value={material.macroInfo.electricalConductivity}
                      gradient="from-cyan-500/10 to-teal-500/10"
                      borderColor="border-cyan-400/25"
                      iconColor="text-cyan-400"
                    />
                    <SpecCard
                      icon={Weight}
                      label="Khối lượng riêng"
                      value={material.macroInfo.density}
                      gradient="from-purple-500/10 to-pink-500/10"
                      borderColor="border-purple-400/25"
                      iconColor="text-purple-400"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'crystal' && (
              <div className="space-y-5">
                {/* Crystal Geometry Specs */}
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-white/50 mb-3 flex items-center gap-2">
                    <Grid3X3 size={14} className="text-purple-400" />
                    Hình học ô mạng tinh thể
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <SpecCard
                      icon={Grid3X3}
                      label="Kiểu mạng tinh thể"
                      value={material.molecularInfo.latticeType}
                      gradient="from-purple-500/10 to-indigo-500/10"
                      borderColor="border-purple-400/25"
                      iconColor="text-purple-400"
                    />
                    <SpecCard
                      icon={Layers}
                      label="Hệ tinh thể không gian"
                      value={material.molecularInfo.crystalSystem}
                      gradient="from-purple-500/10 to-pink-500/10"
                      borderColor="border-purple-400/25"
                      iconColor="text-purple-400"
                    />
                    <SpecCard
                      icon={Ruler}
                      label="Độ dài liên kết nguyên tử"
                      value={material.molecularInfo.bondLength}
                      gradient="from-purple-500/10 to-blue-500/10"
                      borderColor="border-purple-400/25"
                      iconColor="text-purple-400"
                    />
                    <SpecCard
                      icon={TriangleRight}
                      label="Góc liên kết hóa trị"
                      value={material.molecularInfo.bondAngle}
                      gradient="from-purple-500/10 to-cyan-500/10"
                      borderColor="border-purple-400/25"
                      iconColor="text-purple-400"
                    />
                  </div>
                </div>

                {/* Atoms & Bonding */}
                <div className="pt-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-white/50 mb-3 flex items-center gap-2">
                    <Atom size={14} className="text-purple-400" />
                    Thành phần nguyên tử CPK & Bản chất liên kết
                  </h4>
                  <div className="space-y-2.5">
                    {material.molecularInfo.atomTypes.map((atom, i) => (
                      <div
                        key={i}
                        className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3.5">
                          <div
                            className="w-6 h-6 rounded-full shadow-lg border border-white/20"
                            style={{
                              backgroundColor: atom.color,
                              boxShadow: `0 0 12px ${atom.color}90`,
                            }}
                          />
                          <div>
                            <span className="text-sm font-bold text-white font-mono">
                              Nguyên tố: {atom.element}
                            </span>
                            <span className="text-xs text-white/40 block">
                              Màu chuẩn hóa CPK: {atom.color}
                            </span>
                          </div>
                        </div>
                        <span className="text-xs text-white/80 font-mono px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 font-semibold">
                          Bán kính r = {atom.radius} Å
                        </span>
                      </div>
                    ))}

                    <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center gap-3.5">
                      <div
                        className="w-8 h-2.5 rounded-full shrink-0 shadow-md"
                        style={{ backgroundColor: material.molecularInfo.bonds.color }}
                      />
                      <div>
                        <span className="text-xs font-semibold text-white">Kiểu liên kết:</span>
                        <p className="text-xs text-white/70 font-medium">{material.molecularInfo.bonds.type}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'metrics' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-white/50">
                  <span className="font-semibold uppercase tracking-wider flex items-center gap-2">
                    <BarChart3 size={14} className="text-cyan-400" />
                    Bộ chỉ số đo lường chuẩn hóa
                  </span>
                  <span>Thang 0 - 100 điểm</span>
                </div>

                <div className="space-y-3">
                  <MetricRow
                    label="Độ cứng & Khả năng chịu lực"
                    score={material.metrics.hardness}
                    color="#3b82f6"
                    gradient="from-blue-600 to-indigo-500"
                    note={material.macroInfo.mechanicalStrength}
                  />
                  <MetricRow
                    label="Độ dẫn nhiệt & Tản nhiệt"
                    score={material.metrics.thermal}
                    color="#f59e0b"
                    gradient="from-amber-500 to-orange-500"
                    note={material.macroInfo.thermalConductivity}
                  />
                  <MetricRow
                    label="Độ dẫn điện & Truyền dẫn"
                    score={material.metrics.electrical}
                    color="#06b6d4"
                    gradient="from-cyan-500 to-teal-500"
                    note={material.macroInfo.electricalConductivity}
                  />
                  <MetricRow
                    label="Khối lượng riêng & Mật độ"
                    score={material.metrics.density}
                    color="#a855f7"
                    gradient="from-purple-500 to-pink-500"
                    note={material.macroInfo.density}
                  />
                  <MetricRow
                    label="Độ chống ăn mòn & Trơ hóa học"
                    score={material.metrics.corrosion}
                    color="#10b981"
                    gradient="from-emerald-500 to-green-500"
                    note="Độ ổn định trước axit, bazơ và oxy hóa khí quyển"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="p-4 sm:p-5 px-6 sm:px-7 border-t-2 border-slate-800/80 bg-slate-950/95 backdrop-blur-xl z-20 relative flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 shrink-0">
            <button
              onClick={handleOpenCompare}
              className="w-full sm:w-auto duo-btn-base duo-btn-purple py-3 px-6 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-lg"
            >
              <GitCompare size={16} />
              <span>So sánh vật liệu này với chất khác</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                setIsDetailOpen(false);
              }}
              className="w-full sm:w-auto duo-btn-base py-3 px-6 bg-slate-800 hover:bg-slate-700 border-slate-700 border-b-slate-950 text-white/90 hover:text-white text-xs font-bold transition-colors text-center"
            >
              Đóng lại
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
  color,
  activeBorder,
}: {
  active: boolean;
  onClick: () => void;
  icon: any;
  label: string;
  mobileLabel?: string;
  color: string;
  activeBorder: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`pb-3 px-3 sm:px-4 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 sm:gap-2 border-b-4 transition-all relative shrink-0 ${
        active ? `${activeBorder} text-white` : 'border-transparent text-white/40 hover:text-white/70'
      }`}
    >
      <Icon size={16} className={active ? color : 'text-white/40'} />
      <span className="hidden sm:inline">{label}</span>
      <span className="sm:hidden">{mobileLabel ?? label}</span>
      {active && (
        <motion.div
          layoutId="tab-glow"
          className="absolute bottom-0 left-0 right-0 h-[2px] bg-white shadow-[0_0_8px_#fff]"
        />
      )}
    </button>
  );
}

function SpecCard({
  icon: Icon,
  label,
  value,
  gradient,
  borderColor,
  iconColor,
}: {
  icon: any;
  label: string;
  value: string;
  gradient: string;
  borderColor: string;
  iconColor: string;
}) {
  return (
    <div
      className={`p-4 rounded-2xl bg-gradient-to-br ${gradient} border-2 border-b-4 ${borderColor} flex items-start gap-3.5 shadow-md`}
    >
      <div className="p-2.5 rounded-xl bg-slate-950/60 border border-white/10 shrink-0">
        <Icon size={18} className={iconColor} />
      </div>
      <div className="min-w-0 flex-1">
        <span className="text-[11px] text-white/60 block font-bold uppercase tracking-wider">{label}</span>
        <p className="text-xs sm:text-sm font-extrabold text-white mt-0.5 leading-snug break-words">
          {value}
        </p>
      </div>
    </div>
  );
}

function MetricRow({
  label,
  score,
  color,
  gradient,
  note,
}: {
  label: string;
  score: number;
  color: string;
  gradient: string;
  note: string;
}) {
  return (
    <div className="p-4 rounded-2xl bg-slate-900/60 border-2 border-b-4 border-slate-800/80 space-y-2.5 shadow-sm">
      <div className="flex items-center justify-between text-xs sm:text-sm">
        <span className="font-extrabold text-white tracking-wide">{label}</span>
        <span className="font-mono font-black text-sm sm:text-base" style={{ color }}>
          {score} <span className="text-xs font-bold text-white/40">/ 100</span>
        </span>
      </div>

      <div className="w-full h-3 duo-progress-track">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className={`h-full rounded-full bg-gradient-to-r ${gradient} duo-progress-fill`}
        />
      </div>

      <p className="text-[11px] sm:text-xs text-white/50">{note}</p>
    </div>
  );
}
