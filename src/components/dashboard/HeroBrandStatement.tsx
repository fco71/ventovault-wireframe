import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Send, Download, Lock } from 'lucide-react';

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Glass container with gradient accents — hi-tech but not a dark banner */}
      <div className="relative isolate overflow-hidden rounded-2xl border border-white/60 bg-white/55 backdrop-blur-xl p-8 md:p-10 shadow-[0_20px_50px_-30px_rgba(15,23,42,0.25)]">
        {/* Gradient accent — top-left glow */}
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-gradient-to-br from-primary-400/20 via-primary-300/10 to-transparent rounded-full blur-[60px] pointer-events-none" />
        {/* Gradient accent — bottom-right, warm */}
        <div className="absolute -bottom-16 -right-16 w-56 h-56 bg-gradient-to-tl from-accent-400/12 to-transparent rounded-full blur-[50px] pointer-events-none" />
        {/* Subtle inner shine */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10">
          {/* Greeting */}
          <p className="text-[13px] text-gray-400 font-medium mb-5">
            {getGreeting()}, {firstName}
          </p>

          {/* Brand headline */}
          <h1 className="text-[1.75rem] md:text-[2.25rem] font-bold text-gray-950 font-display tracking-tight leading-[1.15] mb-2 max-w-lg">
            Move money at the{' '}
            <span className="text-gradient">speed of trust</span>.
          </h1>

          <p className="text-[13px] text-gray-500 max-w-sm mb-7 leading-relaxed">
            Transparent fees, real-time rates, delivery in minutes.
          </p>

          {/* Actions + status row */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="flex gap-3">
              <motion.button
                onClick={() => navigate('/send')}
                className="flex items-center justify-center gap-2.5 bg-gray-950 text-white px-6 py-3 rounded-xl font-semibold text-[13px] transition-all duration-200 hover:bg-gray-800 shadow-[0_8px_24px_-6px_rgba(15,23,42,0.35)]"
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.97 }}
              >
                <Send className="w-4 h-4" />
                Send Money
              </motion.button>
              <motion.button
                onClick={() => navigate('/receive')}
                className="flex items-center justify-center gap-2.5 bg-white/80 text-gray-700 px-5 py-3 rounded-xl font-medium text-[13px] transition-all duration-200 border border-gray-200/80 hover:border-gray-300 hover:bg-white shadow-sm"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.97 }}
              >
                <Download className="w-4 h-4" />
                Request
              </motion.button>
            </div>

            {/* Status indicators */}
            <div className="flex items-center gap-5 text-[12px] text-gray-400 sm:ml-1">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                <span>3 recent</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
                <span>1 pending</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-300">
                <Lock className="w-3 h-3" />
                <span>Balance — Phase 2</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
