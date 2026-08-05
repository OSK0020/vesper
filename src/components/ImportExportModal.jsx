import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Upload, RefreshCw, HardDrive, ShieldCheck, Check, AlertCircle } from 'lucide-react';
import { useEscapeClose } from '../utils/useEscapeClose';
import { scaleIn, easeVesper } from '../utils/motion';

export default function ImportExportModal({
  isOpen,
  onClose,
  bookmarks = [],
  boards = [],
  pages = [],
  onImportData,
  onResetData
}) {
  const fileInputRef = useRef(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEscapeClose(isOpen, onClose);

  const handleExport = () => {
    try {
      const dataStr = JSON.stringify({ bookmarks, boards, pages }, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `lumilist-backup-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setSuccessMsg('Workspace backup exported successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setErrorMsg('Failed to export backup JSON.');
      setTimeout(() => setErrorMsg(''), 3000);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (onImportData) {
          onImportData(imported);
          setSuccessMsg('Backup JSON imported successfully!');
          setTimeout(() => {
            setSuccessMsg('');
            onClose();
          }, 1500);
        }
      } catch (err) {
        setErrorMsg('Invalid JSON backup file structure.');
        setTimeout(() => setErrorMsg(''), 3000);
      }
    };
    reader.readAsText(file);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8 overflow-y-auto">
          
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-2xl"
            onClick={onClose}
          />

          {/* Modal Panel */}
          <motion.div
            initial={scaleIn.initial}
            animate={scaleIn.animate}
            exit={scaleIn.exit}
            transition={{ duration: 0.25, ease: easeVesper }}
            className="relative z-10 w-full max-w-2xl rounded-2xl overflow-hidden my-auto"
            style={{
              background: 'linear-gradient(135deg, #0e1217 0%, #080a0e 100%)',
              border: '1px solid rgba(255,255,255,0.12)',
              boxShadow: '0 0 0 1px rgba(255,255,255,0.05), 0 40px 100px -20px rgba(0,0,0,0.95), 0 0 60px -20px rgba(16, 185, 129, 0.2)'
            }}
            role="dialog"
            aria-modal="true"
          >
            {/* Top Accent Line */}
            <div className="h-[2px] w-full" style={{ background: 'linear-gradient(90deg, transparent 0%, #10b981 50%, transparent 100%)' }} />

            {/* Header Section */}
            <div className="flex items-center justify-between px-8 pt-7 pb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', boxShadow: '0 0 20px rgba(16,185,129,0.2)' }}>
                  <HardDrive className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white tracking-tight leading-snug">Computer Transfer & Backup</h2>
                  <p className="text-sm text-zinc-400 mt-0.5 leading-normal">Import or export your full bookmark collection seamlessly</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-all border-0 bg-transparent cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Divider */}
            <div className="h-px mx-8 bg-white/[0.08]" />

            <div className="px-8 py-7 flex flex-col gap-6">
              {/* Safety Badge Notice */}
              <div className="px-5 py-4 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-between text-xs text-zinc-300">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span className="font-semibold text-sm">Local Storage Persistence</span>
                </div>
                <span className="px-3 py-1 text-xs font-mono rounded-lg bg-white/5 border border-white/10 text-zinc-400">JSON Portability</span>
              </div>

              {/* Notifications */}
              {successMsg && (
                <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-sm flex items-center gap-3 shadow-lg">
                  <Check className="w-5 h-5 flex-shrink-0 text-emerald-400" />
                  <span className="font-semibold">{successMsg}</span>
                </div>
              )}
              {errorMsg && (
                <div className="p-4 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-sm flex items-center gap-3 shadow-lg">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-400" />
                  <span className="font-semibold">{errorMsg}</span>
                </div>
              )}

              {/* Action Cards */}
              <div className="flex flex-col gap-4">
                
                {/* Export Option */}
                <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.09] hover:border-emerald-500/30 transition-all flex items-center justify-between gap-6 shadow-sm">
                  <div className="min-w-0">
                    <h3 className="text-base font-bold text-white leading-snug">Export Full Workspace</h3>
                    <p className="text-xs text-zinc-400 mt-1 leading-relaxed">Download your links ({bookmarks.length}), boards & settings as a JSON package</p>
                  </div>
                  <button
                    onClick={handleExport}
                    className="h-11 px-6 rounded-xl text-sm font-bold text-black transition-all cursor-pointer hover:brightness-110 active:scale-95 shrink-0 flex items-center gap-2"
                    style={{ background: '#10b981', boxShadow: '0 4px 18px rgba(16,185,129,0.35)' }}
                  >
                    <Download className="w-4 h-4" /> Export Package
                  </button>
                </div>

                {/* Import Option */}
                <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.09] hover:border-emerald-500/30 transition-all flex items-center justify-between gap-6 shadow-sm">
                  <div className="min-w-0">
                    <h3 className="text-base font-bold text-white leading-snug">Import Workspace JSON</h3>
                    <p className="text-xs text-zinc-400 mt-1 leading-relaxed">Restore your pages, boards & bookmarks from a backup JSON file</p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current && fileInputRef.current.click()}
                    className="h-11 px-6 rounded-xl text-sm font-semibold text-white transition-all cursor-pointer hover:bg-white/10 shrink-0 flex items-center gap-2"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}
                  >
                    <Upload className="w-4 h-4 text-emerald-400" /> Import Backup
                  </button>
                </div>

                {/* Reset Option */}
                <div className="p-6 rounded-2xl bg-rose-500/[0.04] border border-rose-500/20 hover:border-rose-500/35 transition-all flex items-center justify-between gap-6">
                  <div className="min-w-0">
                    <h3 className="text-base font-bold text-rose-300 leading-snug">Reset Local Storage</h3>
                    <p className="text-xs text-rose-400/70 mt-1 leading-relaxed">Clear all local data and restore initial default dataset</p>
                  </div>
                  <button
                    onClick={() => {
                      if (window.confirm('Reset all bookmarks to original initial dataset?')) {
                        onResetData();
                        setSuccessMsg('Reset completed!');
                        setTimeout(() => {
                          setSuccessMsg('');
                          onClose();
                        }, 1500);
                      }
                    }}
                    className="h-11 px-6 rounded-xl text-sm font-semibold text-rose-300 transition-all cursor-pointer hover:bg-rose-500/20 shrink-0 flex items-center gap-2"
                    style={{ background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.25)' }}
                  >
                    <RefreshCw className="w-4 h-4" /> Reset
                  </button>
                </div>

              </div>
            </div>

            {/* Divider */}
            <div className="h-px mx-8 bg-white/[0.08]" />

            {/* Dedicated Floating Footer Action Bar */}
            <div className="px-8 py-6 flex items-center justify-between">
              <p className="text-xs text-zinc-500 font-mono">Compatible with official Vesper & LumiList backup schemas</p>
              <button
                onClick={onClose}
                className="h-11 px-7 rounded-xl text-sm font-semibold text-zinc-300 hover:text-white transition-all cursor-pointer"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}
              >
                Close
              </button>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
