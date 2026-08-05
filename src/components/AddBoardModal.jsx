import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Layout, Palette, Check } from 'lucide-react';
import { useEscapeClose } from '../utils/useEscapeClose';
import { BOARD_ACCENTS } from '../constants/boardAccents';
import { scaleIn, easeVesper } from '../utils/motion';

export default function AddBoardModal({ isOpen, onClose, onAddBoard }) {
  const [boardName, setBoardName] = useState('');
  const [columnIndex, setColumnIndex] = useState(0);
  const [accentColor, setAccentColor] = useState('violet');

  useEscapeClose(isOpen, onClose);

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

  const selectedAccent = BOARD_ACCENTS.find((a) => a.id === accentColor);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-10">
          
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-2xl"
            onClick={onClose}
          />

          {/* Modal Panel */}
          <motion.div
            initial={scaleIn.initial}
            animate={scaleIn.animate}
            exit={scaleIn.exit}
            transition={{ duration: 0.22, ease: easeVesper }}
            className="relative z-10 w-full max-w-md rounded-3xl bg-[#0c120e]/95 backdrop-blur-3xl border border-white/12 shadow-[0_32px_80px_-12px_rgba(0,0,0,0.75)] overflow-hidden"
            role="dialog"
            aria-modal="true"
          >
            {/* Ambient accent glow at top */}
            <div
              className="absolute top-0 inset-x-0 h-px opacity-60"
              style={{ background: `linear-gradient(90deg, transparent, ${selectedAccent?.hex ?? '#863bff'}, transparent)` }}
            />
            <div
              className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-24 blur-[60px] pointer-events-none opacity-20"
              style={{ backgroundColor: selectedAccent?.hex ?? '#863bff' }}
            />

            <div className="p-7 sm:p-8">
              {/* Header */}
              <div className="flex items-start justify-between mb-7">
                <div className="flex items-center gap-3.5">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-lg"
                    style={{ backgroundColor: `${selectedAccent?.hex ?? '#863bff'}22`, border: `1px solid ${selectedAccent?.hex ?? '#863bff'}44` }}
                  >
                    <Layout className="w-5 h-5" style={{ color: selectedAccent?.hex ?? '#863bff' }} />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white tracking-tight leading-snug">Create New Board</h2>
                    <p className="text-xs text-zinc-500 mt-0.5">Add a column board to group your links</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-zinc-500 hover:text-white transition-all border-0 bg-transparent cursor-pointer shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                {/* Board Title */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-semibold text-zinc-400 tracking-widest uppercase">Board Title *</label>
                  <input
                    type="text"
                    placeholder="e.g. WORK & PROJECTS"
                    value={boardName}
                    onChange={(e) => setBoardName(e.target.value)}
                    required
                    autoFocus
                    className="w-full h-11 px-4 bg-white/[0.04] border border-white/10 rounded-xl text-sm text-white placeholder-zinc-600 font-medium outline-none transition-all focus:border-white/25 focus:bg-white/[0.06] focus:shadow-[0_0_0_3px_rgba(255,255,255,0.05)]"
                  />
                </div>

                {/* Column Position */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-semibold text-zinc-400 tracking-widest uppercase">Column Position</label>
                  <select
                    value={columnIndex}
                    onChange={(e) => setColumnIndex(e.target.value)}
                    className="w-full h-11 px-4 bg-white/[0.04] border border-white/10 rounded-xl text-sm text-white outline-none transition-all appearance-none cursor-pointer focus:border-white/25 focus:bg-white/[0.06]"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.3)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center' }}
                  >
                    <option value={0} className="bg-zinc-900">Column 1 (Left)</option>
                    <option value={1} className="bg-zinc-900">Column 2 (Center-Left)</option>
                    <option value={2} className="bg-zinc-900">Column 3 (Center-Right)</option>
                    <option value={3} className="bg-zinc-900">Column 4 (Right)</option>
                  </select>
                </div>

                {/* Accent Color Picker */}
                <div className="flex flex-col gap-2.5">
                  <label className="text-[11px] font-semibold text-zinc-400 tracking-widest uppercase flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5" /> Board Color Theme
                  </label>
                  <div className="flex items-center gap-3 flex-wrap">
                    {BOARD_ACCENTS.map((acc) => (
                      <button
                        key={acc.id}
                        type="button"
                        onClick={() => setAccentColor(acc.id)}
                        title={acc.name}
                        className="relative w-7 h-7 rounded-full transition-all duration-200 cursor-pointer flex items-center justify-center"
                        style={{
                          backgroundColor: acc.hex,
                          boxShadow: accentColor === acc.id ? `0 0 0 2px #0c120e, 0 0 0 4px ${acc.hex}` : 'none',
                          transform: accentColor === acc.id ? 'scale(1.15)' : 'scale(1)'
                        }}
                      >
                        {accentColor === acc.id && (
                          <Check className="w-3.5 h-3.5 text-white drop-shadow" strokeWidth={3} />
                        )}
                      </button>
                    ))}
                    <span className="text-xs text-zinc-500 ml-1 font-medium">{selectedAccent?.name}</span>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-5 mt-1 border-t border-white/[0.07]">
                  <p className="text-[11px] text-zinc-600 font-mono">
                    Press{' '}
                    <kbd className="px-1.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-zinc-400">↵</kbd>{' '}
                    to create
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="h-9 px-4 rounded-xl bg-white/[0.05] border border-white/10 text-zinc-300 text-sm font-medium hover:bg-white/10 hover:text-white transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="h-9 px-5 rounded-xl text-sm font-semibold text-zinc-900 transition-all cursor-pointer shadow-lg hover:brightness-110 active:scale-95"
                      style={{ backgroundColor: selectedAccent?.hex ?? '#863bff' }}
                    >
                      Create Board
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
