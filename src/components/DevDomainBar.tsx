import React, { useState } from 'react';
import { Globe, Building2, GraduationCap, School, ShieldAlert, ArrowRight, CheckCircle2 } from 'lucide-react';
import {
  getEffectiveHostname,
  navigateToHost,
  navigateToPlatform,
  navigateToTenantSubdomain,
  MAIN_DOMAIN_SUFFIX
} from '../services/TenantResolver';

interface DevDomainBarProps {
  currentHostname: string;
  resolvedType: 'PLATFORM' | 'TENANT' | 'NOT_FOUND';
  tenantName?: string;
}

export const DevDomainBar: React.FC<DevDomainBarProps> = ({
  currentHostname,
  resolvedType,
  tenantName
}) => {
  const [customInput, setCustomInput] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const quickDomains = [
    { label: 'Platform Master', host: `app.${MAIN_DOMAIN_SUFFIX}`, icon: Building2, color: 'bg-indigo-600' },
    { label: 'KCA College', host: `kcacollege.${MAIN_DOMAIN_SUFFIX}`, icon: GraduationCap, color: 'bg-emerald-600' },
    { label: 'BITC College', host: `bitc.${MAIN_DOMAIN_SUFFIX}`, icon: GraduationCap, color: 'bg-teal-600' },
    { label: "St. Mary's Academy", host: `stmarys.${MAIN_DOMAIN_SUFFIX}`, icon: School, color: 'bg-blue-600' },
    { label: "St. Austin's Academy", host: `staustins.${MAIN_DOMAIN_SUFFIX}`, icon: School, color: 'bg-cyan-600' },
    { label: "St. Paul's Theology", host: `stpaulstheo.${MAIN_DOMAIN_SUFFIX}`, icon: School, color: 'bg-purple-600' },
    { label: 'Unknown 404', host: `unknown.${MAIN_DOMAIN_SUFFIX}`, icon: ShieldAlert, color: 'bg-rose-600' }
  ];

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;
    let target = customInput.trim().toLowerCase();
    if (!target.includes('.')) {
      target = `${target}.${MAIN_DOMAIN_SUFFIX}`;
    }
    navigateToHost(target);
  };

  return (
    <div className="bg-slate-950 border-b border-indigo-900/60 text-white text-xs px-3 py-2 z-40 sticky top-0 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        {/* Left: Active Host Status */}
        <div className="flex items-center space-x-2.5 flex-wrap">
          <span className="flex items-center space-x-1.5 bg-indigo-950/80 border border-indigo-500/40 text-indigo-300 px-2.5 py-1 rounded-lg font-mono text-[11px] font-bold">
            <Globe className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
            <span>Host:</span>
            <span className="text-white font-bold">{currentHostname}</span>
          </span>

          <span className="text-[11px] font-mono">
            {resolvedType === 'PLATFORM' && (
              <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-md font-semibold">
                PLATFORM MASTER SHELL
              </span>
            )}
            {resolvedType === 'TENANT' && (
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-md font-semibold">
                TENANT SHELL: {tenantName || 'Isolated ERP'}
              </span>
            )}
            {resolvedType === 'NOT_FOUND' && (
              <span className="bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded-md font-semibold">
                404: TENANT NOT FOUND
              </span>
            )}
          </span>
        </div>

        {/* Right: Quick Switcher Bar */}
        <div className="flex items-center space-x-1.5 flex-wrap">
          <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider hidden sm:inline">
            Test Host:
          </span>

          {quickDomains.map((item) => {
            const isActive = currentHostname === item.host || currentHostname.startsWith(item.host.split('.')[0] + '.');
            const Icon = item.icon;
            return (
              <button
                key={item.host}
                onClick={() => navigateToHost(item.host)}
                className={`px-2 py-1 rounded-md text-[11px] font-mono font-medium transition flex items-center space-x-1 ${
                  isActive
                    ? 'bg-white text-slate-950 font-bold shadow-sm ring-1 ring-white'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                }`}
                title={`Switch hostname to ${item.host}`}
              >
                <Icon className="w-3 h-3" />
                <span>{item.label}</span>
                {isActive && <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />}
              </button>
            );
          })}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-[11px] text-indigo-400 hover:text-indigo-300 px-1.5 py-1 underline font-mono"
          >
            {isExpanded ? 'Hide' : 'Custom'}
          </button>
        </div>
      </div>

      {/* Expanded Custom Hostname Input */}
      {isExpanded && (
        <form onSubmit={handleCustomSubmit} className="mt-2 pt-2 border-t border-slate-800 flex items-center space-x-2 max-w-xl mx-auto">
          <input
            type="text"
            placeholder="Type any subdomain (e.g. kcacollege, bitc, stmarys, random)"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1 text-xs text-white font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition flex items-center space-x-1"
          >
            <span>Simulate Subdomain</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </form>
      )}
    </div>
  );
};
