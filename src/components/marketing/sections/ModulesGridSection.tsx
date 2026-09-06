import React, { useState } from 'react';
import { Search, Layers, CheckCircle2, Shield, DollarSign, Users, Stethoscope, ShoppingBag, BookOpen, Cpu } from 'lucide-react';

export const ModulesGridSection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const categories = ['ALL', 'Core', 'Education', 'Business', 'Finance', 'HR', 'Healthcare', 'POS', 'Inventory', 'Analytics', 'Security'];

  const allModules = [
    // Core & Platform
    { name: 'Tenant Provisioning Engine', category: 'Core', desc: 'Instant multi-tenant container and database partitioning.' },
    { name: 'Subdomain Routing', category: 'Core', desc: 'Automatic subdomain resolution (*.davetech.co.ke).' },
    { name: 'Custom Domain SSL', category: 'Core', desc: 'Automated Let’s Encrypt TLS certificates for custom domains.' },
    { name: 'Role-Based Access Control (RBAC)', category: 'Security', desc: 'Granular permissions matrix for all user tiers.' },
    { name: 'Central Super Admin', category: 'Core', desc: 'Platform-wide telemetry, billing, and system metrics.' },
    { name: 'Audit Trail Logs', category: 'Security', desc: 'Immutable activity logs capturing every critical data mutation.' },
    { name: 'Automated Cloud Backups', category: 'Security', desc: 'Continuous Firestore snapshots and disaster recovery.' },
    { name: 'Encrypted Communication', category: 'Security', desc: 'End-to-end TLS 1.3 encryption across all API routes.' },

    // Education
    { name: 'Student Admissions & Roster', category: 'Education', desc: 'Complete learner lifecycle management from intake to graduation.' },
    { name: 'CBC & 8-4-4 Gradebook', category: 'Education', desc: 'Competency-based assessment tracking and report card generator.' },
    { name: 'Fee Structures & Invoicing', category: 'Finance', desc: 'Automated term invoicing, levies, and vote-head allocations.' },
    { name: 'M-Pesa & Bank Gateway', category: 'Finance', desc: 'Instant STK push and automated bank receipt reconciliation.' },
    { name: 'Digital Attendance Roll Call', category: 'Education', desc: 'Biometric and teacher-tablet daily attendance logs.' },
    { name: 'Interactive Timetable Builder', category: 'Education', desc: 'Conflict-free classroom and teacher scheduling.' },
    { name: 'Homework & Assignment Hub', category: 'Education', desc: 'Publish homework, collect submissions, and grade online.' },
    { name: 'Disciplinary Incident Tracking', category: 'Education', desc: 'Log disciplinary cases, severity levels, and resolution actions.' },
    { name: 'Parents Mobile Portal', category: 'Education', desc: 'Real-time parent access to grades, fees, and notices.' },
    { name: 'Teachers Portal & Lesson Plans', category: 'Education', desc: 'Dedicated teacher workspace for lesson notes and grading.' },
    { name: 'School Bus Fleet & GPS', category: 'Education', desc: 'Transport route management and parent pickup alerts.' },
    { name: 'Library & Book Lending', category: 'Education', desc: 'RFID book cataloging, borrowings, and overdue fines.' },
    { name: 'Hostel & Dormitory Allocation', category: 'Education', desc: 'Room bed mapping and boarding fee accounting.' },
    { name: 'SMS & Email Broadcasts', category: 'Education', desc: 'Bulk messaging via Africa’s Talking and SMTP gateways.' },
    { name: 'College Department Management', category: 'Education', desc: 'Higher education faculty and departmental structures.' },
    { name: 'Semester Course Registration', category: 'Education', desc: 'TVET and university unit enrollment and unit clearance.' },
    { name: 'Official Transcript Generator', category: 'Education', desc: 'Cumulative GPA calculation and tamper-proof transcripts.' },
    { name: 'Learning Management System (LMS)', category: 'Education', desc: 'Course modules, lecture notes, and student quizzes.' },
    { name: 'Seminary Theology Programs', category: 'Education', desc: 'Specialized divinity and patristic curriculum management.' },
    { name: 'Ministry Practicum Logging', category: 'Education', desc: 'Track field hours, pastoral service, and dean verifications.' },

    // Business & POS & Inventory
    { name: 'Lightning Point of Sale (POS)', category: 'POS', desc: 'Fast retail checkout with barcode scanning and cash/M-Pesa.' },
    { name: 'Real-Time Inventory Control', category: 'Inventory', desc: 'Stock levels, SKU variants, and low-stock threshold alerts.' },
    { name: 'Multi-Warehouse Management', category: 'Inventory', desc: 'Transfer stock between warehouses and retail branches.' },
    { name: 'Purchase Orders & Goods Receipt', category: 'Business', desc: 'Procurement workflows from supplier PO to stock entry.' },
    { name: 'Customer Invoices & Quotations', category: 'Business', desc: 'Professional proforma invoices, quotes, and credit notes.' },
    { name: 'Supplier & Vendor CRM', category: 'Business', desc: 'Manage vendor accounts, ledger balances, and payments.' },
    { name: 'Expense & Petty Cash Tracking', category: 'Finance', desc: 'Log operational expenditures and petty cash vouchers.' },
    { name: 'General Ledger & P&L', category: 'Finance', desc: 'Complete double-entry accounting with balance sheet reports.' },
    { name: 'Multi-Branch Enterprise Sync', category: 'Business', desc: 'Unified reporting across multiple geographically dispersed branches.' },

    // HR & Payroll
    { name: 'Employee Directory & Profiles', category: 'HR', desc: 'Complete staff records, contracts, and emergency contacts.' },
    { name: 'Automated Payroll & Statutory Tax', category: 'HR', desc: 'Calculate PAYE, NSSF, NHIF, housing levy, and net payouts.' },
    { name: 'Leave & Absence Management', category: 'HR', desc: 'Leave application workflows, approvals, and balances.' },
    { name: 'Recruitment & Applicant Tracking', category: 'HR', desc: 'Job postings, candidate interviews, and onboarding.' },
    { name: 'Performance Appraisals & KPIs', category: 'HR', desc: 'Periodic staff evaluations and key performance indicators.' },

    // Healthcare & EMR
    { name: 'Patient Triage & Registration', category: 'Healthcare', desc: 'Outpatient queue management, vitals recording, and cards.' },
    { name: 'Doctor Consultation & EMR', category: 'Healthcare', desc: 'Clinical notes, diagnoses, prescriptions, and lab requests.' },
    { name: 'Pharmacy Dispensing & POS', category: 'Healthcare', desc: 'Prescription fulfillment and pharmaceutical stock deduction.' },
    { name: 'Laboratory Test Results & Imaging', category: 'Healthcare', desc: 'Lab test ordering, specimen tracking, and result reporting.' },
    { name: 'Clinical Tariff Pricing', category: 'Healthcare', desc: 'Manage service fees for cash, insurance, and corporate schemes.' },
    { name: 'Inpatient Ward Management', category: 'Healthcare', desc: 'Bed occupancy, nursing notes, and discharge summaries.' },
    { name: 'NHIF & Insurance Claims', category: 'Healthcare', desc: 'Automated claim generation and corporate health billing.' },

    // Analytics & BI
    { name: 'Executive Dashboard & KPIs', category: 'Analytics', desc: 'Real-time visual telemetry for revenue, enrollment, and operations.' },
    { name: 'Financial Cash Flow Forecasts', category: 'Analytics', desc: 'Predictive cash flow and revenue trajectory modeling.' },
    { name: 'Custom Report Builder', category: 'Analytics', desc: 'Exportable CSV, Excel, and PDF reports for all modules.' },
    { name: 'Activity Heatmaps', category: 'Analytics', desc: 'Operational usage trends and peak traffic hours.' }
  ];

  const filteredModules = allModules.filter(mod => {
    const matchesSearch = mod.name.toLowerCase().includes(searchQuery.toLowerCase()) || mod.desc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || mod.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <section id="modules" className="py-24 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-teal-400 bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/20">
            Modular Enterprise Ecosystem
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Explore All 50+ DAVETECH Modules
          </h2>
          <p className="text-slate-400 text-base">
            Enable exactly the modules your organization requires. Scale effortlessly as you grow.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search modules (e.g. M-Pesa, EMR, Gradebook...)"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 pl-10 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            {categories.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Modules Count Indicator */}
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Showing <strong className="text-white">{filteredModules.length}</strong> enterprise modules</span>
          <span>Fully integrated into DAVETECH Cloud</span>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModules.map((mod, idx) => (
            <div
              key={idx}
              className="bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 p-6 rounded-2xl transition-all duration-300 group hover:-translate-y-1 shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    {mod.category}
                  </span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                  {mod.name}
                </h3>
                <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                  {mod.desc}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>Status: Production Ready</span>
                <span className="text-indigo-400">Instant Activation</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
