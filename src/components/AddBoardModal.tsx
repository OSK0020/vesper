import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutGrid, X, Check } from 'lucide-react';
import { useEscapeClose } from '../utils/useEscapeClose';
import { scaleIn, easeVesper } from '../utils/motion';

const ACCENT_COLORS = [
  { id: 'violet', label: 'Violet', hex: '#8b5cf6', ring: 'ring-violet-500' },
  { id: 'lumen', label: 'Amber', hex: '#f59e0b', ring: 'ring-amber-500' },
  { id: 'emerald', label: 'Emerald', hex: '#10b981', ring: 'ring-emerald-500' },
  { id: 'rose', label: 'Rose', hex: '#f43f5e', ring: 'ring-rose-500' },
  { id: 'cyan', label: 'Cyan', hex: '#06b6d4', ring: 'ring-cyan-500' },
  { id: 'sapphire', label: 'Blue', hex: '#3b82f6', ring: 'ring-blue-500' },
];

import { AddBoardModalProps } from '../types';

export default function AddBoardModal({ isOpen, onClose, onAddBoard }: AddBoardModalProps) {
  const [title, setTitle] = useState('');
  const [column, setColumn] = useState<string | number>(0);
  const [selectedColor, setSelectedColor] = useState('violet');

  useEscapeClose(isOpen, onClose);

  useEffect(() => {
    if (!isOpen) {
      setTitle('');
      setSelectedColor('violet');
      setColumn(0);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAddBoard({
      name: title.trim().toUpperCase(),
      columnIndex: Number(column),
      accentColor: selectedColor,
    });
    onClose();
  };

  const selectedAccent = ACCENT_COLORS.find((c) => c.id === selectedColor);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8 overflow-y-auto">

          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-2xl"
            onClick={onClose}
          />

          {/* Modal Panel */}
          <motion.div
            initial={scaleIn.initial}
            animate={scaleIn.animate}
            exit={scaleIn.exit}
            transition={{ duration: 0.25, ease: easeVesper }}
            className="relative z-10 w-full max-w-xl rounded-2xl overflow-hidden my-auto"
            style={{
              background: 'linear-gradient(135deg, #100d1a 0%, #0a0812 100%)',
              border: '1px solid rgba(255,255,255,0.12)',
              boxShadow: '0 0 0 1px rgba(255,255,255,0.05), 0 40px 100px -20px rgba(0,0,0,0.9), 0 0 60px -20px rgba(139, 92, 246, 0.25)'
            }}
            role="dialog"
            aria-modal="true"
          >
            {/* Top Accent Line */}
            <div className="h-[2px] w-full" style={{ background: 'linear-gradient(90deg, transparent 0%, #8b5cf6 50%, transparent 100%)' }} />

            {/* Header */}
            <div className="flex items-center justify-between px-8 pt-7 pb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.3)', boxShadow: '0 0 20px rgba(139,92,246,0.2)' }}>
                  <LayoutGrid className="w-6 h-6 text-violet-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white tracking-tight leading-snug">Create New Board</h2>
                  <p className="text-sm text-zinc-400 mt-0.5 leading-normal">Organize your links into a focused collection</p>
                </div>
              </div>
              <button
                onClick={onClose}
                aria-label="Close dialog"
                className="w-9 h-9 rounded-xl flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-all border-0 bg-transparent cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Divider */}
            <div className="h-px mx-8 bg-white/[0.08]" />

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div className="px-8 py-7 flex flex-col gap-6">

                {/* Board Title Input */}
                <div className="flex flex-col gap-2.5">
                  <label className="text-xs font-bold text-zinc-300 tracking-[0.1em] uppercase flex items-center gap-1.5">
                    Board Title <span className="text-violet-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    autoFocus
                    placeholder="e.g. DESIGN RESOURCES, WORK, DEV TOOLS"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full h-13 px-5 rounded-xl text-base font-medium text-white placeholder-zinc-500 outline-none bg-white/[0.05] border border-white/[0.12] focus:bg-white/[0.08] focus:border-violet-500/60 focus:ring-4 focus:ring-violet-500/15 transition-all duration-200"
                  />
                </div>

                {/* Column Position Select */}
                <div className="flex flex-col gap-2.5">
                  <label className="text-xs font-bold text-zinc-300 tracking-[0.1em] uppercase">
                    Column Position
                  </label>
                  <div className="relative">
                    <select
                      value={column}
                      onChange={(e) => setColumn(e.target.value)}
                      className="w-full h-13 px-5 pr-10 rounded-xl text-sm font-medium text-white outline-none appearance-none cursor-pointer bg-white/[0.05] border border-white/[0.12] focus:bg-white/[0.08] focus:border-violet-500/60 focus:ring-4 focus:ring-violet-500/15 transition-all duration-200"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.5)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 16px center'
                      }}
                    >
                      <option value={0} className="bg-[#100d1a] text-white">Column 1 — Left</option>
                      <option value={1} className="bg-[#100d1a] text-white">Column 2 — Center Left</option>
                      <option value={2} className="bg-[#100d1a] text-white">Column 3 — Center Right</option>
                      <option value={3} className="bg-[#100d1a] text-white">Column 4 — Right</option>
                    </select>
                  </div>
                </div>

                {/* Accent Color Picker */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-zinc-300 tracking-[0.1em] uppercase">
                      Board Color Theme
                    </label>
                    <span className="text-xs font-semibold text-violet-400 capitalize">
                      {selectedAccent?.label}
                    </span>
                  </div>

                  <div className="grid grid-cols-6 gap-3 p-3.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    {ACCENT_COLORS.map((color) => {
                      const isSelected = selectedColor === color.id;
                      return (
                        <button
                          key={color.id}
                          type="button"
                          onClick={() => setSelectedColor(color.id)}
                          style={{ backgroundColor: color.hex }}
                          title={color.label}
                          className={`h-11 rounded-xl transition-all border-0 cursor-pointer flex items-center justify-center ${
                            isSelected
                              ? 'ring-2 ring-white ring-offset-2 ring-offset-[#100d1a] scale-105 shadow-lg'
                              : 'opacity-70 hover:opacity-100 hover:scale-105'
                          }`}
                        >
                          {isSelected && <Check className="w-5 h-5 text-white drop-shadow-md" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Divider */}
              <div className="h-px mx-8 bg-white/[0.08]" />

              {/* Footer */}
              <div className="px-8 py-6 flex items-center justify-between">
                <span className="text-xs text-zinc-400 font-mono">
                  Press{' '}
                  <kbd className="inline-flex items-center px-2 py-0.5 rounded-md text-zinc-300 font-sans text-xs" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}>
                    ↵ Enter
                  </kbd>{' '}
                  to create
                </span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="h-11 px-6 rounded-xl text-sm font-semibold text-zinc-300 hover:text-white hover:bg-white/8 transition-all border border-transparent cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="h-11 px-7 rounded-xl text-sm font-bold text-white transition-all cursor-pointer hover:brightness-110 active:scale-95 flex items-center justify-center whitespace-nowrap"
                    style={{ background: '#8b5cf6', boxShadow: '0 4px 20px rgba(139,92,246,0.45)' }}
                  >
                    Create Board
                  </button>
                </div>
              </div>

            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

