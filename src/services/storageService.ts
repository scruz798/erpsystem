import { 
  User, 
  SalesOrder, 
  Customer, 
  Transaction, 
  ReceivableInvoice, 
  PayableInvoice, 
  InventoryItem, 
  StockMovement, 
  GoodsReceivedNote, 
  PurchaseOrder, 
  Supplier, 
  AuditLog, 
  LaravelApiConfig 
} from '../types/erp';
import { 
  INITIAL_USERS, 
  INITIAL_CUSTOMERS, 
  INITIAL_SALES_ORDERS, 
  INITIAL_TRANSACTIONS, 
  INITIAL_RECEIVABLES, 
  INITIAL_PAYABLES, 
  INITIAL_INVENTORY, 
  INITIAL_MOVEMENTS, 
  INITIAL_GRNS, 
  INITIAL_PURCHASE_ORDERS, 
  INITIAL_SUPPLIERS, 
  INITIAL_AUDIT_LOGS, 
  DEFAULT_LARAVEL_API_CONFIG 
} from '../data/mockData';

const STORAGE_KEYS = {
  USERS: 'hzhy_erp_users',
  CUSTOMERS: 'hzhy_erp_customers',
  SALES_ORDERS: 'hzhy_erp_sales_orders',
  TRANSACTIONS: 'hzhy_erp_transactions',
  RECEIVABLES: 'hzhy_erp_receivables',
  PAYABLES: 'hzhy_erp_payables',
  INVENTORY: 'hzhy_erp_inventory',
  MOVEMENTS: 'hzhy_erp_movements',
  GRNS: 'hzhy_erp_grns',
  PURCHASE_ORDERS: 'hzhy_erp_purchase_orders',
  SUPPLIERS: 'hzhy_erp_suppliers',
  AUDIT_LOGS: 'hzhy_erp_audit_logs',
  API_CONFIG: 'hzhy_erp_api_config',
  CURRENT_USER: 'hzhy_erp_current_user',
  THEME: 'hzhy_erp_theme'
};

function getItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (err) {
    console.warn(`Error reading key ${key} from localStorage:`, err);
    return defaultValue;
  }
}

function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event('hzhy-erp-storage-update'));
  } catch (err) {
    console.warn(`Error writing key ${key} to localStorage:`, err);
  }
}

export const storageService = {
  getUsers: (): User[] => getItem(STORAGE_KEYS.USERS, INITIAL_USERS),
  setUsers: (users: User[]) => setItem(STORAGE_KEYS.USERS, users),

  getCustomers: (): Customer[] => getItem(STORAGE_KEYS.CUSTOMERS, INITIAL_CUSTOMERS),
  setCustomers: (customers: Customer[]) => setItem(STORAGE_KEYS.CUSTOMERS, customers),

  getSalesOrders: (): SalesOrder[] => getItem(STORAGE_KEYS.SALES_ORDERS, INITIAL_SALES_ORDERS),
  setSalesOrders: (orders: SalesOrder[]) => setItem(STORAGE_KEYS.SALES_ORDERS, orders),

  getTransactions: (): Transaction[] => getItem(STORAGE_KEYS.TRANSACTIONS, INITIAL_TRANSACTIONS),
  setTransactions: (transactions: Transaction[]) => setItem(STORAGE_KEYS.TRANSACTIONS, transactions),

  getReceivables: (): ReceivableInvoice[] => getItem(STORAGE_KEYS.RECEIVABLES, INITIAL_RECEIVABLES),
  setReceivables: (receivables: ReceivableInvoice[]) => setItem(STORAGE_KEYS.RECEIVABLES, receivables),

  getPayables: (): PayableInvoice[] => getItem(STORAGE_KEYS.PAYABLES, INITIAL_PAYABLES),
  setPayables: (payables: PayableInvoice[]) => setItem(STORAGE_KEYS.PAYABLES, payables),

  getInventory: (): InventoryItem[] => getItem(STORAGE_KEYS.INVENTORY, INITIAL_INVENTORY),
  setInventory: (inventory: InventoryItem[]) => setItem(STORAGE_KEYS.INVENTORY, inventory),

  getMovements: (): StockMovement[] => getItem(STORAGE_KEYS.MOVEMENTS, INITIAL_MOVEMENTS),
  setMovements: (movements: StockMovement[]) => setItem(STORAGE_KEYS.MOVEMENTS, movements),

  getGRNs: (): GoodsReceivedNote[] => getItem(STORAGE_KEYS.GRNS, INITIAL_GRNS),
  setGRNs: (grns: GoodsReceivedNote[]) => setItem(STORAGE_KEYS.GRNS, grns),

  getPurchaseOrders: (): PurchaseOrder[] => getItem(STORAGE_KEYS.PURCHASE_ORDERS, INITIAL_PURCHASE_ORDERS),
  setPurchaseOrders: (pos: PurchaseOrder[]) => setItem(STORAGE_KEYS.PURCHASE_ORDERS, pos),

  getSuppliers: (): Supplier[] => getItem(STORAGE_KEYS.SUPPLIERS, INITIAL_SUPPLIERS),
  setSuppliers: (suppliers: Supplier[]) => setItem(STORAGE_KEYS.SUPPLIERS, suppliers),

  getAuditLogs: (): AuditLog[] => getItem(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS),
  addAuditLog: (log: Omit<AuditLog, 'id' | 'timestamp'>) => {
    const logs = getItem<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
    const newLog: AuditLog = {
      ...log,
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    setItem(STORAGE_KEYS.AUDIT_LOGS, [newLog, ...logs]);
  },

  getApiConfig: (): LaravelApiConfig => getItem(STORAGE_KEYS.API_CONFIG, DEFAULT_LARAVEL_API_CONFIG),
  setApiConfig: (config: LaravelApiConfig) => setItem(STORAGE_KEYS.API_CONFIG, config),

  getCurrentUser: (): User | null => getItem(STORAGE_KEYS.CURRENT_USER, INITIAL_USERS[0]),
  setCurrentUser: (user: User | null) => setItem(STORAGE_KEYS.CURRENT_USER, user),

  getTheme: (): 'light' | 'dark' => getItem(STORAGE_KEYS.THEME, 'light'),
  setTheme: (theme: 'light' | 'dark') => setItem(STORAGE_KEYS.THEME, theme),

  resetToDefaults: () => {
    localStorage.clear();
    window.dispatchEvent(new Event('hzhy-erp-storage-update'));
  }
};
