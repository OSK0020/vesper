import React, { useState } from 'react';
import { Edit2, Trash2, ExternalLink, Globe, GripVertical } from 'lucide-react';
import { getDomain, getFaviconUrl, getFallbackFaviconUrl } from '../utils/favicon';

export default function BookmarkItem({ bookmark, boardName, onEdit, onDelete, onMoveBookmark }) {
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
    <div
      draggable
      onDragStart={handleDragStart}
      className="bookmark-item group relative cursor-grab active:cursor-grabbing py-3 px-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/15 hover:bg-white/[0.06] hover:scale-[1.01] transition-all flex items-center justify-between gap-4 shadow-sm"
    >
      <a
        href={bookmark.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 min-w-0 flex-1 no-underline"
        style={{ textDecoration: 'none' }}
      >
        {/* Subtle Grip Dot for dragging */}
        <span className="opacity-0 group-hover:opacity-60 text-gray-400 transition-opacity flex-shrink-0 -ml-1">
          <GripVertical className="w-3.5 h-3.5" />
        </span>

        {/* Favicon */}
        {imgErrorCount < 2 && imgSrc ? (
          <img
            src={imgSrc}
            alt={bookmark.title}
            onError={handleImageError}
            className="bookmark-favicon w-5 h-5 object-contain rounded flex-shrink-0"
            loading="lazy"
          />
        ) : (
          <Globe className="w-4 h-4 flex-shrink-0 text-emerald-400" />
        )}

        {/* Link Title */}
        <span className="bookmark-title bookmark-title-text text-sm font-medium text-neutral-200 group-hover:text-white truncate leading-snug">
          {bookmark.title || domain}
        </span>
      </a>

      {/* Action Buttons on Hover */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex-shrink-0 ml-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(bookmark);
          }}
          className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 bg-transparent border-0 cursor-pointer transition-colors"
          title="Edit link"
        >
          <Edit2 className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(bookmark);
          }}
          className="p-1.5 rounded-lg text-gray-400 hover:text-rose-400 hover:bg-rose-500/20 bg-transparent border-0 cursor-pointer transition-colors"
          title="Delete link"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>

        <a
          href={bookmark.url}
          target="_blank"
          rel="noopener noreferrer"
          className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          title="Open in new tab"
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}

