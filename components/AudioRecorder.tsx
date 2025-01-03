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
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState("");
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

      const contentType = response.headers.get("Content-Type");
      const rawResponse = await response.text();

      console.log("Raw transcription response:", rawResponse);

      if (contentType && contentType.includes("application/json")) {
        const data = JSON.parse(rawResponse);
        if (data.error) {
          console.error("Transcription error:", data.error);
          return;
        }

        setTranscript(data.transcript);
        setIsLoading(false);

        // Start evaluation asynchronously
        handleEvaluation(data.transcript);
      } else {
        console.error("Unexpected non-JSON response:", rawResponse);
      }
    } catch (error) {
      console.error("Error during transcription:", error);
    }
  };

  const handleEvaluation = async (transcript: string) => {
    try {
      setIsEvaluating(true);
      const response = await fetch("/api/evaluate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: currentQuestion, transcript }),
      });

      const contentType = response.headers.get("Content-Type");
      const rawResponse = await response.text();

      console.log("Raw evaluation response:", rawResponse);

      if (contentType && contentType.includes("application/json")) {
        const data = JSON.parse(rawResponse);
        if (data.error) {
          console.error("Evaluation error:", data.error);
          return;
        }

        setEvaluation(data.evaluation);
        onResponseReceived(data.evaluation);
      } else {
        console.error("Unexpected non-JSON response:", rawResponse);
      }
    } catch (error) {
      console.error("Error during evaluation:", error);
    } finally {
      setIsEvaluating(false);
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
          {isLoading
            ? "Processing..."
            : transcript || "Transcription will appear here..."}
        </p>
        {isEvaluating && (
          <p className="text-gray-500 mt-2">Evaluating response...</p>
        )}
      </Card>
      {isEvaluating && <Loader />}
      {isLoading && <Loader />}
    </div>
  );
}
