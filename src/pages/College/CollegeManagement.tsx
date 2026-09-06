import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  GraduationCap,
  Building,
  BookA,
  Library,
  BedDouble,
  Receipt,
  PlusCircle,
  Search,
  CheckCircle2,
  Users,
  Award,
  BookOpen,
  Filter,
  DollarSign,
  Printer,
  CreditCard,
  Banknote,
  Smartphone,
  ArrowUpRight,
  FileSpreadsheet,
  AlertCircle
} from 'lucide-react';
import { CollegeDepartment, CollegeCourse, CollegeStudent, LibraryBook, HostelRoom, CollegeFeeStructureItem, CollegeInvoice, CollegePayment } from '../../types';
import { CollegeSettingsTab } from './components/CollegeSettingsTab';
import { CollegeExamsTab } from './components/CollegeExamsTab';
import { CollegeClassesTab } from './components/CollegeClassesTab';
import { CollegeAttendanceTab } from './components/CollegeAttendanceTab';
import { CollegeStaffTab } from './components/CollegeStaffTab';
import { CollegeUsersTab } from './components/CollegeUsersTab';
import { CollegeReportsTab } from './components/CollegeReportsTab';
import { CollegeSmsTab } from './components/CollegeSmsTab';
import { CollegeFinancialReportsTab } from './components/CollegeFinancialReportsTab';

interface CollegeManagementProps {
  currentTab: string;
}

