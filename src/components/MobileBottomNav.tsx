import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Building,
  Search,
  Bell,
  Menu,
  Sparkles,
  GraduationCap,
  ShoppingCart,
  Stethoscope,
  Building2
} from 'lucide-react';

interface MobileBottomNavProps {
  currentTab: string;
  onSelectTab: (tabId: string) => void;
  onToggleSidebar: () => void;
  onOpenSearch: () => void;
  onOpenScopeModal?: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentTab,
  onSelectTab,
  onToggleSidebar,
  onOpenSearch
}) => {
  const { tenant, isPlatformMode, user, needsAttentionItems } = useAuth();
  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

  // Determine main home route for current tenant/platform mode
  const getHomeRoute = () => {
    if (isPlatformMode || isSuperAdmin && currentTab.startsWith('super-admin-')) return 'super-admin-overview';
    if (tenant?.type === 'PRIMARY_SCHOOL' || tenant?.type === 'SECONDARY_SCHOOL') return 'school-overview';
    if (tenant?.type === 'COLLEGE' || tenant?.type === 'UNIVERSITY') return 'college-overview';
    if (tenant?.type === 'RETAIL' || tenant?.type === 'BUSINESS') return 'retail-pos';
    if (tenant?.type === 'HOSPITAL') return 'hospital-overview';
    return 'school-overview';
  };

  const isHomeActive = currentTab === getHomeRoute();

  const getTenantIcon = () => {
    if (isPlatformMode) return <Sparkles className="h-5 w-5" />;
    if (tenant?.type === 'PRIMARY_SCHOOL' || tenant?.type === 'SECONDARY_SCHOOL') return <GraduationCap className="h-5 w-5" />;
    if (tenant?.type === 'RETAIL' || tenant?.type === 'BUSINESS') return <ShoppingCart className="h-5 w-5" />;
    if (tenant?.type === 'HOSPITAL') return <Stethoscope className="h-5 w-5" />;
    if (tenant?.type === 'COLLEGE' || tenant?.type === 'UNIVERSITY') return <Building2 className="h-5 w-5" />;
    return <Building className="h-5 w-5" />;
  };

  return (
    <nav
      id="mobile-bottom-navigation"
      aria-label="Mobile Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 text-white lg:hidden pb-safe shadow-2xl"
    >
      <div className="grid grid-cols-5 h-16 items-center px-1">
        {/* 1. Home / Main Hub */}
        <button
          onClick={() => onSelectTab(getHomeRoute())}
          className={`flex flex-col items-center justify-center py-1 transition-colors group ${
            isHomeActive ? 'text-indigo-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className={`p-1 rounded-xl transition-all ${isHomeActive ? 'bg-indigo-500/20 ring-1 ring-indigo-500/40' : ''}`}>
            <LayoutDashboard className="h-5 w-5" />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-[58px]">
            {isPlatformMode ? 'HQ Hub' : 'Home'}
          </span>
        </button>

        {/* 2. Super Admin Fleet or Primary Action */}
        <button
          onClick={() => {
            if (isPlatformMode || isSuperAdmin) {
              onSelectTab('super-admin-tenants');
            } else if (tenant?.type === 'PRIMARY_SCHOOL') {
              onSelectTab('school-students');
            } else if (tenant?.type === 'RETAIL') {
              onSelectTab('retail-inventory');
            } else if (tenant?.type === 'HOSPITAL') {
              onSelectTab('hospital-patients');
            } else if (tenant?.type === 'COLLEGE') {
              onSelectTab('college-students');
            } else {
              onSelectTab(getHomeRoute());
            }
          }}
          className={`flex flex-col items-center justify-center py-1 transition-colors ${
            currentTab === 'super-admin-tenants' || currentTab.includes('-students') || currentTab.includes('-inventory') || currentTab.includes('-patients')
              ? 'text-indigo-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="p-1 rounded-xl">
            {getTenantIcon()}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-[58px]">
            {isPlatformMode ? 'Fleet' : tenant?.type === 'RETAIL' ? 'Inventory' : 'Records'}
          </span>
        </button>

        {/* 3. Center Quick Search Button */}
        <div className="flex flex-col items-center justify-center -mt-4">
          <button
            onClick={onOpenSearch}
            className="h-12 w-12 rounded-full bg-gradient-to-tr from-indigo-600 to-emerald-500 text-white shadow-lg shadow-indigo-600/40 flex items-center justify-center ring-4 ring-slate-900 active:scale-95 transition-transform"
            aria-label="Global Search"
          >
            <Search className="h-5 w-5" />
          </button>
          <span className="text-[9px] text-slate-400 mt-1 font-medium">Search</span>
        </div>

        {/* 4. Attention Center / Notifications */}
        <button
          onClick={() => {
            if (isPlatformMode) {
              onSelectTab('super-admin-audit');
            } else if (tenant?.type === 'PRIMARY_SCHOOL') {
              onSelectTab('school-fees');
            } else if (tenant?.type === 'RETAIL') {
              onSelectTab('retail-sales-history');
            } else if (tenant?.type === 'HOSPITAL') {
              onSelectTab('hospital-billing');
            } else {
              onSelectTab(getHomeRoute());
            }
          }}
          className={`relative flex flex-col items-center justify-center py-1 transition-colors ${
            currentTab.includes('-fees') || currentTab.includes('-billing') || currentTab.includes('-audit') || currentTab.includes('-sales-history')
              ? 'text-indigo-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="relative p-1 rounded-xl">
            <Bell className="h-5 w-5" />
            {needsAttentionItems.length > 0 && (
              <span className="absolute 0 top-0 right-0 h-3.5 w-3.5 rounded-full bg-rose-500 text-white text-[8px] font-bold flex items-center justify-center">
                {needsAttentionItems.length}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-[58px]">
            {isPlatformMode ? 'Audit' : 'Billing'}
          </span>
        </button>

        {/* 5. Mobile Drawer Menu Toggle */}
        <button
          onClick={onToggleSidebar}
          className="flex flex-col items-center justify-center py-1 text-slate-400 hover:text-slate-200 active:scale-95 transition-all"
          aria-label="Open Full Menu"
        >
          <div className="p-1 rounded-xl bg-slate-800/80 border border-slate-700">
            <Menu className="h-5 w-5 text-indigo-400" />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight text-slate-300 font-semibold">Menu</span>
        </button>
      </div>
    </nav>
  );
};
