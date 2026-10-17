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

export default function InfoPanel() {
  const selectedMaterial = useStore((s: StoreState) => s.selectedMaterial);
  const setSelectedMaterial = useStore((s: StoreState) => s.setSelectedMaterial);
  const setIsDetailOpen = useStore((s: StoreState) => s.setIsDetailOpen);
  const setShowSidebar = useStore((s: StoreState) => s.setShowSidebar);
  const activeLayer = useStore((s: StoreState) => s.activeLayer);
  const isDual3DView = useStore((s: StoreState) => s.isDual3DView);
  const compareMaterialA = useStore((s: StoreState) => s.compareMaterialA);
  const compareMaterialB = useStore((s: StoreState) => s.compareMaterialB);
  const swapCompareMaterials = useStore((s: StoreState) => s.swapCompareMaterials);

  // Default collapsed on mobile for maximum spaciousness
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  const material = MATERIAL_MAP.get(selectedMaterial);

  if (!material) return null;

  // Previous & Next materials for fast 1-tap switching
  const currentIndex = MATERIALS.findIndex((m) => m.id === selectedMaterial);
  const prevMaterial = MATERIALS[(currentIndex - 1 + MATERIALS.length) % MATERIALS.length];
  const nextMaterial = MATERIALS[(currentIndex + 1) % MATERIALS.length];

  const categoryColorMap: Record<string, { border: string; bg: string; glow: string; text: string }> = {
    crystal: {
      border: 'border-cyan-400/40',
      bg: 'from-cyan-500/20 to-blue-600/10',
      glow: 'shadow-cyan-500/20',
      text: 'text-cyan-300',
    },
    metal: {
      border: 'border-amber-400/40',
      bg: 'from-amber-500/20 to-orange-600/10',
      glow: 'shadow-amber-500/20',
      text: 'text-amber-300',
    },
    nano: {
      border: 'border-purple-400/40',
      bg: 'from-purple-500/20 to-pink-600/10',
      glow: 'shadow-purple-500/20',
      text: 'text-purple-300',
    },
    molecular: {
      border: 'border-emerald-400/40',
      bg: 'from-emerald-500/20 to-teal-600/10',
      glow: 'shadow-emerald-500/20',
      text: 'text-emerald-300',
    },
  };

  const matA = MATERIAL_MAP.get(compareMaterialA);
  const matB = MATERIAL_MAP.get(compareMaterialB);

  const catStyle = categoryColorMap[material.category] || categoryColorMap.crystal;

  return (
    <motion.div
      initial={{ x: -30, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-3.5 sm:top-5 left-3 sm:left-5 z-30 w-[calc(100vw-1.5rem)] sm:w-[430px] md:w-[460px] select-none pointer-events-auto"
    >
      <div className="duo-card p-4 sm:p-5 flex flex-col gap-3 relative overflow-hidden group shadow-2xl">
        {/* Dual View Badge if active */}
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
            >
              Hoán đổi
            </button>
          </div>
        )}

        {/* Row 1: Identity & Primary Title (No Truncation, Generous Space) */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3.5 min-w-0 flex-1">
            {/* Chunky Duolingo-style Icon Container (Click to open material library) */}
            <div
              onClick={() => {
                sound.playClick();
                setShowSidebar(true);
              }}
              className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${catStyle.bg} border-2 border-b-4 ${catStyle.border} shadow-lg flex items-center justify-center text-2xl shrink-0 cursor-pointer active:translate-y-0.5 active:border-b-2 transition-all group/icon relative`}
              title="Bấm để chọn trong 12 vật liệu"
            >
              {material.icon}
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#1e313b] border border-white/30 text-[9px] flex items-center justify-center text-white/80 group-hover/icon:text-white font-bold">
                ▾
              </span>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2
                  onClick={() => {
                    sound.playClick();
                    setShowSidebar(true);
                  }}
                  className="text-base sm:text-lg font-black text-white tracking-wide cursor-pointer hover:text-cyan-300 transition-colors"
                  title={`${material.nameVi} - Bấm để mở danh sách 12 vật liệu`}
                >
                  {material.nameVi}
                </h2>
                <span className="text-xs font-mono px-2 py-0.5 rounded-lg bg-[#1cb0f6]/20 text-[#1cb0f6] border border-[#1cb0f6]/40 font-bold shrink-0">
                  {material.formula}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs font-extrabold ${catStyle.text}`}>{material.categoryLabel}</span>
                <span className="text-white/30 text-xs">•</span>
                <span className="text-[11px] font-extrabold font-mono px-2 py-0.5 rounded-lg bg-white/10 text-white/90 border border-white/15">
                  {activeLayer === 'macro' ? '🔭 Vĩ mô' : activeLayer === 'micro' ? '🔬 Vi mô' : '⚛️ Nano'}
                </span>
              </div>
            </div>
          </div>

          {/* Collapse Toggle */}
          <button
            onClick={() => {
              sound.playClick();
              setIsCollapsed(!isCollapsed);
            }}
            className="w-7 h-7 duo-pill rounded-xl text-white/50 hover:text-white active:scale-95 transition-all flex items-center justify-center shrink-0"
            title={isCollapsed ? 'Mở rộng bảng thông tin' : 'Thu gọn'}
          >
            <span className="text-xs font-mono">{isCollapsed ? '▾' : '▴'}</span>
          </button>
        </div>

        {/* Row 2: Navigation Switcher + Duolingo 3D "Chi tiết" Button */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/10">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                sound.playClick();
                setSelectedMaterial(prevMaterial.id);
              }}
              className="duo-pill px-2.5 py-1.5 rounded-xl flex items-center gap-1 text-xs font-bold text-white/70 hover:text-white"
              title={`Trước: ${prevMaterial.nameVi}`}
            >
              <ChevronLeft size={14} />
              <span className="hidden sm:inline">Trước</span>
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setSelectedMaterial(nextMaterial.id);
              }}
              className="duo-pill px-2.5 py-1.5 rounded-xl flex items-center gap-1 text-xs font-bold text-white/70 hover:text-white"
              title={`Kế tiếp: ${nextMaterial.nameVi}`}
            >
              <span className="hidden sm:inline">Kế tiếp</span>
              <ChevronRight size={14} />
            </button>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              setIsDetailOpen(true);
            }}
            className="duo-btn-base duo-btn-blue text-xs font-black px-4 py-1.5 rounded-xl uppercase tracking-wider flex items-center gap-2 shadow-md"
            title="Xem thông số kỹ thuật chi tiết"
          >
            <Info size={14} className="text-white" />
            <span>Chi tiết Toàn diện</span>
          </button>
        </div>

        {/* Expandable Quick Metric Gauges with Chunky Duolingo Bars */}
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="pt-2 border-t border-white/10"
          >
            <div className="grid grid-cols-3 gap-2.5 bg-[#121e25] p-2.5 sm:p-3 rounded-2xl border border-[#283e4a]">
              <MetricMini
                icon={Shield}
                label="Cơ tính"
                value={material.metrics.hardness}
                colorClass="bg-[#1cb0f6]"
                textClass="text-[#1cb0f6]"
              />
              <MetricMini
                icon={Thermometer}
                label="Nhiệt độ"
                value={material.metrics.thermal}
                colorClass="bg-[#ffc800]"
                textClass="text-[#ffc800]"
              />
              <MetricMini
                icon={Zap}
                label="Dẫn điện"
                value={material.metrics.electrical}
                colorClass="bg-[#58cc02]"
                textClass="text-[#58cc02]"
              />
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

function MetricMini({
  icon: Icon,
  label,
  value,
  colorClass,
  textClass,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: number;
  colorClass: string;
  textClass: string;
}) {
  return (
    <div className="flex flex-col gap-2 p-2.5 sm:p-3 rounded-2xl bg-[#14232b] min-w-0 border-2 border-b-3 border-[#283e4a] shadow-sm">
      <div className="flex items-center justify-between text-xs min-w-0 gap-1.5">
        <span className="text-white/80 flex items-center gap-1.5 font-bold min-w-0">
          <Icon size={13} className={`${textClass} shrink-0`} />
          <span className="truncate">{label}</span>
        </span>
        <span className={`font-mono font-black shrink-0 text-sm ${textClass}`}>{value}</span>
      </div>
      <div className="w-full duo-progress-track h-3">
        <div
          className={`duo-progress-fill ${colorClass}`}
          style={{ width: `${Math.min(100, Math.max(8, value))}%` }}
        />
      </div>
    </div>
  );
}

