import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import {
  Shield,
  PlusCircle,
  Search,
  UserCheck,
  CheckCircle2,
  Mail,
  Lock
} from 'lucide-react';
import { AppUser } from '../../../types';

export const CollegeUsersTab: React.FC = () => {
  const { allUsers, tenant, switchUserPersona, user: currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  // Scoped to this tenant (plus Super Admin)
  const tenantUsers = (allUsers || []).filter(
    (u) => u && (u.tenantId === tenant?.id || u.role === 'SUPER_ADMIN')
  );

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'COLLEGE_ADMIN' | 'ACCOUNTANT' | 'REGISTRAR' | 'LECTURER' | 'LIBRARIAN' | 'STUDENT'>('COLLEGE_ADMIN');

  const filteredUsers = tenantUsers.filter(u =>
    u.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-900">User Access & Role Permissions</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage administrative personnel, registrars, financial bursars, faculty lecturers and student logins scoped to this organization.
          </p>
        </div>

        <button
          onClick={() => setShowAddUserModal(true)}
          className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center space-x-1.5"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Provision Tenant User</span>
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="relative max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search users by name, role or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
              <tr>
                <th className="py-3 px-4">User Account</th>
                <th className="py-3 px-4">System Role</th>
                <th className="py-3 px-4">Access Scope</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Switch Persona</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((u) => (
                <tr key={u.uid} className={`hover:bg-slate-50/60 ${currentUser?.uid === u.uid ? 'bg-indigo-50/40' : ''}`}>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700">
                        {u.displayName.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 flex items-center space-x-1.5">
                          <span>{u.displayName}</span>
                          {currentUser?.uid === u.uid && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-indigo-600 text-white">Active</span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                      {u.role.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {u.tenantId ? `${tenant?.name} Only` : 'Global Super Admin'}
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center space-x-1 text-emerald-600 text-[11px] font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Active</span>
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => switchUserPersona(u.uid)}
                      disabled={currentUser?.uid === u.uid}
                      className="px-2.5 py-1 text-xs font-semibold rounded-lg transition bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 disabled:opacity-40"
                    >
                      {currentUser?.uid === u.uid ? 'Logged In' : 'Simulate Login'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-slate-900 text-base mb-3">Provision Organization User</h3>
            <form onSubmit={(e) => { e.preventDefault(); setShowAddUserModal(false); }} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Jane Kamau"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="user@kcacollege.davetech.co.ke"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Role Designation</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none"
                >
                  <option value="COLLEGE_ADMIN">College Principal / Administrator</option>
                  <option value="REGISTRAR">Academic Registrar</option>
                  <option value="ACCOUNTANT">Finance Officer / Bursar</option>
                  <option value="LECTURER">Faculty Lecturer</option>
                  <option value="LIBRARIAN">Campus Librarian</option>
                  <option value="STUDENT">Student Portal Access</option>
                </select>
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
