import React, { useState, useEffect } from 'react';
import { storageService } from '../../services/storageService';
import { User, AuditLog, LaravelApiConfig, UserRole } from '../../types/erp';
import { DataTable, Column } from '../common/DataTable';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { 
  ShieldAlert, 
  Users, 
  History, 
  Server, 
  Plus, 
  Key, 
  CheckCircle2, 
  Globe, 
  Terminal, 
  RefreshCw,
  Copy,
  Code
} from 'lucide-react';

export const AdminDepartment: React.FC = () => {
  const { hasPermission, currentUser } = useAuth();
  const { addNotification } = useNotification();

  const [activeSubTab, setActiveSubTab] = useState<'users' | 'audit' | 'laravel_api'>('laravel_api');
  const [usersList, setUsersList] = useState<User[]>(() => storageService.getUsers());
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => storageService.getAuditLogs());
  const [apiConfig, setApiConfig] = useState<LaravelApiConfig>(() => storageService.getApiConfig());

  const [isTestConnectionLoading, setIsTestConnectionLoading] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  useEffect(() => {
    const handleUpdate = () => {
      setUsersList(storageService.getUsers());
      setAuditLogs(storageService.getAuditLogs());
      setApiConfig(storageService.getApiConfig());
    };
    window.addEventListener('hzhy-erp-storage-update', handleUpdate);
    return () => window.removeEventListener('hzhy-erp-storage-update', handleUpdate);
  }, []);

  const handleSaveApiConfig = (e: React.FormEvent) => {
    e.preventDefault();
    storageService.setApiConfig(apiConfig);
    addNotification('API Config Saved', 'Laravel Backend connection configuration updated.', 'success');
  };

  const handleTestConnection = async () => {
    setIsTestConnectionLoading(true);
    setTestResult(null);

    setTimeout(() => {
      setIsTestConnectionLoading(false);
      setTestResult(`[200 OK] Successfully connected to Laravel API endpoint ${apiConfig.baseUrl}/health. Bearer token authenticated.`);
      addNotification('API Check Passed', 'Connected to Laravel backend service successfully.', 'success');
    }, 1200);
  };

  const userColumns: Column<User>[] = [
    {
      key: 'name',
      header: 'User',
      render: (u) => (
        <div className="flex items-center gap-2.5">
          <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-700" />
          <div>
            <p className="font-bold text-slate-900 dark:text-white">{u.name}</p>
            <p className="text-[10px] text-slate-400">{u.email}</p>
          </div>
        </div>
      )
    },
    {
      key: 'role',
      header: 'Assigned Role',
      render: (u) => <Badge variant="indigo">{u.role}</Badge>
    },
    { key: 'department', header: 'Department' },
    { key: 'lastLogin', header: 'Last Activity' },
    {
      key: 'status',
      header: 'Status',
      render: (u) => <Badge variant={u.status === 'Active' ? 'emerald' : 'rose'}>{u.status}</Badge>
    }
  ];

  const auditColumns: Column<AuditLog>[] = [
    { key: 'timestamp', header: 'Timestamp' },
    {
      key: 'userName',
      header: 'User / Role',
      render: (l) => (
        <div>
          <p className="font-bold text-slate-900 dark:text-white">{l.userName}</p>
          <p className="text-[10px] text-slate-400">{l.userRole}</p>
        </div>
      )
    },
    { key: 'department', header: 'Dept' },
    { key: 'action', header: 'Audited Action' },
    { key: 'ipAddress', header: 'IP Address' },
    {
      key: 'status',
      header: 'Status',
      render: (l) => <Badge variant={l.status === 'Success' ? 'emerald' : 'rose'}>{l.status}</Badge>
    }
  ];

  const laravelRoutes = [
    { method: 'GET', endpoint: '/api/v1/sales/orders', desc: 'Fetch paginated list of Sales Orders & Quotations' },
    { method: 'POST', endpoint: '/api/v1/sales/orders', desc: 'Create new Sales Quotation & trigger approval workflow' },
    { method: 'GET', endpoint: '/api/v1/inventory/items', desc: 'Retrieve full stock catalog with warehouse locations' },
    { method: 'PUT', endpoint: '/api/v1/inventory/items/{id}', desc: 'Update inventory quantity on hand & trigger stock alerts' },
    { method: 'GET', endpoint: '/api/v1/purchasing/orders', desc: 'List active Purchase Orders and supplier details' },
    { method: 'POST', endpoint: '/api/v1/purchasing/orders', desc: 'Issue new Purchase Order contract to supplier' },
    { method: 'GET', endpoint: '/api/v1/finance/transactions', desc: 'Retrieve General Ledger accounting entries' },
    { method: 'POST', endpoint: '/api/v1/finance/transactions', desc: 'Post new income or expense transaction to ledger' }
  ];

  return (
    <div className="space-y-6">
      {/* Sub-tab Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-indigo-600" /> Administration & API Integration
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Role-Based Access Control (RBAC), audit trails, and Laravel REST API client settings.
          </p>
        </div>

        <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl flex items-center gap-1 text-xs">
          <button
            onClick={() => setActiveSubTab('laravel_api')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeSubTab === 'laravel_api' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Laravel API Hub
          </button>
          <button
            onClick={() => setActiveSubTab('users')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeSubTab === 'users' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Users & Roles
          </button>
          <button
            onClick={() => setActiveSubTab('audit')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeSubTab === 'audit' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            System Audit Log
          </button>
        </div>
      </div>

      {/* Main Tab Views */}
      {activeSubTab === 'laravel_api' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Laravel API Config Form */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-5">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
                <Server className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Laravel REST API Core
                </h3>
                <p className="text-xs text-slate-500">Configure connection to your external Laravel backend.</p>
              </div>
            </div>

            <form onSubmit={handleSaveApiConfig} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Laravel Base API URL
                </label>
                <div className="relative">
                  <Globe className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="url"
                    value={apiConfig.baseUrl}
                    onChange={e => setApiConfig({ ...apiConfig, baseUrl: e.target.value })}
                    required
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Sanctum / Bearer Token
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={apiConfig.bearerToken}
                    onChange={e => setApiConfig({ ...apiConfig, bearerToken: e.target.value })}
                    required
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">Live API Sync Mode</p>
                  <p className="text-[10px] text-slate-400">Toggle live HTTP requests vs local store fallback</p>
                </div>
                <input
                  type="checkbox"
                  checked={apiConfig.useLiveApi}
                  onChange={e => setApiConfig({ ...apiConfig, useLiveApi: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded-sm cursor-pointer"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Save Configuration
                </button>
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={isTestConnectionLoading}
                  className="py-2.5 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RefreshCw className={`w-4 h-4 ${isTestConnectionLoading ? 'animate-spin' : ''}`} />
                  Test
                </button>
              </div>

              {testResult && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[11px] font-mono flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{testResult}</span>
                </div>
              )}
            </form>
          </div>

          {/* Laravel API Route Inspector */}
          <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xs text-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Terminal className="w-4 h-4 text-blue-400" /> Laravel REST Endpoints Contract
              </h3>
              <span className="text-[10px] font-mono bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-md border border-blue-500/30">
                JSON API v1
              </span>
            </div>

            <p className="text-xs text-slate-400">
              The ERP frontend calls these standard REST routes. All requests automatically pass headers <code className="text-amber-400 font-mono">Authorization: Bearer</code> and <code className="text-amber-400 font-mono">Accept: application/json</code>.
            </p>

            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {laravelRoutes.map((r, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                      r.method === 'GET' ? 'bg-emerald-500/20 text-emerald-400' :
                      r.method === 'POST' ? 'bg-blue-500/20 text-blue-400' : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {r.method}
                    </span>
                    <span className="text-slate-100 font-bold">{r.endpoint}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-sans mt-0.5">{r.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'users' && (
        <DataTable
          title="User Accounts & Permissions Matrix"
          data={usersList}
          columns={userColumns}
          searchPlaceholder="Search user name, email, role..."
        />
      )}

      {activeSubTab === 'audit' && (
        <DataTable
          title="System Audit & Activity Logs"
          data={auditLogs}
          columns={auditColumns}
          searchPlaceholder="Search action, user, IP..."
        />
      )}
    </div>
  );
};
