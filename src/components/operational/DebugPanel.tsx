import { useOperationalInspector } from '../../contexts/OperationalInspectorContext';
import { useLocation } from 'react-router-dom';

export default function DebugPanel() {
  const { isOpen, currentStage } = useOperationalInspector();
  const location = useLocation();

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-20 left-6 z-50 bg-black/90 text-green-400 font-mono text-xs p-4 rounded border border-green-500/50 max-w-md">
      <div className="font-bold mb-2">DEBUG: Demo System State</div>
      <div>isOpen: {String(isOpen)}</div>
      <div>location.pathname: {location.pathname}</div>
      <div>currentStage: {currentStage || 'NONE'}</div>
    </div>
  );
}
