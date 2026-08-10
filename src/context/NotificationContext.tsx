import React, { createContext, useContext, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';

export type NotificationType = 'success' | 'warning' | 'error' | 'info';

export interface ToastNotification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
}

interface NotificationContextType {
  addNotification: (title: string, message: string, type?: NotificationType) => void;
  removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<ToastNotification[]>([]);

  const addNotification = (title: string, message: string, type: NotificationType = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setNotifications(prev => [...prev, { id, title, message, type }]);

    setTimeout(() => {
      removeNotification(id);
    }, 4500);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ addNotification, removeNotification }}>
      {children}
      
      {/* Toast Render Overlay */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-md w-full pointer-events-none px-4 sm:px-0">
        <AnimatePresence>
          {notifications.map(n => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className={`pointer-events-auto p-4 rounded-xl border shadow-xl flex items-start gap-3 backdrop-blur-md ${
                n.type === 'success' 
                  ? 'bg-emerald-950/90 text-emerald-100 border-emerald-700/50 dark:bg-emerald-950/95 dark:text-emerald-100'
                  : n.type === 'warning'
                  ? 'bg-amber-950/90 text-amber-100 border-amber-700/50 dark:bg-amber-950/95 dark:text-amber-100'
                  : n.type === 'error'
                  ? 'bg-rose-950/90 text-rose-100 border-rose-700/50 dark:bg-rose-950/95 dark:text-rose-100'
                  : 'bg-slate-900/90 text-slate-100 border-slate-700/50'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {n.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                {n.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-400" />}
                {n.type === 'error' && <XCircle className="w-5 h-5 text-rose-400" />}
                {n.type === 'info' && <Info className="w-5 h-5 text-sky-400" />}
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold tracking-wide">{n.title}</h4>
                <p className="text-xs opacity-90 mt-0.5 leading-relaxed">{n.message}</p>
              </div>

              <button
                onClick={() => removeNotification(n.id)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
