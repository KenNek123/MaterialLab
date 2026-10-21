'use client';

import React from 'react';
import {
  Camera,
  Minimize2,
  Maximize2,
  Play,
  Pause,
  X,
  Box,
  Layers,
  Columns,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { useStore, StoreState } from '@/store/useStore';
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
  const isTourActive = useStore((s: StoreState) => s.isTourActive);
  const setIsTourActive = useStore((s: StoreState) => s.setIsTourActive);
  const isTourPaused = useStore((s: StoreState) => s.isTourPaused);
  const toggleTour = useStore((s: StoreState) => s.toggleTour);
  const toggleTourPause = useStore((s: StoreState) => s.toggleTourPause);

  return (
    <>
      <aside
        className={`right-action-dock ${isZenMode || isTourActive ? 'is-zen' : ''} ${
          isRightDockHidden && !isTourActive ? 'is-dock-hidden' : ''
        }`}
        aria-label="Thanh điều khiển 3D trực quan"
      >
        {/* ── 1. Nút Máy ảnh (Screenshot Tool) - Luôn hiển thị kể cả trong Chế độ xem & Trình chiếu ── */}
        <button
          type="button"
          className={`dock-tool-btn dock-camera-btn ${
            isCapturingSnapshot ? 'is-capturing' : ''
          }`}
          onClick={(e) => {
            e.stopPropagation();
            sound.playSnap();
            triggerSnapshot();
          }}
          disabled={isCapturingSnapshot}
          title="Chụp ảnh mô hình 3D (Tải ảnh PNG rõ nét có chữ ký)"
          aria-label="Chụp ảnh mô hình 3D"
        >
          <Camera
            size={19}
            strokeWidth={2.2}
            className={
              isCapturingSnapshot
                ? 'text-blue-600 animate-spin'
                : 'text-blue-600'
            }
          />
        </button>

        {/* ── 2. Nút Chế độ xem mở rộng / Ẩn hiện UI (Zen Mode - Collapse / Expand) ── */}
        <button
          type="button"
          className={`dock-tool-btn dock-zen-btn zen-btn ${isZenMode ? 'is-zen-active is-active-zen' : ''}`}
          onClick={async (e) => {
            e.stopPropagation();
            sound.playClick();

            try {
              if (!document.fullscreenElement) {
                await document.documentElement.requestFullscreen();
                useStore.getState().setIsZenMode(true);
              } else {
                await document.exitFullscreen();
                useStore.getState().setIsZenMode(false);
              }
            } catch (error) {
              console.error('Không thể chuyển chế độ toàn màn hình:', error);
            }
          }}
          title={
            isZenMode
              ? 'Hiện lại giao diện điều khiển (Mở rộng UI)'
              : 'Ẩn bớt giao diện (Thu gọn UI / Chế độ xem)'
          }
          aria-label={isZenMode ? 'Hiện lại giao diện' : 'Ẩn giao diện'}
        >
          {isZenMode ? (
            <Maximize2 size={18} className="text-blue-600" />
          ) : (
            <Minimize2 size={18} className="text-slate-700" />
          )}
        </button>

        {/* ── 3. Nút Trình chiếu (Play / Pause) - Tự động đổi biểu tượng mũi tên Play và Pause theo trạng thái phát ── */}
        <button
          type="button"
          className={`dock-tool-btn dock-tour-btn ${
            isTourActive ? (isTourPaused ? 'is-paused' : 'is-playing') : ''
          }`}
          onClick={(e) => {
            e.stopPropagation();
            sound.playClick();
            if (!isTourActive) {
              toggleTour();
            } else {
              toggleTourPause();
            }
          }}
          title={
            !isTourActive
              ? 'Bắt đầu trình chiếu đa tầng'
              : isTourPaused
              ? 'Tiếp tục trình chiếu (Đang tạm dừng)'
              : 'Tạm dừng trình chiếu (Dừng để xoay ngắm)'
          }
          aria-label={
            !isTourActive
              ? 'Trình chiếu'
              : isTourPaused
              ? 'Tiếp tục'
              : 'Tạm dừng'
          }
        >
          {isTourActive && !isTourPaused ? (
            <Pause size={18} className="text-amber-500 fill-amber-500" />
          ) : (
            <Play
              size={18}
              className={
                isTourActive
                  ? 'text-emerald-500 fill-emerald-500 ml-0.5'
                  : 'text-blue-600 fill-blue-600 ml-0.5'
              }
            />
          )}
        </button>

        {/* ── 3b. Nút Thoát Trình chiếu (Dấu X) trong cụm nút phải ── */}
        {isTourActive && (
          <button
            type="button"
            className="dock-tool-btn dock-tour-exit-btn"
            onClick={(e) => {
              e.stopPropagation();
              sound.playClick();
              setIsTourActive(false);
            }}
            title="Thoát trình chiếu (ESC)"
            aria-label="Thoát trình chiếu"
          >
            <X size={19} strokeWidth={2.4} className="text-rose-500" />
          </button>
        )}

        {/* ── Chỉ hiển thị cụm góc nhìn khi không ở Zen mode, không trình chiếu và bottom sheet đang đóng ── */}
        {!isZenMode && !isTourActive && !isBottomSheetOpen && (
          <>
            {/* ── 4. Đường phân cách mờ (Divider) ────────────────────────────── */}
            <div className="dock-divider" role="separator" />

            {/* ── Cụm Góc nhìn 3D & 2D chuẩn (Presets) ────────────────────────── */}
            <div className="dock-preset-group" aria-label="Góc nhìn 3D chuẩn">
              {/* Isometric 3D View */}
              <button
                type="button"
                className={`dock-preset-btn ${cameraAngle === 'iso' ? 'is-active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onChangeCameraAngle('iso');
                }}
                title="Góc nhìn Không gian 3D Isometric"
                aria-label="Góc nhìn 3D"
              >
                <Box size={16} />
                <span className="preset-text">3D</span>
              </button>

              {/* 2D Top-Down Projection */}
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

            {/* ── 5. Nút độc lập: Ẩn thanh sang phải ─────────────────────────── */}
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
      {isRightDockHidden && !isZenMode && !isTourActive && (
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
