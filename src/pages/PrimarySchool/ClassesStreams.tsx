import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Layers,
  PlusCircle,
  Users,
  GraduationCap,
  Sparkles,
  Building,
  CheckCircle2
} from 'lucide-react';
import { ClassStream, PrimaryGradeLevel } from '../../types';

export const ClassesStreams: React.FC = () => {
  const { classes, students, staff, addClassStream } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);

  const [grade, setGrade] = useState<PrimaryGradeLevel>('Grade 4');
  const [stream, setStream] = useState('Beta');
  const [capacity, setCapacity] = useState<number>(35);
  const [classTeacherName, setClassTeacherName] = useState(staff[0]?.fullName || 'Agnes Chepngetich');
  const [roomNumber, setRoomNumber] = useState('Room C-102');

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

  const handleAddClass = async (e: React.FormEvent) => {
    e.preventDefault();
    await addClassStream({
      grade,
      stream,
      capacity: Number(capacity),
      enrolledCount: 0,
      classTeacherName,
      roomNumber,
      academicYear: '2025'
    });
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Classes & Stream Structure</h1>
          <p className="text-xs text-slate-500">
            Classroom capacities, appointed class teachers, and stream allocations.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-all flex items-center space-x-1.5"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Create Stream</span>
        </button>
      </div>

      {/* Stream Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {classes.map((cls) => {
          const currentEnrolled = students.filter(s => s.grade === cls.grade && s.stream === cls.stream).length;
          const occupancyRate = cls.capacity > 0 ? Math.round((currentEnrolled / cls.capacity) * 100) : 0;

          return (
            <div key={cls.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-indigo-300 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{cls.grade}</h3>
                    <span className="text-xs text-indigo-600 font-semibold font-mono">Stream: {cls.stream}</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-mono font-bold">
                    {cls.roomNumber}
                  </span>
                </div>

                <div className="py-3 space-y-2 text-xs">
                  <div className="text-slate-600">
                    <span className="text-slate-400">Class Teacher:</span>{' '}
                    <span className="font-bold text-slate-800">{cls.classTeacherName}</span>
                  </div>

                  <div className="space-y-1 pt-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">Learners Enrolled:</span>
                      <span className="font-bold text-slate-900 font-mono">
                        {currentEnrolled} / {cls.capacity} ({occupancyRate}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          occupancyRate > 90 ? 'bg-amber-500' : 'bg-indigo-600'
                        }`}
                        style={{ width: `${Math.min(100, occupancyRate)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>Academic Year: {cls.academicYear}</span>
                <span className="text-emerald-600 font-semibold flex items-center space-x-1">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>Active</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-slate-900 text-base mb-1">Create Class Stream</h3>
            <p className="text-xs text-slate-500 mb-4">Add a new classroom stream to the institution</p>

            <form onSubmit={handleAddClass} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Grade Level</label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value as PrimaryGradeLevel)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none"
                >
                  {allGrades.map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Stream Name</label>
                  <input
                    type="text"
                    required
                    value={stream}
                    onChange={(e) => setStream(e.target.value)}
                    placeholder="e.g. Beta, Blue"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Max Capacity</label>
                  <input
                    type="number"
                    required
                    min={10}
                    max={60}
                    value={capacity}
                    onChange={(e) => setCapacity(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Class Teacher</label>
                <select
                  value={classTeacherName}
                  onChange={(e) => setClassTeacherName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none"
                >
                  {staff.map(st => (
                    <option key={st.id} value={st.fullName}>{st.fullName} ({st.designation})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Room / Hall</label>
                <input
                  type="text"
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  placeholder="e.g. Room A-204"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl"
                >
                  Save Stream
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
