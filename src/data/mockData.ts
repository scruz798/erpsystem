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

export const INITIAL_USERS: User[] = [
  {
    id: 'u-1',
    name: 'Alexander Chen',
    email: 'a.chen@hzhy-enterprise.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    role: 'Super Admin',
    department: 'Executive Board',
    status: 'Active',
    lastLogin: '2026-08-09 19:42:10',
    permissions: {
      dashboard: { view: true, create: true, edit: true, delete: true, approve: true },
      sales: { view: true, create: true, edit: true, delete: true, approve: true },
      finance: { view: true, create: true, edit: true, delete: true, approve: true },
      store: { view: true, create: true, edit: true, delete: true, approve: true },
      purchasing: { view: true, create: true, edit: true, delete: true, approve: true },
      admin: { view: true, create: true, edit: true, delete: true, approve: true }
    }
  },
  {
    id: 'u-2',
    name: 'Sarah Jenkins',
    email: 's.jenkins@hzhy-enterprise.com',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
    role: 'Sales Manager',
    department: 'Sales & Marketing',
    status: 'Active',
    lastLogin: '2026-08-09 18:15:00',
    permissions: {
      dashboard: { view: true, create: false, edit: false, delete: false, approve: false },
      sales: { view: true, create: true, edit: true, delete: true, approve: true },
      finance: { view: true, create: false, edit: false, delete: false, approve: false },
      store: { view: true, create: false, edit: false, delete: false, approve: false },
      purchasing: { view: true, create: false, edit: false, delete: false, approve: false },
      admin: { view: false, create: false, edit: false, delete: false, approve: false }
    }
  },
  {
    id: 'u-3',
    name: 'Marcus Vance',
    email: 'm.vance@hzhy-enterprise.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    role: 'Finance Manager',
    department: 'Finance & Treasury',
    status: 'Active',
    lastLogin: '2026-08-09 17:30:22',
    permissions: {
      dashboard: { view: true, create: false, edit: false, delete: false, approve: false },
      sales: { view: true, create: false, edit: false, delete: false, approve: false },
      finance: { view: true, create: true, edit: true, delete: true, approve: true },
      store: { view: true, create: false, edit: false, delete: false, approve: false },
      purchasing: { view: true, create: false, edit: false, delete: false, approve: true },
      admin: { view: false, create: false, edit: false, delete: false, approve: false }
    }
  },
  {
    id: 'u-4',
    name: 'David O\'Connor',
    email: 'd.oconnor@hzhy-enterprise.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
    role: 'Store Keeper',
    department: 'Warehouse & Logistics',
    status: 'Active',
    lastLogin: '2026-08-09 16:10:05',
    permissions: {
      dashboard: { view: true, create: false, edit: false, delete: false, approve: false },
      sales: { view: true, create: false, edit: false, delete: false, approve: false },
      finance: { view: false, create: false, edit: false, delete: false, approve: false },
      store: { view: true, create: true, edit: true, delete: true, approve: true },
      purchasing: { view: true, create: false, edit: false, delete: false, approve: false },
      admin: { view: false, create: false, edit: false, delete: false, approve: false }
    }
  },
  {
    id: 'u-5',
    name: 'Elena Rostova',
    email: 'e.rostova@hzhy-enterprise.com',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=250',
    role: 'Purchasing Agent',
    department: 'Procurement & Supply',
    status: 'Active',
    lastLogin: '2026-08-09 14:05:40',
    permissions: {
      dashboard: { view: true, create: false, edit: false, delete: false, approve: false },
      sales: { view: false, create: false, edit: false, delete: false, approve: false },
      finance: { view: true, create: false, edit: false, delete: false, approve: false },
      store: { view: true, create: false, edit: false, delete: false, approve: false },
      purchasing: { view: true, create: true, edit: true, delete: true, approve: true },
      admin: { view: false, create: false, edit: false, delete: false, approve: false }
    }
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'c-101',
    code: 'CUST-HZ001',
    name: 'AeroTech Dynamics Corp',
    company: 'AeroTech Dynamics',
    email: 'orders@aerotech-dyn.com',
    phone: '+1 (555) 234-8901',
    address: '742 Aviation Way, Industry Park, CA 90210',
    creditLimit: 250000,
    outstandingBalance: 68500,
    status: 'Active',
    createdAt: '2025-01-15'
  },
  {
    id: 'c-102',
    code: 'CUST-HZ002',
    name: 'Global Heavy Machinery',
    company: 'Global Machinery Ltd',
    email: 'procurement@globalmachinery.de',
    phone: '+49 89 2018 3390',
    address: 'Kaiserstraße 102, Munich, Germany',
    creditLimit: 500000,
    outstandingBalance: 142000,
    status: 'Active',
    createdAt: '2025-02-20'
  },
  {
    id: 'c-103',
    code: 'CUST-HZ003',
    name: 'Apex Automation Solutions',
    company: 'Apex Systems Inc',
    email: 'contact@apex-auto.io',
    phone: '+1 (555) 902-1144',
    address: '12 Innovation Blvd, Austin, TX 78701',
    creditLimit: 150000,
    outstandingBalance: 12400,
    status: 'Active',
    createdAt: '2025-04-10'
  },
  {
    id: 'c-104',
    code: 'CUST-HZ004',
    name: 'Pacific Power Grid Co',
    company: 'Pacific Energy Ltd',
    email: 'supplies@pacificgrid.com',
    phone: '+65 6789 2211',
    address: '88 Marina Bay Link, Singapore',
    creditLimit: 300000,
    outstandingBalance: 280000,
    status: 'On Hold',
    createdAt: '2025-05-02'
  }
];

