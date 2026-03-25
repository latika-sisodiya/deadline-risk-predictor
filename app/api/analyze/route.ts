import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function POST(req: NextRequest) {
  const body = await req.json();

  const prompt = `
Analyze deadline risk:

Progress: ${body.progress}%
Difficulty: ${body.difficulty}
Hours left: ${body.hoursLeft}

Return JSON:
{
  "risk": "",
  "confidenceScore": 0.0,
  "reason": "",
  "recoveryPlan": [],
  "dailyPlan": [],
  "urgencyLabel": ""
}
`;

  const res = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: prompt,
  });

  return NextResponse.json(JSON.parse(res.text || "{}"));
}