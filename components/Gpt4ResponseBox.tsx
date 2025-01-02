import React from "react";

export default function Gpt4ResponseBox({ response }: { response: string }) {
  const renderFormattedResponse = (response: string) => {
    const content = response
      .replace(/(Feedback:)/, "$1<br /><br />")
      .replace(/([2-5])\./g, "<br /><br />$1")
      .replace(/(Rating:)/, "<br /><br />$1")
      .replace(
        /Relevance to the question/g,
        "<strong>Relevance to the question</strong>"
      )
      .replace(
        /Clarity and structure/g,
        "<strong>Clarity and structure</strong>"
      )
      .replace(
        /Technical and professional competencies demonstrated/g,
        "<strong>Technical and professional competencies demonstrated</strong>"
      )
      .replace(
        /Depth and specificity of the response/g,
        "<strong>Depth and specificity of the response</strong>"
      )
      .replace(
        /Suggestions for improvement/g,
        "<strong>Suggestions for improvement</strong>"
      )
      .replace(/Rating/g, "<strong>Rating</strong>");

    return (
      <div className="mb-4">
        <p
          className="text-gray-700"
          dangerouslySetInnerHTML={{ __html: content.trim() }}
        ></p>
      </div>
    );
  };

  return (
    <div className="w-full p-4 bg-gray-50 border border-gray-300 rounded-md shadow-md">
      {renderFormattedResponse(response)}
    </div>
  );
}
