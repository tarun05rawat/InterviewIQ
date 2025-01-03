"use client";

import { useState } from "react";
import { Header } from "../../components/layout/Header";
import { Footer } from "../../components/layout/Footer";
import AudioRecorder from "../../components/AudioRecorder";
import { Button } from "../../components/ui/button";
import { ArrowLeft, ArrowRight, Shuffle } from "lucide-react";
import questionsData from "@/src/data/Questions.json";
import { QuestionBox } from "../../components/interview/QuestionBox";
import Gpt4ResponseBox from "../../components/Gpt4ResponseBox";
import Loader from "../../components/Loader";

export default function MainPage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [gptResponse, setGptResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleNext = () => {
    if (
      currentQuestionIndex <
      questionsData["BEHAVIORAL QUESTIONS"].length - 1
    ) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      resetState();
    } else {
      console.log("No more questions");
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      resetState();
    } else {
      console.log("This is the first question");
    }
  };

  const handleShuffle = () => {
    const randomIndex = Math.floor(
      Math.random() * questionsData["BEHAVIORAL QUESTIONS"].length
    );
    setCurrentQuestionIndex(randomIndex);
    resetState();
  };

  const resetState = () => {
    setGptResponse("");
    setIsLoading(false);
  };

  const handleGptResponse = (response: string) => {
    setGptResponse(response);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center gap-8 p-4">
        <div className="rounded-b-full text-xl font-bold">
          {currentQuestionIndex + 1}
        </div>
        <QuestionBox
          question={
            questionsData["BEHAVIORAL QUESTIONS"][currentQuestionIndex].question
          }
        />
        <div className="flex flex-row items-center gap-4">
          <Button
            onClick={handlePrevious}
            className="bg-black hover:bg-gray-800 text-white px-4"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Button
            onClick={handleShuffle}
            className="bg-black hover:bg-gray-800 text-white px-4"
          >
            <Shuffle className="h-4 w-4" />
          </Button>
          <Button
            onClick={handleNext}
            className="bg-black hover:bg-gray-800 text-white px-4"
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        <AudioRecorder
          key={`audio-${currentQuestionIndex}`} // Unique key to force re-render
          currentQuestion={
            questionsData["BEHAVIORAL QUESTIONS"][currentQuestionIndex].question
          }
          onResponseReceived={handleGptResponse}
        />
        {isLoading ? (
          <Loader />
        ) : (
          gptResponse && (
            <Gpt4ResponseBox
              key={`response-${currentQuestionIndex}`} // Unique key to force re-render
              response={gptResponse}
            />
          )
        )}
      </main>
      <Footer />
    </div>
  );
}
