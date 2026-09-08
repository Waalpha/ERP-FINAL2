import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  PosProduct,
  PosSale,
  PosStockMovement,
  PosShift,
  PosStockCountRecord,
  PosAuditLog
} from '../../types/pos';
import {
  subscribePosProducts,
  subscribePosSales,
  subscribePosStockMovements,
  subscribePosShifts,
  subscribePosStockCounts,
  subscribePosAuditLogs
} from '../../services/PosFirestoreService';
import { CashierSellView } from './CashierSellView';
import { CashierStockView } from './CashierStockView';
import { CashierMySalesView } from './CashierMySalesView';
import { CashierShiftView } from './CashierShiftView';
import { CashierCloseShiftView } from './CashierCloseShiftView';
import { ManagerDashboardView } from './ManagerDashboardView';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Receipt,
  Clock,
  ClipboardCheck,
  Shield,
  Layers,
  ArrowLeft,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  LogOut,
  Building2
} from 'lucide-react';

interface SimpleCashierModuleProps {
  onExit?: () => void;
  onNavigateTab?: (tab: string) => void;
}

export type CashierNavTab = 'dashboard' | 'sell' | 'stock' | 'my_sales' | 'shift' | 'close_shift';

export const SimpleCashierModule: React.FC<SimpleCashierModuleProps> = ({
  onExit,
  onNavigateTab
}) => {
  const { tenant, user } = useAuth();

  // Mode: Cashier mode vs Manager mode
  // If user is CASHIER, they are locked to Cashier mode.
  // If user is Admin/Manager, they can toggle freely.
  const isManagerOrAdmin =
    user?.role === 'SUPER_ADMIN' ||
    user?.role === 'TENANT_ADMIN' ||
    user?.role === 'MANAGER' ||
    user?.role === 'ACCOUNTANT';

  const [activeMode, setActiveMode] = useState<'CASHIER' | 'MANAGER'>(() => {
    return isManagerOrAdmin ? 'CASHIER' : 'CASHIER';
  });

  const [cashierTab, setCashierTab] = useState<CashierNavTab>('sell');

  // Firestore collections real-time state
  const [products, setProducts] = useState<PosProduct[]>([]);
  const [sales, setSales] = useState<PosSale[]>([]);
  const [movements, setMovements] = useState<PosStockMovement[]>([]);
  const [shifts, setShifts] = useState<PosShift[]>([]);
  const [stockCounts, setStockCounts] = useState<PosStockCountRecord[]>([]);
  const [auditLogs, setAuditLogs] = useState<PosAuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Real-time Firestore subscriptions for active tenant
  useEffect(() => {
    if (!tenant?.id) return;
    setIsLoading(true);

    const unsubProducts = subscribePosProducts(tenant.id, (data) => {
      setProducts(data);
      setIsLoading(false);
    });

    const unsubSales = subscribePosSales(tenant.id, (data) => {
      setSales(data);
    });

    const unsubMovements = subscribePosStockMovements(tenant.id, (data) => {
      setMovements(data);
    });

    const unsubShifts = subscribePosShifts(tenant.id, (data) => {
      setShifts(data);
    });

    const unsubCounts = subscribePosStockCounts(tenant.id, (data) => {
      setStockCounts(data);
    });

    const unsubLogs = subscribePosAuditLogs(tenant.id, (data) => {
      setAuditLogs(data);
    });

    return () => {
      unsubProducts();
      unsubSales();
      unsubMovements();
      unsubShifts();
      unsubCounts();
      unsubLogs();
    };
  }, [tenant?.id]);

  // Find active open shift for this cashier
  const activeShift = useMemo(() => {
    if (!user) return null;
    return shifts.find(
      (s) => s.status === 'OPEN' && (s.cashierId === user.uid || s.cashierName === user.displayName)
    ) || null;
  }, [shifts, user]);

  // Today's metrics for dashboard
  const todayStr = new Date().toISOString().slice(0, 10);
  const myTodaySales = useMemo(() => {
    return sales.filter((s) => {
      const matchUser = s.cashierId === user?.uid || s.cashierName === user?.displayName;
      return matchUser && s.createdAt.startsWith(todayStr) && s.status !== 'VOIDED';
    });
  }, [sales, user, todayStr]);

  const todayRevenue = myTodaySales.reduce((acc, s) => acc + s.totalAmount, 0);
  const todayItemsSold = myTodaySales.reduce((acc, s) => acc + s.totalQuantity, 0);
  const lowStockProducts = products.filter((p) => p.currentStock <= p.minStockAlert && p.isActive);

  if (!tenant || !user) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-950 text-white">
        <p>Loading tenant session...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-950 font-sans text-slate-100 select-none">
      {/* 1. TOP HEADER / APP BAR */}
      <header className="h-16 bg-slate-900 border-b border-slate-800 px-4 md:px-6 flex items-center justify-between shrink-0 z-20">
        {/* Left: Brand, Tenant & Return */}
        <div className="flex items-center gap-3">
          {onExit && (
            <button
              onClick={onExit}
              className="flex items-center gap-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-300 transition-colors"
              title="Return to Main ERP Shell"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back to ERP</span>
            </button>
          )}

          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-base shadow-sm">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm md:text-base font-bold text-white tracking-tight leading-none">
                  {tenant.name}
                </h1>
                <span className="rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 text-[10px] font-bold font-mono">
                  POS
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-none mt-1">
                Davetech Simple Cashier & Stock Engine
              </p>
            </div>
          </div>
        </div>

        {/* Center: Shift Status Indicator */}
        <div className="hidden md:flex items-center gap-2 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
          {activeShift ? (
            <>
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-400">Shift Active:</span>
              <span className="font-bold text-white font-mono">#{activeShift.id.slice(-6)}</span>
              <span className="text-slate-500">•</span>
              <span className="text-emerald-400 font-semibold">{activeShift.cashierName}</span>
            </>
          ) : (
            <>
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
              <span className="text-amber-300 font-medium">No Active Shift</span>
              <button
                onClick={() => setCashierTab('shift')}
                className="ml-2 text-[10px] bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-2 py-0.5 rounded transition-colors"
              >
                Start Shift
              </button>
            </>
          )}
        </div>

        {/* Right: Mode Switcher (For Managers) & User Identity */}
        <div className="flex items-center gap-3">
          {/* Manager / Cashier Mode Toggle */}
          {isManagerOrAdmin && (
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setActiveMode('CASHIER')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  activeMode === 'CASHIER'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Cashier View
              </button>
              <button
                onClick={() => setActiveMode('MANAGER')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  activeMode === 'MANAGER'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Manager Mode
              </button>
            </div>
          )}

          {/* User Tag */}
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-white truncate max-w-[140px]">
              {user.displayName || user.email}
            </p>
            <span className="text-[10px] font-mono font-semibold text-slate-400">
              {user.role}
            </span>
          </div>
        </div>
      </header>

      {/* 2. CASHIER NAVIGATION TABS (Shown in Cashier Mode) */}
      {activeMode === 'CASHIER' && (
        <nav className="bg-slate-950 border-b border-slate-800 px-4 md:px-6 flex items-center gap-2 overflow-x-auto py-2 shrink-0 scrollbar-none z-10">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'sell', label: 'Sell (POS)', icon: ShoppingCart },
            { id: 'stock', label: 'Stock (Available)', icon: Package },
            { id: 'my_sales', label: 'My Sales', icon: Receipt },
            { id: 'shift', label: 'My Shift', icon: Clock },
            { id: 'close_shift', label: 'Close Shift & Count', icon: ClipboardCheck }
          ].map((item) => {
            const Icon = item.icon;
            const isActive = cashierTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCashierTab(item.id as CashierNavTab)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25 ring-1 ring-emerald-400'
                    : 'bg-slate-900/80 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            );
          })}
        </nav>
      )}

      {/* 3. MAIN BODY CONTENT */}
      <main className="flex-1 overflow-y-auto bg-slate-900">
        {activeMode === 'MANAGER' ? (
          /* MANAGER DASHBOARD VIEW */
          <ManagerDashboardView
            tenant={tenant}
            user={user}
            products={products}
            sales={sales}
            movements={movements}
            shifts={shifts}
            stockCounts={stockCounts}
            auditLogs={auditLogs}
          />
        ) : (
          /* CASHIER VIEWS */
          <>
            {/* CASHIER TAB: DASHBOARD */}
            {cashierTab === 'dashboard' && (
              <div className="p-4 md:p-6 space-y-6 max-w-5xl mx-auto">
                {/* Welcome Card */}
                <div className="rounded-3xl border border-slate-800 bg-slate-950 p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                      Station Welcome
                    </span>
                    <h2 className="text-2xl font-bold text-white mt-1">
                      Hello, {user.displayName || 'Cashier'}
                    </h2>
                    <p className="text-xs text-slate-400 mt-1 max-w-lg">
                      Ready to record sales and count physical stock. Record what is available, what is sold, and close your shift accurately.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <button
                      onClick={() => setCashierTab('sell')}
                      className="px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 font-bold text-xs text-white shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Open Selling Screen
                    </button>
                    {!activeShift && (
                      <button
                        onClick={() => setCashierTab('shift')}
                        className="px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 font-bold text-xs text-slate-950 shadow flex items-center justify-center gap-2 transition-all"
                      >
                        <Clock className="h-4 w-4" />
                        Start New Shift
                      </button>
                    )}
                  </div>
                </div>

                {/* Today's KPI Metrics */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="rounded-2xl bg-slate-950 border border-slate-800 p-5">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Today&apos;s Sales</p>
                    <p className="text-2xl font-bold text-emerald-400 font-mono mt-1">
                      KES {todayRevenue.toLocaleString()}
                    </p>
                    <span className="text-[11px] text-slate-500">{myTodaySales.length} receipts issued</span>
                  </div>

                  <div className="rounded-2xl bg-slate-950 border border-slate-800 p-5">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Items Dispatched</p>
                    <p className="text-2xl font-bold text-white font-mono mt-1">{todayItemsSold} units</p>
                    <span className="text-[11px] text-slate-500">Recorded from shelves</span>
                  </div>

                  <div className="rounded-2xl bg-slate-950 border border-slate-800 p-5">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Shift</p>
                    <p className="text-lg font-bold text-indigo-300 font-mono mt-1 truncate">
                      {activeShift ? `#${activeShift.id.slice(-6)}` : 'No Open Shift'}
                    </p>
                    <span className="text-[11px] text-slate-500">
                      {activeShift ? 'Currently operating' : 'Click to start shift'}
                    </span>
                  </div>

                  <div className="rounded-2xl bg-slate-950 border border-slate-800 p-5">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Low Stock Warnings</p>
                    <p className="text-2xl font-bold text-amber-400 font-mono mt-1">{lowStockProducts.length}</p>
                    <span className="text-[11px] text-slate-500">Alert threshold items</span>
                  </div>
                </div>

                {/* Fast Action Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <button
                    onClick={() => setCashierTab('sell')}
                    className="p-5 rounded-2xl bg-slate-950 hover:bg-slate-850 border border-slate-800 text-left transition-all group"
                  >
                    <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                      <ShoppingCart className="h-5 w-5" />
                    </div>
                    <h4 className="font-bold text-sm text-white flex items-center justify-between">
                      Sell Products
                      <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Fast 1-tap selling, drinks grid, cash & M-Pesa receipts.
                    </p>
                  </button>

                  <button
                    onClick={() => setCashierTab('stock')}
                    className="p-5 rounded-2xl bg-slate-950 hover:bg-slate-850 border border-slate-800 text-left transition-all group"
                  >
                    <div className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                      <Package className="h-5 w-5" />
                    </div>
                    <h4 className="font-bold text-sm text-white flex items-center justify-between">
                      Available Stock
                      <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-indigo-400 transition-colors" />
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Live quantities of Beers, Ciders, Spirits, and Soft Drinks.
                    </p>
                  </button>

                  <button
                    onClick={() => setCashierTab('close_shift')}
                    className="p-5 rounded-2xl bg-slate-950 hover:bg-slate-850 border border-slate-800 text-left transition-all group"
                  >
                    <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                      <ClipboardCheck className="h-5 w-5" />
                    </div>
                    <h4 className="font-bold text-sm text-white flex items-center justify-between">
                      Close Shift & Count
                      <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-amber-400 transition-colors" />
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Count remaining physical stock and flag any discrepancies.
                    </p>
                  </button>
                </div>
              </div>
            )}

            {/* CASHIER TAB: SELL */}
            {cashierTab === 'sell' && (
              <CashierSellView
                tenant={tenant}
                user={user}
                products={products}
                activeShift={activeShift}
                onStartShiftClick={() => setCashierTab('shift')}
              />
            )}

            {/* CASHIER TAB: STOCK */}
            {cashierTab === 'stock' && <CashierStockView products={products} />}

            {/* CASHIER TAB: MY SALES */}
            {cashierTab === 'my_sales' && (
              <CashierMySalesView tenant={tenant} user={user} sales={sales} />
            )}

            {/* CASHIER TAB: SHIFT */}
            {cashierTab === 'shift' && (
              <CashierShiftView
                tenant={tenant}
                user={user}
                activeShift={activeShift}
                onNavigateToCloseShift={() => setCashierTab('close_shift')}
                onNavigateToSell={() => setCashierTab('sell')}
              />
            )}

            {/* CASHIER TAB: CLOSE SHIFT */}
            {cashierTab === 'close_shift' && (
              <CashierCloseShiftView
                tenant={tenant}
                user={user}
                activeShift={activeShift}
                products={products}
                sales={sales}
                movements={movements}
                onShiftClosedSuccess={() => {
                  setCashierTab('dashboard');
                }}
                onNavigateToShift={() => setCashierTab('shift')}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
};
