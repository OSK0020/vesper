import React, { useEffect, useRef } from 'react';
import { 
  Search, Plus, Layers, Download, Upload, Sparkles, 
  X, Grid, Layout
} from 'lucide-react';

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
  totalBookmarksCount
}) {
  const searchInputRef = useRef(null);

  // Keyboard shortcut Ctrl+K to focus search
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
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#080a14]/80 border-b border-white/10 px-4 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Left: Brand & Page Selector */}
        <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-start">
          {/* Brand Logo */}
          <div className="flex items-center gap-2.5">
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/25 flex items-center justify-center">
              <div className="w-full h-full bg-[#0b0d1b] rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
              </div>
            </div>
            <div>
              <span className="text-lg font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-100 to-indigo-200">
                LumiList
              </span>
              <span className="hidden sm:inline-block ml-2 px-1.5 py-0.5 text-[10px] font-bold rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                PRO
              </span>
            </div>
          </div>

          {/* Vertical Divider */}
          <div className="h-6 w-px bg-white/10 hidden sm:block" />

          {/* Page Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
            {pages.map((page) => {
              const isActive = page === currentPage;
              return (
                <button
                  key={page}
                  onClick={() => onSelectPage(page)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold tracking-wide transition-all border ${
                    isActive
                      ? 'bg-indigo-600/30 text-white border-indigo-500/50 shadow-sm shadow-indigo-500/20'
                      : 'bg-white/5 text-gray-400 border-white/5 hover:bg-white/10 hover:text-gray-200'
                  }`}
                >
                  {page}
                </button>
              );
            })}
            <button
              onClick={onAddPage}
              className="p-1.5 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/5 transition-colors"
              title="Add Page"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Center: Live Search Bar */}
        <div className="relative w-full md:w-80 lg:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search bookmarks... (Ctrl + K)"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="glass-input pl-9 pr-16 py-2 text-xs"
          />
          {searchQuery ? (
            <button
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white bg-transparent border-0 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-gray-400 bg-white/5 rounded border border-white/10">
                Ctrl K
              </kbd>
            </div>
          )}
        </div>

        {/* Right: Actions & Counters */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          <button
            onClick={onOpenImportExportModal}
            className="glass-button text-xs py-2 px-3"
            title="Import / Export Data"
          >
            <Download className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Backup</span>
          </button>

          <button
            onClick={onOpenAddBoardModal}
            className="glass-button text-xs py-2 px-3"
            title="Add New Board"
          >
            <Layout className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden sm:inline">+ Board</span>
          </button>

          <button
            onClick={() => onOpenAddModal()}
            className="glass-button glass-button-primary text-xs py-2 px-4"
          >
            <Plus className="w-4 h-4" />
            <span>Add Link</span>
          </button>
        </div>

      </div>
    </header>
  );
}
