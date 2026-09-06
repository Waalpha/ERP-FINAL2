import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Shield,
  Settings,
  Sliders,
  Users,
  Key,
  Globe,
  Radio,
  FileText,
  Activity,
  CheckCircle,
  AlertTriangle,
  Save,
  Search,
  Download,
  Filter,
  RefreshCw,
  Printer,
  Smartphone,
  Database,
  Lock,
  ExternalLink
} from 'lucide-react';
import { Tenant, UserRole, ModulePermissionKey, PermissionOperation, DEFAULT_ROLE_PERMISSIONS } from '../../types';

interface SystemAdministrationProps {
  onNavigateToStaff?: () => void;
  onNavigateToWebsite?: () => void;
}

export const SystemAdministration: React.FC<SystemAdministrationProps> = ({
  onNavigateToStaff,
  onNavigateToWebsite
}) => {
  const { currentTenant, updateTenant, user, auditLogs, logAuditAction } = useAuth();

  const isAuthorized = user?.role === 'TENANT_ADMIN' || user?.role === 'SUPER_ADMIN';

  const [activeTab, setActiveTab] = useState<'profile' | 'modules' | 'roles' | 'integrations' | 'audit' | 'data'>('profile');

  // Tenant Profile Settings State
  const [profileForm, setProfileForm] = useState({
    name: currentTenant?.name || '',
    code: currentTenant?.code || '',
    motto: currentTenant?.motto || '',
    contactEmail: currentTenant?.contactEmail || '',
    phone: currentTenant?.phone || '',
    address: currentTenant?.address || '',
    currency: currentTenant?.currency || 'KES',
    currentTerm: currentTenant?.currentTerm || 'TERM_1',
    currentAcademicYear: currentTenant?.currentAcademicYear || '2025'
  });

  // Modules State
  const [tenantModules, setTenantModules] = useState<string[]>(currentTenant?.modules || []);

  // Integrations State
  const [integrations, setIntegrations] = useState({
    mpesaEnabled: true,
    mpesaShortcode: '174379',
    mpesaPasskey: 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919',
    mpesaConsumerKey: 'K9x28df8201hd92hd',
    mpesaConsumerSecret: '*********************',
    mpesaSandbox: true,
    smsApiKey: 'sms_live_89128038102',
    smsSenderId: currentTenant?.code?.slice(0, 8) || 'DAVETECH',
    printerWidth: '80mm',
    printerAutoCut: true
  });

  // Audit Logs Filter State
  const [auditSearch, setAuditSearch] = useState('');
  const [auditActionFilter, setAuditActionFilter] = useState('ALL');
  const [auditModuleFilter, setAuditModuleFilter] = useState('ALL');

  const [saveSuccess, setSaveSuccess] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  if (!isAuthorized) {
    return (
      <div className="p-8 bg-white rounded-2xl border border-red-200 shadow-xs text-center space-y-4 max-w-xl mx-auto my-12">
        <div className="h-12 w-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
          <Lock className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-slate-900">Access Restricted</h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          System Administration is strictly reserved for the authorized <span className="font-bold text-slate-700">Tenant Administrator</span> or Davetech Super Administrator. Your current role is <span className="font-bold text-red-600">{user?.role}</span>.
        </p>
      </div>
    );
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTenant) return;
    setIsSaving(true);
    try {
      await updateTenant(currentTenant.id, {
        ...profileForm
      });
      await logAuditAction({
        action: 'SETTINGS_CHANGE',
        module: 'SETTINGS',
        record: `Tenant Profile: ${currentTenant.name}`,
        result: 'SUCCESS',
        details: 'Updated organization profile, contact email, and academic/operating terms'
      });
      setSaveSuccess('System administration settings updated successfully!');
      setTimeout(() => setSaveSuccess(''), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleModule = async (modKey: string) => {
    if (!currentTenant) return;
    const exists = tenantModules.includes(modKey);
    const updated = exists ? tenantModules.filter(m => m !== modKey) : [...tenantModules, modKey];
    setTenantModules(updated);
    await updateTenant(currentTenant.id, { modules: updated });
    await logAuditAction({
      action: 'SETTINGS_CHANGE',
      module: 'SETTINGS',
      record: `Modules: ${modKey}`,
      result: 'SUCCESS',
      details: `${exists ? 'Disabled' : 'Enabled'} module ${modKey}`
    });
  };

  const allAvailableModules = [
    { key: 'STUDENTS', label: 'Learners & Student Admissions', desc: 'Enrollment, student profiles, CBC registration' },
    { key: 'STAFF', label: 'Staff Management & Payroll', desc: 'Faculty profiles, workload allocation, credentials' },
    { key: 'CBC_ACADEMICS', label: 'CBC Academics & Curricula', desc: 'Competency assessments, learning strands, rubrics' },
    { key: 'FEES_FINANCE', label: 'Fees & Invoicing Accounts', desc: 'Fee structures, M-Pesa receipts, balances' },
    { key: 'POS', label: 'Cashier POS Workstation', desc: 'Fast bar/retail/shop checkout, thermal receipts' },
    { key: 'RETAIL_INVENTORY', label: 'Inventory & Stock Control', desc: 'Stock replenishment, batches, supplier invoices' },
    { key: 'HOSPITAL_EMR', label: 'Clinical EMR & Triage', desc: 'Patient records, consultations, pharmacy' },
    { key: 'THEOLOGY', label: 'Theological Seminary Curricula', desc: 'Ministry practicum, divinity courses' },
    { key: 'COLLEGE_FACULTY', label: 'Higher Ed Departments', desc: 'Faculties, units, credit hours' },
    { key: 'WEBSITE_CMS', label: 'Modern Public Website / CMS', desc: 'White-label public site editor and pages' },
    { key: 'BULK_SMS', label: 'SMS & Broadcast Gateway', desc: 'Automated fee reminders and event notices' },
    { key: 'REPORTS', label: 'Analytics & Audit Trail', desc: 'Financial ledgers, executive summaries' }
  ];

  const filteredAuditLogs = auditLogs.filter(log => {
    const matchesSearch =
      (log.action || '').toLowerCase().includes(auditSearch.toLowerCase()) ||
      (log.record || '').toLowerCase().includes(auditSearch.toLowerCase()) ||
      (log.userEmail || '').toLowerCase().includes(auditSearch.toLowerCase()) ||
      (log.details || '').toLowerCase().includes(auditSearch.toLowerCase());

    const matchesAction = auditActionFilter === 'ALL' || log.action === auditActionFilter;
    const matchesMod = auditModuleFilter === 'ALL' || (log.module || '') === auditModuleFilter;

    return matchesSearch && matchesAction && matchesMod;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-indigo-50 text-indigo-700 rounded-xl">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                System Administration
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-100">
                Tenant Admin Root
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Complete administrative authority over organization settings, active modules, RBAC roles, integrations, and audit trail.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {onNavigateToStaff && (
            <button
              onClick={onNavigateToStaff}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center space-x-1.5 transition-colors"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Staff Directory</span>
            </button>
          )}

          {onNavigateToWebsite && (
            <button
              onClick={onNavigateToWebsite}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center space-x-1.5 transition-colors"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Manage Website / CMS</span>
            </button>
          )}
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center space-x-3 text-emerald-800 text-xs font-semibold">
          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{saveSuccess}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center space-x-2 whitespace-nowrap ${
            activeTab === 'profile'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Organization Profile</span>
        </button>

        <button
          onClick={() => setActiveTab('modules')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center space-x-2 whitespace-nowrap ${
            activeTab === 'modules'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Tenant Modules</span>
        </button>

        <button
          onClick={() => setActiveTab('roles')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center space-x-2 whitespace-nowrap ${
            activeTab === 'roles'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Key className="w-4 h-4" />
          <span>RBAC Roles Matrix</span>
        </button>

        <button
          onClick={() => setActiveTab('integrations')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center space-x-2 whitespace-nowrap ${
            activeTab === 'integrations'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Radio className="w-4 h-4" />
          <span>System Integrations</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center space-x-2 whitespace-nowrap ${
            activeTab === 'audit'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>System Audit Logs ({auditLogs.length})</span>
        </button>
      </div>

      {/* TAB 1: ORGANIZATION PROFILE */}
      {activeTab === 'profile' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs max-w-4xl space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900">Organization Settings</h2>
            <p className="text-xs text-slate-500">
              Update legal business details, currency, terms and administrative contacts.
            </p>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Organization Name</label>
                <input
                  type="text"
                  required
                  value={profileForm.name}
                  onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Organization Code</label>
                <input
                  type="text"
                  required
                  value={profileForm.code}
                  onChange={e => setProfileForm({ ...profileForm, code: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Motto / Slogan</label>
                <input
                  type="text"
                  value={profileForm.motto}
                  onChange={e => setProfileForm({ ...profileForm, motto: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Administrative Email</label>
                <input
                  type="email"
                  required
                  value={profileForm.contactEmail}
                  onChange={e => setProfileForm({ ...profileForm, contactEmail: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Telephone Hotline</label>
                <input
                  type="text"
                  value={profileForm.phone}
                  onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Physical Address</label>
                <input
                  type="text"
                  value={profileForm.address}
                  onChange={e => setProfileForm({ ...profileForm, address: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Operational Currency</label>
                <select
                  value={profileForm.currency}
                  onChange={e => setProfileForm({ ...profileForm, currency: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold"
                >
                  <option value="KES">KES - Kenyan Shilling</option>
                  <option value="USD">USD - US Dollar</option>
                  <option value="UGX">UGX - Ugandan Shilling</option>
                  <option value="TZS">TZS - Tanzanian Shilling</option>
                  <option value="RWF">RWF - Rwandan Franc</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Current Term / Cycle</label>
                <select
                  value={profileForm.currentTerm}
                  onChange={e => setProfileForm({ ...profileForm, currentTerm: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                >
                  <option value="TERM_1">Term 1</option>
                  <option value="TERM_2">Term 2</option>
                  <option value="TERM_3">Term 3</option>
                  <option value="SEMESTER_1">Semester 1</option>
                  <option value="SEMESTER_2">Semester 2</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm flex items-center space-x-1.5"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Saving...' : 'Save Organization Settings'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 2: TENANT MODULES */}
      {activeTab === 'modules' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900">Tenant Module Management</h2>
            <p className="text-xs text-slate-500">
              Enable or disable core functional suites for this organization.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allAvailableModules.map(mod => {
              const isEnabled = tenantModules.includes(mod.key);
              return (
                <div
                  key={mod.key}
                  className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
                    isEnabled
                      ? 'bg-indigo-50/40 border-indigo-200 shadow-xs'
                      : 'bg-slate-50 border-slate-200 opacity-75'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <h3 className="text-xs font-bold text-slate-900">{mod.label}</h3>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                          isEnabled ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {isEnabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">{mod.desc}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                    <span className="text-[11px] text-slate-600 font-mono">{mod.key}</span>
                    <button
                      onClick={() => handleToggleModule(mod.key)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                        isEnabled
                          ? 'bg-red-50 text-red-700 hover:bg-red-100'
                          : 'bg-indigo-600 text-white hover:bg-indigo-700'
                      }`}
                    >
                      {isEnabled ? 'Disable' : 'Enable'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: ROLES & RBAC MATRIX */}
      {activeTab === 'roles' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900">Role-Based Access Control (RBAC) Matrix</h2>
            <p className="text-xs text-slate-500">
              Master permissions assigned by role across all modules. Specific staff members can have custom overrides in the Staff Directory.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                  <th className="py-2.5 px-3">Role</th>
                  <th className="py-2.5 px-3">POS</th>
                  <th className="py-2.5 px-3">Finance</th>
                  <th className="py-2.5 px-3">Staff</th>
                  <th className="py-2.5 px-3">Inventory</th>
                  <th className="py-2.5 px-3">Academics</th>
                  <th className="py-2.5 px-3">Website</th>
                  <th className="py-2.5 px-3">Admin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {Object.entries(DEFAULT_ROLE_PERMISSIONS).map(([roleKey, map]) => (
                  <tr key={roleKey} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-bold text-slate-900 font-mono">
                      {roleKey}
                    </td>
                    <td className="py-2.5 px-3 text-[11px] text-slate-600">
                      {(map as any).pos?.join(', ') || '-'}
                    </td>
                    <td className="py-2.5 px-3 text-[11px] text-slate-600">
                      {(map as any).finance?.join(', ') || '-'}
                    </td>
                    <td className="py-2.5 px-3 text-[11px] text-slate-600">
                      {(map as any).staff?.join(', ') || '-'}
                    </td>
                    <td className="py-2.5 px-3 text-[11px] text-slate-600">
                      {(map as any).inventory?.join(', ') || '-'}
                    </td>
                    <td className="py-2.5 px-3 text-[11px] text-slate-600">
                      {(map as any).academics?.join(', ') || '-'}
                    </td>
                    <td className="py-2.5 px-3 text-[11px] text-slate-600">
                      {(map as any).website?.join(', ') || '-'}
                    </td>
                    <td className="py-2.5 px-3 text-[11px] text-slate-600">
                      {(map as any).settings?.join(', ') || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: SYSTEM INTEGRATIONS */}
      {activeTab === 'integrations' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* M-Pesa Daraja Gateway */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Smartphone className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-sm">M-Pesa Daraja STK Push</h3>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700">
                Connected
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Paybill / Till Number</label>
                <input
                  type="text"
                  value={integrations.mpesaShortcode}
                  onChange={e => setIntegrations({ ...integrations, mpesaShortcode: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Consumer Key</label>
                <input
                  type="text"
                  value={integrations.mpesaConsumerKey}
                  onChange={e => setIntegrations({ ...integrations, mpesaConsumerKey: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Passkey</label>
                <input
                  type="password"
                  value={integrations.mpesaPasskey}
                  onChange={e => setIntegrations({ ...integrations, mpesaPasskey: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-700 font-medium">Sandbox Mode (Testing)</span>
                <input
                  type="checkbox"
                  checked={integrations.mpesaSandbox}
                  onChange={e => setIntegrations({ ...integrations, mpesaSandbox: e.target.checked })}
                  className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                />
              </div>
            </div>
          </div>

          {/* Thermal Receipt Printer */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Printer className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-sm">ESC/POS Thermal Printer</h3>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-indigo-50 text-indigo-700">
                Ready
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Paper Roll Width</label>
                <select
                  value={integrations.printerWidth}
                  onChange={e => setIntegrations({ ...integrations, printerWidth: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                >
                  <option value="80mm">80mm Standard POS Thermal Receipt</option>
                  <option value="58mm">58mm Compact Thermal Receipt</option>
                </select>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-700 font-medium">Automatic Paper Cutter</span>
                <input
                  type="checkbox"
                  checked={integrations.printerAutoCut}
                  onChange={e => setIntegrations({ ...integrations, printerAutoCut: e.target.checked })}
                  className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: AUDIT LOGS (REQUIREMENT 7) */}
      {activeTab === 'audit' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">System Audit Trail</h2>
              <p className="text-xs text-slate-500">
                Immutable chronological log of all administrative actions, logins, role changes, and record updates.
              </p>
            </div>

            <button
              onClick={() => {
                const csvContent =
                  'data:text/csv;charset=utf-8,' +
                  ['Timestamp,Action,User,Module,Record,Result,Details']
                    .concat(
                      filteredAuditLogs.map(
                        l =>
                          `"${l.timestamp}","${l.action}","${l.userEmail}","${l.module || ''}","${l.record || ''}","${l.result || 'SUCCESS'}","${(l.details || '').replace(/"/g, '""')}"`
                      )
                    )
                    .join('\n');
                const encodedUri = encodeURI(csvContent);
                const link = document.createElement('a');
                link.setAttribute('href', encodedUri);
                link.setAttribute('download', `audit_trail_${currentTenant?.code}_${Date.now()}.csv`);
                document.body.appendChild(link);
                link.click();
              }}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>

          {/* Filter Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search audit records, user or details..."
                value={auditSearch}
                onChange={e => setAuditSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <select
                value={auditActionFilter}
                onChange={e => setAuditActionFilter(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-none"
              >
                <option value="ALL">All Action Types</option>
                <option value="CREATE">CREATE</option>
                <option value="UPDATE">UPDATE</option>
                <option value="DELETE">DELETE</option>
                <option value="LOGIN">LOGIN</option>
                <option value="LOGOUT">LOGOUT</option>
                <option value="ROLE_CHANGE">ROLE_CHANGE</option>
                <option value="PERMISSION_CHANGE">PERMISSION_CHANGE</option>
                <option value="SETTINGS_CHANGE">SETTINGS_CHANGE</option>
              </select>
            </div>

            <div>
              <select
                value={auditModuleFilter}
                onChange={e => setAuditModuleFilter(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-none"
              >
                <option value="ALL">All Modules</option>
                <option value="STAFF">STAFF</option>
                <option value="WEBSITE">WEBSITE</option>
                <option value="SETTINGS">SETTINGS</option>
                <option value="FINANCE">FINANCE</option>
                <option value="POS">POS</option>
                <option value="ACADEMICS">ACADEMICS</option>
                <option value="SECURITY">SECURITY</option>
              </select>
            </div>
          </div>

          {/* Audit Logs Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Action</th>
                  <th className="py-2.5 px-3">User</th>
                  <th className="py-2.5 px-3">Module</th>
                  <th className="py-2.5 px-3">Target Record</th>
                  <th className="py-2.5 px-3">Details</th>
                  <th className="py-2.5 px-3">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAuditLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                          log.action === 'CREATE'
                            ? 'bg-emerald-100 text-emerald-700'
                            : log.action === 'DELETE'
                            ? 'bg-red-100 text-red-700'
                            : log.action === 'UPDATE' || log.action === 'SETTINGS_CHANGE'
                            ? 'bg-blue-100 text-blue-700'
                            : log.action === 'PERMISSION_CHANGE' || log.action === 'ROLE_CHANGE'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-slate-900 whitespace-nowrap">
                      {log.userEmail}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-600">
                      {log.module || log.category || '-'}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-slate-800 whitespace-nowrap">
                      {log.record || '-'}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 max-w-xs truncate">
                      {log.details}
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                          log.result === 'FAILURE'
                            ? 'bg-red-50 text-red-700'
                            : 'bg-emerald-50 text-emerald-700'
                        }`}
                      >
                        {log.result || 'SUCCESS'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
