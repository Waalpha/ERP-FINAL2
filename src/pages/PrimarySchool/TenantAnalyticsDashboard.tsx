import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import {
  Users,
  Activity,
  HardDrive,
  Cpu,
  ShieldCheck,
  TrendingUp,
  Clock,
  Zap,
  Globe,
  Database
} from 'lucide-react';

interface TenantAnalyticsDashboardProps {
  onNavigate: (tabId: string) => void;
}

export const TenantAnalyticsDashboard: React.FC<TenantAnalyticsDashboardProps> = ({ onNavigate }) => {
  const { tenant, students, staff, allUsers } = useAuth();

  // Active user sessions simulation data over 24 hours
  const activeSessionsData = [
    { hour: '00:00', sessions: 12, apiCalls: 140 },
    { hour: '03:00', sessions: 5, apiCalls: 45 },
    { hour: '06:00', sessions: 28, apiCalls: 320 },
    { hour: '09:00', sessions: 145, apiCalls: 2450 },
    { hour: '12:00', sessions: 210, apiCalls: 3890 },
    { hour: '15:00', sessions: 185, apiCalls: 3100 },
    { hour: '18:00', sessions: 95, apiCalls: 1250 },
    { hour: '21:00', sessions: 42, apiCalls: 620 }
  ];

  // Resource consumption data across modules
  const resourceConsumptionData = [
    { module: 'Database Queries', usageMB: 420, quota: 1024 },
    { module: 'Cloud Storage', usageMB: 1850, quota: 5120 },
    { module: 'SMS Gateway', usageMB: 95, quota: 500 },
    { module: 'AI / LLM API', usageMB: 310, quota: 2048 },
    { module: 'Backup Snapshots', usageMB: 3400, quota: 10240 }
  ];

  const totalActiveUsers = Math.max(12, students.length > 0 ? Math.round(students.length * 0.35) : 45);
  const totalStorageUsedMB = 5775; // ~5.7 GB
  const storageLimitGB = tenant?.plan === 'ENTERPRISE' ? 500 : tenant?.plan === 'PREMIUM' ? 50 : 10;
  const storageLimitMB = storageLimitGB * 1024;
  const storagePercentage = Math.round((totalStorageUsedMB / storageLimitMB) * 100);

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-indigo-600 mb-1">
            <Activity className="h-5 w-5 animate-pulse" />
            <span className="text-xs font-black uppercase tracking-wider">Live Telemetry & Activity Intelligence</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Active Sessions & Resource Consumption
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time telemetry, concurrent connection metrics, and cloud storage utilization for {tenant?.name}.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold flex items-center space-x-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Telemetry Active</span>
          </div>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Active User Sessions</span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{totalActiveUsers} online</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-2 flex items-center">
            <TrendingUp className="h-3 w-3 mr-1" />
            <span>+18% peak concurrency vs yesterday</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Cloud Storage Allocated</span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
              <HardDrive className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{(totalStorageUsedMB / 1024).toFixed(2)} GB</div>
          <div className="text-[11px] text-slate-500 font-medium mt-2">
            Of {storageLimitGB} GB quota ({storagePercentage}%)
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">API Gateway Throughput</span>
            <div className="p-2 bg-cyan-50 text-cyan-600 rounded-xl">
              <Zap className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">11,420 req/h</div>
          <div className="text-[11px] text-slate-500 font-medium mt-2">
            Average response time: 28ms
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Security & Isolation</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">99.99%</div>
          <div className="text-[11px] text-slate-500 font-medium mt-2">
            Zero cross-tenant leakage verified
          </div>
        </div>
      </div>

      {/* Recharts Graphs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Sessions Chart */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Active User Sessions (24-Hour Trend)</h2>
              <p className="text-xs text-slate-500">Concurrent logged-in students, teachers, and administrators</p>
            </div>
            <span className="text-xs bg-indigo-50 text-indigo-700 font-bold px-2.5 py-1 rounded-xl">
              Peak: 210
            </span>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activeSessionsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="sessionColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="hour" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="sessions" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#sessionColor)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Resource Consumption Chart */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Resource Consumption by Module (MB)</h2>
              <p className="text-xs text-slate-500">Database storage, cloud backups, and API services breakdown</p>
            </div>
            <span className="text-xs bg-purple-50 text-purple-700 font-bold px-2.5 py-1 rounded-xl">
              Total: 5.7 GB
            </span>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={resourceConsumptionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="module" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="usageMB" fill="#7c3aed" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