export const INITIAL_SALES_ORDERS: SalesOrder[] = [
  {
    id: 'so-1001',
    orderNumber: 'SO-2026-0801',
    customerId: 'c-101',
    customerName: 'AeroTech Dynamics Corp',
    customerEmail: 'orders@aerotech-dyn.com',
    date: '2026-08-01',
    dueDate: '2026-08-31',
    subtotal: 58000,
    tax: 5800,
    discount: 2000,
    totalAmount: 61800,
    status: 'Approved',
    paymentStatus: 'Paid',
    createdByName: 'Sarah Jenkins',
    notes: 'Priority dispatch requested for aviation grade assemblies.',
    items: [
      { id: 'soi-1', productId: 'p-1', sku: 'HZ-PLC-900', description: 'High-Speed Industrial PLC Controller Node', quantity: 10, unitPrice: 3800, totalPrice: 38000 },
      { id: 'soi-2', productId: 'p-2', sku: 'HZ-SEN-4K', description: 'Precision Optical Thermal Sensor Pack', quantity: 20, unitPrice: 1000, totalPrice: 20000 }
    ]
  },
  {
    id: 'so-1002',
    orderNumber: 'SO-2026-0805',
    customerId: 'c-102',
    customerName: 'Global Heavy Machinery',
    customerEmail: 'procurement@globalmachinery.de',
    date: '2026-08-05',
    dueDate: '2026-09-05',
    subtotal: 125000,
    tax: 12500,
    discount: 5000,
    totalAmount: 132500,
    status: 'Invoiced',
    paymentStatus: 'Partial',
    createdByName: 'Sarah Jenkins',
    notes: 'Payment schedule: 50% upfront, 50% upon delivery.',
    items: [
      { id: 'soi-3', productId: 'p-3', sku: 'HZ-MOT-75KW', description: 'Heavy Duty 75kW Servo Motor Unit', quantity: 25, unitPrice: 5000, totalPrice: 125000 }
    ]
  },
  {
    id: 'so-1003',
    orderNumber: 'SO-2026-0808',
    customerId: 'c-103',
    customerName: 'Apex Automation Solutions',
    customerEmail: 'contact@apex-auto.io',
    date: '2026-08-08',
    dueDate: '2026-08-25',
    subtotal: 28400,
    tax: 2840,
    discount: 0,
    totalAmount: 31240,
    status: 'Pending Approval',
    paymentStatus: 'Unpaid',
    createdByName: 'Sarah Jenkins',
    notes: 'Awaiting credit check approval from Finance Manager.',
    items: [
      { id: 'soi-4', productId: 'p-4', sku: 'HZ-HYD-VALVE', description: 'Electro-Hydraulic Proportional Control Valve', quantity: 40, unitPrice: 710, totalPrice: 28400 }
    ]
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-1',
    referenceNo: 'REC-2026-001',
    type: 'Income',
    category: 'Sales Revenue',
    amount: 61800,
    date: '2026-08-02',
    department: 'Sales',
    description: 'Payment received for Order #SO-2026-0801 (AeroTech Corp)',
    paymentMethod: 'Bank Transfer',
    status: 'Completed',
    recordedBy: 'Marcus Vance'
  },
  {
    id: 'tx-2',
    referenceNo: 'EXP-2026-042',
    type: 'Expense',
    category: 'Raw Material Purchase',
    amount: 42500,
    date: '2026-08-04',
    department: 'Purchasing',
    description: 'PO #PO-2026-092 payment to Apex Semiconductor Suppliers',
    paymentMethod: 'Bank Transfer',
    status: 'Completed',
    recordedBy: 'Marcus Vance'
  },
  {
    id: 'tx-3',
    referenceNo: 'EXP-2026-043',
    type: 'Expense',
    category: 'Logistics & Freight',
    amount: 8400,
    date: '2026-08-06',
    department: 'Store',
    description: 'Freight air transport charges for heavy machinery parts batch #B04',
    paymentMethod: 'Credit Card',
    status: 'Completed',
    recordedBy: 'Marcus Vance'
  },
  {
    id: 'tx-4',
    referenceNo: 'EXP-2026-044',
    type: 'Expense',
    category: 'Salaries & Payroll',
    amount: 185000,
    date: '2026-08-01',
    department: 'Finance',
    description: 'Monthly payroll dispatch for HZHY staff - August 2026',
    paymentMethod: 'Bank Transfer',
    status: 'Completed',
    recordedBy: 'Marcus Vance'
  }
];

