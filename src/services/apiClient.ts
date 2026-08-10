import { storageService } from './storageService';
import { 
  SalesOrder, 
  Customer, 
  Transaction, 
  InventoryItem, 
  PurchaseOrder, 
  Supplier, 
  User, 
  AuditLog 
} from '../types/erp';

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  meta?: {
    total?: number;
    page?: number;
    laravelRoute?: string;
    method?: string;
  };
}

class ApiClient {
  private getHeaders() {
    const config = storageService.getApiConfig();
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${config.bearerToken}`
    };
  }

  // --- Sales Endpoints ---
  async getSalesOrders(): Promise<ApiResponse<SalesOrder[]>> {
    const config = storageService.getApiConfig();
    const route = `${config.baseUrl}/sales/orders`;
    
    if (config.useLiveApi) {
      try {
        const res = await fetch(route, { headers: this.getHeaders() });
        if (res.ok) {
          const json = await res.json();
          return { success: true, data: json.data || json, meta: { laravelRoute: `GET ${route}` } };
        }
      } catch (err) {
        console.warn('Laravel Live API connection fallback to local state:', err);
      }
    }
    
    return {
      success: true,
      data: storageService.getSalesOrders(),
      meta: { laravelRoute: `GET ${route}`, method: 'GET' }
    };
  }

  async createSalesOrder(order: Omit<SalesOrder, 'id'>): Promise<ApiResponse<SalesOrder>> {
    const config = storageService.getApiConfig();
    const route = `${config.baseUrl}/sales/orders`;
    const orders = storageService.getSalesOrders();
    
    const newOrder: SalesOrder = {
      ...order,
      id: `so-${Date.now()}`
    };

    if (config.useLiveApi) {
      try {
        const res = await fetch(route, {
          method: 'POST',
          headers: this.getHeaders(),
          body: JSON.stringify(newOrder)
        });
        if (res.ok) {
          const json = await res.json();
          return { success: true, data: json.data || json, message: 'Sales Order created in Laravel' };
        }
      } catch (err) {
        console.warn('Laravel POST failed, saving locally:', err);
      }
    }

    storageService.setSalesOrders([newOrder, ...orders]);
    storageService.addAuditLog({
      userName: newOrder.createdByName,
      userRole: 'Sales Officer',
      department: 'Sales',
      action: `Created Sales Order #${newOrder.orderNumber} ($${newOrder.totalAmount.toLocaleString()})`,
      ipAddress: '127.0.0.1',
      status: 'Success'
    });

    return {
      success: true,
      data: newOrder,
      message: 'Sales Order created successfully',
      meta: { laravelRoute: `POST ${route}` }
    };
  }

  // --- Inventory / Store Endpoints ---
  async getInventoryItems(): Promise<ApiResponse<InventoryItem[]>> {
    const config = storageService.getApiConfig();
    const route = `${config.baseUrl}/inventory/items`;
    
    if (config.useLiveApi) {
      try {
        const res = await fetch(route, { headers: this.getHeaders() });
        if (res.ok) {
          const json = await res.json();
          return { success: true, data: json.data || json, meta: { laravelRoute: `GET ${route}` } };
        }
      } catch (err) {
        console.warn('Laravel Live API fallback:', err);
      }
    }

    return {
      success: true,
      data: storageService.getInventory(),
      meta: { laravelRoute: `GET ${route}` }
    };
  }

  async updateInventoryItem(item: InventoryItem): Promise<ApiResponse<InventoryItem>> {
    const config = storageService.getApiConfig();
    const route = `${config.baseUrl}/inventory/items/${item.id}`;
    const items = storageService.getInventory();
    const updated = items.map(i => i.id === item.id ? item : i);

    storageService.setInventory(updated);
    storageService.addAuditLog({
      userName: 'Store Keeper',
      userRole: 'Store Keeper',
      department: 'Store',
      action: `Updated Stock Item ${item.sku} (${item.stockOnHand} ${item.unit})`,
      ipAddress: '127.0.0.1',
      status: 'Success'
    });

    return {
      success: true,
      data: item,
      message: 'Inventory updated successfully',
      meta: { laravelRoute: `PUT ${route}` }
    };
  }

  // --- Purchasing Endpoints ---
  async getPurchaseOrders(): Promise<ApiResponse<PurchaseOrder[]>> {
    const config = storageService.getApiConfig();
    const route = `${config.baseUrl}/purchasing/orders`;

    return {
      success: true,
      data: storageService.getPurchaseOrders(),
      meta: { laravelRoute: `GET ${route}` }
    };
  }

  async createPurchaseOrder(po: Omit<PurchaseOrder, 'id'>): Promise<ApiResponse<PurchaseOrder>> {
    const config = storageService.getApiConfig();
    const route = `${config.baseUrl}/purchasing/orders`;
    const pos = storageService.getPurchaseOrders();

    const newPo: PurchaseOrder = {
      ...po,
      id: `po-${Date.now()}`
    };

    storageService.setPurchaseOrders([newPo, ...pos]);
    storageService.addAuditLog({
      userName: newPo.requestedBy,
      userRole: 'Purchasing Agent',
      department: 'Purchasing',
      action: `Issued Purchase Order #${newPo.poNumber} to ${newPo.supplierName}`,
      ipAddress: '127.0.0.1',
      status: 'Success'
    });

    return {
      success: true,
      data: newPo,
      message: 'Purchase Order created successfully',
      meta: { laravelRoute: `POST ${route}` }
    };
  }

  // --- Finance Endpoints ---
  async getTransactions(): Promise<ApiResponse<Transaction[]>> {
    const config = storageService.getApiConfig();
    const route = `${config.baseUrl}/finance/transactions`;

    return {
      success: true,
      data: storageService.getTransactions(),
      meta: { laravelRoute: `GET ${route}` }
    };
  }

  async createTransaction(tx: Omit<Transaction, 'id'>): Promise<ApiResponse<Transaction>> {
    const config = storageService.getApiConfig();
    const route = `${config.baseUrl}/finance/transactions`;
    const txs = storageService.getTransactions();

    const newTx: Transaction = {
      ...tx,
      id: `tx-${Date.now()}`
    };

    storageService.setTransactions([newTx, ...txs]);
    storageService.addAuditLog({
      userName: newTx.recordedBy,
      userRole: 'Finance Officer',
      department: 'Finance',
      action: `Logged ${newTx.type} transaction #${newTx.referenceNo} ($${newTx.amount.toLocaleString()})`,
      ipAddress: '127.0.0.1',
      status: 'Success'
    });

    return {
      success: true,
      data: newTx,
      message: 'Transaction logged successfully',
      meta: { laravelRoute: `POST ${route}` }
    };
  }
}

export const apiClient = new ApiClient();
