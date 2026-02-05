import Layout from '../components/common/Layout';

export default function Notifications() {
  const notifications = [
    {
      id: '1',
      type: 'transaction',
      icon: '✅',
      title: 'Money sent successfully',
      message: 'Your transfer of $250 to Maria Rodriguez was completed',
      time: '2 hours ago',
      read: false
    },
    {
      id: '2',
      type: 'security',
      icon: '🔒',
      title: 'Login from new device',
      message: 'We detected a login from a new device in New York',
      time: '5 hours ago',
      read: false
    },
    {
      id: '3',
      type: 'promotion',
      icon: '🎉',
      title: 'Invite friends and earn $25',
      message: 'Share VentoVault with friends and get rewarded',
      time: '1 day ago',
      read: true
    },
    {
      id: '4',
      type: 'transaction',
      icon: '💰',
      title: 'You received $150',
      message: 'Carlos Jimenez sent you money',
      time: '2 days ago',
      read: true
    },
  ];

  return (
    <Layout>
      <div className="max-w-3xl mx-auto pb-20 md:pb-6">
        <div className="mb-6 animate-slide-up">
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600 mt-1">Stay updated with your account activity</p>
        </div>

        {/* Unread Count */}
        {notifications.filter(n => !n.read).length > 0 && (
          <div className="card bg-primary-50 border border-primary-200 mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-primary-900">
                  You have {notifications.filter(n => !n.read).length} unread notifications
                </div>
                <div className="text-sm text-primary-700">Stay on top of your account</div>
              </div>
              <button className="text-primary-600 hover:text-primary-700 font-medium text-sm">
                Mark all as read
              </button>
            </div>
          </div>
        )}

        {/* Notifications List */}
        <div className="card animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="space-y-1">
            {notifications.map((notification, index) => (
              <div
                key={notification.id}
                className={`p-4 rounded-xl transition-all cursor-pointer ${
                  !notification.read ? 'bg-primary-50 hover:bg-primary-100' : 'hover:bg-gray-50'
                }`}
                style={{ animationDelay: `${0.3 + index * 0.05}s` }}
              >
                <div className="flex gap-4">
                  <div className="text-3xl flex-shrink-0">{notification.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4 mb-1">
                      <div className="font-semibold text-gray-900">{notification.title}</div>
                      <span className="text-xs text-gray-500 whitespace-nowrap">{notification.time}</span>
                    </div>
                    <p className="text-sm text-gray-600">{notification.message}</p>
                  </div>
                  {!notification.read && (
                    <div className="w-2 h-2 bg-primary-600 rounded-full flex-shrink-0 mt-2"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Settings Link */}
        <div className="mt-6 text-center animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <button className="text-primary-600 hover:text-primary-700 font-medium text-sm">
            ⚙️ Notification Settings
          </button>
        </div>
      </div>
    </Layout>
  );
}
