export default function Spinner({ label = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-slate-400">
      <span className="h-10 w-10 animate-spin rounded-full border-2 border-brand-500/30 border-t-brand-500" />
      <span className="text-sm">{label}</span>
    </div>
  );
}
