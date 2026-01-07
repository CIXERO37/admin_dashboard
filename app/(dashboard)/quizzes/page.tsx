import { Suspense } from "react";
import { QuizTable } from "./quiz-table";
import { fetchQuizzes } from "./actions";
import { Skeleton } from "@/components/ui/skeleton";

interface PageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    category?: string;
    visibility?: string;
    status?: string;
  }>;
}

export default async function MasterQuizPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const search = params.search || "";
  const category = params.category || "all";
  const visibility = params.visibility || "all";
  const status = params.status || "all";

  const { data, totalPages, categories } = await fetchQuizzes({
    page,
    limit: 15,
    search,
    category,
    visibility,
    status,
  });

  return (
    <Suspense fallback={<QuizTableSkeleton />}>
      <QuizTable
        initialData={data}
        totalPages={totalPages}
        currentPage={page}
        categories={categories}
        searchQuery={search}
        categoryFilter={category}
        visibilityFilter={visibility}
        statusFilter={status}
      />
    </Suspense>
  );
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
