"use client";

import { AnalyzeRequest } from "@/lib/types";

type Props = {
  form: AnalyzeRequest;
  setForm: any;
  onSubmit: () => void;
  loading: boolean;
};

export default function InputPanel({ form, setForm, onSubmit, loading }: Props) {
  return (
    <div className="p-6 border border-white/10 rounded-2xl bg-white/5">
      <h2 className="text-xl font-semibold mb-4">Enter Details</h2>

      <div className="space-y-3">
        <input
          placeholder="Assignment"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full p-2 rounded bg-black/40"
        />

        <input
          type="datetime-local"
          value={form.deadline}
          onChange={(e) => setForm({ ...form, deadline: e.target.value })}
          className="w-full p-2 rounded bg-black/40"
        />

        <input
          type="number"
          placeholder="Progress %"
          value={form.progress}
          onChange={(e) => setForm({ ...form, progress: Number(e.target.value) })}
          className="w-full p-2 rounded bg-black/40"
        />

        <select
          value={form.difficulty}
          onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
          className="w-full p-2 rounded bg-black/40"
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        <button
          onClick={onSubmit}
          className="w-full bg-white text-black p-2 rounded"
        >
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </div>
    </div>
  );
}