import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  ShoppingCart,
  Search,
  Printer,
  User,
  LogOut,
  Clock,
  Trash2,
  Plus,
  Minus,
  CheckCircle2,
  DollarSign,
  Smartphone,
  CreditCard,
  Building2,
  Banknote,
  FileText,
  PauseCircle,
  Tag,
  Maximize2,
  Minimize2,
  Barcode,
  Percent,
  Calculator,
  ShieldCheck,
  RefreshCw,
  AlertTriangle,
  Grid,
  Utensils,
  Coffee,
  ShoppingBag,
  PlusCircle
} from 'lucide-react';
import { RetailProduct, RetailSale } from '../../types';

interface POSTerminalProps {
  onExit: () => void;
}

interface CartItem {
  product: RetailProduct;
  quantity: number;
  discountPerItem?: number; // percentage or fixed
}

export const POSTerminal: React.FC<POSTerminalProps> = ({ onExit }) => {
  const { tenant, retailProducts, recordRetailSale, retailSales } = useAuth();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'M-PESA' | 'CARD' | 'BANK_TRANSFER'>('M-PESA');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [customerName, setCustomerName] = useState('Walk-in Customer');
  const [customerPhone, setCustomerPhone] = useState('');
  const [cashierName, setCashierName] = useState('Jane Mwangi');
  const [isPrinterConnected, setIsPrinterConnected] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Hospitality / Restaurant fields
  const [tableNo, setTableNo] = useState('');
  const [waiterName, setWaiterName] = useState('');
  const [orderType, setOrderType] = useState<'RETAIL' | 'DINE_IN' | 'TAKEAWAY' | 'DELIVERY'>('RETAIL');

  // Manager PIN Authorization Modal state
  const [showManagerPinModal, setShowManagerPinModal] = useState(false);
  const [managerPin, setManagerPin] = useState('');
  const [managerAction, setManagerAction] = useState<string | null>(null);

  // Thermal Printer Settings Modal
  const [showPrinterSettingsModal, setShowPrinterSettingsModal] = useState(false);
  const [receiptWidth, setReceiptWidth] = useState<'58mm' | '80mm'>('80mm');
  const [autoPrint, setAutoPrint] = useState(true);

  // Sales History & Reprint Modal
  const [showSalesHistoryModal, setShowSalesHistoryModal] = useState(false);

  // Cash In / Cash Out drawer state
  const [cashInOutList, setCashInOutList] = useState<{ id: string; type: 'CASH_IN' | 'CASH_OUT'; amount: number; reason: string; time: string }[]>([]);
  const [showCashInOutModal, setShowCashInOutModal] = useState(false);
  const [cashInOutType, setCashInOutType] = useState<'CASH_IN' | 'CASH_OUT'>('CASH_IN');
  const [cashInOutAmount, setCashInOutAmount] = useState<number>(1000);
  const [cashInOutReason, setCashInOutReason] = useState('');

  // Cash tender calculator state
  const [cashTendered, setCashTendered] = useState<number>(0);
  const [showCashModal, setShowCashModal] = useState(false);

  // Held orders state
  const [heldOrders, setHeldOrders] = useState<{ id: string; cart: CartItem[]; time: string; customerName: string; tableNo?: string }[]>([]);
  const [showHeldOrdersModal, setShowHeldOrdersModal] = useState(false);

  // Shift & Closing modal
  const [showShiftModal, setShowShiftModal] = useState(false);
  const [shiftFloat, setShiftFloat] = useState(5000);
  const [shiftSalesTotal, setShiftSalesTotal] = useState(148500);

  // Receipt Modal
  const [lastReceipt, setLastReceipt] = useState<RetailSale | null>(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  // Switch Cashier Modal
  const [showSwitchCashierModal, setShowSwitchCashierModal] = useState(false);
  const [newCashierInput, setNewCashierInput] = useState('');

  // Online status listeners and barcode listener
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const handleKeyDown = (e: KeyboardEvent) => {
      // If user presses F2, quick focus search
      if (e.key === 'F2') {
        e.preventDefault();
        const searchInput = document.getElementById('pos-search-input');
        if (searchInput) searchInput.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const categories = useMemo(() => {
    const set = new Set(retailProducts.map(p => p.category));
    return ['ALL', ...Array.from(set)];
  }, [retailProducts]);

  const filteredProducts = useMemo(() => {
    return retailProducts.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.sku.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = selectedCategory === 'ALL' || p.category === selectedCategory;
      return matchSearch && matchCat;
    });
  }, [retailProducts, searchQuery, selectedCategory]);

  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.product.sellingPrice * item.quantity), 0);
  }, [cart]);

  const discountAmount = useMemo(() => {
    return Math.round((subtotal * discountPercent) / 100);
  }, [subtotal, discountPercent]);

  const totalAmount = useMemo(() => {
    return Math.max(0, subtotal - discountAmount);
  }, [subtotal, discountAmount]);

  const changeDue = useMemo(() => {
    if (paymentMethod === 'CASH' && cashTendered > totalAmount) {
      return cashTendered - totalAmount;
    }
    return 0;
  }, [paymentMethod, cashTendered, totalAmount]);

  const addToCart = (product: RetailProduct) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.product.id === productId) {
          const newQty = item.quantity + delta;
          if (newQty <= 0) return null;
          return { ...item, quantity: newQty };
        }
        return item;
      }).filter(Boolean) as CartItem[];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const handleCheckoutTrigger = () => {
    if (cart.length === 0) return;
    if (paymentMethod === 'CASH') {
      setCashTendered(totalAmount);
      setShowCashModal(true);
    } else {
      executeCheckout();
    }
  };

  const executeCheckout = async () => {
    setShowCashModal(false);
    const saleItems = cart.map(item => ({
      productId: item.product.id,
      productName: item.product.name,
      sku: item.product.sku,
      quantity: item.quantity,
      unitPrice: item.product.sellingPrice,
      discount: 0,
      lineTotal: item.product.sellingPrice * item.quantity
    }));

    const sale = await recordRetailSale({
      saleType: 'RETAIL',
      customerName,
      customerPhone: customerPhone || undefined,
      items: saleItems,
      subtotal,
      taxAmount: 0,
      discountAmount,
      totalAmount,
      amountPaid: paymentMethod === 'CASH' ? cashTendered : totalAmount,
      changeDue,
      paymentMethod,
      cashierName,
      status: 'COMPLETED'
    });

    setLastReceipt(sale);
    setShowReceiptModal(true);
    setCart([]);
    setCustomerName('Walk-in Customer');
    setCustomerPhone('');
    setDiscountPercent(0);
    setCashTendered(0);
  };

  const handleHoldOrder = () => {
    if (cart.length === 0) return;
    setHeldOrders(prev => [
      ...prev,
      {
        id: `HOLD-${Date.now().toString().slice(-4)}`,
        cart,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        customerName
      }
    ]);
    setCart([]);
    setCustomerName('Walk-in Customer');
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans select-none overflow-hidden">
      {/* Dark Professional POS Header */}
      <header className="bg-slate-950 text-white border-b border-slate-800 px-6 py-2.5 flex items-center justify-between shadow-xl">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            {tenant.logoUrl ? (
              <img src={tenant.logoUrl} alt={tenant.name} className="h-10 w-10 rounded-2xl object-contain bg-white p-1 shadow-md" />
            ) : (
              <div className="h-10 w-10 rounded-2xl bg-indigo-600 flex items-center justify-center font-black text-white text-lg shadow-md">
                {tenant.name.charAt(0)}
              </div>
            )}
            <div>
              <h1 className="text-base font-black text-white leading-tight tracking-tight flex items-center space-x-2 uppercase">
                <span>{tenant.name}</span>
              </h1>
              <p className="text-xs text-slate-300 font-medium flex items-center space-x-1.5 mt-0.5">
                <span>Cashier: <strong className="text-emerald-400 font-bold">{cashierName}</strong></span>
              </p>
            </div>
          </div>
        </div>

        {/* Header Controls */}
        <div className="flex items-center space-x-2">
          {/* Printer Status */}
          <button
            onClick={() => setShowPrinterSettingsModal(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 rounded-xl text-xs font-semibold border border-slate-800 transition"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <Printer className="w-3.5 h-3.5 text-slate-400" />
            <span>Printer</span>
          </button>

          {/* Fullscreen Kiosk Mode */}
          <button
            onClick={toggleFullscreen}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 rounded-xl text-xs font-semibold border border-slate-800 transition flex items-center space-x-1.5"
          >
            <Maximize2 className="w-3.5 h-3.5 text-indigo-400" />
            <span className="uppercase font-bold tracking-wide">Fullscreen Kiosk</span>
          </button>

          {/* Held Orders */}
          <button
            onClick={() => setShowHeldOrdersModal(true)}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 rounded-xl text-xs font-semibold border border-slate-800 transition flex items-center space-x-1.5"
          >
            <PauseCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>Held Orders</span>
          </button>

          {/* Switch Cashier */}
          <button
            onClick={() => setShowSwitchCashierModal(true)}
            className="px-3 py-1.5 bg-emerald-900/60 hover:bg-emerald-900 text-emerald-300 rounded-xl text-xs font-semibold border border-emerald-800 transition flex items-center space-x-1.5"
          >
            <User className="w-3.5 h-3.5" />
            <span className="uppercase font-bold">Switch Cashier</span>
          </button>

          {/* Back Office Exit */}
          <button
            onClick={() => {
              setManagerAction('EXIT_POS');
              setShowManagerPinModal(true);
            }}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-bold border border-slate-800 transition flex items-center space-x-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Back Office</span>
          </button>
        </div>
      </header>

      {/* Kiosk Mode Notice Banner */}
      <div className="bg-slate-900 text-emerald-300 px-6 py-2 flex items-center justify-between text-xs border-b border-slate-800 shadow-sm">
        <div className="flex items-center space-x-2">
          <span className="font-bold uppercase tracking-wider text-emerald-400">POS KIOSK MODE:</span>
          <span className="text-slate-300">Hide the browser address bar, bookmarks, and tabs for a dedicated cashier terminal experience.</span>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={toggleFullscreen}
            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-xs shadow-sm transition flex items-center space-x-1"
          >
            <span>Enter Fullscreen Now</span>
          </button>
        </div>
      </div>

      {/* POS Main Content Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden bg-slate-100">
        {/* Left Vertical Category Sidebar */}
        <div className="w-24 bg-white border-r border-slate-200 flex flex-col items-center py-4 space-y-3 shadow-xs">
          {[
            { id: 'ALL ITEMS', label: 'All Items', icon: Grid },
            { id: 'FOOD', label: 'Food', icon: Utensils },
            { id: 'DRINKS', label: 'Drinks', icon: Coffee },
            { id: 'SNACKS', label: 'Snacks', icon: ShoppingBag },
            { id: 'EXTRAS', label: 'Extras', icon: PlusCircle }
          ].map(cat => {
            const Icon = cat.icon;
            const active = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`w-20 h-20 rounded-2xl flex flex-col items-center justify-center space-y-1.5 transition ${
                  active
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-[11px] font-bold tracking-tight uppercase">{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Center Product Catalog Area */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col p-5 overflow-hidden space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
            <input
              id="pos-search-input"
              type="text"
              placeholder="Search item by name or scan barcode"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              autoFocus
              className="w-full pl-12 pr-12 py-3 bg-white border border-slate-200 rounded-2xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
            />
            <Barcode className="w-5 h-5 text-slate-400 absolute right-4 top-3.5" />
          </div>

          {/* Product Grid */}
          <div className="flex-1 overflow-y-auto pr-1 grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map(product => {
              const inStock = product.currentStock > 0;
              // Fallback food/drink images for realistic menu look
              const imageUrl = product.imageUrl || (
                product.name.toLowerCase().includes('ugali') ? 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=300&q=80' :
                product.name.toLowerCase().includes('chicken') ? 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=300&q=80' :
                product.name.toLowerCase().includes('nyama') ? 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=300&q=80' :
                product.name.toLowerCase().includes('coca') ? 'https://images.unsplash.com/photo-1554866585-cd94860890b7?auto=format&fit=crop&w=300&q=80' :
                product.name.toLowerCase().includes('fanta') ? 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=300&q=80' :
                product.name.toLowerCase().includes('juice') ? 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=300&q=80' :
                product.name.toLowerCase().includes('chips') ? 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=300&q=80' :
                'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80'
              );

              return (
                <button
                  key={product.id}
                  onClick={() => inStock && addToCart(product)}
                  disabled={!inStock}
                  className={`bg-white rounded-3xl p-4 border border-slate-200/80 shadow-xs hover:shadow-md transition flex flex-col items-center text-center justify-between group relative ${
                    inStock ? 'cursor-pointer active:scale-95' : 'opacity-40 cursor-not-allowed'
                  }`}
                >
                  <img
                    src={imageUrl}
                    alt={product.name}
                    className="w-24 h-24 rounded-full object-cover mb-3 shadow-sm bg-slate-100 group-hover:scale-105 transition"
                  />
                  <div className="w-full">
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition line-clamp-2 mb-1">{product.name}</h3>
                  </div>
                  <div className="mt-2 w-full pt-2 border-t border-slate-100">
                    <span className="text-base font-black text-emerald-600">KSh {product.sellingPrice.toLocaleString()}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Sidebar: Current Order / Cart */}
        <div className="lg:col-span-5 xl:col-span-4 bg-white border-l border-slate-200 flex flex-col justify-between h-full shadow-sm">
          {/* Cart Header */}
          <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-white">
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight">CURRENT ORDER</h2>
            <button
              onClick={() => setCart([])}
              disabled={cart.length === 0}
              className="text-slate-400 hover:text-rose-600 disabled:opacity-40 transition"
              title="Clear Cart"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>

          {/* Table Headers */}
          {cart.length > 0 && (
            <div className="grid grid-cols-12 px-4 py-2 bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase">
              <span className="col-span-6">Item</span>
              <span className="col-span-2 text-center">Qty</span>
              <span className="col-span-2 text-right">Price</span>
              <span className="col-span-2 text-right">Total</span>
            </div>
          )}

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {cart.map(item => (
              <div key={item.product.id} className="grid grid-cols-12 px-4 py-3 items-center text-xs">
                <div className="col-span-6 pr-2">
                  <div className="font-bold text-slate-900 truncate">{item.product.name}</div>
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-[10px] text-rose-500 hover:underline mt-0.5"
                  >
                    Remove
                  </button>
                </div>
                <div className="col-span-2 flex items-center justify-center space-x-1">
                  <button
                    onClick={() => updateQuantity(item.product.id, -1)}
                    className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 font-bold"
                  >
                    -
                  </button>
                  <span className="font-bold text-slate-900 px-1">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product.id, 1)}
                    className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 font-bold"
                  >
                    +
                  </button>
                </div>
                <div className="col-span-2 text-right text-slate-600 font-medium">
                  {item.product.sellingPrice}
                </div>
                <div className="col-span-2 text-right font-bold text-slate-900">
                  {item.product.sellingPrice * item.quantity}
                </div>
              </div>
            ))}
            {cart.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 py-24 px-6">
                <ShoppingBag className="w-12 h-12 text-slate-300 mb-3" />
                <p className="text-sm font-bold text-slate-700">No items added to order</p>
                <p className="text-xs text-slate-400 mt-1">Click on menu items or scan barcode</p>
              </div>
            )}
          </div>

          {/* Cart Summary & Payment Panel */}
          <div className="p-4 bg-white border-t border-slate-200 space-y-3">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-800">KSh {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Discount</span>
                <span className="font-semibold text-slate-800">KSh {discountAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xl font-black text-slate-950 pt-2 border-t border-slate-200">
                <span>TOTAL</span>
                <span className="text-emerald-600 font-black">KSh {totalAmount.toLocaleString()}</span>
              </div>
            </div>

            {/* Action Buttons: Hold and Pay */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              <button
                onClick={handleHoldOrder}
                disabled={cart.length === 0}
                className="col-span-1 py-3.5 bg-amber-50 hover:bg-amber-100 disabled:opacity-40 text-amber-800 border border-amber-200 rounded-2xl font-extrabold text-xs flex items-center justify-center space-x-1 transition shadow-xs"
              >
                <PauseCircle className="w-4 h-4 text-amber-600" />
                <span>HOLD</span>
              </button>
              <button
                onClick={handleCheckoutTrigger}
                disabled={cart.length === 0}
                className="col-span-2 py-3.5 bg-emerald-400 hover:bg-emerald-500 disabled:opacity-40 text-slate-950 font-black rounded-2xl shadow-md transition flex items-center justify-center space-x-2 text-sm tracking-wide"
              >
                <span>PAY KSh {totalAmount.toLocaleString()}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Cash Tendered Calculator Modal */}
      {showCashModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-6 text-white shadow-2xl space-y-4">
            <div className="flex items-center space-x-3 pb-2 border-b border-slate-800">
              <div className="p-2.5 rounded-2xl bg-emerald-950 text-emerald-400">
                <Banknote className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold">Cash Tendered</h3>
                <p className="text-xs text-slate-400">Total Due: KES {totalAmount.toLocaleString()}</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Amount Received from Customer</label>
              <input
                type="number"
                value={cashTendered}
                onChange={e => setCashTendered(Number(e.target.value))}
                autoFocus
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-xl font-black text-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Quick cash pills */}
            <div className="grid grid-cols-3 gap-2">
              {[totalAmount, 500, 1000, 2000, 5000, 10000].filter(val => val >= totalAmount).slice(0, 3).map(amt => (
                <button
                  key={amt}
                  onClick={() => setCashTendered(amt)}
                  className="py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold text-slate-200"
                >
                  KES {amt.toLocaleString()}
                </button>
              ))}
            </div>

            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex justify-between items-center text-sm">
              <span className="text-slate-400 font-semibold">Change Return:</span>
              <span className="font-black text-emerald-400">KES {changeDue.toLocaleString()}</span>
            </div>

            <div className="flex space-x-2 pt-2">
              <button
                onClick={() => setShowCashModal(false)}
                className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 rounded-2xl text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={executeCheckout}
                disabled={cashTendered < totalAmount}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 rounded-2xl text-xs font-bold text-white shadow-lg"
              >
                Confirm Sale
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {showReceiptModal && lastReceipt && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-slate-900 shadow-2xl space-y-4">
            <div className="text-center space-y-1 pb-4 border-b border-dashed border-slate-300">
              {tenant.logoUrl && <img src={tenant.logoUrl} alt="" className="h-10 w-10 mx-auto object-contain mb-1" />}
              <h3 className="text-lg font-black text-slate-900">{tenant.name}</h3>
              <p className="text-xs text-slate-500">{tenant.address || 'Nairobi, Kenya'} • Tel: {tenant.phone || '+254 700 000000'}</p>
              <div className="inline-block mt-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold">
                Official Receipt
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Receipt #:</span>
                <span className="font-mono font-bold text-slate-900">{lastReceipt.receiptNumber}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Cashier:</span>
                <span className="font-semibold text-slate-900">{lastReceipt.cashierName}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Customer:</span>
                <span className="font-semibold text-slate-900">{lastReceipt.customerName}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Payment:</span>
                <span className="font-semibold text-slate-900">{lastReceipt.paymentMethod}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Time:</span>
                <span className="font-semibold text-slate-900">{new Date(lastReceipt.createdAt).toLocaleString()}</span>
              </div>
            </div>

            <div className="border-t border-b border-slate-200 py-3 space-y-2 max-h-40 overflow-y-auto">
              <div className="text-[10px] font-bold uppercase text-slate-400">Purchased Items</div>
              {lastReceipt.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-xs">
                  <span className="text-slate-800">{item.quantity}x {item.productName}</span>
                  <span className="font-bold text-slate-900">KES {item.lineTotal.toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="space-y-1 pt-1 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span>KES {lastReceipt.subtotal.toLocaleString()}</span>
              </div>
              {lastReceipt.discountAmount > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>Discount:</span>
                  <span>- KES {lastReceipt.discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-black text-slate-900 pt-1 border-t border-slate-200">
                <span>Total Paid:</span>
                <span>KES {lastReceipt.totalAmount.toLocaleString()}</span>
              </div>
              {lastReceipt.paymentMethod === 'CASH' && (
                <>
                  <div className="flex justify-between text-slate-600">
                    <span>Cash Tendered:</span>
                    <span>KES {lastReceipt.amountPaid.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 font-bold">
                    <span>Change Due:</span>
                    <span>KES {lastReceipt.changeDue.toLocaleString()}</span>
                  </div>
                </>
              )}
            </div>

            <div className="pt-2 flex space-x-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 bg-slate-900 text-white rounded-xl font-semibold text-xs hover:bg-slate-800 transition shadow-sm"
              >
                Print Receipt
              </button>
              <button
                onClick={() => setShowReceiptModal(false)}
                className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold text-xs hover:bg-indigo-700 transition shadow-sm"
              >
                Next Sale
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Held Orders Modal */}
      {showHeldOrdersModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 text-white shadow-2xl space-y-4">
            <h3 className="text-lg font-bold">Held Orders ({heldOrders.length})</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {heldOrders.map(order => (
                <div key={order.id} className="p-3 bg-slate-800 rounded-2xl flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-indigo-400">{order.id} • {order.time}</div>
                    <div className="text-xs text-slate-300 mt-0.5">{order.customerName} • {order.cart.length} items</div>
                  </div>
                  <button
                    onClick={() => {
                      setCart(order.cart);
                      setCustomerName(order.customerName);
                      setHeldOrders(prev => prev.filter(o => o.id !== order.id));
                      setShowHeldOrdersModal(false);
                    }}
                    className="px-3 py-1.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-500 shadow-xs"
                  >
                    Restore
                  </button>
                </div>
              ))}
              {heldOrders.length === 0 && (
                <p className="text-center text-xs text-slate-500 py-8">No held orders found.</p>
              )}
            </div>
            <button
              onClick={() => setShowHeldOrdersModal(false)}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Shift & Float Modal */}
      {showShiftModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-6 text-white shadow-2xl space-y-4">
            <h3 className="text-lg font-bold">Cashier Shift & Float</h3>
            <p className="text-xs text-slate-400">Current Cashier: <span className="text-white font-semibold">{cashierName}</span></p>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Opening Cash Float (KES)</label>
                <input
                  type="number"
                  value={shiftFloat}
                  onChange={e => setShiftFloat(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white"
                />
              </div>
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-1 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Register Sales Today:</span>
                  <span className="font-bold text-emerald-400">KES {shiftSalesTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Cash Drawer Expected:</span>
                  <span className="font-bold text-white">KES {(shiftFloat + shiftSalesTotal).toLocaleString()}</span>
                </div>
              </div>
            </div>
            <div className="flex space-x-2 pt-2">
              <button
                onClick={() => setShowShiftModal(false)}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold"
              >
                Close Drawer & End Shift
              </button>
              <button
                onClick={() => setShowShiftModal(false)}
                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-bold"
              >
                Save Shift
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Switch Cashier Modal */}
      {showSwitchCashierModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-6 text-white shadow-2xl space-y-4">
            <h3 className="text-lg font-bold">Switch Cashier</h3>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">New Cashier Name / PIN</label>
              <input
                type="text"
                placeholder="Enter cashier name..."
                value={newCashierInput}
                onChange={e => setNewCashierInput(e.target.value)}
                autoFocus
                className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white"
              />
            </div>
            <div className="flex space-x-2 pt-2">
              <button
                onClick={() => setShowSwitchCashierModal(false)}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (newCashierInput.trim()) {
                    setCashierName(newCashierInput.trim());
                  }
                  setShowSwitchCashierModal(false);
                  setNewCashierInput('');
                }}
                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-bold"
              >
                Switch Cashier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Thermal Printer Settings Modal */}
      {showPrinterSettingsModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 text-white shadow-2xl space-y-4">
            <div className="flex items-center space-x-3 pb-3 border-b border-slate-800">
              <Printer className="w-6 h-6 text-indigo-400" />
              <div>
                <h3 className="text-base font-bold">Thermal Printer Setup</h3>
                <p className="text-xs text-slate-400">Configure POS receipt printing preferences</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-400 uppercase mb-1.5">Receipt Width Format</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setReceiptWidth('58mm')}
                    className={`py-2.5 rounded-xl font-bold transition ${receiptWidth === '58mm' ? 'bg-indigo-600 text-white' : 'bg-slate-950 text-slate-400 border border-slate-800'}`}
                  >
                    58mm (Compact)
                  </button>
                  <button
                    onClick={() => setReceiptWidth('80mm')}
                    className={`py-2.5 rounded-xl font-bold transition ${receiptWidth === '80mm' ? 'bg-indigo-600 text-white' : 'bg-slate-950 text-slate-400 border border-slate-800'}`}
                  >
                    80mm (Standard POS)
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-950 rounded-2xl border border-slate-800">
                <div>
                  <div className="font-bold text-white">Auto-Print After Sale</div>
                  <div className="text-[11px] text-slate-500">Automatically trigger browser/thermal print prompt on completion</div>
                </div>
                <input
                  type="checkbox"
                  checked={autoPrint}
                  onChange={e => setAutoPrint(e.target.checked)}
                  className="w-4 h-4 accent-indigo-600 rounded"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-950 rounded-2xl border border-slate-800">
                <div>
                  <div className="font-bold text-white">Printer Status</div>
                  <div className="text-[11px] text-emerald-400 font-semibold">Connected via USB / WebPrint</div>
                </div>
                <button
                  onClick={() => {
                    setIsPrinterConnected(!isPrinterConnected);
                  }}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-bold"
                >
                  {isPrinterConnected ? 'Disconnect' : 'Connect'}
                </button>
              </div>
            </div>

            <div className="flex space-x-2 pt-2">
              <button
                onClick={() => {
                  window.print();
                }}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl font-bold text-xs"
              >
                Test Print Receipt
              </button>
              <button
                onClick={() => setShowPrinterSettingsModal(false)}
                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold text-xs text-white"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sales History Modal */}
      {showSalesHistoryModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 text-white shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold">POS Sales History ({retailSales.length})</h3>
                <p className="text-xs text-slate-400">Recent completed transactions for {tenant.name}</p>
              </div>
              <button
                onClick={() => setShowSalesHistoryModal(false)}
                className="text-slate-400 hover:text-white text-xs font-bold px-3 py-1 bg-slate-800 rounded-xl"
              >
                Close
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
              {retailSales.map(sale => (
                <div key={sale.id} className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold text-indigo-400">{sale.receiptNumber}</span>
                      <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 rounded text-[10px] font-bold">KES {sale.totalAmount.toLocaleString()}</span>
                      <span className="text-[11px] text-slate-400 uppercase">{sale.paymentMethod}</span>
                    </div>
                    <div className="text-xs text-slate-300">
                      Customer: <strong className="text-white">{sale.customerName}</strong> • Cashier: {sale.cashierName} • {sale.items.length} items
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setLastReceipt(sale);
                      setShowSalesHistoryModal(false);
                      setShowReceiptModal(true);
                    }}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold text-slate-200"
                  >
                    View / Print
                  </button>
                </div>
              ))}
              {retailSales.length === 0 && (
                <p className="text-center text-xs text-slate-500 py-12">No sales recorded yet during this session.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Manager PIN Authorization Modal */}
      {showManagerPinModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-6 text-white shadow-2xl space-y-4">
            <div className="flex items-center space-x-3 pb-2 border-b border-slate-800">
              <ShieldCheck className="w-6 h-6 text-amber-400" />
              <div>
                <h3 className="text-base font-bold">Manager Authorization</h3>
                <p className="text-xs text-slate-400">Required for restricted POS operations</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Enter Manager PIN / Password</label>
              <input
                type="password"
                placeholder="••••"
                value={managerPin}
                onChange={e => setManagerPin(e.target.value)}
                autoFocus
                className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-lg font-mono text-center text-white tracking-widest focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="flex space-x-2 pt-2">
              <button
                onClick={() => {
                  setShowManagerPinModal(false);
                  setManagerPin('');
                  setManagerAction(null);
                }}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Accept any non-empty PIN for supervisor override
                  if (managerPin.trim()) {
                    if (managerAction === 'EXIT_POS') {
                      onExit();
                    }
                    setShowManagerPinModal(false);
                    setManagerPin('');
                    setManagerAction(null);
                  }
                }}
                disabled={!managerPin.trim()}
                className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 rounded-xl text-xs font-bold text-slate-950 shadow-md"
              >
                Authorize
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
