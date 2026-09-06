import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Save,
  CheckCheck,
  Calendar,
  Filter,
  Users
} from 'lucide-react';
import { PrimaryGradeLevel, AttendanceStatus } from '../../types';

export const AttendanceTracker: React.FC = () => {
  const {
    students,
    classes,
    attendance,
    user,
    markAttendanceBatch
  } = useAuth();

  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedGrade, setSelectedGrade] = useState<PrimaryGradeLevel>('Grade 4');
  const [selectedStream, setSelectedStream] = useState<string>('Alpha');
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Roster students for selected grade/stream
  const rosterStudents = students.filter(s => s.grade === selectedGrade && s.status === 'ACTIVE');

  // Local state for tracking changes during roll call
  const [attendanceState, setAttendanceState] = useState<Record<string, { status: AttendanceStatus; remarks?: string }>>(() => {
    const map: Record<string, { status: AttendanceStatus; remarks?: string }> = {};
    rosterStudents.forEach(s => {
      // Find existing attendance for date
      const existing = attendance.find(a => a.studentId === s.id && a.date === selectedDate);
      map[s.id] = {
        status: existing?.status || 'PRESENT',
        remarks: existing?.remarks || ''
      };
    });
    return map;
  });

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendanceState(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status
      }
    }));
  };

  const handleMarkAllPresent = () => {
    const updated: Record<string, { status: AttendanceStatus; remarks?: string }> = {};
    rosterStudents.forEach(s => {
      updated[s.id] = { status: 'PRESENT', remarks: '' };
    });
    setAttendanceState(updated);
  };

  const handleSaveAttendance = async () => {
    const records = rosterStudents.map(student => ({
      date: selectedDate,
      grade: student.grade,
      stream: student.stream,
      studentId: student.id,
      studentName: `${student.firstName} ${student.lastName}`,
      admissionNo: student.admissionNo,
      status: attendanceState[student.id]?.status || 'PRESENT',
      remarks: attendanceState[student.id]?.remarks || '',
      recordedBy: user?.displayName || 'Class Teacher'
    }));

    await markAttendanceBatch(records);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

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

  // Stats for current roll call
  const attendanceValues = Object.values(attendanceState) as Array<{ status: AttendanceStatus; remarks?: string }>;
  const presentCount = attendanceValues.filter(v => v?.status === 'PRESENT').length;
  const absentCount = attendanceValues.filter(v => v?.status === 'ABSENT').length;
  const lateCount = attendanceValues.filter(v => v?.status === 'LATE').length;
  const excusedCount = attendanceValues.filter(v => v?.status === 'EXCUSED').length;
  const totalRoster = rosterStudents.length;
  const attendanceRate = totalRoster > 0 ? Math.round(((presentCount + lateCount) / totalRoster) * 100) : 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Daily Attendance Roll Call</h1>
          <p className="text-xs text-slate-500">
            Record class attendance, track tardiness, and generate absence alerts.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={handleMarkAllPresent}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all flex items-center space-x-1.5"
          >
            <CheckCheck className="h-4 w-4 text-emerald-600" />
            <span>Mark All Present</span>
          </button>

          <button
            onClick={handleSaveAttendance}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-all flex items-center space-x-1.5"
          >
            <Save className="h-4 w-4" />
            <span>Save Roll Call</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-semibold flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <span>Attendance records for {selectedGrade} on {selectedDate} saved successfully!</span>
        </div>
      )}

      {/* Filter Control Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Roll Call Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Grade Level
            </label>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value as PrimaryGradeLevel)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none"
            >
              {allGrades.map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Stream
            </label>
            <input
              type="text"
              value={selectedStream}
              onChange={(e) => setSelectedStream(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none"
            />
          </div>
        </div>

        {/* Quick Stats Ribbon */}
        <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
          <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Enrolled Roster</span>
            <div className="text-sm font-black text-slate-800">{totalRoster}</div>
          </div>
          <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-100">
            <span className="text-[10px] text-emerald-600 font-bold uppercase">Present</span>
            <div className="text-sm font-black text-emerald-700">{presentCount}</div>
          </div>
          <div className="p-2 rounded-xl bg-rose-50 border border-rose-100">
            <span className="text-[10px] text-rose-600 font-bold uppercase">Absent</span>
            <div className="text-sm font-black text-rose-700">{absentCount}</div>
          </div>
          <div className="p-2 rounded-xl bg-amber-50 border border-amber-100">
            <span className="text-[10px] text-amber-600 font-bold uppercase">Late</span>
            <div className="text-sm font-black text-amber-700">{lateCount}</div>
          </div>
          <div className="p-2 rounded-xl bg-indigo-50 border border-indigo-100">
            <span className="text-[10px] text-indigo-600 font-bold uppercase">Attendance %</span>
            <div className="text-sm font-black text-indigo-700">{attendanceRate}%</div>
          </div>
        </div>
      </div>

      {/* Roster Roll Call List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            {selectedGrade} {selectedStream} Learner Roster
          </h2>
          <span className="text-xs text-slate-500 font-mono">Date: {selectedDate}</span>
        </div>

        <div className="divide-y divide-slate-100">
          {rosterStudents.map((student) => {
            const currentStatus = attendanceState[student.id]?.status || 'PRESENT';

            return (
              <div key={student.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-700 font-bold text-xs flex items-center justify-center border border-indigo-100">
                    {student.firstName[0]}{student.lastName[0]}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-xs sm:text-sm">
                      {student.firstName} {student.middleName || ''} {student.lastName}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {student.admissionNo} • Parent: {student.parentName} ({student.parentPhone})
                    </div>
                  </div>
                </div>

                {/* Status Toggle Chips */}
                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={() => handleStatusChange(student.id, 'PRESENT')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      currentStatus === 'PRESENT'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Present
                  </button>

                  <button
                    onClick={() => handleStatusChange(student.id, 'LATE')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      currentStatus === 'LATE'
                        ? 'bg-amber-500 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Late
                  </button>

                  <button
                    onClick={() => handleStatusChange(student.id, 'ABSENT')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      currentStatus === 'ABSENT'
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Absent
                  </button>

                  <button
                    onClick={() => handleStatusChange(student.id, 'EXCUSED')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      currentStatus === 'EXCUSED'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Excused
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
