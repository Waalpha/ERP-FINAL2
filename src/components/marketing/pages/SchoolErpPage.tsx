import React from 'react';
import {
  School,
  CheckCircle2,
  ArrowRight,
  GraduationCap,
  Calendar,
  CreditCard,
  Users,
  FileSpreadsheet,
  MessageSquare,
  ShieldCheck,
  Zap,
  Sparkles
} from 'lucide-react';

interface SchoolErpPageProps {
  onNavigate: (route: string) => void;
}

export const SchoolErpPage: React.FC<SchoolErpPageProps> = ({
  onNavigate
}) => {
  return (
    <div className="text-slate-200">
      {/* Hero */}
      <section className="relative py-24 border-b border-slate-800 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.15),transparent_50%)]" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-6">
              <School className="w-3.5 h-3.5" />
              <span>DAVETECH SCHOOL MANAGEMENT ERP</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
              Kenyan CBC & 8-4-4 School Management Made Effortless
            </h1>
            <p className="mt-6 text-lg text-slate-400 leading-relaxed font-light">
              A comprehensive cloud ERP built specifically for primary, junior, and secondary schools. From competency-based rubrics and automated grade transcripts to term fee invoicing and instant M-Pesa automated receipts.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <button
                onClick={() => onNavigate('contact')}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
              >
                Get Started with School ERP <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onNavigate('solutions')}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-sm font-semibold transition-all cursor-pointer"
              >
                View All Solutions
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-20 bg-slate-950 border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-white">Engineered for Academic Excellence</h2>
            <p className="text-slate-400 mt-3 text-sm">
              Say goodbye to lost paper records, manual ledger balancing, and chaotic term-end report card production.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">CBC Competency Rubrics</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Full support for Kenya’s Competency-Based Curriculum (CBC). Score students by strands, sub-strands, formative assessments, and generate Ministry-compliant reports with single clicks.
              </p>
              <ul className="space-y-2 pt-2 border-t border-slate-800/80 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Exceeding / Meeting / Approaching Expectations</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Automated teacher comments & values rubric</span>
                </li>
              </ul>
            </div>

            <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Automated Fee Invoicing</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Set up fee structures by grade and term. Issue automated digital invoices, reconcile incoming M-Pesa paybill transactions automatically, and send instant receipt SMS to parents.
              </p>
              <ul className="space-y-2 pt-2 border-t border-slate-800/80 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Automated term invoice generation</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>M-Pesa STK push & bank statement reconciliations</span>
                </li>
              </ul>
            </div>

            <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Admissions & Attendance</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Effortlessly manage student profiles, stream allocations (e.g. 1 East, 1 West), medical information, parent contacts, daily biometric attendance, and staff timetables.
              </p>
              <ul className="space-y-2 pt-2 border-t border-slate-800/80 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Instant student registration & NEMIS/UPI tracking</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Daily attendance logs with absent parent alerts</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Checklist */}
      <section className="py-20 bg-slate-900/40 border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="text-xs font-mono text-blue-400 uppercase tracking-wider font-bold">ALL-IN-ONE EDUCATIONAL CLOUD</span>
              <h3 className="text-2xl sm:text-3xl font-bold text-white">Why Headteachers and Bursars Choose Davetech</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Davetech ERP replaces fragmented spreadsheets and disjointed tools with a unified platform built specifically for African academic calendars and statutory rules.
              </p>
              <div className="space-y-2.5 pt-2">
                {[
                  '100% compliant with Ministry of Education CBC guidelines',
                  'Instant bulk SMS fee reminders and term opening alerts',
                  'Board of Management (BOM) and staff payroll engine',
                  'Library management with barcode book checkout',
                  'Boarding house & hostel dormitory allocations',
                  'Role-based access for Principals, Teachers, and Accountants'
                ].map((item, i) => (
                  <div key={i} className="flex items-center space-x-2.5 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
              <h4 className="text-sm font-bold text-white">Request an Institutional Consultation</h4>
              <p className="text-xs text-slate-400">
                Discuss our live CBC grading calculator and fee billing portal for your school’s exact curriculum and stream setup.
              </p>
              <div className="space-y-3 pt-2">
                <button
                  onClick={() => onNavigate('contact')}
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all cursor-pointer text-center"
                >
                  Request School Consultation
                </button>
                <button
                  onClick={() => onNavigate('contact')}
                  className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 font-semibold text-xs transition-colors cursor-pointer text-center"
                >
                  Contact Our Education Team
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
