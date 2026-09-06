import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { HeroSection } from './sections/HeroSection';
import { TrustSection } from './sections/TrustSection';
import { SolutionsSection } from './sections/SolutionsSection';
import { MultiTenantSection } from './sections/MultiTenantSection';
import { ModulesGridSection } from './sections/ModulesGridSection';
import { WhyDavetechSection } from './sections/WhyDavetechSection';
import { SecuritySection } from './sections/SecuritySection';
import { AnalyticsSection } from './sections/AnalyticsSection';
import { PricingSection } from './sections/PricingSection';
import { CustomerJourneySection } from './sections/CustomerJourneySection';
import { TestimonialsSection } from './sections/TestimonialsSection';
import { FaqSection } from './sections/FaqSection';
import { FinalCtaSection } from './sections/FinalCtaSection';
import { Footer } from './sections/Footer';
import { DemoModal } from './modals/DemoModal';
import { Cpu, Menu, X, ArrowRight, Shield, ExternalLink, Sparkles } from 'lucide-react';

interface PublicMarketingWebsiteProps {
  onOpenSuperAdmin: () => void;
}

export const PublicMarketingWebsite: React.FC<PublicMarketingWebsiteProps> = ({ onOpenSuperAdmin }) => {
  const { platformSettings } = useAuth();
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const platformName = platformSettings?.name || 'DAVETECH';
  const platformTagline = platformSettings?.tagline || 'Enterprise Cloud ERP';
  const platformLogoUrl = platformSettings?.logoUrl;

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Navigation Header - Fixed Dark Navbar */}
      <header className="fixed top-0 inset-x-0 z-40 bg-slate-950/90 text-white backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            {platformLogoUrl ? (
              <div className="w-10 h-10 rounded-xl bg-white/10 p-1 flex items-center justify-center shadow-md">
                <img src={platformLogoUrl} alt={platformName} className="w-full h-full object-contain" />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                <Cpu className="w-5 h-5" />
              </div>
            )}
            <div>
              <span className="text-xl font-extrabold text-white tracking-wider">{platformName}</span>
              <span className="block text-[9px] font-mono text-indigo-400 tracking-widest uppercase">{platformTagline}</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-300">
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-indigo-400 transition-colors">Home</button>
            <button onClick={() => scrollToSection('solutions')} className="hover:text-indigo-400 transition-colors">Solutions</button>
            <button onClick={() => scrollToSection('modules')} className="hover:text-indigo-400 transition-colors">Modules</button>
            <button onClick={() => scrollToSection('pricing')} className="hover:text-indigo-400 transition-colors">Pricing</button>
            <button onClick={() => scrollToSection('security')} className="hover:text-indigo-400 transition-colors">Security</button>
            <button onClick={() => scrollToSection('faq')} className="hover:text-indigo-400 transition-colors">Resources</button>
          </nav>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={onOpenSuperAdmin}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 transition-colors"
            >
              <span>Client Login / ERP</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsDemoModalOpen(true)}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg shadow-indigo-600/25 transition-all"
            >
              Book a Demo <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-slate-400 hover:text-white p-2"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-950 border-b border-slate-800 px-6 py-6 space-y-4 animate-fade-in">
            <button onClick={() => { setMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="block w-full text-left text-base font-medium text-slate-200 hover:text-indigo-400">Home</button>
            <button onClick={() => scrollToSection('solutions')} className="block w-full text-left text-base font-medium text-slate-200 hover:text-indigo-400">Solutions</button>
            <button onClick={() => scrollToSection('modules')} className="block w-full text-left text-base font-medium text-slate-200 hover:text-indigo-400">Modules</button>
            <button onClick={() => scrollToSection('pricing')} className="block w-full text-left text-base font-medium text-slate-200 hover:text-indigo-400">Pricing</button>
            <button onClick={() => scrollToSection('security')} className="block w-full text-left text-base font-medium text-slate-200 hover:text-indigo-400">Security</button>
            <div className="pt-4 border-t border-slate-800 space-y-3">
              <button
                onClick={onOpenSuperAdmin}
                className="w-full py-3 rounded-xl bg-slate-900 text-white text-center text-sm font-semibold border border-slate-800"
              >
                Client Login / ERP Portal
              </button>
              <button
                onClick={() => { setMobileMenuOpen(false); setIsDemoModalOpen(true); }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-center text-sm font-bold shadow-lg shadow-indigo-600/30"
              >
                Book a Demo
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Sections */}
      <main>
        <HeroSection onOpenDemo={() => setIsDemoModalOpen(true)} onExploreSolutions={() => scrollToSection('solutions')} />
        <TrustSection />
        <SolutionsSection onOpenDemo={() => setIsDemoModalOpen(true)} />
        <MultiTenantSection />
        <ModulesGridSection />
        <WhyDavetechSection />
        <div id="security"><SecuritySection /></div>
        <AnalyticsSection />
        <div id="pricing"><PricingSection onOpenDemo={() => setIsDemoModalOpen(true)} /></div>
        <CustomerJourneySection />
        <TestimonialsSection />
        <div id="faq"><FaqSection /></div>
        <FinalCtaSection onOpenDemo={() => setIsDemoModalOpen(true)} />
      </main>

      {/* Footer */}
      <Footer onNavigate={scrollToSection} onOpenAdmin={onOpenSuperAdmin} />

      {/* Demo Modal */}
      <DemoModal isOpen={isDemoModalOpen} onClose={() => setIsDemoModalOpen(false)} />
    </div>
  );
};
