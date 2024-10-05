/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useRef, useContext } from "react";
import { NodeViewWrapper } from "@tiptap/react";
import * as Icons from "@/components/ui/Icons";
import { EditorModeContext } from "@/context/EditorModeContext";

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
  const [isSelected, setIsSelected] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [localSelectedAnswer, setLocalSelectedAnswer] = useState<number | null>(
    selectedAnswer
  );
  const [readerSelectedAnswer, setReaderSelectedAnswer] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const newAnswerInputRef = useRef<HTMLInputElement | null>(null);
  const { setAllMCQsFinalized, isInstructor } = useContext(EditorModeContext);
  const [attemptedAnswers, setAttemptedAnswers] = useState<number[]>([]);
  const [isCorrect, setIsCorrect] = useState(false);

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

  const handleKeyDown = (e: KeyboardEvent) => {
    const target = e.target as HTMLElement | null;
    if (
      isSelected &&
      ["Delete", "Backspace"].includes(e.key) &&
      !(target instanceof HTMLInputElement)
    ) {
      deleteNode();
    } else if (
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

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (
      !(
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLButtonElement
      )
    ) {
      setIsSelected(true);
    }
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
      console.log(`Submitted answer: ${readerSelectedAnswer}`);
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
        isSelected && isInstructor ? "border-success" : "border-base-300"
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
                      name="mcq-finalized"
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
              <button onClick={editMCQ} className="btn btn-sm btn-accent">
                Edit
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="p-4 rounded-md shadow">
              {errorMessage && (
                <div role="alert" className="alert alert-error mb-4">
              <Icons.CircleX/>
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
              <Icons.CircleX/>
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
                {isSubmitted && attemptedAnswers.includes(index) && index !== selectedAnswer && (
                  <Icons.CircleX className="w-6 h-6 text-error ml-2" />
                )}
              </li>
            ))}
          </ul>
          {!isSubmitted ? (
            <button onClick={handleSubmit} className="btn btn-sm btn-primary" disabled={readerSelectedAnswer === null}>
              Submit Answer
            </button>
          ) : isCorrect ? (
            <div>
              <div className="text-lg font-semibold text-success mb-2">
                Correct!
              </div>
              <button onClick={handleClearSubmission} className="btn btn-sm btn-secondary">
                Clear
              </button>
            </div>
          ) : (
            <div>
              <div className="text-lg font-semibold text-error mb-2">
                Incorrect. Try again!
              </div>
              <button onClick={handleSubmit} className="btn btn-sm btn-primary" disabled={readerSelectedAnswer === null}>
                Submit Answer
              </button>
            </div>
          )}
        </div>
      )}
    </NodeViewWrapper>
  );

};

export default MCQComponent;
