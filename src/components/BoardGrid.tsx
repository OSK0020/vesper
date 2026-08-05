import React, { useState } from 'react';
import { motion } from 'framer-motion';
import BoardCard from './BoardCard';
import { Plus } from 'lucide-react';
import { staggerContainer, fadeUp, getPrefersReducedMotion } from '../utils/motion';

import { Bookmark, Board } from '../types';

interface BoardGridProps {
  boards: Board[];
  bookmarksByBoard: Record<string, Bookmark[]>;
  onAddLinkToBoard: (boardName: string) => void;
  onEditBookmark: (bookmark: Bookmark) => void;
  onDeleteBookmark: (bookmark: Bookmark) => void;
  onDeleteBoard?: (boardName: string) => void;
  onAddBoard: () => void;
  onChangeBoardColor: (boardName: string, color: string) => void;
  onMoveBoard: (boardName: string, targetColIdx: number) => void;
  onMoveBookmark: (bookmarkId: string, targetBoardName: string) => void;
}

export default function BoardGrid({ 
  boards, 
  bookmarksByBoard, 
  onAddLinkToBoard, 
  onEditBookmark, 
  onDeleteBookmark,
  onDeleteBoard,
  onAddBoard,
  onChangeBoardColor,
  onMoveBoard,
  onMoveBookmark
}: BoardGridProps) {
  const [activeColOver, setActiveColOver] = useState<number | null>(null);
  const isReducedMotion = getPrefersReducedMotion();

  // Compute initial featured board ONCE on page load using useState lazy initializer (guaranteed mount stability)
  const [featuredBoardName] = useState(() => {
    if (!boards || boards.length === 0) return null;
    let maxCount = -1;
    let maxBoard = boards[0]?.name;
    boards.forEach((board) => {
      const count = (bookmarksByBoard[board.name] || []).length;
      if (count > maxCount) {
        maxCount = count;
        maxBoard = board.name;
      }
    });
    return maxBoard;
  });

  // Distribute boards into 4 columns matching official LumiList structure
  const columns: Board[][] = [[], [], [], []];

  boards.forEach((board, index) => {
    let colIdx = board.columnIndex;
    if (colIdx === undefined || colIdx < 0 || colIdx > 3) {
      colIdx = index % 4;
    }
    columns[colIdx].push(board);
  });

  const handleColDragOver = (e: React.DragEvent<HTMLDivElement>, colIdx: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (activeColOver !== colIdx) setActiveColOver(colIdx);
  };

  const handleColDragLeave = () => {
    setActiveColOver(null);
  };

  const handleColDrop = (e: React.DragEvent<HTMLDivElement>, targetColIdx: number) => {
    e.preventDefault();
    setActiveColOver(null);
    try {
      const raw = e.dataTransfer.getData('application/json');
      if (!raw) return;
      const payload = JSON.parse(raw);

      if (payload.type === 'BOARD' && onMoveBoard) {
        onMoveBoard(payload.boardName, targetColIdx);
      }
    } catch (err) {
      console.error('Failed to parse column drop data', err);
    }
  };

  // Compute highest active column index to scale grid dynamically
  const highestColIdx = boards.reduce((max, b) => {
    const c = b.columnIndex !== undefined && b.columnIndex >= 0 && b.columnIndex <= 3 ? b.columnIndex : 0;
    return Math.max(max, c);
  }, 0);

  // Determine how many columns to display (1 to 4)
  const displayColCount = Math.max(1, Math.min(4, highestColIdx + 1));
  const columnsToRender = columns.slice(0, displayColCount);

  const gridLayoutClass = 
    displayColCount === 1 
      ? 'grid-cols-1 max-w-3xl' 
      : displayColCount === 2 
      ? 'grid-cols-1 md:grid-cols-2 max-w-5xl' 
      : displayColCount === 3 
      ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-[1400px]' 
      : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-w-[1700px]';

  return (
    <motion.div 
      className={`vesper-container grid ${gridLayoutClass} gap-6 p-4 sm:p-8 mx-auto w-full transition-all duration-300`}
      variants={isReducedMotion ? undefined : staggerContainer}
      initial={isReducedMotion ? false : "initial"}
      animate={isReducedMotion ? false : "animate"}
    >
      {boards.length === 0 ? (
        <div className="board p-10 text-center flex flex-col items-center justify-center gap-4 col-span-full max-w-md mx-auto my-12 bg-surface-1/80 border border-white/10 rounded-2xl backdrop-blur-xl">
          <div className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Plus className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-100">No boards yet</h3>
            <p className="text-xs text-gray-400 mt-1">Create your first board or import your bookmarks to get started.</p>
          </div>
          <button 
            onClick={onAddBoard}
            className="action-btn action-btn-primary mt-2"
          >
            <Plus className="w-4 h-4" /> Create Board
          </button>
        </div>
      ) : (
        columnsToRender.map((colBoards, colIdx) => (
          <div
            key={colIdx}
            className={`column flex flex-col gap-4 w-full min-w-0 transition-colors rounded-2xl p-1.5 ${
              activeColOver === colIdx ? 'bg-white/[0.03] ring-1 ring-white/10' : ''
            }`}
            data-column={colIdx}
            onDragOver={(e) => handleColDragOver(e, colIdx)}
            onDragLeave={handleColDragLeave}
            onDrop={(e) => handleColDrop(e, colIdx)}
          >
            {colBoards.map((board) => {
              const isFeatured = board.name === featuredBoardName && displayColCount > 1;
              return (
                <motion.div 
                  key={board.name} 
                  variants={isReducedMotion ? undefined : fadeUp}
                  className={isFeatured ? 'sm:col-span-2 sm:row-span-2' : ''}
                >
                  <BoardCard
                    board={board}
                    boardName={board.name}
                    bookmarks={bookmarksByBoard[board.name] || []}
                    featured={isFeatured}
                    onAddLinkToBoard={onAddLinkToBoard}
                    onEditBookmark={onEditBookmark}
                    onDeleteBookmark={onDeleteBookmark}
                    onDeleteBoard={onDeleteBoard}
                    onChangeBoardColor={onChangeBoardColor}
                    onMoveBoard={onMoveBoard}
                    onMoveBookmark={onMoveBookmark}
                  />
                </motion.div>
              );
            })}
          </div>
        ))
      )}
    </motion.div>
  );
}


