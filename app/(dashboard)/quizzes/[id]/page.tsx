import { notFound } from "next/navigation";
import { fetchQuizById, fetchQuizSessions } from "../actions";
import { QuizDetailView } from "./quiz-detail-view";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function QuizDetailPage({ params }: PageProps) {
  const { id } = await params;

  const [quizResult, sessions] = await Promise.all([
    fetchQuizById(id),
    fetchQuizSessions(id),
  ]);

  if (quizResult.error || !quizResult.data) {
    notFound();
  }

  return <QuizDetailView quiz={quizResult.data as any} sessions={sessions} />;
}
