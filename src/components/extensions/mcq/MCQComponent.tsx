/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { NodeViewWrapper } from "@tiptap/react";
import * as Icons from "@/components/ui/Icons";

const MCQComponent = ({
  node,
  updateAttributes,
  deleteNode,
  editor,
}: {
  node: any;
  updateAttributes: (attrs: any) => void;
  deleteNode: () => void;
  editor: any;
}) => {
  const { question, answers } = node.attrs;
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isFinalized, setIsFinalized] = useState(false);
  const [isSelected, setIsSelected] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isSelected && (e.key === "Delete" || e.key === "Backspace"))
        deleteNode();
      if (
        isSelected &&
        ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)
      ) {
        setIsSelected(false);
        editor?.commands.focus();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest(".mcq-wrapper")) {
        setIsSelected(false);
        editor?.commands.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSelected, deleteNode, editor]);

  const handleInputChange = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    updateAttributes({ answers: newAnswers });
  };

  const addAnswer = () => updateAttributes({ answers: [...answers, ""] });
  const removeAnswer = (index: number) =>
    updateAttributes({
      answers: answers.filter((_: any, i: number) => i !== index),
    });

  const finalizeMCQ = () =>
    question.trim() && answers.every((a: string) => a.trim())
      ? setIsFinalized(true)
      : alert("All fields must be filled in to save.");
  const editMCQ = () => setIsFinalized(false);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (
      !(
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLButtonElement
      )
    ) {
      setIsSelected(true);
      editor?.commands.blur();
    } else {
      setIsSelected(false);
      editor?.commands.focus();
    }
  };

  return (
    <NodeViewWrapper
      className={`mcq-wrapper border p-4 rounded-md select-none ${
        isSelected ? "border-blue-500" : "border-gray-300"
      }`}
      contentEditable={false}
      draggable="true"
      onClick={handleClick}
    >
      {isFinalized ? (
        <div>
          <h3 className="text-gray-700">{question}</h3>
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
          <input
            type="text"
            value={question}
            onChange={(e) => updateAttributes({ question: e.target.value })}
            placeholder="Enter your question"
            className="w-full border-2 border-purple-500 rounded-md p-2 mb-4 focus:outline-none select-text"
          />
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
                onChange={(e) => handleInputChange(index, e.target.value)}
                placeholder={`Answer ${index + 1}`}
                className="w-full border border-gray-300 rounded-md p-2 mr-2 select-text"
              />
              <button
                onClick={() => removeAnswer(index)}
                className="bg-red-500 text-white rounded-md px-2 py-1"
              >
                <Icons.Trash2 />
              </button>
            </div>
          ))}
          <div className="flex justify-between items-center">
            <button
              onClick={addAnswer}
              className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center"
            >
              <Icons.CirclePlus className="mr-2" /> Add Option
            </button>
            <button
              onClick={finalizeMCQ}
              className="bg-green-500 text-white px-4 py-2 rounded-md flex items-center"
            >
              <Icons.Save className="mr-2" /> Save
            </button>
          </div>
        </div>
      )}
    </NodeViewWrapper>
  );
};

export default MCQComponent;
