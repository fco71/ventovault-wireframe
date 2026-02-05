import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/common/Layout';

export default function Settings() {
  const { currentUser } = useAuth();

  const sections = [
    {
      title: 'Account',
      items: [
        { icon: '👤', label: 'Personal Information', value: 'Edit profile details' },
        { icon: '🔒', label: 'Security', value: 'Password, 2FA, biometrics' },
        { icon: '🔔', label: 'Notifications', value: 'Email and push preferences' },
      ]
    },
    {
      title: 'Financial',
      items: [
        { icon: '💳', label: 'Payment Methods', value: '2 cards linked' },
        { icon: '🏦', label: 'Bank Accounts', value: '1 account connected' },
        { icon: '📊', label: 'Limits', value: 'Daily: $5,000' },
      ]
    },
    {
      title: 'Support',
      items: [
        { icon: '❓', label: 'Help Center', value: 'FAQs and guides' },
        { icon: '💬', label: 'Contact Support', value: 'Get help from our team' },
        { icon: '⭐', label: 'Rate App', value: 'Share your feedback' },
      ]
    },
    {
      title: 'Legal',
      items: [
        { icon: '📄', label: 'Terms of Service', value: '' },
        { icon: '🔐', label: 'Privacy Policy', value: '' },
        { icon: 'ℹ️', label: 'About', value: 'Version 1.0.0' },
      ]
    }
  ];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto pb-20 md:pb-6">
        <div className="mb-6 animate-slide-up">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Manage your account and preferences</p>
        </div>

        {/* Profile Card */}
        <div className="card mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl flex items-center justify-center text-3xl text-white font-bold">
              {currentUser?.displayName?.charAt(0)}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900">{currentUser?.displayName}</h2>
              <p className="text-gray-600">{currentUser?.email}</p>
              <div className="mt-2 flex gap-2">
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                  ✓ Verified
                </span>
                <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-semibold">
                  Premium
                </span>
              </div>
            </div>
            <button className="btn btn-secondary">
              Edit Profile
            </button>
          </div>
        </div>

        {/* Settings Sections */}
        {sections.map((section, sectionIndex) => (
          <div
            key={section.title}
            className="card mb-4 animate-slide-up"
            style={{ animationDelay: `${0.2 + sectionIndex * 0.1}s` }}
          >
            <h3 className="font-bold text-gray-900 mb-4">{section.title}</h3>
            <div className="space-y-1">
              {section.items.map((item, itemIndex) => (
                <button
                  key={itemIndex}
                  className="w-full p-4 rounded-xl hover:bg-gray-50 transition-all text-left flex items-center gap-4"
                >
                  <span className="text-2xl">{item.icon}</span>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{item.label}</div>
                    {item.value && <div className="text-sm text-gray-500">{item.value}</div>}
                  </div>
                  <span className="text-gray-400">→</span>
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Logout Button */}
        <button
          className="w-full btn bg-red-50 text-red-600 hover:bg-red-100 py-3 animate-slide-up"
          style={{ animationDelay: '0.6s' }}
        >
          🚪 Logout
        </button>
      </div>
    </Layout>
  );
}
