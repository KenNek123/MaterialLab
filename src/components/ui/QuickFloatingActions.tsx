'use client';

import React from 'react';
import { Minimize2, Maximize2, Camera } from 'lucide-react';
import { useStore, StoreState } from '@/store/useStore';
import { sound } from '@/lib/soundFx';

export default function QuickFloatingActions() {
  const isZenMode = useStore((s: StoreState) => s.isZenMode);
  const toggleZenMode = useStore((s: StoreState) => s.toggleZenMode);
  const triggerSnapshot = useStore((s: StoreState) => s.triggerSnapshot);
  const isCapturingSnapshot = useStore((s: StoreState) => s.isCapturingSnapshot);

  return (
    <div
      className={`quick-floating-actions-container ${isZenMode ? 'is-zen-active' : ''}`}
      aria-label="Phím tắt chức năng nổi"
    >
      {/* Screenshot Camera Button (Requirement 3) */}
      {!isZenMode && (
        <button
          type="button"
          className={`quick-action-btn camera-btn ${
            isCapturingSnapshot ? 'opacity-70 cursor-wait' : ''
          }`}
          disabled={isCapturingSnapshot}
          onClick={() => {
            if (isCapturingSnapshot) return;
            sound.playClick();
            triggerSnapshot();
          }}
          title="Chụp ảnh mô hình 3D độ nét cao (2K Retina)"
          aria-label="Chụp ảnh mô hình"
        >
          <Camera
            size={20}
            className={isCapturingSnapshot ? 'animate-pulse text-cyan-400' : 'text-emerald-400'}
          />
          <span className="sr-only">Chụp màn hình</span>
        </button>
      )}

      {/* Zen Mode Button (Exit Fullscreen / Collapse) */}
      <button
        type="button"
        className={`quick-action-btn zen-btn ${isZenMode ? 'is-active-zen' : ''}`}
        onClick={() => {
          sound.playClick();
          toggleZenMode();
        }}
        title={isZenMode ? 'Thoát chế độ Zen Mode (Hiện lại giao diện)' : 'Chế độ Zen Mode (Ẩn toàn bộ UI)'}
        aria-label={isZenMode ? 'Thoát Zen Mode' : 'Bật Zen Mode'}
      >
        {isZenMode ? (
          <Maximize2 size={20} className="text-cyan-300 animate-pulse" />
        ) : (
          <Minimize2 size={20} className="text-cyan-400" />
        )}
        {isZenMode && <span className="zen-hint-label">Thoát Zen</span>}
      </button>
    </div>
  );
}
