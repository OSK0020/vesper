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
      exportType: 'vesper-bookmark-portability',
      exportVersion: 1,
      generatedAt: new Date().toISOString(),
      product: {
        name: 'Vesper',
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
    downloadAnchor.setAttribute("download", `vesper-backup-${new Date().toISOString().slice(0,10)}.json`);
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
      <div className="modal-content w-full max-w-lg p-8 sm:p-10 relative animate-modal">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-7">
          <div className="flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-[var(--violet-dim)] text-[var(--violet-soft)] border border-[var(--violet)]/30 shadow-lg">
              <Download className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white tracking-tight">Backup & Restore</h2>
              <p className="text-xs text-gray-400 mt-1">Import or export your Vesper collection</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition-colors border-0 bg-transparent cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success/Error Alerts */}
        {successMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5 shadow-lg">
            <Check className="w-5 h-5 flex-shrink-0" />
            <span className="font-semibold">{successMsg}</span>
          </div>
        )}
        {errorMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5 shadow-lg">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="font-semibold">{errorMsg}</span>
          </div>
        )}

        {/* Action Options */}
        <div className="flex flex-col gap-5">
          
          {/* Export Option */}
          <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-between shadow-sm">
            <div>
              <h3 className="text-sm font-bold text-white">Export Bookmarks</h3>
              <p className="text-xs text-gray-400 mt-1">Save current links as a JSON file</p>
            </div>
            <button
              onClick={handleExport}
              className="action-btn action-btn-primary py-2.5 px-5 text-xs"
            >
              <Download className="w-4 h-4" /> Export
            </button>
          </div>

          {/* Import Option */}
          <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-between shadow-sm">
            <div>
              <h3 className="text-sm font-bold text-white">Import Bookmarks</h3>
              <p className="text-xs text-gray-400 mt-1">Load from a previously saved JSON</p>
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="action-btn py-2.5 px-5 text-xs"
            >
              <Upload className="w-4 h-4" /> Import
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>

          {/* Reset Option */}
          <div className="p-5 rounded-2xl bg-rose-500/[0.06] border border-rose-500/20 flex items-center justify-between mt-2">
            <div>
              <h3 className="text-sm font-bold text-rose-300">Reset to Defaults</h3>
              <p className="text-xs text-rose-400/80 mt-1">Restore initial sample dataset</p>
            </div>
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to reset all data to default bookmarks?')) {
                  onResetData();
                  onClose();
                }
              }}
              className="action-btn text-xs py-2.5 px-5 border-rose-500/40 text-rose-300 hover:bg-rose-500/20"
            >
              <RefreshCw className="w-4 h-4" /> Reset
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-end mt-8 pt-6 pb-1 border-t border-white/10">
          <button
            onClick={onClose}
            className="action-btn px-8"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
