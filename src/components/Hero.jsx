import React from 'react';

export default function Hero({ pageCount, boardCount, linkCount, currentPage }) {
  return (
    <header className="hero-mast max-w-7xl mx-auto w-full px-6 pt-10 pb-6 flex flex-col gap-6">
      
      {/* Brand Eyebrow Badge */}
      <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono tracking-widest text-emerald-400/90 uppercase w-fit shadow-sm">
        <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse" />
        <span>Your Digital Space, Illuminated</span>
      </div>

      {/* Main Title & Description */}
      <div className="space-y-2">
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white font-display">
          VESPER
        </h1>
        <p className="text-sm sm:text-base text-neutral-300 max-w-2xl leading-relaxed">
          High-performance personal workspace designed for pure visual flow, ambient lighting, bento board grids, and zero artificial limits.
        </p>
      </div>

      {/* Spacious Glass Stats Bento Container */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl shadow-xl flex flex-wrap items-center justify-between gap-6 max-w-3xl">
        
        <div className="flex items-center gap-3">
          <div className="text-2xl sm:text-3xl font-bold text-white font-mono">{currentPage}</div>
          <span className="text-xs px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 font-mono border border-emerald-500/20">ACTIVE TAB</span>
        </div>

        <div className="h-8 w-px bg-white/10 hidden sm:block" />

        <div className="flex items-center gap-8 text-xs font-mono">
          <div>
            <div className="text-xl font-bold text-white">{boardCount}</div>
            <div className="text-neutral-400 mt-0.5">BOARD{boardCount === 1 ? '' : 'S'}</div>
          </div>
          <div>
            <div className="text-xl font-bold text-white">{linkCount}</div>
            <div className="text-neutral-400 mt-0.5">LINK{linkCount === 1 ? '' : 'S'}</div>
          </div>
          <div>
            <div className="text-xl font-bold text-white">{pageCount}</div>
            <div className="text-neutral-400 mt-0.5">PAGE{pageCount === 1 ? '' : 'S'}</div>
          </div>
        </div>

      </div>
    </header>
  );
}

