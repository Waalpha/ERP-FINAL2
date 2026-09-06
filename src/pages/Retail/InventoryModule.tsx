import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Layers,
  Package,
  Plus,
  Search,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  RefreshCw
} from 'lucide-react';
import { RetailProduct } from '../../types';

interface InventoryModuleProps {
  onNavigate: (tab: string) => void;
}

export const InventoryModule: React.FC<InventoryModuleProps> = ({ onNavigate }) => {
  const { tenant, retailProducts, updateProductStock, addRetailProduct } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // Adjust stock modal
  const [adjustProduct, setAdjustProduct] = useState<RetailProduct | null>(null);
  const [newStockQty, setNewStockQty] = useState(0);

  const categories = ['ALL', ...Array.from(new Set(retailProducts.map(p => p.category)))];

  const filteredProducts = retailProducts.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'ALL' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const totalInventoryValue = retailProducts.reduce((sum, p) => sum + (p.costPrice * p.currentStock), 0);
  const lowStockItems = retailProducts.filter(p => p.currentStock <= p.minStockAlert);
  const outOfStockItems = retailProducts.filter(p => p.currentStock <= 0);

  const handleSaveStockAdjustment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustProduct) return;
    await updateProductStock(adjustProduct.id, newStockQty);
    setAdjustProduct(null);
  };

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-1">
            <Layers className="w-4 h-4" />
            <span>Shared Inventory Engine</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Stock & Inventory Hub</h1>
          <p className="text-sm text-slate-500 mt-0.5">Real-time inventory synchronization across Retail, Wholesale, and POS sales channels.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => onNavigate('commerce-retail')}
            className="px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold text-sm hover:bg-indigo-700 transition flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Catalog Item</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold uppercase text-slate-400">Total Valuation</span>
          <div className="mt-2 text-2xl font-bold text-slate-900">KES {totalInventoryValue.toLocaleString()}</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold uppercase text-slate-400">Total SKUs</span>
          <div className="mt-2 text-2xl font-bold text-indigo-600">{retailProducts.length}</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold uppercase text-slate-400">Low Stock Alerts</span>
          <div className="mt-2 text-2xl font-bold text-amber-600">{lowStockItems.length}</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold uppercase text-slate-400">Out of Stock</span>
          <div className="mt-2 text-2xl font-bold text-rose-600">{outOfStockItems.length}</div>
        </div>
      </div>

      {/* Main Stock Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search SKU, item name..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto pb-2 sm:pb-0">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  selectedCategory === cat ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">SKU</th>
                <th className="py-3 px-4">Product Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Cost Price</th>
                <th className="py-3 px-4">Selling Price</th>
                <th className="py-3 px-4">Current Stock</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredProducts.map(p => (
                <tr key={p.id} className="hover:bg-slate-50 transition">
                  <td className="py-3.5 px-4 font-mono font-medium text-slate-600">{p.sku}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-900">{p.name}</td>
                  <td className="py-3.5 px-4 text-slate-600">{p.category}</td>
                  <td className="py-3.5 px-4 text-slate-700">KES {p.costPrice.toLocaleString()}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">KES {p.sellingPrice.toLocaleString()}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-800">{p.currentStock} {p.unit}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      p.currentStock > p.minStockAlert ? 'bg-emerald-50 text-emerald-700' : p.currentStock > 0 ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'
                    }`}>
                      {p.currentStock > p.minStockAlert ? 'In Stock' : p.currentStock > 0 ? 'Low Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => {
                        setAdjustProduct(p);
                        setNewStockQty(p.currentStock);
                      }}
                      className="px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg text-xs font-semibold transition"
                    >
                      Adjust Stock
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Adjust Stock Modal */}
      {adjustProduct && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Adjust Stock Qty</h3>
            <p className="text-sm text-slate-600">Product: <span className="font-semibold text-slate-900">{adjustProduct.name}</span> ({adjustProduct.sku})</p>
            <form onSubmit={handleSaveStockAdjustment} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">New Physical Stock Quantity</label>
                <input
                  type="number"
                  required
                  value={newStockQty}
                  onChange={e => setNewStockQty(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setAdjustProduct(null)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700"
                >
                  Save Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
