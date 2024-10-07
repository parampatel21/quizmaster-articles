import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not defined in environment variables");
}

const gemini = new GoogleGenerativeAI(apiKey);

export async function POST(req: Request) {
  try {
    const { question, attemptedAnswers, remainingAnswers } = await req.json();

    const prompt = `
      Question: ${question}.
      The user has selected these incorrect answers: ${attemptedAnswers.join(
        ", "
      )}.
      The remaining answer options are: ${remainingAnswers.join(", ")}.
      Provide a helpful hint to guide the user toward the correct answer, but do not reveal the answer directly.
    `;

    const model = gemini.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        candidateCount: 1,
        stopSequences: ["\n\nHuman:"],
        maxOutputTokens: 150,
        temperature: 0.5,
      },
    });

    const result = await model.generateContent(prompt);
    const hint = result.response.text().trim();

    return NextResponse.json({ hint });
  } catch (error) {
    console.error("Error generating AI hint:", error);
    return NextResponse.json(
      { error: "Failed to generate AI hint" },
      { status: 500 }
    );
  }
}
