import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../../../context/AuthContext';
import {
  ArrowRight,
  Shield,
  CheckCircle2,
  Users,
  DollarSign,
  Activity,
  Sparkles,
  Building2,
  GraduationCap,
  Stethoscope,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  Clock,
  Layers,
  TrendingUp,
  Server,
  HeartPulse,
  Package,
  Calendar,
  CreditCard,
  FileCheck
} from 'lucide-react';

interface HeroSectionProps {
  onContactSales: () => void;
  onExploreSolutions: () => void;
}

interface SlideData {
  id: string;
  badge: string;
  headlinePart1: string;
  headlinePart2: string;
  description: string;
  primaryCta: string;
  secondaryCta: string;
  primaryAction: 'contact' | 'solutions';
  secondaryAction: 'contact' | 'solutions';
  trustIndicators: string[];
  moduleType: 'enterprise' | 'school' | 'college' | 'hospital' | 'retail';
  floatingBadge1: { text: string; sub?: string; icon: any };
  floatingBadge2: { text: string; sub?: string; icon: any };
}

const SLIDES: SlideData[] = [
  {
    id: 'enterprise',
    badge: 'DAVETECH 5.0 Enterprise Cloud',
    headlinePart1: 'One Powerful Platform.',
    headlinePart2: 'Unlimited Possibilities.',
    description:
      'Run your entire organization with DAVETECH Enterprise — a secure, intelligent and scalable cloud platform engineered for schools, colleges, universities, hospitals, clinics, retail shops, and growing enterprises.',
    primaryCta: 'Explore Solutions →',
    secondaryCta: 'Contact Sales',
    primaryAction: 'solutions',
    secondaryAction: 'contact',
    trustIndicators: [
      'ISO 27001 Certified Security',
      '99.99% Cloud Uptime SLA',
      'Complete Tenant Data Isolation'
    ],
    moduleType: 'enterprise',
    floatingBadge1: {
      text: '99.99% Cloud Uptime',
      sub: 'Enterprise Tier SLA',
      icon: Shield
    },
    floatingBadge2: {
      text: 'Multi-Tenant Isolation',
      sub: 'Zero Data Cross-Leakage',
      icon: Layers
    }
  },
  {
    id: 'school',
    badge: 'DAVETECH School ERP',
    headlinePart1: 'Transform Your School.',
    headlinePart2: 'Simplify Everything.',
    description:
      'A complete cloud-based school management platform for modern schools — from admissions and academics to fees, examinations, attendance, communication and reporting.',
    primaryCta: 'Explore School ERP →',
    secondaryCta: 'Contact Sales',
    primaryAction: 'solutions',
    secondaryAction: 'contact',
    trustIndicators: [
      'CBC & 8-4-4 Ready',
      'M-Pesa Automated Reconciliation',
      'Parent SMS & Portal Included'
    ],
    moduleType: 'school',
    floatingBadge1: {
      text: '98.6% Attendance Rate',
      sub: '1,462 Present Today',
      icon: Activity
    },
    floatingBadge2: {
      text: 'KES 14.8M Fees Cleared',
      sub: 'Automated M-Pesa Matching',
      icon: DollarSign
    }
  },
  {
    id: 'college',
    badge: 'DAVETECH College & University',
    headlinePart1: 'Run Your Institution.',
    headlinePart2: 'Connect Every Department.',
    description:
      'Manage students, programmes, departments, faculty, finance, examinations, accommodation, communication and administration from one intelligent cloud platform.',
    primaryCta: 'Explore College ERP →',
    secondaryCta: 'Contact Sales',
    primaryAction: 'solutions',
    secondaryAction: 'contact',
    trustIndicators: [
      'CUE & TVET Aligned Curricula',
      'Automated Transcripts & GPA',
      'Faculty Senate Grade Clearance'
    ],
    moduleType: 'college',
    floatingBadge1: {
      text: '42 Accredited Programmes',
      sub: 'Degree & Diploma Streams',
      icon: Building2
    },
    floatingBadge2: {
      text: '8,420 Enrolled Scholars',
      sub: 'Semester 1 2026 Active',
      icon: Users
    }
  },
  {
    id: 'hospital',
    badge: 'DAVETECH Hospital EMR',
    headlinePart1: 'Smarter Healthcare.',
    headlinePart2: 'Better Patient Care.',
    description:
      'Connect clinical and administrative operations with a secure healthcare management platform built for hospitals and clinics.',
    primaryCta: 'Explore Hospital EMR →',
    secondaryCta: 'Contact Sales',
    primaryAction: 'solutions',
    secondaryAction: 'contact',
    trustIndicators: [
      'HIPAA & Data Protection Compliant',
      'Direct SHA / NHIF Claims Processing',
      'Zero-Loss Pharmacy Inventory'
    ],
    moduleType: 'hospital',
    floatingBadge1: {
      text: '284 Consultations Today',
      sub: 'Average Triage: 8 Mins',
      icon: HeartPulse
    },
    floatingBadge2: {
      text: 'Pharmacy Stock: 99.4%',
      sub: 'Zero Stockout Warnings',
      icon: Package
    }
  },
  {
    id: 'retail',
    badge: 'DAVETECH Retail POS',
    headlinePart1: 'Sell Smarter.',
    headlinePart2: 'Control Your Entire Business.',
    description:
      'Powerful cloud POS and business management tools for retail shops and growing enterprises — with sales, inventory, customers, suppliers, payments and reporting in one platform.',
    primaryCta: 'Explore Retail POS →',
    secondaryCta: 'Contact Sales',
    primaryAction: 'solutions',
    secondaryAction: 'contact',
    trustIndicators: [
      'Instant M-Pesa STK Checkout',
      'Barcode Scanning & Receipt Printing',
      'Real-Time Multi-Branch Inventory'
    ],
    moduleType: 'retail',
    floatingBadge1: {
      text: 'KES 428,500 POS Turnover',
      sub: '842 Orders Today',
      icon: TrendingUp
    },
    floatingBadge2: {
      text: '6,240 Tracked SKUs',
      sub: 'Automated Low-Stock Alerts',
      icon: ShoppingCart
    }
  }
];

