import React, { useState } from 'react';
import { Search, Download, Eye, EyeOff, SlidersHorizontal } from 'lucide-react';
import { useMagnetic } from '../utils/useMagnetic';

export default function FloatingRail({
  onOpenSearch,
  onOpenImportExport,
  isBlurActive,
  onToggleBlur
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const searchMagnetic = useMagnetic(0.3);
  const menuMagnetic = useMagnetic(0.3);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">

      {/* Floating Tools Expanded Menu */}
      {isMenuOpen && (
        <div className="flex flex-col gap-2.5 p-2 rounded-2xl bg-[#0e0c12]/90 border border-white/10 backdrop-blur-2xl shadow-2xl animate-toast">

          {/* Privacy Blur Toggle */}
          <button
            onClick={onToggleBlur}
            className={`rail-btn w-11 h-11 rounded-xl flex items-center justify-center cursor-pointer border ${
              isBlurActive
                ? 'bg-[var(--lumen-dim)] text-[var(--lumen-soft)] border-[var(--lumen)]/40 shadow-lg'
                : 'bg-white/5 text-gray-300 hover:text-white border-white/10 hover:bg-white/10'
            }`}
            title={isBlurActive ? 'Disable Privacy Blur' : 'Enable Privacy Blur'}
          >
            {isBlurActive ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>

          {/* Backup / Import Button */}
          <button
            onClick={onOpenImportExport}
            className="rail-btn w-11 h-11 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 flex items-center justify-center cursor-pointer"
            title="Import / Export Data"
          >
            <Download className="w-5 h-5" style={{ color: 'var(--lumen-soft)' }} />
          </button>

        </div>
      )}

      {/* Main Floating Trigger Group */}
      <div className="flex items-center gap-2.5 p-1.5 rounded-2xl bg-[var(--void)]/90 border border-white/10 backdrop-blur-xl shadow-2xl">

        {/* Quick Search */}
        <button
          ref={searchMagnetic.ref}
          onMouseMove={searchMagnetic.onMouseMove}
          onMouseLeave={searchMagnetic.onMouseLeave}
          onClick={onOpenSearch}
          className="rail-btn magnetic w-11 h-11 rounded-xl bg-white/5 hover:bg-white/10 text-gray-200 hover:text-white border border-white/10 flex items-center justify-center cursor-pointer shadow-sm"
          title="Search bookmarks (Ctrl + K)"
        >
          <Search className="w-5 h-5" style={{ color: 'var(--lumen-soft)' }} />
        </button>

        {/* Toggle Tools Menu */}
        <button
          ref={menuMagnetic.ref}
          onMouseMove={menuMagnetic.onMouseMove}
          onMouseLeave={menuMagnetic.onMouseLeave}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`rail-btn magnetic w-11 h-11 rounded-xl flex items-center justify-center cursor-pointer border ${
            isMenuOpen
              ? 'bg-[var(--violet)] text-white border-[var(--violet-soft)] shadow-lg'
              : 'bg-white/5 text-gray-300 hover:text-white border-white/10 hover:bg-white/10'
          }`}
          title="More tools"
        >
          <SlidersHorizontal className="w-5 h-5" />
        </button>

      </div>

    </div>
  );
}
