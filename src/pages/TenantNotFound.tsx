import React from 'react';
import { AlertTriangle, Globe, ArrowRight, ShieldAlert, Building2 } from 'lucide-react';
import { navigateToPlatform, MAIN_DOMAIN_SUFFIX } from '../services/TenantResolver';

interface TenantNotFoundProps {
  requestedHost: string;
  subdomain?: string;
}

export const TenantNotFound: React.FC<TenantNotFoundProps> = ({ requestedHost, subdomain }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex flex-col items-center justify-center p-4 text-white font-sans selection:bg-indigo-500 selection:text-white">
      <div className="max-w-md w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-md text-center space-y-6 animate-in fade-in zoom-in-95">
        {/* Icon */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
          <ShieldAlert className="w-8 h-8" />
        </div>

        {/* Title */}
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-mono font-bold">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>404: TENANT WORKSPACE NOT FOUND</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">
            Workspace Not Found
          </h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            The requested institutional domain is not registered or is currently inactive on DAVETECH Enterprise Cloud.
          </p>
        </div>

        {/* Domain Badge */}
        <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-4 text-left space-y-1">
          <div className="text-[11px] font-mono text-slate-500 flex items-center space-x-1.5">
            <Globe className="w-3.5 h-3.5 text-indigo-400" />
            <span>Requested Hostname</span>
          </div>
          <div className="text-sm font-mono font-bold text-amber-300 break-all">
            https://{requestedHost}
          </div>
          {subdomain && (
            <div className="text-[11px] text-slate-400 mt-1">
              Subdomain: <span className="font-mono text-indigo-300 font-bold">{subdomain}</span>.{MAIN_DOMAIN_SUFFIX}
            </div>
          )}
        </div>

        {/* Notice */}
        <p className="text-[11px] text-slate-500">
          If you are the institutional administrator, verify that your DNS CNAME and subdomain configuration is active in the Master Platform.
        </p>

        {/* Action button */}
        <div className="pt-2">
          <button
            onClick={() => navigateToPlatform()}
            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition flex items-center justify-center space-x-2"
          >
            <Building2 className="w-4 h-4" />
            <span>Return to DAVETECH Master Platform</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="mt-8 text-center text-xs text-slate-500 font-mono">
        DAVETECH Enterprise Cloud & Multi-Tenant Engine • 100% Tenant Isolation
      </div>
    </div>
  );
};
