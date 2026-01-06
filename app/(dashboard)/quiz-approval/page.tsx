import { fetchQuizApprovals } from "./actions";
import { QuizApprovalTable } from "./quiz-approval-table";

interface PageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    category?: string;
  }>;
}

export default async function SupportQuizPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const search = params.search || "";
  const category = params.category || "all";

  const { data, totalPages, totalCount, categories } = await fetchQuizApprovals(
    {
      page,
      limit: 8,
      search,
      category,
    }
  );

  return (
    <QuizApprovalTable
      initialData={data}
      totalPages={totalPages}
      currentPage={page}
      totalCount={totalCount}
      searchQuery={search}
      categories={categories}
      categoryFilter={category}
    />
  );
}
