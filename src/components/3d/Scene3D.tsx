'use client';

import React, { useRef, useCallback, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Float, Html } from '@react-three/drei';
import { EffectComposer, Bloom, SMAA } from '@react-three/postprocessing';
import * as THREE from 'three';
import { useStore, ZoomLayer, StoreState } from '@/store/useStore';
import { MATERIAL_MAP } from '@/data/materials';
import { MacroObject } from './MacroObject';
import { MicroUnitCell } from './MicroUnitCell';
import { MolecularStructure } from './MolecularStructure';
import { CrystallographyOverlays } from './CrystallographyOverlays';
import { sound } from '@/lib/soundFx';

import {
  ZOOM_DIST,
  zoomState,
  distanceToProgress,
  progressToDistance,
  computeAndUpdateZoomState,
} from './zoomState';

export { ZOOM_DIST, zoomState, distanceToProgress, progressToDistance, computeAndUpdateZoomState };

// ── Layer Transition Flash & Shutter Flash Overlay ───────────────────────────
function LayerTransitionOverlay() {
  const activeLayer = useStore((s: StoreState) => s.activeLayer);

  return (
    <div
      className="fixed inset-0 z-10 pointer-events-none transition-all duration-700"
      style={{
        background:
          activeLayer === 'macro'
            ? 'radial-gradient(ellipse at center, transparent 65%, rgba(30,58,138,0.06) 100%)'
            : activeLayer === 'micro'
            ? 'radial-gradient(ellipse at center, transparent 55%, rgba(88,28,135,0.08) 100%)'
            : 'radial-gradient(ellipse at center, transparent 45%, rgba(131,24,67,0.10) 100%)',
      }}
    />
  );
}

type OrbitControlsInstance = React.ComponentRef<typeof OrbitControls>;

interface ZoomEventDetail {
  distance?: number;
  immediate?: boolean;
}

interface AngleEventDetail {
  angle?: 'iso' | 'top' | 'side';
}

// ── Reusable pre-allocated vectors to eliminate GC in animation loop ──────────
const _spherical = new THREE.Spherical();
const _targetDir = new THREE.Vector3();
const _currentDir = new THREE.Vector3();
const _offset = new THREE.Vector3();
const _zeroVector = new THREE.Vector3(0, 0, 0);
const _tourTargetPos = new THREE.Vector3();

/**
 * Unified Camera Director
 * ─────────────────────────────────────────────────────────────────────
 * Single authority over all camera mutations. Eliminates zoom conflicts by:
 *
 * 1. BUTTON ZOOM (+/-): Sets a target spherical radius. Each frame, we
 *    read the *current* spherical from OrbitControls, lerp only the radius
 *    toward the target, write back, and call controls.update(). This keeps
 *    OrbitControls' internal state perfectly synchronized.
 *
 * 2. WHEEL / PINCH: OrbitControls handles this natively. We only read
 *    the resulting distance to update store & layer state.
 *
 * 3. ANGLE PRESETS: We lerp the spherical phi/theta toward the target
 *    direction while keeping controls.enabled = true but suppressing
 *    user interaction via a flag. After convergence, we restore control.
 *
 * Because all three paths modify the same spherical object through the
 * same OrbitControls.update() call, there is zero desynchronization.
 */
