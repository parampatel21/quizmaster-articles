import React, { useState } from "react";
import { MCQReaderViewProps } from "@/types/mcqTypes";
import * as Icons from "@/components/ui/Icons";
import HintPane from "@/components/ui/HintPane";

const MCQReaderView = ({ attrs }: MCQReaderViewProps) => {
  const { question, answers, selectedAnswer, id, showHintButton } = attrs;
  const [errorMessage] = useState<string | null>(null);
  const [readerSelectedAnswer, setReaderSelectedAnswer] = useState<
    number | null
  >(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [attemptedAnswers, setAttemptedAnswers] = useState<number[]>([]);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const handleReaderSelectAnswer = (index: number) => {
    if (!attemptedAnswers.includes(index)) {
      setReaderSelectedAnswer(index);
    }
  };

  const submitAnswer = async () => {
    if (readerSelectedAnswer !== null) {
      const selectedAnswerText = answers[readerSelectedAnswer];
      const isCorrectAnswer = readerSelectedAnswer === selectedAnswer;
      setIsSubmitted(true);
      setAttemptedAnswers([...attemptedAnswers, readerSelectedAnswer]);
      setIsCorrect(isCorrectAnswer);

      try {
        const response = await fetch(`/api/mcq/${id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            selected_answer: selectedAnswerText,
            is_correct: isCorrectAnswer,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to submit answer");
        }
      } catch (error) {
        console.error("Error submitting answer:", error);
        // TODO: handle an error properly, can we use the error div we use in other MCQ modes?
      }
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
      submitAnswer();
    }
  };

  const handleHintButtonClick = () => {
    setShowHint((prev) => !prev);
  };

  const handleClearSubmission = () => {
    setIsSubmitted(false);
    setReaderSelectedAnswer(null);
    setAttemptedAnswers([]);
    setIsCorrect(false);
  };

  return (
    <div className="p-4 rounded-md shadow bg-base-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">{question}</h2>
      {errorMessage && (
        <div role="alert" className="alert alert-error mb-4">
          <Icons.CircleX />
          <span>{errorMessage}</span>
        </div>
      )}
      <ul className="my-2">
        {answers.map((answer, index) => (
          <li key={index} className="flex items-center gap-2 mb-6">
            <input
              type="radio"
              name={`mcq-reader-${id}`}
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
                    <span className="pr-1">Smart Hint</span>
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
                    <span className="pr-1">Smart Hint</span>
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
        <HintPane
          mcqId={id}
          show={showHint}
          onClose={handleHintButtonClick}
          question={question}
          attemptedAnswers={attemptedAnswers.map((index) => answers[index])}
          remainingAnswers={answers.filter(
            (_, index) => !attemptedAnswers.includes(index)
          )}
        />
      )}
    </div>
  );
};

export default MCQReaderView;
