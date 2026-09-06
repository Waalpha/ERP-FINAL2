import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Building2,
  ChevronDown,
  LogOut,
  Sparkles,
  Check,
  PlusCircle,
  Bell,
  Search,
  Calendar,
  GraduationCap,
  AlertTriangle,
  FileText,
  CreditCard,
  User,
  ShoppingBag,
  BookOpen,
  X,
  Menu,
  Cloud,
  RefreshCw,
  Database
} from 'lucide-react';
import { SearchResultItem } from '../types';

interface HeaderProps {
  onOpenCreateTenant?: () => void;
  onOpenNewAdmission?: () => void;
  onOpenRecordPayment?: () => void;
  onNavigateTab?: (tabId: string) => void;
  onToggleMobileSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenCreateTenant,
  onOpenNewAdmission,
  onOpenRecordPayment,
  onNavigateTab,
  onToggleMobileSidebar
}) => {
  const {
    user,
    tenant,
    isPlatformMode,
    logout,
    allTenants,
    allPlatformUsers,
    switchUserPersona,
    switchTenantAsSuperAdmin,
    switchToPlatformMaster,
    needsAttentionItems,
    searchCurrentTenant,
    isSyncingFirestore,
    lastFirestoreSyncTime,
    firebaseProjectId,
    syncAllDataToFirestore
  } = useAuth();

  const [isTenantOpen, setIsTenantOpen] = useState(false);
  const [isPersonaOpen, setIsPersonaOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isAttentionOpen, setIsAttentionOpen] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  const handleManualSync = async () => {
    setSyncFeedback('Pushing records to Cloud Firestore...');
    const res = await syncAllDataToFirestore();
    if (res.success) {
      setSyncFeedback(`Successfully pushed ${res.count} records to Firestore (${firebaseProjectId})`);
    } else {
      setSyncFeedback(`Firestore sync error: ${res.error}`);
    }
    setTimeout(() => setSyncFeedback(null), 4000);
  };

  // Global Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

  // Handle Search Input Change
  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const results = searchCurrentTenant(searchQuery);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, searchCurrentTenant]);

  // Keyboard shortcut Ctrl+K / Cmd+K for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
        setTimeout(() => searchInputRef.current?.focus(), 100);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setIsAttentionOpen(false);
        setIsTenantOpen(false);
        setIsPersonaOpen(false);
        setIsUserMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const getRoleBadgeStyle = (role?: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'bg-purple-900 text-purple-200 border-purple-700';
      case 'TENANT_ADMIN':
        return 'bg-blue-900 text-blue-200 border-blue-700';
      case 'MANAGER':
        return 'bg-indigo-900 text-indigo-200 border-indigo-700';
      case 'ACCOUNTANT':
        return 'bg-emerald-900 text-emerald-200 border-emerald-700';
      case 'TEACHER':
        return 'bg-amber-900 text-amber-200 border-amber-700';
      case 'CASHIER':
        return 'bg-teal-900 text-teal-200 border-teal-700';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const getResultIcon = (type: SearchResultItem['type']) => {
    switch (type) {
      case 'STUDENT':
        return <GraduationCap className="h-4 w-4 text-indigo-400" />;
      case 'STAFF':
        return <User className="h-4 w-4 text-emerald-400" />;
      case 'INVOICE':
        return <FileText className="h-4 w-4 text-amber-400" />;
      case 'PAYMENT':
        return <CreditCard className="h-4 w-4 text-emerald-400" />;
      case 'PRODUCT':
        return <ShoppingBag className="h-4 w-4 text-purple-400" />;
      case 'COURSE':
        return <BookOpen className="h-4 w-4 text-cyan-400" />;
      default:
        return <Search className="h-4 w-4 text-slate-400" />;
    }
  };

  const handleSelectSearchResult = (item: SearchResultItem) => {
    setIsSearchOpen(false);
    setSearchQuery('');
    if (onNavigateTab) {
      onNavigateTab(item.route);
    }
  };

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40">
      <div className="px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          {/* Main DAVETECH Platform Brand & Tenant Switcher */}
          <div className="flex items-center space-x-2 sm:space-x-4 min-w-0">
            {/* Mobile Hamburger Drawer Trigger */}
            <button
              onClick={onToggleMobileSidebar}
              className="lg:hidden p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors flex-shrink-0"
              aria-label="Open mobile menu"
            >
              <Menu className="h-5 w-5 text-indigo-400" />
            </button>

            {/* Tenant Brand Display */}
            <div className="flex items-center space-x-2 sm:space-x-3 text-left">
              <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-indigo-600 flex items-center justify-center overflow-hidden shadow-md ring-1 ring-white/20">
                {tenant?.logoUrl ? (
                  <img src={tenant.logoUrl} alt={tenant.name} className="h-full w-full object-cover" />
                ) : (
                  <Building2 className="h-5 w-5 text-white" />
                )}
              </div>
              <div className="hidden md:block">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-base tracking-tight text-white">
                    {tenant?.name}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {tenant?.type}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {tenant?.subdomain}.davetech.co.ke
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Global Search Bar (Direct trigger) */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
            <button
              id="global-search-trigger"
              onClick={() => {
                setIsSearchOpen(true);
                setTimeout(() => searchInputRef.current?.focus(), 100);
              }}
              className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-400 hover:text-slate-200 text-xs transition-all"
            >
              <div className="flex items-center space-x-2">
                <Search className="h-3.5 w-3.5 text-slate-400" />
                <span>Search learners, invoices, products, staff...</span>
              </div>
              <kbd className="hidden lg:inline-block px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-[10px] text-slate-400 font-mono">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Quick Action Shortcuts & Notifications */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Mobile Search Button */}
            <button
              onClick={() => {
                setIsSearchOpen(true);
                setTimeout(() => searchInputRef.current?.focus(), 100);
              }}
              className="md:hidden p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 active:scale-95 transition-transform"
              title="Search"
            >
              <Search className="h-4 w-4" />
            </button>

            {/* Attention Alerts Bell with dynamic counter */}
            <div className="relative">
              <button
                id="attention-center-trigger"
                onClick={() => {
                  setIsAttentionOpen(!isAttentionOpen);
                  setIsTenantOpen(false);
                  setIsPersonaOpen(false);
                  setIsUserMenuOpen(false);
                }}
                className={`relative p-2 rounded-lg transition-all ${
                  needsAttentionItems.length > 0
                    ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                }`}
                title="Action Center & Attention Items"
              >
                <Bell className="h-4 w-4" />
                {needsAttentionItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-rose-500 text-white font-bold text-[9px] flex items-center justify-center animate-pulse">
                    {needsAttentionItems.length}
                  </span>
                )}
              </button>

              {isAttentionOpen && (
                <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] max-w-sm sm:w-96 bg-slate-900 rounded-xl shadow-2xl border border-slate-700 py-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between border-b border-slate-800">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="h-4 w-4 text-amber-400" />
                      <span>Today's Action Center</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {needsAttentionItems.length} items
                    </span>
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-800">
                    {needsAttentionItems.length === 0 ? (
                      <div className="p-6 text-center text-slate-400">
                        <Check className="h-8 w-8 text-emerald-400 mx-auto mb-2 opacity-80" />
                        <p className="text-xs font-semibold text-slate-300">All clear!</p>
                        <p className="text-[11px] text-slate-500 mt-1">
                          No pending critical alerts or overdue items require immediate action.
                        </p>
                      </div>
                    ) : (
                      needsAttentionItems.map((item) => (
                        <div key={item.id} className="p-3 hover:bg-slate-800/60 transition-colors">
                          <div className="flex items-start justify-between">
                            <span
                              className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded border ${
                                item.severity === 'CRITICAL'
                                  ? 'bg-rose-950 text-rose-300 border-rose-800'
                                  : item.severity === 'WARNING'
                                  ? 'bg-amber-950 text-amber-300 border-amber-800'
                                  : 'bg-indigo-950 text-indigo-300 border-indigo-800'
                              }`}
                            >
                              {item.category}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">
                              {item.severity}
                            </span>
                          </div>
                          <h4 className="text-xs font-semibold text-slate-100 mt-1.5">{item.title}</h4>
                          <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{item.description}</p>
                          {item.actionRoute && onNavigateTab && (
                            <button
                              onClick={() => {
                                setIsAttentionOpen(false);
                                onNavigateTab(item.actionRoute!);
                              }}
                              className="mt-2 text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 flex items-center space-x-1"
                            >
                              <span>{item.actionLabel || 'Take Action'}</span>
                              <span>→</span>
                            </button>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Cloud Firestore Live Push Button */}
            <div className="relative">
              <button
                id="cloud-firestore-sync-button"
                onClick={handleManualSync}
                disabled={isSyncingFirestore}
                className={`flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                  isSyncingFirestore
                    ? 'bg-indigo-950 text-indigo-300 border-indigo-700 animate-pulse'
                    : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                }`}
                title={`Push all tenant and user collections to Cloud Firestore (${firebaseProjectId})`}
              >
                <Cloud className={`h-3.5 w-3.5 ${isSyncingFirestore ? 'animate-spin text-indigo-400' : 'text-emerald-400'}`} />
                <span className="hidden sm:inline">
                  {isSyncingFirestore ? 'Pushing...' : 'Push to Firestore'}
                </span>
                {lastFirestoreSyncTime && !isSyncingFirestore && (
                  <span className="hidden md:inline text-[10px] text-emerald-400/70 font-mono">
                    ✓
                  </span>
                )}
              </button>

              {syncFeedback && (
                <div className="absolute right-0 mt-2 w-72 bg-slate-900 text-white rounded-xl shadow-2xl border border-slate-700 p-3 z-50 text-xs animate-in fade-in zoom-in-95 flex items-start space-x-2">
                  <Database className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-slate-200">Cloud Firestore Status</div>
                    <div className="text-slate-400 text-[11px] mt-0.5 leading-snug">{syncFeedback}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Persona Switcher */}
            <div className="relative">
              <button
                id="persona-switcher-button"
                onClick={() => {
                  setIsPersonaOpen(!isPersonaOpen);
                  setIsTenantOpen(false);
                  setIsUserMenuOpen(false);
                  setIsAttentionOpen(false);
                }}
                className="flex items-center space-x-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold transition-all"
                title="Test different user roles and permissions"
              >
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                <span className="hidden sm:inline">Role Simulator</span>
                <ChevronDown className="h-3 w-3" />
              </button>

              {isPersonaOpen && (
                <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] max-w-sm sm:w-80 bg-slate-900 rounded-xl shadow-2xl border border-slate-700 py-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 mb-1">
                    Role & Persona Simulator
                  </div>
                  
                  {/* DAVETECH Master Platform Users */}
                  <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-indigo-300 bg-indigo-950/40 border-b border-slate-800">
                    ⚡ DAVETECH Platform HQ (Master)
                  </div>
                  <div className="divide-y divide-slate-800/60">
                    {allPlatformUsers.filter(u => u.role === 'SUPER_ADMIN').map((u) => {
                      const isCurrent = u.uid === user?.uid;
                      return (
                        <button
                          key={u.uid}
                          onClick={() => {
                            switchUserPersona(u.uid);
                            setIsPersonaOpen(false);
                            if (onNavigateTab) onNavigateTab('super-admin-overview');
                          }}
                          className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-slate-800 transition-colors ${
                            isCurrent ? 'bg-indigo-950/40 border-l-2 border-indigo-500' : ''
                          }`}
                        >
                          <div className="min-w-0 pr-2">
                            <div className="text-xs font-semibold text-slate-100 truncate">{u.displayName}</div>
                            <div className="text-[10px] text-indigo-300 truncate">DAVETECH Main Platform Host</div>
                          </div>
                          <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded border flex-shrink-0 ${getRoleBadgeStyle(u.role)}`}>
                            MASTER ADMIN
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Hosted Tenant Client Users */}
                  <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-950/40 border-t border-b border-slate-800 mt-1">
                    🏢 Hosted Client Tenant Users
                  </div>
                  <div className="max-h-56 overflow-y-auto divide-y divide-slate-800/60">
                    {allPlatformUsers.filter(u => u.role !== 'SUPER_ADMIN').map((u) => {
                      const isCurrent = u.uid === user?.uid;
                      return (
                        <button
                          key={u.uid}
                          onClick={() => {
                            switchUserPersona(u.uid);
                            setIsPersonaOpen(false);
                          }}
                          className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-slate-800 transition-colors ${
                            isCurrent ? 'bg-amber-950/30' : ''
                          }`}
                        >
                          <div className="min-w-0 pr-2">
                            <div className="text-xs font-semibold text-slate-200 truncate">{u.displayName}</div>
                            <div className="text-[10px] text-slate-400 truncate">{u.tenantName || u.email}</div>
                          </div>
                          <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded border flex-shrink-0 ${getRoleBadgeStyle(u.role)}`}>
                            {u.role.replace('_', ' ')}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile */}
            {user ? (
              <div className="relative">
                <button
                  id="user-menu-button"
                  onClick={() => {
                    setIsUserMenuOpen(!isUserMenuOpen);
                    setIsTenantOpen(false);
                    setIsPersonaOpen(false);
                    setIsAttentionOpen(false);
                  }}
                  className="flex items-center space-x-2 p-1 rounded-full hover:bg-slate-800 transition-colors"
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName}
                      className="h-8 w-8 rounded-full object-cover ring-2 ring-indigo-500/50"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-600 to-emerald-500 text-white flex items-center justify-center text-xs font-bold ring-2 ring-indigo-500/40">
                      {user.displayName.charAt(0)}
                    </div>
                  )}
                  <div className="hidden md:block text-left pr-1">
                    <div className="text-xs font-semibold text-slate-200 leading-tight truncate max-w-[120px]">
                      {user.displayName.split(' ')[0]}
                    </div>
                    <span className={`text-[9px] uppercase font-bold px-1.5 py-0.2 rounded border inline-block ${getRoleBadgeStyle(user.role)}`}>
                      {user.role.replace('_', ' ')}
                    </span>
                  </div>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400 hidden sm:block" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-slate-900 rounded-xl shadow-2xl border border-slate-700 py-2 z-50 animate-in fade-in zoom-in-95">
                    <div className="px-4 py-3 border-b border-slate-800">
                      <p className="text-xs font-semibold text-white truncate">{user.displayName}</p>
                      <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${getRoleBadgeStyle(user.role)}`}>
                          {user.role}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">UID: {user.uid.slice(0, 8)}</span>
                      </div>
                    </div>

                    <div className="p-2">
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          logout();
                        }}
                        className="w-full px-3 py-2 text-left text-xs font-semibold text-rose-400 hover:bg-rose-950/30 rounded-lg flex items-center space-x-2 transition-colors"
                      >
                        <LogOut className="h-4 w-4 text-rose-400" />
                        <span>Sign Out of Platform</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Global Search Modal Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-start justify-center pt-20 px-4 animate-in fade-in">
          <div className="w-full max-w-2xl bg-slate-900 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden">
            <div className="flex items-center px-4 py-3 border-b border-slate-800">
              <Search className="h-5 w-5 text-indigo-400 mr-3" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search learners, invoices, staff, POS products, courses, admissions..."
                className="flex-1 bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none"
              />
              <button
                onClick={() => setIsSearchOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto divide-y divide-slate-800/80">
              {searchQuery.trim().length < 2 ? (
                <div className="p-8 text-center text-slate-500 text-xs">
                  Type at least 2 characters to search across {tenant?.name}
                </div>
              ) : searchResults.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  No matching records found for "{searchQuery}"
                </div>
              ) : (
                searchResults.map((result) => (
                  <button
                    key={result.id}
                    onClick={() => handleSelectSearchResult(result)}
                    className="w-full px-4 py-3 text-left hover:bg-slate-800 flex items-center justify-between transition-colors group"
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className="h-8 w-8 rounded-lg bg-slate-800 group-hover:bg-slate-700 border border-slate-700 flex items-center justify-center flex-shrink-0">
                        {getResultIcon(result.type)}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-slate-100 truncate">{result.title}</div>
                        <div className="text-[11px] text-slate-400 truncate">{result.subtitle}</div>
                      </div>
                    </div>
                    <span className="text-[9px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 flex-shrink-0">
                      {result.type}
                    </span>
                  </button>
                ))
              )}
            </div>

            <div className="px-4 py-2 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
              <span>Press <kbd className="font-mono text-slate-400">ESC</kbd> to exit</span>
              <span>Isolated to current tenant workspace</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
