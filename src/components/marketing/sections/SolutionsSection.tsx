import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import { DEFAULT_PUBLIC_WEBSITE_CONTENT } from '../../../types';
import { GraduationCap, Building2, ShoppingBag, Users2, Stethoscope, Check, ArrowRight } from 'lucide-react';

interface SolutionsSectionProps {
  onOpenDemo: () => void;
}

export const SolutionsSection: React.FC<SolutionsSectionProps> = ({ onOpenDemo }) => {
  const { platformSettings } = useAuth();
  const content = platformSettings?.publicWebsiteContent || DEFAULT_PUBLIC_WEBSITE_CONTENT;

  return (
    <section id="solutions" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-700 bg-indigo-100 px-3 py-1 rounded-full border border-indigo-200">
            Comprehensive Industry Verticals
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            {content.solutionsTitle}
          </h2>
          <p className="text-slate-600 text-base">
            {content.solutionsSubtitle}
          </p>
        </div>

        {/* 1. School ERP */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 border border-indigo-200 text-indigo-700 flex items-center justify-center">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              School ERP: Playgroup to Grade 9 & High School
            </h3>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Empower administrators, teachers, and parents with an all-in-one digital campus. Manage student admissions, term fee structures, automated invoicing, M-Pesa receipts, and CBC competency-based report cards seamlessly.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {[
                'Admissions & Enrollment', 'CBC & 8-4-4 Gradebooks', 'Fee Billing & M-Pesa Integration',
                'Digital Roll Call & Biometrics', 'Interactive Timetable Generator', 'Parents & Teachers Portals',
                'School Bus Fleet Tracking', 'SMS & Email Broadcasts'
              ].map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm text-slate-700">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>{feat}</span>
                </div>
              ))}
            </div>
            <div className="pt-4">
              <button
                onClick={onOpenDemo}
                className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-semibold text-sm group"
              >
                Explore School Solution <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-2xl shadow-xl">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <span className="text-xs font-mono text-slate-400">MODULE: ACADEMICS & FEES</span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 font-medium">Active Session</span>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl space-y-3">
                <div className="text-xs text-slate-400">Term 1 Revenue Summary</div>
                <div className="text-2xl font-bold text-white">KES 14,850,000</div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full w-[85%]" />
                </div>
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Collected: KES 12.6M</span>
                  <span>Pending: KES 2.25M</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. College & University ERP */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1 bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-2xl shadow-xl">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <span className="text-xs font-mono text-slate-400">HIGHER ED SEMESTER MANAGEMENT</span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-purple-500/10 text-purple-400 font-medium">TVET & University</span>
              </div>
              <div className="space-y-2">
                {['Faculty of Computing & IT', 'School of Business & Economics', 'School of Nursing & Health Sciences'].map((fac, i) => (
                  <div key={i} className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between text-xs">
                    <span className="text-white font-medium">{fac}</span>
                    <span className="text-indigo-400 font-mono">Verified Units</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2 space-y-6">
            <div className="w-12 h-12 rounded-xl bg-purple-100 border border-purple-200 text-purple-700 flex items-center justify-center">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              College & University ERP: Academic Excellence at Scale
            </h3>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Designed for colleges, polytechnics, and universities managing complex course registrations, departmental units, semester transcripts, LMS assignments, and student financial clearances.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {[
                'Department & Course Management', 'Semester Registration & Units', 'Transcripts & Academic Reports',
                'Learning Management System (LMS)', 'Theology & Seminary Programs', 'Library & RFID Book Tracking',
                'Hostel & Dormitory Allocation', 'Alumni Tracking & Portals'
              ].map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm text-slate-700">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Business & POS Solutions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="w-12 h-12 rounded-xl bg-amber-100 border border-amber-200 text-amber-700 flex items-center justify-center">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Business Solutions: POS, Inventory & Enterprise Accounting
            </h3>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Run retail shops, wholesale distribution, and multi-branch companies with lightning-fast checkout POS, automated stock reordering, CRM, warehouse tracking, and full general ledger accounting.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {[
                'Lightning Point of Sale (POS)', 'Real-Time Inventory & Stock', 'Multi-Warehouse & Branch Sync',
                'Purchase Orders & Goods Receipt', 'Customer Invoicing & Quotations', 'Supplier & Vendor CRM',
                'Expense & Petty Cash Tracking', 'General Ledger & P&L Reports'
              ].map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm text-slate-700">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-2xl shadow-xl">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <span className="text-xs font-mono text-slate-400">RETAIL POS TERMINAL #01</span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/10 text-amber-400 font-medium">Online Mode</span>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl space-y-3">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Daily Gross Sales</span>
                  <span className="text-emerald-400 font-bold">KES 384,500</span>
                </div>
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Transactions</span>
                  <span className="text-white font-bold">286 checkouts</span>
                </div>
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Active SKUs</span>
                  <span className="text-white font-bold">1,420 items</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Healthcare ERP */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1 bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-2xl shadow-xl">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <span className="text-xs font-mono text-slate-400">CLINICAL EMR & PHARMACY</span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-teal-500/10 text-teal-400 font-medium">Fully Operational</span>
              </div>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300">
                Patient Triage Queue: 142 Today • Pharmacy Stock: 98.4% Available • NHIF Claims Processed: KES 2.4M
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2 space-y-6">
            <div className="w-12 h-12 rounded-xl bg-teal-100 border border-teal-200 text-teal-700 flex items-center justify-center">
              <Stethoscope className="w-6 h-6" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Healthcare ERP: Hospitals, Clinics & EMR
            </h3>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Streamline patient care with electronic medical records (EMR), outpatient triage, doctor consultations, pharmacy prescription dispensing, laboratory results, and insurance claims.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {[
                'Patient Triage & Registration', 'Doctor Consultation Notes & EMR', 'Pharmacy Dispensing & Stock',
                'Laboratory Test Results', 'Clinical Tariff Pricing', 'Inpatient Ward Management',
                'NHIF & Insurance Claims', 'Medical Billing & Receipts'
              ].map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm text-slate-700">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
