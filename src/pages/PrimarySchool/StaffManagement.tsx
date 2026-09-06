import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Users,
  PlusCircle,
  Search,
  Mail,
  Phone,
  BookOpen,
  Briefcase,
  CheckCircle,
  Building
} from 'lucide-react';
import { StaffMember, UserRole } from '../../types';

export const StaffManagement: React.FC = () => {
  const { staff, addStaff } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const [formData, setFormData] = useState({
    employeeNo: `EMP-STA-00${staff.length + 1}`,
    fullName: '',
    email: '',
    phone: '+254 7',
    role: 'TEACHER' as UserRole,
    designation: 'CBC Grade 3 Class Teacher',
    subjectsTaught: ['Science & Technology', 'Mathematical Activities'],
    assignedGrades: ['Grade 3', 'Grade 4'],
    employmentType: 'PERMANENT' as 'PERMANENT' | 'CONTRACT' | 'PART_TIME',
    idNumber: '28190281',
    joinDate: '2024-01-10'
  });

  const filteredStaff = staff.filter(s =>
    s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.employeeNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email) return;

    await addStaff({
      ...formData,
      status: 'ACTIVE'
    });

    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Teachers & Staff Directory</h1>
          <p className="text-xs text-slate-500">
            Faculty credentials, assigned CBC grades, teaching workloads, and employment records.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-all flex items-center space-x-1.5"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Appoint Staff Member</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
        <div className="relative max-w-md">
          <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search staff by name, designation, or employee no..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-none"
          />
        </div>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStaff.map((st) => (
          <div key={st.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-indigo-200 transition-colors">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 rounded-xl bg-indigo-50 text-indigo-700 font-bold text-base flex items-center justify-center border border-indigo-100 flex-shrink-0">
                  {st.fullName.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{st.fullName}</h3>
                  <div className="text-[11px] text-slate-400 font-mono">{st.employeeNo}</div>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-indigo-50 text-indigo-700 border border-indigo-100">
                {st.role}
              </span>
            </div>

            <div className="py-3 space-y-2 text-xs">
              <div className="font-semibold text-slate-800 flex items-center space-x-1.5">
                <Briefcase className="h-3.5 w-3.5 text-slate-400" />
                <span>{st.designation}</span>
              </div>

              <div className="text-slate-500 flex items-center space-x-1.5">
                <Mail className="h-3.5 w-3.5 text-slate-400" />
                <span className="truncate">{st.email}</span>
              </div>

              <div className="text-slate-500 flex items-center space-x-1.5 font-mono">
                <Phone className="h-3.5 w-3.5 text-slate-400" />
                <span>{st.phone}</span>
              </div>

              {st.assignedGrades && st.assignedGrades.length > 0 && (
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">
                    Assigned Grades:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {st.assignedGrades.map((g, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-semibold">
                        {g}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span>{st.employmentType}</span>
              <span className="text-emerald-600 font-semibold flex items-center space-x-1">
                <CheckCircle className="h-3 w-3" />
                <span>Active</span>
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Staff Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-slate-900 text-base mb-1">Appoint New Faculty Member</h3>
            <p className="text-xs text-slate-500 mb-4">Add staff profile and assign teaching responsibilities</p>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Agnes Chepngetich"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="agnes@staustins.ac.ke"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Role / Access Level</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none"
                  >
                    <option value="TEACHER">TEACHER (CBC Instructor)</option>
                    <option value="ACCOUNTANT">ACCOUNTANT (Bursar)</option>
                    <option value="TENANT_ADMIN">TENANT_ADMIN (Principal)</option>
                    <option value="STAFF">STAFF (Support)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Designation</label>
                  <input
                    type="text"
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    placeholder="e.g. Lead CBC Teacher"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
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
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-sm"
                >
                  Appoint Staff
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
