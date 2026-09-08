import React, { useState, useMemo } from 'react';
import { PosProduct } from '../../types/pos';
import { Search, AlertTriangle, CheckCircle, Package, Layers, ShieldCheck } from 'lucide-react';

interface CashierStockViewProps {
  products: PosProduct[];
}

export const CashierStockView: React.FC<CashierStockViewProps> = ({ products }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ['ALL', ...Array.from(set).sort()];
  }, [products]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat = selectedCategory === 'ALL' || p.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [products, searchQuery, selectedCategory]);

  const inStockCount = products.filter((p) => p.currentStock > p.minStockAlert).length;
  const lowStockCount = products.filter((p) => p.currentStock > 0 && p.currentStock <= p.minStockAlert).length;
  const outOfStockCount = products.filter((p) => p.currentStock <= 0).length;

  return (
    <div className="p-4 md:p-6 space-y-6 bg-slate-900 min-h-[calc(100vh-80px)] text-slate-100">
      {/* Header with Security Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Package className="h-6 w-6 text-emerald-400" />
            Station Stock Availability
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time live available quantities at this cashier station. Read-only view.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700/80 px-3 py-1.5 rounded-xl text-xs text-emerald-300">
          <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>Tamper-Proof Stock Protected</span>
        </div>
      </div>

      {/* Stock Health Badges */}
      <div className="grid grid-cols-3 gap-3 md:gap-4">
        <div className="rounded-2xl bg-slate-800/80 border border-slate-700/80 p-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">In Stock</p>
          <p className="text-2xl font-bold text-emerald-400 font-mono mt-1">{inStockCount}</p>
          <span className="text-[11px] text-slate-500">Normal healthy levels</span>
        </div>

        <div className="rounded-2xl bg-slate-800/80 border border-slate-700/80 p-4">
          <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Low Stock</p>
          <p className="text-2xl font-bold text-amber-400 font-mono mt-1">{lowStockCount}</p>
          <span className="text-[11px] text-amber-500/80">Reorder threshold</span>
        </div>

        <div className="rounded-2xl bg-slate-800/80 border border-slate-700/80 p-4">
          <p className="text-xs font-semibold text-rose-400 uppercase tracking-wider">Depleted</p>
          <p className="text-2xl font-bold text-rose-400 font-mono mt-1">{outOfStockCount}</p>
          <span className="text-[11px] text-rose-500/80">Zero available</span>
        </div>
      </div>

      {/* Search & Category Filter */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Filter product by name, brand, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl bg-slate-800/90 pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-400 border border-slate-700 focus:border-emerald-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow ring-1 ring-emerald-400'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Stock Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/70 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-850 uppercase text-[11px] font-bold text-slate-400 tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5">Product</th>
                <th className="px-4 py-3.5">Category</th>
                <th className="px-4 py-3.5">Unit</th>
                <th className="px-4 py-3.5 text-right">Selling Price</th>
                <th className="px-4 py-3.5 text-center">Baseline Opening</th>
                <th className="px-5 py-3.5 text-right font-bold text-white">Current Stock</th>
                <th className="px-4 py-3.5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-500">
                    No products matching your search query.
                  </td>
                </tr>
              ) : (
                filtered.map((product) => {
                  const isOutOfStock = product.currentStock <= 0;
                  const isLowStock = product.currentStock > 0 && product.currentStock <= product.minStockAlert;

                  return (
                    <tr key={product.id} className="hover:bg-slate-900/50 transition-colors">
                      <td className="px-5 py-3.5 font-semibold text-white">
                        {product.name}
                      </td>
                      <td className="px-4 py-3.5 text-slate-400">{product.category}</td>
                      <td className="px-4 py-3.5">
                        <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-mono text-slate-300">
                          {product.unit}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right font-bold font-mono text-emerald-400">
                        KES {product.sellingPrice.toLocaleString()}
                      </td>
                      <td className="px-4 py-3.5 text-center font-mono text-slate-400">
                        {product.openingQuantity}
                      </td>
                      <td className="px-5 py-3.5 text-right font-mono font-bold text-sm">
                        {isOutOfStock ? (
                          <span className="text-rose-400">0</span>
                        ) : isLowStock ? (
                          <span className="text-amber-400">{product.currentStock}</span>
                        ) : (
                          <span className="text-white">{product.currentStock}</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        {isOutOfStock ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 px-2.5 py-0.5 text-[10px] font-bold text-rose-400 border border-rose-500/20">
                            Out of Stock
                          </span>
                        ) : isLowStock ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-bold text-amber-400 border border-amber-500/20">
                            Low Stock Alert
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/20">
                            Available
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