function CameraDirector({ controlsRef }: { controlsRef: React.RefObject<OrbitControlsInstance | null> }) {
  const { camera } = useThree();
  const setActiveLayer = useStore((s: StoreState) => s.setActiveLayer);
  const setCameraDistance = useStore((s: StoreState) => s.setCameraDistance);
  const setZoomProgress = useStore((s: StoreState) => s.setZoomProgress);
  const setCameraAngle = useStore((s: StoreState) => s.setCameraAngle);

  const isTourActive = useStore((s: StoreState) => s.isTourActive);
  const isTourPaused = useStore((s: StoreState) => s.isTourPaused);
  const setTourPhase = useStore((s: StoreState) => s.setTourPhase);
  const setTourProgress = useStore((s: StoreState) => s.setTourProgress);

  const prevLayer = useRef<ZoomLayer>('macro');

  // Zoom state: target distance for button/keyboard zoom
  const zoomTargetRadius = useRef<number | null>(null);
  const zoomLerpSpeed = useRef<number>(8.0);

  // Angle state: target spherical direction for angle presets
  const angleTargetPhi = useRef<number | null>(null);
  const angleTargetTheta = useRef<number | null>(null);
  const isAnimatingAngle = useRef(false);

  // Tour state
  const tourTimeRef = useRef(0);
  const tourAngleRef = useRef(0);
  const currentTourDistRef = useRef<number | null>(null);
  const currentTourElevationRef = useRef<number | null>(null);
  const wasPausedRef = useRef(false);

  // Previous distance for store update throttling
  const prevDistRef = useRef(10.0);

  // ── Event Listeners ──────────────────────────────────────────────────
  useEffect(() => {
    const handleZoomTarget = (e: Event) => {
      const detail = (e as CustomEvent<ZoomEventDetail>).detail;
      if (detail && typeof detail.distance === 'number') {
        if (useStore.getState().isTourActive && !useStore.getState().isTourPaused) {
          useStore.getState().setIsTourPaused(true);
        }
        // Immediately terminate manual interaction flag & disable damping during programmatic zoom
        useStore.getState().setIsUserInteracting(false);
        if (controlsRef.current) {
          controlsRef.current.enableDamping = false;
        }
        zoomTargetRadius.current = THREE.MathUtils.clamp(
          detail.distance,
          ZOOM_DIST.MIN,
          ZOOM_DIST.MAX
        );
        zoomLerpSpeed.current = detail.immediate ? 16.0 : 9.5;
      }
    };

    const handleCameraAngle = (e: Event) => {
      const detail = (e as CustomEvent<AngleEventDetail>).detail;
      if (!detail?.angle || !controlsRef.current) return;

      if (useStore.getState().isTourActive && !useStore.getState().isTourPaused) {
        useStore.getState().setIsTourPaused(true);
      }

      const angle = detail.angle;
      setCameraAngle(angle);
      sound.playSnap();

      // Immediately terminate manual interaction flag & disable damping during programmatic angle change
      useStore.getState().setIsUserInteracting(false);
      if (controlsRef.current) {
        controlsRef.current.enableDamping = false;
      }

      // Compute target spherical coordinates:
      // phi is polar angle (0 = top, PI/2 = equator)
      // theta is azimuthal angle in XZ plane
      if (angle === 'top') {
        // Use phi = 0.035 (~2 deg off exact pole) to completely prevent
        // gimbal-lock singularity where camera.up is parallel to look vector!
        angleTargetPhi.current = 0.035;
        angleTargetTheta.current = 0;
      } else if (angle === 'side') {
        angleTargetPhi.current = Math.PI * 0.5;
        angleTargetTheta.current = Math.PI * 0.5;
      } else {
        // 'iso': Classic 3D perspective (45 deg azimuth, ~60 deg elevation)
        angleTargetPhi.current = 1.05;
        angleTargetTheta.current = Math.PI * 0.25;
      }

      isAnimatingAngle.current = true;
    };

    // Only cancel programmatic zoom if NOT currently animating and user physically touches canvas
    const handleUserCameraChange = () => {
      if (isAnimatingAngle.current || zoomTargetRadius.current !== null) return;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === '+' || e.key === '=') {
        e.preventDefault();
        if (useStore.getState().isTourActive && !useStore.getState().isTourPaused) {
          useStore.getState().setIsTourPaused(true);
        }
        const dist = useStore.getState().cameraDistance || 8;
        zoomTargetRadius.current = Math.max(ZOOM_DIST.MIN, dist - 1.6);
        zoomLerpSpeed.current = 8.0;
      } else if (e.key === '-' || e.key === '_') {
        e.preventDefault();
        if (useStore.getState().isTourActive && !useStore.getState().isTourPaused) {
          useStore.getState().setIsTourPaused(true);
        }
        const dist = useStore.getState().cameraDistance || 8;
        zoomTargetRadius.current = Math.min(ZOOM_DIST.MAX, dist + 1.6);
        zoomLerpSpeed.current = 8.0;
      }
    };

    const handleTourSeek = (e: Event) => {
      const detail = (e as CustomEvent<{ progress?: number; time?: number; phase?: string }>).detail;
      const totalDuration = 15.0;
      if (typeof detail?.progress === 'number') {
        tourTimeRef.current = detail.progress * totalDuration;
      } else if (typeof detail?.time === 'number') {
        tourTimeRef.current = detail.time;
      } else if (detail?.phase) {
        if (detail.phase === 'macro') tourTimeRef.current = 1.0;
        else if (detail.phase === 'micro') tourTimeRef.current = 5.5;
        else if (detail.phase === 'molecular') tourTimeRef.current = 10.5;
      }
      if (camera) {
        tourAngleRef.current = Math.atan2(camera.position.z, camera.position.x);
        const curDist = camera.position.distanceTo(controlsRef.current?.target || _zeroVector);
        currentTourDistRef.current = curDist;
        currentTourElevationRef.current = camera.position.y / Math.max(0.1, curDist * 0.32);
      }
    };

    window.addEventListener('material-zoom-target', handleZoomTarget);
    window.addEventListener('material-camera-angle', handleCameraAngle);
    window.addEventListener('material-user-camera-change', handleUserCameraChange);
    window.addEventListener('material-tour-seek', handleTourSeek);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('material-zoom-target', handleZoomTarget);
      window.removeEventListener('material-camera-angle', handleCameraAngle);
      window.removeEventListener('material-user-camera-change', handleUserCameraChange);
      window.removeEventListener('material-tour-seek', handleTourSeek);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [setCameraAngle, controlsRef]);

  // ── Animation Loop ──────────────────────────────────────────────────
  useFrame((_state, delta) => {
    if (!camera || !controlsRef.current) return;
    const controls = controlsRef.current;

    // ── CINEMATIC TOUR MODE ──────────────────────────────────────────
    if (isTourActive) {
      if (!isTourPaused) {
        tourTimeRef.current += delta;
      }
      const totalDuration = 15.0;
      const loopTime = tourTimeRef.current % totalDuration;
      const progress = loopTime / totalDuration;
      setTourProgress(progress);

      let targetTourDist: number;
      let targetElevation: number;
      let phase: 'macro' | 'micro' | 'molecular';

      // ── Smooth 3-Phase Choreography ────────────────────────────────
      // Phase 1 (Macro): 0.0s – 3.4s plateau at 10.5, 3.4s – 4.8s zoom to micro
      // Phase 2 (Micro): 4.8s – 8.2s plateau at 6.0, 8.2s – 10.0s zoom to molecular
      // Phase 3 (Molecular): 10.0s – 13.6s plateau at 3.2, 13.6s – 15.0s return to macro
      if (loopTime < 3.4) {
        phase = 'macro';
        targetTourDist = 10.5;
        targetElevation = 0.65;
      } else if (loopTime < 4.8) {
        const t = (loopTime - 3.4) / 1.4;
        const s = t * t * (3 - 2 * t);
        targetTourDist = THREE.MathUtils.lerp(10.5, 6.0, s);
        targetElevation = THREE.MathUtils.lerp(0.65, 0.58, s);
        phase = t < 0.5 ? 'macro' : 'micro';
      } else if (loopTime < 8.2) {
        phase = 'micro';
        targetTourDist = 6.0;
        targetElevation = 0.58;
      } else if (loopTime < 10.0) {
        // Chuyển tiếp mượt mà từ Ô mạng (2) sang Nguyên tử (3)
        const t = (loopTime - 8.2) / 1.8;
        const s = t * t * (3 - 2 * t);
        targetTourDist = THREE.MathUtils.lerp(6.0, 3.2, s);
        targetElevation = THREE.MathUtils.lerp(0.58, 0.45, s);
        phase = t < 0.5 ? 'micro' : 'molecular';
      } else if (loopTime < 13.6) {
        phase = 'molecular';
        targetTourDist = 3.2;
        targetElevation = 0.45;
      } else {
        const t = (loopTime - 13.6) / 1.4;
        const s = t * t * (3 - 2 * t);
        targetTourDist = THREE.MathUtils.lerp(3.2, 10.5, s);
        targetElevation = THREE.MathUtils.lerp(0.45, 0.65, s);
        phase = t < 0.5 ? 'molecular' : 'macro';
      }

      setTourPhase(phase);

      // KHI TẠM DỪNG: Cho phép người dùng tự do xoay quanh ngắm mô hình 3D
      if (isTourPaused) {
        wasPausedRef.current = true;
        controls.enabled = true;
        controls.update();

        // Ghi nhận góc, độ cao và khoảng cách người dùng vừa chỉnh
        const curDist = camera.position.distanceTo(controls.target);
        currentTourDistRef.current = curDist;
        tourAngleRef.current = Math.atan2(camera.position.z, camera.position.x);
        currentTourElevationRef.current = camera.position.y / Math.max(0.1, curDist * 0.32);

        const clamped = THREE.MathUtils.clamp(curDist, ZOOM_DIST.MIN, ZOOM_DIST.MAX);
        computeAndUpdateZoomState(clamped);

        const storeLayer = useStore.getState().activeLayer;
        if (zoomState.layer !== storeLayer) {
          setActiveLayer(zoomState.layer);
          sound.playTransition(zoomState.layer);
          prevLayer.current = zoomState.layer;
        }
        setCameraDistance(clamped);
        setZoomProgress(zoomState.zoomProgress);
        return;
      }

      // KHI TIẾP TỤC SAU KHI XOAY / DI CHUYỂN: Tiếp tục mượt mà ngay tại góc và tầng người dùng đang ngắm
      if (wasPausedRef.current) {
        controls.enabled = false;
        const curDist = camera.position.distanceTo(controls.target);
        currentTourDistRef.current = curDist;
        tourAngleRef.current = Math.atan2(camera.position.z, camera.position.x);
        currentTourElevationRef.current = camera.position.y / Math.max(0.1, curDist * 0.32);

        // Đồng bộ tiến trình tour theo tầng quan sát hiện tại (Tuyệt đối không giật ngược lùi về tọa độ cũ rồi phát lại!)
        if (curDist <= 4.6) {
          tourTimeRef.current = 10.2;
        } else if (curDist >= 8.2) {
          tourTimeRef.current = 1.0;
        } else {
          tourTimeRef.current = 5.5;
        }

        wasPausedRef.current = false;
      }

      // Tích lũy góc quay liên tục với vận tốc ổn định (C^1 continuous, không bao giờ bị giật góc)
      tourAngleRef.current += delta * 0.38;

      // Nội suy khoảng cách mượt mà từ vị trí hiện tại về mục tiêu
      if (currentTourDistRef.current === null) {
        currentTourDistRef.current = targetTourDist;
      } else {
        currentTourDistRef.current = THREE.MathUtils.lerp(
          currentTourDistRef.current,
          targetTourDist,
          1.0 - Math.exp(-delta * 3.5)
        );
      }

      // Nội suy độ cao mượt mà từ độ cao hiện tại về mục tiêu (loại bỏ hoàn toàn khựng/giật Y)
      if (currentTourElevationRef.current === null) {
        currentTourElevationRef.current = targetElevation;
      } else {
        currentTourElevationRef.current = THREE.MathUtils.lerp(
          currentTourElevationRef.current,
          targetElevation,
          1.0 - Math.exp(-delta * 3.0)
        );
      }

      const activeDist = currentTourDistRef.current;
      const activeElevation = currentTourElevationRef.current;
      const angle = tourAngleRef.current;
      const camX = Math.cos(angle) * activeDist;
      const camZ = Math.sin(angle) * activeDist;
      const camY = activeDist * (activeElevation * 0.32);

      camera.position.set(camX, camY, camZ);
      camera.lookAt(0, 0, 0);
      controls.target.set(0, 0, 0);

      const dist = camera.position.distanceTo(controls.target);
      const clamped = THREE.MathUtils.clamp(dist, ZOOM_DIST.MIN, ZOOM_DIST.MAX);
      computeAndUpdateZoomState(clamped);

      const storeLayer = useStore.getState().activeLayer;
      if (zoomState.layer !== storeLayer) {
        setActiveLayer(zoomState.layer);
        sound.playTransition(zoomState.layer);
        prevLayer.current = zoomState.layer;
      }
      setCameraDistance(clamped);
      setZoomProgress(zoomState.zoomProgress);
      return;
    } else {
      tourTimeRef.current = 0;
      currentTourDistRef.current = null;
      currentTourElevationRef.current = null;
      wasPausedRef.current = false;
      if (controls) {
        controls.enabled = true;
      }
    }

    // ── NORMAL MODE: Read current spherical from OrbitControls ────────
    const target = controls.target;
    _offset.copy(camera.position).sub(target);
    _spherical.setFromVector3(_offset);

    let needsUpdate = false;

    // ── ANGLE PRESET ANIMATION (Shortest-Path Interpolation) ───────
    if (isAnimatingAngle.current && angleTargetPhi.current !== null && angleTargetTheta.current !== null) {
      const factor = 1.0 - Math.exp(-delta * 12.0); // Crisp 12.0 speed for snappy feel

      // Smooth polar angle (phi)
      _spherical.phi = THREE.MathUtils.lerp(_spherical.phi, angleTargetPhi.current, factor);

      // Shortest-path angular interpolation for azimuthal angle (theta)
      let thetaDiff = (angleTargetTheta.current - _spherical.theta) % (Math.PI * 2);
      if (thetaDiff < -Math.PI) thetaDiff += Math.PI * 2;
      if (thetaDiff > Math.PI) thetaDiff -= Math.PI * 2;
      _spherical.theta += thetaDiff * factor;

      // Smoothly recenter target to (0, 0, 0) if user panned away
      if (target.lengthSq() > 0.0001) {
        target.lerp(_zeroVector, factor);
      }

      const phiDiff = Math.abs(_spherical.phi - angleTargetPhi.current);
      const absThetaDiff = Math.abs(thetaDiff);

      if (phiDiff < 0.005 && absThetaDiff < 0.005) {
        _spherical.phi = angleTargetPhi.current;
        _spherical.theta = angleTargetTheta.current;
        target.set(0, 0, 0);
        angleTargetPhi.current = null;
        angleTargetTheta.current = null;
        isAnimatingAngle.current = false;
        // Re-enable damping for smooth manual interaction once settled
        if (controlsRef.current && zoomTargetRadius.current === null) {
          controlsRef.current.enableDamping = true;
        }
      }

      needsUpdate = true;
    }

    // ── BUTTON / KEYBOARD ZOOM ANIMATION ─────────────────────────────
    if (zoomTargetRadius.current !== null) {
      const currentRadius = _spherical.radius;
      const targetRadius = zoomTargetRadius.current;
      const factor = 1.0 - Math.exp(-delta * zoomLerpSpeed.current);
      const newRadius = THREE.MathUtils.lerp(currentRadius, targetRadius, factor);

      _spherical.radius = newRadius;
      needsUpdate = true;

      // Settle when close enough
      if (Math.abs(newRadius - targetRadius) < 0.02) {
        _spherical.radius = targetRadius;
        zoomTargetRadius.current = null;
        if (controlsRef.current && !isAnimatingAngle.current) {
          controlsRef.current.enableDamping = true;
        }
        window.dispatchEvent(new CustomEvent('material-zoom-settled'));
      }
    }

    // ── APPLY SPHERICAL BACK TO CAMERA ──────────────────────────────
    if (needsUpdate) {
      _spherical.makeSafe();
      _offset.setFromSpherical(_spherical);
      camera.position.copy(target).add(_offset);
      camera.lookAt(target);
      controls.update();
    }

    // ── DISTANCE SYNCHRONIZATION (Always runs) ──────────────────────
    const dist = camera.position.distanceTo(target);
    const clamped = THREE.MathUtils.clamp(dist, ZOOM_DIST.MIN, ZOOM_DIST.MAX);
    computeAndUpdateZoomState(clamped);

    // Update layer from camera distance when not programmatically zooming
    if (zoomTargetRadius.current === null && !isAnimatingAngle.current) {
      const storeLayer = useStore.getState().activeLayer;
      if (zoomState.layer !== storeLayer) {
        setActiveLayer(zoomState.layer);
        sound.playTransition(zoomState.layer);
        prevLayer.current = zoomState.layer;
      }
    }

    // Throttled store updates
    if (Math.abs(clamped - prevDistRef.current) > 0.04) {
      setCameraDistance(clamped);
      setZoomProgress(zoomState.zoomProgress);
      prevDistRef.current = clamped;
    }
  });

  return null;
}

