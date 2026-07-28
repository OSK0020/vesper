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
    <div className="modal-backdrop">
      <div className="glass-panel w-full max-w-md p-6 relative animate-fade-in shadow-2xl border-white/15">
        
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Create New Page</h2>
              <p className="text-xs text-gray-400">Add a new tab workspace (e.g. WORK, PERSONAL)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors border-0 bg-transparent cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Page Name *
            </label>
            <input
              type="text"
              placeholder="e.g. WORK"
              value={pageName}
              onChange={(e) => setPageName(e.target.value)}
              required
              className="glass-input"
              autoFocus
            />
          </div>

          <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="glass-button text-xs py-2 px-4"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="glass-button glass-button-primary text-xs py-2 px-6"
            >
              Create Page
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
