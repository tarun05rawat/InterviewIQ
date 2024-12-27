import { NextResponse } from "next/server";
import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Use environment variable for API key
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get("audio") as Blob;

    if (!audioFile) {
      return NextResponse.json(
        { error: "No audio file provided" },
        { status: 400 }
      );
    }

    // Convert Blob to File object
    const file = new File([audioFile], "audio.webm", { type: "audio/webm" });

    // Send to Whisper API
    const transcription = await openai.audio.transcriptions.create({
      file: file,
      model: "whisper-1",
    });

    return NextResponse.json({
      transcript: transcription.text,
    });
  } catch (error) {
    console.error("Error processing audio:", error);
    return NextResponse.json(
      { error: "Failed to process audio" },
      { status: 500 }
    );
  }
}
