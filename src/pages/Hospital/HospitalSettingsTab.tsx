import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Settings, Save, CheckCircle } from 'lucide-react';
import { LogoUploader, FaviconUploader } from '../../components/LogoUploader';

export const HospitalSettingsTab: React.FC = () => {
  const { tenant, updateTenantSettings } = useAuth();

  const [name, setName] = useState(tenant?.name || '');
  const [logoUrl, setLogoUrl] = useState(tenant?.logoUrl || '');
  const [favicon, setFavicon] = useState(tenant?.favicon || tenant?.faviconUrl || '');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenant) return;

    await updateTenantSettings(tenant.id, {
      name,
      logoUrl,
      favicon,
      faviconUrl: favicon,
    });

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-2xl bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center space-x-2 text-rose-600 mb-1">
        <Settings className="h-5 w-5" />
        <h2 className="text-lg font-black text-slate-900">Hospital Settings</h2>
      </div>
      
      {saveSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center space-x-2">
          <CheckCircle className="h-4 w-4 text-emerald-600" />
          <span>Settings updated successfully!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <LogoUploader
          currentLogoUrl={logoUrl}
          onLogoChange={(url) => setLogoUrl(url)}
          entityName={name || 'Hospital'}
          label="Hospital Logo"
        />

        <div className="pt-2 border-t border-slate-100">
          <FaviconUploader
            currentFaviconUrl={favicon}
            onFaviconChange={(url) => setFavicon(url)}
            label="Hospital Browser Tab Favicon"
            sublabel="Upload 32x32px ICO or PNG icon for hospital portal tabs."
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Hospital Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-rose-600 text-white text-xs font-semibold rounded-xl hover:bg-rose-500 flex items-center space-x-1"
        >
          <Save className="h-4 w-4" />
          <span>Save Settings</span>
        </button>
      </form>
    </div>
  );
};
