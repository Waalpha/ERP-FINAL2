import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  BookOpen,
  GraduationCap,
  Award,
  Scroll,
  Church,
  Calendar,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  PlusCircle,
  Library,
  BookA,
  FileText,
  UserCheck,
  Compass,
  HeartHandshake,
  Cross,
  Sparkles,
  ChevronRight,
  ExternalLink,
  Info,
  ShieldCheck,
  Flame,
  MessageSquare,
  Receipt,
  DollarSign,
  Printer,
  CreditCard,
  Banknote,
  Smartphone,
  AlertCircle,
  Bell,
  Settings,
  Users,
  ArrowLeft,
  TrendingUp,
  Check,
  MapPin,
  User,
  BookmarkCheck
} from 'lucide-react';
import {
  TheologyProgram,
  TheologyProgramLevel,
  TheologyStudent,
  TheologyMinistryTrack,
  MinistryPracticumLog,
  TheologyLibraryResource,
  TheologyInvoice,
  TheologyPayment
} from '../../types';

interface TheologyManagementProps {
  currentTab?: string;
  onNavigateTab?: (tab: string) => void;
}

export const TheologyManagement: React.FC<TheologyManagementProps> = ({ currentTab = 'theology-overview', onNavigateTab }) => {
  const {
    tenant,
    staff,
    theologyPrograms,
    theologyStudents,
    theologyPracticumLogs,
    theologyLibraryResources,
    theologyInvoices,
    theologyPayments,
    addTheologyProgram,
    updateTheologyProgram,
    admitTheologyStudent,
    updateTheologyStudent,
    recordMinistryPracticumLog,
    verifyMinistryPracticumLog,
    addTheologyLibraryResource,
    generateTheologyInvoice,
    recordTheologyPayment,
    recordTheologyBursary,
    updateTenant
  } = useAuth();

  // Internal Tab Switcher if embedded or controlled
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'programs' | 'students' | 'practicum' | 'library' | 'curriculum' | 'fees' | 'staff' | 'reports' | 'sms' | 'settings' | 'timetable' | 'attendance'>(() => {
    if (currentTab === 'theology-students' || currentTab === 'theology-admissions') return 'students';
    if (currentTab === 'theology-fees' || currentTab === 'theology-payments' || currentTab === 'theology-sponsorships' || currentTab === 'theology-financial-reports') return 'fees';
    if (currentTab === 'theology-practicum' || currentTab === 'theology-pastoral' || currentTab === 'theology-sermons' || currentTab === 'theology-placements' || currentTab === 'theology-supervisor-reports') return 'practicum';
    if (currentTab === 'theology-library' || currentTab === 'theology-books' || currentTab === 'theology-research') return 'library';
    if (currentTab === 'theology-curriculum' || currentTab === 'theology-courses') return 'curriculum';
    if (currentTab === 'theology-timetable') return 'timetable';
    if (currentTab === 'theology-attendance') return 'attendance';
    if (currentTab === 'theology-staff' || currentTab === 'staff-directory') return 'staff';
    if (currentTab === 'theology-reports') return 'reports';
    if (currentTab === 'theology-sms') return 'sms';
    if (currentTab === 'theology-settings') return 'settings';
    if (currentTab === 'theology-programs') return 'programs';
    return 'overview';
  });

  React.useEffect(() => {
    if (currentTab === 'theology-students' || currentTab === 'theology-admissions') setActiveSubTab('students');
    else if (currentTab === 'theology-fees' || currentTab === 'theology-payments' || currentTab === 'theology-sponsorships' || currentTab === 'theology-financial-reports') setActiveSubTab('fees');
    else if (currentTab === 'theology-practicum' || currentTab === 'theology-pastoral' || currentTab === 'theology-sermons' || currentTab === 'theology-placements' || currentTab === 'theology-supervisor-reports') setActiveSubTab('practicum');
    else if (currentTab === 'theology-library' || currentTab === 'theology-books' || currentTab === 'theology-research') setActiveSubTab('library');
    else if (currentTab === 'theology-staff' || currentTab === 'staff-directory') setActiveSubTab('staff');
    else if (currentTab === 'theology-reports') setActiveSubTab('reports');
    else if (currentTab === 'theology-sms') setActiveSubTab('sms');
    else if (currentTab === 'theology-settings') setActiveSubTab('settings');
    else if (currentTab === 'theology-curriculum' || currentTab === 'theology-courses') setActiveSubTab('curriculum');
    else if (currentTab === 'theology-timetable') setActiveSubTab('timetable');
    else if (currentTab === 'theology-attendance') setActiveSubTab('attendance');
    else if (currentTab === 'theology-programs') setActiveSubTab('programs');
    else setActiveSubTab('overview');
  }, [currentTab]);

  const navigateTo = (tab: string, subTab?: 'overview' | 'programs' | 'students' | 'practicum' | 'library' | 'curriculum' | 'fees' | 'staff' | 'reports' | 'sms' | 'settings' | 'timetable' | 'attendance') => {
    if (subTab) setActiveSubTab(subTab);
    if (onNavigateTab) onNavigateTab(tab);
  };

  // Seminary Settings / Institution Profile Form State
  const [settingsName, setSettingsName] = useState(tenant?.name || '');
  const [settingsMotto, setSettingsMotto] = useState(tenant?.motto || '');
  const [settingsLogo, setSettingsLogo] = useState(tenant?.logoUrl || '');
  const [settingsPhone, setSettingsPhone] = useState(tenant?.phone || '+254 7');
  const [settingsEmail, setSettingsEmail] = useState(tenant?.contactEmail || 'seminary@divinity.ac.ke');
  const [settingsAddress, setSettingsAddress] = useState(tenant?.address || 'P.O. Box 1234, Nyeri, Kenya');
  const [settingsWebsite, setSettingsWebsite] = useState(tenant?.publicWebsite || '');
  const [settingsPrimaryColor, setSettingsPrimaryColor] = useState(tenant?.primaryColor || '#d97706');
  const [settingsSecondaryColor, setSettingsSecondaryColor] = useState(tenant?.secondaryColor || '#4f46e5');
  const [settingsAcademicYear, setSettingsAcademicYear] = useState(tenant?.currentAcademicYear || '2025/2026');
  const [settingsSemester, setSettingsSemester] = useState(tenant?.currentTerm || 'SEMESTER_1');
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  React.useEffect(() => {
    if (tenant) {
      setSettingsName(tenant.name || '');
      setSettingsMotto(tenant.motto || '');
      setSettingsLogo(tenant.logoUrl || '');
      setSettingsPhone(tenant.phone || '+254 7');
      setSettingsEmail(tenant.contactEmail || '');
      setSettingsAddress(tenant.address || '');
      setSettingsWebsite(tenant.publicWebsite || '');
      setSettingsPrimaryColor(tenant.primaryColor || '#d97706');
      setSettingsSecondaryColor(tenant.secondaryColor || '#4f46e5');
      setSettingsAcademicYear(tenant.currentAcademicYear || '2025/2026');
      setSettingsSemester(tenant.currentTerm || 'SEMESTER_1');
    }
  }, [tenant]);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenant) return;
    await updateTenant(tenant.id, {
      name: settingsName,
      motto: settingsMotto,
      logoUrl: settingsLogo,
      phone: settingsPhone,
      contactEmail: settingsEmail,
      address: settingsAddress,
      publicWebsite: settingsWebsite,
      primaryColor: settingsPrimaryColor,
      secondaryColor: settingsSecondaryColor,
      currentAcademicYear: settingsAcademicYear,
      currentTerm: settingsSemester as any,
      type: 'THEOLOGICAL'
    });
    setSettingsSuccess(true);
    setTimeout(() => setSettingsSuccess(false), 3000);
  };

  // Filters & Searches
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevelFilter, setSelectedLevelFilter] = useState<string>('ALL');
  const [selectedTrackFilter, setSelectedTrackFilter] = useState<string>('ALL');
  const [selectedResourceCategory, setSelectedResourceCategory] = useState<string>('ALL');

  // Program Detail View Modal
  const [selectedProgramForView, setSelectedProgramForView] = useState<TheologyProgram | null>(null);
  const [selectedStudentForView, setSelectedStudentForView] = useState<TheologyStudent | null>(null);

  // Modals
  const [showProgramModal, setShowProgramModal] = useState(false);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showPracticumModal, setShowPracticumModal] = useState(false);
  const [showResourceModal, setShowResourceModal] = useState(false);
  const [practicumFeedbackModal, setPracticumFeedbackModal] = useState<{ log: MinistryPracticumLog | null; action: 'VERIFIED' | 'NEEDS_REVISION' }>({
    log: null,
    action: 'VERIFIED'
  });
  const [deanFeedbackText, setDeanFeedbackText] = useState('');

  // Program Form
  const [progTitle, setProgTitle] = useState('');
  const [progCode, setProgCode] = useState('');
  const [progLevel, setProgLevel] = useState<TheologyProgramLevel>('BACHELORS');
  const [progDuration, setProgDuration] = useState('4 Years (8 Semesters)');
  const [progCredits, setProgCredits] = useState(132);
  const [progTuition, setProgTuition] = useState(55000);
  const [progPracticumHours, setProgPracticumHours] = useState(300);
  const [progDescription, setProgDescription] = useState('');
  const [progAward, setProgAward] = useState('Bachelor of Theology (B.Th.)');

  // Student Form
  const [studentFullName, setStudentFullName] = useState('');
  const [studentRegNo, setStudentRegNo] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentPhone, setStudentPhone] = useState('+254 7');
  const [studentProgId, setStudentProgId] = useState(theologyPrograms[0]?.id || '');
  const [studentTrack, setStudentTrack] = useState<TheologyMinistryTrack>('ORDINATION_PASTORAL');
  const [studentDenomination, setStudentDenomination] = useState('Anglican / Protestant');
  const [studentParish, setStudentParish] = useState('');
  const [studentSupervisor, setStudentSupervisor] = useState('');
  const [studentOrdinationCandidate, setStudentOrdinationCandidate] = useState(true);
  const [studentYear, setStudentYear] = useState(1);
  const [studentSemester, setStudentSemester] = useState(1);

  // Practicum Log Form
  const [pracStudentId, setPracStudentId] = useState(theologyStudents[0]?.id || '');
  const [pracDate, setPracDate] = useState(new Date().toISOString().split('T')[0]);
  const [pracLocation, setPracLocation] = useState('');
  const [pracActivity, setPracActivity] = useState<MinistryPracticumLog['activityType']>('SUNDAY_EXPOSITORY_PREACHING');
  const [pracHours, setPracHours] = useState(6);
  const [pracSupervisorName, setPracSupervisorName] = useState('');
  const [pracReflection, setPracReflection] = useState('');

  // Library Resource Form
  const [resTitle, setResTitle] = useState('');
  const [resAuthor, setResAuthor] = useState('');
  const [resIsbn, setResIsbn] = useState('');
  const [resCategory, setResCategory] = useState<TheologyLibraryResource['category']>('SYSTEMATIC_THEOLOGY');
  const [resCopies, setResCopies] = useState(4);
  const [resShelf, setResShelf] = useState('DIV-SYS-04');
  const [resDescription, setResDescription] = useState('');

  // Theology Fee & Sponsorship State
  const [showTheologyInvoiceModal, setShowTheologyInvoiceModal] = useState(false);
  const [showTheologyPaymentModal, setShowTheologyPaymentModal] = useState(false);
  const [selectedTheologyReceipt, setSelectedTheologyReceipt] = useState<TheologyPayment | null>(null);

  // Invoice Form
  const [theoInvStudentId, setTheoInvStudentId] = useState((theologyStudents || [])[0]?.id || '');
  const [theoInvSemester, setTheoInvSemester] = useState(1);
  const [theoInvAcademicYear, setTheoInvAcademicYear] = useState('2025/2026');
  const [theoInvDueDate, setTheoInvDueDate] = useState('2025-06-15');
  const [theoInvTuition, setTheoInvTuition] = useState(55000);
  const [theoInvPracticumLevy, setTheoInvPracticumLevy] = useState(5000);
  const [theoInvPatristicLevy, setTheoInvPatristicLevy] = useState(2500);

  // Payment Form
  const [theoPayStudentId, setTheoPayStudentId] = useState((theologyStudents || [])[0]?.id || '');
  const [theoPayInvoiceId, setTheoPayInvoiceId] = useState('');
  const [theoPayAmount, setTheoPayAmount] = useState(30000);
  const [theoPayMethod, setTheoPayMethod] = useState<'MPESA' | 'BANK' | 'CASH' | 'CHEQUE' | 'BURSARY' | 'DIOCESE_SPONSORSHIP'>('DIOCESE_SPONSORSHIP');
  const [theoPayRef, setTheoPayRef] = useState('DIO/SPON/2025/89');
  const [theoPaySponsorName, setTheoPaySponsorName] = useState('ACK Diocese of Mt. Kenya / Bishop Education Fund');
  const [theoPayRemarks, setTheoPayRemarks] = useState('Diocesan seminarian tuition grant');

  // Filtered lists
  const filteredPrograms = useMemo(() => {
    return (theologyPrograms || []).filter(p => {
      const pTitle = p.title || '';
      const pCode = p.code || '';
      const pAward = p.awardTitle || p.title || '';
      const matchSearch = pTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pAward.toLowerCase().includes(searchQuery.toLowerCase());
      const matchLevel = selectedLevelFilter === 'ALL' || p.level === selectedLevelFilter;
      return matchSearch && matchLevel;
    });
  }, [theologyPrograms, searchQuery, selectedLevelFilter]);

  const filteredStudents = useMemo(() => {
    return (theologyStudents || []).filter(s => {
      const sName = s.fullName || '';
      const sReg = s.regNo || s.studentRegNo || '';
      const sChurch = s.churchAffiliation || s.homeChurchDenomination || '';
      const matchSearch = sName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sReg.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sChurch.toLowerCase().includes(searchQuery.toLowerCase());
      const matchTrack = selectedTrackFilter === 'ALL' || s.ministryTrack === selectedTrackFilter;
      const targetProg = (theologyPrograms || []).find(p => p.id === s.programId);
      const matchLevel = selectedLevelFilter === 'ALL' || (targetProg && targetProg.level === selectedLevelFilter);
      return matchSearch && matchTrack && matchLevel;
    });
  }, [theologyStudents, theologyPrograms, searchQuery, selectedTrackFilter, selectedLevelFilter]);

  const filteredResources = useMemo(() => {
    return (theologyLibraryResources || []).filter(r => {
      const rTitle = r.title || '';
      const rAuthor = r.author || '';
      const matchSearch = rTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rAuthor.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = selectedResourceCategory === 'ALL' || r.category === selectedResourceCategory;
      return matchSearch && matchCat;
    });
  }, [theologyLibraryResources, searchQuery, selectedResourceCategory]);

  // Statistics
  const totalSeminarians = (theologyStudents || []).length;
  const ordinationCandidatesCount = (theologyStudents || []).filter(s => Boolean(s.isOrdinationCandidate)).length;
  const verifiedPracticumHoursTotal = (theologyStudents || []).reduce((sum, s) => sum + (s.practicumHoursCompleted || 0), 0);
  const pendingPracticumLogsCount = (theologyPracticumLogs || []).filter(l => l.status === 'LOGGED' || l.status === 'PENDING').length;

  // Handlers
  const handleCreateProgram = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!progTitle || !progCode) return;

    await addTheologyProgram({
      code: progCode.toUpperCase(),
      title: progTitle,
      level: progLevel,
      duration: progDuration,
      creditsRequired: progCredits,
      tuitionPerSemester: progTuition,
      requiredPracticumHours: progPracticumHours,
      description: progDescription || `Comprehensive theological education accredited for ${progLevel.toLowerCase()} ministry candidates.`,
      awardTitle: progAward || `${progTitle}`,
      units: [
        {
          id: `unit-${Date.now()}-1`,
          code: `${progCode}101`,
          title: 'Introduction to Old Testament Literature & Theology',
          creditHours: 3,
          semester: 1,
          isCore: true,
          category: 'BIBLICAL_STUDIES',
          description: 'Survey of the Pentateuch, Historical Books, Wisdom, and Prophets with hermeneutical exegesis.'
        },
        {
          id: `unit-${Date.now()}-2`,
          code: `${progCode}102`,
          title: 'Introduction to New Testament & Apostolic Era',
          creditHours: 3,
          semester: 1,
          isCore: true,
          category: 'BIBLICAL_STUDIES',
          description: 'Gospels, Johannine corpus, Pauline epistles, and General Epistles in their Greco-Roman context.'
        },
        {
          id: `unit-${Date.now()}-3`,
          code: `${progCode}103`,
          title: 'Systematic Theology: Doctrine of God, Creation & Humanity',
          creditHours: 3,
          semester: 1,
          isCore: true,
          category: 'SYSTEMATIC_THEOLOGY',
          description: 'Classical theism, Trinitarian formulations, creation ex nihilo, anthropology and the fall.'
        },
        {
          id: `unit-${Date.now()}-4`,
          code: `${progCode}104`,
          title: 'Pastoral Care & Pastoral Leadership Practicum',
          creditHours: 3,
          semester: 2,
          isCore: true,
          category: 'PASTORAL_STUDIES',
          description: 'Foundations of shepherd leadership, hospital chaplaincy, crisis counseling, and sermon prep.'
        }
      ]
    });

    setProgTitle('');
    setProgCode('');
    setProgDescription('');
    setShowProgramModal(false);
  };

  const handleAdmitStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentFullName || !studentRegNo || !studentProgId) return;

    const targetProg = theologyPrograms.find(p => p.id === studentProgId);
    await admitTheologyStudent({
      regNo: studentRegNo.toUpperCase(),
      fullName: studentFullName,
      email: studentEmail || `${studentRegNo.toLowerCase().replace(/[^a-z0-9]/g, '')}@divinity.berea.ac.ke`,
      phone: studentPhone,
      programId: studentProgId,
      programTitle: targetProg?.title || 'Theology Program',
      ministryTrack: studentTrack,
      yearOfStudy: studentYear,
      semester: studentSemester,
      status: 'ACTIVE',
      churchAffiliation: studentDenomination,
      homeParish: studentParish || 'Community Assembly of Believers',
      ordainingBishopOrSupervisor: studentSupervisor || 'Rt. Rev. Supervising Mentor',
      isOrdinationCandidate: studentOrdinationCandidate,
      requiredPracticumHours: targetProg?.requiredPracticumHours || 200,
      hostelRoomNumber: 'Seminary Wing Room 102'
    });

    setStudentFullName('');
    setStudentRegNo('');
    setStudentEmail('');
    setStudentPhone('+254 7');
    setStudentParish('');
    setStudentSupervisor('');
    setShowStudentModal(false);
  };

  const handleRecordPracticum = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pracStudentId || !pracLocation || !pracHours) return;

    const targetStudent = theologyStudents.find(s => s.id === pracStudentId);
    await recordMinistryPracticumLog({
      studentId: pracStudentId,
      studentName: targetStudent?.fullName || 'Theology Student',
      studentRegNo: targetStudent?.regNo || 'REG/2025',
      date: pracDate,
      churchOrLocation: pracLocation,
      supervisingPastorName: pracSupervisorName || 'Parish Vicar',
      activityType: pracActivity,
      hoursLogged: Number(pracHours),
      reflectionNotes: pracReflection || 'Executed ministry duties in accordance with the Seminary Fieldwork Handbook.'
    });

    setPracLocation('');
    setPracSupervisorName('');
    setPracReflection('');
    setShowPracticumModal(false);
  };

  const handleVerifyPracticumSubmit = async () => {
    if (!practicumFeedbackModal.log) return;
    await verifyMinistryPracticumLog(
      practicumFeedbackModal.log.id,
      practicumFeedbackModal.action,
      deanFeedbackText
    );
    setPracticumFeedbackModal({ log: null, action: 'VERIFIED' });
    setDeanFeedbackText('');
  };

  const handleAddResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resTitle || !resAuthor) return;

    await addTheologyLibraryResource({
      title: resTitle,
      author: resAuthor,
      isbn: resIsbn || `ISBN-THEO-${Math.floor(100000 + Math.random() * 900000)}`,
      category: resCategory,
      totalCopies: Number(resCopies),
      availableCopies: Number(resCopies),
      shelfLocation: resShelf || 'DIV-MAIN-01',
      description: resDescription || 'Academic theological reference book and exegetical manual.',
      publicationYear: 2022,
      isDigitalAvailable: true
    });

    setResTitle('');
    setResAuthor('');
    setResIsbn('');
    setResDescription('');
    setShowResourceModal(false);
  };

  // Safe Collections
  const safeTheologyStudents = theologyStudents || [];
  const safeTheologyInvoices = theologyInvoices || [];
  const safeTheologyPayments = theologyPayments || [];

  // Theology Fee Financial KPIs
  const totalTheologyInvoiced = safeTheologyInvoices.reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);
  const totalTheologyCollected = safeTheologyPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
  const totalDiocesanBursaries = safeTheologyPayments
    .filter(p => p.paymentMethod === 'DIOCESE_SPONSORSHIP' || p.paymentMethod === 'BURSARY')
    .reduce((sum, p) => sum + (p.amount || 0), 0);
  const totalTheologyArrears = safeTheologyStudents.reduce((sum, s) => sum + (s.feeBalance || 0), 0);

  const handleGenerateTheologyInvoiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!theoInvStudentId) return;

    const student = safeTheologyStudents.find(s => s.id === theoInvStudentId);
    if (!student) return;

    const lineItems = [
      { id: `item-${Date.now()}-1`, name: 'Theological Tuition & Seminar Instruction', amount: Number(theoInvTuition) },
      { id: `item-${Date.now()}-2`, name: 'Ministry Fieldwork & Practicum Supervision', amount: Number(theoInvPracticumLevy) },
      { id: `item-${Date.now()}-3`, name: 'Patristics Library & Exegesis Lab Levy', amount: Number(theoInvPatristicLevy) }
    ].filter(item => item.amount > 0);

    const total = lineItems.reduce((acc, curr) => acc + curr.amount, 0);

    await generateTheologyInvoice({
      studentId: student.id,
      studentName: student.fullName,
      studentRegNo: student.regNo,
      programId: student.programId,
      programTitle: student.programTitle,
      semester: Number(theoInvSemester),
      academicYear: theoInvAcademicYear,
      dueDate: theoInvDueDate,
      items: lineItems,
      totalAmount: total,
      paidAmount: 0,
      balance: total,
      status: 'ISSUED'
    });

    setShowTheologyInvoiceModal(false);
  };

  const handleRecordTheologyPaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!theoPayStudentId || theoPayAmount <= 0) return;

    const student = safeTheologyStudents.find(s => s.id === theoPayStudentId);
    if (!student) return;

    const paymentData = {
      invoiceId: theoPayInvoiceId || undefined,
      studentId: student.id,
      studentName: student.fullName,
      studentRegNo: student.regNo,
      amount: Number(theoPayAmount),
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMethod: theoPayMethod,
      reference: theoPayRef || `THEO-REF-${Date.now().toString().slice(-6)}`,
      sponsorName: (theoPayMethod === 'DIOCESE_SPONSORSHIP' || theoPayMethod === 'BURSARY') ? theoPaySponsorName : undefined,
      remarks: theoPayRemarks
    };

    const newPayment = await recordTheologyPayment(paymentData);
    if (newPayment) {
      setSelectedTheologyReceipt(newPayment);
    }

    setShowTheologyPaymentModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Academic Sub-Header for non-overview subtabs */}
      {activeSubTab !== 'overview' && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-xs text-slate-500">
              <button
                onClick={() => navigateTo('theology-overview', 'overview')}
                className="hover:text-amber-800 font-medium flex items-center space-x-1"
              >
                <ArrowLeft className="h-3 w-3" />
                <span>Seminary Dashboard</span>
              </button>
              <span>/</span>
              <span className="text-slate-800 font-semibold capitalize">
                {activeSubTab === 'programs' && 'Academic Hierarchy & Programmes'}
                {activeSubTab === 'students' && 'Seminarians & Candidates Directory'}
                {activeSubTab === 'practicum' && 'Ministry Practicum & Parish Fieldwork'}
                {activeSubTab === 'fees' && 'Seminary Fees & Diocesan Sponsorships'}
                {activeSubTab === 'library' && 'Theological Library & Patristic Archives'}
                {activeSubTab === 'curriculum' && 'Curriculum Syllabi & Unit Catalog'}
                {activeSubTab === 'timetable' && 'Lecture & Chapel Timetable'}
                {activeSubTab === 'attendance' && 'Chapel & Lecture Attendance'}
                {activeSubTab === 'staff' && 'Faculty of Divinity & Staff'}
                {activeSubTab === 'reports' && 'Academic & Ministerial Reports'}
                {activeSubTab === 'sms' && 'Seminarian Communication & SMS'}
                {activeSubTab === 'settings' && 'Seminary Institutional Settings'}
              </span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
              <span>
                {activeSubTab === 'programs' && 'Academic Programmes & Curriculum Progression'}
                {activeSubTab === 'students' && 'Seminarians & Ordination Candidates'}
                {activeSubTab === 'practicum' && 'Ministry Practicum & Fieldwork Logs'}
                {activeSubTab === 'fees' && 'Seminary Fees & Diocesan Sponsorships'}
                {activeSubTab === 'library' && 'Theological Library & Research Archives'}
                {activeSubTab === 'curriculum' && 'Curricular Units & Course Outlines'}
                {activeSubTab === 'timetable' && 'Lecture & Chapel Timetable'}
                {activeSubTab === 'attendance' && 'Attendance & Chapel Roster'}
                {activeSubTab === 'staff' && 'Faculty of Divinity & Seminary Staff'}
                {activeSubTab === 'reports' && 'Seminary Academic & Ministerial Reports'}
                {activeSubTab === 'sms' && 'Seminarian & Parish Communication'}
                {activeSubTab === 'settings' && 'Seminary Profile & Academic Year'}
              </span>
            </h1>
          </div>

          {/* Contextual Action Button */}
          <div className="flex items-center space-x-2">
            {activeSubTab === 'programs' && (
              <button
                onClick={() => setShowProgramModal(true)}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center space-x-1.5"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Add Programme</span>
              </button>
            )}
            {activeSubTab === 'students' && (
              <button
                onClick={() => setShowStudentModal(true)}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center space-x-1.5"
              >
                <UserCheck className="h-4 w-4" />
                <span>Admit Seminarian</span>
              </button>
            )}
            {activeSubTab === 'practicum' && (
              <button
                onClick={() => setShowPracticumModal(true)}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center space-x-1.5"
              >
                <HeartHandshake className="h-4 w-4" />
                <span>Record Practicum Log</span>
              </button>
            )}
            {activeSubTab === 'fees' && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowTheologyInvoiceModal(true)}
                  className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center space-x-1"
                >
                  <Receipt className="h-3.5 w-3.5" />
                  <span>Issue Invoice</span>
                </button>
                <button
                  onClick={() => setShowTheologyPaymentModal(true)}
                  className="px-3.5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center space-x-1"
                >
                  <DollarSign className="h-3.5 w-3.5" />
                  <span>Record Fee / Bursary</span>
                </button>
              </div>
            )}
            {activeSubTab === 'library' && (
              <button
                onClick={() => setShowResourceModal(true)}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center space-x-1.5"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Add Resource</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* DASHBOARD OVERVIEW: Premium Theological Seminary Management System */}
      {activeSubTab === 'overview' && (
        <div className="space-y-6">
          {/* Welcome Section */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-xs relative overflow-hidden border-l-4 border-amber-500">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
              <div className="space-y-2 max-w-3xl">
                <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200 flex items-center space-x-1.5">
                    <Church className="h-3.5 w-3.5 text-amber-700" />
                    <span>Theological Seminary & Bible College</span>
                  </span>
                  <span className="text-xs text-slate-500 font-mono">
                    Certificate to Bachelor of Theology (B.Th.)
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                  Welcome to {tenant?.name || 'Injiri Centre Nyeri'}
                </h1>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Manage students, theological programmes, ministry practicum, faculty, fees and seminary administration.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center flex-wrap gap-2.5">
                <button
                  onClick={() => setShowStudentModal(true)}
                  className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-xs flex items-center space-x-1.5 transition"
                >
                  <UserCheck className="h-4 w-4 text-amber-400" />
                  <span>Admit Seminarian</span>
                </button>
                <button
                  onClick={() => setShowTheologyInvoiceModal(true)}
                  className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold shadow-xs flex items-center space-x-1.5 transition"
                >
                  <Receipt className="h-4 w-4 text-slate-500" />
                  <span>Issue Tuition Invoice</span>
                </button>
                <button
                  onClick={() => setShowTheologyPaymentModal(true)}
                  className="px-3.5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold shadow-xs flex items-center space-x-1.5 transition"
                >
                  <DollarSign className="h-4 w-4" />
                  <span>Record Fee / Bursary</span>
                </button>
                <button
                  onClick={() => setShowPracticumModal(true)}
                  className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold shadow-xs flex items-center space-x-1.5 transition"
                >
                  <HeartHandshake className="h-4 w-4 text-amber-600" />
                  <span>Log Fieldwork</span>
                </button>
              </div>
            </div>
          </div>

          {/* 6 Attractive Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
            {/* Total Students */}
            <div
              onClick={() => navigateTo('theology-students', 'students')}
              className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs hover:border-amber-400 hover:shadow-sm transition cursor-pointer flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Total Students</span>
                <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                  <GraduationCap className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-2">
                <div className="text-2xl font-black text-slate-900">{totalSeminarians}</div>
                <div className="text-[11px] text-amber-800 font-medium mt-0.5">{ordinationCandidatesCount} Ordination Track</div>
              </div>
            </div>

            {/* Active Programmes */}
            <div
              onClick={() => navigateTo('theology-programs', 'programs')}
              className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs hover:border-slate-300 hover:shadow-sm transition cursor-pointer flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Active Programmes</span>
                <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
                  <Scroll className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-2">
                <div className="text-2xl font-black text-slate-900">{theologyPrograms.length}</div>
                <div className="text-[11px] text-slate-500 font-medium mt-0.5">Cert to B.Th. Curricula</div>
              </div>
            </div>

            {/* Faculty & Staff */}
            <div
              onClick={() => navigateTo('theology-staff', 'staff')}
              className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs hover:border-slate-300 hover:shadow-sm transition cursor-pointer flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Faculty & Staff</span>
                <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
                  <Users className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-2">
                <div className="text-2xl font-black text-slate-900">{(staff && staff.length > 0) ? staff.length : 8}</div>
                <div className="text-[11px] text-slate-500 font-medium mt-0.5">Deans & Lecturers</div>
              </div>
            </div>

            {/* Fees Collected */}
            <div
              onClick={() => navigateTo('theology-fees', 'fees')}
              className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs hover:border-emerald-400 hover:shadow-sm transition cursor-pointer flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Fees Collected</span>
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <DollarSign className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-2">
                <div className="text-lg sm:text-xl font-black text-emerald-700 truncate">
                  KES {totalTheologyCollected.toLocaleString()}
                </div>
                <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                  Grants: KES {totalDiocesanBursaries.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Outstanding Fees */}
            <div
              onClick={() => navigateTo('theology-fees', 'fees')}
              className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs hover:border-rose-300 hover:shadow-sm transition cursor-pointer flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Outstanding Fees</span>
                <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center">
                  <AlertCircle className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-2">
                <div className="text-lg sm:text-xl font-black text-rose-600 truncate">
                  KES {totalTheologyArrears.toLocaleString()}
                </div>
                <div className="text-[11px] text-slate-500 font-medium mt-0.5">Term Arrears Ledger</div>
              </div>
            </div>

            {/* Ministry Practicum Students */}
            <div
              onClick={() => navigateTo('theology-practicum', 'practicum')}
              className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs hover:border-amber-400 hover:shadow-sm transition cursor-pointer flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Practicum Students</span>
                <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                  <HeartHandshake className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-2">
                <div className="text-2xl font-black text-amber-800">
                  {(theologyStudents || []).filter(s => (s.practicumHoursCompleted || 0) > 0 || s.status === 'PRACTICUM_FIELD').length || 7}
                </div>
                <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                  {pendingPracticumLogsCount} Pending Reviews
                </div>
              </div>
            </div>
          </div>

          {/* Academic Overview Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Student Enrollment & Programme Distribution (7 Cols) */}
            <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Academic Overview & Enrollment</h2>
                  <p className="text-xs text-slate-500">Student enrollment distribution across theological award levels</p>
                </div>
                <button
                  onClick={() => navigateTo('theology-programs', 'programs')}
                  className="text-xs font-bold text-amber-800 hover:text-amber-900 flex items-center space-x-1"
                >
                  <span>View Programmes</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Degree Level Progression Meters */}
              <div className="space-y-3.5">
                {[
                  {
                    level: 'Bachelor of Theology (B.Th.)',
                    code: 'BTH-01',
                    count: (theologyStudents || []).filter(s => {
                      const prog = (theologyPrograms || []).find(p => p.id === s.programId);
                      return prog?.level === 'DEGREE' || prog?.code?.includes('BTH');
                    }).length || 4,
                    percentage: 40,
                    color: 'bg-amber-600',
                    text: 'text-amber-900',
                    credits: '120 Credits • 400 Hrs Practicum'
                  },
                  {
                    level: 'Higher Diploma in Pastoral Leadership',
                    code: 'HDIP-02',
                    count: (theologyStudents || []).filter(s => {
                      const prog = (theologyPrograms || []).find(p => p.id === s.programId);
                      return prog?.level === 'HIGHER_DIPLOMA';
                    }).length || 3,
                    percentage: 30,
                    color: 'bg-indigo-600',
                    text: 'text-indigo-900',
                    credits: '90 Credits • 300 Hrs Practicum'
                  },
                  {
                    level: 'Diploma in Biblical Studies & Ministry',
                    code: 'DIP-03',
                    count: (theologyStudents || []).filter(s => {
                      const prog = (theologyPrograms || []).find(p => p.id === s.programId);
                      return prog?.level === 'DIPLOMA';
                    }).length || 3,
                    percentage: 30,
                    color: 'bg-slate-700',
                    text: 'text-slate-800',
                    credits: '60 Credits • 200 Hrs Practicum'
                  },
                  {
                    level: 'Certificate in Christian Ministry',
                    code: 'CERT-04',
                    count: (theologyStudents || []).filter(s => {
                      const prog = (theologyPrograms || []).find(p => p.id === s.programId);
                      return prog?.level === 'CERTIFICATE';
                    }).length || 2,
                    percentage: 20,
                    color: 'bg-emerald-600',
                    text: 'text-emerald-900',
                    credits: '30 Credits • 100 Hrs Practicum'
                  }
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="font-bold text-slate-800 flex items-center space-x-2">
                        <span>{item.level}</span>
                        <span className="text-[10px] text-slate-400 font-mono">({item.code})</span>
                      </div>
                      <div className="flex items-center space-x-2 text-slate-600">
                        <span className="font-bold text-slate-900">{item.count} Seminarians</span>
                        <span className="text-[10px] text-slate-400 font-mono">({item.percentage}%)</span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div className={`h-full ${item.color} rounded-full`} style={{ width: `${Math.max(item.percentage, 10)}%` }} />
                    </div>
                    <div className="text-[10px] text-slate-400 flex items-center justify-between font-mono">
                      <span>{item.credits}</span>
                      <span>Diocesan Accredited</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Current Seminary Classes & Lecturers */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>Current Seminary Units & Faculty</span>
                  <span className="text-[11px] text-slate-400 font-mono">Semester 1</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/70 text-xs space-y-1">
                    <div className="font-bold text-slate-900 flex items-center justify-between">
                      <span>BIB101: Greek Exegesis</span>
                      <span className="text-[10px] font-mono text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded">3 Cr</span>
                    </div>
                    <div className="text-[11px] text-slate-500">Rev. Dr. Peter Mwangi • Lecture Hall 1</div>
                  </div>
                  <div className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/70 text-xs space-y-1">
                    <div className="font-bold text-slate-900 flex items-center justify-between">
                      <span>SYS301: Systematic Theology</span>
                      <span className="text-[10px] font-mono text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded">4 Cr</span>
                    </div>
                    <div className="text-[11px] text-slate-500">Dean of Divinity • Lecture Hall 2</div>
                  </div>
                  <div className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/70 text-xs space-y-1">
                    <div className="font-bold text-slate-900 flex items-center justify-between">
                      <span>OTH202: Old Testament Wisdom</span>
                      <span className="text-[10px] font-mono text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded">3 Cr</span>
                    </div>
                    <div className="text-[11px] text-slate-500">Canon David Murithi • Seminar Rm</div>
                  </div>
                  <div className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/70 text-xs space-y-1">
                    <div className="font-bold text-slate-900 flex items-center justify-between">
                      <span>PAS401: Pastoral Homiletics</span>
                      <span className="text-[10px] font-mono text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded">3 Cr</span>
                    </div>
                    <div className="text-[11px] text-slate-500">Archdeacon Joseph • Main Chapel</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Attendance & Upcoming Lectures (5 Cols) */}
            <div className="lg:col-span-5 bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h2 className="text-base font-bold text-slate-900">Attendance & Seminary Life</h2>
                  <p className="text-xs text-slate-500">Chapel devotions & lecture session participation</p>
                </div>

                {/* Attendance Metric Gauges */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-amber-50/50 border border-amber-200/70 rounded-xl text-center space-y-1">
                    <div className="text-2xl font-black text-amber-900">96%</div>
                    <div className="text-xs font-bold text-amber-800">Chapel Devotions</div>
                    <div className="text-[10px] text-slate-500 font-mono">Daily Morning Roster</div>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center space-y-1">
                    <div className="text-2xl font-black text-slate-900">94%</div>
                    <div className="text-xs font-bold text-slate-800">Class Lectures</div>
                    <div className="text-[10px] text-slate-500 font-mono">Core Units Roster</div>
                  </div>
                </div>

                {/* Upcoming Lectures */}
                <div className="space-y-2.5 pt-2">
                  <div className="text-xs font-bold text-slate-700">Upcoming Lectures & Devotions</div>

                  <div className="border border-slate-100 rounded-xl p-3 bg-slate-50/50 space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                      <span>Expository Preaching in Africa</span>
                      <span className="text-[10px] text-amber-800 font-mono bg-amber-50 px-2 py-0.5 rounded">Tomorrow 08:30 AM</span>
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center space-x-2">
                      <span>Rev. Dr. Peter Mwangi</span>
                      <span>•</span>
                      <span>Main Chapel Hall</span>
                    </div>
                  </div>

                  <div className="border border-slate-100 rounded-xl p-3 bg-slate-50/50 space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                      <span>Patristic Dogmatics & Early Councils</span>
                      <span className="text-[10px] text-slate-600 font-mono bg-slate-100 px-2 py-0.5 rounded">Thursday 10:00 AM</span>
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center space-x-2">
                      <span>Dean of Divinity</span>
                      <span>•</span>
                      <span>Lecture Room B</span>
                    </div>
                  </div>

                  <div className="border border-slate-100 rounded-xl p-3 bg-slate-50/50 space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                      <span>Seminarians & Faculty Prayer Fellowship</span>
                      <span className="text-[10px] text-slate-600 font-mono bg-slate-100 px-2 py-0.5 rounded">Friday 07:00 AM</span>
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center space-x-2">
                      <span>Chaplain</span>
                      <span>•</span>
                      <span>Seminary Chapel</span>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigateTo('theology-timetable', 'timetable')}
                className="w-full py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5"
              >
                <Calendar className="h-3.5 w-3.5 text-slate-500" />
                <span>View Full Seminary Timetable</span>
              </button>
            </div>
          </div>

          {/* Ministry Practicum Section (Visually Distinct with Warm Gold & Navy Branding) */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs border-l-4 border-amber-500 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-900 border border-amber-200">
                    Fieldwork & Pastoral Formation
                  </span>
                  <span className="text-xs text-slate-500 font-mono">
                    Supervised Parish Placements
                  </span>
                </div>
                <h2 className="text-base font-bold text-slate-900 mt-1">
                  Ministry Practicum & Fieldwork Supervision
                </h2>
                <p className="text-xs text-slate-500">
                  Seminarians deployed across diocesan parishes, hospital chaplaincies, and evangelistic missions.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowPracticumModal(true)}
                  className="px-3.5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center space-x-1.5"
                >
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span>Log Practicum</span>
                </button>
                <button
                  onClick={() => navigateTo('theology-practicum', 'practicum')}
                  className="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center space-x-1"
                >
                  <span>All Placements ({theologyPracticumLogs.length})</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Practicum Cards Table */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {[
                {
                  student: 'Samuel Mwangi',
                  regNo: 'THEO-2024-001',
                  track: 'Ordination Candidate',
                  placement: "ACK St. Peter's Cathedral Nyeri",
                  supervisor: 'Rev. Canon David Murithi',
                  hours: 120,
                  required: 200,
                  percentage: 60,
                  status: 'Active Placement'
                },
                {
                  student: 'Grace Wanjiku',
                  regNo: 'THEO-2024-002',
                  track: 'Christian Education & Youth',
                  placement: 'PCEA Nyeri Town Parish',
                  supervisor: 'Rev. Dr. Peter Mwangi',
                  hours: 95,
                  required: 150,
                  percentage: 63,
                  status: 'Active Placement'
                },
                {
                  student: 'John Kamau',
                  regNo: 'THEO-2024-003',
                  track: 'Missiology & Evangelism',
                  placement: 'AIC Highlands Outreach Mission',
                  supervisor: 'Pastor James Kariuki',
                  hours: 40,
                  required: 100,
                  percentage: 40,
                  status: 'Active Placement'
                }
              ].map((p, idx) => (
                <div key={idx} className="bg-slate-50/70 border border-slate-200 rounded-xl p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-bold text-slate-900 text-sm">{p.student}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{p.regNo} • {p.track}</div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {p.status}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs">
                    <div className="text-slate-600">
                      <strong className="text-slate-800">Parish:</strong> {p.placement}
                    </div>
                    <div className="text-slate-600">
                      <strong className="text-slate-800">Supervisor:</strong> {p.supervisor}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Progress:</span>
                      <span className="font-bold text-amber-800">{p.hours} / {p.required} Hrs ({p.percentage}%)</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-amber-600 h-full rounded-full" style={{ width: `${p.percentage}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pending Supervisor Reports Notice */}
            {pendingPracticumLogsCount > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-center justify-between flex-wrap gap-2 text-xs">
                <div className="flex items-center space-x-2 text-amber-900">
                  <AlertCircle className="h-4 w-4 text-amber-700 flex-shrink-0" />
                  <span>
                    <strong>{pendingPracticumLogsCount} Practicum Logs</strong> are awaiting Dean verification & supervisor assessment.
                  </span>
                </div>
                <button
                  onClick={() => navigateTo('theology-practicum', 'practicum')}
                  className="px-3 py-1 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-xs font-bold transition shadow-2xs"
                >
                  Review & Verify Logs
                </button>
              </div>
            )}
          </div>

          {/* Finance & Fees Overview Section */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-900">Seminary Tuition & Diocesan Sponsorships</h2>
                <p className="text-xs text-slate-500">Diocesan grants, church sponsorships, and tuition ledger</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowTheologyPaymentModal(true)}
                  className="px-3.5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center space-x-1.5"
                >
                  <DollarSign className="h-3.5 w-3.5" />
                  <span>Record Fee / Bursary</span>
                </button>
                <button
                  onClick={() => navigateTo('theology-fees', 'fees')}
                  className="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center space-x-1"
                >
                  <span>View All Invoices</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Collection Progress & Bursary breakdown (5 cols) */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-700">Tuition Collection Progress</span>
                    <span className="font-bold text-emerald-700">
                      {totalTheologyInvoiced > 0 ? Math.round((totalTheologyCollected / totalTheologyInvoiced) * 100) : 78}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full rounded-full"
                      style={{ width: `${totalTheologyInvoiced > 0 ? Math.min(Math.round((totalTheologyCollected / totalTheologyInvoiced) * 100), 100) : 78}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                    <span>Collected: KES {totalTheologyCollected.toLocaleString()}</span>
                    <span>Billed: KES {totalTheologyInvoiced.toLocaleString()}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-700">Diocesan & Parish Sponsorships</div>
                  <div className="space-y-1.5">
                    <div className="p-2.5 rounded-lg border border-slate-100 bg-slate-50 text-xs flex items-center justify-between">
                      <div>
                        <div className="font-bold text-slate-900">ACK Diocese of Mt. Kenya Central</div>
                        <div className="text-[10px] text-slate-500 font-mono">Bishop Education Fund</div>
                      </div>
                      <span className="font-mono font-bold text-indigo-700">KES 45,000</span>
                    </div>
                    <div className="p-2.5 rounded-lg border border-slate-100 bg-slate-50 text-xs flex items-center justify-between">
                      <div>
                        <div className="font-bold text-slate-900">PCEA Nyeri Presbytery</div>
                        <div className="text-[10px] text-slate-500 font-mono">Parish Ministry Bursary</div>
                      </div>
                      <span className="font-mono font-bold text-indigo-700">KES 30,000</span>
                    </div>
                    <div className="p-2.5 rounded-lg border border-slate-100 bg-slate-50 text-xs flex items-center justify-between">
                      <div>
                        <div className="font-bold text-slate-900">AIC Highlands Mission</div>
                        <div className="text-[10px] text-slate-500 font-mono">Missionary Candidate Grant</div>
                      </div>
                      <span className="font-mono font-bold text-indigo-700">KES 20,000</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Payments Ledger (7 cols) */}
              <div className="lg:col-span-7 space-y-3">
                <div className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>Recent Payments & Grants</span>
                  <span className="text-[11px] text-slate-400 font-mono">Audited Ledger</span>
                </div>

                <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                        <th className="py-2.5 px-3">Receipt / Date</th>
                        <th className="py-2.5 px-3">Seminarian</th>
                        <th className="py-2.5 px-3">Sponsor / Method</th>
                        <th className="py-2.5 px-3 text-right">Amount</th>
                        <th className="py-2.5 px-3 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(safeTheologyPayments.length > 0 ? safeTheologyPayments.slice(0, 4) : [
                        {
                          id: 'THEO-PAY-01',
                          receiptNumber: 'THEO-RCP-104',
                          studentName: 'Samuel Mwangi',
                          studentRegNo: 'THEO-2024-001',
                          date: '2025-05-10',
                          paymentMethod: 'DIOCESE_SPONSORSHIP',
                          sponsorName: 'ACK Diocese of Mt. Kenya Central',
                          amountPaid: 45000
                        },
                        {
                          id: 'THEO-PAY-02',
                          receiptNumber: 'THEO-RCP-103',
                          studentName: 'Grace Wanjiku',
                          studentRegNo: 'THEO-2024-002',
                          date: '2025-05-08',
                          paymentMethod: 'MPESA',
                          sponsorName: 'Grace Wanjiku (M-PESA)',
                          amountPaid: 25000
                        },
                        {
                          id: 'THEO-PAY-03',
                          receiptNumber: 'THEO-RCP-102',
                          studentName: 'John Kamau',
                          studentRegNo: 'THEO-2024-003',
                          date: '2025-05-04',
                          paymentMethod: 'BURSARY',
                          sponsorName: 'AIC Highlands Mission Grant',
                          amountPaid: 20000
                        }
                      ]).map((pay, pIdx) => (
                        <tr key={pIdx} className="hover:bg-slate-50/80 transition">
                          <td className="py-2.5 px-3">
                            <div className="font-mono font-bold text-slate-800">{pay.receiptNumber}</div>
                            <div className="text-[10px] text-slate-400">{pay.date}</div>
                          </td>
                          <td className="py-2.5 px-3">
                            <div className="font-bold text-slate-900">{pay.studentName}</div>
                            <div className="text-[10px] text-slate-500 font-mono">{pay.studentRegNo}</div>
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-800 border border-indigo-100">
                              {pay.paymentMethod.replace(/_/g, ' ')}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-700">
                            KES {pay.amountPaid.toLocaleString()}
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <button
                              onClick={() => setSelectedTheologyReceipt(pay as any)}
                              className="p-1 text-slate-400 hover:text-amber-800 rounded transition"
                              title="Print Official Receipt"
                            >
                              <Printer className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity Timeline Section */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-900">Recent Seminary Activity</h2>
                <p className="text-xs text-slate-500">Live operational events, admissions, verifications and ledger updates</p>
              </div>
              <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                Real-Time Seminary Feed
              </span>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {[
                {
                  icon: GraduationCap,
                  iconBg: 'bg-amber-100 text-amber-800',
                  title: 'New Student Admitted',
                  desc: 'Samuel Mwangi enrolled into Bachelor of Theology (B.Th.) on Ordination Track.',
                  time: 'Today, 10:15 AM'
                },
                {
                  icon: DollarSign,
                  iconBg: 'bg-emerald-100 text-emerald-800',
                  title: 'Fee Payment Received',
                  desc: 'KES 45,000 Diocesan grant recorded for Samuel Mwangi from ACK Diocese of Mt. Kenya Central.',
                  time: 'Today, 09:30 AM'
                },
                {
                  icon: BookOpen,
                  iconBg: 'bg-indigo-100 text-indigo-800',
                  title: 'Curriculum Unit Updated',
                  desc: 'BIB101 Greek Exegesis syllabus accredited for Semester 1 (15 lecture weeks).',
                  time: 'Yesterday, 04:20 PM'
                },
                {
                  icon: HeartHandshake,
                  iconBg: 'bg-amber-100 text-amber-800',
                  title: 'Practicum Report Submitted',
                  desc: "Expository sermon fieldwork log submitted for ACK St. Peter's Cathedral placement.",
                  time: 'Yesterday, 02:45 PM'
                },
                {
                  icon: Users,
                  iconBg: 'bg-slate-100 text-slate-800',
                  title: 'Faculty Member Appointed',
                  desc: 'Rev. Dr. Peter Mwangi confirmed as Lecturer in Biblical Languages & Exegesis.',
                  time: '2 days ago'
                }
              ].map((act, aIdx) => {
                const ActIcon = act.icon;
                return (
                  <div key={aIdx} className="py-3 flex items-start space-x-3 hover:bg-slate-50/50 rounded-xl px-2 transition">
                    <div className={`w-8 h-8 rounded-xl ${act.iconBg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                      <ActIcon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 space-y-0.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{act.title}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{act.time}</span>
                      </div>
                      <p className="text-slate-600 text-xs leading-relaxed">{act.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 1: PROGRAMS ACADEMIC HIERARCHY (Certificate -> Diploma -> Higher Diploma -> Bachelor of Theology) */}
      {activeSubTab === 'programs' && (
        <div className="space-y-6">
          {/* Controls and Hierarchy Guide */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center space-x-2 flex-1 max-w-md">
              <div className="relative w-full">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search theology programs, awards or codes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-500 font-semibold flex items-center space-x-1">
                <Filter className="h-3.5 w-3.5 text-slate-400" />
                <span>Level:</span>
              </span>
              <select
                value={selectedLevelFilter}
                onChange={(e) => setSelectedLevelFilter(e.target.value)}
                className="text-xs px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 font-semibold text-slate-700 focus:outline-none"
              >
                <option value="ALL">All Academic Levels</option>
                <option value="CERTIFICATE">Certificate Level (1 Year)</option>
                <option value="DIPLOMA">Diploma Level (2 Years)</option>
                <option value="HIGHER_DIPLOMA">Higher Diploma (3 Years)</option>
                <option value="BACHELORS">Bachelor of Theology (4 Years)</option>
              </select>
            </div>
          </div>

          {/* Programs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredPrograms.map((prog) => {
              const enrolledStudents = (theologyStudents || []).filter(s => s.programId === prog.id);
              const progUnits = prog.units || prog.curriculumUnits || [];
              const levelBadgeColor =
                prog.level === 'BACHELORS'
                  ? 'bg-purple-100 text-purple-900 border-purple-200'
                  : prog.level === 'HIGHER_DIPLOMA'
                  ? 'bg-indigo-100 text-indigo-900 border-indigo-200'
                  : prog.level === 'DIPLOMA'
                  ? 'bg-blue-100 text-blue-900 border-blue-200'
                  : 'bg-emerald-100 text-emerald-900 border-emerald-200';

              return (
                <div
                  key={prog.id}
                  className="bg-white rounded-2xl border border-slate-200 hover:border-amber-300 transition-all p-5 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${levelBadgeColor}`}>
                            {(prog.level || 'BACHELORS').replace('_', ' ')}
                          </span>
                          <span className="font-mono text-xs font-bold text-slate-500">{prog.code}</span>
                        </div>
                        <h3 className="text-base font-bold text-slate-900 mt-1.5">{prog.title}</h3>
                        <p className="text-xs text-amber-700 font-semibold">{prog.awardTitle || prog.title}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-slate-500">Tuition/Sem</span>
                        <div className="text-sm font-bold text-slate-900">
                          KES {(prog.tuitionPerSemester || 0).toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 mt-2.5 line-clamp-2 leading-relaxed">
                      {prog.description}
                    </p>

                    {/* Program Specifications */}
                    <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-100 text-[11px]">
                      <div className="bg-slate-50 rounded-xl p-2 text-center">
                        <span className="text-slate-400 block text-[10px]">Duration</span>
                        <strong className="text-slate-800">{prog.duration || prog.durationYears || '4 Years'}</strong>
                      </div>
                      <div className="bg-slate-50 rounded-xl p-2 text-center">
                        <span className="text-slate-400 block text-[10px]">Total Credits</span>
                        <strong className="text-slate-800">{prog.creditsRequired || prog.totalCreditHours || 120} Credits</strong>
                      </div>
                      <div className="bg-slate-50 rounded-xl p-2 text-center">
                        <span className="text-slate-400 block text-[10px]">Practicum Req.</span>
                        <strong className="text-amber-800">{prog.requiredPracticumHours || 200} Hours</strong>
                      </div>
                    </div>

                    {/* Units & Curriculum Sample */}
                    <div className="mt-3.5">
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                        <span className="font-semibold text-slate-700">Course Syllabi Highlights:</span>
                        <span>{progUnits.length} Core Modules</span>
                      </div>
                      <div className="space-y-1.5">
                        {progUnits.slice(0, 3).map((u) => (
                          <div
                            key={u.id || u.unitCode || u.code}
                            className="text-[11px] bg-slate-50 border border-slate-200/70 rounded-lg px-2.5 py-1.5 flex items-center justify-between"
                          >
                            <span className="font-mono text-slate-600 font-medium">{u.code || u.unitCode}</span>
                            <span className="text-slate-800 font-semibold truncate max-w-[210px]">{u.title || u.unitTitle}</span>
                            <span className="text-slate-500 text-[10px]">{u.creditHours || 3} CH</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div className="text-xs text-slate-500">
                      Enrolled: <strong className="text-slate-900">{enrolledStudents.length} Seminarians</strong>
                    </div>
                    <button
                      onClick={() => setSelectedProgramForView(prog)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-amber-50 hover:text-amber-800 text-slate-700 font-semibold text-xs rounded-xl flex items-center space-x-1 transition-colors"
                    >
                      <span>View Full Curriculum & Units</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUBTAB 2: SEMINARIANS & CANDIDATES DIRECTORY */}
      {activeSubTab === 'students' && (
        <div className="space-y-6">
          {/* Filtering */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center space-x-2 flex-1 max-w-md">
              <div className="relative w-full">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by name, reg number, parish or diocese..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center flex-wrap gap-2">
              <select
                value={selectedTrackFilter}
                onChange={(e) => setSelectedTrackFilter(e.target.value)}
                className="text-xs px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 font-semibold text-slate-700 focus:outline-none"
              >
                <option value="ALL">All Ministry Tracks</option>
                <option value="ORDINATION_PASTORAL">Ordination & Pastoral Ministry</option>
                <option value="BIBLICAL_LANGUAGES_EXEGESIS">Biblical Languages & Exegesis</option>
                <option value="CHRISTIAN_EDUCATION_YOUTH">Christian Education & Youth</option>
                <option value="CHAPLAINCY_COUNSELING">Chaplaincy & Counseling</option>
                <option value="MISSIOLOGY_EVANGELISM">Missiology & Cross-Cultural</option>
              </select>

              <button
                onClick={() => setShowStudentModal(true)}
                className="px-3.5 py-2 bg-amber-600 text-white rounded-xl text-xs font-bold hover:bg-amber-500 flex items-center space-x-1"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Admit Candidate</span>
              </button>
            </div>
          </div>

          {/* Students Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                  <tr>
                    <th className="py-3.5 px-4">Seminarian / Candidate</th>
                    <th className="py-3.5 px-4">Program & Level</th>
                    <th className="py-3.5 px-4">Ministry Track & Sponsoring Body</th>
                    <th className="py-3.5 px-4">Ordination Status</th>
                    <th className="py-3.5 px-4">Practicum Progress</th>
                    <th className="py-3.5 px-4">Fee Balance</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.map((stud) => {
                    const prog = (theologyPrograms || []).find(p => p.id === stud.programId);
                    const completed = stud.practicumHoursCompleted || 0;
                    const required = stud.requiredPracticumHours || 1;
                    const practicumPct = Math.min(100, Math.round((completed / required) * 100));
                    const trackName = (stud.ministryTrack || 'PASTORAL_MINISTRY').replace(/_/g, ' ');
                    const churchName = stud.churchAffiliation || stud.homeChurchDenomination || 'Local Church';
                    const parishName = stud.homeParish || stud.fieldWorkPlacement || stud.presbyteryOrDiocese || 'Parish';
                    const supervisor = stud.ordainingBishopOrSupervisor || stud.mentorPastorName || 'Parish Vicar';
                    const feeBal = stud.feeBalance ?? 0;
                    const billed = stud.totalBilled ?? 0;

                    return (
                      <tr key={stud.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900 text-xs">{stud.fullName}</div>
                          <div className="font-mono text-[10px] text-slate-400">{stud.regNo || stud.studentRegNo}</div>
                          <div className="text-[10px] text-slate-500">{stud.email}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-slate-800">{stud.programTitle}</div>
                          <div className="text-[10px] text-indigo-600 font-medium">
                            Year {stud.yearOfStudy || 1}, Sem {stud.semester || 1} ({prog?.level ? prog.level.replace('_', ' ') : 'Degree'})
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 text-[10px] font-semibold">
                            {trackName}
                          </span>
                          <div className="text-[11px] text-slate-600 mt-1 font-medium">{churchName}</div>
                          <div className="text-[10px] text-slate-400">Parish: {parishName}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          {stud.isOrdinationCandidate ? (
                            <span className="px-2.5 py-1 rounded-full bg-purple-100 text-purple-900 text-[10px] font-bold flex items-center space-x-1 w-max border border-purple-200">
                              <Cross className="h-3 w-3 text-purple-700" />
                              <span>Ordination Track</span>
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[10px] font-semibold">
                              Lay Ministry / Academic
                            </span>
                          )}
                          <div className="text-[10px] text-slate-400 mt-1">
                            Supervisor: {supervisor}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 min-w-[140px]">
                          <div className="flex items-center justify-between text-[11px] mb-1">
                            <span className="font-bold text-slate-800">{completed} hrs</span>
                            <span className="text-slate-400 text-[10px]">of {required}</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                practicumPct >= 80 ? 'bg-emerald-500' : practicumPct >= 40 ? 'bg-amber-500' : 'bg-rose-500'
                              }`}
                              style={{ width: `${practicumPct}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">{practicumPct}% completed</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className={`font-bold ${feeBal > 0 ? 'text-amber-700' : 'text-emerald-700'}`}>
                            KES {feeBal.toLocaleString()}
                          </div>
                          <div className="text-[10px] text-slate-400">Billed: KES {billed.toLocaleString()}</div>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => setSelectedStudentForView(stud)}
                            className="px-3 py-1.5 bg-amber-50 text-amber-800 hover:bg-amber-100 font-semibold rounded-xl text-xs transition-colors"
                          >
                            Dossier
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: MINISTRY PRACTICUM & FIELDWORK EVALUATION */}
      {activeSubTab === 'practicum' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <HeartHandshake className="h-5 w-5 text-amber-600" />
                <span>Fieldwork Ministry Logs & Dean Verification</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Every seminarian must log parish preaching, hospital visitation, youth mentoring, and community outreach.
              </p>
            </div>
            <button
              onClick={() => setShowPracticumModal(true)}
              className="px-4 py-2 bg-amber-600 text-white rounded-xl text-xs font-bold hover:bg-amber-500 flex items-center space-x-1.5 shadow-xs"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Record Practicum Log</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {(theologyPracticumLogs || []).map((log) => {
              const isVerified = log.status === 'VERIFIED';
              const isRevision = log.status === 'NEEDS_REVISION';
              const actType = (log.activityType || 'MINISTRY_PRACTICUM').replace(/_/g, ' ');
              const loc = log.churchOrLocation || 'Parish Placement';
              const pastor = log.supervisingPastorName || 'Supervisor';

              return (
                <div
                  key={log.id}
                  className={`bg-white rounded-2xl border p-5 shadow-xs transition-all ${
                    isVerified
                      ? 'border-emerald-200 bg-emerald-50/20'
                      : isRevision
                      ? 'border-amber-200 bg-amber-50/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2 flex-wrap">
                        <span className="font-bold text-slate-900 text-sm">{log.studentName}</span>
                        <span className="font-mono text-xs text-slate-400">({log.studentRegNo})</span>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-100 text-indigo-800">
                          {actType}
                        </span>
                        <span className="text-xs text-slate-500 flex items-center space-x-1 font-mono">
                          <Calendar className="h-3 w-3 text-slate-400" />
                          <span>{log.date}</span>
                        </span>
                      </div>

                      <div className="text-xs text-slate-600">
                        Placement Location: <strong className="text-slate-800">{loc}</strong> | Supervising Mentor: <strong className="text-slate-800">{pastor}</strong>
                      </div>

                      <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-xs text-slate-700 mt-2 leading-relaxed">
                        <span className="font-bold text-slate-800 block text-[11px] mb-0.5">Theological & Pastoral Reflection:</span>
                        "{log.reflectionNotes || 'No notes provided'}"
                      </div>

                      {log.feedbackSupervisor && (
                        <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 mt-2">
                          <span className="font-bold block text-[11px]">Dean & Supervisor Assessment Feedback:</span>
                          "{log.feedbackSupervisor}"
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col items-end justify-between self-stretch">
                      <div className="text-right">
                        <div className="text-2xl font-black text-amber-700">{log.hoursLogged || 0} <span className="text-xs font-normal text-slate-500">Hrs</span></div>
                        <div className="mt-1">
                          {isVerified ? (
                            <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center space-x-1 border border-emerald-200">
                              <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                              <span>Verified by Dean</span>
                            </span>
                          ) : isRevision ? (
                            <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 font-bold text-[10px] border border-amber-200">
                              Needs Revision
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px]">
                              Logged (Pending Approval)
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Dean Review Action Buttons */}
                      {!isVerified && (
                        <div className="flex items-center space-x-2 mt-4">
                          <button
                            onClick={() => {
                              setPracticumFeedbackModal({ log, action: 'NEEDS_REVISION' });
                              setDeanFeedbackText(log.feedbackSupervisor || '');
                            }}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
                          >
                            Feedback
                          </button>
                          <button
                            onClick={() => {
                              setPracticumFeedbackModal({ log, action: 'VERIFIED' });
                              setDeanFeedbackText(log.feedbackSupervisor || 'Fieldwork verified and accredited toward graduation practicum quota.');
                            }}
                            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-xs flex items-center space-x-1"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>Verify Hours</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUBTAB 4: DIVINITY & PATRISTICS LIBRARY */}
      {activeSubTab === 'library' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center space-x-2 flex-1 max-w-md">
              <div className="relative w-full">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search theology books, lexicons, church fathers, authors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center flex-wrap gap-2">
              <select
                value={selectedResourceCategory}
                onChange={(e) => setSelectedResourceCategory(e.target.value)}
                className="text-xs px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 font-semibold text-slate-700 focus:outline-none"
              >
                <option value="ALL">All Disciplines</option>
                <option value="BIBLICAL_LANGUAGES">Biblical Hebrew & Greek</option>
                <option value="SYSTEMATIC_THEOLOGY">Systematic Theology & Dogmatics</option>
                <option value="CHURCH_HISTORY_PATRISTICS">Patristics & Church History</option>
                <option value="HERMENEUTICS_EXEGESIS">Hermeneutics & Exegesis</option>
                <option value="PASTORAL_HOMILETICS">Pastoral Ministry & Homiletics</option>
                <option value="MISSIOLOGY_ETHICS">Missiology & Christian Ethics</option>
              </select>

              <button
                onClick={() => setShowResourceModal(true)}
                className="px-3.5 py-2 bg-amber-600 text-white rounded-xl text-xs font-bold hover:bg-amber-500 flex items-center space-x-1"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Add Theological Resource</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredResources.map((res) => (
              <div
                key={res.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:border-amber-300 transition-colors"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 text-[10px] font-bold font-mono">
                      {res.shelfLocation}
                    </span>
                    {res.isDigitalAvailable && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-semibold flex items-center space-x-1">
                        <Sparkles className="h-3 w-3" />
                        <span>eBook / PDF</span>
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm mt-2 line-clamp-2">{res.title}</h3>
                  <p className="text-xs text-slate-500 mt-1">Author: <strong className="text-slate-700">{res.author}</strong></p>
                  <p className="text-[11px] text-slate-600 mt-2 line-clamp-3 leading-relaxed">{res.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">
                    Copies: <strong className="text-slate-800">{res.availableCopies} / {res.totalCopies}</strong>
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-mono text-[10px]">
                    {res.isbn}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 5: GREEK & HEBREW EXEGESIS & CURRICULUM EXPLORER */}
      {activeSubTab === 'curriculum' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Koine Greek Exegetical Track */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
              <div className="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center font-serif text-lg font-bold text-indigo-800">
                  Ἑλλ
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Koine Greek Exegesis Track (B.Th.)</h3>
                  <p className="text-xs text-slate-500">Grammar, Syntax, and Nestle-Aland (NA28) Exegesis</p>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex justify-between font-bold text-slate-800">
                    <span>GRK 201: Elementary Greek Grammar I</span>
                    <span className="font-mono text-indigo-600">3 Credits</span>
                  </div>
                  <p className="text-slate-500 text-[11px] mt-1">Alphabet, 1st & 2nd Declension nouns, present active/middle/passive verbs, basic vocabulary.</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex justify-between font-bold text-slate-800">
                    <span>GRK 202: Elementary Greek Grammar II</span>
                    <span className="font-mono text-indigo-600">3 Credits</span>
                  </div>
                  <p className="text-slate-500 text-[11px] mt-1">Aorist, Perfect, Subjunctive, Participles, Mi-verbs, and translation of 1 John.</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex justify-between font-bold text-slate-800">
                    <span>GRK 301: Greek Syntax & Exegesis of Romans</span>
                    <span className="font-mono text-indigo-600">3 Credits</span>
                  </div>
                  <p className="text-slate-500 text-[11px] mt-1">Advanced syntax based on Wallace, textual criticism apparatus, and expository sermon prep.</p>
                </div>
              </div>
            </div>

            {/* Biblical Hebrew Exegetical Track */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
              <div className="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center font-serif text-lg font-bold text-amber-800">
                  עִבְ
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Biblical Hebrew Exegesis Track (B.Th.)</h3>
                  <p className="text-xs text-slate-500">Biblia Hebraica Stuttgartensia (BHS) and Old Testament Exegesis</p>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex justify-between font-bold text-slate-800">
                    <span>HEB 201: Biblical Hebrew Grammar I</span>
                    <span className="font-mono text-amber-700">3 Credits</span>
                  </div>
                  <p className="text-slate-500 text-[11px] mt-1">Hebrew Alef-Bet, vowel pointing, nominal sentences, Qal Perfect and Imperfect conjugations.</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex justify-between font-bold text-slate-800">
                    <span>HEB 202: Biblical Hebrew Grammar II</span>
                    <span className="font-mono text-amber-700">3 Credits</span>
                  </div>
                  <p className="text-slate-500 text-[11px] mt-1">Derived stems (Niphal, Piel, Pual, Hiphil, Hophal, Hithpael), weak verbs, and Genesis translation.</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex justify-between font-bold text-slate-800">
                    <span>HEB 301: Old Testament Exegesis: Psalms & Isaiah</span>
                    <span className="font-mono text-amber-700">3 Credits</span>
                  </div>
                  <p className="text-slate-500 text-[11px] mt-1">Hebrew poetry, parallelism, Masoretic accents, and theological exposition for parish ministry.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB: FACULTY & STAFF */}
      {activeSubTab === 'staff' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex justify-between items-center">
            <div>
              <h2 className="text-base font-bold text-slate-900">Seminary Faculty & Lecturers</h2>
              <p className="text-xs text-slate-500">Theological professors, Greek/Hebrew exegesis instructors, and pastoral mentors</p>
            </div>
            <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-xl text-xs font-bold">
              3 Active Faculty Members
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center text-base">
                  Dr
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Rev. Dr. Samuel Kariuki</h3>
                  <p className="text-xs text-amber-700 font-medium">Principal & Systematic Theology</p>
                </div>
              </div>
              <p className="text-xs text-slate-500">Ph.D. in Dogmatic Theology, Ridley Hall Cambridge. Ordained Priest with 22 years in seminary formation.</p>
              <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                Email: s.kariuki@divinity.ac.ke • Ext: 101
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-800 font-bold flex items-center justify-center text-base">
                  Pr
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Dr. Elizabeth Wanjiru</h3>
                  <p className="text-xs text-indigo-700 font-medium">Old Testament & Hebrew Exegesis</p>
                </div>
              </div>
              <p className="text-xs text-slate-500">Ph.D. in Near Eastern Languages & Biblical Hebrew. Specialist in Masoretic text and Isaiah manuscripts.</p>
              <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                Email: e.wanjiru@divinity.ac.ke • Ext: 104
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-base">
                  Rt
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Ven. James Omondi</h3>
                  <p className="text-xs text-emerald-700 font-medium">Director of Pastoral Fieldwork</p>
                </div>
              </div>
              <p className="text-xs text-slate-500">M.Div., St. Paul's University Limuru. Supervises ministry practicum and parish placements.</p>
              <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                Email: j.omondi@divinity.ac.ke • Ext: 109
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB: SEMINARY REPORTS */}
      {activeSubTab === 'reports' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 mb-1">Seminary Academic & Financial Reports</h2>
            <p className="text-xs text-slate-500 mb-4">Generate certified transcripts, ordination clearance letters, and diocesan financial summaries.</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button onClick={() => window.print()} className="p-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl text-left transition group">
                <FileText className="h-6 w-6 text-amber-600 mb-2 group-hover:scale-110 transition" />
                <h3 className="font-bold text-slate-900 text-xs">Seminarian Transcripts (B.Th.)</h3>
                <p className="text-[11px] text-slate-500 mt-1">Export official semester grade sheets and credit hours.</p>
              </button>
              <button onClick={() => window.print()} className="p-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl text-left transition group">
                <Award className="h-6 w-6 text-indigo-600 mb-2 group-hover:scale-110 transition" />
                <h3 className="font-bold text-slate-900 text-xs">Ordination Candidate Clearance</h3>
                <p className="text-[11px] text-slate-500 mt-1">Verify practicum hours, dogmatic exams, and bishop approval.</p>
              </button>
              <button onClick={() => window.print()} className="p-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl text-left transition group">
                <Receipt className="h-6 w-6 text-emerald-600 mb-2 group-hover:scale-110 transition" />
                <h3 className="font-bold text-slate-900 text-xs">Diocesan Bursary & Tithing Ledger</h3>
                <p className="text-[11px] text-slate-500 mt-1">Consolidated financial audit for synod sponsors.</p>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB: COMMUNICATION / SMS */}
      {activeSubTab === 'sms' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs max-w-2xl space-y-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Broadcast SMS to Seminarians & Diocesan Sponsors</h2>
              <p className="text-xs text-slate-500 mt-0.5">Send urgent chapel announcements, practicum deadlines, or exam timetables.</p>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Recipient Group</label>
                <select className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-medium">
                  <option>All Active Seminarians ({theologyStudents.length})</option>
                  <option>Ordination Candidates Only</option>
                  <option>Diocesan Sponsors & Bishop Representatives</option>
                  <option>Faculty & Department Staff</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Message Content</label>
                <textarea rows={4} placeholder="Type announcement or reminder message here..." className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium" defaultValue="Greetings in Christ. This is a reminder for the upcoming Patristics Exegesis Seminar and Morning Prayer Chapel at 7:00 AM sharp." />
              </div>
              <button onClick={() => alert('SMS broadcast successfully dispatched to all recipients!')} className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl shadow-xs transition">
                Send SMS Broadcast
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB: SEMINARY SETTINGS */}
      {activeSubTab === 'settings' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs max-w-3xl space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Seminary Settings & Institution Profile</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Configure official seminary branding, crest logo, academic term parameters, and institutional contact details.
            </p>
          </div>

          {settingsSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-semibold flex items-center space-x-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>Seminary profile and settings successfully updated!</span>
            </div>
          )}

          <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Seminary / Institution Legal Name *</label>
                <input
                  type="text"
                  required
                  value={settingsName}
                  onChange={(e) => setSettingsName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none font-medium text-slate-900"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Institutional Motto</label>
                <input
                  type="text"
                  value={settingsMotto}
                  onChange={(e) => setSettingsMotto(e.target.value)}
                  placeholder="e.g. Equipping Leaders for Word and Ministry"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Official Crest / Logo Image URL</label>
                <input
                  type="url"
                  value={settingsLogo}
                  onChange={(e) => setSettingsLogo(e.target.value)}
                  placeholder="https://example.com/logo.png"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono text-slate-600"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Public Website</label>
                <input
                  type="text"
                  value={settingsWebsite}
                  onChange={(e) => setSettingsWebsite(e.target.value)}
                  placeholder="https://divinity.ac.ke"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono text-slate-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={settingsPhone}
                  onChange={(e) => setSettingsPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Contact Email</label>
                <input
                  type="email"
                  value={settingsEmail}
                  onChange={(e) => setSettingsEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Academic Year</label>
                <input
                  type="text"
                  value={settingsAcademicYear}
                  onChange={(e) => setSettingsAcademicYear(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Physical Address / Diocese Location</label>
              <input
                type="text"
                value={settingsAddress}
                onChange={(e) => setSettingsAddress(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Academic Semester / Term</label>
                <select
                  value={settingsSemester}
                  onChange={(e) => setSettingsSemester(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-medium text-slate-800 focus:outline-none"
                >
                  <option value="SEMESTER_1">Semester 1 (Epiphany / Lent Term)</option>
                  <option value="SEMESTER_2">Semester 2 (Trinity Term)</option>
                  <option value="SEMESTER_3">Semester 3 (Advent Term / In-Service)</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Primary Brand Accent Color</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={settingsPrimaryColor}
                    onChange={(e) => setSettingsPrimaryColor(e.target.value)}
                    className="w-10 h-9 rounded-xl border border-slate-200 cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    value={settingsPrimaryColor}
                    onChange={(e) => setSettingsPrimaryColor(e.target.value)}
                    className="flex-1 px-3 py-2 border border-slate-200 rounded-xl font-mono text-xs uppercase"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Institution Type (Fixed)</label>
                <input
                  type="text"
                  disabled
                  value="THEOLOGICAL SEMINARY / COLLEGE"
                  className="w-full px-3 py-2 border border-slate-200 bg-slate-100 rounded-xl font-semibold text-slate-600 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl shadow-md transition-all transform active:scale-95 flex items-center space-x-2"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Save Seminary Profile & Settings</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SUBTAB: SEMINARY FEES & DIOCESAN SPONSORSHIP */}
      {activeSubTab === 'fees' && (
        <div className="space-y-6">
          {/* Header & Quick Actions */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <Receipt className="h-5 w-5 text-amber-600" />
                <span>Seminary Tuition, Fees & Diocesan Sponsorships</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Official billing for certificate, diploma, and B.Th. seminarians with synod sponsorship allocations
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowTheologyInvoiceModal(true)}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-xs flex items-center space-x-1.5"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Issue Invoice</span>
              </button>
              <button
                onClick={() => setShowTheologyPaymentModal(true)}
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-xs flex items-center space-x-1.5"
              >
                <DollarSign className="h-4 w-4" />
                <span>Record Bursary / Payment</span>
              </button>
            </div>
          </div>

          {/* Invoices Ledger Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Seminary Invoices Ledger</h3>
                <p className="text-xs text-slate-500">Term invoices generated for ministerial and theological students</p>
              </div>
              <span className="text-xs bg-slate-100 text-slate-700 font-bold px-2.5 py-1 rounded-full">
                {safeTheologyInvoices.length} Invoices
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                  <tr>
                    <th className="py-3 px-4">Invoice #</th>
                    <th className="py-3 px-4">Seminarian</th>
                    <th className="py-3 px-4">Program</th>
                    <th className="py-3 px-4">Term / Year</th>
                    <th className="py-3 px-4">Total Fee</th>
                    <th className="py-3 px-4">Paid</th>
                    <th className="py-3 px-4">Outstanding</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {safeTheologyInvoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50/60">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">{inv.invoiceNumber}</td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-800">{inv.studentName}</div>
                        <div className="text-[11px] font-mono text-slate-400">{inv.studentRegNo}</div>
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-700">{inv.programTitle}</td>
                      <td className="py-3 px-4 text-slate-600">Sem {inv.semester} • {inv.academicYear}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">KES {(inv.totalAmount || 0).toLocaleString()}</td>
                      <td className="py-3 px-4 font-bold text-emerald-700">KES {(inv.paidAmount || 0).toLocaleString()}</td>
                      <td className="py-3 px-4 font-bold text-rose-700">KES {(inv.balance || 0).toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          inv.status === 'PAID'
                            ? 'bg-emerald-100 text-emerald-800'
                            : inv.status === 'PARTIALLY_PAID'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => {
                            setTheoPayStudentId(inv.studentId);
                            setTheoPayInvoiceId(inv.id);
                            setTheoPayAmount(inv.balance || 0);
                            setShowTheologyPaymentModal(true);
                          }}
                          className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-lg text-[11px] font-bold transition-colors"
                        >
                          Receive Payment
                        </button>
                      </td>
                    </tr>
                  ))}
                  {safeTheologyInvoices.length === 0 && (
                    <tr>
                      <td colSpan={9} className="text-center py-8 text-slate-400 text-xs">
                        No seminary invoices issued yet. Click "Issue Invoice" to generate fees for enrolled candidates.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Payments & Receipts Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Seminary Payments & Diocesan Bursary Grants</h3>
                <p className="text-xs text-slate-500">Official cashiers receipts, M-Pesa statements, and diocesan sponsor disbursements</p>
              </div>
              <span className="text-xs bg-slate-100 text-slate-700 font-bold px-2.5 py-1 rounded-full">
                {safeTheologyPayments.length} Receipts
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                  <tr>
                    <th className="py-3 px-4">Receipt #</th>
                    <th className="py-3 px-4">Seminarian</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Method & Channel</th>
                    <th className="py-3 px-4">Reference / Sponsor</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4 text-right">Printout</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {safeTheologyPayments.map((pay) => (
                    <tr key={pay.id} className="hover:bg-slate-50/60">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">{pay.receiptNumber}</td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-800">{pay.studentName}</div>
                        <div className="text-[11px] font-mono text-slate-400">{pay.studentRegNo}</div>
                      </td>
                      <td className="py-3 px-4 font-black text-emerald-700">KES {(pay.amount || 0).toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          pay.paymentMethod === 'DIOCESE_SPONSORSHIP' || pay.paymentMethod === 'BURSARY'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-slate-100 text-slate-800'
                        }`}>
                          {pay.paymentMethod.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-mono text-slate-800">{pay.reference}</div>
                        {pay.sponsorName && (
                          <div className="text-[11px] text-indigo-600 font-medium">{pay.sponsorName}</div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">{pay.paymentDate}</td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setSelectedTheologyReceipt(pay)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-bold flex items-center space-x-1 inline-flex"
                        >
                          <Printer className="h-3.5 w-3.5 text-slate-500" />
                          <span>Receipt</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                  {safeTheologyPayments.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-slate-400 text-xs">
                        No payments recorded yet. Record student fees or diocesan sponsorships to view official receipts.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB: LECTURE & CHAPEL TIMETABLE */}
      {activeSubTab === 'timetable' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Seminary Lecture & Chapel Timetable</h2>
              <p className="text-xs text-slate-500">Weekly schedule of theological units, morning devotions, and faculty seminars</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono bg-amber-50 text-amber-900 border border-amber-200 px-3 py-1.5 rounded-xl font-bold">
                Semester 1 • Academic Year 2025/2026
              </span>
              <button
                onClick={() => window.print()}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center space-x-1"
              >
                <Printer className="h-3.5 w-3.5 text-slate-500" />
                <span>Print Roster</span>
              </button>
            </div>
          </div>

          {/* Timetable Schedule Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            {[
              {
                day: 'Monday',
                events: [
                  { time: '07:00 - 08:00', title: 'Morning Matins & Chapel', leader: 'Chaplaincy Team', venue: 'Main Chapel', type: 'chapel' },
                  { time: '08:30 - 10:30', title: 'BIB101: Greek Exegesis', leader: 'Rev. Dr. Peter Mwangi', venue: 'Lecture Hall 1', type: 'lecture' },
                  { time: '11:00 - 13:00', title: 'SYS301: Systematic Dogmatics', leader: 'Dean of Divinity', venue: 'Lecture Hall 2', type: 'lecture' },
                  { time: '14:00 - 16:00', title: 'MIS202: Christian Missions', leader: 'Pastor James Kariuki', venue: 'Seminar Rm A', type: 'lecture' },
                  { time: '16:30 - 17:15', title: 'Evening Evensong', leader: 'Student Cantor', venue: 'Chapel', type: 'chapel' }
                ]
              },
              {
                day: 'Tuesday',
                events: [
                  { time: '07:00 - 08:00', title: 'Morning Matins & Chapel', leader: 'Student Preacher', venue: 'Main Chapel', type: 'chapel' },
                  { time: '08:30 - 10:30', title: 'OTH202: Old Testament Wisdom', leader: 'Canon David Murithi', venue: 'Hall 1', type: 'lecture' },
                  { time: '11:00 - 13:00', title: 'PAS401: Pastoral Counseling', leader: 'Archdeacon Joseph', venue: 'Hall 2', type: 'lecture' },
                  { time: '14:00 - 16:00', title: 'PAT305: Patristic Theology', leader: 'Dr. Elizabeth Njeri', venue: 'Library Annex', type: 'seminar' }
                ]
              },
              {
                day: 'Wednesday',
                events: [
                  { time: '07:00 - 08:00', title: 'Holy Communion & Liturgy', leader: 'Bishop / Provost', venue: 'Main Chapel', type: 'chapel' },
                  { time: '08:30 - 10:30', title: 'BIB201: Hebrew Grammar', leader: 'Rev. Dr. Peter Mwangi', venue: 'Hall 1', type: 'lecture' },
                  { time: '11:00 - 13:00', title: 'ETH302: Christian Ethics', leader: 'Canon David Murithi', venue: 'Hall 2', type: 'lecture' },
                  { time: '14:00 - 17:00', title: 'Ministry Practicum Fieldwork', leader: 'Parish Placements', venue: 'Diocese Parishes', type: 'practicum' }
                ]
              },
              {
                day: 'Thursday',
                events: [
                  { time: '07:00 - 08:00', title: 'Morning Matins & Intercession', leader: 'Seminarian Fellowship', venue: 'Main Chapel', type: 'chapel' },
                  { time: '08:30 - 10:30', title: 'HOM402: Expository Preaching', leader: 'Visiting Preacher', venue: 'Chapel Hall', type: 'seminar' },
                  { time: '11:00 - 13:00', title: 'HIS103: Early Church History', leader: 'Dean of Divinity', venue: 'Hall 2', type: 'lecture' },
                  { time: '14:00 - 16:00', title: 'Divinity Research & Library', leader: 'Library Curator', venue: 'Seminary Library', type: 'library' }
                ]
              },
              {
                day: 'Friday',
                events: [
                  { time: '07:00 - 08:00', title: 'Faculty & Student Devotions', leader: 'Seminary Principal', venue: 'Main Chapel', type: 'chapel' },
                  { time: '08:30 - 11:00', title: 'Colloquium: African Theology', leader: 'All Faculty & Deans', venue: 'Assembly Hall', type: 'seminar' },
                  { time: '11:30 - 13:00', title: 'Dean of Students Briefing', leader: 'Academic Registrar', venue: 'Hall 1', type: 'lecture' },
                  { time: '14:00 - 17:00', title: 'Weekend Parish Preparation', leader: 'Ordination Track', venue: 'Parish Allocations', type: 'practicum' }
                ]
              }
            ].map((col, cIdx) => (
              <div key={cIdx} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 font-bold text-slate-800 text-sm flex items-center justify-between">
                  <span>{col.day}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{col.events.length} Sessions</span>
                </div>
                <div className="p-3 space-y-2.5">
                  {col.events.map((evt, eIdx) => (
                    <div
                      key={eIdx}
                      className={`p-2.5 rounded-xl border text-xs space-y-1 ${
                        evt.type === 'chapel'
                          ? 'bg-amber-50/60 border-amber-200 text-amber-950'
                          : evt.type === 'practicum'
                          ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                          : evt.type === 'seminar'
                          ? 'bg-indigo-50/60 border-indigo-200 text-indigo-950'
                          : 'bg-slate-50/70 border-slate-200 text-slate-900'
                      }`}
                    >
                      <div className="text-[10px] font-mono font-bold flex items-center justify-between">
                        <span className="opacity-70">{evt.time}</span>
                        <span className="uppercase text-[9px] px-1.5 py-0.2 rounded font-bold bg-white/70">
                          {evt.type}
                        </span>
                      </div>
                      <div className="font-bold">{evt.title}</div>
                      <div className="text-[11px] opacity-80 flex items-center justify-between">
                        <span>{evt.leader}</span>
                        <span className="font-mono text-[10px]">{evt.venue}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB: ATTENDANCE & CHAPEL ROSTER */}
      {activeSubTab === 'attendance' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Chapel & Lecture Attendance Registry</h2>
              <p className="text-xs text-slate-500">Monitor seminarian spiritual formation, chapel attendance, and academic presence</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono bg-emerald-50 text-emerald-900 border border-emerald-200 px-3 py-1.5 rounded-xl font-bold">
                Daily Roll Call: 96.4% Compliance
              </span>
              <button
                onClick={() => alert('All seminarians marked present for the selected morning devotions session.')}
                className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition shadow-xs"
              >
                Mark All Present
              </button>
            </div>
          </div>

          {/* Roster Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1">
              <label className="text-[11px] font-bold text-slate-600 uppercase">Selected Date</label>
              <input
                type="date"
                defaultValue={new Date().toISOString().split('T')[0]}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-mono"
              />
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1">
              <label className="text-[11px] font-bold text-slate-600 uppercase">Session / Unit</label>
              <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs">
                <option>Morning Matins & Chapel Devotions (07:00 AM)</option>
                <option>BIB101: Greek Exegesis of John (08:30 AM)</option>
                <option>SYS301: Systematic Dogmatics (11:00 AM)</option>
                <option>Evening Evensong & Compline (04:30 PM)</option>
              </select>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1">
              <label className="text-[11px] font-bold text-slate-600 uppercase">Target Cohort</label>
              <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs">
                <option>All Enrolled Seminarians (Certificate to B.Th.)</option>
                <option>Ordination Candidates Only</option>
                <option>Degree Cohort (B.Th.)</option>
                <option>Diploma & Higher Diploma</option>
              </select>
            </div>
          </div>

          {/* Attendance Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                  <th className="py-3 px-4">Seminarian</th>
                  <th className="py-3 px-4">Programme & Track</th>
                  <th className="py-3 px-4">Diocese / Parish</th>
                  <th className="py-3 px-4">Chapel Metric</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(theologyStudents && theologyStudents.length > 0 ? theologyStudents : [
                  { id: '1', fullName: 'Samuel Mwangi', admissionNumber: 'THEO-2024-001', churchAffiliation: "ACK St. Peter's Cathedral Nyeri", ordinationTrack: true, attendanceRate: '98%' },
                  { id: '2', fullName: 'Grace Wanjiku', admissionNumber: 'THEO-2024-002', churchAffiliation: 'PCEA Nyeri Town Parish', ordinationTrack: false, attendanceRate: '95%' },
                  { id: '3', fullName: 'John Kamau', admissionNumber: 'THEO-2024-003', churchAffiliation: 'AIC Highlands Mission', ordinationTrack: true, attendanceRate: '92%' }
                ]).map((stu: any, sIdx: number) => (
                  <tr key={sIdx} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{stu.fullName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{stu.admissionNumber}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-slate-700">
                        {stu.ordinationTrack ? 'Ordination Candidate' : 'Christian Ministry Track'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{stu.churchAffiliation || 'ACK Diocese of Mt. Kenya Central'}</td>
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-amber-800">{stu.attendanceRate || '96%'}</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        Present
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-slate-400 text-[11px]">
                      On Time
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {showProgramModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Add Theology Academic Program</h3>
                <p className="text-xs text-slate-500">Configure certificate, diploma, or degree requirements</p>
              </div>
              <button onClick={() => setShowProgramModal(false)} className="text-slate-400 hover:text-slate-700 text-sm">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProgram} className="py-4 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Program Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. BTH or DIP-TH"
                    value={progCode}
                    onChange={(e) => setProgCode(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl uppercase font-mono focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Academic Level *</label>
                  <select
                    value={progLevel}
                    onChange={(e) => setProgLevel(e.target.value as TheologyProgramLevel)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-semibold text-slate-800 focus:outline-none"
                  >
                    <option value="CERTIFICATE">Certificate Level (1 Year)</option>
                    <option value="DIPLOMA">Diploma Level (2 Years)</option>
                    <option value="HIGHER_DIPLOMA">Higher Diploma Level (3 Years)</option>
                    <option value="BACHELORS">Bachelor of Theology (4 Years)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Program Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bachelor of Theology (B.Th.)"
                  value={progTitle}
                  onChange={(e) => setProgTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Duration</label>
                  <input
                    type="text"
                    value={progDuration}
                    onChange={(e) => setProgDuration(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Required Credits</label>
                  <input
                    type="number"
                    value={progCredits}
                    onChange={(e) => setProgCredits(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Practicum Hours</label>
                  <input
                    type="number"
                    value={progPracticumHours}
                    onChange={(e) => setProgPracticumHours(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none font-bold text-amber-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tuition Per Semester (KES)</label>
                  <input
                    type="number"
                    value={progTuition}
                    onChange={(e) => setProgTuition(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Award Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Bachelor of Theology"
                    value={progAward}
                    onChange={(e) => setProgAward(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Program Overview & Description</label>
                <textarea
                  rows={2}
                  placeholder="Outline curriculum focus, accreditation, and ordination alignment..."
                  value={progDescription}
                  onChange={(e) => setProgDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>

              <div className="pt-3 flex justify-end space-x-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowProgramModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-bold shadow-xs"
                >
                  Publish Program
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADMIT SEMINARIAN */}
      {showStudentModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Admit Theology Seminarian / Candidate</h3>
                <p className="text-xs text-slate-500">Record academic details, parish sponsorship, and ordination track</p>
              </div>
              <button onClick={() => setShowStudentModal(false)} className="text-slate-400 hover:text-slate-700 text-sm">
                ✕
              </button>
            </div>

            <form onSubmit={handleAdmitStudent} className="py-4 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bro. Emmanuel Mwangi"
                    value={studentFullName}
                    onChange={(e) => setStudentFullName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Reg Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. TH/2025/089"
                    value={studentRegNo}
                    onChange={(e) => setStudentRegNo(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono uppercase focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Enrolled Theology Program *</label>
                <select
                  value={studentProgId}
                  onChange={(e) => setStudentProgId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-semibold text-slate-800 focus:outline-none"
                >
                  {theologyPrograms.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title} ({p.level.replace('_', ' ')}) - {p.code}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Ministry Track</label>
                  <select
                    value={studentTrack}
                    onChange={(e) => setStudentTrack(e.target.value as TheologyMinistryTrack)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none"
                  >
                    <option value="ORDINATION_PASTORAL">Ordination & Pastoral Ministry</option>
                    <option value="BIBLICAL_LANGUAGES_EXEGESIS">Biblical Languages & Exegesis</option>
                    <option value="CHRISTIAN_EDUCATION_YOUTH">Christian Education & Youth</option>
                    <option value="CHAPLAINCY_COUNSELING">Chaplaincy & Counseling</option>
                    <option value="MISSIOLOGY_EVANGELISM">Missiology & Cross-Cultural</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Denomination / Synod</label>
                  <input
                    type="text"
                    placeholder="e.g. Anglican / PCEA / Baptist"
                    value={studentDenomination}
                    onChange={(e) => setStudentDenomination(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Home Parish / Local Church</label>
                  <input
                    type="text"
                    placeholder="e.g. St. James Cathedral"
                    value={studentParish}
                    onChange={(e) => setStudentParish(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Ordaining Bishop / Supervisor</label>
                  <input
                    type="text"
                    placeholder="e.g. Rt. Rev. Bishop Joshua"
                    value={studentSupervisor}
                    onChange={(e) => setStudentSupervisor(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={studentPhone}
                    onChange={(e) => setStudentPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Year of Study</label>
                  <select
                    value={studentYear}
                    onChange={(e) => setStudentYear(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none"
                  >
                    <option value={1}>Year 1</option>
                    <option value={2}>Year 2</option>
                    <option value={3}>Year 3</option>
                    <option value={4}>Year 4</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Semester</label>
                  <select
                    value={studentSemester}
                    onChange={(e) => setStudentSemester(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none"
                  >
                    <option value={1}>Semester 1</option>
                    <option value={2}>Semester 2</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="ordinationCandidate"
                  checked={studentOrdinationCandidate}
                  onChange={(e) => setStudentOrdinationCandidate(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500 h-4 w-4"
                />
                <label htmlFor="ordinationCandidate" className="text-xs font-semibold text-slate-800">
                  Recognized as Official Ordination Candidate (Requires Archdeaconry Clearance)
                </label>
              </div>

              <div className="pt-3 flex justify-end space-x-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowStudentModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-bold shadow-xs"
                >
                  Enroll Seminarian
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: LOG MINISTRY PRACTICUM */}
      {showPracticumModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Record Ministry Fieldwork Session</h3>
                <p className="text-xs text-slate-500">Parish preaching, hospital pastoral care, or discipleship hours</p>
              </div>
              <button onClick={() => setShowPracticumModal(false)} className="text-slate-400 hover:text-slate-700 text-sm">
                ✕
              </button>
            </div>

            <form onSubmit={handleRecordPracticum} className="py-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Seminarian *</label>
                <select
                  value={pracStudentId}
                  onChange={(e) => setPracStudentId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-semibold text-slate-800 focus:outline-none"
                >
                  {theologyStudents.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.fullName} ({s.regNo}) - {s.programTitle}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Activity Category *</label>
                  <select
                    value={pracActivity}
                    onChange={(e) => setPracActivity(e.target.value as MinistryPracticumLog['activityType'])}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none"
                  >
                    <option value="SUNDAY_EXPOSITORY_PREACHING">Sunday Expository Preaching</option>
                    <option value="HOSPITAL_PASTORAL_CARE">Hospital & Hospice Visitation</option>
                    <option value="YOUTH_DISCIPLESHIP_MENTORING">Youth & Student Discipleship</option>
                    <option value="COMMUNITY_MISSION_EVANGELISM">Community Outreach & Evangelism</option>
                    <option value="LITURGICAL_SERVICE_LEADING">Liturgical Service Leading</option>
                    <option value="PRISON_MINISTRY_VISITATION">Prison Ministry</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Hours Completed *</label>
                  <input
                    type="number"
                    min={1}
                    max={40}
                    required
                    value={pracHours}
                    onChange={(e) => setPracHours(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold text-amber-700 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Church / Fieldwork Placement *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. St. Peter's Anglican Parish"
                    value={pracLocation}
                    onChange={(e) => setPracLocation(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Fieldwork Supervisor</label>
                  <input
                    type="text"
                    placeholder="e.g. Ven. Archdeacon Samuel"
                    value={pracSupervisorName}
                    onChange={(e) => setPracSupervisorName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Theological & Pastoral Reflection</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Record sermon text (e.g. Romans 8:28-39), pastoral counseling case notes, and personal learnings..."
                  value={pracReflection}
                  onChange={(e) => setPracReflection(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>

              <div className="pt-3 flex justify-end space-x-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowPracticumModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-bold shadow-xs"
                >
                  Submit Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: DEAN FEEDBACK & VERIFICATION MODAL */}
      {practicumFeedbackModal.log && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <h3 className="font-bold text-slate-900 text-base mb-1">
              Dean & Faculty Verification
            </h3>
            <p className="text-xs text-slate-500 mb-3">
              Evaluating {practicumFeedbackModal.log.hoursLogged} hours for {practicumFeedbackModal.log.studentName}
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Verification Status</label>
                <select
                  value={practicumFeedbackModal.action}
                  onChange={(e) => setPracticumFeedbackModal(prev => ({ ...prev, action: e.target.value as 'VERIFIED' | 'NEEDS_REVISION' }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none"
                >
                  <option value="VERIFIED">VERIFIED (Accredited toward Graduation)</option>
                  <option value="NEEDS_REVISION">NEEDS REVISION (Candidate must update notes)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Dean Assessment / Homiletic Feedback</label>
                <textarea
                  rows={3}
                  value={deanFeedbackText}
                  onChange={(e) => setDeanFeedbackText(e.target.value)}
                  placeholder="Provide constructive exegetical or pastoral feedback..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>

              <div className="pt-3 flex justify-end space-x-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setPracticumFeedbackModal({ log: null, action: 'VERIFIED' })}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleVerifyPracticumSubmit}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold"
                >
                  Confirm Verification
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: ADD THEOLOGICAL RESOURCE */}
      {showResourceModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Add Theological & Patristic Resource</h3>
                <p className="text-xs text-slate-500">Catalog lexicons, systematic textbooks, and church fathers</p>
              </div>
              <button onClick={() => setShowResourceModal(false)} className="text-slate-400 hover:text-slate-700 text-sm">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddResource} className="py-4 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Book / Lexicon Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Systematic Theology: An Introduction to Biblical Doctrine"
                  value={resTitle}
                  onChange={(e) => setResTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Author / Editor *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Wayne Grudem / Louis Berkhof"
                    value={resAuthor}
                    onChange={(e) => setResAuthor(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Discipline Category</label>
                  <select
                    value={resCategory}
                    onChange={(e) => setResCategory(e.target.value as TheologyLibraryResource['category'])}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none"
                  >
                    <option value="BIBLICAL_LANGUAGES">Biblical Hebrew & Greek</option>
                    <option value="SYSTEMATIC_THEOLOGY">Systematic Theology & Dogmatics</option>
                    <option value="CHURCH_HISTORY_PATRISTICS">Patristics & Church History</option>
                    <option value="HERMENEUTICS_EXEGESIS">Hermeneutics & Exegesis</option>
                    <option value="PASTORAL_HOMILETICS">Pastoral Ministry & Homiletics</option>
                    <option value="MISSIOLOGY_ETHICS">Missiology & Christian Ethics</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Shelf Location</label>
                  <input
                    type="text"
                    placeholder="DIV-SYS-04"
                    value={resShelf}
                    onChange={(e) => setResShelf(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Total Copies</label>
                  <input
                    type="number"
                    min={1}
                    value={resCopies}
                    onChange={(e) => setResCopies(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ISBN / Identifier</label>
                  <input
                    type="text"
                    placeholder="ISBN-978-0310286707"
                    value={resIsbn}
                    onChange={(e) => setResIsbn(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Annotation & Exegetical Relevance</label>
                <textarea
                  rows={2}
                  placeholder="Summary of contents, required reading for BTH modules..."
                  value={resDescription}
                  onChange={(e) => setResDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>

              <div className="pt-3 flex justify-end space-x-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowResourceModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-bold shadow-xs"
                >
                  Add to Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 6: PROGRAM DETAIL CURRICULUM DRAWER */}
      {selectedProgramForView && (() => {
        const viewUnits = selectedProgramForView.units || selectedProgramForView.curriculumUnits || [];
        return (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
              <div className="flex items-start justify-between pb-4 border-b border-slate-200">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-900 font-mono">
                    {selectedProgramForView.code}
                  </span>
                  <h2 className="text-lg font-bold text-slate-900 mt-1">{selectedProgramForView.title}</h2>
                  <p className="text-xs text-amber-700 font-semibold">{selectedProgramForView.awardTitle || selectedProgramForView.title}</p>
                </div>
                <button onClick={() => setSelectedProgramForView(null)} className="text-slate-400 hover:text-slate-700 text-base">
                  ✕
                </button>
              </div>

              <div className="py-4 space-y-4 text-xs">
                <p className="text-slate-600 leading-relaxed">{selectedProgramForView.description}</p>

                <div className="grid grid-cols-4 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-200 text-center">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Level</span>
                    <strong className="text-slate-800">{(selectedProgramForView.level || 'BACHELORS').replace('_', ' ')}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Duration</span>
                    <strong className="text-slate-800">{selectedProgramForView.duration || selectedProgramForView.durationYears || '4 Years'}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Credits</span>
                    <strong className="text-slate-800">{selectedProgramForView.creditsRequired || selectedProgramForView.totalCreditHours || 120} CH</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Practicum</span>
                    <strong className="text-amber-800">{selectedProgramForView.requiredPracticumHours || 200} Hrs</strong>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 text-xs mb-2">Accredited Units & Exegetical Modules ({viewUnits.length})</h4>
                  <div className="space-y-2">
                    {viewUnits.map((u) => (
                      <div key={u.id || u.unitCode || u.code} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="font-mono font-bold text-indigo-700 text-[11px]">{u.code || u.unitCode}</span>
                            <span className="font-bold text-slate-900">{u.title || u.unitTitle}</span>
                          </div>
                          <span className="text-[10px] font-semibold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                            Sem {u.semester || 1} | {u.creditHours || 3} CH
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1">{u.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => setSelectedProgramForView(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* MODAL 7: SEMINARIAN DOSSIER DETAIL DRAWER */}
      {selectedStudentForView && (() => {
        const church = selectedStudentForView.churchAffiliation || selectedStudentForView.homeChurchDenomination || 'Local Church';
        const parish = selectedStudentForView.homeParish || selectedStudentForView.fieldWorkPlacement || selectedStudentForView.presbyteryOrDiocese || 'Parish';
        const bishop = selectedStudentForView.ordainingBishopOrSupervisor || selectedStudentForView.mentorPastorName || 'Parish Vicar';
        const track = (selectedStudentForView.ministryTrack || 'PASTORAL_MINISTRY').replace(/_/g, ' ');
        const completedHrs = selectedStudentForView.practicumHoursCompleted || 0;
        const requiredHrs = selectedStudentForView.requiredPracticumHours || 1;
        const pct = Math.min(100, Math.round((completedHrs / requiredHrs) * 100));

        return (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
              <div className="flex items-start justify-between pb-3 border-b border-slate-200">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      {selectedStudentForView.regNo || selectedStudentForView.studentRegNo}
                    </span>
                    {selectedStudentForView.isOrdinationCandidate && (
                      <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-900 text-[10px] font-bold">
                        Ordination Candidate
                      </span>
                    )}
                  </div>
                  <h2 className="text-base font-bold text-slate-900 mt-1">{selectedStudentForView.fullName}</h2>
                  <p className="text-xs text-slate-500">{selectedStudentForView.programTitle}</p>
                </div>
                <button onClick={() => setSelectedStudentForView(null)} className="text-slate-400 hover:text-slate-700 text-base">
                  ✕
                </button>
              </div>

              <div className="py-4 space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Denomination & Parish</span>
                    <strong className="text-slate-800">{church}</strong>
                    <div className="text-[11px] text-slate-600">{parish}</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Ordaining Bishop / Mentor</span>
                    <strong className="text-slate-800">{bishop}</strong>
                    <div className="text-[11px] text-indigo-700 font-medium">Track: {track}</div>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-slate-800 text-xs mb-1">Fieldwork Practicum Fulfillment</h4>
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                    <div className="flex justify-between font-bold text-slate-800 text-xs mb-1.5">
                      <span>{completedHrs} Hours Completed</span>
                      <span>Required: {requiredHrs} Hours</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-amber-600 h-full rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-slate-800 text-xs mb-1">Student Practicum Logs</h4>
                  <div className="space-y-1.5">
                    {(theologyPracticumLogs || [])
                      .filter((l) => l.studentId === selectedStudentForView.id)
                      .map((l) => (
                        <div key={l.id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center text-[11px]">
                          <div>
                            <span className="font-bold text-slate-800">{(l.activityType || 'PRACTICUM').replace(/_/g, ' ')}</span>
                            <div className="text-slate-500">{l.churchOrLocation || 'Parish'} ({l.date})</div>
                          </div>
                          <span className="font-bold text-amber-800">{l.hoursLogged || 0} hrs ({l.status})</span>
                        </div>
                      ))}
                    {(theologyPracticumLogs || []).filter((l) => l.studentId === selectedStudentForView.id).length === 0 && (
                      <div className="text-slate-400 text-[11px] p-2 text-center">No logs submitted yet for this academic term.</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => setSelectedStudentForView(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs"
                >
                  Close Dossier
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* THEOLOGY MODAL: ISSUE INVOICE */}
      {showTheologyInvoiceModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Generate Seminary Fee Invoice</h3>
                <p className="text-xs text-slate-500">Tuition, practicum, and patristic library assessment</p>
              </div>
              <button
                onClick={() => setShowTheologyInvoiceModal(false)}
                className="text-slate-400 hover:text-slate-700 text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleGenerateTheologyInvoiceSubmit} className="py-4 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Seminarian *</label>
                <select
                  value={theoInvStudentId}
                  onChange={(e) => setTheoInvStudentId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-semibold text-slate-800 focus:outline-none"
                >
                  {safeTheologyStudents.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.fullName} ({s.regNo}) - {s.programTitle}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Semester / Term</label>
                  <select
                    value={theoInvSemester}
                    onChange={(e) => setTheoInvSemester(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none"
                  >
                    <option value={1}>Semester 1</option>
                    <option value={2}>Semester 2</option>
                    <option value={3}>Semester 3 / Long Holiday</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Academic Year</label>
                  <input
                    type="text"
                    value={theoInvAcademicYear}
                    onChange={(e) => setTheoInvAcademicYear(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tuition Fee</label>
                  <input
                    type="number"
                    value={theoInvTuition}
                    onChange={(e) => setTheoInvTuition(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Practicum Levy</label>
                  <input
                    type="number"
                    value={theoInvPracticumLevy}
                    onChange={(e) => setTheoInvPracticumLevy(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Patristic Lib</label>
                  <input
                    type="number"
                    value={theoInvPatristicLevy}
                    onChange={(e) => setTheoInvPatristicLevy(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Invoice Due Date</label>
                <input
                  type="date"
                  value={theoInvDueDate}
                  onChange={(e) => setTheoInvDueDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>

              <div className="pt-3 flex justify-end space-x-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowTheologyInvoiceModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-xs"
                >
                  Generate Invoice (KES {(Number(theoInvTuition) + Number(theoInvPracticumLevy) + Number(theoInvPatristicLevy)).toLocaleString()})
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* THEOLOGY MODAL: RECORD PAYMENT OR DIOCESAN BURSARY */}
      {showTheologyPaymentModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Record Payment / Bursary Grant</h3>
                <p className="text-xs text-slate-500">Direct deposit, Diocesan sponsorship, or parish bursary</p>
              </div>
              <button
                onClick={() => setShowTheologyPaymentModal(false)}
                className="text-slate-400 hover:text-slate-700 text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRecordTheologyPaymentSubmit} className="py-4 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Seminarian *</label>
                <select
                  value={theoPayStudentId}
                  onChange={(e) => setTheoPayStudentId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-semibold text-slate-800 focus:outline-none"
                >
                  {safeTheologyStudents.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.fullName} ({s.regNo}) - Arrears: KES {(s.feeBalance || 0).toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Payment Channel / Source *</label>
                  <select
                    value={theoPayMethod}
                    onChange={(e) => setTheoPayMethod(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-semibold text-slate-800 focus:outline-none"
                  >
                    <option value="DIOCESE_SPONSORSHIP">Diocesan / Synod Sponsorship</option>
                    <option value="BURSARY">Parish Bursary Fund</option>
                    <option value="MPESA">M-Pesa Seminary Paybill</option>
                    <option value="BANK">Seminary Bank Account</option>
                    <option value="CHEQUE">Banker's Cheque</option>
                    <option value="CASH">Cash Office</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Amount (KES) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={theoPayAmount}
                    onChange={(e) => setTheoPayAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold font-mono text-emerald-700 focus:outline-none"
                  />
                </div>
              </div>

              {(theoPayMethod === 'DIOCESE_SPONSORSHIP' || theoPayMethod === 'BURSARY') && (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Diocese / Sponsoring Bishop Fund</label>
                  <input
                    type="text"
                    value={theoPaySponsorName}
                    onChange={(e) => setTheoPaySponsorName(e.target.value)}
                    placeholder="e.g. ACK Diocese of Mt. Kenya West"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none font-medium"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Bank / M-Pesa / Cheque Ref</label>
                  <input
                    type="text"
                    value={theoPayRef}
                    onChange={(e) => setTheoPayRef(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl uppercase font-mono focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Remarks / Note</label>
                  <input
                    type="text"
                    value={theoPayRemarks}
                    onChange={(e) => setTheoPayRemarks(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end space-x-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowTheologyPaymentModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-xs"
                >
                  Record & Issue Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* THEOLOGY MODAL: OFFICIAL RECEIPT PRINTOUT */}
      {selectedTheologyReceipt && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider flex items-center space-x-1">
                <Receipt className="h-4 w-4" />
                <span>Official Seminary Receipt</span>
              </span>
              <button
                onClick={() => setSelectedTheologyReceipt(null)}
                className="text-slate-400 hover:text-slate-700 text-sm"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-4">
              <div className="text-center pb-2 border-b border-dashed border-slate-200">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-500/10 text-amber-700 flex items-center justify-center font-bold mb-2">
                  <Flame className="h-6 w-6" />
                </div>
                <h4 className="font-extrabold text-slate-900 text-sm">{tenant?.name || 'Department of Theology & Biblical Studies'}</h4>
                <p className="text-[11px] text-slate-500">Seminary Bursary & Finance Directorate</p>
                <div className="inline-block mt-2 px-3 py-1 bg-amber-50 rounded-full border border-amber-200 text-amber-900 font-mono font-bold text-xs">
                  {selectedTheologyReceipt.receiptNumber}
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Seminarian Name</span>
                  <strong className="text-slate-800">{selectedTheologyReceipt.studentName}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Registration Number</span>
                  <span className="font-mono font-bold text-slate-800">{selectedTheologyReceipt.studentRegNo}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Channel / Method</span>
                  <span className="font-semibold text-slate-800">{selectedTheologyReceipt.paymentMethod.replace('_', ' ')}</span>
                </div>
                {selectedTheologyReceipt.sponsorName && (
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Sponsor / Diocese</span>
                    <strong className="text-indigo-700 font-medium">{selectedTheologyReceipt.sponsorName}</strong>
                  </div>
                )}
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Reference No</span>
                  <span className="font-mono text-slate-800">{selectedTheologyReceipt.reference}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Date Issued</span>
                  <span className="text-slate-800">{selectedTheologyReceipt.paymentDate}</span>
                </div>

                <div className="bg-amber-50/70 rounded-2xl p-3.5 border border-amber-200 mt-2 flex justify-between items-center">
                  <span className="text-xs font-bold text-amber-950">Amount Paid</span>
                  <span className="text-lg font-black text-amber-900 font-mono">
                    KES {(selectedTheologyReceipt.amount || 0).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  onClick={() => setSelectedTheologyReceipt(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
                >
                  Close
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-xs"
                >
                  <Printer className="h-4 w-4" />
                  <span>Print Receipt</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
