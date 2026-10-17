import { create } from 'zustand';

export type ZoomLayer = 'macro' | 'micro' | 'molecular';

export interface MaterialData {
  id: string;
  name: string;
  nameVi: string;
  formula: string;
  category: 'metal' | 'crystal' | 'nano' | 'molecular';
  categoryLabel: string;
  objectName: string;
  objectNameVi: string;
  icon: string;
  // PBR properties
  color: string;
  roughness: number;
  metalness: number;
  transmission: number;
  clearcoat: number;
  emissive?: string;
  emissiveIntensity?: number;
  // Macro info
  macroInfo: {
    applications: string[];
    mechanicalStrength: string;
    thermalConductivity: string;
    electricalConductivity: string;
    density: string;
  };
  // Normalized metrics for radar / bar comparison (0 to 100 scale)
  metrics: {
    hardness: number;     // Độ cứng / Độ bền cơ học
    thermal: number;      // Độ dẫn nhiệt
    electrical: number;   // Độ dẫn điện
    density: number;      // Khối lượng riêng
    corrosion: number;    // Độ chống ăn mòn
  };
  // Molecular info
  molecularInfo: {
    latticeType: string;
    bondLength: string;
    bondAngle: string;
    crystalSystem: string;
    atomTypes: { element: string; color: string; radius: number }[];
    bonds: { type: string; color: string };
  };
  // Crystal structure generator params
  structure: {
    type: 'fcc' | 'bcc' | 'diamond' | 'hexagonal' | 'nacl' | 'ice' | 'graphene' | 'hcp' | 'cnt' | 'silica';
    latticeConstant: number;
    repeatX: number;
    repeatY: number;
    repeatZ: number;
  };
  // 3D object geometry
  geometry:
    | 'diamond-ring'
    | 'coil'
    | 'racket'
    | 'lens'
    | 'crystal-cube'
    | 'snowflake'
    | 'fuselage'
    | 'gold-bar'
    | 'titanium-bracket'
    | 'silicon-wafer'
    | 'nanotube'
    | 'iron-core';
}

export interface InspectedAtom {
  element: string;
  nameVi: string;
  nameEn: string;
  atomicNumber: number;
  atomicMass: string;
  electronConfig: string;
  electronegativity: number;
  atomicRadiusPm: number;
  categoryVi: string;
  color: string;
  descriptionVi: string;
  coordination: string;
  bondType: string;
  position: [number, number, number];
  index: number;
}

export interface StoreState {
  selectedMaterial: string;
  cameraDistance: number;
  activeLayer: ZoomLayer;
  zoomProgress: number;
  isUserInteracting: boolean;
  autoRotate: boolean;
  userAutoRotate: boolean;
  showSidebar: boolean;
  isDetailOpen: boolean;
  graphicsQuality: 'low' | 'high';

  // Comparison mode state
  isCompareOpen: boolean;
  compareMaterialA: string;
  compareMaterialB: string;
  isDual3DView: boolean;

  // 1-3 Material Layers Architecture
  structureLayerCount: 1 | 2 | 3;

  // Sound FX and Camera Angle Presets
  soundEnabled: boolean;
  cameraAngle: 'iso' | 'top' | 'side';

  // Cinematic Multi-Scale Auto-Tour
  isTourActive: boolean;
  tourPhase: 'macro' | 'micro' | 'molecular';
  tourProgress: number; // 0 to 1

  // Interactive Atom Inspection
  inspectedAtom: InspectedAtom | null;

  // Crystallographic Overlays
  showLatticeCage: boolean;
  showMillerPlanes: boolean;

  // High-Res Snapshot Export
  snapshotTrigger: number;
  snapshotFlash: boolean;

  setSelectedMaterial: (id: string) => void;
  setCameraDistance: (d: number) => void;
  setActiveLayer: (layer: ZoomLayer) => void;
  setZoomProgress: (p: number) => void;
  setIsUserInteracting: (v: boolean) => void;
  setAutoRotate: (v: boolean) => void;
  toggleAutoRotate: () => void;
  setShowSidebar: (v: boolean) => void;
  setIsDetailOpen: (v: boolean) => void;
  setGraphicsQuality: (q: 'low' | 'high') => void;
  toggleGraphicsQuality: () => void;
  setStructureLayerCount: (count: 1 | 2 | 3) => void;
  toggleSound: () => void;
  setCameraAngle: (angle: 'iso' | 'top' | 'side') => void;

