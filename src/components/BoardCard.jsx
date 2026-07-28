import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import BookmarkItem from './BookmarkItem';

export default function BoardCard({ 
  boardName, 
  bookmarks, 
  onAddLinkToBoard, 
  onEditBookmark, 
  onDeleteBookmark,
  onDeleteBoard
}) {
  return (
    <div className="board group/board">
      {/* Board Header matching official LumiList markup */}
      <div className="board-header">
        <div className="flex items-center gap-2.5 min-w-0">
          <h3 className="board-title truncate">
            {boardName}
          </h3>
          <span className="board-count">
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

      {/* Board Horizontal Divider */}
      <div className="board-divider" />

      {/* Bookmarks List */}
      <div className="board-items">
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
            className="py-3 px-2 rounded-lg border border-dashed border-white/10 hover:border-emerald-500/40 text-center cursor-pointer text-xs text-gray-500 hover:text-emerald-400 transition-all my-1 flex items-center justify-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add First Link</span>
          </div>
        )}
      </div>
    </div>
  );
}
