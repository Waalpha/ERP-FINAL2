import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does multi-tenant data isolation work in DAVETECH?',
      a: 'DAVETECH uses secure Firestore subcollection partitioning and subdomain routing. Each organization (tenant) operates in its own dedicated workspace with strict access controls, ensuring complete data privacy and zero cross-tenant visibility.'
    },
    {
      q: 'Can we integrate M-Pesa and local bank payments for school fees or retail POS?',
      a: 'Yes! DAVETECH includes built-in M-Pesa STK push and bank receipt reconciliation. Payments made by parents or customers automatically reconcile against student invoices and POS receipts in real time.'
    },
    {
      q: 'Can we map our own custom domain (e.g., portal.ourinstitution.ac.ke)?',
      a: 'Yes, professional and enterprise tiers support custom domain mapping with automated Let’s Encrypt TLS SSL certificate provisioning.'
    },
    {
      q: 'How long does it take to migrate our existing student records or inventory data?',
      a: 'Our onboarding engineering team provides CSV and Excel migration templates. Most organizations complete full data import and staff training within 24 to 48 hours.'
    },
    {
      q: 'Is DAVETECH suitable for both small businesses and large universities?',
      a: 'Absolutely. DAVETECH is architected to scale seamlessly. Our modular design allows small clinics or retail shops to start with core modules, while universities and hospitals can activate advanced modules as needed.'
    }
  ];

  return (
    <section className="py-24 bg-slate-900 border-t border-b border-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="text-center space-y-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
            Frequently Asked Questions
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Got Questions? We Have Answers.
          </h2>
          <p className="text-slate-400 text-sm">
            Everything you need to know about DAVETECH Enterprise ERP deployment, security, and pricing.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left gap-4 hover:bg-slate-900/50 transition-colors"
                >
                  <span className="text-white font-bold text-base">{faq.q}</span>
                  <div className={`w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-indigo-400' : ''}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 text-slate-300 text-sm leading-relaxed border-t border-slate-900 pt-4">
                    {faq.a}
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
