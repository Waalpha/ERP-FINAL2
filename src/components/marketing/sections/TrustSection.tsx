import React from 'react';
import { GraduationCap, Building2, Stethoscope, ShoppingCart, Truck, Briefcase, Award, ShieldCheck } from 'lucide-react';

export const TrustSection: React.FC = () => {
  const industries = [
    { title: 'Primary & High Schools', desc: 'Admissions, CBC report cards, fee structures & M-Pesa billing', icon: GraduationCap, color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' },
    { title: 'Colleges & Universities', desc: 'Semesters, courses, student portals, LMS & transcripts', icon: Building2, color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
    { title: 'Hospitals & Clinics', desc: 'EMR, triage, doctors, pharmacy, lab & insurance billing', icon: Stethoscope, color: 'text-teal-400 bg-teal-500/10 border-teal-500/20' },
    { title: 'Retail Shops & POS', desc: 'Lightning POS checkout, inventory, barcode scanner & receipts', icon: ShoppingCart, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
    { title: 'Wholesale & Warehouses', desc: 'Multi-branch stock transfer, purchasing & supplier CRM', icon: Truck, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
    { title: 'Enterprise Corporations', desc: 'HR, payroll, general ledger, accounting & audit logs', icon: Briefcase, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' }
  ];

  return (
    <section className="py-20 bg-slate-900 border-t border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-300 border border-teal-500/20">
            <ShieldCheck className="w-3.5 h-3.5" /> Trusted Across East Africa & Global Markets
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            One Platform. Built for Every Industry.
          </h2>
          <p className="text-slate-400 text-base">
            Whether you run a 500-student academy, a multi-specialty hospital, or a growing retail chain, DAVETECH provides purpose-built modules that scale effortlessly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {industries.map((ind, idx) => {
            const Icon = ind.icon;
            return (
              <div
                key={idx}
                className="bg-slate-950/80 border border-slate-800/80 hover:border-slate-700 p-6 rounded-2xl transition-all duration-300 group hover:-translate-y-1 shadow-lg"
              >
                <div className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-5 ${ind.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                  {ind.title}
                </h3>
                <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                  {ind.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
