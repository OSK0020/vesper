import React, { useRef, useState } from 'react';
import { X, Download, Upload, RefreshCw, Check, AlertCircle, HardDrive, ShieldCheck } from 'lucide-react';
import { useEscapeClose } from '../utils/useEscapeClose';

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB Safety Limit

export default function ImportExportModal({ 
  isOpen, 
  onClose, 
  bookmarks, 
  customBoardsMeta = [],
  brightnessMode = 'luminous',
  glassMode = 'crystal',
  onImportFullWorkspace, 
  onResetData 
}) {
  const fileInputRef = useRef(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEscapeClose(isOpen, onClose);

  if (!isOpen) return null;

  const handleExport = () => {
    const pagesSet = new Set(bookmarks.map((b) => (b.pageName || 'HOME').toUpperCase()));
    const boardsSet = new Set(bookmarks.map((b) => (b.boardName || 'GENERAL').toUpperCase()));

    const exportObject = {
      exportType: 'vesper-full-workspace-backup',
      exportVersion: 2,
      generatedAt: new Date().toISOString(),
      product: {
        name: 'Vesper',
        description: 'Full workspace backup package for seamless computer transfer'
      },
      counts: {
        bookmarks: bookmarks.length,
        activeBookmarks: bookmarks.filter((b) => b.status !== 'deleted').length,
        pagesCount: pagesSet.size,
        boardsCount: boardsSet.size
      },
      bookmarks: bookmarks,
      customBoardsMeta: customBoardsMeta,
      preferences: {
        brightnessMode,
        glassMode
      }
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObject, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `vesper-workspace-backup-${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setSuccessMsg('Full workspace package exported successfully!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleFileUpload = (e) => {
    setErrorMsg('');
    setSuccessMsg('');
    const file = e.target.files[0];
    if (!file) return;

    // Safety Limit Check: Reject files larger than 5MB
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setErrorMsg(`File too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Maximum allowed backup file size is 5MB.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        
        // Support both legacy bookmarks array format & v2 full workspace format
        let importedBookmarks = [];
        let importedBoards = [];
        let importedPrefs = null;

        if (Array.isArray(json)) {
          importedBookmarks = json;
        } else if (json && Array.isArray(json.bookmarks)) {
          importedBookmarks = json.bookmarks;
          importedBoards = Array.isArray(json.customBoardsMeta) ? json.customBoardsMeta : [];
          importedPrefs = json.preferences || null;
        } else {
          setErrorMsg('Invalid backup file format: Missing "bookmarks" data.');
          return;
        }

        // Auto-generate missing boards/tables metadata if needed
        if (importedBoards.length === 0 && importedBookmarks.length > 0) {
          const autoBoardMap = new Map();
          importedBookmarks.forEach((b) => {
            const bName = (b.boardName || 'GENERAL').toUpperCase();
            const pName = (b.pageName || 'HOME').toUpperCase();
            const key = `${pName}:${bName}`;
            if (!autoBoardMap.has(key)) {
              autoBoardMap.set(key, {
                name: bName,
                pageName: pName,
                columnIndex: b.boardColumnIndex !== undefined ? b.boardColumnIndex : 0,
                accentHex: '#863bff'
              });
            }
          });
          importedBoards = Array.from(autoBoardMap.values());
        }

        onImportFullWorkspace({
          importedBookmarks,
          importedBoardsMeta: importedBoards,
          importedPreferences: importedPrefs
        });

        setSuccessMsg(`Successfully restored workspace! (${importedBookmarks.length} links, ${importedBoards.length} boards/tables)`);
        setTimeout(() => {
          setSuccessMsg('');
          onClose();
        }, 1800);
      } catch (err) {
        setErrorMsg('Error parsing JSON backup file. Please ensure it is a valid Vesper backup.');
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
              <HardDrive className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white tracking-tight">Computer Transfer & Backup</h2>
              <p className="text-xs text-gray-400 mt-1">Export your full workspace to transfer to a new computer</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition-colors border-0 bg-transparent cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Safety Badge Notice */}
        <div className="mb-6 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between text-xs text-gray-400 font-mono">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Local Storage Persistence</span>
          </div>
          <span className="text-[11px] text-gray-500">Max File Size: 5MB</span>
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
              <h3 className="text-sm font-bold text-white">Export Full Workspace</h3>
              <p className="text-xs text-gray-400 mt-1">Download links, boards & settings for computer transfer</p>
            </div>
            <button
              onClick={handleExport}
              className="action-btn action-btn-primary py-2.5 px-5 text-xs"
            >
              <Download className="w-4 h-4" /> Export Package
            </button>
          </div>

          {/* Import Option */}
          <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-between shadow-sm">
            <div>
              <h3 className="text-sm font-bold text-white">Import Workspace JSON</h3>
              <p className="text-xs text-gray-400 mt-1">Automatically rebuilds pages, boards & links (Max 5MB)</p>
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="action-btn py-2.5 px-5 text-xs"
            >
              <Upload className="w-4 h-4" /> Import Backup
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
              <h3 className="text-sm font-bold text-rose-300">Reset Local Storage</h3>
              <p className="text-xs text-rose-400/80 mt-1">Clear local data and restore initial default dataset</p>
            </div>
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to clear local storage and reset all boards to defaults?')) {
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
