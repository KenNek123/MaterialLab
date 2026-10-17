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
    bgGradient: 'from-cyan-400/30 via-sky-500/20 to-blue-600/30',
    border: 'border-cyan-300/80',
    text: 'text-cyan-200',
    glow: 'shadow-[0_0_12px_rgba(34,211,238,0.45)]',
  },
  graphite: {
    symbol: 'C',
    sub: 'sp²',
    type: 'icon',
    icon: Hexagon,
    bgGradient: 'from-slate-500/30 via-zinc-600/20 to-stone-700/30',
    border: 'border-slate-400/80',
    text: 'text-slate-200',
    glow: 'shadow-[0_0_12px_rgba(148,163,184,0.4)]',
  },
  nacl: {
    symbol: 'NaCl',
    sub: 'FCC',
    type: 'icon',
    icon: Box,
    bgGradient: 'from-blue-500/30 via-indigo-600/20 to-cyan-600/30',
    border: 'border-sky-400/80',
    text: 'text-sky-200',
    glow: 'shadow-[0_0_12px_rgba(56,189,248,0.4)]',
  },
  quartz: {
    symbol: 'SiO₂',
    sub: 'Thạch Anh',
    type: 'icon',
    icon: Sparkles,
    bgGradient: 'from-purple-500/30 via-fuchsia-600/20 to-violet-700/30',
    border: 'border-purple-400/80',
    text: 'text-purple-200',
    glow: 'shadow-[0_0_12px_rgba(192,132,252,0.4)]',
  },
  mxene: {
    symbol: 'Ti₃C₂',
    sub: 'MXene',
    type: 'icon',
    icon: Zap,
    bgGradient: 'from-cyan-400/35 via-teal-500/25 to-sky-600/35',
    border: 'border-cyan-400/90',
    text: 'text-cyan-200',
    glow: 'shadow-[0_0_14px_rgba(6,182,212,0.5)]',
  },
  gold: {
    symbol: 'Au',
    sub: '24K',
    type: 'icon',
    icon: Shield,
    bgGradient: 'from-amber-400/35 via-yellow-500/25 to-amber-700/35',
    border: 'border-amber-400/90',
    text: 'text-amber-200',
    glow: 'shadow-[0_0_14px_rgba(251,191,36,0.5)]',
  },
  copper: {
    symbol: 'Cu',
    sub: 'Dẫn điện',
    type: 'icon',
    icon: Zap,
    bgGradient: 'from-orange-500/35 via-amber-600/25 to-red-700/35',
    border: 'border-orange-400/90',
    text: 'text-orange-200',
    glow: 'shadow-[0_0_14px_rgba(249,115,22,0.45)]',
  },
  steel: {
    symbol: 'Fe-C',
    sub: 'BCC',
    type: 'icon',
    icon: Shield,
    bgGradient: 'from-slate-400/30 via-zinc-600/25 to-stone-800/35',
    border: 'border-slate-300/80',
    text: 'text-slate-100',
    glow: 'shadow-[0_0_12px_rgba(203,213,225,0.4)]',
  },
  aluminum: {
    symbol: 'Al',
    sub: 'Hàng không',
    type: 'icon',
    icon: Layers,
    bgGradient: 'from-sky-400/30 via-slate-500/20 to-blue-600/30',
    border: 'border-sky-300/80',
    text: 'text-sky-100',
    glow: 'shadow-[0_0_12px_rgba(125,211,252,0.4)]',
  },
  titanium: {
    symbol: 'Ti',
    sub: 'HCP',
    type: 'icon',
    icon: Activity,
    bgGradient: 'from-teal-500/30 via-cyan-600/20 to-slate-700/30',
    border: 'border-teal-400/80',
    text: 'text-teal-200',
    glow: 'shadow-[0_0_12px_rgba(45,212,191,0.4)]',
  },
  silicon: {
    symbol: 'Si',
    sub: 'Chip bán dẫn',
    type: 'icon',
    icon: Cpu,
    bgGradient: 'from-indigo-500/30 via-blue-600/20 to-indigo-800/30',
    border: 'border-indigo-400/80',
    text: 'text-indigo-200',
    glow: 'shadow-[0_0_12px_rgba(129,140,248,0.4)]',
  },
  teflon: {
    symbol: 'PTFE',
    sub: 'Chống dính',
    type: 'icon',
    icon: Layers,
    bgGradient: 'from-emerald-500/30 via-teal-600/20 to-emerald-700/30',
    border: 'border-emerald-400/80',
    text: 'text-emerald-200',
    glow: 'shadow-[0_0_12px_rgba(52,211,153,0.4)]',
  },
  'battery-lco': {
    symbol: 'LiCoO₂',
    sub: 'Pin Li-ion',
    type: 'icon',
    icon: Zap,
    bgGradient: 'from-green-500/30 via-emerald-600/20 to-teal-700/30',
    border: 'border-green-400/80',
    text: 'text-green-200',
    glow: 'shadow-[0_0_12px_rgba(74,222,128,0.4)]',
  },
  'ceramic-al2o3': {
    symbol: 'Al₂O₃',
    sub: 'Gốm sứ',
    type: 'icon',
    icon: Box,
    bgGradient: 'from-rose-500/30 via-pink-600/20 to-purple-700/30',
    border: 'border-rose-400/80',
    text: 'text-rose-200',
    glow: 'shadow-[0_0_12px_rgba(251,113,133,0.4)]',
  },
  rubber: {
    symbol: 'Polymer',
    sub: 'Đàn hồi',
    type: 'icon',
    icon: Activity,
    bgGradient: 'from-amber-600/30 via-orange-600/20 to-yellow-700/30',
    border: 'border-amber-500/80',
    text: 'text-amber-200',
    glow: 'shadow-[0_0_12px_rgba(245,158,11,0.4)]',
  },

  // Backward-compatibility aliases
  graphene: {
    symbol: 'C',
    sub: 'sp²',
    type: 'icon',
    icon: Hexagon,
    bgGradient: 'from-sky-500/30 via-blue-600/20 to-cyan-500/30',
    border: 'border-sky-400/80',
    text: 'text-sky-300',
    glow: 'shadow-[0_0_12px_rgba(56,189,248,0.4)]',
  },
  swcnt: {
    symbol: 'CNT',
    sub: '1nm',
    type: 'icon',
    icon: Layers,
    bgGradient: 'from-emerald-500/30 via-teal-600/20 to-emerald-700/30',
    border: 'border-emerald-400/80',
    text: 'text-emerald-300',
    glow: 'shadow-[0_0_12px_rgba(52,211,153,0.4)]',
  },
  cnt: {
    symbol: 'CNT',
    sub: 'Nano',
    type: 'icon',
    icon: Layers,
    bgGradient: 'from-cyan-500/35 via-blue-600/25 to-sky-700/35',
    border: 'border-cyan-400/90',
    text: 'text-cyan-200',
    glow: 'shadow-[0_0_14px_rgba(6,182,212,0.5)]',
  },
  buckyball: {
    symbol: 'C₆₀',
    sub: 'Fullerene',
    type: 'icon',
    icon: Atom,
    bgGradient: 'from-purple-500/35 via-fuchsia-600/25 to-violet-700/35',
    border: 'border-purple-400/90',
    text: 'text-purple-200',
    glow: 'shadow-[0_0_14px_rgba(168,85,247,0.5)]',
  },
  aerogel: {
    symbol: 'SiO₂',
    sub: 'Aerogel',
    type: 'icon',
    icon: Sparkles,
    bgGradient: 'from-sky-300/35 via-cyan-400/25 to-blue-500/35',
    border: 'border-sky-300/90',
    text: 'text-sky-100',
    glow: 'shadow-[0_0_14px_rgba(56,189,248,0.5)]',
  },
  perovskite: {
    symbol: 'Pb',
    sub: 'ABX₃',
    type: 'icon',
    icon: Sparkles,
    bgGradient: 'from-purple-500/30 via-fuchsia-600/20 to-purple-800/30',
    border: 'border-purple-400/80',
    text: 'text-purple-300',
    glow: 'shadow-[0_0_12px_rgba(192,132,252,0.4)]',
  },
  silicene: {
    symbol: 'Si',
    sub: '2D',
    type: 'icon',
    icon: Cpu,
    bgGradient: 'from-indigo-500/30 via-blue-600/20 to-indigo-800/30',
    border: 'border-indigo-400/80',
    text: 'text-indigo-300',
    glow: 'shadow-[0_0_12px_rgba(129,140,248,0.4)]',
  },
  borophene: {
    symbol: 'B',
    sub: '2D',
    type: 'badge',
    bgGradient: 'from-amber-500/30 via-orange-600/20 to-amber-700/30',
    border: 'border-amber-400/80',
    text: 'text-amber-300',
    glow: 'shadow-[0_0_12px_rgba(251,191,36,0.4)]',
  },
  gan: {
    symbol: 'GaN',
    sub: 'WBG',
    type: 'icon',
    icon: Zap,
    bgGradient: 'from-blue-600/30 via-indigo-600/20 to-violet-700/30',
    border: 'border-blue-400/80',
    text: 'text-blue-300',
    glow: 'shadow-[0_0_12px_rgba(96,165,250,0.4)]',
  },
  sic: {
    symbol: 'SiC',
    sub: '4H',
    type: 'badge',
    bgGradient: 'from-emerald-600/30 via-teal-600/20 to-green-700/30',
    border: 'border-emerald-400/80',
    text: 'text-emerald-300',
    glow: 'shadow-[0_0_12px_rgba(52,211,153,0.4)]',
  },
  mos2: {
    symbol: 'MoS₂',
    sub: '2D',
    type: 'icon',
    icon: Atom,
    bgGradient: 'from-fuchsia-600/30 via-pink-600/20 to-purple-800/30',
    border: 'border-fuchsia-400/80',
    text: 'text-fuchsia-300',
    glow: 'shadow-[0_0_12px_rgba(232,121,249,0.4)]',
  },
  hbn: {
    symbol: 'h-BN',
    sub: 'Q-2D',
    type: 'badge',
    bgGradient: 'from-slate-200/30 via-slate-400/20 to-zinc-500/30',
    border: 'border-slate-300/80',
    text: 'text-slate-100',
    glow: 'shadow-[0_0_12px_rgba(241,245,249,0.35)]',
  },
  nitinol: {
    symbol: 'NiTi',
    sub: 'SMA',
    type: 'icon',
    icon: Activity,
    bgGradient: 'from-cyan-600/30 via-teal-600/20 to-slate-700/30',
    border: 'border-cyan-400/80',
    text: 'text-cyan-300',
    glow: 'shadow-[0_0_12px_rgba(34,211,238,0.4)]',
  },
  mof: {
    symbol: 'MOF',
    sub: 'Nano',
    type: 'icon',
    icon: Box,
    bgGradient: 'from-orange-500/30 via-amber-600/20 to-red-700/30',
    border: 'border-orange-400/80',
    text: 'text-orange-300',
    glow: 'shadow-[0_0_12px_rgba(249,115,22,0.4)]',
  },
  bi2se3: {
    symbol: 'Bi₂Se₃',
    sub: 'TI',
    type: 'badge',
    bgGradient: 'from-pink-600/30 via-rose-600/20 to-purple-800/30',
    border: 'border-pink-400/80',
    text: 'text-pink-300',
    glow: 'shadow-[0_0_12px_rgba(244,114,182,0.4)]',
  },
  lgps: {
    symbol: 'LGPS',
    sub: 'Solid',
    type: 'icon',
    icon: Zap,
    bgGradient: 'from-yellow-500/30 via-amber-600/20 to-orange-700/30',
    border: 'border-yellow-400/80',
    text: 'text-yellow-300',
    glow: 'shadow-[0_0_12px_rgba(250,204,21,0.4)]',
  },
  ti6al4v: {
    symbol: 'Ti-64',
    sub: 'Aero',
    type: 'icon',
    icon: Shield,
    bgGradient: 'from-slate-400/30 via-zinc-500/20 to-slate-700/30',
    border: 'border-slate-300/80',
    text: 'text-slate-100',
    glow: 'shadow-[0_0_12px_rgba(203,213,225,0.4)]',
  },
};

