import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Send,
  MessageSquare,
  Users,
  CheckCircle,
  Clock,
  Sparkles,
  AlertCircle,
  Phone,
  Layers
} from 'lucide-react';
import { Student } from '../../types';

interface SMSBroadcastsProps {
  initialDebtorStudent?: Student | null;
}

export const SMSBroadcasts: React.FC<SMSBroadcastsProps> = ({ initialDebtorStudent }) => {
  const { tenant, students, smsLogs, user, sendSMSBroadcast } = useAuth();

  const [recipientGroup, setRecipientGroup] = useState<'ALL_PARENTS' | 'FEE_DEBTORS' | 'GRADE_SPECIFIC'>(
    initialDebtorStudent ? 'FEE_DEBTORS' : 'ALL_PARENTS'
  );
  const [selectedGrade, setSelectedGrade] = useState<string>('Grade 4');
  const [messageText, setMessageText] = useState<string>(
    initialDebtorStudent
      ? `Dear Parent of ${initialDebtorStudent.firstName}, this is a gentle reminder that your child has an outstanding fee balance of KES ${initialDebtorStudent.feeBalance.toLocaleString()} at ${tenant?.name}. Kindly settle via Paybill.`
      : `Dear Parent, please be reminded that mid-term clinics at ${tenant?.name} will take place this Friday starting from 9:00 AM. Thank you.`
  );
  const [isSending, setIsSending] = useState(false);
  const [dispatchSuccess, setDispatchSuccess] = useState(false);

  // Character calculation
  const charCount = messageText.length;
  const smsSegments = Math.ceil(charCount / 160) || 1;

  // Determine audience count
  const feeDebtors = students.filter(s => s.feeBalance > 0);
  const gradeStudents = students.filter(s => s.grade === selectedGrade);

  const getRecipientCount = () => {
    switch (recipientGroup) {
      case 'FEE_DEBTORS':
        return feeDebtors.length;
      case 'GRADE_SPECIFIC':
        return gradeStudents.length;
      default:
        return students.length;
    }
  };

  const handleApplyTemplate = (type: string) => {
    switch (type) {
      case 'fee':
        setMessageText(`Dear Parent of {StudentName}, this is a gentle reminder from ${tenant?.name} regarding an outstanding fee balance of KES {Balance}. Kindly pay promptly via M-Pesa Paybill.`);
        break;
      case 'clinic':
        setMessageText(`Dear Parent, we warmly invite you to the Term 1 Academic Clinic on Friday, March 14th from 8:30 AM to discuss your child's CBC progress report.`);
        break;
      case 'closing':
        setMessageText(`Dear Parent, school will close for mid-term on March 20th. Learners are expected back on March 25th. Have a wonderful break.`);
        break;
      case 'bus':
        setMessageText(`Dear Parent, school transport buses have departed campus. Expect your child at the regular drop-off point shortly.`);
        break;
    }
  };

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    setIsSending(true);
    const count = getRecipientCount();

    await sendSMSBroadcast({
      recipientGroup,
      recipientCount: count,
      message: messageText,
      sentAt: new Date().toISOString(),
      senderName: user?.displayName || 'School Administrator',
      status: 'DELIVERED',
      costKes: count * smsSegments * 0.8
    });

    setIsSending(false);
    setDispatchSuccess(true);
    setTimeout(() => setDispatchSuccess(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Parent SMS Gateway & Notifications</h1>
          <p className="text-xs text-slate-500">
            Instant bulk SMS dispatch for fee reminders, emergency alerts, and school circulars.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl text-xs font-semibold text-emerald-800">
          <CheckCircle className="h-4 w-4 text-emerald-600" />
          <span>SMS Gateway: Connected (Safcom / Africa's Talking)</span>
        </div>
      </div>

      {dispatchSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-semibold flex items-center space-x-2 animate-in fade-in">
          <CheckCircle className="h-4 w-4 text-emerald-600" />
          <span>Broadcast successfully queued and dispatched to {getRecipientCount()} guardians!</span>
        </div>
      )}

      {/* Grid: Composer & History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: SMS Composer */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 mb-4">Compose SMS Broadcast</h2>

          <form onSubmit={handleSendBroadcast} className="space-y-4 text-xs">
            {/* Audience Selection */}
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider text-[11px] mb-1.5">
                Target Audience Group
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => setRecipientGroup('ALL_PARENTS')}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    recipientGroup === 'ALL_PARENTS'
                      ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="font-bold text-slate-900">All Parents</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{students.length} Total Recipients</div>
                </button>

                <button
                  type="button"
                  onClick={() => setRecipientGroup('FEE_DEBTORS')}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    recipientGroup === 'FEE_DEBTORS'
                      ? 'border-rose-600 bg-rose-50/50 ring-2 ring-rose-500/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="font-bold text-rose-700">Fee Defaulters</div>
                  <div className="text-[11px] text-rose-500 mt-0.5">{feeDebtors.length} Debtors with Balance</div>
                </button>

                <button
                  type="button"
                  onClick={() => setRecipientGroup('GRADE_SPECIFIC')}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    recipientGroup === 'GRADE_SPECIFIC'
                      ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="font-bold text-slate-900">Specific Grade</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{gradeStudents.length} In {selectedGrade}</div>
                </button>
              </div>
            </div>

            {recipientGroup === 'GRADE_SPECIFIC' && (
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Grade</label>
                <select
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none"
                >
                  <option value="PP1">PP1</option>
                  <option value="PP2">PP2</option>
                  <option value="Grade 1">Grade 1</option>
                  <option value="Grade 2">Grade 2</option>
                  <option value="Grade 3">Grade 3</option>
                  <option value="Grade 4">Grade 4</option>
                  <option value="Grade 5">Grade 5</option>
                  <option value="Grade 6">Grade 6</option>
                  <option value="Grade 7">Grade 7</option>
                </select>
              </div>
            )}

            {/* Quick Templates */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Quick Message Templates
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => handleApplyTemplate('fee')}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold"
                >
                  Fee Balance Notice
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyTemplate('clinic')}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold"
                >
                  Academic Clinic Invite
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyTemplate('closing')}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold"
                >
                  Mid-Term Break Notice
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyTemplate('bus')}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold"
                >
                  Transport Bus Alert
                </button>
              </div>
            </div>

            {/* Message Body */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-semibold text-slate-700">SMS Body Text *</label>
                <span className="text-[11px] text-slate-400 font-mono">
                  {charCount} characters ({smsSegments} SMS page{smsSegments > 1 ? 's' : ''})
                </span>
              </div>
              <textarea
                rows={5}
                required
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Type your message here..."
                className="w-full p-3 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-800 leading-relaxed font-sans"
              />
              <div className="text-[11px] text-slate-400 mt-1">
                Supports tags: <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-600">{'{StudentName}'}</code>, <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-600">{'{Balance}'}</code>, <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-600">{'{Grade}'}</code>
              </div>
            </div>

            {/* Estimated Cost Banner */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Estimated Dispatch Cost</span>
                <div className="text-xs font-bold text-slate-800">
                  {getRecipientCount()} Parents × {smsSegments} Page = KES {(getRecipientCount() * smsSegments * 0.8).toFixed(2)}
                </div>
              </div>
              <button
                type="submit"
                disabled={isSending || !messageText.trim()}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold rounded-xl text-xs flex items-center space-x-1.5 shadow-sm transition-all"
              >
                <Send className="h-4 w-4" />
                <span>{isSending ? 'Dispatching...' : 'Dispatch Broadcast'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Col: Broadcast Logs */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-3">Recent SMS Dispatches</h3>
            <div className="space-y-3">
              {smsLogs.map((log) => (
                <div key={log.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-200">
                    <span className="font-bold text-slate-800">{log.recipientGroup.replace('_', ' ')}</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {log.recipientCount} Sent
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px] mt-2 line-clamp-3 leading-snug">
                    "{log.message}"
                  </p>
                  <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                    <span>{new Date(log.sentAt).toLocaleDateString()}</span>
                    <span className="font-mono">Cost: KES {log.costKes?.toFixed(2) || '0.00'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 text-center">
            Sender ID: <span className="font-bold text-slate-700">{tenant?.name.toUpperCase().slice(0, 11)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
