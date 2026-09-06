import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  CalendarCheck,
  Award,
  FileSpreadsheet,
  Receipt,
  Calendar,
  Clock,
  BookMarked,
  ShieldAlert,
  Send,
  Settings,
  Building,
  UserCheck,
  CreditCard,
  History,
  Layers,
  ChevronRight,
  ShoppingCart,
  Package,
  Truck,
  UserSquare2,
  Stethoscope,
  Pill,
  BedDouble,
  Library,
  BookA,
  BarChart3,
  AlertTriangle,
  X,
  Sparkles,
  Flame,
  Scroll,
  HeartHandshake,
  Church,
  Globe,
  ShieldCheck,
  Cloud,
  Database
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tabId: string) => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isMobileOpen = false,
  onCloseMobile
}) => {
  const { user, tenant, isPlatformMode, switchToPlatformMaster, switchTenantAsSuperAdmin, allTenants, canAccessModule, needsAttentionItems } = useAuth();
  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

  const handleSelectTab = (tabId: string) => {
    onSelectTab(tabId);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  // Super Admin / Platform Master Navigation Items (DAVETECH Cloud inspired by Render + Cloudflare)
  const superAdminNav = [
    { id: 'super-admin-overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'super-admin-tenants', label: 'Projects / Tenants', icon: Building, badge: `${allTenants.length}` },
    { id: 'super-admin-domains', label: 'Domains & DNS', icon: Globe },
    { id: 'super-admin-ssl', label: 'SSL Certificates', icon: ShieldCheck },
    { id: 'super-admin-deployments', label: 'Deployments', icon: Cloud },
    { id: 'super-admin-databases', label: 'Databases', icon: Database },
    { id: 'super-admin-users', label: 'Users & Access', icon: UserCheck },
    { id: 'super-admin-plans', label: 'Billing & Tiers', icon: CreditCard },
    { id: 'super-admin-audit', label: 'Logs', icon: History },
    { id: 'super-admin-settings', label: 'Settings', icon: Settings }
  ];

  // School Navigation Groups
  const schoolNavGroups = [
    {
      group: 'Core Administration',
      items: [
        { id: 'school-overview', label: 'School Dashboard', icon: LayoutDashboard },
        { id: 'school-students', label: 'Learners & Admission', icon: GraduationCap, module: 'STUDENTS' },
        { id: 'school-staff', label: 'Teachers & Staff', icon: Users, module: 'STAFF' },
        { id: 'school-classes', label: 'Classes & Streams', icon: Layers, module: 'CLASSES' }
      ]
    },
    {
      group: 'Academics & CBC',
      items: [
        { id: 'school-cbc', label: 'CBC Learning Areas', icon: BookOpen, module: 'CBC_ACADEMICS' },
        { id: 'school-attendance', label: 'Attendance Roll Call', icon: CalendarCheck, module: 'ATTENDANCE' },
        { id: 'school-assessments', label: 'Exams & Assessment', icon: Award, module: 'ASSESSMENTS' },
        { id: 'school-reports', label: 'Report Cards Generator', icon: FileSpreadsheet, module: 'REPORTS' },
        { id: 'school-timetable', label: 'Class Timetable', icon: Clock, module: 'TIMETABLE' },
        { id: 'school-assignments', label: 'Homework & Tasks', icon: BookMarked, module: 'ASSIGNMENTS' }
      ]
    },
    {
      group: 'Finance & Accounts',
      items: [
        { id: 'school-fees', label: 'Fees & Invoicing', icon: Receipt, module: 'FEES_FINANCE' }
      ]
    },
    {
      group: 'Student Welfare & Comms',
      items: [
        { id: 'school-discipline', label: 'Discipline & Conduct', icon: ShieldAlert, module: 'DISCIPLINE' },
        { id: 'school-calendar', label: 'School Events & Term', icon: Calendar, module: 'CALENDAR' },
        { id: 'school-sms', label: 'SMS & Notifications', icon: Send, module: 'SMS_NOTIFICATIONS' },
        { id: 'school-settings', label: 'Tenant Settings', icon: Settings }
      ]
    }
  ];

  // College & University Navigation Groups
  const collegeNavGroups = [
    {
      group: 'Higher Education Core',
      items: [
        { id: 'college-overview', label: 'Campus Dashboard', icon: LayoutDashboard },
        { id: 'college-departments', label: 'Faculties & Depts', icon: Building },
        { id: 'college-courses', label: 'Degree & Diploma Programs', icon: BookA },
        { id: 'college-students', label: 'Enrolled Students', icon: GraduationCap },
        { id: 'college-fees', label: 'Tuition & Billing', icon: Receipt }
      ]
    },
    {
      group: 'Theology & Divinity Seminary',
      items: [
        { id: 'theology-programs', label: 'Theology Programs (Cert-B.Th)', icon: Flame },
        { id: 'theology-students', label: 'Seminarians & Candidates', icon: GraduationCap },
        { id: 'theology-fees', label: 'Seminary Fees & Sponsorship', icon: Receipt },
        { id: 'theology-practicum', label: 'Ministry Fieldwork Logs', icon: HeartHandshake },
        { id: 'theology-library', label: 'Patristics & Divinity Library', icon: Scroll }
      ]
    },
    {
      group: 'Campus Facilities',
      items: [
        { id: 'college-library', label: 'General Library Catalog', icon: Library },
        { id: 'college-hostel', label: 'Hostel & Housing', icon: BedDouble },
        { id: 'college-settings', label: 'Campus Settings', icon: Settings }
      ]
    }
  ];

  // Retail & Wholesale Navigation Groups
  const retailNavGroups = [
    {
      group: 'Point of Sale & Inventory',
      items: [
        { id: 'retail-overview', label: 'Sales & Inventory Hub', icon: LayoutDashboard },
        { id: 'retail-pos', label: 'Point of Sale (POS)', icon: ShoppingCart },
        { id: 'retail-inventory', label: 'Stock & Inventory Control', icon: Package },
        { id: 'retail-sales-history', label: 'Sales Orders & Receipts', icon: Receipt }
      ]
    },
    {
      group: 'Partners & Accounting',
      items: [
        { id: 'retail-suppliers', label: 'Suppliers & Vendors', icon: Truck },
        { id: 'retail-customers', label: 'Customer Accounts & Credit', icon: UserSquare2 },
        { id: 'retail-fees', label: 'Invoicing & Debtor Billing', icon: Receipt },
        { id: 'retail-settings', label: 'Store Settings', icon: Settings }
      ]
    }
  ];

  // Hospital & Healthcare Navigation Groups
  const hospitalNavGroups = [
    {
      group: 'Clinical Services',
      items: [
        { id: 'hospital-overview', label: 'Clinical Hub', icon: LayoutDashboard },
        { id: 'hospital-patients', label: 'Patient Registry & Triage', icon: Users },
        { id: 'hospital-consultations', label: 'Doctor Consultations', icon: Stethoscope },
        { id: 'hospital-pharmacy', label: 'Pharmacy & Dispensary', icon: Pill }
      ]
    },
    {
      group: 'Billing & Settings',
      items: [
        { id: 'hospital-billing', label: 'Medical Billing & Invoices', icon: Receipt },
        { id: 'hospital-settings', label: 'Hospital Settings', icon: Settings }
      ]
    }
  ];

  const getNavGroups = () => {
    if (!tenant) return [];
    if (tenant.type === 'PRIMARY_SCHOOL' || tenant.type === 'SECONDARY_SCHOOL') {
      return schoolNavGroups;
    }
    if (tenant.type === 'COLLEGE' || tenant.type === 'UNIVERSITY') {
      return collegeNavGroups;
    }
    if (tenant.type === 'RETAIL' || tenant.type === 'BUSINESS') {
      return retailNavGroups;
    }
    if (tenant.type === 'HOSPITAL') {
      return hospitalNavGroups;
    }
    return schoolNavGroups;
  };

  const navGroups = getNavGroups();

  const renderSidebarContent = () => (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Platform Mode / Tenant Mode Header Indicator */}
      {isPlatformMode ? (
        <div className="p-3 mx-3 mt-3 rounded-xl bg-indigo-950/60 border border-indigo-700/60 text-indigo-200 shadow-sm">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-indigo-300">
            <span className="h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />
            <span>DAVETECH PLATFORM HQ</span>
          </div>
          <p className="text-[11px] text-indigo-300/80 mt-1 leading-snug">
            Master multi-tenant platform & fleet governance console.
          </p>
        </div>
      ) : (
        <div className="p-3 mx-3 mt-3 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
              CLIENT TENANT
            </span>
            <span className="text-[9px] bg-slate-700 px-1.5 py-0.5 rounded font-mono text-slate-300">
              {tenant?.code}
            </span>
          </div>
          <div className="flex items-center space-x-2.5 mt-1.5">
            {tenant?.logoUrl ? (
              <div className="h-7 w-7 rounded-lg bg-white p-0.5 flex items-center justify-center overflow-hidden flex-shrink-0 border border-slate-700 shadow-2xs">
                <img src={tenant.logoUrl} alt={tenant.name} className="h-full w-full object-contain" />
              </div>
            ) : (
              <div className="h-7 w-7 rounded-lg bg-indigo-600/30 text-indigo-300 font-bold text-xs flex items-center justify-center flex-shrink-0 border border-indigo-500/30">
                {tenant?.name.charAt(0) || 'T'}
              </div>
            )}
            <div className="text-xs font-bold text-white truncate min-w-0">{tenant?.name}</div>
          </div>
          <div className="text-[10px] font-mono text-indigo-300 bg-slate-900/80 px-2 py-0.5 rounded-md mt-2 flex items-center justify-between border border-slate-700/60 truncate">
            <span className="truncate">{tenant?.subdomain || tenant?.code?.toLowerCase()}.davetech.co.ke</span>
            <span className="text-[9px] text-emerald-400 font-bold ml-1">SSL</span>
          </div>
          {isSuperAdmin && (
            <button
              onClick={() => {
                switchToPlatformMaster();
                handleSelectTab('super-admin-overview');
              }}
              className="mt-2 w-full py-2 px-2.5 rounded-lg bg-indigo-600/80 hover:bg-indigo-600 text-white text-[11px] font-semibold flex items-center justify-center space-x-1 transition-colors active:scale-95"
            >
              <span>← Back to DAVETECH Main</span>
            </button>
          )}
        </div>
      )}

      {/* Attention Alerts Counter if items exist */}
      {needsAttentionItems.length > 0 && !isSuperAdmin && (
        <div className="p-2.5 mx-3 mt-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs">
            <AlertTriangle className="h-4 w-4 text-amber-400 flex-shrink-0" />
            <span className="font-semibold">{needsAttentionItems.length} items need action</span>
          </div>
          <span className="text-[10px] bg-amber-500/20 px-1.5 py-0.5 rounded font-mono font-bold">
            Alerts
          </span>
        </div>
      )}

      {/* Navigation List */}
      <div className="flex-1 py-4 px-3 space-y-6">
        {/* If in Platform Master Mode: Super Admin Console */}
        {isPlatformMode ? (
          <div>
            <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Platform Master Console
            </div>
            <nav className="space-y-1">
              {superAdminNav.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectTab(item.id)}
                    className={`w-full min-h-[42px] flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-indigo-900 text-indigo-200 font-bold">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Quick Hosted Tenants Access for Super Admin */}
            <div className="mt-6 pt-4 border-t border-slate-800">
              <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Inspect Client Tenant
              </div>
              <div className="space-y-1">
                {allTenants.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      switchTenantAsSuperAdmin(t.id);
                      if (t.type === 'PRIMARY_SCHOOL' || t.type === 'SECONDARY_SCHOOL') handleSelectTab('school-overview');
                      else if (t.type === 'COLLEGE' || t.type === 'UNIVERSITY') handleSelectTab('college-overview');
                      else if (t.type === 'RETAIL' || t.type === 'BUSINESS') handleSelectTab('retail-pos');
                      else if (t.type === 'HOSPITAL') handleSelectTab('hospital-overview');
                    }}
                    className="w-full min-h-[38px] flex items-center justify-between px-3 py-2 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition-colors text-left"
                  >
                    <span className="truncate">{t.name}</span>
                    <span className="text-[10px] text-indigo-400 font-mono flex-shrink-0 ml-1">{t.code}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Client Tenant Modules Navigation */
          <div className="space-y-5">
            {navGroups.map((group, idx) => (
              <div key={idx}>
                <div className="px-3 mb-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  {group.group}
                </div>
                <nav className="space-y-1">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentTab === item.id;
                    const isEnabled = !('module' in item) || !item.module || canAccessModule(item.module as string);

                    if (!isEnabled && !isSuperAdmin) return null;

                    return (
                      <button
                        key={item.id}
                        onClick={() => handleSelectTab(item.id)}
                        className={`w-full min-h-[42px] flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition-all ${
                          isActive
                            ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                            : 'text-slate-300 hover:bg-slate-800 hover:text-white font-medium'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5 min-w-0">
                          <Icon className={`h-4 w-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                          <span className="truncate">{item.label}</span>
                        </div>
                        {isActive && <ChevronRight className="h-3.5 w-3.5 text-indigo-200" />}
                      </button>
                    );
                  })}
                </nav>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer System Status */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/40 text-[11px] text-slate-400 mt-auto">
        <div className="flex items-center justify-between">
          <span className="flex items-center space-x-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="font-mono text-emerald-300">Firestore Isolated</span>
          </span>
          <span className="font-mono text-[10px] text-slate-500">v2.5.0</span>
        </div>
        <div className="mt-1 text-[10px] text-slate-500 truncate">
          Scope: <span className="text-slate-300 font-mono">{isPlatformMode ? 'DAVETECH PLATFORM MASTER' : tenant?.id}</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* 1. Desktop Fixed Sidebar */}
      <aside className="hidden lg:flex w-64 bg-slate-900 border-r border-slate-800 flex-col h-[calc(100vh-4rem)] sticky top-16 select-none flex-shrink-0">
        {renderSidebarContent()}
      </aside>

      {/* 2. Mobile & Tablet Sliding Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex animate-in fade-in duration-200">
          {/* Backdrop Blur Overlay */}
          <div
            onClick={onCloseMobile}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
            aria-hidden="true"
          />

          {/* Sliding Navigation Container */}
          <div className="relative w-80 max-w-[85vw] bg-slate-900 text-white shadow-2xl flex flex-col h-full z-50 border-r border-slate-800 animate-in slide-in-from-left duration-250">
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/60">
              <div className="flex items-center space-x-2.5">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-emerald-400 flex items-center justify-center font-black text-white text-lg shadow-md">
                  D
                </div>
                <div>
                  <div className="font-bold text-sm text-white">DAVETECH ERP</div>
                  <div className="text-[10px] text-slate-400 font-mono">Platform Navigation</div>
                </div>
              </div>
              <button
                onClick={onCloseMobile}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Main Nav Content */}
            <div className="flex-1 overflow-y-auto">
              {renderSidebarContent()}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
