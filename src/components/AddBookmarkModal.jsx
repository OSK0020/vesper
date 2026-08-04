import React, { useState, useEffect } from 'react';
import { X, Link2, Type, BookOpen, Layout, Sparkles } from 'lucide-react';
import { getDomain, getFaviconUrl } from '../utils/favicon';
import { useEscapeClose } from '../utils/useEscapeClose';

export default function AddBookmarkModal({ 
  isOpen, 
  onClose, 
  onSave, 
  editingBookmark, 
  availablePages, 
  availableBoards, 
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
      <div className="modal-content w-full max-w-xl p-8 sm:p-10 relative animate-modal">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-7">
          <div className="flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-[var(--violet-dim)] text-[var(--violet-soft)] border border-[var(--violet)]/30 shadow-lg">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white tracking-tight">
                {editingBookmark ? 'Edit Link' : 'Add New Link'}
              </h2>
              <p className="text-xs text-gray-400 mt-1">Organize links into your visual Vesper boards</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition-colors border-0 bg-transparent cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          
          {/* URL Field */}
          <div>
            <label className="block text-xs font-extrabold text-gray-300 uppercase tracking-wider mb-2.5 flex items-center gap-2">
              <Link2 className="w-4 h-4 text-[var(--lumen-soft)]" /> Web Address (URL) *
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
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
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
            <label className="block text-xs font-extrabold text-gray-300 uppercase tracking-wider mb-2.5 flex items-center gap-2">
              <Type className="w-4 h-4 text-[var(--lumen-soft)]" /> Link Title / Label
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
              <label className="block text-xs font-extrabold text-gray-300 uppercase tracking-wider mb-2.5 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[var(--lumen-soft)]" /> Target Page
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
              <label className="block text-xs font-extrabold text-gray-300 uppercase tracking-wider mb-2.5 flex items-center gap-2">
                <Layout className="w-4 h-4 text-[var(--violet-soft)]" /> Target Board
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
              <label className="block text-xs font-extrabold text-[var(--lumen-soft)] uppercase tracking-wider mb-2.5">
                New Board Name *
              </label>
              <input
                type="text"
                placeholder="e.g. DESIGN RESOURCES"
                value={customBoard}
                onChange={(e) => setCustomBoard(e.target.value)}
                required
                className="ui-input border-[var(--violet)]/50"
              />
            </div>
          )}

          {/* Action Buttons Footer */}
          <div className="flex items-center justify-end gap-4 mt-8 pt-6 pb-1 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="action-btn px-6"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="action-btn action-btn-primary px-8"
            >
              {editingBookmark ? 'Save Changes' : 'Add Link'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
