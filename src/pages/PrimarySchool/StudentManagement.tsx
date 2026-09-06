import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  GraduationCap,
  Search,
  PlusCircle,
  Filter,
  Eye,
  Edit2,
  Trash2,
  Phone,
  Mail,
  Receipt,
  Award,
  CalendarCheck,
  ShieldAlert,
  FileSpreadsheet,
  CheckCircle,
  ArrowRight,
  UserCheck,
  Building,
  HeartPulse,
  Download,
  AlertCircle
} from 'lucide-react';
import { Student, PrimaryGradeLevel } from '../../types';

interface StudentManagementProps {
  onOpenRecordPaymentForStudent?: (student: Student) => void;
  onGenerateReportForStudent?: (student: Student) => void;
}

export const StudentManagement: React.FC<StudentManagementProps> = ({
  onOpenRecordPaymentForStudent,
  onGenerateReportForStudent
}) => {
  const {
    tenant,
    students,
    classes,
    assessments,
    payments,
    invoices,
    attendance,
    discipline,
    admitStudent,
    updateStudent,
    deleteStudent,
    promoteStudents
  } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<string>('ALL');
  const [selectedStream, setSelectedStream] = useState<string>('ALL');
  const [feeStatusFilter, setFeeStatusFilter] = useState<string>('ALL');

  // Selected student for details drawer
  const [activeStudent, setActiveStudent] = useState<Student | null>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'academics' | 'finance' | 'attendance' | 'discipline'>('profile');

  // Modal states
  const [showAdmissionModal, setShowAdmissionModal] = useState(false);
  const [showPromoteModal, setShowPromoteModal] = useState(false);
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [targetPromotionGrade, setTargetPromotionGrade] = useState<PrimaryGradeLevel | 'Graduated'>('Grade 5');

  // New Admission Form State
  const [formData, setFormData] = useState({
    admissionNo: `STA-2025-${Math.floor(100 + Math.random() * 900)}`,
    firstName: '',
    middleName: '',
    lastName: '',
    gender: 'Male' as 'Male' | 'Female' | 'Other',
    dob: '2017-05-15',
    grade: 'Grade 4' as PrimaryGradeLevel,
    stream: 'Alpha',
    birthCertNo: '',
    bloodGroup: 'O+',
    medicalNotes: '',
    parentName: '',
    parentRelationship: 'Mother',
    parentPhone: '',
    parentEmail: '',
    parentOccupation: '',
    residentialAddress: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    previousSchool: ''
  });

  const allGrades: PrimaryGradeLevel[] = [
    'Playgroup',
    'PP1',
    'PP2',
    'Grade 1',
    'Grade 2',
    'Grade 3',
    'Grade 4',
    'Grade 5',
    'Grade 6',
    'Grade 7',
    'Grade 8',
    'Grade 9'
  ];

  // Filtering
  const filteredStudents = students.filter(s => {
    const matchesSearch =
      s.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.admissionNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.parentName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesGrade = selectedGrade === 'ALL' || s.grade === selectedGrade;
    const matchesStream = selectedStream === 'ALL' || s.stream === selectedStream;

    const matchesFee =
      feeStatusFilter === 'ALL' ||
      (feeStatusFilter === 'CLEARED' && s.feeBalance <= 0) ||
      (feeStatusFilter === 'OWING' && s.feeBalance > 0);

    return matchesSearch && matchesGrade && matchesStream && matchesFee;
  });

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedStudentIds(filteredStudents.map(s => s.id));
    } else {
      setSelectedStudentIds([]);
    }
  };

  const handleToggleSelectStudent = (id: string) => {
    setSelectedStudentIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleAdmissionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.parentPhone) return;

    await admitStudent({
      ...formData,
      admissionDate: new Date().toISOString().split('T')[0],
      status: 'ACTIVE'
    });

    setShowAdmissionModal(false);
    // Reset form
    setFormData({
      admissionNo: `STA-2025-${Math.floor(100 + Math.random() * 900)}`,
      firstName: '',
      middleName: '',
      lastName: '',
      gender: 'Male',
      dob: '2017-05-15',
      grade: 'Grade 4',
      stream: 'Alpha',
      birthCertNo: '',
      bloodGroup: 'O+',
      medicalNotes: '',
      parentName: '',
      parentRelationship: 'Mother',
      parentPhone: '',
      parentEmail: '',
      parentOccupation: '',
      residentialAddress: '',
      emergencyContactName: '',
      emergencyContactPhone: '',
      previousSchool: ''
    });
  };

  const handlePromoteSubmit = async () => {
    if (selectedStudentIds.length === 0) return;
    await promoteStudents(selectedStudentIds, targetPromotionGrade);
    setSelectedStudentIds([]);
    setShowPromoteModal(false);
  };

  // Student specific data for drawer
  const studentAssessments = activeStudent ? assessments.filter(a => a.studentId === activeStudent.id) : [];
  const studentPayments = activeStudent ? payments.filter(p => p.studentId === activeStudent.id) : [];
  const studentInvoices = activeStudent ? invoices.filter(i => i.studentId === activeStudent.id) : [];
  const studentAttendance = activeStudent ? attendance.filter(att => att.studentId === activeStudent.id) : [];
  const studentDiscipline = activeStudent ? discipline.filter(d => d.studentId === activeStudent.id) : [];

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Learners & Admission Registry</h1>
          <p className="text-xs text-slate-500">
            Comprehensive primary school student database, CBC tracking, and guardian contacts.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          {selectedStudentIds.length > 0 && (
            <button
              onClick={() => setShowPromoteModal(true)}
              className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow-sm transition-all flex items-center space-x-1.5"
            >
              <UserCheck className="h-4 w-4" />
              <span>Promote ({selectedStudentIds.length})</span>
            </button>
          )}

          <button
            onClick={() => setShowAdmissionModal(true)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-all flex items-center space-x-1.5"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Admit New Learner</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Panel */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, adm no, or parent..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-none"
            />
          </div>

          {/* Grade Selector */}
          <div>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:outline-none"
            >
              <option value="ALL">All Grade Levels</option>
              {allGrades.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          {/* Fee Balance Filter */}
          <div>
            <select
              value={feeStatusFilter}
              onChange={(e) => setFeeStatusFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:outline-none"
            >
              <option value="ALL">All Fee Statuses</option>
              <option value="CLEARED">Cleared / Zero Balance</option>
              <option value="OWING">Outstanding Fee Balances</option>
            </select>
          </div>

          {/* Metric Summary count */}
          <div className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 font-medium">
            <span>Learners Listed:</span>
            <span className="font-bold text-slate-900 font-mono">{filteredStudents.length} of {students.length}</span>
          </div>
        </div>
      </div>

      {/* Student Records Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
              <tr>
                <th className="py-3.5 px-4 w-10">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={selectedStudentIds.length > 0 && selectedStudentIds.length === filteredStudents.length}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </th>
                <th className="py-3.5 px-4">Learner & Admission No</th>
                <th className="py-3.5 px-4">Grade & Stream</th>
                <th className="py-3.5 px-4">Parent / Guardian</th>
                <th className="py-3.5 px-4">Fee Balance</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((student) => {
                const isSelected = selectedStudentIds.includes(student.id);
                const hasBalance = student.feeBalance > 0;

                return (
                  <tr
                    key={student.id}
                    className={`hover:bg-slate-50/80 transition-colors ${
                      isSelected ? 'bg-indigo-50/40' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelectStudent(student.id)}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-3">
                        {student.photoUrl ? (
                          <img
                            src={student.photoUrl}
                            alt=""
                            className="h-9 w-9 rounded-full object-cover border border-slate-200 flex-shrink-0"
                          />
                        ) : (
                          <div className="h-9 w-9 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs border border-indigo-100 flex-shrink-0">
                            {student.firstName[0]}
                            {student.lastName[0]}
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-slate-900">
                            {student.firstName} {student.middleName || ''} {student.lastName}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono">
                            {student.admissionNo} • {student.gender}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800">{student.grade}</div>
                      <div className="text-[11px] text-slate-400">Stream: {student.stream}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800">{student.parentName}</div>
                      <div className="text-[11px] text-slate-500 flex items-center space-x-1 font-mono">
                        <Phone className="h-3 w-3 text-slate-400" />
                        <span>{student.parentPhone}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      {hasBalance ? (
                        <div>
                          <span className="text-xs font-bold text-rose-600">
                            KES {student.feeBalance.toLocaleString()}
                          </span>
                          <div className="text-[10px] text-slate-400">
                            Paid: KES {student.totalPaid.toLocaleString()}
                          </div>
                        </div>
                      ) : (
                        <span className="inline-flex items-center space-x-1 text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          <CheckCircle className="h-3 w-3" />
                          <span>Cleared</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
                        {student.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => {
                            setActiveStudent(student);
                            setActiveTab('profile');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 font-semibold text-xs transition-colors flex items-center space-x-1"
                          title="View Full Profile"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span>Profile</span>
                        </button>

                        {onOpenRecordPaymentForStudent && (
                          <button
                            onClick={() => onOpenRecordPaymentForStudent(student)}
                            className="p-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-200 transition-colors"
                            title="Receive Fee Payment"
                          >
                            <Receipt className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Details Slide-over / Modal */}
      {activeStudent && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center space-x-4">
                <div className="h-14 w-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-xl font-bold text-indigo-700">
                  {activeStudent.firstName[0]}{activeStudent.lastName[0]}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {activeStudent.firstName} {activeStudent.middleName} {activeStudent.lastName}
                  </h3>
                  <div className="text-xs text-slate-500 font-mono flex items-center space-x-2">
                    <span>Admission: {activeStudent.admissionNo}</span>
                    <span>•</span>
                    <span className="font-semibold text-indigo-600">{activeStudent.grade} {activeStudent.stream}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {onGenerateReportForStudent && (
                  <button
                    onClick={() => {
                      onGenerateReportForStudent(activeStudent);
                      setActiveStudent(null);
                    }}
                    className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold rounded-xl text-xs flex items-center space-x-1.5 transition-colors"
                  >
                    <FileSpreadsheet className="h-4 w-4" />
                    <span>Report Card</span>
                  </button>
                )}
                <button
                  onClick={() => setActiveStudent(null)}
                  className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Navigation Tabs inside Drawer */}
            <div className="flex items-center space-x-2 border-b border-slate-200 mt-4 pb-2 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('profile')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  activeTab === 'profile' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Personal & Guardian
              </button>
              <button
                onClick={() => setActiveTab('academics')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  activeTab === 'academics' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                CBC Assessments ({studentAssessments.length})
              </button>
              <button
                onClick={() => setActiveTab('finance')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  activeTab === 'finance' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Fee Ledger & Receipts ({studentPayments.length})
              </button>
              <button
                onClick={() => setActiveTab('attendance')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  activeTab === 'attendance' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Attendance Roll
              </button>
            </div>

            {/* Tab Contents */}
            <div className="py-4">
              {activeTab === 'profile' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                    <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Learner Bio</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-slate-400">Gender:</span>
                        <div className="font-semibold text-slate-800">{activeStudent.gender}</div>
                      </div>
                      <div>
                        <span className="text-slate-400">Date of Birth:</span>
                        <div className="font-semibold text-slate-800">{activeStudent.dob}</div>
                      </div>
                      <div>
                        <span className="text-slate-400">Birth Cert / NEMIS:</span>
                        <div className="font-mono font-semibold text-slate-800">{activeStudent.birthCertNo || 'N/A'}</div>
                      </div>
                      <div>
                        <span className="text-slate-400">Blood Group:</span>
                        <div className="font-semibold text-slate-800">{activeStudent.bloodGroup || 'O+'}</div>
                      </div>
                    </div>
                    {activeStudent.medicalNotes && (
                      <div className="pt-2 border-t border-slate-200">
                        <span className="text-slate-400">Medical Notes:</span>
                        <div className="text-slate-700 font-medium mt-0.5">{activeStudent.medicalNotes}</div>
                      </div>
                    )}
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                    <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Primary Guardian</h4>
                    <div>
                      <span className="text-slate-400">Name & Relationship:</span>
                      <div className="font-bold text-slate-800">{activeStudent.parentName} ({activeStudent.parentRelationship})</div>
                    </div>
                    <div>
                      <span className="text-slate-400">Phone:</span>
                      <div className="font-mono font-semibold text-slate-800">{activeStudent.parentPhone}</div>
                    </div>
                    <div>
                      <span className="text-slate-400">Email:</span>
                      <div className="text-slate-800">{activeStudent.parentEmail || 'Not Provided'}</div>
                    </div>
                    <div>
                      <span className="text-slate-400">Residential Address:</span>
                      <div className="text-slate-700">{activeStudent.residentialAddress || 'Nairobi, Kenya'}</div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'academics' && (
                <div className="space-y-3">
                  {studentAssessments.length === 0 ? (
                    <div className="text-center py-8 text-xs text-slate-400">
                      No CBC assessment records logged yet for this learner.
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden text-xs">
                      {studentAssessments.map((a) => (
                        <div key={a.id} className="p-3.5 flex items-center justify-between hover:bg-slate-50">
                          <div>
                            <div className="font-bold text-slate-900">{a.subjectName}</div>
                            <div className="text-[11px] text-slate-500">{a.strand}</div>
                            <div className="text-[10px] text-slate-400 mt-0.5 italic">"{a.rubricComment}"</div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-slate-800">{a.rawScore} / {a.maxScore} ({a.percentage}%)</div>
                            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200 inline-block mt-0.5">
                              {a.performanceLevel}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'finance' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Total Billed</span>
                      <div className="text-sm font-black text-slate-800 mt-1">
                        KES {activeStudent.totalBilled.toLocaleString()}
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                      <span className="text-[10px] text-emerald-600 font-bold uppercase">Total Paid</span>
                      <div className="text-sm font-black text-emerald-700 mt-1">
                        KES {activeStudent.totalPaid.toLocaleString()}
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-center">
                      <span className="text-[10px] text-rose-600 font-bold uppercase">Balance</span>
                      <div className="text-sm font-black text-rose-700 mt-1">
                        KES {activeStudent.feeBalance.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <h5 className="font-bold text-slate-800 text-xs">Payment Receipts</h5>
                  <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden text-xs">
                    {studentPayments.map((p) => (
                      <div key={p.id} className="p-3 flex items-center justify-between hover:bg-slate-50">
                        <div>
                          <div className="font-bold text-slate-900">{p.receiptNo}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{p.paymentMethod} • Ref: {p.transactionCode}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-emerald-600">+KES {p.amount.toLocaleString()}</div>
                          <div className="text-[10px] text-slate-400">{new Date(p.paidAt).toLocaleDateString()}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'attendance' && (
                <div className="space-y-2">
                  <div className="text-xs text-slate-600 mb-2">Recent roll call entries:</div>
                  <div className="space-y-1.5">
                    {studentAttendance.map((att) => (
                      <div key={att.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
                        <span className="font-mono text-slate-700">{att.date}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          att.status === 'PRESENT' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {att.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setActiveStudent(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admission Modal */}
      {showAdmissionModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <h3 className="font-bold text-slate-900 text-base">New Learner Admission</h3>
                <p className="text-xs text-slate-500">Register student into {tenant?.name}</p>
              </div>
              <button
                onClick={() => setShowAdmissionModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAdmissionSubmit} className="py-4 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Liam"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Middle Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Kiprono"
                    value={formData.middleName}
                    onChange={(e) => setFormData({ ...formData, middleName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Cheruiyot"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Admission Number</label>
                  <input
                    type="text"
                    value={formData.admissionNo}
                    onChange={(e) => setFormData({ ...formData, admissionNo: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Grade Level *</label>
                  <select
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value as PrimaryGradeLevel })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none"
                  >
                    {allGrades.map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Stream *</label>
                  <input
                    type="text"
                    value={formData.stream}
                    onChange={(e) => setFormData({ ...formData, stream: e.target.value })}
                    placeholder="e.g. Alpha, Blue"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Birth Cert / NEMIS UPI</label>
                  <input
                    type="text"
                    placeholder="e.g. BC-1029384"
                    value={formData.birthCertNo}
                    onChange={(e) => setFormData({ ...formData, birthCertNo: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <h4 className="font-bold text-slate-800 text-xs mb-2">Guardian Contact Information</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Parent Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Vincent Cheruiyot"
                      value={formData.parentName}
                      onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Relationship</label>
                    <input
                      type="text"
                      value={formData.parentRelationship}
                      onChange={(e) => setFormData({ ...formData, parentRelationship: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Phone Number (M-Pesa) *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+254 720 000 000"
                      value={formData.parentPhone}
                      onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="parent@example.com"
                    value={formData.parentEmail}
                    onChange={(e) => setFormData({ ...formData, parentEmail: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Residential Address</label>
                  <input
                    type="text"
                    placeholder="e.g. Kilimani Ring Road, House 4B"
                    value={formData.residentialAddress}
                    onChange={(e) => setFormData({ ...formData, residentialAddress: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAdmissionModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-sm"
                >
                  Complete Admission
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Promotion Modal */}
      {showPromoteModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-slate-900 text-base mb-1">Bulk Learner Promotion</h3>
            <p className="text-xs text-slate-500 mb-4">
              Promote {selectedStudentIds.length} selected learners to the next academic level.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 text-xs mb-1">Target Grade Level</label>
                <select
                  value={targetPromotionGrade}
                  onChange={(e) => setTargetPromotionGrade(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white focus:outline-none"
                >
                  {allGrades.map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                  <option value="Graduated">Graduated / Alumni</option>
                </select>
              </div>

              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-800">
                Learners will have their current academic level updated and new term fee structures applied.
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  onClick={() => setShowPromoteModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePromoteSubmit}
                  className="px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-500 rounded-xl"
                >
                  Confirm Promotion
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
