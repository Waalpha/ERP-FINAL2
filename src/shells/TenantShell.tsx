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
  Globe,
  Church,
  LogOut,
  ChevronDown,
  Check,
  Clock
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
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [selectedAcademicYear, setSelectedAcademicYear] = useState(tenant.currentAcademicYear || '2025/2026');
  const [selectedAcademicTerm, setSelectedAcademicTerm] = useState(tenant.currentTerm || 'Semester 1');

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
      {/* Professional Customer-Facing Tenant Header - Premium Blue Navbar */}
      <header
        className="sticky top-0 z-30 shadow-md border-b border-[#1E4D7A]/80 text-white"
        style={{ background: 'linear-gradient(90deg, #0B2A4A 0%, #123F68 100%)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          {/* Tenant Brand Identity: Logo + Name + Type */}
          <div className="flex items-center space-x-3 min-w-0">
            <button
              onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
              className="lg:hidden p-2 text-[#DCEBFA] hover:text-white hover:bg-white/10 rounded-xl transition duration-150"
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
                className={`h-10 w-10 rounded-xl object-contain border ${tType === 'THEOLOGICAL' ? 'border-amber-400/40 ring-1 ring-amber-400/25' : 'border-white/20'} bg-white p-0.5 shadow-sm flex-shrink-0`}
              />
            ) : (
              <div
                className={`h-10 w-10 rounded-xl ${tType === 'THEOLOGICAL' ? 'bg-[#06182B] border border-amber-400/40 text-amber-300' : 'bg-white/15 border border-white/20 text-white'} flex items-center justify-center font-black text-lg flex-shrink-0 shadow-sm`}
                style={tenant.primaryColor && tType !== 'THEOLOGICAL' ? { backgroundColor: tenant.primaryColor } : undefined}
              >
                {tType === 'THEOLOGICAL' ? <Church className="w-5 h-5 text-amber-300" /> : tenant.name.charAt(0)}
              </div>
            )}

            <div className="min-w-0">
              <div className="flex items-center space-x-2">
                <h1 className="text-base sm:text-lg font-bold text-white truncate tracking-tight">
                  {tenant.name}
                </h1>
                {tType === 'THEOLOGICAL' ? (
                  <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-white/10 text-amber-300 border border-amber-400/30 shadow-2xs">
                    Theological Seminary
                  </span>
                ) : (
                  <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-white/10 text-[#C9D9E8] border border-white/20">
                    {tenant.type.replace(/_/g, ' ')}
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2 text-xs text-[#C9D9E8]">
                <span className={tType === 'THEOLOGICAL' ? 'text-amber-300/90 font-medium' : 'text-[#DCEBFA] font-medium'}>
                  {tenant.subdomain}.{MAIN_DOMAIN_SUFFIX}
                </span>
                {tenant.motto && (
                  <span className="hidden sm:inline text-white/60 truncate">
                    • &ldquo;{tenant.motto}&rdquo;
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
            {/* Scoped Search Input */}
            <div className="relative hidden md:block w-56 lg:w-64">
              <Search className="w-4 h-4 text-[#DCEBFA] absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder={tType === 'THEOLOGICAL' ? 'Search seminarians, units...' : `Search ${tenant.name}...`}
                value={tenantSearchQuery}
                onChange={(e) => {
                  setTenantSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                className="w-full pl-9 pr-3 py-1.5 bg-white/10 hover:bg-white/15 focus:bg-white/20 border border-white/20 rounded-xl text-xs text-white placeholder-[#B8C9D9] focus:outline-none focus:ring-1 focus:ring-white/40 transition duration-150"
              />

              {/* Search Dropdown */}
              {isSearchOpen && searchResults.length > 0 && (
                <div className="absolute top-10 left-0 right-0 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-50 space-y-1 text-slate-900">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1 flex items-center justify-between">
                    <span>Seminary Records</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsSearchOpen(false);
                      }}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                  {searchResults.slice(0, 5).map((res) => (
                    <button
                      key={res.id}
                      onClick={() => {
                        setCurrentTab(res.tab);
                        setIsSearchOpen(false);
                        setTenantSearchQuery('');
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-amber-50/70 rounded-xl transition flex flex-col"
                    >
                      <span className="text-xs font-bold text-slate-900">{res.title}</span>
                      <span className="text-[11px] text-slate-500">{res.sub}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Academic Year / Term Selector (Theology & Educational Institutions) */}
            {(tType === 'THEOLOGICAL' || tType === 'COLLEGE' || tType === 'PRIMARY_SCHOOL') && (
              <div className="hidden lg:flex items-center space-x-1 px-2.5 py-1.5 bg-white/10 border border-white/20 rounded-xl text-xs text-white">
                <Calendar className="w-3.5 h-3.5 text-[#DCEBFA]" />
                <select
                  value={selectedAcademicTerm}
                  onChange={(e) => setSelectedAcademicTerm(e.target.value)}
                  className="bg-transparent font-medium text-xs text-white focus:outline-none cursor-pointer"
                  title="Active Academic Term"
                >
                  <option value="Semester 1" className="bg-[#0B2A4A] text-white">
                    {selectedAcademicYear} • Semester 1
                  </option>
                  <option value="Semester 2" className="bg-[#0B2A4A] text-white">
                    {selectedAcademicYear} • Semester 2
                  </option>
                  <option value="Fieldwork Term" className="bg-[#0B2A4A] text-white">
                    {selectedAcademicYear} • Fieldwork Term
                  </option>
                </select>
              </div>
            )}

            {/* Notifications Menu */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="relative p-2 text-[#DCEBFA] hover:text-white bg-white/10 hover:bg-white/15 border border-white/15 rounded-xl transition duration-150"
                title="Seminary Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-400 rounded-full ring-2 ring-[#0B2A4A]" />
              </button>

              {isNotificationsOpen && (
                <div className="absolute right-0 top-11 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl p-3 z-50 space-y-2 text-slate-900">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-900">Institutional Alerts</span>
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                      3 New
                    </span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="p-2 bg-slate-50 rounded-xl border border-slate-100 hover:bg-slate-100 transition cursor-pointer">
                      <div className="font-semibold text-slate-800">Practicum Log Submitted</div>
                      <div className="text-[11px] text-slate-500">Samuel Mwangi logged 12 hrs at ACK Cathedral Nyeri.</div>
                      <div className="text-[9px] text-slate-400 mt-1 flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>15 mins ago</span>
                      </div>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-xl border border-slate-100 hover:bg-slate-100 transition cursor-pointer">
                      <div className="font-semibold text-slate-800">Diocesan Bursary Received</div>
                      <div className="text-[11px] text-slate-500">KES 45,000 recorded from Diocese of Mt. Kenya Central.</div>
                      <div className="text-[9px] text-slate-400 mt-1 flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>2 hours ago</span>
                      </div>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-xl border border-slate-100 hover:bg-slate-100 transition cursor-pointer">
                      <div className="font-semibold text-slate-800">Faculty Chapel Schedule</div>
                      <div className="text-[11px] text-slate-500">Wednesday morning symposium timetable published.</div>
                      <div className="text-[9px] text-slate-400 mt-1 flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>Yesterday</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Live Public Website Link */}
            <button
              onClick={() => setCurrentTab('public-website')}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 bg-white/95 hover:bg-white text-[#0B2A4A] border border-white/20 text-xs font-bold rounded-xl shadow-xs transition duration-150"
              title="Open Live Public Website"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">Live Website</span>
            </button>

            {/* User Profile Menu */}
            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center space-x-2 p-1 sm:px-2.5 sm:py-1 hover:bg-white/10 rounded-xl transition duration-150 text-left border border-transparent hover:border-white/15"
              >
                <div className="w-7 h-7 rounded-lg bg-white/15 text-amber-300 font-bold flex items-center justify-center text-xs border border-white/20">
                  {user?.displayName ? user.displayName.charAt(0) : 'F'}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-bold text-white leading-none truncate max-w-[120px]">
                    {user?.displayName || 'Faculty / Clergy'}
                  </div>
                  <div className="text-[10px] text-[#C9D9E8] mt-0.5 font-medium">
                    {tType === 'THEOLOGICAL' ? 'Dean of Studies' : user?.role}
                  </div>
                </div>
                <ChevronDown className="w-3 h-3 text-[#DCEBFA] hidden sm:block" />
              </button>

              {isProfileMenuOpen && (
                <div className="absolute right-0 top-11 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl p-3 z-50 space-y-3 text-slate-900">
                  <div className="pb-2 border-b border-slate-100">
                    <div className="text-xs font-bold text-slate-900">{user?.displayName || 'Seminary Faculty'}</div>
                    <div className="text-[11px] text-slate-500 truncate">{user?.email || 'dean@injiricentre.ac.ke'}</div>
                    <div className="mt-1 inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                      {tType === 'THEOLOGICAL' ? 'Seminary Administration' : user?.role}
                    </div>
                  </div>

                  {/* Persona Switcher (Dev Mode) */}
                  {import.meta.env.DEV && (
                    <div className="space-y-1.5">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Switch Persona (Dev)
                      </div>
                      <select
                        value={user?.uid || ''}
                        onChange={(e) => {
                          switchUserPersona(e.target.value);
                          setIsProfileMenuOpen(false);
                        }}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl px-2.5 py-1.5 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500 truncate cursor-pointer"
                      >
                        {tenantUsers.map((u) => (
                          <option key={u.uid} value={u.uid}>
                            {u.displayName} ({u.role})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Return to Master Platform (Super Admin Dev) */}
                  {user?.role === 'SUPER_ADMIN' && import.meta.env.DEV && (
                    <button
                      onClick={() => {
                        navigateToPlatform();
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition flex items-center justify-between shadow-xs"
                    >
                      <span>Master Super Admin</span>
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <button
                    onClick={async () => {
                      setIsProfileMenuOpen(false);
                      try {
                        await logout();
                      } catch {}
                      setCurrentTab('public-website');
                    }}
                    className="w-full px-3 py-2 text-rose-700 hover:bg-rose-50 rounded-xl text-xs font-semibold transition flex items-center space-x-2"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-600" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
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
                  const activeClass = tType === 'THEOLOGICAL'
                    ? 'bg-slate-900 text-white font-bold border-l-4 border-amber-500 shadow-xs'
                    : 'bg-indigo-600 text-white font-bold shadow-xs';

                  return (
                    <button
                      key={item.id}
                      onClick={() => setCurrentTab(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition ${
                        isActive
                          ? activeClass
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                      style={isActive && tenant.primaryColor && tType !== 'THEOLOGICAL' ? { backgroundColor: tenant.primaryColor } : undefined}
                    >
                      <div className="flex items-center space-x-2.5">
                        <Icon className={`w-4 h-4 ${isActive ? (tType === 'THEOLOGICAL' ? 'text-amber-400' : 'text-white') : 'text-slate-400'}`} />
                        <span>{item.label}</span>
                      </div>
                      {isActive && <ChevronRight className={`w-3.5 h-3.5 ${tType === 'THEOLOGICAL' ? 'text-amber-400' : 'opacity-80'}`} />}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Tenant Status Footer Widget */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2 mt-auto">
            <div className="flex items-center justify-between text-xs text-slate-800 font-bold">
              <span>{tenant.name}</span>
              <span className="inline-flex items-center space-x-1 text-emerald-700 font-semibold text-[11px]">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>Active</span>
              </span>
            </div>
            <div className="text-[11px] text-slate-500 space-y-1">
              <div className="flex justify-between">
                <span>Academic Year:</span>
                <span className="font-mono text-slate-900">{selectedAcademicYear}</span>
              </div>
              <div className="flex justify-between">
                <span>Current Term:</span>
                <span className={`font-semibold ${tType === 'THEOLOGICAL' ? 'text-amber-800' : 'text-indigo-600'}`}>
                  {selectedAcademicTerm}
                </span>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-400">
              <span>{tType === 'THEOLOGICAL' ? 'Faculty of Divinity' : 'Multi-Tenant System'}</span>
              <span className="text-[9px] text-slate-400 font-mono">DAVETECH ERP</span>
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
                        const mobileActive = tType === 'THEOLOGICAL'
                          ? 'bg-slate-900 text-white font-bold border-l-4 border-amber-500'
                          : 'bg-indigo-600 text-white font-bold';

                        return (
                          <button
                            key={item.id}
                            onClick={() => {
                              setCurrentTab(item.id);
                              setIsMobileNavOpen(false);
                            }}
                            className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-medium ${
                              isActive
                                ? mobileActive
                                : 'text-slate-600 hover:bg-slate-100'
                            }`}
                            style={isActive && tenant.primaryColor && tType !== 'THEOLOGICAL' ? { backgroundColor: tenant.primaryColor } : undefined}
                          >
                            <Icon className={`w-4 h-4 ${isActive && tType === 'THEOLOGICAL' ? 'text-amber-400' : ''}`} />
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

