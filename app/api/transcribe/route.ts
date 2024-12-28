import { NextResponse } from "next/server";
import OpenAI, { APIError } from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Secure API key
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get("audio") as Blob;
    const question = formData.get("question") as string;

    if (!audioFile || !question) {
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
      throw new Error("Failed to transcribe audio");
    }
    console.log("Transcription successful:", transcription.text);

    console.log("Starting GPT-4 evaluation...");
    // Step 2: Behavioral Evaluation using GPT-4
    const systemPrompt = `
      You are a highly skilled interview evaluator for software engineering intern roles, specializing in behavioral questions. Your role is to provide constructive feedback on a candidate's answer to a behavioral question. 

      ### Objective:
      Evaluate the response based on the following detailed criteria:
      1. **Relevance to the Question**:
        - Does the answer directly address the behavioral question?
        - Are the examples or experiences provided appropriate to the question's context?

      2. **Clarity and Structure**:
        - Is the answer well-structured, concise, and easy to follow?
        - Does the candidate demonstrate the STAR Method (Situation, Task, Action, Result) in their response?
          - **Situation**: Did they clearly describe the context or problem they faced?
          - **Task**: Did they explain their role or responsibilities in addressing the issue?
          - **Action**: Did they describe the specific steps or actions they took to resolve the issue?
          - **Result**: Did they provide measurable outcomes or results that showcase their impact?

      3. **Technical and Professional Competencies**:
        - Does the candidate use relevant technical or software engineering terms?
        - Do they highlight skills such as problem-solving, teamwork, communication, time management, adaptability, or leadership?
        - Are they demonstrating behaviors suitable for a professional setting?

      4. **Depth and Specificity**:
        - Does the response provide enough depth and detail to understand their experience fully?
        - Are the examples too vague or generic, or are they specific and impactful?

      5. **Improvements**:
        - Offer suggestions for improving the answer, such as areas where they could add more detail, better align their answer with the question, or clarify their role in the situation.

      6. **Overall Assessment**:
        - Summarize the strengths of the answer.
        - Highlight the key areas for improvement.
        - Provide an overall evaluation of how well this answer would fare in a behavioral interview for a software engineering intern role.

      ### Output Format:
      Respond in the following format:

      Question Evaluated
      [State the question here]

      Relevance
      [Evaluate how well the answer relates to the question.]

      Structure (STAR Method)
      [Assess the clarity and use of the STAR Method.]

      Technical and Professional Competencies
      Highlight technical and behavioral skills mentioned and their relevance.]

      Depth and Specificity
      [Assess the level of detail provided.]

      Suggestions for Improvement
      [Offer actionable suggestions.]

      Overall Assessment
      [Summarize the evaluation in 1-2 sentences.]

      Rating
      [Provide a rating out of 10 based on the candidate's performance.]

      Provide feedback that is clear, constructive, and actionable, ensuring the candidate understands how to improve for future interviews. Tailor your evaluation to behavioral questions commonly asked in software engineering intern roles.
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
      gptResponse.choices?.[0]?.message?.content || "No response";

    console.log("GPT-4 evaluation successful");

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
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