// ── Holographic Pedestal ─────────────────────────────────────────────────────
function HolographicPedestal({ radius = 1.6, color = '#38bdf8' }: { radius?: number; color?: string }) {
  const outerRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (outerRef.current) outerRef.current.rotation.z = clock.elapsedTime * 0.32;
    if (innerRef.current) innerRef.current.rotation.z = -clock.elapsedTime * 0.48;
  });

  return (
    <group position={[0, -1.85, 0]} raycast={() => null}>
      <mesh ref={outerRef} raycast={() => null} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius * 0.9, radius, 48]} />
        <meshBasicMaterial color={color} transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={innerRef} raycast={() => null} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius * 0.7, radius * 0.76, 36]} />
        <meshBasicMaterial color={color} transparent opacity={0.22} side={THREE.DoubleSide} />
      </mesh>
      <mesh raycast={() => null} position={[0, -0.05, 0]}>
        <cylinderGeometry args={[radius * 0.82, radius * 0.95, 0.06, 48]} />
        <meshStandardMaterial color="#0f172a" roughness={0.4} metalness={0.8} />
      </mesh>
    </group>
  );
}

// ── Single Material Display ──────────────────────────────────────────────────
function SingleMaterialDisplay({ material }: { material: (typeof MATERIAL_MAP extends Map<unknown, infer V> ? V : never) }) {
  const activeLayer = useStore((s: StoreState) => s.activeLayer);

  return (
    <group>
      <Float speed={1.1} rotationIntensity={0.22} floatIntensity={0.18}>
        <MacroObject material={material} />
        <MicroUnitCell material={material} />
        <MolecularStructure material={material} />
        <CrystallographyOverlays />
      </Float>
      {activeLayer === 'macro' && (
        <HolographicPedestal radius={1.75} color={material.color || '#38bdf8'} />
      )}
    </group>
  );
}

