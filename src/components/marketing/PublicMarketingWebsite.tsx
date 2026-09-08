import React, { useState, useEffect } from 'react';
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
import { AuthPortalModal } from '../auth/AuthPortalModal';

// Dedicated public route pages
import { AboutPage } from './pages/AboutPage';
import { SolutionsPage } from './pages/SolutionsPage';
import { SchoolErpPage } from './pages/SchoolErpPage';
import { RetailPosPage } from './pages/RetailPosPage';
import { BusinessPage } from './pages/BusinessPage';
import { CustomSoftwarePage } from './pages/CustomSoftwarePage';
import { ContactPage } from './pages/ContactPage';

import {
  Cpu,
  Menu,
  X,
  ArrowRight,
  Shield,
  ChevronDown,
  LogIn,
  School,
  ShoppingBag,
  Briefcase,
  Layers,
  Sparkles,
  PhoneCall,
  Code
} from 'lucide-react';

export type PublicRoute =
  | 'home'
  | 'about'
  | 'solutions'
  | 'school-erp'
  | 'retail-pos'
  | 'business'
  | 'custom-software'
  | 'contact';

interface PublicMarketingWebsiteProps {
  onOpenSuperAdmin: () => void;
}

export const PublicMarketingWebsite: React.FC<PublicMarketingWebsiteProps> = ({ onOpenSuperAdmin }) => {
  const { platformSettings, user } = useAuth();
  const [currentRoute, setCurrentRoute] = useState<PublicRoute>(() => {
    const path = window.location.pathname.toLowerCase();
    if (path === '/about') return 'about';
    if (path === '/solutions') return 'solutions';
    if (path === '/school-erp') return 'school-erp';
    if (path === '/retail-pos') return 'retail-pos';
    if (path === '/business') return 'business';
    if (path === '/custom-software') return 'custom-software';
    if (path === '/contact' || path === '/demo') return 'contact';
    return 'home';
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSolutionsDropdownOpen, setIsSolutionsDropdownOpen] = useState(false);

  // Sync with browser history back/forward
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase();
      if (path === '/about') setCurrentRoute('about');
      else if (path === '/solutions') setCurrentRoute('solutions');
      else if (path === '/school-erp') setCurrentRoute('school-erp');
      else if (path === '/retail-pos') setCurrentRoute('retail-pos');
      else if (path === '/business') setCurrentRoute('business');
      else if (path === '/custom-software') setCurrentRoute('custom-software');
      else if (path === '/contact' || path === '/demo') setCurrentRoute('contact');
      else setCurrentRoute('home');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (route: PublicRoute) => {
    setCurrentRoute(route);
    setMobileMenuOpen(false);
    setIsSolutionsDropdownOpen(false);
    const path = route === 'home' ? '/' : `/${route}`;
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    if (currentRoute !== 'home') {
      navigateTo('home');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleAuthSuccess = () => {
    if (user?.role === 'SUPER_ADMIN') {
      onOpenSuperAdmin();
    }
  };

  const platformName = platformSettings?.name || 'DAVETECH SOLUTIONS';
  const platformTagline = platformSettings?.tagline || 'Enterprise Multi-Tenant Cloud ERP';
  const platformLogoUrl = platformSettings?.logoUrl;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white flex flex-col">
      {/* Top Header - Pure Davetech Solutions Public Branding */}
      <header className="fixed top-0 inset-x-0 z-40 bg-slate-950/90 text-white backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo & Brand Identity */}
          <div
            className="flex items-center gap-3 cursor-pointer select-none"
            onClick={() => navigateTo('home')}
          >
            {platformLogoUrl ? (
              <div className="w-10 h-10 rounded-xl bg-white/10 p-1 flex items-center justify-center shadow-md border border-white/10">
                <img src={platformLogoUrl} alt={platformName} className="w-full h-full object-contain" />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                <Cpu className="w-5 h-5" />
              </div>
            )}
            <div>
              <span className="text-xl font-extrabold text-white tracking-wider block leading-none">
                {platformName}
              </span>
              <span className="block text-[9px] font-mono text-indigo-400 tracking-widest uppercase mt-1">
                {platformTagline}
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-300">
            <button
              onClick={() => navigateTo('home')}
              className={`transition-colors cursor-pointer ${
                currentRoute === 'home' ? 'text-indigo-400 font-bold' : 'hover:text-white'
              }`}
            >
              Home
            </button>

            <button
              onClick={() => navigateTo('about')}
              className={`transition-colors cursor-pointer ${
                currentRoute === 'about' ? 'text-indigo-400 font-bold' : 'hover:text-white'
              }`}
            >
              About
            </button>

            {/* Solutions Dropdown */}
            <div className="relative group" onMouseLeave={() => setIsSolutionsDropdownOpen(false)}>
              <button
                onClick={() => navigateTo('solutions')}
                onMouseEnter={() => setIsSolutionsDropdownOpen(true)}
                className={`flex items-center gap-1 transition-colors cursor-pointer ${
                  currentRoute === 'solutions' ||
                  currentRoute === 'school-erp' ||
                  currentRoute === 'retail-pos' ||
                  currentRoute === 'business'
                    ? 'text-indigo-400 font-bold'
                    : 'hover:text-white'
                }`}
              >
                <span>Products & Solutions</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70 group-hover:rotate-180 transition-transform" />
              </button>

              {/* Mega Dropdown Menu */}
              {isSolutionsDropdownOpen && (
                <div className="absolute top-full -left-4 w-72 bg-slate-900 border border-slate-800 rounded-2xl p-3 shadow-2xl space-y-1 animate-fade-in">
                  <button
                    onClick={() => navigateTo('solutions')}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-slate-800 flex items-center gap-3 transition-colors group/item"
                  >
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover/item:text-indigo-300">
                        All Solutions Directory
                      </div>
                      <div className="text-[10px] text-slate-400">Full platform portfolio</div>
                    </div>
                  </button>

                  <button
                    onClick={() => navigateTo('school-erp')}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-slate-800 flex items-center gap-3 transition-colors group/item"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                      <School className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover/item:text-blue-300">
                        School Management ERP
                      </div>
                      <div className="text-[10px] text-slate-400">CBC grading, fees, admissions</div>
                    </div>
                  </button>

                  <button
                    onClick={() => navigateTo('retail-pos')}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-slate-800 flex items-center gap-3 transition-colors group/item"
                  >
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                      <ShoppingBag className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover/item:text-amber-300">
                        Retail POS & Stock Control
                      </div>
                      <div className="text-[10px] text-slate-400">Barcode checkout, M-Pesa, shifts</div>
                    </div>
                  </button>

                  <button
                    onClick={() => navigateTo('business')}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-slate-800 flex items-center gap-3 transition-colors group/item"
                  >
                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover/item:text-purple-300">
                        Business & Accounting Suite
                      </div>
                      <div className="text-[10px] text-slate-400">Double-entry, payroll, billing</div>
                    </div>
                  </button>

                  <button
                    onClick={() => navigateTo('custom-software')}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-slate-800 flex items-center gap-3 transition-colors group/item"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                      <Code className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover/item:text-emerald-300">
                        Custom Software & Cloud
                      </div>
                      <div className="text-[10px] text-slate-400">Tailored SaaS, APIs & Mobile Apps</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => navigateTo('school-erp')}
              className={`hidden xl:inline-block transition-colors cursor-pointer ${
                currentRoute === 'school-erp' ? 'text-indigo-400 font-bold' : 'hover:text-white'
              }`}
            >
              School ERP
            </button>

            <button
              onClick={() => navigateTo('retail-pos')}
              className={`hidden xl:inline-block transition-colors cursor-pointer ${
                currentRoute === 'retail-pos' ? 'text-indigo-400 font-bold' : 'hover:text-white'
              }`}
            >
              Retail POS
            </button>

            <button
              onClick={() => navigateTo('business')}
              className={`hidden xl:inline-block transition-colors cursor-pointer ${
                currentRoute === 'business' ? 'text-indigo-400 font-bold' : 'hover:text-white'
              }`}
            >
              Business
            </button>

            <button
              onClick={() => navigateTo('custom-software')}
              className={`transition-colors cursor-pointer ${
                currentRoute === 'custom-software' ? 'text-indigo-400 font-bold' : 'hover:text-white'
              }`}
            >
              Custom Software
            </button>

            <button
              onClick={() => navigateTo('contact')}
              className={`transition-colors cursor-pointer ${
                currentRoute === 'contact' ? 'text-indigo-400 font-bold' : 'hover:text-white'
              }`}
            >
              Contact
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-indigo-500/50 shadow-sm transition-all cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5 text-indigo-400" />
              <span>Client Login / ERP</span>
            </button>

            <button
              onClick={() => navigateTo('contact')}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-slate-400 hover:text-white p-2 rounded-lg bg-slate-900 border border-slate-800 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-slate-950 border-b border-slate-800 px-6 py-6 space-y-4 animate-fade-in max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => navigateTo('home')}
              className="block w-full text-left text-sm font-semibold text-slate-200 hover:text-indigo-400 py-1 cursor-pointer"
            >
              Home
            </button>
            <button
              onClick={() => navigateTo('about')}
              className="block w-full text-left text-sm font-semibold text-slate-200 hover:text-indigo-400 py-1 cursor-pointer"
            >
              About Davetech Solutions
            </button>
            <button
              onClick={() => navigateTo('solutions')}
              className="block w-full text-left text-sm font-semibold text-slate-200 hover:text-indigo-400 py-1 cursor-pointer"
            >
              All Products & Solutions
            </button>
            <button
              onClick={() => navigateTo('school-erp')}
              className="block w-full text-left text-sm font-semibold text-slate-200 hover:text-blue-400 py-1 pl-3 border-l-2 border-blue-500/40 cursor-pointer"
            >
              School Management ERP (CBC)
            </button>
            <button
              onClick={() => navigateTo('retail-pos')}
              className="block w-full text-left text-sm font-semibold text-slate-200 hover:text-amber-400 py-1 pl-3 border-l-2 border-amber-500/40 cursor-pointer"
            >
              Retail POS & Stock Control
            </button>
            <button
              onClick={() => navigateTo('business')}
              className="block w-full text-left text-sm font-semibold text-slate-200 hover:text-purple-400 py-1 pl-3 border-l-2 border-purple-500/40 cursor-pointer"
            >
              Business & Financial Management
            </button>
            <button
              onClick={() => navigateTo('custom-software')}
              className="block w-full text-left text-sm font-semibold text-slate-200 hover:text-emerald-400 py-1 pl-3 border-l-2 border-emerald-500/40 cursor-pointer"
            >
              Custom Software & Mobile Apps
            </button>
            <button
              onClick={() => navigateTo('contact')}
              className="block w-full text-left text-sm font-semibold text-slate-200 hover:text-indigo-400 py-1 cursor-pointer"
            >
              Contact Us
            </button>

            <div className="pt-4 border-t border-slate-800 space-y-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsAuthModalOpen(true);
                }}
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-center text-xs font-bold border border-slate-700 flex items-center justify-center space-x-2 cursor-pointer"
              >
                <LogIn className="w-4 h-4 text-indigo-400" />
                <span>Client Login / ERP Portal</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigateTo('contact');
                }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-center text-xs font-bold shadow-lg shadow-indigo-600/30 cursor-pointer"
              >
                Get Started / Contact Us
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area Based on Route */}
      <div className="pt-20 flex-1 flex flex-col">
        {currentRoute === 'home' && (
          <main>
            <HeroSection
              onContactSales={() => navigateTo('contact')}
              onExploreSolutions={() => navigateTo('solutions')}
            />
            <TrustSection />
            <SolutionsSection onContactSales={() => navigateTo('contact')} />
            <MultiTenantSection />
            <ModulesGridSection />
            <WhyDavetechSection />
            <div id="security"><SecuritySection /></div>
            <AnalyticsSection />
            <div id="pricing"><PricingSection onContactSales={() => navigateTo('contact')} /></div>
            <CustomerJourneySection />
            <TestimonialsSection />
            <div id="faq"><FaqSection /></div>
            <FinalCtaSection onContactSales={() => navigateTo('contact')} />
          </main>
        )}

        {currentRoute === 'about' && (
          <AboutPage
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
            onNavigate={(r) => navigateTo(r as PublicRoute)}
          />
        )}

        {currentRoute === 'solutions' && (
          <SolutionsPage
            onNavigate={(r) => navigateTo(r as PublicRoute)}
          />
        )}

        {currentRoute === 'school-erp' && (
          <SchoolErpPage
            onNavigate={(r) => navigateTo(r as PublicRoute)}
          />
        )}

        {currentRoute === 'retail-pos' && (
          <RetailPosPage
            onNavigate={(r) => navigateTo(r as PublicRoute)}
          />
        )}

        {currentRoute === 'business' && (
          <BusinessPage
            onNavigate={(r) => navigateTo(r as PublicRoute)}
          />
        )}

        {currentRoute === 'custom-software' && (
          <CustomSoftwarePage
            onNavigate={(r) => navigateTo(r as PublicRoute)}
          />
        )}

        {currentRoute === 'contact' && (
          <ContactPage onNavigate={(r) => navigateTo(r as PublicRoute)} />
        )}
      </div>

      {/* Global Public Footer */}
      <Footer
        onNavigate={(sectionOrRoute) => {
          if (
            sectionOrRoute === 'about' ||
            sectionOrRoute === 'solutions' ||
            sectionOrRoute === 'school-erp' ||
            sectionOrRoute === 'retail-pos' ||
            sectionOrRoute === 'business' ||
            sectionOrRoute === 'custom-software' ||
            sectionOrRoute === 'contact'
          ) {
            navigateTo(sectionOrRoute as PublicRoute);
          } else {
            scrollToSection(sectionOrRoute);
          }
        }}
        onOpenAdmin={() => setIsAuthModalOpen(true)}
      />

      {/* Enterprise Authentication Portal Modal */}
      <AuthPortalModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
};
