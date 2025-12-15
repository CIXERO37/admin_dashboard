"use client";

import {
  ChevronDown,
  MoreVertical,
  UserPen,
  Trash2,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { useState, useTransition } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import {
  type Profile,
  updateProfileAction,
  deleteProfileAction,
} from "./actions";

const roleColors: Record<string, string> = {
  admin: "bg-primary/20 text-primary border-primary/30",
  manager:
    "bg-[var(--success)]/20 text-[var(--success)] border-[var(--success)]/30",
  support:
    "bg-[var(--warning)]/20 text-[var(--warning)] border-[var(--warning)]/30",
  billing: "bg-chart-2/20 text-chart-2 border-chart-2/30",
};

interface UserTableProps {
  initialData: Profile[];
  totalPages: number;
  currentPage: number;
  searchQuery: string;
  roleFilter: string;
  statusFilter: string;
}

export function UserTable({
  initialData,
  totalPages,
  currentPage,
  searchQuery,
  roleFilter,
  statusFilter,
}: UserTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const [searchInput, setSearchInput] = useState(searchQuery);

  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    type: "role" | "status";
    id: string;
    currentValue: string;
    newValue: string;
    userName: string;
  }>({
    open: false,
    type: "role",
    id: "",
    currentValue: "",
    newValue: "",
    userName: "",
  });

  const [editDialog, setEditDialog] = useState<{
    open: boolean;
    id: string;
    fullname: string;
    username: string;
    role: string;
    status: string;
    showConfirm: boolean;
  }>({
    open: false,
    id: "",
    fullname: "",
    username: "",
    role: "user",
    status: "active",
    showConfirm: false,
  });

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    id: string;
    userName: string;
    confirmText: string;
  }>({
    open: false,
    id: "",
    userName: "",
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
      role: roleFilter,
      status: statusFilter,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openConfirmDialog = (
    type: "role" | "status",
    id: string,
    currentValue: string,
    newValue: string,
    userName: string
  ) => {
    setConfirmDialog({
      open: true,
      type,
      id,
      currentValue,
      newValue,
      userName,
    });
  };

  const handleConfirm = async () => {
    if (confirmDialog.type === "role") {
      const { error } = await updateProfileAction(confirmDialog.id, {
        role: confirmDialog.newValue,
      });
      if (error) {
        toast({
          title: "Error",
          description: "Failed to update role",
          variant: "destructive",
        });
      } else {
        toast({ title: "Success", description: "Role updated successfully" });
        router.refresh();
      }
    } else {
      const { error } = await updateProfileAction(confirmDialog.id, {
        is_blocked: confirmDialog.newValue === "Blocked",
      });
      if (error) {
        toast({
          title: "Error",
          description: "Failed to update status",
          variant: "destructive",
        });
      } else {
        toast({ title: "Success", description: "Status updated successfully" });
        router.refresh();
      }
    }
    setConfirmDialog((prev) => ({ ...prev, open: false }));
  };

  const openEditDialog = (row: Record<string, unknown>) => {
    setEditDialog({
      open: true,
      id: row.id as string,
      fullname: (row.fullname as string) || "",
      username: (row.username as string) || "",
      role: ((row.role as string) || "user").toLowerCase(),
      status: (row.status as string) === "Blocked" ? "blocked" : "active",
      showConfirm: false,
    });
  };

  const handleEditSave = async () => {
    if (!editDialog.showConfirm) {
      setEditDialog((prev) => ({ ...prev, showConfirm: true }));
      return;
    }

    const { error } = await updateProfileAction(editDialog.id, {
      fullname: editDialog.fullname,
      username: editDialog.username,
      role: editDialog.role,
      is_blocked: editDialog.status === "blocked",
    });

    if (error) {
      toast({
        title: "Error",
        description: "Gagal menyimpan perubahan",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Berhasil",
        description: "Data pengguna berhasil diperbarui",
      });
      router.refresh();
    }
    setEditDialog((prev) => ({ ...prev, open: false, showConfirm: false }));
  };

  const openDeleteDialog = (id: string, userName: string) => {
    setDeleteDialog({ open: true, id, userName, confirmText: "" });
  };

  const handleDeleteUser = async () => {
    if (deleteDialog.confirmText !== "Move to Trash") return;

    const { error } = await deleteProfileAction(deleteDialog.id);
    if (error) {
      toast({
        title: "Error",
        description: "Gagal menghapus pengguna",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "User moved to trash successfully",
      });
      router.refresh();
    }
    setDeleteDialog((prev) => ({ ...prev, open: false, confirmText: "" }));
  };

  const columns = [
    {
      key: "account",
      label: "Account",
      render: (_: unknown, row: Record<string, unknown>) => {
        const id = row.id as string;
        const name =
          (row.fullname as string) ||
          (row.username as string) ||
          "Unknown user";
        const email = (row.email as string) || "No email";
        const avatar = row.avatar as string | undefined;
        return (
          <Link
            href={`/profiles/${id}`}
            className="flex items-center gap-3 cursor-pointer"
          >
            <Avatar className="h-9 w-9">
              <AvatarImage src={avatar} alt={name} />
              <AvatarFallback>{getInitials(name)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium leading-tight hover:text-primary transition-colors">
                {name}
              </p>
              <p className="text-xs text-muted-foreground">{email}</p>
            </div>
          </Link>
        );
      },
    },
    { key: "username", label: "Username" },
    {
      key: "role",
      label: "Role",
      render: (value: unknown, row: Record<string, unknown>) => {
        const role = (value as string) || "user";
        const id = row.id as string;
        const userName =
          (row.fullname as string) ||
          (row.username as string) ||
          "Unknown user";
        return (
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none">
              <div className="cursor-pointer hover:opacity-80 flex items-center">
                <Badge
                  variant="outline"
                  className={
                    roleColors[role.toLowerCase()] ??
                    "bg-secondary text-secondary-foreground border-border"
                  }
                >
                  {formatRole(role)}
                </Badge>
                <ChevronDown className="ml-1.5 h-3 w-3 text-muted-foreground/50" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {["user", "admin"]
                .filter((r) => r !== role.toLowerCase())
                .map((r) => (
                  <DropdownMenuItem
                    key={r}
                    onClick={() =>
                      openConfirmDialog("role", id, role, r, userName)
                    }
                    className="cursor-pointer"
                  >
                    {formatRole(r)}
                  </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
    {
      key: "status",
      label: "Status",
      render: (value: unknown, row: Record<string, unknown>) => {
        const status = value as string;
        const id = row.id as string;
        const userName =
          (row.fullname as string) ||
          (row.username as string) ||
          "Unknown user";
        return (
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none">
              <div className="cursor-pointer hover:opacity-80 flex items-center">
                <StatusBadge status={status} />
                <ChevronDown className="ml-1.5 h-3 w-3 text-muted-foreground/50" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {status !== "Active" && (
                <DropdownMenuItem
                  onClick={() =>
                    openConfirmDialog("status", id, status, "Active", userName)
                  }
                  className="cursor-pointer"
                >
                  Active
                </DropdownMenuItem>
              )}
              {status !== "Blocked" && (
                <DropdownMenuItem
                  onClick={() =>
                    openConfirmDialog("status", id, status, "Blocked", userName)
                  }
                  className="cursor-pointer"
                >
                  Blocked
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
    {
      key: "action",
      label: "Action",
      render: (_: unknown, row: Record<string, unknown>) => {
        const userName =
          (row.fullname as string) ||
          (row.username as string) ||
          "Unknown user";
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
                onClick={() => openEditDialog(row)}
                className="cursor-pointer"
              >
                <UserPen className="h-4 w-4 mr-2" />
                Edit User
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => openDeleteDialog(id, userName)}
                className="cursor-pointer text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Move to Trash
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const tableData = initialData.map((profile) => ({
    id: profile.id,
    account: profile.id,
    avatar: getAvatarUrl(profile.avatar_url),
    fullname: profile.fullname,
    username: profile.username ?? "—",
    email: profile.email,
    role: profile.role ?? "user",
    status: profile.is_blocked ? "Blocked" : "Active",
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Manage Users</h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Input
              placeholder="Cari pengguna..."
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
            value={roleFilter}
            onValueChange={(value) => updateUrl({ role: value, page: 1 })}
          >
            <SelectTrigger className="w-32">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                <SelectValue placeholder="Role" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={statusFilter}
            onValueChange={(value) => updateUrl({ status: value, page: 1 })}
          >
            <SelectTrigger className="w-32">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                <SelectValue placeholder="Status" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="blocked">Blocked</SelectItem>
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
            <DialogTitle>Konfirmasi Perubahan</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin mengubah{" "}
              {confirmDialog.type === "role" ? "role" : "status"}{" "}
              <strong>{confirmDialog.userName}</strong> dari{" "}
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

      {/* Edit Dialog */}
      <Dialog
        open={editDialog.open}
        onOpenChange={(open) =>
          setEditDialog((prev) => ({ ...prev, open, showConfirm: false }))
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editDialog.showConfirm
                ? "Konfirmasi Perubahan"
                : "Edit Pengguna"}
            </DialogTitle>
            {editDialog.showConfirm && (
              <DialogDescription>
                Apakah Anda yakin ingin menyimpan perubahan ini?
              </DialogDescription>
            )}
          </DialogHeader>
          {!editDialog.showConfirm ? (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="fullname">Nama Lengkap</Label>
                <Input
                  id="fullname"
                  value={editDialog.fullname}
                  onChange={(e) =>
                    setEditDialog((prev) => ({
                      ...prev,
                      fullname: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={editDialog.username}
                  onChange={(e) =>
                    setEditDialog((prev) => ({
                      ...prev,
                      username: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="role">Role</Label>
                  <Select
                    value={editDialog.role}
                    onValueChange={(value) =>
                      setEditDialog((prev) => ({ ...prev, role: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={editDialog.status}
                    onValueChange={(value) =>
                      setEditDialog((prev) => ({ ...prev, status: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="blocked">Blocked</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          ) : null}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() =>
                setEditDialog((prev) => ({
                  ...prev,
                  open: false,
                  showConfirm: false,
                }))
              }
            >
              Batal
            </Button>
            <Button onClick={handleEditSave}>
              {editDialog.showConfirm ? "Ya, Simpan" : "Simpan"}
            </Button>
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
              Move to Trash
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to move{" "}
              <strong>{deleteDialog.userName}</strong> to the trash? You can
              restore it later.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2 py-4">
            <Label htmlFor="confirmDelete">
              Type <strong className="text-destructive">Move to Trash</strong>{" "}
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
              placeholder="Type 'Move to Trash' here"
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
              onClick={handleDeleteUser}
              disabled={deleteDialog.confirmText !== "Move to Trash"}
            >
              Move to Trash
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

function formatRole(role: string) {
  return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
}
