export type PosPaymentMethod = 'CASH' | 'M-PESA' | 'CARD' | 'OTHER';

export type PosMovementType =
  | 'OPENING'
  | 'STOCK_RECEIVED'
  | 'SALE'
  | 'DAMAGED'
  | 'SPOILED'
  | 'ADJUSTMENT'
  | 'CLOSING_COUNT';

export type PosShiftStatus = 'OPEN' | 'SUBMITTED' | 'CLOSED' | 'LOCKED';

export interface PosProduct {
  id: string;
  tenantId: string;
  name: string; // e.g. Tusker, White Cap, Smirnoff Ice, Soda, Water, Whisky, Vodka, Food items
  category: string; // Beers, Ciders, Spirits, Soft Drinks, Water, Wines, Food, Other
  unit: string; // Bottle, Can, Glass, Pcs, Shot, Plate, Tote
  sellingPrice: number;
  costPrice?: number;
  openingQuantity: number;
  currentStock: number;
  minStockAlert: number;
  isActive: boolean;
  allowNegativeStock?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PosSaleItem {
  productId: string;
  productName: string;
  category: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  costPrice?: number;
  lineTotal: number;
}

export interface PosSale {
  id: string;
  tenantId: string;
  saleNumber: string;
  shiftId?: string;
  cashierId: string;
  cashierName: string;
  items: PosSaleItem[];
  totalQuantity: number;
  subtotal: number;
  totalAmount: number;
  paymentMethod: PosPaymentMethod;
  paymentRef?: string;
  customerNote?: string;
  status: 'COMPLETED' | 'VOIDED';
  createdAt: string;
}

export interface PosStockMovement {
  id: string;
  tenantId: string;
  productId: string;
  productName: string;
  movementType: PosMovementType;
  quantity: number; // positive for additions/opening, negative for sales/damaged
  previousQuantity: number;
  newQuantity: number;
  reference: string;
  reason?: string;
  userId: string;
  userName: string;
  createdAt: string;
}

export interface PosShiftStockItem {
  productId: string;
  productName: string;
  category: string;
  unit: string;
  sellingPrice: number;
  costPrice?: number;
  openingStock: number;
  stockAdded: number; // stock received during shift
  stockRemoved: number; // damaged / spoiled / adjustments during shift
  sold: number;
  expectedStock: number; // Opening - Sold + Added - Removed
  physicalStock: number; // Cashier counted
  difference: number; // Physical - Expected
  status: 'MATCHED' | 'DISCREPANCY';
  notes?: string;
}

export interface PosShift {
  id: string;
  tenantId: string;
  cashierId: string;
  cashierName: string;
  date: string; // YYYY-MM-DD
  startTime: string; // ISO
  endTime?: string;
  status: PosShiftStatus;
  openingCashFloat: number;
  totalSalesAmount: number;
  totalTransactions: number;
  totalItemsSold: number;
  paymentBreakdown: {
    cash: number;
    mpesa: number;
    card: number;
    other: number;
  };
  submittedStockCount?: PosShiftStockItem[];
  closingNotes?: string;
  reopenedBy?: string;
  reopenReason?: string;
  createdAt: string;
  closedAt?: string;
}

export interface PosStockCountRecord {
  id: string;
  tenantId: string;
  shiftId: string;
  cashierId: string;
  cashierName: string;
  date: string;
  items: PosShiftStockItem[];
  totalDiscrepancyUnits: number;
  totalDiscrepancyValue: number;
  status: 'SUBMITTED' | 'APPROVED' | 'RECONCILED';
  managerNotes?: string;
  createdAt: string;
}

export interface PosAuditLog {
  id: string;
  tenantId: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  recordId: string;
  recordType: 'PRODUCT' | 'SALE' | 'STOCK' | 'SHIFT' | 'COUNT';
  previousValue?: string;
  newValue?: string;
  details: string;
  timestamp: string;
}
