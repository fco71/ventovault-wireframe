import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import AnimatedCounter from '../common/AnimatedCounter';
import { Send, Download, Sparkles, TrendingUp } from 'lucide-react';

export default function HeroBalanceCard() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.8, ease: 'easeOut' }}
      className="relative mb-16"
    >
      {/* Background Layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-purple-600 to-primary-800 rounded-[2rem] transform -rotate-1" />
      <div className="absolute inset-0 bg-gradient-mesh opacity-30 rounded-[2rem]" />

      {/* Main Card */}
      <div className="relative bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[2rem] p-8 md:p-12 lg:p-16 shadow-2xl min-h-[60vh] flex flex-col justify-center">

        {/* Floating Icon */}
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-8 right-8 md:top-12 md:right-12"
        >
          <div className="w-20 h-20 md:w-24 md:h-24 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center shadow-xl">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center text-4xl md:text-5xl shadow-lg">
              💰
            </div>
          </div>
        </motion.div>

        {/* Balance Section */}
        <div className="text-white max-w-3xl">
          {/* Label */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex items-center gap-2 mb-4"
          >
            <Sparkles className="w-5 h-5 text-white/80" />
            <span className="text-white/80 text-lg md:text-xl font-medium">Available Balance</span>
          </motion.div>

          {/* Massive Balance Number */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="mb-6"
          >
            <div className="text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight mb-4">
              $<AnimatedCounter
                value={currentUser?.balance || 0}
                decimals={2}
                duration={2500}
                className="text-white"
              />
            </div>

            {/* Growth Indicator */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 2 }}
              className="flex items-center gap-2 text-green-300"
            >
              <TrendingUp className="w-5 h-5" />
              <span className="text-lg font-semibold">+$150.00 from last month</span>
            </motion.div>
          </motion.div>

          {/* Primary Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.2 }}
            className="grid grid-cols-2 gap-4 max-w-md"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/send')}
              className="bg-white text-primary-700 py-5 rounded-2xl font-bold text-lg hover:shadow-2xl transition-all flex items-center justify-center gap-3 group"
            >
              <Send className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              Send Money
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/receive')}
              className="bg-white/20 backdrop-blur-sm text-white py-5 rounded-2xl font-bold text-lg hover:bg-white/30 transition-all flex items-center justify-center gap-3 group border border-white/20"
            >
              <Download className="w-6 h-6 group-hover:translate-y-1 transition-transform" />
              Receive
            </motion.button>
          </motion.div>
        </div>

        {/* Subtle Pattern Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-[2rem] pointer-events-none" />
      </div>
    </motion.div>
  );
}
