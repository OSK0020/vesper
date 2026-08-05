import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Share2, Sparkles } from 'lucide-react';
import { useEscapeClose } from '../utils/useEscapeClose';
import { scaleIn, easeVesper } from '../utils/motion';

export default function ShareCardModal({
  isOpen,
  onClose,
  pageName = 'MAIN',
  bookmarkCount = 0,
  boardCount = 0
}) {
  const canvasRef = useRef(null);

  useEscapeClose(isOpen, onClose);

  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // 1200x630 Social Preview Card Dimensions
    canvas.width = 1200;
    canvas.height = 630;

    // Background Dark Gradient
    const bgGradient = ctx.createLinearGradient(0, 0, 1200, 630);
    bgGradient.addColorStop(0, '#080c09');
    bgGradient.addColorStop(0.5, '#0e1711');
    bgGradient.addColorStop(1, '#050a07');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, 1200, 630);

    // Glowing Ambient Mesh Orbs
    const glow1 = ctx.createRadialGradient(950, 150, 10, 950, 150, 450);
    glow1.addColorStop(0, 'rgba(16, 185, 129, 0.25)');
    glow1.addColorStop(1, 'rgba(16, 185, 129, 0)');
    ctx.fillStyle = glow1;
    ctx.fillRect(0, 0, 1200, 630);

    const glow2 = ctx.createRadialGradient(250, 500, 10, 250, 500, 400);
    glow2.addColorStop(0, 'rgba(5, 150, 105, 0.18)');
    glow2.addColorStop(1, 'rgba(5, 150, 105, 0)');
    ctx.fillStyle = glow2;
    ctx.fillRect(0, 0, 1200, 630);

    // Subtle Grid Overlay Lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1;
    for (let x = 0; x < 1200; x += 60) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 630);
      ctx.stroke();
    }
    for (let y = 0; y < 630; y += 60) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(1200, y);
      ctx.stroke();
    }

    // Glass Card Frame
    ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(80, 80, 1040, 470, 28);
    ctx.fill();
    ctx.stroke();

    // Brand Eyebrow Badge
    ctx.fillStyle = 'rgba(16, 185, 129, 0.15)';
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.35)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(120, 130, 320, 40, 20);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(144, 150, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#34d399';
    ctx.font = '600 13px "Inter", sans-serif';
    ctx.fillText('YOUR DIGITAL SPACE, ILLUMINATED', 160, 154);

    // Title: VESPER
    ctx.fillStyle = '#ffffff';
    ctx.font = '800 76px "Inter", sans-serif';
    ctx.fillText('VESPER', 120, 260);

    // Tagline Subtitle
    ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
    ctx.font = '400 22px "Inter", sans-serif';
    ctx.fillText(`Curated Workspace Collection · ${pageName} Tab`, 120, 310);

    // Stats Grid Container
    ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.beginPath();
    ctx.roundRect(120, 370, 960, 130, 20);
    ctx.fill();
    ctx.stroke();

    // Stat 1: Bookmarks
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 42px "Inter", sans-serif';
    ctx.fillText(String(bookmarkCount), 160, 435);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '600 14px "Inter", sans-serif';
    ctx.fillText('TOTAL LINKS', 160, 465);

    // Stat 2: Boards
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 42px "Inter", sans-serif';
    ctx.fillText(String(boardCount), 450, 435);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '600 14px "Inter", sans-serif';
    ctx.fillText('ACTIVE BOARDS', 450, 465);

    // Stat 3: Powered by Vesper
    ctx.fillStyle = '#34d399';
    ctx.font = '700 28px "Inter", sans-serif';
    ctx.fillText('VESPER JET', 800, 435);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '600 14px "Inter", sans-serif';
    ctx.fillText('VESPER-JET.VERCEL.APP', 800, 465);

  }, [isOpen, pageName, bookmarkCount, boardCount]);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const image = canvasRef.current.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = image;
    link.download = `vesper-${pageName.toLowerCase()}-card.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-10">
          
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-2xl"
            onClick={onClose}
          />

          {/* Modal Panel */}
          <motion.div
            initial={scaleIn.initial}
            animate={scaleIn.animate}
            exit={scaleIn.exit}
            transition={{ duration: 0.2, ease: easeVesper }}
            className="relative z-10 w-full max-w-4xl rounded-3xl bg-[#0c120e]/90 backdrop-blur-3xl border border-white/15 shadow-[0_24px_80px_-16px_rgb(0_0_0_/_0.6)] p-8 sm:p-10"
            role="dialog"
            aria-modal="true"
          >
            
            {/* Header Section */}
            <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-6">
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

            {/* Floating Action Footer Bar */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10 gap-6">
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

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
