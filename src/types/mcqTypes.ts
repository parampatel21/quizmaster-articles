export interface MCQSubmission {
  mcq_id: string;
  selected_answer: string;
  is_correct: boolean;
}

export interface MCQHintRequest {
  question: string;
  attemptedAnswers: string[];
  remainingAnswers: string[];
}
