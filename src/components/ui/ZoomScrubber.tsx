'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useStore, StoreState, ZoomLayer } from '@/store/useStore';
import { Atom, Eye, Microscope, Layers, Compass, Box, Grid } from 'lucide-react';
import { sound } from '@/lib/soundFx';

import { progressToDistance, ZOOM_DIST } from '@/components/3d/zoomState';

const STAGES = [
  {
    id: 'macro' as ZoomLayer,
    label: 'Vĩ mô (Vật thể)',
    labelEn: 'Vĩ mô',
    scale: '10⁻¹ m',
    icon: Eye,
    color: '#60a5fa',
    position: 0,
    targetDistance: ZOOM_DIST.MACRO,
  },
  {
    id: 'micro' as ZoomLayer,
    label: 'Vi mô (Ô mạng)',
    labelEn: 'Vi mô',
    scale: '10⁻⁶ m',
    icon: Microscope,
    color: '#a78bfa',
    position: 0.5,
    targetDistance: ZOOM_DIST.MICRO,
  },
  {
    id: 'molecular' as ZoomLayer,
    label: 'Nano (Phân tử)',
    labelEn: 'Nano',
    scale: '10⁻¹⁰ m',
    icon: Atom,
    color: '#f472b6',
    position: 1.0,
    targetDistance: ZOOM_DIST.MOLECULAR,
  },
];

