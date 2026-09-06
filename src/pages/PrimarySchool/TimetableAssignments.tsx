import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Clock,
  BookMarked,
  PlusCircle,
  Calendar,
  Layers,
  CheckCircle2,
  Trash2,
  BookOpen
} from 'lucide-react';
import { TimetableSlot, Assignment, PrimaryGradeLevel } from '../../types';

export const TimetableAssignments: React.FC = () => {
  const {
    timetable,
    assignments,
    subjects,
    staff,
    user,
    saveTimetableSlot,
    deleteTimetableSlot,
    createAssignment
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'timetable' | 'assignments'>('timetable');
  const [selectedGrade, setSelectedGrade] = useState<PrimaryGradeLevel>('Grade 4');
  const [selectedDay, setSelectedDay] = useState<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday'>('Monday');

  // Modals
  const [showAddSlotModal, setShowAddSlotModal] = useState(false);
  const [showAddAssignmentModal, setShowAddAssignmentModal] = useState(false);

  // Timetable slot form
  const [slotDay, setSlotDay] = useState<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday'>('Monday');
  const [startTime, setStartTime] = useState('08:20');
  const [endTime, setEndTime] = useState('09:00');
  const [subjectName, setSubjectName] = useState('Mathematical Activities');
  const [teacherName, setTeacherName] = useState(staff[0]?.fullName || 'James Otieno');
  const [room, setRoom] = useState('Room C-101');

  // Assignment form
  const [asgTitle, setAsgTitle] = useState('');
  const [asgSubject, setAsgSubject] = useState('Science and Technology');
  const [asgInstructions, setAsgInstructions] = useState('');
  const [asgDueDate, setAsgDueDate] = useState('2025-03-05');
  const [asgMaxMarks, setAsgMaxMarks] = useState<number>(20);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const;

  const handleSaveSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveTimetableSlot({
      dayOfWeek: slotDay,
      startTime,
      endTime,
      grade: selectedGrade,
      stream: 'Alpha',
      subjectName,
      teacherName,
      room
    });
    setShowAddSlotModal(false);
  };

  const handleSaveAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!asgTitle || !asgInstructions) return;

    await createAssignment({
      title: asgTitle,
      grade: selectedGrade,
      stream: 'Alpha',
      subjectName: asgSubject,
      instructions: asgInstructions,
      dueDate: asgDueDate,
      maxMarks: Number(asgMaxMarks),
      teacherName: user?.displayName || 'Class Teacher',
      status: 'ACTIVE'
    });

    setAsgTitle('');
    setAsgInstructions('');
    setShowAddAssignmentModal(false);
  };

  const filteredSlots = timetable.filter(t => t.grade === selectedGrade && t.dayOfWeek === selectedDay);
  const filteredAssignments = assignments.filter(a => a.grade === selectedGrade);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Timetable & Homework Assignments
          </h1>
          <p className="text-xs text-slate-500">
            Weekly academic scheduling, room allocations, and student homework tasks.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          {activeTab === 'timetable' ? (
            <button
              onClick={() => setShowAddSlotModal(true)}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-all flex items-center space-x-1.5"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Add Timetable Period</span>
            </button>
          ) : (
            <button
              onClick={() => setShowAddAssignmentModal(true)}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-all flex items-center space-x-1.5"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Publish Homework</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('timetable')}
          className={`px-3.5 py-2 rounded-xl transition-colors ${
            activeTab === 'timetable' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Weekly Class Schedule
        </button>
        <button
          onClick={() => setActiveTab('assignments')}
          className={`px-3.5 py-2 rounded-xl transition-colors ${
            activeTab === 'assignments' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Assignments & Tasks ({assignments.length})
        </button>
      </div>

      {/* Timetable Tab */}
      {activeTab === 'timetable' && (
        <div className="space-y-4">
          {/* Day & Grade selectors */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0">
              {daysOfWeek.map((d) => (
                <button
                  key={d}
                  onClick={() => setSelectedDay(d)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedDay === d
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-slate-500">Grade:</span>
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value as PrimaryGradeLevel)}
                className="px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-semibold bg-white focus:outline-none"
              >
                <option value="Grade 1">Grade 1</option>
                <option value="Grade 2">Grade 2</option>
                <option value="Grade 3">Grade 3</option>
                <option value="Grade 4">Grade 4</option>
                <option value="Grade 5">Grade 5</option>
                <option value="Grade 6">Grade 6</option>
                <option value="Grade 7">Grade 7 (Junior)</option>
              </select>
            </div>
          </div>

          {/* Schedule Slots */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
              {selectedGrade} Schedule • {selectedDay}
            </h2>

            {filteredSlots.length === 0 ? (
              <div className="text-center py-10 text-xs text-slate-400">
                No periods scheduled for {selectedGrade} on {selectedDay}.
              </div>
            ) : (
              <div className="space-y-3">
                {filteredSlots.map((slot) => (
                  <div
                    key={slot.id}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-indigo-50/40 hover:border-indigo-200 transition-all"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="px-3 py-2 rounded-xl bg-indigo-100 text-indigo-800 font-bold text-xs font-mono text-center flex-shrink-0">
                        {slot.startTime} - {slot.endTime}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm">{slot.subjectName}</h3>
                        <div className="text-xs text-slate-500 flex items-center space-x-2 mt-0.5">
                          <span>Instructor: <span className="font-semibold text-slate-700">{slot.teacherName}</span></span>
                          <span>•</span>
                          <span>Room: <span className="font-mono">{slot.room}</span></span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => deleteTimetableSlot(slot.id)}
                      className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors self-end sm:self-center"
                      title="Remove Slot"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Assignments Tab */}
      {activeTab === 'assignments' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredAssignments.map((asg) => (
              <div key={asg.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700">
                      {asg.subjectName}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      Due: <span className="font-bold text-rose-600">{asg.dueDate}</span>
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 mt-2.5">{asg.title}</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{asg.instructions}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 mt-4 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Teacher: {asg.teacherName}</span>
                  <span className="font-bold text-indigo-600 font-mono">Max Marks: {asg.maxMarks}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Slot Modal */}
      {showAddSlotModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-slate-900 text-base mb-1">Add Timetable Period</h3>
            <p className="text-xs text-slate-500 mb-4">Allocate subject, instructor, and room</p>

            <form onSubmit={handleSaveSlot} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Day of Week</label>
                  <select
                    value={slotDay}
                    onChange={(e) => setSlotDay(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none"
                  >
                    {daysOfWeek.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Room / Venue</label>
                  <input
                    type="text"
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Start Time</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">End Time</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Subject</label>
                <select
                  value={subjectName}
                  onChange={(e) => setSubjectName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none"
                >
                  {subjects.map(s => (
                    <option key={s.id} value={s.name}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Teacher</label>
                <select
                  value={teacherName}
                  onChange={(e) => setTeacherName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none"
                >
                  {staff.map(st => (
                    <option key={st.id} value={st.fullName}>{st.fullName} ({st.designation})</option>
                  ))}
                </select>
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddSlotModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl"
                >
                  Save Period
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Assignment Modal */}
      {showAddAssignmentModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-slate-900 text-base mb-1">Publish Homework / Task</h3>
            <p className="text-xs text-slate-500 mb-4">Post CBC assignment for {selectedGrade}</p>

            <form onSubmit={handleSaveAssignment} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Task Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Plant Germination Experiment Report"
                  value={asgTitle}
                  onChange={(e) => setAsgTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Subject</label>
                  <select
                    value={asgSubject}
                    onChange={(e) => setAsgSubject(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none"
                  >
                    {subjects.map(s => (
                      <option key={s.id} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Max Marks</label>
                  <input
                    type="number"
                    min={1}
                    value={asgMaxMarks}
                    onChange={(e) => setAsgMaxMarks(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Submission Due Date</label>
                <input
                  type="date"
                  value={asgDueDate}
                  onChange={(e) => setAsgDueDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Task Instructions *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe requirements and materials..."
                  value={asgInstructions}
                  onChange={(e) => setAsgInstructions(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddAssignmentModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl"
                >
                  Publish Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
