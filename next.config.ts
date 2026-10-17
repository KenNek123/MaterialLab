import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // This browser-based lab can be served directly as static HTML, CSS, and JS.
  output: 'export',
  // Transpile Three.js packages for compatibility
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei', '@react-three/postprocessing'],
};

export default nextConfig;
