/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useRef, useContext } from "react";
import { NodeViewWrapper } from "@tiptap/react";
import * as Icons from "@/components/ui/Icons";
import { EditorModeContext } from "@/context/EditorModeContext";
import SubmissionHistory from "@/components/ui/SubmissionHistory";
import { useMCQSelection } from "@/context/MCQSelectionContext";
import HintComponent from "@/components/ui/HintComponent";

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
  const { question, answers, isFinalized, selectedAnswer } = node.attrs;
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [localSelectedAnswer, setLocalSelectedAnswer] = useState<number | null>(
    selectedAnswer
  );
  const [readerSelectedAnswer, setReaderSelectedAnswer] = useState<
    number | null
  >(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const newAnswerInputRef = useRef<HTMLInputElement | null>(null);
  const { setAllMCQsFinalized, isInstructor } = useContext(EditorModeContext);
  const [attemptedAnswers, setAttemptedAnswers] = useState<number[]>([]);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const { selectedMCQId, setSelectedMCQId } = useMCQSelection();
  const [showHint, setShowHint] = useState(false);
  const [showHintButton, setShowHintButton] = useState(
    node.attrs.showHintButton ?? true
  );
  const isSelected = selectedMCQId === node.attrs.id;
  const handleHintButtonClick = () => {
    console.log(attemptedAnswers);
    setShowHint((prev) => !prev);
  };

  const handleShowHintToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newShowHintButton = e.target.checked;
    setShowHintButton(newShowHintButton);
    updateAttributes({ showHintButton: newShowHintButton });
  };

  const handleHistoryButtonClick = () => {
    setShowHistory((prev) => !prev);
  };

  useEffect(() => {
    setAllMCQsFinalized(isFinalized);
  }, [isFinalized, setAllMCQsFinalized]);

  useEffect(() => {
    setLocalSelectedAnswer(selectedAnswer);
  }, [selectedAnswer]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSelected, deleteNode, editor]);

  useEffect(() => {
    if (newAnswerInputRef.current) {
      newAnswerInputRef.current.focus();
    }
  }, [answers]);

  const handleKeyDown = async (e: KeyboardEvent) => {
    const target = e.target as HTMLElement | null;
    if (
      isSelected &&
      ["Delete", "Backspace"].includes(e.key) &&
      !(target instanceof HTMLInputElement)
    ) {
      e.preventDefault();
      if (node.attrs.id) {
        await deleteMCQFromDatabase(node.attrs.id);
      }
      deleteNode();
      setSelectedMCQId(null);
      editor?.commands.focus();
    } else if (
      isSelected &&
      ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)
    ) {
      setSelectedMCQId(null);
      editor?.commands.focus();
    }
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (!(e.target as HTMLElement).closest(".mcq-wrapper")) {
      setSelectedMCQId(null);
      editor?.commands.focus();
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (
      !(
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLButtonElement
      )
    ) {
      e.preventDefault();
      e.stopPropagation();
      setSelectedMCQId(node.attrs.id);
      editor?.commands.blur();
    }
  };

  const submitAnswer = async () => {
    if (readerSelectedAnswer !== null) {
      const selectedAnswerText = answers[readerSelectedAnswer]; // Get the selected answer text
      const isCorrect = readerSelectedAnswer === selectedAnswer;
      setIsSubmitted(true);
      setAttemptedAnswers([...attemptedAnswers, readerSelectedAnswer]);
      setIsCorrect(isCorrect);

      try {
        const response = await fetch("/api/mcq/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mcq_id: node.attrs.id,
            selected_answer: selectedAnswerText,
            is_correct: isCorrect,
          }),
        });

        console.log(node.attrs.id, selectedAnswerText);

        if (!response.ok) {
          throw new Error("Failed to submit answer");
        }

        // Optionally, you can update the local state or perform other actions here
      } catch (error) {
        console.error("Error submitting answer:", error);
        // Handle error (e.g., show an error message to the user)
      }
    }
  };

  const deleteMCQFromDatabase = async (mcqId: string) => {
    try {
      const response = await fetch(`api/mcq/${mcqId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete MCQ: ${response.statusText}`);
      }

      console.log("MCQ deleted successfully");
    } catch (error) {
      console.error("Error deleting MCQ:", error);
    }
  };

  const handleInputChange = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    updateAttributes({ answers: newAnswers });
  };

  const addAnswer = () => {
    updateAttributes({ answers: [...answers, ""] });
    setTimeout(() => {
      if (newAnswerInputRef.current) {
        newAnswerInputRef.current.focus();
      }
    }, 0);
  };

  const removeAnswer = (index: number) => {
    const newAnswers = answers.filter((_: any, i: number) => i !== index);
    updateAttributes({ answers: newAnswers });
    if (localSelectedAnswer === index) {
      setLocalSelectedAnswer(null);
      updateAttributes({ selectedAnswer: null });
    } else if (localSelectedAnswer !== null && localSelectedAnswer > index) {
      setLocalSelectedAnswer(localSelectedAnswer - 1);
      updateAttributes({ selectedAnswer: localSelectedAnswer - 1 });
    }
  };

  const validateMCQ = () => {
    if (!question.trim()) {
      setErrorMessage("The question must be filled in.");
      return false;
    }
    if (answers.length === 0 || answers.some((a: string) => !a.trim())) {
      setErrorMessage("All answers must be filled in.");
      return false;
    }
    if (localSelectedAnswer === null) {
      setErrorMessage("A correct answer must be selected.");
      return false;
    }
    setErrorMessage(null);
    return true;
  };

  const finalizeMCQ = () => {
    if (validateMCQ()) {
      updateAttributes({
        isFinalized: true,
        selectedAnswer: localSelectedAnswer,
      });
    }
  };

  const editMCQ = () => {
    updateAttributes({ isFinalized: false });
    setErrorMessage(null);
  };

  const handleSelectAnswer = (index: number) => {
    setLocalSelectedAnswer(index);
    updateAttributes({ selectedAnswer: index });
  };

  const handleReaderSelectAnswer = (index: number) => {
    if (!attemptedAnswers.includes(index)) {
      setReaderSelectedAnswer(index);
    }
  };

  const handleSubmit = () => {
    if (readerSelectedAnswer !== null) {
      setIsSubmitted(true);
      setAttemptedAnswers([...attemptedAnswers, readerSelectedAnswer]);
      if (readerSelectedAnswer === selectedAnswer) {
        setIsCorrect(true);
      } else {
        setReaderSelectedAnswer(null);
      }
      // Here you would typically send the selected answer to your backend
      submitAnswer();
      // console.log(`Submitted answer: ${readerSelectedAnswer}`);
    }
  };

  const handleClearSubmission = () => {
    setIsSubmitted(false);
    setReaderSelectedAnswer(null);
    setAttemptedAnswers([]);
    setIsCorrect(false);
  };

  return (
    <NodeViewWrapper
      className={`mcq-wrapper border p-4 rounded-lg select-none ${
        isSelected && isInstructor
          ? "border-success border-2"
          : "border-base-300"
      }`}
      contentEditable={false}
      draggable={isInstructor ? "true" : "false"}
      onClick={isInstructor ? handleClick : undefined}
    >
      <div className="p-2 bg-base-200 rounded-md shadow mb-4 flex items-center gap-2">
        <Icons.CircleHelp className="w-6 h-6" />
        <h3 className="font-thin text-gray-800">Multiple Choice Question</h3>
      </div>

      {isInstructor ? (
        isFinalized ? (
          <>
            <div className="p-4 rounded-md shadow bg-base-200">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                {question}
              </h2>
              <ul className="my-2">
                {answers.map((answer: string, index: number) => (
                  <li key={index} className="flex items-center gap-2 mb-6">
                    <input
                      type="radio"
                      name={`mcq-finalized-${node.attrs.id}`}
                      checked={selectedAnswer === index}
                      onChange={() => {}} // Disabled in finalized state
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
                <button onClick={editMCQ} className="btn btn-sm btn-accent">
                  Edit
                </button>
                <div className="flex items-center ml-4 px-2 py-2 bg-base-100 rounded-lg">
                  <label htmlFor="showHintToggle" className="mr-2 text-xs">
                    Allow AI Hint:
                  </label>
                  <input
                    type="checkbox"
                    id="showHintToggle"
                    checked={showHintButton}
                    onChange={handleShowHintToggle}
                    className="toggle toggle-xs toggle-base-200"
                  />
                </div>
                <button
                  onClick={handleHistoryButtonClick}
                  className="btn btn-sm btn-neutral ml-auto"
                >
                  {showHistory ? "Submission History" : "Submission History"}
                </button>
              </div>
            </div>
            {showHistory && (
              <SubmissionHistory
                mcqId={node.attrs.id}
                show={showHistory}
                onClose={handleHistoryButtonClick}
                question={question}
              />
            )}
          </>
        ) : (
          <>
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
              {answers.map((answer: string, index: number) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <input
                    type="radio"
                    name="mcq"
                    checked={localSelectedAnswer === index}
                    onChange={() => handleSelectAnswer(index)}
                    className="radio radio-primary"
                  />
                  <input
                    ref={
                      index === answers.length - 1 ? newAnswerInputRef : null
                    }
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
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="radio"
                    name="mcq"
                    className="radio radio-primary"
                    disabled
                  />
                  <input
                    type="text"
                    value=""
                    onChange={(e) => handleInputChange(0, e.target.value)}
                    placeholder="Answer 1"
                    className="input input-bordered w-full"
                  />
                </div>
              )}
              <div className="flex justify-between items-center mt-4">
                <button onClick={addAnswer} className="btn btn-sm btn-primary">
                  Add Answer
                </button>
                <button onClick={finalizeMCQ} className="btn btn-sm btn-accent">
                  Save
                </button>
              </div>
            </div>
          </>
        )
      ) : (
        <div className="p-4 rounded-md shadow bg-base-200">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">{question}</h2>
          {errorMessage && (
            <div role="alert" className="alert alert-error mb-4">
              <Icons.CircleX />
              <span>{errorMessage}</span>
            </div>
          )}
          <ul className="my-2">
            {answers.map((answer: string, index: number) => (
              <li key={index} className="flex items-center gap-2 mb-6">
                <input
                  type="radio"
                  name={`mcq-reader-${node.attrs.id}`}
                  checked={readerSelectedAnswer === index}
                  onChange={() => handleReaderSelectAnswer(index)}
                  className="radio radio-primary"
                  disabled={isSubmitted && attemptedAnswers.includes(index)}
                />
                <span className="text-base font-medium text-gray-700">
                  {answer}
                </span>
                {isSubmitted && isCorrect && index === selectedAnswer && (
                  <Icons.CircleCheck className="w-6 h-6 text-success ml-2" />
                )}
                {isSubmitted &&
                  attemptedAnswers.includes(index) &&
                  index !== selectedAnswer && (
                    <Icons.CircleX className="w-6 h-6 text-error ml-2" />
                  )}
              </li>
            ))}
          </ul>
          <div className="flex justify-between items-center">
            <div>
              {!isCorrect && isSubmitted ? (
                <div>
                  <div className="text-lg font-semibold text-error mb-2">
                    Incorrect. Try again!
                  </div>
                  {/* Use flexbox to align buttons horizontally */}
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={handleSubmit}
                      className="btn btn-sm btn-primary"
                      disabled={readerSelectedAnswer === null}
                    >
                      Try Again
                    </button>
                    {showHintButton && !isCorrect && (
                      <button
                        onClick={handleHintButtonClick}
                        className="btn btn-sm btn-outline btn-secondary flex items-center"
                      >
                        <Icons.Lightbulb className="w-4 h-4" />
                        <span className="pr-1">Hint</span>
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                !isCorrect && (
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={handleSubmit}
                      className="btn btn-sm btn-primary"
                      disabled={readerSelectedAnswer === null}
                    >
                      Submit Answer
                    </button>
                    {showHintButton && !isCorrect && (
                      <button
                        onClick={handleHintButtonClick}
                        className="btn btn-sm btn-outline btn-secondary flex items-center"
                      >
                        <Icons.Lightbulb className="w-4 h-4" />
                        <span className="pr-1">Hint</span>
                      </button>
                    )}
                  </div>
                )
              )}

              {isCorrect && (
                <div>
                  <div className="text-lg font-semibold text-success mb-2">
                    Correct!
                  </div>
                  <button
                    onClick={handleClearSubmission}
                    className="btn btn-sm btn-secondary"
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>
          </div>

          {showHint && (
            <HintComponent
              mcqId={node.attrs.id}
              show={showHint}
              onClose={handleHintButtonClick}
              question={question}
              attemptedAnswers={attemptedAnswers.map((index) => answers[index])}
              remainingAnswers={answers.filter(
                (_: any, index: number) => !attemptedAnswers.includes(index)
              )}
            />
          )}
        </div>
      )}
    </NodeViewWrapper>
  );
};

export default MCQComponent;
