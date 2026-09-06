import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import {
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Filter,
  Save,
  Users
} from 'lucide-react';

interface AttendanceRecord {
  studentId: string;
  studentName: string;
  regNo: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
  remarks?: string;
}

export const CollegeAttendanceTab: React.FC = () => {
  const { collegeStudents } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedUnit, setSelectedUnit] = useState('BCS 101 - Calculus');
  const [searchTerm, setSearchTerm] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [attendanceList, setAttendanceList] = useState<AttendanceRecord[]>(() => {
    return (collegeStudents || []).map((s, idx) => ({
      studentId: s.id,
      studentName: s.fullName,
      regNo: s.regNo,
      status: idx % 7 === 0 ? 'ABSENT' : idx % 9 === 0 ? 'LATE' : 'PRESENT',
      remarks: ''
    }));
  });

  const toggleStatus = (studentId: string, nextStatus: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED') => {
    setAttendanceList(prev =>
      prev.map(item => (item.studentId === studentId ? { ...item, status: nextStatus } : item))
    );
  };

  const handleSaveAttendance = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const markAll = (status: 'PRESENT' | 'ABSENT') => {
    setAttendanceList(prev => prev.map(item => ({ ...item, status })));
  };

  const presentCount = attendanceList.filter(a => a.status === 'PRESENT').length;
  const absentCount = attendanceList.filter(a => a.status === 'ABSENT').length;
  const lateCount = attendanceList.filter(a => a.status === 'LATE').length;

  const filteredList = attendanceList.filter(a =>
    a.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.regNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-900">Lecture Attendance & Roll Call</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time daily class attendance registers, absenteeism tracking, and lecture contact compliance.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {savedSuccess && (
            <div className="flex items-center space-x-1 text-emerald-600 text-xs font-bold mr-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Register Saved</span>
            </div>
          )}
          <button
            onClick={handleSaveAttendance}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center space-x-1.5"
          >
            <Save className="w-4 h-4" />
            <span>Save Attendance Sheet</span>
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 mb-1">Total Enrolled</div>
          <div className="text-2xl font-bold text-slate-900">{attendanceList.length}</div>
          <div className="text-[11px] text-slate-400 mt-1">Class register headcount</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 mb-1">Present Today</div>
          <div className="text-2xl font-bold text-emerald-600">{presentCount}</div>
          <div className="text-[11px] text-slate-400 mt-1">
            {attendanceList.length > 0 ? Math.round((presentCount / attendanceList.length) * 100) : 100}% Attendance
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 mb-1">Absent</div>
          <div className="text-2xl font-bold text-rose-600">{absentCount}</div>
          <div className="text-[11px] text-slate-400 mt-1">Unexcused absentees</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 mb-1">Late Arrivals</div>
          <div className="text-2xl font-bold text-amber-600">{lateCount}</div>
          <div className="text-[11px] text-slate-400 mt-1">Tardy check-ins</div>
        </div>
      </div>

      {/* Main Register Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none"
            />
            <select
              value={selectedUnit}
              onChange={(e) => setSelectedUnit(e.target.value)}
              className="px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none"
            >
              <option value="BCS 101 - Calculus">BCS 101 - Calculus for CS</option>
              <option value="BCS 102 - Data Structures">BCS 102 - Data Structures</option>
              <option value="BBIT 204 - Databases">BBIT 204 - Databases</option>
            </select>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => markAll('PRESENT')}
              className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-xl transition"
            >
              Mark All Present
            </button>
            <button
              onClick={() => markAll('ABSENT')}
              className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold rounded-xl transition"
            >
              Mark All Absent
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search student by name or Reg No..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Attendance List */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
              <tr>
                <th className="py-3 px-4">Student & Reg No</th>
                <th className="py-3 px-4">Attendance Status</th>
                <th className="py-3 px-4 text-right">Quick Mark</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredList.map((item) => (
                <tr key={item.studentId} className="hover:bg-slate-50/60">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{item.studentName}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{item.regNo}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      item.status === 'PRESENT' ? 'bg-emerald-100 text-emerald-800' :
                      item.status === 'ABSENT' ? 'bg-rose-100 text-rose-800' :
                      item.status === 'LATE' ? 'bg-amber-100 text-amber-800' :
                      'bg-slate-100 text-slate-800'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="inline-flex items-center space-x-1">
                      <button
                        onClick={() => toggleStatus(item.studentId, 'PRESENT')}
                        className={`px-2 py-1 rounded-lg text-xs font-bold transition ${
                          item.status === 'PRESENT'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                        }`}
                      >
                        P
                      </button>
                      <button
                        onClick={() => toggleStatus(item.studentId, 'ABSENT')}
                        className={`px-2 py-1 rounded-lg text-xs font-bold transition ${
                          item.status === 'ABSENT'
                            ? 'bg-rose-600 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-700'
                        }`}
                      >
                        A
                      </button>
                      <button
                        onClick={() => toggleStatus(item.studentId, 'LATE')}
                        className={`px-2 py-1 rounded-lg text-xs font-bold transition ${
                          item.status === 'LATE'
                            ? 'bg-amber-600 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-amber-50 hover:text-amber-700'
                        }`}
                      >
                        L
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
