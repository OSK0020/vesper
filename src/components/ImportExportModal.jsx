import React, { useRef, useState } from 'react';
import { X, Download, Upload, RefreshCw, Check, AlertCircle, HardDrive, ShieldCheck } from 'lucide-react';
import { useEscapeClose } from '../utils/useEscapeClose';

export default function ImportExportModal({ 
  isOpen, 
  onClose, 
  bookmarks = [], 
  onImportData, 
  onResetData 
}) {
  const fileInputRef = useRef(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEscapeClose(isOpen, onClose);

  if (!isOpen) return null;

  const handleExport = () => {
    const pagesSet = new Set(bookmarks.map((b) => b.pageName || 'HOME'));
    const boardsSet = new Set(bookmarks.map((b) => b.boardName || 'MAIN'));

    const exportObject = {
      exportType: 'lumilist-bookmark-portability',
      exportVersion: 1,
      generatedAt: new Date().toISOString(),
      product: {
        name: 'LumiList',
        dataType: 'bookmark-portability'
      },
      counts: {
        bookmarks: bookmarks.length,
        activeBookmarks: bookmarks.filter((b) => b.status !== 'deleted').length,
        pagesReferenced: pagesSet.size,
        boardsReferenced: boardsSet.size
      },
      bookmarks: bookmarks
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObject, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `lumilist-backup-${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setSuccessMsg('Bookmarks exported successfully!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleFileUpload = (e) => {
    setErrorMsg('');
    setSuccessMsg('');
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        if (json && Array.isArray(json.bookmarks)) {
          onImportData(json.bookmarks);
          setSuccessMsg(`Imported ${json.bookmarks.length} bookmarks!`);
          setTimeout(() => {
            setSuccessMsg('');
            onClose();
          }, 1500);
        } else {
          setErrorMsg('Invalid JSON: Missing "bookmarks" array.');
        }
      } catch (err) {
        setErrorMsg('Error parsing JSON file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content w-full max-w-2xl p-8 sm:p-10 relative animate-modal">
        
        {/* Header Section */}
        <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-md shrink-0 flex items-center justify-center">
              <HardDrive className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-semibold text-white tracking-tight leading-snug">Computer Transfer & Backup</h2>
              <p className="text-sm text-neutral-400">Import or export your full bookmark collection seamlessly</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-white/10 text-neutral-400 hover:text-white transition-colors border-0 bg-transparent cursor-pointer shrink-0 ml-4"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Safety Badge Notice */}
        <div className="mb-6 px-4 py-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between text-xs text-neutral-300 font-mono">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="font-medium">Local Storage Persistence</span>
          </div>
          <span className="px-2.5 py-1 text-xs rounded-lg bg-white/5 border border-white/10 text-neutral-400">JSON Portability</span>
        </div>

        {/* Notifications */}
        {successMsg && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5 shadow-lg">
            <Check className="w-5 h-5 flex-shrink-0 text-emerald-400" />
            <span className="font-semibold">{successMsg}</span>
          </div>
        )}
        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5 shadow-lg">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-400" />
            <span className="font-semibold">{errorMsg}</span>
          </div>
        )}

        {/* Action List / Cards */}
        <div className="flex flex-col gap-4">
          
          {/* Export Option */}
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-emerald-500/30 transition-all flex items-center justify-between gap-6 shadow-sm">
            <div className="min-w-0 pr-2">
              <h3 className="text-base font-semibold text-white leading-snug">Export Full Workspace</h3>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">Download current dataset ({bookmarks.length} links) as a JSON package</p>
            </div>
            <button
              onClick={handleExport}
              className="action-btn action-btn-primary h-10 px-5 text-xs font-semibold shrink-0"
            >
              <Download className="w-4 h-4" /> Export Package
            </button>
          </div>

          {/* Import Option */}
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-emerald-500/30 transition-all flex items-center justify-between gap-6 shadow-sm">
            <div className="min-w-0 pr-2">
              <h3 className="text-base font-semibold text-white leading-snug">Import Workspace JSON</h3>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">Load bookmarks from a valid `.json` backup file</p>
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
              className="action-btn h-10 px-5 text-xs font-semibold shrink-0"
            >
              <Upload className="w-4 h-4 text-emerald-400" /> Import Backup
            </button>
          </div>

          {/* Reset Option */}
          <div className="p-5 rounded-2xl bg-rose-500/[0.05] border border-rose-500/20 hover:border-rose-500/30 transition-all flex items-center justify-between gap-6">
            <div className="min-w-0 pr-2">
              <h3 className="text-base font-semibold text-rose-300 leading-snug">Reset Local Storage</h3>
              <p className="text-xs text-rose-400/80 mt-1 leading-relaxed">Clear local data and restore original preloaded bookmarks dataset</p>
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
              className="action-btn h-10 px-5 text-xs font-semibold border-rose-500/40 text-rose-300 hover:bg-rose-500/20 shrink-0"
            >
              <RefreshCw className="w-4 h-4" /> Reset
            </button>
          </div>

        </div>

        {/* Dedicated Footer Action Bar */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
          <p className="text-xs text-neutral-500 font-mono">Compatible with official LumiList & Vesper backup schemas</p>
          <button
            onClick={onClose}
            className="action-btn h-10 px-6 font-semibold"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}


