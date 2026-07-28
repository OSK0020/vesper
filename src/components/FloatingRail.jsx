import React, { useState } from 'react';
import { Search, Download, Eye, EyeOff, Settings, Trash2, SlidersHorizontal, Sparkles } from 'lucide-react';

export default function FloatingRail({
  onOpenSearch,
  onOpenImportExport,
  isBlurActive,
  onToggleBlur,
  onOpenSettings
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      
      {/* Floating Tools Expanded Menu */}
      {isMenuOpen && (
        <div className="flex flex-col gap-2.5 p-2 rounded-2xl bg-[#090d0b]/90 border border-white/10 backdrop-blur-2xl shadow-2xl animate-toast">
          
          {/* Privacy Blur Toggle */}
          <button
            onClick={onToggleBlur}
            className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all cursor-pointer border ${
              isBlurActive
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-lg shadow-emerald-950/40'
                : 'bg-white/5 text-gray-300 hover:text-white border-white/10 hover:bg-white/10'
            }`}
            title={isBlurActive ? 'Disable Privacy Blur' : 'Enable Privacy Blur'}
          >
            {isBlurActive ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>

          {/* Backup / Import Button */}
          <button
            onClick={onOpenImportExport}
            className="w-11 h-11 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 flex items-center justify-center transition-all cursor-pointer"
            title="Import / Export Data"
          >
            <Download className="w-5 h-5 text-emerald-400" />
          </button>

        </div>
      )}

      {/* Main Floating Trigger Group */}
      <div className="flex items-center gap-2.5 p-1.5 rounded-2xl bg-[#080c09]/90 border border-white/10 backdrop-blur-xl shadow-2xl">
        
        {/* Quick Search */}
        <button
          onClick={onOpenSearch}
          className="w-11 h-11 rounded-xl bg-white/5 hover:bg-white/10 text-gray-200 hover:text-white border border-white/10 flex items-center justify-center transition-all cursor-pointer shadow-sm"
          title="Search bookmarks (Ctrl + K)"
        >
          <Search className="w-5 h-5 text-emerald-400" />
        </button>

        {/* Toggle Tools Menu */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all cursor-pointer border ${
            isMenuOpen 
              ? 'bg-emerald-500 text-emerald-950 border-emerald-400 shadow-lg shadow-emerald-500/30' 
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
