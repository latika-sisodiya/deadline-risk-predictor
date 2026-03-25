type Props = {
  title: string;
  items: string[];
  variant?: "recovery" | "daily";
};

const stepColors = [
  { num: "text-sky-400", bg: "bg-sky-400/10", border: "border-sky-400/20" },
  {
    num: "text-violet-400",
    bg: "bg-violet-400/10",
    border: "border-violet-400/20",
  },
  { num: "text-pink-400", bg: "bg-pink-400/10", border: "border-pink-400/20" },
];

export default function RecoveryPlanCard({
  title,
  items,
  variant = "recovery",
}: Props) {
  const icon = variant === "recovery" ? "🛠" : "📅";
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 animate-slide-up-3">
      <div className="mb-5 flex items-center gap-2">
        <span className="text-base">{icon}</span>
        <h3 className="text-sm font-semibold text-white">{title}</h3>
      </div>
      <div className="flex flex-col gap-3">
        {items.map((item, index) => {
          const c = stepColors[index % stepColors.length];
          return (
            <div
              key={index}
              className="flex items-start gap-3 rounded-xl border border-white/6 bg-white/[0.025] p-3.5"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <div
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[11px] font-bold ${c.num} ${c.bg} ${c.border}`}
              >
                {index + 1}
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">{item}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
