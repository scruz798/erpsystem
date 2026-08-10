import React from 'react';
import { DepartmentKey } from '../../types/erp';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  TrendingUp, 
  DollarSign, 
  Boxes, 
  ShoppingBag, 
  ShieldAlert, 
  Lock, 
  ChevronRight,
  Server,
  LogOut,
  X
} from 'lucide-react';

interface SidebarProps {
  activeTab: DepartmentKey;
  onSelectTab: (tab: DepartmentKey) => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  isMobileOpen,
  onCloseMobile
}) => {
  const { hasPermission, currentUser, logout } = useAuth();

  const navItems: { key: DepartmentKey; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string }[] = [
    { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { key: 'sales', label: 'Sales Dept.', icon: TrendingUp, badge: 'Active' },
    { key: 'finance', label: 'Finance Dept.', icon: DollarSign },
    { key: 'store', label: 'Store Dept.', icon: Boxes },
    { key: 'purchasing', label: 'Purchasing Dept.', icon: ShoppingBag },
    { key: 'admin', label: 'Admin Dept.', icon: ShieldAlert, badge: 'API' }
  ];

  const handleTabClick = (key: DepartmentKey) => {
    if (!hasPermission(key, 'view')) {
      return;
    }
    onSelectTab(key);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-950/70 z-40 lg:hidden backdrop-blur-xs"
        />
      )}

      <aside className={`
        fixed lg:static top-0 left-0 z-50 h-full w-64 bg-slate-900 text-white border-r border-slate-800 flex flex-col transition-transform duration-200 ease-in-out shrink-0
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Brand Logo Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-bold text-lg text-white shadow-sm">
              H
            </div>
            <span className="font-bold text-xl tracking-tight text-white">
              HZHY <span className="text-blue-400">ERP</span>
            </span>
          </div>
          <button
            onClick={onCloseMobile}
            className="lg:hidden text-slate-400 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          <div className="text-xs font-semibold text-slate-500 uppercase px-3 mb-2 tracking-wider">
            Modules
          </div>

          <div className="space-y-1">
            {navItems.map(item => {
              const canView = hasPermission(item.key, 'view');
              const isActive = activeTab === item.key;
              const Icon = item.icon;

              return (
                <button
                  key={item.key}
                  disabled={!canView}
                  onClick={() => handleTabClick(item.key)}
                  className={`
                    w-full flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-medium transition-colors cursor-pointer group
                    ${isActive 
                      ? 'bg-blue-600 text-white shadow-sm' 
                      : canView 
                      ? 'text-slate-300 hover:bg-slate-800 hover:text-white' 
                      : 'text-slate-600 cursor-not-allowed opacity-50 bg-slate-950/20'}
                  `}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : canView ? 'text-slate-400 group-hover:text-blue-400' : 'text-slate-600'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {item.badge && canView && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                        isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-blue-400 border border-slate-700'
                      }`}>
                        {item.badge}
                      </span>
                    )}

                    {!canView && (
                      <Lock className="w-3.5 h-3.5 text-slate-600" />
                    )}

                    {canView && isActive && (
                      <ChevronRight className="w-3.5 h-3.5 text-white/80" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* System Section */}
          <div className="pt-6">
            <div className="text-xs font-semibold text-slate-500 uppercase px-3 mb-2 tracking-wider">
              System
            </div>
            <button
              onClick={() => handleTabClick('admin')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors text-left ${
                activeTab === 'admin' ? 'bg-slate-800 text-blue-400 font-semibold' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <Server className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="truncate">Laravel API v1</span>
            </button>
          </div>
        </nav>

        {/* User Profile Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800">
          <div className="flex items-center gap-3">
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
              alt={currentUser?.name}
              className="w-8 h-8 rounded-full bg-slate-700 object-cover border border-slate-600 shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{currentUser?.name || 'James Smith'}</p>
              <p className="text-[10px] text-slate-500 truncate italic">{currentUser?.role || 'Admin Role'}</p>
            </div>
            <button
              onClick={logout}
              title="Log Out"
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-900 rounded transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
