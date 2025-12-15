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

function formatDeletedDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function TrashQuizTable({ initialData }: TrashQuizTableProps) {
  const router = useRouter();
  const { toast } = useToast();
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
        title: "Quiz restored",
        description: `"${restoreDialog.item.title}" has been restored to Master Data.`,
      });
      startTransition(() => router.refresh());
    }
    setRestoreDialog({ open: false, item: null });
  };

  const handlePermanentDelete = async () => {
    if (!deleteDialog.item || deleteDialog.confirmText !== "Delete Permanently")
      return;

    const { error } = await permanentDeleteQuizAction(deleteDialog.item.id);

    if (error) {
      toast({ title: "Error", description: error, variant: "destructive" });
    } else {
      toast({
        title: "Quiz permanently deleted",
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
        <h3 className="mt-4 text-lg font-medium">No quizzes in trash</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Deleted quizzes will appear here
        </p>
      </div>
    );
  }

  const columns = [
    {
      key: "quiz",
      label: "Quiz",
      render: (_: unknown, row: Record<string, unknown>) => {
        const title = row.title as string;
        const category = row.category as string;
        const questionsCount = row.questions_count as number;
        return (
          <div className="flex flex-col">
            <span className="font-medium">{title}</span>
            <span className="text-xs text-muted-foreground">
              {category || "No category"} - {questionsCount} questions
            </span>
          </div>
        );
      },
    },
    {
      key: "creator",
      label: "Creator",
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
      label: "Deleted",
      render: (value: unknown) => (
        <span className="text-sm text-muted-foreground">
          {formatDeletedDate(value as string)}
        </span>
      ),
    },
    {
      key: "time_left",
      label: "Time Left",
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
            {daysLeft} days left
          </Badge>
        );
      },
    },
    {
      key: "action",
      label: "Action",
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
                Restore
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() =>
                  item && setDeleteDialog({ open: true, item, confirmText: "" })
                }
                className="cursor-pointer text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Permanently
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
            <DialogTitle>Restore Quiz</DialogTitle>
            <DialogDescription>
              Are you sure you want to restore "{restoreDialog.item?.title}"?
              The quiz will be returned to Master Data.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRestoreDialog({ open: false, item: null })}
            >
              Cancel
            </Button>
            <Button onClick={handleRestore} disabled={isPending}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Restore
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
              Permanent Delete
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to permanently delete "
              {deleteDialog.item?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2 py-4">
            <Label htmlFor="confirmDelete">
              Type{" "}
              <strong className="text-destructive">Delete Permanently</strong>{" "}
              to confirm
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
              placeholder="Type 'Delete Permanently' here"
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
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handlePermanentDelete}
              disabled={
                deleteDialog.confirmText !== "Delete Permanently" || isPending
              }
            >
              Delete Permanently
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
