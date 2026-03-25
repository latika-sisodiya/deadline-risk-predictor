"use client";

type Props = {
  risk: "low" | "medium" | "high";
};

const riskConfig = {
  low: {
    label: "Low Risk",
    color: "#34d399",
    glow: "0 0 40px rgba(52,211,153,0.2)",
    bg: "rgba(52,211,153,0.06)",
    border: "rgba(52,211,153,0.2)",
    icon: "✓",
  },
  medium: {
    label: "Medium Risk",
    color: "#fbbf24",
    glow: "0 0 40px rgba(251,191,36,0.2)",
    bg: "rgba(251,191,36,0.06)",
    border: "rgba(251,191,36,0.2)",
    icon: "⚡",
  },
  high: {
    label: "High Risk",
    color: "#f87171",
    glow: "0 0 40px rgba(248,113,113,0.2)",
    bg: "rgba(248,113,113,0.06)",
    border: "rgba(248,113,113,0.2)",
    icon: "!",
  },
};

export default function RiskGauge({ risk }: Props) {
  const config = riskConfig[risk];
  const riskPercent = { low: 25, medium: 60, high: 90 };
  const percent = riskPercent[risk];

  const size = 160;
  const cx = size / 2;
  const cy = size / 2;
  const r = 62;
  const circumference = 2 * Math.PI * r;
  // Arc covers 270 degrees (from 135° to 405°), leaving a 90° gap at the bottom
  const arcLength = (circumference * 270) / 360;
  const dashOffset = arcLength - (arcLength * percent) / 100;

  const rotation = 135;

  return (
    <div
      className="rounded-2xl border p-6 animate-slide-up"
      style={{
        background: config.bg,
        borderColor: config.border,
        boxShadow: risk === "high" ? config.glow : undefined,
      }}
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-medium text-slate-400">Risk Meter</h3>
        <span
          className="rounded-full px-3 py-0.5 text-xs font-semibold"
          style={{
            background: config.bg,
            color: config.color,
            border: `1px solid ${config.border}`,
          }}
        >
          {config.label}
        </span>
      </div>

      <div className="flex items-center justify-center">
        <div className="relative" style={{ width: size, height: size }}>
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            {/* Track */}
            <circle
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth={10}
              strokeDasharray={`${arcLength} ${circumference}`}
              strokeDashoffset={0}
              strokeLinecap="round"
              transform={`rotate(${rotation} ${cx} ${cy})`}
            />
            <circle
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke={config.color}
              strokeWidth={10}
              strokeDasharray={`${arcLength} ${circumference}`}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              transform={`rotate(${rotation} ${cx} ${cy})`}
              className="animate-gauge"
              style={{
                transition: "stroke-dashoffset 1.2s cubic-bezier(0.16,1,0.3,1)",
              }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center animate-count">
            <span
              className="text-3xl font-bold text-white"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              {percent}%
            </span>
            <span className="text-[11px] text-slate-500 mt-0.5">
              AI confidence
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
