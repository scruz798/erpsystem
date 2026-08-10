import React, { useState, useEffect } from 'react';
import { storageService } from '../../services/storageService';
import { PurchaseOrder, Supplier, PurchaseOrderStatus } from '../../types/erp';
import { DataTable, Column } from '../common/DataTable';
import { Badge, BadgeVariant } from '../common/Badge';
import { Modal } from '../common/Modal';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { 
  ShoppingBag, 
  Users, 
  AlertTriangle, 
  Plus, 
  Check, 
  Star, 
  Clock, 
  Truck, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export const PurchasingDepartment: React.FC = () => {
  const { hasPermission, currentUser } = useAuth();
  const { addNotification } = useNotification();

  const [activeSubTab, setActiveSubTab] = useState<'pos' | 'suppliers' | 'replenish'>('pos');
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(() => storageService.getPurchaseOrders());
  const [suppliers, setSuppliers] = useState<Supplier[]>(() => storageService.getSuppliers());
  const [inventory] = useState(() => storageService.getInventory());

  const [isCreatePoOpen, setIsCreatePoOpen] = useState(false);

  // New PO Form
  const [selectedSupplierId, setSelectedSupplierId] = useState(suppliers[0]?.id || '');
  const [poItems, setPoItems] = useState([
    { sku: 'HZ-ALU-6061', description: 'Raw Metal Bars 6061-T6', qty: 1000, unitCost: 18 }
  ]);
  const [poNotes, setPoNotes] = useState('');

  useEffect(() => {
    const handleUpdate = () => {
      setPurchaseOrders(storageService.getPurchaseOrders());
      setSuppliers(storageService.getSuppliers());
    };
    window.addEventListener('hzhy-erp-storage-update', handleUpdate);
    return () => window.removeEventListener('hzhy-erp-storage-update', handleUpdate);
  }, []);

  // Low stock replenishment items
  const lowStockItems = inventory.filter(item => item.stockOnHand <= item.minReorderLevel);

  const handleApprovePo = (poId: string) => {
    if (!hasPermission('purchasing', 'approve')) {
      addNotification('Access Denied', 'Your role lacks permission to sign off Purchase Orders.', 'warning');
      return;
    }

    const updated = purchaseOrders.map(po => {
      if (po.id === poId) {
        return { 
          ...po, 
          status: 'Approved' as PurchaseOrderStatus, 
          approvedBy: currentUser?.name || 'Alexander Chen' 
        };
      }
      return po;
    });

    storageService.setPurchaseOrders(updated);
    addNotification('PO Approved', 'Purchase Order approved and dispatched to vendor.', 'success');
  };

  const handleCreatePoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sup = suppliers.find(s => s.id === selectedSupplierId);
    if (!sup) return;

    const formattedItems = poItems.map((item, idx) => ({
      id: `poi-${Date.now()}-${idx}`,
      sku: item.sku,
      description: item.description,
      quantity: Number(item.qty),
      unitCost: Number(item.unitCost),
      totalCost: Number(item.qty) * Number(item.unitCost)
    }));

    const totalAmount = formattedItems.reduce((acc, i) => acc + i.totalCost, 0);

    const newPo: PurchaseOrder = {
      id: `po-${Date.now()}`,
      poNumber: `PO-2026-${Math.floor(100 + Math.random() * 900)}`,
      supplierId: sup.id,
      supplierName: sup.name,
      orderDate: new Date().toISOString().split('T')[0],
      expectedDelivery: new Date(Date.now() + sup.leadTimeDays * 86400000).toISOString().split('T')[0],
      items: formattedItems,
      totalAmount,
      status: 'Pending Approval',
      requestedBy: currentUser?.name || 'Elena Rostova',
      notes: poNotes
    };

    storageService.setPurchaseOrders([newPo, ...purchaseOrders]);
    addNotification('PO Drafted', `Purchase Order #${newPo.poNumber} created for $${totalAmount.toLocaleString()}.`, 'success');
    setIsCreatePoOpen(false);
  };

  const poStatusBadgeMap: Record<PurchaseOrderStatus, { variant: BadgeVariant; label: string }> = {
    Draft: { variant: 'slate', label: 'Draft' },
    'Pending Approval': { variant: 'amber', label: 'Pending Approval' },
    Approved: { variant: 'sky', label: 'Approved' },
    'Sent to Supplier': { variant: 'indigo', label: 'Dispatched' },
    Fulfilled: { variant: 'emerald', label: 'Fulfilled' },
    Rejected: { variant: 'rose', label: 'Rejected' }
  };

  const poColumns: Column<PurchaseOrder>[] = [
    {
      key: 'poNumber',
      header: 'PO #',
      render: (item) => <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{item.poNumber}</span>
    },
    { key: 'supplierName', header: 'Supplier Name' },
    { key: 'orderDate', header: 'Issued Date' },
    { key: 'expectedDelivery', header: 'Expected Delivery' },
    {
      key: 'totalAmount',
      header: 'Value ($)',
      render: (item) => <span className="font-extrabold text-slate-900 dark:text-white">${item.totalAmount.toLocaleString()}</span>
    },
    {
      key: 'status',
      header: 'Status',
      render: (item) => {
        const badge = poStatusBadgeMap[item.status] || { variant: 'slate', label: item.status };
        return <Badge variant={badge.variant}>{badge.label}</Badge>;
      }
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (item) => (
        item.status === 'Pending Approval' && hasPermission('purchasing', 'approve') && (
          <button
            onClick={() => handleApprovePo(item.id)}
            className="px-2.5 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors"
          >
            <Check className="w-3 h-3" /> Approve PO
          </button>
        )
      )
    }
  ];

  const supplierColumns: Column<Supplier>[] = [
    { key: 'code', header: 'Vendor ID' },
    {
      key: 'name',
      header: 'Supplier Name',
      render: (item) => (
        <div>
          <p className="font-bold text-slate-900 dark:text-white">{item.name}</p>
          <p className="text-[10px] text-slate-400">{item.contactPerson} • {item.email}</p>
        </div>
      )
    },
    {
      key: 'rating',
      header: 'Rating',
      render: (item) => (
        <span className="flex items-center gap-1 font-bold text-amber-500">
          <Star className="w-3.5 h-3.5 fill-amber-400" /> {item.rating}
        </span>
      )
    },
    {
      key: 'leadTimeDays',
      header: 'Lead Time',
      render: (item) => (
        <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
          <Clock className="w-3.5 h-3.5 text-slate-400" /> {item.leadTimeDays} Days
        </span>
      )
    },
    { key: 'paymentTerms', header: 'Terms' },
    { key: 'activeOrdersCount', header: 'Active Orders' }
  ];

  return (
    <div className="space-y-6">
      {/* Sub-tab Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-sky-600" /> Procurement & Purchasing
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Purchase Requisitions (PR), Purchase Orders (PO), vendor lead times & material replenishment.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl flex items-center gap-1 text-xs">
            <button
              onClick={() => setActiveSubTab('pos')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeSubTab === 'pos' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Purchase Orders
            </button>
            <button
              onClick={() => setActiveSubTab('suppliers')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeSubTab === 'suppliers' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Vendor Directory
            </button>
            <button
              onClick={() => setActiveSubTab('replenish')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeSubTab === 'replenish' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Replenishment Alert ({lowStockItems.length})
            </button>
          </div>

          {hasPermission('purchasing', 'create') && (
            <button
              onClick={() => setIsCreatePoOpen(true)}
              className="px-3.5 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Issue Purchase Order
            </button>
          )}
        </div>
      </div>

      {/* Views */}
      {activeSubTab === 'pos' && (
        <DataTable
          title="Purchase Orders Register"
          data={purchaseOrders}
          columns={poColumns}
          searchPlaceholder="Search PO #, vendor, status..."
        />
      )}

      {activeSubTab === 'suppliers' && (
        <DataTable
          title="Vetted Enterprise Suppliers"
          data={suppliers}
          columns={supplierColumns}
          searchPlaceholder="Search supplier name, lead time..."
        />
      )}

      {activeSubTab === 'replenish' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs max-w-4xl mx-auto space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" /> Material Replenishment Triggers
            </h3>
            <span className="text-xs font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/50 px-3 py-1 rounded-full border border-amber-200/60 dark:border-amber-800/50">
              {lowStockItems.length} SKUs Below Safety Level
            </span>
          </div>

          <p className="text-xs text-slate-500">
            The ERP auto-detects items where current stock on hand is below minimum reorder thresholds:
          </p>

          <div className="space-y-3">
            {lowStockItems.length > 0 ? (
              lowStockItems.map(item => (
                <div key={item.id} className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{item.sku}</span>
                    <p className="font-bold text-slate-900 dark:text-white mt-0.5">{item.name}</p>
                    <p className="text-[10px] text-slate-400">Warehouse Location: {item.warehouseLocation}</p>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-rose-600 font-extrabold text-sm">
                        Stock: {item.stockOnHand} {item.unit}
                      </p>
                      <p className="text-[10px] text-slate-400">Min Reorder Level: {item.minReorderLevel}</p>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedSupplierId(suppliers[0]?.id || '');
                        setPoItems([{ sku: item.sku, description: item.name, qty: item.minReorderLevel * 2, unitCost: item.unitCost }]);
                        setIsCreatePoOpen(true);
                      }}
                      className="px-3.5 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
                    >
                      Draft Requisition <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-xs text-slate-400">
                All inventory stock levels are safely above reorder thresholds!
              </div>
            )}
          </div>
        </div>
      )}

      {/* Issue PO Modal */}
      <Modal
        isOpen={isCreatePoOpen}
        onClose={() => setIsCreatePoOpen(false)}
        title="Issue Purchase Order (PO)"
        subtitle="Dispatches a binding material procurement requisition to supplier."
        maxWidth="2xl"
        footer={
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCreatePoOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
            >
              Cancel
            </button>
            <button
              onClick={handleCreatePoSubmit}
              className="px-4 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 rounded-xl shadow-md"
            >
              Issue Purchase Order
            </button>
          </div>
        }
      >
        <form className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold mb-1">Select Supplier / Vendor</label>
            <select
              value={selectedSupplierId}
              onChange={e => setSelectedSupplierId(e.target.value)}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
            >
              {suppliers.map(s => (
                <option key={s.id} value={s.id}>{s.name} (Lead time: {s.leadTimeDays} days, {s.paymentTerms})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-2">Requisition Items</label>
            {poItems.map((item, idx) => (
              <div key={idx} className="grid grid-cols-12 gap-2 mb-2 items-center">
                <div className="col-span-3">
                  <input
                    type="text"
                    value={item.sku}
                    onChange={e => {
                      const updated = [...poItems];
                      updated[idx].sku = e.target.value;
                      setPoItems(updated);
                    }}
                    placeholder="SKU"
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
                <div className="col-span-5">
                  <input
                    type="text"
                    value={item.description}
                    onChange={e => {
                      const updated = [...poItems];
                      updated[idx].description = e.target.value;
                      setPoItems(updated);
                    }}
                    placeholder="Description"
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
                <div className="col-span-2">
                  <input
                    type="number"
                    value={item.qty}
                    onChange={e => {
                      const updated = [...poItems];
                      updated[idx].qty = Number(e.target.value);
                      setPoItems(updated);
                    }}
                    placeholder="Qty"
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
                <div className="col-span-2">
                  <input
                    type="number"
                    value={item.unitCost}
                    onChange={e => {
                      const updated = [...poItems];
                      updated[idx].unitCost = Number(e.target.value);
                      setPoItems(updated);
                    }}
                    placeholder="Unit Cost"
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
              </div>
            ))}
          </div>

          <div>
            <label className="block font-semibold mb-1">Contract / Delivery Notes</label>
            <textarea
              rows={2}
              value={poNotes}
              onChange={e => setPoNotes(e.target.value)}
              placeholder="e.g. Include Certificate of Analysis and ISO 9001 quality compliance sheet."
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};
