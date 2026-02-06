import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Send, Download, Lock, Timer, Network, ShieldCheck } from 'lucide-react';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function HeroBrandStatement() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const firstName = currentUser?.displayName?.split(' ')[0] || 'there';
  const systemSignals = [
    { label: 'Median delivery', value: '2m 14s', icon: Timer },
    { label: 'Active corridors', value: '120+', icon: Network },
    { label: 'Trust checks', value: 'Realtime', icon: ShieldCheck },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="vv-hero">
        <div className="flex flex-wrap items-center gap-2.5 mb-6">
          <span className="vv-chip vv-chip-hot">Realtime orchestration</span>
          <span className="vv-chip vv-chip-accent">Quote confidence mode</span>
        </div>

        <p className="text-[13px] text-gray-500 font-medium mb-4">
          {getGreeting()}, {firstName}
        </p>

        <h1 className="text-[1.8rem] md:text-[2.45rem] font-bold text-gray-950 font-display tracking-tight leading-[1.1] mb-3 max-w-2xl">
          Welcome to your global money command center.
        </h1>

        <p className="text-[14px] text-gray-600 max-w-2xl mb-7 leading-relaxed">
          VentoVault blends live rails, trust scoring, and deterministic transfer states so every payment feels instant, intelligible, and under control.
        </p>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-3">
            <motion.button
              onClick={() => navigate('/send')}
              className="btn btn-primary px-6 py-3 text-[13px] inline-flex items-center gap-2"
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.97 }}
            >
              <Send className="w-4 h-4" />
              Launch Transfer
            </motion.button>
            <motion.button
              onClick={() => navigate('/receive')}
              className="btn btn-secondary px-5 py-3 text-[13px] inline-flex items-center gap-2"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.97 }}
            >
              <Download className="w-4 h-4" />
              Request Funds
            </motion.button>
          </div>
          <div className="flex items-center gap-2.5 text-[12px] text-gray-500">
            <Lock className="w-3.5 h-3.5 text-gray-400" />
            <span>Deterministic states active</span>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {systemSignals.map((signal) => (
            <div key={signal.label} className="vv-signal-card">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] uppercase tracking-[0.14em] text-gray-500">{signal.label}</span>
                <signal.icon className="w-3.5 h-3.5 text-primary-600" />
              </div>
              <div className="text-[17px] font-semibold font-display text-gray-900">{signal.value}</div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
