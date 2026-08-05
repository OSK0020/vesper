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
    <header className="hero-mast max-w-[1700px] mx-auto w-full pt-8 pb-6 px-4 sm:px-8 flex flex-col gap-5 relative">
      
      {/* Unified Ambient Backdrop Glow Layer */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] max-w-[1200px] max-h-[800px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* Status Pill with Pulsing LED */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.04] backdrop-blur-md shadow-sm w-fit"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="text-xs font-medium tracking-wide text-zinc-300">
          VESPER v2.0 Live
        </span>
      </motion.div>

      {/* Metallic Gradient Headline & Subtitle */}
      <div className="space-y-2 relative z-10">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight pb-1 leading-[1.08] font-display">
          <span className="bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent drop-shadow-sm">
            Curate Your Digital Mind.
          </span>
        </h1>
        <p className="max-w-2xl text-base sm:text-lg text-zinc-400 font-medium leading-relaxed">
          The visual workspace for elite engineers and designers.
        </p>
      </div>

      {/* Compact HUD Stats Counter Bar */}
      <div className="p-3 sm:p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl shadow-xl inline-flex items-center gap-4 sm:gap-5 w-fit flex-wrap">
        
        <div className="flex items-center gap-3 pl-1">
          <div className="text-lg sm:text-xl font-bold text-white font-mono tracking-tight">{currentPage}</div>
          <span className="text-[10px] px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 font-mono border border-emerald-500/20 font-bold tracking-wider">ACTIVE TAB</span>
        </div>

        <div className="h-5 w-px bg-white/15 hidden sm:block" />

        {/* Count-Up Spring StatPills */}
        <div className="flex items-center gap-2 flex-wrap">
          <StatPill icon={LayoutGrid} value={boardCount} label={boardCount === 1 ? 'board' : 'boards'} />
          <StatPill icon={Link2} value={linkCount} label={linkCount === 1 ? 'link' : 'links'} />
          <StatPill icon={BookOpen} value={pageCount} label={pageCount === 1 ? 'page' : 'pages'} />
        </div>

      </div>
    </header>
  );
}





