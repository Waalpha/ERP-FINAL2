import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import {
  BookOpen,
  PlusCircle,
  Search,
  Calendar,
  Clock,
  MapPin,
  Users,
  GraduationCap
} from 'lucide-react';

interface CollegeClassUnit {
  id: string;
  code: string;
  title: string;
  courseName: string;
  lecturerName: string;
  venue: string;
  dayOfWeek: string;
  timeSlot: string;
  enrolledStudentsCount: number;
  credits: number;
}

export const CollegeClassesTab: React.FC = () => {
  const { collegeCourses, collegeStudents } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDay, setSelectedDay] = useState('ALL');
  const [showAddClassModal, setShowAddClassModal] = useState(false);

  const [classesList, setClassesList] = useState<CollegeClassUnit[]>([
    {
      id: 'CLS-1',
      code: 'BCS 101',
      title: 'Calculus for Computer Science',
      courseName: 'Bachelor of Science in Computer Science',
      lecturerName: 'Dr. Joseph Mutua',
      venue: 'Lecture Hall 3B (Main Complex)',
      dayOfWeek: 'Monday',
      timeSlot: '08:00 AM - 11:00 AM',
      enrolledStudentsCount: 48,
      credits: 3
    },
    {
      id: 'CLS-2',
      code: 'BCS 102',
      title: 'Data Structures & Algorithms',
      courseName: 'Bachelor of Science in Computer Science',
      lecturerName: 'Prof. Alice Wanjiru',
      venue: 'Computer Lab 2 (Science Wing)',
      dayOfWeek: 'Tuesday',
      timeSlot: '11:00 AM - 02:00 PM',
      enrolledStudentsCount: 48,
      credits: 4
    },
    {
      id: 'CLS-3',
      code: 'BBIT 204',
      title: 'Database Design & Management',
      courseName: 'Bachelor of Business Information Technology',
      lecturerName: 'Dr. Kennedy Otieno',
      venue: 'Lab 4 (Technology Block)',
      dayOfWeek: 'Wednesday',
      timeSlot: '02:00 PM - 05:00 PM',
      enrolledStudentsCount: 36,
      credits: 3
    },
    {
      id: 'CLS-4',
      code: 'BCOM 101',
      title: 'Financial Accounting & Taxation',
      courseName: 'Bachelor of Commerce',
      lecturerName: 'CPA Faith Chebet',
      venue: 'Auditorium 1',
      dayOfWeek: 'Thursday',
      timeSlot: '09:00 AM - 12:00 PM',
      enrolledStudentsCount: 62,
      credits: 3
    }
  ]);

  // Form states
  const [unitCode, setUnitCode] = useState('');
  const [unitTitle, setUnitTitle] = useState('');
  const [courseName, setCourseName] = useState((collegeCourses || [])[0]?.title || 'Computer Science');
  const [lecturerName, setLecturerName] = useState('');
  const [venue, setVenue] = useState('Lecture Hall 1A');
  const [dayOfWeek, setDayOfWeek] = useState('Monday');
  const [timeSlot, setTimeSlot] = useState('08:00 AM - 11:00 AM');
  const [credits, setCredits] = useState(3);

  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!unitCode || !unitTitle) return;

    const newClass: CollegeClassUnit = {
      id: `CLS-${Date.now()}`,
      code: unitCode.toUpperCase(),
      title: unitTitle,
      courseName,
      lecturerName: lecturerName || 'Faculty Lecturer',
      venue,
      dayOfWeek,
      timeSlot,
      enrolledStudentsCount: Math.floor(25 + Math.random() * 30),
      credits
    };

    setClassesList(prev => [newClass, ...prev]);
    setUnitCode('');
    setUnitTitle('');
    setLecturerName('');
    setShowAddClassModal(false);
  };

  const filtered = classesList.filter(c => {
    const matchSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.lecturerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchDay = selectedDay === 'ALL' || c.dayOfWeek === selectedDay;
    return matchSearch && matchDay;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-900">Classes, Units & Lecture Timetable</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Curriculum unit assignments, designated lecture halls, scheduled timetable slots, and faculty allocators.
          </p>
        </div>

        <button
          onClick={() => setShowAddClassModal(true)}
          className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center space-x-1.5"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Schedule Unit / Class</span>
        </button>
      </div>

      {/* Class Schedule Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by unit code or lecturer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              className="px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none"
            >
              <option value="ALL">All Days of Week</option>
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
              <option value="Saturday">Saturday</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((cls) => (
            <div key={cls.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white transition space-y-3 shadow-xs">
              <div className="flex items-start justify-between">
                <div>
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold font-mono uppercase bg-indigo-100 text-indigo-800">
                    {cls.code} • {cls.credits} Credits
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm mt-1.5">{cls.title}</h3>
                  <div className="text-xs text-slate-500">{cls.courseName}</div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {cls.dayOfWeek}
                </span>
              </div>

              <div className="pt-3 border-t border-slate-200/80 grid grid-cols-2 gap-2 text-xs text-slate-600">
                <div className="flex items-center space-x-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{cls.timeSlot}</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{cls.venue}</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{cls.lecturerName}</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>{cls.enrolledStudentsCount} Learners</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Class Modal */}
      {showAddClassModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-slate-900 text-base mb-3">Schedule Course Unit & Class</h3>
            <form onSubmit={handleCreateClass} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Unit Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. BIT 302"
                    value={unitCode}
                    onChange={(e) => setUnitCode(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl uppercase font-mono focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Credits</label>
                  <input
                    type="number"
                    min={1}
                    max={6}
                    value={credits}
                    onChange={(e) => setCredits(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Unit Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Network Security & Cryptography"
                  value={unitTitle}
                  onChange={(e) => setUnitTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Academic Program</label>
                <select
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none"
                >
                  {(collegeCourses || []).map(c => (
                    <option key={c.id} value={c.title}>{c.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Lecturer / Instructor</label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Jane Kamau"
                  value={lecturerName}
                  onChange={(e) => setLecturerName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Day of Week</label>
                  <select
                    value={dayOfWeek}
                    onChange={(e) => setDayOfWeek(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none"
                  >
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                    <option value="Saturday">Saturday</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Time Slot</label>
                  <input
                    type="text"
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Lecture Venue / Room</label>
                <input
                  type="text"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  placeholder="e.g. Science Block Lab 3"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddClassModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl"
                >
                  Schedule Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