// ── Dual Material Display (Comparison Mode) ──────────────────────────────────
function DualMaterialDisplay({
  matA,
  matB,
}: {
  matA: NonNullable<ReturnType<typeof MATERIAL_MAP.get>>;
  matB: NonNullable<ReturnType<typeof MATERIAL_MAP.get>>;
}) {
  const activeLayer = useStore((s: StoreState) => s.activeLayer);
  const isDetailOpen = useStore((s: StoreState) => s.isDetailOpen);
  const isCompareOpen = useStore((s: StoreState) => s.isCompareOpen);
  const isZenMode = useStore((s: StoreState) => s.isZenMode);

  // Prevent 3D projected HTML tags from piercing through modals and overlapping UI
  const show3DLabels = !isDetailOpen && !isCompareOpen && !isZenMode;

  return (
    <group>
      {/* Material A (Left) */}
      <group position={[-2.8, 0, 0]}>
        <Float speed={1.1} rotationIntensity={0.22} floatIntensity={0.18}>
          <MacroObject material={matA} />
          <MicroUnitCell material={matA} />
          <MolecularStructure material={matA} />
        </Float>
        {activeLayer === 'macro' && (
          <HolographicPedestal radius={1.4} color={matA.color || '#22d3ee'} />
        )}
        {show3DLabels && (
          <Html position={[0, -1.8, 0]} center distanceFactor={12} zIndexRange={[1, 4]}>
            <div className="px-2.5 py-0.5 rounded-full bg-slate-900/90 border border-cyan-400/80 text-cyan-300 text-[11px] font-bold whitespace-nowrap shadow-lg pointer-events-none select-none">
              {matA.nameVi} ({matA.formula})
            </div>
          </Html>
        )}
      </group>

      {/* Material B (Right) */}
      <group position={[2.8, 0, 0]}>
        <Float speed={1.1} rotationIntensity={0.22} floatIntensity={0.18}>
          <MacroObject material={matB} />
          <MicroUnitCell material={matB} />
          <MolecularStructure material={matB} />
        </Float>
        {activeLayer === 'macro' && (
          <HolographicPedestal radius={1.4} color={matB.color || '#e879f9'} />
        )}
        {show3DLabels && (
          <Html position={[0, -1.8, 0]} center distanceFactor={12} zIndexRange={[1, 4]}>
            <div className="px-2.5 py-0.5 rounded-full bg-slate-900/90 border border-fuchsia-400/80 text-fuchsia-300 text-[11px] font-bold whitespace-nowrap shadow-lg pointer-events-none select-none">
              {matB.nameVi} ({matB.formula})
            </div>
          </Html>
        )}
      </group>
    </group>
  );
}

