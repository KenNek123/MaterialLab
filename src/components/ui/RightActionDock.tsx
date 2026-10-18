'use client';

import React from 'react';
import {
  Camera,
  Eye,
  EyeOff,
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

        {/* ── 2. Nút Chế độ xem mở rộng (Zen Mode) ── */}
        <button
          type="button"
          className={`dock-tool-btn dock-zen-btn ${isZenMode ? 'is-zen-active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            sound.playClick();
            toggleZenMode();
          }}
          title={isZenMode ? 'Thoát chế độ xem (Hiện lại bảng điều khiển)' : 'Chế độ xem toàn màn hình (Ẩn các bảng)'}
          aria-label="Chế độ xem mở rộng"
        >
          {isZenMode ? (
            <EyeOff size={18} className="text-blue-600" />
          ) : (
            <Eye size={18} className="text-slate-700" />
          )}
        </button>

        {/* ── Chỉ hiển thị cụm góc nhìn khi không ở Zen mode và bottom sheet đang đóng ── */}
        {!isZenMode && !isBottomSheetOpen && (
          <>
            {/* ── 3. Đường phân cách mờ (Divider) ────────────────────────────── */}
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

            {/* ── 4. Nút độc lập: Ẩn thanh sang phải ─────────────────────────── */}
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
