import React, { useEffect } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { LayoutGrid, Link2, BookOpen } from 'lucide-react';
import { getPrefersReducedMotion } from '../utils/motion';

function StatPill({ icon: Icon, value, label }) {
  const isReducedMotion = getPrefersReducedMotion();
  const spring = useSpring(0, { stiffness: 100, damping: 20 });
  const display = useTransform(spring, (v) => Math.round(v));

  useEffect(() => {
    if (!isReducedMotion) {
      spring.set(value);
    }
  }, [value, spring, isReducedMotion]);

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs text-neutral-400 font-mono shadow-sm">
      <Icon className="w-3.5 h-3.5 text-accent-500" />
      <motion.span className="text-neutral-100 font-semibold tabular-nums text-sm">
        {isReducedMotion ? value : display}
      </motion.span>
      <span className="text-neutral-400 text-[11px] uppercase tracking-wider">{label}</span>
    </div>
  );
}

export default function Hero({ pageCount, boardCount, linkCount, currentPage }) {
  return (
    <header className="hero-mast max-w-7xl mx-auto w-full pt-10 pb-8 px-6 sm:px-8 flex flex-col gap-6 relative">
      
      {/* Dual Ambient Backdrop Glow Layer */}
      <div className="absolute inset-x-0 top-0 h-[600px] -z-10 pointer-events-none overflow-hidden">
        <div className="absolute left-1/2 top-[-200px] -translate-x-1/2 w-[900px] h-[500px] bg-[radial-gradient(ellipse_at_center,var(--color-accent-glow)_0%,transparent_65%)] opacity-40 blur-3xl" />
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[500px] h-[300px] bg-[radial-gradient(ellipse_at_center,rgb(255_255_255_/_0.08)_0%,transparent_70%)] blur-2xl" />
      </div>

      {/* Status Pill with Pulsing LED */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-sm text-xs font-medium text-neutral-300 w-fit">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full rounded-full bg-accent-500 opacity-75 animate-ping motion-reduce:animate-none" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-500 shadow-[0_0_8px_#34d399]" />
        </span>
        <span>Private workspace · live sync</span>
      </div>

      {/* Vertical Metallic Gradient Headline & Subtitle */}
      <div className="space-y-3">
        <h1 className="bg-gradient-to-b from-white via-neutral-200 to-neutral-500 bg-clip-text text-transparent text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.05] [text-wrap:balance] font-display">
          Your Digital Space, Illuminated
        </h1>
        <p className="max-w-2xl text-sm sm:text-base text-neutral-400 font-normal leading-relaxed">
          High-performance personal workspace designed for pure visual flow, ambient lighting, bento board grids, and zero artificial limits.
        </p>
      </div>

      {/* Stats Counter Bar with Spring StatPills */}
      <div className="p-4 sm:p-5 rounded-2xl bg-surface-1/80 border border-white/10 backdrop-blur-xl shadow-2xl flex flex-wrap items-center justify-between gap-4 max-w-3xl">
        
        <div className="flex items-center gap-3">
          <div className="text-xl sm:text-2xl font-bold text-white font-mono tracking-tight">{currentPage}</div>
          <span className="text-[11px] px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 font-mono border border-emerald-500/20 font-semibold tracking-wider">ACTIVE TAB</span>
        </div>

        <div className="h-6 w-px bg-white/10 hidden sm:block" />

        {/* Count-Up Spring StatPills */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <StatPill icon={LayoutGrid} value={boardCount} label={boardCount === 1 ? 'board' : 'boards'} />
          <StatPill icon={Link2} value={linkCount} label={linkCount === 1 ? 'link' : 'links'} />
          <StatPill icon={BookOpen} value={pageCount} label={pageCount === 1 ? 'page' : 'pages'} />
        </div>

      </div>
    </header>
  );
}





