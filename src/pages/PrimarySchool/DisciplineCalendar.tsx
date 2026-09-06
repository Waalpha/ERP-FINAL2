import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  ShieldAlert,
  Calendar,
  PlusCircle,
  AlertTriangle,
  CheckCircle,
  PhoneCall,
  MapPin,
  Clock
} from 'lucide-react';
import { DisciplineIncident, SchoolCalendarEvent } from '../../types';

export const DisciplineCalendar: React.FC = () => {
  const {
    students,
    discipline,
    events,
    user,
    recordDiscipline,
    addSchoolEvent
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'discipline' | 'calendar'>('discipline');
  const [showAddDisciplineModal, setShowAddDisciplineModal] = useState(false);
  const [showAddEventModal, setShowAddEventModal] = useState(false);

  // Discipline form
  const [studentId, setStudentId] = useState(students[0]?.id || '');
  const [incident, setIncident] = useState('');
  const [severity, setSeverity] = useState<'MINOR' | 'MODERATE' | 'SEVERE'>('MINOR');
  const [actionTaken, setActionTaken] = useState('');
  const [parentContacted, setParentContacted] = useState(true);

  // Event form
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState('2025-03-20');
  const [eventType, setEventType] = useState<'ACADEMIC' | 'SPORTS' | 'EXAM' | 'HOLIDAY' | 'MEETING'>('ACADEMIC');
  const [eventDesc, setEventDesc] = useState('');
  const [targetAudience, setTargetAudience] = useState('All Parents & Learners');

  const handleDisciplineSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const st = students.find(s => s.id === studentId);
    if (!st || !incident || !actionTaken) return;

    await recordDiscipline({
      studentId: st.id,
      studentName: `${st.firstName} ${st.lastName}`,
      admissionNo: st.admissionNo,
      grade: st.grade,
      date: new Date().toISOString().split('T')[0],
      incident,
      severity,
      actionTaken,
      reportedBy: user?.displayName || 'Discipline Master',
      parentContacted
    });

    setShowAddDisciplineModal(false);
    setIncident('');
    setActionTaken('');
  };

  const handleEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle) return;

    await addSchoolEvent({
      title: eventTitle,
      date: eventDate,
      type: eventType,
      description: eventDesc,
      targetAudience
    });

    setShowAddEventModal(false);
    setEventTitle('');
    setEventDesc('');
  };

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'SEVERE':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'MODERATE':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Conduct & School Calendar</h1>
          <p className="text-xs text-slate-500">
            Learner discipline records, interventions, and termly institutional milestones.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          {activeTab === 'discipline' ? (
            <button
              onClick={() => setShowAddDisciplineModal(true)}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-sm transition-all flex items-center space-x-1.5"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Log Conduct Incident</span>
            </button>
          ) : (
            <button
              onClick={() => setShowAddEventModal(true)}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-all flex items-center space-x-1.5"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Add Calendar Event</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('discipline')}
          className={`px-3.5 py-2 rounded-xl transition-colors ${
            activeTab === 'discipline' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Discipline & Conduct Logs ({discipline.length})
        </button>
        <button
          onClick={() => setActiveTab('calendar')}
          className={`px-3.5 py-2 rounded-xl transition-colors ${
            activeTab === 'calendar' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Term Events & Key Dates ({events.length})
        </button>
      </div>

      {/* Discipline Tab */}
      {activeTab === 'discipline' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="divide-y divide-slate-100">
            {discipline.map((d) => (
              <div key={d.id} className="p-4 flex flex-col sm:flex-row sm:items-start justify-between gap-3 hover:bg-slate-50/60">
                <div className="flex items-start space-x-3">
                  <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 mt-0.5">
                    <ShieldAlert className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-900 text-sm">{d.studentName}</span>
                      <span className="text-slate-400 text-xs font-mono">({d.admissionNo} • {d.grade})</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase border ${getSeverityBadge(d.severity)}`}>
                        {d.severity}
                      </span>
                    </div>

                    <div className="text-xs text-slate-800 font-semibold mt-1">
                      Incident: <span className="font-normal text-slate-600">{d.incident}</span>
                    </div>

                    <div className="text-xs text-emerald-800 font-semibold mt-1">
                      Resolution / Action: <span className="font-normal text-emerald-700">{d.actionTaken}</span>
                    </div>

                    <div className="text-[11px] text-slate-400 flex items-center space-x-3 mt-2">
                      <span>Reported By: {d.reportedBy}</span>
                      <span>•</span>
                      <span>Date: {d.date}</span>
                    </div>
                  </div>
                </div>

                <div className="self-end sm:self-start">
                  {d.parentContacted ? (
                    <span className="inline-flex items-center space-x-1 text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg text-xs font-semibold">
                      <CheckCircle className="h-3.5 w-3.5" />
                      <span>Parent Notified</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center space-x-1 text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg text-xs font-semibold">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      <span>Pending Contact</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Calendar Tab */}
      {activeTab === 'calendar' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {events.map((ev) => (
            <div key={ev.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-indigo-50 text-indigo-700">
                    {ev.type}
                  </span>
                  <div className="flex items-center space-x-1 text-xs font-mono text-slate-600 font-semibold">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    <span>{ev.date}</span>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-slate-900 mt-2.5">{ev.title}</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{ev.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 mt-4 text-[11px] text-slate-400">
                Audience: <span className="font-semibold text-slate-700">{ev.targetAudience}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Discipline Modal */}
      {showAddDisciplineModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-slate-900 text-base mb-1">Record Conduct Incident</h3>
            <p className="text-xs text-slate-500 mb-4">Document learner behavior and corrective guidance</p>

            <form onSubmit={handleDisciplineSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Learner</label>
                <select
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.firstName} {s.lastName} ({s.admissionNo} - {s.grade})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Severity</label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none"
                >
                  <option value="MINOR">MINOR (Lateness, uniform breach)</option>
                  <option value="MODERATE">MODERATE (Disruptive class behavior, incomplete work)</option>
                  <option value="SEVERE">SEVERE (Bullying, vandalism, truancy)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Incident Summary *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Details of what happened..."
                  value={incident}
                  onChange={(e) => setIncident(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Corrective Action Taken *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Guidance & counseling session with Head Teacher"
                  value={actionTaken}
                  onChange={(e) => setActionTaken(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="parentContact"
                  checked={parentContacted}
                  onChange={(e) => setParentContacted(e.target.checked)}
                  className="rounded text-indigo-600"
                />
                <label htmlFor="parentContact" className="font-semibold text-slate-700">
                  Guardian notified via call / SMS
                </label>
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddDisciplineModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-xl"
                >
                  Log Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Event Modal */}
      {showAddEventModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-slate-900 text-base mb-1">Add School Calendar Event</h3>
            <p className="text-xs text-slate-500 mb-4">Publish date to school planner</p>

            <form onSubmit={handleEventSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Annual Inter-House Athletics Championship"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Event Date</label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Type</label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none"
                  >
                    <option value="ACADEMIC">Academic</option>
                    <option value="SPORTS">Sports & Gala</option>
                    <option value="EXAM">Examination</option>
                    <option value="HOLIDAY">Holiday Break</option>
                    <option value="MEETING">PTA Meeting</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Event details..."
                  value={eventDesc}
                  onChange={(e) => setEventDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddEventModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl"
                >
                  Save Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
