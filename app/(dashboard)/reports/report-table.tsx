"use client";

import {
  ChevronDown,
  MoreVertical,
  Search,
  SlidersHorizontal,
  Eye,
  Trash2,
  MessageSquare,
  FileText,
  User,
} from "lucide-react";
import { useState, useTransition } from "react";
import { format } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

import { DataTable, StatusBadge } from "@/components/dashboard/data-table";
import { getAvatarUrl } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { type Report, updateReportAction, deleteReportAction } from "./actions";

const reportTypeColors: Record<string, string> = {
  bug: "bg-destructive/20 text-destructive border-destructive/30",
  content:
    "bg-[var(--warning)]/20 text-[var(--warning)] border-[var(--warning)]/30",
  user: "bg-primary/20 text-primary border-primary/30",
  other: "bg-secondary text-secondary-foreground border-border",
};

interface ReportTableProps {
  initialData: Report[];
  totalPages: number;
  currentPage: number;
  stats: {
    total: number;
    pending: number;
    inProgress: number;
    resolved: number;
  };
  searchQuery: string;
  statusFilter: string;
  typeFilter: string;
}

export function ReportTable({
  initialData,
  totalPages,
  currentPage,
  stats,
  searchQuery,
  statusFilter,
  typeFilter,
}: ReportTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const [searchInput, setSearchInput] = useState(searchQuery);

  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    id: string;
    currentStatus: string;
    newStatus: string;
    reportTitle: string;
  }>({
    open: false,
    id: "",
    currentStatus: "",
    newStatus: "",
    reportTitle: "",
  });

  const [detailDialog, setDetailDialog] = useState<{
    open: boolean;
    report: Report | null;
  }>({ open: false, report: null });

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    id: string;
    reportTitle: string;
    confirmText: string;
  }>({ open: false, id: "", reportTitle: "", confirmText: "" });

  const [notesDialog, setNotesDialog] = useState<{
    open: boolean;
    id: string;
    notes: string;
    reportTitle: string;
  }>({ open: false, id: "", notes: "", reportTitle: "" });

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
    if (e.key === "Enter") handleSearch();
  };

  const handlePageChange = (page: number) => {
    updateUrl({
      page,
      search: searchQuery,
      status: statusFilter,
      type: typeFilter,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openConfirmDialog = (
    id: string,
    currentStatus: string,
    newStatus: string,
    reportTitle: string
  ) => {
    setConfirmDialog({ open: true, id, currentStatus, newStatus, reportTitle });
  };

  const handleConfirm = async () => {
    const updates: Record<string, unknown> = {
      status: confirmDialog.newStatus,
    };
    if (confirmDialog.newStatus === "resolved") {
      updates.resolved_at = new Date().toISOString();
    }
    const { error } = await updateReportAction(confirmDialog.id, updates);
    if (error) {
      toast({
        title: "Error",
        description: "Gagal mengubah status",
        variant: "destructive",
      });
    } else {
      toast({ title: "Berhasil", description: "Status berhasil diubah" });
      router.refresh();
    }
    setConfirmDialog((prev) => ({ ...prev, open: false }));
  };

  const handleDeleteReport = async () => {
    if (deleteDialog.confirmText !== "Delete Report") return;
    const { error } = await deleteReportAction(deleteDialog.id);
    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete report",
        variant: "destructive",
      });
    } else {
      toast({ title: "Success", description: "Report deleted successfully" });
      router.refresh();
    }
    setDeleteDialog((prev) => ({ ...prev, open: false, confirmText: "" }));
  };

  const handleSaveNotes = async () => {
    const { error } = await updateReportAction(notesDialog.id, {
      admin_notes: notesDialog.notes,
    });
    if (error) {
      toast({
        title: "Error",
        description: "Gagal menyimpan catatan",
        variant: "destructive",
      });
    } else {
      toast({ title: "Berhasil", description: "Catatan berhasil disimpan" });
      router.refresh();
    }
    setNotesDialog((prev) => ({ ...prev, open: false }));
  };

  const columns = [
    {
      key: "reporter",
      label: "Reporter",
      render: (_: unknown, row: Record<string, unknown>) => {
        const reporter = row.reporterData as Report["reporter"];
        if (!reporter) {
          return <span className="text-muted-foreground">—</span>;
        }
        const name = reporter.fullname || reporter.username || "Unknown";
        const username = reporter.username
          ? `@${reporter.username}`
          : "No username";
        return (
          <Link
            href={`/users/${reporter.id}`}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div>
              <p className="font-medium leading-tight hover:text-primary transition-colors">
                {name}
              </p>
              <p className="text-xs text-muted-foreground">{username}</p>
            </div>
          </Link>
        );
      },
    },
    {
      key: "title",
      label: "Report",
      render: (value: unknown) => {
        // Remove "Laporan " prefix if exists
        const title = ((value as string) || "Untitled").replace(
          /^Laporan\s+/i,
          ""
        );
        return (
          <div className="max-w-[250px]">
            <p className="font-medium truncate" title={title}>
              {title}
            </p>
          </div>
        );
      },
    },
    {
      key: "reported",
      label: "Reported",
      render: (_: unknown, row: Record<string, unknown>) => {
        const contentType = row.reported_content_type as string;
        const reportedUser = row.reportedUserData as Report["reported_user"];
        const contentId = row.reported_content_id as string;
        if (contentType === "user" && reportedUser) {
          return (
            <Link
              href={`/users/${reportedUser.id}`}
              className="flex items-center gap-2 cursor-pointer"
            >
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm hover:text-primary transition-colors">
                {reportedUser.fullname || reportedUser.username || "Unknown"}
              </span>
            </Link>
          );
        }
        if (contentType === "quiz" && contentId) {
          return (
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Quiz</span>
            </div>
          );
        }
        if (contentType) {
          return (
            <span className="text-sm text-muted-foreground capitalize">
              {contentType}
            </span>
          );
        }
        return <span className="text-muted-foreground">—</span>;
      },
    },
    {
      key: "status",
      label: "Status",
      render: (value: unknown, row: Record<string, unknown>) => {
        const status = formatStatus(value as string);
        const id = row.id as string;
        const title = row.title as string;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none">
              <div className="cursor-pointer hover:opacity-80 flex items-center">
                <StatusBadge status={status} />
                <ChevronDown className="ml-1.5 h-3 w-3 text-muted-foreground/50" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {["Pending", "In Progress", "Resolved"]
                .filter((s) => s !== status)
                .map((s) => (
                  <DropdownMenuItem
                    key={s}
                    onClick={() =>
                      openConfirmDialog(
                        id,
                        status,
                        s.toLowerCase().replace(" ", "_"),
                        title
                      )
                    }
                    className="cursor-pointer"
                  >
                    {s}
                  </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
    {
      key: "date",
      label: "Date",
      render: (value: unknown) => (
        <span className="text-sm text-muted-foreground">
          {value ? format(new Date(value as string), "dd MMM yyyy") : "—"}
        </span>
      ),
    },
    {
      key: "action",
      label: "Action",
      render: (_: unknown, row: Record<string, unknown>) => {
        const id = row.id as string;
        const title = (row.title as string) || "Untitled";
        const notes = row.admin_notes as string;
        const fullReport = row.fullReport as Report;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none">
              <div className="cursor-pointer hover:opacity-80 p-1 rounded hover:bg-muted">
                <MoreVertical className="h-4 w-4 text-muted-foreground" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() =>
                  setDetailDialog({ open: true, report: fullReport })
                }
                className="cursor-pointer"
              >
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  setNotesDialog({
                    open: true,
                    id,
                    notes: notes || "",
                    reportTitle: title,
                  })
                }
                className="cursor-pointer"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Admin Notes
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() =>
                  setDeleteDialog({
                    open: true,
                    id,
                    reportTitle: title,
                    confirmText: "",
                  })
                }
                className="cursor-pointer text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Report
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const tableData = initialData.map((report) => ({
    id: report.id,
    reporterData: report.reporter,
    title: report.title,
    report_type: report.report_type,
    reported_content_type: report.reported_content_type,
    reported_content_id: report.reported_content_id,
    reportedUserData: report.reported_user,
    status: report.status,
    date: report.created_at,
    admin_notes: report.admin_notes,
    fullReport: report,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reports</h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Input
              placeholder="Cari laporan..."
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
            value={statusFilter}
            onValueChange={(value) => updateUrl({ status: value, page: 1 })}
          >
            <SelectTrigger className="w-36">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                <SelectValue placeholder="Status" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
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
        />
      </div>

      {/* Confirm Dialog */}
      <Dialog
        open={confirmDialog.open}
        onOpenChange={(open) => setConfirmDialog((prev) => ({ ...prev, open }))}
      >
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Ubah Status</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin mengubah status dari{" "}
              <strong>{confirmDialog.currentStatus}</strong> menjadi{" "}
              <strong>{confirmDialog.newStatus}</strong>?
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

      {/* Detail Dialog */}
      <Dialog
        open={detailDialog.open}
        onOpenChange={(open) => setDetailDialog((prev) => ({ ...prev, open }))}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {detailDialog.report?.title || "Report Details"}
            </DialogTitle>
          </DialogHeader>
          {detailDialog.report && (
            <div className="space-y-4 py-4">
              <div>
                <Label className="text-muted-foreground">Description</Label>
                <p className="mt-1">{detailDialog.report.description || "—"}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Type</Label>
                  <p className="mt-1">
                    {formatReportType(detailDialog.report.report_type)}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <p className="mt-1">
                    {formatStatus(detailDialog.report.status)}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Created</Label>
                  <p className="mt-1">
                    {detailDialog.report.created_at
                      ? format(
                          new Date(detailDialog.report.created_at),
                          "dd MMM yyyy HH:mm"
                        )
                      : "—"}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Reporter</Label>
                  <p className="mt-1">
                    {detailDialog.report.reporter?.fullname ||
                      detailDialog.report.reporter?.username ||
                      "—"}
                  </p>
                </div>
              </div>
              {detailDialog.report.admin_notes && (
                <div>
                  <Label className="text-muted-foreground">Admin Notes</Label>
                  <p className="mt-1 text-sm bg-muted p-2 rounded">
                    {detailDialog.report.admin_notes}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Notes Dialog */}
      <Dialog
        open={notesDialog.open}
        onOpenChange={(open) => setNotesDialog((prev) => ({ ...prev, open }))}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Admin Notes - {notesDialog.reportTitle}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              value={notesDialog.notes}
              onChange={(e) =>
                setNotesDialog((prev) => ({ ...prev, notes: e.target.value }))
              }
              placeholder="Tambahkan catatan admin..."
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() =>
                setNotesDialog((prev) => ({ ...prev, open: false }))
              }
            >
              Batal
            </Button>
            <Button onClick={handleSaveNotes}>Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog
        open={deleteDialog.open}
        onOpenChange={(open) =>
          setDeleteDialog((prev) => ({ ...prev, open, confirmText: "" }))
        }
      >
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle className="text-destructive">
              Delete Report
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete report{" "}
              <strong>{deleteDialog.reportTitle}</strong>? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2 py-4">
            <Label htmlFor="confirmDelete">
              Type <strong className="text-destructive">Delete Report</strong>{" "}
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
              placeholder="Type 'Delete Report' here"
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
              onClick={handleDeleteReport}
              disabled={deleteDialog.confirmText !== "Delete Report"}
            >
              Delete Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatReportType(type: string | null) {
  if (!type) return "Other";
  return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
}

function formatStatus(status: string | null) {
  if (!status) return "Pending";
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}
