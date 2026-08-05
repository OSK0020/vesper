import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Pencil, Trash2, ExternalLink, Globe, GripVertical } from 'lucide-react';
import { getDomain, getFaviconUrl, getFallbackFaviconUrl } from '../utils/favicon';

function IconButton({ icon: Icon, label, onClick }) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        onClick();
      }}
      aria-label={label}
      title={label}
      className="p-1.5 rounded-md text-neutral-400 hover:text-neutral-100 hover:bg-white/10 bg-transparent border-0 cursor-pointer transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500/50"
    >
      <Icon className="w-3.5 h-3.5" />
    </button>
  );
}

export default function BookmarkItem({ bookmark, boardName, onEdit, onDelete }) {
  const [imgSrc, setImgSrc] = useState(getFaviconUrl(bookmark.url));
  const [imgErrorCount, setImgErrorCount] = useState(0);

  const domain = getDomain(bookmark.url);

  const handleImageError = () => {
    if (imgErrorCount === 0) {
      setImgErrorCount(1);
      setImgSrc(getFallbackFaviconUrl(bookmark.url));
    } else {
      setImgErrorCount(2);
    }
  };

  const handleDragStart = (e) => {
    e.dataTransfer.setData(
      'application/json',
      JSON.stringify({
        type: 'BOOKMARK',
        bookmarkId: bookmark.id || bookmark.url,
        url: bookmark.url,
        sourceBoard: boardName
      })
    );
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <motion.a
      href={bookmark.url}
      target="_blank"
      rel="noopener noreferrer"
      draggable
      onDragStart={handleDragStart}
      whileTap={{ scale: 0.99 }}
      className="group relative flex items-center gap-3 px-3 py-2.5 rounded-lg bg-surface-1/80 border border-white/[0.06] hover:border-white/15 hover:bg-surface-2 transition-colors duration-150 shadow-sm no-underline"
      style={{ textDecoration: 'none' }}
    >
      {/* Subtle Grip Handle on Hover */}
      <span className="opacity-0 group-hover:opacity-60 focus-within:opacity-60 text-neutral-500 transition-opacity flex-none -ml-1">
        <GripVertical className="w-3.5 h-3.5" />
      </span>

      {/* Fixed Favicon Box — prevents layout collapses */}
      <div className="flex-none w-7 h-7 rounded-md bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
        {imgErrorCount < 2 && imgSrc ? (
          <img
            src={imgSrc}
            alt=""
            onError={handleImageError}
            className="w-4 h-4 object-contain"
            loading="lazy"
          />
        ) : (
          <Globe className="w-3.5 h-3.5 text-neutral-500" />
        )}
      </div>

      {/* Title & Display URL Stack — Scan Hierarchy */}
      <div className="min-w-0 flex-1">
        <p className="bookmark-title-text text-sm font-medium text-neutral-100 group-hover:text-white truncate leading-tight">
          {bookmark.title || domain}
        </p>
        <p className="text-xs text-neutral-500 truncate leading-tight mt-0.5 font-mono">
          {domain}
        </p>
      </div>

      {/* Quick Action Buttons — revealed on hover AND keyboard focus-within */}
      <div className="flex-none flex items-center gap-1 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 focus-within:opacity-100 focus-within:translate-x-0 transition-all duration-150 ml-1">
        <IconButton icon={Pencil} label="Edit link" onClick={() => onEdit(bookmark)} />
        <IconButton icon={Trash2} label="Delete link" onClick={() => onDelete(bookmark)} />
        <a
          href={bookmark.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="p-1.5 rounded-md text-neutral-400 hover:text-white hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500/50"
          title="Open in new tab"
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </motion.a>
  );
}


