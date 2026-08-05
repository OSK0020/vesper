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
      <div className="modal-content w-full max-w-xl p-8 sm:p-10 relative animate-modal">
        
        {/* Header Section */}
        <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-md shrink-0 flex items-center justify-center">
              <Layout className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-semibold text-white tracking-tight leading-snug">Create New Board</h2>
              <p className="text-sm text-neutral-400">Add a column board to group your links</p>
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
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label className="ui-label">
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
            <label className="ui-label">
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

          {/* Accent Color Picker Card */}
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col gap-3">
            <label className="ui-label flex items-center gap-2 mb-0">
              <Palette className="w-4 h-4 text-emerald-400" /> Board Color Theme
            </label>
            <div className="grid grid-cols-6 gap-3 pt-1">
              {BOARD_ACCENTS.map((acc) => (
                <button
                  key={acc.id}
                  type="button"
                  onClick={() => setAccentColor(acc.id)}
                  className={`h-10 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                    accentColor === acc.id
                      ? 'border-white scale-110 shadow-lg ring-2 ring-white/40'
                      : 'border-transparent opacity-75 hover:opacity-100 hover:scale-105'
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

          {/* Dedicated Footer Action Bar */}
          <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-white/10">
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
              Create Board
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}


