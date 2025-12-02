"use client";

import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  MoreVertical,
  Trash2,
} from "lucide-react";
import { format } from "date-fns";
import { useState, useMemo } from "react";

import { DataTable } from "@/components/dashboard/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import { useQuizzes } from "@/hooks/useQuizzes";

const visibilityColors: Record<string, string> = {
  Publik:
    "bg-[var(--success)]/20 text-[var(--success)] border-[var(--success)]/30",
  Private:
    "bg-[var(--warning)]/20 text-[var(--warning)] border-[var(--warning)]/30",
};

export default function MasterQuizPage() {
  const {
    data: quizzes,
    loading,
    error,
    updateQuiz,
    deleteQuiz,
  } = useQuizzes();
  const { toast } = useToast();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [visibilityFilter, setVisibilityFilter] = useState<string>("all");

  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    id: string;
    currentValue: string;
    newValue: string;
    quizTitle: string;
  }>({
    open: false,
    id: "",
    currentValue: "",
    newValue: "",
    quizTitle: "",
  });

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    id: string;
    quizTitle: string;
    confirmText: string;
  }>({
    open: false,
    id: "",
    quizTitle: "",
    confirmText: "",
  });

  const ITEMS_PER_PAGE = 15;

  const handleVisibilityUpdate = async (id: string, isPublic: boolean) => {
    const { error } = await updateQuiz(id, { is_public: isPublic });
    if (error) {
      toast({
        title: "Error",
        description: "Gagal mengubah visibility",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Berhasil",
        description: "Visibility berhasil diubah",
      });
    }
  };

  const openConfirmDialog = (
    id: string,
    currentValue: string,
    newValue: string,
    quizTitle: string
  ) => {
    setConfirmDialog({
      open: true,
      id,
      currentValue,
      newValue,
      quizTitle,
    });
  };

  const handleConfirm = async () => {
    await handleVisibilityUpdate(
      confirmDialog.id,
      confirmDialog.newValue === "Publik"
    );
    setConfirmDialog((prev) => ({ ...prev, open: false }));
  };

  const openDeleteDialog = (id: string, quizTitle: string) => {
    setDeleteDialog({
      open: true,
      id,
      quizTitle,
      confirmText: "",
    });
  };

  const handleDeleteQuiz = async () => {
    if (deleteDialog.confirmText !== "Delete") return;

    const { error } = await deleteQuiz(deleteDialog.id);

    if (error) {
      toast({
        title: "Error",
        description: "Gagal menghapus quiz",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Berhasil",
        description: "Quiz berhasil dihapus",
      });
      setDeleteDialog((prev) => ({ ...prev, open: false, confirmText: "" }));
    }
  };

  const categories = useMemo(() => {
    const cats = new Set<string>();
    quizzes.forEach((quiz) => {
      if (quiz.category) cats.add(quiz.category);
    });
    return Array.from(cats).sort();
  }, [quizzes]);

  const handleSearch = () => {
    setSearchQuery(searchInput.toLowerCase());
    setCurrentPage(1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

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
        const creator = value as {
          email: string;
          fullname: string;
          avatar_url: string;
        } | null;
        if (!creator) return <span className="text-muted-foreground">-</span>;
        return (
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8 flex-shrink-0">
              <AvatarImage src={creator.avatar_url ?? undefined} />
              <AvatarFallback>{creator.fullname?.[0] ?? "?"}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0">
              <span
                className="text-sm font-medium truncate max-w-[120px]"
                title={creator.fullname}
              >
                {creator.fullname}
              </span>
              <span
                className="text-xs text-muted-foreground truncate max-w-[120px]"
                title={creator.email}
              >
                {creator.email}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      key: "category",
      label: "Category",
      render: (value: unknown) => {
        const category = capitalizeFirst(value as string);
        return (
          <span className="block max-w-[120px] truncate" title={category}>
            {category}
          </span>
        );
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
        const visibility = value as string;
        const id = row.id as string;
        const quizTitle = row.title as string;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none">
              <div className="cursor-pointer hover:opacity-80 flex items-center">
                <Badge
                  variant="outline"
                  className={
                    visibilityColors[visibility] ??
                    "bg-secondary text-secondary-foreground"
                  }
                >
                  {visibility}
                </Badge>
                <ChevronDown className="ml-1.5 h-3 w-3 text-muted-foreground/50" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {visibility === "Publik" ? (
                <DropdownMenuItem
                  onClick={() =>
                    openConfirmDialog(id, visibility, "Private", quizTitle)
                  }
                  className="cursor-pointer"
                >
                  Private
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  onClick={() =>
                    openConfirmDialog(id, visibility, "Publik", quizTitle)
                  }
                  className="cursor-pointer"
                >
                  Publik
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
    { key: "createdAt", label: "Created" },
    {
      key: "action",
      label: "Action",
      render: (_: unknown, row: Record<string, unknown>) => {
        const quizTitle = row.title as string;
        const id = row.id as string;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none">
              <div className="cursor-pointer hover:opacity-80 p-1 rounded hover:bg-muted">
                <MoreVertical className="h-4 w-4 text-muted-foreground" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => openDeleteDialog(id, quizTitle)}
                className="cursor-pointer text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Hapus Quiz
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const tableData = useMemo(() => {
    let filtered = quizzes;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter((quiz) => {
        const searchableFields = [quiz.title, quiz.category];
        return searchableFields.some((field) =>
          field?.toLowerCase().includes(searchQuery)
        );
      });
    }

    // Apply category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter((quiz) => quiz.category === categoryFilter);
    }

    // Apply visibility filter
    if (visibilityFilter !== "all") {
      filtered = filtered.filter((quiz) => {
        const isVisible = quiz.is_public ? "publik" : "private";
        return isVisible === visibilityFilter;
      });
    }

    return filtered.map((quiz) => ({
      id: quiz.id,
      title: quiz.title,
      creator: quiz.creator,
      category: quiz.category ?? "-",
      questions: Array.isArray(quiz.questions) ? quiz.questions.length : 0,
      language: quiz.language ?? "ID",
      difficulty: quiz.is_public ? "Publik" : "Private",
      createdAt: quiz.created_at
        ? format(new Date(quiz.created_at), "dd MMM yyyy")
        : "-",
    }));
  }, [quizzes, searchQuery, categoryFilter, visibilityFilter]);

  // Pagination calculations
  const totalPages = Math.ceil(tableData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedData = tableData.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Quiz Data</h1>
          <p className="mt-1 text-muted-foreground">
            {quizzes.length} total quizzes
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-3">
          {/* Search */}
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
            <Button size="icon" onClick={handleSearch}>
              <Search className="h-4 w-4" />
            </Button>
          </div>

          {/* Category Filter */}
          <Select
            value={categoryFilter}
            onValueChange={(value) => {
              setCategoryFilter(value);
              setCurrentPage(1);
            }}
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
                <SelectItem key={cat} value={cat}>
                  {capitalizeFirst(cat)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Visibility Filter */}
          <Select
            value={visibilityFilter}
            onValueChange={(value) => {
              setVisibilityFilter(value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-36">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                <SelectValue placeholder="Visibility" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Visibility</SelectItem>
              <SelectItem value="publik">Publik</SelectItem>
              <SelectItem value="private">Private</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {error ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : (
        <DataTable
          columns={columns}
          data={loading ? [] : (paginatedData as Record<string, unknown>[])}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}

      {loading && (
        <p className="text-sm text-muted-foreground">Loading quizzes...</p>
      )}

      <Dialog
        open={confirmDialog.open}
        onOpenChange={(open) => setConfirmDialog((prev) => ({ ...prev, open }))}
      >
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Ubah Visibility Quiz</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin mengubah visibility quiz{" "}
              <strong>{confirmDialog.quizTitle}</strong> dari{" "}
              <strong>{confirmDialog.currentValue}</strong> menjadi{" "}
              <strong>{confirmDialog.newValue}</strong>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() =>
                setConfirmDialog((prev) => ({ ...prev, open: false }))
              }
            >
              Batal
            </Button>
            <Button onClick={handleConfirm}>Ya, Ubah</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={deleteDialog.open}
        onOpenChange={(open) => {
          setDeleteDialog((prev) => ({ ...prev, open, confirmText: "" }));
        }}
      >
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle className="text-destructive">Hapus Quiz</DialogTitle>
            <DialogDescription>
              Anda akan menghapus quiz <strong>{deleteDialog.quizTitle}</strong>
              . Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2 py-4">
            <Label htmlFor="confirmDelete">
              Ketik <strong className="text-destructive">Delete</strong> untuk
              mengkonfirmasi
            </Label>
            <Input
              id="confirmDelete"
              value={deleteDialog.confirmText}
              onChange={(e) =>
                setDeleteDialog((prev) => ({
                  ...prev,
                  confirmText: e.target.value,
                }))
              }
              placeholder="Ketik 'Delete' di sini"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() =>
                setDeleteDialog((prev) => ({
                  ...prev,
                  open: false,
                  confirmText: "",
                }))
              }
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteQuiz}
              disabled={deleteDialog.confirmText !== "Delete"}
            >
              Hapus Quiz
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function capitalizeFirst(str: string) {
  if (!str || str === "-") return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
