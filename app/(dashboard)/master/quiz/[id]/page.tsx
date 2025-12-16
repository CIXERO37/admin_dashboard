import { notFound } from "next/navigation";
import { format } from "date-fns";

import { fetchQuizById } from "../actions";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAvatarUrl } from "@/lib/utils";
import { QuizBreadcrumb } from "./quiz-client";

interface PageProps {
  params: Promise<{ id: string }>;
}

const visibilityColors: Record<string, string> = {
  Publik:
    "bg-[var(--success)]/20 text-[var(--success)] border-[var(--success)]/30",
  Private:
    "bg-[var(--warning)]/20 text-[var(--warning)] border-[var(--warning)]/30",
};

const statusColors: Record<string, string> = {
  Active: "bg-blue-500/20 text-blue-500 border-blue-500/30",
  Block: "bg-red-500/20 text-red-500 border-red-500/30",
};

export default async function QuizDetailPage({ params }: PageProps) {
  const { id } = await params;
  const { data: quiz, error } = await fetchQuizById(id);

  if (error || !quiz) {
    notFound();
  }

  const visibility = quiz.is_public ? "Publik" : "Private";
  const status = quiz.status === "block" ? "Block" : "Active";
  const questions = Array.isArray(quiz.questions) ? quiz.questions : [];

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <QuizBreadcrumb title={quiz.title} />
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="p-6 space-y-6">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h2 className="text-2xl font-semibold text-foreground">
                {quiz.title}
              </h2>
              {quiz.description && (
                <p className="text-sm text-muted-foreground">
                  {quiz.description}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-6">
            {quiz.creator && (
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Creator</p>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={getAvatarUrl(quiz.creator.avatar_url)} />
                    <AvatarFallback>
                      {quiz.creator.fullname?.[0] ?? "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-foreground font-medium text-sm">
                      {quiz.creator.fullname}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      @{quiz.creator.username}
                    </p>
                  </div>
                </div>
              </div>
            )}
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Category</p>
              <p className="text-foreground font-medium capitalize">
                {quiz.category ?? "-"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Language</p>
              <p className="text-foreground font-medium uppercase">
                {quiz.language ?? "ID"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total Questions</p>
              <p className="text-foreground font-medium">{questions.length}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Visibility</p>
              <p className="text-foreground font-medium">{visibility}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Status</p>
              <p className="text-foreground font-medium">{status}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Created At</p>
              <p className="text-foreground font-medium">
                {quiz.created_at
                  ? format(new Date(quiz.created_at), "dd MMM yyyy, HH:mm")
                  : "-"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {questions.length > 0 && (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="p-4 border-b border-border bg-secondary/50">
            <h3 className="text-lg font-semibold text-foreground">
              Questions ({questions.length})
            </h3>
          </div>
          <div className="divide-y divide-border">
            {questions.map((question: unknown, index: number) => {
              const q = question as {
                question?: string;
                text?: string;
                options?: (
                  | string
                  | { id?: string; answer?: string; image?: string }
                )[];
                answers?: (
                  | string
                  | { id?: string; answer?: string; image?: string }
                )[];
                correct_answer?: number | string;
                correctAnswer?: number | string;
                correct?: number | string;
              };
              const questionText = q.question || q.text || "-";
              const options = q.options || q.answers || [];
              const correctAnswerValue =
                q.correct_answer ?? q.correctAnswer ?? q.correct;

              return (
                <div key={index} className="p-4 space-y-3">
                  <div className="flex gap-3">
                    <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 text-primary font-medium flex items-center justify-center text-sm">
                      {index + 1}
                    </span>
                    <p className="text-foreground pt-1">{questionText}</p>
                  </div>
                  {options.length > 0 && (
                    <div className="pl-11 space-y-2">
                      {options.map((option, optIndex: number) => {
                        const optionText =
                          typeof option === "string"
                            ? option
                            : option?.answer || "-";
                        const optionId =
                          typeof option === "object" ? option?.id : null;
                        const isCorrect =
                          correctAnswerValue === optIndex ||
                          correctAnswerValue === optionId;

                        return (
                          <div
                            key={optIndex}
                            className={`p-2 rounded-lg text-sm flex items-center gap-2 ${
                              isCorrect
                                ? "bg-[var(--success)]/10 text-[var(--success)] border border-[var(--success)]/30"
                                : "bg-secondary/50 text-muted-foreground"
                            }`}
                          >
                            <span className="font-medium">
                              {String.fromCharCode(65 + optIndex)}.
                            </span>
                            <span className="flex-1">{optionText}</span>
                            {isCorrect && (
                              <span className="text-xs font-medium bg-[var(--success)]/20 px-2 py-0.5 rounded">
                                Correct
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
