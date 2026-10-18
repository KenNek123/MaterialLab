import * as THREE from 'three';
import { GeometryBuilder } from './types';
import {
  createDiamondGemGeometry,
  createQuartzCrystalGeometry,
  createSaltCubeGeometry,
  createAerogelBlockGeometry,
  createSnowflakeGeometry,
} from './crystals';
import {
  createGoldIngotGeometry,
  createCopperCoilGeometry,
  createIronBeamGeometry,
  createAluminumWingGeometry,
  createTitaniumImplantGeometry,
  createNitinolStentGeometry,
  createTurbineBladeGeometry,
} from './metals';
import {
  createMxeneCapacitorGeometry,
  createNanotubeCoilGeometry,
  createBuckyballGeometry,
  createRacketGeometry,
} from './nanotech';
import {
  createGraphitePencilGeometry,
  createSiliconChipGeometry,
  createSolarPanelGeometry,
  createLithiumBatteryGeometry,
  createCeramicBladeGeometry,
  createTeflonPanGeometry,
  createRubberTyreGeometry,
  createLensGeometry,
} from './techDaily';

/**
 * Registry of all available 3D macro geometry builders
 */
const REGISTRY: Record<string, GeometryBuilder> = {
  // Crystals & Minerals
  'diamond-gem': createDiamondGemGeometry,
  'quartz-crystal': createQuartzCrystalGeometry,
  'salt-cube': createSaltCubeGeometry,
  'aerogel-block': createAerogelBlockGeometry,
  'snowflake': createSnowflakeGeometry,

  // Metals & Alloys
  'gold-ingot': createGoldIngotGeometry,
  'copper-coil': createCopperCoilGeometry,
  'iron-beam': createIronBeamGeometry,
  'aluminum-wing': createAluminumWingGeometry,
  'titanium-implant': createTitaniumImplantGeometry,
  'nitinol-stent': createNitinolStentGeometry,
  'turbine-blade': createTurbineBladeGeometry,

  // Advanced Nanotech & 2D Materials
  'mxene-capacitor': createMxeneCapacitorGeometry,
  'ice-crystal': createMxeneCapacitorGeometry,
  'nanotube-coil': createNanotubeCoilGeometry,
  'nanotube': createNanotubeCoilGeometry,
  'buckyball-cage': createBuckyballGeometry,
  'racket': createRacketGeometry,
  'graphene-sheet': createRacketGeometry,

  // Tech, Semiconductors & Daily Polymers
  'graphite-pencil': createGraphitePencilGeometry,
  'silicon-chip': createSiliconChipGeometry,
  'solar-panel': createSolarPanelGeometry,
  'lithium-battery': createLithiumBatteryGeometry,
  'ceramic-blade': createCeramicBladeGeometry,
  'teflon-pan': createTeflonPanGeometry,
  'rubber-tyre': createRubberTyreGeometry,
  'lens': createLensGeometry,

  // Backward compatibility aliases
  'gold-bar': createGoldIngotGeometry,
  'silicon-wafer': createSiliconChipGeometry,
  'fuselage': createAluminumWingGeometry,
  'diamond-ring': createDiamondGemGeometry,
  'coil': createCopperCoilGeometry,
  'crystal-cube': createSaltCubeGeometry,
  'titanium-bracket': createTitaniumImplantGeometry,
  'iron-core': createIronBeamGeometry,
};

// Geometry instance cache to avoid recomputing complex procedural meshes repeatedly
const geometryCache = new Map<string, THREE.BufferGeometry>();

/**
 * Factory method to obtain or construct a model's BufferGeometry.
 * Caches instances for high performance while allowing cloning if needed.
 */
export function getModelGeometry(geometryId: string): THREE.BufferGeometry {
  if (geometryCache.has(geometryId)) {
    return geometryCache.get(geometryId)!;
  }

  const builder = REGISTRY[geometryId] || REGISTRY['diamond-gem'];
  const geometry = builder();
  geometryCache.set(geometryId, geometry);
  return geometry;
}

/**
 * Safely disposes all cached geometries and frees WebGL memory.
 */
export function clearModelGeometryCache(): void {
  for (const geo of geometryCache.values()) {
    try {
      geo.dispose();
    } catch {
      // Ignored
    }
  }
  geometryCache.clear();
}
