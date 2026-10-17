'use client';

import React, { useRef, useCallback, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Float, Html } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
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
  const snapshotFlash = useStore((s: StoreState) => s.snapshotFlash);

  return (
    <>
      <div
        className="fixed inset-0 z-10 pointer-events-none transition-all duration-700"
        style={{
          background: activeLayer === 'macro'
            ? 'radial-gradient(ellipse at center, transparent 65%, rgba(30,58,138,0.06) 100%)'
            : activeLayer === 'micro'
            ? 'radial-gradient(ellipse at center, transparent 55%, rgba(88,28,135,0.08) 100%)'
            : 'radial-gradient(ellipse at center, transparent 45%, rgba(131,24,67,0.10) 100%)',
        }}
      />
      {/* High-Res Snapshot Shutter Flash */}
      <div
        className={`fixed inset-0 z-50 pointer-events-none bg-white transition-opacity duration-300 ${
          snapshotFlash ? 'opacity-85' : 'opacity-0'
        }`}
      />
    </>
  );
}

// ── Zoom, Angle & Cinematic Tour Controller ──────────────────────────────────
function ZoomController({ controlsRef }: { controlsRef: React.RefObject<any> }) {
  const { camera } = useThree();
  const setActiveLayer = useStore((s: StoreState) => s.setActiveLayer);
  const setCameraDistance = useStore((s: StoreState) => s.setCameraDistance);
  const setZoomProgress = useStore((s: StoreState) => s.setZoomProgress);
  const setCameraAngle = useStore((s: StoreState) => s.setCameraAngle);

  const isTourActive = useStore((s: StoreState) => s.isTourActive);
  const setIsTourActive = useStore((s: StoreState) => s.setIsTourActive);
  const setTourPhase = useStore((s: StoreState) => s.setTourPhase);
  const setTourProgress = useStore((s: StoreState) => s.setTourProgress);

  const prevLayer = useRef<ZoomLayer>('macro');
  const targetDistRef = useRef<number | null>(null);
  const targetDirRef = useRef<THREE.Vector3 | null>(null);
  const isImmediateRef = useRef<boolean>(false);
  const prevDistRef = useRef<number>(10.0);
  const tourTimeRef = useRef<number>(0);

  useEffect(() => {
    const handleZoomTarget = (e: any) => {
      if (e.detail && typeof e.detail.distance === 'number') {
        targetDistRef.current = e.detail.distance;
        isImmediateRef.current = !!e.detail.immediate;
      }
    };
    const handleCameraAngle = (e: any) => {
      if (e.detail && e.detail.angle) {
        const angle = e.detail.angle as 'iso' | 'top' | 'side';
        setCameraAngle(angle);
        sound.playSnap();
        if (angle === 'top') {
          targetDirRef.current = new THREE.Vector3(0.001, 1, 0.001).normalize();
        } else if (angle === 'side') {
          targetDirRef.current = new THREE.Vector3(1, 0.1, 0.001).normalize();
        } else {
          // 'iso'
          targetDirRef.current = new THREE.Vector3(1, 0.65, 1).normalize();
        }
      }
    };
    const handlePointerDown = (e: PointerEvent) => {
      if ((e.target as HTMLElement)?.closest?.('button, input, select, [role="button"], .cyber-glass, .custom-scrollbar, .pip-card')) {
        return;
      }
      if (useStore.getState().isTourActive) {
        useStore.getState().setIsTourActive(false);
      }
      targetDistRef.current = null;
      targetDirRef.current = null;
      isImmediateRef.current = false;
    };

    window.addEventListener('material-zoom-target', handleZoomTarget);
    window.addEventListener('material-camera-angle', handleCameraAngle);
    window.addEventListener('pointerdown', handlePointerDown);
    return () => {
      window.removeEventListener('material-zoom-target', handleZoomTarget);
      window.removeEventListener('material-camera-angle', handleCameraAngle);
      window.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [setCameraAngle, setIsTourActive]);

  useFrame((state, delta) => {
    if (!camera) return;

    // ── Cinematic Multi-Scale Auto-Tour Mode ──────────────────────────────────
    if (isTourActive) {
      tourTimeRef.current += delta;
      const totalDuration = 14.0; // 14s complete journey
      const loopTime = tourTimeRef.current % totalDuration;
      const progress = loopTime / totalDuration;
      setTourProgress(progress);

      let targetTourDist: number;
      let phase: 'macro' | 'micro' | 'molecular';

      if (loopTime < 4.5) {
        // Phase 1: Macro overview
        phase = 'macro';
        targetTourDist = 11.2;
      } else if (loopTime < 9.0) {
        // Phase 2: Glide into Micro unit cell
        phase = 'micro';
        const t = (loopTime - 4.5) / 4.5;
        const smoothT = t * t * (3 - 2 * t);
        targetTourDist = THREE.MathUtils.lerp(11.2, 5.8, smoothT);
      } else if (loopTime < 13.0) {
        // Phase 3: Plunge into Molecular / Nano lattice
        phase = 'molecular';
        const t = (loopTime - 9.0) / 4.0;
        const smoothT = t * t * (3 - 2 * t);
        targetTourDist = THREE.MathUtils.lerp(5.8, 2.3, smoothT);
      } else {
        // Glide back to Macro
        phase = 'macro';
        const t = (loopTime - 13.0) / 1.0;
        const smoothT = t * t * (3 - 2 * t);
        targetTourDist = THREE.MathUtils.lerp(2.3, 11.2, smoothT);
      }

      setTourPhase(phase);

      // Smooth cinematic camera orbit
      const orbitSpeed = phase === 'molecular' ? 0.35 : 0.45;
      const angle = tourTimeRef.current * orbitSpeed;
      const elevation = phase === 'molecular' ? 0.5 : 0.72;
      const camX = Math.cos(angle) * targetTourDist;
      const camZ = Math.sin(angle) * targetTourDist;
      const camY = targetTourDist * (elevation * 0.32);

      camera.position.set(camX, camY, camZ);
      camera.lookAt(0, 0, 0);

      if (controlsRef.current) {
        controlsRef.current.target.set(0, 0, 0);
        controlsRef.current.update();
      }

      const dist = camera.position.length();
      const clamped = THREE.MathUtils.clamp(dist, ZOOM_DIST.MIN, ZOOM_DIST.MAX);
      computeAndUpdateZoomState(clamped);

      if (zoomState.layer !== prevLayer.current) {
        setActiveLayer(zoomState.layer);
        sound.playTransition(zoomState.layer);
        prevLayer.current = zoomState.layer;
      }
      setCameraDistance(clamped);
      setZoomProgress(zoomState.zoomProgress);
      return;
    } else {
      tourTimeRef.current = 0;
    }

    let hasTransform = false;

    // Smooth camera angle gliding
    if (targetDirRef.current) {
      const currentDir = camera.position.clone().normalize();
      const currentDist = camera.position.length();
      currentDir.lerp(targetDirRef.current, Math.min(1.0, delta * 7.5)).normalize();
      camera.position.copy(currentDir.multiplyScalar(currentDist));
      hasTransform = true;

      if (currentDir.angleTo(targetDirRef.current) < 0.015) {
        targetDirRef.current = null;
      }
    }

    // Smooth camera distance zoom lerping
    if (targetDistRef.current !== null) {
      const currentDist = camera.position.length();
      const factor = isImmediateRef.current ? 0.45 : Math.min(1.0, delta * 8.5);
      const newDist = THREE.MathUtils.lerp(currentDist, targetDistRef.current, factor);
      if (Math.abs(newDist - targetDistRef.current) < 0.015) {
        camera.position.normalize().multiplyScalar(targetDistRef.current);
        targetDistRef.current = null;
        isImmediateRef.current = false;
      } else {
        camera.position.normalize().multiplyScalar(newDist);
      }
      hasTransform = true;
    }

    if (hasTransform && controlsRef.current) {
      controlsRef.current.update();
    }

    const dist = camera.position.length();
    const clamped = THREE.MathUtils.clamp(dist, ZOOM_DIST.MIN, ZOOM_DIST.MAX);
    computeAndUpdateZoomState(clamped);

    if (zoomState.layer !== prevLayer.current) {
      setActiveLayer(zoomState.layer);
      sound.playTransition(zoomState.layer);
      prevLayer.current = zoomState.layer;
    }

    if (Math.abs(clamped - prevDistRef.current) > 0.005) {
      setCameraDistance(clamped);
      setZoomProgress(zoomState.zoomProgress);
      prevDistRef.current = clamped;
    }
  });

  return null;
}


// ── Holographic Pedestal ─────────────────────────────────────────────────────
function HolographicPedestal({ radius = 1.6, color = '#60a5fa' }: { radius?: number; color?: string }) {
  const outerRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (outerRef.current) outerRef.current.rotation.z = clock.elapsedTime * 0.32;
    if (innerRef.current) innerRef.current.rotation.z = -clock.elapsedTime * 0.48;
  });

  return (
    <group position={[0, -1.85, 0]}>
      <mesh ref={outerRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius * 0.90, radius, 48]} />
        <meshBasicMaterial color={color} transparent opacity={0.30} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={innerRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius * 0.70, radius * 0.76, 36]} />
        <meshBasicMaterial color={color} transparent opacity={0.22} side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[radius * 0.62, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.07} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

