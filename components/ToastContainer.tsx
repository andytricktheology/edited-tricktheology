
import React from 'react';
import { useToast } from '../context/ToastContext';

const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-4 w-full max-w-sm pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            pointer-events-auto
            flex items-center gap-4 p-5 rounded-2xl border backdrop-blur-xl shadow-2xl animate-wipe-in
            ${toast.type === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-400' : ''}
            ${toast.type === 'error' ? 'bg-red-500/10 border-red-500/30 text-red-400' : ''}
            ${toast.type === 'info' ? 'bg-brand-start/10 border-brand-start/30 text-brand-start' : ''}
          `}
        >
          <div className={`
            w-10 h-10 rounded-xl flex items-center justify-center text-lg
            ${toast.type === 'success' ? 'bg-green-500/20' : ''}
            ${toast.type === 'error' ? 'bg-red-500/20' : ''}
            ${toast.type === 'info' ? 'bg-brand-start/20' : ''}
          `}>
            {toast.type === 'success' ? '✓' : toast.type === 'error' ? '!' : 'i'}
          </div>
          
          <div className="flex-grow">
            <p className="font-orbitron font-bold text-[10px] uppercase tracking-widest mb-1 opacity-50">
              {toast.type} Node Update
            </p>
            <p className="font-exo font-medium text-sm leading-tight text-white">
              {toast.message}
            </p>
          </div>

          <button
            onClick={() => removeToast(toast.id)}
            className="text-slate-500 hover:text-white transition-colors p-2"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
