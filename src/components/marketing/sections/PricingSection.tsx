import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { DEFAULT_PUBLIC_WEBSITE_CONTENT } from '../../../types';
import { CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';

interface PricingSectionProps {
  onOpenDemo: (plan?: string) => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onOpenDemo }) => {
  const { platformSettings, subscriptionTiers } = useAuth();
  const content = platformSettings?.publicWebsiteContent || DEFAULT_PUBLIC_WEBSITE_CONTENT;
  const [isAnnual, setIsAnnual] = useState(true);

  // Map system subscription tiers to marketing card display format
  const plans = subscriptionTiers.map((tier) => {
    const isPopular = tier.isPopular;
    const isEnterprise = tier.id === 'ENTERPRISE';

    return {
      name: tier.name,
      id: tier.id,
      tagline: tier.tagline,
      monthlyPrice: `${tier.currency} ${tier.priceMonthly.toLocaleString()}`,
      annualPrice: `${tier.currency} ${tier.priceAnnual.toLocaleString()}`,
      period: isEnterprise ? 'tailored pricing' : 'per month',
      badge: isPopular ? 'Most Popular' : isEnterprise ? 'Maximum Power' : 'Quick Start',
      features: [
        tier.maxLearnersOrRecords,
        tier.maxStaffAccounts,
        `${tier.maxStorageGB} GB Cloud Storage`,
        tier.supportSLA,
        ...tier.features
      ],
      color: isPopular
        ? 'border-indigo-600 bg-slate-900 text-white shadow-xl relative ring-2 ring-indigo-500/30'
        : 'border-slate-200 bg-white text-slate-900 shadow-sm',
      buttonBg: isPopular
        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-600/30'
        : isEnterprise
        ? 'bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300'
        : 'bg-slate-900 hover:bg-slate-800 text-white'
    };
  });

  return (
    <section id="pricing" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-700 bg-indigo-100 px-3 py-1 rounded-full border border-indigo-200">
            Transparent SaaS Pricing
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            {content.pricingTitle}
          </h2>
          <p className="text-slate-600 text-base">
            {content.pricingSubtitle}
          </p>

          {/* Billing Toggle */}
          <div className="pt-4 flex items-center justify-center gap-3">
            <span className={`text-sm ${!isAnnual ? 'text-white font-semibold' : 'text-slate-400'}`}>Monthly Billing</span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="w-14 h-8 bg-slate-800 rounded-full p-1 relative transition-colors"
            >
              <div className={`w-6 h-6 rounded-full bg-indigo-500 transition-transform ${isAnnual ? 'translate-x-6 bg-gradient-to-r from-indigo-500 to-purple-500' : 'translate-x-0'}`} />
            </button>
            <span className={`text-sm flex items-center gap-1.5 ${isAnnual ? 'text-white font-semibold' : 'text-slate-400'}`}>
              Annual Billing <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Save 15%</span>
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`border rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 hover:border-indigo-500/50 ${plan.color}`}
            >
              {plan.badge === 'Most Popular' && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold tracking-wide uppercase shadow-lg">
                  Most Popular Choice
                </div>
              )}

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white tracking-tight">{plan.name}</h3>
                  <span className="text-xs font-medium px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {plan.badge}
                  </span>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed">{plan.tagline}</p>

                <div className="py-4 border-t border-b border-slate-800">
                  <div className="text-3xl sm:text-4xl font-extrabold text-white">
                    {isAnnual ? plan.annualPrice : plan.monthlyPrice}
                  </div>
                  <div className="text-slate-400 text-xs mt-1 font-mono">{plan.period} {isAnnual && plan.monthlyPrice !== 'Custom' ? 'billed annually' : ''}</div>
                </div>

                <div className="space-y-3">
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Included Features:</div>
                  {plan.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8 mt-8 border-t border-slate-800">
                <button
                  onClick={() => onOpenDemo(plan.name)}
                  className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${plan.buttonBg}`}
                >
                  Get Started with {plan.name} <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Enterprise custom banner */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center max-w-4xl mx-auto space-y-4">
          <h3 className="text-xl font-bold text-white">Custom Solutions for Large Organizations & Ministries of Education</h3>
          <p className="text-slate-400 text-sm max-w-2xl mx-auto">
            Need a dedicated private cloud deployment, multi-region database replication, or custom API integrations? Our enterprise engineering team is ready.
          </p>
          <div className="pt-2">
            <button
              onClick={() => onOpenDemo('ENTERPRISE_CUSTOM')}
              className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-colors"
            >
              Contact Enterprise Sales <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
