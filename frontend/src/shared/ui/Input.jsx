export default function Input({ label, error, className = "", ...props }) {
  return (
    <label className="block space-y-1.5">
      {label && (
        <span className="text-sm font-medium text-slate-300">{label}</span>
      )}
      <input
        className={`w-full rounded-lg border border-border bg-surface-raised px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 transition focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 ${error ? "border-rose-500" : ""} ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-rose-400">{error}</span>}
    </label>
  );
}
