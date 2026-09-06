import React, { useState } from 'react';
import { Tenant, TenantWebsiteConfig, TenantWebsiteInquiry, TenantWebsitePage } from '../../types';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ArrowRight,
  CheckCircle2,
  Menu,
  X,
  Send,
  ExternalLink,
  Shield,
  Star,
  Award,
  Users,
  ChevronRight,
  Activity,
  Heart,
  Pill,
  Bed,
  Stethoscope,
  Briefcase,
  Cpu,
  GraduationCap,
  Package,
  CreditCard,
  Truck,
  TrendingUp,
  LogIn
} from 'lucide-react';

interface PublicTenantWebsiteProps {
  tenant: Tenant;
  websiteConfig: TenantWebsiteConfig;
  onExitToErp?: () => void;
  isPreview?: boolean;
}

export const PublicTenantWebsite: React.FC<PublicTenantWebsiteProps> = ({
  tenant,
  websiteConfig,
  onExitToErp,
  isPreview = false
}) => {
  const [activePageSlug, setActivePageSlug] = useState<string>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [inquirySubmitted, setInquirySubmitted] = useState(false);
  const [inquiryForm, setInquiryForm] = useState<Partial<TenantWebsiteInquiry>>({
    fullName: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: ''
  });

  const activePage = websiteConfig.pages.find(p => p.slug === activePageSlug) || websiteConfig.pages[0];
  const primaryColor = websiteConfig.theme.primaryColor || '#2563eb';
  const secondaryColor = websiteConfig.theme.secondaryColor || '#0f172a';

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryForm.fullName || !inquiryForm.email) return;

    // Save inquiry to localStorage or trigger event
    try {
      const stored = localStorage.getItem(`tenant_inquiries_${tenant.id}`);
      const list = stored ? JSON.parse(stored) : [];
      list.unshift({
        id: `inq-${Date.now()}`,
        tenantId: tenant.id,
        fullName: inquiryForm.fullName,
        email: inquiryForm.email,
        phone: inquiryForm.phone || '',
        subject: inquiryForm.subject || 'Website Inquiry',
        message: inquiryForm.message || '',
        createdAt: new Date().toISOString(),
        status: 'NEW'
      });
      localStorage.setItem(`tenant_inquiries_${tenant.id}`, JSON.stringify(list));
    } catch {
      // Ignore
    }

    setInquirySubmitted(true);
    setInquiryForm({ fullName: '', email: '', phone: '', subject: 'General Inquiry', message: '' });
  };

  const renderIcon = (name?: string) => {
    switch (name) {
      case 'Stethoscope': return <Stethoscope className="w-6 h-6" />;
      case 'Pill': return <Pill className="w-6 h-6" />;
      case 'Activity': return <Activity className="w-6 h-6" />;
      case 'Bed': return <Bed className="w-6 h-6" />;
      case 'Heart': return <Heart className="w-6 h-6" />;
      case 'Briefcase': return <Briefcase className="w-6 h-6" />;
      case 'Cpu': return <Cpu className="w-6 h-6" />;
      case 'Package': return <Package className="w-6 h-6" />;
      case 'CreditCard': return <CreditCard className="w-6 h-6" />;
      case 'Truck': return <Truck className="w-6 h-6" />;
      case 'TrendingUp': return <TrendingUp className="w-6 h-6" />;
      case 'GraduationCap': return <GraduationCap className="w-6 h-6" />;
      case 'Users': return <Users className="w-6 h-6" />;
      default: return <Award className="w-6 h-6" />;
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Top Notification Bar / Emergency / Contact Strip */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-4">
            {websiteConfig.contact.phone && (
              <span className="flex items-center space-x-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>{websiteConfig.contact.phone}</span>
              </span>
            )}
            {websiteConfig.contact.email && (
              <span className="hidden md:flex items-center space-x-1.5">
                <Mail className="w-3.5 h-3.5 text-sky-400" />
                <span>{websiteConfig.contact.email}</span>
              </span>
            )}
            {websiteConfig.contact.openingHours && (
              <span className="hidden lg:flex items-center space-x-1.5 text-slate-400">
                <Clock className="w-3.5 h-3.5" />
                <span>{websiteConfig.contact.openingHours}</span>
              </span>
            )}
          </div>

          <div className="flex items-center space-x-3 text-xs">
            {onExitToErp && (
              <button
                onClick={onExitToErp}
                className="inline-flex items-center space-x-1.5 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-md text-[11px] font-semibold transition-colors border border-slate-700"
              >
                <LogIn className="w-3 h-3 text-indigo-400" />
                <span>Access ERP / Admin Portal</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-100 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Tenant Brand Identity */}
          <div className="flex items-center space-x-3.5 min-w-0">
            {websiteConfig.navigation.logoUrl || tenant.logoUrl ? (
              <img
                src={websiteConfig.navigation.logoUrl || tenant.logoUrl}
                alt={tenant.name}
                referrerPolicy="no-referrer"
                className="h-11 w-11 rounded-xl object-contain border border-slate-200 p-0.5 bg-white shadow-xs"
              />
            ) : (
              <div
                className="h-11 w-11 rounded-xl flex items-center justify-center font-black text-white text-xl shadow-xs"
                style={{ backgroundColor: primaryColor }}
              >
                {tenant.name.charAt(0)}
              </div>
            )}

            <div className="min-w-0">
              <h1 className="text-lg font-black text-slate-900 tracking-tight truncate leading-tight">
                {websiteConfig.navigation.brandName || tenant.name}
              </h1>
              {websiteConfig.navigation.tagline && (
                <p className="text-xs text-slate-500 truncate font-medium">
                  {websiteConfig.navigation.tagline}
                </p>
              )}
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {websiteConfig.pages
              .filter(p => p.isPublished && p.showInNav)
              .map(page => {
                const isActive = activePageSlug === page.slug;
                return (
                  <button
                    key={page.id}
                    onClick={() => {
                      setActivePageSlug(page.slug);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                      isActive
                        ? 'text-slate-950 font-bold bg-slate-100'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    {page.title}
                  </button>
                );
              })}
          </nav>

          {/* Call to Action Button */}
          <div className="hidden sm:flex items-center space-x-3">
            <button
              onClick={() => {
                const contactSec = document.getElementById('contact-section');
                if (contactSec) {
                  contactSec.scrollIntoView({ behavior: 'smooth' });
                } else {
                  setActivePageSlug('contact');
                }
              }}
              style={{ backgroundColor: primaryColor }}
              className="px-4 py-2.5 rounded-xl text-white text-xs font-bold shadow-sm hover:opacity-95 transition-opacity flex items-center space-x-1.5"
            >
              <span>{websiteConfig.navigation.ctaButtonText || 'Get in Touch'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg">
            {websiteConfig.pages
              .filter(p => p.isPublished && p.showInNav)
              .map(page => (
                <button
                  key={page.id}
                  onClick={() => {
                    setActivePageSlug(page.slug);
                    setMobileMenuOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold ${
                    activePageSlug === page.slug
                      ? 'bg-slate-100 text-slate-900 font-bold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {page.title}
                </button>
              ))}

            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  const contactSec = document.getElementById('contact-section');
                  if (contactSec) contactSec.scrollIntoView({ behavior: 'smooth' });
                  else setActivePageSlug('contact');
                }}
                style={{ backgroundColor: primaryColor }}
                className="w-full py-2.5 rounded-xl text-white text-xs font-bold shadow-sm text-center"
              >
                {websiteConfig.navigation.ctaButtonText || 'Get in Touch'}
              </button>

              {onExitToErp && (
                <button
                  onClick={onExitToErp}
                  className="w-full py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl text-center"
                >
                  Enter Private ERP System
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Page Body Content */}
      <main className="flex-1">
        {activePage.sections
          .filter(s => s.isVisible)
          .sort((a, b) => a.order - b.order)
          .map(sec => {
            switch (sec.type) {
              case 'hero':
                return (
                  <section
                    key={sec.id}
                    className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white py-16 lg:py-24 border-b border-slate-100"
                  >
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                        <div className="lg:col-span-7 space-y-6">
                          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-100">
                            <Shield className="w-3.5 h-3.5" />
                            <span>{tenant.type.replace(/_/g, ' ')}</span>
                          </div>

                          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                            {sec.title}
                          </h2>

                          {sec.subtitle && (
                            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl font-normal">
                              {sec.subtitle}
                            </p>
                          )}

                          <div className="flex flex-wrap gap-4 pt-2">
                            {sec.buttonText && (
                              <button
                                onClick={() => {
                                  const contactSec = document.getElementById('contact-section');
                                  if (contactSec) contactSec.scrollIntoView({ behavior: 'smooth' });
                                  else setActivePageSlug('contact');
                                }}
                                style={{ backgroundColor: primaryColor }}
                                className="px-6 py-3.5 rounded-xl text-white text-sm font-bold shadow-md hover:opacity-95 transition-all flex items-center space-x-2"
                              >
                                <span>{sec.buttonText}</span>
                                <ArrowRight className="w-4 h-4" />
                              </button>
                            )}
                            {sec.secondaryButtonText && (
                              <button
                                onClick={() => {
                                  const target = document.getElementById('services-section') || document.getElementById('about-section');
                                  if (target) target.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="px-6 py-3.5 rounded-xl bg-white border border-slate-300 hover:border-slate-400 text-slate-700 hover:text-slate-900 text-sm font-semibold transition-colors shadow-xs"
                              >
                                {sec.secondaryButtonText}
                              </button>
                            )}
                          </div>
                        </div>

                        {sec.imageUrl && (
                          <div className="lg:col-span-5 relative">
                            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-4/3">
                              <img
                                src={sec.imageUrl}
                                alt={sec.title}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </section>
                );

              case 'stats':
                return (
                  <section key={sec.id} className="py-12 bg-slate-900 text-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                        {sec.items?.map(st => (
                          <div key={st.id} className="p-4 space-y-2 border-r border-slate-800 last:border-none">
                            <div className="h-10 w-10 mx-auto rounded-xl bg-slate-800 flex items-center justify-center text-indigo-400">
                              {renderIcon(st.icon)}
                            </div>
                            <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                              {st.title}
                            </div>
                            <div className="text-xs sm:text-sm text-slate-400 font-medium">
                              {st.description}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>
                );

              case 'services':
              case 'products':
                return (
                  <section id="services-section" key={sec.id} className="py-16 lg:py-24 bg-slate-50 border-b border-slate-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                      <div className="text-center max-w-3xl mx-auto space-y-3">
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                          {sec.title}
                        </h2>
                        {sec.subtitle && (
                          <p className="text-sm sm:text-base text-slate-600">
                            {sec.subtitle}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {sec.items?.map(it => (
                          <div
                            key={it.id}
                            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
                          >
                            <div className="space-y-3">
                              <div
                                className="h-12 w-12 rounded-xl flex items-center justify-center font-bold text-white shadow-xs"
                                style={{ backgroundColor: primaryColor }}
                              >
                                {renderIcon(it.icon)}
                              </div>
                              <h3 className="font-bold text-slate-900 text-base">
                                {it.title}
                              </h3>
                              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                                {it.description}
                              </p>
                            </div>

                            {it.price && (
                              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                                  {it.price}
                                </span>
                                {it.badge && (
                                  <span className="text-[10px] font-bold text-slate-500 uppercase">
                                    {it.badge}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>
                );

              case 'about':
                return (
                  <section id="about-section" key={sec.id} className="py-16 lg:py-24 bg-white border-b border-slate-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                        {sec.imageUrl && (
                          <div className="lg:col-span-5 order-2 lg:order-1">
                            <div className="rounded-3xl overflow-hidden shadow-xl border-4 border-slate-100 aspect-4/3">
                              <img
                                src={sec.imageUrl}
                                alt={sec.title}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>
                        )}

                        <div className={`space-y-6 ${sec.imageUrl ? 'lg:col-span-7 order-1 lg:order-2' : 'lg:col-span-12'}`}>
                          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                            {sec.title}
                          </h2>
                          {sec.subtitle && (
                            <p className="text-base text-slate-700 font-medium leading-relaxed">
                              {sec.subtitle}
                            </p>
                          )}
                          {sec.content && (
                            <div className="text-sm text-slate-600 leading-relaxed space-y-4">
                              <p>{sec.content}</p>
                            </div>
                          )}

                          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                            <div className="flex items-center space-x-2 text-xs font-semibold text-slate-700">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              <span>Verified Quality Standards</span>
                            </div>
                            <div className="flex items-center space-x-2 text-xs font-semibold text-slate-700">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              <span>Dedicated Support Staff</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                );

              case 'contact':
                return (
                  <section id="contact-section" key={sec.id} className="py-16 lg:py-24 bg-slate-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                      <div className="text-center max-w-2xl mx-auto space-y-3">
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                          {sec.title}
                        </h2>
                        {sec.subtitle && (
                          <p className="text-sm sm:text-base text-slate-600">
                            {sec.subtitle}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Contact Information Cards */}
                        <div className="lg:col-span-5 space-y-4">
                          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
                            <h3 className="text-base font-bold text-slate-900">
                              Headquarters & Contact
                            </h3>

                            <div className="space-y-4 text-sm text-slate-600">
                              <div className="flex items-start space-x-3">
                                <MapPin className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                                <div>
                                  <div className="font-semibold text-slate-900">Physical Location</div>
                                  <div>{websiteConfig.contact.address || tenant.address || 'Nairobi, Kenya'}</div>
                                </div>
                              </div>

                              <div className="flex items-start space-x-3">
                                <Phone className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                                <div>
                                  <div className="font-semibold text-slate-900">Telephone / Mobile</div>
                                  <div>{websiteConfig.contact.phone || tenant.phone || '+254 700 000 000'}</div>
                                </div>
                              </div>

                              <div className="flex items-start space-x-3">
                                <Mail className="w-5 h-5 text-sky-600 flex-shrink-0 mt-0.5" />
                                <div>
                                  <div className="font-semibold text-slate-900">Official Email</div>
                                  <div>{websiteConfig.contact.email || tenant.contactEmail || 'info@domain.ke'}</div>
                                </div>
                              </div>

                              <div className="flex items-start space-x-3">
                                <Clock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                <div>
                                  <div className="font-semibold text-slate-900">Working Hours</div>
                                  <div>{websiteConfig.contact.openingHours || 'Mon - Fri: 8:00 AM - 5:00 PM'}</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Interactive Inquiry Form */}
                        <div className="lg:col-span-7">
                          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
                            <h3 className="text-base font-bold text-slate-900 mb-2">
                              Send Us a Direct Message
                            </h3>
                            <p className="text-xs text-slate-500 mb-6">
                              Our desk responds promptly during official working hours.
                            </p>

                            {inquirySubmitted ? (
                              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
                                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                                <h4 className="font-bold text-emerald-900 text-sm">Message Received Successfully</h4>
                                <p className="text-xs text-emerald-700">
                                  Thank you for reaching out to {tenant.name}. Our administration team will respond to your email shortly.
                                </p>
                                <button
                                  onClick={() => setInquirySubmitted(false)}
                                  className="mt-3 px-4 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold"
                                >
                                  Send Another Message
                                </button>
                              </div>
                            ) : (
                              <form onSubmit={handleInquirySubmit} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                                      Your Full Name *
                                    </label>
                                    <input
                                      type="text"
                                      required
                                      value={inquiryForm.fullName}
                                      onChange={e => setInquiryForm({ ...inquiryForm, fullName: e.target.value })}
                                      placeholder="e.g. Samuel Mutua"
                                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-none"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                                      Email Address *
                                    </label>
                                    <input
                                      type="email"
                                      required
                                      value={inquiryForm.email}
                                      onChange={e => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                                      placeholder="samuel@example.com"
                                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-none"
                                    />
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                                      Phone Number
                                    </label>
                                    <input
                                      type="tel"
                                      value={inquiryForm.phone}
                                      onChange={e => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                                      placeholder="+254 700 000 000"
                                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-none"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                                      Subject / Reason
                                    </label>
                                    <select
                                      value={inquiryForm.subject}
                                      onChange={e => setInquiryForm({ ...inquiryForm, subject: e.target.value })}
                                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-none"
                                    >
                                      <option value="Admissions Inquiry">Admissions / Enrollment</option>
                                      <option value="Fee Structure Inquiry">Fee Structure & Pricing</option>
                                      <option value="General Inquiry">General Information</option>
                                      <option value="Appointment Booking">Consultation / Appointment</option>
                                      <option value="Careers">Careers & Placement</option>
                                    </select>
                                  </div>
                                </div>

                                <div>
                                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    Your Message *
                                  </label>
                                  <textarea
                                    rows={4}
                                    required
                                    value={inquiryForm.message}
                                    onChange={e => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                                    placeholder="Please describe your inquiry or request..."
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-none resize-none"
                                  />
                                </div>

                                <button
                                  type="submit"
                                  style={{ backgroundColor: primaryColor }}
                                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-white text-xs font-bold shadow-sm hover:opacity-95 transition-opacity flex items-center justify-center space-x-2"
                                >
                                  <Send className="w-3.5 h-3.5" />
                                  <span>Send Inquiry Now</span>
                                </button>
                              </form>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                );

              default:
                return null;
            }
          })}
      </main>

      {/* Website Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                {websiteConfig.navigation.logoUrl || tenant.logoUrl ? (
                  <img
                    src={websiteConfig.navigation.logoUrl || tenant.logoUrl}
                    alt={tenant.name}
                    referrerPolicy="no-referrer"
                    className="h-9 w-9 rounded-lg object-contain bg-white p-0.5"
                  />
                ) : (
                  <div
                    className="h-9 w-9 rounded-lg flex items-center justify-center font-bold text-white text-base"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {tenant.name.charAt(0)}
                  </div>
                )}
                <span className="font-bold text-white text-sm">
                  {websiteConfig.navigation.brandName || tenant.name}
                </span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                {tenant.motto || 'Committed to excellence, integrity and reliable community service.'}
              </p>
            </div>

            <div>
              <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Quick Links</h4>
              <ul className="space-y-2 text-xs">
                {websiteConfig.pages.filter(p => p.isPublished).map(p => (
                  <li key={p.id}>
                    <button
                      onClick={() => {
                        setActivePageSlug(p.slug);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="hover:text-white transition-colors"
                    >
                      {p.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Contact Desk</h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-1">
                {websiteConfig.contact.address || tenant.address}
              </p>
              <p className="text-xs text-slate-400 leading-relaxed mb-1">
                Phone: {websiteConfig.contact.phone || tenant.phone}
              </p>
              <p className="text-xs text-slate-400 leading-relaxed">
                Email: {websiteConfig.contact.email || tenant.contactEmail}
              </p>
            </div>

            <div>
              <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Internal Access</h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-3">
                Authorized staff and administrators can access the cloud management dashboard:
              </p>
              {onExitToErp && (
                <button
                  onClick={onExitToErp}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg text-xs font-semibold transition-colors flex items-center space-x-1.5"
                >
                  <LogIn className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Enter ERP Dashboard</span>
                </button>
              )}
            </div>
          </div>

          <div className="pt-8 mt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
            <div>
              © {new Date().getFullYear()} {tenant.name}. All rights reserved.
            </div>

            {/* MANDATORY: Only display DAVETECH branding if explicitly enabled */}
            {websiteConfig.displayPlatformBranding && (
              <div className="flex items-center space-x-1 text-slate-400">
                <span>Powered by</span>
                <span className="font-bold text-slate-300">DAVETECH Cloud ERP</span>
              </div>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
};
