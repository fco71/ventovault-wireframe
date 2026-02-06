import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function HeroBrandStatement() {
  const { currentUser } = useAuth();
  const firstName = currentUser?.displayName?.split(' ')[0] || 'there';

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="flex items-center justify-between"
    >
      <div>
        <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">
          {getGreeting()}
        </p>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mt-1 font-display">
          {firstName}
        </h1>
      </div>
      <div className="text-right">
        <p className="text-xs font-semibold text-gray-400 tracking-wide font-display">VentoVault</p>
        <p className="text-[10px] text-gray-300 uppercase tracking-widest">Global Wallet</p>
      </div>
    </motion.div>
  );
}
