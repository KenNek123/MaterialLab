import * as THREE from 'three';
import { ZoomLayer } from '@/store/useStore';

export const ZOOM_DIST = {
  MACRO: 9.5,
  MICRO: 5.5,
  MOLECULAR: 3.8,   // Perfect overview distance: all molecules, layers & bonds clearly visible
  MIN: 2.2,         // Max zoom in: close bond inspection without clipping into atoms
  MAX: 12.0,
};

export interface ZoomState {
  macroOpacity: number;
  macroScale: number;
  wireframeOpacity: number;
  microOpacity: number;
  microScale: number;
  molecularOpacity: number;
  molecularScale: number;
  layer: ZoomLayer;
  zoomProgress: number;
  // PiP overlay controls (0-1 values for smooth CSS transitions)
  pipMicroVisible: boolean;
  pipMicroProgress: number;  // 0→1 as micro layer emerges
  pipNanoVisible: boolean;
  pipNanoProgress: number;   // 0→1 as nano layer emerges
}

export const zoomState: ZoomState = {
  macroOpacity: 1.0,
  macroScale: 1.0,
  wireframeOpacity: 0.0,
  microOpacity: 0.0,
  microScale: 0.5,
  molecularOpacity: 0.0,
  molecularScale: 0.1,
  layer: 'macro',
  zoomProgress: 0,
  pipMicroVisible: false,
  pipMicroProgress: 0,
  pipNanoVisible: false,
  pipNanoProgress: 0,
};

/**
 * Converts camera distance to a normalized progress value [0, 1].
 * 10.0 → 0.0 (Macro)
 * 4.0  → 0.5 (Micro)
 * 1.4  → 1.0 (Molecular/Nano)
 */
export function distanceToProgress(dist: number): number {
  const d = THREE.MathUtils.clamp(dist, ZOOM_DIST.MOLECULAR, ZOOM_DIST.MACRO);
  if (d >= ZOOM_DIST.MICRO) {
    const t = (ZOOM_DIST.MACRO - d) / (ZOOM_DIST.MACRO - ZOOM_DIST.MICRO);
    return t * 0.5;
  } else {
    const t = (ZOOM_DIST.MICRO - d) / (ZOOM_DIST.MICRO - ZOOM_DIST.MOLECULAR);
    return 0.5 + t * 0.5;
  }
}

/**
 * Converts normalized progress value [0, 1] to camera distance.
 */
export function progressToDistance(progress: number): number {
  const p = THREE.MathUtils.clamp(progress, 0, 1);
  if (p <= 0.5) {
    const t = p / 0.5;
    return ZOOM_DIST.MACRO - t * (ZOOM_DIST.MACRO - ZOOM_DIST.MICRO);
  } else {
    const t = (p - 0.5) / 0.5;
    return ZOOM_DIST.MICRO - t * (ZOOM_DIST.MICRO - ZOOM_DIST.MOLECULAR);
  }
}

/**
 * Smoothstep cubic easing: 3t² - 2t³
 * Zero derivative at endpoints = butter-smooth start and stop.
 */
export function smoothstep(t: number): number {
  const c = THREE.MathUtils.clamp(t, 0, 1);
  return c * c * (3 - 2 * c);
}

/**
 * Quintic smoothstep: 6t⁵ - 15t⁴ + 10t³
 * Even smoother than cubic — perlin/simplex noise uses this.
 */
function smootherstep(t: number): number {
  const c = THREE.MathUtils.clamp(t, 0, 1);
  return c * c * c * (c * (c * 6 - 15) + 10);
}

/**
 * Computes zoom opacities and scales on every animation frame.
 * Picture-in-picture: micro peeks in at p~0.2, nano peeks in at p~0.55.
 */
