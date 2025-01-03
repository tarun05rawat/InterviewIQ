import { NextResponse } from "next/server";
import OpenAI, { APIError } from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Secure API key
});

async function transcribeAudio(file: File) {
  console.log("Starting transcription...");
  const transcription = await openai.audio.transcriptions.create({
    file: file,
    model: "whisper-1",
  });

  if (!transcription.text) {
    console.error("Transcription failed");
    throw new Error("Failed to transcribe audio");
  }
  console.log("Transcription successful:", transcription.text);
  return transcription.text;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get("audio") as Blob;

    if (!audioFile) {
      console.error("Missing audio file");
      return NextResponse.json(
        { error: "Audio file missing" },
        { status: 400 }
      );
    }

    const file = new File([audioFile], "audio.webm", { type: "audio/webm" });
    const transcript = await transcribeAudio(file);

    return NextResponse.json({
      transcript: transcript,
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
