import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import { DEFAULT_PUBLIC_WEBSITE_CONTENT } from '../../../types';
import { Cpu, Globe, Mail, Phone, MapPin, Shield, ExternalLink } from 'lucide-react';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenAdmin }) => {
  const { platformSettings } = useAuth();
  const content = platformSettings?.publicWebsiteContent || DEFAULT_PUBLIC_WEBSITE_CONTENT;

  return (
    <footer className="bg-slate-950 border-t border-slate-900 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              {platformSettings?.logoUrl ? (
                <div className="w-10 h-10 rounded-xl bg-white/10 p-1 flex items-center justify-center shadow-md">
                  <img src={platformSettings.logoUrl} alt={platformSettings?.name || 'DAVETECH'} className="w-full h-full object-contain" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                  <Cpu className="w-5 h-5" />
                </div>
              )}
              <div>
                <span className="text-xl font-extrabold text-white tracking-wider">{platformSettings?.name || 'DAVETECH'}</span>
                <span className="block text-[10px] font-mono text-indigo-400 tracking-widest uppercase">{platformSettings?.tagline || 'Enterprise Cloud ERP'}</span>
              </div>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-sm">
              {content.footerTagline}
            </p>
            <div className="pt-2 space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-indigo-400" /> Nairobi, Kenya & Global Cloud</div>
              {platformSettings?.supportPhone && (
                <div className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-indigo-400" /> {platformSettings.supportPhone}</div>
              )}
              {platformSettings?.supportEmail && (
                <div className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-indigo-400" /> {platformSettings.supportEmail}</div>
              )}
            </div>

          </div>

          {/* Solutions */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">Solutions</h4>
            <ul className="space-y-2.5 text-xs">
              <li><button onClick={() => onNavigate('solutions')} className="hover:text-white transition-colors">School ERP (K-12)</button></li>
              <li><button onClick={() => onNavigate('solutions')} className="hover:text-white transition-colors">College & University</button></li>
              <li><button onClick={() => onNavigate('solutions')} className="hover:text-white transition-colors">Hospital EMR & Clinics</button></li>
              <li><button onClick={() => onNavigate('solutions')} className="hover:text-white transition-colors">Retail POS & Inventory</button></li>
              <li><button onClick={() => onNavigate('solutions')} className="hover:text-white transition-colors">Wholesale Distribution</button></li>
              <li><button onClick={() => onNavigate('solutions')} className="hover:text-white transition-colors">HR & Payroll</button></li>
            </ul>
          </div>

          {/* Modules & Platform */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">Platform & Modules</h4>
            <ul className="space-y-2.5 text-xs">
              <li><button onClick={() => onNavigate('modules')} className="hover:text-white transition-colors">All 50+ Modules</button></li>
              <li><button onClick={() => onNavigate('modules')} className="hover:text-white transition-colors">Multi-Tenant Architecture</button></li>
              <li><button onClick={() => onNavigate('pricing')} className="hover:text-white transition-colors">Pricing & Tiers</button></li>
              <li><button onClick={() => onNavigate('modules')} className="hover:text-white transition-colors">M-Pesa Integration</button></li>
              <li><button onClick={() => onNavigate('modules')} className="hover:text-white transition-colors">Cloud Security & RBAC</button></li>
              <li><button onClick={() => onNavigate('modules')} className="hover:text-white transition-colors">Business Intelligence</button></li>
            </ul>
          </div>

          {/* Company & Legal */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">Company & Support</h4>
            <ul className="space-y-2.5 text-xs">
              <li><a href="#about" onClick={(e) => { e.preventDefault(); onNavigate('about'); }} className="hover:text-white transition-colors">About DAVETECH</a></li>
              <li><a href="#resources" onClick={(e) => { e.preventDefault(); onNavigate('resources'); }} className="hover:text-white transition-colors">Resources & Docs</a></li>
              <li><a href="#contact" onClick={(e) => { e.preventDefault(); onNavigate('contact'); }} className="hover:text-white transition-colors">Contact Support</a></li>
              <li><a href="#privacy" onClick={(e) => { e.preventDefault(); }} className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#terms" onClick={(e) => { e.preventDefault(); }} className="hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} DAVETECH Enterprise Cloud Technologies Ltd. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span>Secure Cloud ERP</span>
            <span>•</span>
            <span>ISO 27001 Certified</span>
            <span>•</span>
            <span>99.99% SLA</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
