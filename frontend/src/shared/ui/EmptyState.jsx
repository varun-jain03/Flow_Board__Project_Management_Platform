export default function EmptyState({
  icon = "📭",
  title,
  description,
  action,
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-surface-raised/50 px-6 py-16 text-center">
      <span className="mb-3 text-4xl">{icon}</span>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      {description && (
        <p className="mt-2 max-w-sm text-sm text-slate-400">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
