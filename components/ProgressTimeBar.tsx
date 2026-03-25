type Props = {
  progress: number;
  deadline: string;
  hoursLeft: number;
};

export default function ProgressTimeBar({
  progress,
  deadline,
  hoursLeft,
}: Props) {
  const now = Date.now();
  const deadlineMs = new Date(deadline).getTime();
  const totalWindow = 7 * 24 * 60 * 60 * 1000; // assume 7-day window max for display
  const timeElapsed = Math.min(
    100,
    Math.max(0, ((totalWindow - (deadlineMs - now)) / totalWindow) * 100),
  );

  const isBehind = progress < timeElapsed;
  const gap = Math.abs(progress - timeElapsed);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 animate-slide-up-2">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-medium text-slate-400">
          Progress vs. time
        </h3>
        {isBehind && gap > 10 ? (
          <span className="text-[11px] text-rose-400 font-medium">
            Falling behind by ~{Math.round(gap)}%
          </span>
        ) : (
          <span className="text-[11px] text-emerald-400 font-medium">
            On track
          </span>
        )}
      </div>

      <div className="space-y-2.5">
        <div>
          <div className="mb-1 flex justify-between text-[11px] text-slate-500">
            <span>Work done</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
            <div
              className="h-full rounded-full bg-emerald-400 transition-all duration-1000"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div>
          <div className="mb-1 flex justify-between text-[11px] text-slate-500">
            <span>Time elapsed</span>
            <span>{Math.round(timeElapsed)}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${isBehind ? "bg-rose-400" : "bg-sky-400"}`}
              style={{ width: `${timeElapsed}%` }}
            />
          </div>
        </div>
      </div>

      <p className="mt-3 text-[11px] text-slate-600">
        {hoursLeft}h estimated work remaining until deadline
      </p>
    </div>
  );
}
