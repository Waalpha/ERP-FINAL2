import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  FileSpreadsheet,
  Printer,
  Search,
  Award,
  BookOpen,
  CalendarCheck,
  CheckCircle,
  Download
} from 'lucide-react';
import { Student } from '../../types';

interface ReportCardGeneratorProps {
  selectedStudentFromNav?: Student | null;
}

export const ReportCardGenerator: React.FC<ReportCardGeneratorProps> = ({ selectedStudentFromNav }) => {
  const {
    tenant,
    students,
    assessments,
    attendance,
    subjects
  } = useAuth();

  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    selectedStudentFromNav?.id || students[0]?.id || ''
  );
  const [selectedTerm, setSelectedTerm] = useState<'TERM_1' | 'TERM_2' | 'TERM_3'>('TERM_1');
  const [academicYear, setAcademicYear] = useState('2025');

  const currentStudent = students.find(s => s.id === selectedStudentId);

  // Student assessments for this term
  const studentAssessments = assessments.filter(
    a => a.studentId === selectedStudentId && a.term === selectedTerm
  );

  // Student attendance count
  const studentAttendanceRecords = attendance.filter(a => a.studentId === selectedStudentId);
  const daysPresent = studentAttendanceRecords.filter(a => a.status === 'PRESENT').length || 64;
  const daysAbsent = studentAttendanceRecords.filter(a => a.status === 'ABSENT').length || 1;
  const totalDays = daysPresent + daysAbsent;

  // Average score & performance level
  const totalScorePercentage = studentAssessments.length > 0
    ? Math.round(studentAssessments.reduce((acc, curr) => acc + curr.percentage, 0) / studentAssessments.length)
    : 82;

  const getOverallLevel = (pct: number) => {
    if (pct >= 80) return { code: 'EE', label: 'Exceeding Expectations', color: 'text-emerald-700 bg-emerald-100 border-emerald-300' };
    if (pct >= 65) return { code: 'ME', label: 'Meeting Expectations', color: 'text-blue-700 bg-blue-100 border-blue-300' };
    if (pct >= 50) return { code: 'AE', label: 'Approaching Expectations', color: 'text-amber-700 bg-amber-100 border-amber-300' };
    return { code: 'BE', label: 'Below Expectations', color: 'text-rose-700 bg-rose-100 border-rose-300' };
  };

  const overall = getOverallLevel(totalScorePercentage);

  return (
    <div className="space-y-6">
      {/* Top Action Bar (hidden when printing) */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Select Learner
            </label>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
            >
              {students.map(s => (
                <option key={s.id} value={s.id}>
                  {s.firstName} {s.lastName} ({s.admissionNo} - {s.grade} {s.stream})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Academic Term
            </label>
            <select
              value={selectedTerm}
              onChange={(e) => setSelectedTerm(e.target.value as any)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none"
            >
              <option value="TERM_1">Term 1</option>
              <option value="TERM_2">Term 2</option>
              <option value="TERM_3">Term 3</option>
            </select>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 shadow-sm"
          >
            <Printer className="h-4 w-4" />
            <span>Print Report Card (PDF)</span>
          </button>
        </div>
      </div>

      {/* Official Report Card Printable Canvas */}
      {currentStudent && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-lg p-8 sm:p-12 max-w-4xl mx-auto text-slate-800 print:border-none print:shadow-none print:p-0">
          {/* Header */}
          <div className="text-center pb-6 border-b-2 border-slate-900">
            <div className="flex justify-center mb-2">
              {tenant?.logoUrl ? (
                <div className="h-16 w-16 rounded-2xl bg-white shadow-sm border border-slate-200 p-1 flex items-center justify-center overflow-hidden">
                  <img
                    src={tenant.logoUrl}
                    alt={tenant.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              ) : (
                <div className="h-16 w-16 rounded-2xl bg-indigo-900 text-white flex items-center justify-center text-2xl font-black shadow-md border-2 border-indigo-700">
                  {tenant?.name.charAt(0)}
                </div>
              )}
            </div>
            <h1 className="text-2xl font-black uppercase tracking-tight text-slate-900">
              {tenant?.name}
            </h1>
            <p className="text-xs text-slate-600 font-medium italic mt-0.5">"{tenant?.motto}"</p>
            <div className="text-[11px] text-slate-500 mt-1">
              {tenant?.address} • Phone: {tenant?.phone} • Email: {tenant?.contactEmail}
            </div>
            <div className="inline-block mt-3 px-4 py-1 bg-slate-900 text-white rounded-lg text-xs font-extrabold uppercase tracking-wider">
              CBC LEARNER SUMMATIVE PROGRESS REPORT – {selectedTerm.replace('_', ' ')}, {academicYear}
            </div>
          </div>

          {/* Student Meta Details */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-5 border-b border-slate-200 text-xs">
            <div>
              <span className="text-slate-400 font-bold uppercase text-[10px] block">Learner Name</span>
              <div className="font-black text-slate-900 text-sm mt-0.5">
                {currentStudent.firstName} {currentStudent.middleName || ''} {currentStudent.lastName}
              </div>
            </div>

            <div>
              <span className="text-slate-400 font-bold uppercase text-[10px] block">Admission Number</span>
              <div className="font-mono font-bold text-slate-900 mt-0.5">{currentStudent.admissionNo}</div>
            </div>

            <div>
              <span className="text-slate-400 font-bold uppercase text-[10px] block">Grade & Stream</span>
              <div className="font-bold text-slate-900 mt-0.5">{currentStudent.grade} ({currentStudent.stream})</div>
            </div>

            <div>
              <span className="text-slate-400 font-bold uppercase text-[10px] block">Term Attendance</span>
              <div className="font-bold text-slate-900 mt-0.5">
                {daysPresent} / {totalDays} Days ({Math.round((daysPresent / totalDays) * 100)}%)
              </div>
            </div>
          </div>

          {/* Academic Performance Table */}
          <div className="py-5">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-3">
              I. Learning Areas & Assessment Outcomes
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-300">
                <thead className="bg-slate-100 border-b border-slate-300 font-bold text-slate-700 uppercase text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3 border-r border-slate-300">Learning Area / Subject</th>
                    <th className="py-2.5 px-3 border-r border-slate-300">Curriculum Strand Assessed</th>
                    <th className="py-2.5 px-3 border-r border-slate-300 text-center">Score</th>
                    <th className="py-2.5 px-3 border-r border-slate-300 text-center">Level</th>
                    <th className="py-2.5 px-3">Teacher Rubric Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {studentAssessments.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-slate-400 italic">
                        No official assessment records recorded for this term.
                      </td>
                    </tr>
                  ) : (
                    studentAssessments.map((a) => (
                      <tr key={a.id} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-bold text-slate-900 border-r border-slate-200">
                          {a.subjectName}
                        </td>
                        <td className="py-2.5 px-3 text-slate-600 border-r border-slate-200 text-[11px]">
                          {a.strand}
                        </td>
                        <td className="py-2.5 px-3 font-mono font-bold text-center border-r border-slate-200">
                          {a.rawScore}/{a.maxScore} <span className="text-[10px] text-slate-400 font-normal">({a.percentage}%)</span>
                        </td>
                        <td className="py-2.5 px-3 text-center border-r border-slate-200">
                          <span className="px-2 py-0.5 rounded font-black text-[11px] bg-slate-100 text-slate-800 border border-slate-300">
                            {a.performanceLevel}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-700 italic text-[11px]">
                          {a.rubricComment}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Performance Level Scale Footnote */}
            <div className="mt-3 grid grid-cols-4 gap-2 text-[10px] text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-center">
              <div><span className="font-extrabold text-emerald-700">EE (80-100%):</span> Exceeding Expectations</div>
              <div><span className="font-extrabold text-blue-700">ME (65-79%):</span> Meeting Expectations</div>
              <div><span className="font-extrabold text-amber-700">AE (50-64%):</span> Approaching Expectations</div>
              <div><span className="font-extrabold text-rose-700">BE (0-49%):</span> Below Expectations</div>
            </div>
          </div>

          {/* CBC Core Competencies Assessment */}
          <div className="py-3 border-t border-slate-200">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-2">
              II. CBC Core Competencies & Values Evaluation
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Communication & Collab</span>
                <div className="font-bold text-emerald-700 mt-1">Exceeding (EE)</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Critical Thinking & STEM</span>
                <div className="font-bold text-emerald-700 mt-1">Exceeding (EE)</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Digital Literacy</span>
                <div className="font-bold text-blue-700 mt-1">Meeting (ME)</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Self-Efficacy & Values</span>
                <div className="font-bold text-emerald-700 mt-1">Exceeding (EE)</div>
              </div>
            </div>
          </div>

          {/* Remarks & Signatures */}
          <div className="py-4 border-t border-slate-200 space-y-4 text-xs">
            <div>
              <div className="flex items-center justify-between font-bold text-slate-800">
                <span>Class Teacher's General Remarks:</span>
                <span className="font-normal italic text-slate-500">Agnes Chepngetich</span>
              </div>
              <p className="mt-1 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 italic">
                "{currentStudent.firstName} is a highly engaged, creative learner who demonstrates outstanding leadership in group tasks and excellent analytical ability in mathematics."
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between font-bold text-slate-800">
                <span>Head Teacher's Summative Assessment:</span>
                <span className="font-normal italic text-slate-500">Dr. David Mutua</span>
              </div>
              <p className="mt-1 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 italic">
                "An admirable term result. Consistently upholds school values and strives for academic excellence. Approved for promotion."
              </p>
            </div>
          </div>

          {/* Signatures & Seal */}
          <div className="pt-8 border-t-2 border-slate-900 grid grid-cols-3 gap-6 text-xs text-center">
            <div>
              <div className="border-b border-slate-400 pb-1 font-semibold text-slate-800">
                Agnes Chepngetich
              </div>
              <div className="text-[10px] text-slate-400 mt-1">Class Teacher Signature</div>
            </div>

            <div>
              <div className="h-12 w-24 border-2 border-dashed border-indigo-300 rounded-lg mx-auto flex items-center justify-center text-[10px] font-bold text-indigo-400 uppercase">
                OFFICIAL SEAL
              </div>
              <div className="text-[10px] text-slate-400 mt-1">Institutional Stamp</div>
            </div>

            <div>
              <div className="border-b border-slate-400 pb-1 font-semibold text-slate-800">
                Dr. David Mutua
              </div>
              <div className="text-[10px] text-slate-400 mt-1">Head Teacher Signature</div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-3 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-400">
            <span>Next Term Reopening Date: <span className="font-bold text-slate-700">May 5th, 2025</span></span>
            <span>DAVETECH ERP • Verified Official Academic Transcript</span>
          </div>
        </div>
      )}
    </div>
  );
};
