'use client';

import React from 'react';
import { Cpu, Atom, Hexagon, Layers, Shield, Zap, Sparkles, Box, Activity } from 'lucide-react';
import { MaterialData } from '@/store/useStore';

interface MaterialBadgeProps {
  material: MaterialData;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showSub?: boolean;
}

interface BadgeConfig {
  symbol: string;
  sub?: string;
  type: 'icon' | 'badge';
  icon?: typeof Atom;
  bgGradient: string;
  border: string;
  text: string;
  glow: string;
}

const BADGE_CONFIGS: Record<string, BadgeConfig> = {
  // 15 Vật liệu quen thuộc đời sống & công nghệ
  diamond: {
    symbol: 'C',
    sub: 'sp³',
    type: 'icon',
    icon: Sparkles,
    bgGradient: 'from-cyan-500 via-sky-600 to-blue-700',
    border: 'border-cyan-300/40 ring-1 ring-cyan-500/20',
    text: 'text-white',
    glow: 'shadow-md shadow-sky-500/30',
  },
  graphite: {
    symbol: 'C',
    sub: 'sp²',
    type: 'icon',
    icon: Hexagon,
    bgGradient: 'from-slate-700 via-zinc-800 to-neutral-900',
    border: 'border-slate-500/40 ring-1 ring-slate-800/30',
    text: 'text-white',
    glow: 'shadow-md shadow-slate-900/30',
  },
  nacl: {
    symbol: 'NaCl',
    sub: 'FCC',
    type: 'icon',
    icon: Box,
    bgGradient: 'from-blue-600 via-indigo-600 to-sky-700',
    border: 'border-sky-300/40 ring-1 ring-blue-500/20',
    text: 'text-white',
    glow: 'shadow-md shadow-blue-500/30',
  },
  salt: {
    symbol: 'NaCl',
    sub: 'FCC',
    type: 'icon',
    icon: Box,
    bgGradient: 'from-blue-600 via-indigo-600 to-sky-700',
    border: 'border-sky-300/40 ring-1 ring-blue-500/20',
    text: 'text-white',
    glow: 'shadow-md shadow-blue-500/30',
  },
  quartz: {
    symbol: 'SiO₂',
    sub: 'Thạch Anh',
    type: 'icon',
    icon: Sparkles,
    bgGradient: 'from-purple-600 via-violet-600 to-indigo-700',
    border: 'border-purple-300/40 ring-1 ring-purple-500/20',
    text: 'text-white',
    glow: 'shadow-md shadow-purple-500/30',
  },
  mxene: {
    symbol: 'Ti₃C₂',
    sub: 'MXene',
    type: 'icon',
    icon: Zap,
    bgGradient: 'from-teal-500 via-emerald-600 to-cyan-700',
    border: 'border-teal-300/40 ring-1 ring-teal-500/20',
    text: 'text-white',
    glow: 'shadow-md shadow-teal-500/30',
  },
  gold: {
    symbol: 'Au',
    sub: '24K',
    type: 'icon',
    icon: Shield,
    bgGradient: 'from-amber-400 via-yellow-500 to-amber-600',
    border: 'border-yellow-200/50 ring-1 ring-amber-500/20',
    text: 'text-white',
    glow: 'shadow-md shadow-amber-500/30',
  },
  copper: {
    symbol: 'Cu',
    sub: 'Dẫn điện',
    type: 'icon',
    icon: Zap,
    bgGradient: 'from-orange-500 via-amber-600 to-red-600',
    border: 'border-orange-300/40 ring-1 ring-orange-500/20',
    text: 'text-white',
    glow: 'shadow-md shadow-orange-500/30',
  },
  steel: {
    symbol: 'Fe-C',
    sub: 'BCC',
    type: 'icon',
    icon: Shield,
    bgGradient: 'from-slate-600 via-zinc-700 to-slate-800',
    border: 'border-slate-400/40 ring-1 ring-slate-700/20',
    text: 'text-white',
    glow: 'shadow-md shadow-slate-700/30',
  },
  iron: {
    symbol: 'Fe',
    sub: 'BCC',
    type: 'icon',
    icon: Shield,
    bgGradient: 'from-slate-600 via-zinc-700 to-slate-800',
    border: 'border-slate-400/40 ring-1 ring-slate-700/20',
    text: 'text-white',
    glow: 'shadow-md shadow-slate-700/30',
  },
  aluminum: {
    symbol: 'Al',
    sub: 'Hàng không',
    type: 'icon',
    icon: Layers,
    bgGradient: 'from-sky-500 via-blue-600 to-slate-700',
    border: 'border-sky-300/40 ring-1 ring-sky-500/20',
    text: 'text-white',
    glow: 'shadow-md shadow-sky-500/30',
  },
  titanium: {
    symbol: 'Ti',
    sub: 'HCP',
    type: 'icon',
    icon: Activity,
    bgGradient: 'from-teal-600 via-cyan-700 to-slate-800',
    border: 'border-teal-300/40 ring-1 ring-teal-600/20',
    text: 'text-white',
    glow: 'shadow-md shadow-teal-600/30',
  },
  silicon: {
    symbol: 'Si',
    sub: 'Chip bán dẫn',
    type: 'icon',
    icon: Cpu,
    bgGradient: 'from-indigo-600 via-blue-700 to-indigo-900',
    border: 'border-indigo-300/40 ring-1 ring-indigo-600/20',
    text: 'text-white',
    glow: 'shadow-md shadow-indigo-600/30',
  },
  teflon: {
    symbol: 'PTFE',
    sub: 'Chống dính',
    type: 'icon',
    icon: Layers,
    bgGradient: 'from-emerald-500 via-teal-600 to-emerald-700',
    border: 'border-emerald-300/40 ring-1 ring-emerald-500/20',
    text: 'text-white',
    glow: 'shadow-md shadow-emerald-500/30',
  },
  'battery-lco': {
    symbol: 'LiCoO₂',
    sub: 'Pin Li-ion',
    type: 'icon',
    icon: Zap,
    bgGradient: 'from-emerald-500 via-green-600 to-teal-700',
    border: 'border-green-300/40 ring-1 ring-green-500/20',
    text: 'text-white',
    glow: 'shadow-md shadow-emerald-600/30',
  },
  'ceramic-al2o3': {
    symbol: 'Al₂O₃',
    sub: 'Gốm sứ',
    type: 'icon',
    icon: Box,
    bgGradient: 'from-rose-500 via-pink-600 to-red-700',
    border: 'border-rose-300/40 ring-1 ring-rose-500/20',
    text: 'text-white',
    glow: 'shadow-md shadow-rose-500/30',
  },
  ceramic: {
    symbol: 'Al₂O₃',
    sub: 'Gốm sứ',
    type: 'icon',
    icon: Box,
    bgGradient: 'from-rose-500 via-pink-600 to-red-700',
    border: 'border-rose-300/40 ring-1 ring-rose-500/20',
    text: 'text-white',
    glow: 'shadow-md shadow-rose-500/30',
  },
  rubber: {
    symbol: 'Polymer',
    sub: 'Đàn hồi',
    type: 'icon',
    icon: Activity,
    bgGradient: 'from-amber-600 via-orange-600 to-stone-800',
    border: 'border-amber-300/40 ring-1 ring-amber-600/20',
    text: 'text-white',
    glow: 'shadow-md shadow-orange-600/30',
  },
  ice: {
    symbol: 'H₂O',
    sub: 'Ice Ih',
    type: 'icon',
    icon: Sparkles,
    bgGradient: 'from-cyan-400 via-sky-500 to-blue-600',
    border: 'border-cyan-200/50 ring-1 ring-cyan-500/20',
    text: 'text-white',
    glow: 'shadow-md shadow-cyan-500/30',
  },
  kevlar: {
    symbol: 'Kevlar',
    sub: 'Aramid',
    type: 'icon',
    icon: Shield,
    bgGradient: 'from-yellow-500 via-amber-500 to-yellow-600',
    border: 'border-yellow-200/50 ring-1 ring-yellow-500/20',
    text: 'text-white',
    glow: 'shadow-md shadow-amber-500/30',
  },
  inconel: {
    symbol: 'IN-718',
    sub: 'Aero',
    type: 'icon',
    icon: Shield,
    bgGradient: 'from-zinc-600 via-slate-700 to-zinc-900',
    border: 'border-zinc-400/40 ring-1 ring-zinc-700/20',
    text: 'text-white',
    glow: 'shadow-md shadow-zinc-700/30',
  },
  glass: {
    symbol: 'SiO₂',
    sub: 'Quang học',
    type: 'icon',
    icon: Box,
    bgGradient: 'from-cyan-500 via-sky-600 to-blue-600',
    border: 'border-cyan-300/40 ring-1 ring-cyan-500/20',
    text: 'text-white',
    glow: 'shadow-md shadow-sky-500/30',
  },

  // Vật liệu Nano & Tiên tiến
  graphene: {
    symbol: 'C',
    sub: 'sp²',
    type: 'icon',
    icon: Hexagon,
    bgGradient: 'from-blue-600 via-indigo-700 to-cyan-700',
    border: 'border-sky-300/40 ring-1 ring-blue-500/20',
    text: 'text-white',
    glow: 'shadow-md shadow-blue-600/30',
  },
  swcnt: {
    symbol: 'CNT',
    sub: '1nm',
    type: 'icon',
    icon: Layers,
    bgGradient: 'from-cyan-600 via-teal-700 to-blue-800',
    border: 'border-cyan-300/40 ring-1 ring-teal-500/20',
    text: 'text-white',
    glow: 'shadow-md shadow-teal-600/30',
  },
  cnt: {
    symbol: 'CNT',
    sub: 'Nano',
    type: 'icon',
    icon: Layers,
    bgGradient: 'from-cyan-600 via-teal-700 to-blue-800',
    border: 'border-cyan-300/40 ring-1 ring-teal-500/20',
    text: 'text-white',
    glow: 'shadow-md shadow-teal-600/30',
  },
  buckyball: {
    symbol: 'C₆₀',
    sub: 'Fullerene',
    type: 'icon',
    icon: Atom,
    bgGradient: 'from-purple-600 via-fuchsia-600 to-indigo-800',
    border: 'border-purple-300/40 ring-1 ring-purple-500/20',
    text: 'text-white',
    glow: 'shadow-md shadow-purple-600/30',
  },
  aerogel: {
    symbol: 'SiO₂',
    sub: 'Aerogel',
    type: 'icon',
    icon: Sparkles,
    bgGradient: 'from-sky-400 via-cyan-500 to-blue-600',
    border: 'border-sky-200/50 ring-1 ring-sky-500/20',
    text: 'text-white',
    glow: 'shadow-md shadow-sky-500/30',
  },
  perovskite: {
    symbol: 'Pb',
    sub: 'ABX₃',
    type: 'icon',
    icon: Sparkles,
    bgGradient: 'from-violet-600 via-purple-700 to-pink-700',
    border: 'border-violet-300/40 ring-1 ring-violet-500/20',
    text: 'text-white',
    glow: 'shadow-md shadow-purple-600/30',
  },
  silicene: {
    symbol: 'Si',
    sub: '2D',
    type: 'icon',
    icon: Cpu,
    bgGradient: 'from-indigo-600 via-blue-700 to-indigo-900',
    border: 'border-indigo-300/40 ring-1 ring-indigo-600/20',
    text: 'text-white',
    glow: 'shadow-md shadow-indigo-600/30',
  },
  borophene: {
    symbol: 'B',
    sub: '2D',
    type: 'icon',
    icon: Hexagon,
    bgGradient: 'from-amber-500 via-orange-600 to-amber-700',
    border: 'border-amber-300/40 ring-1 ring-amber-500/20',
    text: 'text-white',
    glow: 'shadow-md shadow-amber-600/30',
  },
  gan: {
    symbol: 'GaN',
    sub: 'WBG',
    type: 'icon',
    icon: Zap,
    bgGradient: 'from-blue-600 via-indigo-600 to-violet-700',
    border: 'border-blue-300/40 ring-1 ring-blue-500/20',
    text: 'text-white',
    glow: 'shadow-md shadow-blue-600/30',
  },
  sic: {
    symbol: 'SiC',
    sub: '4H',
    type: 'icon',
    icon: Cpu,
    bgGradient: 'from-emerald-600 via-teal-600 to-green-700',
    border: 'border-emerald-300/40 ring-1 ring-emerald-600/20',
    text: 'text-white',
    glow: 'shadow-md shadow-emerald-600/30',
  },
  mos2: {
    symbol: 'MoS₂',
    sub: '2D',
    type: 'icon',
    icon: Atom,
    bgGradient: 'from-fuchsia-600 via-pink-600 to-purple-800',
    border: 'border-fuchsia-300/40 ring-1 ring-fuchsia-600/20',
    text: 'text-white',
    glow: 'shadow-md shadow-fuchsia-600/30',
  },
  hbn: {
    symbol: 'h-BN',
    sub: 'Q-2D',
    type: 'icon',
    icon: Hexagon,
    bgGradient: 'from-slate-600 via-zinc-700 to-slate-800',
    border: 'border-slate-400/40 ring-1 ring-slate-600/20',
    text: 'text-white',
    glow: 'shadow-md shadow-slate-700/30',
  },
  nitinol: {
    symbol: 'NiTi',
    sub: 'SMA',
    type: 'icon',
    icon: Activity,
    bgGradient: 'from-cyan-600 via-teal-700 to-slate-800',
    border: 'border-cyan-300/40 ring-1 ring-cyan-600/20',
    text: 'text-white',
    glow: 'shadow-md shadow-cyan-600/30',
  },
  mof: {
    symbol: 'MOF',
    sub: 'Nano',
    type: 'icon',
    icon: Box,
    bgGradient: 'from-orange-500 via-amber-600 to-red-700',
    border: 'border-orange-300/40 ring-1 ring-orange-500/20',
    text: 'text-white',
    glow: 'shadow-md shadow-orange-600/30',
  },
  bi2se3: {
    symbol: 'Bi₂Se₃',
    sub: 'TI',
    type: 'icon',
    icon: Shield,
    bgGradient: 'from-pink-600 via-rose-600 to-purple-800',
    border: 'border-pink-300/40 ring-1 ring-pink-600/20',
    text: 'text-white',
    glow: 'shadow-md shadow-pink-600/30',
  },
  lgps: {
    symbol: 'LGPS',
    sub: 'Solid',
    type: 'icon',
    icon: Zap,
    bgGradient: 'from-yellow-500 via-amber-600 to-orange-700',
    border: 'border-yellow-300/40 ring-1 ring-yellow-600/20',
    text: 'text-white',
    glow: 'shadow-md shadow-yellow-600/30',
  },
  ti6al4v: {
    symbol: 'Ti-64',
    sub: 'Aero',
    type: 'icon',
    icon: Shield,
    bgGradient: 'from-slate-600 via-zinc-700 to-slate-800',
    border: 'border-slate-400/40 ring-1 ring-slate-700/20',
    text: 'text-white',
    glow: 'shadow-md shadow-slate-700/30',
  },
};

