"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { RotateCcw, Trash2, Clock, BookOpen, MoreVertical } from "lucide-react";
import { DataTable } from "@/components/dashboard/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
import {
  restoreQuizAction,
  permanentDeleteQuizAction,
  type DeletedQuiz,
} from "./actions";
import { useTranslation } from "@/lib/i18n";
import { id as idLocale } from "date-fns/locale";

interface TrashQuizTableProps {
  initialData: DeletedQuiz[];
}

function getDaysUntilPermanentDelete(deletedAt: string): number {
  const deletedDate = new Date(deletedAt);
  const permanentDeleteDate = new Date(
    deletedDate.getTime() + 7 * 24 * 60 * 60 * 1000
  );
  const now = new Date();
  const diffTime = permanentDeleteDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

function formatDeletedDate(dateStr: string, localeCode: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString(localeCode === "id" ? "id-ID" : "en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function TrashQuizTable({ initialData }: TrashQuizTableProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { t, locale } = useTranslation();
  const [isPending, startTransition] = useTransition();
  const [restoreDialog, setRestoreDialog] = useState<{
    open: boolean;
    item: DeletedQuiz | null;
  }>({
    open: false,
    item: null,
  });
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    item: DeletedQuiz | null;
    confirmText: string;
  }>({
    open: false,
    item: null,
    confirmText: "",
  });

  const handleRestore = async () => {
    if (!restoreDialog.item) return;

    const { error } = await restoreQuizAction(restoreDialog.item.id);

    if (error) {
      toast({ title: "Error", description: error, variant: "destructive" });
    } else {
      toast({
        title: t("trash.restore_success"),
        description: `"${restoreDialog.item.title}" has been restored to Master Data.`,
      });
      startTransition(() => router.refresh());
    }
    setRestoreDialog({ open: false, item: null });
  };

  const handlePermanentDelete = async () => {
    if (
      !deleteDialog.item ||
      deleteDialog.confirmText !== t("trash.delete_confirm_text")
    )
      return;

    const { error } = await permanentDeleteQuizAction(deleteDialog.item.id);

    if (error) {
      toast({ title: "Error", description: error, variant: "destructive" });
    } else {
      toast({
        title: t("trash.delete_success"),
        description: `"${deleteDialog.item.title}" has been permanently deleted.`,
        variant: "destructive",
      });
      startTransition(() => router.refresh());
    }
    setDeleteDialog({ open: false, item: null, confirmText: "" });
  };

  if (initialData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <BookOpen className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-lg font-medium">{t("trash.no_quizzes")}</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("trash.quizzes_desc")}
        </p>
      </div>
    );
  }

  const columns = [
    {
      key: "quiz",
      label: t("nav.quizzes"),
      render: (_: unknown, row: Record<string, unknown>) => {
        const title = row.title as string;
        const category = row.category as string;
        const questionsCount = row.questions_count as number;
        return (
          <div className="flex flex-col">
            <span className="font-medium">{title}</span>
            <span className="text-xs text-muted-foreground">
              {category || t("groups.no_category")} - {questionsCount}{" "}
              {t("table.questions")}
            </span>
          </div>
        );
      },
    },
    {
      key: "creator",
      label: t("table.creator"),
      render: (_: unknown, row: Record<string, unknown>) => {
        const creator = row.creator as {
          fullname: string | null;
          email: string | null;
        } | null;
        return (
          <div className="flex flex-col">
            <span className="text-sm">{creator?.fullname || "-"}</span>
            <span className="text-xs text-muted-foreground">
              {creator?.email}
            </span>
          </div>
        );
      },
    },
    {
      key: "deleted_at",
      label: t("trash.deleted_at"),
      render: (value: unknown) => (
        <span className="text-sm text-muted-foreground">
          {formatDeletedDate(value as string, locale)}
        </span>
      ),
    },
    {
      key: "time_left",
      label: t("trash.time_left"),
      render: (_: unknown, row: Record<string, unknown>) => {
        const daysLeft = getDaysUntilPermanentDelete(row.deleted_at as string);
        return (
          <Badge
            variant="outline"
            className={
              daysLeft <= 2
                ? "bg-destructive/10 text-destructive border-destructive/30"
                : "bg-[var(--warning)]/20 text-[var(--warning)] border-[var(--warning)]/30"
            }
          >
            <Clock className="mr-1 h-3 w-3" />
            {daysLeft} {t("trash.days_left")}
          </Badge>
        );
      },
    },
    {
      key: "action",
      label: t("table.actions"),
      render: (_: unknown, row: Record<string, unknown>) => {
        const item = initialData.find((i) => i.id === row.id);
        return (
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none">
              <div className="cursor-pointer hover:opacity-80 p-1 rounded hover:bg-muted">
                <MoreVertical className="h-4 w-4 text-muted-foreground" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => item && setRestoreDialog({ open: true, item })}
                className="cursor-pointer"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                {t("action.restore")}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() =>
                  item && setDeleteDialog({ open: true, item, confirmText: "" })
                }
                className="cursor-pointer text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {t("trash.delete_permanent_title")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const tableData = initialData.map((item) => ({
    id: item.id,
    title: item.title,
    category: item.category,
    questions_count: item.questions_count,
    creator: item.creator,
    deleted_at: item.deleted_at,
  }));

  return (
    <>
      <div className={isPending ? "opacity-60 pointer-events-none" : ""}>
        <DataTable
          columns={columns}
          data={tableData as Record<string, unknown>[]}
        />
      </div>

      {/* Restore Dialog */}
      <Dialog
        open={restoreDialog.open}
        onOpenChange={(open) =>
          setRestoreDialog({ open, item: restoreDialog.item })
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("trash.restore_title")}</DialogTitle>
            <DialogDescription>
              {t("trash.restore_desc")} "{restoreDialog.item?.title}"?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRestoreDialog({ open: false, item: null })}
            >
              {t("action.cancel")}
            </Button>
            <Button onClick={handleRestore} disabled={isPending}>
              <RotateCcw className="mr-2 h-4 w-4" />
              {t("action.restore")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Permanently Dialog */}
      <Dialog
        open={deleteDialog.open}
        onOpenChange={(open) =>
          setDeleteDialog((prev) => ({ ...prev, open, confirmText: "" }))
        }
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-destructive">
              {t("trash.delete_permanent_title")}
            </DialogTitle>
            <DialogDescription>
              {t("trash.delete_permanent_desc")}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2 py-4">
            <Label htmlFor="confirmDelete">
              {t("trash.type_confirm")}{" "}
              <strong className="text-destructive">
                {t("trash.delete_confirm_text")}
              </strong>{" "}
              {t("trash.to_confirm")}
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
              placeholder={t("trash.delete_confirm_text")}
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
              {t("action.cancel")}
            </Button>
            <Button
              variant="destructive"
              onClick={handlePermanentDelete}
              disabled={
                deleteDialog.confirmText !== t("trash.delete_confirm_text") ||
                isPending
              }
            >
              {t("trash.delete_permanent_title")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
