import React from 'react';
import { 
  Plus, Folder, ShoppingBag, GraduationCap, Code, Cpu, 
  Flame, MessageSquare, Newspaper, Film, CreditCard, Sparkles, 
  Trash2, Edit3 
} from 'lucide-react';
import BookmarkItem from './BookmarkItem';

export default function BoardCard({ 
  boardName, 
  bookmarks, 
  onAddLinkToBoard, 
  onEditBookmark, 
  onDeleteBookmark,
  onDeleteBoard,
  onEditBoardName
}) {
  const getBoardIcon = (name) => {
    const n = (name || '').toUpperCase();
    if (n.includes('SHOPPING') || n.includes('BUY') || n.includes('STORE')) return <ShoppingBag className="w-4 h-4 text-emerald-400" />;
    if (n.includes('STUDY') || n.includes('EDU') || n.includes('SCHOOL')) return <GraduationCap className="w-4 h-4 text-sky-400" />;
    if (n.includes('DEV') || n.includes('CODE') || n.includes('PROGRAM')) return <Code className="w-4 h-4 text-indigo-400" />;
    if (n.includes('AI') || n.includes('TOOL') || n.includes('GPT')) return <Cpu className="w-4 h-4 text-purple-400" />;
    if (n.includes('ROUTINE') || n.includes('DAILY') || n.includes('MAIN')) return <Flame className="w-4 h-4 text-amber-400" />;
    if (n.includes('SOCIAL') || n.includes('CHAT')) return <MessageSquare className="w-4 h-4 text-pink-400" />;
    if (n.includes('NEWS') || n.includes('MEDIA')) return <Newspaper className="w-4 h-4 text-blue-400" />;
    if (n.includes('MOVIE') || n.includes('FILM') || n.includes('SHOW')) return <Film className="w-4 h-4 text-rose-400" />;
    if (n.includes('FINANCE') || n.includes('BANK') || n.includes('MONEY')) return <CreditCard className="w-4 h-4 text-teal-400" />;
    return <Sparkles className="w-4 h-4 text-indigo-400" />;
  };

  return (
    <div className="glass-panel p-4 flex flex-col gap-3 group/board transition-all duration-300 hover:border-indigo-500/30">
      {/* Board Header */}
      <div className="flex items-center justify-between pb-2 border-b border-white/5">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-1.5 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
            {getBoardIcon(boardName)}
          </div>
          <h3 className="text-sm font-bold tracking-wide text-gray-100 uppercase truncate">
            {boardName}
          </h3>
          <span className="px-2 py-0.5 text-[11px] font-medium rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/20">
            {bookmarks.length}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onAddLinkToBoard(boardName)}
            className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors border-0 bg-transparent cursor-pointer"
            title="Add link to this board"
          >
            <Plus className="w-4 h-4" />
          </button>
          {onDeleteBoard && (
            <button
              onClick={() => onDeleteBoard(boardName)}
              className="p-1.5 rounded-lg hover:bg-rose-500/20 text-gray-400 hover:text-rose-400 transition-colors border-0 bg-transparent cursor-pointer opacity-0 group-hover/board:opacity-100"
              title="Delete board"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Bookmarks List */}
      <div className="flex flex-col gap-1 min-h-[40px]">
        {bookmarks.map((bookmark, idx) => (
          <BookmarkItem
            key={bookmark.id || `${bookmark.url}-${idx}`}
            bookmark={bookmark}
            onEdit={onEditBookmark}
            onDelete={onDeleteBookmark}
          />
        ))}

        {bookmarks.length === 0 && (
          <div 
            onClick={() => onAddLinkToBoard(boardName)}
            className="py-6 px-4 rounded-xl border border-dashed border-white/10 hover:border-indigo-500/40 flex flex-col items-center justify-center gap-2 text-center cursor-pointer group/empty transition-all"
          >
            <Plus className="w-5 h-5 text-gray-500 group-hover/empty:text-indigo-400 transition-colors" />
            <span className="text-xs text-gray-400 group-hover/empty:text-gray-200">
              Add first link to {boardName}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
