'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore, StoreState } from '@/store/useStore';
import { MATERIAL_MAP } from '@/data/materials';
import { ZOOM_DIST } from '@/components/3d/zoomState';
import { sound } from '@/lib/soundFx';
import {
  Layers,
  ChevronDown,
  ChevronUp,
  Atom,
  Microscope,
  Eye,
  RotateCcw,
} from 'lucide-react';

export default function PictureInPicture() {
  const selectedMaterial = useStore((s: StoreState) => s.selectedMaterial);
  const activeLayer = useStore((s: StoreState) => s.activeLayer);
  const setCameraDistance = useStore((s: StoreState) => s.setCameraDistance);
  const setActiveLayer = useStore((s: StoreState) => s.setActiveLayer);
  const setZoomProgress = useStore((s: StoreState) => s.setZoomProgress);
  const [isMinimized, setIsMinimized] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsMinimized(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const material = MATERIAL_MAP.get(selectedMaterial);
  if (!material) return null;

  const handleZoomTo = (dist: number, layer: 'macro' | 'micro' | 'molecular', progress: number) => {
    sound.playClick();
    window.dispatchEvent(
      new CustomEvent('material-zoom-target', {
        detail: { distance: dist, immediate: false },
      })
    );
    setCameraDistance(dist);
    setActiveLayer(layer);
    setZoomProgress(progress);
  };

  const LAYER_THEMES = {
    macro: {
      color: '#60a5fa',
      border: 'border-blue-400/40',
      bgGlow: 'shadow-blue-500/20',
      pill: 'bg-blue-500/20 text-blue-300',
    },
    micro: {
      color: '#a78bfa',
      border: 'border-purple-400/40',
      bgGlow: 'shadow-purple-500/20',
      pill: 'bg-purple-500/20 text-purple-300',
    },
    molecular: {
      color: '#f472b6',
      border: 'border-pink-400/40',
      bgGlow: 'shadow-pink-500/20',
      pill: 'bg-pink-500/20 text-pink-300',
    },
  };

  const theme = LAYER_THEMES[activeLayer];

  return (
    <div className="fixed right-3 sm:right-5 bottom-[145px] sm:bottom-20 z-30 select-none pip-card pointer-events-auto">
      <motion.div
        layout
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className={`duo-card overflow-hidden shadow-2xl transition-all duration-300`}
        style={{
          width: isMinimized ? 'auto' : '290px',
        }}
      >
        {/* Specular ambient line */}
        <div
          className="h-[3px] w-full"
          style={{
            background: `linear-gradient(90deg, transparent, ${theme.color}, transparent)`,
          }}
        />

        {/* Header Bar */}
        <div className="px-3.5 py-2 flex items-center justify-between gap-2 border-b border-white/10 bg-[#121e25]">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2.5 h-2.5 rounded-full animate-ping shrink-0" style={{ backgroundColor: theme.color }} />
            <span className="text-xs font-extrabold tracking-wider uppercase text-white truncate flex items-center gap-1.5">
              <span>ẢNH TRONG ẢNH</span>
              <span className="text-[10px] font-mono text-cyan-300">· PiP</span>
            </span>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => {
                sound.playClick();
                setIsMinimized(!isMinimized);
              }}
              className="w-6 h-6 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all active:scale-95"
              title={isMinimized ? 'Mở rộng cửa sổ Ảnh trong ảnh' : 'Thu nhỏ'}
            >
              {isMinimized ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          </div>
        </div>

        {/* Minimized View Pill */}
        {isMinimized && (
          <div
            onClick={() => {
              sound.playClick();
              setIsMinimized(false);
            }}
            className="px-3.5 py-2 flex items-center gap-2.5 cursor-pointer hover:bg-white/10 transition-colors"
          >
            <span className="text-xl">{material.icon}</span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white leading-tight">
                {activeLayer === 'macro' ? 'Soi Nano' : activeLayer === 'micro' ? 'Vi mô' : 'Vĩ mô'}
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-[#1cb0f6]/20 text-[#1cb0f6]">
                PiP
              </span>
            </div>
          </div>
        )}


        {/* Expanded Content Body */}
        {!isMinimized && (
          <div className="p-2.5 flex flex-col gap-2">
            {/* Contextual Mode: When looking at Macro Object (Ring/Ingot) -> PiP shows Nano/Micro Preview */}
            {activeLayer === 'macro' && (
              <>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-white/60 flex items-center gap-1">
                    <Microscope size={12} className="text-purple-400" />
                    Kính lúp Phân tử & Ô mạng
                  </span>
                  <span className="px-1.5 py-0.5 rounded-md text-[9px] font-mono bg-purple-500/20 text-purple-300 font-semibold">
                    10⁻¹⁰ m
                  </span>
                </div>

                {/* Micro/Nano Preview Portal */}
                <div className="relative rounded-xl p-2.5 bg-black/40 border border-purple-500/20 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Atom size={14} className="text-pink-400 animate-[spin_8s_linear_infinite]" />
                      Mạng tinh thể {material.formula}
                    </span>
                    <span className="text-[10px] font-mono text-purple-300 font-medium">
                      {material.molecularInfo.crystalSystem.split('(')[0].trim()}
                    </span>
                  </div>

                  <div className="text-[10px] text-white/60 leading-relaxed">
                    Kiểu ô mạng: <span className="text-white font-medium">{material.molecularInfo.latticeType}</span>
                  </div>
                  <div className="text-[10px] text-white/60 leading-relaxed">
                    Liên kết: <span className="text-cyan-300 font-medium">{material.molecularInfo.bonds.type}</span>
                  </div>

                  {/* 1-Tap Teleport Buttons */}
                  <div className="grid grid-cols-2 gap-1.5 pt-1 border-t border-white/5">
                    <button
                      onClick={() => handleZoomTo(ZOOM_DIST.MICRO, 'micro', 0.5)}
                      className="py-1 px-2 rounded-lg bg-purple-600/30 hover:bg-purple-600/50 border border-purple-400/30 text-purple-200 text-[10px] font-semibold flex items-center justify-center gap-1 active:scale-95 transition-all"
                    >
                      <Microscope size={11} />
                      Ô mạng vi mô
                    </button>
                    <button
                      onClick={() => handleZoomTo(ZOOM_DIST.MOLECULAR, 'molecular', 1.0)}
                      className="py-1 px-2 rounded-lg bg-pink-600/30 hover:bg-pink-600/50 border border-pink-400/30 text-pink-200 text-[10px] font-semibold flex items-center justify-center gap-1 active:scale-95 transition-all"
                    >
                      <Atom size={11} />
                      Phân tử nano
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Contextual Mode: When looking at Micro Unit Cell -> Dual PiP */}
            {activeLayer === 'micro' && (
              <>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-white/60 flex items-center gap-1">
                    <Layers size={12} className="text-cyan-400" />
                    Tầng trung gian vi mô
                  </span>
                  <span className="px-1.5 py-0.5 rounded-md text-[9px] font-mono bg-indigo-500/20 text-indigo-300 font-semibold">
                    10⁻⁶ m
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {/* Macro Return Card */}
                  <button
                    onClick={() => handleZoomTo(ZOOM_DIST.MACRO, 'macro', 0)}
                    className="p-2 rounded-xl bg-black/40 hover:bg-blue-600/20 border border-blue-500/20 flex flex-col items-center gap-1 text-center group active:scale-95 transition-all"
                  >
                    <span className="text-xl group-hover:scale-110 transition-transform">{material.icon}</span>
                    <span className="text-[10px] font-bold text-white leading-tight">Vật thể vĩ mô</span>
                    <span className="text-[9px] text-blue-300">Quay lại 🔭</span>
                  </button>

                  {/* Nano Forward Card */}
                  <button
                    onClick={() => handleZoomTo(ZOOM_DIST.MOLECULAR, 'molecular', 1.0)}
                    className="p-2 rounded-xl bg-black/40 hover:bg-pink-600/20 border border-pink-500/20 flex flex-col items-center gap-1 text-center group active:scale-95 transition-all"
                  >
                    <Atom size={20} className="text-pink-400 group-hover:scale-110 transition-transform animate-[spin_6s_linear_infinite]" />
                    <span className="text-[10px] font-bold text-white leading-tight">Phân tử nano</span>
                    <span className="text-[9px] text-pink-300">Phóng vào ⚛️</span>
                  </button>
                </div>
              </>
            )}

            {/* Contextual Mode: When looking at Nano Molecules -> PiP shows Real-world Macro Object Reference */}
            {activeLayer === 'molecular' && (
              <>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-white/60 flex items-center gap-1">
                    <Eye size={12} className="text-blue-400" />
                    Vật thể thực tế vĩ mô
                  </span>
                  <span className="px-1.5 py-0.5 rounded-md text-[9px] font-mono bg-blue-500/20 text-blue-300 font-semibold">
                    10⁻¹ m
                  </span>
                </div>

                {/* Macro Object Reference Portal */}
                <div className="relative rounded-xl p-2.5 bg-black/40 border border-blue-500/20 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-400/30 flex items-center justify-center text-xl shrink-0">
                      {material.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white truncate">{material.objectNameVi}</div>
                      <div className="text-[9.5px] text-white/50 truncate">Ứng dụng vĩ mô thực tế</div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleZoomTo(ZOOM_DIST.MACRO, 'macro', 0)}
                    className="py-1 px-2 rounded-lg bg-blue-600/30 hover:bg-blue-600/50 border border-blue-400/30 text-blue-200 text-[10px] font-semibold shrink-0 active:scale-95 transition-all flex items-center gap-1"
                    title="Trở về vật thể thực tế vĩ mô"
                  >
                    <RotateCcw size={10} />
                    Về Vĩ mô
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
