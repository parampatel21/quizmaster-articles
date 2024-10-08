import { NextResponse } from "next/server";
import {
  getSubmissionsByMcqId,
  insertSubmission,
  deleteSubmissionsByMcqId,
} from "@/services/mcqAPIDBService";
import { ApiError, handleError } from "@/utils/apiErrorHandler";
import { validateSubmission } from "@/utils/validation";
import { MCQSubmission } from "@/types/mcqTypes";

// GET: Retrieve MCQ submissions
export async function GET(
  req: Request,
  { params }: { params: { mcq_id: string } }
) {
  try {
    const submissions = await getSubmissionsByMcqId(params.mcq_id);

    if (!submissions.length) {
      throw new ApiError(
        `No submissions found for mcq_id: ${params.mcq_id}`,
        404
      );
    }

    return NextResponse.json({ submissions }, { status: 200 });
  } catch (error) {
    console.error("Error retrieving submissions:", error);
    return handleError(new ApiError("Failed to retrieve submissions"));
  }
}

// DELETE: Delete MCQ submissions
export async function DELETE(
  req: Request,
  { params }: { params: { mcq_id: string } }
) {
  try {
    const deletedRows = await deleteSubmissionsByMcqId(params.mcq_id);

    if (deletedRows === 0) {
      return NextResponse.json(
        {
          success: true,
          message: `No submissions found for mcq_id: ${params.mcq_id}`,
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: `MCQ submissions deleted for mcq_id: ${params.mcq_id}`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting MCQ submissions:", error);
    return handleError(new ApiError("Failed to delete MCQ submissions"));
  }
}

// POST: Submit MCQ answer
export async function POST(
  req: Request,
  { params }: { params: { mcq_id: string } }
) {
  try {
    const data: MCQSubmission = await req.json();

    // Zod validation
    const validation = validateSubmission(data);
    if (!validation.success) {
      throw new ApiError(validation.error.message, 400);
    }

    const { selected_answer, is_correct } = validation.data;

    await insertSubmission(params.mcq_id, selected_answer, is_correct);

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Error submitting MCQ answer:", error);
    return handleError(new ApiError("Failed to submit answer"));
  }
}
