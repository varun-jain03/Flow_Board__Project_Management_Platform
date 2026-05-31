export default function Select({
  label,
  options = [],
  error,
  className = "",
  ...props
}) {
  return (
    <label className="block space-y-1.5">
      {label && (
        <span className="text-sm font-medium text-slate-300">{label}</span>
      )}
      <select
        className={`w-full rounded-lg border border-border bg-surface-raised px-3 py-2.5 text-sm text-slate-100 transition focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="text-xs text-rose-400">{error}</span>}
    </label>
  );
}
