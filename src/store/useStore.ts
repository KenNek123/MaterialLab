import { create } from 'zustand';

export type ZoomLayer = 'macro' | 'micro' | 'molecular';

export interface MaterialData {
  id: string;
  name: string;
  nameVi: string;
  formula: string;
  category: 'daily' | 'metal' | 'tech' | 'polymer' | 'crystal' | 'nano' | 'molecular';
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
  // Normalized metrics for comparison (0 to 100 scale)
  metrics: {
    hardness: number;     // Độ cứng / Độ bền cơ học
    thermal: number;      // Độ dẫn nhiệt
    electrical: number;   // Độ dẫn điện
    density: number;      // Khối lượng riêng
    corrosion: number;    // Độ chống ăn mòn & độ ổn định hóa học
  };
  // Molecular info
  molecularInfo: {
    latticeType: string;
    bondLength: string;
    bondAngle: string;
    crystalSystem: string;
    atomTypes: { element: string; color: string; radius: number }[];
    bonds: {
      type: string;
      color: string;
      hybridization?: string;
      coordinationGeometry?: string;
      bondEnergy?: string;
      interlayerForce?: string;
      descriptionVi?: string;
    };
  };
  // Crystal structure generator params
  structure: {
    type:
      | 'graphene'
      | 'cnt'
      | 'buckyball'
      | 'perovskite'
      | 'aerogel'
      | 'mxene'
      | 'silicene'
      | 'borophene'
      | 'gan'
      | 'sic'
      | 'mos2'
      | 'hbn'
      | 'nitinol'
      | 'mof'
      | 'bi2se3'
      | 'lgps'
      | 'hcp'
      | 'fcc'
      | 'bcc'
      | 'diamond'
      | 'hexagonal'
      | 'nacl'
      | 'ice'
      | 'silica'
      | 'teflon'
      | 'battery'
      | 'corundum'
      | 'polymer-rubber';
    latticeConstant: number;
    repeatX: number;
    repeatY: number;
    repeatZ: number;
  };
  // 3D object geometry identifier
  geometry:
    | 'graphene-sheet'
    | 'nanotube-coil'
    | 'buckyball-cage'
    | 'solar-panel'
    | 'aerogel-block'
    | 'mxene-capacitor'
    | 'atomic-wafer'
    | 'borophene-mesh'
    | 'gan-chip'
    | 'sic-inverter'
    | 'mos2-sensor'
    | 'hbn-insulator'
    | 'nitinol-stent'
    | 'mof-cage'
    | 'topological-crystal'
    | 'solid-battery'
    | 'turbine-blade'
    | 'diamond-gem'
    | 'graphite-pencil'
    | 'salt-cube'
    | 'quartz-crystal'
    | 'ice-crystal'
    | 'gold-ingot'
    | 'copper-coil'
    | 'iron-beam'
    | 'aluminum-wing'
    | 'titanium-implant'
    | 'silicon-chip'
    | 'teflon-pan'
    | 'lithium-battery'
    | 'ceramic-blade'
    | 'rubber-tyre'
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

  // Actions
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

  // Central Reset & Clean-up Protocol
  resetInteractionAndViewStates: () => void;
  setSelectedAtom: (atom: InspectedAtom | null) => void;
  setSelectedElement: (atom: InspectedAtom | null) => void;
  setInspectedElement: (atom: InspectedAtom | null) => void;
  setHoveredAtom: (atom: InspectedAtom | null) => void;
  setIsDualView: (v: boolean) => void;
  setIsCompareModalOpen: (v: boolean) => void;
  setIsDetailModalOpen: (v: boolean) => void;
  setIsPresentationMode: (v: boolean) => void;
}

export const useStore = create<StoreState>((set) => ({
  selectedMaterial: 'diamond',
  cameraDistance: 10,
  activeLayer: 'macro',
  zoomProgress: 0,
  isUserInteracting: false,
  autoRotate: true,
  userAutoRotate: true,
  showSidebar: false,
  isDetailOpen: false,
  graphicsQuality: 'low',
  structureLayerCount: 1,
  soundEnabled: false,
  cameraAngle: 'iso',

  isCompareOpen: false,
  compareMaterialA: 'diamond',
  compareMaterialB: 'gold',
  isDual3DView: false,

  // Cinematic Tour Initial State
  isTourActive: false,
  tourPhase: 'macro',
  tourProgress: 0,

  // Inspection Initial State
  inspectedAtom: null,

  // Overlays Initial State (clean, no coordinate axes)
  showLatticeCage: true,
  showMillerPlanes: false,

  // Snapshot Initial State
  snapshotTrigger: 0,
  snapshotFlash: false,

  // Protocol Rule: Central clean-up whenever switching materials
  resetInteractionAndViewStates: () =>
    set({
      isDual3DView: false,
      isCompareOpen: false,
      inspectedAtom: null,
      isTourActive: false,
      isDetailOpen: false,
    }),

  // Protocol Rule: Reset old states completely in single atomic call
  setSelectedMaterial: (id) =>
    set({
      selectedMaterial: id,
      inspectedAtom: null,
      isDual3DView: false,
      isCompareOpen: false,
      isDetailOpen: false,
      isTourActive: false,
    }),

  // Protocol Rule: Reset atom inspection when changing zoom layer
  setActiveLayer: (layer) =>
    set({
      activeLayer: layer,
      inspectedAtom: null,
    }),

  setSelectedAtom: (atom) => set({ inspectedAtom: atom }),
  setSelectedElement: (atom) => set({ inspectedAtom: atom }),
  setInspectedElement: (atom) => set({ inspectedAtom: atom }),
  setHoveredAtom: (_atom) => {
    void _atom;
  },
  setIsDualView: (v) => set({ isDual3DView: v }),
  setIsCompareModalOpen: (v) => set({ isCompareOpen: v }),
  setIsDetailModalOpen: (v) => set({ isDetailOpen: v }),
  setIsPresentationMode: (v) => set({ isTourActive: v }),
  setCameraDistance: (d) => set({ cameraDistance: d }),
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
