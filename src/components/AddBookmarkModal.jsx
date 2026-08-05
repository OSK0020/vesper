import React, { useState, useEffect } from 'react';
import { X, Link2, Type, BookOpen, Layout, Sparkles } from 'lucide-react';
import { getDomain, getFaviconUrl } from '../utils/favicon';
import { useEscapeClose } from '../utils/useEscapeClose';

export default function AddBookmarkModal({ 
  isOpen, 
  onClose, 
  onSave, 
  editingBookmark, 
  availablePages = [], 
  availableBoards = [], 
  defaultBoard,
  currentPage 
}) {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [pageName, setPageName] = useState(currentPage || 'HOME');
  const [boardName, setBoardName] = useState(defaultBoard || (availableBoards[0] || 'DAILY ROUTINE'));
  const [customBoard, setCustomBoard] = useState('');

  useEffect(() => {
    if (editingBookmark) {
      setTitle(editingBookmark.title || '');
      setUrl(editingBookmark.url || '');
      setPageName(editingBookmark.pageName || currentPage || 'HOME');
      setBoardName(editingBookmark.boardName || defaultBoard || 'DAILY ROUTINE');
      setCustomBoard('');
    } else {
      setTitle('');
      setUrl('');
      setPageName(currentPage || 'HOME');
      setBoardName(defaultBoard || (availableBoards[0] || 'DAILY ROUTINE'));
      setCustomBoard('');
    }
  }, [editingBookmark, isOpen, defaultBoard, currentPage, availableBoards]);

  useEscapeClose(isOpen, onClose);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!url.trim()) return;

    let finalUrl = url.trim();
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      finalUrl = `https://${finalUrl}`;
    }

    const finalBoard = customBoard.trim() ? customBoard.trim().toUpperCase() : boardName;

    onSave({
      id: editingBookmark ? editingBookmark.id : `bm-${Date.now()}`,
      title: title.trim() || getDomain(finalUrl) || 'New Link',
      url: finalUrl,
      pageName: pageName.toUpperCase(),
      boardName: finalBoard.toUpperCase(),
      status: 'active',
      createdAt: editingBookmark ? editingBookmark.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    onClose();
  };

  const previewFavicon = url ? getFaviconUrl(url) : null;

  return (
    <div className="modal-overlay">
      <div className="modal-content w-full max-w-2xl p-6 sm:p-8 relative animate-modal">
        
        {/* Header Section */}
        <div className="flex items-center justify-between pb-5 border-b border-white/10 mb-6">
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
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          
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
                className="ui-input pr-12"
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
              className="ui-input"
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
                className="ui-select"
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
                className="ui-select"
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
                className="ui-input border-emerald-500/50"
              />
            </div>
          )}

          {/* Dedicated Footer Action Bar */}
          <div className="flex items-center justify-end gap-3 mt-8 pt-5 border-t border-white/10">
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

        </form>
      </div>
    </div>
  );
}

