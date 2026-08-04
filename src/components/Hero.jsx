import React from 'react';

export default function Hero({ pageCount, boardCount, linkCount, currentPage }) {
  return (
    <header className="hero-mast">
      <div className="hero-mark">
        <span className="beam-dot" />
        <span>Visual bookmark workspace</span>
      </div>

      <h1 className="hero-title">Lumi List</h1>

      <p className="hero-sub">
        Every link, lit and in its place. Boards catch the light as you move —
        a small signal that this is your space, arranged your way.
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
