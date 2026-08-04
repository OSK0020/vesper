import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search, Plus, Layout, FileText, Download, Eye, ExternalLink, Command, Share2, Sparkles, Sun } from 'lucide-react';
import { useEscapeClose } from '../utils/useEscapeClose';

export default function CommandPalette({
  isOpen,
  onClose,
  bookmarks,
  boards,
  pages,
  currentPage,
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

  // Aggregate items into list
  const items = useMemo(() => {
    const q = query.trim().toLowerCase();

    // Quick Actions
    const actions = [
      {
        id: 'action-add-link',
        type: 'action',
        label: 'Add New Link / Bookmark',
        category: 'Actions',
        icon: Plus,
        shortcut: 'N',
        run: () => onOpenAddModal()
      },
      {
        id: 'action-add-board',
        type: 'action',
        label: 'Create New Column Board',
        category: 'Actions',
        icon: Layout,
        run: () => onOpenAddBoardModal()
      },
      {
        id: 'action-add-page',
        type: 'action',
        label: 'Create New Page Tab',
        category: 'Actions',
        icon: FileText,
        run: () => onOpenAddPageModal()
      },
      {
        id: 'action-share',
        type: 'action',
        label: 'Generate Social Share Card (OG Image)',
        category: 'Actions',
        icon: Share2,
        run: () => onOpenShareCardModal()
      },
      {
        id: 'action-blur',
        type: 'action',
        label: 'Toggle Privacy Blur Mode',
        category: 'Actions',
        icon: Eye,
        run: () => onToggleBlur()
      },
      {
        id: 'action-export',
        type: 'action',
        label: 'Import / Export JSON Data',
        category: 'Actions',
        icon: Download,
        run: () => onOpenImportExportModal()
      }
    ];

    const result = [];

    actions.forEach((act) => {
      if (!q || act.label.toLowerCase().includes(q)) {
        result.push(act);
      }
    });

    // Pages
    pages.forEach((p) => {
      if (!q || p.toLowerCase().includes(q) || 'page'.includes(q)) {
        result.push({
          id: `page-${p}`,
          type: 'page',
          label: `Switch to ${p} Page`,
          category: 'Pages',
          icon: FileText,
          run: () => onSelectPage(p)
        });
      }
    });

    // Boards
    boards.forEach((b) => {
      if (!q || b.name.toLowerCase().includes(q) || 'board'.includes(q)) {
        result.push({
          id: `board-${b.name}`,
          type: 'board',
          label: `Board: ${b.name}`,
          category: 'Boards',
          icon: Layout,
          run: () => {
            const el = document.querySelector(`[data-board="${b.name}"]`);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }
        });
      }
    });

    // Bookmarks / Links
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

  // Adjust selected index when items change
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
      <div className="modal-content w-full max-w-2xl p-0 overflow-hidden relative animate-modal shadow-2xl rounded-3xl border border-white/16 bg-[#120f1a]">
        
        {/* Command Search Header */}
        <div className="flex items-center gap-4 px-7 py-5 border-b border-white/10 bg-white/[0.03]">
          <Search className="w-6 h-6 text-[var(--violet-soft)] flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or search bookmarks..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent border-0 outline-none shadow-none focus:outline-none focus:ring-0 text-base sm:text-lg text-white placeholder-gray-400 font-medium h-10 px-2"
          />
          <kbd className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-xl bg-white/10 text-gray-300 border border-white/10 flex-shrink-0">
            <Command className="w-3.5 h-3.5" /> K
          </kbd>
        </div>

        {/* Command Results List */}
        <div className="max-h-96 overflow-y-auto p-4 sm:p-5">
          {items.length === 0 ? (
            <div className="py-12 text-center text-sm text-gray-400">
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
                  className={`w-full flex items-center justify-between px-5 py-3.5 rounded-2xl text-left transition-all cursor-pointer mb-2 ${
                    isSelected
                      ? 'bg-[var(--violet)]/30 text-white border border-[var(--violet)]/60 shadow-lg'
                      : 'bg-white/[0.03] text-gray-200 hover:bg-white/[0.07] border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-4 min-w-0 pr-3">
                    <div
                      className={`p-2.5 rounded-xl flex-shrink-0 ${
                        isSelected
                          ? 'bg-[var(--violet)] text-white shadow-md'
                          : 'bg-white/5 text-gray-400'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-bold truncate">{item.label}</div>
                      {item.subLabel && (
                        <div className="text-xs text-gray-400 truncate mt-0.5 font-mono">
                          {item.subLabel}
                        </div>
                      )}
                    </div>
                  </div>

                  <span className="text-[11px] font-mono px-3 py-1 rounded-lg bg-white/10 text-gray-300 uppercase tracking-wider flex-shrink-0 ml-3 border border-white/10">
                    {item.category}
                  </span>
                </button>
              );
            })
          )}
        </div>

        {/* Command Footer */}
        <div className="px-7 py-4 bg-white/[0.02] border-t border-white/10 flex items-center justify-between text-xs text-gray-400 font-mono">
          <div className="flex items-center gap-4">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>Esc Close</span>
          </div>
          <div className="flex items-center gap-2 text-[var(--lumen-soft)] font-bold">
            <Sparkles className="w-4 h-4" /> Vesper Palette
          </div>
        </div>

      </div>
    </div>
  );
}
