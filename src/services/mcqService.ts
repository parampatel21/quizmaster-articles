// services/mcqService.ts

export const deleteMCQFromDatabase = async (mcqId: string): Promise<void> => {
  try {
    const response = await fetch(`/api/mcq/${mcqId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Failed to delete MCQ: ${response.statusText}`);
    }

    console.log("MCQ deleted successfully");
  } catch (error) {
    console.error("Error deleting MCQ:", error);
    throw error;
  }
};

export const submitMCQAnswer = async (
  mcqId: string,
  selectedAnswerText: string,
  isCorrect: boolean
): Promise<void> => {
  try {
    const response = await fetch(`/api/mcq/${mcqId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        selected_answer: selectedAnswerText,
        is_correct: isCorrect,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to submit answer");
    }
  } catch (error) {
    console.error("Error submitting answer:", error);
    throw error;
  }
};
