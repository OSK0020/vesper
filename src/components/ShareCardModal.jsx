import React, { useEffect, useRef } from 'react';
import { X, Download, Share2, Sparkles } from 'lucide-react';
import { useEscapeClose } from '../utils/useEscapeClose';

export default function ShareCardModal({
  isOpen,
  onClose,
  currentPage,
  boards,
  bookmarksCount
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

    // Background - warm void black
    ctx.fillStyle = '#08070a';
    ctx.fillRect(0, 0, width, height);

    // Violet & Lumen Aurora Radial Glows
    const violetGlow = ctx.createRadialGradient(250, 150, 10, 250, 150, 450);
    violetGlow.addColorStop(0, 'rgba(134, 59, 255, 0.35)');
    violetGlow.addColorStop(1, 'rgba(134, 59, 255, 0)');
    ctx.fillStyle = violetGlow;
    ctx.fillRect(0, 0, width, height);

    const lumenGlow = ctx.createRadialGradient(950, 480, 10, 950, 480, 400);
    lumenGlow.addColorStop(0, 'rgba(245, 185, 66, 0.25)');
    lumenGlow.addColorStop(1, 'rgba(245, 185, 66, 0)');
    ctx.fillStyle = lumenGlow;
    ctx.fillRect(0, 0, width, height);

    // Outer subtle border
    ctx.strokeStyle = 'rgba(134, 59, 255, 0.25)';
    ctx.lineWidth = 12;
    ctx.strokeRect(6, 6, width - 12, height - 12);

    // Header Logo & Mark
    // Bolt icon
    ctx.save();
    ctx.fillStyle = '#863bff';
    ctx.beginPath();
    ctx.moveTo(110, 95);
    ctx.lineTo(135, 95);
    ctx.lineTo(120, 130);
    ctx.lineTo(145, 130);
    ctx.lineTo(100, 175);
    ctx.lineTo(112, 140);
    ctx.lineTo(95, 140);
    ctx.closePath();
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#863bff';
    ctx.fill();
    ctx.restore();

    // Brand Name
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 38px "Space Grotesk", sans-serif';
    ctx.fillText('LUMI LIST', 160, 138);

    // Eyebrow Label & Status
    ctx.fillStyle = '#f5b942';
    ctx.font = 'bold 15px "JetBrains Mono", monospace';
    ctx.fillText(`PAGE: ${currentPage.toUpperCase()}`, 160, 102);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '16px "JetBrains Mono", monospace';
    ctx.fillText(`${boards.length} BOARDS  ·  ${bookmarksCount} SAVED LINKS`, 160, 165);

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

      // Card glass background
      ctx.fillStyle = 'rgba(18, 16, 22, 0.75)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 1.5;

      ctx.beginPath();
      ctx.roundRect(x, y, cardWidth, cardHeight, 16);
      ctx.fill();
      ctx.stroke();

      // Card Accent header line
      ctx.fillStyle = i === 0 ? '#863bff' : i === 1 ? '#f5b942' : i === 2 ? '#10b981' : '#f43f5e';
      ctx.fillRect(x + 16, y + 20, 32, 4);

      // Card Board Name
      ctx.fillStyle = '#f6f4f1';
      ctx.font = 'bold 18px "Space Grotesk", sans-serif';
      ctx.fillText(b.name, x + 16, y + 52);

      // Mock item rows
      for (let r = 0; r < 4; r++) {
        const itemY = y + 80 + r * 50;

        ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
        ctx.beginPath();
        ctx.roundRect(x + 12, itemY, cardWidth - 24, 38, 8);
        ctx.fill();

        // Dot favicon
        ctx.fillStyle = 'rgba(245, 185, 66, 0.7)';
        ctx.beginPath();
        ctx.arc(x + 28, itemY + 19, 5, 0, Math.PI * 2);
        ctx.fill();

        // Title placeholder line
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.fillRect(x + 44, itemY + 15, 120 - r * 15, 8);
      }
    });

    // Footer Watermark
    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.font = '14px "JetBrains Mono", monospace';
    ctx.fillText('POWERED BY LUMI LIST · BEAUTIFUL PERSONAL WORKSPACE BOARD', 100, 590);
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
      <div className="modal-content w-full max-w-3xl p-6 relative animate-modal">
        
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[var(--lumen-dim)] text-[var(--lumen-soft)] border border-[var(--lumen)]/30">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Social Share Card</h2>
              <p className="text-xs text-gray-400 mt-0.5">High-resolution 1200x630 preview graphic for social platforms</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors border-0 bg-transparent cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Canvas Render Container */}
        <div className="mt-5 relative rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-[var(--void)]">
          <canvas
            ref={canvasRef}
            className="w-full h-auto block rounded-xl"
            style={{ width: '100%', height: 'auto', aspectRatio: '1200 / 630' }}
          />
        </div>

        <div className="flex items-center justify-between mt-5 pt-4 border-t border-white/10">
          <div className="text-xs text-gray-400 flex items-center gap-1.5 font-mono">
            <Sparkles className="w-4 h-4 text-[var(--lumen-soft)]" />
            Ready to share or use as og:image
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="action-btn text-xs py-2 px-4"
            >
              Close
            </button>
            <button
              onClick={handleDownload}
              className="action-btn action-btn-primary text-xs py-2 px-5 flex items-center gap-2"
            >
              <Download className="w-4 h-4" /> Download PNG (1200x630)
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
