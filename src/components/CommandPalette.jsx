import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search, Plus, Layout, FileText, Download, Eye, ExternalLink, Command, Share2, Sparkles } from 'lucide-react';
import { useEscapeClose } from '../utils/useEscapeClose';

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

    const actions = [
      {
        id: 'action-add-link',
        type: 'action',
        label: 'Add New Link / Bookmark',
        category: 'Actions',
        icon: Plus,
        run: () => onOpenAddModal && onOpenAddModal()
      },
      {
        id: 'action-add-board',
        type: 'action',
        label: 'Create New Column Board',
        category: 'Actions',
        icon: Layout,
        run: () => onOpenAddBoardModal && onOpenAddBoardModal()
      },
      {
        id: 'action-add-page',
        type: 'action',
        label: 'Create New Page Tab',
        category: 'Actions',
        icon: FileText,
        run: () => onOpenAddPageModal && onOpenAddPageModal()
      },
      {
        id: 'action-share',
        type: 'action',
        label: 'Generate Social Share Card',
        category: 'Actions',
        icon: Share2,
        run: () => onOpenShareCardModal && onOpenShareCardModal()
      },
      {
        id: 'action-blur',
        type: 'action',
        label: 'Toggle Privacy Blur Mode',
        category: 'Actions',
        icon: Eye,
        run: () => onToggleBlur && onToggleBlur()
      },
      {
        id: 'action-export',
        type: 'action',
        label: 'Import / Export JSON Data',
        category: 'Actions',
        icon: Download,
        run: () => onOpenImportExportModal && onOpenImportExportModal()
      }
    ];

    const result = [];

    actions.forEach((act) => {
      if (!q || act.label.toLowerCase().includes(q)) {
        result.push(act);
      }
    });

    pages.forEach((p) => {
      if (!q || p.toLowerCase().includes(q) || 'page'.includes(q)) {
        result.push({
          id: `page-${p}`,
          type: 'page',
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
          type: 'board',
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
            type: 'link',
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
  }, [items]);

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

  if (!isOpen) return null;

  return (
    <div className="modal-overlay z-50">
      <div className="modal-content w-full max-w-3xl p-8 sm:p-10 relative animate-modal shadow-2xl rounded-3xl border border-white/15 bg-surface-3/95">
        
        {/* Command Search Header */}
        <div className="flex items-center gap-4 px-5 py-4 rounded-2xl bg-white/[0.04] border border-white/12 mb-6 shadow-sm">
          <Search className="w-5 h-5 text-emerald-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or search bookmarks..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="cmd-search-input flex-1 text-white placeholder-neutral-400 font-medium text-sm"
          />
          <kbd className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono px-2.5 py-1.5 rounded-xl bg-white/10 text-neutral-300 border border-white/10 shrink-0">
            <Command className="w-3.5 h-3.5" /> K
          </kbd>
        </div>

        {/* Command Results List */}
        <div className="max-h-96 overflow-y-auto pr-1 flex flex-col gap-1.5">
          {items.length === 0 ? (
            <div className="py-12 text-center text-sm text-neutral-400">
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
                  className={`w-full flex items-center justify-between px-5 py-3.5 rounded-2xl text-left transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-emerald-500/20 text-white border-emerald-500/40 shadow-md'
                      : 'bg-white/[0.03] text-neutral-200 hover:bg-white/[0.06] border-white/5'
                  }`}
                >
                  <div className="flex items-center gap-4 min-w-0 pr-4">
                    <div
                      className={`p-2 rounded-xl shrink-0 ${
                        isSelected
                          ? 'bg-emerald-500 text-neutral-950 shadow-sm'
                          : 'bg-white/5 text-neutral-400'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold truncate leading-snug">{item.label}</div>
                      {item.subLabel && (
                        <div className="text-xs text-neutral-400 truncate mt-0.5 font-mono">
                          {item.subLabel}
                        </div>
                      )}
                    </div>
                  </div>

                  <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-white/5 text-neutral-300 uppercase tracking-wider shrink-0 ml-4 border border-white/10">
                    {item.category}
                  </span>
                </button>
              );
            })
          )}
        </div>

        {/* Command Footer Card */}
        <div className="px-5 py-3.5 rounded-2xl bg-white/[0.03] border border-white/10 mt-6 flex items-center justify-between text-xs text-neutral-400 font-mono">
          <div className="flex items-center gap-5">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>Esc Close</span>
          </div>
          <div className="flex items-center gap-2 text-emerald-400 font-semibold">
            <Sparkles className="w-4 h-4" /> LumiList Palette
          </div>
        </div>

      </div>
    </div>
  );
}


