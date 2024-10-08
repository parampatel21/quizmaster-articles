import React, { useState, useRef, useEffect } from "react";
import { MCQInstructorViewProps } from "@/types/mcqTypes";
import SubmissionPane from "@/components/ui/SubmissionPane";
import * as Icons from "@/components/ui/Icons";
import { z } from "zod";
import { mcqSchema } from "@/utils/validation";

const MCQInstructorView = ({
  attrs,
  updateAttributes,
}: MCQInstructorViewProps) => {
  // Destructure attributes
  const { question, answers, isFinalized, selectedAnswer, id, showHintButton } =
    attrs;

  // State Initialization
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [localSelectedAnswer, setLocalSelectedAnswer] = useState<number | null>(
    selectedAnswer
  );
  const newAnswerInputRef = useRef<HTMLInputElement | null>(null);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [localShowHintButton, setLocalShowHintButton] = useState<boolean>(
    showHintButton ?? true
  );

  // Effects
  useEffect(() => {
    setLocalSelectedAnswer(selectedAnswer);
  }, [selectedAnswer]);

  // Event Handlers

  // Handle input change for answers
  const handleInputChange = (index: number, value: string): void => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    updateAttributes({ answers: newAnswers });
  };

  // Add a new answer
  const addAnswer = (): void => {
    updateAttributes({ answers: [...answers, ""] });
    setTimeout(() => {
      newAnswerInputRef.current?.focus();
    }, 0);
  };

  // Remove an answer
  const removeAnswer = (index: number): void => {
    const newAnswers = answers.filter((_, i) => i !== index);
    updateAttributes({ answers: newAnswers });
    if (localSelectedAnswer === index) {
      setLocalSelectedAnswer(null);
      updateAttributes({ selectedAnswer: null });
    } else if (localSelectedAnswer !== null && localSelectedAnswer > index) {
      setLocalSelectedAnswer(localSelectedAnswer - 1);
      updateAttributes({ selectedAnswer: localSelectedAnswer - 1 });
    }
  };

  // Handle selecting the correct answer
  const handleSelectAnswer = (index: number): void => {
    setLocalSelectedAnswer(index);
    updateAttributes({ selectedAnswer: index });
  };

  // Handle toggling the show hint button
  const handleShowHintToggle = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const newShowHintButton = e.target.checked;
    setLocalShowHintButton(newShowHintButton);
    updateAttributes({ showHintButton: newShowHintButton });
  };

  // Handle showing the submission history
  const handleHistoryButtonClick = (): void => {
    setShowHistory((prev) => !prev);
  };

  // Handle editing the MCQ
  const editMCQ = (): void => {
    updateAttributes({ isFinalized: false });
    setErrorMessage(null);
  };

  // Validate the MCQ using zod
  const validateMCQ = (): boolean => {
    try {
      mcqSchema.parse({
        question,
        answers,
        selectedAnswer: localSelectedAnswer,
      });
      setErrorMessage(null);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrorMessage(error.errors[0].message);
      } else {
        setErrorMessage("An unexpected error occurred.");
      }
      return false;
    }
  };

  // Finalize the MCQ
  const finalizeMCQ = (): void => {
    if (validateMCQ()) {
      updateAttributes({
        isFinalized: true,
        selectedAnswer: localSelectedAnswer,
      });
    }
  };

  // Rendering Logic

  // Render the finalized MCQ view
  const renderFinalizedView = () => (
    <>
      <div className="p-4 rounded-md shadow bg-base-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">{question}</h2>
        <ul className="my-2">
          {answers.map((answer, index) => (
            <li key={index} className="flex items-center gap-2 mb-6">
              <input
                type="radio"
                name={`mcq-finalized-${id}`}
                checked={selectedAnswer === index}
                onChange={() => {}}
                className="radio radio-primary"
                disabled
              />
              <span className="text-base font-medium text-gray-700">
                {answer}
              </span>
            </li>
          ))}
        </ul>
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={editMCQ}
            className="btn btn-sm text-white btn-accent"
          >
            Edit
          </button>
          <div className="flex items-center ml-4 px-2 py-2 bg-base-100 border border-base-200 rounded-lg">
            <label htmlFor="showHintToggle" className="mr-2 text-xs">
              Allow Smart Hint:
            </label>
            <input
              type="checkbox"
              id="showHintToggle"
              checked={localShowHintButton}
              onChange={handleShowHintToggle}
              className="toggle toggle-xs toggle-secondary"
            />
          </div>
          <button
            onClick={handleHistoryButtonClick}
            className="btn btn-sm btn-neutral ml-auto"
          >
            {showHistory ? "Hide Submission History" : "Submission History"}
          </button>
        </div>
      </div>
      {showHistory && (
        <SubmissionPane
          mcqId={id}
          show={showHistory}
          onClose={handleHistoryButtonClick}
          question={question}
        />
      )}
    </>
  );

  // Render the editable MCQ form
  const renderEditableForm = () => (
    <div className="p-4 rounded-md shadow">
      {errorMessage && (
        <div role="alert" className="alert alert-error mb-4">
          <Icons.CircleX />
          <span>{errorMessage}</span>
        </div>
      )}
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

  // Return statement
  return isFinalized ? renderFinalizedView() : renderEditableForm();
};

export default MCQInstructorView;
