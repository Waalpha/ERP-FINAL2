import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Receipt,
  PlusCircle,
  Search,
  Filter,
  Printer,
  CheckCircle,
  AlertCircle,
  FileText,
  DollarSign,
  TrendingUp,
  Send,
  RotateCcw,
  Sparkles,
  Layers,
  Phone,
  Building,
  CreditCard
} from 'lucide-react';
import { Student, FeePayment, FeeStructureItem, PrimaryGradeLevel } from '../../types';

interface FeeManagementProps {
  initialStudentForPayment?: Student | null;
  onClearInitialStudent?: () => void;
  onSendSmsToDebtor?: (student: Student) => void;
}

export const FeeManagement: React.FC<FeeManagementProps> = ({
  initialStudentForPayment,
  onClearInitialStudent,
  onSendSmsToDebtor
}) => {
  const {
    tenant,
    students,
    feeStructure,
    payments,
    invoices,
    user,
    recordPayment,
    reversePayment,
    addFeeStructureItem,
    generateInvoicesForGrade
  } = useAuth();

  const [activeSubTab, setActiveSubTab] = useState<'payments' | 'structure' | 'invoices' | 'defaulters'>('payments');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGradeFilter, setSelectedGradeFilter] = useState<string>('ALL');

  // Modal states
  const [showPaymentModal, setShowPaymentModal] = useState(!!initialStudentForPayment);
  const [showAddStructureModal, setShowAddStructureModal] = useState(false);
  const [showGenerateInvoiceModal, setShowGenerateInvoiceModal] = useState(false);
  const [selectedReceiptForPrint, setSelectedReceiptForPrint] = useState<FeePayment | null>(null);

  // Payment Form State
  const [selectedStudentId, setSelectedStudentId] = useState<string>(initialStudentForPayment?.id || students[0]?.id || '');
  const [paymentAmount, setPaymentAmount] = useState<number>(30000);
  const [paymentMethod, setPaymentMethod] = useState<'M-PESA' | 'BANK_TRANSFER' | 'CASH' | 'CHEQUE'>('M-PESA');
  const [transactionCode, setTransactionCode] = useState<string>(`SF${Math.random().toString(36).substr(2, 7).toUpperCase()}`);
  const [paymentNotes, setPaymentNotes] = useState<string>('Term 1 Fee installment');

  // Structure Form State
  const [newGrade, setNewGrade] = useState<PrimaryGradeLevel>('Grade 4');
  const [newCategory, setNewCategory] = useState<string>('Tuition Fee');
  const [newAmount, setNewAmount] = useState<number>(45000);
  const [newDescription, setNewDescription] = useState<string>('');

  // Invoice Generator State
  const [invoiceGrade, setInvoiceGrade] = useState<PrimaryGradeLevel>('Grade 4');
  const [invoiceTerm, setInvoiceTerm] = useState<'TERM_1' | 'TERM_2' | 'TERM_3'>('TERM_1');
  const [invoiceYear, setInvoiceYear] = useState<string>('2025');

  // Financial Stats
  const totalBilled = students.reduce((sum, s) => sum + (s.totalBilled || 0), 0);
  const totalPaid = students.reduce((sum, s) => sum + (s.totalPaid || 0), 0);
  const totalBalance = students.reduce((sum, s) => sum + (s.feeBalance || 0), 0);
  const collectionRate = totalBilled > 0 ? Math.round((totalPaid / totalBilled) * 100) : 0;

  const currentSelectedStudent = students.find(s => s.id === selectedStudentId);

  // Filtered lists
  const filteredPayments = payments.filter(p => {
    const matchesSearch =
      p.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.receiptNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.transactionCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = selectedGradeFilter === 'ALL' || p.grade === selectedGradeFilter;
    return matchesSearch && matchesGrade;
  });

  const feeDebtors = students.filter(s => s.feeBalance > 0 && s.status === 'ACTIVE');

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSelectedStudent || paymentAmount <= 0) return;

    const receipt = await recordPayment({
      studentId: currentSelectedStudent.id,
      studentName: `${currentSelectedStudent.firstName} ${currentSelectedStudent.lastName}`,
      admissionNo: currentSelectedStudent.admissionNo,
      grade: currentSelectedStudent.grade,
      amount: Number(paymentAmount),
      paymentMethod,
      transactionCode,
      paidAt: new Date().toISOString(),
      term: tenant?.currentTerm || 'TERM_1',
      academicYear: tenant?.currentAcademicYear || '2025',
      receivedBy: user?.displayName || 'Finance Office',
      notes: paymentNotes
    });

    setShowPaymentModal(false);
    if (onClearInitialStudent) onClearInitialStudent();
    setSelectedReceiptForPrint(receipt);
  };

  const handleStructureSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory || newAmount <= 0) return;

    await addFeeStructureItem({
      academicYear: tenant?.currentAcademicYear || '2025',
      term: tenant?.currentTerm || 'TERM_1',
      grade: newGrade,
      category: newCategory,
      amount: Number(newAmount),
      isMandatory: true,
      description: newDescription
    });

    setShowAddStructureModal(false);
    setNewDescription('');
  };

  const handleGenerateInvoices = async () => {
    await generateInvoicesForGrade(invoiceGrade, invoiceTerm, invoiceYear);
    setShowGenerateInvoiceModal(false);
  };

  const allGrades: PrimaryGradeLevel[] = [
    'Playgroup',
    'PP1',
    'PP2',
    'Grade 1',
    'Grade 2',
    'Grade 3',
    'Grade 4',
    'Grade 5',
    'Grade 6',
    'Grade 7',
    'Grade 8',
    'Grade 9'
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Fees, Billing & Financial Ledger</h1>
          <p className="text-xs text-slate-500">
            Termly fee structures, M-PESA payment receipts, invoice generation, and balances.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => setShowGenerateInvoiceModal(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold shadow-xs transition-all flex items-center space-x-1.5"
          >
            <FileText className="h-4 w-4 text-indigo-400" />
            <span>Generate Invoices</span>
          </button>

          <button
            onClick={() => {
              setSelectedStudentId(students[0]?.id || '');
              setTransactionCode(`SF${Math.random().toString(36).substr(2, 7).toUpperCase()}`);
              setShowPaymentModal(true);
            }}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-all flex items-center space-x-1.5"
          >
            <Receipt className="h-4 w-4" />
            <span>Receive Payment</span>
          </button>
        </div>
      </div>

      {/* Financial Executive Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-400">Total Billed Fees</span>
          <div className="text-2xl font-black text-slate-900 mt-1.5">
            KES {totalBilled.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Term 1 2025 Schedule</div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-emerald-600">Total Collected</span>
          <div className="text-2xl font-black text-emerald-600 mt-1.5">
            KES {totalPaid.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-600/80 mt-1 flex items-center space-x-1 font-medium">
            <CheckCircle className="h-3 w-3" />
            <span>{payments.filter(p => p.status === 'CONFIRMED').length} Confirmed Receipts</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-rose-600">Total Balance Outstanding</span>
          <div className="text-2xl font-black text-rose-600 mt-1.5">
            KES {totalBalance.toLocaleString()}
          </div>
          <div className="text-[11px] text-rose-500 mt-1">
            {feeDebtors.length} Learners with balances
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-indigo-600">Collection Efficiency</span>
          <div className="text-2xl font-black text-indigo-600 mt-1.5">{collectionRate}%</div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
            <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: `${collectionRate}%` }} />
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2 text-xs font-semibold">
        <button
          onClick={() => setActiveSubTab('payments')}
          className={`px-3.5 py-2 rounded-xl transition-colors ${
            activeSubTab === 'payments' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Payment Receipts Ledger ({payments.length})
        </button>
        <button
          onClick={() => setActiveSubTab('defaulters')}
          className={`px-3.5 py-2 rounded-xl transition-colors ${
            activeSubTab === 'defaulters' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Outstanding Balances ({feeDebtors.length})
        </button>
        <button
          onClick={() => setActiveSubTab('structure')}
          className={`px-3.5 py-2 rounded-xl transition-colors ${
            activeSubTab === 'structure' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Fee Structure Rates ({feeStructure.length})
        </button>
        <button
          onClick={() => setActiveSubTab('invoices')}
          className={`px-3.5 py-2 rounded-xl transition-colors ${
            activeSubTab === 'invoices' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Invoices Registry ({invoices.length})
        </button>
      </div>

      {/* Payments Ledger Sub-view */}
      {activeSubTab === 'payments' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-3 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search receipt no, learner, M-Pesa code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <select
                value={selectedGradeFilter}
                onChange={(e) => setSelectedGradeFilter(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 font-medium focus:outline-none"
              >
                <option value="ALL">All Grades</option>
                {allGrades.map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
            <div className="text-xs text-slate-500 font-medium">
              Showing <span className="font-bold text-slate-800">{filteredPayments.length}</span> receipts
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                <tr>
                  <th className="py-3.5 px-4">Receipt & Date</th>
                  <th className="py-3.5 px-4">Learner & Admission</th>
                  <th className="py-3.5 px-4">Method & Code</th>
                  <th className="py-3.5 px-4">Amount Paid</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Received By</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPayments.map((p) => {
                  const isReversed = p.status === 'REVERSED';
                  return (
                    <tr key={p.id} className={`hover:bg-slate-50/80 ${isReversed ? 'bg-rose-50/30' : ''}`}>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 font-mono">{p.receiptNo}</div>
                        <div className="text-[11px] text-slate-400">
                          {new Date(p.paidAt).toLocaleDateString()} at {new Date(p.paidAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900">{p.studentName}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{p.admissionNo} • {p.grade}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                          {p.paymentMethod}
                        </span>
                        <div className="text-[11px] text-slate-600 font-mono mt-0.5">{p.transactionCode}</div>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-emerald-600">
                        KES {p.amount.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          isReversed ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">{p.receivedBy}</td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => setSelectedReceiptForPrint(p)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                            title="Print Official Receipt"
                          >
                            <Printer className="h-3.5 w-3.5" />
                          </button>
                          {!isReversed && (
                            <button
                              onClick={() => {
                                const reason = prompt("Enter payment reversal reason:");
                                if (reason) reversePayment(p.id, reason);
                              }}
                              className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors"
                              title="Reverse Payment"
                            >
                              <RotateCcw className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Fee Defaulters Sub-view */}
      {activeSubTab === 'defaulters' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Outstanding Balance & Fee Defaulters</h2>
              <p className="text-xs text-slate-500">Learners with pending term arrears</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                <tr>
                  <th className="py-3 px-4">Learner</th>
                  <th className="py-3 px-4">Grade & Stream</th>
                  <th className="py-3 px-4">Parent Phone</th>
                  <th className="py-3 px-4">Billed Amount</th>
                  <th className="py-3 px-4">Paid to Date</th>
                  <th className="py-3 px-4">Outstanding Balance</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {feeDebtors.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/80">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {s.firstName} {s.lastName}
                      <div className="text-[10px] text-slate-400 font-mono">{s.admissionNo}</div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700">{s.grade} {s.stream}</td>
                    <td className="py-3.5 px-4 font-mono">{s.parentPhone}</td>
                    <td className="py-3.5 px-4 font-mono">KES {s.totalBilled.toLocaleString()}</td>
                    <td className="py-3.5 px-4 font-mono text-emerald-600">KES {s.totalPaid.toLocaleString()}</td>
                    <td className="py-3.5 px-4 font-bold text-rose-600 font-mono">
                      KES {s.feeBalance.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        {onSendSmsToDebtor && (
                          <button
                            onClick={() => onSendSmsToDebtor(s)}
                            className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs flex items-center space-x-1"
                          >
                            <Send className="h-3 w-3" />
                            <span>SMS Alert</span>
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setSelectedStudentId(s.id);
                            setPaymentAmount(s.feeBalance);
                            setShowPaymentModal(true);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center space-x-1"
                        >
                          <Receipt className="h-3 w-3" />
                          <span>Receive</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Fee Structure Sub-view */}
      {activeSubTab === 'structure' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Termly Fee Structure Schedule</h2>
              <p className="text-xs text-slate-500">Configured mandatory levies by grade level</p>
            </div>
            <button
              onClick={() => setShowAddStructureModal(true)}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl flex items-center space-x-1.5"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Add Fee Item</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                <tr>
                  <th className="py-3 px-4">Grade Level</th>
                  <th className="py-3 px-4">Fee Category</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4">Amount (KES)</th>
                  <th className="py-3 px-4">Mandatory</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {feeStructure.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80">
                    <td className="py-3 px-4 font-bold text-slate-900">{item.grade}</td>
                    <td className="py-3 px-4 font-semibold text-slate-700">{item.category}</td>
                    <td className="py-3 px-4 text-slate-500">{item.description || 'Standard term charge'}</td>
                    <td className="py-3 px-4 font-bold text-emerald-600">
                      KES {item.amount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700">
                        Mandatory
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Invoices Sub-view */}
      {activeSubTab === 'invoices' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Term Invoices Registry</h2>
              <p className="text-xs text-slate-500">Auto-generated learner invoices for Term 1, 2025</p>
            </div>
            <button
              onClick={() => setShowGenerateInvoiceModal(true)}
              className="px-3.5 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-xl"
            >
              Generate Batch Invoices
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {invoices.map((inv) => (
              <div key={inv.id} className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900 font-mono">{inv.invoiceNo}</div>
                  <div className="text-xs text-slate-700 font-semibold">{inv.studentName} ({inv.grade})</div>
                  <div className="text-[11px] text-slate-400">Due: {inv.dueDate}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-slate-900">KES {inv.totalBilled.toLocaleString()}</div>
                  <div className="text-[11px] text-emerald-600 font-semibold">Paid: KES {inv.totalPaid.toLocaleString()}</div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase mt-1 inline-block ${
                    inv.status === 'PAID' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {inv.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Record Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-slate-900 text-base">Receive Fee Payment</h3>
              <button
                onClick={() => {
                  setShowPaymentModal(false);
                  if (onClearInitialStudent) onClearInitialStudent();
                }}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePaymentSubmit} className="py-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Learner</label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.firstName} {s.lastName} ({s.admissionNo} - {s.grade})
                    </option>
                  ))}
                </select>
              </div>

              {currentSelectedStudent && (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Current Balance</span>
                    <div className="text-sm font-bold text-rose-600">
                      KES {currentSelectedStudent.feeBalance.toLocaleString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Total Billed</span>
                    <div className="text-sm font-bold text-slate-800">
                      KES {currentSelectedStudent.totalBilled.toLocaleString()}
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Amount to Pay (KES) *</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold text-sm text-emerald-600 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Payment Method</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none"
                  >
                    <option value="M-PESA">M-PESA (Paybill)</option>
                    <option value="BANK_TRANSFER">Bank Transfer / EFT</option>
                    <option value="CASH">Cash Office</option>
                    <option value="CHEQUE">Bank Cheque</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Transaction Ref / Code *</label>
                  <input
                    type="text"
                    required
                    value={transactionCode}
                    onChange={(e) => setTransactionCode(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Notes / Description</label>
                <input
                  type="text"
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                  placeholder="e.g. Paid via Paybill 400200"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-sm"
                >
                  Issue Receipt & Update Balance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Receipt Modal */}
      {selectedReceiptForPrint && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl border border-slate-200 text-slate-800">
            {/* School Header */}
            <div className="text-center pb-4 border-b-2 border-slate-900">
              {tenant?.logoUrl && (
                <div className="flex justify-center mb-2">
                  <div className="h-14 w-14 rounded-2xl bg-white border border-slate-200 p-1 flex items-center justify-center overflow-hidden shadow-xs">
                    <img
                      src={tenant.logoUrl}
                      alt={tenant.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                </div>
              )}
              <div className="text-xl font-black tracking-tight text-slate-900 uppercase">
                {tenant?.name}
              </div>
              <div className="text-xs text-slate-500 italic mt-0.5">{tenant?.motto}</div>
              <div className="text-[11px] text-slate-400 mt-1">
                {tenant?.address} • Phone: {tenant?.phone} • Email: {tenant?.contactEmail}
              </div>
              <div className="inline-block px-3 py-1 bg-slate-900 text-white rounded-md font-bold text-xs uppercase tracking-widest mt-3">
                OFFICIAL PAYMENT RECEIPT
              </div>
            </div>

            {/* Receipt Meta */}
            <div className="grid grid-cols-2 gap-4 py-4 text-xs border-b border-slate-200">
              <div>
                <span className="text-slate-400 font-medium">Receipt Number:</span>
                <div className="font-bold font-mono text-slate-900 text-sm">{selectedReceiptForPrint.receiptNo}</div>
                <span className="text-slate-400 font-medium mt-2 block">Date & Time:</span>
                <div className="font-semibold text-slate-800">{new Date(selectedReceiptForPrint.paidAt).toLocaleString()}</div>
              </div>
              <div className="text-right">
                <span className="text-slate-400 font-medium">Learner Name:</span>
                <div className="font-bold text-slate-900 text-sm">{selectedReceiptForPrint.studentName}</div>
                <span className="text-slate-400 font-medium mt-2 block">Admission & Class:</span>
                <div className="font-mono text-slate-800">{selectedReceiptForPrint.admissionNo} • {selectedReceiptForPrint.grade}</div>
              </div>
            </div>

            {/* Payment Details Table */}
            <div className="py-4 border-b border-slate-200 text-xs">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-[11px] text-slate-400 uppercase">
                    <th className="py-1">Description / Category</th>
                    <th className="py-1">Method / Ref</th>
                    <th className="py-1 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-2.5 font-semibold text-slate-800">
                      {selectedReceiptForPrint.term.replace('_', ' ')} Academic Tuition & Services
                    </td>
                    <td className="py-2.5 font-mono text-[11px] text-slate-600">
                      {selectedReceiptForPrint.paymentMethod} ({selectedReceiptForPrint.transactionCode})
                    </td>
                    <td className="py-2.5 font-bold text-right text-emerald-600 text-sm font-mono">
                      KES {selectedReceiptForPrint.amount.toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Signatures & Seal */}
            <div className="pt-6 grid grid-cols-2 gap-6 text-xs text-slate-500">
              <div>
                <div className="border-b border-slate-400 pb-1 font-semibold text-slate-800">
                  {selectedReceiptForPrint.receivedBy}
                </div>
                <div className="text-[10px] text-slate-400 mt-1">Authorized Bursar Signature</div>
              </div>
              <div className="text-right">
                <div className="h-10 w-24 border-2 border-dashed border-indigo-200 rounded-lg ml-auto flex items-center justify-center text-[10px] font-bold text-indigo-400 uppercase">
                  PAID STAMP
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex justify-end space-x-2 no-print">
              <button
                onClick={() => setSelectedReceiptForPrint(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl flex items-center space-x-1.5"
              >
                <Printer className="h-4 w-4" />
                <span>Print Receipt</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Structure Item Modal */}
      {showAddStructureModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-slate-900 text-base mb-1">Add Fee Structure Item</h3>
            <p className="text-xs text-slate-500 mb-4">Set tuition or service rate for a grade</p>

            <form onSubmit={handleStructureSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Grade Level</label>
                <select
                  value={newGrade}
                  onChange={(e) => setNewGrade(e.target.value as PrimaryGradeLevel)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none"
                >
                  {allGrades.map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Fee Category Name</label>
                <input
                  type="text"
                  required
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="e.g. Science & STEM Lab Levy"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Amount (KES)</label>
                <input
                  type="number"
                  required
                  min={100}
                  value={newAmount}
                  onChange={(e) => setNewAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <input
                  type="text"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="e.g. Mandatory CBC project materials"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddStructureModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl"
                >
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Batch Invoice Generator Modal */}
      {showGenerateInvoiceModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-slate-900 text-base mb-1">Generate Grade Invoices</h3>
            <p className="text-xs text-slate-500 mb-4">
              Create term invoices for all active learners in the selected grade
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Grade</label>
                <select
                  value={invoiceGrade}
                  onChange={(e) => setInvoiceGrade(e.target.value as PrimaryGradeLevel)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none"
                >
                  {allGrades.map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Term</label>
                  <select
                    value={invoiceTerm}
                    onChange={(e) => setInvoiceTerm(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none"
                  >
                    <option value="TERM_1">Term 1</option>
                    <option value="TERM_2">Term 2</option>
                    <option value="TERM_3">Term 3</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Academic Year</label>
                  <input
                    type="text"
                    value={invoiceYear}
                    onChange={(e) => setInvoiceYear(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-800 text-[11px]">
                Invoices will be calculated automatically based on the active fee structure items for {invoiceGrade}.
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowGenerateInvoiceModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleGenerateInvoices}
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl"
                >
                  Generate All Invoices
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
