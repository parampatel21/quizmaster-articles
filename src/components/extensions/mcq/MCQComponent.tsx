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
  const [isFinalized, setIsFinalized] = useState<boolean>(false);

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

  const finalizeMCQ = () => {
    setIsFinalized(true);
  };

  const editMCQ = () => {
    setIsFinalized(false);
  };

  return (
    <NodeViewWrapper className="border border-gray-300 p-4 rounded-md">
      {isFinalized ? (
        <div>
          <h4 className="text-gray-700">{question}</h4>
          <ul>
            {answers.map((answer: string, index: number) => (
              <li key={index} className="flex items-center mb-2">
                <input
                  type="radio"
                  name="mcq-finalized"
                  checked={selectedAnswer === index}
                  onChange={() => setSelectedAnswer(index)}
                  className="mr-2"
                  disabled
                />
                <span>{answer}</span>
              </li>
            ))}
          </ul>
          <button
            onClick={editMCQ}
            className="mt-2 bg-gray-500 text-white px-4 py-2 rounded-md"
          >
            Edit
          </button>
        </div>
      ) : (
        <div>
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
          <button
            onClick={finalizeMCQ}
            className="mt-2 bg-green-500 text-white px-4 py-2 rounded-md"
          >
            Finalize
          </button>
        </div>
      )}
    </NodeViewWrapper>
  );
};

export default MCQComponent;
