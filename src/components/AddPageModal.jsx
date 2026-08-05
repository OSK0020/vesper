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
      <div className="modal-content w-full max-w-xl p-6 sm:p-8 relative animate-modal">
        
        {/* Header Section */}
        <div className="flex items-center justify-between pb-5 border-b border-white/10 mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-sky-500/10 text-sky-400 border border-sky-500/20 shadow-md shrink-0 flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-semibold text-white tracking-tight leading-snug">Create New Page</h2>
              <p className="text-sm text-neutral-400">Add a new tab workspace (e.g. WORK, PERSONAL)</p>
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
              Create Page
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

