import React from 'react';
import { AppNotification } from '../types';
import { Bell, X, Check, Sparkles, CheckCircle2 } from 'lucide-react';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onMarkAllRead: () => void;
  language: 'ar' | 'en';
}

export default function NotificationsModal({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
  language
}: NotificationsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden space-y-4 p-5 animate-in fade-in zoom-in-95">
        
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-purple-50 text-pi-purple rounded-xl">
              <Bell className="h-5 w-5" />
            </div>
            <h3 className="text-base font-extrabold text-gray-900">
              {language === 'en' ? 'Notifications' : 'التنبيهات والإشعارات'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
          {notifications.length === 0 ? (
            <div className="py-8 text-center text-xs text-gray-400">
              {language === 'en' ? 'No notifications yet' : 'لا توجد إشعارات حالياً'}
            </div>
          ) : (
            notifications.map(notif => (
              <div
                key={notif.id}
                className={`p-3.5 rounded-2xl border text-xs space-y-1 transition-all ${
                  !notif.read ? 'bg-purple-50/60 border-purple-200' : 'bg-gray-50/50 border-gray-100'
                }`}
              >
                <div className="flex items-center justify-between font-bold text-gray-900">
                  <span>{language === 'en' && notif.titleEn ? notif.titleEn : notif.title}</span>
                  <span className="text-[10px] text-gray-400 font-normal">{notif.date}</span>
                </div>
                <p className="text-gray-600 leading-relaxed text-[11px]">
                  {language === 'en' && notif.messageEn ? notif.messageEn : notif.message}
                </p>
              </div>
            ))
          )}
        </div>

        {notifications.some(n => !n.read) && (
          <button
            onClick={onMarkAllRead}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <CheckCircle2 className="h-4 w-4 text-pi-purple" />
            <span>{language === 'en' ? 'Mark All as Read' : 'تحديد الكل كتقروء'}</span>
          </button>
        )}

      </div>
    </div>
  );
}
