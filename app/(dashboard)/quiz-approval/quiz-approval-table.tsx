"use client";

import {
  Search,
  Check,
  X,
  FileQuestion,
  SlidersHorizontal,
} from "lucide-react";
import { format } from "date-fns";
import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

import { getAvatarUrl } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { DataTable } from "@/components/dashboard/data-table";
import {
  type QuizApproval,
  approveQuizAction,
  rejectQuizAction,
} from "./actions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface QuizApprovalTableProps {
  initialData: QuizApproval[];
  totalPages: number;
  currentPage: number;
  totalCount: number;
  searchQuery: string;
  categories: string[];
  categoryFilter: string;
}

export function QuizApprovalTable({
  initialData,
  totalPages,
  currentPage,
  totalCount,
  searchQuery,
  categories,
  categoryFilter,
}: QuizApprovalTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [searchInput, setSearchInput] = useState(searchQuery);
  const { toast } = useToast();

  const [rejectDialog, setRejectDialog] = useState<{
    open: boolean;
    id: string;
    title: string;
  }>({
    open: false,
    id: "",
    title: "",
  });
  const [rejectionReason, setRejectionReason] = useState("");

  const [approveDialog, setApproveDialog] = useState<{
    open: boolean;
    id: string;
    title: string;
  }>({
    open: false,
    id: "",
    title: "",
  });

  const handleApprove = (id: string, title: string) => {
    setApproveDialog({ open: true, id, title });
  };

  const executeApprove = async () => {
    const { id, title } = approveDialog;
    if (!id) return;

    const { error } = await approveQuizAction(id);
    if (error) {
      toast({
        title: "Error",
        description: "Failed to approve quiz",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: `Quiz "${title}" has been approved successfully`,
      });
      router.refresh();
    }

    setApproveDialog((prev) => ({ ...prev, open: false }));
  };

  const handleReject = (id: string, title: string) => {
    setRejectDialog({ open: true, id, title });
    setRejectionReason("");
  };

  const executeReject = async () => {
    const { id, title } = rejectDialog;
    if (!id) return;

    if (!rejectionReason.trim()) {
      toast({
        title: "Error",
        description: "Please provide a rejection reason",
        variant: "destructive",
      });
      return;
    }

    const { error } = await rejectQuizAction(id, rejectionReason);
    if (error) {
      toast({
        title: "Error",
        description: "Failed to reject quiz",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: `Quiz "${title}" has been rejected`,
      });
      router.refresh();
    }

    setRejectDialog((prev) => ({ ...prev, open: false }));
  };

  const updateUrl = (params: Record<string, string | number>) => {
    const newParams = new URLSearchParams(searchParams.toString());

    Object.entries(params).forEach(([key, value]) => {
      if (value && value !== "" && value !== "all") {
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
    updateUrl({ page, search: searchQuery, category: categoryFilter });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const columns = [
    {
      key: "title",
      label: "Title",
      render: (value: unknown) => (
        <span
          className="block max-w-[250px] truncate font-medium"
          title={value as string}
        >
          {value as string}
        </span>
      ),
    },
    {
      key: "creator",
      label: "Creator",
      render: (value: unknown) => {
        const creator = value as {
          id: string;
          username: string;
          fullname: string;
          avatar_url: string;
        } | null;
        if (!creator) return <span className="text-muted-foreground">-</span>;
        return (
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
        );
      },
    },
    {
      key: "category",
      label: "Category",
      render: (value: unknown) => {
        const category = capitalizeFirst(value as string);
        return (
          <Badge variant="secondary" className="text-xs">
            {category || "-"}
          </Badge>
        );
      },
    },
    { key: "questions", label: "Questions" },
    {
      key: "language",
      label: "Language",
      render: (value: unknown) => (
        <span className="uppercase text-xs font-medium">
          {(value as string) || "ID"}
        </span>
      ),
    },
    { key: "createdAt", label: "Created" },
    {
      key: "actions",
      label: "Actions",
      render: (_value: unknown, row: Record<string, unknown>) => {
        const id = row.id as string;
        const title = row.title as string;
        return (
          <div
            className="flex items-center gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              size="sm"
              className="h-8 gap-1 bg-emerald-500 hover:bg-emerald-600 text-white"
              onClick={() => handleApprove(id, title)}
            >
              <Check className="h-3.5 w-3.5" />
              Approve
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-8 gap-1 border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950"
              onClick={() => handleReject(id, title)}
            >
              <X className="h-3.5 w-3.5" />
              Reject
            </Button>
          </div>
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
    createdAt: quiz.created_at
      ? format(new Date(quiz.created_at), "dd MMM yyyy")
      : "-",
    actions: null,
  }));

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
                <SelectItem key={cat} value={cat}>
                  {capitalizeFirst(cat)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className={isPending ? "opacity-60 pointer-events-none" : ""}>
        {initialData.length > 0 ? (
          <DataTable
            columns={columns}
            data={tableData as Record<string, unknown>[]}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            onRowClick={(row) => router.push(`/quiz-approval/${row.id}`)}
          />
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-border rounded-xl bg-card">
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

      {/* Approve Dialog */}
      <Dialog
        open={approveDialog.open}
        onOpenChange={(open) => setApproveDialog((prev) => ({ ...prev, open }))}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Quiz</DialogTitle>
            <DialogDescription>
              Are you sure you want to approve this quiz?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() =>
                setApproveDialog((prev) => ({ ...prev, open: false }))
              }
            >
              Cancel
            </Button>
            <Button
              className="bg-emerald-500 hover:bg-emerald-600 text-white"
              onClick={executeApprove}
            >
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog
        open={rejectDialog.open}
        onOpenChange={(open) => setRejectDialog((prev) => ({ ...prev, open }))}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Quiz</DialogTitle>
          </DialogHeader>
          <div className="grid gap-2 py-2">
            <Label htmlFor="reason">Reason for Rejection</Label>
            <Textarea
              id="reason"
              placeholder="e.g., Inappropriate content, Low image quality, etc."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="h-24 resize-none"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() =>
                setRejectDialog((prev) => ({ ...prev, open: false }))
              }
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={executeReject}
              disabled={!rejectionReason.trim()}
            >
              Reject
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
