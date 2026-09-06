import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import {
  Bell,
  Send,
  MessageSquare,
  Users,
  CheckCircle2,
  PhoneCall,
  Clock,
  Sparkles
} from 'lucide-react';

interface SmsLog {
  id: string;
  recipientGroup: string;
  recipientCount: number;
  messageText: string;
  senderId: string;
  sentAt: string;
  status: 'DELIVERED' | 'PENDING' | 'FAILED';
}

export const CollegeSmsTab: React.FC = () => {
  const { tenant, collegeStudents } = useAuth();
  const [recipientGroup, setRecipientGroup] = useState('ALL_STUDENTS');
  const [senderId, setSenderId] = useState(tenant?.subdomain?.toUpperCase() || 'KCACAMPUS');
  const [messageText, setMessageText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);

  const [logs, setLogs] = useState<SmsLog[]>([
    {
      id: 'SMS-01',
      recipientGroup: 'All Active Students',
      recipientCount: (collegeStudents || []).length || 45,
      messageText: 'Dear Student, Semester 1 examinations commence on Monday 15th. Ensure all fee balances are fully settled.',
      senderId: tenant?.subdomain?.toUpperCase() || 'KCACAMPUS',
      sentAt: '2025-05-10 10:30 AM',
      status: 'DELIVERED'
    },
    {
      id: 'SMS-02',
      recipientGroup: 'Tuition Fee Debtors',
      recipientCount: 18,
      messageText: 'Notice: Tuition invoice due date is approaching. Please make payment via M-Pesa Paybill to secure your exam docket.',
      senderId: tenant?.subdomain?.toUpperCase() || 'KCACAMPUS',
      sentAt: '2025-05-02 02:15 PM',
      status: 'DELIVERED'
    }
  ]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    setIsSending(true);
    setTimeout(() => {
      const newLog: SmsLog = {
        id: `SMS-${Date.now()}`,
        recipientGroup: recipientGroup === 'ALL_STUDENTS' ? 'All Enrolled Students' : recipientGroup === 'DEBTORS' ? 'Fee Debtors' : 'Department Faculty',
        recipientCount: (collegeStudents || []).length || 35,
        messageText,
        senderId,
        sentAt: new Date().toLocaleString(),
        status: 'DELIVERED'
      };

      setLogs(prev => [newLog, ...prev]);
      setMessageText('');
      setIsSending(false);
      setSendSuccess(true);
      setTimeout(() => setSendSuccess(false), 3500);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-900">Communication & Bulk SMS Gateway</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Official SMS broadcasts to students, parents, and faculty with alphanumeric sender ID.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-emerald-50 border border-emerald-200 text-emerald-800 px-3.5 py-1.5 rounded-xl text-xs font-bold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>SMS Gateway Connected (9,420 Credits)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Compose Form */}
        <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
            <MessageSquare className="w-4 h-4 text-indigo-600" />
            <span>Compose Broadcast</span>
          </h3>

          <form onSubmit={handleSend} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Sender Alphanumeric ID</label>
              <input
                type="text"
                value={senderId}
                onChange={(e) => setSenderId(e.target.value)}
                maxLength={11}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl font-mono uppercase font-bold text-indigo-700 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Target Audience</label>
              <select
                value={recipientGroup}
                onChange={(e) => setRecipientGroup(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none"
              >
                <option value="ALL_STUDENTS">All Registered Students ({(collegeStudents || []).length})</option>
                <option value="DEBTORS">Students with Fee Arrears</option>
                <option value="FACULTY">Faculty & Lecturers</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Message Body ({messageText.length}/160 chars)
              </label>
              <textarea
                required
                rows={4}
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Type official SMS announcement..."
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSending || !messageText.trim()}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{isSending ? 'Dispatching SMS...' : 'Dispatch Broadcast'}</span>
            </button>

            {sendSuccess && (
              <div className="text-center text-xs text-emerald-600 font-bold animate-in fade-in">
                SMS broadcast dispatched successfully!
              </div>
            )}
          </form>
        </div>

        {/* Transmission Logs */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
            <Clock className="w-4 h-4 text-indigo-600" />
            <span>Recent Broadcast Logs</span>
          </h3>

          <div className="space-y-3">
            {logs.map((log) => (
              <div key={log.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900">{log.recipientGroup}</span>
                    <span className="text-slate-400 font-mono">({log.recipientCount} Recipients)</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    {log.status}
                  </span>
                </div>
                <p className="text-xs text-slate-700 bg-white p-3 rounded-lg border border-slate-100 font-mono">
                  &ldquo;{log.messageText}&rdquo;
                </p>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Sender ID: <strong className="text-slate-700">{log.senderId}</strong></span>
                  <span>{log.sentAt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
