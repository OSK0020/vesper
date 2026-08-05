import React, { useState } from 'react';
import { LayoutGrid, X, CornerDownLeft } from 'lucide-react';

const ACCENT_COLORS = [
  { id: 'violet', label: 'Violet', hex: '#8b5cf6', ring: 'ring-violet-500' },
  { id: 'lumen', label: 'Amber', hex: '#f59e0b', ring: 'ring-amber-500' },
  { id: 'emerald', label: 'Emerald', hex: '#10b981', ring: 'ring-emerald-500' },
  { id: 'rose', label: 'Rose', hex: '#f43f5e', ring: 'ring-rose-500' },
  { id: 'cyan', label: 'Cyan', hex: '#06b6d4', ring: 'ring-cyan-500' },
  { id: 'sapphire', label: 'Blue', hex: '#3b82f6', ring: 'ring-blue-500' },
];

export default function AddBoardModal({ isOpen, onClose, onAddBoard }) {
  const [title, setTitle] = useState('');
  const [column, setColumn] = useState(0);
  const [selectedColor, setSelectedColor] = useState('violet');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAddBoard({
      name: title.trim().toUpperCase(),
      columnIndex: Number(column),
      accentColor: selectedColor,
    });
    setTitle('');
    setSelectedColor('violet');
    onClose();
  };

  const selectedAccent = ACCENT_COLORS.find((c) => c.id === selectedColor);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 backdrop-blur-xl bg-black/70"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-[#0c120e]/95 border border-white/12 rounded-3xl p-8 sm:p-10 shadow-[0_32px_90px_rgba(0,0,0,0.85)] space-y-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-violet-500/10 border border-violet-500/20 text-violet-400">
              <LayoutGrid className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Create New Board</h2>
              <p className="text-sm text-neutral-400 mt-1">Organize your links into a focused collection</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white hover:bg-white/10 rounded-xl transition-all border-0 bg-transparent cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Board Title Input */}
          <div className="space-y-2.5">
            <label className="text-[11px] font-mono tracking-wider text-neutral-400 uppercase">
              Board Title <span className="text-violet-400">*</span>
            </label>
            <input
              type="text"
              required
              autoFocus
              placeholder="e.g. DESIGN RESOURCES"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full h-13 px-5 bg-white/[0.04] border border-white/10 rounded-xl text-base text-white placeholder:text-neutral-600 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all font-mono"
            />
          </div>

          {/* Column Position Select */}
          <div className="space-y-2.5">
            <label className="text-[11px] font-mono tracking-wider text-neutral-400 uppercase">
              Column Position
            </label>
            <select
              value={column}
              onChange={(e) => setColumn(e.target.value)}
              className="w-full h-13 px-5 bg-white/[0.04] border border-white/10 rounded-xl text-base text-white focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all cursor-pointer"
            >
              <option value={0} className="bg-[#0c120e]">Column 1 — Left</option>
              <option value={1} className="bg-[#0c120e]">Column 2 — Center Left</option>
              <option value={2} className="bg-[#0c120e]">Column 3 — Center Right</option>
              <option value={3} className="bg-[#0c120e]">Column 4 — Right</option>
            </select>
          </div>

          {/* Accent Color Picker */}
          <div className="space-y-2.5">
            <label className="text-[11px] font-mono tracking-wider text-neutral-400 uppercase">
              Accent Color
            </label>
            <div className="flex items-center gap-4 p-4 bg-white/[0.02] border border-white/[0.08] rounded-xl">
              {ACCENT_COLORS.map((color) => (
                <button
                  key={color.id}
                  type="button"
                  onClick={() => setSelectedColor(color.id)}
                  style={{ backgroundColor: color.hex }}
                  title={color.label}
                  className={`w-9 h-9 rounded-full transition-all border-0 cursor-pointer flex items-center justify-center ${
                    selectedColor === color.id
                      ? `ring-2 ring-offset-2 ring-offset-[#0c120e] ${color.ring} scale-110`
                      : 'opacity-70 hover:opacity-100 hover:scale-105'
                  }`}
                />
              ))}
              <span className="ml-auto text-xs font-mono text-neutral-300 capitalize">
                {selectedAccent?.label}
              </span>
            </div>
          </div>

          {/* Footer Bar */}
          <div className="flex items-center justify-between pt-6 border-t border-white/10 mt-4">
            <div className="flex items-center gap-1.5 text-xs font-mono text-neutral-500">
              <span>Press</span>
              <kbd className="px-1.5 py-0.5 text-[10px] bg-white/10 border border-white/10 rounded text-neutral-300 flex items-center gap-0.5">
                <CornerDownLeft className="w-3 h-3" /> Enter
              </kbd>
              <span>to create</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 h-11 rounded-xl text-sm font-semibold text-neutral-400 hover:text-white hover:bg-white/5 border border-transparent transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-7 h-11 rounded-xl text-sm font-semibold text-white bg-violet-600 hover:bg-violet-500 shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_25px_rgba(139,92,246,0.5)] transition-all flex items-center justify-center whitespace-nowrap cursor-pointer"
              >
                Create Board
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