// ── Single Material Display ───────────────────────────────────────────────────
function SingleMaterialDisplay({ material }: { material: NonNullable<ReturnType<typeof MATERIAL_MAP.get>> }) {
  return (
    <group position={[0, 0, 0]}>
      <MacroObject material={material} />
      <MicroUnitCell material={material} />
      <MolecularStructure material={material} />
      <CrystallographyOverlays />
      <HolographicPedestal
        radius={1.8}
        color={material.category === 'metal' ? '#f59e0b' : material.category === 'nano' ? '#a855f7' : '#38bdf8'}
      />
    </group>
  );
}

// ── Dual Material Display ─────────────────────────────────────────────────────
function DualMaterialDisplay({
  matA, matB,
}: {
  matA: NonNullable<ReturnType<typeof MATERIAL_MAP.get>>;
  matB: NonNullable<ReturnType<typeof MATERIAL_MAP.get>>;
}) {
  return (
    <group>
      <group position={[-2.6, 0, 0]}>
        <MacroObject material={matA} />
        <MicroUnitCell material={matA} />
        <MolecularStructure material={matA} />
        <HolographicPedestal radius={1.4} color="#38bdf8" />
        <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
          <Html center position={[0, 2.2, 0]} className="pointer-events-none select-none">
            <div className="cyber-glass px-3 py-1 rounded-xl border border-cyan-400/40 text-xs font-bold text-white shadow-lg whitespace-nowrap flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee]" />
              <span>{matA.nameVi}</span>
              <span className="text-[10px] text-cyan-300 font-mono">({matA.formula})</span>
            </div>
          </Html>
        </Float>
      </group>

      <group position={[2.6, 0, 0]}>
        <MacroObject material={matB} />
        <MicroUnitCell material={matB} />
        <MolecularStructure material={matB} />
        <HolographicPedestal radius={1.4} color="#c084fc" />
        <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
          <Html center position={[0, 2.2, 0]} className="pointer-events-none select-none">
            <div className="cyber-glass px-3 py-1 rounded-xl border border-purple-400/40 text-xs font-bold text-white shadow-lg whitespace-nowrap flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_6px_#c084fc]" />
              <span>{matB.nameVi}</span>
              <span className="text-[10px] text-purple-300 font-mono">({matB.formula})</span>
            </div>
          </Html>
        </Float>
      </group>
    </group>
  );
}

