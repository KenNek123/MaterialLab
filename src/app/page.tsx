'use client';

import dynamic from 'next/dynamic';
import { useEffect, useMemo, useState } from 'react';
import {
  Atom,
  Box,
  Camera,
  Check,
  CircleHelp,
  Columns2,
  Eye,
  Grid3X3,
  Info,
  Layers3,
  Library,
  Pause,
  Play,
  RotateCw,
  Search,
  SlidersHorizontal,
  X,
  Zap,
} from 'lucide-react';
import AtomInspectorModal from '@/components/ui/AtomInspectorModal';
import CompareModal from '@/components/ui/CompareModal';
import DetailModal from '@/components/ui/DetailModal';
import MaterialBadge from '@/components/ui/MaterialBadge';
import RightInfoPanel from '@/components/ui/RightInfoPanel';
import TourOverlay from '@/components/ui/TourOverlay';
import MobileZoomControls from '@/components/ui/MobileZoomControls';
import { ZOOM_DIST } from '@/components/3d/zoomState';
import { MATERIALS, MATERIAL_CATEGORIES, MATERIAL_MAP } from '@/data/materials';
import { sound } from '@/lib/soundFx';
import { StoreState, useStore, ZoomLayer } from '@/store/useStore';

const Scene3D = dynamic(() => import('@/components/3d/Scene3D'), {
  ssr: false,
  loading: () => (
    <div className="scene-loading" role="status">
      <div className="loading-atom">
        <Atom size={26} />
      </div>
      <strong>Đang dựng mô hình 3D</strong>
      <span>Chuẩn bị không gian vật liệu...</span>
    </div>
  ),
});

const STAGES: Array<{
  id: ZoomLayer;
  label: string;
  shortLabel: string;
  caption: string;
  scale: string;
  icon: typeof Eye;
  distance: number;
  progress: number;
}> = [
  {
    id: 'macro',
    label: 'Vật thể',
    shortLabel: 'Vĩ mô',
    caption: 'Linh kiện & Ứng dụng',
    scale: 'mm - cm',
    icon: Eye,
    distance: ZOOM_DIST.MACRO,
    progress: 0,
  },
  {
    id: 'micro',
    label: 'Ô mạng',
    shortLabel: 'Vi mô',
    caption: 'Mạng tinh thể cơ sở',
    scale: 'µm - nm',
    icon: Grid3X3,
    distance: ZOOM_DIST.MICRO,
    progress: 0.5,
  },
  {
    id: 'molecular',
    label: 'Nguyên tử',
    shortLabel: 'Nano',
    caption: 'Liên kết & Tọa độ hạt',
    scale: 'Å',
    icon: Atom,
    distance: ZOOM_DIST.MOLECULAR,
    progress: 1,
  },
];

const CATEGORY_LABELS: Record<string, string> = {
  all: `Tất cả (${MATERIALS.length})`,
  metal: 'Kim loại & Hợp kim',
  crystal: 'Gốm & Tinh thể',
  nano: 'Vật liệu Nano',
  molecular: 'Cấu trúc Phân tử',
  daily: 'Đời sống & Tự nhiên',
  tech: 'Bán dẫn & Năng lượng',
  polymer: 'Polyme & Gốm Sứ',
};

function SettingsRow({
  active = false,
  label,
  icon: Icon,
  onClick,
}: {
  active?: boolean;
  label: string;
  icon: typeof Eye;
  onClick: () => void;
}) {
  return (
    <button className={`tool-row ${active ? 'is-active' : ''}`} onClick={onClick} type="button">
      <span className="tool-row-icon">
        <Icon size={17} />
      </span>
      <span>{label}</span>
      {active && <Check size={16} className="tool-check" />}
    </button>
  );
}

