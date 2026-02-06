import { useEffect, useMemo, useState } from 'react';
import Layout from '../components/common/Layout';
import Toggle from '../components/ui/Toggle';
import { notificationService } from '../services';
import { Notification } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { shortTimeAgo } from '../services/mock/utils';
import { toast } from '../components/ui/Toast';

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
      <div className="max-w-3xl mx-auto pb-20 md:pb-6">
        <div className="mb-6 animate-slide-up">
          <h1 className="text-3xl font-semibold text-gray-900 font-display">Notifications</h1>
          <p className="text-gray-600 mt-2">Stay updated with your account activity.</p>
        </div>

        <div className="card mb-6 animate-slide-up" style={{ animationDelay: '0.05s' }}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-gray-500">Signal Mode</div>
              <div className="font-semibold text-gray-900 font-display mt-1">Focus on high-signal alerts</div>
              <p className="text-sm text-gray-600 mt-2">
                Prioritize security and transfer events. Hide low-impact promotions.
              </p>
            </div>
            <Toggle checked={signalOnly} onChange={setSignalOnly} />
          </div>
        </div>

        {unreadCount > 0 && (
          <div className="card bg-primary-50/80 border border-primary-200/40 mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-primary-900">You have {unreadCount} unread notifications</div>
                <div className="text-sm text-primary-700">Stay on top of your account</div>
              </div>
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="text-primary-600 hover:text-primary-700 font-medium text-sm"
              >
                Mark all as read
              </button>
            </div>
          </div>
        )}

        <div className="card animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="space-y-1">
            {loading ? (
              <div className="p-4 text-sm text-gray-500">Loading notifications...</div>
            ) : (
              visibleNotifications.map((notification, index) => (
                <button
                  type="button"
                  key={notification.id}
                  onClick={() => {
                    if (!notification.read) {
                      void handleMarkRead(notification.id);
                    }
                  }}
                  className={`w-full p-4 rounded-xl transition-all text-left ${
                    !notification.read ? 'bg-primary-50/80 hover:bg-primary-100/80' : 'hover:bg-white/70'
                  }`}
                  style={{ animationDelay: `${0.3 + index * 0.05}s` }}
                >
                  <div className="flex gap-4">
                    <div className="text-3xl flex-shrink-0">{iconForType(notification.type)}</div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4 mb-1">
                        <div className="font-semibold text-gray-900">{notification.title}</div>
                        <span className="text-xs text-gray-500 whitespace-nowrap">
                          {shortTimeAgo(notification.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{notification.message}</p>
                    </div>
                    {!notification.read && <div className="w-2 h-2 bg-primary-600 rounded-full flex-shrink-0 mt-2" />}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        <div className="mt-6 text-center animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <button type="button" className="text-primary-600 hover:text-primary-700 font-medium text-sm">
            ⚙️ Notification Settings
          </button>
        </div>
      </div>
    </Layout>
  );
}
