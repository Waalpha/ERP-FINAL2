import React, { useState } from 'react';
import { X, Save, Edit2 } from 'lucide-react';
import { Tenant } from '../types';

interface EditTenantModalProps {
  tenant: Tenant;
  onClose: () => void;
  onSave: (tenantId: string, updates: Partial<Tenant>) => Promise<void>;
}

export const EditTenantModal: React.FC<EditTenantModalProps> = ({ tenant, onClose, onSave }) => {
  const [name, setName] = useState(tenant.name || '');
  const [code, setCode] = useState(tenant.code || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(tenant.id, { name, code });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-4">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <Edit2 className="h-4 w-4 text-indigo-600" />
            Edit Tenant
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Tenant Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Tenant Code</label>
            <input
              type="text"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <div className="pt-4 flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl">Cancel</button>
            <button type="submit" className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-sm flex items-center gap-1.5">
              <Save className="h-3.5 w-3.5" />
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
