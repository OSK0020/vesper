import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Link2, Type, Layout, BookOpen } from 'lucide-react';
import { useEscapeClose } from '../utils/useEscapeClose';
import { getFaviconUrl } from '../utils/favicon';
import { scaleIn, easeVesper } from '../utils/motion';

import { AddBookmarkModalProps } from '../types';

export default function AddBookmarkModal({
  isOpen,
  onClose,
  onSave,
  editingBookmark,
  availableBoards = [],
  availablePages = [],
  currentPage = 'MAIN',
  defaultBoard = ''
}: AddBookmarkModalProps) {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [boardName, setBoardName] = useState(defaultBoard || availableBoards[0] || 'GENERAL');
  const [pageName, setPageName] = useState(currentPage);
  const [customBoard, setCustomBoard] = useState('');
  const [previewFavicon, setPreviewFavicon] = useState('');

  useEscapeClose(isOpen, onClose);

  useEffect(() => {
    if (editingBookmark) {
      setUrl(editingBookmark.url || '');
      setTitle(editingBookmark.title || '');
      setBoardName(editingBookmark.boardName || availableBoards[0] || 'GENERAL');
      setPageName(editingBookmark.pageName || currentPage);
    } else {
      setUrl('');
      setTitle('');
      setBoardName(defaultBoard || availableBoards[0] || 'GENERAL');
      setPageName(currentPage);
      setCustomBoard('');
    }
  }, [editingBookmark, isOpen, defaultBoard, currentPage, availableBoards]);

  useEffect(() => {
    if (url.trim() && (url.startsWith('http://') || url.startsWith('https://'))) {
      setPreviewFavicon(getFaviconUrl(url) || '');
    } else {
      setPreviewFavicon('');
    }
  }, [url]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    let finalUrl = url.trim();
    if (!/^https?:\/\//i.test(finalUrl)) finalUrl = 'https://' + finalUrl;

    const finalBoard = boardName === '__NEW__' ? customBoard.trim().toUpperCase() : boardName;
    if (!finalBoard) return;

    const payload = editingBookmark
      ? { ...editingBookmark, url: finalUrl, title: title.trim(), boardName: finalBoard, pageName }
      : { id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(), url: finalUrl, title: title.trim(), boardName: finalBoard, pageName };

    if (onSave) onSave(payload);
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
            className="relative z-10 w-full max-w-2xl rounded-2xl overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #0f1a12 0%, #0a0f0c 100%)',
              border: '1px solid rgba(255,255,255,0.09)',
              boxShadow: '0 0 0 1px rgba(255,255,255,0.04), 0 40px 100px -20px rgba(0,0,0,0.9), 0 0 60px -20px rgba(52,211,153,0.18)'
            }}
            role="dialog"
            aria-modal="true"
          >
            {/* Top accent line — emerald */}
            <div className="h-[2px] w-full" style={{ background: 'linear-gradient(90deg, transparent 0%, #34d399 50%, transparent 100%)' }} />

            {/* Header */}
            <div className="flex items-center justify-between px-10 pt-8 pb-7">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.25)', boxShadow: '0 0 20px rgba(52,211,153,0.1)' }}>
                  <Link2 className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-white tracking-tight">
                    {editingBookmark ? 'Edit Link' : 'Add New Link'}
                  </h2>
                  <p className="text-sm text-zinc-500 mt-1">
                    {editingBookmark ? 'Update the details for this bookmark' : 'Save a link to your visual workspace'}
                  </p>
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
              <div className="px-10 py-8 flex flex-col gap-6">

                {/* URL Field */}
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-bold text-zinc-400 tracking-[0.12em] uppercase flex items-center gap-1.5">
                    <Link2 className="w-3 h-3 text-emerald-500" /> Web Address
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="https://example.com"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      required
                      autoFocus
                      className="w-full h-13 px-5 pr-12 rounded-xl text-base font-medium text-white placeholder-zinc-600 outline-none bg-white/[0.04] border border-white/[0.09] focus:bg-white/[0.06] focus:border-emerald-400/50 focus:ring-4 focus:ring-emerald-400/15 transition-all duration-200"
                    />
                    {previewFavicon && (
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                        <img src={previewFavicon} alt="" className="w-5 h-5 object-contain rounded" onError={(e) => (e.currentTarget.style.display = 'none')} />
                      </div>
                    )}
                  </div>
                </div>

                {/* Title Field */}
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-bold text-zinc-400 tracking-[0.12em] uppercase flex items-center gap-1.5">
                    <Type className="w-3 h-3" /> Label <span className="text-zinc-600 normal-case tracking-normal font-normal ml-1">optional</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. My Favorite Tool"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full h-13 px-5 rounded-xl text-base font-medium text-white placeholder-zinc-600 outline-none bg-white/[0.04] border border-white/[0.09] focus:bg-white/[0.06] focus:border-emerald-400/50 focus:ring-4 focus:ring-emerald-400/15 transition-all duration-200"
                  />
                </div>

                {/* Page & Board — side by side */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] font-bold text-zinc-400 tracking-[0.12em] uppercase flex items-center gap-1.5">
                      <BookOpen className="w-3 h-3 text-sky-400" /> Page
                    </label>
                    <div className="relative">
                      <select
                        value={pageName}
                        onChange={(e) => setPageName(e.target.value)}
                        className="w-full h-12 px-4 pr-9 rounded-xl text-sm text-white outline-none appearance-none cursor-pointer bg-white/[0.04] border border-white/[0.09] focus:bg-white/[0.06] focus:border-emerald-400/50 focus:ring-4 focus:ring-emerald-400/15 transition-all duration-200"
                        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.3)' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}
                      >
                        {availablePages.map((p) => <option key={p} value={p} className="bg-[#0f1a12]">{p}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] font-bold text-zinc-400 tracking-[0.12em] uppercase flex items-center gap-1.5">
                      <Layout className="w-3 h-3 text-violet-400" /> Board
                    </label>
                    <div className="relative">
                      <select
                        value={boardName}
                        onChange={(e) => { setBoardName(e.target.value); if (e.target.value !== '__NEW__') setCustomBoard(''); }}
                        className="w-full h-12 px-4 pr-9 rounded-xl text-sm text-white outline-none appearance-none cursor-pointer bg-white/[0.04] border border-white/[0.09] focus:bg-white/[0.06] focus:border-emerald-400/50 focus:ring-4 focus:ring-emerald-400/15 transition-all duration-200"
                        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.3)' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}
                      >
                        {availableBoards.map((b) => <option key={b} value={b} className="bg-[#0f1a12]">{b}</option>)}
                        <option value="__NEW__" className="bg-[#0f1a12]">+ New Board</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Custom Board Name (if new) */}
                {boardName === '__NEW__' && (
                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] font-bold text-emerald-500 tracking-[0.12em] uppercase">New Board Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. DESIGN RESOURCES"
                      value={customBoard}
                      onChange={(e) => setCustomBoard(e.target.value)}
                      required
                      className="w-full h-12 px-4 rounded-xl text-sm font-medium text-white placeholder-zinc-600 outline-none bg-emerald-500/[0.06] border border-emerald-500/30 focus:border-emerald-400/60 focus:ring-4 focus:ring-emerald-400/15 transition-all duration-200"
                    />
                  </div>
                )}

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
                  to save
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
                    style={{ background: '#34d399', boxShadow: '0 4px 20px rgba(52,211,153,0.4)' }}
                  >
                    {editingBookmark ? 'Save Changes' : 'Add Link'}
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
