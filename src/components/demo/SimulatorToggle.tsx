import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings2, X } from 'lucide-react';
import { useOperationalInspector } from '../../contexts/OperationalInspectorContext';

export const SimulatorToggle: React.FC = () => {
  const { isOpen, toggle } = useOperationalInspector();

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-2 font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="bg-slate-900 text-slate-300 text-xs py-2 px-3 rounded-lg shadow-xl border border-slate-700 mb-2 max-w-[200px] text-right"
          >
            <strong className="text-emerald-400 block mb-0.5">Simulator Active</strong>
            Interact with the form to see real-time compliance logic.
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={toggle}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`flex items-center gap-2 px-4 py-3 rounded-full shadow-2xl transition-all duration-300 backdrop-blur-md border ${
          isOpen
            ? 'bg-slate-900/90 text-white border-emerald-500/50 hover:border-emerald-400'
            : 'bg-white/90 text-slate-700 border-slate-200 hover:border-emerald-500/30'
        }`}
      >
        <div className={`relative flex h-3 w-3 ${isOpen ? 'block' : 'hidden'}`}>
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
        </div>

        {!isOpen && <Settings2 className="w-4 h-4 text-slate-500" />}
        
        <span className="text-xs font-bold tracking-wide uppercase">
          {isOpen ? 'Hide Inspector' : 'Enable Simulator'}
        </span>

        {isOpen && <X className="w-4 h-4 text-slate-400 ml-1 hover:text-white" />}
      </motion.button>
    </div>
  );
};