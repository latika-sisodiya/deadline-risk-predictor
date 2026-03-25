"use client";

import { useState } from "react";
import InputPanel from "@/components/InputPanel";
import RiskGauge from "@/components/RiskGauge";
import CountdownCard from "@/components/CountdownCard";
import { AnalyzeRequest } from "@/lib/types";

export default function Home() {
  const [form, setForm] = useState<AnalyzeRequest>({
    title: "",
    deadline: "",
    progress: 20,
    difficulty: "medium",
    confidence: 5,
    hoursLeft: 10,
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        throw new Error("API failed");
      }

      const data = await res.json();

      console.log("AI RESULT:", data);

      setResult(data);
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-10 bg-[#07111f] min-h-screen text-white">
      <InputPanel
        form={form}
        setForm={setForm}
        onSubmit={handleSubmit}
        loading={loading}
      />

      {result && (
        <div className="mt-6 space-y-4">
          <div>
            <h3>Recovery Plan</h3>
            {result.recoveryPlan?.map((r: string, i: number) => (
              <p key={i}>{r}</p>
            ))}
          </div>

          <div>
            <h3>Daily Plan</h3>
            {result.dailyPlan?.map((r: string, i: number) => (
              <p key={i}>{r}</p>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
