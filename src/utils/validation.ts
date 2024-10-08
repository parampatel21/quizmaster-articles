import { z } from "zod";
import { MCQSubmission } from "@/types";

const submissionSchema = z.object({
  selected_answer: z.string().min(1, "Selected answer is required"),
  is_correct: z.boolean(),
});

export function validateSubmission(data: MCQSubmission) {
  return submissionSchema.safeParse(data);
}

export const mcqSchema = z.object({
  question: z.string().min(1, { message: "The question must be filled in." }),
  answers: z
    .array(z.string().min(1, { message: "An answer must be filled in." }))
    .min(1, { message: "At least one answer is required." }),
  selectedAnswer: z
    .number()
    .nullable()
    .refine((val) => val !== null, {
      message: "A correct answer must be selected.",
    }),
});
