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
    <header className="sticky top-0 z-50 bg-[#070908]/90 backdrop-blur-md border-b border-white/10 px-4 lg:px-6 py-3">
      <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Left: Page Pills matching screenshot */}
        <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none w-full md:w-auto">
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
            className="w-8 h-8 rounded-lg bg-[#18201c] hover:bg-[#232d28] border border-white/10 flex items-center justify-center text-gray-300 hover:text-white transition-colors cursor-pointer"
            title="Add Page"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Search Bar & Action Buttons */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          
          {/* Search Bar */}
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-gray-400">
              <Search className="w-3.5 h-3.5" />
            </div>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search bookmarks... (Ctrl + K)"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="dark-input pl-8 pr-8 py-1.5 text-xs"
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
            className="action-button"
            title="Backup & Restore"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Backup</span>
          </button>

          <button
            onClick={onOpenAddBoardModal}
            className="action-button"
            title="Add Board"
          >
            <Layout className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">+ Board</span>
          </button>

          <button
            onClick={() => onOpenAddModal()}
            className="action-button action-button-primary"
          >
            <Plus className="w-4 h-4" />
            <span>Add Link</span>
          </button>
        </div>

      </div>
    </header>
  );
}
