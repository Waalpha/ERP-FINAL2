import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  writeBatch,
  query,
  orderBy,
  limit,
  onSnapshot,
  Unsubscribe,
  increment
} from 'firebase/firestore';
import { db, cleanFirestoreData } from '../firebase/config';
import {
  PosProduct,
  PosSale,
  PosSaleItem,
  PosStockMovement,
  PosShift,
  PosShiftStockItem,
  PosStockCountRecord,
  PosAuditLog,
  PosPaymentMethod
} from '../types/pos';
import { AppUser } from '../types';

/**
 * Default seeded products for bars, retail, and business cashiers.
 * Seeded automatically into Firestore if a tenant has 0 products in `pos_products`.
 */
export const DEFAULT_BAR_RETAIL_PRODUCTS: Omit<PosProduct, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: 'Tusker Lager 500ml',
    category: 'Beers',
    unit: 'Bottle',
    sellingPrice: 250,
    costPrice: 180,
    openingQuantity: 100,
    currentStock: 100,
    minStockAlert: 20,
    isActive: true,
    allowNegativeStock: false
  },
  {
    name: 'White Cap Crisp 500ml',
    category: 'Beers',
    unit: 'Bottle',
    sellingPrice: 260,
    costPrice: 190,
    openingQuantity: 60,
    currentStock: 60,
    minStockAlert: 15,
    isActive: true,
    allowNegativeStock: false
  },
  {
    name: 'Smirnoff Ice Black 330ml',
    category: 'Ciders',
    unit: 'Bottle',
    sellingPrice: 280,
    costPrice: 210,
    openingQuantity: 50,
    currentStock: 50,
    minStockAlert: 15,
    isActive: true,
    allowNegativeStock: false
  },
  {
    name: 'Guinness Foreign Extra 500ml',
    category: 'Beers',
    unit: 'Bottle',
    sellingPrice: 280,
    costPrice: 200,
    openingQuantity: 40,
    currentStock: 40,
    minStockAlert: 10,
    isActive: true,
    allowNegativeStock: false
  },
  {
    name: 'Heineken Lager 330ml',
    category: 'Beers',
    unit: 'Bottle',
    sellingPrice: 300,
    costPrice: 220,
    openingQuantity: 30,
    currentStock: 30,
    minStockAlert: 10,
    isActive: true,
    allowNegativeStock: false
  },
  {
    name: 'Pilsner Lager 500ml',
    category: 'Beers',
    unit: 'Bottle',
    sellingPrice: 250,
    costPrice: 180,
    openingQuantity: 35,
    currentStock: 35,
    minStockAlert: 10,
    isActive: true,
    allowNegativeStock: false
  },
  {
    name: 'Soda Coca-Cola 300ml',
    category: 'Soft Drinks',
    unit: 'Bottle',
    sellingPrice: 80,
    costPrice: 50,
    openingQuantity: 80,
    currentStock: 80,
    minStockAlert: 20,
    isActive: true,
    allowNegativeStock: false
  },
  {
    name: 'Soda Fanta Orange 300ml',
    category: 'Soft Drinks',
    unit: 'Bottle',
    sellingPrice: 80,
    costPrice: 50,
    openingQuantity: 50,
    currentStock: 50,
    minStockAlert: 15,
    isActive: true,
    allowNegativeStock: false
  },
  {
    name: 'Soda Sprite 300ml',
    category: 'Soft Drinks',
    unit: 'Bottle',
    sellingPrice: 80,
    costPrice: 50,
    openingQuantity: 40,
    currentStock: 40,
    minStockAlert: 15,
    isActive: true,
    allowNegativeStock: false
  },
  {
    name: 'Keringet Mineral Water 500ml',
    category: 'Water',
    unit: 'Bottle',
    sellingPrice: 100,
    costPrice: 50,
    openingQuantity: 60,
    currentStock: 60,
    minStockAlert: 20,
    isActive: true,
    allowNegativeStock: false
  },
  {
    name: 'Johnnie Walker Black Label 750ml',
    category: 'Whisky',
    unit: 'Bottle',
    sellingPrice: 4500,
    costPrice: 3500,
    openingQuantity: 8,
    currentStock: 8,
    minStockAlert: 2,
    isActive: true,
    allowNegativeStock: false
  },
  {
    name: 'Jameson Irish Whiskey 750ml',
    category: 'Whisky',
    unit: 'Bottle',
    sellingPrice: 3800,
    costPrice: 2900,
    openingQuantity: 10,
    currentStock: 10,
    minStockAlert: 3,
    isActive: true,
    allowNegativeStock: false
  },
  {
    name: 'Smirnoff Vodka 750ml',
    category: 'Vodka',
    unit: 'Bottle',
    sellingPrice: 1800,
    costPrice: 1300,
    openingQuantity: 12,
    currentStock: 12,
    minStockAlert: 3,
    isActive: true,
    allowNegativeStock: false
  },
  {
    name: 'Nyama Choma (1kg Goat Roast)',
    category: 'Food',
    unit: 'Plate',
    sellingPrice: 1200,
    costPrice: 850,
    openingQuantity: 20,
    currentStock: 20,
    minStockAlert: 5,
    isActive: true,
    allowNegativeStock: false
  },
  {
    name: 'French Fries / Chips',
    category: 'Food',
    unit: 'Plate',
    sellingPrice: 200,
    costPrice: 100,
    openingQuantity: 50,
    currentStock: 50,
    minStockAlert: 10,
    isActive: true,
    allowNegativeStock: false
  }
];

