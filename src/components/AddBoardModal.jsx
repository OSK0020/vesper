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
      <div className="modal-content w-full max-w-md p-6 relative animate-modal">
        
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[var(--violet-dim)] text-[var(--violet-soft)] border border-[var(--violet)]/30">
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

          {/* Accent Color Picker */}
          <div>
            <label className="block text-xs font-bold text-gray-300 mb-2 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-[var(--lumen-soft)]" /> Board Color Theme
            </label>
            <div className="grid grid-cols-6 gap-2">
              {BOARD_ACCENTS.map((acc) => (
                <button
                  key={acc.id}
                  type="button"
                  onClick={() => setAccentColor(acc.id)}
                  className={`h-9 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                    accentColor === acc.id
                      ? 'border-white scale-110 shadow-lg ring-2 ring-white/20'
                      : 'border-transparent opacity-70 hover:opacity-100 hover:scale-105'
                  }`}
                  style={{ backgroundColor: acc.hex }}
                  title={acc.name}
                >
                  {accentColor === acc.id && (
                    <div className="w-2 h-2 rounded-full bg-white shadow-sm" />
                  )}
                </button>
              ))}
            </div>
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
