import { Tenant } from '../types';
import { ComponentType } from 'react';
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
  CheckCircle2,
  Shield,
  Layers,
  Sparkles,
  BookA,
  Library,
  BedDouble,
  Receipt,
  Award,
  UserCheck,
  Globe
} from 'lucide-react';

export interface NavItem {
  id: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
}

export interface NavSection {
  title?: string;
  items: NavItem[];
}

/**
 * Normalizes tenant type variants to standard categories.
 */
export function normalizeTenantType(type: string): string {
  const t = (type || '').toUpperCase();
  if (t === 'PRIMARY_SCHOOL' || t === 'SECONDARY_SCHOOL' || t === 'SCHOOL') return 'SCHOOL';
  if (t === 'COLLEGE' || t === 'TVET' || t === 'UNIVERSITY') return 'COLLEGE';
  if (t === 'THEOLOGICAL' || t === 'THEOLOGY_SEMINARY') return 'THEOLOGICAL';
  if (t === 'HOSPITAL') return 'HOSPITAL';
  if (t === 'BUSINESS' || t === 'WHOLESALE' || t === 'RETAIL' || t === 'POS') return 'BUSINESS';
  if (t === 'CHAMA') return 'CHAMA';
  return 'SCHOOL';
}

/**
 * Central Module & Navigation Registry ensuring strict tenant-type module isolation.
 */
