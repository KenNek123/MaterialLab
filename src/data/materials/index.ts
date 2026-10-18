import { MaterialData } from '@/store/useStore';

import { diamondMaterial } from './diamond';
import { graphiteMaterial } from './graphite';
import { saltMaterial } from './salt';
import { quartzMaterial } from './quartz';
import { mxeneMaterial } from './mxene';
import { goldMaterial } from './gold';
import { copperMaterial } from './copper';
import { ironMaterial } from './iron';
import { aluminumMaterial } from './aluminum';
import { titaniumMaterial } from './titanium';
import { siliconMaterial } from './silicon';
import { teflonMaterial } from './teflon';
import { batteryLcoMaterial } from './batteryLco';
import { ceramicMaterial } from './ceramic';
import { rubberMaterial } from './rubber';
import { cntMaterial } from './cnt';
import { buckyballMaterial } from './buckyball';
import { perovskiteMaterial } from './perovskite';
import { aerogelMaterial } from './aerogel';
import { nitinolMaterial } from './nitinol';
import { iceMaterial } from './ice';
import { grapheneMaterial } from './graphene';
import { kevlarMaterial } from './kevlar';
import { inconelMaterial } from './inconel';
import { glassMaterial } from './glass';

export const MATERIALS: MaterialData[] = [
  diamondMaterial,
  graphiteMaterial,
  saltMaterial,
  quartzMaterial,
  mxeneMaterial,
  goldMaterial,
  copperMaterial,
  ironMaterial,
  aluminumMaterial,
  titaniumMaterial,
  siliconMaterial,
  teflonMaterial,
  batteryLcoMaterial,
  ceramicMaterial,
  rubberMaterial,
  cntMaterial,
  buckyballMaterial,
  perovskiteMaterial,
  aerogelMaterial,
  nitinolMaterial,
  iceMaterial,
  grapheneMaterial,
  kevlarMaterial,
  inconelMaterial,
  glassMaterial,
];

export const MATERIAL_MAP = new Map(MATERIALS.map((m) => [m.id, m]));

export const MATERIAL_CATEGORIES = [
  { key: 'metal', label: 'Kim loại & Hợp kim', icon: '⚙️' },
  { key: 'crystal', label: 'Gốm & Tinh thể', icon: '💠' },
  { key: 'nano', label: 'Vật liệu Nano', icon: '🔬' },
  { key: 'molecular', label: 'Cấu trúc Phân tử', icon: '🧊' },
] as const;

export * from './diamond';
export * from './graphite';
export * from './salt';
export * from './quartz';
export * from './mxene';
export * from './gold';
export * from './copper';
export * from './iron';
export * from './aluminum';
export * from './titanium';
export * from './silicon';
export * from './teflon';
export * from './batteryLco';
export * from './ceramic';
export * from './rubber';
export * from './cnt';
export * from './buckyball';
export * from './perovskite';
export * from './aerogel';
export * from './nitinol';
export * from './ice';
export * from './graphene';
export * from './kevlar';
export * from './inconel';
export * from './glass';
