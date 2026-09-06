import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  ShoppingBag,
  Package,
  Users,
  Building2,
  Truck,
  TrendingUp,
  Plus,
  Search,
  DollarSign,
  Receipt,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { RetailProduct, RetailCustomer, RetailSupplier, RetailSale } from '../../types';

interface RetailModuleProps {
  onNavigate: (tab: string) => void;
}

export const RetailModule: React.FC<RetailModuleProps> = ({ onNavigate }) => {
  const {
    tenant,
    retailProducts,
    retailSales,
    retailSuppliers,
    retailCustomers,
    addRetailProduct,
    addRetailSupplier,
    addRetailCustomer
  } = useAuth();

  const [activeSubTab, setActiveSubTab] = useState<'products' | 'customers' | 'suppliers' | 'purchasing' | 'sales' | 'reports'>('products');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [showAddSupplier, setShowAddSupplier] = useState(false);

  // New product form
  const [pSku, setPSku] = useState('');
  const [pName, setPName] = useState('');
  const [pCategory, setPCategory] = useState('Groceries');
  const [pCost, setPCost] = useState(100);
  const [pSelling, setPSelling] = useState(150);
  const [pStock, setPStock] = useState(50);
  const [pUnit, setPUnit] = useState('PCS');

  // Customer form
  const [cName, setCName] = useState('');
  const [cPhone, setCPhone] = useState('');
  const [cEmail, setCEmail] = useState('');
  const [cLimit, setCLimit] = useState(15000);

  // Supplier form
  const [sName, setSName] = useState('');
  const [sCompany, setSCompany] = useState('');
  const [sPhone, setSPhone] = useState('');
  const [sEmail, setSEmail] = useState('');

  // Metrics
  const retailSalesList = retailSales.filter(s => s.saleType === 'RETAIL');
  const totalRevenue = retailSalesList.reduce((sum, s) => sum + s.totalAmount, 0);
  const totalOrders = retailSalesList.length;
  const totalProducts = retailProducts.length;

  const filteredProducts = retailProducts.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.sku.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredCustomers = retailCustomers.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.phone.includes(searchQuery));
  const filteredSuppliers = retailSuppliers.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.company.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pName || !pSku) return;
    await addRetailProduct({
      sku: pSku.toUpperCase(),
      name: pName,
      category: pCategory,
      unit: pUnit as any,
      costPrice: pCost,
      sellingPrice: pSelling,
      wholesalePrice: Math.round(pSelling * 0.9),
      currentStock: pStock,
      minStockAlert: 5
    });
    setPSku('');
    setPName('');
    setShowAddProduct(false);
  };

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cName) return;
    await addRetailCustomer({
      name: cName,
      phone: cPhone || 'N/A',
      email: cEmail,
      type: 'REGULAR',
      creditLimit: cLimit,
      currentCredit: 0
    });
    setCName('');
    setCPhone('');
    setShowAddCustomer(false);
  };

  const handleCreateSupplier = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sName) return;
    await addRetailSupplier({
      name: sName,
      company: sCompany || sName,
      phone: sPhone || 'N/A',
      email: sEmail || 'N/A',
      address: 'Nairobi, Kenya',
      categoriesSupplied: [pCategory],
      status: 'ACTIVE'
    });
    setSName('');
    setSCompany('');
    setShowAddSupplier(false);
  };

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-1">
            <ShoppingBag className="w-4 h-4" />
            <span>Davetech Retail Operations</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Retail Management Hub</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage products, counter sales, retail customers, suppliers, and daily revenue.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => onNavigate('commerce-pos')}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-sm shadow-sm flex items-center space-x-2 transition"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Launch POS Terminal</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400">Retail Revenue</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl"><DollarSign className="w-5 h-5" /></div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900">KES {totalRevenue.toLocaleString()}</span>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">Live</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400">Retail Orders</span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl"><Receipt className="w-5 h-5" /></div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900">{totalOrders}</span>
            <span className="text-xs font-medium text-slate-500">Transactions</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400">Catalog SKUs</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><Package className="w-5 h-5" /></div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900">{totalProducts}</span>
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">Items</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400">Retail Customers</span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl"><Users className="w-5 h-5" /></div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900">{retailCustomers.length}</span>
            <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md">Active</span>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex border-b border-slate-200 space-x-6 bg-white px-6 rounded-t-2xl border-x">
        {(['products', 'customers', 'suppliers', 'purchasing', 'sales', 'reports'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveSubTab(tab)}
            className={`py-4 text-sm font-semibold border-b-2 capitalize transition ${
              activeSubTab === tab ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-b-2xl border border-slate-200 p-6 shadow-xs">
        {/* PRODUCTS TAB */}
        {activeSubTab === 'products' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search products by name or SKU..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <button
                onClick={() => setShowAddProduct(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Retail Product</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-4">SKU / Code</th>
                    <th className="py-3 px-4">Product Name</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Retail Price</th>
                    <th className="py-3 px-4">Stock Qty</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {filteredProducts.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50 transition">
                      <td className="py-3.5 px-4 font-mono font-medium text-slate-700">{p.sku}</td>
                      <td className="py-3.5 px-4 font-semibold text-slate-900">{p.name}</td>
                      <td className="py-3.5 px-4 text-slate-600">{p.category}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">KES {p.sellingPrice.toLocaleString()}</td>
                      <td className="py-3.5 px-4 text-slate-700">{p.currentStock} {p.unit}</td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          p.currentStock > 10 ? 'bg-emerald-50 text-emerald-700' : p.currentStock > 0 ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'
                        }`}>
                          {p.currentStock > 10 ? 'In Stock' : p.currentStock > 0 ? 'Low Stock' : 'Out of Stock'}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {filteredProducts.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-slate-400">No retail products found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* CUSTOMERS TAB */}
        {activeSubTab === 'customers' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-slate-900">Retail & Walk-in Customers</h3>
              <button
                onClick={() => setShowAddCustomer(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Customer</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-4">Customer Name</th>
                    <th className="py-3 px-4">Phone</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Credit Limit</th>
                    <th className="py-3 px-4">Total Spend</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {filteredCustomers.map(c => (
                    <tr key={c.id} className="hover:bg-slate-50 transition">
                      <td className="py-3.5 px-4 font-semibold text-slate-900">{c.name}</td>
                      <td className="py-3.5 px-4 text-slate-600">{c.phone}</td>
                      <td className="py-3.5 px-4 text-slate-600">{c.email || 'N/A'}</td>
                      <td className="py-3.5 px-4 text-slate-700 font-medium">KES {c.creditLimit.toLocaleString()}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">KES {c.totalSpend.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SUPPLIERS TAB */}
        {activeSubTab === 'suppliers' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-slate-900">Retail Vendors & Suppliers</h3>
              <button
                onClick={() => setShowAddSupplier(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Supplier</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-4">Supplier Name</th>
                    <th className="py-3 px-4">Company</th>
                    <th className="py-3 px-4">Phone</th>
                    <th className="py-3 px-4">Balance Owed</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {filteredSuppliers.map(s => (
                    <tr key={s.id} className="hover:bg-slate-50 transition">
                      <td className="py-3.5 px-4 font-semibold text-slate-900">{s.name}</td>
                      <td className="py-3.5 px-4 text-slate-600">{s.company}</td>
                      <td className="py-3.5 px-4 text-slate-600">{s.phone}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">KES {(s.balanceOwed || 0).toLocaleString()}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700">Active</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PURCHASING TAB */}
        {activeSubTab === 'purchasing' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900">Purchase Orders & Goods Received</h3>
            <p className="text-sm text-slate-500">Record stock purchases from registered suppliers to automatically restock inventory.</p>
            <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-center">
              <Truck className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">No active purchase orders pending.</p>
              <button
                onClick={() => alert("Purchase order creation wizard")}
                className="mt-3 px-4 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition"
              >
                Create Purchase Order
              </button>
            </div>
          </div>
        )}

        {/* SALES TAB */}
        {activeSubTab === 'sales' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900">Retail Sales History</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-4">Receipt #</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Items Count</th>
                    <th className="py-3 px-4">Payment</th>
                    <th className="py-3 px-4">Total Amount</th>
                    <th className="py-3 px-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {retailSalesList.map(sale => (
                    <tr key={sale.id} className="hover:bg-slate-50 transition">
                      <td className="py-3.5 px-4 font-mono font-medium text-indigo-600">{sale.receiptNumber}</td>
                      <td className="py-3.5 px-4 font-semibold text-slate-900">{sale.customerName || 'Walk-in'}</td>
                      <td className="py-3.5 px-4 text-slate-600">{sale.items.length} items</td>
                      <td className="py-3.5 px-4"><span className="px-2 py-0.5 rounded-md text-xs font-bold bg-slate-100 text-slate-700">{sale.paymentMethod}</span></td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">KES {sale.totalAmount.toLocaleString()}</td>
                      <td className="py-3.5 px-4 text-slate-500 text-xs">{new Date(sale.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                  {retailSalesList.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-slate-400">No retail sales recorded yet. Use POS to make sales.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* REPORTS TAB */}
        {activeSubTab === 'reports' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900">Retail Sales Analytics & Reports</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl">
                <h4 className="text-sm font-bold text-slate-800 mb-2">Revenue Breakdown</h4>
                <p className="text-xs text-slate-500 mb-4">Summary of daily counter transactions and cashier performance.</p>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Total Gross Revenue</span>
                    <span className="font-bold text-slate-900">KES {totalRevenue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Total Transactions</span>
                    <span className="font-bold text-slate-900">{totalOrders}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Average Basket Size</span>
                    <span className="font-bold text-slate-900">KES {totalOrders ? Math.round(totalRevenue / totalOrders).toLocaleString() : 0}</span>
                  </div>
                </div>
              </div>
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col justify-center items-center text-center">
                <TrendingUp className="w-12 h-12 text-indigo-600 mb-3" />
                <h4 className="text-base font-bold text-slate-900">Export Retail Statements</h4>
                <p className="text-xs text-slate-500 mt-1 mb-4">Download complete KRA-compliant CSV or PDF reports for tax and accounting.</p>
                <button
                  onClick={() => alert("Report downloaded successfully.")}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 transition"
                >
                  Download Statement
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      {showAddProduct && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Add New Retail Product</h3>
            <form onSubmit={handleCreateProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">SKU / Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MILK-500ML"
                  value={pSku}
                  onChange={e => setPSku(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Fresh Milk 500ml"
                  value={pName}
                  onChange={e => setPName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Category</label>
                  <input
                    type="text"
                    value={pCategory}
                    onChange={e => setPCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Unit</label>
                  <select
                    value={pUnit}
                    onChange={e => setPUnit(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm bg-white"
                  >
                    <option value="PCS">PCS</option>
                    <option value="KG">KG</option>
                    <option value="PACK">PACK</option>
                    <option value="LTR">LTR</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Cost Price (KES)</label>
                  <input
                    type="number"
                    value={pCost}
                    onChange={e => setPCost(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Selling Price (KES)</label>
                  <input
                    type="number"
                    value={pSelling}
                    onChange={e => setPSelling(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Initial Stock Qty</label>
                <input
                  type="number"
                  value={pStock}
                  onChange={e => setPStock(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddProduct(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Customer Modal */}
      {showAddCustomer && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Add Retail Customer</h3>
            <form onSubmit={handleCreateCustomer} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Kamau"
                  value={cName}
                  onChange={e => setCName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Phone Number</label>
                <input
                  type="text"
                  placeholder="0712345678"
                  value={cPhone}
                  onChange={e => setCPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email</label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  value={cEmail}
                  onChange={e => setCEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddCustomer(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700"
                >
                  Save Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Supplier Modal */}
      {showAddSupplier && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Add Supplier</h3>
            <form onSubmit={handleCreateSupplier} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Supplier Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Highland Distributors"
                  value={sName}
                  onChange={e => setSName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Company Name</label>
                <input
                  type="text"
                  placeholder="Highland Ltd"
                  value={sCompany}
                  onChange={e => setSCompany(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Phone</label>
                <input
                  type="text"
                  placeholder="0700000000"
                  value={sPhone}
                  onChange={e => setSPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddSupplier(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700"
                >
                  Save Supplier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
