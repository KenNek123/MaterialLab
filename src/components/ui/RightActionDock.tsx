'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Camera,
  Eye,
  EyeOff,
  Plus,
  Minus,
  ChevronDown,
  ChevronUp,
  Box,
  Layers,
  Columns,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { useStore, StoreState } from '@/store/useStore';
import { ZOOM_DIST } from '@/components/3d/zoomState';
import { sound } from '@/lib/soundFx';

interface RightActionDockProps {
  cameraAngle: 'iso' | 'top' | 'side';
  onChangeCameraAngle: (angle: 'iso' | 'top' | 'side') => void;
}

export default function RightActionDock({
  cameraAngle,
  onChangeCameraAngle,
}: RightActionDockProps) {
  const isZenMode = useStore((s: StoreState) => s.isZenMode);
  const toggleZenMode = useStore((s: StoreState) => s.toggleZenMode);
  const triggerSnapshot = useStore((s: StoreState) => s.triggerSnapshot);
  const isCapturingSnapshot = useStore((s: StoreState) => s.isCapturingSnapshot);
  const isBottomSheetOpen = useStore((s: StoreState) => s.isBottomSheetOpen);
  const isRightDockHidden = useStore((s: StoreState) => s.isRightDockHidden);
  const setIsRightDockHidden = useStore((s: StoreState) => s.setIsRightDockHidden);

  // Collapsible Zoom cluster state within dock
  const [isZoomExpanded, setIsZoomExpanded] = useState(true);

  // Zoom logic with smooth damping & clean cancelation
  const zoomTargetRef = useRef<number | null>(null);
  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const holdIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopZoom = useCallback(() => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current);
      holdIntervalRef.current = null;
    }
  }, []);

  const handleZoom = useCallback((direction: 'in' | 'out') => {
    sound.playClick();
    const currentDist = useStore.getState().cameraDistance || 8.0;
    const baseDist = zoomTargetRef.current !== null ? zoomTargetRef.current : currentDist;
    const step = 1.6;
    const nextDist =
      direction === 'in'
        ? Math.max(ZOOM_DIST.MIN, baseDist - step)
        : Math.min(ZOOM_DIST.MAX, baseDist + step);

    zoomTargetRef.current = nextDist;

    window.dispatchEvent(
      new CustomEvent('material-zoom-target', {
        detail: { distance: nextDist, immediate: false, direction },
      })
    );
  }, []);

  const startZoom = useCallback(
    (direction: 'in' | 'out') => {
      stopZoom();
      handleZoom(direction);

      holdTimerRef.current = setTimeout(() => {
        holdIntervalRef.current = setInterval(() => {
          handleZoom(direction);
        }, 110);
      }, 300);
    },
    [handleZoom, stopZoom]
  );

  useEffect(() => {
    const handleReset = () => {
      zoomTargetRef.current = null;
    };
    // Reset local tracking when Camera Director settles or user takes manual control
    window.addEventListener('material-zoom-settled', handleReset);
    window.addEventListener('material-user-camera-change', handleReset);

    return () => {
      window.removeEventListener('material-zoom-settled', handleReset);
      window.removeEventListener('material-user-camera-change', handleReset);
      stopZoom();
    };
  }, [stopZoom]);

  return (
    <>
      <aside
        className={`right-action-dock ${isZenMode ? 'is-zen' : ''} ${
          isRightDockHidden ? 'is-dock-hidden' : ''
        }`}
        aria-label="Thanh điều khiển 3D trực quan"
      >
      {/* ── 1. Nút Máy ảnh (Screenshot Tool) - Luôn hiển thị kể cả trong Chế độ xem (Zen Mode) ── */}
      <button
        type="button"
        className={`dock-tool-btn camera-btn ${
          isCapturingSnapshot ? 'opacity-70 cursor-wait' : ''
        }`}
        disabled={isCapturingSnapshot}
        onPointerDown={(e) => {
          e.stopPropagation();
        }}
        onClick={(e) => {
          e.stopPropagation();
          if (isCapturingSnapshot) return;
          sound.playClick();
          triggerSnapshot();
        }}
        title="Chụp ảnh mô hình 3D độ nét cao (Tải trực tiếp PNG)"
        aria-label="Chụp ảnh mô hình 3D"
      >
        <Camera
          size={19}
          className={isCapturingSnapshot ? 'animate-pulse text-blue-600' : 'text-blue-600'}
        />
      </button>

      {/* ── 2. Nút Con mắt (Chế độ xem / Zen Mode) ─────────────────────────── */}
      <button
        type="button"
        className={`dock-tool-btn zen-btn ${isZenMode ? 'is-active-zen' : ''}`}
        onPointerDown={(e) => {
          e.stopPropagation();
        }}
        onClick={(e) => {
          e.stopPropagation();
          sound.playClick();
          toggleZenMode();
        }}
        title={
          isZenMode
            ? 'Thoát chế độ xem (Hiện lại toàn bộ thanh công cụ)'
            : 'Chế độ xem (Ẩn thanh công cụ để ngắm 3D)'
        }
        aria-label={isZenMode ? 'Thoát chế độ xem' : 'Bật chế độ xem'}
      >
        {isZenMode ? (
          <EyeOff size={20} className="text-blue-600" />
        ) : (
          <Eye size={19} className="text-blue-600" />
        )}
      </button>

      {/* Trong Chế độ xem (Zen Mode), ẩn bớt các nút dưới để giải phóng góc nhìn 3D */}
      {!isZenMode && (
        <>
          {/* ── 3. Thước đo / Đổi góc nhìn (Camera Presets) ─────────────────── */}
          <div className="dock-preset-group" aria-label="Góc nhìn camera">
            {/* 3D Isometric */}
            <button
              type="button"
              className={`dock-preset-btn ${cameraAngle === 'iso' ? 'is-active' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                onChangeCameraAngle('iso');
              }}
              title="Góc nhìn 3D Phối cảnh tự do"
              aria-label="3D Phối cảnh"
            >
              <Box size={16} />
              <span className="preset-text">3D</span>
            </button>

            {/* 2D Top View */}
            <button
              type="button"
              className={`dock-preset-btn ${cameraAngle === 'top' ? 'is-active' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                onChangeCameraAngle('top');
              }}
              title="Góc nhìn Sơ đồ 2D trực diện (001)"
              aria-label="Sơ đồ 2D"
            >
              <Layers size={16} />
              <span className="preset-text">2D</span>
            </button>

            {/* Side View */}
            <button
              type="button"
              className={`dock-preset-btn ${cameraAngle === 'side' ? 'is-active' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                onChangeCameraAngle('side');
              }}
              title="Góc nhìn Cạnh bên (100)"
              aria-label="Cạnh bên"
            >
              <Columns size={16} />
              <span className="preset-text">Cạnh</span>
            </button>
          </div>

          {/* ── 4. Đường phân cách mờ (Divider) ────────────────────────────── */}
          <div className="dock-divider" role="separator" />

          {/* ── 5. Cụm Zoom In / Zoom Out (+ và -) ─────────────────────────── */}
          <div className="dock-zoom-cluster" aria-label="Điều khiển phóng to thu nhỏ">
            {isZoomExpanded ? (
              <>
                <button
                  type="button"
                  className="dock-tool-btn zoom-btn zoom-in cursor-pointer"
                  onPointerDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    startZoom('in');
                  }}
                  onPointerUp={stopZoom}
                  onPointerLeave={stopZoom}
                  onPointerCancel={stopZoom}
                  onClick={(e) => e.stopPropagation()}
                  title="Phóng to mô hình (+)"
                  aria-label="Phóng to"
                >
                  <Plus size={18} strokeWidth={2.5} className="text-blue-600" />
                </button>

                <button
                  type="button"
                  className="dock-tool-btn zoom-btn zoom-out cursor-pointer"
                  onPointerDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    startZoom('out');
                  }}
                  onPointerUp={stopZoom}
                  onPointerLeave={stopZoom}
                  onPointerCancel={stopZoom}
                  onClick={(e) => e.stopPropagation()}
                  title="Thu nhỏ mô hình (-)"
                  aria-label="Thu nhỏ"
                >
                  <Minus size={18} strokeWidth={2.5} className="text-blue-600" />
                </button>

                {/* Small toggle button to collapse zoom buttons */}
                <button
                  type="button"
                  className="dock-zoom-toggle-btn cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsZoomExpanded(false);
                  }}
                  title="Thu gọn nút zoom"
                  aria-label="Thu gọn zoom"
                >
                  <ChevronDown size={13} />
                </button>
              </>
            ) : (
              /* Collapsed zoom pill button */
              <button
                type="button"
                className="dock-zoom-toggle-btn is-collapsed cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsZoomExpanded(true);
                }}
                title="Mở rộng nút zoom (+ / -)"
                aria-label="Mở nút zoom"
              >
                <Plus size={14} className="text-blue-600" />
                <ChevronUp size={11} className="text-slate-400" />
              </button>
            )}
          </div>

          {/* ── 6. Nút độc lập: Ẩn thanh sang phải ─────────────────────────── */}
          <div className="dock-divider" role="separator" />
          <button
            type="button"
            className="dock-hide-right-btn"
            onClick={(e) => {
              e.stopPropagation();
              sound.playClick();
              setIsRightDockHidden(true);
            }}
            title="Trượt ẩn thanh công cụ sang phải"
            aria-label="Ẩn thanh sang phải"
          >
            <ChevronRight size={17} className="text-slate-500 hover:text-blue-600 transition-colors" />
          </button>
        </>
      )}
    </aside>

    {/* ── Nút khôi phục khi Thanh 2 (Right action dock) trượt ẩn sang phải ── */}
    {isRightDockHidden && !isZenMode && (
      <button
        type="button"
        className="right-dock-restore-tab"
        onClick={() => {
          sound.playClick();
          setIsRightDockHidden(false);
        }}
        title="Hiện lại thanh công cụ 3D"
        aria-label="Hiện thanh công cụ"
      >
        <ChevronLeft size={16} className="text-blue-600" />
        <span className="right-dock-tab-label">Công cụ 3D</span>
      </button>
    )}
  </>
  );
}
