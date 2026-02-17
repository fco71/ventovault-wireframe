import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, 
  CheckCircle, 
  ShieldAlert, 
  FileText, 
  Server, 
  Activity,
  X 
} from 'lucide-react';
import { IntelPacket } from '../../logic/operationalRules';
import { useOperationalInspector } from '../../contexts/OperationalInspectorContext';

interface Props {
  intel: IntelPacket | null;
  isOpen: boolean;
}

export const OpsInspectorPanel: React.FC<Props> = ({ intel, isOpen }) => {
  const { close } = useOperationalInspector();

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ x: 340, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 340, opacity: 0 }}
      transition={{ type: 'spring', damping: 28, stiffness: 300 }}
      className="fixed right-6 top-24 bottom-6 w-80 bg-slate-900/95 backdrop-blur-2xl border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden z-[90] flex flex-col font-sans"
    >
      {/* Header */}
      <div className="bg-slate-950/50 p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </div>
          <span className="text-xs font-bold tracking-widest text-slate-400 uppercase">Ops Inspector</span>
        </div>
        
        {/* Close Button */}
        <button 
          onClick={close}
          className="text-slate-500 hover:text-white transition-colors p-1 rounded-md hover:bg-slate-800"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        <AnimatePresence mode="wait">
          {intel ? (
            <motion.div
              key={intel.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {/* Main Card */}
              <div className={`p-4 rounded-xl border shadow-lg ${
                intel.severity === 'critical' ? 'bg-red-950/20 border-red-500/30' :
                intel.severity === 'warning' ? 'bg-amber-950/20 border-amber-500/30' :
                'bg-slate-800/40 border-slate-700/60'
              }`}>
                <div className="flex items-start gap-3 mb-2">
                  {intel.severity === 'critical' ? <ShieldAlert className="w-5 h-5 text-red-400 shrink-0" /> :
                   intel.severity === 'warning' ? <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" /> :
                   <Activity className="w-5 h-5 text-blue-400 shrink-0" />}
                  <h3 className={`font-semibold text-sm ${
                    intel.severity === 'critical' ? 'text-red-200' :
                    intel.severity === 'warning' ? 'text-amber-200' :
                    'text-slate-200'
                  }`}>{intel.title}</h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed ml-8">{intel.description}</p>
              </div>

              {/* Substantiation Checks */}
              <div className="bg-slate-950/30 rounded-xl p-3 border border-slate-800/60">
                <h4 className="text-[10px] uppercase tracking-wider text-slate-500 mb-3 font-bold flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Compliance Checks
                </h4>
                <div className="space-y-2">
                  {intel.checks.map((check, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs group">
                      <div className="flex items-center gap-2 text-slate-300">
                        {check.status === 'pass' && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
                        {check.status === 'warn' && <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />}
                        {check.status === 'fail' && <div className="w-1.5 h-1.5 rounded-full bg-red-500" />}
                        {check.status === 'info' && <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
                        <span className="group-hover:text-white transition-colors">{check.label}</span>
                      </div>
                      <span className={`font-mono text-[10px] ${
                        check.status === 'pass' ? 'text-emerald-500/70' :
                        check.status === 'fail' ? 'text-red-400' :
                        'text-slate-500'
                      }`}>{check.detail}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Backend Process Trace */}
              <div className="bg-black/20 rounded-lg p-3 border border-slate-800/50">
                <div className="flex items-center gap-2 text-[10px] text-slate-500 mb-1.5">
                  <Server className="w-3 h-3" />
                  <span>SYSTEM PROCESS TRACE</span>
                </div>
                <code className="text-[10px] text-purple-300 font-mono block break-words bg-purple-900/10 p-2 rounded border border-purple-500/10">
                  {intel.backendProcess}
                </code>
              </div>

              {/* Manual Reference */}
              <div className="bg-slate-800/30 rounded-lg p-3 border border-slate-700/30 flex gap-3">
                 <FileText className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                 <div>
                   <span className="block text-[10px] text-slate-500 uppercase tracking-wide mb-0.5">Substantiation Source</span>
                   <p className="text-xs text-slate-300 italic">"{intel.manualRef}"</p>
                 </div>
              </div>

            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-slate-600/50">
              <div className="w-16 h-16 rounded-full bg-slate-800/30 flex items-center justify-center mb-4 border border-slate-800">
                <Activity className="w-8 h-8" />
              </div>
              <p className="text-xs font-medium text-slate-500">System Idle</p>
              <p className="text-[10px] text-slate-600 mt-1">Awaiting Transaction Input</p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/30 text-center">
        <p className="text-[9px] text-slate-600 uppercase tracking-wider">
          Simulated Environment • VentoVault Ops
        </p>
      </div>
    </motion.div>
  );
};