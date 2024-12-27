import React from "react";

export default function Gpt4ResponseBox({ response }: { response: string }) {
  const renderFormattedResponse = (response: string) => {
    const sections = response.split("\n\n"); // Split into sections by double newline
    return sections.map((section, index) => {
      const [heading, ...content] = section.split("\n"); // Split into heading and content
      return (
        <div key={index} className="mb-4">
          <strong className="block mb-2">{heading.trim()}</strong>
          <p className="text-gray-700">{content.join(" ").trim()}</p>
        </div>
      );
    });
  };

  return (
    <div className="w-full p-4 bg-gray-50 border border-gray-300 rounded-md shadow-md">
      <h3 className="text-lg font-semibold mb-4">Feedback:</h3>
      {renderFormattedResponse(response)}
    </div>
  );
}
