import React, { useState } from 'react';
import { X, BookOpen } from 'lucide-react';
import { useEscapeClose } from '../utils/useEscapeClose';

export default function AddPageModal({ isOpen, onClose, onAddPage }) {
  const [pageName, setPageName] = useState('');

  useEscapeClose(isOpen, onClose);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!pageName.trim()) return;

    onAddPage(pageName.trim().toUpperCase());
    setPageName('');
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content w-full max-w-md p-8 sm:p-9 relative animate-modal">
        
        <div className="flex items-center justify-between pb-5 border-b border-white/10 mb-6">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-[var(--lumen-dim)] text-[var(--lumen-soft)] border border-[var(--lumen)]/30 shadow-lg">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Create New Page</h2>
              <p className="text-xs text-gray-400 mt-1">Add a new tab workspace (e.g. WORK)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition-colors border-0 bg-transparent cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="ui-label">
              Page Name *
            </label>
            <input
              type="text"
              placeholder="e.g. WORK"
              value={pageName}
              onChange={(e) => setPageName(e.target.value)}
              required
              className="ui-input"
              autoFocus
            />
          </div>

          <div className="flex items-center justify-end gap-3.5 mt-6 pt-5 border-t border-white/10">
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
              Create Page
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
