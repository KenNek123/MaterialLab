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
  Square,
  X,
  Zap,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import AtomInspectorModal from '@/components/ui/AtomInspectorModal';
import DetailModal from '@/components/ui/DetailModal';
import MaterialBadge from '@/components/ui/MaterialBadge';
import RightActionDock from '@/components/ui/RightActionDock';
import UnifiedBottomSheet from '@/components/ui/UnifiedBottomSheet';
import TourOverlay from '@/components/ui/TourOverlay';
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
  const openDetailTab = useStore((s: StoreState) => s.openDetailTab);
  const isDual3DView = useStore((s: StoreState) => s.isDual3DView);
  const setIsDual3DView = useStore((s: StoreState) => s.setIsDual3DView);
  const isTourActive = useStore((s: StoreState) => s.isTourActive);
  const toggleTour = useStore((s: StoreState) => s.toggleTour);
  const userAutoRotate = useStore((s: StoreState) => s.userAutoRotate);
  const toggleAutoRotate = useStore((s: StoreState) => s.toggleAutoRotate);
  const graphicsQuality = useStore((s: StoreState) => s.graphicsQuality);
  const toggleGraphicsQuality = useStore((s: StoreState) => s.toggleGraphicsQuality);
  const setGraphicsQuality = useStore((s: StoreState) => s.setGraphicsQuality);
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
  const isZenMode = useStore((s: StoreState) => s.isZenMode);

  const [libraryOpen, setLibraryOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  const compareMaterialA = useStore((s: StoreState) => s.compareMaterialA);
  const compareMaterialB = useStore((s: StoreState) => s.compareMaterialB);
  const material = MATERIAL_MAP.get(selectedMaterial) ?? MATERIALS[0];
  const matA = MATERIAL_MAP.get(compareMaterialA) ?? MATERIALS[0];
  const matB = MATERIAL_MAP.get(compareMaterialB) ?? MATERIALS[1] ?? MATERIALS[0];
  const activeStage = STAGES.find((stage) => stage.id === activeLayer) ?? STAGES[0];

  // Protocol Rule: Central clean-up whenever selectedMaterial changes
  useEffect(() => {
    resetInteractionAndViewStates();
  }, [selectedMaterial, resetInteractionAndViewStates]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('detail') === 'true') {
        setIsDetailOpen(true);
      }
      if (params.get('zen') === 'true') {
        useStore.getState().setIsZenMode(true);
      }
    }
  }, [setIsDetailOpen]);

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

      {/* Top Header: Brand Lockup + Center Material Badge (Task 3) + 3 Action Buttons */}
      <header className={`app-header ${isZenMode ? 'is-zen-hidden' : ''}`}>
        {/* Full Brand Lockup: Digital Matterials Lab & Nguyễn Văn Tài (Always fully visible on Desktop & Mobile) */}
        <div className="brand-lockup shrink-0">
          <span className="brand-mark shrink-0">
            <Atom size={22} />
          </span>
          <div className="brand-text">
            <h1 className="brand-title">Digital Matterials Lab</h1>
            <p className="brand-author">Nguyễn Văn Tài</p>
          </div>
        </div>

        {/* Center Container: Material Name Badge on Desktop (Header Centered) */}
        <div className="header-material-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 hidden min-[820px]:flex items-center justify-center max-w-[calc(100vw-360px)] md:max-w-[460px]">
          {isDual3DView ? (
            /* Dual / Compare View: 2 stacked rows with distinct color badges */
            <div
              onClick={() => {
                sound.playClick();
                setIsCompareOpen(true);
              }}
              className="flex flex-col items-center gap-0.5 bg-white/95 backdrop-blur-md px-3 py-1 rounded-xl border border-blue-200/90 shadow-sm cursor-pointer hover:border-blue-400 hover:shadow-md transition-all active:scale-95 pointer-events-auto"
              title="Bấm để mở bảng so sánh đối chiếu"
            >
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-800">
                <span className="inline-flex items-center px-1.5 py-0.2 text-[9px] font-extrabold rounded-full bg-blue-100 text-blue-800 border border-blue-300 shrink-0">
                  A
                </span>
                <span className="truncate max-w-[120px] md:max-w-[180px]">{matA.nameVi}</span>
                <span className="text-[10px] font-mono font-semibold text-blue-700 shrink-0">({matA.formula})</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-800">
                <span className="inline-flex items-center px-1.5 py-0.2 text-[9px] font-extrabold rounded-full bg-indigo-100 text-indigo-800 border border-indigo-300 shrink-0">
                  B
                </span>
                <span className="truncate max-w-[120px] md:max-w-[180px]">{matB.nameVi}</span>
                <span className="text-[10px] font-mono font-semibold text-indigo-700 shrink-0">({matB.formula})</span>
              </div>
            </div>
          ) : (
            /* Single View: Material Name + Chemical Formula + Category Badge */
            <div
              onClick={() => {
                sound.playClick();
                setIsDetailOpen(true);
              }}
              className="flex items-center gap-1.5 md:gap-2 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-blue-200/90 shadow-sm cursor-pointer hover:border-blue-400 hover:shadow-md transition-all active:scale-95 pointer-events-auto max-w-full"
              title="Bấm để xem hồ sơ chi tiết vật liệu"
            >
              <span className="text-sm md:text-base select-none shrink-0">{material.icon}</span>
              <span className="font-extrabold text-xs md:text-sm text-slate-900 truncate max-w-[120px] md:max-w-[220px]">
                {material.nameVi}
              </span>
              <span className="font-mono text-[10px] md:text-[11px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200/70 shrink-0">
                {material.formula}
              </span>
              <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200 hidden lg:inline-block shrink-0">
                {material.categoryLabel}
              </span>
              <ChevronRight size={14} className="text-blue-500 shrink-0 ml-0.5" />
            </div>
          )}
        </div>

        {/* 3 Action Buttons on Top Bar: Vật liệu - Trình chiếu - Cài đặt */}
        <div className="header-actions">
          {/* 1. Nút Vật liệu */}
          <button
            className={`header-button header-library-btn ${libraryOpen ? 'is-active' : ''}`}
            onClick={() => {
              sound.playClick();
              setLibraryOpen((v) => !v);
            }}
            title="Mở thư viện 25 vật liệu"
            type="button"
            aria-label="Vật liệu"
          >
            <Library size={18} className="text-blue-600 shrink-0" />
            <span className="btn-label font-bold hidden md:inline">Vật liệu</span>
            <span className="btn-count hidden lg:inline-block text-[10px] font-mono font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded-full border border-blue-200">
              {MATERIALS.length}
            </span>
          </button>

          {/* 2. Nút Trình chiếu / Dừng */}
          <button
            className={`header-button header-tour-btn ${
              isTourActive
                ? 'is-tour-stop bg-rose-50 hover:bg-rose-100 text-rose-600 border-rose-200'
                : ''
            }`}
            onClick={() => {
              sound.playClick();
              toggleTour();
            }}
            title={isTourActive ? 'Dừng chế độ trình chiếu (Thoát)' : 'Bật trình chiếu đa tầng'}
            type="button"
            aria-label={isTourActive ? 'Dừng' : 'Trình chiếu'}
          >
            {isTourActive ? (
              <Square size={16} className="text-rose-600 fill-rose-600 shrink-0" />
            ) : (
              <Play size={18} className="text-blue-600 shrink-0" />
            )}
            <span className="btn-label font-bold hidden md:inline">
              {isTourActive ? 'Dừng' : 'Trình chiếu'}
            </span>
          </button>

          {/* 3. Nút Cài đặt / Setting */}
          <button
            className={`header-button header-settings-btn ${settingsOpen ? 'is-active' : ''}`}
            onClick={() => {
              sound.playClick();
              setSettingsOpen((v) => !v);
            }}
            title="Cài đặt hiển thị & Đồ họa"
            type="button"
            aria-label="Cài đặt"
          >
            <SlidersHorizontal size={18} className="text-slate-600 shrink-0" />
            <span className="btn-label font-bold hidden md:inline">Cài đặt</span>
          </button>
        </div>
      </header>

      {/* ── Mobile Floating Active Material Badge (Always visible on mobile < 820px) ── */}
      <div
        className={`fixed top-[62px] sm:top-[66px] left-3 sm:left-1/2 sm:-translate-x-1/2 z-20 flex min-[820px]:hidden items-center max-w-[calc(100vw-76px)] sm:max-w-md transition-all duration-300 ${
          isZenMode ? 'opacity-0 pointer-events-none -translate-y-4' : 'opacity-100 pointer-events-auto translate-y-0'
        }`}
      >
        {isDual3DView ? (
          <div
            onClick={() => {
              sound.playClick();
              setIsCompareOpen(true);
            }}
            className="flex items-center gap-2 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full border border-blue-200/90 shadow-md cursor-pointer active:scale-95 transition-transform"
            title="Bấm để mở bảng so sánh"
          >
            <span className="text-[11px] font-bold text-slate-800 truncate max-w-[100px]">{matA.nameVi}</span>
            <span className="text-[10px] font-bold text-blue-600 font-mono">vs</span>
            <span className="text-[11px] font-bold text-slate-800 truncate max-w-[100px]">{matB.nameVi}</span>
            <ChevronRight size={13} className="text-blue-500 shrink-0" />
          </div>
        ) : (
          <div
            onClick={() => {
              sound.playClick();
              setIsDetailOpen(true);
            }}
            className="flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full border border-blue-200/90 shadow-md cursor-pointer active:scale-95 transition-transform"
            title="Bấm để xem hồ sơ chi tiết vật liệu"
          >
            <span className="text-xs select-none shrink-0">{material.icon}</span>
            <span className="font-extrabold text-xs text-slate-900 truncate max-w-[130px]">
              {material.nameVi}
            </span>
            <span className="font-mono text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200/70 shrink-0">
              {material.formula}
            </span>
            <ChevronRight size={13} className="text-blue-500 shrink-0" />
          </div>
        )}
      </div>

      {/* ── Single Unified Right Action Dock (Requirement 2) ─────────────── */}
      <RightActionDock
        cameraAngle={cameraAngle}
        onChangeCameraAngle={changeCameraAngle}
      />

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
            </div>

            {/* 3-Tier Graphics Quality Selector (Task 5) */}
            <div className="tool-section">
              <div className="flex items-center justify-between mb-2">
                <span className="tool-section-label !mb-0">Chất lượng đồ họa</span>
                <span className="text-[10px] font-bold text-sky-400">
                  {graphicsQuality === 'high' ? 'SMAA · Bóng 2K' : graphicsQuality === 'medium' ? 'Cân bằng' : 'Tiết kiệm pin'}
                </span>
              </div>
              <div className="segmented-control">
                {(['high', 'medium', 'low'] as const).map((q) => (
                  <button
                    key={q}
                    className={graphicsQuality === q ? 'is-active' : ''}
                    onClick={() => {
                      sound.playClick();
                      setGraphicsQuality(q);
                    }}
                    type="button"
                  >
                    {q === 'high' ? 'Cao (SMAA)' : q === 'medium' ? 'Trung bình' : 'Tiết kiệm'}
                  </button>
                ))}
              </div>
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

            <div className="tool-section">
              <span className="tool-section-label">Số lớp cấu trúc (Cấp độ Nano)</span>
              <div className="segmented-control">
                {([1, 2, 3] as const).map((count) => (
                  <button
                    key={count}
                    className={structureLayerCount === count ? 'is-active' : ''}
                    onClick={() => {
                      sound.playClick();
                      setStructureLayerCount(count);
                    }}
                    type="button"
                  >
                    {count} lớp
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}


      {/* Material Library Slide-over Drawer (Requirement 1) */}
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
              <div className="flex-1 min-w-0 text-left">
                <strong className="block text-xs font-bold text-slate-800 truncate">
                  {item.nameVi}
                </strong>
                <small className="block text-[10px] text-slate-500 truncate">
                  {item.categoryLabel}
                </small>
              </div>
              <span className="material-formula shrink-0">{item.formula}</span>
              {item.id === selectedMaterial && (
                <span className="selected-dot shrink-0">
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
        <div
          className="drawer-backdrop fixed inset-0 z-40 bg-black/60 backdrop-blur-sm cursor-pointer"
          onClick={() => {
            sound.playClick();
            setLibraryOpen(false);
          }}
          aria-label="Đóng thư viện"
        />
      )}

      {/* ── Unified Bottom Sheet (Scale Navigator + Details + Actions) (Requirements 4 & 5) ── */}
      <UnifiedBottomSheet
        material={material}
        activeStage={activeStage}
        stages={STAGES}
        onSelectStage={goToStage}
        onOpenDetail={() => openDetailTab('bonds')}
        onOpenCompare={() => openDetailTab('compare')}
        isDual3DView={isDual3DView}
        onToggleDual3DView={() => setIsDual3DView(!isDual3DView)}
      />


      <AtomInspectorModal key={`atom-inspector-${selectedMaterial}`} />
      <TourOverlay />
      <DetailModal />
    </main>
  );
}
