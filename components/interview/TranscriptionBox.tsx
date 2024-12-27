"use client";

import { Card } from "@/components/ui/card";

interface TranscriptionBoxProps {
  text: string;
  isRecording: boolean;
}

export function TranscriptionBox({ text, isRecording }: TranscriptionBoxProps) {
  return (
    <Card className="w-full max-w-2xl p-4 min-h-[100px] bg-white">
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
        {text || "Transcription will appear here..."}
      </p>
    </Card>
  );
}
