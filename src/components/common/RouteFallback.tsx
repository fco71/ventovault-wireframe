export default function RouteFallback() {
  return (
    <div className="vv-world min-h-screen flex items-center justify-center px-6" role="status" aria-live="polite">
      <div className="vv-panel text-center max-w-md w-full">
        <div className="text-xs uppercase tracking-[0.2em] text-gray-500">Booting VentoVault</div>
        <div className="mt-2 text-lg font-semibold text-gray-900 font-display">Preparing your command center...</div>
        <div className="mt-4 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full w-1/2 bg-gradient-to-r from-primary-500 via-primary-600 to-accent-500 animate-[shimmer_1.5s_linear_infinite] bg-[length:200%_100%]" />
        </div>
        <div className="mt-3 text-[11px] uppercase tracking-[0.14em] text-gray-500">Syncing rails and quotes</div>
      </div>
      <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden="true">
        <div className="absolute top-[10%] left-[8%] w-72 h-72 bg-primary-300/16 blur-3xl" />
        <div className="absolute bottom-[8%] right-[12%] w-80 h-80 bg-accent-300/12 blur-3xl" />
      </div>
    </div>
  );
}
