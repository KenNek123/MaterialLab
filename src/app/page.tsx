'use client';

import dynamic from 'next/dynamic';
import { useMemo, useState } from 'react';
import {
  Atom,
  BookOpen,
  Box,
  Camera,
  Check,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  CircleHelp,
  Columns2,
  Eye,
  Grid3X3,
  Layers3,
  Library,
  Maximize2,
  Pause,
  Play,
  RotateCw,
  Search,
  SlidersHorizontal,
  Sparkles,
  X,
  Zap,
} from 'lucide-react';
import AtomInspectorModal from '@/components/ui/AtomInspectorModal';
import CompareModal from '@/components/ui/CompareModal';
import DetailModal from '@/components/ui/DetailModal';
import TourOverlay from '@/components/ui/TourOverlay';
import { ZOOM_DIST } from '@/components/3d/zoomState';
import { MATERIALS, MATERIAL_CATEGORIES, MATERIAL_MAP } from '@/data/materials';
import { sound } from '@/lib/soundFx';
import { StoreState, useStore, ZoomLayer } from '@/store/useStore';

const Scene3D = dynamic(() => import('@/components/3d/Scene3D'), {
  ssr: false,
  loading: () => (
    <div className="scene-loading" role="status">
      <div className="loading-atom"><Atom size={26} /></div>
      <strong>Đang dựng mô hình 3D</strong>
      <span>Chuẩn bị không gian quan sát...</span>
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
  { id: 'macro', label: 'Vật thể', shortLabel: 'Vĩ mô', caption: 'Nhìn hình dáng & ứng dụng', scale: 'mm - cm', icon: Eye, distance: ZOOM_DIST.MACRO, progress: 0 },
  { id: 'micro', label: 'Ô mạng', shortLabel: 'Vi mô', caption: 'Nhìn cách sắp xếp', scale: 'µm - nm', icon: Grid3X3, distance: ZOOM_DIST.MICRO, progress: 0.5 },
  { id: 'molecular', label: 'Nguyên tử', shortLabel: 'Nano', caption: 'Nhìn liên kết', scale: 'Å', icon: Atom, distance: ZOOM_DIST.MOLECULAR, progress: 1 },
];

const CATEGORY_LABELS: Record<string, string> = {
  all: 'Tất cả',
  metal: 'Kim loại',
  crystal: 'Tinh thể',
  nano: 'Nano',
  molecular: 'Phân tử',
};

function ToolButton({
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
      <span className="tool-row-icon"><Icon size={17} /></span>
      <span>{label}</span>
      {active && <Check size={16} className="tool-check" />}
    </button>
  );
}

export default function HomePage() {
  const selectedMaterial = useStore((s: StoreState) => s.selectedMaterial);
  const setSelectedMaterial = useStore((s: StoreState) => s.setSelectedMaterial);
  const activeLayer = useStore((s: StoreState) => s.activeLayer);
  const setActiveLayer = useStore((s: StoreState) => s.setActiveLayer);
  const setCameraDistance = useStore((s: StoreState) => s.setCameraDistance);
  const setZoomProgress = useStore((s: StoreState) => s.setZoomProgress);
  const setIsDetailOpen = useStore((s: StoreState) => s.setIsDetailOpen);
  const isCompareOpen = useStore((s: StoreState) => s.isCompareOpen);
  const setIsCompareOpen = useStore((s: StoreState) => s.setIsCompareOpen);
  const isDual3DView = useStore((s: StoreState) => s.isDual3DView);
  const setIsDual3DView = useStore((s: StoreState) => s.setIsDual3DView);
  const isTourActive = useStore((s: StoreState) => s.isTourActive);
  const toggleTour = useStore((s: StoreState) => s.toggleTour);
  const userAutoRotate = useStore((s: StoreState) => s.userAutoRotate);
  const toggleAutoRotate = useStore((s: StoreState) => s.toggleAutoRotate);
  const graphicsQuality = useStore((s: StoreState) => s.graphicsQuality);
  const toggleGraphicsQuality = useStore((s: StoreState) => s.toggleGraphicsQuality);
  const triggerSnapshot = useStore((s: StoreState) => s.triggerSnapshot);
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
  const [toolsOpen, setToolsOpen] = useState(false);
  const [isLessonExpanded, setIsLessonExpanded] = useState(false);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  const material = MATERIAL_MAP.get(selectedMaterial) ?? MATERIALS[0];
  const activeStage = STAGES.find((stage) => stage.id === activeLayer) ?? STAGES[0];

  const filteredMaterials = useMemo(() => {
    const keyword = search.trim().toLocaleLowerCase('vi');
    return MATERIALS.filter((item) => {
      const matchesCategory = category === 'all' || item.category === category;
      const matchesSearch = !keyword || `${item.nameVi} ${item.name} ${item.formula}`.toLocaleLowerCase('vi').includes(keyword);
      return matchesCategory && matchesSearch;
    });
  }, [category, search]);

  const lesson = useMemo(() => {
    if (activeLayer === 'micro') {
      return {
        eyebrow: 'Bước 2 · Khám phá cấu trúc',
        title: 'Bên trong vật liệu',
        summary: `Các nguyên tử tạo thành ${material.molecularInfo.latticeType.toLocaleLowerCase('vi')}.`,
        focusLabel: 'Hãy quan sát',
        focus: 'Cách các hạt lặp lại để tạo nên một cấu trúc bền vững.',
        factLabel: 'Hệ tinh thể',
        fact: material.molecularInfo.crystalSystem,
      };
    }
    if (activeLayer === 'molecular') {
      return {
        eyebrow: 'Bước 3 · Nhìn thật gần',
        title: 'Ở cấp nguyên tử',
        summary: `Các hạt được giữ với nhau bởi ${material.molecularInfo.bonds.type.toLocaleLowerCase('vi')}.`,
        focusLabel: 'Hãy quan sát',
        focus: 'Chạm vào một nguyên tử để mở hồ sơ và vị trí của nó.',
        factLabel: 'Độ dài liên kết',
        fact: material.molecularInfo.bondLength,
      };
    }
    return {
      eyebrow: 'Bước 1 · Làm quen vật liệu',
      title: material.objectNameVi,
      summary: `${material.nameVi} xuất hiện trong nhiều sản phẩm quen thuộc nhờ các tính chất đặc trưng.`,
      focusLabel: 'Hãy thử',
      focus: 'Kéo để xoay mô hình, sau đó chuyển sang Ô mạng để nhìn vào bên trong.',
      factLabel: 'Ứng dụng tiêu biểu',
      fact: material.macroInfo.applications[0],
    };
  }, [activeLayer, material]);

  const goToStage = (stage: (typeof STAGES)[number]) => {
    sound.playClick();
    window.dispatchEvent(new CustomEvent('material-zoom-target', { detail: { distance: stage.distance, immediate: false } }));
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
    setSelectedMaterial(id);
    setLibraryOpen(false);
  };

  return (
    <main className="learning-app">
      <div className="scene-grid" aria-hidden="true" />
      <Scene3D />

      <header className="app-header">
        <div className="brand-lockup">
          <span className="brand-mark"><Atom size={22} /></span>
          <div><h1>Vật liệu 3D</h1><p>Phòng khám phá trực quan</p></div>
        </div>

        <div className="header-context" aria-label="Ngữ cảnh bài học">
          <span>{material.icon}</span>
          <div><strong>{material.nameVi}</strong><small>{activeStage.shortLabel} · {activeStage.scale}</small></div>
        </div>

        <div className="header-actions">
          <button className="header-button mobile-library-button" onClick={() => setLibraryOpen(true)} type="button"><Library size={18} /><span>Vật liệu</span></button>
          <button className={`header-button primary-action ${isTourActive ? 'is-playing' : ''}`} onClick={() => { sound.playClick(); toggleTour(); }} type="button">
            {isTourActive ? <Pause size={18} /> : <Play size={18} />}<span>{isTourActive ? 'Tạm dừng' : 'Trình chiếu'}</span>
          </button>
          <button className="icon-button desktop-only" onClick={() => { sound.playClick(); setIsCompareOpen(!isCompareOpen); }} title="So sánh vật liệu" type="button"><Columns2 size={19} /></button>
          <div className="tools-anchor">
            <button className={`icon-button ${toolsOpen ? 'is-active' : ''}`} onClick={() => setToolsOpen((value) => !value)} title="Mở công cụ" type="button"><SlidersHorizontal size={19} /></button>
          </div>
        </div>
      </header>

      {toolsOpen && (
        <>
          <button className="tools-backdrop" onClick={() => setToolsOpen(false)} aria-label="Đóng công cụ" type="button" />
          <div className="tools-menu">
            <div className="menu-heading"><div><strong>Công cụ trình bày</strong><span>Chỉ hiện khi bạn cần</span></div><button onClick={() => setToolsOpen(false)} type="button"><X size={17} /></button></div>
            <div className="tool-grid">
              <ToolButton active={userAutoRotate} label="Tự động xoay" icon={RotateCw} onClick={() => { sound.playClick(); toggleAutoRotate(); }} />
              <ToolButton active={isDual3DView} label="Xem hai mô hình" icon={Columns2} onClick={() => { sound.playClick(); setIsDual3DView(!isDual3DView); }} />
              <ToolButton active={graphicsQuality === 'high'} label={`Đồ họa ${graphicsQuality === 'high' ? 'cao' : 'mượt'}`} icon={Zap} onClick={() => { sound.playClick(); toggleGraphicsQuality(); }} />
              <ToolButton label="Chụp mô hình" icon={Camera} onClick={() => { sound.playClick(); triggerSnapshot(); }} />
              <ToolButton label="So sánh vật liệu" icon={Columns2} onClick={() => { sound.playClick(); setIsCompareOpen(true); setToolsOpen(false); }} />
            </div>
            <div className="tool-section">
              <span className="tool-section-label">Góc nhìn</span>
              <div className="segmented-control">
                {(['iso', 'top', 'side'] as const).map((angle) => <button key={angle} className={cameraAngle === angle ? 'is-active' : ''} onClick={() => changeCameraAngle(angle)} type="button">{angle === 'iso' ? 'Mô hình 3D' : angle === 'top' ? 'Sơ đồ 2D' : 'Cạnh bên'}</button>)}
              </div>
            </div>
            {activeLayer !== 'macro' && (
              <div className="tool-section">
                <span className="tool-section-label">Hiển thị cấu trúc</span>
                <div className="tool-grid compact">
                  <ToolButton active={showLatticeCage} label="Khung ô mạng" icon={Box} onClick={() => { sound.playClick(); toggleLatticeCage(); }} />
                  <ToolButton active={showMillerPlanes} label="Mặt tinh thể" icon={Layers3} onClick={() => { sound.playClick(); toggleMillerPlanes(); }} />
                </div>
              </div>
            )}
            {activeLayer === 'molecular' && (
              <div className="tool-section">
                <span className="tool-section-label">Số lớp cấu trúc</span>
                <div className="segmented-control">
                  {([1, 2, 3] as const).map((count) => <button key={count} className={structureLayerCount === count ? 'is-active' : ''} onClick={() => setStructureLayerCount(count)} type="button">{count} lớp</button>)}
                </div>
              </div>
            )}
          </div>
        </>
      )}

      <aside className={`material-library ${libraryOpen ? 'is-open' : ''}`} aria-label="Thư viện vật liệu">
        <div className="panel-heading">
          <div><span className="panel-kicker">{MATERIALS.length} mẫu trực quan</span><h2>Thư viện vật liệu</h2></div>
          <button className="close-mobile" onClick={() => setLibraryOpen(false)} aria-label="Đóng thư viện" type="button"><X size={19} /></button>
        </div>
        <label className="search-field"><Search size={17} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Tìm tên hoặc công thức" /></label>
        <div className="category-tabs" role="tablist" aria-label="Nhóm vật liệu">
          <button className={category === 'all' ? 'is-active' : ''} onClick={() => setCategory('all')} type="button">Tất cả</button>
          {MATERIAL_CATEGORIES.map((item) => <button key={item.key} className={category === item.key ? 'is-active' : ''} onClick={() => setCategory(item.key)} type="button">{CATEGORY_LABELS[item.key] ?? item.label}</button>)}
        </div>
        <div className="material-list custom-scrollbar">
          {filteredMaterials.map((item) => (
            <button key={item.id} className={`material-item ${item.id === selectedMaterial ? 'is-selected' : ''}`} onClick={() => chooseMaterial(item.id)} type="button">
              <span className="material-emoji">{item.icon}</span>
              <span className="material-name"><strong>{item.nameVi}</strong><small>{item.categoryLabel}</small></span>
              <span className="material-formula">{item.formula}</span>
              {item.id === selectedMaterial && <span className="selected-dot"><Check size={12} /></span>}
            </button>
          ))}
          {filteredMaterials.length === 0 && <div className="empty-state">Không tìm thấy vật liệu phù hợp.</div>}
        </div>
      </aside>

      {libraryOpen && <button className="mobile-backdrop" onClick={() => setLibraryOpen(false)} aria-label="Đóng thư viện" type="button" />}

      {(!inspectedAtom) && (
        <aside className={`lesson-card ${isLessonExpanded ? 'is-expanded' : 'is-collapsed'}`} aria-live="polite">
          {/* Mobile Sleek Pill View (Height ~44px, unobstructed 3D view) */}
          <div
            className="lesson-mobile-bar"
            onClick={() => setIsLessonExpanded((prev) => !prev)}
            role="button"
            tabIndex={0}
            aria-expanded={isLessonExpanded}
          >
            <span className="lesson-mobile-emoji">{material.icon}</span>
            <div className="lesson-mobile-titles">
              <div className="lesson-mobile-row">
                <strong>{material.nameVi}</strong>
                <span className="lesson-mobile-stage-badge">{activeStage.shortLabel}</span>
              </div>
              <span className="lesson-mobile-sub truncate">{lesson.title}</span>
            </div>
            <div className="lesson-mobile-buttons" onClick={(e) => e.stopPropagation()}>
              <button
                className="lesson-pill-action"
                onClick={() => {
                  sound.playClick();
                  setIsDetailOpen(true);
                }}
                type="button"
                title="Xem chi tiết"
              >
                <BookOpen size={14} />
                <span>Chi tiết</span>
              </button>
              <button
                className="lesson-pill-toggle"
                onClick={() => setIsLessonExpanded((prev) => !prev)}
                type="button"
                title={isLessonExpanded ? 'Thu gọn' : 'Mở rộng'}
              >
                {isLessonExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            </div>
          </div>

          {/* Full Content (Always shown on desktop, expandable on mobile) */}
          <div className="lesson-full-content">
            <div className="lesson-identity">
              <span className="lesson-icon">{material.icon}</span>
              <div><span>{material.categoryLabel}</span><h2>{material.nameVi}</h2><small>{material.formula} · {material.name}</small></div>
              <button
                className="lesson-mobile-close"
                onClick={() => setIsLessonExpanded(false)}
                type="button"
                title="Thu gọn bài học"
              >
                <ChevronUp size={18} />
              </button>
            </div>
            <div className="lesson-copy"><span className="lesson-eyebrow">{lesson.eyebrow}</span><h3>{lesson.title}</h3><p>{lesson.summary}</p></div>
            <div className="observation-prompt"><Sparkles size={17} /><div><strong>{lesson.focusLabel}</strong><span>{lesson.focus}</span></div></div>
            <div className="quick-fact"><span>{lesson.factLabel}</span><strong>{lesson.fact}</strong></div>
            <button className="more-button" onClick={() => { sound.playClick(); setIsDetailOpen(true); }} type="button"><BookOpen size={17} /><span>Xem kiến thức chuyên sâu</span><ChevronRight size={17} /></button>
          </div>
        </aside>
      )}

      <nav className="scale-navigator" aria-label="Chọn cấp độ quan sát">
        <div className="stage-intro"><span>Cấp độ quan sát</span><strong>{activeStage.shortLabel}</strong></div>
        <div className="stage-list">
          {STAGES.map((stage, index) => {
            const Icon = stage.icon;
            const active = stage.id === activeLayer;
            return (
              <button key={stage.id} className={`stage-button ${active ? 'is-active' : ''}`} onClick={() => goToStage(stage)} type="button">
                <span className="stage-number">{active ? <Icon size={17} /> : index + 1}</span>
                <span className="stage-text"><strong>{stage.label}</strong><small>{stage.caption}</small></span>
                <span className="stage-scale">{stage.scale}</span>
              </button>
            );
          })}
        </div>
        <div className="mobile-stage-help"><CircleHelp size={15} /><span>Chọn 1 trong 3 cấp độ để khám phá</span></div>
      </nav>

      <div className="canvas-hint"><Maximize2 size={14} /><span>Kéo để xoay · Chụm để phóng to</span></div>

      <AtomInspectorModal />
      <TourOverlay />
      <CompareModal />
      <DetailModal />
    </main>
  );
}
