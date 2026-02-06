import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/common/Layout';
import Toggle from '../components/ui/Toggle';
import { notificationService } from '../services';
import { Notification } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { shortTimeAgo } from '../services/mock/utils';
import { toast } from '../components/ui/Toast';
import { BellRing, CheckCheck, Sparkles, SlidersHorizontal } from 'lucide-react';

function iconForType(type: Notification['type']): string {
  if (type === 'security') {
    return '🔒';
  }
  if (type === 'promotion') {
    return '🎉';
  }
  if (type === 'compliance') {
    return '🛡️';
  }
  return '✅';
}

export default function Notifications() {
  const { currentUser } = useAuth();
  const [signalOnly, setSignalOnly] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadNotifications() {
      if (!currentUser) {
        return;
      }

      const result = await notificationService.listNotifications(currentUser.id);
      if (mounted && result.ok && result.data) {
        setNotifications(result.data);
      }

      if (mounted) {
        setLoading(false);
      }
    }

    void loadNotifications();

    return () => {
      mounted = false;
    };
  }, [currentUser]);

  const visibleNotifications = useMemo(
    () =>
      signalOnly
        ? notifications.filter((notification) => notification.type !== 'promotion')
        : notifications,
    [notifications, signalOnly]
  );

  const unreadCount = visibleNotifications.filter((item) => !item.read).length;
  const totalUnread = notifications.filter((item) => !item.read).length;

  const handleMarkAllRead = async () => {
    if (!currentUser) {
      return;
    }

    const result = await notificationService.markAllRead(currentUser.id);
    if (result.ok && result.data) {
      setNotifications(result.data);
      toast.success('All notifications marked as read');
    }
  };

  const handleMarkRead = async (id: string) => {
    if (!currentUser) {
      return;
    }

    const result = await notificationService.markRead(currentUser.id, id);
    if (result.ok && result.data) {
      setNotifications((prev) => prev.map((item) => (item.id === id ? result.data! : item)));
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto pb-20 md:pb-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="vv-hero"
        >
          <div className="flex flex-wrap items-center gap-2.5 mb-5">
            <span className="vv-chip vv-chip-hot">{notifications.length} total alerts</span>
            <span className="vv-chip">{totalUnread} unread</span>
            <span className="vv-chip vv-chip-accent">{signalOnly ? 'Signal mode on' : 'All events'}</span>
          </div>
          <h1 className="text-3xl md:text-[2.2rem] font-bold text-gray-950 font-display leading-tight">
            Notification signal center
          </h1>
          <p className="text-sm text-gray-600 mt-3 max-w-2xl">
            Monitor transfer, security, and compliance events in one high-focus stream.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className="vv-panel"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-gray-500">Signal Mode</div>
              <div className="font-semibold text-gray-900 font-display mt-1">
                Focus on high-signal alerts
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Prioritize security and transfer events. Hide low-impact promotions.
              </p>
            </div>
            <Toggle checked={signalOnly} onChange={setSignalOnly} />
          </div>
        </motion.div>

        {unreadCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="vv-surface-soft border-primary-200/70 bg-primary-50/85 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <BellRing className="w-5 h-5 text-primary-700" />
              <div>
                <div className="font-semibold text-primary-900">
                  You have {unreadCount} unread notifications
                </div>
                <div className="text-sm text-primary-700">Stay on top of account-critical events</div>
              </div>
            </div>
            <button
              type="button"
              onClick={handleMarkAllRead}
              className="btn btn-secondary inline-flex items-center gap-2 text-xs px-4 py-2"
            >
              <CheckCheck className="w-4 h-4" />
              Mark All Read
            </button>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.15 }}
          className="vv-panel"
        >
          <div className="space-y-2">
            {loading ? (
              <div className="vv-surface-soft text-sm text-gray-500">Loading notifications...</div>
            ) : visibleNotifications.length === 0 ? (
              <div className="vv-surface-soft text-sm text-gray-500">
                No notifications in this view.
              </div>
            ) : (
              visibleNotifications.map((notification, index) => (
                <motion.button
                  type="button"
                  key={notification.id}
                  onClick={() => {
                    if (!notification.read) {
                      void handleMarkRead(notification.id);
                    }
                  }}
                  className={`vv-choice-card ${!notification.read ? 'border-primary-200 bg-primary-50/80' : ''}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.24, delay: index * 0.03 }}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.995 }}
                >
                  <div className="flex gap-4 items-start">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-white to-primary-50 border border-white/80 flex items-center justify-center text-2xl flex-shrink-0">
                      {iconForType(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-1">
                        <div className="font-semibold text-gray-900">{notification.title}</div>
                        <span className="text-xs text-gray-500 whitespace-nowrap">
                          {shortTimeAgo(notification.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{notification.message}</p>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-primary-600 rounded-full flex-shrink-0 mt-2 vv-breath" />
                    )}
                  </div>
                </motion.button>
              ))
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.22 }}
          className="text-center"
        >
          <button
            type="button"
            onClick={() => toast.success('Notification preferences opening soon')}
            className="btn btn-secondary inline-flex items-center gap-2"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Notification Settings
            <Sparkles className="w-4 h-4 text-accent-500" />
          </button>
        </motion.div>
      </div>
    </Layout>
  );
}