// ── High-Res Mobile & Desktop WebGL Snapshot Manager ─────────────────────────
function SnapshotManager() {
  const { gl, scene, camera } = useThree();
  const snapshotTrigger = useStore((s: StoreState) => s.snapshotTrigger);
  const setSnapshotFlash = useStore((s: StoreState) => s.setSnapshotFlash);
  const setIsCapturingSnapshot = useStore((s: StoreState) => s.setIsCapturingSnapshot);

  const lastHandledTriggerRef = useRef(0);
  const isCapturingRef = useRef(false);

  useEffect(() => {
    if (snapshotTrigger === 0 || snapshotTrigger <= lastHandledTriggerRef.current) {
      return;
    }
    lastHandledTriggerRef.current = snapshotTrigger;

    if (isCapturingRef.current) return;
    isCapturingRef.current = true;
    setIsCapturingSnapshot(true);

    sound.playShutter();
    setSnapshotFlash(true);
    const flashTimer = setTimeout(() => setSnapshotFlash(false), 300);

    const {
      selectedMaterial,
      activeLayer,
      isDual3DView,
      compareMaterialA,
      compareMaterialB,
    } = useStore.getState();

    try {
      // 1. Force WebGL render immediately to get pristine current frame
      gl.render(scene, camera);

      // 2. Composite onto an offscreen 2D canvas with branding card
      const exportCanvas = document.createElement('canvas');
      exportCanvas.width = gl.domElement.width;
      exportCanvas.height = gl.domElement.height;
      const ctx = exportCanvas.getContext('2d');

      if (!ctx) {
        throw new Error('Canvas 2D context not available');
      }

      // 3. Draw 3D scene from WebGL canvas
      ctx.drawImage(gl.domElement, 0, 0);

      // 4. Draw scientific watermark banners
      const isMobileOrPortrait = exportCanvas.width < exportCanvas.height || exportCanvas.width < 768;
      const bannerHeight = Math.max(54, Math.round(exportCanvas.height * 0.085));
      const padX = Math.round(exportCanvas.width * 0.035);
      const fontSizeTitle = Math.max(14, Math.round(bannerHeight * 0.32));
      const fontSizeSub = Math.max(11, Math.round(bannerHeight * 0.22));

      // Draw bottom banner gradient
      const grad = ctx.createLinearGradient(0, exportCanvas.height - bannerHeight, 0, exportCanvas.height);
      grad.addColorStop(0, 'rgba(5, 5, 16, 0)');
      grad.addColorStop(0.35, 'rgba(5, 5, 16, 0.85)');
      grad.addColorStop(1, 'rgba(5, 5, 16, 0.98)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, exportCanvas.height - bannerHeight, exportCanvas.width, bannerHeight);

      // Material Title & Scale (always at bottom-left)
      ctx.textAlign = 'left';
      ctx.font = `bold ${fontSizeTitle}px sans-serif`;
      ctx.fillStyle = '#ffffff';

      const mat = MATERIAL_MAP.get(selectedMaterial);
      const matA = MATERIAL_MAP.get(compareMaterialA);
      const matB = MATERIAL_MAP.get(compareMaterialB);

      const titleText =
        isDual3DView && matA && matB
          ? `SO SÁNH: ${matA.nameVi.toUpperCase()} & ${matB.nameVi.toUpperCase()}`
          : `${mat?.nameVi.toUpperCase() || 'VẬT LIỆU'} (${mat?.formula || ''})`;
      
      const bottomMaxTextWidth = isMobileOrPortrait
        ? exportCanvas.width - padX * 2
        : Math.max(200, exportCanvas.width * 0.55);

      ctx.fillText(titleText, padX, exportCanvas.height - bannerHeight * 0.44, bottomMaxTextWidth);

      ctx.font = `600 ${fontSizeSub}px monospace`;
      ctx.fillStyle = '#38bdf8';
      const scaleText =
        activeLayer === 'macro'
          ? 'THANG ĐO: VĨ MÔ (VẬT THỂ)'
          : activeLayer === 'micro'
          ? 'THANG ĐO: Ô MẠNG TINH THỂ'
          : 'THANG ĐO: NGUYÊN TỬ & PHÂN TỬ';
      ctx.fillText(
        `${scaleText} • CẤU TRÚC 3D KHOA HỌC CHUẨN XÁC`,
        padX,
        exportCanvas.height - bannerHeight * 0.16,
        bottomMaxTextWidth
      );

      if (isMobileOrPortrait) {
        // Mobile / Portrait view: Place branding at the top-left with smooth gradient banner
        const topBannerHeight = Math.max(54, Math.round(exportCanvas.height * 0.085));
        const topGrad = ctx.createLinearGradient(0, 0, 0, topBannerHeight);
        topGrad.addColorStop(0, 'rgba(5, 5, 16, 0.95)');
        topGrad.addColorStop(0.5, 'rgba(5, 5, 16, 0.7)');
        topGrad.addColorStop(1, 'rgba(5, 5, 16, 0)');
        ctx.fillStyle = topGrad;
        ctx.fillRect(0, 0, exportCanvas.width, topBannerHeight);

        // Brand Lockup at top-left
        ctx.textAlign = 'left';
        ctx.font = `bold ${fontSizeTitle}px sans-serif`;
        ctx.fillStyle = '#38bdf8';
        ctx.fillText('DIGITAL MATTERIALS LAB', padX, topBannerHeight * 0.44, exportCanvas.width - padX * 2);

        ctx.font = `${fontSizeSub}px sans-serif`;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.78)';
        ctx.fillText('NGUYỄN VĂN TÀI', padX, topBannerHeight * 0.74, exportCanvas.width - padX * 2);
      } else {
        // Desktop / Landscape view: Place branding at bottom-right
        ctx.textAlign = 'right';
        ctx.font = `bold ${fontSizeTitle}px sans-serif`;
        ctx.fillStyle = '#38bdf8';
        ctx.fillText('DIGITAL MATTERIALS LAB', exportCanvas.width - padX, exportCanvas.height - bannerHeight * 0.44);

        ctx.font = `${fontSizeSub}px sans-serif`;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
        ctx.fillText('NGUYỄN VĂN TÀI', exportCanvas.width - padX, exportCanvas.height - bannerHeight * 0.16);
      }

      // Clean ASCII filename without diacritics for safe cross-platform saving
      const sanitize = (name: string) =>
        name
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[đĐ]/g, (m) => (m === 'đ' ? 'd' : 'D'))
          .replace(/[^a-zA-Z0-9_-]/g, '_')
          .replace(/_+/g, '_')
          .replace(/^_|_$/g, '');

      const rawMatName = isDual3DView
        ? 'SoSanh'
        : (mat?.nameVi || selectedMaterial || 'VatLieu');
      const safeMatName = sanitize(rawMatName) || 'VatLieu';
      const fileName = `DigitalMatterialsLab_${safeMatName}_${activeLayer}_${Date.now()}.png`;

      // 5. Export as pristine PNG image with guaranteed filename and .png extension
      const triggerDownload = (url: string) => {
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.setAttribute('download', fileName);
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        setTimeout(() => {
          if (link.parentNode) {
            link.parentNode.removeChild(link);
          }
          isCapturingRef.current = false;
          setIsCapturingSnapshot(false);
        }, 500);
      };

      try {
        const dataUrl = exportCanvas.toDataURL('image/png', 1.0);
        triggerDownload(dataUrl);
      } catch (canvasErr) {
        // Fallback to Blob if toDataURL encounters canvas size limits
        exportCanvas.toBlob(
          (blob) => {
            if (!blob) {
              isCapturingRef.current = false;
              setIsCapturingSnapshot(false);
              return;
            }
            const blobUrl = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = fileName;
            link.setAttribute('download', fileName);
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            setTimeout(() => {
              if (link.parentNode) {
                link.parentNode.removeChild(link);
              }
              URL.revokeObjectURL(blobUrl);
              isCapturingRef.current = false;
              setIsCapturingSnapshot(false);
            }, 500);
          },
          'image/png',
          1.0
        );
      }
    } catch (err) {
      console.error('Lỗi xuất file chụp ảnh 3D:', err);
      isCapturingRef.current = false;
      setIsCapturingSnapshot(false);
    }

    return () => clearTimeout(flashTimer);
  }, [snapshotTrigger, setSnapshotFlash, setIsCapturingSnapshot, gl, scene, camera]);

  return null;
}

