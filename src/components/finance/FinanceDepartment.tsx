import React, { useState, useEffect } from 'react';
import { storageService } from '../../services/storageService';
import { Transaction, ReceivableInvoice, PayableInvoice, TransactionType, TransactionCategory } from '../../types/erp';
import { DataTable, Column } from '../common/DataTable';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { StatsCard } from '../common/StatsCard';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight, 
  Plus, 
  PieChart, 
  Receipt, 
  CreditCard, 
  CheckCircle2, 
  FileSpreadsheet 
} from 'lucide-react';

export const FinanceDepartment: React.FC = () => {
  const { hasPermission, currentUser } = useAuth();
  const { addNotification } = useNotification();

  const [activeSubTab, setActiveSubTab] = useState<'ledger' | 'ar_ap' | 'p_l'>('ledger');
  const [transactions, setTransactions] = useState<Transaction[]>(() => storageService.getTransactions());
  const [receivables, setReceivables] = useState<ReceivableInvoice[]>(() => storageService.getReceivables());
  const [payables, setPayables] = useState<PayableInvoice[]>(() => storageService.getPayables());

  const [isLogTxModalOpen, setIsLogTxModalOpen] = useState(false);

  // New Transaction Form State
  const [txType, setTxType] = useState<TransactionType>('Income');
  const [txCategory, setTxCategory] = useState<TransactionCategory>('Sales Revenue');
  const [txAmount, setTxAmount] = useState('25000');
  const [txDepartment, setTxDepartment] = useState('Sales');
  const [txDescription, setTxDescription] = useState('');
  const [txMethod, setTxMethod] = useState<'Bank Transfer' | 'Credit Card' | 'Cheque' | 'Cash'>('Bank Transfer');

  useEffect(() => {
    const handleUpdate = () => {
      setTransactions(storageService.getTransactions());
      setReceivables(storageService.getReceivables());
      setPayables(storageService.getPayables());
    };
    window.addEventListener('hzhy-erp-storage-update', handleUpdate);
    return () => window.removeEventListener('hzhy-erp-storage-update', handleUpdate);
  }, []);

  // Compute Financials
  const totalIncome = transactions
    .filter(t => t.type === 'Income' && t.status === 'Completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'Expense' && t.status === 'Completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const netProfit = totalIncome - totalExpense;

  const handleLogTxSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      referenceNo: `${txType === 'Income' ? 'REC' : 'EXP'}-2026-${Math.floor(100 + Math.random() * 900)}`,
      type: txType,
      category: txCategory,
      amount: Number(txAmount),
      date: new Date().toISOString().split('T')[0],
      department: txDepartment,
      description: txDescription || `${txType} entry recorded by ${currentUser?.name}`,
      paymentMethod: txMethod,
      status: 'Completed',
      recordedBy: currentUser?.name || 'Finance Officer'
    };

    storageService.setTransactions([newTx, ...transactions]);
    addNotification('Transaction Logged', `${newTx.type} of $${newTx.amount.toLocaleString()} logged in General Ledger.`, 'success');
    setIsLogTxModalOpen(false);
  };

  // Columns for General Ledger
  const transactionColumns: Column<Transaction>[] = [
    {
      key: 'referenceNo',
      header: 'Ref #',
      render: (item) => <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{item.referenceNo}</span>
    },
    { key: 'date', header: 'Date' },
    {
      key: 'type',
      header: 'Type',
      render: (item) => (
        <Badge variant={item.type === 'Income' ? 'emerald' : 'rose'}>
          {item.type === 'Income' ? <ArrowUpRight className="w-3 h-3 mr-1 inline" /> : <ArrowDownRight className="w-3 h-3 mr-1 inline" />}
          {item.type}
        </Badge>
      )
    },
    { key: 'category', header: 'Category' },
    { key: 'department', header: 'Dept' },
    {
      key: 'amount',
      header: 'Amount ($)',
      render: (item) => (
        <span className={`font-extrabold ${item.type === 'Income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
          {item.type === 'Income' ? '+' : '-'}${item.amount.toLocaleString()}
        </span>
      )
    },
    { key: 'paymentMethod', header: 'Method' },
    { key: 'recordedBy', header: 'Audited By' }
  ];

  // Columns for Receivables
  const arColumns: Column<ReceivableInvoice>[] = [
    { key: 'invoiceNumber', header: 'Invoice #' },
    { key: 'customerName', header: 'Customer' },
    { key: 'issueDate', header: 'Issue Date' },
    { key: 'dueDate', header: 'Due Date' },
    {
      key: 'amount',
      header: 'Amount ($)',
      render: (item) => `$${item.amount.toLocaleString()}`
    },
    {
      key: 'status',
      header: 'Status',
      render: (item) => (
        <Badge variant={item.status === 'Paid' ? 'emerald' : item.status === 'Overdue' ? 'rose' : 'amber'}>
          {item.status}
        </Badge>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Sub-tab Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-600" /> Finance & Treasury Department
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            General ledger, accounts receivable/payable, tax compliance & profit analysis.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl flex items-center gap-1 text-xs">
            <button
              onClick={() => setActiveSubTab('ledger')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeSubTab === 'ledger' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              General Ledger
            </button>
            <button
              onClick={() => setActiveSubTab('ar_ap')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeSubTab === 'ar_ap' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              AR & AP Aging
            </button>
            <button
              onClick={() => setActiveSubTab('p_l')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeSubTab === 'p_l' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              P&L Financials
            </button>
          </div>

          {hasPermission('finance', 'create') && (
            <button
              onClick={() => setIsLogTxModalOpen(true)}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Record Transaction
            </button>
          )}
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard
          title="Total Income Received"
          value={`$${totalIncome.toLocaleString()}`}
          subtext="Cleared customer payments"
          icon={ArrowUpRight}
          iconBgColor="bg-emerald-500/10"
          iconColor="text-emerald-600 dark:text-emerald-400"
        />
        <StatsCard
          title="Total Operating Expenses"
          value={`$${totalExpense.toLocaleString()}`}
          subtext="Procurement & payroll"
          icon={ArrowDownRight}
          iconBgColor="bg-rose-500/10"
          iconColor="text-rose-600 dark:text-rose-400"
        />
        <StatsCard
          title="Net Corporate Margin"
          value={`$${netProfit.toLocaleString()}`}
          subtext={netProfit >= 0 ? 'Positive Operating Surplus' : 'Deficit'}
          icon={DollarSign}
          iconBgColor="bg-blue-500/10"
          iconColor="text-blue-600 dark:text-blue-400"
        />
      </div>

      {/* Main Tab Content */}
      {activeSubTab === 'ledger' && (
        <DataTable
          title="General Ledger Transactions Log"
          data={transactions}
          columns={transactionColumns}
          searchPlaceholder="Search ref #, category, description..."
        />
      )}

      {activeSubTab === 'ar_ap' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DataTable
            title="Accounts Receivable (AR)"
            data={receivables}
            columns={arColumns}
            searchPlaceholder="Search invoice # or client..."
          />
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-indigo-500" /> Accounts Payable (AP)
            </h3>
            <div className="space-y-3 text-xs">
              {payables.map(ap => (
                <div key={ap.id} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">{ap.supplierName}</p>
                    <p className="text-[10px] text-slate-400 font-mono">Bill #{ap.billNumber} • Due: {ap.dueDate}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-extrabold text-slate-900 dark:text-white">${ap.amount.toLocaleString()}</p>
                    <Badge variant={ap.status === 'Paid' ? 'emerald' : ap.status === 'Overdue' ? 'rose' : 'amber'}>
                      {ap.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'p_l' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs max-w-3xl mx-auto space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-600" /> Profit & Loss Statement (P&L)
              </h3>
              <p className="text-xs text-slate-500">Period: Q3 FY2026 • HZHY Enterprise Consolidated</p>
            </div>
            <button
              onClick={() => addNotification('Report Download', 'P&L Statement exported to PDF/Excel format.', 'success')}
              className="px-3 py-1.5 text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
            >
              Export Report
            </button>
          </div>

          <div className="space-y-4 text-xs font-semibold">
            <div className="space-y-2">
              <p className="text-slate-400 uppercase tracking-wider text-[10px] font-bold">1. Operating Revenue</p>
              <div className="flex justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                <span>Gross Product Sales</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">${totalIncome.toLocaleString()}</span>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-slate-400 uppercase tracking-wider text-[10px] font-bold">2. Operating Expenses (OPEX)</p>
              <div className="flex justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                <span>Raw Material Procurement</span>
                <span>$42,500</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                <span>Logistics & Freight Air Dispatch</span>
                <span>$8,400</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                <span>Salaries, Payroll & Employee Benefits</span>
                <span>$185,000</span>
              </div>
              <div className="flex justify-between p-3 rounded-xl bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 font-bold border border-rose-200/50 dark:border-rose-900/50">
                <span>Total Expenses</span>
                <span>-${totalExpense.toLocaleString()}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 flex items-center justify-between text-sm font-extrabold text-slate-900 dark:text-white">
              <span>Net Profit Before Tax:</span>
              <span className="text-blue-600 dark:text-blue-400">${netProfit.toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}

      {/* Log Transaction Modal */}
      <Modal
        isOpen={isLogTxModalOpen}
        onClose={() => setIsLogTxModalOpen(false)}
        title="Record General Ledger Transaction"
        subtitle="Logs an accredited income or expense entry into Treasury."
        maxWidth="md"
        footer={
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsLogTxModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
            >
              Cancel
            </button>
            <button
              onClick={handleLogTxSubmit}
              className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-md"
            >
              Post Transaction
            </button>
          </div>
        }
      >
        <form className="space-y-3 text-xs">
          <div>
            <label className="block font-semibold mb-1">Transaction Type</label>
            <select
              value={txType}
              onChange={e => setTxType(e.target.value as TransactionType)}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
            >
              <option value="Income">Income (Credit)</option>
              <option value="Expense">Expense (Debit)</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1">Category</label>
            <select
              value={txCategory}
              onChange={e => setTxCategory(e.target.value as TransactionCategory)}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
            >
              <option value="Sales Revenue">Sales Revenue</option>
              <option value="Raw Material Purchase">Raw Material Purchase</option>
              <option value="Logistics & Freight">Logistics & Freight</option>
              <option value="Salaries & Payroll">Salaries & Payroll</option>
              <option value="Utilities & Office">Utilities & Office</option>
              <option value="Equipment & Maintenance">Equipment & Maintenance</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1">Amount ($)</label>
            <input
              type="number"
              value={txAmount}
              onChange={e => setTxAmount(e.target.value)}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Department</label>
            <select
              value={txDepartment}
              onChange={e => setTxDepartment(e.target.value)}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
            >
              <option value="Sales">Sales</option>
              <option value="Finance">Finance</option>
              <option value="Store">Store / Warehouse</option>
              <option value="Purchasing">Purchasing</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1">Description / Memo</label>
            <input
              type="text"
              value={txDescription}
              onChange={e => setTxDescription(e.target.value)}
              placeholder="e.g. Wire transfer for order invoice #INV-2026-01"
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};
