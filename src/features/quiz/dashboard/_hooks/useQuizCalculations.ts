import { isSameYear, subYears } from "date-fns";
import { Quiz } from "@/src/features/quizzes/actions";

export function useQuizCalculations(quizzes: Quiz[], timeRange: string) {
    const checkDate = (dateStr: string | null | undefined, range: string) => {
    if (range === "all") return true;
    if (!dateStr) return false;

    const date = new Date(dateStr);
    const now = new Date();

    if (range === "this-year") {
      return isSameYear(date, now);
    }
    if (range === "last-year") {
      return isSameYear(date, subYears(now, 1));
    }
    return true;
  };

  const filteredQuizzes = quizzes.filter((quiz) =>
    checkDate(quiz.created_at, timeRange),
  );

  const pendingQuizzes = filteredQuizzes.filter(
    (q) => q.request === true,
  ).length;

  // Statistics Calculation
  const totalQuizzes = filteredQuizzes.length;
  const publicQuizzes = filteredQuizzes.filter((q) => q.is_public).length;
  const privateQuizzes = totalQuizzes - publicQuizzes;

  const totalQuestions = filteredQuizzes.reduce((acc, quiz) => {
    const qCount = Array.isArray(quiz.questions) ? quiz.questions.length : 0;
    return acc + qCount;
  }, 0);

  const avgQuestions =
    totalQuizzes > 0 ? Math.round(totalQuestions / totalQuizzes) : 0;

  return {
    filteredQuizzes,
    pendingQuizzes,
    totalQuizzes,
    publicQuizzes,
    privateQuizzes,
    totalQuestions,
    avgQuestions,
  }
}