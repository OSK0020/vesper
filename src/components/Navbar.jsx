import React, { useRef } from 'react';
import { Search, Plus, Download, Layout, Share2 } from 'lucide-react';
import { useMagnetic } from '../utils/useMagnetic';

function BrandMark() {
  return (
    <div className="brand-mark">
      <svg width="20" height="19" viewBox="0 0 48 46" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M25.946 44.938c-.664.845-2.021.375-2.021-.698V33.937a2.26 2.26 0 0 0-2.262-2.262H10.287c-.92 0-1.456-1.04-.92-1.788l7.48-10.471c1.07-1.497 0-3.578-1.842-3.578H1.237c-.92 0-1.456-1.04-.92-1.788L10.013.474c.214-.297.556-.474.92-.474h28.894c.92 0 1.456 1.04.92 1.788l-7.48 10.471c-1.07 1.498 0 3.579 1.842 3.579h11.377c.943 0 1.473 1.088.89 1.83L25.947 44.94z"
          fill="#863bff"
        />
      </svg>
      <span>OriList</span>
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
