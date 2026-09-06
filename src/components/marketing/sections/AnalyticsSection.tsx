import React from 'react';
import { BarChart3, TrendingUp, DollarSign, Users, Activity, PieChart } from 'lucide-react';

export const AnalyticsSection: React.FC = () => {
  return (
    <section className="py-24 bg-slate-900 border-t border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-teal-400 bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/20">
            Business Intelligence & BI
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Real-Time Analytics That Drive Decisions.
          </h2>
          <p className="text-slate-400 text-base">
            Transform raw institutional data into actionable intelligence with automated financial charts, enrollment trends, and performance metrics.
          </p>
        </div>

        {/* Analytics Mockup Dashboard */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-10 shadow-2xl space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-white">Executive Performance Overview</h3>
              <p className="text-slate-400 text-xs mt-1">Multi-branch financial and academic telemetry across active workspaces.</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-indigo-600 text-white rounded-xl text-xs font-semibold">Live Feed</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-3">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Monthly Recurring Revenue (MRR)</span>
                <DollarSign className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-3xl font-extrabold text-white">KES 4.85M</div>
              <div className="text-emerald-400 text-xs flex items-center gap-1 font-medium">
                <TrendingUp className="w-3.5 h-3.5" /> +18.4% vs last month
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-3">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Active Enrolled Students / Users</span>
                <Users className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="text-3xl font-extrabold text-white">12,480</div>
              <div className="text-emerald-400 text-xs flex items-center gap-1 font-medium">
                <TrendingUp className="w-3.5 h-3.5" /> +940 this term
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-3">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>System Uptime & SLA</span>
                <Activity className="w-4 h-4 text-teal-400" />
              </div>
              <div className="text-3xl font-extrabold text-white">99.99%</div>
              <div className="text-slate-400 text-xs">Zero dropped packets</div>
            </div>
          </div>

          {/* Simulated Chart Bars */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-4">
            <div className="flex items-center justify-between text-sm text-white font-semibold">
              <span>Fee Collection & Revenue Trajectory (2026)</span>
              <span className="text-xs text-indigo-400 font-mono">Synced with M-Pesa & Bank</span>
            </div>
            <div className="grid grid-cols-6 sm:grid-cols-12 gap-2 h-36 items-end pt-4">
              {[45, 60, 55, 75, 85, 70, 90, 95, 88, 92, 98, 100].map((h, i) => (
                <div key={i} className="flex flex-col items-center gap-2 h-full justify-end">
                  <div
                    style={{ height: `${h}%` }}
                    className="w-full bg-gradient-to-t from-indigo-600 to-purple-500 rounded-t-lg transition-all hover:opacity-90"
                  />
                  <span className="text-[10px] text-slate-400 font-mono">M{i+1}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
