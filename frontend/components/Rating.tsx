type RatingProps = {
  value: number;
  count?: number;
  size?: "sm" | "md";
};

export default function Rating({ value, count, size = "md" }: RatingProps) {
  const stars = Array.from({ length: 5 }, (_, i) => i + 1);
  const text = size === "sm" ? "text-xs" : "text-sm";
  return (
    <div className={`flex items-center gap-1.5 ${text}`}>
      <div className="flex items-center gap-0.5 text-primary" aria-label={`${value} out of 5 stars`}>
        {stars.map((s) => (
          <svg
            key={s}
            viewBox="0 0 20 20"
            className={size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4"}
            fill={s <= Math.round(value) ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <path d="M10 1.8l2.47 4.84 5.35.78-3.87 3.77.91 5.33L10 14.9l-4.86 2.62.91-5.33L2.18 7.42l5.35-.78L10 1.8z" />
          </svg>
        ))}
      </div>
      <span className="font-medium text-foreground">{value.toFixed(1)}</span>
      {typeof count === "number" && <span className="text-muted">({count})</span>}
    </div>
  );
}