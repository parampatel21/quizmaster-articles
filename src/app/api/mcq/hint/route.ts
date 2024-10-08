// makes requests to Google for the hints

import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ApiError, handleError } from '@/utils/apiErrorHandler';
import { MCQHintRequest } from '@/types/mcqTypes';

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error('GEMINI_API_KEY is not defined in environment variables');
}

const gemini = new GoogleGenerativeAI(apiKey);

export async function POST(req: Request) {
  try {
    const data: MCQHintRequest = await req.json();

    const { question, attemptedAnswers, remainingAnswers } = data;

    if (!question || !attemptedAnswers || !remainingAnswers) {
      throw new ApiError('Invalid input data', 400);
    }

    const prompt = `
      Question: ${question}.
      The user has selected these incorrect answers: ${attemptedAnswers.join(
        ', '
      )}.
      The remaining answer options are: ${remainingAnswers.join(', ')}.
      Provide a helpful hint to guide the user toward the correct answer, but do not reveal the answer directly.
    `;

    const model = gemini.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        candidateCount: 1, // number of responses
        stopSequences: ['\n\nHuman:'], // structuring the prompt
        maxOutputTokens: 150, // response len.
        temperature: 0.5, // randomness
      },
    });

    const result = await model.generateContent(prompt);
    const hint = result.response.text().trim();

    return NextResponse.json({ hint }, { status: 200 });
  } catch (error) {
    console.error('Error generating AI hint:', error);
    return handleError(new ApiError('Failed to generate AI hint'));
  }
}
