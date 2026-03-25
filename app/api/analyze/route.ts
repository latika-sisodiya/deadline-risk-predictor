import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: NextRequest) {
  const body = await req.json();

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: `
Analyze deadline risk:

Progress: ${body.progress}
Difficulty: ${body.difficulty}
Hours left: ${body.hoursLeft}

Return JSON only:
{
  "risk": "",
  "confidenceScore": 0.0,
  "reason": "",
  "recoveryPlan": [],
  "dailyPlan": [],
  "urgencyLabel": ""
}
`,
        },
      ],
      temperature: 0.7,
    });

    const text = response.choices[0].message.content || "{}";

    return NextResponse.json(JSON.parse(text));
  } catch (err) {
    return NextResponse.json({ error: "API failed" }, { status: 500 });
  }
}
