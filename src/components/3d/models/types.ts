import * as THREE from 'three';

export type GeometryBuilder = () => THREE.BufferGeometry;

export interface ModelGeometryDescriptor {
  id: string;
  category: 'crystal' | 'metal' | 'nano' | 'tech';
  nameVi: string;
  build: GeometryBuilder;
}
