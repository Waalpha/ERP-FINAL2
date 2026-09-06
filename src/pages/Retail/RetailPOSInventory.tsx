import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  ShoppingCart,
  Package,
  Receipt,
  Truck,
  UserSquare2,
  PlusCircle,
  Search,
  CheckCircle2,
  AlertTriangle,
  CreditCard,
  Banknote,
  Smartphone,
  Trash2,
  Printer,
  DollarSign,
  TrendingUp,
  Tag,
  Boxes,
  Minus,
  Plus
} from 'lucide-react';
import { RetailSettingsTab } from './RetailSettingsTab';
import { RetailProduct, RetailSale, RetailSupplier, RetailCustomer } from '../../types';

interface RetailPOSInventoryProps {
  currentTab: string;
}

interface CartItem {
  product: RetailProduct;
  quantity: number;
}

export const RetailPOSInventory: React.FC<RetailPOSInventoryProps> = ({ currentTab }) => {
  const {
    tenant,
    retailProducts,
    retailSales,
    retailSuppliers,
    retailCustomers,
    recordRetailSale,
    addRetailProduct,
    updateProductStock,
    addRetailSupplier,
    addRetailCustomer
  } = useAuth();

  // POS State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [posSearch, setPosSearch] = useState('');
  const [posCategory, setPosCategory] = useState('ALL');
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'MPESA' | 'BANK' | 'CREDIT'>('MPESA');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [lastReceipt, setLastReceipt] = useState<RetailSale | null>(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  // Inventory & Supplier Modals
  const [showProductModal, setShowProductModal] = useState(false);
  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [stockAdjustProduct, setStockAdjustProduct] = useState<RetailProduct | null>(null);
  const [adjustedStockQty, setAdjustedStockQty] = useState(0);

  // New Product Form
  const [pSku, setPSku] = useState('');
  const [pName, setPName] = useState('');
  const [pCategory, setPCategory] = useState('Groceries');
  const [pUnit, setPUnit] = useState('Pcs');
  const [pCost, setPCost] = useState(100);
  const [pSelling, setPSelling] = useState(150);
  const [pStock, setPStock] = useState(20);
  const [pMinAlert, setPMinAlert] = useState(5);

  // Supplier Form
  const [suppName, setSuppName] = useState('');
  const [suppContact, setSuppContact] = useState('');
  const [suppPhone, setSuppPhone] = useState('');
  const [suppCategory, setSuppCategory] = useState('FMCG');

  // Customer Form
  const [custName, setCustName] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [custEmail, setCustEmail] = useState('');
  const [custCreditLimit, setCustCreditLimit] = useState(20000);

  // Calculations
  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.product.sellingPrice * item.quantity), 0);
  }, [cart]);

  const discountAmount = useMemo(() => {
    return Math.round((cartSubtotal * discountPercent) / 100);
  }, [cartSubtotal, discountPercent]);

  const cartTotal = useMemo(() => {
    return Math.max(0, cartSubtotal - discountAmount);
  }, [cartSubtotal, discountAmount]);

  // Overall Retail KPIs
  const totalRevenue = retailSales.reduce((sum, s) => sum + s.totalAmount, 0);
  const totalInventoryValue = retailProducts.reduce((sum, p) => sum + (p.costPrice * p.currentStock), 0);
  const lowStockCount = retailProducts.filter(p => p.currentStock <= p.minStockAlert).length;
  const todaySalesCount = retailSales.length;

  const categories = useMemo(() => {
    const set = new Set(retailProducts.map(p => p.category));
    return ['ALL', ...Array.from(set)];
  }, [retailProducts]);

  const addToCart = (product: RetailProduct) => {
    if (product.currentStock <= 0) return;
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        if (existing.quantity >= product.currentStock) return prev;
        return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateCartQty = (productId: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.product.id === productId) {
          const newQty = item.quantity + delta;
          if (newQty <= 0) return null;
          if (newQty > item.product.currentStock) return item;
          return { ...item, quantity: newQty };
        }
        return item;
      }).filter(Boolean) as CartItem[];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;

    const saleItems = cart.map(item => ({
      productId: item.product.id,
      productName: item.product.name,
      sku: item.product.sku,
      quantity: item.quantity,
      unitPrice: item.product.sellingPrice,
      totalPrice: item.product.sellingPrice * item.quantity
    }));

    const sale = await recordRetailSale({
      saleType: 'RETAIL',
      customerName: customerName || 'Walk-in Customer',
      customerPhone: customerPhone || undefined,
      items: saleItems,
      subtotal: cartSubtotal,
      discount: discountAmount,
      tax: 0,
      totalAmount: cartTotal,
      paymentMethod,
      cashierName: 'Jane Mwangi'
    });

    setLastReceipt(sale);
    setShowReceiptModal(true);
    setCart([]);
    setCustomerName('');
    setCustomerPhone('');
    setDiscountPercent(0);
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pName || !pSku) return;
    await addRetailProduct({
      sku: pSku.toUpperCase(),
      name: pName,
      category: pCategory,
      unit: pUnit,
      costPrice: pCost,
      sellingPrice: pSelling,
      currentStock: pStock,
      minStockAlert: pMinAlert
    });
    setPName('');
    setPSku('');
    setShowProductModal(false);
  };

  const handleAdjustStock = async () => {
    if (!stockAdjustProduct) return;
    await updateProductStock(stockAdjustProduct.id, adjustedStockQty);
    setStockAdjustProduct(null);
  };

  const handleCreateSupplier = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!suppName) return;
    await addRetailSupplier({
      name: suppName,
      contactPerson: suppContact || 'Sales Rep',
      phone: suppPhone || '0700000000',
      category: suppCategory
    });
    setSuppName('');
    setSuppPhone('');
    setShowSupplierModal(false);
  };

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!custName || !custPhone) return;
    await addRetailCustomer({
      name: custName,
      phone: custPhone,
      email: custEmail || undefined,
      creditLimit: custCreditLimit
    });
    setCustName('');
    setCustPhone('');
    setShowCustomerModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {tenant?.type.replace('_', ' ')}
              </span>
              <span className="text-xs text-slate-400 font-mono">Store Branch: Main Terminal</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight mt-1">{tenant?.name}</h1>
            <p className="text-xs text-slate-400 max-w-2xl mt-1">
              Complete POS checkout, real-time inventory levels, barcode SKU tracking, vendor purchase orders, and customer credit ledger.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowProductModal(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-sm flex items-center space-x-1.5"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Add Product</span>
            </button>
            <button
              onClick={() => setShowSupplierModal(true)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center space-x-1.5"
            >
              <Truck className="h-4 w-4 text-cyan-400" />
              <span>Add Supplier</span>
            </button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span>Today's POS Sales</span>
              <TrendingUp className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-emerald-400 mt-2">
              KES {totalRevenue.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">{todaySalesCount} Transactions Completed</div>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span>Stock Valuation</span>
              <Boxes className="h-4 w-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-bold text-white mt-2">
              KES {totalInventoryValue.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">{retailProducts.length} Active SKUs</div>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span>Low Stock Alerts</span>
              <AlertTriangle className="h-4 w-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-amber-400 mt-2">{lowStockCount}</div>
            <div className="text-[11px] text-slate-400 mt-1">Requires Restocking</div>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span>Customer Accounts</span>
              <UserSquare2 className="h-4 w-4 text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-white mt-2">{retailCustomers.length}</div>
            <div className="text-[11px] text-purple-300 mt-1">Store Credit & Loyalty</div>
          </div>
        </div>
      </div>

      {/* POS Terminal Screen */}
      {(currentTab === 'retail-pos' || currentTab === 'retail-overview') && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Product Catalog Grid (Left 2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Scan barcode or search SKU / item name..."
                    value={posSearch}
                    onChange={(e) => setPosSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setPosCategory(cat)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                        posCategory === cat
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {retailProducts
                .filter(p => {
                  const matchSearch = p.name.toLowerCase().includes(posSearch.toLowerCase()) || p.sku.toLowerCase().includes(posSearch.toLowerCase());
                  const matchCat = posCategory === 'ALL' || p.category === posCategory;
                  return matchSearch && matchCat;
                })
                .map((product) => {
                  const isOutOfStock = product.currentStock <= 0;
                  return (
                    <button
                      key={product.id}
                      disabled={isOutOfStock}
                      onClick={() => addToCart(product)}
                      className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all group ${
                        isOutOfStock
                          ? 'bg-slate-50 border-slate-200 opacity-50 cursor-not-allowed'
                          : 'bg-white border-slate-200 hover:border-emerald-500 hover:shadow-md'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono text-slate-400 font-semibold">{product.sku}</span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                            product.currentStock <= product.minStockAlert ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {product.currentStock} {product.unit}
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-xs mt-1.5 line-clamp-2">{product.name}</h4>
                      </div>
                      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                        <span className="font-extrabold text-sm text-emerald-700">
                          KES {product.sellingPrice.toLocaleString()}
                        </span>
                        <span className="text-[11px] text-emerald-600 font-bold group-hover:scale-110 transition-transform">
                          + Add
                        </span>
                      </div>
                    </button>
                  );
                })}
            </div>
          </div>

          {/* Cart & Checkout Panel (Right col) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col h-fit sticky top-20">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center space-x-2">
                <ShoppingCart className="h-4 w-4 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-sm">Active POS Register</h3>
              </div>
              <span className="text-xs font-semibold text-slate-500">{cart.length} line items</span>
            </div>

            {/* Cart Items List */}
            <div className="py-3 divide-y divide-slate-100 max-h-64 overflow-y-auto flex-1">
              {cart.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs">
                  Scan items or click products to ring up sale
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.product.id} className="py-2.5 flex items-center justify-between">
                    <div className="min-w-0 pr-2">
                      <div className="font-semibold text-slate-800 text-xs truncate">{item.product.name}</div>
                      <div className="text-[11px] text-slate-400">
                        KES {item.product.sellingPrice} × {item.quantity} = <strong className="text-slate-700">KES {(item.product.sellingPrice * item.quantity).toLocaleString()}</strong>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1.5 flex-shrink-0">
                      <button
                        onClick={() => updateCartQty(item.product.id, -1)}
                        className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-5 text-center font-bold text-xs">{item.quantity}</span>
                      <button
                        onClick={() => updateCartQty(item.product.id, 1)}
                        className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 ml-1"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Customer Details & Discount */}
            <div className="pt-3 border-t border-slate-200 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Customer Name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Phone / M-Pesa"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none"
                />
              </div>

              {/* Payment Method Selector */}
              <div id="tender-payment-section">
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Tender Payment</label>
                <div className="grid grid-cols-4 gap-1">
                  {[
                    { id: 'MPESA', label: 'M-Pesa', icon: Smartphone },
                    { id: 'CASH', label: 'Cash', icon: Banknote },
                    { id: 'BANK', label: 'Card', icon: CreditCard },
                    { id: 'CREDIT', label: 'Credit', icon: UserSquare2 }
                  ].map((m) => {
                    const Icon = m.icon;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setPaymentMethod(m.id as any)}
                        className={`py-1.5 rounded-lg text-xs font-semibold flex flex-col items-center justify-center transition-all ${
                          paymentMethod === m.id
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        <Icon className="h-3.5 w-3.5 mb-0.5" />
                        <span className="text-[10px]">{m.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Pricing Totals */}
              <div className="pt-2 border-t border-slate-100 space-y-1 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900">KES {cartSubtotal.toLocaleString()}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-rose-600">
                    <span>Discount</span>
                    <span>- KES {discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-black text-slate-900 pt-1 border-t border-slate-200">
                  <span>Total Due</span>
                  <span className="text-emerald-700">KES {cartTotal.toLocaleString()}</span>
                </div>
              </div>

              <button
                disabled={cart.length === 0}
                onClick={handleCheckout}
                className="w-full mt-2 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-300 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center space-x-2 active:scale-95"
              >
                <span>Charge KES {cartTotal.toLocaleString()}</span>
                <CheckCircle2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Floating Quick Cart Bar (Visible when cart has items on phone/tablet) */}
      {cart.length > 0 && (currentTab === 'retail-pos' || currentTab === 'retail-overview') && (
        <div className="fixed bottom-20 left-4 right-4 z-30 lg:hidden bg-slate-900 text-white p-3 rounded-2xl shadow-2xl border border-emerald-500/40 flex items-center justify-between animate-in slide-in-from-bottom duration-200">
          <div className="flex items-center space-x-2.5">
            <div className="h-9 w-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
              {cart.reduce((s, i) => s + i.quantity, 0)}
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-300">{cart.length} item(s) in Cart</div>
              <div className="text-sm font-bold text-emerald-400">KES {cartTotal.toLocaleString()}</div>
            </div>
          </div>
          <button
            onClick={() => {
              const el = document.getElementById('tender-payment-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md active:scale-95 transition-transform"
          >
            Review & Pay →
          </button>
        </div>
      )}

      {/* Stock & Inventory Control Tab */}
      {currentTab === 'retail-inventory' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-4 sm:p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Inventory Stock Catalog & Restock Controls</h2>
              <p className="text-xs text-slate-500">Track units on hand, reorder points, cost valuations and margins</p>
            </div>
            <button
              onClick={() => setShowProductModal(true)}
              className="px-3 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-xl hover:bg-emerald-500 flex items-center space-x-1.5 self-start md:self-auto"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Add New SKU</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 min-w-[650px]">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                <tr>
                  <th className="py-3 px-4">SKU & Item Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Cost Price</th>
                  <th className="py-3 px-4">Selling Price</th>
                  <th className="py-3 px-4">Current Stock</th>
                  <th className="py-3 px-4">Stock Status</th>
                  <th className="py-3 px-4 text-right">Quick Stock Edit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {retailProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/60">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{p.name}</div>
                      <div className="text-[11px] font-mono text-emerald-700">{p.sku}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-700">{p.category}</td>
                    <td className="py-3 px-4 text-slate-600">KES {p.costPrice.toLocaleString()}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">KES {p.sellingPrice.toLocaleString()}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {p.currentStock} <span className="text-[10px] font-normal text-slate-500">{p.unit}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        p.status === 'IN_STOCK' ? 'bg-emerald-100 text-emerald-800' : p.status === 'LOW_STOCK' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {p.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          setStockAdjustProduct(p);
                          setAdjustedStockQty(p.currentStock);
                        }}
                        className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px]"
                      >
                        Adjust Stock
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sales Orders & Receipts History Tab */}
      {currentTab === 'retail-sales-history' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6">
          <div className="mb-4">
            <h2 className="text-base font-bold text-slate-900">Completed POS Receipts & Sales Orders</h2>
            <p className="text-xs text-slate-500">Real-time ledger of retail and wholesale receipts</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                <tr>
                  <th className="py-3 px-4">Receipt #</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Items Count</th>
                  <th className="py-3 px-4">Total Amount</th>
                  <th className="py-3 px-4">Tender Method</th>
                  <th className="py-3 px-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {retailSales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-slate-50/60">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{sale.receiptNumber}</td>
                    <td className="py-3 px-4 font-medium text-slate-800">{sale.customerName}</td>
                    <td className="py-3 px-4 text-slate-600">{sale.items.length} items ({sale.items.reduce((s, i) => s + i.quantity, 0)} units)</td>
                    <td className="py-3 px-4 font-black text-emerald-700">KES {sale.totalAmount.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-bold text-[10px]">
                        {sale.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                      {new Date(sale.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Suppliers Tab */}
      {currentTab === 'retail-suppliers' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Vendors & Wholesale Suppliers</h2>
              <p className="text-xs text-slate-500">Supplier directories and purchase order balances</p>
            </div>
            <button
              onClick={() => setShowSupplierModal(true)}
              className="px-3 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-xl hover:bg-emerald-500 flex items-center space-x-1.5"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Add Supplier</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {retailSuppliers.map((s) => (
              <div key={s.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-sm">{s.name}</h3>
                  <span className="px-2 py-0.5 rounded bg-cyan-100 text-cyan-800 text-[10px] font-bold">
                    {s.category}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">Rep: <span className="text-slate-800 font-medium">{s.contactPerson}</span> • {s.phone}</p>
                <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Payable Owed: <strong className="text-slate-900">KES {s.balanceOwed.toLocaleString()}</strong></span>
                  <button className="text-emerald-700 font-bold hover:underline">Create Purchase Order →</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Customer Accounts Tab */}
      {currentTab === 'retail-customers' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Customer Accounts & Store Credit Ledger</h2>
              <p className="text-xs text-slate-500">Credit limits, cumulative spend and account settlements</p>
            </div>
            <button
              onClick={() => setShowCustomerModal(true)}
              className="px-3 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-xl hover:bg-emerald-500 flex items-center space-x-1.5"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Add Customer</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {retailCustomers.map((c) => (
              <div key={c.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-sm">{c.name}</h3>
                  <span className="text-xs font-mono text-slate-500">{c.phone}</span>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-slate-600">
                  <div>Credit Used: <strong className="text-amber-700">KES {c.currentCredit.toLocaleString()}</strong></div>
                  <div>Credit Limit: <strong className="text-slate-900">KES {c.creditLimit.toLocaleString()}</strong></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {currentTab === 'retail-settings' && (
        <RetailSettingsTab />
      )}

      {/* Printable Receipt Modal */}
      {showReceiptModal && lastReceipt && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200">
            <div className="text-center pb-4 border-b border-dashed border-slate-300">
              <h3 className="font-black text-slate-900 text-base tracking-tight">{tenant?.name}</h3>
              <p className="text-[11px] text-slate-500 font-mono">Tax Receipt: {lastReceipt.receiptNumber}</p>
              <p className="text-[10px] text-slate-400">{new Date(lastReceipt.createdAt).toLocaleString()}</p>
            </div>

            <div className="py-4 divide-y divide-dashed divide-slate-200 text-xs">
              {lastReceipt.items.map((item, idx) => (
                <div key={idx} className="py-1.5 flex justify-between">
                  <div>
                    <div className="font-semibold text-slate-800">{item.productName}</div>
                    <div className="text-[10px] text-slate-400">{item.quantity} × KES {item.unitPrice}</div>
                  </div>
                  <span className="font-bold text-slate-900">KES {item.totalPrice.toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-dashed border-slate-300 space-y-1 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Payment Tender:</span>
                <span className="font-bold text-slate-800">{lastReceipt.paymentMethod}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-slate-900 pt-1">
                <span>TOTAL PAID:</span>
                <span className="text-emerald-700">KES {lastReceipt.totalAmount.toLocaleString()}</span>
              </div>
            </div>

            <div className="pt-6 flex space-x-2">
              <button
                onClick={() => setShowReceiptModal(false)}
                className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold flex items-center space-x-1"
              >
                <Printer className="h-4 w-4" />
                <span>Print</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stock Adjustment Modal */}
      {stockAdjustProduct && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-slate-900 text-base mb-1">Adjust Inventory Level</h3>
            <p className="text-xs text-slate-500 mb-3">{stockAdjustProduct.name} ({stockAdjustProduct.sku})</p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Physical Count on Hand</label>
              <input
                type="number"
                value={adjustedStockQty}
                onChange={(e) => setAdjustedStockQty(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="pt-4 flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setStockAdjustProduct(null)}
                className="px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAdjustStock}
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl"
              >
                Save Stock
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-slate-900 text-base mb-3">Add Inventory Product</h3>
            <form onSubmit={handleCreateProduct} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Basmati Rice 5kg"
                  value={pName}
                  onChange={(e) => setPName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">SKU / Barcode</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SK-RICE-5K"
                    value={pSku}
                    onChange={(e) => setPSku(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl uppercase font-mono focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <input
                    type="text"
                    value={pCategory}
                    onChange={(e) => setPCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Cost Price (KES)</label>
                  <input
                    type="number"
                    value={pCost}
                    onChange={(e) => setPCost(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Selling Price (KES)</label>
                  <input
                    type="number"
                    value={pSelling}
                    onChange={(e) => setPSelling(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Initial Stock</label>
                  <input
                    type="number"
                    value={pStock}
                    onChange={(e) => setPStock(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Low Stock Alert</label>
                  <input
                    type="number"
                    value={pMinAlert}
                    onChange={(e) => setPMinAlert(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>
              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
