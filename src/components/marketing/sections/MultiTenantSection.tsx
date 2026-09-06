import React from 'react';
import { Layers, ShieldCheck, Database, Globe, Lock, Cpu, RefreshCw, CheckCircle2 } from 'lucide-react';

export const MultiTenantSection: React.FC = () => {
  const features = [
    { title: 'Independent Organizations', desc: 'Each school, hospital, or company operates in its own isolated workspace.', icon: Layers },
    { title: 'Complete Data Isolation', desc: 'Firestore subcollection partitioning ensures strict tenant privacy and security.', icon: Database },
    { title: 'Secure Provisioning', desc: 'Instant workspace creation with automated subdomain allocation.', icon: ShieldCheck },
    { title: 'Custom Domains', desc: 'Map your own custom domains (e.g., erp.yourinstitution.ac.ke).', icon: Globe },
    { title: 'Role-Based Access', desc: 'Granular permissions for Super Admins, Principals, Accountants, and Staff.', icon: Lock },
    { title: 'Central Super Admin', desc: 'Platform-wide telemetry, subscription tiers, and system controls.', icon: Cpu },
    { title: 'Cloud Infrastructure', desc: 'Hosted on enterprise cloud run containers with auto-scaling.', icon: RefreshCw },
    { title: 'Automated Backups', desc: 'Continuous Firestore snapshots and encrypted audit trails.', icon: CheckCircle2 }
  ];

  return (
    <section className="py-24 bg-slate-900 border-t border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
            Enterprise Architecture
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Advanced Multi-Tenant Cloud Platform
          </h2>
          <p className="text-slate-400 text-base">
            Engineered for massive scalability, strict data security, and complete organizational autonomy.
          </p>
        </div>

        {/* Visual Diagram */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="text-center space-y-3 mb-10 relative z-10">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-indigo-600/30">
              <Cpu className="w-5 h-5" /> DAVETECH MASTER PLATFORM ENGINE
            </div>
            <div className="w-0.5 h-10 bg-gradient-to-b from-indigo-500 to-slate-700 mx-auto" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 relative z-10">
            {[
              { name: 'Schools', type: 'Primary & High' },
              { name: 'Colleges', type: 'TVET & Univ' },
              { name: 'Hospitals', type: 'EMR & Clinics' },
              { name: 'Retail', type: 'POS & Shops' },
              { name: 'Wholesale', type: 'Distribution' },
              { name: 'Enterprises', type: 'Corporations' }
            ].map((node, i) => (
              <div key={i} className="bg-slate-900 border border-slate-800 hover:border-indigo-500/50 p-4 rounded-xl text-center transition-all group">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto mb-2 font-bold text-xs group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  0{i+1}
                </div>
                <div className="text-white font-semibold text-sm">{node.name}</div>
                <div className="text-slate-400 text-[11px] mt-0.5">{node.type}</div>
                <div className="mt-3 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 py-0.5 px-2 rounded-full inline-block">
                  Isolated Tenant
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div key={idx} className="bg-slate-950/80 border border-slate-800 p-6 rounded-xl hover:border-slate-700 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-white font-bold text-base mb-1">{feat.title}</h3>
                <p className="text-slate-400 text-xs leading-relaxed">{feat.desc}</p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
