// components/extensions/mcq/instructor/MCQInstructorView.tsx

import React from "react";
import { MCQInstructorViewProps } from "@/types/mcqTypes";
import useMCQInstructor from "./useMCQInstructor";
import FinalizedMCQView from "./FinalizedMCQView";
import EditableMCQForm from "./EditableMCQForm";

const MCQInstructorView = ({
  attrs,
  updateAttributes,
}: MCQInstructorViewProps) => {
  const {
    errorMessage,
    localSelectedAnswer,
    newAnswerInputRef,
    showHistory,
    localShowHintButton,
    handleInputChange,
    addAnswer,
    removeAnswer,
    handleSelectAnswer,
    handleShowHintToggle,
    handleHistoryButtonClick,
    editMCQ,
    finalizeMCQ,
  } = useMCQInstructor(attrs, updateAttributes);

  const { question, answers, isFinalized, selectedAnswer, id } = attrs;

  return isFinalized ? (
    <FinalizedMCQView
      question={question}
      answers={answers}
      selectedAnswer={selectedAnswer}
      id={id}
      localShowHintButton={localShowHintButton}
      handleShowHintToggle={handleShowHintToggle}
      handleHistoryButtonClick={handleHistoryButtonClick}
      showHistory={showHistory}
      editMCQ={editMCQ}
    />
  ) : (
    <EditableMCQForm
      question={question}
      answers={answers}
      localSelectedAnswer={localSelectedAnswer}
      newAnswerInputRef={newAnswerInputRef}
      errorMessage={errorMessage}
      handleInputChange={handleInputChange}
      handleSelectAnswer={handleSelectAnswer}
      removeAnswer={removeAnswer}
      addAnswer={addAnswer}
      finalizeMCQ={finalizeMCQ}
      updateAttributes={updateAttributes}
    />
  );
};

export default MCQInstructorView;
