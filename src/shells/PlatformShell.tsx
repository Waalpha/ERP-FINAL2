import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { SuperAdminDashboard } from '../pages/SuperAdmin/SuperAdminDashboard';
import { PublicMarketingWebsite } from '../components/marketing/PublicMarketingWebsite';
import { LogoUploader } from '../components/LogoUploader';
import {
  Building2,
  Users,
  CreditCard,
  History,
  PlusCircle,
  Search,
  Globe,
  Database,
  Shield,
  Layers,
  Settings,
  Cloud,
  ChevronRight,
  Menu,
  X,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  HardDrive,
  LogOut,
  RefreshCw,
  Sliders,
  DollarSign,
  ArrowLeft
} from 'lucide-react';
import { TenantType, TenantPlan } from '../types';
import { MAIN_DOMAIN_SUFFIX } from '../services/TenantResolver';

export const PlatformShell: React.FC = () => {
  const {
    user,
    allTenants,
    allPlatformUsers,
    createTenant,
    isSyncingFirestore,
    lastFirestoreSyncTime,
    firebaseProjectId,
    firestoreDatabaseName,
    syncAllDataToFirestore,
    logout,
    switchTenantAsSuperAdmin,
    platformSettings
  } = useAuth();

  const [viewMode, setViewMode] = useState<'marketing' | 'super-admin'>('marketing');
  const [currentTab, setCurrentTab] = useState<string>('super-admin-overview');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // New Tenant Modal State
  const [showCreateTenantModal, setShowCreateTenantModal] = useState(false);
  const [newTenantName, setNewTenantName] = useState('');
  const [newTenantCode, setNewTenantCode] = useState('');
  const [newTenantLogoUrl, setNewTenantLogoUrl] = useState('');
  const [newTenantSubdomain, setNewTenantSubdomain] = useState('');
  const [isSubdomainManual, setIsSubdomainManual] = useState(false);
  const [newTenantType, setNewTenantType] = useState<TenantType>('PRIMARY_SCHOOL');
  const [newTenantPlan, setNewTenantPlan] = useState<TenantPlan>('PREMIUM');
  const [newTenantEmail, setNewTenantEmail] = useState('');
  const [newTenantPhone, setNewTenantPhone] = useState('+254 700 000 000');
  const [newTenantAddress, setNewTenantAddress] = useState('Nairobi, Kenya');

  const navItems = [
    { id: 'super-admin-overview', label: 'Dashboard', icon: Building2, desc: 'Platform fleet metrics & MRR' },
    { id: 'super-admin-tenants', label: 'Projects / Tenants', icon: Layers, desc: 'Manage organizations & subdomains' },
    { id: 'super-admin-domains', label: 'Domains & DNS', icon: Globe, desc: 'Wildcard & custom domains' },
    { id: 'super-admin-ssl', label: 'SSL Certificates', icon: ShieldCheck, desc: 'Automated Let’s Encrypt TLS' },
    { id: 'super-admin-deployments', label: 'Deployments', icon: Cloud, desc: 'Cloud Run & Edge container status' },
    { id: 'super-admin-databases', label: 'Databases', icon: Database, desc: 'Firestore multi-tenant partitions' },
    { id: 'super-admin-users', label: 'Users & Access', icon: Users, desc: 'Platform-wide RBAC matrix' },
    { id: 'super-admin-billing', label: 'Billing & Tiers', icon: CreditCard, desc: 'SaaS pricing, plans & limits' },
    { id: 'super-admin-audit', label: 'Audit Logs', icon: History, desc: 'Platform activity & security trails' },
    { id: 'super-admin-settings', label: 'Settings', icon: Settings, desc: 'Global platform settings & branding' }
  ];

  const handleTenantNameChange = (val: string) => {
    setNewTenantName(val);
    if (!isSubdomainManual) {
      const slug = val.toLowerCase().replace(/[^a-z0-9]/g, '');
      setNewTenantSubdomain(slug);
    }
  };

  const handleSubdomainChange = (val: string) => {
    setIsSubdomainManual(true);
    const clean = val.toLowerCase().replace(/[^a-z0-9-]/g, '');
    setNewTenantSubdomain(clean);
  };

  const handleCreateTenantSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTenantName || !newTenantCode) return;

    let defaultModules = [
      'STUDENTS',
      'STAFF',
      'CLASSES',
      'CBC_ACADEMICS',
      'ASSESSMENTS',
      'FEES_FINANCE',
      'ATTENDANCE',
      'TIMETABLE',
      'ASSIGNMENTS',
      'DISCIPLINE',
      'CALENDAR',
      'SMS_NOTIFICATIONS',
      'REPORTS'
    ];

    if (newTenantType === 'RETAIL' || newTenantType === 'BUSINESS') {
      defaultModules = ['RETAIL_POS', 'INVENTORY', 'STAFF', 'REPORTS', 'FEES_FINANCE', 'SMS_NOTIFICATIONS'];
    } else if (newTenantType === 'HOSPITAL') {
      defaultModules = ['HOSPITAL_CLINIC', 'PHARMACY', 'STAFF', 'FEES_FINANCE', 'REPORTS', 'SMS_NOTIFICATIONS'];
    } else if (newTenantType === 'COLLEGE' || newTenantType === 'UNIVERSITY') {
      defaultModules = ['STUDENTS', 'COURSES', 'DEPARTMENTS', 'FEES_FINANCE', 'LIBRARY', 'HOSTEL', 'STAFF', 'REPORTS', 'SMS_NOTIFICATIONS'];
    } else if (newTenantType === 'THEOLOGICAL') {
      defaultModules = ['STUDENTS', 'COURSES', 'DEPARTMENTS', 'FEES_FINANCE', 'LIBRARY', 'STAFF', 'REPORTS', 'SMS_NOTIFICATIONS'];
    }

    const finalSubdomain =
      newTenantSubdomain.trim().toLowerCase().replace(/[^a-z0-9-]/g, '') ||
      newTenantName.toLowerCase().replace(/[^a-z0-9]/g, '');

    const newTenant = await createTenant({
      name: newTenantName,
      code: newTenantCode.toUpperCase(),
      subdomain: finalSubdomain,
      logoUrl: newTenantLogoUrl.trim() || undefined,
      dnsStatus: 'CONFIGURED',
      type: newTenantType,
      plan: newTenantPlan,
      status: 'ACTIVE',
      contactEmail: newTenantEmail || `admin@${newTenantCode.toLowerCase()}.ac.ke`,
      phone: newTenantPhone,
      address: newTenantAddress,
      currency: 'KES',
      currentAcademicYear: '2025',
      currentTerm: 'TERM_1',
      motto: 'Excellence and Integrity',
      modules: defaultModules
    });

    setShowCreateTenantModal(false);
    setNewTenantName('');
    setNewTenantCode('');
    setNewTenantLogoUrl('');
    setNewTenantSubdomain('');
    setIsSubdomainManual(false);
    setCurrentTab('super-admin-tenants');
    if (newTenant && newTenant.id) {
      switchTenantAsSuperAdmin(newTenant.id);
    }
  };

  if (viewMode === 'marketing') {
    return <PublicMarketingWebsite onOpenSuperAdmin={() => setViewMode('super-admin')} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Banner to Return to Public Marketing Website */}
      <div className="bg-gradient-to-r from-indigo-900/80 via-purple-900/80 to-slate-900 px-4 py-2 border-b border-indigo-500/30 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-indigo-200">
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
          <span>Viewing Super Admin ERP Dashboard</span>
        </div>
        <button
          onClick={() => setViewMode('marketing')}
          className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-900/80 hover:bg-slate-900 text-white rounded-lg border border-indigo-500/30 transition-colors font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Return to Public Marketing Website
        </button>
      </div>

      {/* Top Master Platform Header */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-30 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand & Platform Identifier */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
              className="lg:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
            >
              {isMobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div
              onClick={() => setCurrentTab('super-admin-overview')}
              className="flex items-center space-x-3 cursor-pointer group"
            >
              {platformSettings?.logoUrl ? (
                <div className="h-10 w-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden p-1 shadow-md">
                  <img
                    src={platformSettings.logoUrl}
                    alt={platformSettings.name || 'DAVETECH'}
                    className="h-full w-full object-contain"
                  />
                </div>
              ) : (
                <div className="h-10 w-10 rounded-xl bg-indigo-600 border border-indigo-500/50 flex items-center justify-center font-black text-white shadow-lg shadow-indigo-600/30 text-lg">
                  {(platformSettings?.name || 'D').charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-base font-black text-white tracking-tight group-hover:text-indigo-300 transition">
                    {platformSettings?.name || 'DAVETECH'}
                  </span>
                  <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">
                    MASTER PLATFORM
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-mono hidden sm:block">
                  app.{MAIN_DOMAIN_SUFFIX} • {platformSettings?.tagline || 'Enterprise Cloud & Multi-Tenant Engine'}
                </p>
              </div>
            </div>
          </div>

          {/* Center/Right Actions */}
          <div className="flex items-center space-x-3">
            {/* Firestore Live Status Indicator */}
            <button
              onClick={() => syncAllDataToFirestore()}
              disabled={isSyncingFirestore}
              className="hidden md:flex items-center space-x-2 bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-slate-300 px-3 py-1.5 rounded-xl text-xs font-mono transition"
              title="Sync in-memory state with Google Cloud Firestore"
            >
              <Database className={`w-3.5 h-3.5 text-indigo-400 ${isSyncingFirestore ? 'animate-spin' : ''}`} />
              <span className="text-[11px]">
                {isSyncingFirestore ? 'Syncing...' : 'Firestore Sync'}
              </span>
            </button>

            {/* Provision Tenant Button */}
            <button
              onClick={() => setShowCreateTenantModal(true)}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/30 flex items-center space-x-1.5 transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Provision Tenant</span>
              <span className="sm:hidden">New</span>
            </button>

            {/* Super Admin Badge */}
            <div className="flex items-center space-x-2 pl-2 border-l border-slate-800">
              <div className="h-8 w-8 rounded-lg bg-indigo-950 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-xs">
                SA
              </div>
              <div className="hidden lg:block text-left">
                <div className="text-xs font-bold text-white leading-tight">Super Administrator</div>
                <div className="text-[10px] text-emerald-400 font-mono">HQ Master Access</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container: Sidebar + Content */}
      <div className="flex-1 flex w-full overflow-y-auto">
        {/* Master Platform Sidebar (Desktop) */}
        <aside className="w-64 border-r border-slate-800 bg-slate-900/50 p-4 space-y-6 hidden lg:flex flex-col flex-shrink-0">
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono px-3 mb-2">
              Master Console
            </div>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition ${
                      isActive
                        ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-80" />}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Quick Stats Widget */}
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 space-y-3 mt-auto">
            <div className="flex items-center justify-between text-xs text-slate-300 font-bold">
              <span>Fleet Summary</span>
              <span className="text-emerald-400 font-mono text-[11px]">{(allTenants || []).length} Active</span>
            </div>
            <div className="space-y-1.5 text-[11px] text-slate-400">
              <div className="flex justify-between">
                <span>Platform Users:</span>
                <span className="text-white font-mono">{(allPlatformUsers || []).length}</span>
              </div>
              <div className="flex justify-between">
                <span>DNS Ingress:</span>
                <span className="text-emerald-400 font-mono">*.{MAIN_DOMAIN_SUFFIX}</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        {isMobileNavOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex">
            <div className="w-72 bg-slate-900 h-full p-4 border-r border-slate-800 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="text-sm font-bold text-white">Platform Navigation</div>
                  <button onClick={() => setIsMobileNavOpen(false)} className="p-1 text-slate-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <nav className="space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setCurrentTab(item.id);
                          setIsMobileNavOpen(false);
                        }}
                        className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-medium ${
                          isActive
                            ? 'bg-indigo-600 text-white font-bold'
                            : 'text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className="pt-4 border-t border-slate-800 text-center text-[10px] text-slate-500 font-mono">
                DAVETECH Enterprise Cloud HQ
              </div>
            </div>
            <div className="flex-1" onClick={() => setIsMobileNavOpen(false)} />
          </div>
        )}

        {/* Platform Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <SuperAdminDashboard
            currentTab={currentTab}
            onOpenCreateTenant={() => setShowCreateTenantModal(true)}
          />
        </main>
      </div>

      {/* Provision New Tenant Modal */}
      {showCreateTenantModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-xl w-full shadow-2xl space-y-6 animate-in fade-in zoom-in-95 text-white max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">Provision New Tenant</h3>
                  <p className="text-xs text-slate-400">Creates an isolated database partition and subdomain</p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateTenantModal(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTenantSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Organization / Institution Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Strathmore Senior College"
                  value={newTenantName}
                  onChange={(e) => handleTenantNameChange(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Tenant Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. STRATH-COL"
                    value={newTenantCode}
                    onChange={(e) => setNewTenantCode(e.target.value.toUpperCase())}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 uppercase font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Assigned Subdomain</label>
                  <div className="flex items-center">
                    <input
                      type="text"
                      required
                      placeholder="strathmore"
                      value={newTenantSubdomain}
                      onChange={(e) => handleSubdomainChange(e.target.value)}
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-l-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                    <span className="bg-slate-800 border border-slate-800 text-slate-400 text-xs px-2.5 py-2 rounded-r-xl font-mono">
                      .{MAIN_DOMAIN_SUFFIX}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Tenant Type</label>
                  <select
                    value={newTenantType}
                    onChange={(e) => setNewTenantType(e.target.value as TenantType)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="PRIMARY_SCHOOL">Primary / Secondary School (CBC)</option>
                    <option value="COLLEGE">Higher Education / College / TVET</option>
                    <option value="THEOLOGICAL">Theological Seminary / Bible College</option>
                    <option value="RETAIL">Retail / Wholesale / POS Hub</option>
                    <option value="HOSPITAL">Hospital / Clinical Centre</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Subscription Plan</label>
                  <select
                    value={newTenantPlan}
                    onChange={(e) => setNewTenantPlan(e.target.value as TenantPlan)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="BASIC">Standard Tier</option>
                    <option value="PREMIUM">Premium Pro Tier</option>
                    <option value="ENTERPRISE">Enterprise Cloud Tier</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Admin Contact Email</label>
                <input
                  type="email"
                  placeholder="admin@strathmore.ac.ke"
                  value={newTenantEmail}
                  onChange={(e) => setNewTenantEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <LogoUploader
                  currentLogoUrl={newTenantLogoUrl}
                  onLogoChange={setNewTenantLogoUrl}
                  label="Institutional Crest / Logo URL"
                />
              </div>

              <div className="pt-3 flex items-center justify-end space-x-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateTenantModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/30 transition flex items-center space-x-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Create Workspace</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
