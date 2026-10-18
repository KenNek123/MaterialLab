'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Info,
  Columns2,
  Box,
  Camera,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Layers,
} from 'lucide-react';
import { sound } from '@/lib/soundFx';

interface FloatingActionBarProps {
  onOpenDetail: () => void;
  onOpenCompare: () => void;
  isDual3DView: boolean;
  onToggleDual3DView: () => void;
  isCapturingSnapshot: boolean;
  onTriggerSnapshot: () => void;
  cameraAngle: 'iso' | 'top' | 'side';
  onChangeCameraAngle: (angle: 'iso' | 'top' | 'side') => void;
}

export default function FloatingActionBar({
  onOpenDetail,
  onOpenCompare,
  isDual3DView,
  onToggleDual3DView,
  isCapturingSnapshot,
  onTriggerSnapshot,
  cameraAngle,
  onChangeCameraAngle,
}: FloatingActionBarProps) {
  // Collapsible toggle state (Task 2 & Task 7)
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="floating-action-bar-container" aria-label="Thanh công cụ khám phá 3D">
      <AnimatePresence mode="wait">
        {isCollapsed ? (
          // Collapsed State: Sleek 40px Floating Pill Button (Task 7)
          <motion.button
            key="dock-collapsed-pill"
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            onClick={() => {
              sound.playClick();
              setIsCollapsed(false);
            }}
            type="button"
            className="dock-collapsed-pill"
            title="Mở thanh công cụ & hồ sơ chi tiết"
            aria-label="Mở thanh công cụ"
          >
            <span className="dock-pill-sparkle">
              <Sparkles size={14} className="text-cyan-400" />
            </span>
            <span className="dock-pill-text">Công cụ & Hồ sơ</span>
            <span className="dock-pill-chevron">
              <ChevronUp size={15} />
            </span>
          </motion.button>
        ) : (
          // Expanded State: Comprehensive Glassmorphic Bottom Dock
          <motion.nav
            key="dock-expanded-panel"
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 12 }}
            transition={{ type: 'spring', stiffness: 320, damping: 26 }}
            className="floating-action-dock"
            aria-label="Khung công cụ điều khiển"
          >
            {/* Header / Collapse Bar */}
            <div className="dock-header">
              <div className="dock-title-group">
                <span className="dock-live-dot" />
                <span className="dock-title">CÔNG CỤ KHÁM PHÁ</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setIsCollapsed(true);
                }}
                className="dock-toggle-btn"
                title="Thu gọn thanh công cụ để ngắm mô hình 3D"
                aria-label="Thu gọn"
              >
                <ChevronDown size={15} />
                <span className="hidden sm:inline text-[10px] ml-1">Thu gọn</span>
              </button>
            </div>

            {/* Actions Grid / Row */}
            <div className="dock-action-list">
              <button
                className="dock-action-btn"
                onClick={() => {
                  sound.playClick();
                  onOpenDetail();
                }}
                title="Mở hồ sơ khoa học chi tiết & bản chất liên kết nguyên tử"
                type="button"
              >
                <Info size={16} className="text-cyan-400 shrink-0" />
                <span>Hồ sơ chi tiết</span>
              </button>

              <button
                className="dock-action-btn"
                onClick={() => {
                  sound.playClick();
                  onOpenCompare();
                }}
                title="Mở bảng so sánh đa tầng hai vật liệu"
                type="button"
              >
                <Columns2 size={16} className="text-fuchsia-400 shrink-0" />
                <span>So sánh vật liệu</span>
              </button>

              <button
                className={`dock-action-btn ${isDual3DView ? 'is-active' : ''}`}
                onClick={() => {
                  sound.playClick();
                  onToggleDual3DView();
                }}
                title="Xem hai mô hình 3D song song trên màn hình chính"
                type="button"
              >
                <Box size={16} className={isDual3DView ? 'text-cyan-300 shrink-0' : 'text-slate-400 shrink-0'} />
                <span>{isDual3DView ? 'Đang xem kép' : 'Xem hai mô hình'}</span>
              </button>

              <button
                className={`dock-action-btn ${isCapturingSnapshot ? 'opacity-70 cursor-wait' : ''}`}
                disabled={isCapturingSnapshot}
                onClick={() => {
                  if (isCapturingSnapshot) return;
                  sound.playClick();
                  onTriggerSnapshot();
                }}
                title="Chụp ảnh mô hình 3D độ nét cao (Retina High-Res)"
                type="button"
              >
                <Camera size={16} className={isCapturingSnapshot ? 'animate-pulse text-cyan-400 shrink-0' : 'text-emerald-400 shrink-0'} />
                <span>{isCapturingSnapshot ? 'Đang chụp...' : 'Chụp mô hình'}</span>
              </button>
            </div>

            {/* Camera Angle Selector */}
            <div className="dock-view-selector">
              <span className="dock-view-label">Góc nhìn</span>
              <div className="dock-view-group">
                <button
                  className={`dock-view-btn ${cameraAngle === 'iso' ? 'is-active' : ''}`}
                  onClick={() => onChangeCameraAngle('iso')}
                  type="button"
                  title="Góc nhìn 3D đẳng cự (Isometric)"
                >
                  Mô hình 3D
                </button>
                <button
                  className={`dock-view-btn ${cameraAngle === 'top' ? 'is-active' : ''}`}
                  onClick={() => onChangeCameraAngle('top')}
                  type="button"
                  title="Sơ đồ chiếu trực diện 2D (001)"
                >
                  Sơ đồ 2D
                </button>
                <button
                  className={`dock-view-btn ${cameraAngle === 'side' ? 'is-active' : ''}`}
                  onClick={() => onChangeCameraAngle('side')}
                  type="button"
                  title="Góc nhìn cạnh bên (Side view)"
                >
                  Cạnh bên
                </button>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  );
}
