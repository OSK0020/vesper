import React, { useState } from 'react';
import { motion } from 'framer-motion';
import BoardCard from './BoardCard';
import { Plus } from 'lucide-react';
import { staggerContainer, fadeUp, getPrefersReducedMotion } from '../utils/motion';

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
}) {
  const [activeColOver, setActiveColOver] = useState(null);
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
  const columns = [[], [], [], []];

  boards.forEach((board, index) => {
    let colIdx = board.columnIndex;
    if (colIdx === undefined || colIdx < 0 || colIdx > 3) {
      colIdx = index % 4;
    }
    columns[colIdx].push(board);
  });

  const handleColDragOver = (e, colIdx) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (activeColOver !== colIdx) setActiveColOver(colIdx);
  };

  const handleColDragLeave = () => {
    setActiveColOver(null);
  };

  const handleColDrop = (e, targetColIdx) => {
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

  return (
    <motion.div 
      className="vesper-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 auto-rows-[minmax(180px,auto)] p-4 sm:p-8 max-w-[1700px] mx-auto w-full"
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
        columns.map((colBoards, colIdx) => (
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
              const isFeatured = board.name === featuredBoardName;
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


