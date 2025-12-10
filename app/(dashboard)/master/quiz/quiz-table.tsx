"use client"

import {
  Search,
  SlidersHorizontal,
  ChevronDown,
} from "lucide-react"
import { format } from "date-fns"
import { useState, useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"

import { DataTable } from "@/components/dashboard/data-table"
import { getAvatarUrl } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { Label } from "@/components/ui/label"
import { type Quiz, updateQuizVisibility, blockQuizAction } from "./actions"

const visibilityColors: Record<string, string> = {
  Publik: "bg-[var(--success)]/20 text-[var(--success)] border-[var(--success)]/30",
  Private: "bg-[var(--warning)]/20 text-[var(--warning)] border-[var(--warning)]/30",
}

const statusColors: Record<string, string> = {
  Active: "bg-blue-500/20 text-blue-500 border-blue-500/30",
  Block: "bg-red-500/20 text-red-500 border-red-500/30",
}

interface QuizTableProps {
  initialData: Quiz[]
  totalPages: number
  currentPage: number
  categories: string[]
  searchQuery: string
  categoryFilter: string
  visibilityFilter: string
}

export function QuizTable({
  initialData,
  totalPages,
  currentPage,
  categories,
  searchQuery,
  categoryFilter,
  visibilityFilter,
}: QuizTableProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()

  const [searchInput, setSearchInput] = useState(searchQuery)

  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean
    id: string
    currentValue: string
    newValue: string
    quizTitle: string
  }>({
    open: false,
    id: "",
    currentValue: "",
    newValue: "",
    quizTitle: "",
  })

  const [blockDialog, setBlockDialog] = useState<{
    open: boolean
    id: string
    quizTitle: string
    confirmText: string
  }>({
    open: false,
    id: "",
    quizTitle: "",
    confirmText: "",
  })

  const updateUrl = (params: Record<string, string | number>) => {
    const newParams = new URLSearchParams(searchParams.toString())
    
    Object.entries(params).forEach(([key, value]) => {
      if (value && value !== "all" && value !== "") {
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
    updateUrl({ page, search: searchQuery, category: categoryFilter, visibility: visibilityFilter })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const openConfirmDialog = (
    id: string,
    currentValue: string,
    newValue: string,
    quizTitle: string
  ) => {
    setConfirmDialog({ open: true, id, currentValue, newValue, quizTitle })
  }

  const handleConfirm = async () => {
    const { error } = await updateQuizVisibility(
      confirmDialog.id,
      confirmDialog.newValue === "Publik"
    )
    if (error) {
      toast({ title: "Error", description: "Gagal mengubah visibility", variant: "destructive" })
    } else {
      toast({ title: "Berhasil", description: "Visibility berhasil diubah" })
      router.refresh()
    }
    setConfirmDialog((prev) => ({ ...prev, open: false }))
  }

  const openBlockDialog = (id: string, quizTitle: string) => {
    setBlockDialog({ open: true, id, quizTitle, confirmText: "" })
  }

  const handleBlockQuiz = async () => {
    if (blockDialog.confirmText !== "Block") return

    const { error } = await blockQuizAction(blockDialog.id)
    if (error) {
      toast({ title: "Error", description: "Gagal memblokir quiz", variant: "destructive" })
    } else {
      toast({ title: "Berhasil", description: "Quiz berhasil diblokir" })
      router.refresh()
    }
    setBlockDialog((prev) => ({ ...prev, open: false, confirmText: "" }))
  }

  const columns = [
    {
      key: "title",
      label: "Title",
      render: (value: unknown) => (
        <span className="block max-w-[200px] truncate" title={value as string}>
          {value as string}
        </span>
      ),
    },
    {
      key: "creator",
      label: "Creator",
      render: (value: unknown) => {
        const creator = value as { username: string; fullname: string; avatar_url: string } | null
        if (!creator) return <span className="text-muted-foreground">-</span>
        return (
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8 flex-shrink-0">
              <AvatarImage src={getAvatarUrl(creator.avatar_url)} />
              <AvatarFallback>{creator.fullname?.[0] ?? "?"}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-medium truncate max-w-[120px]" title={creator.fullname}>
                {creator.fullname}
              </span>
              <span className="text-xs text-muted-foreground truncate max-w-[120px]" title={creator.username}>
                @{creator.username}
              </span>
            </div>
          </div>
        )
      },
    },
    {
      key: "category",
      label: "Category",
      render: (value: unknown) => {
        const category = capitalizeFirst(value as string)
        return <span className="block max-w-[120px] truncate" title={category}>{category}</span>
      },
    },
    { key: "questions", label: "Questions" },
    {
      key: "language",
      label: "Language",
      render: (value: unknown) => capitalizeFirst(value as string),
    },
    {
      key: "difficulty",
      label: "Visibility",
      render: (value: unknown, row: Record<string, unknown>) => {
        const visibility = value as string
        const id = row.id as string
        const quizTitle = row.title as string
        return (
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none">
              <div className="cursor-pointer hover:opacity-80 flex items-center">
                <Badge variant="outline" className={visibilityColors[visibility] ?? "bg-secondary text-secondary-foreground"}>
                  {visibility}
                </Badge>
                <ChevronDown className="ml-1.5 h-3 w-3 text-muted-foreground/50" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {visibility === "Publik" ? (
                <DropdownMenuItem onClick={() => openConfirmDialog(id, visibility, "Private", quizTitle)} className="cursor-pointer">
                  Private
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem onClick={() => openConfirmDialog(id, visibility, "Publik", quizTitle)} className="cursor-pointer">
                  Publik
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
    { key: "createdAt", label: "Created" },
    {
      key: "status",
      label: "Status",
      render: (value: unknown, row: Record<string, unknown>) => {
        const status = value as string
        const id = row.id as string
        const quizTitle = row.title as string
        return (
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none">
              <div className="cursor-pointer hover:opacity-80 flex items-center">
                <Badge variant="outline" className={statusColors[status] ?? "bg-secondary text-secondary-foreground"}>
                  {status}
                </Badge>
                <ChevronDown className="ml-1.5 h-3 w-3 text-muted-foreground/50" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {status === "Active" && (
                <DropdownMenuItem onClick={() => openBlockDialog(id, quizTitle)} className="cursor-pointer text-red-500 focus:text-red-500">
                  Block
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const tableData = initialData.map((quiz) => ({
    id: quiz.id,
    title: quiz.title,
    creator: quiz.creator,
    category: quiz.category ?? "-",
    questions: Array.isArray(quiz.questions) ? quiz.questions.length : 0,
    language: quiz.language ?? "ID",
    difficulty: quiz.is_public ? "Publik" : "Private",
    createdAt: quiz.created_at ? format(new Date(quiz.created_at), "dd MMM yyyy") : "-",
    status: quiz.status === "block" ? "Block" : "Active",
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Quiz Data</h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Cari quiz..."
                className="pl-10 w-64 bg-background border-border"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
            <Button size="icon" onClick={handleSearch} disabled={isPending}>
              <Search className="h-4 w-4" />
            </Button>
          </div>

          <Select
            value={categoryFilter}
            onValueChange={(value) => updateUrl({ category: value, page: 1 })}
          >
            <SelectTrigger className="w-36">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                <SelectValue placeholder="Category" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Category</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>{capitalizeFirst(cat)}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={visibilityFilter}
            onValueChange={(value) => updateUrl({ visibility: value, page: 1 })}
          >
            <SelectTrigger className="w-36">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                <SelectValue placeholder="Visibility" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="publik">Publik</SelectItem>
              <SelectItem value="private">Private</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="block">Block</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className={isPending ? "opacity-60 pointer-events-none" : ""}>
        <DataTable
          columns={columns}
          data={tableData as Record<string, unknown>[]}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          onRowClick={(row) => router.push(`/master/quiz/${row.id}`)}
        />
      </div>

      <Dialog open={confirmDialog.open} onOpenChange={(open) => setConfirmDialog((prev) => ({ ...prev, open }))}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Ubah Visibility Quiz</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin mengubah visibility quiz <strong>{confirmDialog.quizTitle}</strong> dari{" "}
              <strong>{confirmDialog.currentValue}</strong> menjadi <strong>{confirmDialog.newValue}</strong>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDialog((prev) => ({ ...prev, open: false }))}>Batal</Button>
            <Button onClick={handleConfirm}>Ya, Ubah</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={blockDialog.open} onOpenChange={(open) => setBlockDialog((prev) => ({ ...prev, open, confirmText: "" }))}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle className="text-destructive">Block Quiz</DialogTitle>
            <DialogDescription>
              Anda akan memblokir quiz <strong>{blockDialog.quizTitle}</strong>. Status quiz akan berubah menjadi block.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2 py-4">
            <Label htmlFor="confirmBlock">
              Ketik <strong className="text-destructive">Block</strong> untuk mengkonfirmasi
            </Label>
            <Input
              id="confirmBlock"
              value={blockDialog.confirmText}
              onChange={(e) => setBlockDialog((prev) => ({ ...prev, confirmText: e.target.value }))}
              placeholder="Ketik 'Block' di sini"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBlockDialog((prev) => ({ ...prev, open: false, confirmText: "" }))}>Batal</Button>
            <Button variant="destructive" onClick={handleBlockQuiz} disabled={blockDialog.confirmText !== "Block"}>Block Quiz</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function capitalizeFirst(str: string) {
  if (!str || str === "-") return str
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}
