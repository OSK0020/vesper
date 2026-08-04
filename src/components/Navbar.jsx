import React, { useRef } from 'react';
import { Search, Plus, Download, Layout, Share2 } from 'lucide-react';
import { useMagnetic } from '../utils/useMagnetic';

function BrandMark() {
  return (
    <div className="brand-mark flex items-center gap-2">
      <svg width="22" height="22" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M24 4C12.954 4 4 12.954 4 24s8.954 20 20 20 20-8.954 20-20S35.046 4 24 4zm4 32c-7.732 0-14-6.268-14-14s6.268-14 14-14c1.8 0 3.5.34 5.06.96-5.8 2.2-9.06 8.3-7.58 14.36 1.48 6.06 6.94 10.38 13.16 9.94A14.04 14.04 0 0 1 28 36z"
          fill="url(#navVesperGrad)"
        />
        <defs>
          <linearGradient id="navVesperGrad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#863bff" />
            <stop offset="100%" stopColor="#f5b942" />
          </linearGradient>
        </defs>
      </svg>
      <span className="font-bold tracking-wider">VESPER</span>
    </div>
  );
}

export default function Navbar({
  pages,
  currentPage,
  onSelectPage,
  onAddPage,
  searchQuery,
  onSearchChange,
  onOpenAddModal,
  onOpenAddBoardModal,
  onOpenImportExportModal,
  onOpenCommandPalette,
  onOpenShareCardModal
}) {
  const searchInputRef = useRef(null);
  const magnetic = useMagnetic(0.25);

  return (
    <nav className="page-navigation">
      {/* Left: Brand + Page Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none min-w-0">
        <BrandMark />
        {pages.map((page) => {
          const isActive = page.toUpperCase() === currentPage.toUpperCase();
          return (
            <button
              key={page}
              onClick={() => onSelectPage(page)}
              className={isActive ? 'page-tab page-tab-active' : 'page-tab'}
            >
              {page}
            </button>
          );
        })}

        <button
          onClick={onAddPage}
          className="add-tab-btn"
          title="Add Page"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Right: Search & Action Controls */}
      <div className="flex items-center gap-2.5 flex-shrink-0">
        {/* Search Bar / Command Palette Trigger */}
        <div className="relative w-36 sm:w-60">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <Search className="w-3.5 h-3.5" style={{ color: 'var(--lumen-soft)' }} />
          </div>
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search... (Ctrl+K)"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={() => {
              if (onOpenCommandPalette) onOpenCommandPalette();
            }}
            className="ui-input pl-9 pr-8 py-1.5 text-xs cursor-pointer"
          />
          <button
            onClick={onOpenCommandPalette}
            className="absolute inset-y-0 right-0 pr-2 flex items-center text-gray-400 hover:text-white bg-transparent border-0 cursor-pointer"
            title="Open Command Palette (Ctrl+K)"
          >
            <kbd className="hidden sm:inline-flex items-center text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-gray-300">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Share Button */}
        <button
          onClick={onOpenShareCardModal}
          className="top-ctrl-btn hidden sm:inline-flex"
          title="Generate Social Share Image"
        >
          <Share2 className="w-3.5 h-3.5" style={{ color: 'var(--lumen-soft)' }} />
        </button>

        {/* Backup Button */}
        <button
          onClick={onOpenImportExportModal}
          className="top-ctrl-btn hidden sm:inline-flex"
          title="Backup & Restore"
        >
          <Download className="w-3.5 h-3.5" style={{ color: 'var(--lumen-soft)' }} />
        </button>

        {/* Add Board */}
        <button
          onClick={onOpenAddBoardModal}
          className="top-ctrl-btn hidden sm:inline-flex"
          title="Add Board"
        >
          <Layout className="w-3.5 h-3.5" style={{ color: 'var(--lumen-soft)' }} />
          <span className="hidden md:inline">+ Board</span>
        </button>

        {/* Add Link */}
        <button
          ref={magnetic.ref}
          onMouseMove={magnetic.onMouseMove}
          onMouseLeave={magnetic.onMouseLeave}
          onClick={() => onOpenAddModal()}
          className="top-ctrl-btn top-ctrl-btn-primary magnetic"
        >
          <Plus className="w-4 h-4" />
          <span>Add Link</span>
        </button>
      </div>
    </nav>
  );
}
