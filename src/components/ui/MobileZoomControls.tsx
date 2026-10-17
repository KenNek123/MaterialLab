'use client';

import React, { useRef, useEffect, useCallback } from 'react';
import { Plus, Minus } from 'lucide-react';
import { useStore, StoreState } from '@/store/useStore';
import { ZOOM_DIST } from '@/components/3d/zoomState';
import { sound } from '@/lib/soundFx';

export default function MobileZoomControls() {
  const setCameraDistance = useStore((s: StoreState) => s.setCameraDistance);
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
      setCameraDistance(nextDist);

      // Reset zoomTargetRef after animation settles
      setTimeout(() => {
        zoomTargetRef.current = null;
      }, 450);
    },
    [setCameraDistance]
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
    return () => stopZoom();
  }, [stopZoom]);

  return (
    <div className="mobile-zoom-controls" aria-label="Điều khiển phóng to thu nhỏ 3D">
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
