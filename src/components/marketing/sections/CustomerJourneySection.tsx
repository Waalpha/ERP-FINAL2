import React from 'react';
import { Layers, Building, Sliders, Users, CheckCircle2, ArrowRight } from 'lucide-react';

export const CustomerJourneySection: React.FC = () => {
  const steps = [
    { num: '01', title: 'Choose Your Solution', desc: 'Select your vertical—School, College, Hospital, Retail, or Enterprise.', icon: Layers },
    { num: '02', title: 'Create Organization', desc: 'Instantly provision your secure multi-tenant workspace and subdomain.', icon: Building },
    { num: '03', title: 'Configure Modules', desc: 'Toggle the exact modules you need, from M-Pesa billing to EMR triage.', icon: Sliders },
    { num: '04', title: 'Invite Your Team', desc: 'Assign precise role-based access for teachers, admins, cashiers, and staff.', icon: Users },
    { num: '05', title: 'Start Managing', desc: 'Run your entire organization with real-time analytics and automated workflows.', icon: CheckCircle2 }
  ];

  return (
    <section className="py-24 bg-slate-900 border-t border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
            Seamless Onboarding
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Up and Running in Minutes.
          </h2>
          <p className="text-slate-400 text-base">
            Transitioning your institution or business to DAVETECH Cloud is structured, fast, and fully supported by our technical experts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="bg-slate-950/80 border border-slate-800 p-6 rounded-2xl relative flex flex-col justify-between group hover:border-indigo-500/50 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-2xl font-black text-indigo-400/40 font-mono">{step.num}</span>
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    {step.desc}
                  </p>
                </div>
                
                {idx < steps.length - 1 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-slate-700">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