// ==========================================
// 1. PRODUCTS MANAGEMENT (FIRESTORE)
// ==========================================

export function subscribePosProducts(
  tenantId: string,
  onUpdate: (products: PosProduct[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const colRef = collection(db, 'tenants', tenantId, 'pos_products');
  const q = query(colRef, orderBy('name', 'asc'));

  return onSnapshot(
    q,
    async (snapshot) => {
      if (snapshot.empty) {
        // Automatically bootstrap initial products in Firestore for this tenant
        try {
          const batch = writeBatch(db);
          const now = new Date().toISOString();
          const seeded: PosProduct[] = [];

          DEFAULT_BAR_RETAIL_PRODUCTS.forEach((template, index) => {
            const id = `prod_${String(index + 1).padStart(3, '0')}`;
            const docRef = doc(db, 'tenants', tenantId, 'pos_products', id);
            const product: PosProduct = {
              ...template,
              id,
              tenantId,
              createdAt: now,
              updatedAt: now
            };
            batch.set(docRef, cleanFirestoreData(product));
            seeded.push(product);

            // Record initial opening stock movement
            const movId = `mov_open_${id}`;
            const movRef = doc(db, 'tenants', tenantId, 'pos_stock_movements', movId);
            const movement: PosStockMovement = {
              id: movId,
              tenantId,
              productId: id,
              productName: product.name,
              movementType: 'OPENING',
              quantity: product.openingQuantity,
              previousQuantity: 0,
              newQuantity: product.openingQuantity,
              reference: 'INITIAL_OPENING_SETUP',
              reason: 'System initialization opening stock',
              userId: 'system',
              userName: 'System Administrator',
              createdAt: now
            };
            batch.set(movRef, cleanFirestoreData(movement));
          });

          await batch.commit();
          onUpdate(seeded);
          return;
        } catch (err) {
          console.error('Failed to seed default POS products in Firestore:', err);
        }
      }

      const products: PosProduct[] = snapshot.docs.map((d) => d.data() as PosProduct);
      onUpdate(products);
    },
    (err) => {
      console.warn('Firestore pos_products listener error:', err);
      if (onError) onError(err);
    }
  );
}

export async function createPosProduct(
  tenantId: string,
  data: Omit<PosProduct, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>,
  user: AppUser
): Promise<PosProduct> {
  const id = `prod_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const now = new Date().toISOString();
  const product: PosProduct = {
    ...data,
    id,
    tenantId,
    createdAt: now,
    updatedAt: now
  };

  const batch = writeBatch(db);

  // 1. Create product doc
  const prodRef = doc(db, 'tenants', tenantId, 'pos_products', id);
  batch.set(prodRef, cleanFirestoreData(product));

  // 2. Create opening stock movement
  const movId = `mov_${Date.now()}_open`;
  const movRef = doc(db, 'tenants', tenantId, 'pos_stock_movements', movId);
  const movement: PosStockMovement = {
    id: movId,
    tenantId,
    productId: id,
    productName: product.name,
    movementType: 'OPENING',
    quantity: product.openingQuantity,
    previousQuantity: 0,
    newQuantity: product.openingQuantity,
    reference: 'PRODUCT_CREATION',
    reason: 'Initial opening stock set at product creation',
    userId: user.uid,
    userName: user.displayName || user.email || 'Manager',
    createdAt: now
  };
  batch.set(movRef, cleanFirestoreData(movement));

  // 3. Log Audit
  const logId = `log_${Date.now()}_prod_create`;
  const logRef = doc(db, 'tenants', tenantId, 'pos_audit_logs', logId);
  const log: PosAuditLog = {
    id: logId,
    tenantId,
    userId: user.uid,
    userName: user.displayName || user.email || 'Manager',
    userRole: user.role,
    action: 'PRODUCT_CREATED',
    recordId: id,
    recordType: 'PRODUCT',
    newValue: JSON.stringify({ name: product.name, price: product.sellingPrice, opening: product.openingQuantity }),
    details: `Created new product "${product.name}" with opening stock ${product.openingQuantity} at KES ${product.sellingPrice}`,
    timestamp: now
  };
  batch.set(logRef, cleanFirestoreData(log));

  await batch.commit();
  return product;
}

export async function updatePosProduct(
  tenantId: string,
  productId: string,
  updates: Partial<PosProduct>,
  user: AppUser,
  previousProduct?: PosProduct
): Promise<void> {
  const prodRef = doc(db, 'tenants', tenantId, 'pos_products', productId);
  const now = new Date().toISOString();
  const cleanUpdates = cleanFirestoreData({
    ...updates,
    updatedAt: now
  });

  const batch = writeBatch(db);
  batch.update(prodRef, cleanUpdates);

  // If opening stock changed by manager, record an ADJUSTMENT stock movement
  if (
    updates.openingQuantity !== undefined &&
    previousProduct &&
    updates.openingQuantity !== previousProduct.openingQuantity
  ) {
    const diff = updates.openingQuantity - previousProduct.openingQuantity;
    const movId = `mov_${Date.now()}_adj_open`;
    const movRef = doc(db, 'tenants', tenantId, 'pos_stock_movements', movId);
    const movement: PosStockMovement = {
      id: movId,
      tenantId,
      productId,
      productName: updates.name || previousProduct.name,
      movementType: 'OPENING',
      quantity: diff,
      previousQuantity: previousProduct.openingQuantity,
      newQuantity: updates.openingQuantity,
      reference: 'MANAGER_OPENING_CORRECTION',
      reason: 'Authorized manager adjustment of opening stock',
      userId: user.uid,
      userName: user.displayName || user.email || 'Manager',
      createdAt: now
    };
    batch.set(movRef, cleanFirestoreData(movement));
  }

  // Audit log
  const logId = `log_${Date.now()}_prod_update`;
  const logRef = doc(db, 'tenants', tenantId, 'pos_audit_logs', logId);
  const log: PosAuditLog = {
    id: logId,
    tenantId,
    userId: user.uid,
    userName: user.displayName || user.email || 'Manager',
    userRole: user.role,
    action: updates.sellingPrice !== undefined ? 'PRODUCT_PRICE_CHANGED' : 'PRODUCT_UPDATED',
    recordId: productId,
    recordType: 'PRODUCT',
    previousValue: previousProduct ? JSON.stringify({ price: previousProduct.sellingPrice, opening: previousProduct.openingQuantity }) : undefined,
    newValue: JSON.stringify(updates),
    details: `Updated product configuration for "${updates.name || previousProduct?.name || productId}"`,
    timestamp: now
  };
  batch.set(logRef, cleanFirestoreData(log));

  await batch.commit();
}

// ==========================================
// 2. RECORDING SALES (TRANSACTIONAL & BATCH)
// ==========================================

export interface RecordSaleParams {
  tenantId: string;
  items: PosSaleItem[];
  paymentMethod: PosPaymentMethod;
  paymentRef?: string;
  customerNote?: string;
  shiftId?: string;
  user: AppUser;
  activeProducts: PosProduct[];
}

export async function recordPosSale(params: RecordSaleParams): Promise<PosSale> {
  const { tenantId, items, paymentMethod, paymentRef, customerNote, shiftId, user, activeProducts } = params;

  if (!items || items.length === 0) {
    throw new Error('Cannot record sale with 0 items.');
  }

  // 1. Strict stock verification: Check each product in memory before write
  for (const item of items) {
    const prod = activeProducts.find((p) => p.id === item.productId);
    if (!prod) {
      throw new Error(`Product "${item.productName}" not found.`);
    }
    if (!prod.allowNegativeStock && prod.currentStock < item.quantity) {
      throw new Error(`Insufficient stock for "${prod.name}". Available: ${prod.currentStock}`);
    }
  }

  const now = new Date().toISOString();
  const dateStr = now.slice(0, 10).replace(/-/g, '');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const saleNumber = `REC-${dateStr}-${randomSuffix}`;
  const saleId = `sale_${Date.now()}_${randomSuffix}`;

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce((sum, item) => sum + item.lineTotal, 0);

  const sale: PosSale = {
    id: saleId,
    tenantId,
    saleNumber,
    shiftId,
    cashierId: user.uid,
    cashierName: user.displayName || user.email || 'Cashier',
    items,
    totalQuantity,
    subtotal: totalAmount,
    totalAmount,
    paymentMethod,
    paymentRef: paymentRef?.trim() || undefined,
    customerNote: customerNote?.trim() || undefined,
    status: 'COMPLETED',
    createdAt: now
  };

  const batch = writeBatch(db);

  // 1. Write sale document
  const saleRef = doc(db, 'tenants', tenantId, 'pos_sales', saleId);
  batch.set(saleRef, cleanFirestoreData(sale));

  // 2. Reduce stock for each product and record stock movements
  for (const item of items) {
    const prod = activeProducts.find((p) => p.id === item.productId);
    const previousStock = prod ? prod.currentStock : 0;
    const newStock = previousStock - item.quantity;

    // Reduce product currentStock
    const prodRef = doc(db, 'tenants', tenantId, 'pos_products', item.productId);
    batch.update(prodRef, {
      currentStock: increment(-item.quantity),
      updatedAt: now
    });

    // Write stock movement
    const movId = `mov_${Date.now()}_${item.productId}`;
    const movRef = doc(db, 'tenants', tenantId, 'pos_stock_movements', movId);
    const movement: PosStockMovement = {
      id: movId,
      tenantId,
      productId: item.productId,
      productName: item.productName,
      movementType: 'SALE',
      quantity: -item.quantity,
      previousQuantity: previousStock,
      newQuantity: newStock,
      reference: saleNumber,
      reason: `Cashier Sale (${paymentMethod})`,
      userId: user.uid,
      userName: user.displayName || user.email || 'Cashier',
      createdAt: now
    };
    batch.set(movRef, cleanFirestoreData(movement));
  }

  // 3. If tied to an active shift, increment shift totals
  if (shiftId) {
    const shiftRef = doc(db, 'tenants', tenantId, 'pos_shifts', shiftId);
    const paymentKey = paymentMethod.toLowerCase().replace(/[^a-z]/g, '');
    const updatePayload: Record<string, any> = {
      totalSalesAmount: increment(totalAmount),
      totalTransactions: increment(1),
      totalItemsSold: increment(totalQuantity)
    };
    if (paymentKey === 'cash') updatePayload['paymentBreakdown.cash'] = increment(totalAmount);
    else if (paymentKey === 'mpesa') updatePayload['paymentBreakdown.mpesa'] = increment(totalAmount);
    else if (paymentKey === 'card') updatePayload['paymentBreakdown.card'] = increment(totalAmount);
    else updatePayload['paymentBreakdown.other'] = increment(totalAmount);

    batch.update(shiftRef, updatePayload);
  }

  // 4. Audit Log
  const logId = `log_${Date.now()}_sale`;
  const logRef = doc(db, 'tenants', tenantId, 'pos_audit_logs', logId);
  const log: PosAuditLog = {
    id: logId,
    tenantId,
    userId: user.uid,
    userName: user.displayName || user.email || 'Cashier',
    userRole: user.role,
    action: 'SALE_RECORDED',
    recordId: saleId,
    recordType: 'SALE',
    newValue: JSON.stringify({ saleNumber, totalAmount, paymentMethod, itemsCount: items.length }),
    details: `Sale ${saleNumber} completed for KES ${totalAmount} (${paymentMethod}) by ${user.displayName || 'Cashier'}`,
    timestamp: now
  };
  batch.set(logRef, cleanFirestoreData(log));

  await batch.commit();
  return sale;
}

export function subscribePosSales(
  tenantId: string,
  onUpdate: (sales: PosSale[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const colRef = collection(db, 'tenants', tenantId, 'pos_sales');
  const q = query(colRef, orderBy('createdAt', 'desc'), limit(150));

  return onSnapshot(
    q,
    (snapshot) => {
      const sales: PosSale[] = snapshot.docs.map((d) => d.data() as PosSale);
      onUpdate(sales);
    },
    (err) => {
      console.warn('Firestore pos_sales listener error:', err);
      if (onError) onError(err);
    }
  );
}

// Void sale by Manager
export async function voidPosSale(
  tenantId: string,
  sale: PosSale,
  reason: string,
  user: AppUser
): Promise<void> {
  const now = new Date().toISOString();
  const batch = writeBatch(db);

  // 1. Mark sale as voided
  const saleRef = doc(db, 'tenants', tenantId, 'pos_sales', sale.id);
  batch.update(saleRef, { status: 'VOIDED', voidReason: reason, voidedAt: now, voidedBy: user.displayName });

  // 2. Return stock to products
  for (const item of sale.items) {
    const prodRef = doc(db, 'tenants', tenantId, 'pos_products', item.productId);
    batch.update(prodRef, {
      currentStock: increment(item.quantity),
      updatedAt: now
    });

    const movId = `mov_${Date.now()}_void_${item.productId}`;
    const movRef = doc(db, 'tenants', tenantId, 'pos_stock_movements', movId);
    const movement: PosStockMovement = {
      id: movId,
      tenantId,
      productId: item.productId,
      productName: item.productName,
      movementType: 'ADJUSTMENT',
      quantity: item.quantity,
      previousQuantity: 0,
      newQuantity: 0,
      reference: `VOID_${sale.saleNumber}`,
      reason: `Sale Voided: ${reason}`,
      userId: user.uid,
      userName: user.displayName || 'Manager',
      createdAt: now
    };
    batch.set(movRef, cleanFirestoreData(movement));
  }

  // 3. Audit Log
  const logId = `log_${Date.now()}_void`;
  const logRef = doc(db, 'tenants', tenantId, 'pos_audit_logs', logId);
  const log: PosAuditLog = {
    id: logId,
    tenantId,
    userId: user.uid,
    userName: user.displayName || 'Manager',
    userRole: user.role,
    action: 'SALE_VOIDED',
    recordId: sale.id,
    recordType: 'SALE',
    details: `Sale ${sale.saleNumber} of KES ${sale.totalAmount} voided. Reason: ${reason}`,
    timestamp: now
  };
  batch.set(logRef, cleanFirestoreData(log));

  await batch.commit();
}

// ==========================================
// 3. STOCK MOVEMENTS, RECEIVING & ADJUSTMENTS
// ==========================================

export async function receivePosStock(
  tenantId: string,
  entries: Array<{ productId: string; productName: string; quantity: number }>,
  reference: string,
  supplierName: string,
  user: AppUser,
  productsMap: Map<string, PosProduct>
): Promise<void> {
  const now = new Date().toISOString();
  const batch = writeBatch(db);

  for (const entry of entries) {
    if (entry.quantity <= 0) continue;
    const prodRef = doc(db, 'tenants', tenantId, 'pos_products', entry.productId);
    batch.update(prodRef, {
      currentStock: increment(entry.quantity),
      updatedAt: now
    });

    const prod = productsMap.get(entry.productId);
    const prev = prod ? prod.currentStock : 0;

    const movId = `mov_${Date.now()}_rcv_${entry.productId}`;
    const movRef = doc(db, 'tenants', tenantId, 'pos_stock_movements', movId);
    const movement: PosStockMovement = {
      id: movId,
      tenantId,
      productId: entry.productId,
      productName: entry.productName,
      movementType: 'STOCK_RECEIVED',
      quantity: entry.quantity,
      previousQuantity: prev,
      newQuantity: prev + entry.quantity,
      reference: reference || 'RESTOCK_DELIVERY',
      reason: `Received from ${supplierName || 'Supplier'}`,
      userId: user.uid,
      userName: user.displayName || 'Manager',
      createdAt: now
    };
    batch.set(movRef, cleanFirestoreData(movement));
  }

  // Audit Log
  const logId = `log_${Date.now()}_stock_rcv`;
  const logRef = doc(db, 'tenants', tenantId, 'pos_audit_logs', logId);
  const log: PosAuditLog = {
    id: logId,
    tenantId,
    userId: user.uid,
    userName: user.displayName || 'Manager',
    userRole: user.role,
    action: 'STOCK_RECEIVED',
    recordId: reference || logId,
    recordType: 'STOCK',
    newValue: JSON.stringify(entries),
    details: `Stock received: ${entries.length} items logged under ref "${reference}"`,
    timestamp: now
  };
  batch.set(logRef, cleanFirestoreData(log));

  await batch.commit();
}

export async function adjustPosStock(
  tenantId: string,
  productId: string,
  productName: string,
  quantityDelta: number, // positive or negative
  movementType: 'DAMAGED' | 'SPOILED' | 'ADJUSTMENT',
  reason: string,
  user: AppUser,
  currentStock: number
): Promise<void> {
  const now = new Date().toISOString();
  const batch = writeBatch(db);

  const prodRef = doc(db, 'tenants', tenantId, 'pos_products', productId);
  batch.update(prodRef, {
    currentStock: increment(quantityDelta),
    updatedAt: now
  });

  const movId = `mov_${Date.now()}_adj_${productId}`;
  const movRef = doc(db, 'tenants', tenantId, 'pos_stock_movements', movId);
  const movement: PosStockMovement = {
    id: movId,
    tenantId,
    productId,
    productName,
    movementType,
    quantity: quantityDelta,
    previousQuantity: currentStock,
    newQuantity: currentStock + quantityDelta,
    reference: `ADJ_${movementType}`,
    reason,
    userId: user.uid,
    userName: user.displayName || 'Manager',
    createdAt: now
  };
  batch.set(movRef, cleanFirestoreData(movement));

  const logId = `log_${Date.now()}_adj`;
  const logRef = doc(db, 'tenants', tenantId, 'pos_audit_logs', logId);
  const log: PosAuditLog = {
    id: logId,
    tenantId,
    userId: user.uid,
    userName: user.displayName || 'Manager',
    userRole: user.role,
    action: 'STOCK_ADJUSTED',
    recordId: productId,
    recordType: 'STOCK',
    details: `Stock adjusted for "${productName}": delta ${quantityDelta > 0 ? '+' : ''}${quantityDelta} (${movementType}). Reason: ${reason}`,
    timestamp: now
  };
  batch.set(logRef, cleanFirestoreData(log));

  await batch.commit();
}

export function subscribePosStockMovements(
  tenantId: string,
  onUpdate: (movements: PosStockMovement[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const colRef = collection(db, 'tenants', tenantId, 'pos_stock_movements');
  const q = query(colRef, orderBy('createdAt', 'desc'), limit(150));

  return onSnapshot(
    q,
    (snapshot) => {
      const movements: PosStockMovement[] = snapshot.docs.map((d) => d.data() as PosStockMovement);
      onUpdate(movements);
    },
    (err) => {
      console.warn('Firestore pos_stock_movements listener error:', err);
      if (onError) onError(err);
    }
  );
}

// ==========================================
// 4. CASHIER SHIFTS & PHYSICAL COUNTS
// ==========================================

export async function startPosShift(
  tenantId: string,
  cashierId: string,
  cashierName: string,
  openingCashFloat: number = 0
): Promise<PosShift> {
  const shiftId = `shift_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const now = new Date().toISOString();
  const dateStr = now.slice(0, 10);

  const shift: PosShift = {
    id: shiftId,
    tenantId,
    cashierId,
    cashierName,
    date: dateStr,
    startTime: now,
    status: 'OPEN',
    openingCashFloat,
    totalSalesAmount: 0,
    totalTransactions: 0,
    totalItemsSold: 0,
    paymentBreakdown: {
      cash: 0,
      mpesa: 0,
      card: 0,
      other: 0
    },
    createdAt: now
  };

  const batch = writeBatch(db);
  const shiftRef = doc(db, 'tenants', tenantId, 'pos_shifts', shiftId);
  batch.set(shiftRef, cleanFirestoreData(shift));

  const logId = `log_${Date.now()}_shift_open`;
  const logRef = doc(db, 'tenants', tenantId, 'pos_audit_logs', logId);
  const log: PosAuditLog = {
    id: logId,
    tenantId,
    userId: cashierId,
    userName: cashierName,
    userRole: 'CASHIER',
    action: 'SHIFT_OPENED',
    recordId: shiftId,
    recordType: 'SHIFT',
    details: `Shift started by ${cashierName} on ${dateStr} with cash float KES ${openingCashFloat}`,
    timestamp: now
  };
  batch.set(logRef, cleanFirestoreData(log));

  await batch.commit();
  return shift;
}

export async function submitAndClosePosShift(
  tenantId: string,
  shiftId: string,
  stockCountItems: PosShiftStockItem[],
  closingNotes: string,
  user: AppUser
): Promise<void> {
  const now = new Date().toISOString();
  const batch = writeBatch(db);

  // 1. Update and lock the shift
  const shiftRef = doc(db, 'tenants', tenantId, 'pos_shifts', shiftId);
  batch.update(shiftRef, {
    status: 'LOCKED',
    endTime: now,
    closedAt: now,
    closingNotes: closingNotes?.trim() || 'Shift finalized and physical count submitted',
    submittedStockCount: cleanFirestoreData(stockCountItems)
  });

  // 2. Create pos_stock_counts record for managers
  const countId = `count_${Date.now()}_${shiftId.slice(-6)}`;
  const countRef = doc(db, 'tenants', tenantId, 'pos_stock_counts', countId);

  const discrepancyItems = stockCountItems.filter((item) => item.difference !== 0);
  const totalDiscrepancyUnits = discrepancyItems.reduce((sum, item) => sum + Math.abs(item.difference), 0);
  const totalDiscrepancyValue = discrepancyItems.reduce(
    (sum, item) => sum + Math.abs(item.difference * item.sellingPrice),
    0
  );

  const countRecord: PosStockCountRecord = {
    id: countId,
    tenantId,
    shiftId,
    cashierId: user.uid,
    cashierName: user.displayName || 'Cashier',
    date: now.slice(0, 10),
    items: stockCountItems,
    totalDiscrepancyUnits,
    totalDiscrepancyValue,
    status: 'SUBMITTED',
    createdAt: now
  };
  batch.set(countRef, cleanFirestoreData(countRecord));

  // 3. Create stock movements of type CLOSING_COUNT for audit trail
  stockCountItems.forEach((item) => {
    const movId = `mov_${Date.now()}_close_${item.productId}`;
    const movRef = doc(db, 'tenants', tenantId, 'pos_stock_movements', movId);
    const movement: PosStockMovement = {
      id: movId,
      tenantId,
      productId: item.productId,
      productName: item.productName,
      movementType: 'CLOSING_COUNT',
      quantity: item.physicalStock,
      previousQuantity: item.expectedStock,
      newQuantity: item.physicalStock,
      reference: `SHIFT_${shiftId.slice(-6)}`,
      reason:
        item.difference === 0
          ? 'Physical count verified matched expected stock'
          : `Discrepancy detected: ${item.difference > 0 ? '+' : ''}${item.difference} ${item.unit}`,
      userId: user.uid,
      userName: user.displayName || 'Cashier',
      createdAt: now
    };
    batch.set(movRef, cleanFirestoreData(movement));
  });

  // 4. Audit Log
  const logId = `log_${Date.now()}_shift_close`;
  const logRef = doc(db, 'tenants', tenantId, 'pos_audit_logs', logId);
  const log: PosAuditLog = {
    id: logId,
    tenantId,
    userId: user.uid,
    userName: user.displayName || 'Cashier',
    userRole: user.role,
    action: 'SHIFT_CLOSED',
    recordId: shiftId,
    recordType: 'SHIFT',
    details: `Shift submitted & locked by ${user.displayName}. Stock Count: ${stockCountItems.length} products counted, ${discrepancyItems.length} discrepancies noted.`,
    timestamp: now
  };
  batch.set(logRef, cleanFirestoreData(log));

  await batch.commit();
}

export async function reopenPosShift(
  tenantId: string,
  shiftId: string,
  reason: string,
  user: AppUser
): Promise<void> {
  const now = new Date().toISOString();
  const shiftRef = doc(db, 'tenants', tenantId, 'pos_shifts', shiftId);

  const batch = writeBatch(db);
  batch.update(shiftRef, {
    status: 'OPEN',
    reopenedBy: user.displayName || 'Manager',
    reopenReason: reason,
    reopenedAt: now
  });

  const logId = `log_${Date.now()}_shift_reopen`;
  const logRef = doc(db, 'tenants', tenantId, 'pos_audit_logs', logId);
  const log: PosAuditLog = {
    id: logId,
    tenantId,
    userId: user.uid,
    userName: user.displayName || 'Manager',
    userRole: user.role,
    action: 'SHIFT_REOPENED',
    recordId: shiftId,
    recordType: 'SHIFT',
    details: `Shift reopened by manager ${user.displayName}. Reason: ${reason}`,
    timestamp: now
  };
  batch.set(logRef, cleanFirestoreData(log));

  await batch.commit();
}

export function subscribePosShifts(
  tenantId: string,
  onUpdate: (shifts: PosShift[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const colRef = collection(db, 'tenants', tenantId, 'pos_shifts');
  const q = query(colRef, orderBy('createdAt', 'desc'), limit(50));

  return onSnapshot(
    q,
    (snapshot) => {
      const shifts: PosShift[] = snapshot.docs.map((d) => d.data() as PosShift);
      onUpdate(shifts);
    },
    (err) => {
      console.warn('Firestore pos_shifts listener error:', err);
      if (onError) onError(err);
    }
  );
}

export function subscribePosStockCounts(
  tenantId: string,
  onUpdate: (counts: PosStockCountRecord[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const colRef = collection(db, 'tenants', tenantId, 'pos_stock_counts');
  const q = query(colRef, orderBy('createdAt', 'desc'), limit(50));

  return onSnapshot(
    q,
    (snapshot) => {
      const counts: PosStockCountRecord[] = snapshot.docs.map((d) => d.data() as PosStockCountRecord);
      onUpdate(counts);
    },
    (err) => {
      console.warn('Firestore pos_stock_counts listener error:', err);
      if (onError) onError(err);
    }
  );
}

// ==========================================
// 5. AUDIT LOGS
// ==========================================

export function subscribePosAuditLogs(
  tenantId: string,
  onUpdate: (logs: PosAuditLog[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const colRef = collection(db, 'tenants', tenantId, 'pos_audit_logs');
  const q = query(colRef, orderBy('timestamp', 'desc'), limit(100));

  return onSnapshot(
    q,
    (snapshot) => {
      const logs: PosAuditLog[] = snapshot.docs.map((d) => d.data() as PosAuditLog);
      onUpdate(logs);
    },
    (err) => {
      console.warn('Firestore pos_audit_logs listener error:', err);
      if (onError) onError(err);
    }
  );
}
