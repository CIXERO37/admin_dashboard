"use client";

import { Search, SlidersHorizontal, ChevronDown } from "lucide-react";
import { format } from "date-fns";
import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

import { DataTable } from "@/components/dashboard/data-table";
import { getAvatarUrl } from "@/lib/utils";
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
import { type Quiz, updateQuizVisibility, blockQuizAction } from "./actions";
import { useTranslation } from "@/lib/i18n";

const visibilityColors: Record<string, string> = {
  Public:
    "bg-[var(--success)]/20 text-[var(--success)] border-[var(--success)]/30",
  Private:
    "bg-[var(--warning)]/20 text-[var(--warning)] border-[var(--warning)]/30",
};

const statusColors: Record<string, string> = {
  Active: "bg-blue-500/20 text-blue-500 border-blue-500/30",
  Block: "bg-red-500/20 text-red-500 border-red-500/30",
};

interface QuizTableProps {
  initialData: Quiz[];
  totalPages: number;
  currentPage: number;
  categories: string[];
  searchQuery: string;
  categoryFilter: string;
  visibilityFilter: string;
  statusFilter: string;
}

export function QuizTable({
  initialData,
  totalPages,
  currentPage,
  categories,
  searchQuery,
  categoryFilter,
  visibilityFilter,
  statusFilter,
}: QuizTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const { t } = useTranslation();

  const [searchInput, setSearchInput] = useState(searchQuery);

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

  const [blockDialog, setBlockDialog] = useState<{
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

  const updateUrl = (params: Record<string, string | number>) => {
    const newParams = new URLSearchParams(searchParams.toString());

    Object.entries(params).forEach(([key, value]) => {
      if (value && value !== "all" && value !== "") {
        newParams.set(key, String(value));
      } else {
        newParams.delete(key);
      }
    });

    startTransition(() => {
      router.push(`?${newParams.toString()}`);
    });
  };

  const handleSearch = () => {
    updateUrl({ search: searchInput, page: 1 });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handlePageChange = (page: number) => {
    updateUrl({
      page,
      search: searchQuery,
      category: categoryFilter,
      visibility: visibilityFilter,
      status: statusFilter,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openConfirmDialog = (
    id: string,
    currentValue: string,
    newValue: string,
    quizTitle: string
  ) => {
    setConfirmDialog({ open: true, id, currentValue, newValue, quizTitle });
  };

  const handleConfirm = async () => {
    const { error } = await updateQuizVisibility(
      confirmDialog.id,
      confirmDialog.newValue === "Public"
    );
    if (error) {
      toast({
        title: t("msg.error"),
        description: t("quiz.visibility_change_error"),
        variant: "destructive",
      });
    } else {
      toast({
        title: t("msg.success"),
        description: t("quiz.visibility_change_success"),
      });
      router.refresh();
    }
    setConfirmDialog((prev) => ({ ...prev, open: false }));
  };

  const openBlockDialog = (id: string, quizTitle: string) => {
    setBlockDialog({ open: true, id, quizTitle, confirmText: "" });
  };

  const handleBlockQuiz = async () => {
    if (blockDialog.confirmText !== "Block") return;

    const { error } = await blockQuizAction(blockDialog.id);
    if (error) {
      toast({
        title: t("msg.error"),
        description: t("quiz.block_error"),
        variant: "destructive",
      });
    } else {
      toast({ title: t("msg.success"), description: t("quiz.block_success") });
      router.refresh();
    }
    setBlockDialog((prev) => ({ ...prev, open: false, confirmText: "" }));
  };

  const columns = [
    {
      key: "title",
      label: t("table.title"),
      render: (value: unknown) => (
        <span className="block max-w-[200px] truncate" title={value as string}>
          {value as string}
        </span>
      ),
    },
    {
      key: "creator",
      label: t("table.creator"),
      render: (value: unknown, row: Record<string, unknown>) => {
        const creator = value as {
          id: string;
          username: string;
          fullname: string;
          avatar_url: string;
        } | null;
        if (!creator) return <span className="text-muted-foreground">-</span>;
        return (
          <div className="flex items-center gap-2">
            <Link
              href={`/users/${creator.id}`}
              className="flex flex-col min-w-0 group"
              onClick={(e) => e.stopPropagation()}
            >
              <span
                className="text-sm font-medium truncate max-w-[120px] group-hover:text-primary transition-colors"
                title={creator.fullname}
              >
                {creator.fullname}
              </span>
              <span
                className="text-xs text-muted-foreground truncate max-w-[120px]"
                title={creator.username}
              >
                @{creator.username}
              </span>
            </Link>
          </div>
        );
      },
    },
    {
      key: "category",
      label: t("table.category"),
      render: (value: unknown) => {
        const catValue = value as string;
        const category =
          t(`category.${catValue?.toLowerCase()?.replace(" ", "_")}`) ||
          capitalizeFirst(catValue);
        return (
          <span className="block max-w-[120px] truncate" title={category}>
            {category}
          </span>
        );
      },
    },
    { key: "questions", label: t("table.questions") },
    {
      key: "language",
      label: t("table.language"),
      render: (value: unknown) => capitalizeFirst(value as string),
    },
    {
      key: "difficulty",
      label: t("table.visibility"),
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
                  {visibility === "Public"
                    ? t("status.public")
                    : t("status.private")}
                </Badge>
                <ChevronDown className="ml-1.5 h-3 w-3 text-muted-foreground/50" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem
                onClick={() =>
                  openConfirmDialog(id, visibility, "Public", quizTitle)
                }
                className="cursor-pointer"
              >
                {t("status.public")}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  openConfirmDialog(id, visibility, "Private", quizTitle)
                }
                className="cursor-pointer"
              >
                {t("status.private")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
    { key: "createdAt", label: t("table.created") },
    {
      key: "status",
      label: t("table.status"),
      render: (value: unknown, row: Record<string, unknown>) => {
        const status = value as string;
        const id = row.id as string;
        const quizTitle = row.title as string;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none">
              <div className="cursor-pointer hover:opacity-80 flex items-center">
                <Badge
                  variant="outline"
                  className={
                    statusColors[status] ??
                    "bg-secondary text-secondary-foreground"
                  }
                >
                  {status === "Active"
                    ? t("status.active")
                    : t("status.blocked")}
                </Badge>
                <ChevronDown className="ml-1.5 h-3 w-3 text-muted-foreground/50" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {status === "Active" && (
                <DropdownMenuItem
                  onClick={() => openBlockDialog(id, quizTitle)}
                  className="cursor-pointer text-red-500 focus:text-red-500"
                >
                  {t("action.block")}
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const tableData = initialData.map((quiz) => ({
    id: quiz.id,
    title: quiz.title,
    creator: quiz.creator,
    category: quiz.category ?? "-",
    questions: Array.isArray(quiz.questions) ? quiz.questions.length : 0,
    language: quiz.language ?? "ID",
    difficulty: quiz.is_public ? "Public" : "Private",
    createdAt: quiz.created_at
      ? format(new Date(quiz.created_at), "dd MMM yyyy")
      : "-",
    status: quiz.status === "block" ? "Block" : "Active",
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {t("quiz.title")}
          </h1>
        </div>

        <div className="flex items-center gap-2 flex-wrap justify-end">
          <div className="relative">
            <Input
              placeholder={t("quiz.search")}
              className="pr-10 w-64 bg-background border-border"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              onClick={handleSearch}
              disabled={isPending}
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 flex items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              <Search className="h-3.5 w-3.5" />
            </button>
          </div>

          <Select
            value={categoryFilter}
            onValueChange={(value) => updateUrl({ category: value, page: 1 })}
          >
            <SelectTrigger className="w-[190px]">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                <SelectValue placeholder={t("table.category")} />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("quiz.all_category")}</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {t(`category.${cat?.toLowerCase()?.replace(" ", "_")}`) ||
                    capitalizeFirst(cat)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={visibilityFilter}
            onValueChange={(value) => updateUrl({ visibility: value, page: 1 })}
          >
            <SelectTrigger className="w-[190px]">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                <SelectValue placeholder={t("table.visibility")} />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("filter.all_visibility")}</SelectItem>
              <SelectItem value="publik">{t("status.public")}</SelectItem>
              <SelectItem value="private">{t("status.private")}</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={statusFilter}
            onValueChange={(value) => updateUrl({ status: value, page: 1 })}
          >
            <SelectTrigger className="w-[190px]">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                <SelectValue placeholder={t("table.status")} />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("filter.all_status")}</SelectItem>
              <SelectItem value="active">{t("status.active")}</SelectItem>
              <SelectItem value="block">{t("status.blocked")}</SelectItem>
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
          onRowClick={(row) => router.push(`/quizzes/${row.id}`)}
        />
      </div>

      <Dialog
        open={confirmDialog.open}
        onOpenChange={(open) => setConfirmDialog((prev) => ({ ...prev, open }))}
      >
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>{t("quiz.change_visibility")}</DialogTitle>
            <DialogDescription>
              {t("quiz.change_visibility_desc")}{" "}
              <strong>{confirmDialog.quizTitle}</strong> {t("users.from")}{" "}
              <strong>
                {confirmDialog.currentValue === "Public"
                  ? t("status.public")
                  : t("status.private")}
              </strong>{" "}
              {t("users.to")}{" "}
              <strong>
                {confirmDialog.newValue === "Public"
                  ? t("status.public")
                  : t("status.private")}
              </strong>
              ?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() =>
                setConfirmDialog((prev) => ({ ...prev, open: false }))
              }
            >
              {t("action.cancel")}
            </Button>
            <Button onClick={handleConfirm}>{t("users.yes_change")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={blockDialog.open}
        onOpenChange={(open) =>
          setBlockDialog((prev) => ({ ...prev, open, confirmText: "" }))
        }
      >
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle className="text-destructive">
              {t("quiz.block_title")}
            </DialogTitle>
            <DialogDescription>
              {t("quiz.block_desc")} <strong>{blockDialog.quizTitle}</strong>.{" "}
              {t("quiz.block_desc2")}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2 py-4">
            <Label htmlFor="confirmBlock">
              {t("users.type_confirm")}{" "}
              <strong className="text-destructive">
                {t("quiz.block_confirm_text")}
              </strong>{" "}
              {t("users.to_confirm")}
            </Label>
            <Input
              id="confirmBlock"
              value={blockDialog.confirmText}
              onChange={(e) =>
                setBlockDialog((prev) => ({
                  ...prev,
                  confirmText: e.target.value,
                }))
              }
              placeholder={`${t("users.type_confirm")} '${t(
                "quiz.block_confirm_text"
              )}'`}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() =>
                setBlockDialog((prev) => ({
                  ...prev,
                  open: false,
                  confirmText: "",
                }))
              }
            >
              {t("action.cancel")}
            </Button>
            <Button
              variant="destructive"
              onClick={handleBlockQuiz}
              disabled={
                blockDialog.confirmText !== t("quiz.block_confirm_text")
              }
            >
              {t("quiz.block_btn")}
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
