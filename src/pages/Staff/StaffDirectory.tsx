import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  StaffMember,
  UserRole,
  ModulePermissionKey,
  PermissionOperation,
  DEFAULT_ROLE_PERMISSIONS
} from '../../types';
import {
  Users,
  PlusCircle,
  Search,
  Mail,
  Phone,
  Briefcase,
  Building,
  CheckCircle,
  XCircle,
  Shield,
  Key,
  Edit2,
  Trash2,
  Lock,
  Unlock,
  Filter,
  CheckSquare,
  Square,
  AlertCircle
} from 'lucide-react';

export const StaffDirectory: React.FC = () => {
  const { staff, addStaff, updateStaff, deleteStaff, logAuditAction, currentTenant, user } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [deptFilter, setDeptFilter] = useState<string>('ALL');

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [permissionsStaff, setPermissionsStaff] = useState<StaffMember | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<StaffMember>>({
    employeeNo: `EMP-00${staff.length + 1}`,
    fullName: '',
    email: '',
    phone: '+254 7',
    role: 'STAFF',
    department: 'Administration',
    designation: 'Operations Officer',
    employmentType: 'PERMANENT',
    idNumber: '',
    joinDate: new Date().toISOString().split('T')[0],
    status: 'ACTIVE',
    accountAccessEnabled: true,
    assignedModules: ['pos', 'staff', 'reports']
  });

  const availableModules: { key: ModulePermissionKey; label: string }[] = [
    { key: 'pos', label: 'Point of Sale (POS)' },
    { key: 'finance', label: 'Finance & Invoicing' },
    { key: 'staff', label: 'Staff Management' },
    { key: 'inventory', label: 'Inventory & Store' },
    { key: 'academics', label: 'Academics & Curricula' },
    { key: 'students', label: 'Students / Learners' },
    { key: 'patients', label: 'Patients & Clinical' },
    { key: 'website', label: 'Website / CMS' },
    { key: 'settings', label: 'System Settings' },
    { key: 'reports', label: 'Reports & Analytics' },
    { key: 'audit', label: 'Audit Trail' }
  ];

  const permissionOps: PermissionOperation[] = ['view', 'create', 'edit', 'delete', 'manage'];

  const departments = [
    'Administration',
    'Academics',
    'Finance',
    'Sales & POS',
    'Human Resources',
    'ICT & Technical',
    'Clinical & Health',
    'Operations & Logistics'
  ];

  const roles: UserRole[] = [
    'TENANT_ADMIN',
    'MANAGER',
    'ACCOUNTANT',
    'SALES',
    'CASHIER',
    'HR',
    'TEACHER',
    'STAFF',
    'VIEWER'
  ];

  const filteredStaff = staff.filter(s => {
    const matchesSearch =
      s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.employeeNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.designation.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || s.status === statusFilter;
    const matchesRole = roleFilter === 'ALL' || s.role === roleFilter;
    const matchesDept = deptFilter === 'ALL' || (s.department || 'Administration') === deptFilter;

    return matchesSearch && matchesStatus && matchesRole && matchesDept;
  });

  const handleCreateOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email) return;

    if (editingStaff) {
      const updated: StaffMember = {
        ...editingStaff,
        ...formData
      } as StaffMember;

      await updateStaff(updated);
      await logAuditAction({
        action: 'UPDATE',
        module: 'STAFF',
        record: `${updated.fullName} (${updated.employeeNo})`,
        result: 'SUCCESS',
        details: `Updated staff profile, department: ${updated.department}, role: ${updated.role}`
      });
      setEditingStaff(null);
    } else {
      const newStaff = {
        ...formData,
        employeeNo: formData.employeeNo || `EMP-00${staff.length + 1}`,
        status: formData.status || 'ACTIVE',
        subjectsTaught: formData.subjectsTaught || [],
        assignedGrades: formData.assignedGrades || [],
        accountAccessEnabled: formData.accountAccessEnabled ?? true
      } as Omit<StaffMember, 'id' | 'tenantId'>;

      await addStaff(newStaff);
      await logAuditAction({
        action: 'CREATE',
        module: 'STAFF',
        record: `${formData.fullName} (${formData.employeeNo})`,
        result: 'SUCCESS',
        details: `Appointed staff member ${formData.fullName} as ${formData.role} in ${formData.department}`
      });
      setShowAddModal(false);
    }

    // Reset form
    setFormData({
      employeeNo: `EMP-00${staff.length + 2}`,
      fullName: '',
      email: '',
      phone: '+254 7',
      role: 'STAFF',
      department: 'Administration',
      designation: '',
      employmentType: 'PERMANENT',
      idNumber: '',
      joinDate: new Date().toISOString().split('T')[0],
      status: 'ACTIVE',
      accountAccessEnabled: true,
      assignedModules: ['pos', 'staff']
    });
  };

  const handleToggleAccountAccess = async (target: StaffMember) => {
    const nextState = !target.accountAccessEnabled;
    const updated: StaffMember = {
      ...target,
      accountAccessEnabled: nextState
    };
    await updateStaff(updated);
    await logAuditAction({
      action: 'PERMISSION_CHANGE',
      module: 'STAFF',
      record: `${target.fullName} (${target.employeeNo})`,
      result: 'SUCCESS',
      details: `${nextState ? 'Enabled' : 'Disabled'} login account access for ${target.fullName}`
    });
  };

  const handleToggleStatus = async (target: StaffMember) => {
    const nextStatus = target.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    const updated: StaffMember = {
      ...target,
      status: nextStatus
    };
    await updateStaff(updated);
    await logAuditAction({
      action: 'UPDATE',
      module: 'STAFF',
      record: `${target.fullName} (${target.employeeNo})`,
      result: 'SUCCESS',
      details: `Changed employment status to ${nextStatus}`
    });
  };

  const handleDeleteStaff = async (target: StaffMember) => {
    if (window.confirm(`Are you sure you want to delete staff member "${target.fullName}"?`)) {
      await deleteStaff(target.id);
      await logAuditAction({
        action: 'DELETE',
        module: 'STAFF',
        record: `${target.fullName} (${target.employeeNo})`,
        result: 'SUCCESS',
        details: `Deleted staff record ${target.employeeNo}`
      });
    }
  };

  const handleSavePermissions = async (target: StaffMember, customPermissions: Record<string, string[]>) => {
    const updated: StaffMember = {
      ...target,
      customPermissions
    };
    await updateStaff(updated);
    await logAuditAction({
      action: 'PERMISSION_CHANGE',
      module: 'STAFF',
      record: `${target.fullName} (${target.employeeNo})`,
      result: 'SUCCESS',
      details: `Updated custom role-based permissions matrix for ${target.fullName}`
    });
    setPermissionsStaff(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-indigo-50 text-indigo-700 rounded-xl">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Staff & Personnel Directory</h1>
            <p className="text-xs text-slate-500">
              Manage employees, assign roles, enforce module permissions, and control cloud account credentials.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setFormData({
              employeeNo: `EMP-00${staff.length + 1}`,
              fullName: '',
              email: '',
              phone: '+254 7',
              role: 'STAFF',
              department: 'Administration',
              designation: '',
              employmentType: 'PERMANENT',
              idNumber: '',
              joinDate: new Date().toISOString().split('T')[0],
              status: 'ACTIVE',
              accountAccessEnabled: true,
              assignedModules: ['pos', 'staff']
            });
            setShowAddModal(true);
          }}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center space-x-1.5"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Appoint Staff Member</span>
        </button>
      </div>

      {/* Summary KPI Counters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Staff</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{staff.length}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Active Employees</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">
            {staff.filter(s => s.status === 'ACTIVE').length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">On Leave</div>
          <div className="text-2xl font-black text-amber-600 mt-1">
            {staff.filter(s => s.status === 'ON_LEAVE').length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">Account Access Enabled</div>
          <div className="text-2xl font-black text-indigo-600 mt-1">
            {staff.filter(s => s.accountAccessEnabled !== false).length}
          </div>
        </div>
      </div>

      {/* Search & Filtering Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, employee # or title..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <select
              value={deptFilter}
              onChange={e => setDeptFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-none"
            >
              <option value="ALL">All Departments</option>
              {departments.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-none"
            >
              <option value="ALL">All Roles</option>
              {roles.map(r => (
                <option key={r} value={r}>{r.replace(/_/g, ' ')}</option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="ON_LEAVE">On Leave</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Staff Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStaff.map(st => (
          <div
            key={st.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-indigo-200 transition-colors flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              {/* Header Profile */}
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-11 w-11 rounded-xl bg-indigo-50 text-indigo-700 font-black text-base flex items-center justify-center border border-indigo-100 flex-shrink-0">
                    {st.fullName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{st.fullName}</h3>
                    <div className="text-[11px] text-slate-400 font-mono">{st.employeeNo}</div>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-700">
                  {st.role.replace(/_/g, ' ')}
                </span>
              </div>

              {/* Department & Contact */}
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center space-x-1.5 text-slate-800 font-semibold">
                  <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                  <span>{st.designation || 'Staff Member'}</span>
                </div>

                <div className="flex items-center space-x-1.5 text-slate-500">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  <span>{st.department || 'Administration'}</span>
                </div>

                <div className="flex items-center space-x-1.5 text-slate-500">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{st.email}</span>
                </div>

                <div className="flex items-center space-x-1.5 text-slate-500 font-mono">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{st.phone}</span>
                </div>
              </div>

              {/* Status & Account Access Badges */}
              <div className="pt-2 flex items-center justify-between text-[11px] border-t border-slate-100">
                <div className="flex items-center space-x-1.5">
                  <span
                    className={`inline-block w-2 h-2 rounded-full ${
                      st.status === 'ACTIVE'
                        ? 'bg-emerald-500'
                        : st.status === 'ON_LEAVE'
                        ? 'bg-amber-500'
                        : 'bg-slate-300'
                    }`}
                  />
                  <span className="font-semibold text-slate-700">{st.status}</span>
                </div>

                <button
                  onClick={() => handleToggleAccountAccess(st)}
                  className={`flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                    st.accountAccessEnabled !== false
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                      : 'bg-red-50 text-red-700 border border-red-100'
                  }`}
                >
                  {st.accountAccessEnabled !== false ? (
                    <>
                      <Unlock className="w-3 h-3" />
                      <span>Access Active</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-3 h-3" />
                      <span>Access Revoked</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-1">
              <button
                onClick={() => {
                  setEditingStaff(st);
                  setFormData({ ...st });
                }}
                className="px-2.5 py-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-colors"
              >
                <Edit2 className="w-3 h-3" />
                <span>Edit</span>
              </button>

              <button
                onClick={() => setPermissionsStaff(st)}
                className="px-2.5 py-1 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-colors"
              >
                <Key className="w-3 h-3" />
                <span>Permissions</span>
              </button>

              <button
                onClick={() => handleToggleStatus(st)}
                className="px-2 py-1 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-semibold transition-colors"
              >
                {st.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
              </button>

              <button
                onClick={() => handleDeleteStaff(st)}
                className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Staff Modal */}
      {(showAddModal || editingStaff) && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">
                {editingStaff ? 'Edit Staff Profile & Role' : 'Appoint New Staff Member'}
              </h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingStaff(null);
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOrUpdate} className="space-y-4 pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Employee Number</label>
                  <input
                    type="text"
                    value={formData.employeeNo}
                    onChange={e => setFormData({ ...formData, employeeNo: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Department</label>
                  <select
                    value={formData.department}
                    onChange={e => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-none"
                  >
                    {departments.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Assigned Role (RBAC)</label>
                  <select
                    value={formData.role}
                    onChange={e => setFormData({ ...formData, role: e.target.value as UserRole })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-none"
                  >
                    {roles.map(r => (
                      <option key={r} value={r}>{r.replace(/_/g, ' ')}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Designation / Title</label>
                  <input
                    type="text"
                    value={formData.designation}
                    onChange={e => setFormData({ ...formData, designation: e.target.value })}
                    placeholder="e.g. Senior Accountant, Head of Sales"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">National ID / Passport</label>
                  <input
                    type="text"
                    value={formData.idNumber}
                    onChange={e => setFormData({ ...formData, idNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              {/* Module Access Checkboxes */}
              <div className="pt-3 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-800 mb-2">
                  Assigned Module Access
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {availableModules.map(m => {
                    const isAssigned = formData.assignedModules?.includes(m.key);
                    return (
                      <button
                        key={m.key}
                        type="button"
                        onClick={() => {
                          const current = formData.assignedModules || [];
                          const next = isAssigned
                            ? current.filter(k => k !== m.key)
                            : [...current, m.key];
                          setFormData({ ...formData, assignedModules: next });
                        }}
                        className={`p-2 rounded-xl text-xs font-semibold flex items-center space-x-2 text-left transition-colors border ${
                          isAssigned
                            ? 'bg-indigo-50 text-indigo-900 border-indigo-200'
                            : 'bg-slate-50 text-slate-600 border-slate-200'
                        }`}
                      >
                        {isAssigned ? (
                          <CheckSquare className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
                        ) : (
                          <Square className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        )}
                        <span className="truncate">{m.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Account Access Toggle */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900">Cloud Login Credentials</div>
                  <div className="text-[11px] text-slate-500">Allow this staff member to sign in to ERP with email</div>
                </div>
                <input
                  type="checkbox"
                  checked={formData.accountAccessEnabled !== false}
                  onChange={e => setFormData({ ...formData, accountAccessEnabled: e.target.checked })}
                  className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingStaff(null);
                  }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm"
                >
                  {editingStaff ? 'Save Changes' : 'Confirm Appointment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Permissions Modal */}
      {permissionsStaff && (
        <PermissionsModal
          staff={permissionsStaff}
          onClose={() => setPermissionsStaff(null)}
          onSave={perms => handleSavePermissions(permissionsStaff, perms)}
        />
      )}
    </div>
  );
};

// Modal for fine-grained module-specific RBAC
interface PermissionsModalProps {
  staff: StaffMember;
  onClose: () => void;
  onSave: (perms: Record<string, string[]>) => void;
}

const PermissionsModal: React.FC<PermissionsModalProps> = ({ staff, onClose, onSave }) => {
  const defaultPerms = DEFAULT_ROLE_PERMISSIONS[staff.role] || {};
  const [perms, setPerms] = useState<Record<string, string[]>>(() => {
    if (staff.customPermissions) return JSON.parse(JSON.stringify(staff.customPermissions));
    // default from role
    const initial: Record<string, string[]> = {};
    Object.entries(defaultPerms).forEach(([mod, ops]) => {
      if (Array.isArray(ops)) initial[mod] = [...ops];
    });
    return initial;
  });

  const modules: { key: ModulePermissionKey; label: string }[] = [
    { key: 'pos', label: 'Point of Sale (POS)' },
    { key: 'finance', label: 'Finance & Invoices' },
    { key: 'staff', label: 'Staff Management' },
    { key: 'inventory', label: 'Inventory & Stock' },
    { key: 'academics', label: 'Academics & Curricula' },
    { key: 'students', label: 'Students / Patients' },
    { key: 'website', label: 'Website / CMS' },
    { key: 'settings', label: 'System Administration' },
    { key: 'reports', label: 'Reports & Analytics' },
    { key: 'audit', label: 'Audit Logs' }
  ];

  const operations: PermissionOperation[] = ['view', 'create', 'edit', 'delete', 'manage'];

  const toggleOp = (modKey: string, op: PermissionOperation) => {
    setPerms(prev => {
      const current = prev[modKey] || [];
      const hasOp = current.includes(op);
      const next = hasOp ? current.filter(o => o !== op) : [...current, op];
      return { ...prev, [modKey]: next };
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 my-8 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              Manage Permissions: {staff.fullName}
            </h3>
            <p className="text-xs text-slate-500">
              Role: <span className="font-bold text-indigo-600">{staff.role}</span>. Granular permissions override default role capabilities.
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                <th className="py-2.5 px-3">Module</th>
                {operations.map(op => (
                  <th key={op} className="py-2.5 px-2 text-center capitalize">{op}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {modules.map(m => (
                <tr key={m.key} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-semibold text-slate-800">{m.label}</td>
                  {operations.map(op => {
                    const isChecked = perms[m.key]?.includes(op);
                    return (
                      <td key={op} className="py-2.5 px-2 text-center">
                        <input
                          type="checkbox"
                          checked={!!isChecked}
                          onChange={() => toggleOp(m.key, op)}
                          className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-end space-x-2 pt-4 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(perms)}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm"
          >
            Save Permissions Matrix
          </button>
        </div>
      </div>
    </div>
  );
};
