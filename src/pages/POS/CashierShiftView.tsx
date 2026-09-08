import React, { useState } from 'react';
import { PosShift } from '../../types/pos';
import { AppUser, Tenant } from '../../types';
import { startPosShift } from '../../services/PosFirestoreService';
import {
  Clock,
  Play,
  CheckCircle2,
  DollarSign,
  Receipt,
  ShoppingBag,
  Banknote,
  Smartphone,
  CreditCard,
  ArrowRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

interface CashierShiftViewProps {
  tenant: Tenant;
  user: AppUser;
  activeShift: PosShift | null;
  onNavigateToCloseShift: () => void;
  onNavigateToSell: () => void;
}

export const CashierShiftView: React.FC<CashierShiftViewProps> = ({
  tenant,
  user,
  activeShift,
  onNavigateToCloseShift,
  onNavigateToSell
}) => {
  const [openingFloat, setOpeningFloat] = useState<number>(2000);
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStartShift = async () => {
    setIsStarting(true);
    setError(null);
    try {
      await startPosShift(
        tenant.id,
        user.uid,
        user.displayName || user.email || 'Cashier',
        Number(openingFloat) || 0
      );
    } catch (err: any) {
      console.error('Failed to start shift:', err);
      setError(err.message || 'Could not start shift. Please try again.');
    } finally {
      setIsStarting(false);
    }
  };

  const formattedStartTime = activeShift?.startTime
    ? new Date(activeShift.startTime).toLocaleTimeString('en-KE', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    : '';

  const formattedStartDate = activeShift?.startTime
    ? new Date(activeShift.startTime).toLocaleDateString('en-KE', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      })
    : '';

  return (
    <div className="p-4 md:p-6 space-y-6 bg-slate-900 min-h-[calc(100vh-80px)] text-slate-100 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Clock className="h-6 w-6 text-emerald-400" />
          Cashier Shift Control
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Manage your active working shift, verify opening cash float, and track shift sales.
        </p>
      </div>

      {error && (
        <div className="rounded-xl bg-rose-500/15 border border-rose-500/40 p-4 flex items-center gap-3 text-rose-200">
          <AlertCircle className="h-5 w-5 text-rose-400 shrink-0" />
          <p className="text-xs font-semibold">{error}</p>
        </div>
      )}

      {!activeShift ? (
        /* NO SHIFT OPEN: START SHIFT FORM */
        <div className="rounded-3xl border border-slate-800 bg-slate-950 p-6 md:p-10 shadow-2xl text-center max-w-xl mx-auto space-y-6">
          <div className="h-16 w-16 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto ring-1 ring-emerald-500/20">
            <Play className="h-8 w-8 ml-0.5" />
          </div>

          <div className="space-y-1">
            <h3 className="text-xl font-bold text-white">Start New Cashier Shift</h3>
            <p className="text-xs text-slate-400">
              Shift will be registered under <span className="text-white font-semibold">{user.displayName || 'Cashier'}</span>.
            </p>
          </div>

          <div className="text-left space-y-2 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
              Opening Cash Drawer Float (KES)
            </label>
            <p className="text-[11px] text-slate-500">
              Enter the starting loose cash in your drawer for customer change.
            </p>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400 font-mono">
                KES
              </span>
              <input
                type="number"
                min="0"
                step="100"
                value={openingFloat}
                onChange={(e) => setOpeningFloat(Number(e.target.value))}
                className="w-full rounded-xl bg-slate-800/90 pl-14 pr-4 py-3 text-base font-bold text-white font-mono border border-slate-700 focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            onClick={handleStartShift}
            disabled={isStarting}
            className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base shadow-xl shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
          >
            {isStarting ? (
              'Opening Shift...'
            ) : (
              <>
                <Play className="h-5 w-5" />
                START SHIFT & BEGIN SELLING
              </>
            )}
          </button>
        </div>
      ) : (
        /* ACTIVE SHIFT SUMMARY */
        <div className="space-y-6">
          {/* Active Banner */}
          <div className="rounded-3xl border border-emerald-500/30 bg-emerald-950/20 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Active Shift Open
                </span>
                <span className="text-xs text-slate-400 font-mono">#{activeShift.id.slice(-6)}</span>
              </div>
              <h3 className="text-2xl font-bold text-white">
                Cashier: {activeShift.cashierName}
              </h3>
              <p className="text-xs text-slate-300">
                Started on <span className="font-semibold text-white">{formattedStartDate}</span> at{' '}
                <span className="font-semibold text-emerald-300">{formattedStartTime}</span>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <button
                onClick={onNavigateToSell}
                className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors shadow"
              >
                Go to Sell (POS)
              </button>
              <button
                onClick={onNavigateToCloseShift}
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-colors"
              >
                End Shift & Count Stock
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Shift Sales Totals */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl bg-slate-950 border border-slate-800 p-5">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Shift Revenue</p>
              <p className="text-2xl font-bold text-emerald-400 font-mono mt-1">
                KES {activeShift.totalSalesAmount.toLocaleString()}
              </p>
              <span className="text-[11px] text-slate-500">Collected during this shift</span>
            </div>

            <div className="rounded-2xl bg-slate-950 border border-slate-800 p-5">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Transactions</p>
              <p className="text-2xl font-bold text-white font-mono mt-1">
                {activeShift.totalTransactions}
              </p>
              <span className="text-[11px] text-slate-500">Completed sales</span>
            </div>

            <div className="rounded-2xl bg-slate-950 border border-slate-800 p-5">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Units Sold</p>
              <p className="text-2xl font-bold text-indigo-400 font-mono mt-1">
                {activeShift.totalItemsSold}
              </p>
              <span className="text-[11px] text-slate-500">Items dispatched</span>
            </div>

            <div className="rounded-2xl bg-slate-950 border border-slate-800 p-5">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Opening Float</p>
              <p className="text-2xl font-bold text-amber-400 font-mono mt-1">
                KES {activeShift.openingCashFloat.toLocaleString()}
              </p>
              <span className="text-[11px] text-slate-500">Cash drawer float</span>
            </div>
          </div>

          {/* Payment Breakdown Cards */}
          <div className="rounded-2xl bg-slate-950 border border-slate-800 p-6 space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300">
              Shift Payment Breakdown
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-900 border border-slate-800">
                <Banknote className="h-6 w-6 text-emerald-400 shrink-0" />
                <div>
                  <p className="text-xs text-slate-400">Cash Sales</p>
                  <p className="text-base font-bold font-mono text-white">
                    KES {(activeShift.paymentBreakdown?.cash || 0).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-900 border border-slate-800">
                <Smartphone className="h-6 w-6 text-emerald-400 shrink-0" />
                <div>
                  <p className="text-xs text-slate-400">M-Pesa Sales</p>
                  <p className="text-base font-bold font-mono text-emerald-400">
                    KES {(activeShift.paymentBreakdown?.mpesa || 0).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-900 border border-slate-800">
                <CreditCard className="h-6 w-6 text-indigo-400 shrink-0" />
                <div>
                  <p className="text-xs text-slate-400">Card & Other</p>
                  <p className="text-base font-bold font-mono text-indigo-300">
                    KES {((activeShift.paymentBreakdown?.card || 0) + (activeShift.paymentBreakdown?.other || 0)).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
