import React, { useState } from 'react';
import { X, Layout, Palette } from 'lucide-react';
import { useEscapeClose } from '../utils/useEscapeClose';
import { BOARD_ACCENTS } from '../constants/boardAccents';

export default function AddBoardModal({ isOpen, onClose, onAddBoard }) {
  const [boardName, setBoardName] = useState('');
  const [columnIndex, setColumnIndex] = useState(0);
  const [accentColor, setAccentColor] = useState('violet');

  useEscapeClose(isOpen, onClose);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!boardName.trim()) return;

    onAddBoard({
      name: boardName.trim().toUpperCase(),
      columnIndex: Number(columnIndex),
      accentColor
    });

    setBoardName('');
    setAccentColor('violet');
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content w-full max-w-lg p-8 sm:p-10 relative animate-modal">
        
        <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-7">
          <div className="flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-[var(--violet-dim)] text-[var(--violet-soft)] border border-[var(--violet)]/30 shadow-lg">
              <Layout className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white tracking-tight">Create New Board</h2>
              <p className="text-xs text-gray-400 mt-1">Add a column board to group your links</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition-colors border-0 bg-transparent cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label className="block text-xs font-extrabold text-gray-300 uppercase tracking-wider mb-2.5">
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
            <label className="block text-xs font-extrabold text-gray-300 uppercase tracking-wider mb-2.5">
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

          {/* Accent Color Picker */}
          <div>
            <label className="block text-xs font-extrabold text-gray-300 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Palette className="w-4 h-4 text-[var(--lumen-soft)]" /> Board Color Theme
            </label>
            <div className="grid grid-cols-6 gap-3">
              {BOARD_ACCENTS.map((acc) => (
                <button
                  key={acc.id}
                  type="button"
                  onClick={() => setAccentColor(acc.id)}
                  className={`h-11 rounded-2xl border flex items-center justify-center transition-all cursor-pointer ${
                    accentColor === acc.id
                      ? 'border-white scale-110 shadow-xl ring-2 ring-white/30'
                      : 'border-transparent opacity-70 hover:opacity-100 hover:scale-105'
                  }`}
                  style={{ backgroundColor: acc.hex }}
                  title={acc.name}
                >
                  {accentColor === acc.id && (
                    <div className="w-3 h-3 rounded-full bg-white shadow-md" />
                  )}
                </button>
              ))}
            </div>
          </div>

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
              Create Board
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
