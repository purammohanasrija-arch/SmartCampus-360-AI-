import React from 'react';
import { 
  X, 
  Bell, 
  CheckCheck, 
  Trash2, 
  AlertTriangle, 
  Calendar, 
  Award, 
  DollarSign, 
  Briefcase, 
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { NotificationItem } from '../../types/campus';
import { apiClient } from '../../services/apiClient';

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onRefresh: () => void;
  onNavigate: (module: string) => void;
}

export function NotificationsDrawer({ 
  isOpen, 
  onClose, 
  notifications, 
  onRefresh, 
  onNavigate 
}: NotificationsDrawerProps) {
  if (!isOpen) return null;

  const handleMarkRead = async (id: string) => {
    await apiClient.markNotificationRead(id);
    onRefresh();
  };

  const handleClearAll = async () => {
    await apiClient.clearAllNotifications();
    onRefresh();
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getCategoryIcon = (category: NotificationItem['category']) => {
    switch (category) {
      case 'attendance': return AlertTriangle;
      case 'exam': return Award;
      case 'fee': return DollarSign;
      case 'placement': return Briefcase;
      case 'library': return BookOpen;
      default: return Calendar;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border-l border-slate-800 w-full max-w-md h-full flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-6 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-purple-400" />
            <h3 className="text-base font-bold text-white">Campus Notifications</h3>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-mono font-bold">
                {unreadCount} new
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {notifications.length > 0 && (
              <button
                onClick={handleClearAll}
                className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-200 transition-colors"
                title="Clear All Notifications"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length > 0 ? (
            notifications.map(n => {
              const Icon = getCategoryIcon(n.category);

              return (
                <div
                  key={n.id}
                  onClick={() => {
                    handleMarkRead(n.id);
                    if (n.link) {
                      onNavigate(n.link);
                      onClose();
                    }
                  }}
                  className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 ${
                    !n.read
                      ? 'bg-purple-950/20 border-purple-500/40 hover:bg-purple-950/30'
                      : 'bg-slate-950/40 border-slate-800/80 hover:bg-slate-950'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                        n.priority === 'high' ? 'bg-rose-500/20 text-rose-300' : 'bg-purple-500/20 text-purple-300'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <h4 className="text-xs font-bold text-white">{n.title}</h4>
                    </div>

                    <span className="text-[10px] text-slate-500 font-mono shrink-0">{n.timestamp}</span>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed pl-9">{n.message}</p>

                  <div className="pl-9 flex items-center justify-between text-[11px] font-mono text-purple-400">
                    <span className="capitalize">{n.category} Update</span>
                    {n.link && (
                      <span className="flex items-center gap-1 hover:underline">
                        <span>View Details</span>
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-16 text-center text-xs text-slate-500">
              No new university announcements or alerts.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
