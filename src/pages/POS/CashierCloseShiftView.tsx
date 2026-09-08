import React, { useState, useMemo, useEffect } from 'react';
import {
  PosProduct,
  PosShift,
  PosSale,
  PosStockMovement,
  PosShiftStockItem
} from '../../types/pos';
import { AppUser, Tenant } from '../../types';
import { submitAndClosePosShift } from '../../services/PosFirestoreService';
import {
  ClipboardCheck,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Loader2,
  DollarSign,
  Info,
  Clock,
  ArrowLeft
} from 'lucide-react';

interface CashierCloseShiftViewProps {
  tenant: Tenant;
  user: AppUser;
  activeShift: PosShift | null;
  products: PosProduct[];
  sales: PosSale[];
  movements: PosStockMovement[];
  onShiftClosedSuccess: () => void;
  onNavigateToShift: () => void;
}

export const CashierCloseShiftView: React.FC<CashierCloseShiftViewProps> = ({
  tenant,
  user,
  activeShift,
  products,
  sales,
  movements,
  onShiftClosedSuccess,
  onNavigateToShift
}) => {
  // Physical count inputs stored by productId
  const [physicalCounts, setPhysicalCounts] = useState<Record<string, number>>({});
  const [notesByProduct, setNotesByProduct] = useState<Record<string, string>>({});
  const [closingNotes, setClosingNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter sales & movements that occurred during this shift
  const shiftStartTime = activeShift?.startTime || new Date().toISOString();

  // Pre-calculate per-product sales and additions during this shift
  const shiftMetricsByProduct = useMemo(() => {
    const soldMap: Record<string, number> = {};
    const addedMap: Record<string, number> = {};
    const removedMap: Record<string, number> = {};

    // 1. Sales during this shift
    sales.forEach((sale) => {
      const isShiftSale =
        (activeShift?.id && sale.shiftId === activeShift.id) ||
        (sale.cashierId === user.uid && sale.createdAt >= shiftStartTime);

      if (isShiftSale && sale.status !== 'VOIDED') {
        sale.items.forEach((item) => {
          soldMap[item.productId] = (soldMap[item.productId] || 0) + item.quantity;
        });
      }
    });

    // 2. Stock movements during this shift
    movements.forEach((mov) => {
      if (mov.createdAt >= shiftStartTime) {
        if (mov.movementType === 'STOCK_RECEIVED') {
          addedMap[mov.productId] = (addedMap[mov.productId] || 0) + mov.quantity;
        } else if (mov.movementType === 'DAMAGED' || mov.movementType === 'SPOILED' || mov.movementType === 'ADJUSTMENT') {
          removedMap[mov.productId] = (removedMap[mov.productId] || 0) + Math.abs(mov.quantity);
        }
      }
    });

    return { soldMap, addedMap, removedMap };
  }, [sales, movements, activeShift, user.uid, shiftStartTime]);

  // Compute calculated stock items for active products
  const computedItems: PosShiftStockItem[] = useMemo(() => {
    return products
      .filter((p) => p.isActive)
      .map((product) => {
        const sold = shiftMetricsByProduct.soldMap[product.id] || 0;
        const stockAdded = shiftMetricsByProduct.addedMap[product.id] || 0;
        const stockRemoved = shiftMetricsByProduct.removedMap[product.id] || 0;

        // Current opening baseline or what was at start
        const openingStock = product.openingQuantity;

        // Formula: Expected Stock = Opening Stock - Sold + Stock Added - Stock Removed
        // Or in a live store: product.currentStock reflects the system's expected count right now
        const expectedStock = product.currentStock;

        const physical = physicalCounts[product.id] !== undefined
          ? physicalCounts[product.id]
          : expectedStock; // Default initialized to current expected so cashier can adjust

        const difference = physical - expectedStock;
        const status: 'MATCHED' | 'DISCREPANCY' = difference === 0 ? 'MATCHED' : 'DISCREPANCY';

        return {
          productId: product.id,
          productName: product.name,
          category: product.category,
          unit: product.unit,
          sellingPrice: product.sellingPrice,
          costPrice: product.costPrice,
          openingStock,
          stockAdded,
          stockRemoved,
          sold,
          expectedStock,
          physicalStock: physical,
          difference,
          status,
          notes: notesByProduct[product.id] || ''
        };
      });
  }, [products, shiftMetricsByProduct, physicalCounts, notesByProduct]);

  // Initialize physical counts with current expected stock
  useEffect(() => {
    const initial: Record<string, number> = {};
    products.forEach((p) => {
      if (initial[p.id] === undefined) {
        initial[p.id] = p.currentStock;
      }
    });
    setPhysicalCounts((prev) => ({ ...initial, ...prev }));
  }, [products]);

  const handleCountChange = (productId: string, val: string) => {
    const num = parseInt(val, 10);
    setPhysicalCounts((prev) => ({
      ...prev,
      [productId]: isNaN(num) ? 0 : Math.max(0, num)
    }));
  };

  const handleNoteChange = (productId: string, note: string) => {
    setNotesByProduct((prev) => ({
      ...prev,
      [productId]: note
    }));
  };

  // Summary Metrics
  const totalExpectedUnits = computedItems.reduce((sum, i) => sum + i.expectedStock, 0);
  const totalPhysicalUnits = computedItems.reduce((sum, i) => sum + i.physicalStock, 0);
  const discrepancyItems = computedItems.filter((i) => i.difference !== 0);
  const totalDiscrepancyUnits = discrepancyItems.reduce((sum, i) => sum + Math.abs(i.difference), 0);
  const totalDiscrepancyValue = discrepancyItems.reduce(
    (sum, i) => sum + Math.abs(i.difference * i.sellingPrice),
    0
  );

  const handleSubmitCloseShift = async () => {
    if (!activeShift) {
      setError('No active shift to close.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await submitAndClosePosShift(
        tenant.id,
        activeShift.id,
        computedItems,
        closingNotes,
        user
      );
      onShiftClosedSuccess();
    } catch (err: any) {
      console.error('Failed to submit and close shift:', err);
      setError(err.message || 'Error finalizing shift. Please check network.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!activeShift) {
    return (
      <div className="p-6 md:p-12 text-center max-w-lg mx-auto text-slate-300">
        <Clock className="h-12 w-12 text-amber-400 mx-auto mb-3" />
        <h3 className="text-xl font-bold text-white">No Active Shift Found</h3>
        <p className="text-xs text-slate-400 mt-1 mb-6">
          You must have an open shift before you can submit a closing physical stock count.
        </p>
        <button
          onClick={onNavigateToShift}
          className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-xs text-white"
        >
          Go to Shift Controls
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6 bg-slate-900 min-h-[calc(100vh-80px)] text-slate-100 max-w-6xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <button
            onClick={onNavigateToShift}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors mb-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Shift Overview
          </button>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ClipboardCheck className="h-6 w-6 text-emerald-400" />
            Close Shift & Physical Stock Count
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Compare expected stock against your physical shelf count. Any discrepancies are automatically flagged.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 px-4 py-2 rounded-2xl border border-slate-800 text-xs">
          <span className="text-slate-400">Cashier:</span>
          <span className="font-bold text-white">{activeShift.cashierName}</span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-400">Shift:</span>
          <span className="font-mono text-emerald-400 font-bold">#{activeShift.id.slice(-6)}</span>
        </div>
      </div>

      {error && (
        <div className="rounded-xl bg-rose-500/15 border border-rose-500/40 p-4 flex items-center gap-3 text-rose-200">
          <AlertTriangle className="h-5 w-5 text-rose-400 shrink-0" />
          <p className="text-xs font-semibold">{error}</p>
        </div>
      )}

      {/* Formula & Rule Card */}
      <div className="rounded-2xl bg-slate-950/80 border border-slate-800 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
            <Info className="h-4 w-4" />
          </div>
          <div>
            <p className="font-bold text-slate-200">Audit Formula Enforced:</p>
            <p className="font-mono text-indigo-300 text-[11px] mt-0.5">
              Expected Stock = Opening - Sold + Stock Added - Stock Removed
            </p>
          </div>
        </div>
        <div className="text-slate-400 text-[11px] md:text-right">
          <p>Shortage: Physical &lt; Expected (Red)</p>
          <p>Surplus: Physical &gt; Expected (Amber)</p>
        </div>
      </div>

      {/* Discrepancy KPI Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <div className="rounded-2xl bg-slate-950 border border-slate-800 p-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Expected Stock</p>
          <p className="text-2xl font-bold text-white font-mono mt-1">{totalExpectedUnits}</p>
          <span className="text-[11px] text-slate-500">System units</span>
        </div>

        <div className="rounded-2xl bg-slate-950 border border-slate-800 p-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Physical Counted</p>
          <p className="text-2xl font-bold text-emerald-400 font-mono mt-1">{totalPhysicalUnits}</p>
          <span className="text-[11px] text-slate-500">Hand count total</span>
        </div>

        <div className={`rounded-2xl border p-4 ${
          discrepancyItems.length > 0 ? 'bg-rose-950/20 border-rose-500/40' : 'bg-slate-950 border-slate-800'
        }`}>
          <p className="text-xs font-semibold text-rose-400 uppercase tracking-wider">Discrepancies</p>
          <p className="text-2xl font-bold text-rose-400 font-mono mt-1">
            {discrepancyItems.length} items ({totalDiscrepancyUnits} units)
          </p>
          <span className="text-[11px] text-slate-500">Unbalanced products</span>
        </div>

        <div className={`rounded-2xl border p-4 ${
          totalDiscrepancyValue > 0 ? 'bg-amber-950/20 border-amber-500/40' : 'bg-slate-950 border-slate-800'
        }`}>
          <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Variance Value</p>
          <p className="text-2xl font-bold text-amber-400 font-mono mt-1">
            KES {totalDiscrepancyValue.toLocaleString()}
          </p>
          <span className="text-[11px] text-slate-500">Financial variance</span>
        </div>
      </div>

      {/* Stock Reconciliation Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-850 uppercase text-[11px] font-bold text-slate-400 tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5">Product & Unit</th>
                <th className="px-3 py-3.5 text-center">Opening</th>
                <th className="px-3 py-3.5 text-center">Added</th>
                <th className="px-3 py-3.5 text-center">Removed</th>
                <th className="px-3 py-3.5 text-center font-bold text-indigo-400">Sold</th>
                <th className="px-4 py-3.5 text-center font-bold text-white bg-slate-900/60">
                  Expected
                </th>
                <th className="px-5 py-3.5 text-center font-bold text-emerald-400 bg-slate-900/80">
                  Physical Count
                </th>
                <th className="px-4 py-3.5 text-center font-bold">Difference</th>
                <th className="px-4 py-3.5">Cashier Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {computedItems.map((item) => {
                const diff = item.difference;
                const isShortage = diff < 0;
                const isSurplus = diff > 0;
                const isBalanced = diff === 0;

                return (
                  <tr key={item.productId} className="hover:bg-slate-900/40 transition-colors">
                    {/* Product & Unit */}
                    <td className="px-5 py-3 font-semibold text-white">
                      <div>{item.productName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        KES {item.sellingPrice.toLocaleString()} • {item.unit}
                      </div>
                    </td>

                    {/* Opening */}
                    <td className="px-3 py-3 text-center font-mono text-slate-400">
                      {item.openingStock}
                    </td>

                    {/* Added */}
                    <td className="px-3 py-3 text-center font-mono text-emerald-400">
                      {item.stockAdded > 0 ? `+${item.stockAdded}` : '0'}
                    </td>

                    {/* Removed */}
                    <td className="px-3 py-3 text-center font-mono text-rose-400">
                      {item.stockRemoved > 0 ? `-${item.stockRemoved}` : '0'}
                    </td>

                    {/* Sold */}
                    <td className="px-3 py-3 text-center font-mono font-bold text-indigo-400">
                      {item.sold}
                    </td>

                    {/* Expected Stock */}
                    <td className="px-4 py-3 text-center font-mono font-bold text-sm text-white bg-slate-900/40">
                      {item.expectedStock}
                    </td>

                    {/* Physical Count Input */}
                    <td className="px-5 py-3 text-center bg-slate-900/60">
                      <div className="flex justify-center">
                        <input
                          type="number"
                          min="0"
                          value={item.physicalStock}
                          onChange={(e) => handleCountChange(item.productId, e.target.value)}
                          className={`w-20 rounded-xl px-2.5 py-1.5 text-center font-mono font-bold text-sm border focus:outline-none transition-all ${
                            isShortage
                              ? 'bg-rose-950/40 border-rose-500 text-rose-300'
                              : isSurplus
                              ? 'bg-amber-950/40 border-amber-500 text-amber-300'
                              : 'bg-slate-800 border-slate-700 text-white focus:border-emerald-500'
                          }`}
                        />
                      </div>
                    </td>

                    {/* Difference */}
                    <td className="px-4 py-3 text-center font-mono">
                      {isBalanced ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400 font-bold">
                          <CheckCircle2 className="h-4 w-4" />
                          0 (Match)
                        </span>
                      ) : isShortage ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/15 border border-rose-500/30 px-2 py-0.5 text-rose-400 font-bold">
                          {diff} (Short)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 text-amber-400 font-bold">
                          +{diff} (Extra)
                        </span>
                      )}
                    </td>

                    {/* Notes */}
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        placeholder={diff !== 0 ? 'Explain variance...' : 'Optional notes'}
                        value={notesByProduct[item.productId] || ''}
                        onChange={(e) => handleNoteChange(item.productId, e.target.value)}
                        className="w-full max-w-xs rounded-lg bg-slate-900 px-2 py-1 text-xs text-white placeholder-slate-500 border border-slate-800 focus:border-emerald-500 focus:outline-none"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Shift Closing Remarks & Lock Warning */}
      <div className="rounded-2xl bg-slate-950 border border-slate-800 p-6 space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
            General Shift Handover Remarks
          </label>
          <textarea
            rows={2}
            placeholder="Add any overall notes regarding cash, stock handling, or shift incidents..."
            value={closingNotes}
            onChange={(e) => setClosingNotes(e.target.value)}
            className="w-full rounded-xl bg-slate-900 p-3 text-xs text-white placeholder-slate-500 border border-slate-800 focus:border-emerald-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-800">
          <div className="flex items-center gap-2 text-xs text-amber-300/90">
            <Lock className="h-4 w-4 text-amber-400 shrink-0" />
            <span>
              Once submitted, this shift will be <strong className="text-white">LOCKED</strong>. You cannot alter past sales or stock counts.
            </span>
          </div>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleSubmitCloseShift}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 font-bold text-sm text-white shadow-xl shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:bg-slate-800 disabled:text-slate-500"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Submitting & Locking Shift...
              </>
            ) : (
              <>
                <Lock className="h-4 w-4" />
                SUBMIT & LOCK SHIFT
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
