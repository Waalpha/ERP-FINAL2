import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import {
  FileText,
  Download,
  Printer,
  Users,
  GraduationCap,
  Award,
  TrendingUp,
  CheckCircle2
} from 'lucide-react';

export const CollegeReportsTab: React.FC = () => {
  const { collegeStudents, collegeCourses, collegeDepartments, tenant } = useAuth();

  const totalStudents = (collegeStudents || []).length;
  const totalCourses = (collegeCourses || []).length;
  const totalDepartments = (collegeDepartments || []).length;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-900">Academic & Institutional Reports</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Official statutory enrollment statistics, department cohort distributions, and academic audit reports.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center space-x-1.5"
        >
          <Printer className="w-4 h-4" />
          <span>Print Summary Report</span>
        </button>
      </div>

      {/* Analytics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
            <span>Total Enrolled Cohort</span>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{totalStudents} Learners</div>
          <div className="text-[11px] text-slate-400 mt-1">Across all active academic programs</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
            <span>Accredited Programs</span>
            <GraduationCap className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-700">{totalCourses} Offerings</div>
          <div className="text-[11px] text-slate-400 mt-1">Degree, Diploma and Certificate levels</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
            <span>Active Faculties</span>
            <Award className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-purple-700">{totalDepartments} Academic Wings</div>
          <div className="text-[11px] text-slate-400 mt-1">Dean-governed divisions</div>
        </div>
      </div>

      {/* Program Distribution Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-900">Program Enrollment Breakdown</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
              <tr>
                <th className="py-3 px-4">Program Title</th>
                <th className="py-3 px-4">Code</th>
                <th className="py-3 px-4">Level</th>
                <th className="py-3 px-4 text-center">Enrolled Students</th>
                <th className="py-3 px-4 text-right">Tuition Per Sem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(collegeCourses || []).map((course) => {
                const count = (collegeStudents || []).filter(s => s.courseId === course.id).length;
                return (
                  <tr key={course.id} className="hover:bg-slate-50/60">
                    <td className="py-3 px-4 font-bold text-slate-900">{course.title}</td>
                    <td className="py-3 px-4 font-mono text-slate-600">{course.code}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700">
                        {course.level}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-indigo-600">{count}</td>
                    <td className="py-3 px-4 text-right font-mono font-semibold text-slate-900">
                      KES {course.tuitionFeePerSemester.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
