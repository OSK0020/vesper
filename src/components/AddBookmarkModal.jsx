import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Link2, Type, Layout, BookOpen } from 'lucide-react';
import { useEscapeClose } from '../utils/useEscapeClose';
import { getFaviconUrl } from '../utils/favicon';
import { scaleIn, easeVesper } from '../utils/motion';

export default function AddBookmarkModal({
  isOpen,
  onClose,
  onAddBookmark,
  onEditBookmark,
  editingBookmark,
  availableBoards = [],
  availablePages = [],
  currentPage = 'MAIN',
  initialBoard = ''
}) {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [boardName, setBoardName] = useState(initialBoard || (availableBoards[0] || 'GENERAL'));
  const [pageName, setPageName] = useState(currentPage);
  const [customBoard, setCustomBoard] = useState('');
  const [previewFavicon, setPreviewFavicon] = useState('');

  useEscapeClose(isOpen, onClose);

  useEffect(() => {
    if (editingBookmark) {
      setUrl(editingBookmark.url || '');
      setTitle(editingBookmark.title || '');
      setBoardName(editingBookmark.boardName || (availableBoards[0] || 'GENERAL'));
      setPageName(editingBookmark.pageName || currentPage);
    } else {
      setUrl('');
      setTitle('');
      setBoardName(initialBoard || (availableBoards[0] || 'GENERAL'));
      setPageName(currentPage);
      setCustomBoard('');
    }
  }, [editingBookmark, isOpen, initialBoard, currentPage, availableBoards]);

  useEffect(() => {
    if (url.trim() && (url.startsWith('http://') || url.startsWith('https://'))) {
      setPreviewFavicon(getFaviconUrl(url));
    } else {
      setPreviewFavicon('');
    }
  }, [url]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!url.trim()) return;

    let finalUrl = url.trim();
    if (!/^https?:\/\//i.test(finalUrl)) {
      finalUrl = 'https://' + finalUrl;
    }

    const finalBoard = boardName === '__NEW__' ? customBoard.trim().toUpperCase() : boardName;
    if (!finalBoard) return;

    if (editingBookmark && onEditBookmark) {
      onEditBookmark({
        ...editingBookmark,
        url: finalUrl,
        title: title.trim(),
        boardName: finalBoard,
        pageName
      });
    } else {
      onAddBookmark({
        url: finalUrl,
        title: title.trim(),
        boardName: finalBoard,
        pageName
      });
    }

    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-10">
          
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-2xl"
            onClick={onClose}
          />

          {/* Modal Panel */}
          <motion.div
            initial={scaleIn.initial}
            animate={scaleIn.animate}
            exit={scaleIn.exit}
            transition={{ duration: 0.2, ease: easeVesper }}
            className="relative z-10 w-full max-w-2xl rounded-3xl bg-[#0c120e]/90 backdrop-blur-3xl border border-white/15 shadow-[0_24px_80px_-16px_rgb(0_0_0_/_0.6)] p-8 sm:p-10"
            role="dialog"
            aria-modal="true"
          >
            
            {/* Header Section */}
            <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-md shrink-0 flex items-center justify-center">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h2 className="text-xl font-semibold text-white tracking-tight leading-snug">
                    {editingBookmark ? 'Edit Link' : 'Add New Link'}
                  </h2>
                  <p className="text-sm text-neutral-400">Organize links into your visual LumiList boards</p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-white/10 text-neutral-400 hover:text-white transition-colors border-0 bg-transparent cursor-pointer shrink-0 ml-4"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              
              {/* URL Field */}
              <div>
                <label className="ui-label">
                  <Link2 className="w-4 h-4 text-emerald-400" /> Web Address (URL) *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="https://example.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    required
                    className="ui-input pr-12 focus:border-accent-500/50 focus:bg-white/[0.05] focus-visible:ring-2 focus-visible:ring-accent-500/20 transition-colors"
                    autoFocus
                  />
                  {previewFavicon && (
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                      <img
                        src={previewFavicon}
                        alt="Favicon preview"
                        className="w-5 h-5 object-contain rounded"
                        onError={(e) => (e.target.style.display = 'none')}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Title Field */}
              <div>
                <label className="ui-label">
                  <Type className="w-4 h-4 text-emerald-400" /> Link Title / Label
                </label>
                <input
                  type="text"
                  placeholder="e.g. My Favorite Tool"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="ui-input focus:border-accent-500/50 focus:bg-white/[0.05] focus-visible:ring-2 focus-visible:ring-accent-500/20 transition-colors"
                />
              </div>

              {/* Page & Board Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                
                {/* Page */}
                <div>
                  <label className="ui-label">
                    <BookOpen className="w-4 h-4 text-sky-400" /> Target Page
                  </label>
                  <select
                    value={pageName}
                    onChange={(e) => setPageName(e.target.value)}
                    className="ui-select focus:border-accent-500/50 focus-visible:ring-2 focus-visible:ring-accent-500/20 transition-colors"
                  >
                    {availablePages.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                {/* Board */}
                <div>
                  <label className="ui-label">
                    <Layout className="w-4 h-4 text-purple-400" /> Target Board
                  </label>
                  <select
                    value={boardName}
                    onChange={(e) => {
                      setBoardName(e.target.value);
                      if (e.target.value !== '__NEW__') setCustomBoard('');
                    }}
                    className="ui-select focus:border-accent-500/50 focus-visible:ring-2 focus-visible:ring-accent-500/20 transition-colors"
                  >
                    {availableBoards.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                    <option value="__NEW__">+ Create New Board...</option>
                  </select>
                </div>

              </div>

              {/* Custom Board Field if __NEW__ selected */}
              {boardName === '__NEW__' && (
                <div>
                  <label className="ui-label text-emerald-400">
                    New Board Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. DESIGN RESOURCES"
                    value={customBoard}
                    onChange={(e) => setCustomBoard(e.target.value)}
                    required
                    className="ui-input border-emerald-500/50 focus:border-accent-500 focus-visible:ring-2 focus-visible:ring-accent-500/20"
                  />
                </div>
              )}

              {/* Floating Action Footer Bar */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
                <p className="text-xs text-neutral-500">
                  Press <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-neutral-400 font-mono">⌘ Enter</kbd> to save
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="action-btn h-10 px-5 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="action-btn action-btn-primary h-10 px-6 font-semibold"
                  >
                    {editingBookmark ? 'Save Changes' : 'Add Link'}
                  </button>
                </div>
              </div>

            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
