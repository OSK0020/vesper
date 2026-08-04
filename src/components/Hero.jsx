import React from 'react';

export default function Hero({ pageCount, boardCount, linkCount, currentPage }) {
  return (
    <header className="hero-mast">
      <div className="hero-mark">
        <span className="beam-dot" />
        <span>Your Digital Space, Illuminated · Built by Ori Stern</span>
      </div>

      <h1 className="hero-title">VESPER</h1>

      <p className="hero-sub">
        Your Digital Space, Illuminated. High-performance personal workspace designed for pure visual flow,
        ambient lighting, bento board grids, and zero artificial limits.
      </p>

      <div className="hero-status">
        <span>{currentPage}</span>
        <span className="sep">·</span>
        <span><b>{boardCount}</b> board{boardCount === 1 ? '' : 's'}</span>
        <span className="sep">·</span>
        <span><b>{linkCount}</b> link{linkCount === 1 ? '' : 's'}</span>
        <span className="sep">·</span>
        <span><b>{pageCount}</b> page{pageCount === 1 ? '' : 's'}</span>
      </div>
    </header>
  );
}
