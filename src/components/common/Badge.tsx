import React from 'react';

export type BadgeVariant = 'emerald' | 'amber' | 'rose' | 'sky' | 'indigo' | 'slate' | 'violet';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'slate', className = '' }) => {
  const styles: Record<BadgeVariant, string> = {
    emerald: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20',
    amber: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20',
    rose: 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20',
    sky: 'bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/20',
    indigo: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/20',
    violet: 'bg-violet-500/10 text-violet-700 dark:text-violet-400 border-violet-500/20',
    slate: 'bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/20'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles[variant]} ${className}`}>
      {children}
    </span>
  );
};
