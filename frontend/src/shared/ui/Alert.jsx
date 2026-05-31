export default function Alert({ type = "error", message, onClose }) {
  if (!message) return null;
  const styles = {
    error: "border-rose-500/40 bg-rose-500/10 text-rose-200",
    success: "border-emerald-500/40 bg-emerald-500/10 text-emerald-200",
    info: "border-brand-500/40 bg-brand-500/10 text-brand-200",
  };

  return (
    <div
      className={`flex items-start justify-between gap-3 rounded-lg border px-4 py-3 text-sm ${styles[type]}`}
      role="alert"
    >
      <span>{message}</span>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="opacity-70 hover:opacity-100"
        >
          ✕
        </button>
      )}
    </div>
  );
}
