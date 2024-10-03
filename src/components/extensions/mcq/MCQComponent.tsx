/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { NodeViewWrapper } from "@tiptap/react";

const MCQComponent = ({
  node,
  updateAttributes,
}: {
  node: any;
  updateAttributes: (attrs: any) => void;
}) => {
  const { question, answers } = node.attrs;

  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const newAnswers = [...answers];
    newAnswers[index] = e.target.value;
    updateAttributes({ answers: newAnswers });
  };

  const addAnswer = () => {
    updateAttributes({ answers: [...answers, ""] });
  };

  const removeAnswer = (index: number) => {
    const newAnswers = answers.filter((_: string, i: number) => i !== index);
    updateAttributes({ answers: newAnswers });
  };

  return (
    <NodeViewWrapper className="border border-gray-300 p-4 rounded-md">
      <div className="mb-4">
        <input
          type="text"
          value={question}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            updateAttributes({ question: e.target.value })
          }
          placeholder="Enter your question"
          className="w-full border-2 border-purple-500 rounded-md p-2 focus:outline-none"
        />
      </div>
      <div className="mb-4">
        <h4 className="text-gray-700">Options:</h4>
        {answers.map((answer: string, index: number) => (
          <div key={index} className="flex items-center mb-2">
            <input
              type="radio"
              name="mcq"
              checked={selectedAnswer === index}
              onChange={() => setSelectedAnswer(index)}
              className="mr-2"
            />
            <input
              type="text"
              value={answer}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleInputChange(e, index)
              }
              placeholder={`Answer ${index + 1}`}
              className="w-full border border-gray-300 rounded-md p-2 mr-2"
            />
            <button
              onClick={() => removeAnswer(index)}
              className="bg-red-500 text-white rounded-md px-2 py-1"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          onClick={addAnswer}
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Add Option
        </button>
      </div>
    </NodeViewWrapper>
  );
};

export default MCQComponent;
