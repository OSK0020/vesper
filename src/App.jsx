import React, { useState, useEffect, useMemo } from 'react';
import initialData from './data/initialBookmarks.json';
import Navbar from './components/Navbar';
import BoardGrid from './components/BoardGrid';
import AddBookmarkModal from './components/AddBookmarkModal';
import AddBoardModal from './components/AddBoardModal';
import AddPageModal from './components/AddPageModal';
import ImportExportModal from './components/ImportExportModal';
import { Layers, Bookmark, SearchX, Plus, Sparkles, FolderHeart } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'lumilist_clone_bookmarks_data';
const LOCAL_STORAGE_BOARDS_KEY = 'lumilist_clone_boards_meta';

export default function App() {
  // Load initial bookmarks state from LocalStorage or preloaded JSON file
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load saved bookmarks from localStorage', e);
    }
    return initialData.bookmarks || [];
  });

  // Additional custom boards metadata if added
  const [customBoardsMeta, setCustomBoardsMeta] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_BOARDS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  // Current selected page (e.g. HOME)
  const [currentPage, setCurrentPage] = useState('HOME');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddBoardModalOpen, setIsAddBoardModalOpen] = useState(false);
  const [isAddPageModalOpen, setIsAddPageModalOpen] = useState(false);
  const [isImportExportModalOpen, setIsImportExportModalOpen] = useState(false);

  const [editingBookmark, setEditingBookmark] = useState(null);
  const [defaultBoardForAdd, setDefaultBoardForAdd] = useState(null);

  // Sync bookmarks to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(bookmarks));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }, [bookmarks]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_BOARDS_KEY, JSON.stringify(customBoardsMeta));
    } catch (e) {}
  }, [customBoardsMeta]);

  // Extract unique pages
  const availablePages = useMemo(() => {
    const pages = new Set(['HOME']);
    bookmarks.forEach((b) => {
      if (b.pageName && b.status !== 'deleted') {
        pages.add(b.pageName.toUpperCase());
      }
    });
    return Array.from(pages);
  }, [bookmarks]);

  // Compute active bookmarks for current page
  const pageBookmarks = useMemo(() => {
    return bookmarks.filter((b) => {
      if (b.status === 'deleted') return false;
      const bPage = (b.pageName || 'HOME').toUpperCase();
      return bPage === currentPage.toUpperCase();
    });
  }, [bookmarks, currentPage]);

  // Filter bookmarks by search query
  const filteredBookmarks = useMemo(() => {
    if (!searchQuery.trim()) return pageBookmarks;
    const q = searchQuery.toLowerCase().trim();
    return pageBookmarks.filter(
      (b) =>
        (b.title && b.title.toLowerCase().includes(q)) ||
        (b.url && b.url.toLowerCase().includes(q)) ||
        (b.boardName && b.boardName.toLowerCase().includes(q))
    );
  }, [pageBookmarks, searchQuery]);

  // Extract unique boards for current page
  const boardsList = useMemo(() => {
    const boardMap = new Map();

    // Map bookmarks to boards
    pageBookmarks.forEach((b) => {
      const bName = (b.boardName || 'GENERAL').toUpperCase();
      if (!boardMap.has(bName)) {
        boardMap.set(bName, {
          name: bName,
          columnIndex: b.boardColumnIndex !== undefined ? b.boardColumnIndex : 0,
          boardOrder: b.boardOrder !== undefined ? b.boardOrder : 0
        });
      }
    });

    // Add custom created empty boards for this page
    customBoardsMeta.forEach((cb) => {
      if (cb.pageName === currentPage && !boardMap.has(cb.name)) {
        boardMap.set(cb.name, {
          name: cb.name,
          columnIndex: cb.columnIndex || 0,
          boardOrder: 99
        });
      }
    });

    return Array.from(boardMap.values()).sort((a, b) => a.columnIndex - b.columnIndex || a.boardOrder - b.boardOrder);
  }, [pageBookmarks, customBoardsMeta, currentPage]);

  const availableBoardNames = useMemo(() => {
    return Array.from(new Set(boardsList.map((b) => b.name)));
  }, [boardsList]);

  // Group bookmarks by boardName
  const bookmarksByBoard = useMemo(() => {
    const grouped = {};
    boardsList.forEach((b) => {
      grouped[b.name] = [];
    });
    filteredBookmarks.forEach((b) => {
      const bName = (b.boardName || 'GENERAL').toUpperCase();
      if (!grouped[bName]) grouped[bName] = [];
      grouped[bName].push(b);
    });
    // Sort items inside each board by bookmarkOrder if present
    Object.keys(grouped).forEach((key) => {
      grouped[key].sort((a, b) => (a.bookmarkOrder || 0) - (b.bookmarkOrder || 0));
    });
    return grouped;
  }, [boardsList, filteredBookmarks]);

  // CRUD Handlers
  const handleSaveBookmark = (newOrUpdatedBookmark) => {
    setBookmarks((prev) => {
      const existingIdx = prev.findIndex((b) => b.id === newOrUpdatedBookmark.id);
      if (existingIdx >= 0) {
        const next = [...prev];
        next[existingIdx] = newOrUpdatedBookmark;
        return next;
      }
      return [newOrUpdatedBookmark, ...prev];
    });
  };

  const handleDeleteBookmark = (bookmarkToDelete) => {
    if (window.confirm(`Are you sure you want to delete "${bookmarkToDelete.title || bookmarkToDelete.url}"?`)) {
      setBookmarks((prev) => prev.filter((b) => b.id !== bookmarkToDelete.id && b.url !== bookmarkToDelete.url));
    }
  };

  const handleAddBoard = (newBoard) => {
    setCustomBoardsMeta((prev) => [
      ...prev,
      {
        name: newBoard.name,
        columnIndex: newBoard.columnIndex,
        pageName: currentPage
      }
    ]);
  };

  const handleDeleteBoard = (boardName) => {
    if (window.confirm(`Are you sure you want to delete board "${boardName}" and all its links?`)) {
      setBookmarks((prev) => prev.filter((b) => (b.boardName || '').toUpperCase() !== boardName.toUpperCase()));
      setCustomBoardsMeta((prev) => prev.filter((b) => b.name.toUpperCase() !== boardName.toUpperCase()));
    }
  };

  const handleAddPage = (newPageName) => {
    setCurrentPage(newPageName.toUpperCase());
  };

  const handleImportData = (importedBookmarks) => {
    setBookmarks(importedBookmarks);
  };

  const handleResetData = () => {
    setBookmarks(initialData.bookmarks || []);
    setCustomBoardsMeta([]);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    localStorage.removeItem(LOCAL_STORAGE_BOARDS_KEY);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navbar */}
      <Navbar
        pages={availablePages}
        currentPage={currentPage}
        onSelectPage={setCurrentPage}
        onAddPage={() => setIsAddPageModalOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenAddModal={(boardName = null) => {
          setEditingBookmark(null);
          setDefaultBoardForAdd(boardName);
          setIsAddModalOpen(true);
        }}
        onOpenAddBoardModal={() => setIsAddBoardModalOpen(true)}
        onOpenImportExportModal={() => setIsImportExportModalOpen(true)}
        totalBookmarksCount={pageBookmarks.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-8">
        
        {/* Page Hero Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-xs font-bold rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-widest">
                PAGE
              </span>
              <h1 className="text-2xl font-black text-white tracking-tight uppercase">
                {currentPage}
              </h1>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Showing {filteredBookmarks.length} links across {boardsList.length} boards
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-3">
            <div className="glass-panel px-3 py-1.5 flex items-center gap-2 text-xs text-gray-300">
              <FolderHeart className="w-4 h-4 text-purple-400" />
              <span>{boardsList.length} Boards</span>
            </div>
            <div className="glass-panel px-3 py-1.5 flex items-center gap-2 text-xs text-gray-300">
              <Bookmark className="w-4 h-4 text-indigo-400" />
              <span>{filteredBookmarks.length} Links</span>
            </div>
          </div>
        </div>

        {/* Search Empty State */}
        {searchQuery && filteredBookmarks.length === 0 && (
          <div className="glass-panel p-12 text-center flex flex-col items-center justify-center gap-3 max-w-md mx-auto my-12">
            <SearchX className="w-10 h-10 text-gray-500" />
            <h3 className="text-base font-bold text-gray-200">No results found for "{searchQuery}"</h3>
            <p className="text-xs text-gray-400">Try adjusting your search terms or search across a different page.</p>
            <button
              onClick={() => setSearchQuery('')}
              className="glass-button text-xs py-1.5 px-4 mt-2"
            >
              Clear Search
            </button>
          </div>
        )}

        {/* Board Masonry Grid */}
        <BoardGrid
          boards={boardsList}
          bookmarksByBoard={bookmarksByBoard}
          onAddLinkToBoard={(boardName) => {
            setEditingBookmark(null);
            setDefaultBoardForAdd(boardName);
            setIsAddModalOpen(true);
          }}
          onEditBookmark={(bookmark) => {
            setEditingBookmark(bookmark);
            setIsAddModalOpen(true);
          }}
          onDeleteBookmark={handleDeleteBookmark}
          onDeleteBoard={handleDeleteBoard}
          onAddBoard={() => setIsAddBoardModalOpen(true)}
        />

      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-white/10 bg-[#060812]/90 py-6 text-center text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>LumiList Replica — Modern Visual Bookmarks Dashboard</span>
          </div>
          <div>
            <span>100% Client-Side • LocalStorage Sync • Vercel Ready</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AddBookmarkModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveBookmark}
        editingBookmark={editingBookmark}
        availablePages={availablePages}
        availableBoards={availableBoardNames.length > 0 ? availableBoardNames : ['MAIN']}
        defaultBoard={defaultBoardForAdd}
        currentPage={currentPage}
      />

      <AddBoardModal
        isOpen={isAddBoardModalOpen}
        onClose={() => setIsAddBoardModalOpen(false)}
        onAddBoard={handleAddBoard}
        availablePages={availablePages}
        currentPage={currentPage}
      />

      <AddPageModal
        isOpen={isAddPageModalOpen}
        onClose={() => setIsAddPageModalOpen(false)}
        onAddPage={handleAddPage}
      />

      <ImportExportModal
        isOpen={isImportExportModalOpen}
        onClose={() => setIsImportExportModalOpen(false)}
        bookmarks={bookmarks}
        onImportData={handleImportData}
        onResetData={handleResetData}
      />

    </div>
  );
}
