import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Layout, FileText, Download, Eye, ExternalLink, Command, Share2, Sparkles } from 'lucide-react';
import { useEscapeClose } from '../utils/useEscapeClose';
import { scaleIn, easeVesper } from '../utils/motion';

export default function CommandPalette({
  isOpen,
  onClose,
  bookmarks = [],
  boards = [],
  pages = [],
  onSelectPage,
  onOpenAddModal,
  onOpenAddBoardModal,
  onOpenAddPageModal,
  onOpenImportExportModal,
  onToggleBlur,
  onOpenShareCardModal
}) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  useEscapeClose(isOpen, onClose);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const items = useMemo(() => {
    const q = query.trim().toLowerCase();

    const actionItems = [
      {
        id: 'cmd-add-link',
        label: 'Add New Link / Bookmark',
        category: 'Actions',
        icon: Plus,
        run: () => onOpenAddModal && onOpenAddModal()
      },
      {
        id: 'cmd-add-board',
        label: 'Create New Column Board',
        category: 'Actions',
        icon: Layout,
        run: () => onOpenAddBoardModal && onOpenAddBoardModal()
      },
      {
        id: 'cmd-add-page',
        label: 'Create New Page Tab',
        category: 'Actions',
        icon: FileText,
        run: () => onOpenAddPageModal && onOpenAddPageModal()
      },
      {
        id: 'cmd-share-card',
        label: 'Generate Social Share Card',
        category: 'Share',
        icon: Share2,
        run: () => onOpenShareCardModal && onOpenShareCardModal()
      },
      {
        id: 'cmd-toggle-blur',
        label: 'Toggle Privacy Blur Mode',
        category: 'Actions',
        icon: Eye,
        run: () => onToggleBlur && onToggleBlur()
      },
      {
        id: 'cmd-import-export',
        label: 'Backup & Restore Workspace',
        category: 'Data',
        icon: Download,
        run: () => onOpenImportExportModal && onOpenImportExportModal()
      }
    ];

    const result = [];

    actionItems.forEach((act) => {
      if (!q || act.label.toLowerCase().includes(q)) {
        result.push(act);
      }
    });

    pages.forEach((p) => {
      if (!q || p.toLowerCase().includes(q) || 'page'.includes(q)) {
        result.push({
          id: `page-${p}`,
          label: `Switch to ${p} Page`,
          category: 'Pages',
          icon: FileText,
          run: () => onSelectPage && onSelectPage(p)
        });
      }
    });

    boards.forEach((b) => {
      const bName = typeof b === 'string' ? b : b.name;
      if (!q || bName.toLowerCase().includes(q) || 'board'.includes(q)) {
        result.push({
          id: `board-${bName}`,
          label: `Board: ${bName}`,
          category: 'Boards',
          icon: Layout,
          run: () => {
            const el = document.querySelector(`[data-board="${bName}"]`);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }
        });
      }
    });

    if (q) {
      bookmarks.forEach((b) => {
        if (
          b.status !== 'deleted' &&
          ((b.title && b.title.toLowerCase().includes(q)) ||
            (b.url && b.url.toLowerCase().includes(q)) ||
            (b.boardName && b.boardName.toLowerCase().includes(q)))
        ) {
          result.push({
            id: `link-${b.id || b.url}`,
            label: b.title || b.url,
            subLabel: `${b.boardName || 'GENERAL'} · ${b.url}`,
            category: 'Bookmarks',
            icon: ExternalLink,
            run: () => window.open(b.url, '_blank')
          });
        }
      });
    }

    return result.slice(0, 20);
  }, [query, pages, boards, bookmarks, onOpenAddModal, onOpenAddBoardModal, onOpenAddPageModal, onOpenShareCardModal, onToggleBlur, onOpenImportExportModal, onSelectPage]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, items.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + items.length) % Math.max(1, items.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (items[selectedIndex]) {
        items[selectedIndex].run();
        onClose();
      }
    }
  };

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
            className="relative z-10 w-full max-w-3xl rounded-2xl overflow-hidden my-auto"
            style={{
              background: 'linear-gradient(135deg, #0e1411 0%, #080c09 100%)',
              border: '1px solid rgba(255,255,255,0.12)',
              boxShadow: '0 0 0 1px rgba(255,255,255,0.05), 0 40px 100px -20px rgba(0,0,0,0.95), 0 0 60px -20px rgba(16, 185, 129, 0.2)'
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Command Palette"
          >
            {/* Top Accent Line */}
            <div className="h-[2px] w-full" style={{ background: 'linear-gradient(90deg, transparent 0%, #10b981 50%, transparent 100%)' }} />

            {/* Header / Search Bar */}
            <div className="px-8 pt-7 pb-4">
              <div className="flex items-center gap-3 px-5 h-14 rounded-xl bg-white/[0.04] border border-white/12 focus-within:border-emerald-500/50 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all shadow-inner">
                <Search className="w-5 h-5 text-emerald-400 shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search boards, links, or type a command…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  aria-label="Command search input"
                  className="w-full bg-transparent text-white placeholder-zinc-500 font-medium text-base outline-none border-none"
                />
                <kbd className="hidden sm:inline-flex items-center gap-1 text-xs font-mono px-2 py-1 rounded-lg bg-white/10 text-zinc-300 border border-white/10 shrink-0">
                  <Command className="w-3 h-3" /> K
                </kbd>
              </div>
            </div>

            {/* Command Results List */}
            <div className="px-8 py-3 max-h-96 overflow-y-auto flex flex-col gap-2">
              {items.length === 0 ? (
                <div className="py-12 text-center text-sm text-zinc-400 font-mono">
                  No matching commands or links found for "{query}"
                </div>
              ) : (
                items.map((item, idx) => {
                  const Icon = item.icon;
                  const isSelected = idx === selectedIndex;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        item.run();
                        onClose();
                      }}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`w-full flex items-center justify-between px-5 py-3.5 rounded-xl text-left transition-all cursor-pointer border ${
                        isSelected
                          ? 'bg-emerald-500/20 text-white border-emerald-500/40 shadow-md transform translate-x-1'
                          : 'bg-white/[0.03] text-zinc-300 hover:bg-white/[0.06] border-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-4 min-w-0 pr-4">
                        <div
                          className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                            isSelected
                              ? 'bg-emerald-500 text-black shadow-sm'
                              : 'bg-white/5 text-zinc-400'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-semibold truncate leading-snug text-white">{item.label}</div>
                          {item.subLabel && (
                            <div className="text-xs text-zinc-400 truncate mt-0.5 font-mono">
                              {item.subLabel}
                            </div>
                          )}
                        </div>
                      </div>

                      <span className="text-[10px] font-mono px-2.5 py-1 rounded-md bg-white/5 text-zinc-400 uppercase tracking-wider shrink-0 ml-4 border border-white/10">
                        {item.category}
                      </span>
                    </button>
                  );
                })
              )}
            </div>

            {/* Divider */}
            <div className="h-px mx-8 bg-white/[0.08] mt-2" />

            {/* Floating Keyboard Shortcuts Footer Bar */}
            <div className="px-8 py-4 flex items-center justify-between text-xs text-zinc-500 font-mono">
              <span className="flex items-center gap-2">
                <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/10 text-zinc-300 text-[11px]">↑↓</kbd> navigate
                <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/10 text-zinc-300 text-[11px] ml-2">↵</kbd> select
              </span>
              <span className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/10 text-zinc-300 text-[11px]">esc</kbd> close
              </span>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
