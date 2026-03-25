type Props = {
  label: string;
  value: string;
  icon?: string;
  accent?: "low" | "medium" | "high" | "neutral";
  delay?: string;
};

const accentConfig = {
  low: {
    color: "text-emerald-400",
    bg: "rgba(52,211,153,0.08)",
    border: "rgba(52,211,153,0.2)",
  },
  medium: {
    color: "text-amber-400",
    bg: "rgba(251,191,36,0.08)",
    border: "rgba(251,191,36,0.2)",
  },
  high: {
    color: "text-rose-400",
    bg: "rgba(248,113,113,0.08)",
    border: "rgba(248,113,113,0.2)",
  },
  neutral: {
    color: "text-slate-300",
    bg: "rgba(255,255,255,0.04)",
    border: "rgba(255,255,255,0.08)",
  },
};

export default function StatCard({
  label,
  value,
  icon,
  accent = "neutral",
  delay = "0ms",
}: Props) {
  const cfg = accentConfig[accent];
  return (
    <div
      className="rounded-xl border p-4 animate-slide-up-2"
      style={{
        background: cfg.bg,
        borderColor: cfg.border,
        animationDelay: delay,
      }}
    >
      <div className="flex items-start justify-between">
        <p className="text-xs font-medium text-slate-500">{label}</p>
        {icon && <span className="text-base">{icon}</span>}
      </div>
      <p className={`mt-2 text-base font-semibold leading-snug ${cfg.color}`}>
        {value}
      </p>
    </div>
  );
}
