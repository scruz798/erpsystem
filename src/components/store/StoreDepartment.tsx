import React, { useState, useEffect } from 'react';
import { storageService } from '../../services/storageService';
import { InventoryItem, StockMovement, GoodsReceivedNote, StockStatus } from '../../types/erp';
import { DataTable, Column } from '../common/DataTable';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { StatsCard } from '../common/StatsCard';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { 
  Boxes, 
  Package, 
  AlertTriangle, 
  Plus, 
  RefreshCw, 
  Truck, 
  Layers, 
  CheckCircle2, 
  XCircle,
  Warehouse
} from 'lucide-react';

export const StoreDepartment: React.FC = () => {
  const { hasPermission, currentUser } = useAuth();
  const { addNotification } = useNotification();

  const [activeSubTab, setActiveSubTab] = useState<'inventory' | 'grn' | 'movements'>('inventory');
  const [inventory, setInventory] = useState<InventoryItem[]>(() => storageService.getInventory());
  const [movements, setMovements] = useState<StockMovement[]>(() => storageService.getMovements());
  const [grns, setGrns] = useState<GoodsReceivedNote[]>(() => storageService.getGRNs());

  const [selectedItemForAdjust, setSelectedItemForAdjust] = useState<InventoryItem | null>(null);
  const [adjustQty, setAdjustQty] = useState('10');
  const [adjustType, setAdjustType] = useState<'Inward' | 'Outward'>('Inward');
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);

  // Form State for New Item
  const [newItemSku, setNewItemSku] = useState('');
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<InventoryItem['category']>('Industrial Electronics');
  const [newItemQty, setNewItemQty] = useState('50');
  const [newItemMinLevel, setNewItemMinLevel] = useState('15');
  const [newItemCost, setNewItemCost] = useState('1200');
  const [newItemPrice, setNewItemPrice] = useState('2100');
  const [newItemLocation, setNewItemLocation] = useState('WH-A1-Bay01');

  useEffect(() => {
    const handleUpdate = () => {
      setInventory(storageService.getInventory());
      setMovements(storageService.getMovements());
      setGrns(storageService.getGRNs());
    };
    window.addEventListener('hzhy-erp-storage-update', handleUpdate);
    return () => window.removeEventListener('hzhy-erp-storage-update', handleUpdate);
  }, []);

  const totalStockItems = inventory.reduce((sum, item) => sum + item.stockOnHand, 0);
  const lowStockCount = inventory.filter(item => item.stockOnHand <= item.minReorderLevel).length;

  const handleStockAdjustSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItemForAdjust) return;

    const qtyNum = Number(adjustQty);
    const newQty = adjustType === 'Inward' 
      ? selectedItemForAdjust.stockOnHand + qtyNum 
      : Math.max(0, selectedItemForAdjust.stockOnHand - qtyNum);

    const newStatus: StockStatus = newQty === 0 
      ? 'Out of Stock' 
      : newQty <= selectedItemForAdjust.minReorderLevel 
      ? 'Low Stock' 
      : 'In Stock';

    const updatedItem: InventoryItem = {
      ...selectedItemForAdjust,
      stockOnHand: newQty,
      status: newStatus,
      lastRestocked: new Date().toISOString().split('T')[0]
    };

    const updatedList = inventory.map(i => i.id === updatedItem.id ? updatedItem : i);
    storageService.setInventory(updatedList);

    // Record Stock Movement Log
    const newMovement: StockMovement = {
      id: `sm-${Date.now()}`,
      movementNo: `MOV-2026-${Math.floor(100 + Math.random() * 900)}`,
      sku: updatedItem.sku,
      itemName: updatedItem.name,
      type: adjustType === 'Inward' ? 'Inward (GRN)' : 'Outward (Sales)',
      quantity: qtyNum,
      sourceLocation: adjustType === 'Inward' ? 'Supplier Restock' : updatedItem.warehouseLocation,
      destinationLocation: adjustType === 'Inward' ? updatedItem.warehouseLocation : 'Client Dispatch',
      referenceNo: `ADJ-${Date.now().toString().substring(8)}`,
      performedBy: currentUser?.name || 'David O\'Connor',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };

    storageService.setMovements([newMovement, ...movements]);
    addNotification('Stock Adjusted', `Updated ${updatedItem.sku} stock to ${newQty} ${updatedItem.unit}.`, 'success');
    setSelectedItemForAdjust(null);
  };

  const handleAddItemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = Number(newItemQty);
    const minLvl = Number(newItemMinLevel);
    const status: StockStatus = qty === 0 ? 'Out of Stock' : qty <= minLvl ? 'Low Stock' : 'In Stock';

    const newItem: InventoryItem = {
      id: `p-${Date.now()}`,
      sku: newItemSku || `HZ-SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      name: newItemName,
      category: newItemCategory,
      unit: 'pcs',
      stockOnHand: qty,
      minReorderLevel: minLvl,
      unitCost: Number(newItemCost),
      sellingPrice: Number(newItemPrice),
      warehouseLocation: newItemLocation,
      status,
      lastRestocked: new Date().toISOString().split('T')[0]
    };

    storageService.setInventory([newItem, ...inventory]);
    addNotification('SKU Cataloged', `New inventory item ${newItem.sku} added to ${newItem.warehouseLocation}.`, 'success');
    setIsAddItemModalOpen(false);
  };

  const inventoryColumns: Column<InventoryItem>[] = [
    {
      key: 'sku',
      header: 'SKU / Part #',
      render: (item) => <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{item.sku}</span>
    },
    {
      key: 'name',
      header: 'Product Description',
      render: (item) => (
        <div>
          <p className="font-bold text-slate-900 dark:text-white">{item.name}</p>
          <p className="text-[10px] text-slate-400">{item.category}</p>
        </div>
      )
    },
    { key: 'warehouseLocation', header: 'Location' },
    {
      key: 'stockOnHand',
      header: 'Stock Level',
      render: (item) => (
        <span className="font-extrabold text-slate-900 dark:text-white">
          {item.stockOnHand} {item.unit}
        </span>
      )
    },
    {
      key: 'status',
      header: 'Status',
      render: (item) => (
        <Badge variant={item.status === 'In Stock' ? 'emerald' : item.status === 'Low Stock' ? 'amber' : 'rose'}>
          {item.status}
        </Badge>
      )
    },
    {
      key: 'unitCost',
      header: 'Cost / Price',
      render: (item) => (
        <span className="text-slate-500 dark:text-slate-400">
          ${item.unitCost} / <strong className="text-slate-900 dark:text-white">${item.sellingPrice}</strong>
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Adjust Stock',
      render: (item) => (
        hasPermission('store', 'edit') && (
          <button
            onClick={() => setSelectedItemForAdjust(item)}
            className="px-2.5 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors"
          >
            <RefreshCw className="w-3 h-3" /> Adjust
          </button>
        )
      )
    }
  ];

  const movementColumns: Column<StockMovement>[] = [
    { key: 'movementNo', header: 'Movement #' },
    { key: 'sku', header: 'SKU' },
    { key: 'type', header: 'Movement Type' },
    { key: 'quantity', header: 'Qty' },
    { key: 'sourceLocation', header: 'From' },
    { key: 'destinationLocation', header: 'To' },
    { key: 'timestamp', header: 'Timestamp' }
  ];

  return (
    <div className="space-y-6">
      {/* Sub-tab Navigation Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Boxes className="w-5 h-5 text-indigo-600" /> Store & Warehouse Operations
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Stock control, warehouse bay allocations, Goods Received Notes (GRN) & audits.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl flex items-center gap-1 text-xs">
            <button
              onClick={() => setActiveSubTab('inventory')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeSubTab === 'inventory' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Stock Catalog
            </button>
            <button
              onClick={() => setActiveSubTab('grn')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeSubTab === 'grn' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Goods Received Notes
            </button>
            <button
              onClick={() => setActiveSubTab('movements')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeSubTab === 'movements' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Stock Audit Log
            </button>
          </div>

          {hasPermission('store', 'create') && (
            <button
              onClick={() => setIsAddItemModalOpen(true)}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Product SKU
            </button>
          )}
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard
          title="Total SKUs Cataloged"
          value={inventory.length}
          subtext="Active warehouse items"
          icon={Layers}
          iconBgColor="bg-indigo-500/10"
          iconColor="text-indigo-600 dark:text-indigo-400"
        />
        <StatsCard
          title="Total Stock Units On Hand"
          value={totalStockItems.toLocaleString()}
          subtext="Distributed across WH-A, B & C"
          icon={Warehouse}
          iconBgColor="bg-sky-500/10"
          iconColor="text-sky-600 dark:text-sky-400"
        />
        <StatsCard
          title="Low Stock / Restock Triggers"
          value={lowStockCount}
          subtext={lowStockCount > 0 ? 'Requires Purchase Requisition' : 'All thresholds healthy'}
          icon={AlertTriangle}
          iconBgColor="bg-amber-500/10"
          iconColor="text-amber-600 dark:text-amber-400"
        />
      </div>

      {/* Main Tab Views */}
      {activeSubTab === 'inventory' && (
        <DataTable
          title="Warehouse Inventory Master Table"
          data={inventory}
          columns={inventoryColumns}
          searchPlaceholder="Search SKU, item name, location..."
        />
      )}

      {activeSubTab === 'grn' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <Truck className="w-5 h-5 text-emerald-600" /> Inspected Goods Received Notes (GRN)
            </h3>
            <div className="space-y-4">
              {grns.map(grn => (
                <div key={grn.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 text-xs">
                  <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-700/60 pb-2 mb-3">
                    <div>
                      <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{grn.grnNumber}</span>
                      <span className="text-slate-400 ml-2">Linked PO: {grn.poNumber}</span>
                    </div>
                    <span className="text-slate-500">Received on: {grn.receivedDate} by {grn.receivedBy}</span>
                  </div>
                  <p className="font-bold text-slate-900 dark:text-white mb-2">Supplier: {grn.supplierName}</p>
                  <div className="space-y-1.5">
                    {grn.items.map((it, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
                        <span>{it.sku} - {it.itemName}</span>
                        <div className="flex items-center gap-3">
                          <span className="font-bold">Qty: {it.receivedQty} / {it.orderedQty}</span>
                          <Badge variant={it.qcStatus === 'Passed' ? 'emerald' : 'rose'}>{it.qcStatus}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'movements' && (
        <DataTable
          title="Stock Audit & Movements Register"
          data={movements}
          columns={movementColumns}
          searchPlaceholder="Search movement #, SKU or performer..."
        />
      )}

      {/* Adjust Stock Modal */}
      <Modal
        isOpen={!!selectedItemForAdjust}
        onClose={() => setSelectedItemForAdjust(null)}
        title={`Stock Level Adjustment - ${selectedItemForAdjust?.sku}`}
        subtitle="Manually update quantity on hand following physical warehouse counting."
        maxWidth="md"
        footer={
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedItemForAdjust(null)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
            >
              Cancel
            </button>
            <button
              onClick={handleStockAdjustSubmit}
              className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-md"
            >
              Confirm Adjustment
            </button>
          </div>
        }
      >
        <form className="space-y-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            <p className="font-bold">{selectedItemForAdjust?.name}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Current Location: {selectedItemForAdjust?.warehouseLocation}</p>
            <p className="text-sm font-extrabold text-blue-600 dark:text-blue-400 mt-1">
              Current Stock: {selectedItemForAdjust?.stockOnHand} {selectedItemForAdjust?.unit}
            </p>
          </div>

          <div>
            <label className="block font-semibold mb-1">Adjustment Type</label>
            <select
              value={adjustType}
              onChange={e => setAdjustType(e.target.value as 'Inward' | 'Outward')}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
            >
              <option value="Inward">Inward (Add to Stock)</option>
              <option value="Outward">Outward (Deduct from Stock)</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1">Quantity Adjustment</label>
            <input
              type="number"
              min="1"
              value={adjustQty}
              onChange={e => setAdjustQty(e.target.value)}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
            />
          </div>
        </form>
      </Modal>

      {/* Add Item Modal */}
      <Modal
        isOpen={isAddItemModalOpen}
        onClose={() => setIsAddItemModalOpen(false)}
        title="Catalog New Product SKU"
        subtitle="Registers a new hardware or material item into warehouse catalog."
        maxWidth="md"
        footer={
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAddItemModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
            >
              Cancel
            </button>
            <button
              onClick={handleAddItemSubmit}
              className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-md"
            >
              Catalog SKU
            </button>
          </div>
        }
      >
        <form className="space-y-3 text-xs">
          <div>
            <label className="block font-semibold mb-1">SKU / Part Number</label>
            <input
              type="text"
              value={newItemSku}
              onChange={e => setNewItemSku(e.target.value)}
              placeholder="e.g. HZ-SEN-990"
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Product Description</label>
            <input
              type="text"
              value={newItemName}
              onChange={e => setNewItemName(e.target.value)}
              required
              placeholder="e.g. Fiber-Optic Thermal Probe Module"
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Category</label>
            <select
              value={newItemCategory}
              onChange={e => setNewItemCategory(e.target.value as any)}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
            >
              <option value="Industrial Electronics">Industrial Electronics</option>
              <option value="Machinery Parts">Machinery Parts</option>
              <option value="Raw Metals">Raw Metals</option>
              <option value="Assembly Hardware">Assembly Hardware</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1">Initial Stock Qty</label>
              <input
                type="number"
                value={newItemQty}
                onChange={e => setNewItemQty(e.target.value)}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Min Reorder Level</label>
              <input
                type="number"
                value={newItemMinLevel}
                onChange={e => setNewItemMinLevel(e.target.value)}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1">Unit Cost ($)</label>
              <input
                type="number"
                value={newItemCost}
                onChange={e => setNewItemCost(e.target.value)}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Selling Price ($)</label>
              <input
                type="number"
                value={newItemPrice}
                onChange={e => setNewItemPrice(e.target.value)}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1">Warehouse Bay Location</label>
            <input
              type="text"
              value={newItemLocation}
              onChange={e => setNewItemLocation(e.target.value)}
              placeholder="e.g. WH-A2-Bay08"
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};
