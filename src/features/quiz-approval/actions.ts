"use server";

import { revalidatePath } from "next/cache";
import { QuizApprovalService } from "@/src/features/quiz-approval/services/quiz-approval-service";
import { FetchQuizApprovalsParams } from "@/src/features/quiz-approval/types/quiz-approval";

export type { QuizApproval, QuizApprovalResponse } from "@/src/features/quiz-approval/types/quiz-approval";

export async function fetchQuizApprovals(params: FetchQuizApprovalsParams) {
  return QuizApprovalService.fetchQuizApprovals(params);
}

export async function fetchQuizApprovalById(id: string) {
  return QuizApprovalService.fetchQuizApprovalById(id);
}

export async function approveQuizAction(id: string) {
  const result = await QuizApprovalService.approveQuiz(id);
  if (!result.error) {
    revalidatePath("/quiz-approval");
  }
  return result;
}

export async function rejectQuizAction(id: string, reason?: string) {
  const result = await QuizApprovalService.rejectQuiz(id, reason);
  if (!result.error) {
    revalidatePath("/quiz-approval");
  }
  return result;
}

