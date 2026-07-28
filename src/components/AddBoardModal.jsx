import React, { useState } from 'react';
import { X, Layout } from 'lucide-react';

export default function AddBoardModal({ isOpen, onClose, onAddBoard, availablePages, currentPage }) {
  const [boardName, setBoardName] = useState('');
  const [columnIndex, setColumnIndex] = useState(0);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!boardName.trim()) return;

    onAddBoard({
      name: boardName.trim().toUpperCase(),
      columnIndex: Number(columnIndex)
    });

    setBoardName('');
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content w-full max-w-md p-6 relative animate-modal">
        
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/15 text-purple-400 border border-purple-500/30">
              <Layout className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Create New Board</h2>
              <p className="text-xs text-gray-400 mt-0.5">Add a column board to group your links</p>
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
            <label className="block text-xs font-bold text-gray-300 mb-1.5">
              Board Title *
            </label>
            <input
              type="text"
              placeholder="e.g. WORK & PROJECTS"
              value={boardName}
              onChange={(e) => setBoardName(e.target.value)}
              required
              className="ui-input"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-300 mb-1.5">
              Column Position
            </label>
            <select
              value={columnIndex}
              onChange={(e) => setColumnIndex(e.target.value)}
              className="ui-select"
            >
              <option value={0}>Column 1 (Left)</option>
              <option value={1}>Column 2 (Center-Left)</option>
              <option value={2}>Column 3 (Center-Right)</option>
              <option value={3}>Column 4 (Right)</option>
            </select>
          </div>

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
              Create Board
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
