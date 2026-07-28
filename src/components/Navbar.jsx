import React, { useEffect, useRef } from 'react';
import { Search, Plus, Download, Layout, X } from 'lucide-react';

export default function Navbar({
  pages,
  currentPage,
  onSelectPage,
  onAddPage,
  searchQuery,
  onSearchChange,
  onOpenAddModal,
  onOpenAddBoardModal,
  onOpenImportExportModal
}) {
  const searchInputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <nav className="page-navigation">
      {/* Left: Page Tabs matching official LumiList markup */}
      <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
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
      <div className="flex items-center gap-3">
        {/* Search Bar */}
        <div className="relative w-48 sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <Search className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search bookmarks... (Ctrl + K)"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="ui-input pl-9 pr-8 py-1.5 text-xs"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-gray-400 hover:text-white bg-transparent border-0 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <button
          onClick={onOpenImportExportModal}
          className="top-ctrl-btn"
          title="Backup & Restore"
        >
          <Download className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden md:inline">Backup</span>
        </button>

        <button
          onClick={onOpenAddBoardModal}
          className="top-ctrl-btn"
          title="Add Board"
        >
          <Layout className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden md:inline">+ Board</span>
        </button>

        <button
          onClick={() => onOpenAddModal()}
          className="top-ctrl-btn top-ctrl-btn-primary"
        >
          <Plus className="w-4 h-4" />
          <span>Add Link</span>
        </button>
      </div>
    </nav>
  );
}
