import React from 'react';
import {
  ShoppingBag,
  CheckCircle2,
  ArrowRight,
  Barcode,
  Receipt,
  RefreshCw,
  Boxes,
  Smartphone,
  ShieldCheck,
  TrendingUp,
  Cpu
} from 'lucide-react';

interface RetailPosPageProps {
  onNavigate: (route: string) => void;
}

export const RetailPosPage: React.FC<RetailPosPageProps> = ({
  onNavigate
}) => {
  return (
    <div className="text-slate-200">
      {/* Hero */}
      <section className="relative py-24 border-b border-slate-800 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.15),transparent_50%)]" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-6">
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>DAVETECH RETAIL & POINT OF SALE</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
              High-Speed Point of Sale & Cloud Inventory Management
            </h1>
            <p className="mt-6 text-lg text-slate-400 leading-relaxed font-light">
              Built for retail shops, supermarkets, bars, lounges, pharmacies, and wholesale distributors. Process sales in sub-seconds with barcode scanners, automatic M-Pesa STK push, shift cash drawer audits, and centralized multi-branch stock control.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <button
                onClick={() => onNavigate('contact')}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-extrabold shadow-lg shadow-amber-500/30 transition-all cursor-pointer"
              >
                Get Started with Retail POS <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onNavigate('solutions')}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-sm font-semibold transition-all cursor-pointer"
              >
                Explore Other Modules
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Core POS Features */}
      <section className="py-20 bg-slate-950 border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-white">Built for High Concurrency & Zero Queue Bottlenecks</h2>
            <p className="text-slate-400 mt-3 text-sm">
              Keep customer checkout lines moving quickly during peak operational hours with keyboard shortcuts, instant barcode lookup, and split payments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Barcode className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Rapid Cashier Terminal</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Full-screen touch and keyboard cashier terminal. Search products by SKU or scan barcode instantly. Apply line discounts, held carts, and multiple pricing tiers with ease.
              </p>
              <ul className="space-y-2 pt-2 border-t border-slate-800/80 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Sub-second barcode scan & catalog search</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Held cart switching for multi-customer queues</span>
                </li>
              </ul>
            </div>

            <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Instant M-Pesa & Split Payments</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Trigger automated M-Pesa STK push directly to the customer’s phone. Support split payments across Cash, M-Pesa, Card, and Customer Credit with automated receipt generation.
              </p>
              <ul className="space-y-2 pt-2 border-t border-slate-800/80 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>STK push with real-time verification</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>ESC/POS thermal printer receipt formatting</span>
                </li>
              </ul>
            </div>

            <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Boxes className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Stock Control & Shift Audits</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Track opening float, cash drawer transactions, and shift closing variances. Automatic inventory decrement upon checkout with low-stock alerts and supplier purchase intake.
              </p>
              <ul className="space-y-2 pt-2 border-t border-slate-800/80 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Shift reconciliation & cash drawer variance checks</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Low-stock warnings & automated reorder lists</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Multi-Branch Architecture */}
      <section className="py-20 bg-slate-900/40 border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-12 rounded-3xl bg-slate-900 border border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="text-xs font-mono text-amber-400 uppercase tracking-wider font-bold">SCALE FROM 1 TO 50+ BRANCHES</span>
              <h3 className="text-2xl sm:text-3xl font-bold text-white">Central Warehouse & Inter-Branch Stock Transfers</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Manage stock across multiple physical retail branches or bar counters from a single cloud dashboard. Track inter-branch transit, eliminate stock shrinkage, and audit staff activities in real time.
              </p>
              <div className="space-y-2.5 pt-2">
                {[
                  'Role-based permissions for Cashiers, Head Bartenders, and Store Managers',
                  'Offline resilient caching for uninterrupted sales during internet drops',
                  'Expiry date tracking and FIFO batch management for perishables',
                  'Daily and weekly Z-Report generation with profit margin analysis',
                  'Customer loyalty points and promotional discount engine'
                ].map((item, i) => (
                  <div key={i} className="flex items-center space-x-2.5 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 text-center">
              <h4 className="text-base font-bold text-white">Equip Your Store with Davetech POS</h4>
              <p className="text-xs text-slate-400">
                Compatible with any modern laptop, desktop PC, all-in-one touchscreen terminal, and tablet.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => onNavigate('contact')}
                  className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/30 transition-all cursor-pointer"
                >
                  Contact POS Sales Team
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
