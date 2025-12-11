import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface ToastMessage {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 3000);
  }, []);

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 flex flex-col gap-2 pointer-events-none w-full max-w-sm px-4">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`
              pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border transition-all duration-300
              ${toast.type === 'success' ? 'bg-white dark:bg-slate-800 border-green-200 dark:border-green-900/50' : ''}
              ${toast.type === 'error' ? 'bg-white dark:bg-slate-800 border-red-200 dark:border-red-900/50' : ''}
              ${toast.type === 'info' ? 'bg-white dark:bg-slate-800 border-blue-200 dark:border-blue-900/50' : ''}
            `}
          >
            <div className={`
              ${toast.type === 'success' ? 'text-green-500' : ''}
              ${toast.type === 'error' ? 'text-red-500' : ''}
              ${toast.type === 'info' ? 'text-blue-500' : ''}
            `}>
              {toast.type === 'success' && <CheckCircle size={20} />}
              {toast.type === 'error' && <AlertCircle size={20} />}
              {toast.type === 'info' && <Info size={20} />}
            </div>
            
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200 flex-1">{toast.message}</span>
            
            <button 
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
