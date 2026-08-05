import React, { useState } from 'react';
import { X, BookOpen } from 'lucide-react';

export default function AddPageModal({ isOpen, onClose, onAddPage }) {
  const [pageName, setPageName] = useState('');

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
      <div className="modal-content w-full max-w-xl p-8 sm:p-10 relative animate-modal">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-sky-500/15 text-sky-400 border border-sky-500/30 shrink-0">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white tracking-tight leading-snug">Create New Page</h2>
              <p className="text-sm text-neutral-400 mt-1">Add a new tab workspace (e.g. WORK, PERSONAL)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 rounded-xl hover:bg-white/10 text-neutral-400 hover:text-white transition-colors border-0 bg-transparent cursor-pointer shrink-0 ml-4"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
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

          {/* Footer */}
          <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="action-btn h-10 px-6 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="action-btn action-btn-primary h-10 px-8 font-semibold"
            >
              Create Page
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
