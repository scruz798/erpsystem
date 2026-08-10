export type UserRole = 
  | 'Super Admin'
  | 'Sales Manager'
  | 'Finance Manager'
  | 'Store Keeper'
  | 'Purchasing Agent';

export type DepartmentKey = 'dashboard' | 'sales' | 'finance' | 'store' | 'purchasing' | 'admin';

export interface DepartmentPermission {
  department: DepartmentKey;
  canView: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canApprove: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  department: string;
  permissions: Record<DepartmentKey, {
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
    approve: boolean;
  }>;
  status: 'Active' | 'Inactive';
  lastLogin: string;
}

// Sales Department Types
export type SalesOrderStatus = 'Draft' | 'Pending Approval' | 'Approved' | 'Invoiced' | 'Delivered' | 'Cancelled';

export interface SalesOrderItem {
  id: string;
  productId: string;
  sku: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface SalesOrder {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  date: string;
  dueDate: string;
  items: SalesOrderItem[];
  subtotal: number;
  tax: number;
  discount: number;
  totalAmount: number;
  status: SalesOrderStatus;
  paymentStatus: 'Unpaid' | 'Partial' | 'Paid';
  createdByName: string;
  notes?: string;
}

export interface Customer {
  id: string;
  code: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  address: string;
  creditLimit: number;
  outstandingBalance: number;
  status: 'Active' | 'On Hold' | 'Inactive';
  createdAt: string;
}

// Finance Department Types
export type TransactionType = 'Income' | 'Expense';
export type TransactionCategory = 
  | 'Sales Revenue'
  | 'Raw Material Purchase'
  | 'Logistics & Freight'
  | 'Salaries & Payroll'
  | 'Utilities & Office'
  | 'Equipment & Maintenance'
  | 'Tax & Duties';

export interface Transaction {
  id: string;
  referenceNo: string;
  type: TransactionType;
  category: TransactionCategory;
  amount: number;
  date: string;
  department: string;
  description: string;
  paymentMethod: 'Bank Transfer' | 'Credit Card' | 'Cheque' | 'Cash';
  status: 'Completed' | 'Pending' | 'Cancelled';
  recordedBy: string;
}

export interface ReceivableInvoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  amount: number;
  paidAmount: number;
  issueDate: string;
  dueDate: string;
  status: 'Paid' | 'Partially Paid' | 'Overdue' | 'Pending';
}

export interface PayableInvoice {
  id: string;
  billNumber: string;
  supplierName: string;
  amount: number;
  paidAmount: number;
  issueDate: string;
  dueDate: string;
  status: 'Paid' | 'Partially Paid' | 'Overdue' | 'Pending';
}

// Store / Inventory Types
export type StockStatus = 'In Stock' | 'Low Stock' | 'Out of Stock';

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: 'Industrial Electronics' | 'Machinery Parts' | 'Raw Metals' | 'Packaging' | 'Assembly Hardware';
  unit: 'pcs' | 'kg' | 'meters' | 'boxes' | 'sets';
  stockOnHand: number;
  minReorderLevel: number;
  unitCost: number;
  sellingPrice: number;
  warehouseLocation: string;
  status: StockStatus;
  lastRestocked: string;
}

export interface StockMovement {
  id: string;
  movementNo: string;
  sku: string;
  itemName: string;
  type: 'Inward (GRN)' | 'Outward (Sales)' | 'Transfer' | 'Adjustment';
  quantity: number;
  sourceLocation: string;
  destinationLocation: string;
  referenceNo: string;
  performedBy: string;
  timestamp: string;
}

export interface GoodsReceivedNote {
  id: string;
  grnNumber: string;
  poNumber: string;
  supplierName: string;
  receivedDate: string;
  receivedBy: string;
  items: {
    sku: string;
    itemName: string;
    orderedQty: number;
    receivedQty: number;
    qcStatus: 'Passed' | 'Rejected' | 'Conditional';
  }[];
  notes?: string;
}

// Purchasing Department Types
export type PurchaseOrderStatus = 'Draft' | 'Pending Approval' | 'Approved' | 'Sent to Supplier' | 'Fulfilled' | 'Rejected';

export interface PurchaseOrderItem {
  id: string;
  itemId?: string;
  sku: string;
  description: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplierId: string;
  supplierName: string;
  orderDate: string;
  expectedDelivery: string;
  items: PurchaseOrderItem[];
  totalAmount: number;
  status: PurchaseOrderStatus;
  requestedBy: string;
  approvedBy?: string;
  notes?: string;
}

export interface Supplier {
  id: string;
  code: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  rating: number; // 1-5
  leadTimeDays: number;
  paymentTerms: string;
  activeOrdersCount: number;
  address: string;
}

// Admin Audit & Config Types
export interface AuditLog {
  id: string;
  timestamp: string;
  userName: string;
  userRole: string;
  department: string;
  action: string;
  ipAddress: string;
  status: 'Success' | 'Warning' | 'Failed';
}

export interface LaravelApiConfig {
  baseUrl: string;
  bearerToken: string;
  useLiveApi: boolean;
  syncIntervalMinutes: number;
  timeoutMs: number;
}
