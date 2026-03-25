"use client";

import { useState } from "react";
import InputPanel from "@/components/InputPanel";

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
        <pre className="mt-6 bg-black p-4 rounded">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </main>
  );
}
