import { z } from "zod";
import { MCQSubmission } from "@/types";

const submissionSchema = z.object({
  selected_answer: z.string().min(1, "Selected answer is required"),
  is_correct: z.boolean(),
});

export function validateSubmission(data: MCQSubmission) {
  return submissionSchema.safeParse(data);
}
