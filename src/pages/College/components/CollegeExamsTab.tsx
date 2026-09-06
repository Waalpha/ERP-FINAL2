import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import {
  Award,
  BookOpen,
  Search,
  PlusCircle,
  CheckCircle2,
  FileText,
  Printer,
  Download,
  Filter
} from 'lucide-react';
import { CollegeStudent, CollegeCourse } from '../../../types';

interface ExamRecord {
  id: string;
  studentId: string;
  studentName: string;
  regNo: string;
  unitCode: string;
  unitTitle: string;
  catScore: number; // Max 30
  examScore: number; // Max 70
  totalScore: number; // 100
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  gpaPoint: number;
  status: 'PASS' | 'SUPPLEMENTARY' | 'FAIL';
  semester: string;
}

export const CollegeExamsTab: React.FC = () => {
  const { collegeStudents, collegeCourses, tenant } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUnit, setSelectedUnit] = useState('ALL');
  const [showAddGradeModal, setShowAddGradeModal] = useState(false);
  const [selectedStudentForTranscript, setSelectedStudentForTranscript] = useState<CollegeStudent | null>(null);

  // Generate initial state for exam records from enrolled students
  const [examRecords, setExamRecords] = useState<ExamRecord[]>(() => {
    const units = [
      { code: 'BCS 101', title: 'Calculus for Computer Science' },
      { code: 'BCS 102', title: 'Data Structures & Algorithms' },
      { code: 'BCS 103', title: 'Database Systems & SQL' },
      { code: 'BIT 201', title: 'Internet Application Programming' }
    ];

    const records: ExamRecord[] = [];
    (collegeStudents || []).forEach((student, sIdx) => {
      units.forEach((u, uIdx) => {
        const cat = 22 + ((sIdx + uIdx) % 8);
        const exam = 48 + ((sIdx * 3 + uIdx * 4) % 22);
        const total = cat + exam;
        let grade: 'A' | 'B' | 'C' | 'D' | 'F' = 'A';
        let gpaPoint = 4.0;
        let status: 'PASS' | 'SUPPLEMENTARY' | 'FAIL' = 'PASS';

        if (total >= 70) {
          grade = 'A';
          gpaPoint = 4.0;
        } else if (total >= 60) {
          grade = 'B';
          gpaPoint = 3.0;
        } else if (total >= 50) {
          grade = 'C';
          gpaPoint = 2.0;
        } else if (total >= 40) {
          grade = 'D';
          gpaPoint = 1.0;
        } else {
          grade = 'F';
          gpaPoint = 0.0;
          status = 'SUPPLEMENTARY';
        }

        records.push({
          id: `EXAM-${student.id}-${u.code}`,
          studentId: student.id,
          studentName: student.fullName,
          regNo: student.regNo,
          unitCode: u.code,
          unitTitle: u.title,
          catScore: cat,
          examScore: exam,
          totalScore: total,
          grade,
          gpaPoint,
          status,
          semester: 'Semester 1 2025/2026'
        });
      });
    });
    return records;
  });

  // Modal State
  const [targetStudentId, setTargetStudentId] = useState((collegeStudents || [])[0]?.id || '');
  const [unitCodeInput, setUnitCodeInput] = useState('BCS 104');
  const [unitTitleInput, setUnitTitleInput] = useState('Operating Systems');
  const [catInput, setCatInput] = useState(25);
  const [examInput, setExamInput] = useState(55);

  const handleAddGrade = (e: React.FormEvent) => {
    e.preventDefault();
    const st = (collegeStudents || []).find(s => s.id === targetStudentId);
    if (!st) return;

    const total = catInput + examInput;
    let grade: 'A' | 'B' | 'C' | 'D' | 'F' = 'A';
    let gpaPoint = 4.0;
    let status: 'PASS' | 'SUPPLEMENTARY' | 'FAIL' = 'PASS';

    if (total >= 70) { grade = 'A'; gpaPoint = 4.0; }
    else if (total >= 60) { grade = 'B'; gpaPoint = 3.0; }
    else if (total >= 50) { grade = 'C'; gpaPoint = 2.0; }
    else if (total >= 40) { grade = 'D'; gpaPoint = 1.0; }
    else { grade = 'F'; gpaPoint = 0.0; status = 'SUPPLEMENTARY'; }

    const newRecord: ExamRecord = {
      id: `EXAM-${st.id}-${unitCodeInput}-${Date.now()}`,
      studentId: st.id,
      studentName: st.fullName,
      regNo: st.regNo,
      unitCode: unitCodeInput.toUpperCase(),
      unitTitle: unitTitleInput,
      catScore: catInput,
      examScore: examInput,
      totalScore: total,
      grade,
      gpaPoint,
      status,
      semester: 'Semester 1 2025/2026'
    };

    setExamRecords(prev => [newRecord, ...prev]);
    setShowAddGradeModal(false);
  };

  const filteredRecords = examRecords.filter(r => {
    const matchesSearch = r.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.regNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.unitCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesUnit = selectedUnit === 'ALL' || r.unitCode === selectedUnit;
    return matchesSearch && matchesUnit;
  });

  const distinctUnits = Array.from(new Set(examRecords.map(r => r.unitCode)));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-900">Examinations & Academic Grading</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Continuous assessment tests (CAT), semester exams, grade point averages, and official academic transcripts.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowAddGradeModal(true)}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center space-x-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Enter Exam Marks</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 mb-1">Total Unit Entries</div>
          <div className="text-2xl font-bold text-slate-900">{examRecords.length}</div>
          <div className="text-[11px] text-slate-400 mt-1">Assessment marks recorded</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 mb-1">Pass Rate</div>
          <div className="text-2xl font-bold text-emerald-600">
            {examRecords.length > 0
              ? Math.round((examRecords.filter(r => r.status === 'PASS').length / examRecords.length) * 100)
              : 100}%
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Students meeting threshold</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 mb-1">Mean GPA</div>
          <div className="text-2xl font-bold text-indigo-600">
            {examRecords.length > 0
              ? (examRecords.reduce((acc, r) => acc + r.gpaPoint, 0) / examRecords.length).toFixed(2)
              : '3.50'}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Out of 4.00 Grade Scale</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 mb-1">Distinctions (Grade A)</div>
          <div className="text-2xl font-bold text-purple-600">
            {examRecords.filter(r => r.grade === 'A').length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">70% and above</div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by student name or reg no..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={selectedUnit}
              onChange={(e) => setSelectedUnit(e.target.value)}
              className="px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none"
            >
              <option value="ALL">All Course Units</option>
              {distinctUnits.map(u => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
              <tr>
                <th className="py-3 px-4">Student & Reg No</th>
                <th className="py-3 px-4">Course Unit</th>
                <th className="py-3 px-4 text-center">CAT (30)</th>
                <th className="py-3 px-4 text-center">Exam (70)</th>
                <th className="py-3 px-4 text-center">Total (100)</th>
                <th className="py-3 px-4 text-center">Grade</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-50/60">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{rec.studentName}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{rec.regNo}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-800">{rec.unitCode}</div>
                    <div className="text-[11px] text-slate-500">{rec.unitTitle}</div>
                  </td>
                  <td className="py-3 px-4 text-center font-mono font-medium text-slate-700">
                    {rec.catScore}/30
                  </td>
                  <td className="py-3 px-4 text-center font-mono font-medium text-slate-700">
                    {rec.examScore}/70
                  </td>
                  <td className="py-3 px-4 text-center font-mono font-bold text-slate-900">
                    {rec.totalScore}%
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-lg text-xs font-black ${
                      rec.grade === 'A' ? 'bg-emerald-100 text-emerald-800' :
                      rec.grade === 'B' ? 'bg-blue-100 text-blue-800' :
                      rec.grade === 'C' ? 'bg-indigo-100 text-indigo-800' :
                      rec.grade === 'D' ? 'bg-amber-100 text-amber-800' :
                      'bg-rose-100 text-rose-800'
                    }`}>
                      {rec.grade}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      rec.status === 'PASS' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                      'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      {rec.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => {
                        const target = (collegeStudents || []).find(s => s.id === rec.studentId);
                        if (target) setSelectedStudentForTranscript(target);
                      }}
                      className="px-2.5 py-1 text-[11px] font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition inline-flex items-center space-x-1"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Transcript</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Enter Exam Marks Modal */}
      {showAddGradeModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-slate-900 text-base mb-3">Record Examination Marks</h3>
            <form onSubmit={handleAddGrade} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Select Student</label>
                <select
                  value={targetStudentId}
                  onChange={(e) => setTargetStudentId(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none"
                >
                  {(collegeStudents || []).map(s => (
                    <option key={s.id} value={s.id}>{s.fullName} ({s.regNo})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Unit Code</label>
                  <input
                    type="text"
                    required
                    value={unitCodeInput}
                    onChange={(e) => setUnitCodeInput(e.target.value)}
                    placeholder="e.g. BCS 104"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl font-mono uppercase focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Unit Title</label>
                  <input
                    type="text"
                    required
                    value={unitTitleInput}
                    onChange={(e) => setUnitTitleInput(e.target.value)}
                    placeholder="e.g. Operating Systems"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">CAT Score (/30)</label>
                  <input
                    type="number"
                    min={0}
                    max={30}
                    required
                    value={catInput}
                    onChange={(e) => setCatInput(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl font-mono font-bold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Exam Score (/70)</label>
                  <input
                    type="number"
                    min={0}
                    max={70}
                    required
                    value={examInput}
                    onChange={(e) => setExamInput(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl font-mono font-bold focus:outline-none"
                  />
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex justify-between text-xs">
                <span className="text-slate-500">Calculated Total:</span>
                <span className="font-bold text-indigo-600">{catInput + examInput}/100</span>
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddGradeModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl"
                >
                  Save Marks
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official Academic Transcript Modal */}
      {selectedStudentForTranscript && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            {/* Header with Branding */}
            <div className="text-center border-b-2 border-slate-900 pb-4 mb-6">
              {tenant?.logoUrl && (
                <img
                  src={tenant.logoUrl}
                  alt={tenant.name}
                  referrerPolicy="no-referrer"
                  className="h-16 w-16 mx-auto mb-2 object-contain"
                />
              )}
              <h2 className="text-base font-extrabold uppercase tracking-wide text-slate-900">{tenant?.name}</h2>
              <div className="text-xs text-slate-600">Office of the University Registrar & Examinations</div>
              <div className="text-sm font-black uppercase text-indigo-700 tracking-wider mt-2">
                OFFICIAL PROVISIONAL ACADEMIC TRANSCRIPT
              </div>
            </div>

            {/* Student Meta */}
            <div className="grid grid-cols-2 gap-4 text-xs text-slate-700 bg-slate-50 p-4 rounded-xl mb-6">
              <div>
                <span className="text-slate-400">Student Name:</span>{' '}
                <strong className="text-slate-900">{selectedStudentForTranscript.fullName}</strong>
              </div>
              <div>
                <span className="text-slate-400">Registration No:</span>{' '}
                <strong className="text-slate-900 font-mono">{selectedStudentForTranscript.regNo}</strong>
              </div>
              <div>
                <span className="text-slate-400">Program:</span>{' '}
                <strong className="text-slate-900">{selectedStudentForTranscript.courseName}</strong>
              </div>
              <div>
                <span className="text-slate-400">Academic Year:</span>{' '}
                <strong className="text-slate-900">2025/2026</strong>
              </div>
            </div>

            {/* Units list */}
            <table className="w-full text-xs text-slate-700 mb-6">
              <thead className="bg-slate-100 text-slate-900 font-bold border-y border-slate-200">
                <tr>
                  <th className="py-2 px-3 text-left">Unit Code</th>
                  <th className="py-2 px-3 text-left">Unit Title</th>
                  <th className="py-2 px-3 text-center">Score</th>
                  <th className="py-2 px-3 text-center">Grade</th>
                  <th className="py-2 px-3 text-center">GPA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {examRecords
                  .filter(r => r.studentId === selectedStudentForTranscript.id)
                  .map(r => (
                    <tr key={r.id}>
                      <td className="py-2 px-3 font-mono font-bold">{r.unitCode}</td>
                      <td className="py-2 px-3">{r.unitTitle}</td>
                      <td className="py-2 px-3 text-center font-mono">{r.totalScore}%</td>
                      <td className="py-2 px-3 text-center font-bold">{r.grade}</td>
                      <td className="py-2 px-3 text-center font-mono">{r.gpaPoint.toFixed(1)}</td>
                    </tr>
                  ))}
              </tbody>
            </table>

            {/* Footer Signatures */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
              <div className="text-[10px] text-slate-400">
                Issued under the seal of {tenant?.name}.
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedStudentForTranscript(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-200"
                >
                  Close
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-500 flex items-center space-x-1"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Official Transcript</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
