import React from 'react';
import {
  Briefcase,
  CheckCircle2,
  ArrowRight,
  Calculator,
  FileText,
  Users2,
  PieChart,
  ShieldCheck,
  TrendingUp,
  Banknote
} from 'lucide-react';

interface BusinessPageProps {
  onNavigate: (route: string) => void;
}

export const BusinessPage: React.FC<BusinessPageProps> = ({
  onNavigate
}) => {
  return (
    <div className="text-slate-200">
      {/* Hero */}
      <section className="relative py-24 border-b border-slate-800 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.15),transparent_50%)]" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-6">
              <Briefcase className="w-3.5 h-3.5" />
              <span>DAVETECH BUSINESS & ACCOUNTING ERP</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
              Enterprise Financial Accounting, Payroll & Operations
            </h1>
            <p className="mt-6 text-lg text-slate-400 leading-relaxed font-light">
              End-to-end corporate enterprise resource planning. Automate double-entry general ledgers, customer billing, supplier payables, and statutory Kenyan payroll (PAYE, NSSF, SHIF, Housing Levy) on one cloud platform.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <button
                onClick={() => onNavigate('contact')}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
              >
                Get Started with Business ERP <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onNavigate('solutions')}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-sm font-semibold transition-all cursor-pointer"
              >
                Explore Product Suite
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-20 bg-slate-950 border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-white">Full Financial Clarity for Executive Decisions</h2>
            <p className="text-slate-400 mt-3 text-sm">
              Consolidate bookkeeping, employee remuneration, and statutory tax obligations with automated audit trails.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Calculator className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Double-Entry Accounting</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Standard Chart of Accounts with automated journals, trial balances, balance sheets, and profit & loss statements. Multi-currency support and real-time bank reconciliation.
              </p>
              <ul className="space-y-2 pt-2 border-t border-slate-800/80 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Customizable Chart of Accounts</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Instant P&L and Balance Sheet reports</span>
                </li>
              </ul>
            </div>

            <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Banknote className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Automated Statutory Payroll</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Complete employee compensation engine with automatic calculation of PAYE, NSSF Tier I/II, SHIF, Housing Levy, employee loans, and downloadable bank payment files.
              </p>
              <ul className="space-y-2 pt-2 border-t border-slate-800/80 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Kenyan statutory deductions compliance</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Automated PDF pay slip email delivery</span>
                </li>
              </ul>
            </div>

            <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Invoicing & Payables</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Create beautiful brand-aligned quotations and invoices. Manage vendor purchase orders, recurring bills, and track receivables with automated payment reminders.
              </p>
              <ul className="space-y-2 pt-2 border-t border-slate-800/80 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Quotations, Invoices & Delivery Notes</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Aged debtor and creditor tracking</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Executive Overview */}
      <section className="py-20 bg-slate-900/40 border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3 max-w-xl">
              <h3 className="text-2xl font-bold text-white">Scale Your Business with Enterprise Reliability</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Davetech Business ERP provides granular permission controls, preventing unauthorized ledger adjustments and enforcing dual-signoff on supplier expenditures.
              </p>
            </div>
            <button
              onClick={() => onNavigate('contact')}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all cursor-pointer whitespace-nowrap"
            >
              Request Corporate Proposal
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
