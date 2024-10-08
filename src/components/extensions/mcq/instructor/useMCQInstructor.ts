// custom hook for managing mcq logic in instructor mode

import { useState, useRef, useEffect } from 'react';
import { MCQAttributes } from '@/types/mcqTypes';
import { z } from 'zod';
import { mcqSchema } from '@/utils/validation';

const useMCQInstructor = (
  attrs: MCQAttributes,
  updateAttributes: (attrs: Partial<MCQAttributes>) => void
) => {
  const { question, answers, selectedAnswer, showHintButton } = attrs;

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
    updateAttributes({ answers: [...answers, ''] });
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
        setErrorMessage('An unexpected error occurred.');
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

  return {
    // State and Refs
    errorMessage,
    localSelectedAnswer,
    newAnswerInputRef,
    showHistory,
    localShowHintButton,
    // Handlers
    handleInputChange,
    addAnswer,
    removeAnswer,
    handleSelectAnswer,
    handleShowHintToggle,
    handleHistoryButtonClick,
    editMCQ,
    finalizeMCQ,
    // Other
    setErrorMessage,
  };
};

export default useMCQInstructor;
