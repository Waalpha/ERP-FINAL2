import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { SchoolDashboard } from '../pages/PrimarySchool/SchoolDashboard';
import { StudentManagement } from '../pages/PrimarySchool/StudentManagement';
import { FeeManagement } from '../pages/PrimarySchool/FeeManagement';
import { CBCAcademics } from '../pages/PrimarySchool/CBCAcademics';
import { AttendanceTracker } from '../pages/PrimarySchool/AttendanceTracker';
import { StaffManagement } from '../pages/PrimarySchool/StaffManagement';
import { ClassesStreams } from '../pages/PrimarySchool/ClassesStreams';
import { TimetableAssignments } from '../pages/PrimarySchool/TimetableAssignments';
import { DisciplineCalendar } from '../pages/PrimarySchool/DisciplineCalendar';
import { SMSBroadcasts } from '../pages/PrimarySchool/SMSBroadcasts';
import { ReportCardGenerator } from '../pages/PrimarySchool/ReportCardGenerator';
import { SchoolSettings } from '../pages/PrimarySchool/SchoolSettings';
import { CollegeManagement } from '../pages/College/CollegeManagement';
import { TheologyManagement } from '../pages/College/TheologyManagement';
import { RetailModule } from '../pages/Retail/RetailModule';
import { WholesaleModule } from '../pages/Retail/WholesaleModule';
import { InventoryModule } from '../pages/Retail/InventoryModule';
import { POSTerminal } from '../pages/Retail/POSTerminal';
import { RetailSettingsTab } from '../pages/Retail/RetailSettingsTab';
import { HospitalManagement } from '../pages/Hospital/HospitalManagement';
import { TenantWebsiteCMS } from '../pages/CMS/TenantWebsiteCMS';
import { PublicTenantWebsite } from '../components/PublicWebsite/PublicTenantWebsite';
import { SystemAdministration } from '../pages/Settings/SystemAdministration';
import { StaffDirectory } from '../pages/Staff/StaffDirectory';
import { generateDefaultWebsiteConfig } from '../services/TenantWebsiteGenerator';
import { normalizeTenantType } from '../services/ModuleRegistry';
import { Student, Tenant } from '../types';

interface TenantRouterProps {
  currentTab: string;
  onNavigateTab: (tab: string) => void;
  tenant: Tenant;
}

export const TenantRouter: React.FC<TenantRouterProps> = ({
  currentTab,
  onNavigateTab,
  tenant
}) => {
  const { websiteConfig } = useAuth();
  const activeWebsiteConfig = websiteConfig || generateDefaultWebsiteConfig(tenant);

  const [selectedStudentForPayment, setSelectedStudentForPayment] = useState<Student | null>(null);
  const [selectedStudentForReport, setSelectedStudentForReport] = useState<Student | null>(null);
  const [selectedStudentForSMS, setSelectedStudentForSMS] = useState<Student | null>(null);

  const handleOpenPaymentForStudent = (student: Student) => {
    setSelectedStudentForPayment(student);
    onNavigateTab('school-fees');
  };

  const handleOpenReportForStudent = (student: Student) => {
    setSelectedStudentForReport(student);
    onNavigateTab('school-reports');
  };

  const handleOpenSMSForDebtor = (student: Student) => {
    setSelectedStudentForSMS(student);
    onNavigateTab('school-sms');
  };

  const tType = normalizeTenantType(tenant.type);

  // Universal Mandatory Modules across ALL tenant types
  if (currentTab === 'tenant-website-cms' || currentTab === 'website-cms') {
    return <TenantWebsiteCMS onOpenPublicSite={() => onNavigateTab('public-website')} />;
  }

  if (currentTab === 'public-website') {
    return (
      <PublicTenantWebsite
        tenant={tenant}
        websiteConfig={activeWebsiteConfig}
        onExitToErp={() => onNavigateTab('tenant-website-cms')}
      />
    );
  }

  if (currentTab === 'system-administration' || currentTab === 'system-admin') {
    return (
      <SystemAdministration
        onNavigateToStaff={() => onNavigateTab('staff-directory')}
        onNavigateToWebsite={() => onNavigateTab('tenant-website-cms')}
      />
    );
  }

  if (currentTab === 'staff-directory' || currentTab === 'school-staff' || currentTab === 'college-staff' || currentTab === 'theology-staff') {
    return <StaffDirectory />;
  }

  // Strict Tenant Type Isolation
  if (tType === 'THEOLOGICAL') {
    return <TheologyManagement currentTab={currentTab} />;
  }

  if (tType === 'COLLEGE') {
    return <CollegeManagement currentTab={currentTab} />;
  }

  if (tType === 'BUSINESS') {
    if (currentTab === 'commerce-pos' || currentTab === 'retail-pos') {
      return <POSTerminal onExit={() => onNavigateTab('commerce-retail')} />;
    }
    if (currentTab === 'commerce-wholesale') {
      return <WholesaleModule onNavigate={onNavigateTab} />;
    }
    if (currentTab === 'commerce-inventory' || currentTab === 'retail-inventory') {
      return <InventoryModule onNavigate={onNavigateTab} />;
    }
    if (currentTab === 'retail-settings') {
      return <RetailSettingsTab />;
    }
    return <RetailModule onNavigate={onNavigateTab} />;
  }

  if (tType === 'HOSPITAL') {
    return <HospitalManagement currentTab={currentTab} />;
  }

  // School views
  switch (currentTab) {
    case 'school-overview':
      return (
        <SchoolDashboard
          onNavigate={onNavigateTab}
          onOpenAdmission={() => onNavigateTab('school-students')}
          onOpenRecordPayment={() => onNavigateTab('school-fees')}
        />
      );
    case 'school-students':
      return (
        <StudentManagement
          onOpenRecordPaymentForStudent={handleOpenPaymentForStudent}
          onGenerateReportForStudent={handleOpenReportForStudent}
        />
      );
    case 'school-fees':
      return (
        <FeeManagement
          initialStudentForPayment={selectedStudentForPayment}
          onClearInitialStudent={() => setSelectedStudentForPayment(null)}
          onSendSmsToDebtor={handleOpenSMSForDebtor}
        />
      );
    case 'school-cbc':
    case 'school-assessments':
      return <CBCAcademics />;
    case 'school-attendance':
      return <AttendanceTracker />;
    case 'school-staff':
      return <StaffManagement />;
    case 'school-classes':
      return <ClassesStreams />;
    case 'school-timetable':
    case 'school-assignments':
      return <TimetableAssignments />;
    case 'school-discipline':
    case 'school-calendar':
      return <DisciplineCalendar />;
    case 'school-sms':
      return <SMSBroadcasts />;
    case 'school-reports':
      return (
        <ReportCardGenerator
          initialStudentForReport={selectedStudentForReport}
          onClearInitialStudent={() => setSelectedStudentForReport(null)}
        />
      );
    case 'school-settings':
      return <SchoolSettings />;
    default:
      return (
        <SchoolDashboard
          onNavigate={onNavigateTab}
          onOpenAdmission={() => onNavigateTab('school-students')}
          onOpenRecordPayment={() => onNavigateTab('school-fees')}
        />
      );
  }
};
