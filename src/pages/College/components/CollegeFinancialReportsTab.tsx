import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import {
  FileSpreadsheet,
  Receipt,
  DollarSign,
  TrendingUp,
  Download,
  Printer,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const CollegeFinancialReportsTab: React.FC = () => {
  const { collegeInvoices, collegePayments, collegeStudents, tenant } = useAuth();

  const safeInvoices = collegeInvoices || [];
  const safePayments = collegePayments || [];

  const totalInvoiced = safeInvoices.reduce((acc, inv) => acc + inv.totalAmount, 0);
  const totalCollected = safePayments.reduce((acc, pay) => acc + pay.amount, 0);
  const totalOutstanding = Math.max(0, totalInvoiced - totalCollected);
  const collectionRate = totalInvoiced > 0 ? Math.round((totalCollected / totalInvoiced) * 100) : 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <FileSpreadsheet className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-900">Financial Reports & Revenue Statement</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Aggregated tuition revenues, cash collection statements, debtor aging, and payment channel breakdown.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center space-x-1.5"
        >
          <Printer className="w-4 h-4" />
          <span>Print Financial Statement</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
            <span>Gross Billings</span>
            <Receipt className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-xl font-bold text-slate-900">KES {totalInvoiced.toLocaleString()}</div>
          <div className="text-[11px] text-slate-400 mt-1">{safeInvoices.length} invoices generated</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
            <span>Realized Receipts</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-bold text-emerald-700">KES {totalCollected.toLocaleString()}</div>
          <div className="text-[11px] text-slate-400 mt-1">{safePayments.length} successful transactions</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
            <span>Receivables / Arrears</span>
            <AlertCircle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-xl font-bold text-amber-600">KES {totalOutstanding.toLocaleString()}</div>
          <div className="text-[11px] text-slate-400 mt-1">Pending fee balances</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
            <span>Recovery Ratio</span>
            <TrendingUp className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-xl font-bold text-purple-700">{collectionRate}%</div>
          <div className="text-[11px] text-slate-400 mt-1">Fiscal collection efficiency</div>
        </div>
      </div>

      {/* Payment Channel Breakdown */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-900">Collections by Payment Channel</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['MPESA', 'BANK', 'CASH'].map((method) => {
            const methodTotal = safePayments
              .filter(p => p.paymentMethod === method)
              .reduce((acc, p) => acc + p.amount, 0);
            const count = safePayments.filter(p => p.paymentMethod === method).length;

            return (
              <div key={method} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 text-xs font-mono">{method === 'MPESA' ? 'M-PESA PAYBILL' : method === 'BANK' ? 'BANK WIRE / EFT' : 'CASHIER DESK'}</span>
                  <span className="text-xs text-slate-400">{count} Transactions</span>
                </div>
                <div className="text-lg font-bold text-slate-900 mt-2">KES {methodTotal.toLocaleString()}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
