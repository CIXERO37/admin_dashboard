"use client"

import { Search, FileQuestion, Calendar, Eye } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { useState, useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"

import { cn, getAvatarUrl } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { type QuizApproval } from "./actions"

interface QuizApprovalTableProps {
  initialData: QuizApproval[]
  totalPages: number
  currentPage: number
  totalCount: number
  searchQuery: string
}

function QuizCard({ quiz }: { quiz: QuizApproval }) {
  const questionsCount = Array.isArray(quiz.questions) ? quiz.questions.length : 0
  const coverUrl = quiz.cover_image || quiz.image_url
  const creatorInitials = (quiz.creator?.fullname || "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-lg transition-all duration-300 hover:shadow-xl hover:border-primary/50">
      {/* Cover Image */}
      <div
        className="relative h-32 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent"
        style={
          coverUrl
            ? {
                backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.4)), url(${coverUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : undefined
        }
      >
        {/* Category & Status Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <Badge
            variant="outline"
            className="text-[10px] font-semibold px-2 py-0.5 bg-black/60 text-white border-white/20"
          >
            {quiz.category?.toUpperCase() || "UNCATEGORIZED"}
          </Badge>
          <Badge
            variant="outline"
            className="text-[10px] font-semibold px-2 py-0.5 bg-yellow-500/90 text-white border-yellow-500"
          >
            PENDING
          </Badge>
        </div>

        {/* Questions Count */}
        <div className="absolute bottom-3 right-3">
          <Badge variant="secondary" className="gap-1 bg-black/50 text-white border-0">
            <FileQuestion className="h-3 w-3" />
            {questionsCount} Questions
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 space-y-3">
        {/* Title */}
        <h3 className="font-bold text-base text-foreground line-clamp-2" title={quiz.title}>
          {quiz.title}
        </h3>

        {/* Creator Info */}
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8 border border-border">
            <AvatarImage src={getAvatarUrl(quiz.creator?.avatar_url)} alt={quiz.creator?.fullname || ""} />
            <AvatarFallback className="bg-muted text-muted-foreground text-xs font-medium">
              {creatorInitials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground truncate" title={quiz.creator?.fullname || "Unknown"}>
              {quiz.creator?.fullname || "Unknown"}
            </p>
            <p className="text-xs text-muted-foreground truncate" title={`@${quiz.creator?.username || "-"}`}>
              @{quiz.creator?.username || "-"}
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-border/50 bg-muted/30">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            <span>
              {quiz.created_at
                ? formatDistanceToNow(new Date(quiz.created_at), { addSuffix: true })
                : "-"}
            </span>
          </div>
          <span className="uppercase text-[10px] font-medium">{quiz.language || "ID"}</span>
        </div>

        {/* Review Button */}
        <Button
          className="w-full gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium cursor-pointer"
          size="sm"
          asChild
        >
          <Link href={`/support/quiz/${quiz.id}`}>
            <Eye className="h-4 w-4" />
            Review Quiz
          </Link>
        </Button>
      </div>
    </div>
  )
}

export function QuizApprovalTable({
  initialData,
  totalPages,
  currentPage,
  totalCount,
  searchQuery,
}: QuizApprovalTableProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [searchInput, setSearchInput] = useState(searchQuery)

  const updateUrl = (params: Record<string, string | number>) => {
    const newParams = new URLSearchParams(searchParams.toString())

    Object.entries(params).forEach(([key, value]) => {
      if (value && value !== "") {
        newParams.set(key, String(value))
      } else {
        newParams.delete(key)
      }
    })

    startTransition(() => {
      router.push(`?${newParams.toString()}`)
    })
  }

  const handleSearch = () => {
    updateUrl({ search: searchInput, page: 1 })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const handlePageChange = (page: number) => {
    updateUrl({ page, search: searchQuery })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Quiz Approval</h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Input
              placeholder="Search quiz..."
              className="pr-10 w-64 bg-background border-border"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              onClick={handleSearch}
              disabled={isPending}
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 flex items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors cursor-pointer"
            >
              <Search className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Quiz Cards Grid */}
      <div className={isPending ? "opacity-60 pointer-events-none" : ""}>
        {initialData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {initialData.map((quiz) => (
              <QuizCard key={quiz.id} quiz={quiz} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-border rounded-lg">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
              <FileQuestion className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-base font-medium text-foreground mb-1">
              No quizzes pending approval
            </h3>
            <p className="text-sm text-muted-foreground">
              {searchQuery
                ? "No quizzes match your search"
                : "All quizzes have been reviewed"}
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 0 && (
        <div className="flex items-center justify-between rounded-xl border border-border bg-card px-6 py-4">
          <div className="text-sm text-muted-foreground">
            Page <span className="font-medium text-foreground">{currentPage}</span> of{" "}
            <span className="font-medium text-foreground">{totalPages || 1}</span>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || isPending}
                className={cn(
                  "px-3 py-1.5 text-sm font-medium rounded-lg border transition-colors",
                  currentPage === 1 || isPending
                    ? "border-border bg-secondary/50 text-muted-foreground cursor-not-allowed"
                    : "border-border bg-card text-foreground hover:bg-secondary/80 cursor-pointer"
                )}
              >
                Previous
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let page = i + 1
                  if (totalPages > 5) {
                    if (currentPage > 3) page = currentPage - 2 + i
                    if (currentPage > totalPages - 2) page = totalPages - 4 + i
                  }
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      disabled={isPending}
                      className={cn(
                        "w-9 h-9 text-sm font-medium rounded-lg border transition-colors cursor-pointer",
                        currentPage === page
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-card text-foreground hover:bg-secondary/80"
                      )}
                    >
                      {page}
                    </button>
                  )
                })}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || isPending}
                className={cn(
                  "px-3 py-1.5 text-sm font-medium rounded-lg border transition-colors",
                  currentPage === totalPages || isPending
                    ? "border-border bg-secondary/50 text-muted-foreground cursor-not-allowed"
                    : "border-border bg-card text-foreground hover:bg-secondary/80 cursor-pointer"
                )}
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
