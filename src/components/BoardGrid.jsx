import React from 'react';
import BoardCard from './BoardCard';
import { Plus } from 'lucide-react';

export default function BoardGrid({ 
  boards, 
  bookmarksByBoard, 
  onAddLinkToBoard, 
  onEditBookmark, 
  onDeleteBookmark,
  onDeleteBoard,
  onAddBoard
}) {
  // Distribute boards into 4 columns matching official LumiList structure
  const columns = [[], [], [], []];

  boards.forEach((board, index) => {
    let colIdx = board.columnIndex;
    if (colIdx === undefined || colIdx < 0 || colIdx > 3) {
      colIdx = index % 4;
    }
    columns[colIdx].push(board);
  });

  return (
    <div className="lumilist-container">
      {boards.length === 0 ? (
        <div className="board p-10 text-center flex flex-col items-center justify-center gap-4 col-span-4 max-w-md mx-auto my-12">
          <div className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Plus className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-100">No boards yet</h3>
            <p className="text-xs text-gray-400 mt-1">Create your first board or import your bookmarks to get started.</p>
          </div>
          <button 
            onClick={onAddBoard}
            className="top-ctrl-btn top-ctrl-btn-primary mt-2"
          >
            <Plus className="w-4 h-4" /> Create Board
          </button>
        </div>
      ) : (
        columns.map((colBoards, colIdx) => (
          <div key={colIdx} className="column" data-column={colIdx}>
            {colBoards.map((board) => (
              <BoardCard
                key={board.name}
                boardName={board.name}
                bookmarks={bookmarksByBoard[board.name] || []}
                onAddLinkToBoard={onAddLinkToBoard}
                onEditBookmark={onEditBookmark}
                onDeleteBookmark={onDeleteBookmark}
                onDeleteBoard={onDeleteBoard}
              />
            ))}
          </div>
        ))
      )}
    </div>
  );
}
