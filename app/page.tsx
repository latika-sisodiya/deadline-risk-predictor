"use client";

import { useState, useEffect } from "react";
import InputPanel from "@/components/InputPanel";
import ResultPanel from "@/components/ResultPanel";
import { AnalyzeRequest, AnalyzeResponse, HistoryEntry } from "@/lib/types";

const initialForm: AnalyzeRequest = {
  title: "",
  deadline: "",
  progress: 30,
  difficulty: "medium",
  confidence: 5,
  hoursLeft: 12,
};

function SkeletonLoader() {
  return (
    <div className="grid gap-5 animate-pulse">
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-2xl bg-white/5 h-52" />
        <div className="rounded-2xl bg-white/5 h-52" />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl bg-white/5 h-20" />
        <div className="rounded-xl bg-white/5 h-20" />
        <div className="rounded-xl bg-white/5 h-20" />
      </div>
      <div className="rounded-2xl bg-white/5 h-24" />
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-2xl bg-white/5 h-52" />
        <div className="rounded-2xl bg-white/5 h-52" />
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex min-h-[500px] flex-col items-center justify-center text-center gap-4 px-6">
      <div className="text-5xl">🎓</div>
      <div>
        <p className="text-white font-semibold">No analysis yet</p>
        <p className="mt-1 text-sm text-slate-500 max-w-xs">
          Fill in your assignment details on the left and hit Analyse to get
          your AI risk prediction.
        </p>
      </div>
      <div className="mt-2 grid grid-cols-3 gap-3 text-[11px] text-slate-600 w-full max-w-sm">
        <div className="rounded-lg border border-white/6 bg-white/[0.02] p-3">
          <div className="text-lg mb-1">📊</div>
          Risk gauge
        </div>
        <div className="rounded-lg border border-white/6 bg-white/[0.02] p-3">
          <div className="text-lg mb-1">⏱</div>
          Live countdown
        </div>
        <div className="rounded-lg border border-white/6 bg-white/[0.02] p-3">
          <div className="text-lg mb-1">🛠</div>
          Recovery plan
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [form, setForm] = useState<AnalyzeRequest>(initialForm);
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("deadline-history");
      if (saved) setHistory(JSON.parse(saved));
    } catch {}
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    setResult(null);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to analyse");
      }

      const data = (await res.json()) as AnalyzeResponse;
      setResult(data);

      const entry: HistoryEntry = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        form,
        result: data,
      };
      const updated = [entry, ...history].slice(0, 5);
      setHistory(updated);
      try {
        localStorage.setItem("deadline-history", JSON.stringify(updated));
      } catch {}
    } catch (e: unknown) {
      clearTimeout(timeout);
      if (e instanceof Error && e.name === "AbortError") {
        setError("Request timed out. Gemini took too long — please try again.");
      } else {
        setError(
          e instanceof Error
            ? e.message
            : "Something went wrong. Please try again.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const loadFromHistory = (entry: HistoryEntry) => {
    setForm(entry.form);
    setResult(entry.result);
    setShowHistory(false);
  };

  const riskColors: Record<string, string> = {
    low: "text-emerald-400",
    medium: "text-amber-400",
    high: "text-rose-400",
  };

  return (
    <main className="relative z-10 min-h-screen px-4 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-sky-400 font-medium mb-3">
              Lancaster Student Journey
            </p>
            <h1
              className="text-4xl font-bold tracking-tight md:text-5xl"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Deadline Risk
              <span className="block text-slate-500 font-light">Predictor</span>
            </h1>
            <p className="mt-4 max-w-md text-sm text-slate-500 leading-relaxed">
              Powered by Groq AI — estimate your deadline risk and get a
              personalised recovery plan before it's too late.
            </p>
          </div>

          {history.length > 0 && (
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-400 hover:bg-white/8 hover:text-slate-300 transition-all"
            >
              <span>🕒</span>
              Recent ({history.length})
            </button>
          )}
        </div>

        {showHistory && history.length > 0 && (
          <div className="mb-6 rounded-2xl border border-white/10 bg-slate-950/80 p-4 backdrop-blur">
            <p className="mb-3 text-xs uppercase tracking-widest text-slate-600">
              Recent analyses
            </p>
            <div className="flex flex-col gap-2">
              {history.map((entry) => (
                <button
                  key={entry.id}
                  onClick={() => loadFromHistory(entry)}
                  className="flex items-center justify-between rounded-xl border border-white/6 bg-white/[0.03] px-4 py-3 text-left hover:bg-white/6 transition-all"
                >
                  <div>
                    <span className="text-sm text-white font-medium">
                      {entry.form.title || "Untitled"}
                    </span>
                    <span className="ml-2 text-xs text-slate-600">
                      {new Date(entry.timestamp).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <span
                    className={`text-xs font-semibold uppercase ${riskColors[entry.result.risk]}`}
                  >
                    {entry.result.risk}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
          <div className="lg:sticky lg:top-6 lg:self-start">
            <InputPanel
              form={form}
              setForm={setForm}
              onSubmit={handleSubmit}
              loading={loading}
            />
          </div>

          <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-6 min-h-[500px]">
            {!result && !loading && !error && <EmptyState />}

            {loading && <SkeletonLoader />}

            {error && (
              <div className="flex min-h-[200px] items-center justify-center">
                <div className="rounded-2xl border border-rose-400/20 bg-rose-500/8 p-5 text-sm text-rose-300 max-w-md text-center">
                  <div className="text-2xl mb-2">⚠️</div>
                  {error}
                </div>
              </div>
            )}

            {result && (
              <ResultPanel
                result={result}
                deadline={form.deadline}
                progress={form.progress}
                hoursLeft={form.hoursLeft}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