export default function ZoomScrubber() {
  const selectedMaterial = useStore((s: StoreState) => s.selectedMaterial);
  const zoomProgress = useStore((s: StoreState) => s.zoomProgress);
  const activeLayer = useStore((s: StoreState) => s.activeLayer);
  const setActiveLayer = useStore((s: StoreState) => s.setActiveLayer);
  const setZoomProgress = useStore((s: StoreState) => s.setZoomProgress);
  const setCameraDistance = useStore((s: StoreState) => s.setCameraDistance);
  const structureLayerCount = useStore((s: StoreState) => s.structureLayerCount);
  const setStructureLayerCount = useStore((s: StoreState) => s.setStructureLayerCount);
  const cameraAngle = useStore((s: StoreState) => s.cameraAngle);
  const setCameraAngle = useStore((s: StoreState) => s.setCameraAngle);
  const showLatticeCage = useStore((s: StoreState) => s.showLatticeCage);
  const toggleLatticeCage = useStore((s: StoreState) => s.toggleLatticeCage);
  const showMillerPlanes = useStore((s: StoreState) => s.showMillerPlanes);
  const toggleMillerPlanes = useStore((s: StoreState) => s.toggleMillerPlanes);

  const handleAngleChange = (angle: 'iso' | 'top' | 'side') => {
    sound.playClick();
    window.dispatchEvent(
      new CustomEvent('material-camera-angle', {
        detail: { angle },
      })
    );
    setCameraAngle(angle);
  };

  const trackRef = React.useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);

  const updateFromPointer = (clientX: number, immediate: boolean = true) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const clickX = clientX - rect.left;
    const progress = Math.max(0, Math.min(1, clickX / rect.width));
    const dist = progressToDistance(progress);

    window.dispatchEvent(
      new CustomEvent('material-zoom-target', {
        detail: { distance: dist, immediate },
      })
    );
    setCameraDistance(dist);
    setZoomProgress(progress);
    if (progress < 0.3) setActiveLayer('macro');
    else if (progress < 0.7) setActiveLayer('micro');
    else setActiveLayer('molecular');
  };

  const handleStageClick = (dist: number, layer: ZoomLayer, position: number) => {
    sound.playClick();
    window.dispatchEvent(
      new CustomEvent('material-zoom-target', {
        detail: { distance: dist, immediate: false },
      })
    );
    setCameraDistance(dist);
    setActiveLayer(layer);
    setZoomProgress(position);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
    setIsDragging(true);
    updateFromPointer(e.clientX, true);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      updateFromPointer(e.clientX, true);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {}
      setIsDragging(false);
    }
  };

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3, type: 'spring', stiffness: 220, damping: 25 }}
      className="fixed bottom-3.5 sm:bottom-5 left-1/2 -translate-x-1/2 z-30 w-[calc(100vw-1.5rem)] max-w-xl select-none pointer-events-auto"
    >
      <div className="duo-card p-3 sm:p-4 flex flex-col items-center gap-2.5 sm:gap-3 relative shadow-2xl">
        {/* 3 Stage Mode Selectors with Chunky Duolingo 3D Buttons */}
        <div className="grid grid-cols-3 w-full gap-2 sm:gap-2.5">
          {STAGES.map((stage) => {
            const Icon = stage.icon;
            const isActive = activeLayer === stage.id;

            // Distinctive Duolingo candy styling for each stage
            let activeClass = '';
            if (isActive) {
              if (stage.id === 'macro') {
                activeClass = 'bg-[#1cb0f6] border-[#1cb0f6] border-b-[#1899d6] text-white shadow-lg shadow-[#1cb0f6]/30';
              } else if (stage.id === 'micro') {
                activeClass = 'bg-[#ce82ff] border-[#ce82ff] border-b-[#a855f7] text-white shadow-lg shadow-[#ce82ff]/30';
              } else {
                activeClass = 'bg-[#58cc02] border-[#58cc02] border-b-[#46a302] text-white shadow-lg shadow-[#58cc02]/30';
              }
            } else {
              activeClass =
                'bg-[#182830] border-[#2b4452] border-b-[#16242c] text-white/70 hover:text-white hover:border-[#3d5e71] hover:bg-[#1e343f]';
            }

            return (
              <button
                key={stage.id}
                onClick={() => handleStageClick(stage.targetDistance, stage.id, stage.position)}
                className={`py-2 sm:py-2.5 px-2 sm:px-3 rounded-2xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-1.5 sm:gap-2 transition-all border-2 border-b-4 active:translate-y-[2px] active:border-b-2 shrink-0 ${activeClass}`}
              >
                <Icon size={16} className="shrink-0" />
                <span className="truncate sm:hidden">{stage.labelEn}</span>
                <span className="truncate hidden sm:inline">{stage.label}</span>
                <span className="text-[10px] font-mono opacity-70 font-semibold shrink-0 hidden md:inline">
                  ({stage.scale})
                </span>
              </button>
            );
          })}
        </div>

        {/* Chunky Duolingo Scrubber Slider Track */}
        <div className="relative w-full px-2 sm:px-3 py-1 flex items-center">
          <div
            ref={trackRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className="relative w-full h-3 sm:h-3.5 duo-progress-track cursor-pointer group flex items-center touch-none select-none border border-[#2b4452]"
          >
            {/* Chunky Gradient progress fill */}
            <div
              className="absolute top-0 left-0 h-full duo-progress-fill transition-all duration-75"
              style={{
                width: `${zoomProgress * 100}%`,
                background: `linear-gradient(90deg, #1cb0f6 0%, #ce82ff 50%, #58cc02 100%)`,
              }}
            />

            {/* Stage waypoint markers */}
            {STAGES.map((stage) => (
              <button
                key={stage.id}
                onClick={(e) => {
                  e.stopPropagation();
                  handleStageClick(stage.targetDistance, stage.id, stage.position);
                }}
                className="absolute p-2.5 -m-2.5 group/marker z-20 focus:outline-none"
                style={{ left: `${stage.position * 100}%`, transform: 'translate(-50%, 0)' }}
                title={`Chuyển tới ${stage.label}`}
              >
                <div
                  className={`w-3.5 h-3.5 rounded-full border-2 transition-all duration-300 ${
                    activeLayer === stage.id
                      ? 'scale-125 border-white shadow-[0_0_12px_#fff] bg-white'
                      : 'border-white/50 bg-[#121e25] group-hover/marker:border-white'
                  }`}
                />
              </button>
            ))}

            {/* Big Tactile Duolingo Thumb Slider */}
            <div
              className={`absolute w-6 h-6 rounded-full bg-white shadow-[0_4px_14px_rgba(0,0,0,0.6)] border-4 border-[#16242c] pointer-events-none z-10 ${
                isDragging ? 'scale-115' : 'transition-all duration-150 ease-out'
              }`}
              style={{ left: `${zoomProgress * 100}%`, transform: 'translateX(-50%)' }}
            />
          </div>
        </div>

        {/* Contextual Micro & Nano Controls Bar: Layers + Lattice Cage + Miller Planes + Camera Angles */}
        {(activeLayer === 'micro' || activeLayer === 'molecular') && (
          <div className="flex items-center justify-between w-full px-2 pt-2.5 pb-0.5 border-t border-white/10 gap-2.5 flex-wrap sm:flex-nowrap">
            {/* Left Tools: Structure Layers & Crystallography Toggles */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* 1-3 Layers Switcher (Nano mode only) */}
              {activeLayer === 'molecular' && (
                <div className="flex items-center gap-1.5 bg-[#121e25] px-2 py-1 rounded-xl border border-[#2b4452]">
                  <span className="text-[11px] text-white/60 flex items-center gap-1 font-bold">
                    <Layers size={13} className="text-[#58cc02] shrink-0" />
                    <span className="hidden sm:inline">Tầng:</span>
                  </span>
                  <div className="flex items-center gap-1">
                    {([1, 2, 3] as const).map((num) => {
                      const label = `${num}`;

                      const isActive = structureLayerCount === num;
                      const unitName =
                        selectedMaterial === 'cnt'
                          ? 'vách đồng trục (SWCNT/DWCNT/MWCNT)'
                          : ['teflon', 'rubber', 'kevlar'].includes(selectedMaterial)
                          ? 'chuỗi sợi phân tử'
                          : selectedMaterial === 'buckyball'
                          ? 'quả bóng C60 cụm Fullerite'
                          : 'tầng/lớp tinh thể';

                      return (
                        <button
                          key={num}
                          onClick={() => {
                            sound.playClick();
                            setStructureLayerCount(num);
                          }}
                          className={`px-2 py-0.5 rounded-lg text-xs font-mono font-extrabold border-2 border-b-3 transition-all active:translate-y-0.5 ${
                            isActive
                              ? 'bg-[#58cc02] border-[#58cc02] border-b-[#46a302] text-white shadow-sm'
                              : 'bg-[#182830] border-[#283e4a] border-b-[#16242c] text-white/60 hover:text-white'
                          }`}
                          title={`Cấu trúc ${num} ${unitName}`}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Crystallography Toggles: Lattice Cage + Miller Planes */}
              <div className="flex items-center gap-1.5 bg-[#121e25] px-2 py-1 rounded-xl border border-[#2b4452]">
                <button
                  onClick={() => {
                    sound.playClick();
                    toggleLatticeCage();
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-extrabold border-2 border-b-3 transition-all active:translate-y-0.5 flex items-center gap-1.5 ${
                    showLatticeCage
                      ? 'bg-[#1cb0f6] border-[#1cb0f6] border-b-[#1899d6] text-white shadow-sm'
                      : 'bg-[#182830] border-[#283e4a] border-b-[#16242c] text-white/60 hover:text-white'
                  }`}
                  title="Bật/Tắt Khung định hướng tinh thể (Unit Cell Bounding Cage)"
                >
                  <Box size={13} />
                  <span>Khung</span>
                </button>

                <button
                  onClick={() => {
                    sound.playClick();
                    toggleMillerPlanes();
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-extrabold border-2 border-b-3 transition-all active:translate-y-0.5 flex items-center gap-1.5 ${
                    showMillerPlanes
                      ? 'bg-[#ce82ff] border-[#ce82ff] border-b-[#a855f7] text-white shadow-sm'
                      : 'bg-[#182830] border-[#283e4a] border-b-[#16242c] text-white/60 hover:text-white'
                  }`}
                  title="Bật/Tắt Các Mặt phẳng Tinh thể Miller (100) / (111)"
                >
                  <Grid size={13} />
                  <span>Mặt (hkl)</span>
                </button>
              </div>
            </div>

            {/* Right Tools: Camera Angle Presets (3D / Top / Side) */}
            <div className="flex items-center gap-1.5 bg-[#121e25] px-2 py-1 rounded-xl border border-[#2b4452] shrink-0">
              <span className="text-[11px] text-white/60 flex items-center gap-1 font-bold">
                <Compass size={13} className="text-[#1cb0f6] shrink-0" />
                <span className="hidden sm:inline">Góc:</span>
              </span>
              <button
                onClick={() => handleAngleChange('iso')}
                className={`px-2.5 py-1 rounded-lg text-xs font-extrabold border-2 border-b-3 transition-all active:translate-y-0.5 ${
                  cameraAngle === 'iso'
                    ? 'bg-[#1cb0f6] border-[#1cb0f6] border-b-[#1899d6] text-white shadow-sm'
                    : 'bg-[#182830] border-[#283e4a] border-b-[#16242c] text-white/60 hover:text-white'
                }`}
                title="Góc nhìn 3D Isometric"
              >
                🌐 3D
              </button>
              <button
                onClick={() => handleAngleChange('top')}
                className={`px-2.5 py-1 rounded-lg text-xs font-extrabold border-2 border-b-3 transition-all active:translate-y-0.5 ${
                  cameraAngle === 'top'
                    ? 'bg-[#1cb0f6] border-[#1cb0f6] border-b-[#1899d6] text-white shadow-sm'
                    : 'bg-[#182830] border-[#283e4a] border-b-[#16242c] text-white/60 hover:text-white'
                }`}
                title="Nhìn từ đỉnh xuống"
              >
                ⬇️ Đỉnh
              </button>
              <button
                onClick={() => handleAngleChange('side')}
                className={`px-2.5 py-1 rounded-lg text-xs font-extrabold border-2 border-b-3 transition-all active:translate-y-0.5 ${
                  cameraAngle === 'side'
                    ? 'bg-[#1cb0f6] border-[#1cb0f6] border-b-[#1899d6] text-white shadow-sm'
                    : 'bg-[#182830] border-[#283e4a] border-b-[#16242c] text-white/60 hover:text-white'
                }`}
                title="Nhìn cạnh bên"
              >
                ↔️ Bên
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

