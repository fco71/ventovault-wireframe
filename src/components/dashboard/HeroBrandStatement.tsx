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
      className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
    >
      <div className="space-y-3">
        <p className="text-[11px] font-semibold text-primary-700 uppercase tracking-[0.28em]">
          VentoVault
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-950 leading-tight font-display max-w-2xl">
          Move money at the speed of trust.
        </h1>
        <p className="text-sm md:text-base text-gray-600 max-w-2xl">
          {getGreeting()}, {firstName}. Your command center keeps high-signal transfer actions front and center.
        </p>
      </div>
      <div className="inline-flex items-center rounded-full bg-primary-50/90 border border-primary-200/60 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary-800">
        Signal First
      </div>
    </motion.div>
  );
}
