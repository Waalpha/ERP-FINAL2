import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { TenantRouter } from './TenantRouter';
import { Tenant } from '../types';
import {
  Building2,
  GraduationCap,
  School,
  ShoppingBag,
  HeartPulse,
  Users,
  CreditCard,
  BookOpen,
  Calendar,
  Bell,
  FileText,
  Settings,
  PlusCircle,
  Search,
  CheckCircle2,
  ArrowLeft,
  ChevronRight,
  Menu,
  X,
  UserCheck,
  Shield,
  Layers,
  Sparkles,
  BookA,
  Library,
  BedDouble,
  Receipt,
  Award,
  Globe
} from 'lucide-react';
import { navigateToPlatform, MAIN_DOMAIN_SUFFIX } from '../services/TenantResolver';
import { getNavigationForTenant, normalizeTenantType, NavSection } from '../services/ModuleRegistry';

interface TenantShellProps {
  tenant: Tenant;
}

export const TenantShell: React.FC<TenantShellProps> = ({ tenant }) => {
  const {
    user,
    allUsers,
    switchUserPersona,
    students,
    collegeStudents,
    collegeCourses,
    theologyStudents,
    theologyPrograms,
    logout
  } = useAuth();

  const tType = normalizeTenantType(tenant.type);

  // Determine initial tab based on tenant type
  const [currentTab, setCurrentTab] = useState<string>(() => {
    if (tType === 'COLLEGE') return 'college-overview';
    if (tType === 'THEOLOGICAL') return 'theology-overview';
    if (tType === 'BUSINESS') return 'commerce-retail';
    if (tType === 'HOSPITAL') return 'hospital-overview';
    return 'school-overview';
  });

  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [tenantSearchQuery, setTenantSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // 5-minute inactivity timer to logout and go to public website
  React.useEffect(() => {
    if (!user) return; // Only active when logged in

    let timeoutId: NodeJS.Timeout;

    const resetTimer = () => {
      if (timeoutId) clearTimeout(timeoutId);
      // 5 minutes = 5 * 60 * 1000 = 300000 ms
      timeoutId = setTimeout(async () => {
        try {
          await logout();
        } catch {}
        setCurrentTab('public-website');
      }, 5 * 60 * 1000);
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    events.forEach(event => {
      window.addEventListener(event, resetTimer);
    });

    resetTimer(); // initialize timer

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      events.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [user, logout]);

  // Available users in this specific tenant (plus Super Admin)
  const tenantUsers = (allUsers || []).filter(
    (u) => u && (u.tenantId === tenant?.id || u.role === 'SUPER_ADMIN')
  );

  // Grouped sidebar navigation based on tenant type from ModuleRegistry
  const navSections = getNavigationForTenant(tenant);

  // Search Results scoped to this tenant
  const searchResults = React.useMemo(() => {
    if (!tenantSearchQuery.trim()) return [];
    const q = tenantSearchQuery.toLowerCase();

    if (tType === 'THEOLOGICAL') {
      const matchedSeminarians = (theologyStudents || [])
        .filter((s) => s.fullName.toLowerCase().includes(q) || s.regNo.toLowerCase().includes(q))
        .map((s) => ({ id: s.id, title: s.fullName, sub: `Reg: ${s.regNo} • ${s.programTitle}`, tab: 'theology-students' }));

      const matchedPrograms = (theologyPrograms || [])
        .filter((p) => p.title.toLowerCase().includes(q) || p.code.toLowerCase().includes(q))
        .map((p) => ({ id: p.id, title: p.title, sub: `Code: ${p.code} • Level: ${p.level}`, tab: 'theology-programs' }));

      return [...matchedSeminarians, ...matchedPrograms];
    }

    if (tType === 'COLLEGE') {
      const matchedStudents = (collegeStudents || [])
        .filter((s) => s.fullName.toLowerCase().includes(q) || s.regNo.toLowerCase().includes(q))
        .map((s) => ({ id: s.id, title: s.fullName, sub: `Reg: ${s.regNo} • ${s.courseName}`, tab: 'college-students' }));

      const matchedCourses = (collegeCourses || [])
        .filter((c) => c.title.toLowerCase().includes(q) || c.code.toLowerCase().includes(q))
        .map((c) => ({ id: c.id, title: c.title, sub: `Code: ${c.code} • Level: ${c.level}`, tab: 'college-courses' }));

      return [...matchedStudents, ...matchedCourses];
    }

    // School search
    return (students || [])
      .filter((s) => s.firstName.toLowerCase().includes(q) || s.lastName.toLowerCase().includes(q) || s.admissionNo.toLowerCase().includes(q))
      .map((s) => ({
        id: s.id,
        title: `${s.firstName} ${s.lastName}`,
        sub: `Adm: ${s.admissionNo} • Grade: ${s.grade || 'CBC'}`,
        tab: 'school-students'
      }));
  }, [tenantSearchQuery, tType, theologyStudents, theologyPrograms, collegeStudents, collegeCourses, students]);

  // Full-Screen Dedicated Views (Public Website and POS Terminal)
  if (currentTab === 'public-website') {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
        <TenantRouter
          currentTab={currentTab}
          onNavigateTab={setCurrentTab}
          tenant={tenant}
        />
      </div>
    );
  }

  if (currentTab === 'commerce-pos' || currentTab === 'retail-pos') {
    return (
      <div className="h-screen w-screen overflow-hidden flex flex-col bg-slate-950 font-sans">
        <TenantRouter
          currentTab={currentTab}
          onNavigateTab={setCurrentTab}
          tenant={tenant}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans antialiased text-slate-900 selection:bg-indigo-500 selection:text-white">
      {/* Professional Customer-Facing Tenant Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          {/* Tenant Brand Identity: Logo + Name + Type */}
          <div className="flex items-center space-x-3.5 min-w-0">
            <button
              onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl"
              aria-label="Toggle navigation"
            >
              {isMobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Dynamic Tenant Logo / Crest */}
            {tenant.logoUrl ? (
              <img
                src={tenant.logoUrl}
                alt={tenant.name}
                referrerPolicy="no-referrer"
                className="h-10 w-10 rounded-xl object-contain border border-slate-200 bg-white p-0.5 shadow-xs flex-shrink-0"
              />
            ) : (
              <div
                className="h-10 w-10 rounded-xl bg-indigo-600 border border-indigo-500 flex items-center justify-center font-black text-white text-lg flex-shrink-0 shadow-xs"
                style={tenant.primaryColor ? { backgroundColor: tenant.primaryColor } : undefined}
              >
                {tenant.name.charAt(0)}
              </div>
            )}

            <div className="min-w-0">
              <div className="flex items-center space-x-2">
                <h1 className="text-base font-bold text-slate-900 truncate tracking-tight">
                  {tenant.name}
                </h1>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                  {tenant.type.replace(/_/g, ' ')}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-slate-500">
                <span className="text-indigo-600 font-semibold">{tenant.subdomain}.{MAIN_DOMAIN_SUFFIX}</span>
                {tenant.motto && (
                  <span className="hidden sm:inline text-slate-400 truncate">
                    • &ldquo;{tenant.motto}&rdquo;
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
            {/* Scoped Search Input */}
            <div className="relative hidden md:block w-60">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder={`Search ${tenant.name}...`}
                value={tenantSearchQuery}
                onChange={(e) => {
                  setTenantSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
              />

              {/* Search Dropdown */}
              {isSearchOpen && searchResults.length > 0 && (
                <div className="absolute top-10 left-0 right-0 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-50 space-y-1">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
                    Matching Records
                  </div>
                  {searchResults.slice(0, 5).map((res) => (
                    <button
                      key={res.id}
                      onClick={() => {
                        setCurrentTab(res.tab);
                        setIsSearchOpen(false);
                        setTenantSearchQuery('');
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-indigo-50 rounded-xl transition flex flex-col"
                    >
                      <span className="text-xs font-bold text-slate-900">{res.title}</span>
                      <span className="text-[11px] text-slate-500">{res.sub}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Action Button */}
            {tType === 'THEOLOGICAL' && (
              <button
                onClick={() => setCurrentTab('theology-students')}
                className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded-xl shadow-xs transition"
                style={tenant.primaryColor ? { backgroundColor: tenant.primaryColor } : undefined}
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Admit Seminarian</span>
              </button>
            )}

            {(tenant.type === 'COLLEGE' || tenant.type === 'PRIMARY_SCHOOL') && (
              <button
                onClick={() => setCurrentTab(tenant.type === 'COLLEGE' ? 'college-students' : 'school-students')}
                className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-xs transition"
                style={tenant.primaryColor ? { backgroundColor: tenant.primaryColor } : undefined}
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>New Admission</span>
              </button>
            )}

            {/* Live Public Website Link */}
            <button
              onClick={() => setCurrentTab('public-website')}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-semibold rounded-xl shadow-xs transition"
              title="Open Live Public Website"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">Live Website</span>
            </button>

            {/* User Persona & Role Selector */}
            {import.meta.env.DEV && (
              <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
                <select
                  value={user?.uid || ''}
                  onChange={(e) => switchUserPersona(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl px-2.5 py-1.5 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500 max-w-[150px] sm:max-w-[200px] truncate cursor-pointer"
                  title="Active Tenant User Persona (Dev Only)"
                >
                  {tenantUsers.map((u) => (
                    <option key={u.uid} value={u.uid}>
                      {u.displayName} ({u.role})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Return to Master Platform if Super Admin */}
            {user?.role === 'SUPER_ADMIN' && import.meta.env.DEV && (
              <button
                onClick={() => navigateToPlatform()}
                className="px-2.5 py-1.5 bg-slate-900 hover:bg-indigo-600 text-white rounded-xl text-xs font-semibold transition flex items-center space-x-1.5 shadow-xs"
                title="Return to Master Super Admin Platform (Dev Only)"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Master Platform</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Workspace Frame */}
      <div className="flex-1 flex w-full overflow-y-auto">
        {/* Tenant Grouped Navigation Sidebar (Desktop) */}
        <aside className="w-64 border-r border-slate-200 bg-white p-4 space-y-5 hidden lg:flex flex-col flex-shrink-0 overflow-y-auto">
          <div className="space-y-4">
            {navSections.map((section, sIdx) => (
              <div key={sIdx} className="space-y-1">
                {section.title && (
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono px-3 py-1">
                    {section.title}
                  </div>
                )}
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setCurrentTab(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition ${
                        isActive
                          ? 'bg-indigo-600 text-white font-bold shadow-xs'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                      style={isActive && tenant.primaryColor ? { backgroundColor: tenant.primaryColor } : undefined}
                    >
                      <div className="flex items-center space-x-2.5">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                        <span>{item.label}</span>
                      </div>
                      {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-80" />}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Tenant Status Footer Widget */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2 mt-auto">
            <div className="flex items-center justify-between text-xs text-slate-700 font-bold">
              <span>{tenant.name}</span>
              <span className="inline-flex items-center space-x-1 text-emerald-600 font-semibold text-[11px]">
                <CheckCircle2 className="w-3 h-3" />
                <span>Active</span>
              </span>
            </div>
            <div className="text-[11px] text-slate-500 space-y-1">
              <div className="flex justify-between">
                <span>Academic Year:</span>
                <span className="font-mono text-slate-900">{tenant.currentAcademicYear || '2025/2026'}</span>
              </div>
              <div className="flex justify-between">
                <span>Current Term/Sem:</span>
                <span className="font-semibold text-indigo-600">{tenant.currentTerm || 'Semester 1'}</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        {isMobileNavOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex">
            <div className="w-72 bg-white h-full p-4 border-r border-slate-200 flex flex-col justify-between overflow-y-auto">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div className="text-sm font-bold text-slate-900 truncate">{tenant.name}</div>
                  <button onClick={() => setIsMobileNavOpen(false)} className="p-1 text-slate-400 hover:text-slate-900">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-4">
                  {navSections.map((section, sIdx) => (
                    <div key={sIdx} className="space-y-1">
                      {section.title && (
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono px-3 py-1">
                          {section.title}
                        </div>
                      )}
                      {section.items.map((item) => {
                        const Icon = item.icon;
                        const isActive = currentTab === item.id;
                        return (
                          <button
                            key={item.id}
                            onClick={() => {
                              setCurrentTab(item.id);
                              setIsMobileNavOpen(false);
                            }}
                            className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-medium ${
                              isActive
                                ? 'bg-indigo-600 text-white font-bold'
                                : 'text-slate-600 hover:bg-slate-100'
                            }`}
                            style={isActive && tenant.primaryColor ? { backgroundColor: tenant.primaryColor } : undefined}
                          >
                            <Icon className="w-4 h-4" />
                            <span>{item.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 text-center text-[10px] text-slate-400 font-mono">
                {tenant.subdomain}.{MAIN_DOMAIN_SUFFIX}
              </div>
            </div>
            <div className="flex-1" onClick={() => setIsMobileNavOpen(false)} />
          </div>
        )}

        {/* Dynamic Tenant Route Content */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-5 md:p-6 lg:p-8 pb-24 lg:pb-8">
          <TenantRouter
            currentTab={currentTab}
            onNavigateTab={setCurrentTab}
            tenant={tenant}
          />
        </main>
      </div>
    </div>
  );
};

