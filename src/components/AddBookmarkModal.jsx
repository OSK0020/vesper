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
      <div className="modal-content w-full max-w-lg p-6 relative animate-modal">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[var(--violet-dim)] text-[var(--violet-soft)] border border-[var(--violet)]/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                {editingBookmark ? 'Edit Link' : 'Add New Link'}
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">Organize links into your visual LumiList boards</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors border-0 bg-transparent cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
          
          {/* URL Field */}
          <div>
            <label className="block text-xs font-bold text-gray-300 mb-1.5 flex items-center gap-1.5">
              <Link2 className="w-3.5 h-3.5 text-[var(--lumen-soft)]" /> Web Address (URL) *
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                className="ui-input pr-10"
                autoFocus
              />
              {previewFavicon && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <img
                    src={previewFavicon}
                    alt="Favicon preview"
                    className="w-4 h-4 object-contain rounded"
                    onError={(e) => (e.target.style.display = 'none')}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Title Field */}
          <div>
            <label className="block text-xs font-bold text-gray-300 mb-1.5 flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5 text-[var(--lumen-soft)]" /> Link Title / Label
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Page */}
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1.5 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-[var(--lumen-soft)]" /> Target Page
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
              <label className="block text-xs font-bold text-gray-300 mb-1.5 flex items-center gap-1.5">
                <Layout className="w-3.5 h-3.5 text-[var(--violet-soft)]" /> Target Board
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
              <label className="block text-xs font-bold text-[var(--lumen-soft)] mb-1.5">
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

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="action-btn text-xs py-2 px-4"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="action-btn action-btn-primary text-xs py-2 px-6"
            >
              {editingBookmark ? 'Save Changes' : 'Add Link'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
