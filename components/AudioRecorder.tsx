import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { VoiceButton } from "@/components/interview/VoiceButton";
import Loader from "@/components/Loader";

export default function AudioRecorder({
  currentQuestion,
  onResponseReceived,
}: {
  currentQuestion: string;
  onResponseReceived: (response: string) => void;
}) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
    console.log("");
  };

  const stopRecording = async () => {
    if (!mediaRecorderRef.current) return;
    const mediaRecorder = mediaRecorderRef.current;

    return new Promise<void>((resolve) => {
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
        await handleTranscription(audioBlob);
        resolve();
      };

      mediaRecorder.stop();
      setIsRecording(false);
      mediaRecorder.stream.getTracks().forEach((track) => track.stop());
    });
  };

  const handleTranscription = async (audioBlob: Blob) => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("audio", audioBlob);

      const response = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setTranscript(data.transcript);

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

      const openAIResponse = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPEN_AI_API_KEY_RESPONSE}`,
          },
          body: JSON.stringify({
            model: "gpt-4",
            messages: [
              {
                role: "system",
                content: systemPrompt,
              },
              { role: "user", content: `Question: ${currentQuestion}` },
              { role: "user", content: `Transcript: ${data.transcript}` },
            ],
          }),
        }
      );

      if (!openAIResponse.ok) {
        throw new Error(`OpenAI API error: ${openAIResponse.statusText}`);
      }

      const openAIData = await openAIResponse.json();
      const gptResponse = openAIData.choices?.[0]?.message?.content;

      if (!gptResponse) {
        throw new Error("Invalid response from OpenAI API");
      }

      onResponseReceived(openAIData.choices[0].message.content);
    } catch (error) {
      console.error("Error transcribing audio:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecord = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-2xl">
      <VoiceButton onRecord={handleRecord} isRecording={isRecording} />

      <Card className="w-full p-4 min-h-[100px] bg-white">
        <div className="flex items-center gap-2 mb-2">
          <div
            className={`w-2 h-2 rounded-full ${
              isRecording ? "bg-red-500 animate-pulse" : "bg-gray-300"
            }`}
          />
          <span className="text-sm text-gray-500">
            {isRecording ? "Recording..." : "Not recording"}
          </span>
        </div>
        <p className="text-gray-700">
          {transcript || "Transcription will appear here..."}
        </p>
      </Card>
      {/* Render the loader when waiting for GPT-4 response */}
      {isLoading && <Loader />}
    </div>
  );
}
