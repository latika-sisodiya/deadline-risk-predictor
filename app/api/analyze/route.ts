import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { AnalyzeRequest, AnalyzeResponse } from "@/lib/types";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

function extractJson(text: string) {
  const cleaned = text.replace(/```json|```/g, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("No valid JSON found");
  return cleaned.slice(start, end + 1);
}

function validateBody(body: unknown): body is AnalyzeRequest {
  if (!body || typeof body !== "object") return false;
  const b = body as Record<string, unknown>;
  if (!b.title || typeof b.title !== "string" || b.title.trim() === "")
    return false;
  if (!b.deadline || typeof b.deadline !== "string" || b.deadline.trim() === "")
    return false;
  if (typeof b.progress !== "number" || b.progress < 0 || b.progress > 100)
    return false;
  if (!["easy", "medium", "hard"].includes(b.difficulty as string))
    return false;
  if (typeof b.confidence !== "number" || b.confidence < 1 || b.confidence > 10)
    return false;
  if (typeof b.hoursLeft !== "number" || b.hoursLeft < 0) return false;
  return true;
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: "Missing GROQ_API_KEY" },
        { status: 500 },
      );
    }

    const body = await req.json();

    if (!validateBody(body)) {
      return NextResponse.json(
        { error: "Invalid input. Please fill in all fields correctly." },
        { status: 400 },
      );
    }

    const deadlineDate = new Date(body.deadline);
    const now = new Date();
    const hoursUntilDeadline = Math.max(
      0,
      Math.floor((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60)),
    );

    const prompt = `
You are an academic deadline risk assistant for university students at Lancaster University.
Analyze this submission risk carefully:

- Assignment title: ${body.title}
- Deadline: ${body.deadline} (${hoursUntilDeadline} hours from now)
- Current progress: ${body.progress}%
- Difficulty level: ${body.difficulty}
- Student confidence (1-10): ${body.confidence}
- Estimated hours still needed: ${body.hoursLeft}

Consider: if hoursLeft > hoursUntilDeadline, that's a critical risk signal.
Low progress (<30%) + hard difficulty + low confidence = high risk.

Return ONLY valid JSON in this exact structure:
{
  "risk": "low" | "medium" | "high",
  "confidenceScore": number between 0 and 1,
  "reason": "one concise sentence explaining the primary risk factor",
  "recoveryPlan": ["action 1", "action 2", "action 3"],
  "dailyPlan": ["step 1 with timing", "step 2 with timing", "step 3 with timing"],
  "urgencyLabel": "2-4 word urgency summary"
}

Rules:
- confidenceScore 0.0–0.39 = low risk, 0.4–0.69 = medium, 0.7–1.0 = high
- recoveryPlan: exactly 3 specific, actionable items
- dailyPlan: exactly 3 time-blocked steps for today/tomorrow
- urgencyLabel: short and punchy (e.g. "Critical next 12h", "On track", "Act now")
`.trim();

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content:
            "You are an academic deadline risk assistant. You always respond with valid JSON only, no markdown, no explanation.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.4,
      max_tokens: 600,
    });

    const rawText = completion.choices[0]?.message?.content ?? "";
    const parsed = JSON.parse(extractJson(rawText)) as AnalyzeResponse;

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Analyze error:", error);
    return NextResponse.json(
      { error: "Failed to analyze deadline risk. Please try again." },
      { status: 500 },
    );
  }
}
