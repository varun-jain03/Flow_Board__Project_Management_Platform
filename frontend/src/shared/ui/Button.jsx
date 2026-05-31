const variants = {
  primary:
    "bg-brand-600 text-white hover:bg-brand-500 shadow-lg shadow-brand-600/25",
  secondary:
    "bg-surface-overlay text-slate-200 hover:bg-border border border-border",
  danger: "bg-rose-600/90 text-white hover:bg-rose-500",
  ghost: "text-slate-300 hover:bg-surface-overlay hover:text-white",
};

const sizes = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-5 py-2.5 text-base",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  loading = false,
  disabled,
  ...props
}) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
      )}
      {children}
    </button>
  );
}
