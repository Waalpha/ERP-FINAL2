import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  BookOpen,
  Award,
  PlusCircle,
  Search,
  Filter,
  Layers,
  Sparkles,
  TrendingUp,
  FileSpreadsheet,
  CheckCircle,
  BookMarked
} from 'lucide-react';
import { CBCSubject, AssessmentRecord, PrimaryGradeLevel } from '../../types';

interface CBCAcademicsProps {
  onGenerateReportForStudent?: (studentId: string) => void;
}

export const CBCAcademics: React.FC<CBCAcademicsProps> = ({ onGenerateReportForStudent }) => {
  const {
    tenant,
    students,
    subjects,
    assessments,
    user,
    recordAssessment
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'assessments' | 'subjects'>('assessments');
  const [selectedGrade, setSelectedGrade] = useState<string>('Grade 4');
  const [selectedAssessmentType, setSelectedAssessmentType] = useState<string>('ALL');
  const [showAddAssessmentModal, setShowAddAssessmentModal] = useState(false);

  // New Assessment Form State
  const [studentId, setStudentId] = useState(students[0]?.id || '');
  const [subjectId, setSubjectId] = useState(subjects[0]?.id || '');
  const [assessmentType, setAssessmentType] = useState<'FORMATIVE' | 'SUMMATIVE' | 'OPENER' | 'MID_TERM' | 'END_TERM'>('MID_TERM');
  const [strand, setStrand] = useState('Numbers - Whole Numbers & Multiplication');
  const [rawScore, setRawScore] = useState<number>(85);
  const [maxScore, setMaxScore] = useState<number>(100);
  const [rubricComment, setRubricComment] = useState('Demonstrates clear understanding of problem-solving techniques.');

  const calculateLevel = (percentage: number): 'EE' | 'ME' | 'AE' | 'BE' => {
    if (percentage >= 80) return 'EE';
    if (percentage >= 65) return 'ME';
    if (percentage >= 50) return 'AE';
    return 'BE';
  };

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'EE':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'ME':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'AE':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'BE':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  const handleAssessmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetStudent = students.find(s => s.id === studentId);
    const targetSubject = subjects.find(sub => sub.id === subjectId);
    if (!targetStudent || !targetSubject) return;

    const percentage = Math.round((rawScore / maxScore) * 100);
    const level = calculateLevel(percentage);

    await recordAssessment({
      academicYear: tenant?.currentAcademicYear || '2025',
      term: tenant?.currentTerm || 'TERM_1',
      assessmentType,
      grade: targetStudent.grade,
      stream: targetStudent.stream,
      studentId: targetStudent.id,
      studentName: `${targetStudent.firstName} ${targetStudent.lastName}`,
      admissionNo: targetStudent.admissionNo,
      subjectId: targetSubject.id,
      subjectName: targetSubject.name,
      strand,
      rawScore: Number(rawScore),
      maxScore: Number(maxScore),
      performanceLevel: level,
      rubricComment,
      teacherName: user?.displayName || 'Class Teacher',
      date: new Date().toISOString().split('T')[0]
    });

    setShowAddAssessmentModal(false);
  };

  const filteredAssessments = assessments.filter(a => {
    const matchesGrade = selectedGrade === 'ALL' || a.grade === selectedGrade;
    const matchesType = selectedAssessmentType === 'ALL' || a.assessmentType === selectedAssessmentType;
    return matchesGrade && matchesType;
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            CBC Academics & Assessment Engine
          </h1>
          <p className="text-xs text-slate-500">
            Competency-based curriculum learning areas, strands, and standardized performance levels.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => setShowAddAssessmentModal(true)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-all flex items-center space-x-1.5"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Record Assessment</span>
          </button>
        </div>
      </div>

      {/* CBC Performance Levels Legend Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 text-emerald-900">
          <div className="flex items-center justify-between">
            <span className="font-extrabold text-sm">EE (80% - 100%)</span>
            <span className="text-[10px] uppercase font-bold bg-emerald-200 px-1.5 py-0.5 rounded">Level 4</span>
          </div>
          <div className="text-xs font-bold mt-1">Exceeding Expectations</div>
          <p className="text-[10px] text-emerald-700 mt-0.5">Mastery beyond grade competency</p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3 text-blue-900">
          <div className="flex items-center justify-between">
            <span className="font-extrabold text-sm">ME (65% - 79%)</span>
            <span className="text-[10px] uppercase font-bold bg-blue-200 px-1.5 py-0.5 rounded">Level 3</span>
          </div>
          <div className="text-xs font-bold mt-1">Meeting Expectations</div>
          <p className="text-[10px] text-blue-700 mt-0.5">Successfully achieves strand criteria</p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-amber-900">
          <div className="flex items-center justify-between">
            <span className="font-extrabold text-sm">AE (50% - 64%)</span>
            <span className="text-[10px] uppercase font-bold bg-amber-200 px-1.5 py-0.5 rounded">Level 2</span>
          </div>
          <div className="text-xs font-bold mt-1">Approaching Expectations</div>
          <p className="text-[10px] text-amber-700 mt-0.5">Developing competence with guidance</p>
        </div>

        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3 text-rose-900">
          <div className="flex items-center justify-between">
            <span className="font-extrabold text-sm">BE (0% - 49%)</span>
            <span className="text-[10px] uppercase font-bold bg-rose-200 px-1.5 py-0.5 rounded">Level 1</span>
          </div>
          <div className="text-xs font-bold mt-1">Below Expectations</div>
          <p className="text-[10px] text-rose-700 mt-0.5">Requires immediate remedial support</p>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('assessments')}
          className={`px-3.5 py-2 rounded-xl transition-colors ${
            activeTab === 'assessments' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Recorded Assessments ({assessments.length})
        </button>
        <button
          onClick={() => setActiveTab('subjects')}
          className={`px-3.5 py-2 rounded-xl transition-colors ${
            activeTab === 'subjects' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          CBC Learning Areas & Strands ({subjects.length})
        </button>
      </div>

      {/* Assessments Tab */}
      {activeTab === 'assessments' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-3 flex-1">
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 font-medium focus:outline-none"
              >
                <option value="ALL">All Grades</option>
                {allGrades.map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>

              <select
                value={selectedAssessmentType}
                onChange={(e) => setSelectedAssessmentType(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 font-medium focus:outline-none"
              >
                <option value="ALL">All Exam Types</option>
                <option value="FORMATIVE">Formative Task</option>
                <option value="SUMMATIVE">Summative</option>
                <option value="MID_TERM">Mid-Term Exam</option>
                <option value="END_TERM">End-Term Assessment</option>
              </select>
            </div>
            <div className="text-xs text-slate-500 font-medium">
              Showing <span className="font-bold text-slate-800">{filteredAssessments.length}</span> entries
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                <tr>
                  <th className="py-3 px-4">Learner & Grade</th>
                  <th className="py-3 px-4">Subject & Strand</th>
                  <th className="py-3 px-4">Exam Type</th>
                  <th className="py-3 px-4">Raw Score</th>
                  <th className="py-3 px-4">CBC Level</th>
                  <th className="py-3 px-4">Teacher Remark</th>
                  <th className="py-3 px-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAssessments.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50/80">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{a.studentName}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{a.admissionNo} • {a.grade}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800">{a.subjectName}</div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[200px]">{a.strand}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-700">
                        {a.assessmentType.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {a.rawScore} / {a.maxScore} <span className="text-slate-400 font-normal">({a.percentage}%)</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-extrabold border ${getLevelBadge(a.performanceLevel)}`}>
                        {a.performanceLevel}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 italic text-[11px] max-w-[220px]">
                      "{a.rubricComment}"
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">{a.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Subjects & Strands Tab */}
      {activeTab === 'subjects' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {subjects.map((sub) => (
            <div key={sub.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-2.5">
                  <div className="h-8 w-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
                    CBC
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{sub.name}</h3>
                    <span className="text-[10px] text-slate-400 font-mono">Code: {sub.code}</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 text-[10px] font-bold">
                  {sub.category}
                </span>
              </div>

              <div className="mt-3 space-y-2 text-xs">
                <div className="text-slate-500 font-semibold text-[11px]">Curriculum Strands & Sub-strands:</div>
                <div className="space-y-1.5">
                  {sub.strands.map((str, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="font-bold text-slate-800">{str.strandName}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {str.subStrands.join(' • ')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Record Assessment Modal */}
      {showAddAssessmentModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-slate-900 text-base">Record CBC Assessment</h3>
              <button
                onClick={() => setShowAddAssessmentModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAssessmentSubmit} className="py-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Learner *</label>
                <select
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.firstName} {s.lastName} ({s.admissionNo} - {s.grade} {s.stream})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Subject / Area *</label>
                  <select
                    value={subjectId}
                    onChange={(e) => setSubjectId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none"
                  >
                    {subjects.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Assessment Type</label>
                  <select
                    value={assessmentType}
                    onChange={(e) => setAssessmentType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none"
                  >
                    <option value="MID_TERM">Mid-Term Exam</option>
                    <option value="END_TERM">End-Term Assessment</option>
                    <option value="OPENER">Opener Evaluation</option>
                    <option value="FORMATIVE">Formative Task</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Strand / Skill Tested</label>
                <input
                  type="text"
                  required
                  value={strand}
                  onChange={(e) => setStrand(e.target.value)}
                  placeholder="e.g. Living Things & Environment"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Raw Score</label>
                  <input
                    type="number"
                    required
                    min={0}
                    max={maxScore}
                    value={rawScore}
                    onChange={(e) => setRawScore(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Max Score</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={maxScore}
                    onChange={(e) => setMaxScore(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold text-sm focus:outline-none"
                  />
                </div>
              </div>

              {/* Real-time Level Preview */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Calculated CBC Level:</span>
                  <div className="text-xs font-bold text-slate-800">
                    {Math.round((rawScore / maxScore) * 100)}% Performance
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-lg text-xs font-black border ${getLevelBadge(calculateLevel(Math.round((rawScore / maxScore) * 100)))}`}>
                  {calculateLevel(Math.round((rawScore / maxScore) * 100))}
                </span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Teacher Rubric Comment</label>
                <input
                  type="text"
                  value={rubricComment}
                  onChange={(e) => setRubricComment(e.target.value)}
                  placeholder="e.g. Excellent conceptual grasp"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddAssessmentModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-sm"
                >
                  Save Assessment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