export const HeroSection: React.FC<HeroSectionProps> = ({ onContactSales, onExploreSolutions }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentSlide = SLIDES[currentSlideIndex];

  const handleNext = useCallback(() => {
    setCurrentSlideIndex((prev) => (prev + 1) % SLIDES.length);
  }, []);

  const handlePrev = useCallback(() => {
    setCurrentSlideIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  // Autoplay effect
  useEffect(() => {
    if (isPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      handleNext();
    }, 6500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, handleNext]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
    setTouchStartX(null);
  };

  const handleCtaClick = (action: 'contact' | 'solutions') => {
    if (action === 'contact') {
      onContactSales();
    } else {
      onExploreSolutions();
    }
  };

  return (
    <section
      className="relative pt-24 pb-14 md:pt-32 md:pb-20 overflow-hidden bg-white selection:bg-indigo-500 selection:text-white"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-roledescription="carousel"
      aria-label="DAVETECH Enterprise Solutions Hero Carousel"
    >
      {/* Background ambient glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-indigo-600/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[450px] h-[320px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[350px] h-[250px] bg-teal-500/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Industry Module Quick Selector Tabs */}
        <div className="mb-6 sm:mb-8 flex items-center justify-center">
          <div className="inline-flex items-center p-1 bg-slate-100/90 border border-slate-200/80 rounded-2xl shadow-xs backdrop-blur-md overflow-x-auto max-w-full">
            {SLIDES.map((slide, idx) => {
              const isActive = idx === currentSlideIndex;
              return (
                <button
                  key={slide.id}
                  onClick={() => setCurrentSlideIndex(idx)}
                  className={`px-3 sm:px-4 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 whitespace-nowrap flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-white text-indigo-700 shadow-sm border border-slate-200/80'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                  aria-selected={isActive}
                  role="tab"
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-indigo-600' : 'bg-slate-400'}`} />
                  {slide.id === 'enterprise' && 'Enterprise Cloud'}
                  {slide.id === 'school' && 'School ERP'}
                  {slide.id === 'college' && 'College & University'}
                  {slide.id === 'hospital' && 'Hospital EMR'}
                  {slide.id === 'retail' && 'Retail POS'}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Two-Column Slide Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center min-h-[500px]">
          
          {/* Left Column: Copy & Actions */}
          <div className="lg:col-span-6 space-y-5 transition-opacity duration-300">
            
            {/* Category Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-800 text-xs sm:text-sm font-semibold shadow-2xs">
              <Sparkles className="w-4 h-4 text-indigo-600 animate-pulse" />
              <span>{currentSlide.badge}</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#11162A] tracking-tight leading-[1.12]">
              {currentSlide.headlinePart1}{' '}
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-600 bg-clip-text text-transparent">
                {currentSlide.headlinePart2}
              </span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal max-w-xl">
              {currentSlide.description}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                onClick={() => handleCtaClick(currentSlide.primaryAction)}
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-500 hover:to-purple-600 text-white px-7 py-3.5 rounded-xl font-bold text-sm sm:text-base shadow-lg shadow-indigo-600/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>{currentSlide.primaryCta}</span>
              </button>
              <button
                onClick={() => handleCtaClick(currentSlide.secondaryAction)}
                className="inline-flex items-center justify-center gap-2 bg-slate-100/90 hover:bg-slate-200/90 text-slate-800 px-6 py-3.5 rounded-xl font-semibold text-sm sm:text-base border border-slate-200 transition-all"
              >
                <span>{currentSlide.secondaryCta}</span>
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-500 font-medium">
              {currentSlide.trustIndicators.map((indicator, i) => (
                <span key={i} className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span>{indicator}</span>
                </span>
              ))}
            </div>

            {/* Architecture Banner */}
            <div className="pt-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-50 border border-slate-200/80 rounded-lg text-[11px] font-mono text-slate-600">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="font-semibold text-slate-700">Multi-Tenant Architecture:</span>
                <span>One Cloud • Every Organization • Complete Tenant Isolation</span>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic SaaS Product Mockup */}
          <div className="lg:col-span-6 relative">
            
            {/* Main Mockup Window */}
            <div className="bg-slate-950 border border-slate-800/90 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl relative z-10 transition-all duration-300">
              
              {/* Window Header / Browser Chrome */}
              <div className="bg-slate-900/95 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <div className="ml-2 px-2.5 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {currentSlide.moduleType === 'enterprise' && 'workspace.davetech.co.ke / enterprise'}
                    {currentSlide.moduleType === 'school' && 'school.davetech.co.ke / academic-core'}
                    {currentSlide.moduleType === 'college' && 'campus.davetech.co.ke / university-reg'}
                    {currentSlide.moduleType === 'hospital' && 'health.davetech.co.ke / clinical-emr'}
                    {currentSlide.moduleType === 'retail' && 'pos.davetech.co.ke / retail-terminal-1'}
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-2 text-[10px] font-mono text-indigo-400 bg-indigo-950/50 px-2 py-0.5 rounded border border-indigo-800/40">
                  <span>LIVE TENANT CLOUD</span>
                </div>
              </div>

              {/* Mockup Canvas */}
              <div className="p-4 sm:p-5 bg-slate-900/80 min-h-[360px] flex flex-col justify-between">
                
                {/* 1. ENTERPRISE MOCKUP */}
                {currentSlide.moduleType === 'enterprise' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <div>
                        <div className="text-sm font-bold text-white flex items-center gap-1.5">
                          <span>DAVETECH Multi-Tenant Engine</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono">v5.0</span>
                        </div>
                        <p className="text-[11px] text-slate-400">Isolated Organization Tenants Operating Concurrently</p>
                      </div>
                      <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        12 Tenants Online
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      <div className="bg-slate-950/90 border border-slate-800/90 p-2.5 rounded-xl">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Schools & K-12</span>
                        <div className="text-base sm:text-lg font-black text-white mt-0.5">1,482</div>
                        <span className="text-[10px] text-emerald-400 font-medium">98.6% Attendance</span>
                      </div>
                      <div className="bg-slate-950/90 border border-slate-800/90 p-2.5 rounded-xl">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">University ERP</span>
                        <div className="text-base sm:text-lg font-black text-white mt-0.5">8,420</div>
                        <span className="text-[10px] text-indigo-400 font-medium">42 Degree Tracks</span>
                      </div>
                      <div className="bg-slate-950/90 border border-slate-800/90 p-2.5 rounded-xl">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Hospital EMR</span>
                        <div className="text-base sm:text-lg font-black text-white mt-0.5">284</div>
                        <span className="text-[10px] text-teal-400 font-medium">Patients Today</span>
                      </div>
                      <div className="bg-slate-950/90 border border-slate-800/90 p-2.5 rounded-xl">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Retail POS</span>
                        <div className="text-base sm:text-lg font-black text-white mt-0.5">KES 428K</div>
                        <span className="text-[10px] text-amber-400 font-medium">842 Transactions</span>
                      </div>
                    </div>

                    <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 space-y-2">
                      <div className="flex items-center justify-between text-xs text-slate-300">
                        <span className="font-semibold text-white">Cross-Industry Tenant Matrix</span>
                        <span className="text-[10px] font-mono text-slate-400">Real-Time Cloud Synced</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div className="p-2 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-md bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold text-[10px]">
                              <GraduationCap className="w-3.5 h-3.5" />
                            </div>
                            <div>
                              <div className="font-semibold text-white text-[11px]">Primary & Secondary</div>
                              <div className="text-[10px] text-slate-400">Admissions & M-Pesa Fees</div>
                            </div>
                          </div>
                          <span className="text-[10px] font-mono text-emerald-400">Active</span>
                        </div>
                        <div className="p-2 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-md bg-teal-600/20 text-teal-400 flex items-center justify-center font-bold text-[10px]">
                              <Stethoscope className="w-3.5 h-3.5" />
                            </div>
                            <div>
                              <div className="font-semibold text-white text-[11px]">Clinical Healthcare</div>
                              <div className="text-[10px] text-slate-400">OPD, Lab & Pharmacy</div>
                            </div>
                          </div>
                          <span className="text-[10px] font-mono text-emerald-400">Active</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. SCHOOL ERP MOCKUP */}
                {currentSlide.moduleType === 'school' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <div>
                        <div className="text-sm font-bold text-white flex items-center gap-1.5">
                          <span>Hillcrest Academy & Junior Secondary</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono">CBC</span>
                        </div>
                        <p className="text-[11px] text-slate-400">Term 1 2026 • Academic & Financial Control</p>
                      </div>
                      <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        1,482 Enrolled
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      <div className="bg-slate-950/90 border border-slate-800/90 p-2.5 rounded-xl">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Students</span>
                        <div className="text-base sm:text-lg font-black text-white mt-0.5">1,482</div>
                        <span className="text-[10px] text-emerald-400 font-medium">85 New Admits</span>
                      </div>
                      <div className="bg-slate-950/90 border border-slate-800/90 p-2.5 rounded-xl">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Fee Collection</span>
                        <div className="text-base sm:text-lg font-black text-white mt-0.5">KES 14.8M</div>
                        <span className="text-[10px] text-indigo-400 font-medium">94.8% Target</span>
                      </div>
                      <div className="bg-slate-950/90 border border-slate-800/90 p-2.5 rounded-xl">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Attendance</span>
                        <div className="text-base sm:text-lg font-black text-white mt-0.5">98.6%</div>
                        <span className="text-[10px] text-emerald-400 font-medium">20 Absent</span>
                      </div>
                      <div className="bg-slate-950/90 border border-slate-800/90 p-2.5 rounded-xl">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Active Parents</span>
                        <div className="text-base sm:text-lg font-black text-white mt-0.5">2,840</div>
                        <span className="text-[10px] text-purple-400 font-medium">SMS & App</span>
                      </div>
                    </div>

                    <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-white">Live Admissions & Fee Clearances</span>
                        <span className="text-[10px] font-mono text-emerald-400">M-Pesa Connected</span>
                      </div>
                      <div className="space-y-1.5 text-[11px]">
                        {[
                          { name: 'Faith Wambui', class: 'Grade 8 Stream A', status: 'Cleared', amount: 'KES 45,000' },
                          { name: 'Brian Ochieng', class: 'Form 2 West', status: 'Partially Paid', amount: 'KES 22,500' }
                        ].map((s, i) => (
                          <div key={i} className="p-2 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                            <div>
                              <span className="font-bold text-white">{s.name}</span>
                              <span className="text-slate-400 ml-2 font-mono text-[10px]">{s.class}</span>
                            </div>
                            <div className="text-right">
                              <span className="font-mono font-bold text-white mr-2">{s.amount}</span>
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-400">
                                {s.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. COLLEGE & UNIVERSITY MOCKUP */}
                {currentSlide.moduleType === 'college' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <div>
                        <div className="text-sm font-bold text-white flex items-center gap-1.5">
                          <span>DAVETECH Institute of Higher Studies</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono">Senate</span>
                        </div>
                        <p className="text-[11px] text-slate-400">42 Accredited Degree, Diploma & TVET Programs</p>
                      </div>
                      <span className="text-[11px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                        8,420 Enrolled
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      <div className="bg-slate-950/90 border border-slate-800/90 p-2.5 rounded-xl">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Students</span>
                        <div className="text-base sm:text-lg font-black text-white mt-0.5">8,420</div>
                        <span className="text-[10px] text-emerald-400 font-medium">Undergrad & Post</span>
                      </div>
                      <div className="bg-slate-950/90 border border-slate-800/90 p-2.5 rounded-xl">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Programmes</span>
                        <div className="text-base sm:text-lg font-black text-white mt-0.5">42 Active</div>
                        <span className="text-[10px] text-indigo-400 font-medium">CUE Accredited</span>
                      </div>
                      <div className="bg-slate-950/90 border border-slate-800/90 p-2.5 rounded-xl">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Faculty Members</span>
                        <div className="text-base sm:text-lg font-black text-white mt-0.5">286 Staff</div>
                        <span className="text-[10px] text-purple-400 font-medium">18 Departments</span>
                      </div>
                      <div className="bg-slate-950/90 border border-slate-800/90 p-2.5 rounded-xl">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Fee Collection</span>
                        <div className="text-base sm:text-lg font-black text-white mt-0.5">KES 84.2M</div>
                        <span className="text-[10px] text-emerald-400 font-medium">96.8% Target</span>
                      </div>
                    </div>

                    <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-white">Faculty & Course Enrollment Breakdown</span>
                        <span className="text-[10px] font-mono text-purple-300">Dean Dashboard</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                          <div className="text-white font-bold text-[11px]">School of Computing & IT</div>
                          <div className="text-slate-400 text-[10px] mt-0.5">1,840 Students • 18 Courses Active</div>
                        </div>
                        <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                          <div className="text-white font-bold text-[11px]">Faculty of Business & Economics</div>
                          <div className="text-slate-400 text-[10px] mt-0.5">2,410 Students • 14 Courses Active</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. HOSPITAL EMR MOCKUP */}
                {currentSlide.moduleType === 'hospital' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <div>
                        <div className="text-sm font-bold text-white flex items-center gap-1.5">
                          <span>Metropolitan Hospital & Specialty Clinics</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300 font-mono">EMR</span>
                        </div>
                        <p className="text-[11px] text-slate-400">Outpatient Triage, Doctors Roster & Digital Pharmacy</p>
                      </div>
                      <span className="text-[11px] font-mono text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
                        284 Consultations
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      <div className="bg-slate-950/90 border border-slate-800/90 p-2.5 rounded-xl">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Patients Today</span>
                        <div className="text-base sm:text-lg font-black text-white mt-0.5">284</div>
                        <span className="text-[10px] text-teal-400 font-medium">Avg Triage: 8m</span>
                      </div>
                      <div className="bg-slate-950/90 border border-slate-800/90 p-2.5 rounded-xl">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Appointments</span>
                        <div className="text-base sm:text-lg font-black text-white mt-0.5">96</div>
                        <span className="text-[10px] text-indigo-400 font-medium">12 Doctors on Duty</span>
                      </div>
                      <div className="bg-slate-950/90 border border-slate-800/90 p-2.5 rounded-xl">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Admissions</span>
                        <div className="text-base sm:text-lg font-black text-white mt-0.5">18</div>
                        <span className="text-[10px] text-amber-400 font-medium">84% Bed Occupancy</span>
                      </div>
                      <div className="bg-slate-950/90 border border-slate-800/90 p-2.5 rounded-xl">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Revenue Today</span>
                        <div className="text-base sm:text-lg font-black text-white mt-0.5">KES 2.8M</div>
                        <span className="text-[10px] text-emerald-400 font-medium">SHA / NHIF Verified</span>
                      </div>
                    </div>

                    <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-white">Live Clinical Consultation Feed</span>
                        <span className="text-[10px] font-mono text-teal-300">Dr. Station Active</span>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <HeartPulse className="w-4 h-4 text-teal-400" />
                          <div>
                            <span className="font-bold text-white text-[11px]">Patient #PAT-8842 (Dr. Kamau)</span>
                            <div className="text-[10px] text-slate-400">Vitals: BP 118/76, SpO2 99%, Temp 36.6°C</div>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                          Prescription Ready
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. RETAIL POS MOCKUP */}
                {currentSlide.moduleType === 'retail' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <div>
                        <div className="text-sm font-bold text-white flex items-center gap-1.5">
                          <span>Davetech Retail POS Terminal</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">Cloud POS</span>
                        </div>
                        <p className="text-[11px] text-slate-400">Multi-Register Sales, Barcode Scanning & Stock Control</p>
                      </div>
                      <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        KES 428,500 Sales
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      <div className="bg-slate-950/90 border border-slate-800/90 p-2.5 rounded-xl">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Today's Sales</span>
                        <div className="text-base sm:text-lg font-black text-white mt-0.5">KES 428.5K</div>
                        <span className="text-[10px] text-emerald-400 font-medium">842 Transactions</span>
                      </div>
                      <div className="bg-slate-950/90 border border-slate-800/90 p-2.5 rounded-xl">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Products / SKUs</span>
                        <div className="text-base sm:text-lg font-black text-white mt-0.5">6,240</div>
                        <span className="text-[10px] text-indigo-400 font-medium">Catalog Synced</span>
                      </div>
                      <div className="bg-slate-950/90 border border-slate-800/90 p-2.5 rounded-xl">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Gross Profit</span>
                        <div className="text-base sm:text-lg font-black text-white mt-0.5">KES 92,400</div>
                        <span className="text-[10px] text-amber-400 font-medium">21.5% Margin</span>
                      </div>
                      <div className="bg-slate-950/90 border border-slate-800/90 p-2.5 rounded-xl">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Active Registers</span>
                        <div className="text-base sm:text-lg font-black text-white mt-0.5">6 Terminals</div>
                        <span className="text-[10px] text-purple-400 font-medium">M-Pesa Integrated</span>
                      </div>
                    </div>

                    <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-white">Live POS Checkout Register Stream</span>
                        <span className="text-[10px] font-mono text-emerald-400">Till 884200 Active</span>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                        <div>
                          <div className="font-bold text-white text-[11px]">Receipt #POS-8842 • 4 Items</div>
                          <div className="text-[10px] text-slate-400">Customer: David M. • M-Pesa STK Instant</div>
                        </div>
                        <div className="text-right">
                          <div className="font-mono font-bold text-white">KES 4,850</div>
                          <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded">
                            Verified
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              </div>

              {/* Bottom Multi-Tenant Status Bar */}
              <div className="bg-slate-950 px-4 py-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>Cloud Engine Active</span>
                </span>
                <span className="text-indigo-400">ONE PLATFORM → MANY INDUSTRIES</span>
              </div>
            </div>

            {/* Floating Badge 1 (Top-Right) */}
            <div className="hidden sm:flex absolute -top-4 -right-4 z-20 bg-white/95 border border-slate-200/90 rounded-xl p-3 shadow-xl backdrop-blur-md items-center gap-3 animate-bounce-subtle pointer-events-none">
              <div className="w-9 h-9 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                {React.createElement(currentSlide.floatingBadge1.icon, { className: 'w-4 h-4' })}
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">{currentSlide.floatingBadge1.text}</div>
                {currentSlide.floatingBadge1.sub && (
                  <div className="text-[10px] font-medium text-slate-500">{currentSlide.floatingBadge1.sub}</div>
                )}
              </div>
            </div>

            {/* Floating Badge 2 (Bottom-Left) */}
            <div className="hidden sm:flex absolute -bottom-4 -left-4 z-20 bg-white/95 border border-slate-200/90 rounded-xl p-3 shadow-xl backdrop-blur-md items-center gap-3 animate-bounce-subtle pointer-events-none">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                {React.createElement(currentSlide.floatingBadge2.icon, { className: 'w-4 h-4' })}
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">{currentSlide.floatingBadge2.text}</div>
                {currentSlide.floatingBadge2.sub && (
                  <div className="text-[10px] font-medium text-slate-500">{currentSlide.floatingBadge2.sub}</div>
                )}
              </div>
            </div>

          </div>

        </div>

        {/* Slider Controls: Arrows & Indicators */}
        <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between">
          {/* Slide Indicator Dots */}
          <div className="flex items-center gap-2" role="tablist" aria-label="Slide Indicators">
            {SLIDES.map((slide, idx) => {
              const isActive = idx === currentSlideIndex;
              return (
                <button
                  key={slide.id}
                  onClick={() => setCurrentSlideIndex(idx)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    isActive
                      ? 'w-8 bg-gradient-to-r from-indigo-600 to-purple-600 shadow-sm'
                      : 'w-2.5 bg-slate-200 hover:bg-slate-300'
                  }`}
                  aria-label={`Go to slide ${idx + 1}: ${slide.badge}`}
                  aria-selected={isActive}
                />
              );
            })}
          </div>

          {/* Previous / Next Arrow Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 transition-colors"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono text-slate-500 font-semibold px-1">
              0{currentSlideIndex + 1} / 0{SLIDES.length}
            </span>
            <button
              onClick={handleNext}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 transition-colors"
              aria-label="Next slide"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
