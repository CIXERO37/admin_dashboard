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
  AlertTriangle,
} from "lucide-react";
import { useState, useMemo } from "react";
import { format } from "date-fns";

import { DataTable, StatusBadge } from "@/components/dashboard/data-table";
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
import { useReports } from "@/hooks/useReports";

const reportTypeColors: Record<string, string> = {
  bug: "bg-destructive/20 text-destructive border-destructive/30",
  content: "bg-[var(--warning)]/20 text-[var(--warning)] border-[var(--warning)]/30",
  user: "bg-primary/20 text-primary border-primary/30",
  other: "bg-secondary text-secondary-foreground border-border",
};

const ITEMS_PER_PAGE = 15;

export default function SupportReportPage() {
  const { data: reports, loading, error, updateReport, deleteReport, stats } = useReports();
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);

  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

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
    report: typeof reports[0] | null;
  }>({
    open: false,
    report: null,
  });

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    id: string;
    reportTitle: string;
    confirmText: string;
  }>({
    open: false,
    id: "",
    reportTitle: "",
    confirmText: "",
  });

  const [notesDialog, setNotesDialog] = useState<{
    open: boolean;
    id: string;
    notes: string;
    reportTitle: string;
  }>({
    open: false,
    id: "",
    notes: "",
    reportTitle: "",
  });

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    const updates: Record<string, unknown> = { status: newStatus };
    if (newStatus === "resolved") {
      updates.resolved_at = new Date().toISOString();
    }
    const { error } = await updateReport(id, updates);
    if (error) {
      toast({
        title: "Error",
        description: "Gagal mengubah status laporan",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Berhasil",
        description: "Status laporan berhasil diubah",
      });
    }
  };

  const openConfirmDialog = (
    id: string,
    currentStatus: string,
    newStatus: string,
    reportTitle: string
  ) => {
    setConfirmDialog({
      open: true,
      id,
      currentStatus,
      newStatus,
      reportTitle,
    });
  };

  const handleConfirm = async () => {
    await handleStatusUpdate(confirmDialog.id, confirmDialog.newStatus);
    setConfirmDialog((prev) => ({ ...prev, open: false }));
  };

  const openDetailDialog = (report: typeof reports[0]) => {
    setDetailDialog({ open: true, report });
  };

  const openDeleteDialog = (id: string, reportTitle: string) => {
    setDeleteDialog({
      open: true,
      id,
      reportTitle,
      confirmText: "",
    });
  };

  const handleDeleteReport = async () => {
    if (deleteDialog.confirmText !== "Delete") return;

    const { error } = await deleteReport(deleteDialog.id);

    if (error) {
      toast({
        title: "Error",
        description: "Gagal menghapus laporan",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Berhasil",
        description: "Laporan berhasil dihapus",
      });
      setDeleteDialog((prev) => ({ ...prev, open: false, confirmText: "" }));
    }
  };

  const openNotesDialog = (id: string, notes: string, reportTitle: string) => {
    setNotesDialog({ open: true, id, notes: notes || "", reportTitle });
  };

  const handleSaveNotes = async () => {
    const { error } = await updateReport(notesDialog.id, {
      admin_notes: notesDialog.notes,
    });

    if (error) {
      toast({
        title: "Error",
        description: "Gagal menyimpan catatan",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Berhasil",
        description: "Catatan berhasil disimpan",
      });
      setNotesDialog((prev) => ({ ...prev, open: false }));
    }
  };

  const columns = [
    {
      key: "reporter",
      label: "Reporter",
      render: (_: unknown, row: Record<string, unknown>) => {
        const reporter = row.reporterData as typeof reports[0]["reporter"];
        const name = reporter?.fullname || reporter?.username || "Unknown";
        const email = reporter?.email || "No email";
        const avatar = reporter?.avatar_url;
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src={avatar || undefined} alt={name} />
              <AvatarFallback>{getInitials(name)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium leading-tight">{name}</p>
              <p className="text-xs text-muted-foreground">{email}</p>
            </div>
          </div>
        );
      },
    },
    {
      key: "title",
      label: "Report",
      render: (value: unknown, row: Record<string, unknown>) => {
        const title = value as string;
        const type = row.report_type as string;
        return (
          <div className="max-w-[200px]">
            <p className="font-medium truncate" title={title}>{title || "Untitled"}</p>
            <Badge
              variant="outline"
              className={reportTypeColors[type?.toLowerCase()] || reportTypeColors.other}
            >
              {formatReportType(type)}
            </Badge>
          </div>
        );
      },
    },
    {
      key: "reported",
      label: "Reported",
      render: (_: unknown, row: Record<string, unknown>) => {
        const contentType = row.reported_content_type as string;
        const reportedUser = row.reportedUserData as typeof reports[0]["reported_user"];
        const quiz = row.quizData as typeof reports[0]["quiz"];

        if (contentType === "user" && reportedUser) {
          return (
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{reportedUser.username || reportedUser.fullname || "Unknown User"}</span>
            </div>
          );
        }
        if (contentType === "quiz" && quiz) {
          return (
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm truncate max-w-[120px]" title={quiz.title || ""}>{quiz.title || "Unknown Quiz"}</span>
            </div>
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
                    onClick={() => openConfirmDialog(id, status, s.toLowerCase().replace(" ", "_"), title)}
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
        const title = row.title as string || "Untitled";
        const notes = row.admin_notes as string;
        const fullReport = row.fullReport as typeof reports[0];
        return (
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none">
              <div className="cursor-pointer hover:opacity-80 p-1 rounded hover:bg-muted">
                <MoreVertical className="h-4 w-4 text-muted-foreground" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => openDetailDialog(fullReport)}
                className="cursor-pointer"
              >
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => openNotesDialog(id, notes, title)}
                className="cursor-pointer"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Admin Notes
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => openDeleteDialog(id, title)}
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

  const handleSearch = () => {
    setSearchQuery(searchInput.toLowerCase());
    setCurrentPage(1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const tableData = useMemo(() => {
    let filteredReports = reports;

    if (searchQuery) {
      filteredReports = filteredReports.filter((report) => {
        const searchableFields = [
          report.title,
          report.description,
          report.reporter?.username,
          report.reporter?.email,
          report.reporter?.fullname,
          report.report_type,
        ];
        return searchableFields.some((field) =>
          field?.toLowerCase().includes(searchQuery)
        );
      });
    }

    if (statusFilter !== "all") {
      filteredReports = filteredReports.filter((report) => {
        const status = (report.status || "pending").toLowerCase().replace(" ", "_");
        return status === statusFilter;
      });
    }

    if (typeFilter !== "all") {
      filteredReports = filteredReports.filter(
        (report) => (report.report_type || "").toLowerCase() === typeFilter
      );
    }

    return filteredReports.map((report) => ({
      id: report.id,
      reporterData: report.reporter,
      title: report.title,
      report_type: report.report_type,
      reported_content_type: report.reported_content_type,
      reportedUserData: report.reported_user,
      quizData: report.quiz,
      status: report.status,
      date: report.created_at,
      admin_notes: report.admin_notes,
      fullReport: report,
    }));
  }, [reports, searchQuery, statusFilter, typeFilter]);

  const totalPages = Math.ceil(tableData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedData = tableData.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const uniqueTypes = useMemo(() => {
    const types = new Set(reports.map((r) => r.report_type?.toLowerCase()).filter(Boolean));
    return Array.from(types);
  }, [reports]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">User Reports</h1>
          <p className="mt-1 text-muted-foreground">
            {stats.total} total reports &bull; {stats.pending} pending &bull; {stats.inProgress} in progress &bull; {stats.resolved} resolved
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Cari laporan..."
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

          <Select
            value={statusFilter}
            onValueChange={(value) => {
              setStatusFilter(value);
              setCurrentPage(1);
            }}
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

          <Select
            value={typeFilter}
            onValueChange={(value) => {
              setTypeFilter(value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-32">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                <SelectValue placeholder="Type" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Type</SelectItem>
              {uniqueTypes.map((type) => (
                <SelectItem key={type} value={type!}>
                  {formatReportType(type)}
                </SelectItem>
              ))}
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

      {/* Status Change Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open}
        onOpenChange={(open) => setConfirmDialog((prev) => ({ ...prev, open }))}
      >
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Ubah Status Laporan</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin mengubah status laporan{" "}
              <strong>{confirmDialog.reportTitle}</strong> dari{" "}
              <strong>{formatStatus(confirmDialog.currentStatus)}</strong> menjadi{" "}
              <strong>{formatStatus(confirmDialog.newStatus)}</strong>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmDialog((prev) => ({ ...prev, open: false }))}
            >
              Batal
            </Button>
            <Button onClick={handleConfirm}>Ya, Ubah</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Report Detail Dialog */}
      <Dialog
        open={detailDialog.open}
        onOpenChange={(open) => setDetailDialog((prev) => ({ ...prev, open }))}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-[var(--warning)]" />
              Detail Laporan
            </DialogTitle>
          </DialogHeader>
          {detailDialog.report && (
            <div className="space-y-4">
              <div>
                <Label className="text-muted-foreground text-xs">Judul</Label>
                <p className="font-medium">{detailDialog.report.title || "Untitled"}</p>
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">Deskripsi</Label>
                <p className="text-sm whitespace-pre-wrap">{detailDialog.report.description || "Tidak ada deskripsi"}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground text-xs">Tipe</Label>
                  <p className="text-sm">{formatReportType(detailDialog.report.report_type)}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Status</Label>
                  <div className="mt-1">
                    <StatusBadge status={formatStatus(detailDialog.report.status)} />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground text-xs">Reporter</Label>
                  <p className="text-sm">{detailDialog.report.reporter?.fullname || detailDialog.report.reporter?.username || "Unknown"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Tanggal</Label>
                  <p className="text-sm">
                    {detailDialog.report.created_at
                      ? format(new Date(detailDialog.report.created_at), "dd MMM yyyy, HH:mm")
                      : "—"}
                  </p>
                </div>
              </div>
              {detailDialog.report.reported_user && (
                <div>
                  <Label className="text-muted-foreground text-xs">User yang Dilaporkan</Label>
                  <p className="text-sm">{detailDialog.report.reported_user.username || detailDialog.report.reported_user.fullname || "Unknown"}</p>
                </div>
              )}
              {detailDialog.report.quiz && (
                <div>
                  <Label className="text-muted-foreground text-xs">Quiz yang Dilaporkan</Label>
                  <p className="text-sm">{detailDialog.report.quiz.title || "Unknown"}</p>
                </div>
              )}
              {detailDialog.report.evidence_url && (
                <div>
                  <Label className="text-muted-foreground text-xs">Evidence</Label>
                  <a
                    href={detailDialog.report.evidence_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    Lihat Evidence
                  </a>
                </div>
              )}
              {detailDialog.report.admin_notes && (
                <div>
                  <Label className="text-muted-foreground text-xs">Admin Notes</Label>
                  <p className="text-sm whitespace-pre-wrap bg-secondary/50 p-2 rounded">{detailDialog.report.admin_notes}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setDetailDialog((prev) => ({ ...prev, open: false }))}>
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Report Dialog */}
      <Dialog
        open={deleteDialog.open}
        onOpenChange={(open) => {
          setDeleteDialog((prev) => ({ ...prev, open, confirmText: "" }));
        }}
      >
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle className="text-destructive">Hapus Laporan</DialogTitle>
            <DialogDescription>
              Anda akan menghapus laporan <strong>{deleteDialog.reportTitle}</strong>. Tindakan ini
              tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2 py-4">
            <Label htmlFor="confirmDelete">
              Ketik <strong className="text-destructive">Delete</strong> untuk mengkonfirmasi
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
              onClick={handleDeleteReport}
              disabled={deleteDialog.confirmText !== "Delete"}
            >
              Hapus Laporan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Admin Notes Dialog */}
      <Dialog
        open={notesDialog.open}
        onOpenChange={(open) => setNotesDialog((prev) => ({ ...prev, open }))}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Admin Notes</DialogTitle>
            <DialogDescription>
              Tambahkan catatan untuk laporan: {notesDialog.reportTitle}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Tulis catatan di sini..."
              value={notesDialog.notes}
              onChange={(e) => setNotesDialog((prev) => ({ ...prev, notes: e.target.value }))}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setNotesDialog((prev) => ({ ...prev, open: false }))}
            >
              Batal
            </Button>
            <Button onClick={handleSaveNotes}>Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function formatStatus(status: string | null) {
  if (!status) return "Pending";
  const normalized = status.toLowerCase().replace("_", " ");
  if (normalized === "pending") return "Pending";
  if (normalized === "in progress") return "In Progress";
  if (normalized === "resolved") return "Resolved";
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function formatReportType(type: string | null | undefined) {
  if (!type) return "Other";
  return type.charAt(0).toUpperCase() + type.slice(1);
}

function getInitials(name: string) {
  const parts = name.split(" ");
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
