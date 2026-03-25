import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

function safeParse(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start !== -1 && end !== -1) {
      return JSON.parse(text.slice(start, end + 1));
    }
    throw new Error("Invalid JSON");
  }
}

function fallback(body: any) {
  const { progress, difficulty } = body;

  let risk = "low";

  if (progress < 30 && difficulty === "hard") risk = "high";
  else if (progress < 60) risk = "medium";

  return {
    risk,
    confidenceScore: Number((Math.random() * 0.4 + 0.6).toFixed(2)),
    reason: "Calculated using fallback logic (AI unavailable)",
    recoveryPlan: [
      "Break task into smaller parts",
      "Focus on key sections first",
      "Avoid over-polishing",
    ],
    dailyPlan: [
      "Work in focused 2-hour sessions",
      "Start with hardest section",
      "Review before submission",
    ],
    urgencyLabel:
      risk === "high" ? "Critical" : risk === "medium" ? "Moderate" : "Low",
  };
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: `
You are an AI assistant helping university students manage deadlines.

Analyze this assignment:

Title: ${body.title}
Deadline: ${body.deadline}
Progress: ${body.progress}%
Difficulty: ${body.difficulty}
Confidence Level: ${body.confidence}/10
Estimated Hours Remaining: ${body.hoursLeft}

Consider:
- time remaining vs work left
- difficulty vs progress
- student confidence

STRICT RULES:
- Return ONLY valid JSON
- No markdown
- No explanation text

FORMAT:
{
  "risk": "low | medium | high",
  "confidenceScore": number,
  "reason": "short explanation",
  "recoveryPlan": ["step1","step2","step3"],
  "dailyPlan": ["step1","step2","step3"],
  "urgencyLabel": "short label"
}
`,
        },
      ],
      temperature: 0.7,
    });

    const raw = completion.choices[0]?.message?.content || "";

    console.log("GROQ RAW:", raw);

    const parsed = safeParse(raw);

    return NextResponse.json(parsed);
  } catch (err: any) {
    console.error("GROQ ERROR:", err.message);

    return NextResponse.json(fallback(body));
  }
}
