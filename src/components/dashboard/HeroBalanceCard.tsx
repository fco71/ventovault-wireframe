import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import AnimatedCounter from '../common/AnimatedCounter';
import { Send, Download } from 'lucide-react';

export default function HeroBalanceCard() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="relative overflow-hidden rounded-2xl bg-gray-900 p-8 md:p-10">
        {/* Single subtle gradient accent */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />

        <div className="relative z-10">
          {/* Balance label */}
          <p className="text-sm font-medium text-gray-400 tracking-wide">
            Available Balance
          </p>

          {/* Balance amount */}
          <div className="text-5xl md:text-6xl font-bold text-white mt-2 mb-1 tracking-tight font-display">
            $<AnimatedCounter
              value={currentUser?.balance || 0}
              decimals={2}
              duration={1200}
              className="text-white"
            />
          </div>

          {/* Growth indicator */}
          <p className="text-sm text-emerald-400 font-medium mt-1">
            +$150.00 from last month
          </p>

          {/* Action buttons */}
          <div className="flex gap-3 mt-8">
            <button
              onClick={() => navigate('/send')}
              className="flex items-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-xl font-semibold text-sm hover:bg-gray-100 transition-colors"
            >
              <Send className="w-4 h-4" />
              Send Money
            </button>
            <button
              onClick={() => navigate('/receive')}
              className="flex items-center gap-2 bg-white/10 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-white/15 transition-colors border border-white/10"
            >
              <Download className="w-4 h-4" />
              Receive
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
