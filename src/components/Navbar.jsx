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
    <header className="sticky top-0 z-50 bg-[#060907]/95 backdrop-blur-xl border-b border-white/10 px-6 lg:px-12 py-4 lg:py-5 shadow-2xl transition-all">
      <div className="max-w-[1800px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Left: Page Pills with generous spacing */}
        <div className="flex items-center gap-3 overflow-x-auto py-1 scrollbar-none w-full md:w-auto">
          {pages.map((page) => {
            const isActive = page.toUpperCase() === currentPage.toUpperCase();
            return (
              <button
                key={page}
                onClick={() => onSelectPage(page)}
                className={isActive ? 'page-pill page-pill-active' : 'page-pill'}
              >
                {page}
              </button>
            );
          })}
          
          <button
            onClick={onAddPage}
            className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-gray-300 hover:text-white transition-colors cursor-pointer flex-shrink-0"
            title="Add Page"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Search Bar & Action Buttons with generous spacing */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-end flex-wrap sm:flex-nowrap">
          
          {/* Search Bar with proper icon & text clearance */}
          <div className="relative w-full md:w-72 min-w-[200px]">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <Search className="w-4 h-4 text-emerald-400" />
            </div>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search bookmarks... (Ctrl + K)"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="ui-input pl-10 pr-9 py-2.5 text-xs"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white bg-transparent border-0 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            onClick={onOpenImportExportModal}
            className="action-btn"
            title="Backup & Restore"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Backup</span>
          </button>

          <button
            onClick={onOpenAddBoardModal}
            className="action-btn"
            title="Add Board"
          >
            <Layout className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">+ Board</span>
          </button>

          <button
            onClick={() => onOpenAddModal()}
            className="action-btn action-btn-primary"
          >
            <Plus className="w-4 h-4" />
            <span>Add Link</span>
          </button>
        </div>

      </div>
    </header>
  );
}
