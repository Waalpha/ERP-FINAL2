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
  Settings
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
}

export const TheologyManagement: React.FC<TheologyManagementProps> = ({ currentTab = 'theology-programs' }) => {
  const {
    tenant,
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
  const [activeSubTab, setActiveSubTab] = useState<'programs' | 'students' | 'practicum' | 'library' | 'curriculum' | 'fees' | 'staff' | 'reports' | 'sms' | 'settings'>(() => {
    if (currentTab === 'theology-students') return 'students';
    if (currentTab === 'theology-fees') return 'fees';
    if (currentTab === 'theology-practicum') return 'practicum';
    if (currentTab === 'theology-library') return 'library';
    if (currentTab === 'theology-curriculum') return 'curriculum';
    if (currentTab === 'theology-staff') return 'staff';
    if (currentTab === 'theology-reports') return 'reports';
    if (currentTab === 'theology-sms') return 'sms';
    if (currentTab === 'theology-settings') return 'settings';
    return 'programs';
  });

  React.useEffect(() => {
    if (currentTab === 'theology-students') setActiveSubTab('students');
    else if (currentTab === 'theology-fees') setActiveSubTab('fees');
    else if (currentTab === 'theology-practicum') setActiveSubTab('practicum');
    else if (currentTab === 'theology-library') setActiveSubTab('library');
    else if (currentTab === 'theology-staff') setActiveSubTab('staff');
    else if (currentTab === 'theology-reports') setActiveSubTab('reports');
    else if (currentTab === 'theology-sms') setActiveSubTab('sms');
    else if (currentTab === 'theology-settings') setActiveSubTab('settings');
    else if (currentTab === 'theology-curriculum') setActiveSubTab('curriculum');
    else setActiveSubTab('programs');
  }, [currentTab]);

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
      {/* Theology & Divinity Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden text-white">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-gradient-to-br from-indigo-500/10 via-amber-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center space-x-2.5 flex-wrap gap-y-1">
              <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center space-x-1.5">
                <Flame className="h-3.5 w-3.5 text-amber-400" />
                <span>Theology & Divinity Seminary</span>
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Certificate to Bachelor of Theology (B.Th.)
              </span>
              <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2.5 py-0.5 rounded-full border border-indigo-500/30 font-medium">
                {tenant?.name || "St. Paul's Theological College"}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-2 text-white flex items-center space-x-3">
              <span>Department of Theology & Biblical Studies</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl mt-2 leading-relaxed">
              Curriculum progression from Foundations Certificate to Bachelor of Theology (B.Th.).
              Managing biblical language exegesis (Greek/Hebrew), systematic dogmatics, pastoral practicum fieldwork, ordination candidates, and patristic library archives.
            </p>
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center flex-wrap gap-2.5">
            <button
              onClick={() => setShowStudentModal(true)}
              className="px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold shadow-md shadow-amber-600/20 flex items-center space-x-1.5 transition-all transform active:scale-95"
            >
              <UserCheck className="h-4 w-4" />
              <span>Admit Seminarian</span>
            </button>
            <button
              onClick={() => setShowTheologyInvoiceModal(true)}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center space-x-1.5 transition-all transform active:scale-95"
            >
              <Receipt className="h-4 w-4" />
              <span>Issue Tuition Invoice</span>
            </button>
            <button
              onClick={() => setShowTheologyPaymentModal(true)}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 flex items-center space-x-1.5 transition-all transform active:scale-95"
            >
              <DollarSign className="h-4 w-4" />
              <span>Record Fee / Bursary</span>
            </button>
            <button
              onClick={() => setShowPracticumModal(true)}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors"
            >
              <HeartHandshake className="h-4 w-4 text-indigo-400" />
              <span>Log Practicum</span>
            </button>
          </div>
        </div>

        {/* Theology KPIs & Academic Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mt-6 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-800/70 border border-slate-700/60 rounded-2xl p-4">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span>Total Seminarians</span>
              <GraduationCap className="h-4 w-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-white mt-1.5">{totalSeminarians}</div>
            <div className="text-[11px] text-amber-300 mt-0.5">Certificate to B.Th. Candidates</div>
          </div>

          <div className="bg-slate-800/70 border border-slate-700/60 rounded-2xl p-4">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span>Total Invoiced</span>
              <Receipt className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-emerald-400 mt-1.5">KES {totalTheologyInvoiced.toLocaleString()}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Seminary Term Billings</div>
          </div>

          <div className="bg-slate-800/70 border border-slate-700/60 rounded-2xl p-4">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span>Collected / Bursaries</span>
              <DollarSign className="h-4 w-4 text-indigo-400" />
            </div>
            <div className="text-2xl font-black text-indigo-300 mt-1.5">
              KES {totalTheologyCollected.toLocaleString()}
            </div>
            <div className="text-[11px] text-indigo-200 mt-0.5">Diocesan Grants: KES {totalDiocesanBursaries.toLocaleString()}</div>
          </div>

          <div className="bg-slate-800/70 border border-slate-700/60 rounded-2xl p-4">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span>Seminary Arrears</span>
              <AlertCircle className="h-4 w-4 text-rose-400" />
            </div>
            <div className="text-2xl font-black text-rose-400 mt-1.5">KES {totalTheologyArrears.toLocaleString()}</div>
            <div className="text-[11px] text-rose-300 mt-0.5">Outstanding Balances</div>
          </div>
        </div>
      </div>

      {/* Internal Navigation Subtabs */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-2.5 rounded-2xl shadow-xs overflow-x-auto gap-2">
        <div className="flex items-center space-x-1 sm:space-x-2 min-w-max">
          <button
            onClick={() => setActiveSubTab('programs')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
              activeSubTab === 'programs'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Award className="h-4 w-4" />
            <span>Academic Hierarchy & Programs ({theologyPrograms.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('students')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
              activeSubTab === 'students'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="h-4 w-4" />
            <span>Seminarians & Candidates ({theologyStudents.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('fees')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
              activeSubTab === 'fees'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Receipt className="h-4 w-4" />
            <span>Seminary Fees & Diocesan Sponsorships ({safeTheologyInvoices.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('practicum')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
              activeSubTab === 'practicum'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <HeartHandshake className="h-4 w-4" />
            <span>Ministry Practicum & Fieldwork</span>
            {pendingPracticumLogsCount > 0 && (
              <span className="ml-1 px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-black">
                {pendingPracticumLogsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveSubTab('library')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
              activeSubTab === 'library'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Library className="h-4 w-4" />
            <span>Divinity & Patristics Library ({theologyLibraryResources.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('curriculum')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
              activeSubTab === 'curriculum'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Scroll className="h-4 w-4" />
            <span>Greek & Hebrew Exegesis</span>
          </button>

          <button
            onClick={() => setActiveSubTab('staff')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
              activeSubTab === 'staff'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <UserCheck className="h-4 w-4" />
            <span>Faculty & Staff</span>
          </button>

          <button
            onClick={() => setActiveSubTab('reports')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
              activeSubTab === 'reports'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>Seminary Reports</span>
          </button>

          <button
            onClick={() => setActiveSubTab('sms')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
              activeSubTab === 'sms'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Bell className="h-4 w-4" />
            <span>Communication / SMS</span>
          </button>

          <button
            onClick={() => setActiveSubTab('settings')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
              activeSubTab === 'settings'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Settings className="h-4 w-4" />
            <span>Seminary Settings</span>
          </button>
        </div>
      </div>

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

      {/* MODAL 1: CREATE THEOLOGY PROGRAM */}
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