export const INITIAL_RECEIVABLES: ReceivableInvoice[] = [
  { id: 'ar-1', invoiceNumber: 'INV-2026-01', customerName: 'Global Heavy Machinery', amount: 132500, paidAmount: 66250, issueDate: '2026-08-05', dueDate: '2026-09-05', status: 'Partially Paid' },
  { id: 'ar-2', invoiceNumber: 'INV-2026-02', customerName: 'Pacific Power Grid Co', amount: 280000, paidAmount: 0, issueDate: '2026-06-15', dueDate: '2026-07-15', status: 'Overdue' },
  { id: 'ar-3', invoiceNumber: 'INV-2026-03', customerName: 'AeroTech Dynamics Corp', amount: 61800, paidAmount: 61800, issueDate: '2026-08-01', dueDate: '2026-08-31', status: 'Paid' }
];

export const INITIAL_PAYABLES: PayableInvoice[] = [
  { id: 'ap-1', billNumber: 'BILL-SUP-891', supplierName: 'Apex Semiconductor Suppliers', amount: 42500, paidAmount: 42500, issueDate: '2026-08-03', dueDate: '2026-09-03', status: 'Paid' },
  { id: 'ap-2', billNumber: 'BILL-SUP-902', supplierName: 'Precision Steel Alloys GmbH', amount: 89000, paidAmount: 0, issueDate: '2026-08-07', dueDate: '2026-09-07', status: 'Pending' },
  { id: 'ap-3', billNumber: 'BILL-SUP-772', supplierName: 'Sino-Euro Hydraulics Ltd', amount: 24000, paidAmount: 0, issueDate: '2026-07-01', dueDate: '2026-08-01', status: 'Overdue' }
];

export const INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: 'p-1',
    sku: 'HZ-PLC-900',
    name: 'High-Speed Industrial PLC Controller Node',
    category: 'Industrial Electronics',
    unit: 'pcs',
    stockOnHand: 48,
    minReorderLevel: 15,
    unitCost: 2200,
    sellingPrice: 3800,
    warehouseLocation: 'WH-A1-Bay04',
    status: 'In Stock',
    lastRestocked: '2026-07-28'
  },
  {
    id: 'p-2',
    sku: 'HZ-SEN-4K',
    name: 'Precision Optical Thermal Sensor Pack',
    category: 'Industrial Electronics',
    unit: 'pcs',
    stockOnHand: 112,
    minReorderLevel: 30,
    unitCost: 550,
    sellingPrice: 1000,
    warehouseLocation: 'WH-A2-Bay12',
    status: 'In Stock',
    lastRestocked: '2026-08-02'
  },
  {
    id: 'p-3',
    sku: 'HZ-MOT-75KW',
    name: 'Heavy Duty 75kW Servo Motor Unit',
    category: 'Machinery Parts',
    unit: 'pcs',
    stockOnHand: 6,
    minReorderLevel: 10,
    unitCost: 3200,
    sellingPrice: 5000,
    warehouseLocation: 'WH-B1-Bay01',
    status: 'Low Stock',
    lastRestocked: '2026-06-12'
  },
  {
    id: 'p-4',
    sku: 'HZ-HYD-VALVE',
    name: 'Electro-Hydraulic Proportional Control Valve',
    category: 'Assembly Hardware',
    unit: 'pcs',
    stockOnHand: 85,
    minReorderLevel: 25,
    unitCost: 410,
    sellingPrice: 710,
    warehouseLocation: 'WH-A3-Bay08',
    status: 'In Stock',
    lastRestocked: '2026-07-20'
  },
  {
    id: 'p-5',
    sku: 'HZ-ALU-6061',
    name: 'Aircraft-Grade Aluminum Alloy Bars 6061-T6',
    category: 'Raw Metals',
    unit: 'kg',
    stockOnHand: 450,
    minReorderLevel: 1000,
    unitCost: 18,
    sellingPrice: 32,
    warehouseLocation: 'WH-C1-Yard02',
    status: 'Low Stock',
    lastRestocked: '2026-05-18'
  },
  {
    id: 'p-6',
    sku: 'HZ-MICRO-IC',
    name: '32-Bit Microprocessor Core Module (Grade I)',
    category: 'Industrial Electronics',
    unit: 'pcs',
    stockOnHand: 0,
    minReorderLevel: 50,
    unitCost: 180,
    sellingPrice: 340,
    warehouseLocation: 'WH-A1-Bay02',
    status: 'Out of Stock',
    lastRestocked: '2026-04-10'
  }
];

