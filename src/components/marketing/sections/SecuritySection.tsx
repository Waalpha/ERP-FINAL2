import React from 'react';
import { Shield, Lock, Database, History, Cloud, Key, CheckCircle2 } from 'lucide-react';

export const SecuritySection: React.FC = () => {
  const securityItems = [
    { title: 'Tenant Isolation', desc: 'Strict database partitioning ensures that organization data remains completely siloed.', icon: Database },
    { title: 'Role-Based Permissions (RBAC)', desc: 'Assign precise access privileges for administrators, teachers, cashiers, and doctors.', icon: Lock },
    { title: 'Secure Authentication', desc: 'Encrypted credential management with session token validation and secure cookies.', icon: Key },
    { title: 'Immutable Audit Logs', desc: 'Comprehensive event trails recording every transaction, admission, and settings update.', icon: History },
    { title: 'Automated Cloud Backups', desc: 'Continuous data snapshots stored in redundant enterprise cloud storage vaults.', icon: Cloud },
    { title: 'Encrypted Communication', desc: 'All data in transit is encrypted using modern TLS 1.3 cryptographic protocols.', icon: Shield }
  ];

  return (
    <section className="py-24 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            Military-Grade Security
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Enterprise Security Built Into Every Layer.
          </h2>
          <p className="text-slate-400 text-base">
            We safeguard your institutional data with uncompromising protection standards, regular penetration testing, and zero-trust architecture.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {securityItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-slate-900 border border-slate-800 p-8 rounded-2xl hover:border-emerald-500/50 transition-colors group shadow-lg"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-6 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Security Compliance Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 border border-indigo-500/30 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl font-bold text-white">Need custom compliance or data residency?</h3>
            <p className="text-slate-400 text-sm">DAVETECH supports on-premise hybrid deployments and dedicated VPC cloud instances for large institutions.</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4" /> ISO 27001 Compliant
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};
