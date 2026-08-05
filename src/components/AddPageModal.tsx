import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen } from 'lucide-react';
import { useEscapeClose } from '../utils/useEscapeClose';
import { scaleIn, easeVesper } from '../utils/motion';

import { AddPageModalProps } from '../types';

export default function AddPageModal({ isOpen, onClose, onAddPage }: AddPageModalProps) {
  const [pageName, setPageName] = useState('');

  useEscapeClose(isOpen, onClose);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pageName.trim()) return;
    onAddPage(pageName.trim().toUpperCase());
    setPageName('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">

          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-black/75 backdrop-blur-2xl"
            onClick={onClose}
          />

          {/* Modal Panel */}
          <motion.div
            initial={scaleIn.initial}
            animate={scaleIn.animate}
            exit={scaleIn.exit}
            transition={{ duration: 0.25, ease: easeVesper }}
            className="relative z-10 w-full max-w-xl rounded-2xl overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #0f1a12 0%, #0a0f0c 100%)',
              border: '1px solid rgba(255,255,255,0.09)',
              boxShadow: '0 0 0 1px rgba(255,255,255,0.04), 0 40px 100px -20px rgba(0,0,0,0.9), 0 0 60px -20px rgba(56, 189, 248, 0.2)'
            }}
            role="dialog"
            aria-modal="true"
          >
            {/* Top accent line — sky blue */}
            <div className="h-[2px] w-full" style={{ background: 'linear-gradient(90deg, transparent 0%, #38bdf8 50%, transparent 100%)' }} />

            {/* Header */}
            <div className="flex items-center justify-between px-10 pt-8 pb-7">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.25)', boxShadow: '0 0 20px rgba(56,189,248,0.15)' }}>
                  <BookOpen className="w-6 h-6 text-sky-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-white tracking-tight">Create New Page</h2>
                  <p className="text-sm text-zinc-500 mt-1">A new workspace tab for your boards</p>
                </div>
              </div>
              <button
                onClick={onClose}
                aria-label="Close dialog"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/8 transition-all border-0 bg-transparent cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Divider */}
            <div className="h-px mx-10 bg-white/[0.06]" />

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div className="px-10 py-8 flex flex-col gap-3">
                <label className="text-[11px] font-bold text-zinc-400 tracking-[0.12em] uppercase mb-1.5">
                  Page Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. WORK, PERSONAL, RESEARCH"
                  value={pageName}
                  onChange={(e) => setPageName(e.target.value)}
                  required
                  autoFocus
                  className="w-full h-13 px-5 rounded-xl text-base font-medium text-white placeholder-zinc-600 outline-none bg-white/[0.04] border border-white/[0.09] focus:bg-white/[0.06] focus:border-sky-400/50 focus:ring-4 focus:ring-sky-400/15 transition-all duration-200"
                />
                <p className="text-xs text-zinc-600 mt-1.5">Will be converted to uppercase automatically</p>
              </div>

              {/* Divider */}
              <div className="h-px mx-10 bg-white/[0.06]" />

              {/* Footer */}
              <div className="px-10 py-6 flex items-center justify-between">
                <span className="text-xs text-zinc-600 font-mono">
                  Press{' '}
                  <kbd className="inline-flex items-center px-1.5 py-0.5 rounded-md text-zinc-400 font-sans text-xs" style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    ↵
                  </kbd>{' '}
                  to create
                </span>
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={onClose}
                    className="h-11 px-6 rounded-xl text-sm font-medium text-zinc-400 hover:text-white transition-all cursor-pointer"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="h-11 px-7 rounded-xl text-sm font-bold text-black transition-all cursor-pointer hover:brightness-110 active:scale-95"
                    style={{ background: '#38bdf8', boxShadow: '0 4px 20px rgba(56,189,248,0.4)' }}
                  >
                    Create Page
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