// ── Scene Content ─────────────────────────────────────────────────────────────
function SceneContent() {
  const { camera } = useThree();
  const controlsRef = useRef<OrbitControlsInstance>(null);

  const selectedMaterial = useStore((s: StoreState) => s.selectedMaterial);
  const setIsUserInteracting = useStore((s: StoreState) => s.setIsUserInteracting);
  const setAutoRotate = useStore((s: StoreState) => s.setAutoRotate);
  const autoRotate = useStore((s: StoreState) => s.autoRotate);
  const isDual3DView = useStore((s: StoreState) => s.isDual3DView);
  const compareMaterialA = useStore((s: StoreState) => s.compareMaterialA);
  const compareMaterialB = useStore((s: StoreState) => s.compareMaterialB);
  const graphicsQuality = useStore((s: StoreState) => s.graphicsQuality);
  const cameraAngle = useStore((s: StoreState) => s.cameraAngle);
  const isTourActive = useStore((s: StoreState) => s.isTourActive);

  const isLow = graphicsQuality === 'low';
  const isHigh = graphicsQuality === 'high';

  const material = MATERIAL_MAP.get(selectedMaterial);
  const matA = MATERIAL_MAP.get(compareMaterialA);
  const matB = MATERIAL_MAP.get(compareMaterialB);
  const interactionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstMount = useRef(true);

  const handleControlsChange = useCallback(() => {
    // Only dispatch when user is truly touching/dragging with pointer/finger
    if (useStore.getState().isUserInteracting) {
      window.dispatchEvent(new CustomEvent('material-user-camera-change'));
    }
  }, []);

  const handleInteractionStart = useCallback(() => {
    setIsUserInteracting(true);
    setAutoRotate(false);

    // Tuyệt đối KHÔNG hủy tour khi người dùng tương tác! Tự động chuyển sang tạm dừng để người dùng tự do ngắm nhìn
    if (useStore.getState().isTourActive) {
      if (!useStore.getState().isTourPaused) {
        useStore.getState().setIsTourPaused(true);
      }
    } else {
      if (useStore.getState().cameraAngle !== 'iso') {
        useStore.getState().setCameraAngle('iso');
      }
    }

    window.dispatchEvent(new CustomEvent('material-user-camera-change'));
    if (interactionTimer.current) clearTimeout(interactionTimer.current);
  }, [setIsUserInteracting, setAutoRotate]);

  const handleInteractionEnd = useCallback(() => {
    // Immediately clear interaction state so buttons respond on the very first tap/click!
    setIsUserInteracting(false);
    if (interactionTimer.current) clearTimeout(interactionTimer.current);
    interactionTimer.current = setTimeout(() => {
      const shouldResume = useStore.getState().userAutoRotate;
      // Không tự ý bật autoRotate nếu đang trong chế độ Tour
      if (shouldResume && !useStore.getState().isTourActive) {
        setAutoRotate(true);
      }
    }, 2500);
  }, [setIsUserInteracting, setAutoRotate]);

  // Cleanup interaction timer on unmount
  useEffect(() => {
    return () => {
      if (interactionTimer.current) clearTimeout(interactionTimer.current);
    };
  }, []);

  useEffect(() => {
    if (camera) {
      if (isDual3DView) {
        camera.position.set(0, 3, 12);
      } else if (isFirstMount.current) {
        const curDist = useStore.getState().cameraDistance || 10;
        const curDir = new THREE.Vector3(0, 0.2, 1).normalize();
        camera.position.copy(curDir.multiplyScalar(curDist));
        isFirstMount.current = false;
      }
      camera.lookAt(0, 0, 0);
    }
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  }, [isDual3DView, camera]);

  if (!material) return null;

  return (
    <>
      <CameraDirector controlsRef={controlsRef} />
      <SnapshotManager />

      {/* Lighting with High/Medium Quality Shadows */}
      <ambientLight intensity={isLow ? 0.65 : 0.45} />
      <directionalLight
        position={[6, 9, 6]}
        intensity={isLow ? 1.25 : 1.55}
        castShadow={!isLow}
        shadow-mapSize={isHigh ? [2048, 2048] : [1024, 1024]}
        shadow-bias={-0.0001}
        color="#ffffff"
      />
      <directionalLight position={[-6, 4, -6]} intensity={0.45} color="#60a5fa" />
      {!isLow && (
        <pointLight position={[0, -2, 0]} intensity={0.5} distance={6} color="#38bdf8" />
      )}

      <Environment preset="city" />

      {isDual3DView && matA && matB ? (
        <DualMaterialDisplay matA={matA} matB={matB} />
      ) : (
        <SingleMaterialDisplay key={material.id} material={material} />
      )}

      <ContactShadows
        position={[0, -2, 0]}
        opacity={isLow ? 0.18 : 0.3}
        scale={isDual3DView ? 16 : 12}
        blur={isLow ? 1.0 : isHigh ? 2.5 : 1.8}
        far={isLow ? 3 : 5}
        frames={isLow ? 1 : Infinity}
      />

      <OrbitControls
        ref={controlsRef}
        touches={{
          ONE: THREE.TOUCH.ROTATE,
          TWO: THREE.TOUCH.DOLLY_PAN,
        }}
        enableZoom={true}
        enableRotate={true}
        enablePan={true}
        screenSpacePanning={false}
        autoRotate={!isTourActive && autoRotate && cameraAngle === 'iso'}
        autoRotateSpeed={0.75}
        enableDamping
        dampingFactor={0.08}
        zoomSpeed={1.0}
        rotateSpeed={0.85}
        minDistance={ZOOM_DIST.MIN}
        maxDistance={ZOOM_DIST.MAX + (isDual3DView ? 4 : 0)}
        maxPolarAngle={cameraAngle === 'top' ? Math.PI : Math.PI * 0.86}
        onStart={handleInteractionStart}
        onEnd={handleInteractionEnd}
        onChange={handleControlsChange}
      />

      <PostFX />
    </>
  );
}

