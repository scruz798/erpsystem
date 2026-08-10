import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useNotification } from '../../context/NotificationContext';
import { UserRole } from '../../types/erp';
import { 
  Sun, 
  Moon, 
  Bell, 
  Search, 
  ChevronDown, 
  LogOut, 
  ShieldCheck, 
  UserCheck, 
  Menu,
  Building2
} from 'lucide-react';

interface HeaderProps {
  onToggleMobileSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileSidebar }) => {
  const { currentUser, logout, switchRole, usersList } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { addNotification } = useNotification();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const roles: UserRole[] = [
    'Super Admin',
    'Sales Manager',
    'Finance Manager',
    'Store Keeper',
    'Purchasing Agent'
  ];

  return (
    <header className="sticky top-0 z-30 h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-8 flex items-center justify-between shrink-0 transition-colors">
      {/* Left Title & Mobile Toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <h1 className="text-lg font-semibold text-slate-900 dark:text-white tracking-tight">
          Enterprise Dashboard
        </h1>
      </div>

      {/* Center Search Bar */}
      <div className="hidden md:flex items-center relative w-64 lg:w-80">
        <Search className="w-4 h-4 absolute left-3.5 text-slate-400" />
        <input
          type="text"
          placeholder="Search SKUs, Orders, Invoices..."
          className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 transition-all"
        />
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4 sm:gap-6">
        {/* Quick Role Switcher Button */}
        <div className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span className="hidden sm:inline">Role:</span>
            <span className="font-bold">{currentUser?.role || 'Guest'}</span>
            <ChevronDown className="w-3 h-3 text-slate-500" />
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Switch Active Role
                </p>
              </div>
              {roles.map(r => (
                <button
                  key={r}
                  onClick={() => {
                    switchRole(r);
                    setShowRoleMenu(false);
                    addNotification('Role Switched', `Active role changed to ${r}`, 'info');
                  }}
                  className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer ${
                    currentUser?.role === r ? 'font-bold text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/30' : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span>{r}</span>
                  {currentUser?.role === r && <UserCheck className="w-3.5 h-3.5 text-blue-600" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          title="Toggle Dark/Light Mode"
          className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
        </button>

        {/* Notifications Bell */}
        <button
          onClick={() => addNotification('Notifications', 'System operating normally. 2 approvals pending.', 'info')}
          className="relative p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 border border-white dark:border-slate-900" />
        </button>

        <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800 hidden sm:block" />

        {/* System Version & Badge */}
        <div className="hidden sm:flex items-center gap-2">
          <span className="text-xs font-medium text-slate-600 dark:text-slate-400">HZHY_Global_v2.1</span>
          <span className="px-2 py-0.5 bg-green-100 dark:bg-emerald-950/60 text-green-700 dark:text-emerald-400 text-[10px] font-bold rounded uppercase">
            Stable
          </span>
        </div>
      </div>
    </header>
  );
};
