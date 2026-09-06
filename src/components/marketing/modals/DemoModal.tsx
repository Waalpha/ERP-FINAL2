import React, { useState } from 'react';
import { X, CheckCircle2, Shield, Calendar, Building, Mail, User, Phone, ArrowRight, Loader2 } from 'lucide-react';

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPlan?: string;
}

export const DemoModal: React.FC<DemoModalProps> = ({ isOpen, onClose, defaultPlan }) => {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    organization: '',
    orgType: 'SCHOOL',
    estimatedUsers: '50-200',
    notes: ''
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API provisioning
    await new Promise(resolve => setTimeout(resolve, 1200));
    setLoading(false);
    setStep('success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Top bar gradient */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-teal-400" />

        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors bg-slate-800/80 p-2 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8 sm:p-10">
          {step === 'form' ? (
            <div>
              <div className="mb-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-3">
                  <Shield className="w-3.5 h-3.5" /> Enterprise Sandbox & Live Walkthrough
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  Schedule a Live DAVETECH Demo
                </h2>
                <p className="text-slate-400 text-sm mt-1">
                  Experience our multi-tenant enterprise ERP platform tailored to your organization.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="Dr. Jane Mwangi"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 pl-10 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                      Work Email *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        placeholder="jane@institution.ac.ke"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 pl-10 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+254 700 000 000"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 pl-10 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                      Organization Name *
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                      <input
                        type="text"
                        required
                        value={formData.organization}
                        onChange={e => setFormData({ ...formData, organization: e.target.value })}
                        placeholder="St. Austin's Academy & College"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 pl-10 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                      Sector / Industry
                    </label>
                    <select
                      value={formData.orgType}
                      onChange={e => setFormData({ ...formData, orgType: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                    >
                      <option value="SCHOOL">Primary & Secondary School</option>
                      <option value="COLLEGE">College & TVET Institution</option>
                      <option value="UNIVERSITY">University & Higher Ed</option>
                      <option value="HOSPITAL">Hospital & Medical Center</option>
                      <option value="RETAIL">Retail POS & Supermarket</option>
                      <option value="WHOLESALE">Wholesale & Distribution</option>
                      <option value="BUSINESS">Enterprise Corporation</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                      Estimated Staff / Students
                    </label>
                    <select
                      value={formData.estimatedUsers}
                      onChange={e => setFormData({ ...formData, estimatedUsers: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                    >
                      <option value="Under 50">Under 50 users</option>
                      <option value="50-200">50 - 200 users</option>
                      <option value="200-1000">200 - 1,000 users</option>
                      <option value="1000+">1,000+ Enterprise users</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Specific Requirements or Modules of Interest
                  </label>
                  <textarea
                    rows={2}
                    value={formData.notes}
                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="e.g. M-Pesa integration, CBC gradebook, multi-branch inventory sync..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2.5 rounded-xl text-slate-300 hover:text-white text-sm font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-6 py-2.5 rounded-xl font-semibold text-sm shadow-lg shadow-indigo-500/25 transition-all disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Provisioning Sandbox...
                      </>
                    ) : (
                      <>
                        Request Live Demo <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">
                Demo Request Confirmed!
              </h3>
              <p className="text-slate-300 max-w-md mx-auto text-sm leading-relaxed">
                Thank you, <span className="text-white font-semibold">{formData.fullName}</span>. Our Enterprise ERP Solutions team has received your request for <span className="text-indigo-400 font-semibold">{formData.organization}</span>. We will reach out within 30 minutes to set up your dedicated workspace.
              </p>
              <div className="pt-4">
                <button
                  onClick={() => {
                    setStep('form');
                    onClose();
                  }}
                  className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                >
                  Return to Website
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
