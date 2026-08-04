import React, { useState, useEffect, useMemo, useRef } from 'react';
import initialData from './data/initialBookmarks.json';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import BoardGrid from './components/BoardGrid';
import AddBookmarkModal from './components/AddBookmarkModal';
import AddBoardModal from './components/AddBoardModal';
import AddPageModal from './components/AddPageModal';
import ImportExportModal from './components/ImportExportModal';
import CommandPalette from './components/CommandPalette';
import ShareCardModal from './components/ShareCardModal';
import LumenParticles from './components/LumenParticles';
import FloatingRail from './components/FloatingRail';
import Toast from './components/Toast';
import { SearchX } from 'lucide-react';

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

  // Additional custom boards metadata (color, column position, order)
  const [customBoardsMeta, setCustomBoardsMeta] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_BOARDS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  // Current selected page
  const [currentPage, setCurrentPage] = useState('HOME');
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState(null);
  const [isBlurActive, setIsBlurActive] = useState(false);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddBoardModalOpen, setIsAddBoardModalOpen] = useState(false);
  const [isAddPageModalOpen, setIsAddPageModalOpen] = useState(false);
  const [isImportExportModalOpen, setIsImportExportModalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isShareCardModalOpen, setIsShareCardModalOpen] = useState(false);

  const [editingBookmark, setEditingBookmark] = useState(null);
  const [defaultBoardForAdd, setDefaultBoardForAdd] = useState(null);

  // Global Keyboard Listener for Ctrl+K / Cmd+K Command Palette
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  // Cursor-reactive ambient glow — the literal "light" signature of LumiList
  const glowRef = useRef(null);
  useEffect(() => {
    let frame = null;
    const handlePointerMove = (e) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        if (glowRef.current) {
          glowRef.current.style.setProperty('--mx', `${e.clientX}px`);
          glowRef.current.style.setProperty('--my', `${e.clientY}px`);
        }
        frame = null;
      });
    };
    window.addEventListener('pointermove', handlePointerMove);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((current) => (current?.message === message ? null : current));
    }, 3500);
  };

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
        // Check if there is custom metadata for this board
        const meta = customBoardsMeta.find((c) => c.name.toUpperCase() === bName);
        boardMap.set(bName, {
          name: bName,
          columnIndex: meta?.columnIndex !== undefined ? meta.columnIndex : (b.boardColumnIndex !== undefined ? b.boardColumnIndex : 0),
          boardOrder: meta?.boardOrder !== undefined ? meta.boardOrder : (b.boardOrder !== undefined ? b.boardOrder : 0),
          accentHex: meta?.accentHex || '#863bff'
        });
      }
    });

    // Add custom created empty boards for this page
    customBoardsMeta.forEach((cb) => {
      if ((cb.pageName || 'HOME').toUpperCase() === currentPage.toUpperCase() && !boardMap.has(cb.name.toUpperCase())) {
        boardMap.set(cb.name.toUpperCase(), {
          name: cb.name.toUpperCase(),
          columnIndex: cb.columnIndex || 0,
          boardOrder: cb.boardOrder || 99,
          accentHex: cb.accentHex || '#863bff'
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

  // CRUD & Drag-and-Drop Handlers
  const handleSaveBookmark = (newOrUpdatedBookmark) => {
    const isEdit = bookmarks.some((b) => b.id === newOrUpdatedBookmark.id);
    setBookmarks((prev) => {
      const existingIdx = prev.findIndex((b) => b.id === newOrUpdatedBookmark.id);
      if (existingIdx >= 0) {
        const next = [...prev];
        next[existingIdx] = newOrUpdatedBookmark;
        return next;
      }
      return [newOrUpdatedBookmark, ...prev];
    });
    showToast(isEdit ? `Link "${newOrUpdatedBookmark.title}" updated!` : `Link "${newOrUpdatedBookmark.title}" added to ${newOrUpdatedBookmark.boardName}!`);
  };

  const handleDeleteBookmark = (bookmarkToDelete) => {
    if (window.confirm(`Delete "${bookmarkToDelete.title || bookmarkToDelete.url}"?`)) {
      setBookmarks((prev) => prev.filter((b) => b.id !== bookmarkToDelete.id && b.url !== bookmarkToDelete.url));
      showToast(`Link deleted`, 'info');
    }
  };

  const handleAddBoard = (newBoard) => {
    const bName = newBoard.name.toUpperCase();
    const hex = newBoard.accentColor === 'lumen' ? '#f5b942' :
                 newBoard.accentColor === 'emerald' ? '#10b981' :
                 newBoard.accentColor === 'rose' ? '#f43f5e' :
                 newBoard.accentColor === 'cyan' ? '#06b6d4' :
                 newBoard.accentColor === 'sapphire' ? '#3b82f6' : '#863bff';

    setCustomBoardsMeta((prev) => [
      ...prev.filter((c) => c.name.toUpperCase() !== bName),
      {
        name: bName,
        columnIndex: newBoard.columnIndex,
        accentHex: hex,
        pageName: currentPage
      }
    ]);
    showToast(`Board "${bName}" created!`);
  };

  const handleDeleteBoard = (boardName) => {
    if (window.confirm(`Delete board "${boardName}"?`)) {
      setBookmarks((prev) => prev.filter((b) => (b.boardName || '').toUpperCase() !== boardName.toUpperCase()));
      setCustomBoardsMeta((prev) => prev.filter((b) => b.name.toUpperCase() !== boardName.toUpperCase()));
      showToast(`Board "${boardName}" deleted`, 'info');
    }
  };

  const handleMoveBoard = (boardName, targetColIndex) => {
    const bName = boardName.toUpperCase();
    setCustomBoardsMeta((prev) => {
      const existing = prev.find((c) => c.name.toUpperCase() === bName);
      if (existing) {
        return prev.map((c) => c.name.toUpperCase() === bName ? { ...c, columnIndex: targetColIndex } : c);
      }
      return [...prev, { name: bName, columnIndex: targetColIndex, pageName: currentPage }];
    });

    // Also update bookmarks for this board
    setBookmarks((prev) =>
      prev.map((b) => ((b.boardName || '').toUpperCase() === bName ? { ...b, boardColumnIndex: targetColIndex } : b))
    );
    showToast(`Board "${bName}" moved to column ${targetColIndex + 1}`);
  };

  const handleMoveBookmark = (bookmarkId, targetBoardName) => {
    setBookmarks((prev) =>
      prev.map((b) => (b.id === bookmarkId || b.url === bookmarkId ? { ...b, boardName: targetBoardName.toUpperCase() } : b))
    );
    showToast(`Link moved to board ${targetBoardName.toUpperCase()}`);
  };

  const handleChangeBoardColor = (boardName, accentHex) => {
    const bName = boardName.toUpperCase();
    setCustomBoardsMeta((prev) => {
      const existing = prev.find((c) => c.name.toUpperCase() === bName);
      if (existing) {
        return prev.map((c) => c.name.toUpperCase() === bName ? { ...c, accentHex } : c);
      }
      return [...prev, { name: bName, accentHex, pageName: currentPage }];
    });
    showToast(`Updated theme for board ${bName}`);
  };

  const handleAddPage = (newPageName) => {
    setCurrentPage(newPageName.toUpperCase());
    showToast(`Page "${newPageName.toUpperCase()}" created!`);
  };

  const handleImportData = (importedBookmarks) => {
    setBookmarks(importedBookmarks);
    showToast(`Imported ${importedBookmarks.length} bookmarks successfully!`);
  };

  const handleResetData = () => {
    setBookmarks(initialData.bookmarks || []);
    setCustomBoardsMeta([]);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    localStorage.removeItem(LOCAL_STORAGE_BOARDS_KEY);
    showToast(`Reset to default dataset complete`, 'info');
  };

  return (
    <div className={`min-h-screen flex flex-col relative ${isBlurActive ? 'privacy-blur-active' : ''}`}>
      {/* Interactive Canvas Light Particles */}
      <LumenParticles />

      {/* Ambient aurora background — signature violet + lumen glow */}
      <div className="aurora-field" aria-hidden="true">
        <div className="aurora-blob a1" />
        <div className="aurora-blob a2" />
      </div>
      <div ref={glowRef} className="cursor-glow" aria-hidden="true" />

      {/* Top Floating Page Navigation */}
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
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onOpenShareCardModal={() => setIsShareCardModalOpen(true)}
      />

      <Hero
        currentPage={currentPage}
        boardCount={boardsList.length}
        linkCount={pageBookmarks.length}
        pageCount={availablePages.length}
      />

      {/* Official 4-Column Board Layout */}
      <main className="flex-1 w-full">
        
        {/* Search Empty State */}
        {searchQuery && filteredBookmarks.length === 0 && (
          <div className="board p-10 text-center flex flex-col items-center justify-center gap-4 max-w-md mx-auto my-12">
            <SearchX className="w-10 h-10 text-gray-500" />
            <h3 className="text-sm font-bold text-gray-200">No results found for "{searchQuery}"</h3>
            <button
              onClick={() => setSearchQuery('')}
              className="top-ctrl-btn mt-2"
            >
              Clear Search
            </button>
          </div>
        )}

        {/* Official LumiList Grid Container */}
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
          onChangeBoardColor={handleChangeBoardColor}
          onMoveBoard={handleMoveBoard}
          onMoveBookmark={handleMoveBookmark}
        />

      </main>

      {/* Official LumiList Floating Controls Rail */}
      <FloatingRail
        onOpenSearch={() => setIsCommandPaletteOpen(true)}
        onOpenImportExport={() => setIsImportExportModalOpen(true)}
        isBlurActive={isBlurActive}
        onToggleBlur={() => {
          setIsBlurActive(!isBlurActive);
          showToast(isBlurActive ? 'Privacy Blur disabled' : 'Privacy Blur enabled');
        }}
        onOpenSettings={() => setIsImportExportModalOpen(true)}
      />

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

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        bookmarks={bookmarks}
        boards={boardsList}
        pages={availablePages}
        currentPage={currentPage}
        onSelectPage={setCurrentPage}
        onOpenAddModal={(boardName) => {
          setEditingBookmark(null);
          setDefaultBoardForAdd(boardName);
          setIsAddModalOpen(true);
        }}
        onOpenAddBoardModal={() => setIsAddBoardModalOpen(true)}
        onOpenAddPageModal={() => setIsAddPageModalOpen(true)}
        onOpenImportExportModal={() => setIsImportExportModalOpen(true)}
        onToggleBlur={() => setIsBlurActive(!isBlurActive)}
        onOpenShareCardModal={() => setIsShareCardModalOpen(true)}
      />

      <ShareCardModal
        isOpen={isShareCardModalOpen}
        onClose={() => setIsShareCardModalOpen(false)}
        currentPage={currentPage}
        boards={boardsList}
        bookmarksCount={pageBookmarks.length}
      />

      {/* Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />

    </div>
  );
}