const SIZE_STYLES = {
  sm: {
    box: 'w-7 h-7 text-[10px] rounded-lg border',
    icon: 14,
    sub: 'text-[7px]',
  },
  md: {
    box: 'w-9 h-9 text-xs rounded-xl border-[1.5px]',
    icon: 17,
    sub: 'text-[8px]',
  },
  lg: {
    box: 'w-11 h-11 text-sm rounded-2xl border-2',
    icon: 20,
    sub: 'text-[9px]',
  },
  xl: {
    box: 'w-14 h-14 text-base rounded-2xl border-2',
    icon: 26,
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
    type: 'badge',
    bgGradient: 'from-blue-500/25 to-slate-600/30',
    border: 'border-blue-400/60',
    text: 'text-blue-200',
    glow: 'shadow-md',
  };

  const sz = SIZE_STYLES[size];
  const Icon = config.icon ?? Atom;

  return (
    <div
      className={`relative shrink-0 flex items-center justify-center font-mono font-black tracking-tight select-none bg-gradient-to-br ${config.bgGradient} ${config.border} ${config.text} ${config.glow} ${sz.box} ${className}`}
      title={`${material.nameVi} (${material.formula})`}
    >
      {config.type === 'icon' && config.icon ? (
        <Icon size={sz.icon} strokeWidth={2.4} />
      ) : (
        <span className="leading-none">{config.symbol}</span>
      )}

      {showSub && config.sub && (
        <span
          className={`absolute -bottom-1 -right-1 px-1 rounded-md bg-slate-950/90 border border-white/20 text-white font-mono font-bold leading-none ${sz.sub}`}
        >
          {config.sub}
        </span>
      )}
    </div>
  );
}
