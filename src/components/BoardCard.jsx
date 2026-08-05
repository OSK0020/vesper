import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, GripVertical, Palette } from 'lucide-react';
import BookmarkItem from './BookmarkItem';
import { useTilt } from '../utils/useTilt';
import { useReveal } from '../utils/useReveal';
import { BOARD_ACCENTS } from '../constants/boardAccents';
import { easeVesper, getPrefersReducedMotion } from '../utils/motion';

export default function BoardCard({
  board,
  boardName,
  bookmarks,
  featured = false,
  onAddLinkToBoard,
  onEditBookmark,
  onDeleteBookmark,
  onDeleteBoard,
  onChangeBoardColor,
  onMoveBoard,
  onMoveBookmark,
  revealDelay = 0
}) {
  const tilt = useTilt();
  const reveal = useReveal(revealDelay);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const isReducedMotion = getPrefersReducedMotion();

  const accentHex = board?.accentHex || '#34d399';

  // Combine both refs onto the same node
  const setRefs = (node) => {
    tilt.ref.current = node;
    reveal.current = node;
  };

  // Drag Board Handlers
  const handleBoardDragStart = (e) => {
    e.dataTransfer.setData(
      'application/json',
      JSON.stringify({ type: 'BOARD', boardName: boardName, colIndex: board?.columnIndex })
    );
    e.dataTransfer.effectAllowed = 'move';
  };

  // Drag Bookmark drop zone
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (!isDragOver) setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    try {
      const raw = e.dataTransfer.getData('application/json');
      if (!raw) return;
      const payload = JSON.parse(raw);

      if (payload.type === 'BOOKMARK' && onMoveBookmark) {
        onMoveBookmark(payload.bookmarkId, boardName);
      } else if (payload.type === 'BOARD' && onMoveBoard) {
        onMoveBoard(payload.boardName, board?.columnIndex);
      }
    } catch (err) {
      console.error('Failed to parse drag drop data', err);
    }
  };

  return (
    <motion.div
      ref={setRefs}
      data-board={boardName}
      onMouseMove={tilt.onMouseMove}
      onMouseLeave={tilt.onMouseLeave}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      whileHover={isReducedMotion ? undefined : { y: -4 }}
      transition={{ duration: 0.25, ease: easeVesper }}
      className={`board group/board relative overflow-hidden rounded-2xl bg-surface-1/80 backdrop-blur-xl border border-white/10 ${
        featured ? 'ring-1 ring-inset ring-accent-500/30 shadow-[0_0_40px_-12px_var(--color-accent-glow)]' : ''
      } ${
        isDragOver ? 'ring-2 ring-emerald-400 bg-white/[0.06] scale-[1.01]' : ''
      }`}
      style={{
        transformStyle: 'preserve-3d',
        borderTop: `3px solid ${accentHex}`
      }}
    >
      {/* Conic-gradient Border Beam mask — active strictly on hover / focus-within for performance */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div 
          className="absolute inset-0 rounded-2xl [background:conic-gradient(from_0deg,transparent_0deg,var(--color-accent-500)_20deg,transparent_40deg)] animate-[beamSpin_3s_linear_infinite] motion-reduce:animate-none [mask:linear-gradient(#000_0_0)_content-box,linear-gradient(#000_0_0)] [mask-composite:exclude] p-px" 
        />
      </div>

      {/* Static Crisp Border */}
      <div className="absolute inset-0 rounded-2xl border border-white/10 group-hover:border-white/[0.16] transition-colors pointer-events-none" />

      {/* Anchored Ambient Glow on Hover */}
      <div className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(140px_circle_at_50%_0%,var(--color-accent-glow),transparent_70%)] pointer-events-none -z-10" />

      {/* Board Content */}
      <div className="relative z-10">
        
        {/* Board Header */}
        <div className="board-header flex items-center justify-between p-4 pb-3">
          <div className="flex items-center gap-2 min-w-0">
            {/* Drag Handle */}
            <div
              draggable
              onDragStart={handleBoardDragStart}
              className="p-1 -ml-1 text-gray-500 hover:text-gray-200 cursor-grab active:cursor-grabbing rounded hover:bg-white/10 transition-colors"
              title="Drag board to reorder"
            >
              <GripVertical className="w-3.5 h-3.5" />
            </div>

            <h3 className="board-title truncate text-sm font-bold text-white tracking-wider uppercase">
              {boardName}
            </h3>

            <span
              className="board-count font-mono text-xs px-2 py-0.5 rounded-full border bg-white/5"
              style={{
                borderColor: `${accentHex}44`,
                color: accentHex === '#863bff' ? '#a970ff' : accentHex
              }}
            >
              {bookmarks.length}
            </span>
          </div>

          {/* Header Controls — keyboard-accessible via focus-within */}
          <div className="flex items-center gap-1 opacity-0 group-hover/board:opacity-100 focus-within:opacity-100 transition-opacity">
            {/* Color Palette Toggle */}
            <button
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="p-1.5 rounded-md text-neutral-400 hover:text-white hover:bg-white/10 bg-transparent border-0 cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500/50"
              title="Change board accent color"
            >
              <Palette className="w-3.5 h-3.5" />
            </button>

            {/* Add Link Button */}
            <button
              onClick={() => onAddLinkToBoard(boardName)}
              className="p-1.5 rounded-md text-neutral-400 hover:text-emerald-400 hover:bg-white/10 bg-transparent border-0 cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500/50"
              title="Add link to board"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>

            {/* Delete Board Button */}
            {onDeleteBoard && (
              <button
                onClick={() => onDeleteBoard(boardName)}
                className="p-1.5 rounded-md text-neutral-400 hover:text-rose-400 hover:bg-rose-500/20 bg-transparent border-0 cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500/50"
                title="Delete board"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Color Picker Dropdown */}
        {showColorPicker && (
          <div className="flex items-center justify-center gap-1.5 py-2 px-3 bg-white/[0.05] border-y border-white/10 animate-fadeIn">
            {BOARD_ACCENTS.map((acc) => (
              <button
                key={acc.id}
                onClick={() => {
                  if (onChangeBoardColor) onChangeBoardColor(boardName, acc.hex);
                  setShowColorPicker(false);
                }}
                className="w-5 h-5 rounded-full border border-white/30 hover:scale-125 transition-transform cursor-pointer"
                style={{ backgroundColor: acc.hex }}
                title={acc.name}
              />
            ))}
          </div>
        )}

        <div className="board-divider h-px bg-white/10" />

        {/* Bookmarks List */}
        <div className="board-items p-4 flex flex-col gap-2.5">
          {bookmarks.map((bookmark, idx) => (
            <BookmarkItem
              key={bookmark.id || `${bookmark.url}-${idx}`}
              bookmark={bookmark}
              boardName={boardName}
              onEdit={onEditBookmark}
              onDelete={onDeleteBookmark}
              onMoveBookmark={onMoveBookmark}
            />
          ))}

          {bookmarks.length === 0 && (
            <div
              onClick={() => onAddLinkToBoard(boardName)}
              className="py-3 px-3 rounded-xl border border-dashed border-white/10 hover:border-emerald-500/50 text-center cursor-pointer text-xs text-gray-400 hover:text-white transition-all my-1 flex items-center justify-center gap-2 bg-white/[0.01] hover:bg-white/[0.04]"
            >
              <Plus className="w-4 h-4 text-emerald-400" />
              <span>Add First Link</span>
            </div>
          )}
        </div>

      </div>
    </motion.div>
  );
}