export function computeAndUpdateZoomState(distance: number) {
  const p = distanceToProgress(distance);
  zoomState.zoomProgress = p;

  // Layer classification with hysteresis boundaries
  if (p < 0.30) {
    zoomState.layer = 'macro';
  } else if (p < 0.70) {
    zoomState.layer = 'micro';
  } else {
    zoomState.layer = 'molecular';
  }

  // ── Phase 1: Pure Macro (p = 0 → 0.25) ────────────────────────────────────
  if (p <= 0.25) {
    const t = smootherstep(p / 0.25);
    zoomState.macroOpacity = 1.0;
    zoomState.macroScale = 1.0 + t * 0.08;
    zoomState.wireframeOpacity = t * 0.25;
    zoomState.microOpacity = 0.0;
    zoomState.microScale = 0.45;
    zoomState.molecularOpacity = 0.0;
    zoomState.molecularScale = 0.12;

    // PiP: micro starts to peek (thumbnail hint)
    zoomState.pipMicroProgress = t * 0.3;  // barely visible thumbnail
    zoomState.pipMicroVisible = t > 0.1;
    zoomState.pipNanoProgress = 0;
    zoomState.pipNanoVisible = false;
  }
  // ── Phase 2: Macro→Micro Crossfade (p = 0.25 → 0.55) ─────────────────────
  else if (p <= 0.55) {
    const rawT = (p - 0.25) / 0.30;
    const s = smootherstep(rawT);

    // Macro dissolves cleanly before reaching micro layer (zero by rawT ~ 0.5 / p ~ 0.40)
    zoomState.macroOpacity = Math.max(0, 1.0 - smootherstep(rawT * 2.0));
    zoomState.macroScale = 1.0 + s * 0.12;

    // Subtle energy wireframe shimmer dissolves completely by rawT ~ 0.5
    zoomState.wireframeOpacity = rawT < 0.5 ? Math.max(0, Math.sin(rawT * 2.0 * Math.PI) * (1.0 - rawT * 2.0) * 0.3) : 0.0;

    // Unit cell cage materializes
    zoomState.microOpacity = Math.pow(rawT, 0.65) * 0.95;
    zoomState.microScale = THREE.MathUtils.lerp(0.65, 1.0, s);

    // Atoms start emerging from center
    zoomState.molecularOpacity = Math.max(0, (rawT - 0.4) / 0.6) * 0.65;
    zoomState.molecularScale = THREE.MathUtils.lerp(0.35, 0.85, s);

    // PiP: micro fully visible, nano thumbnail starts
    zoomState.pipMicroProgress = THREE.MathUtils.lerp(0.3, 1.0, s);
    zoomState.pipMicroVisible = true;
    zoomState.pipNanoProgress = Math.max(0, (rawT - 0.5) / 0.5) * 0.4;
    zoomState.pipNanoVisible = rawT > 0.5;
  }
  // ── Phase 3: Micro→Nano Crossfade (p = 0.55 → 0.85) ─────────────────────
  else if (p <= 0.85) {
    const rawT = (p - 0.55) / 0.30;
    const s = smootherstep(rawT);

    zoomState.macroOpacity = 0.0;
    zoomState.macroScale = 1.0;
    zoomState.wireframeOpacity = 0.0;

    // Unit cell fades as atom lattice takes over
    zoomState.microOpacity = THREE.MathUtils.lerp(0.95, 0.15, s);
    zoomState.microScale = THREE.MathUtils.lerp(1.0, 1.25, s);

    // Atom lattice expands from 0.55 to comfortable viewing scale
    zoomState.molecularOpacity = THREE.MathUtils.lerp(0.65, 1.0, s);
    zoomState.molecularScale = THREE.MathUtils.lerp(0.72, 1.0, s);

    // PiP: micro fades to corner indicator, nano grows
    zoomState.pipMicroProgress = THREE.MathUtils.lerp(1.0, 0.2, s);
    zoomState.pipMicroVisible = true;
    zoomState.pipNanoProgress = THREE.MathUtils.lerp(0.4, 1.0, s);
    zoomState.pipNanoVisible = true;
  }
  // ── Phase 4: Pure Nano (p = 0.85 → 1.0) ───────────────────────────────────
  else {
    const rawT = (p - 0.85) / 0.15;
    const s = smootherstep(rawT);

    zoomState.macroOpacity = 0.0;
    zoomState.macroScale = 1.63;
    zoomState.wireframeOpacity = 0.0;

    zoomState.microOpacity = THREE.MathUtils.lerp(0.15, 0.0, s);
    zoomState.microScale = THREE.MathUtils.lerp(1.25, 1.5, s);

    // Keep molecular scale stable at 1.0 so full normalized lattice overview is visible
    zoomState.molecularOpacity = 1.0;
    zoomState.molecularScale = 1.0;

    zoomState.pipMicroProgress = THREE.MathUtils.lerp(0.2, 0.0, s);
    zoomState.pipMicroVisible = rawT < 0.6;
    zoomState.pipNanoProgress = 1.0;
    zoomState.pipNanoVisible = true;
  }
}
