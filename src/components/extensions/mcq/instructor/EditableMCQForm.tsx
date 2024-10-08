import React from "react";
import * as Icons from "@/components/ui/Icons";
import { ErrorMessage } from "../shared";
import { MCQAttributes } from "@/types/mcqTypes";

interface EditableMCQFormProps {
  question: string;
  answers: string[];
  localSelectedAnswer: number | null;
  newAnswerInputRef: React.RefObject<HTMLInputElement>;
  errorMessage: string | null;
  handleInputChange: (index: number, value: string) => void;
  handleSelectAnswer: (index: number) => void;
  removeAnswer: (index: number) => void;
  addAnswer: () => void;
  finalizeMCQ: () => void;
  updateAttributes: (attrs: Partial<MCQAttributes>) => void;
}

const EditableMCQForm: React.FC<EditableMCQFormProps> = ({
  question,
  answers,
  localSelectedAnswer,
  newAnswerInputRef,
  errorMessage,
  handleInputChange,
  handleSelectAnswer,
  removeAnswer,
  addAnswer,
  finalizeMCQ,
  updateAttributes,
}) => (
  <div className="p-4 rounded-md shadow">
    {errorMessage && <ErrorMessage message={errorMessage} />}
    <input
      type="text"
      value={question}
      onChange={(e) => updateAttributes({ question: e.target.value })}
      placeholder="Enter your question"
      className="input input-bordered w-full mb-4"
    />
    {answers.map((answer, index) => (
      <div key={index} className="flex items-center gap-2 mb-2">
        <input
          type="radio"
          name="mcq"
          checked={localSelectedAnswer === index}
          onChange={() => handleSelectAnswer(index)}
          className="radio radio-primary"
        />
        <input
          ref={index === answers.length - 1 ? newAnswerInputRef : null}
          type="text"
          value={answer}
          onChange={(e) => handleInputChange(index, e.target.value)}
          placeholder={`Answer ${index + 1}`}
          className="input input-bordered w-full"
        />
        <button
          onClick={() => removeAnswer(index)}
          className="btn btn-error btn-outline btn-circle btn-sm"
        >
          <Icons.Trash2 className="w-6 h-6 p-1" />
        </button>
      </div>
    ))}
    {answers.length === 0 && (
      <div className="text-sm text-gray-500 text-center mt-1">
        To get started, click the &apos;Add Answer&apos; button.
      </div>
    )}
    <div className="flex justify-between items-center mt-4">
      <button onClick={addAnswer} className="btn btn-sm btn-primary">
        Add Answer
      </button>
      <button
        onClick={finalizeMCQ}
        className="btn btn-sm text-white btn-accent"
      >
        Save
      </button>
    </div>
  </div>
);

export default EditableMCQForm;
