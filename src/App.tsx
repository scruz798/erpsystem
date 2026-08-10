import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { DepartmentKey } from './types/erp';

// Layout Components
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { LoginPage } from './components/auth/LoginPage';

// Department Module Views
import { OverviewDashboard } from './components/dashboard/OverviewDashboard';
import { SalesDepartment } from './components/sales/SalesDepartment';
import { FinanceDepartment } from './components/finance/FinanceDepartment';
import { StoreDepartment } from './components/store/StoreDepartment';
import { PurchasingDepartment } from './components/purchasing/PurchasingDepartment';
import { AdminDepartment } from './components/admin/AdminDepartment';

const MainLayout: React.FC = () => {
  const { isAuthenticated, hasPermission } = useAuth();
  const [activeTab, setActiveTab] = useState<DepartmentKey>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-150">
      {/* Top Header Navigation */}
      <Header onToggleMobileSidebar={() => setIsMobileSidebarOpen(prev => !prev)} />

      {/* Body Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={tab => setActiveTab(tab)}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Main Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          {activeTab === 'dashboard' && (
            <OverviewDashboard onNavigateTab={tab => setActiveTab(tab)} />
          )}

          {activeTab === 'sales' && hasPermission('sales', 'view') && (
            <SalesDepartment />
          )}

          {activeTab === 'finance' && hasPermission('finance', 'view') && (
            <FinanceDepartment />
          )}

          {activeTab === 'store' && hasPermission('store', 'view') && (
            <StoreDepartment />
          )}

          {activeTab === 'purchasing' && hasPermission('purchasing', 'view') && (
            <PurchasingDepartment />
          )}

          {activeTab === 'admin' && hasPermission('admin', 'view') && (
            <AdminDepartment />
          )}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <MainLayout />
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
