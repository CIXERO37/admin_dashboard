import { fetchGameSessions } from "./actions";
import { GameSessionsTable } from "./game-sessions-table";

interface PageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    status?: string;
    application?: string;
    questions?: string;
    duration?: string;
    sort?: string;
    category?: string;
  }>;
}

export default async function GameSessionsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const search = params.search || "";
  const status = params.status || "all";
  const application = params.application || "all";
  const questions = params.questions || "all";
  const duration = params.duration || "all";
  const sort = params.sort || "newest";
  const category = params.category || "all";

  const { data, totalPages, currentPage, totalCount } = await fetchGameSessions(
    {
      page,
      pageSize: 15,
      search,
      status,
      application,
      questions,
      duration,
      sort,
      category,
    }
  );

  return (
    <GameSessionsTable
      initialData={data}
      totalPages={totalPages}
      currentPage={currentPage}
      totalCount={totalCount}
      searchQuery={search}
      currentStatus={status}
      currentApplication={application}
      currentQuestions={questions}
      currentDuration={duration}
      currentSort={sort}
      currentCategory={category}
    />
  );
}
