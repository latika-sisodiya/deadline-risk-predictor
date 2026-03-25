"use client";

import { useEffect, useState } from "react";

type Props = { deadline: string };

function getTimeLeft(deadline: string) {
  const diff = Math.max(0, new Date(deadline).getTime() - Date.now());
  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { days, hours, minutes, seconds, totalSeconds };
}

export default function CountdownCard({ deadline }: Props) {
  const [time, setTime] = useState(() => getTimeLeft(deadline));

  useEffect(() => {
    setTime(getTimeLeft(deadline));
    const interval = setInterval(() => setTime(getTimeLeft(deadline)), 1000);
    return () => clearInterval(interval);
  }, [deadline]);

  const isUrgent = time.days === 0 && time.hours < 12;
  const isCritical = time.days === 0 && time.hours < 4;
  const isExpired = time.totalSeconds === 0;

  const urgencyColor = isCritical
    ? "text-rose-400"
    : isUrgent
      ? "text-amber-400"
      : "text-emerald-400";

  const urgencyBorder = isCritical
    ? "rgba(248,113,113,0.2)"
    : isUrgent
      ? "rgba(251,191,36,0.2)"
      : "rgba(255,255,255,0.08)";

  const TimeBlock = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <span
        className={`text-2xl font-bold tabular-nums ${urgencyColor}`}
        style={{ fontFamily: "'DM Mono', monospace" }}
      >
        {String(value).padStart(2, "0")}
      </span>
      <span className="text-[10px] uppercase tracking-widest text-slate-600 mt-0.5">
        {label}
      </span>
    </div>
  );

  return (
    <div
      className="rounded-2xl border p-6 animate-slide-up-1"
      style={{
        background: "rgba(255,255,255,0.03)",
        borderColor: urgencyBorder,
      }}
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-medium text-slate-400">Time remaining</h3>
        {isCritical && !isExpired && (
          <span className="rounded-full bg-rose-500/10 border border-rose-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-rose-400">
            Critical
          </span>
        )}
        {isUrgent && !isCritical && (
          <span className="rounded-full bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-amber-400">
            Urgent
          </span>
        )}
      </div>

      {isExpired ? (
        <div className="flex h-16 items-center justify-center text-rose-400 font-semibold text-sm">
          Deadline has passed
        </div>
      ) : (
        <div className="flex items-center justify-around">
          <TimeBlock value={time.days} label="days" />
          <span className={`text-xl font-bold pb-3 ${urgencyColor}`}>:</span>
          <TimeBlock value={time.hours} label="hrs" />
          <span className={`text-xl font-bold pb-3 ${urgencyColor}`}>:</span>
          <TimeBlock value={time.minutes} label="min" />
          <span className={`text-xl font-bold pb-3 ${urgencyColor}`}>:</span>
          <TimeBlock value={time.seconds} label="sec" />
        </div>
      )}

      <div className="mt-4 text-[11px] text-slate-600 text-center">
        {new Date(deadline).toLocaleDateString("en-GB", {
          weekday: "short",
          day: "numeric",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </div>
    </div>
  );
}
