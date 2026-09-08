import React, { useState, useMemo } from 'react';
import {
  PosProduct,
  PosSale,
  PosStockMovement,
  PosShift,
  PosStockCountRecord,
  PosAuditLog
} from '../../types/pos';
import { AppUser, Tenant } from '../../types';
import {
  createPosProduct,
  updatePosProduct,
  receivePosStock,
  adjustPosStock,
  reopenPosShift,
  voidPosSale
} from '../../services/PosFirestoreService';
import { PosReceiptModal } from './PosReceiptModal';
import {
  LayoutDashboard,
  Package,
  Layers,
  FileText,
  Clock,
  ShieldAlert,
  Plus,
  Search,
  Filter,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  Printer,
  Download,
  Unlock,
  RotateCcw,
  Edit2,
  Trash2,
  Loader2,
  Building2,
  User,
  Calendar,
  AlertCircle
} from 'lucide-react';

interface ManagerDashboardViewProps {
  tenant: Tenant;
  user: AppUser;
  products: PosProduct[];
  sales: PosSale[];
  movements: PosStockMovement[];
  shifts: PosShift[];
  stockCounts: PosStockCountRecord[];
  auditLogs: PosAuditLog[];
}

export const ManagerDashboardView: React.FC<ManagerDashboardViewProps> = ({
  tenant,
  user,
  products,
  sales,
  movements,
  shifts,
  stockCounts,
  auditLogs
}) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'products' | 'restock' | 'sales_report' | 'stock_variance' | 'shifts' | 'audit'
  >('overview');

  // Search & Filter States
  const [productSearch, setProductSearch] = useState('');
  const [reportDateRange, setReportDateRange] = useState<'today' | 'yesterday' | 'week' | 'month' | 'all'>('today');
  const [reportCashierFilter, setReportCashierFilter] = useState<string>('ALL');

  // Modals & Forms
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<PosProduct | null>(null);
  const [showReceiveStockModal, setShowReceiveStockModal] = useState(false);
  const [showAdjustStockModal, setShowAdjustStockModal] = useState(false);
  const [selectedShiftForDetail, setSelectedShiftForDetail] = useState<PosShift | null>(null);
  const [reopenModalShift, setReopenModalShift] = useState<PosShift | null>(null);
  const [reopenReason, setReopenReason] = useState('');
  const [selectedSaleForReceipt, setSelectedSaleForReceipt] = useState<PosSale | null>(null);

  // New product form state
  const [newProdName, setNewProdName] = useState('');
  const [newProdCat, setNewProdCat] = useState('Beers');
  const [newProdUnit, setNewProdUnit] = useState('Bottle');
  const [newProdSellPrice, setNewProdSellPrice] = useState<number>(250);
  const [newProdCostPrice, setNewProdCostPrice] = useState<number>(180);
  const [newProdOpening, setNewProdOpening] = useState<number>(50);
  const [newProdMinAlert, setNewProdMinAlert] = useState<number>(10);
  const [newProdAllowNegative, setNewProdAllowNegative] = useState(false);

  // Receive stock form state
  const [rcvProductId, setRcvProductId] = useState('');
  const [rcvQuantity, setRcvQuantity] = useState<number>(24);
  const [rcvSupplier, setRcvSupplier] = useState('Kenya Breweries / Distributor');
  const [rcvRef, setRcvRef] = useState(`INV-${Date.now().toString().slice(-4)}`);

  // Adjust stock form state
  const [adjProductId, setAdjProductId] = useState('');
  const [adjQuantity, setAdjQuantity] = useState<number>(-1);
  const [adjType, setAdjType] = useState<'DAMAGED' | 'SPOILED' | 'ADJUSTMENT'>('DAMAGED');
  const [adjReason, setAdjReason] = useState('Customer broke bottle on floor');

  const [isProcessing, setIsProcessing] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Products map helper
  const productsMap = useMemo(() => {
    const map = new Map<string, PosProduct>();
    products.forEach((p) => map.set(p.id, p));
    return map;
  }, [products]);

  // Date filtering logic
  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);
  const yesterdayStr = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const sevenDaysAgoStr = new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10);
  const thirtyDaysAgoStr = new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10);

  const filteredSalesForReport = useMemo(() => {
    return sales.filter((s) => {
      if (s.status === 'VOIDED') return false;
      const d = s.createdAt.slice(0, 10);
      if (reportDateRange === 'today' && d !== todayStr) return false;
      if (reportDateRange === 'yesterday' && d !== yesterdayStr) return false;
      if (reportDateRange === 'week' && d < sevenDaysAgoStr) return false;
      if (reportDateRange === 'month' && d < thirtyDaysAgoStr) return false;
      if (reportCashierFilter !== 'ALL' && s.cashierName !== reportCashierFilter) return false;
      return true;
    });
  }, [sales, reportDateRange, reportCashierFilter, todayStr, yesterdayStr, sevenDaysAgoStr, thirtyDaysAgoStr]);

  // Financial KPIs
  const totalReportSales = filteredSalesForReport.reduce((sum, s) => sum + s.totalAmount, 0);
  const totalReportUnits = filteredSalesForReport.reduce((sum, s) => sum + s.totalQuantity, 0);

  // Calculate COGS and Gross Profit
  const totalReportCOGS = useMemo(() => {
    return filteredSalesForReport.reduce((sum, sale) => {
      const saleCost = sale.items.reduce((itemSum, item) => {
        const prod = productsMap.get(item.productId);
        const cost = item.costPrice || prod?.costPrice || 0;
        return itemSum + cost * item.quantity;
      }, 0);
      return sum + saleCost;
    }, 0);
  }, [filteredSalesForReport, productsMap]);

  const grossProfit = totalReportSales - totalReportCOGS;
  const profitMarginPercent = totalReportSales > 0 ? ((grossProfit / totalReportSales) * 100).toFixed(1) : '0.0';

  // Cashiers list for filter
  const cashiersList = useMemo(() => {
    const set = new Set<string>();
    sales.forEach((s) => set.add(s.cashierName));
    return ['ALL', ...Array.from(set)];
  }, [sales]);

  // Handlers
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim()) return;
    setIsProcessing(true);
    setFeedbackMsg(null);
    try {
      await createPosProduct(
        tenant.id,
        {
          name: newProdName.trim(),
          category: newProdCat,
          unit: newProdUnit,
          sellingPrice: Number(newProdSellPrice),
          costPrice: Number(newProdCostPrice) || undefined,
          openingQuantity: Number(newProdOpening) || 0,
          currentStock: Number(newProdOpening) || 0,
          minStockAlert: Number(newProdMinAlert) || 5,
          isActive: true,
          allowNegativeStock: newProdAllowNegative
        },
        user
      );
      setShowAddProductModal(false);
      setNewProdName('');
      setFeedbackMsg({ type: 'success', text: 'Product created and opening stock baseline recorded.' });
    } catch (err: any) {
      setFeedbackMsg({ type: 'error', text: err.message || 'Failed to create product' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    setIsProcessing(true);
    setFeedbackMsg(null);
    try {
      await updatePosProduct(
        tenant.id,
        editingProduct.id,
        {
          name: editingProduct.name,
          category: editingProduct.category,
          unit: editingProduct.unit,
          sellingPrice: Number(editingProduct.sellingPrice),
          costPrice: Number(editingProduct.costPrice),
          openingQuantity: Number(editingProduct.openingQuantity),
          minStockAlert: Number(editingProduct.minStockAlert),
          isActive: editingProduct.isActive,
          allowNegativeStock: editingProduct.allowNegativeStock
        },
        user,
        productsMap.get(editingProduct.id)
      );
      setEditingProduct(null);
      setFeedbackMsg({ type: 'success', text: `Product "${editingProduct.name}" updated successfully.` });
    } catch (err: any) {
      setFeedbackMsg({ type: 'error', text: err.message || 'Failed to update product' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReceiveStockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rcvProductId || rcvQuantity <= 0) return;
    setIsProcessing(true);
    setFeedbackMsg(null);
    try {
      const prod = productsMap.get(rcvProductId);
      await receivePosStock(
        tenant.id,
        [{ productId: rcvProductId, productName: prod?.name || 'Item', quantity: Number(rcvQuantity) }],
        rcvRef,
        rcvSupplier,
        user,
        productsMap
      );
      setShowReceiveStockModal(false);
      setRcvQuantity(24);
      setFeedbackMsg({ type: 'success', text: `Restock received: +${rcvQuantity} units added to ${prod?.name}.` });
    } catch (err: any) {
      setFeedbackMsg({ type: 'error', text: err.message || 'Error receiving stock' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAdjustStockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjProductId || !adjReason.trim()) return;
    setIsProcessing(true);
    setFeedbackMsg(null);
    try {
      const prod = productsMap.get(adjProductId);
      const current = prod ? prod.currentStock : 0;
      await adjustPosStock(
        tenant.id,
        adjProductId,
        prod?.name || 'Item',
        Number(adjQuantity),
        adjType,
        adjReason,
        user,
        current
      );
      setShowAdjustStockModal(false);
      setAdjReason('');
      setFeedbackMsg({ type: 'success', text: `Stock adjusted for ${prod?.name}: ${adjQuantity} units (${adjType}).` });
    } catch (err: any) {
      setFeedbackMsg({ type: 'error', text: err.message || 'Error adjusting stock' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReopenShiftSubmit = async () => {
    if (!reopenModalShift || !reopenReason.trim()) return;
    setIsProcessing(true);
    try {
      await reopenPosShift(tenant.id, reopenModalShift.id, reopenReason.trim(), user);
      setReopenModalShift(null);
      setReopenReason('');
      setFeedbackMsg({ type: 'success', text: `Shift #${reopenModalShift.id.slice(-6)} reopened for cashier corrections.` });
    } catch (err: any) {
      setFeedbackMsg({ type: 'error', text: err.message || 'Failed to reopen shift' });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6 bg-slate-900 min-h-[calc(100vh-80px)] text-slate-100">
      {/* Manager Top Header & Tab Navigation */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Manager & Owner Portal
            </span>
            <span className="text-xs bg-slate-800 px-2 py-0.5 rounded font-mono text-slate-300">
              Role: {user.role}
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white mt-1">
            {tenant.name} — Bar & Stock Control
          </h2>
          <p className="text-xs text-slate-400">
            Full oversight of stock counts, pricing, restocks, gross profit, and cashier audit trails.
          </p>
        </div>

        {/* Quick Manager Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowAddProductModal(true)}
            className="flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-3.5 py-2 text-xs font-bold text-white shadow transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </button>
          <button
            onClick={() => setShowReceiveStockModal(true)}
            className="flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-3.5 py-2 text-xs font-bold text-white shadow transition-colors"
          >
            <Layers className="h-4 w-4" />
            Receive Delivery
          </button>
          <button
            onClick={() => setShowAdjustStockModal(true)}
            className="flex items-center gap-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 px-3.5 py-2 text-xs font-bold text-white shadow transition-colors"
          >
            <ShieldAlert className="h-4 w-4" />
            Adjust / Damaged
          </button>
        </div>
      </div>

      {/* Feedback banner */}
      {feedbackMsg && (
        <div
          className={`rounded-xl p-4 flex items-center justify-between text-xs font-semibold ${
            feedbackMsg.type === 'success'
              ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/15 border border-rose-500/30 text-rose-300'
          }`}
        >
          <span>{feedbackMsg.text}</span>
          <button onClick={() => setFeedbackMsg(null)} className="underline hover:no-underline ml-4">
            Dismiss
          </button>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-800 pb-2 scrollbar-none">
        {[
          { id: 'overview', label: 'Overview & KPIs', icon: LayoutDashboard },
          { id: 'products', label: 'Products & Prices', icon: Package },
          { id: 'restock', label: 'Restock & Movements', icon: Layers },
          { id: 'sales_report', label: 'Sales & Gross Profit', icon: FileText },
          { id: 'stock_variance', label: 'Stock & Discrepancies', icon: AlertTriangle },
          { id: 'shifts', label: 'Cashier Shifts', icon: Clock },
          { id: 'audit', label: 'Audit Trail', icon: ShieldAlert }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 ring-1 ring-emerald-400'
                  : 'bg-slate-800/80 text-slate-400 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW & KPIS */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Top Metrics Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl bg-slate-950 border border-slate-800 p-5">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Sales (Today)</p>
              <p className="text-2xl font-bold text-emerald-400 font-mono mt-1">
                KES {sales.filter((s) => s.createdAt.startsWith(todayStr) && s.status !== 'VOIDED').reduce((sum, s) => sum + s.totalAmount, 0).toLocaleString()}
              </p>
              <span className="text-[11px] text-slate-500">Live revenue today</span>
            </div>

            <div className="rounded-2xl bg-slate-950 border border-slate-800 p-5">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Inventory Value</p>
              <p className="text-2xl font-bold text-white font-mono mt-1">
                KES {products.reduce((sum, p) => sum + p.currentStock * (p.costPrice || p.sellingPrice), 0).toLocaleString()}
              </p>
              <span className="text-[11px] text-slate-500">Valued at cost price</span>
            </div>

            <div className="rounded-2xl bg-slate-950 border border-slate-800 p-5">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Low Stock Warnings</p>
              <p className="text-2xl font-bold text-amber-400 font-mono mt-1">
                {products.filter((p) => p.currentStock <= p.minStockAlert).length}
              </p>
              <span className="text-[11px] text-slate-500">Items below alert level</span>
            </div>

            <div className="rounded-2xl bg-slate-950 border border-slate-800 p-5">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Cashier Shifts</p>
              <p className="text-2xl font-bold text-indigo-400 font-mono mt-1">
                {shifts.filter((s) => s.status === 'OPEN').length}
              </p>
              <span className="text-[11px] text-slate-500">Stations operating now</span>
            </div>
          </div>

          {/* Quick Comparison Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Selling Products */}
            <div className="rounded-2xl bg-slate-950 border border-slate-800 p-5">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-emerald-400" />
                Top Moving Stock Items
              </h3>
              <div className="divide-y divide-slate-800/80">
                {products.slice(0, 5).map((prod) => (
                  <div key={prod.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-semibold text-white">{prod.name}</p>
                      <p className="text-[11px] text-slate-400 font-mono">
                        KES {prod.sellingPrice.toLocaleString()} • {prod.category}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-emerald-400 font-mono">{prod.currentStock} in stock</p>
                      <p className="text-[10px] text-slate-500">Opening: {prod.openingQuantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Cashier Shifts Summary */}
            <div className="rounded-2xl bg-slate-950 border border-slate-800 p-5">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <Clock className="h-4 w-4 text-indigo-400" />
                Recent Shift Submissions
              </h3>
              <div className="divide-y divide-slate-800/80">
                {shifts.slice(0, 5).map((sh) => (
                  <div key={sh.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-semibold text-white">{sh.cashierName}</p>
                      <p className="text-[11px] text-slate-400 font-mono">
                        {sh.date} • {sh.totalTransactions} sales
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                        sh.status === 'OPEN'
                          ? 'bg-emerald-500/15 text-emerald-400'
                          : 'bg-slate-800 text-slate-300'
                      }`}>
                        {sh.status}
                      </span>
                      <p className="font-bold text-emerald-400 font-mono mt-0.5">
                        KES {sh.totalSalesAmount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCTS & PRICES (Manager Only CRUD) */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search products by name or category..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="w-full rounded-xl bg-slate-950 pl-10 pr-4 py-2.5 text-xs text-white border border-slate-800 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <button
              onClick={() => setShowAddProductModal(true)}
              className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-4 py-2.5 text-xs font-bold text-white shadow"
            >
              <Plus className="h-4 w-4" />
              Add New Product
            </button>
          </div>

          {/* Products Table */}
          <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-850 uppercase text-[11px] font-bold text-slate-400 tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="px-5 py-3.5">Product Name</th>
                    <th className="px-4 py-3.5">Category</th>
                    <th className="px-3 py-3.5 text-center">Unit</th>
                    <th className="px-4 py-3.5 text-right">Cost (KES)</th>
                    <th className="px-4 py-3.5 text-right font-bold text-emerald-400">Selling (KES)</th>
                    <th className="px-3 py-3.5 text-center">Opening</th>
                    <th className="px-4 py-3.5 text-right font-bold text-white">Current Stock</th>
                    <th className="px-3 py-3.5 text-center">Active</th>
                    <th className="px-4 py-3.5 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {products
                    .filter(
                      (p) =>
                        p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
                        p.category.toLowerCase().includes(productSearch.toLowerCase())
                    )
                    .map((product) => (
                      <tr key={product.id} className="hover:bg-slate-900/40 transition-colors">
                        <td className="px-5 py-3.5 font-semibold text-white">{product.name}</td>
                        <td className="px-4 py-3.5 text-slate-400">{product.category}</td>
                        <td className="px-3 py-3.5 text-center font-mono text-slate-400">{product.unit}</td>
                        <td className="px-4 py-3.5 text-right font-mono text-slate-400">
                          {product.costPrice ? product.costPrice.toLocaleString() : '—'}
                        </td>
                        <td className="px-4 py-3.5 text-right font-mono font-bold text-emerald-400">
                          {product.sellingPrice.toLocaleString()}
                        </td>
                        <td className="px-3 py-3.5 text-center font-mono text-slate-400">
                          {product.openingQuantity}
                        </td>
                        <td className="px-4 py-3.5 text-right font-mono font-bold text-white">
                          {product.currentStock}
                        </td>
                        <td className="px-3 py-3.5 text-center">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                              product.isActive ? 'bg-emerald-500/15 text-emerald-400' : 'bg-slate-800 text-slate-500'
                            }`}
                          >
                            {product.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          <button
                            onClick={() => setEditingProduct({ ...product })}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: RESTOCK & STOCK MOVEMENTS */}
      {activeTab === 'restock' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-white">Stock Movements & Deliveries</h3>
              <p className="text-xs text-slate-400">Complete audit log of every unit added or removed.</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowReceiveStockModal(true)}
                className="rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 py-2 text-xs font-bold text-white shadow"
              >
                + Receive Delivery
              </button>
              <button
                onClick={() => setShowAdjustStockModal(true)}
                className="rounded-xl bg-amber-600 hover:bg-amber-500 px-4 py-2 text-xs font-bold text-white shadow"
              >
                Record Damaged / Spoiled
              </button>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-850 uppercase text-[11px] font-bold text-slate-400 tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="px-5 py-3.5">Date & Time</th>
                    <th className="px-4 py-3.5">Product</th>
                    <th className="px-3 py-3.5 text-center">Movement Type</th>
                    <th className="px-4 py-3.5 text-right font-bold">Qty Change</th>
                    <th className="px-4 py-3.5 text-center">Reference</th>
                    <th className="px-4 py-3.5">Reason / Note</th>
                    <th className="px-4 py-3.5">Logged By</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {movements.slice(0, 100).map((mov) => (
                    <tr key={mov.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="px-5 py-3.5 font-mono text-slate-400">
                        {new Date(mov.createdAt).toLocaleString('en-KE', { dateStyle: 'short', timeStyle: 'short' })}
                      </td>
                      <td className="px-4 py-3.5 font-semibold text-white">{mov.productName}</td>
                      <td className="px-3 py-3.5 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                          mov.movementType === 'STOCK_RECEIVED'
                            ? 'bg-emerald-500/15 text-emerald-400'
                            : mov.movementType === 'SALE'
                            ? 'bg-indigo-500/15 text-indigo-300'
                            : mov.movementType === 'OPENING'
                            ? 'bg-blue-500/15 text-blue-300'
                            : 'bg-rose-500/15 text-rose-400'
                        }`}>
                          {mov.movementType}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right font-mono font-bold text-sm">
                        {mov.quantity > 0 ? (
                          <span className="text-emerald-400">+{mov.quantity}</span>
                        ) : (
                          <span className="text-rose-400">{mov.quantity}</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-center font-mono text-slate-400">{mov.reference}</td>
                      <td className="px-4 py-3.5 text-slate-300 truncate max-w-xs">{mov.reason || '—'}</td>
                      <td className="px-4 py-3.5 text-slate-400">{mov.userName}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SALES & GROSS PROFIT REPORT */}
      {activeTab === 'sales_report' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Date Period:</span>
              {(['today', 'yesterday', 'week', 'month', 'all'] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setReportDateRange(period)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                    reportDateRange === period
                      ? 'bg-emerald-600 text-white shadow'
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cashier:</span>
              <select
                value={reportCashierFilter}
                onChange={(e) => setReportCashierFilter(e.target.value)}
                className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs text-white border border-slate-800 focus:outline-none"
              >
                {cashiersList.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* KPI Summary */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl bg-slate-950 border border-slate-800 p-5">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Sales Revenue</p>
              <p className="text-2xl font-bold text-emerald-400 font-mono mt-1">
                KES {totalReportSales.toLocaleString()}
              </p>
              <span className="text-[11px] text-slate-500">{filteredSalesForReport.length} sales receipts</span>
            </div>

            <div className="rounded-2xl bg-slate-950 border border-slate-800 p-5">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Cost of Goods (COGS)</p>
              <p className="text-2xl font-bold text-slate-300 font-mono mt-1">
                KES {totalReportCOGS.toLocaleString()}
              </p>
              <span className="text-[11px] text-slate-500">Buying / cost price total</span>
            </div>

            <div className="rounded-2xl bg-slate-950 border border-slate-800 p-5">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Gross Profit</p>
              <p className="text-2xl font-bold text-indigo-400 font-mono mt-1">
                KES {grossProfit.toLocaleString()}
              </p>
              <span className="text-[11px] text-emerald-400 font-bold">Margin: {profitMarginPercent}%</span>
            </div>

            <div className="rounded-2xl bg-slate-950 border border-slate-800 p-5">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Units Sold</p>
              <p className="text-2xl font-bold text-white font-mono mt-1">
                {totalReportUnits} units
              </p>
              <span className="text-[11px] text-slate-500">Dispatched from stock</span>
            </div>
          </div>

          {/* Sales Receipts Table */}
          <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-850 uppercase text-[11px] font-bold text-slate-400 tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="px-5 py-3.5">Time</th>
                    <th className="px-4 py-3.5">Receipt #</th>
                    <th className="px-4 py-3.5">Cashier</th>
                    <th className="px-4 py-3.5">Items Sold</th>
                    <th className="px-3 py-3.5 text-center">Payment</th>
                    <th className="px-5 py-3.5 text-right font-bold text-emerald-400">Total (KES)</th>
                    <th className="px-4 py-3.5 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredSalesForReport.map((sale) => (
                    <tr key={sale.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="px-5 py-3.5 font-mono text-slate-400">
                        {new Date(sale.createdAt).toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="px-4 py-3.5 font-mono font-bold text-white">{sale.saleNumber}</td>
                      <td className="px-4 py-3.5 text-slate-300">{sale.cashierName}</td>
                      <td className="px-4 py-3.5 max-w-xs truncate text-slate-400">
                        {sale.items.map((i) => `${i.productName} (${i.quantity})`).join(', ')}
                      </td>
                      <td className="px-3 py-3.5 text-center">
                        <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-mono text-slate-300">
                          {sale.paymentMethod}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right font-mono font-bold text-emerald-400 text-sm">
                        KES {sale.totalAmount.toLocaleString()}
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setSelectedSaleForReceipt(sale)}
                            className="rounded bg-slate-800 hover:bg-slate-700 px-2.5 py-1 text-[11px] text-slate-200"
                          >
                            Receipt
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: STOCK & VARIANCE REPORT */}
      {activeTab === 'stock_variance' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-white">Stock Variance & Discrepancy Tracking</h3>
              <p className="text-xs text-slate-400">
                Audited differences between expected calculated stock and physical counts submitted by cashiers.
              </p>
            </div>
          </div>

          {/* Discrepancy History Table */}
          <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-850 uppercase text-[11px] font-bold text-slate-400 tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="px-5 py-3.5">Date</th>
                    <th className="px-4 py-3.5">Cashier</th>
                    <th className="px-4 py-3.5">Shift ID</th>
                    <th className="px-4 py-3.5 text-center">Items Counted</th>
                    <th className="px-4 py-3.5 text-center font-bold text-rose-400">Discrepancy Units</th>
                    <th className="px-4 py-3.5 text-right font-bold text-amber-400">Discrepancy Value</th>
                    <th className="px-4 py-3.5 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {stockCounts.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-10 text-slate-500">
                        No shift physical stock counts submitted yet.
                      </td>
                    </tr>
                  ) : (
                    stockCounts.map((count) => (
                      <tr key={count.id} className="hover:bg-slate-900/40 transition-colors">
                        <td className="px-5 py-3.5 font-mono text-slate-400">{count.date}</td>
                        <td className="px-4 py-3.5 font-semibold text-white">{count.cashierName}</td>
                        <td className="px-4 py-3.5 font-mono text-slate-400">#{count.shiftId.slice(-6)}</td>
                        <td className="px-4 py-3.5 text-center font-mono">{count.items.length} products</td>
                        <td className="px-4 py-3.5 text-center font-mono font-bold text-rose-400">
                          {count.totalDiscrepancyUnits}
                        </td>
                        <td className="px-4 py-3.5 text-right font-mono font-bold text-amber-400">
                          KES {count.totalDiscrepancyValue.toLocaleString()}
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400">
                            {count.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: CASHIER SHIFTS OVERSIGHT */}
      {activeTab === 'shifts' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-white">All Cashier Shifts</h3>
              <p className="text-xs text-slate-400">Supervise active, submitted, and locked shifts.</p>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-850 uppercase text-[11px] font-bold text-slate-400 tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="px-5 py-3.5">Shift ID</th>
                    <th className="px-4 py-3.5">Cashier</th>
                    <th className="px-4 py-3.5">Date & Time</th>
                    <th className="px-3 py-3.5 text-center">Sales</th>
                    <th className="px-4 py-3.5 text-right font-bold text-emerald-400">Revenue (KES)</th>
                    <th className="px-3 py-3.5 text-center">Status</th>
                    <th className="px-4 py-3.5 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {shifts.map((sh) => (
                    <tr key={sh.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="px-5 py-3.5 font-mono font-bold text-white">#{sh.id.slice(-6)}</td>
                      <td className="px-4 py-3.5 font-semibold text-slate-200">{sh.cashierName}</td>
                      <td className="px-4 py-3.5 font-mono text-slate-400">
                        {sh.date} {sh.startTime.slice(11, 16)}
                      </td>
                      <td className="px-3 py-3.5 text-center font-mono">{sh.totalTransactions}</td>
                      <td className="px-4 py-3.5 text-right font-mono font-bold text-emerald-400">
                        KES {sh.totalSalesAmount.toLocaleString()}
                      </td>
                      <td className="px-3 py-3.5 text-center">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                          sh.status === 'OPEN'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : 'bg-slate-800 text-slate-400'
                        }`}>
                          {sh.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {sh.status === 'LOCKED' && (
                            <button
                              onClick={() => {
                                setReopenModalShift(sh);
                                setReopenReason('');
                              }}
                              className="inline-flex items-center gap-1 rounded bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-600/40 px-2.5 py-1 text-[10px] font-bold"
                            >
                              <Unlock className="h-3 w-3" />
                              Reopen
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: AUDIT TRAIL */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          <div>
            <h3 className="text-base font-bold text-white">System Security & Audit Trail</h3>
            <p className="text-xs text-slate-400">Tamper-proof event logs for sales, price edits, and inventory.</p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-850 uppercase text-[11px] font-bold text-slate-400 tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="px-5 py-3.5">Timestamp</th>
                    <th className="px-4 py-3.5">User</th>
                    <th className="px-4 py-3.5 text-center">Action</th>
                    <th className="px-5 py-3.5">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {auditLogs.slice(0, 100).map((log) => (
                    <tr key={log.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="px-5 py-3.5 font-mono text-slate-400">
                        {new Date(log.timestamp).toLocaleString('en-KE', { dateStyle: 'short', timeStyle: 'short' })}
                      </td>
                      <td className="px-4 py-3.5 font-semibold text-white">
                        {log.userName}{' '}
                        <span className="text-[10px] text-slate-500 font-normal">({log.userRole})</span>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-mono text-slate-300">
                          {log.action}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-slate-300">{log.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD PRODUCT */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">Add New Product</h3>
            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Product Name (e.g. Tusker Lager 500ml)</label>
                <input
                  type="text"
                  required
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 px-3 py-2 text-white border border-slate-800 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Category</label>
                  <select
                    value={newProdCat}
                    onChange={(e) => setNewProdCat(e.target.value)}
                    className="w-full rounded-xl bg-slate-950 px-3 py-2 text-white border border-slate-800"
                  >
                    <option value="Beers">Beers</option>
                    <option value="Ciders">Ciders</option>
                    <option value="Spirits">Spirits</option>
                    <option value="Whisky">Whisky</option>
                    <option value="Vodka">Vodka</option>
                    <option value="Soft Drinks">Soft Drinks</option>
                    <option value="Water">Water</option>
                    <option value="Food">Food</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Unit</label>
                  <input
                    type="text"
                    value={newProdUnit}
                    onChange={(e) => setNewProdUnit(e.target.value)}
                    className="w-full rounded-xl bg-slate-950 px-3 py-2 text-white border border-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Selling Price (KES)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={newProdSellPrice}
                    onChange={(e) => setNewProdSellPrice(Number(e.target.value))}
                    className="w-full rounded-xl bg-slate-950 px-3 py-2 font-mono text-white border border-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Buying Cost (KES)</label>
                  <input
                    type="number"
                    min="0"
                    value={newProdCostPrice}
                    onChange={(e) => setNewProdCostPrice(Number(e.target.value))}
                    className="w-full rounded-xl bg-slate-950 px-3 py-2 font-mono text-white border border-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Opening Stock</label>
                  <input
                    type="number"
                    min="0"
                    value={newProdOpening}
                    onChange={(e) => setNewProdOpening(Number(e.target.value))}
                    className="w-full rounded-xl bg-slate-950 px-3 py-2 font-mono text-white border border-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Min Stock Alert</label>
                  <input
                    type="number"
                    min="1"
                    value={newProdMinAlert}
                    onChange={(e) => setNewProdMinAlert(Number(e.target.value))}
                    className="w-full rounded-xl bg-slate-950 px-3 py-2 font-mono text-white border border-slate-800"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="allowNeg"
                  checked={newProdAllowNegative}
                  onChange={(e) => setNewProdAllowNegative(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-800"
                />
                <label htmlFor="allowNeg" className="text-slate-400">
                  Allow negative stock for this product
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="rounded-xl px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="rounded-xl bg-emerald-600 hover:bg-emerald-500 px-5 py-2 font-bold text-white shadow"
                >
                  {isProcessing ? 'Saving...' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT PRODUCT */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">Edit Product Configuration</h3>
            <form onSubmit={handleSaveEditProduct} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full rounded-xl bg-slate-950 px-3 py-2 text-white border border-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Category</label>
                  <input
                    type="text"
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    className="w-full rounded-xl bg-slate-950 px-3 py-2 text-white border border-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Unit</label>
                  <input
                    type="text"
                    value={editingProduct.unit}
                    onChange={(e) => setEditingProduct({ ...editingProduct, unit: e.target.value })}
                    className="w-full rounded-xl bg-slate-950 px-3 py-2 text-white border border-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Selling Price (KES)</label>
                  <input
                    type="number"
                    min="1"
                    value={editingProduct.sellingPrice}
                    onChange={(e) => setEditingProduct({ ...editingProduct, sellingPrice: Number(e.target.value) })}
                    className="w-full rounded-xl bg-slate-950 px-3 py-2 font-mono text-emerald-400 font-bold border border-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Cost Price (KES)</label>
                  <input
                    type="number"
                    min="0"
                    value={editingProduct.costPrice || 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, costPrice: Number(e.target.value) })}
                    className="w-full rounded-xl bg-slate-950 px-3 py-2 font-mono text-white border border-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Opening Stock</label>
                  <input
                    type="number"
                    value={editingProduct.openingQuantity}
                    onChange={(e) => setEditingProduct({ ...editingProduct, openingQuantity: Number(e.target.value) })}
                    className="w-full rounded-xl bg-slate-950 px-3 py-2 font-mono text-white border border-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Min Stock Alert</label>
                  <input
                    type="number"
                    value={editingProduct.minStockAlert}
                    onChange={(e) => setEditingProduct({ ...editingProduct, minStockAlert: Number(e.target.value) })}
                    className="w-full rounded-xl bg-slate-950 px-3 py-2 font-mono text-white border border-slate-800"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 text-slate-300">
                  <input
                    type="checkbox"
                    checked={editingProduct.isActive}
                    onChange={(e) => setEditingProduct({ ...editingProduct, isActive: e.target.checked })}
                  />
                  Active in POS
                </label>
                <label className="flex items-center gap-2 text-slate-300">
                  <input
                    type="checkbox"
                    checked={editingProduct.allowNegativeStock || false}
                    onChange={(e) => setEditingProduct({ ...editingProduct, allowNegativeStock: e.target.checked })}
                  />
                  Allow Negative Stock
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="rounded-xl px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="rounded-xl bg-emerald-600 hover:bg-emerald-500 px-5 py-2 font-bold text-white shadow"
                >
                  {isProcessing ? 'Saving...' : 'Save Updates'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: RECEIVE STOCK DELIVERY */}
      {showReceiveStockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">Receive Stock Delivery (Restock)</h3>
            <form onSubmit={handleReceiveStockSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Select Product</label>
                <select
                  required
                  value={rcvProductId}
                  onChange={(e) => setRcvProductId(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 px-3 py-2 text-white border border-slate-800"
                >
                  <option value="">-- Choose Product to Restock --</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (Current Stock: {p.currentStock} {p.unit})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Quantity Received</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={rcvQuantity}
                  onChange={(e) => setRcvQuantity(Number(e.target.value))}
                  className="w-full rounded-xl bg-slate-950 px-3 py-2 font-mono text-base font-bold text-white border border-slate-800"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Supplier / Distributor</label>
                <input
                  type="text"
                  value={rcvSupplier}
                  onChange={(e) => setRcvSupplier(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 px-3 py-2 text-white border border-slate-800"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Invoice / Delivery Note Reference</label>
                <input
                  type="text"
                  value={rcvRef}
                  onChange={(e) => setRcvRef(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 px-3 py-2 font-mono text-white border border-slate-800"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowReceiveStockModal(false)}
                  className="rounded-xl px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="rounded-xl bg-indigo-600 hover:bg-indigo-500 px-5 py-2 font-bold text-white shadow"
                >
                  {isProcessing ? 'Recording...' : 'Record Received Stock'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: STOCK ADJUSTMENT / DAMAGED */}
      {showAdjustStockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">Record Damaged / Spoiled / Stock Adjustment</h3>
            <form onSubmit={handleAdjustStockSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Product</label>
                <select
                  required
                  value={adjProductId}
                  onChange={(e) => setAdjProductId(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 px-3 py-2 text-white border border-slate-800"
                >
                  <option value="">-- Choose Product --</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (Current: {p.currentStock})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Adjustment Type</label>
                <select
                  value={adjType}
                  onChange={(e) => setAdjType(e.target.value as any)}
                  className="w-full rounded-xl bg-slate-950 px-3 py-2 text-white border border-slate-800"
                >
                  <option value="DAMAGED">Damaged (e.g. Broken bottle)</option>
                  <option value="SPOILED">Spoiled / Expired</option>
                  <option value="ADJUSTMENT">Stock Reconciliation Correction</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Quantity Delta (Negative for loss, e.g. -2)</label>
                <input
                  type="number"
                  step="1"
                  required
                  value={adjQuantity}
                  onChange={(e) => setAdjQuantity(Number(e.target.value))}
                  className="w-full rounded-xl bg-slate-950 px-3 py-2 font-mono font-bold text-white border border-slate-800"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Mandatory Manager Reason</label>
                <input
                  type="text"
                  required
                  placeholder="Explain why stock is adjusted..."
                  value={adjReason}
                  onChange={(e) => setAdjReason(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 px-3 py-2 text-white border border-slate-800"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAdjustStockModal(false)}
                  className="rounded-xl px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="rounded-xl bg-amber-600 hover:bg-amber-500 px-5 py-2 font-bold text-white shadow"
                >
                  {isProcessing ? 'Saving...' : 'Authorize Adjustment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: REOPEN SHIFT */}
      {reopenModalShift && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">Reopen Locked Shift</h3>
            <p className="text-xs text-slate-400">
              Shift #{reopenModalShift.id.slice(-6)} by {reopenModalShift.cashierName} will be returned to OPEN state so the cashier can fix counts or continue selling.
            </p>
            <div>
              <label className="block text-slate-400 text-xs mb-1">Reason for Reopening (Required for Audit)</label>
              <input
                type="text"
                required
                placeholder="e.g. Cashier miscounted Tusker crate"
                value={reopenReason}
                onChange={(e) => setReopenReason(e.target.value)}
                className="w-full rounded-xl bg-slate-950 px-3 py-2 text-xs text-white border border-slate-800"
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setReopenModalShift(null)}
                className="rounded-xl px-4 py-2 text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!reopenReason.trim() || isProcessing}
                onClick={handleReopenShiftSubmit}
                className="rounded-xl bg-amber-600 hover:bg-amber-500 px-5 py-2 font-bold text-white shadow"
              >
                Confirm Reopen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: RECEIPT REPRINT */}
      {selectedSaleForReceipt && (
        <PosReceiptModal
          sale={selectedSaleForReceipt}
          tenant={tenant}
          onClose={() => setSelectedSaleForReceipt(null)}
        />
      )}
    </div>
  );
};
