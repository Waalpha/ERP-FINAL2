import React from 'react';
import {
  School,
  ShoppingBag,
  Briefcase,
  GraduationCap,
  Activity,
  Code2,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Layers
} from 'lucide-react';

interface SolutionsPageProps {
  onNavigate: (route: string) => void;
}

export const SolutionsPage: React.FC<SolutionsPageProps> = ({
  onNavigate
}) => {
  const solutions = [
    {
      id: 'school-erp',
      title: 'School Management ERP',
      subtitle: 'K-12, Secondary & CBC Institutions',
      description: 'Comprehensive academic, fee invoicing, CBC rubric assessment, student admissions, attendance, and parent communication suite.',
      icon: School,
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
      route: 'school-erp',
      features: [
        'CBC Formative & Summative Rubric Grading',
        'Automatic Fee Invoicing & M-Pesa Receipts',
        'Class Streams, Attendance & Biometrics',
        'Ministry-Compliant Automated Report Cards',
        'Parent Portal & Bulk SMS Notifications'
      ]
    },
    {
      id: 'retail-pos',
      title: 'Retail POS & Stock Control',
      subtitle: 'Supermarkets, Bars, Boutiques & Hardware',
      description: 'Ultra-fast cashier checkout terminal with barcode integration, multi-branch inventory tracking, shift cash reconciliations, and split payments.',
      icon: ShoppingBag,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      route: 'retail-pos',
      features: [
        'Rapid Cashier Register with Barcode Scanning',
        'Shift Open/Close Cash Drawer Balancing',
        'Real-Time Stock Alerts & Purchase Orders',
        'Instant M-Pesa STK Push & Receipt Printing',
        'Multi-Outlet & Central Warehouse Sync'
      ]
    },
    {
      id: 'business',
      title: 'Business Management Suite',
      subtitle: 'Corporate, SMEs & Professional Services',
      description: 'Full-fledged double-entry accounting, statutory payroll (PAYE, NSSF, SHIF), invoicing, procurement, and executive KPI reporting.',
      icon: Briefcase,
      color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30',
      route: 'business',
      features: [
        'Double-Entry Accounting & General Ledger',
        'Customer Invoices, Quotations & Receivables',
        'Automated Kenyan Statutory Payroll',
        'Expense Tracking & Vendor Payables',
        'Financial Statements (P&L, Balance Sheet)'
      ]
    },
    {
      id: 'college',
      title: 'Higher Education & TVET ERP',
      subtitle: 'Colleges, Universities & Institutes',
      description: 'Departmental billing, semester course registrations, hostel allocations, student portals, and graduation transcript processing.',
      icon: GraduationCap,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      route: 'contact',
      features: [
        'Semester Course Catalog & Unit Registration',
        'Departmental Revenue & Fee Ledger Allocation',
        'Campus Hostel Room & Facility Management',
        'Faculty Grade Submissions & Transcripts',
        'Library Catalog & Resource Lending'
      ]
    },
    {
      id: 'hospital',
      title: 'Clinical EMR & Hospital ERP',
      subtitle: 'Clinics, Medical Centers & Pharmacies',
      description: 'Electronic medical records, outpatient triage, doctor consultation workflows, pharmacy stock dispensing, and insurance billing.',
      icon: Activity,
      color: 'text-teal-400 bg-teal-500/10 border-teal-500/30',
      route: 'contact',
      features: [
        'Outpatient Patient Registry & Triage Vitals',
        'Doctor Consultation & Digital Prescriptions',
        'Pharmacy Inventory & Batch Expiry Tracking',
        'Laboratory Investigations & Diagnostic Files',
        'Insurance Scheme & Cash Tariff Billing'
      ]
    },
    {
      id: 'custom',
      title: 'Custom Software & APIs',
      subtitle: 'Bespoke Cloud Systems & Integrations',
      description: 'Custom-built enterprise microservices, mobile applications, payment gateway integrations, and third-party API connectivity.',
      icon: Code2,
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
      route: 'contact',
      features: [
        'Custom Microservices & Serverless APIs',
        'iOS & Android Cross-Platform Mobile Apps',
        'Custom Third-Party & Bank Integrations',
        'Legacy Data Migration & ETL Pipelines',
        'Dedicated SLA & 24/7 DevOps Support'
      ]
    }
  ];

  return (
    <div className="text-slate-200">
      {/* Header */}
      <section className="relative py-24 border-b border-slate-800 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-6">
            <Layers className="w-3.5 h-3.5" />
            <span>ENTERPRISE PRODUCT DIRECTORY</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            Tailored Solutions for Every Industry
          </h1>
          <p className="mt-4 text-slate-400 text-base sm:text-lg">
            Explore Davetech’s purpose-built ERP systems engineered to satisfy the exact regulatory and operational demands of your sector.
          </p>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="py-20 bg-slate-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {solutions.map((sol) => {
              const Icon = sol.icon;
              return (
                <div
                  key={sol.id}
                  className="p-8 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/40 transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    <div className={`w-12 h-12 rounded-xl border flex items-center justify-center ${sol.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>

                    <div>
                      <span className="text-[11px] font-mono text-indigo-400 font-semibold tracking-wide uppercase">
                        {sol.subtitle}
                      </span>
                      <h3 className="text-xl font-bold text-white mt-1 group-hover:text-indigo-300 transition-colors">
                        {sol.title}
                      </h3>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed">
                      {sol.description}
                    </p>

                    <div className="pt-4 border-t border-slate-800/80 space-y-2">
                      {sol.features.map((feat, idx) => (
                        <div key={idx} className="flex items-start space-x-2 text-xs text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-slate-800 flex items-center justify-between">
                    <button
                      onClick={() => onNavigate(sol.route)}
                      className="text-xs font-bold text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-all cursor-pointer"
                    >
                      <span>Explore Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onNavigate('contact')}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Get Started
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-slate-900/50 border-t border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl font-bold text-white">Need a Custom Combination or Enterprise Setup?</h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Our multi-tenant platform supports modular configuration. Activate only the modules you need and integrate with your existing infrastructure seamlessly.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => onNavigate('contact')}
              className="px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
            >
              Request Custom Proposal
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className="px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold border border-slate-700 transition-all cursor-pointer"
            >
              Speak to an Architect
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
