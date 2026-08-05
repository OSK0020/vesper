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
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
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

  const handleMouseMove = (e) => {
    if (tilt.onMouseMove) tilt.onMouseMove(e);
    if (!tilt.ref.current) return;
    const rect = tilt.ref.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseLeave = (e) => {
    if (tilt.onMouseLeave) tilt.onMouseLeave(e);
    setIsFocused(false);
  };

  return (
    <motion.div
      ref={setRefs}
      data-board={boardName}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsFocused(true)}
      onMouseLeave={handleMouseLeave}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      whileHover={isReducedMotion ? undefined : { y: -2 }}
      transition={{ duration: 0.25, ease: easeVesper }}
      className={`board group/board relative overflow-hidden rounded-2xl bg-[#0c120e]/80 backdrop-blur-xl border border-white/10 transition-all duration-500 hover:border-white/20 hover:shadow-[0_8px_32px_-12px_rgba(255,255,255,0.1)] ${
        featured ? 'ring-1 ring-inset ring-accent-500/30 shadow-[0_0_40px_-12px_var(--color-accent-glow)]' : ''
      } ${
        isDragOver ? 'ring-2 ring-emerald-400 bg-white/[0.06] scale-[1.01]' : ''
      }`}
      style={{
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Spotlight Hover Effect (React Bits / Aceternity) */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover/board:opacity-100"
        style={{
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(255,255,255,0.06), transparent 40%)`,
        }}
      />
      
      {/* Dynamic board accent border */}
      <div className="absolute top-0 inset-x-0 h-[2px] opacity-0 group-hover/board:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: `linear-gradient(90deg, transparent, ${accentHex}, transparent)` }} />

      {/* Conic-gradient Border Beam mask — active strictly on hover / focus-within for performance */}

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
          <div className="flex items-center justify-center gap-3 py-3 px-4 bg-black/60 backdrop-blur-md border-y border-white/10 animate-fadeIn">
            {BOARD_ACCENTS.map((acc) => {
              const isSelected = board?.accentHex === acc.hex;
              return (
                <button
                  key={acc.id}
                  onClick={() => {
                    if (onChangeBoardColor) onChangeBoardColor(boardName, acc.hex);
                    setShowColorPicker(false);
                  }}
                  className={`w-7 h-7 rounded-full border transition-all cursor-pointer flex items-center justify-center ${
                    isSelected 
                      ? 'border-white scale-110 ring-2 ring-emerald-500/50' 
                      : 'border-white/20 hover:scale-110 hover:border-white/50'
                  }`}
                  style={{ backgroundColor: acc.hex }}
                  title={acc.name}
                  aria-label={`Change board accent to ${acc.name}`}
                >
                  {isSelected && <div className="w-2 h-2 rounded-full bg-white shadow-sm" />}
                </button>
              );
            })}
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

