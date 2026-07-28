import React from 'react';
import { 
  Plus, Trash2, ShoppingBag, GraduationCap, Code, Cpu, 
  Flame, MessageSquare, Newspaper, Film, CreditCard, Sparkles, Folder 
} from 'lucide-react';
import BookmarkItem from './BookmarkItem';

export default function BoardCard({ 
  boardName, 
  bookmarks, 
  onAddLinkToBoard, 
  onEditBookmark, 
  onDeleteBookmark,
  onDeleteBoard
}) {
  const getBoardIcon = (name) => {
    const n = (name || '').toUpperCase();
    if (n.includes('SHOPPING') || n.includes('BUY') || n.includes('STORE')) return <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />;
    if (n.includes('STUDY') || n.includes('EDU') || n.includes('SCHOOL')) return <GraduationCap className="w-3.5 h-3.5 text-sky-400" />;
    if (n.includes('DEV') || n.includes('CODE') || n.includes('PROGRAM') || n.includes('TECH')) return <Code className="w-3.5 h-3.5 text-indigo-400" />;
    if (n.includes('AI') || n.includes('TOOL') || n.includes('GPT') || n.includes('MODEL')) return <Cpu className="w-3.5 h-3.5 text-purple-400" />;
    if (n.includes('ROUTINE') || n.includes('DAILY') || n.includes('MAIN') || n.includes('AUTOMATION')) return <Flame className="w-3.5 h-3.5 text-amber-400" />;
    if (n.includes('SOCIAL') || n.includes('CHAT')) return <MessageSquare className="w-3.5 h-3.5 text-pink-400" />;
    if (n.includes('NEWS') || n.includes('MEDIA')) return <Newspaper className="w-3.5 h-3.5 text-blue-400" />;
    if (n.includes('MOVIE') || n.includes('FILM') || n.includes('SHOW') || n.includes('DESIGN')) return <Film className="w-3.5 h-3.5 text-rose-400" />;
    if (n.includes('FINANCE') || n.includes('BANK') || n.includes('MONEY')) return <CreditCard className="w-3.5 h-3.5 text-teal-400" />;
    return <Folder className="w-3.5 h-3.5 text-emerald-400" />;
  };

  return (
    <div className="board-card p-4 flex flex-col group/board">
      {/* Top Gradient Accent Bar */}
      <div className="board-card-top-accent" />

      {/* Board Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <div className="p-1 rounded-md bg-white/5 border border-white/10 flex items-center justify-center">
            {getBoardIcon(boardName)}
          </div>
          <h3 className="text-[13px] font-extrabold tracking-wide text-white uppercase truncate">
            {boardName}
          </h3>
          <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            {bookmarks.length}
          </span>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover/board:opacity-100 transition-opacity">
          <button
            onClick={() => onAddLinkToBoard(boardName)}
            className="p-1 rounded text-gray-400 hover:text-emerald-400 hover:bg-white/10 bg-transparent border-0 cursor-pointer transition-colors"
            title="Add link to board"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
          {onDeleteBoard && (
            <button
              onClick={() => onDeleteBoard(boardName)}
              className="p-1 rounded text-gray-400 hover:text-rose-400 hover:bg-rose-500/20 bg-transparent border-0 cursor-pointer transition-colors"
              title="Delete board"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Horizontal Divider Line */}
      <div className="h-px bg-gradient-to-r from-white/15 via-white/5 to-transparent my-2.5" />

      {/* Bookmarks List */}
      <div className="flex flex-col gap-0.5 min-h-[24px]">
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
            className="py-3 px-2 rounded-lg border border-dashed border-white/10 hover:border-emerald-500/40 text-center cursor-pointer text-xs text-gray-500 hover:text-emerald-400 transition-all mt-1 flex items-center justify-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add First Link</span>
          </div>
        )}
      </div>
    </div>
  );
}