function PostFX() {
  const activeLayer = useStore((s: StoreState) => s.activeLayer);
  const graphicsQuality = useStore((s: StoreState) => s.graphicsQuality);

  if (graphicsQuality === 'low') return null;

  return (
    <EffectComposer multisampling={graphicsQuality === 'high' ? 4 : 2}>
      <Bloom
        intensity={activeLayer === 'molecular' ? 0.75 : 0.35}
        luminanceThreshold={0.42}
        luminanceSmoothing={0.55}
        mipmapBlur
      />
      {graphicsQuality === 'high' && <SMAA />}
    </EffectComposer>
  );
}

// ── Main Export ───────────────────────────────────────────────────────────────
export default function Scene3D() {
  const graphicsQuality = useStore((s: StoreState) => s.graphicsQuality);
  const isLow = graphicsQuality === 'low';
  const isHigh = graphicsQuality === 'high';

  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas
        camera={{ position: [0, 2, 10], fov: 58, near: 0.08, far: 120 }}
        shadows={!isLow}
        onPointerMissed={() => {
          // Deselect atom when clicking empty background space
          useStore.getState().setSelectedAtom(null);
          useStore.getState().setInspectedAtom(null);
        }}
        gl={{
          antialias: !isLow,
          alpha: false,
          powerPreference: isLow ? 'default' : 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: isHigh ? 1.35 : 1.25,
          preserveDrawingBuffer: true,
        }}
        dpr={
          isHigh
            ? typeof window !== 'undefined'
              ? Math.min(window.devicePixelRatio || 1, 2)
              : [1, 2]
            : graphicsQuality === 'medium'
            ? [1, 1.35]
            : 1.0
        }
      >
        <color attach="background" args={['#050510']} />
        <fog attach="fog" args={['#050510', 20, 55]} />
        <SceneContent />
      </Canvas>

      <LayerTransitionOverlay />
    </div>
  );
}
