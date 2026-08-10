import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  trendPercentage?: number;
  trendLabel?: string;
  icon?: LucideIcon;
  iconBgColor?: string;
  iconColor?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtext,
  trendPercentage,
  trendLabel = 'vs last month',
  icon: Icon
}) => {
  const isPositive = trendPercentage !== undefined && trendPercentage >= 0;

  return (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tighter">
          {title}
        </span>
        {Icon && (
          <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="text-2xl font-bold text-slate-900 dark:text-white mt-2 tracking-tight">
        {value}
      </div>

      {(trendPercentage !== undefined || subtext) && (
        <div className="flex items-center gap-1.5 mt-3 text-xs">
          {trendPercentage !== undefined && (
            <span className={`font-bold flex items-center gap-0.5 ${
              isPositive ? 'text-green-600 dark:text-emerald-400' : 'text-red-600 dark:text-rose-400'
            }`}>
              {isPositive ? '↑' : '↓'} {Math.abs(trendPercentage)}%
            </span>
          )}
          <span className="text-[10px] text-slate-400 dark:text-slate-500">
            {subtext || trendLabel}
          </span>
        </div>
      )}
    </div>
  );
};
