import React from 'react';
import {
  ShieldCheck,
  Server,
  Zap,
  Globe2,
  Users,
  Award,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Lock,
  Layers,
  MapPin,
  Building2
} from 'lucide-react';

interface AboutPageProps {
  onOpenAuthModal: () => void;
  onNavigate: (route: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({
  onOpenAuthModal,
  onNavigate
}) => {
  return (
    <div className="text-slate-200">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden border-b border-slate-800 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.15),transparent_50%)]" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-6">
              <Cpu className="w-3.5 h-3.5" />
              <span>ABOUT DAVETECH SOLUTIONS LTD</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
              Enterprise Cloud ERP Architected for Africa & Global Scale
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-slate-400 leading-relaxed font-light">
              Davetech Solutions is a pioneering enterprise software and cloud engineering company headquartered in Nairobi, Kenya. We design mission-critical multi-tenant ERP software for schools, TVET colleges, hospitals, retail chains, and commercial businesses.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <button
                onClick={() => onNavigate('contact')}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
              >
                Schedule Enterprise Consultation <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onNavigate('solutions')}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-sm font-semibold transition-all cursor-pointer"
              >
                Explore Product Suite
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-slate-950 border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Globe2 className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-white">Our Mission</h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                To empower African and global institutions with robust, zero-trust cloud ERP software that eliminates administrative bottlenecks, automates financial reconciliation, and delivers seamless digital experiences for administrators, staff, and customers.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-white">Our Vision</h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                To be the primary operating system for institutions across East Africa and emerging markets, setting the gold standard for multi-tenant data privacy, M-Pesa automated billing, and localized competency-based reporting.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Engineering Pillars */}
      <section className="py-20 bg-slate-900/50 border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-white">The Davetech Engineering Advantage</h2>
            <p className="text-slate-400 mt-3 text-sm">
              Built from first principles to withstand unreliable connections, massive concurrency, and strict statutory tax laws.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Lock className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white">Zero-Trust Partitioning</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Every tenant functions in an isolated database environment with strict security rules. There is zero risk of data leakage or cross-contamination between organizations.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Server className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white">Localized Financial Engine</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Native integrations with Safaricom M-Pesa STK Push, bank API webhooks, and KRA eTIMS readiness ensure immediate, automated cash matching.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Layers className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white">99.99% Cloud Resilience</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Serverless distributed infrastructure with automated failover, millisecond response times, and offline POS register syncing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership & Physical Presence */}
      <section className="py-20 bg-slate-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-indigo-950/60 via-slate-900 to-purple-950/60 border border-indigo-500/20 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-xl">
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono uppercase tracking-wider">
                <MapPin className="w-4 h-4 text-rose-400" />
                <span>Nairobi, Kenya • East Africa Tech Hub</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white">
                Ready to transform your organizational operations?
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Connect with our system architects in Nairobi for a personalized consultation tailored to your exact school, retail chain, or corporate setup.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <button
                onClick={() => onNavigate('contact')}
                className="px-6 py-3.5 rounded-xl bg-white text-slate-950 font-bold text-sm hover:bg-slate-100 transition-all text-center shadow-lg cursor-pointer"
              >
                Request Consultation
              </button>
              <button
                onClick={() => onNavigate('contact')}
                className="px-6 py-3.5 rounded-xl bg-slate-900 text-white font-semibold text-sm border border-slate-700 hover:bg-slate-800 transition-all text-center cursor-pointer"
              >
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
