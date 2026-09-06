import React from 'react';
import { Star, Quote, Building2, GraduationCap, Stethoscope } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      quote: "DAVETECH revolutionized how we manage student admissions, CBC gradebooks, and M-Pesa fee collections. Fee collection efficiency jumped by 40% in our first term.",
      author: "Dr. Elizabeth Mutua",
      title: "Principal, St. Austin’s Academy & High School",
      icon: GraduationCap,
      badge: "Education ERP"
    },
    {
      quote: "Managing patient triage, EMR doctor notes, and NHIF insurance claims used to require three different software systems. DAVETECH unifies everything into one blazing-fast platform.",
      author: "Dr. Samuel Ochieng",
      title: "Medical Director, Metropolitan Health Clinic & Hospital",
      icon: Stethoscope,
      badge: "Healthcare EMR"
    },
    {
      quote: "With multi-branch inventory sync and lightning-fast POS checkout, our retail stores across Nairobi and Mombasa operate with absolute financial visibility.",
      author: "Amina Kassim",
      title: "Operations Director, Savanna Retail & Wholesale Group",
      icon: Building2,
      badge: "Business & POS"
    }
  ];

  return (
    <section className="py-24 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            Customer Success Stories
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Trusted by Industry Leaders
          </h2>
          <p className="text-slate-400 text-base">
            See how organizations across education, healthcare, and retail achieve operational excellence with DAVETECH.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => {
            const Icon = t.icon;
            return (
              <div
                key={idx}
                className="bg-slate-900 border border-slate-800 p-8 rounded-3xl flex flex-col justify-between relative shadow-xl hover:border-slate-700 transition-all"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                      {t.badge}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-amber-400 pt-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>

                  <p className="text-slate-300 text-sm leading-relaxed italic">
                    "{t.quote}"
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-800">
                  <div className="font-bold text-white text-sm">{t.author}</div>
                  <div className="text-slate-400 text-xs mt-0.5">{t.title}</div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
