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
  // Distribute boards evenly across 4 columns so full screen width is utilized
  const columns = [[], [], [], []];

  boards.forEach((board, index) => {
    // If explicit columnIndex exists, use it; otherwise fallback to round-robin index % 4
    let colIdx = board.columnIndex;
    if (colIdx === undefined || colIdx < 0 || colIdx > 3) {
      colIdx = index % 4;
    }
    columns[colIdx].push(board);
  });

  return (
    <div className="w-full">
      {boards.length === 0 ? (
        <div className="board-card p-12 text-center flex flex-col items-center justify-center gap-4 max-w-md mx-auto my-12">
          <div className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Plus className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-100">No boards yet</h3>
            <p className="text-sm text-gray-400 mt-1">Create your first board or import your bookmarks to get started.</p>
          </div>
          <button 
            onClick={onAddBoard}
            className="action-btn action-btn-primary mt-2"
          >
            <Plus className="w-4 h-4" /> Create Board
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 w-full items-start">
          {columns.map((colBoards, colIdx) => (
            <div key={colIdx} className="flex flex-col gap-8 w-full">
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
          ))}
        </div>
      )}
    </div>
  );
}
