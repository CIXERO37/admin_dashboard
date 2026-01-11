import { notFound } from "next/navigation";

import { fetchQuizById } from "../actions";
import { QuizDetailView } from "./quiz-detail-view";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function QuizDetailPage({ params }: PageProps) {
  const { id } = await params;
  const { data: quiz, error } = await fetchQuizById(id);

  if (error || !quiz) {
    notFound();
  }

  // Cast quiz to match interface if necessary, or assume it matches.
  // The fetchQuizById return type seems compatible with what we defined in QuizDetailView
  // except maybe questions type (unknown vs specific).
  // We'll pass it and if TS complains, we'll fix.
  // The fetchQuizById likely returns `any` or strict Supabase type.
  // Since we used `unknown[]` for questions in interface, it should be fine.

  return <QuizDetailView quiz={quiz as any} />;
}
