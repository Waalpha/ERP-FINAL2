import React from 'react';
import {
  Code,
  Cpu,
  Layers,
  Sparkles,
  ShieldCheck,
  Zap,
  ArrowRight,
  Database,
  Cloud,
  Smartphone,
  Server,
  GitBranch,
  CheckCircle2
} from 'lucide-react';

interface CustomSoftwarePageProps {
  onNavigate: (route: string) => void;
}

export const CustomSoftwarePage: React.FC<CustomSoftwarePageProps> = ({
  onNavigate
}) => {
  const capabilities = [
    {
      title: 'Bespoke Enterprise Web & Mobile Apps',
      desc: 'Tailored systems built with modern, ultra-fast frameworks (React, Node, Cloud Run) that align 100% with your exact organizational workflow.',
      icon: Smartphone
    },
    {
      title: 'Custom ERP & Workflow Automation',
      desc: 'Replace fragmented spreadsheets with high-throughput cloud dashboards, automated approvals, and custom KPI reporting engines.',
      icon: Layers
    },
    {
      title: 'API Integrations & Payment Gateways',
      desc: 'Seamless integration with Safaricom Daraja M-Pesa APIs, banks, SMS gateways, KRA eTIMS, and third-party accounting systems.',
      icon: Zap
    },
    {
      title: 'Multi-Tenant SaaS Architecture',
      desc: 'Design and deploy robust multi-tenant platforms with zero-trust database isolation, custom domain provisioning, and automated billing.',
      icon: Database
    },
    {
      title: 'Legacy Software Modernization',
      desc: 'Re-platform outdated desktop or on-premise systems to high-availability serverless cloud infrastructure with zero downtime migration.',
      icon: Cloud
    },
    {
      title: 'AI & Data Intelligence Solutions',
      desc: 'Automate document processing, student / patient analytics, fraud detection, and operational forecasting with integrated intelligence.',
      icon: Sparkles
    }
  ];

  return (
    <div className="text-slate-200">
      {/* Hero */}
      <section className="relative py-24 border-b border-slate-800 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.15),transparent_50%)]" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold mb-6">
              <Code className="w-3.5 h-3.5" />
              <span>BESPOKE ENGINEERING & CLOUD ARCHITECTURE</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
              Custom Software Engineered for Your Exact Competitive Edge
            </h1>
            <p className="mt-6 text-lg text-slate-400 leading-relaxed font-light">
              When off-the-shelf software doesn't fit your operational scale, Davetech Solutions crafts high-performance web applications, distributed APIs, and custom enterprise tools that drive measurable business outcomes.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <button
                onClick={() => onNavigate('contact')}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-bold shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
              >
                Request Custom Solution Architecture <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onNavigate('contact')}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-sm font-semibold transition-all cursor-pointer"
              >
                Talk to Lead Engineers
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="py-20 bg-slate-950 border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-white">What We Build</h2>
            <p className="text-slate-400 mt-3 text-sm">
              Full-cycle engineering from product discovery and cloud systems design to deployment and 24/7 SLA maintenance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {capabilities.map((cap, idx) => {
              const Icon = cap.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-purple-500/40 transition-all space-y-3 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-all">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">
                    {cap.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{cap.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Engineering Standards */}
      <section className="py-20 bg-slate-900/50 border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-xs font-mono text-purple-400 uppercase tracking-widest bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
                DEVELOPMENT METHODOLOGY
              </span>
              <h2 className="text-3xl font-extrabold text-white">
                Enterprise Standards from Line One
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                We don't cut corners with brittle prototypes. Every custom project is treated as mission-critical enterprise software:
              </p>

              <div className="space-y-3">
                {[
                  'Clean architecture with decoupled business logic and strict typing',
                  'Rigorous automated test coverage and zero-downtime CI/CD pipelines',
                  'End-to-end audit logging and SOC2 / GDPR data residency compliance',
                  'Full IP ownership transferred to your enterprise upon delivery'
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                    <span className="text-xs text-slate-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-slate-950 border border-slate-800 space-y-6 shadow-2xl">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-rose-500" />
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-[11px] font-mono text-slate-500 ml-2">architecture-stack.ts</span>
              </div>
              <pre className="text-xs font-mono text-slate-300 bg-slate-900/90 p-4 rounded-xl overflow-x-auto leading-relaxed border border-slate-800/80">
{`// Davetech Engineering Stack
export const EnterpriseStack = {
  frontend: ['React 18', 'TypeScript', 'Tailwind CSS'],
  cloudCompute: ['Google Cloud Run', 'Distributed Edge Containers'],
  dataEngine: ['Cloud Firestore', 'Cloud SQL PostgreSQL'],
  integrations: ['M-Pesa Daraja 3.0', 'KRA eTIMS', 'Bank APIs'],
  security: ['Zero-Trust RBAC', 'AES-256', 'Automated Let\\'s Encrypt TLS']
};`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-slate-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-purple-950/60 via-slate-900 to-indigo-950/60 border border-purple-500/20 text-center space-y-6">
            <h3 className="text-2xl sm:text-3xl font-bold text-white">
              Have a complex software challenge or technical requirement?
            </h3>
            <p className="text-slate-300 text-sm max-w-2xl mx-auto">
              Schedule an architecture discovery session with our senior engineers to define scope, milestones, and system design.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => onNavigate('contact')}
                className="px-6 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
              >
                Schedule Technical Discovery
              </button>
              <button
                onClick={() => onNavigate('contact')}
                className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm border border-slate-700 transition-all cursor-pointer"
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
