import { NextResponse } from "next/server";
import OpenAI, { APIError } from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Secure API key
});

export async function POST(request: Request) {
  try {
    // Parse form data
    const formData = await request.formData();
    const audioFile = formData.get("audio") as Blob;
    const question = formData.get("question") as string;

    // Validate input
    if (!audioFile || !question) {
      console.error("Missing audio file or question");
      return NextResponse.json(
        { error: "Audio file or question missing" },
        { status: 400 }
      );
    }

    // Convert Blob to File object for Whisper
    const file = new File([audioFile], "audio.webm", { type: "audio/webm" });

    console.log("Starting transcription...");
    // Step 1: Transcription using Whisper
    const transcription = await openai.audio.transcriptions.create({
      file: file,
      model: "whisper-1",
    });

    if (!transcription.text) {
      console.error("Transcription failed");
      return NextResponse.json(
        { error: "Failed to transcribe audio" },
        { status: 500 }
      );
    }
    console.log("Transcription successful:", transcription.text);

    console.log("Starting GPT-4 evaluation...");
    // Step 2: Behavioral Evaluation using GPT-4
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
        { role: "user", content: `Transcript: ${transcription.text}` },
      ],
      temperature: 0.3,
    });

    const evaluation =
      gptResponse.choices?.[0]?.message?.content || "No evaluation provided";

    console.log("GPT-4 evaluation successful");

    // Return successful JSON response
    return NextResponse.json({
      transcript: transcription.text,
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

    // Generic error response
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again later." },
      { status: 500 }
    );
  }
}
