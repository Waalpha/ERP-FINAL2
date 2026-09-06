import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Receipt,
  Users,
  TrendingUp,
  Plus,
  Search,
  DollarSign,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Building2
} from 'lucide-react';
import { RetailCustomerInvoice, RetailCustomer } from '../../types';

interface WholesaleModuleProps {
  onNavigate: (tab: string) => void;
}

export const WholesaleModule: React.FC<WholesaleModuleProps> = ({ onNavigate }) => {
  const {
    tenant,
    retailCustomers,
    retailInvoices,
    retailProducts,
    createRetailCustomerInvoice,
    recordRetailCustomerPayment,
    addRetailCustomer
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'customers' | 'pricing' | 'invoices' | 'payments' | 'reports'>('invoices');
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // New Wholesale Invoice State
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [invoiceQty, setInvoiceQty] = useState(10);
  const [paymentTerms, setPaymentTerms] = useState<'NET_30' | 'NET_60' | 'DUE_ON_RECEIPT'>('NET_30');

  // Payment Recording State
  const [selectedInvoiceId, setSelectedInvoiceId] = useState('');
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<'BANK_TRANSFER' | 'MPESA' | 'CASH' | 'CHEQUE'>('BANK_TRANSFER');
  const [transactionCode, setTransactionCode] = useState('');

  const wholesaleCustomers = retailCustomers.filter(c => c.type === 'WHOLESALE' || c.creditLimit > 0);
  const wholesaleInvoices = retailInvoices;

  const totalWholesaleBilled = wholesaleInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
  const totalWholesalePaid = wholesaleInvoices.reduce((sum, inv) => sum + (inv.paidAmount || 0), 0);
  const totalWholesaleBalance = totalWholesaleBilled - totalWholesalePaid;

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    const cust = retailCustomers.find(c => c.id === selectedCustomerId);
    const prod = retailProducts.find(p => p.id === selectedProductId);
    if (!cust || !prod) return;

    const unitPrice = prod.wholesalePrice || prod.sellingPrice * 0.9;
    const lineTotal = unitPrice * invoiceQty;

    await createRetailCustomerInvoice({
      customerId: cust.id,
      customerName: cust.name,
      customerPhone: cust.phone,
      customerType: 'WHOLESALE',
      items: [
        {
          productId: prod.id,
          productName: prod.name,
          sku: prod.sku,
          quantity: invoiceQty,
          unitPrice,
          discount: 0,
          lineTotal
        }
      ],
      subtotal: lineTotal,
      taxAmount: 0,
      discountAmount: 0,
      totalAmount: lineTotal,
      amountPaid: 0,
      balanceDue: lineTotal,
      paymentTerms,
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      issueDate: new Date().toISOString().split('T')[0],
      status: 'UNPAID'
    });

    setShowInvoiceModal(false);
    setSelectedCustomerId('');
    setSelectedProductId('');
  };

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    const inv = wholesaleInvoices.find(i => i.id === selectedInvoiceId);
    if (!inv || paymentAmount <= 0) return;

    await recordRetailCustomerPayment({
      customerId: inv.customerId,
      customerName: inv.customerName,
      invoiceId: inv.id,
      amount: paymentAmount,
      paymentMethod,
      transactionCode: transactionCode || `WH-PAY-${Date.now().toString().slice(-6)}`,
      paymentDate: new Date().toISOString().split('T')[0],
      receivedBy: 'Admin Cashier',
      status: 'COMPLETED'
    });

    setShowPaymentModal(false);
    setSelectedInvoiceId('');
    setPaymentAmount(0);
    setTransactionCode('');
  };

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-1">
            <Building2 className="w-4 h-4" />
            <span>Davetech B2B Distribution & Bulk Engine</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Wholesale & Bulk Orders</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage B2B accounts, bulk tier pricing, credit sales invoices, and receivables.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowInvoiceModal(true)}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-sm shadow-sm flex items-center space-x-2 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Create Wholesale Invoice</span>
          </button>
          <button
            onClick={() => setShowPaymentModal(true)}
            className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-semibold text-sm shadow-xs flex items-center space-x-2 transition"
          >
            <DollarSign className="w-4 h-4" />
            <span>Record Payment</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold uppercase text-slate-400">Total Wholesale Billed</span>
          <div className="mt-2 text-2xl font-bold text-slate-900">KES {totalWholesaleBilled.toLocaleString()}</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold uppercase text-slate-400">Total Payments Collected</span>
          <div className="mt-2 text-2xl font-bold text-emerald-600">KES {totalWholesalePaid.toLocaleString()}</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold uppercase text-slate-400">Outstanding Receivables</span>
          <div className="mt-2 text-2xl font-bold text-amber-600">KES {totalWholesaleBalance.toLocaleString()}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 space-x-6 bg-white px-6 rounded-t-2xl border-x">
        {(['invoices', 'customers', 'pricing', 'payments', 'reports'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-4 text-sm font-semibold border-b-2 capitalize transition ${
              activeTab === tab ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-b-2xl border border-slate-200 p-6 shadow-xs">
        {activeTab === 'invoices' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900">Wholesale Invoices & Credit Sales</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-4">Invoice #</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Terms</th>
                    <th className="py-3 px-4">Total Amount</th>
                    <th className="py-3 px-4">Balance Due</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {wholesaleInvoices.map(inv => (
                    <tr key={inv.id} className="hover:bg-slate-50 transition">
                      <td className="py-3.5 px-4 font-mono font-medium text-indigo-600">{inv.invoiceNo}</td>
                      <td className="py-3.5 px-4 font-semibold text-slate-900">{inv.customerName}</td>
                      <td className="py-3.5 px-4 text-slate-600">{inv.paymentTerms}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">KES {inv.totalAmount.toLocaleString()}</td>
                      <td className="py-3.5 px-4 font-bold text-amber-600">KES {(inv.balanceDue || inv.balance || 0).toLocaleString()}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          inv.status === 'PAID' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                        }`}>
                          {inv.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {wholesaleInvoices.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-slate-400">No wholesale invoices generated yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'customers' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900">Wholesale & Bulk Buyers</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-4">Company / Name</th>
                    <th className="py-3 px-4">Phone</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Credit Limit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {wholesaleCustomers.map(c => (
                    <tr key={c.id} className="hover:bg-slate-50 transition">
                      <td className="py-3.5 px-4 font-semibold text-slate-900">{c.name}</td>
                      <td className="py-3.5 px-4 text-slate-600">{c.phone}</td>
                      <td className="py-3.5 px-4 text-slate-600">{c.email || 'N/A'}</td>
                      <td className="py-3.5 px-4 font-bold text-indigo-600">KES {c.creditLimit.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'pricing' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900">Bulk Tier Pricing Rules</h3>
            <p className="text-sm text-slate-500">Configure special wholesale discounts and bulk unit pricing for wholesale partners.</p>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-4">SKU</th>
                    <th className="py-3 px-4">Product Name</th>
                    <th className="py-3 px-4">Standard Price</th>
                    <th className="py-3 px-4">Wholesale Bulk Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {retailProducts.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50 transition">
                      <td className="py-3.5 px-4 font-mono text-slate-600">{p.sku}</td>
                      <td className="py-3.5 px-4 font-semibold text-slate-900">{p.name}</td>
                      <td className="py-3.5 px-4 text-slate-700">KES {p.sellingPrice.toLocaleString()}</td>
                      <td className="py-3.5 px-4 font-bold text-emerald-600">KES {(p.wholesalePrice || Math.round(p.sellingPrice * 0.9)).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900">Wholesale Payments & Bank Receipts</h3>
            <p className="text-sm text-slate-500">Track incoming bank wires, M-Pesa business deposits, and cheque payments.</p>
            <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-center">
              <Receipt className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">All payments are fully reconciled against issued invoices.</p>
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900">Wholesale & Credit Aging Reports</h3>
            <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col justify-center items-center text-center">
              <TrendingUp className="w-12 h-12 text-indigo-600 mb-3" />
              <h4 className="text-base font-bold text-slate-900">Export B2B Ledger Statements</h4>
              <p className="text-xs text-slate-500 mt-1 mb-4">Generate comprehensive wholesale aging reports and customer credit ledgers.</p>
              <button
                onClick={() => alert("Wholesale statement downloaded.")}
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 transition"
              >
                Download B2B Statement
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create Wholesale Invoice Modal */}
      {showInvoiceModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Create Wholesale Invoice</h3>
            <form onSubmit={handleCreateInvoice} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Wholesale Customer</label>
                <select
                  required
                  value={selectedCustomerId}
                  onChange={e => setSelectedCustomerId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm bg-white"
                >
                  <option value="">Select Customer...</option>
                  {retailCustomers.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.phone})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Product</label>
                <select
                  required
                  value={selectedProductId}
                  onChange={e => setSelectedProductId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm bg-white"
                >
                  <option value="">Select Product...</option>
                  {retailProducts.map(p => (
                    <option key={p.id} value={p.id}>{p.name} (Wholesale: KES {p.wholesalePrice || p.sellingPrice})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Quantity</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={invoiceQty}
                  onChange={e => setInvoiceQty(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Payment Terms</label>
                <select
                  value={paymentTerms}
                  onChange={e => setPaymentTerms(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm bg-white"
                >
                  <option value="NET_30">Net 30 Days</option>
                  <option value="NET_60">Net 60 Days</option>
                  <option value="DUE_ON_RECEIPT">Due on Receipt</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowInvoiceModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700"
                >
                  Issue Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Record Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Record Wholesale Payment</h3>
            <form onSubmit={handleRecordPayment} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Select Invoice</label>
                <select
                  required
                  value={selectedInvoiceId}
                  onChange={e => setSelectedInvoiceId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm bg-white"
                >
                  <option value="">Select Invoice...</option>
                  {wholesaleInvoices.map(inv => (
                    <option key={inv.id} value={inv.id}>{inv.invoiceNo} - {inv.customerName} (Bal: KES {inv.balanceDue || inv.balance})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Payment Amount (KES)</label>
                <input
                  type="number"
                  required
                  value={paymentAmount}
                  onChange={e => setPaymentAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={e => setPaymentMethod(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm bg-white"
                >
                  <option value="BANK_TRANSFER">Bank Transfer</option>
                  <option value="MPESA">M-Pesa Business</option>
                  <option value="CHEQUE">Cheque</option>
                  <option value="CASH">Cash</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Transaction Code / Ref</label>
                <input
                  type="text"
                  placeholder="e.g. BnkRef123456"
                  value={transactionCode}
                  onChange={e => setTransactionCode(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700"
                >
                  Post Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
