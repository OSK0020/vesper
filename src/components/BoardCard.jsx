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
    <div className="board-card p-4 flex flex-col group/board">
      {/* Board Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-[13px] font-extrabold tracking-wide text-white uppercase truncate">
          {boardName}
        </h3>

        <div className="flex items-center gap-1 opacity-0 group-hover/board:opacity-100 transition-opacity">
          <button
            onClick={() => onAddLinkToBoard(boardName)}
            className="p-1 rounded text-gray-400 hover:text-white bg-transparent border-0 cursor-pointer"
            title="Add link"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
          {onDeleteBoard && (
            <button
              onClick={() => onDeleteBoard(boardName)}
              className="p-1 rounded text-gray-400 hover:text-rose-400 bg-transparent border-0 cursor-pointer"
              title="Delete board"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Horizontal Divider matching screenshot */}
      <div className="h-px bg-white/10 my-2.5" />

      {/* Bookmarks List */}
      <div className="flex flex-col gap-0.5 min-h-[30px]">
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
            className="py-3 px-2 rounded border border-dashed border-white/10 hover:border-emerald-500/40 text-center cursor-pointer text-xs text-gray-500 hover:text-gray-300 transition-all mt-1"
          >
            + Add Link
          </div>
        )}
      </div>
    </div>
  );
}