// ── High-Res WebGL Snapshot Manager ───────────────────────────────────────────
function SnapshotManager() {
  const { gl, scene, camera } = useThree();
  const snapshotTrigger = useStore((s: StoreState) => s.snapshotTrigger);
  const setSnapshotFlash = useStore((s: StoreState) => s.setSnapshotFlash);
  const selectedMaterial = useStore((s: StoreState) => s.selectedMaterial);
  const activeLayer = useStore((s: StoreState) => s.activeLayer);

  useEffect(() => {
    if (snapshotTrigger === 0) return;
    sound.playShutter();
    setSnapshotFlash(true);
    const timer = setTimeout(() => setSnapshotFlash(false), 300);

    // Force frame render to ensure back-buffer is complete
    gl.render(scene, camera);
    const dataUrl = gl.domElement.toDataURL('image/png');

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Draw 3D scene
      ctx.drawImage(img, 0, 0);

      const mat = MATERIAL_MAP.get(selectedMaterial);
      const bannerHeight = Math.max(54, Math.round(canvas.height * 0.08));
      const padX = Math.round(canvas.width * 0.035);

      // Sci-fi lower gradient band
      const grad = ctx.createLinearGradient(0, canvas.height - bannerHeight, 0, canvas.height);
      grad.addColorStop(0, 'rgba(5, 5, 16, 0)');
      grad.addColorStop(0.35, 'rgba(5, 5, 16, 0.82)');
      grad.addColorStop(1, 'rgba(5, 5, 16, 0.98)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, canvas.height - bannerHeight, canvas.width, bannerHeight);

      const fontSizeTitle = Math.max(14, Math.round(bannerHeight * 0.32));
      const fontSizeSub = Math.max(11, Math.round(bannerHeight * 0.22));

      // Title & Formula
      ctx.font = `bold ${fontSizeTitle}px sans-serif`;
      ctx.fillStyle = '#ffffff';
      ctx.fillText(
        `${mat?.nameVi.toUpperCase() || 'VẬT LIỆU'} (${mat?.formula || ''})`,
        padX,
        canvas.height - bannerHeight * 0.44
      );

      // Sub-line: Scale and details
      ctx.font = `600 ${fontSizeSub}px monospace`;
      ctx.fillStyle = '#38bdf8';
      const scaleText =
        activeLayer === 'macro'
          ? 'THANG ĐO: VĨ MÔ (MACRO)'
          : activeLayer === 'micro'
          ? 'THANG ĐO: Ô MẠNG TINH THỂ (MICRO)'
          : 'THANG ĐO: PHÂN TỬ / NANO';
      ctx.fillText(
        `${scaleText} • CẤU TRÚC 3D CHUẨN KHOA HỌC`,
        padX,
        canvas.height - bannerHeight * 0.16
      );

      // Right-aligned branding
      ctx.font = `bold ${fontSizeTitle}px sans-serif`;
      ctx.fillStyle = '#c084fc';
      ctx.textAlign = 'right';
      ctx.fillText('MATERIAL 3D EXPLORER', canvas.width - padX, canvas.height - bannerHeight * 0.44);

      ctx.font = `${fontSizeSub}px sans-serif`;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.fillText(new Date().toLocaleDateString('vi-VN'), canvas.width - padX, canvas.height - bannerHeight * 0.16);

      const finalData = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = finalData;
      a.download = `Material3D_${selectedMaterial}_${activeLayer}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };
    img.src = dataUrl;

    return () => clearTimeout(timer);
  }, [snapshotTrigger, gl, scene, camera, selectedMaterial, activeLayer, setSnapshotFlash]);

  return null;
}

// ── Scene Content ─────────────────────────────────────────────────────────────
function SceneContent() {
  const controlsRef = useRef<any>(null);
  const { camera } = useThree();
  const selectedMaterial = useStore((s: StoreState) => s.selectedMaterial);
  const setIsUserInteracting = useStore((s: StoreState) => s.setIsUserInteracting);
  const setAutoRotate = useStore((s: StoreState) => s.setAutoRotate);
  const autoRotate = useStore((s: StoreState) => s.autoRotate);
  const isDual3DView = useStore((s: StoreState) => s.isDual3DView);
  const compareMaterialA = useStore((s: StoreState) => s.compareMaterialA);
  const compareMaterialB = useStore((s: StoreState) => s.compareMaterialB);
  const graphicsQuality = useStore((s: StoreState) => s.graphicsQuality);
  const cameraAngle = useStore((s: StoreState) => s.cameraAngle);

  const isLow = graphicsQuality === 'low';
  const material = MATERIAL_MAP.get(selectedMaterial);
  const matA = MATERIAL_MAP.get(compareMaterialA);
  const matB = MATERIAL_MAP.get(compareMaterialB);
  const interactionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstMount = useRef(true);

  const handleInteractionStart = useCallback(() => {
    setIsUserInteracting(true);
    setAutoRotate(false);
    if (useStore.getState().cameraAngle !== 'iso') {
      useStore.getState().setCameraAngle('iso');
    }
    if (interactionTimer.current) clearTimeout(interactionTimer.current);
  }, [setIsUserInteracting, setAutoRotate]);

  const handleInteractionEnd = useCallback(() => {
    if (interactionTimer.current) clearTimeout(interactionTimer.current);
    interactionTimer.current = setTimeout(() => {
      setIsUserInteracting(false);
      const shouldResume = useStore.getState().userAutoRotate;
      if (shouldResume) {
        setAutoRotate(true);
      }
    }, 3500);
  }, [setIsUserInteracting, setAutoRotate]);

  useEffect(() => {
    if (camera) {
      if (isDual3DView) {
        camera.position.set(0, 3, 12);
      } else if (isFirstMount.current) {
        camera.position.set(0, 2, 10);
        isFirstMount.current = false;
      }
      camera.lookAt(0, 0, 0);
    }
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  }, [selectedMaterial, isDual3DView, camera]);

  if (!material) return null;

  return (
    <>
      <ZoomController controlsRef={controlsRef} />
      <SnapshotManager />

      {/* Lighting */}
      <ambientLight intensity={isLow ? 0.65 : 0.45} />
      <directionalLight
        position={[6, 9, 6]}
        intensity={isLow ? 1.25 : 1.5}
        castShadow={!isLow}
        color="#ffffff"
      />
      <directionalLight position={[-6, 4, -6]} intensity={0.45} color="#60a5fa" />
      {!isLow && (
        <pointLight position={[0, 0, 2]} intensity={0.8} color="#93c5fd" distance={10} />
      )}

      <Environment preset="city" />

      {isDual3DView && matA && matB ? (
        <DualMaterialDisplay matA={matA} matB={matB} />
      ) : (
        <SingleMaterialDisplay material={material} />
      )}

      <ContactShadows
        position={[0, -2, 0]}
        opacity={isLow ? 0.18 : 0.28}
        scale={isDual3DView ? 16 : 12}
        blur={isLow ? 1.0 : 2.5}
        far={isLow ? 3 : 5}
        frames={isLow ? 1 : Infinity}
      />

      <OrbitControls
        ref={controlsRef}
        autoRotate={autoRotate && cameraAngle === 'iso'}
        autoRotateSpeed={0.75}
        enableDamping
        dampingFactor={0.055}
        minDistance={ZOOM_DIST.MIN}
        maxDistance={ZOOM_DIST.MAX + (isDual3DView ? 4 : 0)}
        maxPolarAngle={cameraAngle === 'top' ? Math.PI : Math.PI * 0.86}
        onStart={handleInteractionStart}
        onEnd={handleInteractionEnd}
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
    <EffectComposer multisampling={0}>
      <Bloom
        intensity={activeLayer === 'molecular' ? 0.7 : 0.28}
        luminanceThreshold={0.45}
        luminanceSmoothing={0.55}
        mipmapBlur
      />
    </EffectComposer>
  );
}

// ── Main Export ───────────────────────────────────────────────────────────────
export default function Scene3D() {
  const graphicsQuality = useStore((s: StoreState) => s.graphicsQuality);
  const isLow = graphicsQuality === 'low';

  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas
        camera={{ position: [0, 2, 10], fov: 58, near: 0.08, far: 120 }}
        shadows={!isLow}
        gl={{
          antialias: !isLow,
          alpha: false,
          powerPreference: isLow ? 'default' : 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.3,
          preserveDrawingBuffer: true,
        }}
        dpr={isLow ? 1 : [1, 1.5]}
      >
        <color attach="background" args={['#050510']} />
        <fog attach="fog" args={['#050510', 20, 55]} />
        <SceneContent />
      </Canvas>

      {/* Picture-in-Picture Layer Transition Overlay (pure HTML/CSS over canvas) */}
      <LayerTransitionOverlay />
    </div>
  );
}