export default function HomePage() {
  const selectedMaterial = useStore((s: StoreState) => s.selectedMaterial);
  const setSelectedMaterial = useStore((s: StoreState) => s.setSelectedMaterial);
  const resetInteractionAndViewStates = useStore(
    (s: StoreState) => s.resetInteractionAndViewStates
  );
  const setSelectedAtom = useStore((s: StoreState) => s.setSelectedAtom);
  const setInspectedAtom = useStore((s: StoreState) => s.setInspectedAtom);
  const activeLayer = useStore((s: StoreState) => s.activeLayer);
  const setActiveLayer = useStore((s: StoreState) => s.setActiveLayer);
  const setCameraDistance = useStore((s: StoreState) => s.setCameraDistance);
  const setZoomProgress = useStore((s: StoreState) => s.setZoomProgress);
  const setIsCompareOpen = useStore((s: StoreState) => s.setIsCompareOpen);
  const setIsDetailOpen = useStore((s: StoreState) => s.setIsDetailOpen);
  const isDual3DView = useStore((s: StoreState) => s.isDual3DView);
  const setIsDual3DView = useStore((s: StoreState) => s.setIsDual3DView);
  const isTourActive = useStore((s: StoreState) => s.isTourActive);
  const toggleTour = useStore((s: StoreState) => s.toggleTour);
  const userAutoRotate = useStore((s: StoreState) => s.userAutoRotate);
  const toggleAutoRotate = useStore((s: StoreState) => s.toggleAutoRotate);
  const graphicsQuality = useStore((s: StoreState) => s.graphicsQuality);
  const toggleGraphicsQuality = useStore((s: StoreState) => s.toggleGraphicsQuality);
  const triggerSnapshot = useStore((s: StoreState) => s.triggerSnapshot);
  const isCapturingSnapshot = useStore((s: StoreState) => s.isCapturingSnapshot);
  const cameraAngle = useStore((s: StoreState) => s.cameraAngle);
  const setCameraAngle = useStore((s: StoreState) => s.setCameraAngle);
  const showLatticeCage = useStore((s: StoreState) => s.showLatticeCage);
  const toggleLatticeCage = useStore((s: StoreState) => s.toggleLatticeCage);
  const showMillerPlanes = useStore((s: StoreState) => s.showMillerPlanes);
  const toggleMillerPlanes = useStore((s: StoreState) => s.toggleMillerPlanes);
  const structureLayerCount = useStore((s: StoreState) => s.structureLayerCount);
  const setStructureLayerCount = useStore((s: StoreState) => s.setStructureLayerCount);
  const inspectedAtom = useStore((s: StoreState) => s.inspectedAtom);

  const [libraryOpen, setLibraryOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  const material = MATERIAL_MAP.get(selectedMaterial) ?? MATERIALS[0];
  const activeStage = STAGES.find((stage) => stage.id === activeLayer) ?? STAGES[0];

  // Protocol Rule: Central clean-up whenever selectedMaterial changes
  useEffect(() => {
    resetInteractionAndViewStates();
  }, [selectedMaterial, resetInteractionAndViewStates]);

  const filteredMaterials = useMemo(() => {
    const keyword = search.trim().toLocaleLowerCase('vi');
    return MATERIALS.filter((item) => {
      const matchesCategory = category === 'all' || item.category === category;
      const matchesSearch =
        !keyword ||
        `${item.nameVi} ${item.name} ${item.formula} ${item.objectNameVi}`
          .toLocaleLowerCase('vi')
          .includes(keyword);
      return matchesCategory && matchesSearch;
    });
  }, [category, search]);

  const goToStage = (stage: (typeof STAGES)[number]) => {
    sound.playClick();
    // Protocol Rule: Reset atom inspection when changing observation zoom layers
    setSelectedAtom(null);
    setInspectedAtom(null);
    window.dispatchEvent(
      new CustomEvent('material-zoom-target', {
        detail: { distance: stage.distance, immediate: false },
      })
    );
    setCameraDistance(stage.distance);
    setZoomProgress(stage.progress);
    setActiveLayer(stage.id);
  };

  const changeCameraAngle = (angle: 'iso' | 'top' | 'side') => {
    sound.playClick();
    window.dispatchEvent(new CustomEvent('material-camera-angle', { detail: { angle } }));
    setCameraAngle(angle);
  };

  const chooseMaterial = (id: string) => {
    sound.playClick();
    resetInteractionAndViewStates();
    setSelectedMaterial(id);
    setLibraryOpen(false);
  };

  return (
    <main className="learning-app">
      <div className="scene-grid" aria-hidden="true" />

      {/* 3D Scene */}
      <Scene3D />

      {/* Top Header */}
      <header className="app-header">
        <div className="brand-lockup">
          <span className="brand-mark">
            <Atom size={22} />
          </span>
          <div>
            <h1>Digital Materials Lab</h1>
            <p>Nguyễn Văn Tài</p>
          </div>
        </div>

        <div className="header-context" aria-label="Ngữ cảnh vật liệu">
          <MaterialBadge material={material} size="sm" />
          <div>
            <strong>{material.nameVi}</strong>
            <small>
              {activeStage.shortLabel} · {activeStage.scale}
            </small>
          </div>
        </div>

        <div className="header-actions">
          <button
            className="header-button mobile-library-button"
            onClick={() => setLibraryOpen(true)}
            type="button"
          >
            <Library size={18} />
            <span>Vật liệu ({MATERIALS.length})</span>
          </button>

          <button
            className={`header-button primary-action ${isTourActive ? 'is-playing' : ''}`}
            onClick={() => {
              sound.playClick();
              toggleTour();
            }}
            type="button"
          >
            {isTourActive ? <Pause size={18} /> : <Play size={18} />}
            <span>{isTourActive ? 'Tạm dừng' : 'Trình chiếu'}</span>
          </button>

          {/* Settings button in top-right: strictly display configurations */}
          <div className="tools-anchor">
            <button
              className={`icon-button ${settingsOpen ? 'is-active' : ''}`}
              onClick={() => setSettingsOpen((v) => !v)}
              title="Cài đặt hiển thị"
              type="button"
            >
              <SlidersHorizontal size={19} />
            </button>
          </div>
        </div>
      </header>

      {/* Floating Action Dock (Requirement 4.2): Quick actions on left */}
      <nav className="floating-action-dock" aria-label="Thanh công cụ nhanh">
        <button
          className="dock-action-btn"
          onClick={() => {
            sound.playClick();
            setIsDetailOpen(true);
          }}
          title="Mở hồ sơ khoa học chi tiết & bản chất liên kết nguyên tử"
          type="button"
        >
          <Info size={16} />
          <span>Hồ sơ chi tiết & Liên kết</span>
        </button>

        <button
          className="dock-action-btn"
          onClick={() => {
            sound.playClick();
            setIsCompareOpen(true);
          }}
          title="Mở bảng so sánh đa tầng"
          type="button"
        >
          <Columns2 size={16} />
          <span>So sánh vật liệu</span>
        </button>

        <button
          className={`dock-action-btn ${isDual3DView ? 'is-active' : ''}`}
          onClick={() => {
            sound.playClick();
            setIsDual3DView(!isDual3DView);
          }}
          title="Xem hai mô hình 3D cùng lúc"
          type="button"
        >
          <Box size={16} />
          <span>Xem hai mô hình</span>
        </button>

        <button
          className={`dock-action-btn ${isCapturingSnapshot ? 'opacity-70 cursor-wait' : ''}`}
          disabled={isCapturingSnapshot}
          onClick={() => {
            if (isCapturingSnapshot) return;
            sound.playClick();
            triggerSnapshot();
          }}
          title="Chụp ảnh mô hình 3D độ phân giải cao"
          type="button"
        >
          <Camera size={16} className={isCapturingSnapshot ? 'animate-pulse text-cyan-400' : ''} />
          <span>{isCapturingSnapshot ? 'Đang chụp...' : 'Chụp mô hình'}</span>
        </button>

        <div className="dock-view-selector">
          <span className="dock-view-label">Góc nhìn</span>
          <div className="dock-view-group">
            <button
              className={`dock-view-btn ${cameraAngle === 'iso' ? 'is-active' : ''}`}
              onClick={() => changeCameraAngle('iso')}
              type="button"
            >
              Mô hình 3D
            </button>
            <button
              className={`dock-view-btn ${cameraAngle === 'top' ? 'is-active' : ''}`}
              onClick={() => changeCameraAngle('top')}
              type="button"
            >
              Sơ đồ 2D
            </button>
            <button
              className={`dock-view-btn ${cameraAngle === 'side' ? 'is-active' : ''}`}
              onClick={() => changeCameraAngle('side')}
              type="button"
            >
              Cạnh bên
            </button>
          </div>
        </div>
      </nav>

      {/* Settings Menu: ONLY Display Configurations (Requirement 4.2) */}
      {settingsOpen && (
        <>
          <button
            className="tools-backdrop"
            onClick={() => setSettingsOpen(false)}
            aria-label="Đóng cài đặt"
            type="button"
          />
          <div className="tools-menu">
            <div className="menu-heading">
              <div>
                <strong>Cấu hình hiển thị</strong>
                <span>Tùy chỉnh không gian 3D</span>
              </div>
              <button onClick={() => setSettingsOpen(false)} type="button">
                <X size={17} />
              </button>
            </div>

            <div className="tool-grid">
              <SettingsRow
                active={userAutoRotate}
                label="Tự động xoay"
                icon={RotateCw}
                onClick={() => {
                  sound.playClick();
                  toggleAutoRotate();
                }}
              />
              <SettingsRow
                active={graphicsQuality === 'high'}
                label={`Đồ họa ${graphicsQuality === 'high' ? 'cao' : 'mượt'}`}
                icon={Zap}
                onClick={() => {
                  sound.playClick();
                  toggleGraphicsQuality();
                }}
              />
            </div>

            {activeLayer !== 'macro' && (
              <div className="tool-section">
                <span className="tool-section-label">Hiển thị mạng tinh thể</span>
                <div className="tool-grid compact">
                  <SettingsRow
                    active={showLatticeCage}
                    label="Khung ô mạng"
                    icon={Box}
                    onClick={() => {
                      sound.playClick();
                      toggleLatticeCage();
                    }}
                  />
                  <SettingsRow
                    active={showMillerPlanes}
                    label="Mặt tinh thể"
                    icon={Layers3}
                    onClick={() => {
                      sound.playClick();
                      toggleMillerPlanes();
                    }}
                  />
                </div>
              </div>
            )}

            {activeLayer === 'molecular' && (
              <div className="tool-section">
                <span className="tool-section-label">Số lớp cấu trúc</span>
                <div className="segmented-control">
                  {([1, 2, 3] as const).map((count) => (
                    <button
                      key={count}
                      className={structureLayerCount === count ? 'is-active' : ''}
                      onClick={() => setStructureLayerCount(count)}
                      type="button"
                    >
                      {count} lớp
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Material Library Sidebar */}
      <aside
        className={`material-library ${libraryOpen ? 'is-open' : ''}`}
        aria-label="Thư viện vật liệu"
      >
        <div className="panel-heading">
          <div>
            <span className="panel-kicker">{MATERIALS.length} vật liệu công nghệ cao</span>
            <h2>Thư viện vật liệu</h2>
          </div>
          <button
            className="close-mobile"
            onClick={() => setLibraryOpen(false)}
            aria-label="Đóng thư viện"
            type="button"
          >
            <X size={19} />
          </button>
        </div>

        <label className="search-field">
          <Search size={17} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm tên hoặc công thức"
          />
        </label>

        <div className="category-tabs" role="tablist" aria-label="Nhóm vật liệu">
          <button
            className={category === 'all' ? 'is-active' : ''}
            onClick={() => setCategory('all')}
            type="button"
          >
            Tất cả
          </button>
          {MATERIAL_CATEGORIES.map((item) => (
            <button
              key={item.key}
              className={category === item.key ? 'is-active' : ''}
              onClick={() => setCategory(item.key)}
              type="button"
            >
              {CATEGORY_LABELS[item.key] ?? item.label}
            </button>
          ))}
        </div>

        <div className="material-list custom-scrollbar">
          {filteredMaterials.map((item) => (
            <button
              key={`drawer-item-${item.id}`}
              className={`material-item ${item.id === selectedMaterial ? 'is-selected' : ''}`}
              onClick={() => chooseMaterial(item.id)}
              type="button"
            >
              <MaterialBadge material={item} size="md" />
              <span className="material-name">
                <strong>{item.nameVi}</strong>
                <small>{item.categoryLabel}</small>
              </span>
              <span className="material-formula">{item.formula}</span>
              {item.id === selectedMaterial && (
                <span className="selected-dot">
                  <Check size={12} />
                </span>
              )}
            </button>
          ))}
          {filteredMaterials.length === 0 && (
            <div className="empty-state">Không tìm thấy vật liệu phù hợp.</div>
          )}
        </div>
      </aside>

      {libraryOpen && (
        <button
          className="mobile-backdrop"
          onClick={() => setLibraryOpen(false)}
          aria-label="Đóng thư viện"
          type="button"
        />
      )}

      {/* Right Information Panel */}
      {!inspectedAtom && (
        <RightInfoPanel key={`right-panel-${selectedMaterial}`} material={material} activeStage={activeStage} />
      )}

      {/* Bottom Scale Navigator */}
      <nav className="scale-navigator" aria-label="Chọn cấp độ quan sát">
        <div className="stage-intro">
          <span>Cấp độ quan sát</span>
          <strong>{activeStage.shortLabel}</strong>
        </div>
        <div className="stage-list">
          {STAGES.map((stage, index) => {
            const Icon = stage.icon;
            const active = stage.id === activeLayer;
            return (
              <button
                key={stage.id}
                className={`stage-button ${active ? 'is-active' : ''}`}
                onClick={() => goToStage(stage)}
                type="button"
              >
                <span className="stage-number">{active ? <Icon size={17} /> : index + 1}</span>
                <span className="stage-text">
                  <strong>{stage.label}</strong>
                  <small>{stage.caption}</small>
                </span>
                <span className="stage-scale">{stage.scale}</span>
              </button>
            );
          })}
        </div>
        <div className="mobile-stage-help">
          <CircleHelp size={15} />
          <span>Chọn 1 trong 3 cấp độ để khám phá</span>
        </div>
      </nav>

      {/* Mobile & Tablet Floating Zoom Controls (+ / -) */}
      <MobileZoomControls />

      {/* 2D Projection Mode Active Indicator */}
      {cameraAngle === 'top' && (
        <div className="absolute top-[132px] md:top-20 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex items-center justify-center flex-wrap gap-1.5 md:gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/95 border border-sky-400/60 backdrop-blur-md shadow-xl shadow-cyan-950/40 text-xs text-sky-200 max-w-[94vw] text-center">
          <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping shrink-0" />
          <span className="font-bold text-white tracking-wide shrink-0">CHẾ ĐỘ SƠ ĐỒ 2D</span>
          <span className="text-white/30 shrink-0">|</span>
          <span className="text-sky-300 font-mono text-[11px] shrink-0">Hình chiếu trực diện (001)</span>
          <span className="text-white/30 shrink-0 hidden sm:inline">|</span>
          <span className="text-white/80 text-[11px] font-medium hidden sm:inline">{material.molecularInfo.latticeType}</span>
        </div>
      )}

      <AtomInspectorModal key={`atom-inspector-${selectedMaterial}`} />
      <TourOverlay />
      <CompareModal />
      <DetailModal />
    </main>
  );
}
