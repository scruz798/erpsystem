import React, { useState, useEffect } from 'react';
import { storageService } from '../../services/storageService';
import { StatsCard } from '../common/StatsCard';
import { Badge } from '../common/Badge';
import { useNotification } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';
import { 
  DollarSign, 
  ShoppingBag, 
  AlertTriangle, 
  TrendingUp, 
  ArrowUpRight, 
  Plus, 
  FileText, 
  Package, 
  CheckCircle,
  BarChart3
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

interface OverviewDashboardProps {
  onNavigateTab: (tabName: 'sales' | 'finance' | 'store' | 'purchasing' | 'admin') => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({ onNavigateTab }) => {
  const { addNotification } = useNotification();
  const { currentUser } = useAuth();

  const [salesOrders, setSalesOrders] = useState(() => storageService.getSalesOrders());
  const [purchaseOrders, setPurchaseOrders] = useState(() => storageService.getPurchaseOrders());
  const [inventory, setInventory] = useState(() => storageService.getInventory());
  const [transactions, setTransactions] = useState(() => storageService.getTransactions());

  useEffect(() => {
    const handleStorageUpdate = () => {
      setSalesOrders(storageService.getSalesOrders());
      setPurchaseOrders(storageService.getPurchaseOrders());
      setInventory(storageService.getInventory());
      setTransactions(storageService.getTransactions());
    };
    window.addEventListener('hzhy-erp-storage-update', handleStorageUpdate);
    return () => window.removeEventListener('hzhy-erp-storage-update', handleStorageUpdate);
  }, []);

  // Compute metrics dynamically
  const totalRevenue = salesOrders
    .filter(so => so.status !== 'Cancelled')
    .reduce((sum, so) => sum + so.totalAmount, 0);

  const pendingPoValue = purchaseOrders
    .filter(po => po.status === 'Pending Approval' || po.status === 'Approved')
    .reduce((sum, po) => sum + po.totalAmount, 0);

  const lowStockCount = inventory.filter(i => i.stockOnHand <= i.minReorderLevel).length;

  const activeQuotesCount = salesOrders.filter(so => so.status === 'Pending Approval' || so.status === 'Draft').length;

  // Chart Data Preparation
  const revenueChartData = [
    { month: 'Mar', Revenue: 85000, Expense: 62000 },
    { month: 'Apr', Revenue: 98000, Expense: 64000 },
    { month: 'May', Revenue: 112000, Expense: 71000 },
    { month: 'Jun', Revenue: 130000, Expense: 82000 },
    { month: 'Jul', Revenue: 145000, Expense: 89000 },
    { month: 'Aug', Revenue: totalRevenue > 0 ? totalRevenue : 182000, Expense: 94000 }
  ];

  const categoryDistribution = [
    { name: 'Electronics', value: 45, color: '#3B82F6' },
    { name: 'Machinery', value: 25, color: '#10B981' },
    { name: 'Hardware', value: 18, color: '#F59E0B' },
    { name: 'Raw Metals', value: 12, color: '#6366F1' }
  ];

  // Urgent action items
  const pendingApprovals = [
    ...salesOrders.filter(so => so.status === 'Pending Approval').map(so => ({
      id: so.id,
      type: 'Sales Quotation',
      ref: so.orderNumber,
      amount: `$${so.totalAmount.toLocaleString()}`,
      party: so.customerName,
      dept: 'sales' as const
    })),
    ...purchaseOrders.filter(po => po.status === 'Pending Approval').map(po => ({
      id: po.id,
      type: 'Purchase Order',
      ref: po.poNumber,
      amount: `$${po.totalAmount.toLocaleString()}`,
      party: po.supplierName,
      dept: 'purchasing' as const
    }))
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Monthly Sales Revenue"
          value={`$${totalRevenue > 0 ? totalRevenue.toLocaleString() : '428,590.00'}`}
          trendPercentage={12.5}
          trendLabel="vs last month"
        />
        <StatsCard
          title="Open Purchase Orders"
          value={purchaseOrders.length > 0 ? purchaseOrders.length : 24}
          subtext="• 4 High Priority"
          trendLabel="Pending Approval"
        />
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tighter">
            Store Inventory Level
          </div>
          <div className="text-2xl font-bold mt-2 text-slate-900 dark:text-white">86.2%</div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-4 overflow-hidden">
            <div className="bg-blue-600 h-full w-[86%]"></div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tighter">
            Active System Status
          </div>
          <div className="text-2xl font-bold mt-2 text-slate-900 dark:text-white">112 Users</div>
          <div className="flex items-center gap-1 mt-3">
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 font-mono">v1.0.4 API READY</span>
          </div>
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Transactional Activity Table */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Recent Transactional Activity</h3>
            <button 
              onClick={() => onNavigateTab('finance')}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
            >
              Export CSV
            </button>
          </div>
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-3">Ref ID</th>
                  <th className="px-6 py-3">Department</th>
                  <th className="px-6 py-3">Description</th>
                  <th className="px-6 py-3">Amount</th>
                  <th className="px-6 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="text-xs divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="px-6 py-4 font-mono font-bold text-blue-600 dark:text-blue-400">PO-2026-8821</td>
                  <td className="px-6 py-4">Purchasing</td>
                  <td className="px-6 py-4 truncate max-w-[200px]">Raw Materials - Zinc Alloy Batch 4</td>
                  <td className="px-6 py-4 font-semibold">$12,400.00</td>
                  <td className="px-6 py-4 text-center">
                    <span className="px-2.5 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-950/60 dark:text-yellow-400 rounded-full text-[10px] font-bold">
                      PENDING
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="px-6 py-4 font-mono font-bold text-blue-600 dark:text-blue-400">INV-2026-4512</td>
                  <td className="px-6 py-4">Sales</td>
                  <td className="px-6 py-4 truncate max-w-[200px]">Wholesale Order: Asia Logistics Co.</td>
                  <td className="px-6 py-4 font-semibold">$45,210.00</td>
                  <td className="px-6 py-4 text-center">
                    <span className="px-2.5 py-1 bg-green-100 text-green-800 dark:bg-emerald-950/60 dark:text-emerald-400 rounded-full text-[10px] font-bold">
                      PAID
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="px-6 py-4 font-mono font-bold text-blue-600 dark:text-blue-400">TR-2026-1102</td>
                  <td className="px-6 py-4">Store</td>
                  <td className="px-6 py-4 truncate max-w-[200px]">Stock Adjustment - Warehouse B</td>
                  <td className="px-6 py-4 font-semibold">-$215.00</td>
                  <td className="px-6 py-4 text-center">
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 rounded-full text-[10px] font-bold">
                      COMPLETED
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="px-6 py-4 font-mono font-bold text-blue-600 dark:text-blue-400">PO-2026-8819</td>
                  <td className="px-6 py-4">Purchasing</td>
                  <td className="px-6 py-4 truncate max-w-[200px]">Office Equipment Upgrade</td>
                  <td className="px-6 py-4 font-semibold">$2,850.00</td>
                  <td className="px-6 py-4 text-center">
                    <span className="px-2.5 py-1 bg-red-100 text-red-800 dark:bg-rose-950/60 dark:text-rose-400 rounded-full text-[10px] font-bold">
                      REJECTED
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Action & Store Health Column */}
        <div className="lg:col-span-4 space-y-6">
          {/* Admin Quick Action Card */}
          <div className="bg-slate-900 text-white p-6 rounded-xl shadow-lg relative overflow-hidden border border-slate-800">
            <div className="relative z-10">
              <div className="text-xs font-bold text-slate-400 uppercase mb-4 tracking-wider">
                Admin Quick Action
              </div>
              <div className="space-y-3">
                <button
                  onClick={() => onNavigateTab('admin')}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-500 rounded text-sm font-semibold text-center transition-colors cursor-pointer"
                >
                  Add New Module Access
                </button>
                <button
                  onClick={() => onNavigateTab('sales')}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 rounded text-sm font-semibold text-center transition-colors cursor-pointer"
                >
                  Generate Quarterly Report
                </button>
                <button
                  onClick={() => addNotification('System Health', 'All microservices & Laravel REST endpoints 100% operational.', 'success')}
                  className="w-full py-2 border border-slate-700 hover:bg-slate-800 rounded text-sm font-semibold text-center transition-colors cursor-pointer"
                >
                  System Health Check
                </button>
              </div>
            </div>
            <div className="absolute top-[-20px] right-[-20px] w-24 h-24 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>
          </div>

          {/* Store Health */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="font-bold text-sm mb-4 text-slate-900 dark:text-white">Store Health</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1 text-slate-700 dark:text-slate-300">
                  <span>Warehouse A</span>
                  <span className="font-bold">94%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 w-[94%]"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1 text-slate-700 dark:text-slate-300">
                  <span>Logistics Center</span>
                  <span className="font-bold">42%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500 w-[42%]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
