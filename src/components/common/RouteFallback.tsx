export default function RouteFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6" role="status" aria-live="polite">
      <div className="rounded-3xl border border-white/70 bg-white/80 backdrop-blur-2xl p-8 shadow-[0_32px_80px_-56px_rgba(15,23,42,0.55)] text-center">
        <div className="text-xs uppercase tracking-[0.2em] text-gray-500">Loading</div>
        <div className="mt-2 text-lg font-semibold text-gray-900 font-display">Preparing your workspace...</div>
        <div className="mt-4 h-1.5 w-56 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full w-1/2 bg-gradient-to-r from-primary-500 to-primary-700 animate-[shimmer_1.5s_linear_infinite] bg-[length:200%_100%]" />
        </div>
      </div>
    </div>
  );
}
