import React, { useRef, useState } from 'react';
import { X, Download, Upload, RefreshCw, Check, AlertCircle } from 'lucide-react';
import { useEscapeClose } from '../utils/useEscapeClose';

export default function ImportExportModal({ 
  isOpen, 
  onClose, 
  bookmarks, 
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
        activeBookmarks: bookmarks.filter(b => b.status !== 'deleted').length,
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
      <div className="modal-content w-full max-w-md p-6 relative animate-modal">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[var(--violet-dim)] text-[var(--violet-soft)] border border-[var(--violet)]/30">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Backup & Restore</h2>
              <p className="text-xs text-gray-400 mt-0.5">Import or export your LumiList bookmark collection</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors border-0 bg-transparent cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notifications */}
        {successMsg && (
          <div className="mt-4 p-3 rounded-xl bg-[var(--violet-dim)] border border-[var(--violet)]/40 text-[var(--violet-soft)] text-xs flex items-center gap-2">
            <Check className="w-4 h-4" /> {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="mt-4 p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4" /> {errorMsg}
          </div>
        )}

        {/* Action Grid */}
        <div className="mt-5 flex flex-col gap-3">
          
          {/* Export */}
          <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-between gap-4 hover:border-[var(--violet)]/30 transition-colors">
            <div>
              <h4 className="text-sm font-bold text-white">Export Bookmarks</h4>
              <p className="text-xs text-gray-400 mt-0.5">Download current dataset ({bookmarks.length} links) as JSON</p>
            </div>
            <button
              onClick={handleExport}
              className="action-btn action-btn-primary text-xs py-2 px-3.5 flex-shrink-0"
            >
              <Download className="w-3.5 h-3.5" /> Export
            </button>
          </div>

          {/* Import */}
          <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-between gap-4 hover:border-[var(--violet)]/30 transition-colors">
            <div>
              <h4 className="text-sm font-bold text-white">Import JSON File</h4>
              <p className="text-xs text-gray-400 mt-0.5">Load bookmarks from a `.json` backup file</p>
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
              className="action-btn text-xs py-2 px-3.5 flex-shrink-0"
            >
              <Upload className="w-3.5 h-3.5 text-[var(--lumen-soft)]" /> Import
            </button>
          </div>

          {/* Reset */}
          <div className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/20 flex items-center justify-between gap-4 mt-2">
            <div>
              <h4 className="text-sm font-bold text-rose-300">Reset to Defaults</h4>
              <p className="text-xs text-gray-400 mt-0.5">Restore original preloaded bookmarks dataset</p>
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
              className="px-3 py-1.5 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold hover:bg-rose-500/30 transition-colors border-0 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-white/10 text-center">
          <p className="text-[11px] text-gray-500">Fully compatible with official LumiList export schema</p>
        </div>

      </div>
    </div>
  );
}
