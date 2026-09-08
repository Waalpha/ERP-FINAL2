import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Building2,
  Users,
  CreditCard,
  History,
  PlusCircle,
  Search,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Layers,
  Sparkles,
  TrendingUp,
  Activity,
  ShieldCheck,
  Zap,
  Trash2,
  Check,
  Globe,
  Copy,
  Edit2,
  Power,
  Cloud,
  Database,
  RefreshCw,
  Sliders,
  RotateCcw,
  Shield,
  HardDrive,
  ArrowRight,
  Tag,
  Plus,
  X,
  DollarSign,
  Settings,
  Save,
  ShoppingBag
} from 'lucide-react';
import { Tenant, TenantPlan, TenantStatus, MAIN_DOMAIN, SubscriptionTierConfig } from '../../types';
import { LogoUploader, FaviconUploader } from '../../components/LogoUploader';
import { EditTenantModal } from '../../components/EditTenantModal';

interface SuperAdminDashboardProps {
  currentTab: string;
  onOpenCreateTenant: () => void;
}

export const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = ({
  currentTab,
  onOpenCreateTenant
}) => {
  const {
    allTenants,
    allPlatformUsers,
    updateTenant,
    updateTenantStatus,
    updateTenantPlan,
    toggleTenantModule,
    deleteTenant,
    switchTenantAsSuperAdmin,
    auditLogs,
    createPlatformUser,
    toggleUserActiveStatus,
    updatePlatformUserRole,
    isSyncingFirestore,
    lastFirestoreSyncTime,
    firebaseProjectId,
    firestoreDatabaseName,
    syncAllDataToFirestore,
    subscriptionTiers,
    updateSubscriptionTier,
    createSubscriptionTier,
    deleteSubscriptionTier,
    resetSubscriptionTiers,
    platformSettings,
    updatePlatformSettings
  } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [selectedTenantForModules, setSelectedTenantForModules] = useState<Tenant | null>(null);
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);
  const [editingSubdomainTenant, setEditingSubdomainTenant] = useState<Tenant | null>(null);
  const [editSubdomainVal, setEditSubdomainVal] = useState('');
  const [editCustomDomainVal, setEditCustomDomainVal] = useState('');
  const [editPublicWebsiteVal, setEditPublicWebsiteVal] = useState('');
  const [editLogoUrlVal, setEditLogoUrlVal] = useState('');
  const [editFaviconVal, setEditFaviconVal] = useState('');
  const [copiedTenantId, setCopiedTenantId] = useState<string | null>(null);
  const [syncStatusMsg, setSyncStatusMsg] = useState<string | null>(null);

  // Platform Master Settings & Logo State
  const [platformNameInput, setPlatformNameInput] = useState(platformSettings?.name || 'DAVETECH');
  const [platformTaglineInput, setPlatformTaglineInput] = useState(platformSettings?.tagline || 'Enterprise Cloud & Multi-Tenant Engine');
  const [platformLogoUrlInput, setPlatformLogoUrlInput] = useState(platformSettings?.logoUrl || '');
  const [platformFaviconUrlInput, setPlatformFaviconUrlInput] = useState(platformSettings?.faviconUrl || '');
  const [platformSupportEmailInput, setPlatformSupportEmailInput] = useState(platformSettings?.supportEmail || 'support@davetech.co.ke');
  const [platformSupportPhoneInput, setPlatformSupportPhoneInput] = useState(platformSettings?.supportPhone || '+254 700 000 000');
  const [platformStrictIsolationInput, setPlatformStrictIsolationInput] = useState(platformSettings?.strictIsolationEnforced ?? true);
  const [platformMpesaSandboxInput, setPlatformMpesaSandboxInput] = useState(platformSettings?.mpesaSandboxEnabled ?? true);
  
  // Public Website Content Editor State
  const [heroBadgeInput, setHeroBadgeInput] = useState(platformSettings?.publicWebsiteContent?.heroBadgeText || 'DAVETECH 5.0 Enterprise Cloud Released — Multi-Tenant Architecture');
  const [heroHeadlineInput, setHeroHeadlineInput] = useState(platformSettings?.publicWebsiteContent?.heroHeadline || 'One Powerful Platform. Unlimited Possibilities.');
  const [heroSubheadlineInput, setHeroSubheadlineInput] = useState(platformSettings?.publicWebsiteContent?.heroSubheadline || 'Run your entire organization with DAVETECH Enterprise — a secure, intelligent and scalable cloud platform engineered for schools, colleges, universities, hospitals, clinics, retail shops, and growing enterprises.');
  const [heroPrimaryCtaInput, setHeroPrimaryCtaInput] = useState(platformSettings?.publicWebsiteContent?.heroPrimaryCtaText || 'Get Started');
  const [heroSecondaryCtaInput, setHeroSecondaryCtaInput] = useState(platformSettings?.publicWebsiteContent?.heroSecondaryCtaText || 'Explore Solutions');
  const [solutionsTitleInput, setSolutionsTitleInput] = useState(platformSettings?.publicWebsiteContent?.solutionsTitle || 'Engineered for Every Institution & Enterprise');
  const [solutionsSubtitleInput, setSolutionsSubtitleInput] = useState(platformSettings?.publicWebsiteContent?.solutionsSubtitle || 'Purpose-built tailored workflows designed specifically for academic excellence, healthcare operations, and commercial scale.');
  const [pricingTitleInput, setPricingTitleInput] = useState(platformSettings?.publicWebsiteContent?.pricingTitle || 'Transparent, Predictable Enterprise Pricing');
  const [pricingSubtitleInput, setPricingSubtitleInput] = useState(platformSettings?.publicWebsiteContent?.pricingSubtitle || 'Choose the ideal tier for your institution or business. Scale seamlessly as you grow.');
  const [footerTaglineInput, setFooterTaglineInput] = useState(platformSettings?.publicWebsiteContent?.footerTagline || 'Empowering schools, colleges, universities, hospitals, and businesses with world-class cloud infrastructure.');

  const [platformSettingsSaveSuccess, setPlatformSettingsSaveSuccess] = useState<string | null>(null);

  React.useEffect(() => {
    if (platformSettings) {
      setPlatformNameInput(platformSettings.name || 'DAVETECH');
      setPlatformTaglineInput(platformSettings.tagline || 'Enterprise Cloud & Multi-Tenant Engine');
      setPlatformLogoUrlInput(platformSettings.logoUrl || '');
      setPlatformFaviconUrlInput(platformSettings.faviconUrl || '');
      setPlatformSupportEmailInput(platformSettings.supportEmail || 'support@davetech.co.ke');
      setPlatformSupportPhoneInput(platformSettings.supportPhone || '+254 700 000 000');
      setPlatformStrictIsolationInput(platformSettings.strictIsolationEnforced ?? true);
      setPlatformMpesaSandboxInput(platformSettings.mpesaSandboxEnabled ?? true);
      if (platformSettings.publicWebsiteContent) {
        setHeroBadgeInput(platformSettings.publicWebsiteContent.heroBadgeText || '');
        setHeroHeadlineInput(platformSettings.publicWebsiteContent.heroHeadline || '');
        setHeroSubheadlineInput(platformSettings.publicWebsiteContent.heroSubheadline || '');
        setHeroPrimaryCtaInput(platformSettings.publicWebsiteContent.heroPrimaryCtaText || '');
        setHeroSecondaryCtaInput(platformSettings.publicWebsiteContent.heroSecondaryCtaText || '');
        setSolutionsTitleInput(platformSettings.publicWebsiteContent.solutionsTitle || '');
        setSolutionsSubtitleInput(platformSettings.publicWebsiteContent.solutionsSubtitle || '');
        setPricingTitleInput(platformSettings.publicWebsiteContent.pricingTitle || '');
        setPricingSubtitleInput(platformSettings.publicWebsiteContent.pricingSubtitle || '');
        setFooterTaglineInput(platformSettings.publicWebsiteContent.footerTagline || '');
      }
    }
  }, [platformSettings]);

  const handleSavePlatformSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await updatePlatformSettings({
      name: platformNameInput.trim() || 'DAVETECH',
      tagline: platformTaglineInput.trim() || 'Enterprise Cloud & Multi-Tenant Engine',
      logoUrl: platformLogoUrlInput.trim() || undefined,
      faviconUrl: platformFaviconUrlInput.trim() || undefined,
      supportEmail: platformSupportEmailInput.trim(),
      supportPhone: platformSupportPhoneInput.trim(),
      strictIsolationEnforced: platformStrictIsolationInput,
      mpesaSandboxEnabled: platformMpesaSandboxInput,
      publicWebsiteContent: {
        heroBadgeText: heroBadgeInput,
        heroHeadline: heroHeadlineInput,
        heroSubheadline: heroSubheadlineInput,
        heroPrimaryCtaText: heroPrimaryCtaInput,
        heroSecondaryCtaText: heroSecondaryCtaInput,
        solutionsTitle: solutionsTitleInput,
        solutionsSubtitle: solutionsSubtitleInput,
        pricingTitle: pricingTitleInput,
        pricingSubtitle: pricingSubtitleInput,
        footerTagline: footerTaglineInput
      }
    });
    setPlatformSettingsSaveSuccess('Master Platform settings and public website content updated successfully!');
    setTimeout(() => setPlatformSettingsSaveSuccess(null), 4000);
  };

  // Quick Plan Assignment State
  const [showAssignPlanModal, setShowAssignPlanModal] = useState(false);
  const [assignTargetTenantId, setAssignTargetTenantId] = useState(allTenants[0]?.id || '');
  const [assignTargetPlan, setAssignTargetPlan] = useState<TenantPlan>('PREMIUM');
  const [editingTier, setEditingTier] = useState<SubscriptionTierConfig | null>(null);
  const [showCreateTierModal, setShowCreateTierModal] = useState(false);
  const [newTierId, setNewTierId] = useState('');
  const [tierName, setTierName] = useState('');
  const [tierTagline, setTierTagline] = useState('');
  const [tierMonthlyPrice, setTierMonthlyPrice] = useState(25000);
  const [tierAnnualPrice, setTierAnnualPrice] = useState(270000);
  const [tierCurrency, setTierCurrency] = useState('KES');
  const [tierMaxLearners, setTierMaxLearners] = useState('');
  const [tierMaxStaff, setTierMaxStaff] = useState('');
  const [tierStorageGB, setTierStorageGB] = useState(10);
  const [tierSupportSLA, setTierSupportSLA] = useState('');
  const [tierFeatures, setTierFeatures] = useState<string[]>([]);
  const [newFeatureInput, setNewFeatureInput] = useState('');
  const [tierIsPopular, setTierIsPopular] = useState(false);
  const [tierActionSuccessMsg, setTierActionSuccessMsg] = useState<string | null>(null);

  const openCreateTierModal = () => {
    setNewTierId('');
    setTierName('');
    setTierTagline('');
    setTierMonthlyPrice(30000);
    setTierAnnualPrice(320000);
    setTierCurrency('KES');
    setTierMaxLearners('Up to 500 Learners / Records');
    setTierMaxStaff('10 Staff Accounts');
    setTierStorageGB(25);
    setTierSupportSLA('Standard Email Support (24h)');
    setTierFeatures(['Core Modules', 'Automated Reports']);
    setNewFeatureInput('');
    setTierIsPopular(false);
    setShowCreateTierModal(true);
  };

  const openEditTierModal = (tier: SubscriptionTierConfig) => {
    setEditingTier(tier);
    setTierName(tier.name);
    setTierTagline(tier.tagline);
    setTierMonthlyPrice(tier.priceMonthly);
    setTierAnnualPrice(tier.priceAnnual);
    setTierCurrency(tier.currency || 'KES');
    setTierMaxLearners(tier.maxLearnersOrRecords);
    setTierMaxStaff(tier.maxStaffAccounts);
    setTierStorageGB(tier.maxStorageGB);
    setTierSupportSLA(tier.supportSLA);
    setTierFeatures([...tier.features]);
    setNewFeatureInput('');
    setTierIsPopular(!!tier.isPopular);
  };

  const handleSaveTier = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTier) return;
    await updateSubscriptionTier(editingTier.id, {
      name: tierName.trim(),
      tagline: tierTagline.trim(),
      priceMonthly: Number(tierMonthlyPrice) || 0,
      priceAnnual: Number(tierAnnualPrice) || 0,
      currency: tierCurrency,
      maxLearnersOrRecords: tierMaxLearners.trim(),
      maxStaffAccounts: tierMaxStaff.trim(),
      maxStorageGB: Number(tierStorageGB) || 0,
      supportSLA: tierSupportSLA.trim(),
      features: tierFeatures.filter(f => f.trim().length > 0),
      isPopular: tierIsPopular
    });
    setTierActionSuccessMsg(`Successfully updated ${editingTier.id} Subscription Tier configuration!`);
    setEditingTier(null);
    setTimeout(() => setTierActionSuccessMsg(null), 4000);
  };

  const handleCreateTier = async (e: React.FormEvent) => {
    e.preventDefault();
    const formattedId = newTierId.trim().toUpperCase().replace(/\s+/g, '_');
    if (!formattedId) return;

    // Check if ID already exists
    if (subscriptionTiers.some(t => t.id === formattedId)) {
      alert(`Subscription Tier with ID "${formattedId}" already exists!`);
      return;
    }

    await createSubscriptionTier({
      id: formattedId as TenantPlan,
      name: tierName.trim() || formattedId,
      tagline: tierTagline.trim(),
      priceMonthly: Number(tierMonthlyPrice) || 0,
      priceAnnual: Number(tierAnnualPrice) || 0,
      currency: tierCurrency,
      maxLearnersOrRecords: tierMaxLearners.trim(),
      maxStaffAccounts: tierMaxStaff.trim(),
      maxStorageGB: Number(tierStorageGB) || 0,
      supportSLA: tierSupportSLA.trim(),
      features: tierFeatures.filter(f => f.trim().length > 0),
      isPopular: tierIsPopular,
      includedModules: ['STUDENTS', 'STAFF', 'CLASSES', 'CBC_ACADEMICS', 'REPORTS']
    });

    setTierActionSuccessMsg(`Successfully created new subscription tier "${formattedId}"!`);
    setShowCreateTierModal(false);
    setTimeout(() => setTierActionSuccessMsg(null), 4000);
  };

  const handleAddFeature = () => {
    if (!newFeatureInput.trim()) return;
    setTierFeatures(prev => [...prev, newFeatureInput.trim()]);
    setNewFeatureInput('');
  };

  const handleDeleteFeature = (index: number) => {
    setTierFeatures(prev => prev.filter((_, i) => i !== index));
  };

  const handleAssignTenantPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignTargetTenantId) return;
    await updateTenantPlan(assignTargetTenantId, assignTargetPlan);
    const targetTenant = allTenants.find(t => t.id === assignTargetTenantId);
    setTierActionSuccessMsg(`Assigned ${targetTenant?.name || 'Organization'} to ${assignTargetPlan} Tier!`);
    setShowAssignPlanModal(false);
    setTimeout(() => setTierActionSuccessMsg(null), 4000);
  };

  const handleResetTiers = async () => {
    if (window.confirm("Reset all platform subscription tiers back to default factory pricing and limits?")) {
      await resetSubscriptionTiers();
      setTierActionSuccessMsg("Reset platform subscription tiers to defaults.");
      setTimeout(() => setTierActionSuccessMsg(null), 4000);
    }
  };

  const handleDeleteTier = async (tierId: string) => {
    if (window.confirm(`Are you sure you want to delete subscription tier "${tierId}"?`)) {
      await deleteSubscriptionTier(tierId);
      setTierActionSuccessMsg(`Successfully deleted subscription tier ${tierId}.`);
      setTimeout(() => setTierActionSuccessMsg(null), 4000);
    }
  };

  const handlePushAllToCloud = async () => {
    setSyncStatusMsg('Pushing all tenant entities and user collections to Cloud Firestore...');
    const result = await syncAllDataToFirestore();
    if (result.success) {
      setSyncStatusMsg(`Successfully synchronized ${result.count} records with Cloud Firestore project (${firebaseProjectId})`);
    } else {
      setSyncStatusMsg(`Sync error: ${result.error}`);
    }
    setTimeout(() => setSyncStatusMsg(null), 6000);
  };

  const handleCopySubdomain = (t: Tenant) => {
    const slug = t.subdomain || t.code.toLowerCase();
    const url = `https://${slug}.${MAIN_DOMAIN.toLowerCase()}`;
    navigator.clipboard.writeText(url);
    setCopiedTenantId(t.id);
    setTimeout(() => setCopiedTenantId(null), 2000);
  };

  const openEditSubdomain = (t: Tenant) => {
    setEditingSubdomainTenant(t);
    setEditSubdomainVal(t.subdomain || t.code.toLowerCase());
    setEditCustomDomainVal(t.customDomain || '');
    setEditPublicWebsiteVal(t.publicWebsite || '');
    setEditLogoUrlVal(t.logoUrl || '');
    setEditFaviconVal(t.favicon || t.faviconUrl || '');
  };

  const handleSaveSubdomainEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSubdomainTenant) return;
    const cleanSub = editSubdomainVal.toLowerCase().replace(/[^a-z0-9-]/g, '') || editingSubdomainTenant.code.toLowerCase();
    await updateTenant(editingSubdomainTenant.id, {
      subdomain: cleanSub,
      customDomain: editCustomDomainVal.trim().toLowerCase() || undefined,
      publicWebsite: editPublicWebsiteVal.trim() || undefined,
      logoUrl: editLogoUrlVal.trim() || undefined,
      favicon: editFaviconVal.trim() || undefined,
      faviconUrl: editFaviconVal.trim() || undefined,
      dnsStatus: 'CONFIGURED'
    });
    setEditingSubdomainTenant(null);
  };

  // Quick user creation state
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [newUserRole, setNewUserRole] = useState<'TENANT_ADMIN' | 'ACCOUNTANT' | 'TEACHER' | 'MANAGER' | 'CASHIER'>('TENANT_ADMIN');
  const [newUserTenantId, setNewUserTenantId] = useState(allTenants[0]?.id || '');

  // Calculate platform KPIs
  const totalTenants = allTenants.length;
  const activeTenants = allTenants.filter(t => t.status === 'ACTIVE').length;
  const totalUsers = allPlatformUsers.length;
  const estimatedStudents = allTenants.reduce((sum, t) => sum + (t.stats?.studentCount || 0), 0);

  const tierPriceMap = useMemo(() => {
    const map: Record<string, number> = {
      BASIC: 25000,
      PREMIUM: 55000,
      ENTERPRISE: 120000
    };
    subscriptionTiers.forEach(t => {
      map[t.id] = t.priceMonthly;
    });
    return map;
  }, [subscriptionTiers]);

  const estimatedMonthlyMRR = allTenants.reduce((sum, t) => sum + (tierPriceMap[t.plan] || 25000), 0);

  const filteredTenants = allTenants.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'ALL' || t.type === filterType;
    const matchesStatus = filterStatus === 'ALL' || t.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const allAvailableModules = [
    { id: 'STUDENTS', name: 'Learner & Student Admissions' },
    { id: 'STAFF', name: 'Faculty & HR Management' },
    { id: 'CLASSES', name: 'Classes, Streams & Departments' },
    { id: 'CBC_ACADEMICS', name: 'CBC Learning Areas & Curricula' },
    { id: 'ASSESSMENTS', name: 'Exams & Assessment Matrix' },
    { id: 'FEES_FINANCE', name: 'Fees, Billing & M-Pesa Integration' },
    { id: 'ATTENDANCE', name: 'Daily Attendance & Biometrics' },
    { id: 'TIMETABLE', name: 'Timetable Scheduling Engine' },
    { id: 'ASSIGNMENTS', name: 'Homework, Coursework & Tasks' },
    { id: 'DISCIPLINE', name: 'Discipline & Behavior Tracker' },
    { id: 'PROMOTIONS', name: 'Annual Promotion Engine' },
    { id: 'CALENDAR', name: 'Academic & Corporate Calendar' },
    { id: 'SMS_NOTIFICATIONS', name: 'Automated SMS & Gate Alerts' },
    { id: 'REPORTS', name: 'CBC Performance & Analytics' },
    { id: 'RETAIL_POS', name: 'Point of Sale & Barcode POS' },
    { id: 'INVENTORY', name: 'Inventory & Multi-Store Stock' },
    { id: 'HOSPITAL_CLINIC', name: 'Clinical Records & Triage' },
    { id: 'PHARMACY', name: 'Pharmacy Dispensary & Rx' },
    { id: 'LIBRARY', name: 'Library Catalog & Barcode Loans' },
    { id: 'HOSTEL', name: 'Hostel & Housing Allocation' }
  ];

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserEmail || !newUserName || !newUserTenantId) return;
    const targetTenant = allTenants.find(t => t.id === newUserTenantId);
    await createPlatformUser({
      email: newUserEmail,
      displayName: newUserName,
      role: newUserRole,
      tenantId: newUserTenantId,
      tenantName: targetTenant?.name,
      isActive: true
    });
    setNewUserEmail('');
    setNewUserName('');
    setShowCreateUserModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Super Admin Console
              </span>
              <span className="text-xs text-slate-400 font-mono">Platform v2.5</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">DAVETECH ERP Master Governance</h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mt-1">
              Global multi-tenant governance, organization provisioning, subscription lifecycle, and security rule enforcement.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              onClick={() => setShowCreateUserModal(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all flex items-center space-x-2"
            >
              <Users className="h-4 w-4 text-indigo-400" />
              <span>Create User</span>
            </button>
            <button
              onClick={onOpenCreateTenant}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all flex items-center space-x-2"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Provision New Tenant</span>
            </button>
          </div>
        </div>

        {/* Global Statistics Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6">
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span>Total Organizations</span>
              <Building2 className="h-4 w-4 text-indigo-400" />
            </div>
            <div className="text-2xl font-bold text-white mt-2">{totalTenants}</div>
            <div className="text-[11px] text-emerald-400 mt-1 flex items-center space-x-1">
              <CheckCircle2 className="h-3 w-3" />
              <span>{activeTenants} Active Workspaces</span>
            </div>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span>Platform Users</span>
              <Users className="h-4 w-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-bold text-white mt-2">{totalUsers}</div>
            <div className="text-[11px] text-slate-400 mt-1">Multi-role RBAC Active</div>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span>Platform MRR (KES)</span>
              <CreditCard className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-emerald-400 mt-2">
              KES {estimatedMonthlyMRR.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">Across 3 Subscription Tiers</div>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span>Tenant Security</span>
              <Activity className="h-4 w-4 text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-purple-300 mt-2">100% Isolated</div>
            <div className="text-[11px] text-slate-400 mt-1">Strict tenantId validation</div>
          </div>
        </div>

        {/* Cloud Firestore Integration & Sync Hub */}
        <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-slate-900 via-indigo-950/80 to-slate-900 border border-indigo-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center flex-shrink-0">
              <Database className="h-5 w-5 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-sm text-white">Google Cloud Firestore Connected</span>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  LIVE PROVISIONED
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Project ID: <span className="font-mono text-indigo-300 font-semibold">{firebaseProjectId}</span> • Database: <span className="font-mono text-slate-300">{firestoreDatabaseName}</span>
                {lastFirestoreSyncTime && <span> • Last synced at {lastFirestoreSyncTime}</span>}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePushAllToCloud}
              disabled={isSyncingFirestore}
              className={`px-4 py-2 rounded-xl text-xs font-semibold shadow-md transition-all flex items-center space-x-2 ${
                isSyncingFirestore
                  ? 'bg-indigo-800 text-indigo-200 cursor-not-allowed animate-pulse'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20'
              }`}
            >
              <Cloud className={`h-4 w-4 ${isSyncingFirestore ? 'animate-spin' : ''}`} />
              <span>{isSyncingFirestore ? 'Pushing to Cloud...' : 'Push All to Firestore'}</span>
            </button>
          </div>
        </div>

        {syncStatusMsg && (
          <div className="mt-3 p-3 rounded-xl bg-indigo-900/60 border border-indigo-700 text-xs text-indigo-200 flex items-center space-x-2 animate-in fade-in">
            <Check className="h-4 w-4 text-emerald-400 flex-shrink-0" />
            <span>{syncStatusMsg}</span>
          </div>
        )}
      </div>

      {/* Main Content Areas based on selected Super Admin Tab */}
      {currentTab === 'super-admin-overview' || currentTab === 'super-admin-tenants' ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Main Domain Ingress & Wildcard Subdomain Banner */}
          <div className="p-4 bg-indigo-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-indigo-800">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-xl bg-indigo-800/80 border border-indigo-700 flex items-center justify-center flex-shrink-0 text-white font-bold">
                <Globe className="h-5 w-5 text-indigo-300" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-sm text-white">Root Domain: {MAIN_DOMAIN}</span>
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Wildcard *.davetech.co.ke Active
                  </span>
                </div>
                <p className="text-[11px] text-indigo-200 mt-0.5">
                  Multi-tenant ingress router dynamically maps subdomains to isolated database partitions.
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-xs font-mono">
              <span className="px-2.5 py-1 bg-indigo-950/60 rounded-lg border border-indigo-700/60 text-indigo-300">
                SSL: Let's Encrypt Wildcard
              </span>
              <span className="px-2.5 py-1 bg-indigo-950/60 rounded-lg border border-indigo-700/60 text-emerald-400 font-bold">
                CNAME Ingress: Ready
              </span>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center space-x-3 flex-1 flex-wrap gap-2">
              <div className="relative flex-1 min-w-[200px] max-w-md">
                <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search tenants by name, code or subdomain..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 font-medium focus:outline-none"
              >
                <option value="ALL">All Tenant Types</option>
                <option value="PRIMARY_SCHOOL">Primary School</option>
                <option value="SECONDARY_SCHOOL">Secondary School</option>
                <option value="COLLEGE">College / University</option>
                <option value="THEOLOGICAL">Theological Seminary</option>
                <option value="RETAIL">Retail / Shop</option>
                <option value="BUSINESS">Wholesale / Business</option>
                <option value="HOSPITAL">Hospital / Clinic</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 font-medium focus:outline-none"
              >
                <option value="ALL">All Statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="SUSPENDED">Suspended</option>
                <option value="TRIAL">Trial</option>
              </select>
            </div>

            <div className="text-xs text-slate-500 font-medium">
              Showing <span className="font-bold text-slate-800">{filteredTenants.length}</span> of {totalTenants} tenants
            </div>
          </div>

          {/* Tenants Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-100/70 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                <tr>
                  <th className="py-3 px-4">Organization & Code</th>
                  <th className="py-3 px-4">Assigned Subdomain</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Plan & Billing</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Active Modules</th>
                  <th className="py-3 px-4">Workspace Scale</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTenants.map((t) => {
                  const slug = t.subdomain || t.code.toLowerCase();
                  const fullUrl = `https://${slug}.${MAIN_DOMAIN.toLowerCase()}`;
                  const isCopied = copiedTenantId === t.id;

                  return (
                    <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="h-9 w-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-sm text-slate-700 flex-shrink-0 overflow-hidden">
                            {t.logoUrl ? (
                              <img src={t.logoUrl} alt={t.name} className="h-full w-full object-contain p-0.5" />
                            ) : t.type === 'PRIMARY_SCHOOL' || t.type === 'SECONDARY_SCHOOL' ? (
                              '🏫'
                            ) : t.type === 'COLLEGE' || t.type === 'UNIVERSITY' ? (
                              '🎓'
                            ) : t.type === 'HOSPITAL' ? (
                              '🏥'
                            ) : (
                              '🛒'
                            )}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900">{t.name}</div>
                            <div className="text-[11px] text-slate-400 font-mono flex items-center space-x-1.5">
                              <span>Code: {t.code}</span>
                              <span>•</span>
                              <span className="truncate max-w-[120px]">{t.id}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-1.5 whitespace-nowrap">
                            <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50/80 px-2.5 py-1 rounded-md border border-indigo-100/80 truncate max-w-[220px]" title={`${slug}.${MAIN_DOMAIN.toLowerCase()}`}>
                              {slug}.{MAIN_DOMAIN.toLowerCase()}
                            </span>
                            <button
                              onClick={() => handleCopySubdomain(t)}
                              className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                              title="Copy URL"
                            >
                              {isCopied ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                            </button>
                            <button
                              onClick={() => openEditSubdomain(t)}
                              className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                              title="Edit Subdomain Prefix"
                            >
                              <Edit2 className="h-3 w-3" />
                            </button>
                          </div>
                          {t.customDomain && (
                            <div className="text-[10px] text-slate-400 font-mono flex items-center space-x-1">
                              <span>CNAME:</span>
                              <span className="text-slate-700 font-semibold">{t.customDomain}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-md font-medium text-[11px] bg-slate-100 text-slate-700 border border-slate-200">
                          {t.type.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <select
                          value={t.plan}
                          onChange={(e) => updateTenantPlan(t.id, e.target.value as TenantPlan)}
                          className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-semibold text-indigo-700 cursor-pointer focus:outline-none"
                        >
                          <option value="BASIC">BASIC (KES 25k/mo)</option>
                          <option value="PREMIUM">PREMIUM (KES 55k/mo)</option>
                          <option value="ENTERPRISE">ENTERPRISE (KES 120k/mo)</option>
                        </select>
                      </td>
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => updateTenantStatus(t.id, t.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE')}
                          className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
                            t.status === 'ACTIVE'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                              : t.status === 'TRIAL'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                              : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                          }`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${t.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                          <span>{t.status}</span>
                        </button>
                      </td>
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => setSelectedTenantForModules(t)}
                          className="flex items-center space-x-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-lg border border-indigo-100 transition-colors"
                        >
                          <Layers className="h-3.5 w-3.5" />
                          <span>{t.modules.length} Modules</span>
                        </button>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="text-[11px] text-slate-700 font-medium">
                          {t.type.includes('SCHOOL') ? `${t.stats?.studentCount || 0} Students` : t.type === 'COLLEGE' ? 'Higher Ed Campus' : t.type === 'RETAIL' ? 'POS Store' : 'Clinical Clinic'}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {t.stats?.staffCount ? `${t.stats.staffCount} Staff Accounts` : 'Active Workspace'}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          {(t.type === 'BUSINESS' || t.type === 'RETAIL' || t.id === 'tenant-apex-retail') && (
                            <button
                              onClick={() => switchTenantAsSuperAdmin(t.id)}
                              className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs transition-all shadow-xs flex items-center space-x-1"
                              title="Launch Simple Cashier Stock & Sales Module"
                            >
                              <ShoppingBag className="h-3 w-3 text-slate-950" />
                              <span className="hidden sm:inline">Cashier POS</span>
                            </button>
                          )}
                          <button
                            onClick={() => switchTenantAsSuperAdmin(t.id)}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="Open Workspace"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingTenant(t)}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="Edit Tenant"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => updateTenantStatus(t.id, t.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE')}
                            className={`p-1.5 ${t.status === 'ACTIVE' ? 'text-amber-600 hover:bg-amber-50' : 'text-emerald-600 hover:bg-emerald-50'} rounded-lg transition-colors`}
                            title={t.status === 'ACTIVE' ? 'Suspend Tenant' : 'Activate Tenant'}
                          >
                            <Power className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to delete tenant ${t.name}? This will remove workspace access.`)) {
                                deleteTenant(t.id);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete Organization"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}

      {/* Super Admin Users Matrix Tab */}
      {currentTab === 'super-admin-users' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Platform User RBAC Directory</h2>
              <p className="text-xs text-slate-500">Every user is strictly bound to their authorized tenant workspace with role validation</p>
            </div>
            <button
              onClick={() => setShowCreateUserModal(true)}
              className="px-3 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-xl hover:bg-indigo-500 transition-colors flex items-center space-x-1.5"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Add Platform User</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                <tr>
                  <th className="py-3 px-4">User Details</th>
                  <th className="py-3 px-4">Tenant Workspace</th>
                  <th className="py-3 px-4">Role Assignment</th>
                  <th className="py-3 px-4">Account Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {allPlatformUsers.map((u) => (
                  <tr key={u.uid} className="hover:bg-slate-50/60">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{u.displayName}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{u.email}</div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-700">
                      {u.tenantName || u.tenantId}
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={u.role}
                        onChange={(e) => updatePlatformUserRole(u.uid, e.target.value as any)}
                        className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-indigo-700 cursor-pointer focus:outline-none"
                      >
                        <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                        <option value="TENANT_ADMIN">TENANT_ADMIN</option>
                        <option value="MANAGER">MANAGER</option>
                        <option value="ACCOUNTANT">ACCOUNTANT</option>
                        <option value="TEACHER">TEACHER</option>
                        <option value="CASHIER">CASHIER</option>
                        <option value="STAFF">STAFF</option>
                        <option value="VIEWER">VIEWER</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => toggleUserActiveStatus(u.uid)}
                        className={`inline-flex items-center space-x-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                          u.isActive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {u.isActive ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> : <AlertTriangle className="h-3.5 w-3.5 text-rose-600" />}
                        <span>{u.isActive ? 'Active' : 'Disabled'}</span>
                      </button>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[10px] text-slate-400 text-right">
                      {u.uid}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Subscriptions & Plans Tab */}
      {(currentTab === 'super-admin-plans' || currentTab === 'super-admin-billing') && (
        <div className="space-y-6">
          {/* Header Action Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <div className="flex items-center space-x-2 text-indigo-600 mb-1">
                  <CreditCard className="h-5 w-5" />
                  <h2 className="text-lg font-black text-slate-900">Multi-Tenant Subscription Matrix & Billing Architecture</h2>
                </div>
                <p className="text-xs text-slate-500 max-w-2xl">
                  Configure monthly and annual subscription pricing (KES), tune capacity quotas (students, staff, cloud storage), modify feature lists, and assign plans to active institutions.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={openCreateTierModal}
                  className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl shadow-md transition"
                >
                  <Plus className="h-4 w-4" />
                  <span>Create New Tier</span>
                </button>
                <button
                  type="button"
                  onClick={handleResetTiers}
                  className="inline-flex items-center space-x-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
                >
                  <RotateCcw className="h-3.5 w-3.5 text-slate-500" />
                  <span>Reset Defaults</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowAssignPlanModal(true)}
                  className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-sm transition"
                >
                  <Tag className="h-3.5 w-3.5" />
                  <span>Assign Organization Plan</span>
                </button>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-100">
              <div className="bg-slate-50 rounded-xl p-3">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Projected MRR</div>
                <div className="text-base font-black text-slate-900 mt-0.5">
                  KES {estimatedMonthlyMRR.toLocaleString()}
                </div>
              </div>
              <div className="bg-slate-50 rounded-xl p-3">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Basic Tier Fleet</div>
                <div className="text-base font-black text-slate-900 mt-0.5">
                  {allTenants.filter(t => t.plan === 'BASIC').length} Institutions
                </div>
              </div>
              <div className="bg-indigo-50/50 rounded-xl p-3">
                <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-500">Premium Tier Fleet</div>
                <div className="text-base font-black text-indigo-950 mt-0.5">
                  {allTenants.filter(t => t.plan === 'PREMIUM').length} Institutions
                </div>
              </div>
              <div className="bg-purple-50/50 rounded-xl p-3">
                <div className="text-[10px] font-bold uppercase tracking-wider text-purple-500">Enterprise Campus Fleet</div>
                <div className="text-base font-black text-purple-950 mt-0.5">
                  {allTenants.filter(t => t.plan === 'ENTERPRISE').length} Institutions
                </div>
              </div>
            </div>
          </div>

          {tierActionSuccessMsg && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center space-x-2 animate-in fade-in">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>{tierActionSuccessMsg}</span>
            </div>
          )}

          {/* Dynamic Tier Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {subscriptionTiers.map((tier) => {
              const isBasic = tier.id === 'BASIC';
              const isPremium = tier.id === 'PREMIUM';
              const isEnterprise = tier.id === 'ENTERPRISE';
              const tenantsInTier = allTenants.filter(t => t.plan === tier.id);

              const borderColor = isPremium
                ? 'border-indigo-600 ring-2 ring-indigo-600/20'
                : isEnterprise
                ? 'border-purple-600/60'
                : 'border-slate-200';

              const headerBadgeColor = isPremium
                ? 'text-indigo-600 bg-indigo-50'
                : isEnterprise
                ? 'text-purple-600 bg-purple-50'
                : 'text-slate-600 bg-slate-100';

              const checkColor = isPremium
                ? 'text-indigo-600'
                : isEnterprise
                ? 'text-purple-600'
                : 'text-emerald-600';

              return (
                <div
                  key={tier.id}
                  className={`bg-white rounded-2xl border ${borderColor} p-6 shadow-sm relative flex flex-col justify-between overflow-hidden`}
                >
                  {tier.isPopular && (
                    <div className="absolute top-3 right-3 bg-indigo-600 text-white text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full shadow-xs">
                      Popular Choice
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${headerBadgeColor}`}>
                        {tier.id}
                      </span>
                      {subscriptionTiers.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleDeleteTier(tier.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          title={`Delete tier ${tier.id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-slate-900 mt-2">{tier.name}</h3>
                    <p className="text-xs text-slate-500 mt-1 min-h-[32px]">{tier.tagline}</p>

                    <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="flex items-baseline space-x-1">
                        <span className="text-xs font-bold text-slate-500">{tier.currency}</span>
                        <span className="text-2xl font-black text-slate-900">{tier.priceMonthly.toLocaleString()}</span>
                        <span className="text-xs font-medium text-slate-500">/ month</span>
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium mt-1">
                        Billed annually: <span className="font-bold text-slate-700">{tier.currency} {tier.priceAnnual.toLocaleString()}</span> / year
                      </div>
                    </div>

                    {/* Quota & Limit Specs */}
                    <div className="mt-4 space-y-2 text-xs">
                      <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50/70 border border-slate-100">
                        <span className="text-slate-500 font-medium">Capacity Quota:</span>
                        <span className="font-bold text-slate-800 text-right">{tier.maxLearnersOrRecords}</span>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50/70 border border-slate-100">
                        <span className="text-slate-500 font-medium">Staff Accounts:</span>
                        <span className="font-bold text-slate-800 text-right">{tier.maxStaffAccounts}</span>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50/70 border border-slate-100">
                        <span className="text-slate-500 font-medium">Cloud Storage:</span>
                        <span className="font-bold text-slate-800">{tier.maxStorageGB} GB Encrypted</span>
                      </div>
                    </div>

                    {/* Feature Matrix Checklist */}
                    <div className="mt-5 pt-4 border-t border-slate-100">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                        Included Features ({tier.features.length})
                      </div>
                      <div className="space-y-2 text-xs text-slate-700">
                        {tier.features.map((feat, idx) => (
                          <div key={idx} className="flex items-start space-x-2">
                            <Check className={`h-4 w-4 ${checkColor} shrink-0 mt-0.5`} />
                            <span className="leading-snug">{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* SLA Badge */}
                    <div className="mt-4 p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center space-x-2 text-xs text-slate-600">
                      <Shield className="h-4 w-4 text-indigo-500 shrink-0" />
                      <span className="text-[11px] leading-tight font-medium">{tier.supportSLA}</span>
                    </div>
                  </div>

                  {/* Footer Stats & Actions */}
                  <div className="mt-6 pt-4 border-t border-slate-100 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium">Assigned Organizations:</span>
                      <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-full">
                        {tenantsInTier.length} active
                      </span>
                    </div>

                    {tenantsInTier.length > 0 && (
                      <div className="flex flex-wrap gap-1 max-h-16 overflow-y-auto">
                        {tenantsInTier.map(t => (
                          <span key={t.id} className="text-[10px] bg-slate-100 font-semibold text-slate-700 px-2 py-0.5 rounded-md">
                            {t.name}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => openEditTierModal(tier)}
                        className="w-full inline-flex items-center justify-center space-x-1.5 px-3 py-2 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
                      >
                        <Sliders className="h-3.5 w-3.5 text-slate-600" />
                        <span>Edit Tier</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setAssignTargetPlan(tier.id);
                          setShowAssignPlanModal(true);
                        }}
                        className={`w-full inline-flex items-center justify-center space-x-1.5 px-3 py-2 text-xs font-bold text-white rounded-xl shadow-xs transition ${
                          isPremium ? 'bg-indigo-600 hover:bg-indigo-500' : isEnterprise ? 'bg-purple-600 hover:bg-purple-500' : 'bg-slate-800 hover:bg-slate-700'
                        }`}
                      >
                        <span>Assign</span>
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Global Audit Logs Tab */}
      {currentTab === 'super-admin-audit' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Security & Operational Audit Stream</h2>
              <p className="text-xs text-slate-500">Immutable chronological record of administrative and data events</p>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-mono">
              {auditLogs.length} Events Recorded
            </span>
          </div>

          <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
            {auditLogs.map((log) => (
              <div key={log.id} className="py-3 flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-indigo-600 font-mono">{log.action}</span>
                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                      {log.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 mt-1">{log.details}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    By: <span className="text-slate-600 font-medium">{log.userEmail}</span> • Tenant: <span className="font-mono">{log.tenantId}</span>
                  </p>
                </div>
                <div className="text-[11px] text-slate-400 font-mono flex-shrink-0">
                  {new Date(log.timestamp).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Domains & DNS Tab */}
      {currentTab === 'super-admin-domains' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center space-x-2 text-indigo-600 mb-1">
                  <Globe className="h-5 w-5" />
                  <h2 className="text-lg font-black text-slate-900">Domains & DNS Routing Engine</h2>
                </div>
                <p className="text-xs text-slate-500">
                  Manage root domain ingress, wildcard subdomains (*.{MAIN_DOMAIN}), custom CNAMEs, and nameserver delegation.
                </p>
              </div>
              <button
                onClick={() => alert("To add a custom root domain or nameserver delegation zone, configure your registrar DNS records pointing to ns1.davetech.co.ke and ns2.davetech.co.ke.")}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-sm transition"
              >
                <Plus className="h-4 w-4" />
                <span>Add Domain</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Root Domain</div>
                <div className="text-sm font-black text-slate-900 mt-1">{MAIN_DOMAIN}</div>
                <div className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center space-x-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Cloudflare DNS Active</span>
                </div>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Wildcard Subdomain Ingress</div>
                <div className="text-sm font-black text-slate-900 mt-1">*.{MAIN_DOMAIN.toLowerCase()}</div>
                <div className="text-[11px] text-indigo-600 font-semibold mt-1">Dynamic Tenant Partitioning</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Nameservers</div>
                <div className="text-xs font-mono font-bold text-slate-800 mt-1">ns1.davetech.co.ke</div>
                <div className="text-xs font-mono font-bold text-slate-800">ns2.davetech.co.ke</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6">
            <h3 className="font-bold text-slate-900 text-sm mb-4">Hosted Tenant Subdomain Mappings</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                  <tr>
                    <th className="py-3 px-4">Organization</th>
                    <th className="py-3 px-4">Subdomain Ingress URL</th>
                    <th className="py-3 px-4">Custom CNAME</th>
                    <th className="py-3 px-4">DNS Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {allTenants.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-semibold text-slate-900">{t.name}</td>
                      <td className="py-3 px-4 font-mono text-indigo-600 font-bold">
                        https://{t.subdomain || t.code.toLowerCase()}.{MAIN_DOMAIN.toLowerCase()}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-600">
                        {t.customDomain || <span className="text-slate-400 italic">None configured</span>}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-md font-bold text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200">
                          ACTIVE & PROVISIONED
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => openEditSubdomain(t)}
                          className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition"
                        >
                          Configure
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SSL Certificates Tab */}
      {currentTab === 'super-admin-ssl' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center space-x-2 text-indigo-600 mb-1">
              <ShieldCheck className="h-5 w-5" />
              <h2 className="text-lg font-black text-slate-900">SSL / TLS Certificate Automation</h2>
            </div>
            <p className="text-xs text-slate-500">
              Automated Let's Encrypt SSL certificate provisioning and 256-bit TLS encryption for all tenant subdomains and custom CNAMEs.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl">
                <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Wildcard Certificate</div>
                <div className="text-sm font-black text-emerald-950 mt-1">*.{MAIN_DOMAIN}</div>
                <div className="text-[11px] text-emerald-600 font-semibold mt-1">Valid until Nov 2026 (Auto-renewing)</div>
              </div>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Cipher Suite</div>
                <div className="text-sm font-bold text-slate-800 mt-1">TLS_AES_256_GCM_SHA384</div>
                <div className="text-[11px] text-slate-500">HSTS Enabled • HTTP/3 Ready</div>
              </div>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Encrypted Endpoints</div>
                <div className="text-sm font-bold text-slate-800 mt-1">{totalTenants * 2} Active Handshakes</div>
                <div className="text-[11px] text-emerald-600 font-semibold">100% Secure</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Deployments Tab */}
      {currentTab === 'super-admin-deployments' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center space-x-2 text-indigo-600 mb-1">
                  <Cloud className="h-5 w-5" />
                  <h2 className="text-lg font-black text-slate-900">Production Build & Deployment Pipeline</h2>
                </div>
                <p className="text-xs text-slate-500">
                  Continuous delivery pipeline running on Google Cloud Run container ingress with automated zero-downtime rollouts.
                </p>
              </div>
              <button
                onClick={() => alert("Initiating fresh production deployment build (vite build && node server.ts)... Build initiated successfully!")}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-sm transition"
              >
                <Cloud className="h-4 w-4" />
                <span>Deploy Latest</span>
              </button>
            </div>

            <div className="mt-6 p-4 bg-slate-900 text-slate-200 rounded-2xl font-mono text-xs space-y-2 border border-slate-800">
              <div className="flex items-center justify-between text-[11px] text-slate-400 pb-2 border-b border-slate-800">
                <span>[BUILD RUNNER] Production Container Cluster (europe-west2)</span>
                <span className="text-emerald-400 font-bold">● Healthy (Running)</span>
              </div>
              <div>$ npm run build</div>
              <div className="text-slate-400">vite v6.2.3 building for production...</div>
              <div className="text-slate-400">✓ 154 modules transformed.</div>
              <div className="text-emerald-400">✓ Built successfully in 1.42s. Bundled dist/server.cjs</div>
              <div className="text-indigo-300">$ node dist/server.cjs</div>
              <div className="text-emerald-300">Server running on port 3000 (0.0.0.0) — DAVETECH Cloud Active.</div>
            </div>
          </div>
        </div>
      )}

      {/* Databases Tab */}
      {currentTab === 'super-admin-databases' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center space-x-2 text-indigo-600 mb-1">
              <Database className="h-5 w-5" />
              <h2 className="text-lg font-black text-slate-900">Multi-Tenant Database Infrastructure</h2>
            </div>
            <p className="text-xs text-slate-500">
              Google Cloud Firestore isolated database cluster with automated tenant partition indexing and AES-256 encryption at rest.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Project ID</div>
                <div className="text-xs font-mono font-bold text-slate-900 mt-1">{firebaseProjectId}</div>
                <div className="text-[11px] text-emerald-600 font-semibold mt-1">Firestore Native Mode</div>
              </div>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Database Name</div>
                <div className="text-xs font-mono font-bold text-slate-900 mt-1">{firestoreDatabaseName}</div>
                <div className="text-[11px] text-slate-500">Region: europe-west2</div>
              </div>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Storage Consumed</div>
                <div className="text-sm font-bold text-slate-900 mt-1">14.2 MB / 10 GB</div>
                <div className="text-[11px] text-indigo-600 font-semibold">Automatic Scaling Active</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Platform Settings Tab */}
      {currentTab === 'super-admin-settings' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Header Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center space-x-2 text-indigo-600 mb-1">
                  <Settings className="h-5 w-5" />
                  <h2 className="text-lg font-black text-slate-900">Platform Settings & Master Brand Identity</h2>
                </div>
                <p className="text-xs text-slate-500 max-w-2xl">
                  Configure global DAVETECH master branding, platform logo, support desk contact coordinates, and multi-tenant security enforcement.
                </p>
              </div>
              {platformSettingsSaveSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>{platformSettingsSaveSuccess}</span>
                </div>
              )}
            </div>
          </div>

          <form onSubmit={handleSavePlatformSettings} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Logo & Brand Identity */}
              <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-1 flex items-center space-x-2">
                    <Sparkles className="h-4 w-4 text-indigo-600" />
                    <span>Master Brand Logo</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Upload official DAVETECH logo or enter image URL. Displayed across top navigation bar and platform headers.
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-4">
                  <LogoUploader
                    currentLogoUrl={platformLogoUrlInput}
                    onLogoChange={setPlatformLogoUrlInput}
                    entityName={platformNameInput || 'DAVETECH'}
                    label="DAVETECH Master Platform Logo"
                  />
                  <div className="pt-3 border-t border-slate-200">
                    <FaviconUploader
                      currentFaviconUrl={platformFaviconUrlInput}
                      onFaviconChange={setPlatformFaviconUrlInput}
                      label="Master Platform Browser Favicon"
                      sublabel="Upload 32x32px ICO or PNG icon for main platform browser tabs."
                    />
                  </div>
                </div>

                <div className="p-3 bg-indigo-50/60 border border-indigo-100 rounded-xl">
                  <div className="text-[11px] font-bold text-indigo-900 mb-1">Header Preview:</div>
                  <div className="flex items-center space-x-3 p-2 bg-slate-900 rounded-xl">
                    {platformLogoUrlInput ? (
                      <img
                        src={platformLogoUrlInput}
                        alt="Logo"
                        className="h-8 w-8 object-contain rounded-lg bg-white/10 p-0.5"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center font-black text-white text-xs">
                        {(platformNameInput || 'D').charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <div className="text-xs font-black text-white">{platformNameInput || 'DAVETECH'}</div>
                      <div className="text-[10px] text-slate-400 font-mono">MASTER PLATFORM</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Platform Metadata & Support Contacts */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center space-x-2">
                    <Globe className="h-4 w-4 text-indigo-600" />
                    <span>Brand & Domain Configuration</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Master Platform Name *</label>
                      <input
                        type="text"
                        required
                        value={platformNameInput}
                        onChange={(e) => setPlatformNameInput(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                        placeholder="e.g. DAVETECH"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Tagline / Header Description</label>
                      <input
                        type="text"
                        value={platformTaglineInput}
                        onChange={(e) => setPlatformTaglineInput(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                        placeholder="e.g. Enterprise Cloud & Multi-Tenant Engine"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Support Email Desk</label>
                      <input
                        type="email"
                        value={platformSupportEmailInput}
                        onChange={(e) => setPlatformSupportEmailInput(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                        placeholder="support@davetech.co.ke"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Support Phone / Hot Line</label>
                      <input
                        type="text"
                        value={platformSupportPhoneInput}
                        onChange={(e) => setPlatformSupportPhoneInput(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                        placeholder="+254 700 000 000"
                      />
                    </div>
                  </div>
                </div>

                {/* Infrastructure Security Toggles */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center space-x-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    <span>Multi-Tenant Governance & Security Controls</span>
                  </h3>

                  <div className="space-y-3 text-xs">
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                      <div>
                        <div className="font-bold text-slate-900">Multi-Tenant Isolation Enforcement</div>
                        <div className="text-slate-500">Strict `tenantId` query filtering across all Firestore collections</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={platformStrictIsolationInput}
                          onChange={(e) => setPlatformStrictIsolationInput(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                      </label>
                    </div>

                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                      <div>
                        <div className="font-bold text-slate-900">M-Pesa Sandbox Webhook Gateway</div>
                        <div className="text-slate-500">Automated fee payment STK push callbacks and sandbox testing mode</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={platformMpesaSandboxInput}
                          onChange={(e) => setPlatformMpesaSandboxInput(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Public Website Content Editor */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center space-x-2">
                    <Globe className="h-4 w-4 text-indigo-600" />
                    <span>Public Website Content Editor (Global CMS)</span>
                  </h3>
                  <p className="text-xs text-slate-500 mb-4">
                    Edit headlines, subtitles, and messaging across the public marketing website. Changes apply instantly when saved.
                  </p>

                  <div className="space-y-4 text-xs">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Hero Eyebrow Badge Text</label>
                      <input
                        type="text"
                        value={heroBadgeInput}
                        onChange={(e) => setHeroBadgeInput(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Hero Headline</label>
                        <input
                          type="text"
                          value={heroHeadlineInput}
                          onChange={(e) => setHeroHeadlineInput(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Hero Subheadline</label>
                        <textarea
                          rows={2}
                          value={heroSubheadlineInput}
                          onChange={(e) => setHeroSubheadlineInput(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white resize-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Hero Primary CTA Text</label>
                        <input
                          type="text"
                          value={heroPrimaryCtaInput}
                          onChange={(e) => setHeroPrimaryCtaInput(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Hero Secondary CTA Text</label>
                        <input
                          type="text"
                          value={heroSecondaryCtaInput}
                          onChange={(e) => setHeroSecondaryCtaInput(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Solutions Section Title</label>
                        <input
                          type="text"
                          value={solutionsTitleInput}
                          onChange={(e) => setSolutionsTitleInput(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Pricing Section Title</label>
                        <input
                          type="text"
                          value={pricingTitleInput}
                          onChange={(e) => setPricingTitleInput(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Footer Tagline</label>
                      <input
                        type="text"
                        value={footerTaglineInput}
                        onChange={(e) => setFooterTaglineInput(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Action Bar */}
                <div className="flex items-center justify-end space-x-3 pt-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/30 flex items-center space-x-2 transition"
                  >
                    <Save className="h-4 w-4" />
                    <span>Save Platform Settings & Logo</span>
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Module Configuration Modal */}
      {selectedTenantForModules && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Module Access Switchboard</h3>
                <p className="text-xs text-slate-500">{selectedTenantForModules.name}</p>
              </div>
              <button
                onClick={() => setSelectedTenantForModules(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-2.5 max-h-96 overflow-y-auto">
              {allAvailableModules.map((mod) => {
                const isEnabled = selectedTenantForModules.modules.includes(mod.id);
                return (
                  <div
                    key={mod.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200"
                  >
                    <div>
                      <div className="text-xs font-semibold text-slate-800">{mod.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{mod.id}</div>
                    </div>
                    <button
                      onClick={() => {
                        toggleTenantModule(selectedTenantForModules.id, mod.id);
                        setSelectedTenantForModules(prev => prev ? {
                          ...prev,
                          modules: isEnabled ? prev.modules.filter(m => m !== mod.id) : [...prev.modules, mod.id]
                        } : null);
                      }}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        isEnabled
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                      }`}
                    >
                      {isEnabled ? 'ENABLED' : 'DISABLED'}
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedTenantForModules(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create User Modal */}
      {showCreateUserModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-slate-900 text-base mb-1">Create Platform User</h3>
            <p className="text-xs text-slate-500 mb-4">Provision a new user account with role-based permissions</p>

            <form onSubmit={handleCreateUser} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mary Wanjiku"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. mary@staustins.ac.ke"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Role</label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none"
                >
                  <option value="TENANT_ADMIN">TENANT_ADMIN (Principal / Director / GM)</option>
                  <option value="MANAGER">MANAGER (Operations / Store Manager)</option>
                  <option value="ACCOUNTANT">ACCOUNTANT (Bursar / Finance Officer)</option>
                  <option value="TEACHER">TEACHER (Class Teacher / CBC)</option>
                  <option value="CASHIER">CASHIER (POS Cashier)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Target Tenant Workspace</label>
                <select
                  value={newUserTenantId}
                  onChange={(e) => setNewUserTenantId(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none"
                >
                  {allTenants.map(t => (
                    <option key={t.id} value={t.id}>{t.name} ({t.code})</option>
                  ))}
                </select>
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowCreateUserModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-sm"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Tenant Subdomain Modal */}
      {editingSubdomainTenant && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center space-x-2 text-indigo-600 mb-1">
              <Globe className="h-5 w-5" />
              <h3 className="font-bold text-slate-900 text-base">Edit Tenant Branding & Subdomain</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Configure assigned subdomain and official logo emblem for <strong>{editingSubdomainTenant.name}</strong>
            </p>

            <form onSubmit={handleSaveSubdomainEdit} className="space-y-4 text-xs">
              {/* Logo / Crest Uploader */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 space-y-3">
                <LogoUploader
                  currentLogoUrl={editLogoUrlVal}
                  onLogoChange={setEditLogoUrlVal}
                  entityName={editingSubdomainTenant.name}
                  label="Tenant Logo / Crest"
                  compact={true}
                />
                <div className="pt-2 border-t border-slate-200">
                  <FaviconUploader
                    currentFaviconUrl={editFaviconVal}
                    onFaviconChange={setEditFaviconVal}
                    label="Tenant Tab Favicon"
                    sublabel="Upload 32x32px favicon icon."
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Subdomain Slug *</label>
                <div className="flex items-center rounded-xl bg-white border border-slate-200 overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500">
                  <input
                    type="text"
                    required
                    value={editSubdomainVal}
                    onChange={(e) => setEditSubdomainVal(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    className="flex-1 px-3 py-2 text-xs font-mono font-bold text-slate-800 focus:outline-none lowercase"
                    placeholder="e.g. staustins"
                  />
                  <span className="bg-slate-100 border-l border-slate-200 px-3 py-2 text-xs font-mono font-bold text-slate-600">
                    .{MAIN_DOMAIN.toLowerCase()}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl">
                <div className="text-[11px] text-indigo-700 font-semibold mb-1">Generated Portal URL:</div>
                <div className="font-mono text-xs font-bold text-indigo-950 break-all">
                  https://{editSubdomainVal || 'prefix'}.{MAIN_DOMAIN.toLowerCase()}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Custom Domain (Optional CNAME)</label>
                <input
                  type="text"
                  value={editCustomDomainVal}
                  onChange={(e) => setEditCustomDomainVal(e.target.value)}
                  placeholder="e.g. portal.staustins.ac.ke"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Public Official Website</label>
                <input
                  type="url"
                  value={editPublicWebsiteVal}
                  onChange={(e) => setEditPublicWebsiteVal(e.target.value)}
                  placeholder="e.g. https://www.staustins.ac.ke"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono text-xs focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditingSubdomainTenant(null)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-sm"
                >
                  Save Routing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Subscription Tier Modal */}
      {editingTier && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                  <Sliders className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base">Edit Subscription Tier: {editingTier.id}</h3>
                  <p className="text-xs text-slate-500">Configure pricing, quota ceilings, features, and SLA parameters</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingTier(null)}
                className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTier} className="space-y-5 text-xs">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tier Display Name *</label>
                  <input
                    type="text"
                    required
                    value={tierName}
                    onChange={(e) => setTierName(e.target.value)}
                    placeholder="e.g. Basic Starter Tier"
                    className="w-full px-3 py-2 bg-white text-slate-900 border border-slate-200 rounded-xl font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Badge / Highlight</label>
                  <div className="flex items-center space-x-2 pt-2">
                    <input
                      type="checkbox"
                      id="isPopularCheck"
                      checked={tierIsPopular}
                      onChange={(e) => setTierIsPopular(e.target.checked)}
                      className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                    />
                    <label htmlFor="isPopularCheck" className="font-semibold text-slate-700 cursor-pointer">
                      Mark as "Popular Choice" Badge
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tagline & Description *</label>
                <input
                  type="text"
                  required
                  value={tierTagline}
                  onChange={(e) => setTierTagline(e.target.value)}
                  placeholder="e.g. Essential school, retail & single-branch starter package"
                  className="w-full px-3 py-2 bg-white text-slate-900 border border-slate-200 rounded-xl font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              {/* Pricing Matrix */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-3">
                  Pricing & Currency Engine
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Currency</label>
                    <input
                      type="text"
                      required
                      value={tierCurrency}
                      onChange={(e) => setTierCurrency(e.target.value.toUpperCase())}
                      placeholder="KES"
                      className="w-full px-3 py-2 bg-white text-slate-900 border border-slate-200 rounded-xl font-bold uppercase focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Monthly Price ({tierCurrency}) *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="500"
                      value={tierMonthlyPrice}
                      onChange={(e) => setTierMonthlyPrice(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-white text-slate-900 border border-slate-200 rounded-xl font-bold focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Annual Price ({tierCurrency}) *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="1000"
                      value={tierAnnualPrice}
                      onChange={(e) => setTierAnnualPrice(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-white text-slate-900 border border-slate-200 rounded-xl font-bold focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Quotas & Capacity Limits */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-3">
                  Platform Capacity & Quotas
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Max Learners / Records *</label>
                    <input
                      type="text"
                      required
                      value={tierMaxLearners}
                      onChange={(e) => setTierMaxLearners(e.target.value)}
                      placeholder="e.g. Up to 300 Learners / Records"
                      className="w-full px-3 py-2 bg-white text-slate-900 border border-slate-200 rounded-xl font-semibold focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Max Staff Accounts *</label>
                    <input
                      type="text"
                      required
                      value={tierMaxStaff}
                      onChange={(e) => setTierMaxStaff(e.target.value)}
                      placeholder="e.g. 5 Staff / Teacher Accounts"
                      className="w-full px-3 py-2 bg-white text-slate-900 border border-slate-200 rounded-xl font-semibold focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Cloud Storage (GB) *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={tierStorageGB}
                      onChange={(e) => setTierStorageGB(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-white text-slate-900 border border-slate-200 rounded-xl font-bold focus:outline-none"
                    />
                  </div>
                </div>

                <div className="mt-3">
                  <label className="block font-semibold text-slate-700 mb-1">Support & SLA Tier *</label>
                  <input
                    type="text"
                    required
                    value={tierSupportSLA}
                    onChange={(e) => setTierSupportSLA(e.target.value)}
                    placeholder="e.g. Priority WhatsApp & Dedicated Phone Support (2h SLA)"
                    className="w-full px-3 py-2 bg-white text-slate-900 border border-slate-200 rounded-xl font-semibold focus:outline-none"
                  />
                </div>
              </div>

              {/* Feature Matrix Editor */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block font-bold text-slate-700">Included Features Checklist</label>
                  <span className="text-[11px] text-slate-400 font-semibold">{tierFeatures.length} items</span>
                </div>

                <div className="space-y-2 mb-3 max-h-48 overflow-y-auto pr-1">
                  {tierFeatures.map((feat, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                      <div className="flex items-center space-x-2 flex-1 mr-2">
                        <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                        <span className="text-slate-800 font-medium">{feat}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteFeature(idx)}
                        className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                        title="Remove feature"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add new feature input */}
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={newFeatureInput}
                    onChange={(e) => setNewFeatureInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddFeature();
                      }
                    }}
                    placeholder="Type new capability (e.g. Real-Time M-Pesa Webhook Gateway)..."
                    className="flex-1 px-3 py-2 bg-white text-slate-900 border border-slate-200 rounded-xl font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-none text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="inline-flex items-center space-x-1 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditingTier(null)}
                  className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-md transition"
                >
                  Save Tier Configuration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick Assign Plan Modal */}
      {showAssignPlanModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center space-x-2 text-indigo-600 mb-1">
              <Tag className="h-5 w-5" />
              <h3 className="font-bold text-slate-900 text-base">Assign Subscription Tier</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Select an institution and apply the corresponding subscription tier entitlement.
            </p>

            <form onSubmit={handleAssignTenantPlan} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Institution *</label>
                <select
                  value={assignTargetTenantId}
                  onChange={(e) => setAssignTargetTenantId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none font-medium"
                >
                  {allTenants.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.code}) — Currently on {t.plan}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-2">Select Target Subscription Tier *</label>
                <div className="grid grid-cols-3 gap-2">
                  {subscriptionTiers.map(tier => (
                    <button
                      key={tier.id}
                      type="button"
                      onClick={() => setAssignTargetPlan(tier.id)}
                      className={`p-3 rounded-xl border text-center transition ${
                        assignTargetPlan === tier.id
                          ? 'border-indigo-600 bg-indigo-50/70 ring-2 ring-indigo-600/30'
                          : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                      }`}
                    >
                      <div className="font-black text-slate-900 text-xs">{tier.id}</div>
                      <div className="text-[10px] text-slate-500 mt-1 font-bold">
                        KES {tier.priceMonthly.toLocaleString()}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview card */}
              {(() => {
                const selectedTierConfig = subscriptionTiers.find(t => t.id === assignTargetPlan);
                return selectedTierConfig ? (
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800">{selectedTierConfig.name}</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md">
                        {selectedTierConfig.currency} {selectedTierConfig.priceMonthly.toLocaleString()}/mo
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">{selectedTierConfig.tagline}</p>
                    <div className="text-[10px] text-slate-600 pt-1 font-medium">
                      Quota: {selectedTierConfig.maxLearnersOrRecords} • {selectedTierConfig.maxStaffAccounts}
                    </div>
                  </div>
                ) : null;
              })()}

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAssignPlanModal(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-sm"
                >
                  Apply Plan Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {editingTenant && (
        <EditTenantModal
          tenant={editingTenant}
          onClose={() => setEditingTenant(null)}
          onSave={updateTenant}
        />
      )}

      {/* Create New Subscription Tier Modal */}
      {showCreateTierModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                  <Plus className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base">Create New Subscription Tier</h3>
                  <p className="text-xs text-slate-500">Define a unique tier ID, pricing, quota ceilings, and feature matrix</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateTierModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTier} className="space-y-5 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tier Identifier (ID) *</label>
                  <input
                    type="text"
                    required
                    value={newTierId}
                    onChange={(e) => setNewTierId(e.target.value.toUpperCase())}
                    placeholder="e.g. ULTIMATE or SEMINARY"
                    className="w-full px-3 py-2 bg-white text-slate-900 border border-slate-200 rounded-xl font-black uppercase focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Unique uppercase code (e.g. ADVANCED, CAMPUS)</p>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tier Display Name *</label>
                  <input
                    type="text"
                    required
                    value={tierName}
                    onChange={(e) => setTierName(e.target.value)}
                    placeholder="e.g. Ultimate Campus Tier"
                    className="w-full px-3 py-2 bg-white text-slate-900 border border-slate-200 rounded-xl font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tagline & Description *</label>
                <input
                  type="text"
                  required
                  value={tierTagline}
                  onChange={(e) => setTierTagline(e.target.value)}
                  placeholder="e.g. Built for large institutions and multi-branch networks"
                  className="w-full px-3 py-2 bg-white text-slate-900 border border-slate-200 rounded-xl font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              {/* Pricing Matrix */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-3">
                  Pricing & Currency Engine
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Currency</label>
                    <input
                      type="text"
                      required
                      value={tierCurrency}
                      onChange={(e) => setTierCurrency(e.target.value.toUpperCase())}
                      placeholder="KES"
                      className="w-full px-3 py-2 bg-white text-slate-900 border border-slate-200 rounded-xl font-bold uppercase focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Monthly Price ({tierCurrency}) *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="500"
                      value={tierMonthlyPrice}
                      onChange={(e) => setTierMonthlyPrice(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-white text-slate-900 border border-slate-200 rounded-xl font-bold focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Annual Price ({tierCurrency}) *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="1000"
                      value={tierAnnualPrice}
                      onChange={(e) => setTierAnnualPrice(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-white text-slate-900 border border-slate-200 rounded-xl font-bold focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Quotas & Capacity Limits */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-3">
                  Platform Capacity & Quotas
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Max Learners / Records *</label>
                    <input
                      type="text"
                      required
                      value={tierMaxLearners}
                      onChange={(e) => setTierMaxLearners(e.target.value)}
                      placeholder="e.g. Up to 3,000 Learners"
                      className="w-full px-3 py-2 bg-white text-slate-900 border border-slate-200 rounded-xl font-semibold focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Max Staff Accounts *</label>
                    <input
                      type="text"
                      required
                      value={tierMaxStaff}
                      onChange={(e) => setTierMaxStaff(e.target.value)}
                      placeholder="e.g. 50 Staff Accounts"
                      className="w-full px-3 py-2 bg-white text-slate-900 border border-slate-200 rounded-xl font-semibold focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Cloud Storage (GB) *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={tierStorageGB}
                      onChange={(e) => setTierStorageGB(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-white text-slate-900 border border-slate-200 rounded-xl font-bold focus:outline-none"
                    />
                  </div>
                </div>

                <div className="mt-3">
                  <label className="block font-semibold text-slate-700 mb-1">Support & SLA Tier *</label>
                  <input
                    type="text"
                    required
                    value={tierSupportSLA}
                    onChange={(e) => setTierSupportSLA(e.target.value)}
                    placeholder="e.g. 24/7 Priority Support & Dedicated Account Manager"
                    className="w-full px-3 py-2 bg-white text-slate-900 border border-slate-200 rounded-xl font-semibold focus:outline-none"
                  />
                </div>
              </div>

              {/* Features Builder */}
              <div>
                <label className="block font-bold text-slate-700 mb-2">Included Features & Checklist</label>
                <div className="space-y-2 mb-3 max-h-48 overflow-y-auto pr-1">
                  {tierFeatures.map((feat, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                      <div className="flex items-center space-x-2 flex-1 mr-2">
                        <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                        <span className="text-slate-800 font-medium">{feat}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteFeature(idx)}
                        className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                        title="Remove feature"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={newFeatureInput}
                    onChange={(e) => setNewFeatureInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddFeature();
                      }
                    }}
                    placeholder="Type new capability..."
                    className="flex-1 px-3 py-2 bg-white text-slate-900 border border-slate-200 rounded-xl font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-none text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="inline-flex items-center space-x-1 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowCreateTierModal(false)}
                  className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-md transition"
                >
                  Create Subscription Tier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