export const INITIAL_MOVEMENTS: StockMovement[] = [
  {
    id: 'sm-1',
    movementNo: 'MOV-2026-881',
    sku: 'HZ-PLC-900',
    itemName: 'High-Speed Industrial PLC Controller Node',
    type: 'Inward (GRN)',
    quantity: 20,
    sourceLocation: 'Supplier (Apex Semi)',
    destinationLocation: 'WH-A1-Bay04',
    referenceNo: 'GRN-2026-089',
    performedBy: 'David O\'Connor',
    timestamp: '2026-08-03 14:22:00'
  },
  {
    id: 'sm-2',
    movementNo: 'MOV-2026-882',
    sku: 'HZ-SEN-4K',
    itemName: 'Precision Optical Thermal Sensor Pack',
    type: 'Outward (Sales)',
    quantity: 20,
    sourceLocation: 'WH-A2-Bay12',
    destinationLocation: 'Client (AeroTech)',
    referenceNo: 'SO-2026-0801',
    performedBy: 'David O\'Connor',
    timestamp: '2026-08-04 10:15:30'
  }
];

export const INITIAL_GRNS: GoodsReceivedNote[] = [
  {
    id: 'grn-101',
    grnNumber: 'GRN-2026-089',
    poNumber: 'PO-2026-092',
    supplierName: 'Apex Semiconductor Suppliers',
    receivedDate: '2026-08-03',
    receivedBy: 'David O\'Connor',
    notes: 'All items inspected and cleared quality control checks.',
    items: [
      { sku: 'HZ-PLC-900', itemName: 'High-Speed Industrial PLC Controller Node', orderedQty: 20, receivedQty: 20, qcStatus: 'Passed' },
      { sku: 'HZ-SEN-4K', itemName: 'Precision Optical Thermal Sensor Pack', orderedQty: 50, receivedQty: 50, qcStatus: 'Passed' }
    ]
  }
];

