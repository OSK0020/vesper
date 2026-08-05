import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen } from 'lucide-react';
import { useEscapeClose } from '../utils/useEscapeClose';
import { scaleIn, easeVesper } from '../utils/motion';

export default function AddPageModal({ isOpen, onClose, onAddPage }) {
  const [pageName, setPageName] = useState('');

  useEscapeClose(isOpen, onClose);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!pageName.trim()) return;

    onAddPage(pageName.trim().toUpperCase());
    setPageName('');
    onClose();
  };

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
            className="fixed inset-0 bg-black/60 backdrop-blur-2xl"
            onClick={onClose}
          />

          {/* Modal Panel */}
          <motion.div
            initial={scaleIn.initial}
            animate={scaleIn.animate}
            exit={scaleIn.exit}
            transition={{ duration: 0.2, ease: easeVesper }}
            className="relative z-10 w-full max-w-lg rounded-3xl bg-[#0c120e]/90 backdrop-blur-3xl border border-white/15 shadow-[0_24px_80px_-16px_rgb(0_0_0_/_0.6)] p-8 sm:p-10"
            role="dialog"
            aria-modal="true"
          >
            
            {/* Header Section */}
            <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-6">
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
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
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
                  className="ui-input focus:border-accent-500/50 focus:bg-white/[0.05] focus-visible:ring-2 focus-visible:ring-accent-500/20 transition-colors"
                  autoFocus
                />
              </div>

              {/* Floating Action Footer Bar */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
                <p className="text-xs text-neutral-500">
                  Press <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-neutral-400 font-mono">↵ Enter</kbd> to create
                </p>
                <div className="flex items-center gap-2">
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
              </div>
            </form>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
