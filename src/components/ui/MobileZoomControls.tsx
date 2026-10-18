'use client';

import React, { useRef, useEffect, useCallback } from 'react';
import { Plus, Minus } from 'lucide-react';
import { useStore, StoreState } from '@/store/useStore';
import { ZOOM_DIST } from '@/components/3d/zoomState';
import { sound } from '@/lib/soundFx';

export default function MobileZoomControls() {
  const isToolbarOpen = useStore((s: StoreState) => s.isToolbarOpen);
  const showZoomControls = useStore((s: StoreState) => s.showZoomControls);
  const isZenMode = useStore((s: StoreState) => s.isZenMode);

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

  const handleZoom = useCallback(
    (direction: 'in' | 'out') => {
      sound.playClick();
      // Read current real-time camera distance from store, or smooth cumulative target
      const currentDist = useStore.getState().cameraDistance || 8.0;
      const baseDist = zoomTargetRef.current !== null ? zoomTargetRef.current : currentDist;
      const step = 1.35;
      const nextDist =
        direction === 'in'
          ? Math.max(ZOOM_DIST.MIN, baseDist - step)
          : Math.min(ZOOM_DIST.MAX, baseDist + step);

      zoomTargetRef.current = nextDist;

      window.dispatchEvent(
        new CustomEvent('material-zoom-target', {
          detail: { distance: nextDist, immediate: false },
        })
      );
    },
    []
  );

  const startZoom = useCallback(
    (direction: 'in' | 'out') => {
      stopZoom();
      handleZoom(direction);

      holdTimerRef.current = setTimeout(() => {
        holdIntervalRef.current = setInterval(() => {
          handleZoom(direction);
        }, 130);
      }, 350);
    },
    [handleZoom, stopZoom]
  );

  useEffect(() => {
    const handleCancel = () => {
      zoomTargetRef.current = null;
    };
    window.addEventListener('material-zoom-cancel', handleCancel);
    window.addEventListener('material-zoom-settled', handleCancel);
    window.addEventListener('material-user-camera-change', handleCancel);
    window.addEventListener('wheel', handleCancel, { passive: true });
    window.addEventListener('touchstart', handleCancel, { passive: true });

    return () => {
      window.removeEventListener('material-zoom-cancel', handleCancel);
      window.removeEventListener('material-zoom-settled', handleCancel);
      window.removeEventListener('material-user-camera-change', handleCancel);
      window.removeEventListener('wheel', handleCancel);
      window.removeEventListener('touchstart', handleCancel);
      stopZoom();
    };
  }, [stopZoom]);

  if (isZenMode || !showZoomControls) return null;

  return (
    <div
      className={`mobile-zoom-controls ${isToolbarOpen ? 'is-toolbar-shifted' : ''}`}
      aria-label="Điều khiển phóng to thu nhỏ 3D"
    >
      <button
        type="button"
        className="zoom-btn zoom-in-btn"
        onPointerDown={(e) => {
          e.preventDefault();
          startZoom('in');
        }}
        onPointerUp={stopZoom}
        onPointerLeave={stopZoom}
        onPointerCancel={stopZoom}
        title="Phóng to mô hình 3D (+)"
        aria-label="Phóng to"
      >
        <Plus size={20} strokeWidth={2.5} />
      </button>
      <div className="zoom-btn-divider" />
      <button
        type="button"
        className="zoom-btn zoom-out-btn"
        onPointerDown={(e) => {
          e.preventDefault();
          startZoom('out');
        }}
        onPointerUp={stopZoom}
        onPointerLeave={stopZoom}
        onPointerCancel={stopZoom}
        title="Thu nhỏ mô hình 3D (-)"
        aria-label="Thu nhỏ"
      >
        <Minus size={20} strokeWidth={2.5} />
      </button>
    </div>
  );
}
