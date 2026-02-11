import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Send, Download } from 'lucide-react';

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
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
    >
      <div>
        <h1 className="text-[1.35rem] md:text-[1.6rem] font-bold text-gray-950 font-display tracking-tight leading-tight">
          {getGreeting()}, {firstName}
        </h1>
        <p className="text-[13px] text-gray-500 mt-1">
          What would you like to do today?
        </p>
      </div>

      <div className="flex flex-wrap gap-2.5">
        <motion.button
          onClick={() => navigate('/send')}
          className="btn btn-primary px-5 py-2.5 text-[13px] inline-flex items-center gap-2"
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.97 }}
        >
          <Send className="w-4 h-4" />
          Send Money
        </motion.button>
        <motion.button
          onClick={() => navigate('/receive')}
          className="btn btn-secondary px-4 py-2.5 text-[13px] inline-flex items-center gap-2"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.97 }}
        >
          <Download className="w-4 h-4" />
          Request
        </motion.button>
      </div>
    </motion.div>
  );
}
