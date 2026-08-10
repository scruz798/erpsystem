import React, { useState, useEffect } from 'react';
import { storageService } from '../../services/storageService';
import { SalesOrder, Customer, SalesOrderStatus } from '../../types/erp';
import { DataTable, Column } from '../common/DataTable';
import { Badge, BadgeVariant } from '../common/Badge';
import { Modal } from '../common/Modal';
import { InvoiceModal } from './InvoiceModal';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { 
  Plus, 
  FileText, 
  Users, 
  Check, 
  X, 
  Printer, 
  DollarSign, 
  TrendingUp, 
  Building
} from 'lucide-react';

export const SalesDepartment: React.FC = () => {
  const { hasPermission, currentUser } = useAuth();
  const { addNotification } = useNotification();

  const [activeSubTab, setActiveSubTab] = useState<'orders' | 'customers'>('orders');
  const [salesOrders, setSalesOrders] = useState<SalesOrder[]>(() => storageService.getSalesOrders());
  const [customers, setCustomers] = useState<Customer[]>(() => storageService.getCustomers());
  const [inventory] = useState(() => storageService.getInventory());

  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<SalesOrder | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreateCustomerOpen, setIsCreateCustomerOpen] = useState(false);

  // New Sales Order Form State
  const [newOrderCustomerId, setNewOrderCustomerId] = useState('');
  const [newOrderItems, setNewOrderItems] = useState([
    { productId: inventory[0]?.id || '', quantity: 2, unitPrice: inventory[0]?.sellingPrice || 1000 }
  ]);
  const [newOrderNotes, setNewOrderNotes] = useState('');

  // New Customer Form State
  const [newCustName, setNewCustName] = useState('');
  const [newCustCompany, setNewCustCompany] = useState('');
  const [newCustEmail, setNewCustEmail] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newCustCredit, setNewCustCredit] = useState('200000');

  useEffect(() => {
    const handleUpdate = () => {
      setSalesOrders(storageService.getSalesOrders());
      setCustomers(storageService.getCustomers());
    };
    window.addEventListener('hzhy-erp-storage-update', handleUpdate);
    return () => window.removeEventListener('hzhy-erp-storage-update', handleUpdate);
  }, []);

  // Handlers
  const handleApproveOrder = (orderId: string) => {
    if (!hasPermission('sales', 'approve')) {
      addNotification('Access Denied', 'Your role lacks permission to approve Sales Orders.', 'warning');
      return;
    }

    const updated = salesOrders.map(so => {
      if (so.id === orderId) {
        return { ...so, status: 'Approved' as SalesOrderStatus };
      }
      return so;
    });

    storageService.setSalesOrders(updated);
    addNotification('Order Approved', 'Sales Order status updated to Approved.', 'success');
  };

  const handleCreateOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrderCustomerId) {
      addNotification('Validation Error', 'Please select a customer for this order.', 'warning');
      return;
    }

    const cust = customers.find(c => c.id === newOrderCustomerId);
    if (!cust) return;

    const itemsFormatted = newOrderItems.map((item, idx) => {
      const prod = inventory.find(p => p.id === item.productId);
      return {
        id: `soi-${Date.now()}-${idx}`,
        productId: item.productId,
        sku: prod?.sku || 'HZ-SKU',
        description: prod?.name || 'Item',
        quantity: Number(item.quantity),
        unitPrice: Number(item.unitPrice),
        totalPrice: Number(item.quantity) * Number(item.unitPrice)
      };
    });

    const subtotal = itemsFormatted.reduce((acc, i) => acc + i.totalPrice, 0);
    const tax = Math.round(subtotal * 0.1);
    const discount = 0;
    const totalAmount = subtotal + tax - discount;

    const newOrder: SalesOrder = {
      id: `so-${Date.now()}`,
      orderNumber: `SO-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      customerId: cust.id,
      customerName: cust.name,
      customerEmail: cust.email,
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      items: itemsFormatted,
      subtotal,
      tax,
      discount,
      totalAmount,
      status: 'Pending Approval',
      paymentStatus: 'Unpaid',
      createdByName: currentUser?.name || 'Sales Officer',
      notes: newOrderNotes
    };

    storageService.setSalesOrders([newOrder, ...salesOrders]);
    addNotification('Quotation Created', `Quotation #${newOrder.orderNumber} issued ($${totalAmount.toLocaleString()}).`, 'success');
    setIsCreateModalOpen(false);
  };

  const handleCreateCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCust: Customer = {
      id: `c-${Date.now()}`,
      code: `CUST-HZ00${customers.length + 1}`,
      name: newCustName,
      company: newCustCompany,
      email: newCustEmail,
      phone: newCustPhone,
      address: 'Industrial Zone 4, CA',
      creditLimit: Number(newCustCredit),
      outstandingBalance: 0,
      status: 'Active',
      createdAt: new Date().toISOString().split('T')[0]
    };

    storageService.setCustomers([newCust, ...customers]);
    addNotification('Customer Added', `Customer ${newCustName} registered successfully.`, 'success');
    setIsCreateCustomerOpen(false);
  };

  // Status Badge Map
  const statusBadgeMap: Record<SalesOrderStatus, { variant: BadgeVariant; label: string }> = {
    Draft: { variant: 'slate', label: 'Draft' },
    'Pending Approval': { variant: 'amber', label: 'Pending Approval' },
    Approved: { variant: 'emerald', label: 'Approved' },
    Invoiced: { variant: 'sky', label: 'Invoiced' },
    Delivered: { variant: 'indigo', label: 'Delivered' },
    Cancelled: { variant: 'rose', label: 'Cancelled' }
  };

  // Table Columns Definition
  const orderColumns: Column<SalesOrder>[] = [
    {
      key: 'orderNumber',
      header: 'Order #',
      render: (item) => (
        <div className="font-bold font-mono text-blue-600 dark:text-blue-400">
          {item.orderNumber}
        </div>
      )
    },
    {
      key: 'customerName',
      header: 'Client / Company',
      render: (item) => (
        <div>
          <p className="font-bold text-slate-900 dark:text-white">{item.customerName}</p>
          <p className="text-[10px] text-slate-400">{item.customerEmail}</p>
        </div>
      )
    },
    { key: 'date', header: 'Date' },
    {
      key: 'totalAmount',
      header: 'Total ($)',
      render: (item) => (
        <span className="font-extrabold text-slate-900 dark:text-white">
          ${item.totalAmount.toLocaleString()}
        </span>
      )
    },
    {
      key: 'status',
      header: 'Status',
      render: (item) => {
        const badge = statusBadgeMap[item.status] || { variant: 'slate', label: item.status };
        return <Badge variant={badge.variant}>{badge.label}</Badge>;
      }
    },
    {
      key: 'paymentStatus',
      header: 'Payment',
      render: (item) => (
        <Badge variant={item.paymentStatus === 'Paid' ? 'emerald' : item.paymentStatus === 'Partial' ? 'amber' : 'rose'}>
          {item.paymentStatus}
        </Badge>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (item) => (
        <div className="flex items-center gap-2">
          {item.status === 'Pending Approval' && hasPermission('sales', 'approve') && (
            <button
              onClick={() => handleApproveOrder(item.id)}
              title="Approve Order"
              className="px-2 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors"
            >
              <Check className="w-3 h-3" /> Approve
            </button>
          )}

          <button
            onClick={() => setSelectedOrderForInvoice(item)}
            title="View Invoice PDF"
            className="px-2.5 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors"
          >
            <Printer className="w-3 h-3" /> Invoice
          </button>
        </div>
      )
    }
  ];

  const customerColumns: Column<Customer>[] = [
    {
      key: 'code',
      header: 'Code',
      render: (item) => <span className="font-mono font-bold text-slate-500">{item.code}</span>
    },
    {
      key: 'name',
      header: 'Customer Name',
      render: (item) => (
        <div>
          <p className="font-bold text-slate-900 dark:text-white">{item.name}</p>
          <p className="text-[10px] text-slate-400">{item.company}</p>
        </div>
      )
    },
    { key: 'email', header: 'Contact' },
    {
      key: 'creditLimit',
      header: 'Credit Limit ($)',
      render: (item) => `$${item.creditLimit.toLocaleString()}`
    },
    {
      key: 'outstandingBalance',
      header: 'Outstanding ($)',
      render: (item) => (
        <span className={item.outstandingBalance > 0 ? 'text-amber-600 font-bold' : 'text-slate-500'}>
          ${item.outstandingBalance.toLocaleString()}
        </span>
      )
    },
    {
      key: 'status',
      header: 'Status',
      render: (item) => (
        <Badge variant={item.status === 'Active' ? 'emerald' : 'amber'}>
          {item.status}
        </Badge>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Sub-tab Navigation Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" /> Sales & Commercial CRM
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Quotation lifecycle, client credit limits, order invoicing & contract fulfillment.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl flex items-center gap-1 text-xs">
            <button
              onClick={() => setActiveSubTab('orders')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeSubTab === 'orders' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Quotations & Orders
            </button>
            <button
              onClick={() => setActiveSubTab('customers')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeSubTab === 'customers' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Client CRM
            </button>
          </div>

          {hasPermission('sales', 'create') && (
            <button
              onClick={() => activeSubTab === 'orders' ? setIsCreateModalOpen(true) : setIsCreateCustomerOpen(true)}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" /> {activeSubTab === 'orders' ? 'New Quotation' : 'Add Client'}
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      {activeSubTab === 'orders' ? (
        <DataTable
          title="Sales Orders Directory"
          data={salesOrders}
          columns={orderColumns}
          searchPlaceholder="Search order #, customer, status..."
        />
      ) : (
        <DataTable
          title="Registered Clients Directory"
          data={customers}
          columns={customerColumns}
          searchPlaceholder="Search client name, company, email..."
        />
      )}

      {/* Invoice PDF Preview Modal */}
      <InvoiceModal
        isOpen={!!selectedOrderForInvoice}
        onClose={() => setSelectedOrderForInvoice(null)}
        order={selectedOrderForInvoice}
      />

      {/* Create Sales Order Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Commercial Quotation"
        subtitle="Generates an official sales quote for approval and invoicing."
        maxWidth="2xl"
        footer={
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateOrderSubmit}
              className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-md"
            >
              Issue Quotation
            </button>
          </div>
        }
      >
        <form className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Select Client / Company
            </label>
            <select
              value={newOrderCustomerId}
              onChange={e => setNewOrderCustomerId(e.target.value)}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
            >
              <option value="">-- Choose Client --</option>
              {customers.map(c => (
                <option key={c.id} value={c.id}>{c.name} ({c.company})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Line Items
            </label>
            {newOrderItems.map((item, idx) => (
              <div key={idx} className="grid grid-cols-12 gap-2 mb-2 items-center">
                <div className="col-span-6">
                  <select
                    value={item.productId}
                    onChange={e => {
                      const selectedProd = inventory.find(p => p.id === e.target.value);
                      const updated = [...newOrderItems];
                      updated[idx].productId = e.target.value;
                      if (selectedProd) updated[idx].unitPrice = selectedProd.sellingPrice;
                      setNewOrderItems(updated);
                    }}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  >
                    {inventory.map(p => (
                      <option key={p.id} value={p.id}>{p.sku} - {p.name}</option>
                    ))}
                  </select>
                </div>
                <div className="col-span-3">
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={e => {
                      const updated = [...newOrderItems];
                      updated[idx].quantity = Number(e.target.value);
                      setNewOrderItems(updated);
                    }}
                    placeholder="Qty"
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
                <div className="col-span-3">
                  <input
                    type="number"
                    value={item.unitPrice}
                    onChange={e => {
                      const updated = [...newOrderItems];
                      updated[idx].unitPrice = Number(e.target.value);
                      setNewOrderItems(updated);
                    }}
                    placeholder="Unit Price"
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            ))}
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Order Notes / Delivery Terms
            </label>
            <textarea
              rows={2}
              value={newOrderNotes}
              onChange={e => setNewOrderNotes(e.target.value)}
              placeholder="e.g., Delivery within 14 business days. Payment 30 days net."
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
            />
          </div>
        </form>
      </Modal>

      {/* Add Customer Modal */}
      <Modal
        isOpen={isCreateCustomerOpen}
        onClose={() => setIsCreateCustomerOpen(false)}
        title="Register New Client Account"
        subtitle="Enters client details into HZHY CRM for order processing."
        maxWidth="md"
        footer={
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCreateCustomerOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateCustomerSubmit}
              className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-md"
            >
              Save Client
            </button>
          </div>
        }
      >
        <form className="space-y-3 text-xs">
          <div>
            <label className="block font-semibold mb-1">Client Name</label>
            <input
              type="text"
              value={newCustName}
              onChange={e => setNewCustName(e.target.value)}
              required
              placeholder="e.g. AeroTech Dynamics Corp"
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Company / Industry</label>
            <input
              type="text"
              value={newCustCompany}
              onChange={e => setNewCustCompany(e.target.value)}
              placeholder="e.g. Aviation Components"
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Email Address</label>
            <input
              type="email"
              value={newCustEmail}
              onChange={e => setNewCustEmail(e.target.value)}
              placeholder="orders@aerotech.com"
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Credit Limit ($)</label>
            <input
              type="number"
              value={newCustCredit}
              onChange={e => setNewCustCredit(e.target.value)}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};