export const CollegeManagement: React.FC<CollegeManagementProps> = ({ currentTab }) => {
  const {
    tenant,
    collegeDepartments,
    collegeCourses,
    collegeStudents,
    libraryBooks,
    hostelRooms,
    collegeFeeStructures,
    collegeInvoices,
    collegePayments,
    addCollegeDepartment,
    addCollegeCourse,
    admitCollegeStudent,
    addLibraryBook,
    addCollegeFeeStructureItem,
    generateCollegeInvoice,
    recordCollegePayment
  } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('ALL');

  // Modals
  const [showDeptModal, setShowDeptModal] = useState(false);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showBookModal, setShowBookModal] = useState(false);

  // Form states
  const [deptName, setDeptName] = useState('');
  const [deptCode, setDeptCode] = useState('');
  const [deptHead, setDeptHead] = useState('');

  const [courseCode, setCourseCode] = useState('');
  const [courseTitle, setCourseTitle] = useState('');
  const [courseDeptId, setCourseDeptId] = useState((collegeDepartments || [])[0]?.id || '');
  const [courseLevel, setCourseLevel] = useState<'CERTIFICATE' | 'DIPLOMA' | 'DEGREE' | 'MASTERS'>('DEGREE');
  const [courseDuration, setCourseDuration] = useState('4 Years');
  const [courseCredits, setCourseCredits] = useState(120);
  const [courseTuition, setCourseTuition] = useState(75000);

  const [studentRegNo, setStudentRegNo] = useState('');
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentPhone, setStudentPhone] = useState('');
  const [studentCourseId, setStudentCourseId] = useState((collegeCourses || [])[0]?.id || '');
  const [studentYear, setStudentYear] = useState(1);
  const [studentSemester, setStudentSemester] = useState(1);

  const [bookTitle, setBookTitle] = useState('');
  const [bookAuthor, setBookAuthor] = useState('');
  const [bookIsbn, setBookIsbn] = useState('');
  const [bookCategory, setBookCategory] = useState('Computer Science');
  const [bookCopies, setBookCopies] = useState(5);

  // Fee Management States
  const [feeSubTab, setFeeSubTab] = useState<'invoices' | 'payments' | 'structures' | 'debtors'>('invoices');
  const [showFeeItemModal, setShowFeeItemModal] = useState(false);
  const [showGenerateInvoiceModal, setShowGenerateInvoiceModal] = useState(false);
  const [showRecordPaymentModal, setShowRecordPaymentModal] = useState(false);
  const [selectedPaymentForReceipt, setSelectedPaymentForReceipt] = useState<CollegePayment | null>(null);

  // Fee Item Form
  const [feeItemName, setFeeItemName] = useState('');
  const [feeItemCode, setFeeItemCode] = useState('TUIT');
  const [feeItemAmount, setFeeItemAmount] = useState(65000);
  const [feeItemCourseId, setFeeItemCourseId] = useState((collegeCourses || [])[0]?.id || '');
  const [feeItemYear, setFeeItemYear] = useState(1);
  const [feeItemSemester, setFeeItemSemester] = useState(1);

  // Generate Invoice Form
  const [invStudentId, setInvStudentId] = useState((collegeStudents || [])[0]?.id || '');
  const [invSemester, setInvSemester] = useState(1);
  const [invAcademicYear, setInvAcademicYear] = useState('2025/2026');
  const [invDueDate, setInvDueDate] = useState('2025-05-30');
  const [invTuitionAmount, setInvTuitionAmount] = useState(75000);
  const [invExamFee, setInvExamFee] = useState(5000);
  const [invActivityFee, setInvActivityFee] = useState(2500);

  // Record Payment Form
  const [payStudentId, setPayStudentId] = useState((collegeStudents || [])[0]?.id || '');
  const [payInvoiceId, setPayInvoiceId] = useState('');
  const [payAmount, setPayAmount] = useState(40000);
  const [payMethod, setPayMethod] = useState<'MPESA' | 'BANK' | 'CASH' | 'CHEQUE' | 'BURSARY'>('MPESA');
  const [payReference, setPayReference] = useState('QHB8923JKL');
  const [payBankName, setPayBankName] = useState('KCB Bank');
  const [payRemarks, setPayRemarks] = useState('Semester 1 partial tuition clearance');

  // KPIs
  const safeStudents = collegeStudents || [];
  const safeCourses = collegeCourses || [];
  const safeBooks = libraryBooks || [];
  const safeRooms = hostelRooms || [];
  const safeDepts = collegeDepartments || [];
  const safeFeeStructures = collegeFeeStructures || [];
  const safeInvoices = collegeInvoices || [];
  const safePayments = collegePayments || [];

  const totalStudents = safeStudents.length;
  const totalCourses = safeCourses.length;
  const totalTuitionOwed = safeStudents.reduce((sum, s) => sum + (s.feeBalance || 0), 0);
  const totalInvoicedAmount = safeInvoices.reduce((sum, i) => sum + (i.totalAmount || 0), 0);
  const totalCollectedAmount = safePayments.reduce((sum, p) => sum + (p.amount || 0), 0);
  const totalBooks = safeBooks.reduce((sum, b) => sum + (b.totalCopies || 0), 0);
  const hostelOccupancy = safeRooms.reduce((sum, r) => sum + (r.occupiedBeds || 0), 0);
  const hostelCapacity = safeRooms.reduce((sum, r) => sum + (r.capacity || 0), 0);

  const handleCreateDept = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deptName || !deptCode) return;
    await addCollegeDepartment({
      name: deptName,
      code: deptCode.toUpperCase(),
      headOfDepartment: deptHead || 'Prof. Administrator'
    });
    setDeptName('');
    setDeptCode('');
    setDeptHead('');
    setShowDeptModal(false);
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseTitle || !courseCode || !courseDeptId) return;
    const targetDept = safeDepts.find(d => d.id === courseDeptId);
    await addCollegeCourse({
      code: courseCode.toUpperCase(),
      title: courseTitle,
      departmentId: courseDeptId,
      departmentName: targetDept?.name || 'Academic Dept',
      duration: courseDuration,
      level: courseLevel,
      tuitionPerSemester: courseTuition,
      creditsRequired: courseCredits
    });
    setCourseTitle('');
    setCourseCode('');
    setShowCourseModal(false);
  };

  const handleAdmitStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName || !studentRegNo || !studentCourseId) return;
    const targetCourse = safeCourses.find(c => c.id === studentCourseId);
    await admitCollegeStudent({
      regNo: studentRegNo.toUpperCase(),
      fullName: studentName,
      email: studentEmail,
      phone: studentPhone,
      courseId: studentCourseId,
      courseName: targetCourse?.title || 'Academic Program',
      departmentId: targetCourse?.departmentId || 'dept-1',
      yearOfStudy: studentYear,
      semester: studentSemester,
      status: 'ACTIVE',
      hostelRoomId: 'room-101'
    });
    setStudentName('');
    setStudentRegNo('');
    setStudentEmail('');
    setStudentPhone('');
    setShowStudentModal(false);
  };

  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookTitle || !bookAuthor) return;
    await addLibraryBook({
      title: bookTitle,
      author: bookAuthor,
      isbn: bookIsbn || `ISBN-${Math.floor(100000 + Math.random() * 900000)}`,
      category: bookCategory,
      totalCopies: bookCopies,
      availableCopies: bookCopies,
      shelfLocation: 'Section B-3'
    });
    setBookTitle('');
    setBookAuthor('');
    setShowBookModal(false);
  };

  const handleCreateFeeItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feeItemName || feeItemAmount <= 0) return;
    const targetCourse = safeCourses.find(c => c.id === feeItemCourseId);
    await addCollegeFeeStructureItem({
      name: feeItemName,
      code: feeItemCode.toUpperCase(),
      amount: feeItemAmount,
      courseId: feeItemCourseId || undefined,
      courseName: targetCourse?.title || 'All Courses',
      yearOfStudy: feeItemYear,
      semester: feeItemSemester,
      isCompulsory: true
    });
    setFeeItemName('');
    setFeeItemCode('TUIT');
    setShowFeeItemModal(false);
  };

  const handleGenerateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!invStudentId) return;
    const targetStudent = safeStudents.find(s => s.id === invStudentId);
    if (!targetStudent) return;

    const total = invTuitionAmount + invExamFee + invActivityFee;
    const items = [
      { name: 'Semester Tuition & Lecture Fee', amount: invTuitionAmount },
      { name: 'University Examination & Assessment Fee', amount: invExamFee },
      { name: 'Student Union, ICT & Activity Levy', amount: invActivityFee }
    ];

    await generateCollegeInvoice({
      studentId: targetStudent.id,
      studentName: targetStudent.fullName,
      studentRegNo: targetStudent.regNo,
      courseName: targetStudent.courseName,
      semester: invSemester,
      academicYear: invAcademicYear,
      dueDate: invDueDate,
      items,
      totalAmount: total,
      paidAmount: 0
    });

    setShowGenerateInvoiceModal(false);
  };

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!payStudentId || payAmount <= 0) return;
    const targetStudent = safeStudents.find(s => s.id === payStudentId);
    if (!targetStudent) return;

    const newPayment = await recordCollegePayment({
      studentId: targetStudent.id,
      studentName: targetStudent.fullName,
      studentRegNo: targetStudent.regNo,
      invoiceId: payInvoiceId || undefined,
      amount: payAmount,
      paymentMethod: payMethod,
      reference: payReference || `REF-${Math.floor(100000 + Math.random() * 900000)}`,
      paymentDate: new Date().toISOString().split('T')[0],
      bankName: payMethod === 'BANK' ? payBankName : undefined,
      remarks: payRemarks
    });

    setShowRecordPaymentModal(false);
    setSelectedPaymentForReceipt(newPayment);
  };

  return (
    <div className="space-y-6">
      {/* College Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {tenant?.type.replace('_', ' ')}
              </span>
              <span className="text-xs text-slate-400 font-mono">Academic Session 2024/2025</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight mt-1">{tenant?.name}</h1>
            <p className="text-xs text-slate-400 max-w-2xl mt-1">
              Higher education management: faculties, degree programs, student admissions, library resources and campus housing.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowStudentModal(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-sm flex items-center space-x-1.5"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Admit Student</span>
            </button>
            <button
              onClick={() => setShowCourseModal(true)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center space-x-1.5"
            >
              <BookA className="h-4 w-4 text-cyan-400" />
              <span>Add Course</span>
            </button>
          </div>
        </div>

        {/* Higher Ed KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span>Enrolled Students</span>
              <GraduationCap className="h-4 w-4 text-indigo-400" />
            </div>
            <div className="text-2xl font-bold text-white mt-2">{totalStudents}</div>
            <div className="text-[11px] text-emerald-400 mt-1">Active Undergraduate & Diplomas</div>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span>Academic Programs</span>
              <BookA className="h-4 w-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-bold text-white mt-2">{totalCourses}</div>
            <div className="text-[11px] text-slate-400 mt-1">{collegeDepartments.length} Faculties</div>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span>Tuition Dues (KES)</span>
              <DollarSign className="h-4 w-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-amber-400 mt-2">
              KES {totalTuitionOwed.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">Outstanding semester tuition</div>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span>Hostel Occupancy</span>
              <BedDouble className="h-4 w-4 text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-white mt-2">
              {hostelOccupancy} / {hostelCapacity}
            </div>
            <div className="text-[11px] text-purple-300 mt-1">
              {Math.round((hostelOccupancy / (hostelCapacity || 1)) * 100)}% Capacity
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Switcher or Dynamic Section Rendering */}
      {currentTab === 'college-departments' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Faculties & Academic Departments</h2>
              <p className="text-xs text-slate-500">Deans, department heads and curriculum divisions</p>
            </div>
            <button
              onClick={() => setShowDeptModal(true)}
              className="px-3 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-xl hover:bg-indigo-500 flex items-center space-x-1"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Create Faculty</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {collegeDepartments.map((dept) => (
              <div key={dept.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 text-[10px] font-bold font-mono">
                    {dept.code}
                  </span>
                  <span className="text-xs text-slate-500">{dept.facultyCount} Faculty</span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm mt-2">{dept.name}</h3>
                <p className="text-xs text-slate-500 mt-1">Head: <span className="font-medium text-slate-700">{dept.headOfDepartment}</span></p>
                <div className="mt-3 pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-600">
                  <span>Courses: <strong className="text-slate-900">{(collegeCourses || []).filter(c => c.departmentId === dept.id).length}</strong></span>
                  <span className="text-indigo-600 font-semibold text-[11px]">Manage Curricula →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Courses Tab */}
      {currentTab === 'college-courses' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Academic Programs & Degree Courses</h2>
              <p className="text-xs text-slate-500">Degree, diploma and certificate accreditation</p>
            </div>
            <button
              onClick={() => setShowCourseModal(true)}
              className="px-3 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-xl hover:bg-indigo-500 flex items-center space-x-1"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Add Program</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                <tr>
                  <th className="py-3 px-4">Course Title & Code</th>
                  <th className="py-3 px-4">Faculty</th>
                  <th className="py-3 px-4">Level</th>
                  <th className="py-3 px-4">Duration & Credits</th>
                  <th className="py-3 px-4">Tuition / Semester</th>
                  <th className="py-3 px-4">Enrolled</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {collegeCourses.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/60">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{c.title}</div>
                      <div className="text-[11px] text-indigo-600 font-mono">{c.code}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-700">{c.departmentName}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">
                        {c.level}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-700">{c.duration} • {c.creditsRequired} Credits</td>
                    <td className="py-3 px-4 font-bold text-slate-900">KES {c.tuitionPerSemester.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-100 font-semibold text-slate-800">
                        {(collegeStudents || []).filter(s => s.courseId === c.id).length} Students
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Enrolled Students Tab */}
      {(currentTab === 'college-students' || currentTab === 'college-overview') && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Campus Student Directory & Tuition Status</h2>
              <p className="text-xs text-slate-500">Student enrollment, semester progression and tuition balances</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative max-w-xs">
                <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by name or Reg No..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-3 py-1.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <button
                onClick={() => setShowStudentModal(true)}
                className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded-xl hover:bg-indigo-500 flex items-center space-x-1"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Admit Student</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                <tr>
                  <th className="py-3 px-4">Student & Reg No</th>
                  <th className="py-3 px-4">Academic Program</th>
                  <th className="py-3 px-4">Year / Semester</th>
                  <th className="py-3 px-4">Tuition Balance</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {collegeStudents
                  .filter(s => s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || s.regNo.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/60">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">{s.fullName}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{s.regNo} • {s.phone}</div>
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-700">{s.courseName}</td>
                      <td className="py-3 px-4 text-slate-700">Year {s.yearOfStudy}, Sem {s.semester}</td>
                      <td className="py-3 px-4">
                        <span className={`font-bold ${s.feeBalance > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                          KES {s.feeBalance.toLocaleString()}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {s.status}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* College Fees & Finance Tab */}
      {currentTab === 'college-fees' && (
        <div className="space-y-6">
          {/* Finance KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
                <span>Total Invoiced</span>
                <Receipt className="h-4 w-4 text-indigo-600" />
              </div>
              <div className="text-xl font-bold text-slate-900">
                KES {totalInvoicedAmount.toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">{safeInvoices.length} billing invoices issued</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
                <span>Collected Revenue</span>
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              </div>
              <div className="text-xl font-bold text-emerald-700">
                KES {totalCollectedAmount.toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">{safePayments.length} successful receipts</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
                <span>Tuition Arrears</span>
                <AlertCircle className="h-4 w-4 text-amber-600" />
              </div>
              <div className="text-xl font-bold text-amber-600">
                KES {totalTuitionOwed.toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Pending student balances</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
                <span>Collection Rate</span>
                <DollarSign className="h-4 w-4 text-purple-600" />
              </div>
              <div className="text-xl font-bold text-purple-700">
                {totalInvoicedAmount > 0 ? Math.round((totalCollectedAmount / totalInvoicedAmount) * 100) : 100}%
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Cash clearance ratio</div>
            </div>
          </div>

          {/* Sub Navigation Bar */}
          <div className="bg-white p-2 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center space-x-1.5 overflow-x-auto">
              <button
                onClick={() => setFeeSubTab('invoices')}
                className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all ${
                  feeSubTab === 'invoices'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Semester Invoices ({safeInvoices.length})
              </button>
              <button
                onClick={() => setFeeSubTab('payments')}
                className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all ${
                  feeSubTab === 'payments'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Payment Transactions & Receipts ({safePayments.length})
              </button>
              <button
                onClick={() => setFeeSubTab('structures')}
                className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all ${
                  feeSubTab === 'structures'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Fee Structures & Tariffs ({safeFeeStructures.length})
              </button>
              <button
                onClick={() => setFeeSubTab('debtors')}
                className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all ${
                  feeSubTab === 'debtors'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Student Ledger & Defaulters
              </button>
            </div>

            <div className="flex items-center space-x-2">
              {feeSubTab === 'invoices' && (
                <button
                  onClick={() => setShowGenerateInvoiceModal(true)}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 shadow-xs"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>Generate Invoice</span>
                </button>
              )}
              {feeSubTab === 'payments' && (
                <button
                  onClick={() => setShowRecordPaymentModal(true)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 shadow-xs"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>Record Fee Payment</span>
                </button>
              )}
              {feeSubTab === 'structures' && (
                <button
                  onClick={() => setShowFeeItemModal(true)}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 shadow-xs"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>Add Fee Line Item</span>
                </button>
              )}
            </div>
          </div>

          {/* Sub Tab: Invoices */}
          {feeSubTab === 'invoices' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Semester Fee Invoices</h3>
                  <p className="text-xs text-slate-500">Official student semester billings, dues, and payment statuses</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                    <tr>
                      <th className="py-3 px-4">Invoice # & Date</th>
                      <th className="py-3 px-4">Student Name & Reg No</th>
                      <th className="py-3 px-4">Program & Sem</th>
                      <th className="py-3 px-4">Total Billed</th>
                      <th className="py-3 px-4">Paid Amount</th>
                      <th className="py-3 px-4">Balance Due</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Quick Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {safeInvoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-slate-50/60">
                        <td className="py-3 px-4">
                          <div className="font-mono font-bold text-slate-900">{inv.invoiceNo}</div>
                          <div className="text-[10px] text-slate-400">{new Date(inv.createdAt).toLocaleDateString()}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-900">{inv.studentName}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{inv.studentRegNo}</div>
                        </td>
                        <td className="py-3 px-4 text-slate-700">
                          <div>{inv.courseName}</div>
                          <div className="text-[10px] text-indigo-600 font-medium">Sem {inv.semester} • {inv.academicYear}</div>
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-900">
                          KES {inv.totalAmount.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 font-semibold text-emerald-600">
                          KES {inv.paidAmount.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 font-bold text-amber-600">
                          KES {inv.balance.toLocaleString()}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            inv.status === 'PAID'
                              ? 'bg-emerald-100 text-emerald-800'
                              : inv.status === 'PARTIAL'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}>
                            {inv.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          {inv.balance > 0 && (
                            <button
                              onClick={() => {
                                setPayStudentId(inv.studentId);
                                setPayInvoiceId(inv.id);
                                setPayAmount(inv.balance);
                                setShowRecordPaymentModal(true);
                              }}
                              className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-lg text-[11px]"
                            >
                              Receive Payment
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                    {safeInvoices.length === 0 && (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-slate-400 text-xs">
                          No semester invoices generated yet. Click "Generate Invoice" to bill students.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Sub Tab: Payments & Receipts */}
          {feeSubTab === 'payments' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Fee Receipts & Payment Transactions</h3>
                  <p className="text-xs text-slate-500">M-Pesa paybill, bank deposits, bursaries and direct tuition receipts</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                    <tr>
                      <th className="py-3 px-4">Receipt # & Date</th>
                      <th className="py-3 px-4">Student & Reg No</th>
                      <th className="py-3 px-4">Amount Paid</th>
                      <th className="py-3 px-4">Channel / Mode</th>
                      <th className="py-3 px-4">Reference Code</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Print Receipt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {safePayments.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/60">
                        <td className="py-3 px-4">
                          <div className="font-mono font-bold text-indigo-700">{p.receiptNo}</div>
                          <div className="text-[10px] text-slate-400">{p.paymentDate}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-900">{p.studentName}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{p.studentRegNo}</div>
                        </td>
                        <td className="py-3 px-4 font-bold text-emerald-700 text-sm">
                          KES {p.amount.toLocaleString()}
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-semibold text-[10px]">
                            {p.paymentMethod} {p.bankName ? `(${p.bankName})` : ''}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-700">{p.reference}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            {p.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => setSelectedPaymentForReceipt(p)}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-lg text-[11px] flex items-center space-x-1 ml-auto"
                          >
                            <Printer className="h-3.5 w-3.5" />
                            <span>Receipt</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                    {safePayments.length === 0 && (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-slate-400 text-xs">
                          No fee payments recorded yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Sub Tab: Fee Structures */}
          {feeSubTab === 'structures' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Academic Fee Tariff Structure</h3>
                  <p className="text-xs text-slate-500">Program tuition rates, lab levies, exam fees, and student welfare charges</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {safeFeeStructures.map((f) => (
                  <div key={f.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 font-mono text-[10px] font-bold">
                          {f.code}
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium">Year {f.yearOfStudy}, Sem {f.semester}</span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm mt-2">{f.name}</h4>
                      <p className="text-xs text-slate-500">{f.courseName || 'All College Programs'}</p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
                      <span className="text-xs text-slate-400">Semester Tariff:</span>
                      <span className="text-base font-extrabold text-slate-900">KES {f.amount.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sub Tab: Debtors */}
          {feeSubTab === 'debtors' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Student Fee Arrears & Clearance Status</h3>
                  <p className="text-xs text-slate-500">Students with outstanding tuition balances and exam clearance</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                    <tr>
                      <th className="py-3 px-4">Student & Reg No</th>
                      <th className="py-3 px-4">Program & Year</th>
                      <th className="py-3 px-4">Total Billed</th>
                      <th className="py-3 px-4">Total Paid</th>
                      <th className="py-3 px-4">Outstanding Balance</th>
                      <th className="py-3 px-4">Exam Clearance</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {safeStudents.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-50/60">
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-900">{s.fullName}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{s.regNo} • {s.phone}</div>
                        </td>
                        <td className="py-3 px-4 text-slate-700">
                          <div>{s.courseName}</div>
                          <div className="text-[10px] text-slate-400">Year {s.yearOfStudy}, Sem {s.semester}</div>
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-800">
                          KES {s.totalBilled.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 font-semibold text-emerald-700">
                          KES {s.totalPaid.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 font-bold text-amber-600">
                          KES {s.feeBalance.toLocaleString()}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            s.feeBalance === 0
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}>
                            {s.feeBalance === 0 ? 'CLEARED' : 'BLOCKED'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => {
                              setPayStudentId(s.id);
                              setPayAmount(s.feeBalance || 20000);
                              setShowRecordPaymentModal(true);
                            }}
                            className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-lg text-[11px]"
                          >
                            Collect Fee
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Library Catalog Tab */}
      {currentTab === 'college-library' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Campus Library Book Catalog</h2>
              <p className="text-xs text-slate-500">Track books, circulation copies, authors and shelf locations</p>
            </div>
            <button
              onClick={() => setShowBookModal(true)}
              className="px-3 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-xl hover:bg-indigo-500 flex items-center space-x-1"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Add Book</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {libraryBooks.map((book) => (
              <div key={book.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/40">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-cyan-100 text-cyan-800 text-[10px] font-bold font-mono">
                    {book.category}
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-600">
                    {book.availableCopies} / {book.totalCopies} Available
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm mt-2">{book.title}</h3>
                <p className="text-xs text-slate-500 mt-0.5">Author: {book.author}</p>
                <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>{book.isbn}</span>
                  <span>{book.shelfLocation}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hostel Housing Tab */}
      {currentTab === 'college-hostel' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="mb-4">
            <h2 className="text-base font-bold text-slate-900">Hostel & Accommodation Management</h2>
            <p className="text-xs text-slate-500">Halls of residence, bed capacity and semester rates</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {hostelRooms.map((room) => (
              <div key={room.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-slate-900 text-sm">{room.blockName} - Room {room.roomNumber}</h3>
                    <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 text-[10px] font-bold">
                      {room.gender}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Rate: <strong className="text-slate-900">KES {room.feePerSemester.toLocaleString()}</strong> per semester
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-indigo-600">{room.occupiedBeds} / {room.capacity} Beds</div>
                  <span className="text-[10px] text-slate-400 font-semibold">Allocated</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Classes & Units Tab */}
      {currentTab === 'college-classes' && <CollegeClassesTab />}

      {/* Attendance Tab */}
      {currentTab === 'college-attendance' && <CollegeAttendanceTab />}

      {/* Exams & Results Tab */}
      {currentTab === 'college-exams' && <CollegeExamsTab />}

      {/* Staff & Faculty Tab */}
      {currentTab === 'college-staff' && <CollegeStaffTab />}

      {/* User Accounts & Roles Tab */}
      {currentTab === 'college-users' && <CollegeUsersTab />}

      {/* Academic Reports Tab */}
      {currentTab === 'college-reports' && <CollegeReportsTab />}

      {/* SMS Broadcast Tab */}
      {currentTab === 'college-sms' && <CollegeSmsTab />}

      {/* Financial Reports Tab */}
      {currentTab === 'college-financial-reports' && <CollegeFinancialReportsTab />}

      {/* Direct Invoices Subtab */}
      {currentTab === 'college-invoices' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Student Invoices & Fee Statements</h2>
              <p className="text-xs text-slate-500">Term tuition billings and ledger debits</p>
            </div>
            <button
              onClick={() => setShowGenerateInvoiceModal(true)}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center space-x-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Raise Invoice</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                <tr>
                  <th className="py-3 px-4">Invoice No</th>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Due Date</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                  <th className="py-3 px-4 text-right">Balance</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {safeInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/60">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{inv.invoiceNo}</td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{inv.studentName}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{inv.studentRegNo}</div>
                    </td>
                    <td className="py-3 px-4">{inv.dueDate}</td>
                    <td className="py-3 px-4 text-right font-mono font-semibold text-slate-900">
                      KES {inv.totalAmount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-amber-600">
                      KES {inv.balance.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        inv.status === 'PAID' ? 'bg-emerald-50 text-emerald-700' :
                        inv.status === 'PARTIAL' ? 'bg-blue-50 text-blue-700' :
                        'bg-amber-50 text-amber-700'
                      }`}>
                        {inv.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Direct Payments Subtab */}
      {currentTab === 'college-payments' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Recorded Tuition Receipts & M-Pesa Collections</h2>
              <p className="text-xs text-slate-500">Live transaction ledger with printable receipts</p>
            </div>
            <button
              onClick={() => setShowRecordPaymentModal(true)}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center space-x-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Record Fee Payment</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                <tr>
                  <th className="py-3 px-4">Receipt No</th>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Method & Ref</th>
                  <th className="py-3 px-4 text-right">Amount Paid</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {safePayments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/60">
                    <td className="py-3 px-4 font-mono font-bold text-indigo-700">{p.receiptNo}</td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{p.studentName}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{p.studentRegNo}</div>
                    </td>
                    <td className="py-3 px-4">{p.paymentDate}</td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">{p.paymentMethod}</div>
                      <div className="text-[11px] font-mono text-slate-500">{p.reference}</div>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-emerald-600">
                      KES {p.amount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedPaymentForReceipt(p)}
                        className="px-2.5 py-1 text-[11px] font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition inline-flex items-center space-x-1"
                      >
                        <Printer className="w-3 h-3" />
                        <span>Receipt</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* College Settings & Branding Tab */}
      {currentTab === 'college-settings' && tenant && (
        <CollegeSettingsTab tenant={tenant} />
      )}

      {/* Modals */}
      {showDeptModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-slate-900 text-base mb-3">Add Academic Faculty</h3>
            <form onSubmit={handleCreateDept} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Faculty Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Faculty of Engineering"
                  value={deptName}
                  onChange={(e) => setDeptName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Faculty Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ENG"
                  value={deptCode}
                  onChange={(e) => setDeptCode(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl uppercase font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Dean / Head</label>
                <input
                  type="text"
                  placeholder="e.g. Dr. John Omondi"
                  value={deptHead}
                  onChange={(e) => setDeptHead(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowDeptModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl"
                >
                  Save Faculty
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showCourseModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-slate-900 text-base mb-3">Add Academic Program</h3>
            <form onSubmit={handleCreateCourse} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Program Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bachelor of Science in Data Science"
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Course Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. BSDS"
                    value={courseCode}
                    onChange={(e) => setCourseCode(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl uppercase font-mono focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Level</label>
                  <select
                    value={courseLevel}
                    onChange={(e) => setCourseLevel(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none"
                  >
                    <option value="CERTIFICATE">Certificate</option>
                    <option value="DIPLOMA">Diploma</option>
                    <option value="DEGREE">Degree</option>
                    <option value="MASTERS">Masters</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Faculty</label>
                <select
                  value={courseDeptId}
                  onChange={(e) => setCourseDeptId(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none"
                >
                  {collegeDepartments.map(d => (
                    <option key={d.id} value={d.id}>{d.name} ({d.code})</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tuition / Semester (KES)</label>
                  <input
                    type="number"
                    value={courseTuition}
                    onChange={(e) => setCourseTuition(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Duration</label>
                  <input
                    type="text"
                    value={courseDuration}
                    onChange={(e) => setCourseDuration(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>
              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowCourseModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl"
                >
                  Save Program
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showStudentModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-slate-900 text-base mb-3">Admit College Student</h3>
            <form onSubmit={handleAdmitStudent} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kevin Kiprop"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Reg Number</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. KCA/2025/104"
                    value={studentRegNo}
                    onChange={(e) => setStudentRegNo(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl uppercase font-mono focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="0712345678"
                    value={studentPhone}
                    onChange={(e) => setStudentPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Program</label>
                <select
                  value={studentCourseId}
                  onChange={(e) => setStudentCourseId(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none"
                >
                  {collegeCourses.map(c => (
                    <option key={c.id} value={c.id}>{c.title} ({c.code})</option>
                  ))}
                </select>
              </div>
              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowStudentModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl"
                >
                  Admit Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showBookModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-slate-900 text-base mb-3">Add Library Book</h3>
            <form onSubmit={handleAddBook} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Book Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Artificial Intelligence: A Modern Approach"
                  value={bookTitle}
                  onChange={(e) => setBookTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Author</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Stuart Russell and Peter Norvig"
                  value={bookAuthor}
                  onChange={(e) => setBookAuthor(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <input
                    type="text"
                    value={bookCategory}
                    onChange={(e) => setBookCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Copies</label>
                  <input
                    type="number"
                    value={bookCopies}
                    onChange={(e) => setBookCopies(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>
              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowBookModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl"
                >
                  Save Book
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Fee Item Structure Modal */}
      {showFeeItemModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-slate-900 text-base mb-3">Add Fee Structure Line Item</h3>
            <form onSubmit={handleCreateFeeItem} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Fee Item Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Computer Science Lab & Practical Levy"
                  value={feeItemName}
                  onChange={(e) => setFeeItemName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Fee Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. LAB-01"
                    value={feeItemCode}
                    onChange={(e) => setFeeItemCode(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl uppercase font-mono focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Amount (KES)</label>
                  <input
                    type="number"
                    required
                    value={feeItemAmount}
                    onChange={(e) => setFeeItemAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl font-bold focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Academic Program</label>
                <select
                  value={feeItemCourseId}
                  onChange={(e) => setFeeItemCourseId(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none"
                >
                  <option value="">All Academic Programs (General Levy)</option>
                  {safeCourses.map(c => (
                    <option key={c.id} value={c.id}>{c.title} ({c.code})</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Year of Study</label>
                  <input
                    type="number"
                    min={1}
                    max={6}
                    value={feeItemYear}
                    onChange={(e) => setFeeItemYear(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Semester</label>
                  <input
                    type="number"
                    min={1}
                    max={3}
                    value={feeItemSemester}
                    onChange={(e) => setFeeItemSemester(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>
              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowFeeItemModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl"
                >
                  Save Fee Tariff
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Generate Invoice Modal */}
      {showGenerateInvoiceModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-slate-900 text-base mb-1">Generate Semester Fee Invoice</h3>
            <p className="text-xs text-slate-500 mb-3">Bill an enrolled student for tuition, assessments, and campus services</p>
            <form onSubmit={handleGenerateInvoice} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Select Student</label>
                <select
                  value={invStudentId}
                  onChange={(e) => setInvStudentId(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none"
                >
                  {safeStudents.map(s => (
                    <option key={s.id} value={s.id}>{s.fullName} ({s.regNo}) - {s.courseName}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Semester</label>
                  <select
                    value={invSemester}
                    onChange={(e) => setInvSemester(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none"
                  >
                    <option value={1}>Semester 1</option>
                    <option value={2}>Semester 2</option>
                    <option value={3}>Semester 3 (Trimester)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Academic Year</label>
                  <input
                    type="text"
                    value={invAcademicYear}
                    onChange={(e) => setInvAcademicYear(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
                <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Fee Breakdown</div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600">Tuition & Lectures</span>
                  <input
                    type="number"
                    value={invTuitionAmount}
                    onChange={(e) => setInvTuitionAmount(Number(e.target.value))}
                    className="w-28 px-2 py-1 text-right text-xs font-semibold border border-slate-200 rounded bg-white"
                  />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600">University Exams & Assessment</span>
                  <input
                    type="number"
                    value={invExamFee}
                    onChange={(e) => setInvExamFee(Number(e.target.value))}
                    className="w-28 px-2 py-1 text-right text-xs font-semibold border border-slate-200 rounded bg-white"
                  />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600">Student Union & ICT Levy</span>
                  <input
                    type="number"
                    value={invActivityFee}
                    onChange={(e) => setInvActivityFee(Number(e.target.value))}
                    className="w-28 px-2 py-1 text-right text-xs font-semibold border border-slate-200 rounded bg-white"
                  />
                </div>
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between font-bold text-slate-900 text-sm">
                  <span>Total Invoice Amount:</span>
                  <span className="text-indigo-600 font-extrabold">KES {(invTuitionAmount + invExamFee + invActivityFee).toLocaleString()}</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Due Date</label>
                <input
                  type="date"
                  value={invDueDate}
                  onChange={(e) => setInvDueDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>
              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowGenerateInvoiceModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl"
                >
                  Issue Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Record Payment Modal */}
      {showRecordPaymentModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-slate-900 text-base mb-1">Record Student Fee Payment</h3>
            <p className="text-xs text-slate-500 mb-3">Accept tuition payment via M-Pesa, Bank Deposit or Cash</p>
            <form onSubmit={handleRecordPayment} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Student</label>
                <select
                  value={payStudentId}
                  onChange={(e) => setPayStudentId(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none"
                >
                  {safeStudents.map(s => (
                    <option key={s.id} value={s.id}>{s.fullName} ({s.regNo}) - Bal: KES {s.feeBalance.toLocaleString()}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Payment Method</label>
                  <select
                    value={payMethod}
                    onChange={(e) => setPayMethod(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none"
                  >
                    <option value="MPESA">M-Pesa Paybill</option>
                    <option value="BANK">Bank Deposit</option>
                    <option value="CASH">Cash at Cashier</option>
                    <option value="CHEQUE">Bankers Cheque</option>
                    <option value="BURSARY">HELB / Bursary</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Amount (KES)</label>
                  <input
                    type="number"
                    required
                    value={payAmount}
                    onChange={(e) => setPayAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl font-bold text-emerald-600 focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Ref / M-Pesa Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. QHB829038L"
                    value={payReference}
                    onChange={(e) => setPayReference(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl font-mono uppercase focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Bank Name (if bank)</label>
                  <input
                    type="text"
                    placeholder="e.g. KCB / Equity"
                    value={payBankName}
                    onChange={(e) => setPayBankName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Remarks / Note</label>
                <input
                  type="text"
                  value={payRemarks}
                  onChange={(e) => setPayRemarks(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>
              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowRecordPaymentModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl"
                >
                  Confirm & Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official Receipt Modal */}
      {selectedPaymentForReceipt && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative">
            <div className="text-center border-b border-slate-200 pb-4 mb-4">
              <div className="text-xs font-bold uppercase tracking-widest text-indigo-600">{tenant?.name}</div>
              <div className="text-sm font-extrabold text-slate-900 mt-0.5">OFFICIAL TUITION RECEIPT</div>
              <div className="text-[11px] text-slate-500 font-mono mt-1">Receipt No: {selectedPaymentForReceipt.receiptNo}</div>
              <div className="text-[10px] text-slate-400">Date: {selectedPaymentForReceipt.paymentDate}</div>
            </div>

            <div className="space-y-2.5 text-xs text-slate-700">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Student Name:</span>
                <span className="font-bold text-slate-900">{selectedPaymentForReceipt.studentName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Registration No:</span>
                <span className="font-mono font-semibold text-slate-900">{selectedPaymentForReceipt.studentRegNo}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Payment Channel:</span>
                <span className="font-semibold text-slate-900">{selectedPaymentForReceipt.paymentMethod}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Transaction Reference:</span>
                <span className="font-mono font-semibold text-indigo-700">{selectedPaymentForReceipt.reference}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-200 font-bold text-base text-slate-900">
                <span>Amount Paid:</span>
                <span className="text-emerald-700">KES {selectedPaymentForReceipt.amount.toLocaleString()}</span>
              </div>
              <div className="text-[10px] text-slate-500 italic pt-1">
                Remarks: {selectedPaymentForReceipt.remarks || 'Tuition payment received in full clearance.'}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-dashed border-slate-300 flex items-center justify-between">
              <div className="text-[10px] text-slate-400 font-mono">Verified by University Bursar</div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedPaymentForReceipt(null)}
                  className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-200"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    window.print();
                  }}
                  className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded-xl hover:bg-indigo-500 flex items-center space-x-1"
                >
                  <Printer className="h-3.5 w-3.5" />
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
