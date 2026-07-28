import React, { useState } from 'react';
import { Edit2, Trash2, Globe } from 'lucide-react';
import { getDomain, getFaviconUrl, getFallbackFaviconUrl, getInitialLetter, getRandomGradient } from '../utils/favicon';

export default function BookmarkItem({ bookmark, onEdit, onDelete }) {
  const [imgSrc, setImgSrc] = useState(getFaviconUrl(bookmark.url));
  const [imgErrorCount, setImgErrorCount] = useState(0);

  const domain = getDomain(bookmark.url);
  const initial = getInitialLetter(bookmark.title, bookmark.url);

  const handleImageError = () => {
    if (imgErrorCount === 0) {
      setImgErrorCount(1);
      setImgSrc(getFallbackFaviconUrl(bookmark.url));
    } else {
      setImgErrorCount(2);
    }
  };

  return (
    <div className="group relative flex items-center justify-between py-1.5 px-2 rounded-lg transition-all duration-150 hover:bg-white/[0.08]">
      <a
        href={bookmark.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2.5 min-w-0 flex-1 no-underline"
        style={{ textDecoration: 'none' }}
      >
        {/* Site Icon / Favicon (Small 18x18 matching screenshot) */}
        <div className="flex-shrink-0 w-4 h-4 flex items-center justify-center overflow-hidden">
          {imgErrorCount < 2 && imgSrc ? (
            <img
              src={imgSrc}
              alt={bookmark.title}
              onError={handleImageError}
              className="w-4 h-4 object-contain rounded-sm"
              loading="lazy"
            />
          ) : (
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
          )}
        </div>

        {/* Link Title */}
        <span className="text-[13px] font-semibold text-gray-200 group-hover:text-white truncate">
          {bookmark.title || domain}
        </span>
      </a>

      {/* Edit & Delete Actions on Hover */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 ml-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(bookmark);
          }}
          className="p-1 rounded text-gray-400 hover:text-emerald-400 bg-transparent border-0 cursor-pointer"
          title="Edit"
        >
          <Edit2 className="w-3 h-3" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(bookmark);
          }}
          className="p-1 rounded text-gray-400 hover:text-rose-400 bg-transparent border-0 cursor-pointer"
          title="Delete"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
