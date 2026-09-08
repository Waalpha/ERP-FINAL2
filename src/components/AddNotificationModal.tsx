import React, { useState } from 'react';
import {
  X,
  Bell,
  Send,
  AlertTriangle,
  Sparkles,
  BookOpen,
  DollarSign,
  Package,
  Layers,
  Users,
  CheckCircle2,
  Clock
} from 'lucide-react';
import {
  AppNotification,
  NotificationCategory,
  NotificationPriority,
  NotificationAudience,
  Tenant
} from '../types';

interface AddNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddNotification: (notification: Omit<AppNotification, 'id' | 'timestamp' | 'isRead'>) => Promise<void> | void;
  tenant: Tenant;
  authorName: string;
  authorRole: string;
}

export const AddNotificationModal: React.FC<AddNotificationModalProps> = ({
  isOpen,
  onClose,
  onAddNotification,
  tenant,
  authorName,
  authorRole
}) => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState<NotificationCategory>('ANNOUNCEMENT');
  const [priority, setPriority] = useState<NotificationPriority>('NORMAL');
  const [targetAudience, setTargetAudience] = useState<NotificationAudience>('ALL');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Contextual presets based on tenant type
  const getSuggestedPresets = () => {
    const tType = tenant.type?.toUpperCase() || '';
    if (tType.includes('THEOLOG') || tType.includes('SEMINARY')) {
      return [
        {
          title: 'Practicum Log Submission Reminder',
          message: 'All diploma and degree candidates must submit their parish fieldwork reports to the Registrar by Friday 5:00 PM.',
          category: 'ACADEMIC' as NotificationCategory,
          priority: 'HIGH' as NotificationPriority,
          targetAudience: 'STUDENTS' as NotificationAudience
        },
        {
          title: 'Diocesan Synod & Chapel Schedule',
          message: 'Wednesday morning Holy Communion and visiting Bishop address will commence at 8:30 AM in the Main Chapel.',
          category: 'ANNOUNCEMENT' as NotificationCategory,
          priority: 'NORMAL' as NotificationPriority,
          targetAudience: 'ALL' as NotificationAudience
        }
      ];
    }

    if (tType.includes('PRIMARY') || tType.includes('SECONDARY') || tType.includes('SCHOOL')) {
      return [
        {
          title: 'CBC Formative Assessment Deadline',
          message: 'Teachers must upload all learner Strand evaluations and rubric marks before end of week for parent report cards.',
          category: 'ACADEMIC' as NotificationCategory,
          priority: 'HIGH' as NotificationPriority,
          targetAudience: 'STAFF' as NotificationAudience
        },
        {
          title: 'Term Fee Clearance Reminder',
          message: 'Please ensure all school fee balances are reconciled via M-Pesa automated billing before next Monday.',
          category: 'FINANCIAL' as NotificationCategory,
          priority: 'NORMAL' as NotificationPriority,
          targetAudience: 'ALL' as NotificationAudience
        }
      ];
    }

    if (tType.includes('HOSPITAL') || tType.includes('CLINIC')) {
      return [
        {
          title: 'Triage Unit Escalation Notice',
          message: 'High outpatient influx recorded. Additional medical officer assigned to General OPD Station 2.',
          category: 'ALERT' as NotificationCategory,
          priority: 'URGENT' as NotificationPriority,
          targetAudience: 'STAFF' as NotificationAudience
        },
        {
          title: 'Digital Pharmacy Restock Notice',
          message: 'Essential pharmaceuticals and emergency antibiotics delivery verified into the central pharmacy inventory.',
          category: 'STOCK' as NotificationCategory,
          priority: 'NORMAL' as NotificationPriority,
          targetAudience: 'ALL' as NotificationAudience
        }
      ];
    }

    if (tType.includes('RETAIL') || tType.includes('BUSINESS')) {
      return [
        {
          title: 'POS Shift Float Reconciliation',
          message: 'All cashier registers must complete physical drawer cash counts and submit closing stock counts before 9:00 PM.',
          category: 'FINANCIAL' as NotificationCategory,
          priority: 'HIGH' as NotificationPriority,
          targetAudience: 'STAFF' as NotificationAudience
        },
        {
          title: 'Low Stock SKU Warning',
          message: 'Fast-moving inventory items are below minimum reorder thresholds. Warehouse restock orders initiated.',
          category: 'STOCK' as NotificationCategory,
          priority: 'NORMAL' as NotificationPriority,
          targetAudience: 'MANAGEMENT' as NotificationAudience
        }
      ];
    }

    // General / College / University default
    return [
      {
        title: 'Semester Examination Timetable Published',
        message: 'The official final examination timetable for the current academic session is now available on the portal.',
        category: 'ACADEMIC' as NotificationCategory,
        priority: 'HIGH' as NotificationPriority,
        targetAudience: 'ALL' as NotificationAudience
      },
      {
        title: 'Institutional Administration Briefing',
        message: 'Department heads meeting scheduled for tomorrow at 10:00 AM in the Boardroom to review operational reports.',
        category: 'ANNOUNCEMENT' as NotificationCategory,
        priority: 'NORMAL' as NotificationPriority,
        targetAudience: 'STAFF' as NotificationAudience
      }
    ];
  };

  const applyPreset = (preset: {
    title: string;
    message: string;
    category: NotificationCategory;
    priority: NotificationPriority;
    targetAudience: NotificationAudience;
  }) => {
    setTitle(preset.title);
    setMessage(preset.message);
    setCategory(preset.category);
    setPriority(preset.priority);
    setTargetAudience(preset.targetAudience);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    try {
      setIsSubmitting(true);
      await onAddNotification({
        tenantId: tenant.id,
        title: title.trim(),
        message: message.trim(),
        category,
        priority,
        targetAudience,
        authorName,
        authorRole
      });
      // Reset and close
      setTitle('');
      setMessage('');
      onClose();
    } catch (err) {
      console.error('Failed to create notification:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Broadcast Institutional Notification
              </h3>
              <p className="text-xs text-slate-500">
                {tenant.name} • Active Tenant Feed
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Suggestion Presets */}
        <div className="my-3 pt-1">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Quick Suggestions for {tenant.name}:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {getSuggestedPresets().map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => applyPreset(preset)}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 hover:border-indigo-200 transition text-left"
              >
                + {preset.title}
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Notification Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Notification Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Practicum Submission Deadline / Fee Notice"
              className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
            />
          </div>

          {/* Row: Category & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as NotificationCategory)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none cursor-pointer"
              >
                <option value="ANNOUNCEMENT">📢 General Announcement</option>
                <option value="ALERT">⚠️ Urgent Alert / Warning</option>
                <option value="ACADEMIC">🎓 Academic & Curriculum</option>
                <option value="FINANCIAL">💰 Financial & Billing</option>
                <option value="STOCK">📦 Stock & Inventory</option>
                <option value="OPERATIONS">⚙️ Operations & System</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Priority Level
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as NotificationPriority)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none cursor-pointer"
              >
                <option value="LOW">🔵 Low (Informational)</option>
                <option value="NORMAL">🟢 Normal</option>
                <option value="HIGH">🟠 High Priority</option>
                <option value="URGENT">🔴 Urgent Action Required</option>
              </select>
            </div>
          </div>

          {/* Target Audience */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Target Audience
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'ALL', label: 'All Community' },
                { id: 'STAFF', label: 'Staff & Faculty' },
                { id: 'STUDENTS', label: 'Students' },
                { id: 'MANAGEMENT', label: 'Management' }
              ].map((aud) => (
                <button
                  key={aud.id}
                  type="button"
                  onClick={() => setTargetAudience(aud.id as NotificationAudience)}
                  className={`px-2.5 py-1.5 text-xs font-medium rounded-xl border text-center transition ${
                    targetAudience === aud.id
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {aud.label}
                </button>
              ))}
            </div>
          </div>

          {/* Message Body */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700">
                Message Body <span className="text-rose-500">*</span>
              </label>
              <span className="text-[10px] text-slate-400">
                {message.length}/500 chars
              </span>
            </div>
            <textarea
              required
              rows={3}
              maxLength={500}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Provide clear details regarding this announcement or alert..."
              className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none transition"
            />
          </div>

          {/* Author Tag Preview */}
          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Published Immediately • Active in Bell Menu</span>
            </span>
            <span className="font-medium text-slate-700">
              By {authorName} ({authorRole})
            </span>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end space-x-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !title.trim() || !message.trim()}
              className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 rounded-xl shadow-md shadow-indigo-600/20 transition flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Broadcasting...' : 'Publish Notification'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
