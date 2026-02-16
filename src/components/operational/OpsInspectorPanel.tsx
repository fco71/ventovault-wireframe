import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  ShieldAlert, 
  FileText, 
  Server, 
  Activity 
} from 'lucide-react';
import { IntelPacket } from '../../logic/operationalRules';

interface Props {
  intel: IntelPacket | null;
  isOpen: boolean;
}

export const OpsInspectorPanel: React.FC<Props> = ({ intel, isOpen }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ x: 320, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 320, opacity: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed right-4 top-24 bottom-4 w-80 bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden z-50 flex flex-col font-sans"
    >
      {/* Header */}
      <div className="bg-slate-950/50 p-4 border-b border-slate-800 flex items-center gap-2">
        <div className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
        </div>
        <span className="text-xs font-bold tracking-widest text-slate-400 uppercase">Ops Inspector</span>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence mode="wait">
          {intel ? (
            <motion.div
              key={intel.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {/* Main Card */}
              <div className={`p-4 rounded-xl border ${
                intel.severity === 'critical' ? 'bg-red-950/30 border-red-500/30' :
                intel.severity === 'warning' ? 'bg-amber-950/30 border-amber-500/30' :
                'bg-slate-800/50 border-slate-700'
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
              <div className="bg-slate-950/30 rounded-xl p-3 border border-slate-800">
                <h4 className="text-[10px] uppercase tracking-wider text-slate-500 mb-3 font-bold">Compliance Checks</h4>
                <div className="space-y-2">
                  {intel.checks.map((check, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-slate-300">
                        {check.status === 'pass' && <CheckCircle className="w-3 h-3 text-emerald-500" />}
                        {check.status === 'warn' && <AlertTriangle className="w-3 h-3 text-amber-500" />}
                        {check.status === 'fail' && <ShieldAlert className="w-3 h-3 text-red-500" />}
                        {check.status === 'info' && <Info className="w-3 h-3 text-blue-500" />}
                        <span>{check.label}</span>
                      </div>
                      <span className="font-mono text-slate-500 text-[10px]">{check.detail}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Backend Process Trace */}
              <div className="bg-black/20 rounded-lg p-3 border border-slate-800/50">
                <div className="flex items-center gap-2 text-[10px] text-slate-500 mb-1">
                  <Server className="w-3 h-3" />
                  <span>SYSTEM PROCESS</span>
                </div>
                <code className="text-[10px] text-purple-300 font-mono block break-words">
                  {intel.backendProcess}
                </code>
              </div>

              {/* Manual Reference */}
              <div className="bg-slate-800/30 rounded-lg p-3 border border-slate-700/30">
                 <div className="flex items-center gap-2 text-[10px] text-slate-500 mb-1">
                  <FileText className="w-3 h-3" />
                  <span>SUBSTANTIATION</span>
                </div>
                <p className="text-xs text-slate-300 italic">"{intel.manualRef}"</p>
              </div>

            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-slate-600">
              <Activity className="w-8 h-8 mb-2 opacity-50" />
              <p className="text-xs">System Idle</p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="p-2 border-t border-slate-800 bg-slate-950/30 text-center">
        <p className="text-[9px] text-slate-600 uppercase">Simulated Compliance Environment</p>
      </div>
    </motion.div>
  );
};