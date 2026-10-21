'use client';

import React, { useEffect, useCallback } from 'react';
import {
  Wrench,
  ChevronRight,
  ChevronLeft,
  X,
  Info,
  Columns2,
  Box,
  Camera,
  Minimize2,
  Sliders,
  ZoomIn,
} from 'lucide-react';
import { useStore, StoreState } from '@/store/useStore';
import { sound } from '@/lib/soundFx';

interface LeftToolbarDrawerProps {
  onOpenDetail: () => void;
  onOpenCompare: () => void;
  isDual3DView: boolean;
  onToggleDual3DView: () => void;
  isCapturingSnapshot: boolean;
  onTriggerSnapshot: () => void;
  cameraAngle: 'iso' | 'top' | 'side';
  onChangeCameraAngle: (angle: 'iso' | 'top' | 'side') => void;
}

export default function LeftToolbarDrawer({
  onOpenDetail,
  onOpenCompare,
  isDual3DView,
  onToggleDual3DView,
  isCapturingSnapshot,
  onTriggerSnapshot,
  cameraAngle,
  onChangeCameraAngle,
}: LeftToolbarDrawerProps) {
  const isToolbarOpen = useStore((s: StoreState) => s.isToolbarOpen);
  const setIsToolbarOpen = useStore((s: StoreState) => s.setIsToolbarOpen);
  const showZoomControls = useStore((s: StoreState) => s.showZoomControls);
  const toggleZoomControls = useStore((s: StoreState) => s.toggleZoomControls);
  const isZenMode = useStore((s: StoreState) => s.isZenMode);
  const toggleZenMode = useStore((s: StoreState) => s.toggleZenMode);

  // Close on Escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isToolbarOpen) {
        setIsToolbarOpen(false);
      }
    },
    [isToolbarOpen, setIsToolbarOpen]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (isZenMode) return null;

  return (
    <>
      {/* ── Fixed Left Edge Toggle Button (Requirement 1 & 5) ──────── */}
      {/* Directional Chevron points RIGHT when closed (indicating "click to open from left") */}
      {!isToolbarOpen && (
        <button
          type="button"
          className="left-toolbar-edge-toggle"
          onClick={() => {
            sound.playClick();
            setIsToolbarOpen(true);
          }}
          title="Mở thanh công cụ khám phá 3D"
          aria-label="Mở thanh công cụ"
        >
          <div className="edge-toggle-content">
            <Wrench size={16} className="text-cyan-400 shrink-0" />
            <span className="edge-toggle-text">Công cụ</span>
            {/* Center-aligned directional chevron pointing RIGHT */}
            <ChevronRight size={16} className="text-sky-300 ml-0.5 shrink-0" />
          </div>
        </button>
      )}

      {/* ── Slide-over Drawer Backdrop ─────────────────────────────── */}
      {isToolbarOpen && (
        <div
          className="left-toolbar-backdrop"
          onClick={() => {
            sound.playClick();
            setIsToolbarOpen(false);
          }}
          aria-hidden="true"
        />
      )}

      {/* ── Slide-over Drawer Panel (Requirement 1) ───────────────── */}
      <aside
        className={`left-toolbar-drawer ${isToolbarOpen ? 'is-open' : 'is-closed'}`}
        aria-label="Khung công cụ điều khiển bên trái"
        aria-hidden={!isToolbarOpen}
      >
        {/* Center-aligned border toggle button pointing LEFT when open (Requirement 5) */}
        <button
          type="button"
          className="drawer-border-toggle-close"
          onClick={() => {
            sound.playClick();
            setIsToolbarOpen(false);
          }}
          title="Thu gọn thanh công cụ về lề trái"
          aria-label="Thu gọn công cụ"
        >
          <ChevronLeft size={18} className="text-cyan-300" />
        </button>

        {/* Header */}
        <div className="drawer-header">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#38bdf8] animate-pulse" />
            <h2 className="drawer-title">BỘ CÔNG CỤ 3D</h2>
          </div>
          <button
            type="button"
            className="drawer-close-btn"
            onClick={() => {
              sound.playClick();
              setIsToolbarOpen(false);
            }}
            title="Đóng thanh công cụ"
          >
            <X size={18} />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="drawer-content custom-scrollbar">
          {/* Main Action Modules */}
          <div className="drawer-section">
            <span className="drawer-section-label">Khám phá & So sánh</span>
            <div className="drawer-buttons-grid">
              <button
                type="button"
                className="drawer-action-btn"
                onClick={() => {
                  sound.playClick();
                  setIsToolbarOpen(false);
                  onOpenDetail();
                }}
              >
                <Info size={17} className="text-cyan-400 shrink-0" />
                <div className="text-left min-w-0">
                  <div className="drawer-btn-label">Hồ sơ chi tiết</div>
                  <div className="drawer-btn-sub">Bản chất liên kết & cơ tính</div>
                </div>
              </button>

              <button
                type="button"
                className="drawer-action-btn"
                onClick={() => {
                  sound.playClick();
                  setIsToolbarOpen(false);
                  onOpenCompare();
                }}
              >
                <Columns2 size={17} className="text-fuchsia-400 shrink-0" />
                <div className="text-left min-w-0">
                  <div className="drawer-btn-label">So sánh vật liệu</div>
                  <div className="drawer-btn-sub">Đối chiếu mạng tinh thể kép</div>
                </div>
              </button>

              <button
                type="button"
                className={`drawer-action-btn ${isDual3DView ? 'is-active' : ''}`}
                onClick={() => {
                  sound.playClick();
                  onToggleDual3DView();
                }}
              >
                <Box size={17} className={isDual3DView ? 'text-cyan-300 shrink-0' : 'text-slate-400 shrink-0'} />
                <div className="text-left min-w-0">
                  <div className="drawer-btn-label">
                    {isDual3DView ? 'Đang bật Xem kép' : 'Xem hai mô hình 3D'}
                  </div>
                  <div className="drawer-btn-sub">Chia đôi không gian 3D song song</div>
                </div>
              </button>

              <button
                type="button"
                className={`drawer-action-btn ${isCapturingSnapshot ? 'opacity-70 cursor-wait' : ''}`}
                disabled={isCapturingSnapshot}
                onClick={() => {
                  if (isCapturingSnapshot) return;
                  sound.playClick();
                  onTriggerSnapshot();
                }}
              >
                <Camera
                  size={17}
                  className={isCapturingSnapshot ? 'animate-pulse text-cyan-400 shrink-0' : 'text-emerald-400 shrink-0'}
                />
                <div className="text-left min-w-0">
                  <div className="drawer-btn-label">
                    {isCapturingSnapshot ? 'Đang kết xuất ảnh...' : 'Chụp ảnh mô hình (2K)'}
                  </div>
                  <div className="drawer-btn-sub">Xuất file PNG Retina sắc nét</div>
                </div>
              </button>
            </div>
          </div>

          {/* Camera View Presets (Requirement 2: Touch responsive with onPointerDown) */}
          <div className="drawer-section">
            <span className="drawer-section-label">Góc nhìn camera 3D</span>
            <div className="drawer-views-grid">
              {(
                [
                  { id: 'iso', label: '3D Phối cảnh', desc: 'Góc tự do' },
                  { id: 'top', label: 'Sơ đồ 2D', desc: 'Mặt phẳng (001)' },
                  { id: 'side', label: 'Cạnh bên', desc: 'Chiếu đứng (100)' },
                ] as const
              ).map((v) => (
                <button
                  key={v.id}
                  type="button"
                  className={`drawer-view-btn ${cameraAngle === v.id ? 'is-active' : ''}`}
                  onPointerDown={(e) => {
                    e.stopPropagation();
                    onChangeCameraAngle(v.id);
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onChangeCameraAngle(v.id);
                  }}
                >
                  <span className="font-semibold">{v.label}</span>
                  <span className="text-[10px] opacity-70">{v.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Controls & Presentation */}
          <div className="drawer-section">
            <span className="drawer-section-label">Tùy biến hiển thị</span>
            <div className="drawer-toggles-list">
              <button
                type="button"
                className={`drawer-toggle-row ${showZoomControls ? 'is-active' : ''}`}
                onClick={() => {
                  sound.playClick();
                  toggleZoomControls();
                }}
              >
                <div className="flex items-center gap-2.5">
                  <ZoomIn size={16} className="text-sky-400" />
                  <span>Cụm nút phóng to (+ / -)</span>
                </div>
                <span className="drawer-toggle-badge">
                  {showZoomControls ? 'Đang hiện' : 'Đã ẩn'}
                </span>
              </button>

              <button
                type="button"
                className={`drawer-toggle-row ${isZenMode ? 'is-active' : ''}`}
                onClick={() => {
                  sound.playClick();
                  setIsToolbarOpen(false);
                  toggleZenMode();
                }}
              >
                <div className="flex items-center gap-2.5">
                  <Minimize2 size={16} className="text-cyan-400" />
                  <span>Chế độ Zen Mode (Thu gọn / Toàn màn hình)</span>
                </div>
                <span className="drawer-toggle-badge">
                  {isZenMode ? 'Bật' : 'Tắt'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
