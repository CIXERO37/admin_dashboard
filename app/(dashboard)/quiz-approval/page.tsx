import { fetchQuizApprovals } from "./actions"
import { QuizApprovalTable } from "./quiz-approval-table"

interface PageProps {
  searchParams: Promise<{
    page?: string
    search?: string
  }>
}

export default async function SupportQuizPage({ searchParams }: PageProps) {
  const params = await searchParams
  const page = Number(params.page) || 1
  const search = params.search || ""

  const { data, totalPages, totalCount } = await fetchQuizApprovals({
    page,
    limit: 10,
    search,
  })

  return (
    <QuizApprovalTable
      initialData={data}
      totalPages={totalPages}
      currentPage={page}
      totalCount={totalCount}
      searchQuery={search}
    />
  )
}
