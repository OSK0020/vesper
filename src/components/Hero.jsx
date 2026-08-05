import React from 'react';

export default function Hero({ pageCount, boardCount, linkCount, currentPage }) {
  return (
    <header className="hero-mast max-w-7xl mx-auto w-full pt-6 pb-8 px-8 flex flex-col items-start relative overflow-hidden">
      
      {/* Ambient Faint Radial Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent pointer-events-none" />

      {/* Kicker / Subtitle Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-medium tracking-wider uppercase mb-4 shadow-[0_0_15px_rgba(16,185,129,0.15)] relative z-10">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#10b981]" />
        <span>Your Digital Space, Illuminated</span>
      </div>

      {/* Main Title (VESPER) with Crisp Metallic Gradient */}
      <h1 className="text-5xl sm:text-6xl font-black tracking-tight bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent drop-shadow-sm mb-3 font-display relative z-10 leading-none">
        VESPER
      </h1>

      {/* Description Text */}
      <p className="max-w-2xl text-sm sm:text-base text-neutral-400 font-normal leading-relaxed mb-6 relative z-10">
        High-performance personal workspace designed for pure visual flow, ambient lighting, bento board grids, and zero artificial limits.
      </p>

      {/* Glass Stats Bento Container */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.025] border border-white/10 backdrop-blur-xl shadow-2xl flex flex-wrap items-center justify-between gap-4 max-w-3xl hover:border-white/15 transition-all relative z-10">
        
        <div className="flex items-center gap-3">
          <div className="text-xl sm:text-2xl font-bold text-white font-mono tracking-tight">{currentPage}</div>
          <span className="text-[11px] px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 font-mono border border-emerald-500/20 font-semibold tracking-wider">ACTIVE TAB</span>
        </div>

        <div className="h-6 w-px bg-white/10 hidden sm:block" />

        {/* Clean Glass Pills Counters */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="px-3.5 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-mono flex items-center gap-2 text-neutral-300 shadow-sm">
            <span className="font-extrabold text-white text-sm">{boardCount}</span>
            <span className="text-neutral-400 text-[11px]">BOARD{boardCount === 1 ? '' : 'S'}</span>
          </div>

          <div className="px-3.5 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-mono flex items-center gap-2 text-neutral-300 shadow-sm">
            <span className="font-extrabold text-white text-sm">{linkCount}</span>
            <span className="text-neutral-400 text-[11px]">LINK{linkCount === 1 ? '' : 'S'}</span>
          </div>

          <div className="px-3.5 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-mono flex items-center gap-2 text-neutral-300 shadow-sm">
            <span className="font-extrabold text-white text-sm">{pageCount}</span>
            <span className="text-neutral-400 text-[11px]">PAGE{pageCount === 1 ? '' : 'S'}</span>
          </div>
        </div>

      </div>
    </header>
  );
}




