import { Mic } from "lucide-react";
import { Button } from "../../components/ui/button";

interface VoiceButtonProps {
  onRecord: () => void;
  isRecording: boolean;
}

export function VoiceButton({ onRecord, isRecording }: VoiceButtonProps) {
  return (
    <Button
      onClick={onRecord}
      className={`rounded-full w-16 h-16 p-0 transition-colors ${
        isRecording
          ? "bg-red-500 hover:bg-red-600"
          : "bg-black hover:bg-gray-800"
      }`}
    >
      <Mic className="h-6 w-6 text-white" />
    </Button>
  );
}
