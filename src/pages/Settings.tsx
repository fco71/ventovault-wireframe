import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/common/Layout';
import Toggle from '../components/ui/Toggle';
import { toast } from '../components/ui/Toast';

export default function Settings() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [autoRoute, setAutoRoute] = useState(true);
  const [autoShield, setAutoShield] = useState(true);
  const [priorityAlerts, setPriorityAlerts] = useState(false);

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

  const handleLogout = async () => {
    await logout();
    toast.success('Signed out');
    navigate('/login');
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto pb-20 md:pb-6">
        <div className="mb-6 animate-slide-up">
          <h1 className="text-3xl font-semibold text-gray-900 font-display">Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account and preferences.</p>
        </div>

        {/* Profile Card */}
        <div className="card mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center text-3xl text-white font-bold shadow-glow">
              {currentUser?.displayName?.charAt(0)}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900">{currentUser?.displayName}</h2>
              <p className="text-gray-600">{currentUser?.email}</p>
              <div className="mt-2 flex gap-2">
                <span className="px-3 py-1 bg-success-50 text-success-700 rounded-full text-xs font-semibold">
                  ✓ Verified
                </span>
                <span className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-semibold">
                  Premium
                </span>
              </div>
            </div>
            <button className="btn btn-secondary">
              Edit Profile
            </button>
          </div>
        </div>

        {/* Smart Automations */}
        <div className="card mb-6 animate-slide-up" style={{ animationDelay: '0.15s' }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-900 font-display">Smart Automations</h3>
              <p className="text-sm text-gray-600 mt-1">Let VentoVault optimize transfers for speed and safety.</p>
            </div>
            <span className="badge badge-info">Beta</span>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-white/70 border border-white/60">
              <div>
                <div className="font-semibold text-gray-900">Auto-route transfers</div>
                <div className="text-sm text-gray-600">Always pick the fastest rail and payout partner.</div>
              </div>
              <Toggle checked={autoRoute} onChange={setAutoRoute} />
            </div>
            <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-white/70 border border-white/60">
              <div>
                <div className="font-semibold text-gray-900">FX Shield</div>
                <div className="text-sm text-gray-600">Lock best rates for 10 minutes at checkout.</div>
              </div>
              <Toggle checked={autoShield} onChange={setAutoShield} />
            </div>
            <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-white/70 border border-white/60">
              <div>
                <div className="font-semibold text-gray-900">Priority alerts</div>
                <div className="text-sm text-gray-600">Only notify on security or payment-critical events.</div>
              </div>
              <Toggle checked={priorityAlerts} onChange={setPriorityAlerts} />
            </div>
          </div>
        </div>

        {/* Compliance & Limits */}
        <div className="card mb-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-900 font-display">Compliance & Limits</h3>
              <p className="text-sm text-gray-600 mt-1">Stay verified for faster payouts and higher limits.</p>
            </div>
            <span className="badge badge-success">Verified</span>
          </div>
          <div className="space-y-3">
            {[
              { label: 'Identity Verification', value: 'Completed', tone: 'success' },
              { label: 'Source of Funds', value: 'On file', tone: 'success' },
              { label: 'Daily Send Limit', value: '$5,000', tone: 'info' },
            ].map((item) => {
              const badgeClass = item.tone === 'info' ? 'badge badge-info' : 'badge badge-success';
              return (
                <div key={item.label} className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-white/70 border border-white/60">
                  <div className="text-sm text-gray-600">{item.label}</div>
                  <span className={badgeClass}>{item.value}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Settings Sections */}
        {sections.map((section, sectionIndex) => (
          <div
            key={section.title}
            className="card mb-4 animate-slide-up"
            style={{ animationDelay: `${0.3 + sectionIndex * 0.1}s` }}
          >
            <h3 className="font-bold text-gray-900 mb-4">{section.title}</h3>
            <div className="space-y-1">
              {section.items.map((item, itemIndex) => (
                <button
                  key={itemIndex}
                  className="w-full p-4 rounded-xl hover:bg-white/70 transition-all text-left flex items-center gap-4"
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
          onClick={handleLogout}
          className="w-full btn bg-error-50 text-error-600 hover:bg-error-50/80 py-3 animate-slide-up"
          style={{ animationDelay: '0.6s' }}
        >
          🚪 Logout
        </button>
      </div>
    </Layout>
  );
}
