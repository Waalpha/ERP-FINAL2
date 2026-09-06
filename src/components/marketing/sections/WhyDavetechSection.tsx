import React from 'react';
import { Shield, Zap, Database, TrendingUp, Layers, Cloud, Globe, CheckCircle2 } from 'lucide-react';

export const WhyDavetechSection: React.FC = () => {
  const cards = [
    { title: 'One Login. One Platform.', desc: 'Seamlessly switch between multi-tenant workspaces and administrative modules without re-authenticating.', icon: Zap, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
    { title: 'Built to Scale', desc: 'From a boutique clinic with 5 staff to a university with 15,000 students, DAVETECH scales effortlessly.', icon: TrendingUp, color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' },
    { title: 'Your Data. Fully Isolated.', desc: 'Enterprise-grade Firestore subcollection partitioning ensures zero data leakage between organizations.', icon: Database, color: 'text-teal-400 bg-teal-500/10 border-teal-500/20' },
    { title: 'Real-Time Insights', desc: 'Instant telemetry, cash flow analytics, and operational dashboards updated in real time.', icon: Layers, color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
    { title: 'Works Across Multiple Branches', desc: 'Manage multiple school campuses, retail outlets, or hospital clinics from a single centralized dashboard.', icon: Globe, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
    { title: 'Secure Cloud Infrastructure', desc: 'Deployed on managed container instances with 99.99% uptime and continuous automated backups.', icon: Cloud, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
    { title: 'Designed for Africa & Global', desc: 'Built-in M-Pesa STK push, regional tax calculations (PAYE/VAT), and multi-currency support.', icon: Shield, color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' }
  ];

  return (
    <section className="py-24 bg-slate-900 border-t border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
            The DAVETECH Advantage
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Why Leading Institutions Choose DAVETECH
          </h2>
          <p className="text-slate-400 text-base">
            Discover why organizations across Africa and beyond trust DAVETECH to run their mission-critical operations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className="bg-slate-950/80 border border-slate-800/80 hover:border-slate-700 p-8 rounded-2xl transition-all duration-300 group hover:-translate-y-1 shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-6 ${card.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-slate-400 text-sm mt-3 leading-relaxed">
                    {card.desc}
                  </p>
                </div>
                <div className="pt-6 mt-6 border-t border-slate-800/80 flex items-center gap-2 text-xs text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" /> Enterprise Standard
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
