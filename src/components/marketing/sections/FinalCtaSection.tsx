import React from 'react';
import { ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';

interface FinalCtaSectionProps {
  onOpenDemo: () => void;
}

export const FinalCtaSection: React.FC<FinalCtaSectionProps> = ({ onOpenDemo }) => {
  return (
    <section className="py-24 bg-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 via-purple-600/10 to-teal-500/10 blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium">
          <Sparkles className="w-4 h-4 text-indigo-400" /> Start Your Enterprise Transformation Today
        </div>

        <h2 className="text-3xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
          Ready to Transform How You Manage Your Organization?
        </h2>

        <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Join hundreds of schools, colleges, hospitals, and enterprises running on DAVETECH Cloud ERP. Provision your secure workspace in seconds.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={onOpenDemo}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-8 py-4 rounded-xl font-bold text-base shadow-xl shadow-indigo-600/30 transition-all transform hover:-translate-y-0.5"
          >
            Book a Free Demo <ArrowRight className="w-5 h-5" />
          </button>
          <button
            onClick={onOpenDemo}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white px-8 py-4 rounded-xl font-semibold text-base border border-slate-800 transition-all"
          >
            Talk to Our Team
          </button>
        </div>

        <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
          <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-400" /> No credit card required</span>
          <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-400" /> Instant sandbox provisioning</span>
          <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-400" /> Dedicated onboarding engineer</span>
        </div>
      </div>
    </section>
  );
};
