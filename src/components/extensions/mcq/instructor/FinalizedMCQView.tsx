// displays the finalized mcq view for instructors

import React from 'react';
import SubmissionPane from '@/components/ui/SubmissionPane';

interface FinalizedMCQViewProps {
  question: string;
  answers: string[];
  selectedAnswer: number | null;
  id: string;
  localShowHintButton: boolean;
  handleShowHintToggle: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleHistoryButtonClick: () => void;
  showHistory: boolean;
  editMCQ: () => void;
}

const FinalizedMCQView: React.FC<FinalizedMCQViewProps> = ({
  question,
  answers,
  selectedAnswer,
  id,
  localShowHintButton,
  handleShowHintToggle,
  handleHistoryButtonClick,
  showHistory,
  editMCQ,
}) => (
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
            <span className="text-base font-medium text-gray-700">{answer}</span>
          </li>
        ))}
      </ul>
      <div className="flex justify-between items-center mt-4">
        <button onClick={editMCQ} className="btn btn-sm text-white btn-accent">
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
        <button onClick={handleHistoryButtonClick} className="btn btn-sm btn-neutral ml-auto">
          {showHistory ? 'Hide Submission History' : 'Submission History'}
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

export default FinalizedMCQView;
