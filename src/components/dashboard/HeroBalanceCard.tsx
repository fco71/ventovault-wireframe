import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import AnimatedCounter from '../common/AnimatedCounter';
import { Send, Download, TrendingUp } from 'lucide-react';

export default function HeroBalanceCard() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="floating"
    >
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8 md:p-10 shadow-[0_25px_60px_-45px_rgba(15,23,42,0.8)]">
        {/* Enhanced gradient accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary-500/30 via-accent-500/20 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none animate-pulse" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-purple-500/20 to-transparent rounded-full blur-2xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />

        <div className="relative z-10">
          {/* Balance label with icon */}
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-primary-400 to-accent-400 rounded-full flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <p className="text-sm font-medium text-gray-300 tracking-wide uppercase">
              Available Balance
            </p>
          </div>

          {/* Enhanced balance amount */}
          <div className="relative mb-6">
            <div className="text-6xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-100 to-gray-300 mt-2 mb-1 tracking-tight font-display">
              $<AnimatedCounter
                value={currentUser?.balance || 0}
                decimals={2}
                duration={1200}
                className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-100 to-gray-300"
              />
            </div>
            
            {/* Glow effect behind balance */}
            <div className="absolute inset-0 blur-3xl bg-gradient-to-r from-primary-500/20 to-accent-500/20 -z-10" />
          </div>

          {/* Enhanced growth indicator */}
          <div className="flex items-center gap-2 mb-8">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <p className="text-sm text-emerald-400 font-medium">
              +$150.00 from last month
            </p>
            <span className="text-xs text-gray-400">+12%</span>
          </div>

          {/* Enhanced action buttons */}
          <div className="flex gap-4">
            <motion.button
              onClick={() => navigate('/send')}
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-4 rounded-2xl font-semibold text-sm hover:from-primary-600 hover:to-primary-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 btn-enhanced"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Send className="w-5 h-5" />
              Send Money
            </motion.button>
            <motion.button
              onClick={() => navigate('/receive')}
              className="flex-1 flex items-center justify-center gap-2 bg-white/10 text-white px-6 py-4 rounded-2xl font-semibold text-sm hover:bg-white/15 transition-all duration-300 border border-white/20 hover:border-white/30 backdrop-blur-sm"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Download className="w-5 h-5" />
              Receive
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
