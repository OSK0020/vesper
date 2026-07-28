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
    <div className="group relative flex items-center justify-between py-1.5 px-2.5 rounded-lg transition-all duration-150 hover:bg-white/[0.08] border border-transparent hover:border-white/5">
      <a
        href={bookmark.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2.5 min-w-0 flex-1 no-underline"
        style={{ textDecoration: 'none' }}
      >
        {/* Favicon Container */}
        <div className="flex-shrink-0 w-5 h-5 rounded flex items-center justify-center overflow-hidden bg-[#090d0b] border border-white/10 shadow-sm">
          {imgErrorCount < 2 && imgSrc ? (
            <img
              src={imgSrc}
              alt={bookmark.title}
              onError={handleImageError}
              className="w-4 h-4 object-contain transition-transform duration-150 group-hover:scale-110"
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

        {/* Subtitle Domain preview */}
        <span className="text-[10px] text-gray-500 font-mono hidden xl:inline-block opacity-0 group-hover:opacity-60 transition-opacity truncate max-w-[100px] ml-1">
          {domain}
        </span>
      </a>

      {/* Edit & Delete & External Link Actions on Hover */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 ml-1.5">
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
