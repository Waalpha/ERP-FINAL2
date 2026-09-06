import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import {
  Building2,
  Save,
  CheckCircle2,
  Globe,
  Mail,
  Phone,
  MapPin,
  Palette,
  Image as ImageIcon,
  Calendar,
  Sparkles,
  RefreshCw,
  Coins
} from 'lucide-react';
import { LogoUploader, FaviconUploader } from '../../../components/LogoUploader';
import { Tenant } from '../../../types';

interface CollegeSettingsTabProps {
  tenant: Tenant;
}

export const CollegeSettingsTab: React.FC<CollegeSettingsTabProps> = ({ tenant }) => {
  const { updateTenantSettings } = useAuth();

  const [name, setName] = useState(tenant.name || '');
  const [type, setType] = useState(tenant.type || 'COLLEGE');
  const [logoUrl, setLogoUrl] = useState(tenant.logoUrl || '');
  const [faviconUrl, setFaviconUrl] = useState(tenant.faviconUrl || '');
  const [motto, setMotto] = useState(tenant.motto || '');
  const [phone, setPhone] = useState(tenant.contactPhone || '+254 700 000 000');
  const [email, setEmail] = useState(tenant.contactEmail || `info@${tenant.subdomain}.davetech.co.ke`);
  const [address, setAddress] = useState(tenant.address || 'Thika Road Campus, Nairobi, Kenya');
  const [website, setWebsite] = useState(tenant.website || `https://${tenant.subdomain}.davetech.co.ke`);
  const [primaryColor, setPrimaryColor] = useState(tenant.primaryColor || '#4f46e5');
  const [secondaryColor, setSecondaryColor] = useState(tenant.secondaryColor || '#0ea5e9');
  const [currency, setCurrency] = useState(tenant.currency || 'KES');
  const [academicYear, setAcademicYear] = useState(tenant.currentAcademicYear || '2025/2026');
  const [currentTerm, setCurrentTerm] = useState(tenant.currentTerm || 'Semester 1');

  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateTenantSettings(tenant.id, {
        name,
        type: type as any,
        logoUrl,
        faviconUrl,
        favicon: faviconUrl,
        motto,
        contactPhone: phone,
        contactEmail: email,
        address,
        website,
        primaryColor,
        secondaryColor,
        currency,
        currentAcademicYear: academicYear,
        currentTerm
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3500);
    } catch (err) {
      console.error('Failed to update tenant branding', err);
    } finally {
      setIsSaving(false);
    }
  };

  const presetColors = [
    { label: 'Royal Indigo', primary: '#4f46e5', secondary: '#06b6d4' },
    { label: 'KCA Maroon & Gold', primary: '#881337', secondary: '#f59e0b' },
    { label: 'Navy & Cyan', primary: '#0f172a', secondary: '#0284c7' },
    { label: 'Emerald Green', primary: '#047857', secondary: '#10b981' },
    { label: 'University Purple', primary: '#6b21a8', secondary: '#a855f7' },
    { label: 'Crimson Red', primary: '#b91c1c', secondary: '#fbbf24' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-900">Institution Profile & Dynamic Branding</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Customize college name, institutional logo, theme colors, academic session, and public contact information.
          </p>
        </div>
        {savedSuccess && (
          <div className="flex items-center space-x-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>Branding saved & applied!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Form Fields */}
        <div className="lg:col-span-2 space-y-6">
          {/* General Identity */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2 border-b border-slate-100 pb-3">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>General Identity</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Institution Legal Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. KCA Metropolitan College & Institute"
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Institution Type
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none"
                >
                  <option value="COLLEGE">College / TVET Institute</option>
                  <option value="UNIVERSITY">Chartered University</option>
                  <option value="THEOLOGY_SEMINARY">Theological Seminary</option>
                  <option value="PRIMARY_SCHOOL">Primary & Junior School (CBC)</option>
                  <option value="SECONDARY_SCHOOL">Senior Secondary School</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Institutional Motto / Tagline
                </label>
                <input
                  type="text"
                  value={motto}
                  onChange={(e) => setMotto(e.target.value)}
                  placeholder="e.g. Advancing Knowledge, Driving Change"
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Media & Branding Assets */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2 border-b border-slate-100 pb-3">
              <ImageIcon className="w-4 h-4 text-indigo-600" />
              <span>Logos & Brand Color Palette</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                  <LogoUploader
                    currentLogoUrl={logoUrl}
                    onLogoChange={(url) => setLogoUrl(url)}
                    entityName={name || 'Institution'}
                    label="Institution Crest / Logo"
                  />
                </div>
              </div>

              <div>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                  <FaviconUploader
                    currentFaviconUrl={faviconUrl}
                    onFaviconChange={(url) => setFaviconUrl(url)}
                    label="Browser Tab Favicon"
                    sublabel="Upload 32x32px ICO or PNG icon for college portal tabs."
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Primary Theme Color
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="h-9 w-12 rounded-xl border border-slate-200 p-1 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="flex-1 px-3.5 py-2 text-xs border border-slate-200 rounded-xl font-mono uppercase focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Secondary Accent Color
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="h-9 w-12 rounded-xl border border-slate-200 p-1 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="flex-1 px-3.5 py-2 text-xs border border-slate-200 rounded-xl font-mono uppercase focus:outline-none"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-[11px] font-semibold text-slate-500 mb-2">
                  Quick Brand Palettes:
                </label>
                <div className="flex flex-wrap gap-2">
                  {presetColors.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => {
                        setPrimaryColor(preset.primary);
                        setSecondaryColor(preset.secondary);
                      }}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium flex items-center space-x-2 hover:bg-slate-50 transition"
                    >
                      <div className="flex -space-x-1">
                        <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: preset.primary }} />
                        <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: preset.secondary }} />
                      </div>
                      <span>{preset.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Academic & Financial Defaults */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2 border-b border-slate-100 pb-3">
              <Calendar className="w-4 h-4 text-indigo-600" />
              <span>Academic Session & Financial Defaults</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Active Academic Year
                </label>
                <input
                  type="text"
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  placeholder="e.g. 2025/2026"
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Current Term / Semester
                </label>
                <select
                  value={currentTerm}
                  onChange={(e) => setCurrentTerm(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none"
                >
                  <option value="Semester 1">Semester 1</option>
                  <option value="Semester 2">Semester 2</option>
                  <option value="Trimester 1">Trimester 1</option>
                  <option value="Trimester 2">Trimester 2</option>
                  <option value="Trimester 3">Trimester 3</option>
                  <option value="Term 1">Term 1</option>
                  <option value="Term 2">Term 2</option>
                  <option value="Term 3">Term 3</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Operating Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none"
                >
                  <option value="KES">KES - Kenyan Shilling</option>
                  <option value="USD">USD - US Dollar</option>
                  <option value="UGX">UGX - Ugandan Shilling</option>
                  <option value="TZS">TZS - Tanzanian Shilling</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                </select>
              </div>
            </div>
          </div>

          {/* Contact & Location */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2 border-b border-slate-100 pb-3">
              <MapPin className="w-4 h-4 text-indigo-600" />
              <span>Campus Contact & Official Channels</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Official Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+254 700 000 000"
                    className="w-full pl-9 pr-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Official Admissions Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admissions@kcacollege.davetech.co.ke"
                    className="w-full pl-9 pr-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Official Website
                </label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://kcacollege.davetech.co.ke"
                    className="w-full pl-9 pr-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Physical Campus Location
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Thika Road Campus, Nairobi, Kenya"
                    className="w-full pl-9 pr-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Live Live Preview & Save Panel */}
        <div className="space-y-6">
          {/* Live Preview Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
              Live Brand Preview
            </h3>

            {/* Simulated Header Card */}
            <div className="rounded-2xl border border-slate-200 p-4 bg-slate-50 space-y-3">
              <div className="flex items-center space-x-3">
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt={name}
                    referrerPolicy="no-referrer"
                    className="h-12 w-12 rounded-xl object-contain border border-slate-200 bg-white p-1"
                  />
                ) : (
                  <div
                    className="h-12 w-12 rounded-xl flex items-center justify-center font-black text-white text-xl shadow-xs"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {name.charAt(0) || 'K'}
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <div className="text-sm font-bold text-slate-900 truncate">{name || 'Institution Name'}</div>
                  <div className="text-[11px] text-slate-500 font-mono">{tenant.subdomain}.davetech.co.ke</div>
                </div>
              </div>

              {motto && (
                <div className="text-xs italic text-slate-600 bg-white p-2.5 rounded-xl border border-slate-100">
                  &ldquo;{motto}&rdquo;
                </div>
              )}

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                <span className="text-slate-500">Theme Palette:</span>
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 rounded-lg border border-slate-300 shadow-xs" style={{ backgroundColor: primaryColor }} title="Primary" />
                  <div className="w-5 h-5 rounded-lg border border-slate-300 shadow-xs" style={{ backgroundColor: secondaryColor }} title="Secondary" />
                </div>
              </div>
            </div>

            {/* Tenant Quick Facts */}
            <div className="text-xs text-slate-600 space-y-2 pt-2 border-t border-slate-100">
              <div className="flex justify-between">
                <span className="text-slate-400">Current Session:</span>
                <span className="font-mono font-semibold text-slate-900">{academicYear} • {currentTerm}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Currency:</span>
                <span className="font-bold text-slate-900">{currency}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Contact:</span>
                <span className="text-slate-900 truncate">{phone}</span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-lg space-y-4">
            <div>
              <div className="text-sm font-bold">Deploy Changes</div>
              <div className="text-xs text-slate-400 mt-0.5">
                Saving updates will instantly refresh the tenant theme, logos, and public branding across the portal.
              </div>
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center justify-center space-x-2 disabled:opacity-50"
              style={{ backgroundColor: primaryColor }}
            >
              {isSaving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Updating Branding...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save & Apply Settings</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
