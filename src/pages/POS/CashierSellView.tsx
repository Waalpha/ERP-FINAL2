import React, { useState, useMemo } from 'react';
import {
  PosProduct,
  PosSaleItem,
  PosSale,
  PosShift,
  PosPaymentMethod
} from '../../types/pos';
import { AppUser, Tenant } from '../../types';
import { recordPosSale } from '../../services/PosFirestoreService';
import { PosReceiptModal } from './PosReceiptModal';
import {
  Search,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  Banknote,
  Smartphone,
  HelpCircle,
  Loader2,
  Clock,
  Sparkles
} from 'lucide-react';

interface CashierSellViewProps {
  tenant: Tenant;
  user: AppUser;
  products: PosProduct[];
  activeShift: PosShift | null;
  onStartShiftClick: () => void;
}

export const CashierSellView: React.FC<CashierSellViewProps> = ({
  tenant,
  user,
  products,
  activeShift,
  onStartShiftClick
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [cartItems, setCartItems] = useState<PosSaleItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PosPaymentMethod>('CASH');
  const [paymentRef, setPaymentRef] = useState('');
  const [customerNote, setCustomerNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successSale, setSuccessSale] = useState<PosSale | null>(null);

  // Extract distinct categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ['ALL', ...Array.from(set).sort()];
  }, [products]);

  // Filter products by search & category
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (!p.isActive) return false;
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat = selectedCategory === 'ALL' || p.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [products, searchQuery, selectedCategory]);

  // Add product to cart with strict stock check
  const handleAddToCart = (product: PosProduct) => {
    setErrorMessage(null);
    const existingIndex = cartItems.findIndex((item) => item.productId === product.id);
    const currentCartQty = existingIndex >= 0 ? cartItems[existingIndex].quantity : 0;

    // Check stock limit
    if (!product.allowNegativeStock && currentCartQty + 1 > product.currentStock) {
      setErrorMessage(
        `Insufficient stock for "${product.name}". Available: ${product.currentStock} ${product.unit}`
      );
      return;
    }

    if (existingIndex >= 0) {
      const updated = [...cartItems];
      const newQty = updated[existingIndex].quantity + 1;
      updated[existingIndex] = {
        ...updated[existingIndex],
        quantity: newQty,
        lineTotal: newQty * updated[existingIndex].unitPrice
      };
      setCartItems(updated);
    } else {
      const newItem: PosSaleItem = {
        productId: product.id,
        productName: product.name,
        category: product.category,
        unit: product.unit,
        quantity: 1,
        unitPrice: product.sellingPrice,
        costPrice: product.costPrice,
        lineTotal: product.sellingPrice
      };
      setCartItems([...cartItems, newItem]);
    }
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setErrorMessage(null);
    const prod = products.find((p) => p.id === productId);
    const existing = cartItems.find((item) => item.productId === productId);
    if (!existing || !prod) return;

    const newQty = existing.quantity + delta;

    if (newQty <= 0) {
      handleRemoveItem(productId);
      return;
    }

    if (!prod.allowNegativeStock && newQty > prod.currentStock) {
      setErrorMessage(
        `Insufficient stock for "${prod.name}". Max available: ${prod.currentStock}`
      );
      return;
    }

    setCartItems(
      cartItems.map((item) =>
        item.productId === productId
          ? { ...item, quantity: newQty, lineTotal: newQty * item.unitPrice }
          : item
      )
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems(cartItems.filter((item) => item.productId !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
    setErrorMessage(null);
  };

  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalAmount = cartItems.reduce((acc, item) => acc + item.lineTotal, 0);

  // Submit sale
  const handleRecordSale = async () => {
    if (cartItems.length === 0) {
      setErrorMessage('Please select at least one product.');
      return;
    }

    if (paymentMethod === 'M-PESA' && !paymentRef.trim()) {
      // Optional, but encourage ref
      // We allow proceed or warn
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const recordedSale = await recordPosSale({
        tenantId: tenant.id,
        items: cartItems,
        paymentMethod,
        paymentRef: paymentRef.trim(),
        customerNote: customerNote.trim(),
        shiftId: activeShift?.id,
        user,
        activeProducts: products
      });

      // Clear ticket and show receipt modal
      setCartItems([]);
      setPaymentRef('');
      setCustomerNote('');
      setSuccessSale(recordedSale);
    } catch (err: any) {
      console.error('Error recording sale:', err);
      setErrorMessage(err.message || 'Failed to record sale. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-full min-h-[calc(100vh-80px)] bg-slate-900 text-slate-100">
      {/* LEFT SECTION: PRODUCT SELECTION & FAST GRID */}
      <div className="flex-1 flex flex-col p-4 md:p-6 overflow-y-auto border-b lg:border-b-0 lg:border-r border-slate-800">
        {/* Shift Warning Notice if no shift is open */}
        {!activeShift && (
          <div className="mb-4 rounded-xl bg-amber-500/10 border border-amber-500/30 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-200">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-amber-400 shrink-0" />
              <div>
                <p className="text-sm font-semibold">No Active Shift Opened</p>
                <p className="text-xs text-amber-300/80">
                  Sales will still be recorded and stock deducted, but opening a shift lets you reconcile stock at closing.
                </p>
              </div>
            </div>
            <button
              onClick={onStartShiftClick}
              className="rounded-lg bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 transition-colors shrink-0 shadow-sm"
            >
              Start Shift Now
            </button>
          </div>
        )}

        {/* Error Alert Bar */}
        {errorMessage && (
          <div className="mb-4 rounded-xl bg-rose-500/15 border border-rose-500/40 p-4 flex items-center gap-3 text-rose-200 animate-in fade-in">
            <AlertCircle className="h-5 w-5 text-rose-400 shrink-0" />
            <p className="text-sm font-medium flex-1">{errorMessage}</p>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-xs text-rose-300 hover:underline font-bold"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Top Search & Category Bar */}
        <div className="space-y-3 mb-6">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search drinks, beers, spirits, food, or products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl bg-slate-800/90 pl-11 pr-4 py-3 text-sm text-white placeholder-slate-400 border border-slate-700 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-inner"
            />
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 ring-2 ring-emerald-400/40'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700/60'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center text-slate-400">
              <ShoppingCart className="h-12 w-12 text-slate-600 mb-3" />
              <p className="text-base font-semibold text-slate-300">No products found</p>
              <p className="text-xs text-slate-500 mt-1">
                {searchQuery ? `No results matching "${searchQuery}"` : 'No active products available.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 xl:grid-cols-4 gap-3">
              {filteredProducts.map((product) => {
                const inCart = cartItems.find((i) => i.productId === product.id);
                const isOutOfStock = product.currentStock <= 0 && !product.allowNegativeStock;
                const isLowStock = product.currentStock > 0 && product.currentStock <= product.minStockAlert;

                return (
                  <button
                    key={product.id}
                    disabled={isOutOfStock}
                    onClick={() => handleAddToCart(product)}
                    className={`relative text-left flex flex-col justify-between p-4 rounded-2xl transition-all select-none ${
                      isOutOfStock
                        ? 'bg-slate-800/40 border border-slate-800 opacity-50 cursor-not-allowed'
                        : 'bg-slate-800/80 hover:bg-slate-750 border border-slate-700/80 hover:border-emerald-500/50 hover:shadow-xl active:scale-[0.98]'
                    }`}
                  >
                    {/* Cart badge indicator if added */}
                    {inCart && (
                      <span className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-emerald-500 text-slate-950 font-bold text-xs flex items-center justify-center shadow-md">
                        {inCart.quantity}
                      </span>
                    )}

                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 truncate">
                          {product.category}
                        </span>
                        <span className="text-[10px] bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded font-mono">
                          {product.unit}
                        </span>
                      </div>
                      <h4 className="font-semibold text-sm text-white line-clamp-2 leading-snug">
                        {product.name}
                      </h4>
                    </div>

                    <div className="mt-4 pt-2 border-t border-slate-700/60 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-slate-400 block leading-none">Price</span>
                        <span className="text-base font-bold text-emerald-400">
                          KES {product.sellingPrice.toLocaleString()}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block leading-none">Stock</span>
                        {isOutOfStock ? (
                          <span className="text-xs font-bold text-rose-400">Out</span>
                        ) : isLowStock ? (
                          <span className="text-xs font-bold text-amber-400">{product.currentStock} left</span>
                        ) : (
                          <span className="text-xs font-bold text-slate-300">{product.currentStock}</span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT SECTION: CASHIER CART & PAYMENT TERMINAL */}
      <div className="w-full lg:w-96 xl:w-[420px] bg-slate-950 flex flex-col p-4 md:p-6 shadow-2xl">
        {/* Ticket Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-emerald-400" />
            <h3 className="font-bold text-base text-white">Current Ticket</h3>
            <span className="ml-1 text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold font-mono">
              {totalQuantity} items
            </span>
          </div>

          {cartItems.length > 0 && (
            <button
              onClick={handleClearCart}
              className="text-xs text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Clear
            </button>
          )}
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto py-3 divide-y divide-slate-800/80 max-h-[320px] lg:max-h-[380px]">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-center text-slate-500">
              <ShoppingCart className="h-10 w-10 text-slate-700 mb-2 stroke-1" />
              <p className="text-sm font-medium text-slate-400">Ticket is empty</p>
              <p className="text-xs text-slate-600 mt-0.5">Tap products on the left to add items</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.productId} className="py-2.5 flex items-center justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{item.productName}</p>
                  <p className="text-xs text-slate-400 font-mono">
                    KES {item.unitPrice.toLocaleString()} × {item.quantity} ={' '}
                    <span className="font-bold text-slate-200">KES {item.lineTotal.toLocaleString()}</span>
                  </p>
                </div>

                {/* Counter buttons */}
                <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
                  <button
                    onClick={() => handleUpdateQuantity(item.productId, -1)}
                    className="h-7 w-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center transition-colors"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-6 text-center font-bold text-xs text-white font-mono">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => handleUpdateQuantity(item.productId, 1)}
                    className="h-7 w-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>

                <button
                  onClick={() => handleRemoveItem(item.productId)}
                  className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg transition-colors"
                  title="Remove item"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Payment & Summary Panel */}
        <div className="border-t border-slate-800 pt-4 space-y-4">
          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Payment Method
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['CASH', 'M-PESA', 'CARD', 'OTHER'] as PosPaymentMethod[]).map((method) => {
                const isSelected = paymentMethod === method;
                return (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPaymentMethod(method)}
                    className={`flex flex-col items-center justify-center py-2.5 px-1 rounded-xl text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 ring-2 ring-emerald-400'
                        : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                    }`}
                  >
                    {method === 'CASH' && <Banknote className="h-4 w-4 mb-1" />}
                    {method === 'M-PESA' && <Smartphone className="h-4 w-4 mb-1" />}
                    {method === 'CARD' && <CreditCard className="h-4 w-4 mb-1" />}
                    {method === 'OTHER' && <HelpCircle className="h-4 w-4 mb-1" />}
                    {method}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Reference if M-Pesa or Card */}
          {(paymentMethod === 'M-PESA' || paymentMethod === 'CARD') && (
            <div>
              <input
                type="text"
                placeholder={paymentMethod === 'M-PESA' ? 'M-Pesa Transaction Ref (e.g. SLK892HJ)' : 'Card Approval Code'}
                value={paymentRef}
                onChange={(e) => setPaymentRef(e.target.value)}
                className="w-full rounded-xl bg-slate-900 px-3 py-2 text-xs text-white placeholder-slate-500 border border-slate-800 focus:border-emerald-500 focus:outline-none"
              />
            </div>
          )}

          {/* Totals Breakdown */}
          <div className="space-y-1.5 bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
            <div className="flex justify-between text-xs text-slate-400">
              <span>Items Total:</span>
              <span className="font-mono">{totalQuantity} units</span>
            </div>
            <div className="flex justify-between items-baseline text-base font-bold text-white border-t border-slate-800 pt-1.5">
              <span>TOTAL DUE:</span>
              <span className="text-xl font-mono text-emerald-400">
                KES {totalAmount.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Large Record Sale Button */}
          <button
            type="button"
            disabled={cartItems.length === 0 || isSubmitting}
            onClick={handleRecordSale}
            className={`w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 shadow-xl transition-all ${
              cartItems.length === 0 || isSubmitting
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/25 active:scale-[0.99]'
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Recording Sale...
              </>
            ) : (
              <>
                <CheckCircle2 className="h-5 w-5" />
                RECORD SALE • KES {totalAmount.toLocaleString()}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Printable Receipt Modal */}
      {successSale && (
        <PosReceiptModal
          sale={successSale}
          tenant={tenant}
          onClose={() => setSuccessSale(null)}
          onNewSale={() => {
            setSuccessSale(null);
          }}
        />
      )}
    </div>
  );
};
