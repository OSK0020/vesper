import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search, Plus, Layout, FileText, Download, Eye, ExternalLink, Command, Share2, Sparkles } from 'lucide-react';
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
    const result = [];

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

    return result.slice(0, 20); // Cap at 20 results for responsive menu
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
      <div className="modal-content w-full max-w-xl p-0 overflow-hidden relative animate-modal shadow-2xl rounded-2xl border border-[var(--violet)]/30">
        
        {/* Command Search Header */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/10 bg-white/[0.03]">
          <Search className="w-5 h-5 text-[var(--violet-soft)] flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or search bookmarks..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent border-0 outline-none text-sm text-white placeholder-gray-400 font-medium"
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono px-2 py-1 rounded bg-white/10 text-gray-400 border border-white/10">
            <Command className="w-3 h-3" /> K
          </kbd>
        </div>

        {/* Command Results List */}
        <div className="max-h-80 overflow-y-auto p-2">
          {items.length === 0 ? (
            <div className="py-8 text-center text-xs text-gray-400">
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
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all border-0 cursor-pointer ${
                    isSelected
                      ? 'bg-[var(--violet)]/20 text-white border border-[var(--violet)]/40 shadow-sm'
                      : 'bg-transparent text-gray-300 hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`p-1.5 rounded-lg flex-shrink-0 ${
                        isSelected
                          ? 'bg-[var(--violet)] text-white'
                          : 'bg-white/5 text-gray-400'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold truncate">{item.label}</div>
                      {item.subLabel && (
                        <div className="text-[10px] text-gray-400 truncate mt-0.5 font-mono">
                          {item.subLabel}
                        </div>
                      )}
                    </div>
                  </div>

                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-gray-400 uppercase tracking-wider">
                    {item.category}
                  </span>
                </button>
              );
            })
          )}
        </div>

        {/* Command Footer */}
        <div className="px-4 py-2 bg-white/[0.02] border-t border-white/5 flex items-center justify-between text-[11px] text-gray-500 font-mono">
          <div className="flex items-center gap-2">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>Esc Close</span>
          </div>
          <div className="flex items-center gap-1 text-[var(--lumen-soft)]">
            <Sparkles className="w-3 h-3" /> Lumi Palette
          </div>
        </div>

      </div>
    </div>
  );
}
