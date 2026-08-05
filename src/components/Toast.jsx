import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';

  return (
    <div className="fixed bottom-6 right-6 z-[9999] animate-toast">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-xl shadow-2xl ${
        isSuccess 
          ? 'bg-surface-3/95 border-accent-500/40 text-emerald-300 shadow-black/40' 
          : isError 
            ? 'bg-surface-3/95 border-rose-500/40 text-rose-300 shadow-rose-950/40' 
            : 'bg-surface-3/95 border-white/20 text-neutral-200 shadow-black/40'
      }`}>
        {isSuccess && <CheckCircle2 className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--violet-soft)' }} />}
        {isError && <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />}
        {!isSuccess && !isError && <Info className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--lumen-soft)' }} />}

        <span className="text-xs font-semibold text-white tracking-wide">
          {toast.message}
        </span>

        <button
          onClick={onClose}
          className="ml-2 p-1 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors border-0 bg-transparent cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