const SIZE_STYLES = {
  sm: {
    box: 'w-7 h-7 text-[10px] rounded-lg border',
    icon: 14,
    sub: 'text-[7px]',
  },
  md: {
    box: 'w-9 h-9 text-xs rounded-xl border',
    icon: 18,
    sub: 'text-[8px]',
  },
  lg: {
    box: 'w-11 h-11 text-sm rounded-2xl border-[1.5px]',
    icon: 22,
    sub: 'text-[9px]',
  },
  xl: {
    box: 'w-14 h-14 text-base rounded-2xl border-2',
    icon: 28,
    sub: 'text-[10px]',
  },
};

export default function MaterialBadge({
  material,
  size = 'md',
  className = '',
  showSub = false,
}: MaterialBadgeProps) {
  const config = BADGE_CONFIGS[material.id] ?? {
    symbol: material.formula.slice(0, 4),
    sub: material.categoryLabel.slice(0, 4),
    type: 'icon' as const,
    icon: Atom,
    bgGradient: 'from-blue-600 via-indigo-600 to-slate-700',
    border: 'border-blue-300/40 ring-1 ring-blue-500/20',
    text: 'text-white',
    glow: 'shadow-md shadow-blue-600/30',
  };

  const sz = SIZE_STYLES[size];
  const Icon = config.icon ?? Atom;

  return (
    <div
      className={`relative shrink-0 flex items-center justify-center font-mono font-black tracking-tight select-none bg-gradient-to-br ${config.bgGradient} ${config.border} ${config.text} ${config.glow} shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] ${sz.box} ${className}`}
      title={`${material.nameVi} (${material.formula})`}
    >
      {config.type === 'icon' && config.icon ? (
        <Icon size={sz.icon} strokeWidth={2.4} className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)]" />
      ) : (
        <span className="leading-none drop-shadow-[0_1px_1px_rgba(0,0,0,0.4)]">{config.symbol}</span>
      )}

      {showSub && config.sub && (
        <span
          className={`absolute -bottom-1 -right-1 px-1 rounded-md bg-slate-900/95 border border-white/30 text-white font-mono font-bold leading-none shadow-xs ${sz.sub}`}
        >
          {config.sub}
        </span>
      )}
    </div>
  );
}
