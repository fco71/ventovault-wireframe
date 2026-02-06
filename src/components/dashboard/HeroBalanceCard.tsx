import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import AnimatedCounter from '../common/AnimatedCounter';
import { Send, Download, ArrowUpRight, Plus } from 'lucide-react';

const quickSendPeople = [
  { initials: 'MR', name: 'Maria', color: 'from-primary-400 to-primary-600' },
  { initials: 'CM', name: 'Carlos', color: 'from-violet-400 to-violet-600' },
  { initials: 'AG', name: 'Ana', color: 'from-amber-400 to-amber-600' },
  { initials: 'LM', name: 'Luis', color: 'from-emerald-400 to-emerald-600' },
];

export default function HeroBalanceCard() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 p-10 md:p-14 shadow-[0_40px_80px_-30px_rgba(15,23,42,0.7)]">
        {/* Subtle accent glow — top right */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-primary-500/20 via-primary-400/10 to-transparent rounded-full blur-[80px] -translate-y-1/3 translate-x-1/4 pointer-events-none" />
        {/* Secondary glow — bottom left */}
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-primary-600/15 to-transparent rounded-full blur-[60px] translate-y-1/3 -translate-x-1/4 pointer-events-none" />

        {/* Minimal grid texture */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />

        <div className="relative z-10">
          {/* Tagline — tiny, aspirational */}
          <p className="text-[11px] font-medium text-gray-500 uppercase tracking-[0.3em] mb-8">
            Move money at the speed of trust
          </p>

          {/* THE number — dominant, unmissable */}
          <div className="relative mb-2">
            <div className="text-[4.5rem] md:text-[6.5rem] lg:text-[7.5rem] font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-gray-400 tracking-tighter font-display leading-none">
              $<AnimatedCounter
                value={currentUser?.balance || 0}
                decimals={2}
                duration={1200}
                className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-gray-400"
              />
            </div>
            {/* Glow behind the number */}
            <div className="absolute inset-0 blur-[60px] bg-gradient-to-r from-primary-500/15 to-primary-400/10 -z-10" />
          </div>

          {/* Growth indicator — compact, inline */}
          <div className="flex items-center gap-2 mb-10">
            <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-400/20 rounded-full px-3 py-1.5">
              <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-xs font-semibold text-emerald-400">+$150</span>
            </div>
            <span className="text-xs text-gray-600">from last month</span>
          </div>

          {/* Actions row: CTAs + Quick Send people */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            {/* CTAs */}
            <div className="flex gap-3">
              <motion.button
                onClick={() => navigate('/send')}
                className="flex items-center justify-center gap-2.5 bg-white text-gray-950 px-8 py-4 rounded-2xl font-semibold text-sm transition-all duration-300 shadow-[0_0_40px_-8px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_-8px_rgba(255,255,255,0.5)] btn-enhanced"
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                <Send className="w-4 h-4" />
                Send Money
              </motion.button>
              <motion.button
                onClick={() => navigate('/receive')}
                className="flex items-center justify-center gap-2.5 bg-white/[0.06] text-gray-400 hover:text-white px-7 py-4 rounded-2xl font-medium text-sm transition-all duration-300 border border-white/[0.08] hover:border-white/20 hover:bg-white/[0.1]"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                <Download className="w-4 h-4" />
                Receive
              </motion.button>
            </div>

            {/* Quick Send — favorite people avatars */}
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-gray-600 uppercase tracking-wider mr-2 hidden sm:inline">Quick</span>
              {quickSendPeople.map((person, i) => (
                <motion.button
                  key={person.initials}
                  onClick={() => navigate('/send')}
                  className={`w-10 h-10 bg-gradient-to-br ${person.color} rounded-xl flex items-center justify-center text-[10px] font-bold text-white border-2 border-white/[0.06] hover:border-white/20 transition-all`}
                  whileHover={{ scale: 1.1, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.06 }}
                  title={`Send to ${person.name}`}
                >
                  {person.initials}
                </motion.button>
              ))}
              <motion.button
                onClick={() => navigate('/connections')}
                className="w-10 h-10 rounded-xl border border-dashed border-white/[0.12] flex items-center justify-center text-gray-600 hover:text-white hover:border-white/30 transition-all"
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.74 }}
              >
                <Plus className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
