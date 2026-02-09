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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="vv-hero">
        <p className="text-[13px] text-gray-500 font-medium mb-3">
          {getGreeting()}, {firstName}
        </p>

        <h1 className="text-[1.55rem] md:text-[2rem] font-bold text-gray-950 font-display tracking-tight leading-[1.1] mb-2 max-w-2xl">
          Move money globally with total clarity.
        </h1>

        <p className="text-[13px] text-gray-500 max-w-md mb-5 leading-relaxed">
          Send or request in seconds, with exact totals and delivery amounts before you confirm.
        </p>

        <div className="flex flex-wrap gap-3">
          <motion.button
            onClick={() => navigate('/send')}
            className="btn btn-primary px-6 py-3 text-[13px] inline-flex items-center gap-2"
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.97 }}
          >
            <Send className="w-4 h-4" />
            Send Money
          </motion.button>
          <motion.button
            onClick={() => navigate('/receive')}
            className="btn btn-secondary px-5 py-3 text-[13px] inline-flex items-center gap-2"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.97 }}
          >
            <Download className="w-4 h-4" />
            Request
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
