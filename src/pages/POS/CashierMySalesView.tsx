import React, { useState, useMemo } from 'react';
import { PosSale } from '../../types/pos';
import { AppUser, Tenant } from '../../types';
import { PosReceiptModal } from './PosReceiptModal';
import {
  Receipt,
  Search,
  Printer,
  Calendar,
  DollarSign,
  TrendingUp,
  ShoppingBag,
  CreditCard,
  Banknote,
  Smartphone
} from 'lucide-react';

interface CashierMySalesViewProps {
  tenant: Tenant;
  user: AppUser;
  sales: PosSale[];
}

export const CashierMySalesView: React.FC<CashierMySalesViewProps> = ({
  tenant,
  user,
  sales
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSaleForReceipt, setSelectedSaleForReceipt] = useState<PosSale | null>(null);

  // Filter sales for the current user/cashier
  const mySales = useMemo(() => {
    // Match by user uid or cashierId or cashierName
    return sales.filter((s) => s.cashierId === user.uid || s.cashierName === user.displayName);
  }, [sales, user]);

  const todayStr = new Date().toISOString().slice(0, 10);
  const myTodaySales = useMemo(() => {
    return mySales.filter((s) => s.createdAt.startsWith(todayStr));
  }, [mySales, todayStr]);

  const totalSoldAmount = myTodaySales.reduce((sum, s) => sum + s.totalAmount, 0);
  const totalTransactions = myTodaySales.length;
  const totalItemsSold = myTodaySales.reduce((sum, s) => sum + s.totalQuantity, 0);

  const cashSales = myTodaySales.filter((s) => s.paymentMethod === 'CASH').reduce((sum, s) => sum + s.totalAmount, 0);
  const mpesaSales = myTodaySales.filter((s) => s.paymentMethod === 'M-PESA').reduce((sum, s) => sum + s.totalAmount, 0);
  const cardSales = myTodaySales.filter((s) => s.paymentMethod === 'CARD').reduce((sum, s) => sum + s.totalAmount, 0);

  const filteredSales = useMemo(() => {
    return myTodaySales.filter((s) => {
      const matchSearch =
        s.saleNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.paymentMethod.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.items.some((i) => i.productName.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchSearch;
    });
  }, [myTodaySales, searchQuery]);

  return (
    <div className="p-4 md:p-6 space-y-6 bg-slate-900 min-h-[calc(100vh-80px)] text-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Receipt className="h-6 w-6 text-emerald-400" />
            My Sales (Today)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Verified sale records completed by {user.displayName || 'you'} during today&apos;s shift.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700/60 font-mono">
          <Calendar className="h-4 w-4 text-emerald-400" />
          <span>{new Date().toLocaleDateString('en-KE', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <div className="rounded-2xl bg-slate-800/80 border border-slate-700/80 p-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Sales</p>
          <p className="text-2xl font-bold text-emerald-400 font-mono mt-1">
            KES {totalSoldAmount.toLocaleString()}
          </p>
          <span className="text-[11px] text-slate-500">Collected today</span>
        </div>

        <div className="rounded-2xl bg-slate-800/80 border border-slate-700/80 p-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Transactions</p>
          <p className="text-2xl font-bold text-white font-mono mt-1">{totalTransactions}</p>
          <span className="text-[11px] text-slate-500">Receipts issued</span>
        </div>

        <div className="rounded-2xl bg-slate-800/80 border border-slate-700/80 p-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Items Sold</p>
          <p className="text-2xl font-bold text-indigo-400 font-mono mt-1">{totalItemsSold}</p>
          <span className="text-[11px] text-slate-500">Units dispatched</span>
        </div>

        <div className="rounded-2xl bg-slate-800/80 border border-slate-700/80 p-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">M-Pesa / Cash</p>
          <p className="text-sm font-bold text-slate-200 font-mono mt-1">
            M: KES {mpesaSales.toLocaleString()}
          </p>
          <p className="text-xs font-mono text-emerald-400">
            C: KES {cashSales.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search by receipt number, item name, or payment method..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-xl bg-slate-800/90 pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-400 border border-slate-700 focus:border-emerald-500 focus:outline-none"
        />
      </div>

      {/* Sales Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/70 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-850 uppercase text-[11px] font-bold text-slate-400 tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5">Time</th>
                <th className="px-4 py-3.5">Receipt #</th>
                <th className="px-4 py-3.5">Items Summary</th>
                <th className="px-4 py-3.5 text-center">Units</th>
                <th className="px-4 py-3.5 text-center">Payment</th>
                <th className="px-5 py-3.5 text-right font-bold text-white">Amount (KES)</th>
                <th className="px-4 py-3.5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredSales.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-500">
                    No sales recorded yet today.
                  </td>
                </tr>
              ) : (
                filteredSales.map((sale) => {
                  const saleTime = new Date(sale.createdAt).toLocaleTimeString('en-KE', {
                    hour: '2-digit',
                    minute: '2-digit'
                  });

                  return (
                    <tr key={sale.id} className="hover:bg-slate-900/50 transition-colors">
                      <td className="px-5 py-3.5 font-mono text-slate-400">{saleTime}</td>
                      <td className="px-4 py-3.5 font-bold font-mono text-white">{sale.saleNumber}</td>
                      <td className="px-4 py-3.5 max-w-xs truncate text-slate-300">
                        {sale.items.map((i) => `${i.productName} (${i.quantity})`).join(', ')}
                      </td>
                      <td className="px-4 py-3.5 text-center font-mono text-slate-300">{sale.totalQuantity}</td>
                      <td className="px-4 py-3.5 text-center">
                        <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold font-mono ${
                          sale.paymentMethod === 'M-PESA'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : sale.paymentMethod === 'CARD'
                            ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}>
                          {sale.paymentMethod}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right font-mono font-bold text-emerald-400 text-sm">
                        KES {sale.totalAmount.toLocaleString()}
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <button
                          onClick={() => setSelectedSaleForReceipt(sale)}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 px-3 py-1.5 text-[11px] font-semibold text-slate-200 transition-colors"
                        >
                          <Printer className="h-3.5 w-3.5 text-slate-400" />
                          Reprint
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Receipt Modal */}
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
