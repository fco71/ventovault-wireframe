import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/common/Layout';
import Toggle from '../components/ui/Toggle';
import { toast } from '../components/ui/Toast';
import {
  BarChart3,
  Bell,
  ChevronRight,
  CircleHelp,
  CreditCard,
  FileText,
  Info,
  Landmark,
  LockKeyhole,
  LogOut,
  MessageSquare,
  Shield,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Star,
  UserRound,
  type LucideIcon,
} from 'lucide-react';

export default function Settings() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [autoRoute, setAutoRoute] = useState(true);
  const [autoShield, setAutoShield] = useState(true);
  const [priorityAlerts, setPriorityAlerts] = useState(false);

  const sections: Array<{
    title: string;
    items: Array<{ icon: LucideIcon; label: string; value: string }>;
  }> = [
    {
      title: 'Account',
      items: [
        { icon: UserRound, label: 'Personal Information', value: 'Edit profile details' },
        { icon: LockKeyhole, label: 'Security', value: 'Password, 2FA, biometrics' },
        { icon: Bell, label: 'Notifications', value: 'Email and push preferences' },
      ]
    },
    {
      title: 'Financial',
      items: [
        { icon: CreditCard, label: 'Payment Methods', value: '2 cards linked' },
        { icon: Landmark, label: 'Bank Accounts', value: '1 account connected' },
        { icon: BarChart3, label: 'Limits', value: 'Daily: $5,000' },
      ]
    },
    {
      title: 'Support',
      items: [
        { icon: CircleHelp, label: 'Help Center', value: 'FAQs and guides' },
        { icon: MessageSquare, label: 'Contact Support', value: 'Get help from our team' },
        { icon: Star, label: 'Rate App', value: 'Share your feedback' },
      ]
    },
    {
      title: 'Legal',
      items: [
        { icon: FileText, label: 'Terms of Service', value: '' },
        { icon: Shield, label: 'Privacy Policy', value: '' },
        { icon: Info, label: 'About', value: 'Version 1.0.0' },
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
      <div className="max-w-5xl mx-auto pb-20 md:pb-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="vv-hero"
        >
          <div className="flex flex-wrap items-center gap-2.5 mb-5">
            <span className="vv-chip vv-chip-hot">Verified account</span>
            <span className="vv-chip">Tier {currentUser?.verificationTier || 'L30'}</span>
            <span className="vv-chip vv-chip-accent">Premium controls active</span>
          </div>
          <h1 className="text-3xl md:text-[2.2rem] font-bold text-gray-950 font-display leading-tight">
            Control tower settings
          </h1>
          <p className="text-sm text-gray-600 mt-3 max-w-2xl">
            Manage account profile, automations, compliance posture, and platform behavior from one command surface.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className="vv-panel"
        >
          <div className="vv-surface-soft">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center text-3xl text-white font-bold shadow-glow">
                {currentUser?.displayName?.charAt(0) || 'U'}
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 font-display">
                  {currentUser?.displayName || 'VentoVault User'}
                </h2>
                <p className="text-gray-600">{currentUser?.email || 'No email set'}</p>
                <div className="mt-2 flex gap-2">
                  <span className="px-3 py-1 bg-success-50 text-success-700 rounded-full text-xs font-semibold inline-flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    Verified
                  </span>
                  <span className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-semibold inline-flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Premium
                  </span>
                </div>
              </div>
              <button
                type="button"
                className="btn btn-secondary inline-flex items-center gap-2"
                onClick={() => toast.success('Profile editor coming soon')}
              >
                <SlidersHorizontal className="w-4 h-4" />
                Edit Profile
              </button>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.09 }}
          className="vv-panel"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-900 font-display">Smart Automations</h3>
              <p className="text-sm text-gray-600 mt-1">
                Let VentoVault optimize transfers for speed and safety.
              </p>
            </div>
            <span className="badge badge-info">Beta</span>
          </div>
          <div className="space-y-3">
            <div className="vv-choice-card flex items-center justify-between gap-4">
              <div>
                <div className="font-semibold text-gray-900">Auto-route transfers</div>
                <div className="text-sm text-gray-600">
                  Always pick the fastest rail and payout partner.
                </div>
              </div>
              <Toggle checked={autoRoute} onChange={setAutoRoute} />
            </div>
            <div className="vv-choice-card flex items-center justify-between gap-4">
              <div>
                <div className="font-semibold text-gray-900">FX Shield</div>
                <div className="text-sm text-gray-600">Lock best rates for 10 minutes at checkout.</div>
              </div>
              <Toggle checked={autoShield} onChange={setAutoShield} />
            </div>
            <div className="vv-choice-card flex items-center justify-between gap-4">
              <div>
                <div className="font-semibold text-gray-900">Priority alerts</div>
                <div className="text-sm text-gray-600">
                  Only notify on security or payment-critical events.
                </div>
              </div>
              <Toggle checked={priorityAlerts} onChange={setPriorityAlerts} />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.14 }}
          className="vv-panel"
        >
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
                <div key={item.label} className="vv-surface-soft flex items-center justify-between gap-4">
                  <div className="text-sm text-gray-600">{item.label}</div>
                  <span className={badgeClass}>{item.value}</span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {sections.map((section, sectionIndex) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.32, delay: 0.2 + sectionIndex * 0.05 }}
            className="vv-panel"
          >
            <h3 className="font-bold text-gray-900 mb-4 font-display">{section.title}</h3>
            <div className="space-y-2">
              {section.items.map((item) => {
                const IconComponent = item.icon;

                return (
                  <button
                    key={`${section.title}-${item.label}`}
                    type="button"
                    className="vv-choice-card flex items-center gap-4"
                    onClick={() => toast.success(`${item.label} selected`)}
                  >
                    <span className="vv-icon-tile">
                      <IconComponent className="h-4 w-4 text-gray-600" />
                    </span>
                    <div className="flex-1 text-left">
                      <div className="font-semibold text-gray-900">{item.label}</div>
                      {item.value && <div className="text-sm text-gray-500">{item.value}</div>}
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </button>
                );
              })}
            </div>
          </motion.div>
        ))}

        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, delay: 0.35 }}
          type="button"
          onClick={handleLogout}
          className="w-full btn btn-danger py-3 inline-flex items-center justify-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </motion.button>
      </div>
    </Layout>
  );
}
