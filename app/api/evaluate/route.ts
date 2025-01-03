import { NextResponse } from "next/server";
import OpenAI, { APIError } from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Secure API key
});

async function evaluateResponse(question: string, transcript: string) {
  console.log("Starting GPT-4 evaluation...");
  const systemPrompt = `
    You are a highly skilled interview evaluator for software engineering intern roles, specializing in behavioral questions. Your role is to provide constructive feedback on a candidate's answer to a behavioral question. 
    ### Objective:
    Evaluate the response based on the following criteria:
    1. Relevance to the question.
    2. Clarity and structure, especially using the STAR Method.
    3. Technical and professional competencies demonstrated.
    4. Depth and specificity of the response.
    5. Suggestions for improvement.
    Provide feedback in a structured format and rate the response out of 10.
  `;

  const gptResponse = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: `Question: ${question}` },
      { role: "user", content: `Transcript: ${transcript}` },
    ],
    temperature: 0.3,
  });

  const evaluation =
    gptResponse.choices?.[0]?.message?.content || "No evaluation provided";

  console.log("GPT-4 evaluation successful");
  return evaluation;
}

export async function POST(request: Request) {
  try {
    const { question, transcript } = await request.json();

    if (!question || !transcript) {
      console.error("Missing question or transcript");
      return NextResponse.json(
        { error: "Question or transcript missing" },
        { status: 400 }
      );
    }

    const evaluation = await evaluateResponse(question, transcript);

    return NextResponse.json({
      evaluation: evaluation,
    });
  } catch (error) {
    console.error("Error processing request:", error);

    if (error instanceof APIError) {
      return NextResponse.json(
        { error: `OpenAI API error: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again later." },
      { status: 500 }
    );
  }
}
