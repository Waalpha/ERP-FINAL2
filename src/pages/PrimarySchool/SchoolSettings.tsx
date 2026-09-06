import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Settings,
  Building,
  Save,
  CheckCircle,
  Shield,
  CreditCard,
  Phone,
  Mail,
  MapPin,
  Globe,
  ExternalLink,
  Copy,
  Check
} from 'lucide-react';
import { MAIN_DOMAIN } from '../../types';
import { LogoUploader, FaviconUploader } from '../../components/LogoUploader';

export const SchoolSettings: React.FC = () => {
  const { tenant, updateTenantSettings, subscriptionTiers } = useAuth();

  const [name, setName] = useState(tenant?.name || '');
  const [motto, setMotto] = useState(tenant?.motto || '');
  const [logoUrl, setLogoUrl] = useState(tenant?.logoUrl || '');
  const [favicon, setFavicon] = useState(tenant?.favicon || tenant?.faviconUrl || '');
  const [subdomain, setSubdomain] = useState(tenant?.subdomain || tenant?.code?.toLowerCase() || '');
  const [customDomain, setCustomDomain] = useState(tenant?.customDomain || '');
  const [publicWebsite, setPublicWebsite] = useState(tenant?.publicWebsite || '');
  const [address, setAddress] = useState(tenant?.address || '');
  const [phone, setPhone] = useState(tenant?.phone || '');
  const [contactEmail, setContactEmail] = useState(tenant?.contactEmail || '');
  const [currentAcademicYear, setCurrentAcademicYear] = useState(tenant?.currentAcademicYear || '2025');
  const [currentTerm, setCurrentTerm] = useState<'TERM_1' | 'TERM_2' | 'TERM_3'>(tenant?.currentTerm || 'TERM_1');
  const [currency, setCurrency] = useState(tenant?.currency || 'KES');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const cleanSubdomain = subdomain.toLowerCase().replace(/[^a-z0-9-]/g, '');
  const portalUrl = `https://${cleanSubdomain || 'org'}.${MAIN_DOMAIN.toLowerCase()}`;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(portalUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenant) return;

    await updateTenantSettings(tenant.id, {
      name,
      motto,
      logoUrl,
      favicon,
      faviconUrl: favicon,
      subdomain: cleanSubdomain,
      customDomain: customDomain.trim().toLowerCase() || undefined,
      publicWebsite: publicWebsite.trim() || undefined,
      dnsStatus: 'CONFIGURED',
      address,
      phone,
      contactEmail,
      currentAcademicYear,
      currentTerm,
      currency
    });

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Institution Configuration & Settings</h1>
        <p className="text-xs text-slate-500">
          Manage school identity, logo crest, assigned subdomain under {MAIN_DOMAIN}, branding, academic terms, and financial parameters.
        </p>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-semibold flex items-center space-x-2 animate-in fade-in">
          <CheckCircle className="h-4 w-4 text-emerald-600" />
          <span>Tenant settings, logo & subdomain routing updated and saved!</span>
        </div>
      )}

      {/* Settings Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6 text-xs">
        {/* Logo Crest Uploader Section */}
        <div className="space-y-4 bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4">
          <LogoUploader
            currentLogoUrl={logoUrl}
            onLogoChange={(url) => setLogoUrl(url)}
            entityName={name || tenant?.name || 'School'}
            label="Official School Crest & Badge Logo"
            sublabel="Upload school emblem to brand report cards, fee receipts, portal header, and circulars."
          />
          <div className="pt-3 border-t border-slate-200">
            <FaviconUploader
              currentFaviconUrl={favicon}
              onFaviconChange={(url) => setFavicon(url)}
              label="Browser Tab Favicon (School Tab Icon)"
              sublabel="Upload 32x32px ICO or PNG icon shown in browser tabs when visiting this school portal."
            />
          </div>
        </div>

        <div className="border-b border-slate-100 pb-2">
          <h2 className="text-sm font-bold text-slate-900">General Identity & Names</h2>
          <p className="text-[11px] text-slate-500">Legal institution nomenclature and motto</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Institution Legal Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">School Motto</label>
            <input
              type="text"
              value={motto}
              onChange={(e) => setMotto(e.target.value)}
              placeholder="e.g. Excellence in Competence & Character"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none"
            />
          </div>
        </div>

        {/* Dedicated Subdomain & Domain Configuration */}
        <div className="border-t border-slate-100 pt-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                <Globe className="h-4 w-4 text-indigo-600" />
                <span>Assigned Subdomain & Web Ingress</span>
              </h2>
              <p className="text-[11px] text-slate-500">
                All tenants are provisioned with an isolated subdomain on <strong>{MAIN_DOMAIN}</strong>
              </p>
            </div>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full flex items-center space-x-1">
              <Check className="h-3 w-3" />
              <span>DNS Active</span>
            </span>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Assigned Subdomain Prefix *
              </label>
              <div className="flex items-center rounded-xl bg-white border border-slate-200 overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500">
                <input
                  type="text"
                  required
                  value={subdomain}
                  onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                  className="flex-1 px-3 py-2 text-xs font-mono font-bold text-slate-800 focus:outline-none lowercase"
                  placeholder="e.g. staustins"
                />
                <span className="bg-slate-100 border-l border-slate-200 px-3 py-2 text-xs font-mono font-bold text-slate-600">
                  .{MAIN_DOMAIN.toLowerCase()}
                </span>
              </div>
            </div>

            {/* Live URL Link Bar */}
            <div className="p-2.5 bg-indigo-50/80 border border-indigo-100 rounded-xl flex items-center justify-between">
              <div className="flex items-center space-x-2 truncate mr-2">
                <span className="text-[11px] text-indigo-700 font-semibold flex-shrink-0">Portal URL:</span>
                <span className="font-mono text-xs font-bold text-indigo-950 truncate">
                  {portalUrl}
                </span>
              </div>
              <div className="flex items-center space-x-1 flex-shrink-0">
                <button
                  type="button"
                  onClick={handleCopyUrl}
                  className="px-2.5 py-1 text-[11px] font-semibold bg-white text-indigo-700 border border-indigo-200 rounded-lg hover:bg-indigo-50 flex items-center space-x-1 shadow-2xs"
                >
                  {copiedLink ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                  <span>{copiedLink ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Optional Custom Domain */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Custom Domain (Optional CNAME)
              </label>
              <input
                type="text"
                value={customDomain}
                onChange={(e) => setCustomDomain(e.target.value)}
                placeholder="e.g. portal.staustins.ac.ke"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono text-xs focus:outline-none"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                To link your custom domain, add a CNAME record pointing to <code className="font-bold text-slate-600 font-mono">{cleanSubdomain || 'tenant'}.{MAIN_DOMAIN.toLowerCase()}</code>
              </p>
            </div>

            {/* Public Website */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Public Official Website
              </label>
              <input
                type="url"
                value={publicWebsite}
                onChange={(e) => setPublicWebsite(e.target.value)}
                placeholder="e.g. https://www.staustins.ac.ke"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono text-xs focus:outline-none"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Link to your institution's main public marketing or information website.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-100 pt-4">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Contact Phone</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Official Email</label>
            <input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Campus Physical Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none"
            />
          </div>
        </div>

        <div className="border-t border-slate-100 pt-4">
          <h2 className="text-sm font-bold text-slate-900 mb-1">Academic & Term Parameters</h2>
          <p className="text-[11px] text-slate-500 mb-3">Controls automatic invoicing and active term report cards</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Current Academic Year</label>
              <input
                type="text"
                value={currentAcademicYear}
                onChange={(e) => setCurrentAcademicYear(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Active Term</label>
              <select
                value={currentTerm}
                onChange={(e) => setCurrentTerm(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none"
              >
                <option value="TERM_1">Term 1</option>
                <option value="TERM_2">Term 2</option>
                <option value="TERM_3">Term 3</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Billing Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-mono focus:outline-none"
              >
                <option value="KES">KES (Kenyan Shilling)</option>
                <option value="USD">USD (US Dollar)</option>
                <option value="UGX">UGX (Ugandan Shilling)</option>
                <option value="TZS">TZS (Tanzanian Shilling)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Current Subscription Plan Status */}
        {(() => {
          const currentPlanConfig = subscriptionTiers?.find(t => t.id === tenant?.plan);
          return (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CreditCard className="h-4 w-4 text-indigo-600" />
                  <span className="font-bold text-slate-800 text-xs">Current Subscription Plan:</span>
                  <span className="px-2.5 py-0.5 rounded-full font-black text-[10px] bg-indigo-100 text-indigo-800">
                    {tenant?.plan || 'BASIC'}
                  </span>
                </div>
                {currentPlanConfig && (
                  <span className="text-xs font-black text-slate-900">
                    {currentPlanConfig.currency} {currentPlanConfig.priceMonthly.toLocaleString()}/mo
                  </span>
                )}
              </div>

              {currentPlanConfig && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-slate-600 pt-1">
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block text-[9px] uppercase font-bold">Capacity</span>
                    <span className="font-semibold text-slate-800">{currentPlanConfig.maxLearnersOrRecords}</span>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block text-[9px] uppercase font-bold">Staff Limit</span>
                    <span className="font-semibold text-slate-800">{currentPlanConfig.maxStaffAccounts}</span>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block text-[9px] uppercase font-bold">Support Level</span>
                    <span className="font-semibold text-slate-800 truncate">{currentPlanConfig.supportSLA}</span>
                  </div>
                </div>
              )}
              <p className="text-[10px] text-slate-400 italic">
                To upgrade quotas, activate additional modules, or switch subscription tiers, contact your Davetech platform administrator.
              </p>
            </div>
          );
        })()}

        <div className="border-t border-slate-100 pt-4 flex justify-end">
          <button
            type="submit"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold flex items-center space-x-2 shadow-sm transition-all"
          >
            <Save className="h-4 w-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
};
