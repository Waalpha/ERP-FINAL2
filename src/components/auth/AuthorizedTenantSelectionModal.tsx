import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Tenant } from '../../types';
import {
  Building2,
  ArrowRight,
  LogOut,
  ShieldCheck,
  CheckCircle2,
  Lock,
  School,
  GraduationCap,
  ShoppingBag,
  Activity,
  Briefcase
} from 'lucide-react';

interface AuthorizedTenantSelectionModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onSelectTenant: (tenant: Tenant) => void;
}

export const AuthorizedTenantSelectionModal: React.FC<AuthorizedTenantSelectionModalProps> = ({
  isOpen,
  onClose,
  onSelectTenant
}) => {
  const { user, allTenants, logout } = useAuth();

  if (!isOpen || !user) return null;

  const getTenantIcon = (type: string) => {
    switch (type) {
      case 'SCHOOL':
        return School;
      case 'COLLEGE':
      case 'THEOLOGICAL':
        return GraduationCap;
      case 'BUSINESS':
        return ShoppingBag;
      case 'HOSPITAL':
        return Activity;
      default:
        return Briefcase;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative text-slate-200">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase tracking-wider border border-indigo-500/30">
                Authenticated
              </span>
              <span className="text-xs text-slate-400 font-mono">{user.email}</span>
            </div>
            <h3 className="text-lg font-bold text-white mt-1">Select Authorized Workspace</h3>
            <p className="text-xs text-slate-400">
              Welcome back, <strong className="text-white">{user.displayName}</strong>. Select your authorized organization:
            </p>
          </div>
          
          <button
            onClick={() => logout()}
            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-xl transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>

        {/* Authorized Organizations List */}
        <div className="p-6 space-y-3 max-h-[60vh] overflow-y-auto">
          {allTenants.length === 0 ? (
            <div className="p-6 text-center text-slate-400 space-y-2">
              <Lock className="w-8 h-8 text-amber-400 mx-auto" />
              <p className="text-sm font-semibold text-white">No Assigned Organization Found</p>
              <p className="text-xs text-slate-500">
                Your account is authenticated, but no specific tenant workspace is assigned. Contact your enterprise administrator.
              </p>
            </div>
          ) : (
            allTenants.map((t) => {
              const Icon = getTenantIcon(t.type);
              return (
                <div
                  key={t.id}
                  onClick={() => onSelectTenant(t)}
                  className="p-4 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-indigo-500/40 transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center space-x-3.5">
                    {t.logoUrl ? (
                      <img
                        src={t.logoUrl}
                        alt={t.name}
                        className="w-11 h-11 rounded-xl object-contain bg-slate-900 border border-slate-800 p-1"
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                        <Icon className="w-5 h-5" />
                      </div>
                    )}
                    <div>
                      <div className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                        {t.name}
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-slate-400 mt-0.5">
                        <span className="font-mono text-[10px] text-slate-500 uppercase">{t.code}</span>
                        <span>•</span>
                        <span className="text-[11px] text-indigo-400 font-medium capitalize">
                          {t.type.toLowerCase().replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="hidden sm:inline text-xs font-semibold text-indigo-400 group-hover:underline">
                      Enter ERP
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-indigo-600/20 group-hover:bg-indigo-600 group-hover:text-white text-indigo-400 flex items-center justify-center transition-all">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Tenant Isolation: Strict Firestore Partitions</span>
          </div>
          <button
            onClick={() => logout()}
            className="text-xs text-slate-400 hover:text-white transition-colors"
          >
            Sign Out
          </button>
        </div>

      </div>
    </div>
  );
};
