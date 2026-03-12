"use client";

import { QuizTable } from "./quiz-table";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardData } from "@/contexts/dashboard-store";

export default function MasterQuizPage() {
  const { quizzes, isLoading } = useDashboardData();

  if (isLoading && quizzes.length === 0) {
    return <QuizTableSkeleton />;
  }

  return <QuizTable initialData={quizzes} />;
}

function QuizTableSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-9 w-32" />
        <div className="flex gap-3">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-36" />
          <Skeleton className="h-10 w-36" />
          <Skeleton className="h-10 w-36" />
        </div>
      </div>
      <Skeleton className="h-[600px] w-full rounded-xl" />
    </div>
  );
}
