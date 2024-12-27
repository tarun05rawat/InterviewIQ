interface QuestionBoxProps {
  question: string;
}

export function QuestionBox({ question }: QuestionBoxProps) {
  return (
    <div className="bg-gray-100 rounded-lg shadow-md p-8 max-w-2xl w-full">
      <p className="text-xl md:text-2xl font-bold text-center">{question}</p>
    </div>
  );
}
