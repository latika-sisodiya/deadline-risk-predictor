"use client";

import { useState } from "react";
import { AnalyzeResponse } from "@/lib/types";
import CountdownCard from "./CountdownCard";
import RecoveryPlanCard from "./RecoveryPlanCard";
import RiskGauge from "./RiskGauge";
import StatCard from "./StatCard";
import ProgressTimeBar from "./ProgressTimeBar";

type Props = {
  result: AnalyzeResponse;
  deadline: string;
  progress: number;
  hoursLeft: number;
};

export default function ResultPanel({
  result,
  deadline,
  progress,
  hoursLeft,
}: Props) {
  const [copied, setCopied] = useState(false);

  const copyRecoveryPlan = async () => {
    const text = [
      `📋 Deadline Risk Analysis`,
      `Risk: ${result.risk.toUpperCase()} — ${result.urgencyLabel}`,
      `Reason: ${result.reason}`,
      ``,
      `🛠 Recovery Plan:`,
      ...result.recoveryPlan.map((r, i) => `${i + 1}. ${r}`),
      ``,
      `📅 Daily Plan:`,
      ...result.dailyPlan.map((d, i) => `${i + 1}. ${d}`),
    ].join("\n");
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid gap-5">
      <div className="grid gap-5 lg:grid-cols-2">
        <RiskGauge risk={result.risk} />
        <CountdownCard deadline={deadline} />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <StatCard
          label="Risk level"
          value={result.risk.toUpperCase()}
          icon={
            result.risk === "high"
              ? "🔴"
              : result.risk === "medium"
                ? "🟡"
                : "🟢"
          }
          accent={result.risk}
        />
        <StatCard
          label="Urgency"
          value={result.urgencyLabel}
          icon="⏱"
          accent={result.risk}
          delay="40ms"
        />
        <StatCard
          label="Key reason"
          value={result.reason}
          icon="💡"
          accent="neutral"
          delay="80ms"
        />
      </div>

      <ProgressTimeBar
        progress={progress}
        deadline={deadline}
        hoursLeft={hoursLeft}
      />

      <div className="grid gap-5 lg:grid-cols-2">
        <RecoveryPlanCard
          title="Recovery plan"
          items={result.recoveryPlan}
          variant="recovery"
        />
        <RecoveryPlanCard
          title="Daily plan"
          items={result.dailyPlan}
          variant="daily"
        />
      </div>

      <button
        onClick={copyRecoveryPlan}
        className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-3 text-sm text-slate-400 hover:bg-white/8 hover:text-slate-300 hover:border-white/20 transition-all duration-150 animate-slide-up-4"
      >
        {copied ? (
          <>
            <span className="text-emerald-400">✓</span>
            <span className="text-emerald-400">Copied to clipboard</span>
          </>
        ) : (
          <>
            <span>📋</span>
            Copy recovery plan
          </>
        )}
      </button>
    </div>
  );
}
