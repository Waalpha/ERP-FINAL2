import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import {
  UserCheck,
  PlusCircle,
  Search,
  Mail,
  Phone,
  Building2,
  Award,
  GraduationCap
} from 'lucide-react';

interface CollegeStaffMember {
  id: string;
  name: string;
  staffNo: string;
  department: string;
  designation: string;
  qualification: string;
  email: string;
  phone: string;
  employmentType: 'FULL_TIME' | 'ADJUNCT' | 'CONTRACT';
  joinDate: string;
}

export const CollegeStaffTab: React.FC = () => {
  const { collegeDepartments } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);

  const [staffList, setStaffList] = useState<CollegeStaffMember[]>([
    {
      id: 'STF-101',
      name: 'Prof. Alice Wanjiru',
      staffNo: 'EMP-0012',
      department: 'School of Technology',
      designation: 'Associate Professor & Dean',
      qualification: 'PhD in Computer Science (UoN)',
      email: 'a.wanjiru@kcacollege.davetech.co.ke',
      phone: '+254 722 110 099',
      employmentType: 'FULL_TIME',
      joinDate: '2018-09-01'
    },
    {
      id: 'STF-102',
      name: 'Dr. Joseph Mutua',
      staffNo: 'EMP-0045',
      department: 'School of Technology',
      designation: 'Senior Lecturer',
      qualification: 'PhD in Mathematics & AI',
      email: 'j.mutua@kcacollege.davetech.co.ke',
      phone: '+254 733 220 188',
      employmentType: 'FULL_TIME',
      joinDate: '2020-01-15'
    },
    {
      id: 'STF-103',
      name: 'CPA Faith Chebet',
      staffNo: 'EMP-0078',
      department: 'School of Business & Economics',
      designation: 'Head of Accounting & Finance',
      qualification: 'MSc Finance, CPA(K)',
      email: 'f.chebet@kcacollege.davetech.co.ke',
      phone: '+254 711 440 922',
      employmentType: 'FULL_TIME',
      joinDate: '2019-05-10'
    },
    {
      id: 'STF-104',
      name: 'Dr. Kennedy Otieno',
      staffNo: 'EMP-0091',
      department: 'School of Technology',
      designation: 'Lecturer in Information Systems',
      qualification: 'PhD in Information Systems',
      email: 'k.otieno@kcacollege.davetech.co.ke',
      phone: '+254 700 889 011',
      employmentType: 'FULL_TIME',
      joinDate: '2021-08-01'
    }
  ]);

  // Form
  const [name, setName] = useState('');
  const [department, setDepartment] = useState((collegeDepartments || [])[0]?.name || 'School of Technology');
  const [designation, setDesignation] = useState('Lecturer');
  const [qualification, setQualification] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [employmentType, setEmploymentType] = useState<'FULL_TIME' | 'ADJUNCT' | 'CONTRACT'>('FULL_TIME');

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    const newStaff: CollegeStaffMember = {
      id: `STF-${Date.now()}`,
      name,
      staffNo: `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
      department,
      designation,
      qualification: qualification || 'MSc Degree',
      email: email || `${name.toLowerCase().replace(/\s+/g, '.')}@kcacollege.davetech.co.ke`,
      phone: phone || '+254 700 000 000',
      employmentType,
      joinDate: new Date().toISOString().split('T')[0]
    };

    setStaffList(prev => [newStaff, ...prev]);
    setName('');
    setQualification('');
    setEmail('');
    setPhone('');
    setShowAddStaffModal(false);
  };

  const filtered = staffList.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.designation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <UserCheck className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-900">Faculty & Staff Directory</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Academic professors, senior lecturers, administrative deans, department heads, and academic credentials.
          </p>
        </div>

        <button
          onClick={() => setShowAddStaffModal(true)}
          className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center space-x-1.5"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Faculty Member</span>
        </button>
      </div>

      {/* Directory Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="relative max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search faculty by name, department, title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((staff) => (
            <div key={staff.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white transition space-y-3 shadow-xs">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600/10 text-indigo-600 font-bold text-base flex items-center justify-center border border-indigo-200">
                    {staff.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{staff.name}</h3>
                    <div className="text-xs font-medium text-indigo-600">{staff.designation}</div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {staff.employmentType.replace('_', ' ')}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-200/80 text-xs text-slate-600 space-y-1.5">
                <div className="flex items-center space-x-2">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>{staff.department}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-medium text-slate-700">{staff.qualification}</span>
                </div>
                <div className="flex items-center space-x-2 text-[11px] text-slate-500">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-mono">{staff.email}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Staff Modal */}
      {showAddStaffModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-slate-900 text-base mb-3">Add Faculty / Staff Member</h3>
            <form onSubmit={handleAddStaff} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name & Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Prof. David Mwangi"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Designation</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Senior Lecturer"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Department</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none"
                  >
                    {(collegeDepartments || []).map(d => (
                      <option key={d.id} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Highest Qualification</label>
                <input
                  type="text"
                  placeholder="e.g. PhD in Software Engineering"
                  value={qualification}
                  onChange={(e) => setQualification(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Official Email</label>
                  <input
                    type="email"
                    placeholder="name@kcacollege.davetech.co.ke"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="+254 7..."
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddStaffModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl"
                >
                  Save Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
