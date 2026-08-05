import React, { useEffect, useRef } from 'react';
import { X, Download, Share2, Sparkles } from 'lucide-react';
import { useEscapeClose } from '../utils/useEscapeClose';

export default function ShareCardModal({
  isOpen,
  onClose,
  currentPage,
  boards = [],
  bookmarksCount = 0
}) {
  const canvasRef = useRef(null);

  useEscapeClose(isOpen, onClose);

  useEffect(() => {
    if (!isOpen) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = (canvas.width = 1200);
    const height = (canvas.height = 630);

    // Background - dark void
    ctx.fillStyle = '#080c09';
    ctx.fillRect(0, 0, width, height);

    // Emerald Radial Glows
    const emeraldGlow = ctx.createRadialGradient(250, 150, 10, 250, 150, 450);
    emeraldGlow.addColorStop(0, 'rgba(16, 185, 129, 0.35)');
    emeraldGlow.addColorStop(1, 'rgba(16, 185, 129, 0)');
    ctx.fillStyle = emeraldGlow;
    ctx.fillRect(0, 0, width, height);

    // Outer subtle border
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.25)';
    ctx.lineWidth = 12;
    ctx.strokeRect(6, 6, width - 12, height - 12);

    // Brand Name
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 38px sans-serif';
    ctx.fillText('LUMILIST', 100, 138);

    // Status
    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 15px monospace';
    ctx.fillText(`PAGE: ${currentPage.toUpperCase()}`, 100, 102);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '16px monospace';
    ctx.fillText(`${boards.length} BOARDS  ·  ${bookmarksCount} SAVED LINKS`, 100, 165);

    // Boards Grid Cards Preview
    const cardWidth = 240;
    const cardHeight = 320;
    const startX = 100;
    const startY = 230;
    const gap = 30;

    const displayBoards = boards.slice(0, 4);

    displayBoards.forEach((b, i) => {
      const x = startX + i * (cardWidth + gap);
      const y = startY;

      ctx.fillStyle = 'rgba(14, 20, 16, 0.75)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 1.5;

      ctx.beginPath();
      ctx.roundRect(x, y, cardWidth, cardHeight, 16);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#10b981';
      ctx.fillRect(x + 16, y + 20, 32, 4);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText(b.name || 'BOARD', x + 16, y + 52);

      for (let r = 0; r < 4; r++) {
        const itemY = y + 80 + r * 50;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
        ctx.beginPath();
        ctx.roundRect(x + 12, itemY, cardWidth - 24, 38, 8);
        ctx.fill();
      }
    });

    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.font = '14px monospace';
    ctx.fillText('LUMILIST · YOUR VISUAL BOOKMARK DASHBOARD', 100, 590);
  }, [isOpen, currentPage, boards, bookmarksCount]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `lumilist-${currentPage.toLowerCase()}-share.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay z-50">
      <div className="modal-content w-full max-w-4xl p-6 sm:p-8 relative animate-modal">
        
        {/* Header Section */}
        <div className="flex items-center justify-between pb-5 border-b border-white/10 mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-md shrink-0 flex items-center justify-center">
              <Share2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-semibold text-white tracking-tight leading-snug">Social Share Card</h2>
              <p className="text-sm text-neutral-400">High-resolution 1200x630 preview graphic for social platforms</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-white/10 text-neutral-400 hover:text-white transition-colors border-0 bg-transparent cursor-pointer shrink-0 ml-4"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Canvas Render Container */}
        <div className="relative rounded-2xl overflow-hidden border border-white/12 shadow-2xl bg-black/40 p-1.5">
          <canvas
            ref={canvasRef}
            className="w-full h-auto block rounded-xl"
            style={{ width: '100%', height: 'auto', aspectRatio: '1200 / 630' }}
          />
        </div>

        {/* Dedicated Footer Action Bar */}
        <div className="flex items-center justify-between mt-8 pt-5 border-t border-white/10 gap-6">
          <div className="text-xs text-neutral-400 flex items-center gap-2 font-mono">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
            Ready to share or export
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onClose}
              className="action-btn h-10 px-5 font-semibold"
            >
              Close
            </button>
            <button
              onClick={handleDownload}
              className="action-btn action-btn-primary h-10 px-6 font-semibold"
            >
              <Download className="w-4 h-4" /> Download PNG (1200x630)
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

