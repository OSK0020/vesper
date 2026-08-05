import React from 'react';

export default function Hero({ pageCount, boardCount, linkCount, currentPage }) {
  return (
    <header className="hero-mast max-w-7xl mx-auto w-full px-6 pt-12 pb-6 flex flex-col gap-6 relative">
      
      {/* Eyebrow Badge with Glowing Ping */}
      <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-emerald-500/[0.08] border border-emerald-500/20 text-[11px] font-mono tracking-[0.18em] text-emerald-400 uppercase w-fit backdrop-blur-md shadow-[0_0_20px_rgba(16,185,129,0.15)] transition-all hover:border-emerald-500/40">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400 shadow-[0_0_8px_#10b981]" />
        </span>
        <span>Your Digital Space, Illuminated</span>
      </div>

      {/* Main Title & Description with Ambient Soft Glow */}
      <div className="space-y-3 relative">
        <div className="absolute -left-4 -top-6 w-80 h-28 bg-emerald-500/15 blur-3xl pointer-events-none rounded-full" />
        
        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-100 to-emerald-400 font-display leading-none drop-shadow-[0_4px_25px_rgba(0,0,0,0.6)]">
          VESPER
        </h1>
        
        <p className="text-sm sm:text-base text-neutral-400 max-w-2xl leading-relaxed font-normal pt-1">
          High-performance personal workspace designed for pure visual flow, ambient lighting, bento board grids, and zero artificial limits.
        </p>
      </div>

      {/* Glass Stats Bento Container */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.025] border border-white/10 backdrop-blur-xl shadow-2xl flex flex-wrap items-center justify-between gap-4 max-w-3xl hover:border-white/15 transition-all">
        
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



