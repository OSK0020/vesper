import React, { useState } from 'react';
import { Edit2, Trash2, ExternalLink, Globe } from 'lucide-react';
import { getDomain, getFaviconUrl, getFallbackFaviconUrl } from '../utils/favicon';

export default function BookmarkItem({ bookmark, onEdit, onDelete }) {
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

  return (
    <div className="bookmark-item group relative">
      <a
        href={bookmark.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 min-w-0 flex-1 no-underline"
        style={{ textDecoration: 'none' }}
      >
        {/* Favicon */}
        {imgErrorCount < 2 && imgSrc ? (
          <img
            src={imgSrc}
            alt={bookmark.title}
            onError={handleImageError}
            className="bookmark-favicon"
            loading="lazy"
          />
        ) : (
          <Globe className="w-4 h-4 text-emerald-400 flex-shrink-0" />
        )}

        {/* Link Title */}
        <span className="bookmark-title bookmark-title-text">
          {bookmark.title || domain}
        </span>
      </a>

      {/* Action Buttons on Hover */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 ml-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(bookmark);
          }}
          className="p-1 rounded text-gray-400 hover:text-emerald-400 hover:bg-white/10 bg-transparent border-0 cursor-pointer transition-colors"
          title="Edit link"
        >
          <Edit2 className="w-3 h-3" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(bookmark);
          }}
          className="p-1 rounded text-gray-400 hover:text-rose-400 hover:bg-rose-500/20 bg-transparent border-0 cursor-pointer transition-colors"
          title="Delete link"
        >
          <Trash2 className="w-3 h-3" />
        </button>

        <a
          href={bookmark.url}
          target="_blank"
          rel="noopener noreferrer"
          className="p-1 rounded text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          title="Open in new tab"
        >
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}
