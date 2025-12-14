"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { format } from "date-fns"
import {
  CheckCircle,
  XCircle,
  User,
  Calendar,
  FileQuestion,
  Globe,
  Tag,
  Mail,
} from "lucide-react"

import { cn, getAvatarUrl } from "@/lib/utils"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import {
  type QuizApproval,
  fetchQuizApprovalById,
  approveQuizAction,
  rejectQuizAction,
} from "../actions"

interface PageProps {
  params: Promise<{ id: string }>
}

export default function QuizApprovalDetailPage({ params }: PageProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [quiz, setQuiz] = useState<QuizApproval | null>(null)
  const [loading, setLoading] = useState(true)
  const [quizId, setQuizId] = useState<string>("")

  const [approveDialog, setApproveDialog] = useState(false)
  const [rejectDialog, setRejectDialog] = useState(false)
  const [rejectReason, setRejectReason] = useState("")
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    async function loadQuiz() {
      const { id } = await params
      setQuizId(id)
      const { data, error } = await fetchQuizApprovalById(id)
      if (error || !data) {
        toast({ title: "Error", description: "Quiz not found", variant: "destructive" })
        router.push("/support/quiz")
        return
      }
      setQuiz(data)
      setLoading(false)
    }
    loadQuiz()
  }, [params, router, toast])

  const handleApprove = async () => {
    setProcessing(true)
    const { error } = await approveQuizAction(quizId)
    if (error) {
      toast({ title: "Error", description: "Failed to approve quiz", variant: "destructive" })
    } else {
      toast({ title: "Success", description: "Quiz has been approved and published" })
      router.push("/support/quiz")
    }
    setProcessing(false)
    setApproveDialog(false)
  }

  const handleReject = async () => {
    setProcessing(true)
    const { error } = await rejectQuizAction(quizId, rejectReason)
    if (error) {
      toast({ title: "Error", description: "Failed to reject quiz", variant: "destructive" })
    } else {
      toast({ title: "Success", description: "Quiz has been rejected" })
      router.push("/support/quiz")
    }
    setProcessing(false)
    setRejectDialog(false)
    setRejectReason("")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  if (!quiz) return null

  const questions = Array.isArray(quiz.questions) ? quiz.questions : []

  return (
    <div className="space-y-6">
      {/* Header with Breadcrumb */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/support/quiz">Quiz Approval</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="max-w-[200px] truncate">{quiz.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="gap-2 border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-400 cursor-pointer transition-all duration-200 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950 dark:hover:text-red-300"
              onClick={() => setRejectDialog(true)}
            >
              <XCircle className="h-4 w-4" />
              Reject
            </Button>
            <Button
              className="gap-2 bg-emerald-500 hover:bg-emerald-600 shadow-sm hover:shadow-md cursor-pointer transition-all duration-200"
              onClick={() => setApproveDialog(true)}
            >
              <CheckCircle className="h-4 w-4" />
              Approve
            </Button>
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-foreground">Review Quiz</h1>
          <p className="text-sm text-muted-foreground">
            Review the quiz content before approving
          </p>
        </div>
      </div>

      {/* Quiz Info Card */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {/* Cover Image */}
        {(quiz.cover_image || quiz.image_url) && (
          <div
            className="h-48 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent"
            style={{
              backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.3)), url(${quiz.cover_image || quiz.image_url})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        )}
        
        <div className="p-6 space-y-6">
          {/* Title & Status */}
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold text-foreground">{quiz.title}</h2>
              {quiz.description && (
                <p className="text-muted-foreground">{quiz.description}</p>
              )}
            </div>
            <Badge
              variant="outline"
              className="bg-yellow-500/10 text-yellow-600 border-yellow-500/30"
            >
              Pending Approval
            </Badge>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {/* Creator */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                Creator
              </div>
              {quiz.creator ? (
                <Link 
                  href={`/profiles/${quiz.creator.id}`}
                  className="flex items-center gap-3"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={getAvatarUrl(quiz.creator.avatar_url)} />
                    <AvatarFallback>{quiz.creator.fullname?.[0] ?? "?"}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm hover:text-primary transition-colors">{quiz.creator.fullname}</p>
                    <p className="text-xs text-muted-foreground">@{quiz.creator.username}</p>
                  </div>
                </Link>
              ) : (
                <p className="text-foreground">Unknown</p>
              )}
            </div>

            {/* Category */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Tag className="h-4 w-4" />
                Category
              </div>
              <p className="font-medium capitalize">{quiz.category || "-"}</p>
            </div>

            {/* Language */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Globe className="h-4 w-4" />
                Language
              </div>
              <p className="font-medium uppercase">{quiz.language || "ID"}</p>
            </div>

            {/* Created */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Created
              </div>
              <p className="font-medium">
                {quiz.created_at
                  ? format(new Date(quiz.created_at), "dd MMM yyyy, HH:mm")
                  : "-"}
              </p>
            </div>
          </div>

          {/* Creator Contact */}
          {quiz.creator?.email && (
            <div className="p-4 rounded-lg bg-muted/50 flex items-center gap-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Creator Email</p>
                <p className="font-medium">{quiz.creator.email}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Questions Section */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="p-4 border-b border-border bg-secondary/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileQuestion className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">
              Questions ({questions.length})
            </h3>
          </div>
        </div>

        {questions.length > 0 ? (
          <div className="divide-y divide-border">
            {questions.map((question: unknown, index: number) => {
              const q = question as {
                question?: string
                text?: string
                options?: (string | { id?: string; answer?: string; image?: string })[]
                answers?: (string | { id?: string; answer?: string; image?: string })[]
                correct_answer?: number | string
                correctAnswer?: number | string
                correct?: number | string
              }
              const questionText = q.question || q.text || "-"
              const options = q.options || q.answers || []
              const correctAnswerValue = q.correct_answer ?? q.correctAnswer ?? q.correct

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
                          typeof option === "string" ? option : option?.answer || "-"
                        const optionId = typeof option === "object" ? option?.id : null
                        const isCorrect =
                          correctAnswerValue === optIndex || correctAnswerValue === optionId

                        return (
                          <div
                            key={optIndex}
                            className={cn(
                              "p-2 rounded-lg text-sm flex items-center gap-2",
                              isCorrect
                                ? "bg-green-500/10 text-green-600 border border-green-500/30"
                                : "bg-secondary/50 text-muted-foreground"
                            )}
                          >
                            <span className="font-medium">
                              {String.fromCharCode(65 + optIndex)}.
                            </span>
                            <span className="flex-1">{optionText}</span>
                            {isCorrect && (
                              <Badge className="bg-green-500/20 text-green-600 border-green-500/30">
                                Correct
                              </Badge>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          <div className="p-8 text-center text-muted-foreground">
            No questions in this quiz
          </div>
        )}
      </div>

      {/* Approve Dialog */}
      <Dialog open={approveDialog} onOpenChange={setApproveDialog}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle className="text-green-600">Approve Quiz</DialogTitle>
            <DialogDescription>
              Are you sure you want to approve <strong>{quiz.title}</strong>? This quiz will be
              published and visible to all users.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setApproveDialog(false)}
              disabled={processing}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={handleApprove}
              disabled={processing}
              className="bg-green-600 hover:bg-green-700 cursor-pointer"
            >
              {processing ? "Processing..." : "Approve & Publish"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={rejectDialog} onOpenChange={setRejectDialog}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle className="text-red-500">Reject Quiz</DialogTitle>
            <DialogDescription>
              Are you sure you want to reject <strong>{quiz.title}</strong>? The creator will be
              notified about the rejection.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2 py-4">
            <Label htmlFor="reason">Rejection Reason (Optional)</Label>
            <Textarea
              id="reason"
              placeholder="Explain why this quiz is being rejected..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setRejectDialog(false)
                setRejectReason("")
              }}
              disabled={processing}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={processing}
              className="cursor-pointer"
            >
              {processing ? "Processing..." : "Reject Quiz"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
