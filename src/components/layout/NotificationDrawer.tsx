import React from 'react';
import { PlatformNotification, NavTab } from '../../types';
import { Bell, X, AlertTriangle, Info, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: PlatformNotification[];
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  setActiveTab: (tab: NavTab) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  markAsRead,
  markAllAsRead,
  setActiveTab,
}) => {
  if (!isOpen) return null;

  const getTypeBadge = (type: PlatformNotification['type']) => {
    switch (type) {
      case 'URGENT':
        return (
          <span className="flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
            <AlertCircle className="w-3 h-3 text-rose-600" />
            <span>URGENT</span>
          </span>
        );
      case 'IMPORTANT':
        return (
          <span className="flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            <span>IMPORTANT</span>
          </span>
        );
      default:
        return (
          <span className="flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
            <Info className="w-3 h-3 text-blue-600" />
            <span>INFO</span>
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-150">
      <div 
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl border-l border-slate-200 flex flex-col">
          
          {/* Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-xl bg-teal-50 text-teal-700 border border-teal-200">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Notification Center</h3>
                <p className="text-[11px] text-slate-500">Biomedical alerts & workflow requests</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={markAllAsRead}
                className="text-[11px] text-teal-700 hover:text-teal-900 font-semibold px-2 py-1 rounded-lg hover:bg-teal-50 transition"
              >
                Mark all read
              </button>
              <button
                onClick={onClose}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {notifications.length === 0 ? (
              <div className="py-20 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs font-semibold text-slate-600">All caught up</p>
                <p className="text-[11px] text-slate-400">No pending alerts or required clinical actions.</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => {
                    markAsRead(n.id);
                    if (n.actionTab) {
                      setActiveTab(n.actionTab);
                      onClose();
                    }
                  }}
                  className={`p-4 rounded-2xl border transition cursor-pointer space-y-2 ${
                    n.read
                      ? 'bg-slate-50 border-slate-200/80 opacity-75'
                      : 'bg-white border-slate-200 shadow-xs hover:border-teal-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    {getTypeBadge(n.type)}
                    <span className="text-[10px] text-slate-400 font-mono">{n.timestamp}</span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900">{n.title}</h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed">{n.message}</p>

                  {n.actionTab && (
                    <div className="pt-1 flex items-center space-x-1 text-[11px] font-bold text-teal-700 hover:text-teal-900">
                      <span>View in {n.actionTab.toUpperCase()}</span>
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
