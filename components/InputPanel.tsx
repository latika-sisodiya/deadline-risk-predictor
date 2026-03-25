"use client";

import { Dispatch, SetStateAction } from "react";
import { AnalyzeRequest } from "@/lib/types";

type Props = {
  form: AnalyzeRequest;
  setForm: Dispatch<SetStateAction<AnalyzeRequest>>;
  onSubmit: () => void;
  loading: boolean;
};

const PRESETS = [
  {
    label: "Essay crisis",
    emoji: "🔥",
    values: {
      title: "Essay submission",
      progress: 15,
      difficulty: "hard" as const,
      confidence: 3,
      hoursLeft: 20,
    },
  },
  {
    label: "Group project",
    emoji: "⚡",
    values: {
      title: "Group project report",
      progress: 50,
      difficulty: "medium" as const,
      confidence: 6,
      hoursLeft: 10,
    },
  },
  {
    label: "Comfortable",
    emoji: "✅",
    values: {
      title: "Weekly lab report",
      progress: 80,
      difficulty: "easy" as const,
      confidence: 8,
      hoursLeft: 3,
    },
  },
];

const DIFFICULTY_OPTIONS = [
  {
    value: "easy" as const,
    label: "Easy",
    color: "text-emerald-400 border-emerald-400/40 bg-emerald-400/10",
  },
  {
    value: "medium" as const,
    label: "Medium",
    color: "text-amber-400 border-amber-400/40 bg-amber-400/10",
  },
  {
    value: "hard" as const,
    label: "Hard",
    color: "text-rose-400 border-rose-400/40 bg-rose-400/10",
  },
];

const inputClass =
  "w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white placeholder-slate-500 text-sm outline-none focus:border-white/25 focus:bg-slate-950/80 transition-all duration-150";

export default function InputPanel({
  form,
  setForm,
  onSubmit,
  loading,
}: Props) {
  const applyPreset = (preset: (typeof PRESETS)[0]) => {
    const deadline = new Date();
    deadline.setHours(deadline.getHours() + preset.values.hoursLeft + 4);
    const iso = deadline.toISOString().slice(0, 16);
    setForm((prev) => ({ ...prev, ...preset.values, deadline: iso }));
  };

  const isValid = form.title.trim() && form.deadline;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 flex flex-col gap-5">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-white tracking-tight">
          Predict your risk
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Fill in your assignment details below.
        </p>
      </div>

      {/* Presets */}
      <div>
        <p className="mb-2 text-xs uppercase tracking-widest text-slate-600">
          Quick fill
        </p>
        <div className="flex gap-2 flex-wrap">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => applyPreset(p)}
              className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300 hover:border-white/20 hover:bg-white/10 transition-all duration-150"
            >
              <span>{p.emoji}</span>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-slate-400">
          Assignment title
        </label>
        <input
          value={form.title}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, title: e.target.value }))
          }
          placeholder="e.g. SCC Project Report"
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-slate-400">Deadline</label>
        <input
          type="datetime-local"
          value={form.deadline}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, deadline: e.target.value }))
          }
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-slate-400">
            Current progress
          </label>
          <span className="text-sm font-semibold text-white">
            {form.progress}%
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={form.progress}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, progress: Number(e.target.value) }))
          }
          className="w-full accent-white"
          style={{
            background: `linear-gradient(to right, rgba(255,255,255,0.7) ${form.progress}%, rgba(255,255,255,0.1) ${form.progress}%)`,
          }}
        />
        <div className="flex justify-between text-[10px] text-slate-600">
          <span>Not started</span>
          <span>Complete</span>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-slate-400">Difficulty</label>
        <div className="grid grid-cols-3 gap-2">
          {DIFFICULTY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() =>
                setForm((prev) => ({ ...prev, difficulty: opt.value }))
              }
              className={`rounded-xl border py-2.5 text-sm font-medium transition-all duration-150 ${
                form.difficulty === opt.value
                  ? opt.color
                  : "border-white/10 bg-white/5 text-slate-500 hover:border-white/15 hover:text-slate-400"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-slate-400">
            Confidence
          </label>
          <span className="text-sm font-semibold text-white">
            {form.confidence}
            <span className="text-slate-500 text-xs">/10</span>
          </span>
        </div>
        <input
          type="range"
          min={1}
          max={10}
          value={form.confidence}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, confidence: Number(e.target.value) }))
          }
          className="w-full"
          style={{
            background: `linear-gradient(to right, rgba(255,255,255,0.7) ${((form.confidence - 1) / 9) * 100}%, rgba(255,255,255,0.1) ${((form.confidence - 1) / 9) * 100}%)`,
          }}
        />
        <div className="flex justify-between text-[10px] text-slate-600">
          <span>Not confident</span>
          <span>Very confident</span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-slate-400">
            Hours still needed
          </label>
          <span className="text-sm font-semibold text-white">
            {form.hoursLeft}h
          </span>
        </div>
        <input
          type="range"
          min={1}
          max={80}
          value={form.hoursLeft}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, hoursLeft: Number(e.target.value) }))
          }
          className="w-full"
          style={{
            background: `linear-gradient(to right, rgba(255,255,255,0.7) ${((form.hoursLeft - 1) / 79) * 100}%, rgba(255,255,255,0.1) ${((form.hoursLeft - 1) / 79) * 100}%)`,
          }}
        />
        <div className="flex justify-between text-[10px] text-slate-600">
          <span>1h</span>
          <span>80h</span>
        </div>
      </div>

      <button
        onClick={onSubmit}
        disabled={loading || !isValid}
        aria-busy={loading}
        className={`mt-1 w-full rounded-xl py-3.5 text-sm font-semibold transition-all duration-200 ${
          isValid && !loading
            ? "bg-white text-slate-950 hover:bg-slate-100 active:scale-[0.98]"
            : "bg-white/10 text-slate-500 cursor-not-allowed"
        }`}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-slate-400 border-t-transparent" />
            Analysing with Gemini…
          </span>
        ) : (
          "Analyse deadline risk →"
        )}
      </button>
    </div>
  );
}