export const INITIAL_PURCHASE_ORDERS: PurchaseOrder[] = [
  {
    id: 'po-1',
    poNumber: 'PO-2026-092',
    supplierId: 's-1',
    supplierName: 'Apex Semiconductor Suppliers',
    orderDate: '2026-07-28',
    expectedDelivery: '2026-08-05',
    totalAmount: 42500,
    status: 'Fulfilled',
    requestedBy: 'Elena Rostova',
    approvedBy: 'Marcus Vance',
    notes: 'Raw chipsets for PLC module assembly batch #B12',
    items: [
      { id: 'poi-1', sku: 'HZ-PLC-900-CHIP', description: 'Micro-controller Chipsets', quantity: 100, unitCost: 220, totalCost: 22000 },
      { id: 'poi-2', sku: 'HZ-SEN-RAW', description: 'Optical Lens Sensors Base', quantity: 50, unitCost: 410, totalCost: 20500 }
    ]
  },
  {
    id: 'po-2',
    poNumber: 'PO-2026-098',
    supplierId: 's-2',
    supplierName: 'Precision Steel Alloys GmbH',
    orderDate: '2026-08-06',
    expectedDelivery: '2026-08-20',
    totalAmount: 89000,
    status: 'Approved',
    requestedBy: 'Elena Rostova',
    approvedBy: 'Alexander Chen',
    notes: 'Replenishment order for low-stock raw metals and 6061-T6 bars.',
    items: [
      { id: 'poi-3', sku: 'HZ-ALU-6061', description: 'Aircraft Grade Aluminum 6061-T6 Bars', quantity: 2500, unitCost: 18, totalCost: 45000 },
      { id: 'poi-4', sku: 'HZ-STEEL-4140', description: 'Hardened Alloy Steel Rods', quantity: 2000, unitCost: 22, totalCost: 44000 }
    ]
  },
  {
    id: 'po-3',
    poNumber: 'PO-2026-102',
    supplierId: 's-3',
    supplierName: 'Sino-Euro Hydraulics Ltd',
    orderDate: '2026-08-09',
    expectedDelivery: '2026-08-25',
    totalAmount: 32000,
    status: 'Pending Approval',
    requestedBy: 'Elena Rostova',
    notes: 'Emergency re-stock for 75kW servo motors.',
    items: [
      { id: 'poi-5', sku: 'HZ-MOT-75KW', description: 'Heavy Duty 75kW Servo Motor Unit Base', quantity: 10, unitCost: 3200, totalCost: 32000 }
    ]
  }
];

export const INITIAL_SUPPLIERS: Supplier[] = [
  {
    id: 's-1',
    code: 'SUP-001',
    name: 'Apex Semiconductor Suppliers',
    contactPerson: 'Hans Weber',
    email: 'h.weber@apexsemi.com',
    phone: '+49 30 9988 7766',
    rating: 4.9,
    leadTimeDays: 7,
    paymentTerms: 'Net 30',
    activeOrdersCount: 0,
    address: 'Electronics Plaza 44, Dresden, Germany'
  },
  {
    id: 's-2',
    code: 'SUP-002',
    name: 'Precision Steel Alloys GmbH',
    contactPerson: 'Klaus Schmidt',
    email: 'sales@precisionsteel.de',
    phone: '+49 89 4433 2211',
    rating: 4.7,
    leadTimeDays: 14,
    paymentTerms: 'Net 45',
    activeOrdersCount: 1,
    address: 'Metallweg 12, Essen, Germany'
  },
  {
    id: 's-3',
    code: 'SUP-003',
    name: 'Sino-Euro Hydraulics Ltd',
    contactPerson: 'Wei Dong',
    email: 'contact@se-hydraulics.com',
    phone: '+86 21 6888 9900',
    rating: 4.5,
    leadTimeDays: 12,
    paymentTerms: 'Net 30',
    activeOrdersCount: 1,
    address: 'Industrial Development Zone 8, Shanghai, China'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-101',
    timestamp: '2026-08-09 19:42:10',
    userName: 'Alexander Chen',
    userRole: 'Super Admin',
    department: 'Admin',
    action: 'Logged into system session with elevated IP',
    ipAddress: '192.168.1.10',
    status: 'Success'
  },
  {
    id: 'log-102',
    timestamp: '2026-08-09 18:30:00',
    userName: 'Elena Rostova',
    userRole: 'Purchasing Agent',
    department: 'Purchasing',
    action: 'Created Purchase Order #PO-2026-102 ($32,000)',
    ipAddress: '192.168.1.42',
    status: 'Success'
  },
  {
    id: 'log-103',
    timestamp: '2026-08-09 17:15:00',
    userName: 'Marcus Vance',
    userRole: 'Finance Manager',
    department: 'Finance',
    action: 'Approved payment dispatch for PO #PO-2026-092',
    ipAddress: '192.168.1.25',
    status: 'Success'
  },
  {
    id: 'log-104',
    timestamp: '2026-08-09 16:10:05',
    userName: 'David O\'Connor',
    userRole: 'Store Keeper',
    department: 'Store',
    action: 'Registered Goods Received Note #GRN-2026-089',
    ipAddress: '192.168.1.88',
    status: 'Success'
  }
];

export const DEFAULT_LARAVEL_API_CONFIG: LaravelApiConfig = {
  baseUrl: 'https://api.hzhy-enterprise.com/api/v1',
  bearerToken: 'hzhy_live_token_77a98bc12e4f0d391aa',
  useLiveApi: false, // Default to mock local state with switch toggle
  syncIntervalMinutes: 5,
  timeoutMs: 10000
};