  setIsCompareOpen: (v: boolean) => void;
  setCompareMaterialA: (id: string) => void;
  setCompareMaterialB: (id: string) => void;
  setIsDual3DView: (v: boolean) => void;
  swapCompareMaterials: () => void;

  // Tour actions
  setIsTourActive: (v: boolean) => void;
  toggleTour: () => void;
  setTourPhase: (phase: 'macro' | 'micro' | 'molecular') => void;
  setTourProgress: (progress: number) => void;

  // Inspection actions
  setInspectedAtom: (atom: InspectedAtom | null) => void;

  // Overlay actions
  toggleLatticeCage: () => void;
  toggleMillerPlanes: () => void;

  // Snapshot actions
  triggerSnapshot: () => void;
  setSnapshotFlash: (v: boolean) => void;
}

export const useStore = create<StoreState>((set) => ({
  selectedMaterial: 'diamond',
  cameraDistance: 10,
  activeLayer: 'macro',
  zoomProgress: 0,
  isUserInteracting: false,
  autoRotate: true,
  userAutoRotate: true,
  showSidebar: false, // Default closed for a spacious, unobstructed 3D view
  isDetailOpen: false, // In-depth technical info opens via dedicated button
  graphicsQuality: 'low', // Default low for smooth 60fps on phones and weak PCs
  structureLayerCount: 3, // Default 3 layers (Full 3D bulk structure, selectable 1, 2, or 3)
  soundEnabled: false,
  cameraAngle: 'iso',

  isCompareOpen: false,
  compareMaterialA: 'diamond',
  compareMaterialB: 'graphene',
  isDual3DView: false,

  // Cinematic Tour Initial State
  isTourActive: false,
  tourPhase: 'macro',
  tourProgress: 0,

  // Inspection Initial State
  inspectedAtom: null,

  // Overlays Initial State
  showLatticeCage: true,
  showMillerPlanes: false,

  // Snapshot Initial State
  snapshotTrigger: 0,
  snapshotFlash: false,

  setSelectedMaterial: (id) => set({ selectedMaterial: id }),
  setCameraDistance: (d) => set({ cameraDistance: d }),
  setActiveLayer: (layer) => set({ activeLayer: layer }),
  setZoomProgress: (p) => set({ zoomProgress: p }),
  setIsUserInteracting: (v) => set({ isUserInteracting: v }),
  setAutoRotate: (v) => set({ autoRotate: v }),
  toggleAutoRotate: () =>
    set((state) => {
      const next = !state.userAutoRotate;
      return { userAutoRotate: next, autoRotate: next };
    }),
  setShowSidebar: (v) => set({ showSidebar: v }),
  setIsDetailOpen: (v) => set({ isDetailOpen: v }),
  setGraphicsQuality: (q) => set({ graphicsQuality: q }),
  toggleGraphicsQuality: () =>
    set((state) => ({
      graphicsQuality: state.graphicsQuality === 'low' ? 'high' : 'low',
    })),
  setStructureLayerCount: (count) => set({ structureLayerCount: count }),
  toggleSound: () => set({ soundEnabled: false }),
  setCameraAngle: (angle) => set({ cameraAngle: angle }),

  setIsCompareOpen: (v) => set({ isCompareOpen: v }),
  setCompareMaterialA: (id) => set({ compareMaterialA: id }),
  setCompareMaterialB: (id) => set({ compareMaterialB: id }),
  setIsDual3DView: (v) => set({ isDual3DView: v }),
  swapCompareMaterials: () =>
    set((state) => ({
      compareMaterialA: state.compareMaterialB,
      compareMaterialB: state.compareMaterialA,
    })),

  // Tour
  setIsTourActive: (v) => set({ isTourActive: v }),
  toggleTour: () =>
    set((state) => {
      const next = !state.isTourActive;
      return {
        isTourActive: next,
        tourProgress: 0,
        tourPhase: 'macro',
        autoRotate: next ? false : state.userAutoRotate,
      };
    }),
  setTourPhase: (phase) => set({ tourPhase: phase }),
  setTourProgress: (progress) => set({ tourProgress: progress }),

  // Atom Inspection
  setInspectedAtom: (atom) => set({ inspectedAtom: atom }),

  // Crystallographic Overlays
  toggleLatticeCage: () => set((state) => ({ showLatticeCage: !state.showLatticeCage })),
  toggleMillerPlanes: () => set((state) => ({ showMillerPlanes: !state.showMillerPlanes })),

  // Snapshot
  triggerSnapshot: () => set((state) => ({ snapshotTrigger: state.snapshotTrigger + 1 })),
  setSnapshotFlash: (v) => set({ snapshotFlash: v }),
}));


