import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { TenantRouter } from './TenantRouter';
import { Tenant, AppNotification, NotificationCategory } from '../types';
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
  Clock,
  Plus,
  Trash2,
  CheckCheck,
  AlertTriangle,
  Send,
  Info
} from 'lucide-react';
import { navigateToPlatform, MAIN_DOMAIN_SUFFIX } from '../services/TenantResolver';
import { getNavigationForTenant, normalizeTenantType, NavSection } from '../services/ModuleRegistry';
import { AddNotificationModal } from '../components/AddNotificationModal';
import { collection, doc, setDoc, deleteDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db, cleanFirestoreData } from '../firebase/config';

function formatRelativeTime(dateStr: string): string {
  try {
    const time = new Date(dateStr).getTime();
    if (isNaN(time)) return 'Recently';
    const diff = Math.floor((Date.now() - time) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  } catch {
    return 'Recently';
  }
}

const getDefaultNotifications = (tenant: Tenant): AppNotification[] => {
  const tType = normalizeTenantType(tenant.type);
  if (tType === 'THEOLOGICAL') {
    return [
      {
        id: 'notif_theo_1',
        tenantId: tenant.id,
        title: 'Practicum Log Submitted',
        message: 'Samuel Mwangi logged 12 hrs at ACK Cathedral Nyeri for review.',
        category: 'ACADEMIC',
        priority: 'NORMAL',
        targetAudience: 'STAFF',
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        isRead: false,
        authorName: 'Academic Registrar',
        authorRole: 'STAFF'
      },
      {
        id: 'notif_theo_2',
        tenantId: tenant.id,
        title: 'Diocesan Bursary Received',
        message: 'KES 45,000 recorded from Diocese of Mt. Kenya Central for student aid.',
        category: 'FINANCIAL',
        priority: 'NORMAL',
        targetAudience: 'MANAGEMENT',
        timestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
        isRead: false,
        authorName: 'Finance Bursar',
        authorRole: 'ACCOUNTANT'
      },
      {
        id: 'notif_theo_3',
        tenantId: tenant.id,
        title: 'Faculty Chapel Schedule',
        message: 'Wednesday morning symposium and prayer timetable published in hall.',
        category: 'ANNOUNCEMENT',
        priority: 'LOW',
        targetAudience: 'ALL',
        timestamp: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
        isRead: true,
        authorName: 'Chaplaincy',
        authorRole: 'STAFF'
      }
    ];
  }

  if (tType === 'PRIMARY_SCHOOL' || tType === 'SECONDARY_SCHOOL') {
    return [
      {
        id: 'notif_school_1',
        tenantId: tenant.id,
        title: 'CBC Assessment Scores Due',
        message: 'All Grade 7 & 8 formative assessment scores must be submitted by Friday.',
        category: 'ACADEMIC',
        priority: 'HIGH',
        targetAudience: 'STAFF',
        timestamp: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
        isRead: false,
        authorName: 'Deputy Head Academic',
        authorRole: 'TENANT_ADMIN'
      },
      {
        id: 'notif_school_2',
        tenantId: tenant.id,
        title: 'M-Pesa Fee Batch Reconciled',
        message: '24 automated fee payments totaling KES 148,000 verified against student accounts.',
        category: 'FINANCIAL',
        priority: 'NORMAL',
        targetAudience: 'MANAGEMENT',
        timestamp: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
        isRead: false,
        authorName: 'Accounts Office',
        authorRole: 'ACCOUNTANT'
      },
      {
        id: 'notif_school_3',
        tenantId: tenant.id,
        title: 'Inter-House Sports Gala',
        message: 'Annual Athletics & Sports Day scheduled for next Saturday. Parents invited.',
        category: 'ANNOUNCEMENT',
        priority: 'LOW',
        targetAudience: 'ALL',
        timestamp: new Date(Date.now() - 22 * 3600 * 1000).toISOString(),
        isRead: true,
        authorName: 'Administration',
        authorRole: 'STAFF'
      }
    ];
  }

  if (tType === 'HOSPITAL') {
    return [
      {
        id: 'notif_hosp_1',
        tenantId: tenant.id,
        title: 'Emergency Triage Alert',
        message: '3 priority trauma consultations queued in Outpatient Unit 2.',
        category: 'ALERT',
        priority: 'URGENT',
        targetAudience: 'STAFF',
        timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
        isRead: false,
        authorName: 'Nursing Station',
        authorRole: 'STAFF'
      },
      {
        id: 'notif_hosp_2',
        tenantId: tenant.id,
        title: 'Pharmacy Restock Completed',
        message: 'Amoxicillin and IV fluids stock replenished. 99.4% availability recorded.',
        category: 'STOCK',
        priority: 'NORMAL',
        targetAudience: 'ALL',
        timestamp: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
        isRead: false,
        authorName: 'Chief Pharmacist',
        authorRole: 'STAFF'
      },
      {
        id: 'notif_hosp_3',
        tenantId: tenant.id,
        title: 'NHIF / SHA Batch Clearance',
        message: 'Weekly electronic claim batch submitted and approved for payout.',
        category: 'FINANCIAL',
        priority: 'NORMAL',
        targetAudience: 'MANAGEMENT',
        timestamp: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),
        isRead: true,
        authorName: 'Billing Desk',
        authorRole: 'ACCOUNTANT'
      }
    ];
  }

  if (tType === 'BUSINESS' || tType === 'RETAIL') {
    return [
      {
        id: 'notif_ret_1',
        tenantId: tenant.id,
        title: 'Daily Sales Milestone Reached',
        message: 'Cashier Till #1 exceeded target with KES 85,000 turnover today.',
        category: 'FINANCIAL',
        priority: 'NORMAL',
        targetAudience: 'MANAGEMENT',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        isRead: false,
        authorName: 'Store Supervisor',
        authorRole: 'MANAGER'
      },
      {
        id: 'notif_ret_2',
        tenantId: tenant.id,
        title: 'Low Stock Alert Triggered',
        message: '3 inventory SKUs dropped below reorder threshold. Reorder list ready.',
        category: 'STOCK',
        priority: 'HIGH',
        targetAudience: 'STAFF',
        timestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
        isRead: false,
        authorName: 'Inventory System',
        authorRole: 'SYSTEM'
      },
      {
        id: 'notif_ret_3',
        tenantId: tenant.id,
        title: 'Weekend Promotion Launched',
        message: 'Promotional discount tags active on selected beverage lines.',
        category: 'ANNOUNCEMENT',
        priority: 'LOW',
        targetAudience: 'ALL',
        timestamp: new Date(Date.now() - 26 * 3600 * 1000).toISOString(),
        isRead: true,
        authorName: 'Retail Operations',
        authorRole: 'STAFF'
      }
    ];
  }

  // College / University fallback
  return [
    {
      id: 'notif_univ_1',
      tenantId: tenant.id,
      title: 'Academic Senate Clearance',
      message: 'Semester 1 provisional examination transcripts cleared for student portal access.',
      category: 'ACADEMIC',
      priority: 'HIGH',
      targetAudience: 'ALL',
      timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
      isRead: false,
      authorName: 'Registrar Academic',
      authorRole: 'TENANT_ADMIN'
    },
    {
      id: 'notif_univ_2',
      tenantId: tenant.id,
      title: 'Fee Payment Deadline Notice',
      message: 'Finance department deadline for exam card issuance is next Wednesday.',
      category: 'FINANCIAL',
      priority: 'NORMAL',
      targetAudience: 'ALL',
      timestamp: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
      isRead: false,
      authorName: 'Finance Directorate',
      authorRole: 'ACCOUNTANT'
    },
    {
      id: 'notif_univ_3',
      tenantId: tenant.id,
      title: 'Campus Network Maintenance',
      message: 'Scheduled fiber backbone upgrade completed with 99.99% cloud connectivity.',
      category: 'OPERATIONS',
      priority: 'LOW',
      targetAudience: 'STAFF',
      timestamp: new Date(Date.now() - 20 * 3600 * 1000).toISOString(),
      isRead: true,
      authorName: 'ICT Services',
      authorRole: 'STAFF'
    }
  ];
};

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
    if (tType === 'BUSINESS') {
      return 'commerce-pos';
    }
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

  // Dynamic notifications state & Firestore sync
  const [notifications, setNotifications] = useState<AppNotification[]>(() => getDefaultNotifications(tenant));
  const [isAddNotificationModalOpen, setIsAddNotificationModalOpen] = useState(false);
  const [notificationFilter, setNotificationFilter] = useState<'ALL' | 'UNREAD' | 'ALERTS'>('ALL');
  const [toast, setToast] = useState<{ id: string; type: 'success' | 'info' | 'warning'; title: string; message: string } | null>(null);

  // Firestore synchronization for tenant notifications
  useEffect(() => {
    if (!tenant?.id) return;

    try {
      const notifCol = collection(db, 'tenants', tenant.id, 'notifications');
      const q = query(notifCol, orderBy('timestamp', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const loaded: AppNotification[] = snapshot.docs.map((d) => d.data() as AppNotification);
          setNotifications(loaded);
        } else {
          // Seed initial default notifications for this tenant
          const defaults = getDefaultNotifications(tenant);
          setNotifications(defaults);
          defaults.forEach(async (n) => {
            try {
              await setDoc(doc(db, 'tenants', tenant.id, 'notifications', n.id), cleanFirestoreData(n));
            } catch {}
          });
        }
      }, (err) => {
        console.warn('Firestore notifications listener fallback to local state:', err);
      });

      return () => unsubscribe();
    } catch (err) {
      console.warn('Unable to subscribe to Firestore notifications:', err);
    }
  }, [tenant?.id]);

  // Auto-dismiss toast after 4 seconds
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  // Notification action handlers
  const handleAddNotification = async (newNotifData: Omit<AppNotification, 'id' | 'timestamp' | 'isRead'>) => {
    const id = `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newNotif: AppNotification = {
      ...newNotifData,
      id,
      timestamp: new Date().toISOString(),
      isRead: false
    };

    setNotifications((prev) => [newNotif, ...prev]);

    setToast({
      id,
      type: 'success',
      title: 'Notification Broadcast',
      message: `"${newNotif.title}" is now active for ${newNotif.targetAudience.toLowerCase()} members.`
    });

    try {
      await setDoc(doc(db, 'tenants', tenant.id, 'notifications', id), cleanFirestoreData(newNotif));
    } catch (err) {
      console.error('Failed to persist notification:', err);
    }
  };

  const handleToggleRead = async (notifId: string) => {
    const target = notifications.find((n) => n.id === notifId);
    if (!target) return;
    const updatedIsRead = !target.isRead;

    setNotifications((prev) =>
      prev.map((n) => (n.id === notifId ? { ...n, isRead: updatedIsRead } : n))
    );

    try {
      await setDoc(doc(db, 'tenants', tenant.id, 'notifications', notifId), {
        isRead: updatedIsRead
      }, { merge: true });
    } catch {}
  };

  const handleDeleteNotification = async (notifId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications((prev) => prev.filter((n) => n.id !== notifId));

    setToast({
      id: `toast_del_${Date.now()}`,
      type: 'info',
      title: 'Notification Dismissed',
      message: 'Alert removed from list.'
    });

    try {
      await deleteDoc(doc(db, 'tenants', tenant.id, 'notifications', notifId));
    } catch {}
  };

  const handleMarkAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));

    setToast({
      id: `toast_readall_${Date.now()}`,
      type: 'success',
      title: 'All Alerts Marked as Read',
      message: 'Your notification list is up to date.'
    });

    try {
      notifications.forEach(async (n) => {
        if (!n.isRead) {
          await setDoc(doc(db, 'tenants', tenant.id, 'notifications', n.id), { isRead: true }, { merge: true });
        }
      });
    } catch {}
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const filteredNotifications = notifications.filter((n) => {
    if (notificationFilter === 'UNREAD') return !n.isRead;
    if (notificationFilter === 'ALERTS') return n.category === 'ALERT' || n.priority === 'HIGH' || n.priority === 'URGENT';
    return true;
  });

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
                title={`${tenant.name} Notifications & Alerts`}
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-amber-400 text-slate-950 font-extrabold text-[10px] rounded-full flex items-center justify-center ring-2 ring-[#0B2A4A] shadow-xs animate-pulse">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {isNotificationsOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsNotificationsOpen(false)}
                  />
                  <div className="absolute right-0 top-11 w-84 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-2xl p-3.5 z-50 space-y-3 text-slate-900 animate-in fade-in zoom-in-95 duration-150">
                    
                    {/* Header */}
                    <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-slate-900">Institutional Alerts</span>
                        {unreadCount > 0 ? (
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                            {unreadCount} New
                          </span>
                        ) : (
                          <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            All Caught Up
                          </span>
                        )}
                      </div>

                      {/* Add Notification Trigger Button */}
                      <button
                        onClick={() => {
                          setIsNotificationsOpen(false);
                          setIsAddNotificationModalOpen(true);
                        }}
                        className="flex items-center space-x-1 px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] rounded-lg shadow-xs transition"
                        title="Broadcast new notification to this tenant"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Notification</span>
                      </button>
                    </div>

                    {/* Filter Pills */}
                    <div className="flex items-center space-x-1.5 text-[11px]">
                      <button
                        onClick={() => setNotificationFilter('ALL')}
                        className={`px-2.5 py-1 rounded-lg font-medium transition ${
                          notificationFilter === 'ALL'
                            ? 'bg-slate-900 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        All ({notifications.length})
                      </button>
                      <button
                        onClick={() => setNotificationFilter('UNREAD')}
                        className={`px-2.5 py-1 rounded-lg font-medium transition ${
                          notificationFilter === 'UNREAD'
                            ? 'bg-slate-900 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        Unread ({unreadCount})
                      </button>
                      <button
                        onClick={() => setNotificationFilter('ALERTS')}
                        className={`px-2.5 py-1 rounded-lg font-medium transition ${
                          notificationFilter === 'ALERTS'
                            ? 'bg-slate-900 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        Urgent / Alerts
                      </button>
                    </div>

                    {/* Notifications List */}
                    <div className="space-y-2 max-h-76 overflow-y-auto pr-0.5">
                      {filteredNotifications.length === 0 ? (
                        <div className="py-8 text-center text-slate-400 space-y-2">
                          <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto opacity-70" />
                          <p className="text-xs font-semibold text-slate-600">No alerts in this view</p>
                          <p className="text-[11px] text-slate-400">
                            {notificationFilter === 'UNREAD'
                              ? 'You have read all pending notifications.'
                              : 'Create a notification to broadcast an update.'}
                          </p>
                          <button
                            onClick={() => {
                              setIsNotificationsOpen(false);
                              setIsAddNotificationModalOpen(true);
                            }}
                            className="mt-2 text-xs font-bold text-indigo-600 hover:text-indigo-700 underline"
                          >
                            + Add a Notification
                          </button>
                        </div>
                      ) : (
                        filteredNotifications.map((notif) => {
                          const isUrgent = notif.priority === 'URGENT' || notif.priority === 'HIGH';
                          const isAlert = notif.category === 'ALERT';

                          return (
                            <div
                              key={notif.id}
                              onClick={() => handleToggleRead(notif.id)}
                              className={`p-2.5 rounded-xl border transition cursor-pointer relative group ${
                                !notif.isRead
                                  ? 'bg-indigo-50/60 border-indigo-100 hover:bg-indigo-50'
                                  : 'bg-slate-50 border-slate-100 hover:bg-slate-100'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex items-center space-x-1.5 flex-wrap">
                                  <span
                                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider ${
                                      isAlert || notif.priority === 'URGENT'
                                        ? 'bg-rose-100 text-rose-700 border-rose-200'
                                        : notif.category === 'ACADEMIC'
                                        ? 'bg-blue-100 text-blue-700 border-blue-200'
                                        : notif.category === 'FINANCIAL'
                                        ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                                        : notif.category === 'STOCK'
                                        ? 'bg-amber-100 text-amber-700 border-amber-200'
                                        : 'bg-slate-200 text-slate-700 border-slate-300'
                                    }`}
                                  >
                                    {notif.category}
                                  </span>

                                  {isUrgent && (
                                    <span className="text-[9px] font-extrabold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200 flex items-center gap-0.5">
                                      <AlertTriangle className="w-2.5 h-2.5" />
                                      {notif.priority}
                                    </span>
                                  )}

                                  <span className="text-[9px] text-slate-400 font-medium">
                                    • For: {notif.targetAudience}
                                  </span>
                                </div>

                                <div className="flex items-center space-x-1 flex-shrink-0">
                                  {!notif.isRead && (
                                    <span className="w-2 h-2 rounded-full bg-indigo-600" title="Unread" />
                                  )}
                                  <button
                                    onClick={(e) => handleDeleteNotification(notif.id, e)}
                                    className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-600 p-1 rounded transition"
                                    title="Dismiss notification"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>

                              <div className="font-semibold text-xs text-slate-800 mt-1">
                                {notif.title}
                              </div>
                              <div className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                                {notif.message}
                              </div>

                              <div className="text-[9px] text-slate-400 mt-1.5 flex items-center justify-between">
                                <span className="flex items-center space-x-1">
                                  <Clock className="w-3 h-3 text-slate-400" />
                                  <span>{formatRelativeTime(notif.timestamp)}</span>
                                </span>
                                {notif.authorName && (
                                  <span className="truncate max-w-[140px]">
                                    By {notif.authorName}
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      {unreadCount > 0 ? (
                        <button
                          onClick={handleMarkAllAsRead}
                          className="text-[11px] font-medium text-slate-500 hover:text-slate-800 flex items-center space-x-1 transition"
                        >
                          <CheckCheck className="w-3.5 h-3.5" />
                          <span>Mark all as read</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400">All notifications seen</span>
                      )}

                      <button
                        onClick={() => {
                          setIsNotificationsOpen(false);
                          setIsAddNotificationModalOpen(true);
                        }}
                        className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 flex items-center space-x-1 transition"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Compose</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Direct Cashier POS & Stock Launch Button */}
            {(tType === 'BUSINESS' || tenant.modules?.includes('POS_CASHIER') || tenant.modules?.includes('RETAIL_POS')) && (
              <button
                onClick={() => setCurrentTab('commerce-pos')}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs rounded-xl shadow-xs border border-amber-300 transition duration-150"
                title="Launch Simple Cashier POS & Stock Terminal"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-slate-950" />
                <span className="hidden sm:inline">Cashier POS</span>
              </button>
            )}

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

      {/* Add Notification Modal */}
      <AddNotificationModal
        isOpen={isAddNotificationModalOpen}
        onClose={() => setIsAddNotificationModalOpen(false)}
        onAddNotification={handleAddNotification}
        tenant={tenant}
        authorName={user?.displayName || 'Administrator'}
        authorRole={user?.role || 'STAFF'}
      />

      {/* Real-Time Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 max-w-sm w-full bg-slate-900 text-white rounded-2xl p-4 shadow-2xl border border-slate-700 flex items-start space-x-3 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div className="flex-shrink-0 mt-0.5">
            {toast.type === 'success' && (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            )}
            {toast.type === 'info' && (
              <Info className="w-5 h-5 text-blue-400" />
            )}
            {toast.type === 'warning' && (
              <AlertTriangle className="w-5 h-5 text-amber-400" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-slate-100 flex items-center justify-between">
              <span>{toast.title}</span>
              <button
                onClick={() => setToast(null)}
                className="text-slate-400 hover:text-white p-0.5 rounded transition"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="text-[11px] text-slate-300 mt-0.5 leading-snug">
              {toast.message}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

