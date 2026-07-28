import React, { useState } from 'react';
import { ExternalLink, Edit2, Trash2, Globe } from 'lucide-react';
import { getDomain, getFaviconUrl, getFallbackFaviconUrl, getInitialLetter, getRandomGradient } from '../utils/favicon';

export default function BookmarkItem({ bookmark, onEdit, onDelete }) {
  const [imgSrc, setImgSrc] = useState(getFaviconUrl(bookmark.url));
  const [imgErrorCount, setImgErrorCount] = useState(0);

  const domain = getDomain(bookmark.url);
  const initial = getInitialLetter(bookmark.title, bookmark.url);
  const avatarBg = getRandomGradient(domain || bookmark.title);

  const handleImageError = () => {
    if (imgErrorCount === 0) {
      setImgErrorCount(1);
      setImgSrc(getFallbackFaviconUrl(bookmark.url));
    } else {
      setImgErrorCount(2);
    }
  };

  return (
    <div className="group relative flex items-center justify-between p-2.5 rounded-xl transition-all duration-200 hover:bg-white/[0.06] hover:shadow-lg border border-transparent hover:border-white/10">
      <a
        href={bookmark.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 min-w-0 flex-1 text-decoration-none"
        style={{ textDecoration: 'none' }}
      >
        {/* Favicon / Logo Container */}
        <div className="relative flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center overflow-hidden shadow-sm bg-black/40 border border-white/10">
          {imgErrorCount < 2 && imgSrc ? (
            <img
              src={imgSrc}
              alt={bookmark.title}
              onError={handleImageError}
              className="w-5 h-5 object-contain transition-transform duration-200 group-hover:scale-110"
              loading="lazy"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center text-white font-bold text-sm"
              style={{ background: avatarBg }}
            >
              {initial}
            </div>
          )}
        </div>

        {/* Title & Host Domain */}
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold text-gray-200 group-hover:text-indigo-300 truncate transition-colors">
            {bookmark.title || domain}
          </div>
          <div className="text-xs text-gray-400 truncate flex items-center gap-1 opacity-70 group-hover:opacity-100">
            <span>{domain}</span>
          </div>
        </div>
      </a>

      {/* Action Buttons (Visible on Hover / Focus) */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ml-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(bookmark);
          }}
          className="p-1.5 rounded-md hover:bg-white/10 text-gray-400 hover:text-indigo-400 transition-colors border-0 bg-transparent cursor-pointer"
          title="Edit Link"
        >
          <Edit2 className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(bookmark);
          }}
          className="p-1.5 rounded-md hover:bg-rose-500/20 text-gray-400 hover:text-rose-400 transition-colors border-0 bg-transparent cursor-pointer"
          title="Delete Link"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
        <a
          href={bookmark.url}
          target="_blank"
          rel="noopener noreferrer"
          className="p-1.5 rounded-md hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          title="Open Link"
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}
