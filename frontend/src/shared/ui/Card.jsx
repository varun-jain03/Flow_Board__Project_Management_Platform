export default function Card({ children, className = "", onClick }) {
  const interactive = onClick
    ? "cursor-pointer hover:border-brand-500/40 hover:shadow-lg hover:shadow-brand-600/5"
    : "";

  return (
    <div
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") onClick(e);
            }
          : undefined
      }
      className={`rounded-xl border border-border bg-surface-raised p-5 transition ${interactive} ${className}`}
    >
      {children}
    </div>
  );
}