export function getNavigationForTenant(tenant: Tenant): NavSection[] {
  const tType = normalizeTenantType(tenant.type);

  switch (tType) {
    case 'COLLEGE':
      return [
        {
          title: 'ACADEMICS',
          items: [
            { id: 'college-overview', label: 'Dashboard', icon: GraduationCap },
            { id: 'college-students', label: 'Students & Admissions', icon: Users },
            { id: 'college-departments', label: 'Departments & Faculties', icon: Building2 },
            { id: 'college-courses', label: 'Courses & Programs', icon: BookA },
            { id: 'college-classes', label: 'Classes & Units', icon: BookOpen },
            { id: 'college-attendance', label: 'Attendance', icon: Calendar },
            { id: 'college-exams', label: 'Exams & Results', icon: Award }
          ]
        },
        {
          title: 'FINANCE',
          items: [
            { id: 'college-fees', label: 'Fees & Finance', icon: Receipt },
            { id: 'college-payments', label: 'Payments', icon: CreditCard },
            { id: 'college-invoices', label: 'Invoices', icon: Receipt },
            { id: 'college-financial-reports', label: 'Financial Reports', icon: FileText }
          ]
        },
        {
          title: 'CAMPUS',
          items: [
            { id: 'college-library', label: 'Library', icon: Library },
            { id: 'college-hostel', label: 'Hostel & Housing', icon: BedDouble },
            { id: 'college-sms', label: 'Communication / SMS', icon: Bell }
          ]
        },
        {
          title: 'PEOPLE',
          items: [
            { id: 'college-staff', label: 'Staff & Faculty', icon: UserCheck },
            { id: 'college-users', label: 'Users & Roles', icon: Shield }
          ]
        },
        {
          title: 'REPORTS',
          items: [
            { id: 'college-reports', label: 'Academic Reports', icon: FileText }
          ]
        },
        {
          title: 'ADMINISTRATION',
          items: [
            { id: 'staff-directory', label: 'Staff Directory', icon: Users },
            { id: 'tenant-website-cms', label: 'Website / CMS', icon: Globe },
            { id: 'system-administration', label: 'System Administration', icon: Shield },
            { id: 'college-settings', label: 'College Settings', icon: Settings }
          ]
        }
      ];

    case 'THEOLOGICAL':
      return [
        {
          title: 'SEMINARY CORE',
          items: [
            { id: 'theology-overview', label: 'Seminary Dashboard', icon: BookOpen },
            { id: 'theology-programs', label: 'Degree Programs & Units', icon: BookA },
            { id: 'theology-students', label: 'Divinity Students', icon: Users },
            { id: 'theology-practicum', label: 'Ministry Practicum Logs', icon: Sparkles },
            { id: 'theology-library', label: 'Theological Library', icon: Library },
            { id: 'theology-fees', label: 'Invoicing & Tithing', icon: Receipt },
            { id: 'staff-directory', label: 'Faculty & Staff Directory', icon: Users },
            { id: 'tenant-website-cms', label: 'Website / CMS', icon: Globe },
            { id: 'system-administration', label: 'System Administration', icon: Shield },
            { id: 'theology-reports', label: 'Seminary Reports', icon: FileText },
            { id: 'theology-sms', label: 'Communication / SMS', icon: Bell },
            { id: 'theology-settings', label: 'Seminary Settings', icon: Settings }
          ]
        }
      ];

    case 'BUSINESS':
      return [
        {
          title: 'COMMERCE OPERATIONS',
          items: [
            { id: 'commerce-retail', label: 'Retail', icon: ShoppingBag },
            { id: 'commerce-wholesale', label: 'Wholesale', icon: Receipt },
            { id: 'commerce-pos', label: 'POS Terminal', icon: CreditCard },
            { id: 'commerce-inventory', label: 'Inventory', icon: Layers },
            { id: 'staff-directory', label: 'Staff Directory', icon: Users },
            { id: 'tenant-website-cms', label: 'Website / CMS', icon: Globe },
            { id: 'system-administration', label: 'System Administration', icon: Shield },
            { id: 'retail-settings', label: 'Store Settings', icon: Settings }
          ]
        }
      ];

    case 'HOSPITAL':
      return [
        {
          title: 'CLINICAL SERVICES',
          items: [
            { id: 'hospital-overview', label: 'Clinical Dashboard', icon: HeartPulse },
            { id: 'hospital-patients', label: 'Patients & Admissions', icon: Users },
            { id: 'hospital-consultations', label: 'Doctor Consultations', icon: UserCheck },
            { id: 'hospital-pharmacy', label: 'Pharmacy & Dispensing', icon: Layers },
            { id: 'hospital-billing', label: 'Billing & Invoices', icon: Receipt },
            { id: 'staff-directory', label: 'Staff & Personnel', icon: Users },
            { id: 'tenant-website-cms', label: 'Website / CMS', icon: Globe },
            { id: 'system-administration', label: 'System Administration', icon: Shield },
            { id: 'hospital-settings', label: 'Hospital Settings', icon: Settings }
          ]
        }
      ];

    case 'SCHOOL':
    default:
      return [
        {
          title: 'ACADEMICS & LEARNERS',
          items: [
            { id: 'school-overview', label: 'Overview / Dashboard', icon: School },
            { id: 'school-students', label: 'Learners & Admissions', icon: Users },
            { id: 'school-cbc', label: 'CBC Academics & Strands', icon: BookOpen },
            { id: 'school-assessments', label: 'Formative Assessments', icon: CheckCircle2 },
            { id: 'school-classes', label: 'Classes & Streams', icon: Building2 },
            { id: 'school-timetable', label: 'Timetable & Schedule', icon: Calendar },
            { id: 'school-assignments', label: 'Homework & Tasks', icon: BookA }
          ]
        },
        {
          title: 'FINANCE & OPERATIONS',
          items: [
            { id: 'school-fees', label: 'Fee Structure & Receipts', icon: CreditCard },
            { id: 'school-attendance', label: 'Attendance Tracking', icon: Calendar },
            { id: 'staff-directory', label: 'Staff Directory', icon: Users },
            { id: 'school-discipline', label: 'Discipline & Pastoral', icon: Shield },
            { id: 'school-calendar', label: 'Term Calendar & Events', icon: Calendar },
            { id: 'school-sms', label: 'Bulk SMS Broadcasts', icon: Bell },
            { id: 'school-reports', label: 'CBC Report Card Generator', icon: FileText }
          ]
        },
        {
          title: 'ADMINISTRATION',
          items: [
            { id: 'tenant-website-cms', label: 'Website / CMS', icon: Globe },
            { id: 'system-administration', label: 'System Administration', icon: Shield },
            { id: 'school-settings', label: 'School Settings', icon: Settings }
          ]
        }
      ];
  }
}

/**
 * Validates whether a requested tab or module is permitted for the tenant type.
 */
export function isModuleAllowedForTenant(tenant: Tenant, tabId: string): boolean {
  const sections = getNavigationForTenant(tenant);
  for (const sec of sections) {
    if (sec.items.some(item => item.id === tabId || tabId.startsWith(item.id.split('-')[0]))) {
      return true;
    }
  }
  return false;
}
