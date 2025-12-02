"use client";

import {
  MapPin,
  ChevronDown,
  MoreVertical,
  UserPen,
  Trash2,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { useState, useMemo } from "react";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useProfiles } from "@/hooks/useProfiles";

const roleColors: Record<string, string> = {
  admin: "bg-primary/20 text-primary border-primary/30",
  manager:
    "bg-[var(--success)]/20 text-[var(--success)] border-[var(--success)]/30",
  support:
    "bg-[var(--warning)]/20 text-[var(--warning)] border-[var(--warning)]/30",
  billing: "bg-chart-2/20 text-chart-2 border-chart-2/30",
};

const ITEMS_PER_PAGE = 15;

export default function AdministratorUserPage() {
  const {
    data: profiles,
    loading,
    error,
    updateProfile,
    deleteProfile,
  } = useProfiles();
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);

  // Search and filter state
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Confirmation dialog state
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

  // Edit user dialog state
  const [editDialog, setEditDialog] = useState<{
    open: boolean;
    id: string;
    fullname: string;
    username: string;
    email: string;
    phone: string;
    organization: string;
    address: string;
    role: string;
    status: string;
    showConfirm: boolean;
  }>({
    open: false,
    id: "",
    fullname: "",
    username: "",
    email: "",
    phone: "",
    organization: "",
    address: "",
    role: "user",
    status: "active",
    showConfirm: false,
  });

  // Delete user dialog state
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

  const handleRoleUpdate = async (id: string, newRole: string) => {
    const { error } = await updateProfile(id, { role: newRole });
    if (error) {
      toast({
        title: "Error",
        description: "Failed to update role",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Role updated successfully",
      });
    }
  };

  const handleStatusUpdate = async (id: string, isBlocked: boolean) => {
    const { error } = await updateProfile(id, { is_blocked: isBlocked });
    if (error) {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Status updated successfully",
      });
    }
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
      await handleRoleUpdate(confirmDialog.id, confirmDialog.newValue);
    } else {
      await handleStatusUpdate(
        confirmDialog.id,
        confirmDialog.newValue === "Blocked"
      );
    }
    setConfirmDialog((prev) => ({ ...prev, open: false }));
  };

  const openEditDialog = (row: Record<string, unknown>) => {
    setEditDialog({
      open: true,
      id: row.id as string,
      fullname: (row.fullname as string) || "",
      username: (row.username as string) || "",
      email: (row.email as string) || "",
      phone: (row.phone as string) || "",
      organization: (row.organization as string) || "",
      address: (row.address as string) || "",
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

    const { error } = await updateProfile(editDialog.id, {
      fullname: editDialog.fullname,
      username: editDialog.username,
      email: editDialog.email,
      phone: editDialog.phone,
      organization: editDialog.organization,
      address: editDialog.address,
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
      setEditDialog((prev) => ({ ...prev, open: false, showConfirm: false }));
    }
  };

  const openDeleteDialog = (id: string, userName: string) => {
    setDeleteDialog({
      open: true,
      id,
      userName,
      confirmText: "",
    });
  };

  const handleDeleteUser = async () => {
    if (deleteDialog.confirmText !== "Delete") return;

    const { error } = await deleteProfile(deleteDialog.id);

    if (error) {
      toast({
        title: "Error",
        description: "Gagal menghapus pengguna",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Berhasil",
        description: "Pengguna berhasil dihapus",
      });
      setDeleteDialog((prev) => ({ ...prev, open: false, confirmText: "" }));
    }
  };

  const columns = [
    {
      key: "account",
      label: "Account",
      render: (_: unknown, row: Record<string, unknown>) => {
        const name =
          (row.fullname as string) ||
          (row.username as string) ||
          "Unknown user";
        const email = (row.email as string) || "No email";
        const avatar = row.avatar as string | undefined;
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src={avatar} alt={name} />
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
      key: "organization",
      label: "Organization",
      render: (value: unknown) => (
        <span className="text-sm text-muted-foreground">
          {(value as string) || "—"}
        </span>
      ),
    },
    {
      key: "phone",
      label: "Phone",
      render: (value: unknown) => (
        <span className="text-sm text-muted-foreground">
          {(value as string) || "—"}
        </span>
      ),
    },
    {
      key: "location",
      label: "Location",
      render: (_: unknown, row: Record<string, unknown>) => {
        const address = row.address as string;
        // Koordinat - uncomment jika diperlukan
        // const lat = row.latitude as number | null;
        // const long = row.longitude as number | null;

        if (!address)
          return <span className="text-muted-foreground">—</span>;

        return (
          <div className="flex flex-col gap-0.5">
            {address && (
              <span
                className="max-w-[150px] truncate text-sm font-medium"
                title={address}
              >
                {address}
              </span>
            )}
            {/* Koordinat - uncomment jika diperlukan
            {lat && long && (
              <a
                href={`https://www.google.com/maps?q=${lat},${long}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary hover:underline"
              >
                <MapPin className="h-3 w-3" />
                {lat.toFixed(4)}, {long.toFixed(4)}
              </a>
            )}
            */}
          </div>
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
                Delete User
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
    let filteredProfiles = profiles;

    // Apply search filter
    if (searchQuery) {
      filteredProfiles = filteredProfiles.filter((profile) => {
        const searchableFields = [
          profile.username,
          profile.email,
          profile.fullname,
          profile.organization,
          profile.phone,
          profile.address,
          profile.role,
        ];

        return searchableFields.some((field) =>
          field?.toLowerCase().includes(searchQuery)
        );
      });
    }

    // Apply role filter
    if (roleFilter !== "all") {
      filteredProfiles = filteredProfiles.filter(
        (profile) => (profile.role ?? "user").toLowerCase() === roleFilter
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filteredProfiles = filteredProfiles.filter((profile) => {
        const status = profile.is_blocked ? "blocked" : "active";
        return status === statusFilter;
      });
    }

    return filteredProfiles.map((profile) => ({
      id: profile.id,
      account: profile.id,
      avatar: profile.avatar_url ?? undefined,
      fullname: profile.fullname,
      username: profile.username ?? "—",
      email: profile.email,
      role: profile.role ?? "user",
      organization: profile.organization,
      phone: profile.phone,
      address: profile.address,
      latitude: profile.latitude,
      longitude: profile.longitude,
      status: profile.is_blocked ? "Blocked" : "Active",
    }));
  }, [profiles, searchQuery, roleFilter, statusFilter]);

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
          <h1 className="text-3xl font-bold text-foreground">Manage Users</h1>
          <p className="mt-1 text-muted-foreground">{profiles.length} total users</p>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Cari pengguna..."
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

          {/* Role Filter */}
          <Select value={roleFilter} onValueChange={(value) => { setRoleFilter(value); setCurrentPage(1); }}>
            <SelectTrigger className="w-32">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                <SelectValue placeholder="Role" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Role</SelectItem>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={(value) => { setStatusFilter(value); setCurrentPage(1); }}>
            <SelectTrigger className="w-36">
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

      <Dialog
        open={confirmDialog.open}
        onOpenChange={(open) => setConfirmDialog((prev) => ({ ...prev, open }))}
      >
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>
              {confirmDialog.type === "role"
                ? "Ubah Role Pengguna"
                : "Ubah Status Pengguna"}
            </DialogTitle>
            <DialogDescription>
              {confirmDialog.type === "role" ? (
                <>
                  Apakah Anda yakin ingin mengubah role{" "}
                  <strong>{confirmDialog.userName}</strong> dari{" "}
                  <strong>{formatRole(confirmDialog.currentValue)}</strong>{" "}
                  menjadi <strong>{formatRole(confirmDialog.newValue)}</strong>?
                </>
              ) : (
                <>
                  Apakah Anda yakin ingin mengubah status{" "}
                  <strong>{confirmDialog.userName}</strong> dari{" "}
                  <strong>{confirmDialog.currentValue}</strong> menjadi{" "}
                  <strong>{confirmDialog.newValue}</strong>?
                </>
              )}
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

      {/* Edit User Dialog */}
      <Dialog
        open={editDialog.open}
        onOpenChange={(open) => setEditDialog((prev) => ({ ...prev, open, showConfirm: false }))}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          
          {!editDialog.showConfirm ? (
            <>
              <div className="grid grid-cols-2 gap-4 py-4">
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
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={editDialog.email}
                    onChange={(e) =>
                      setEditDialog((prev) => ({ ...prev, email: e.target.value }))
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Telepon</Label>
                  <Input
                    id="phone"
                    value={editDialog.phone}
                    onChange={(e) =>
                      setEditDialog((prev) => ({ ...prev, phone: e.target.value }))
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="organization">Organisasi</Label>
                  <Input
                    id="organization"
                    value={editDialog.organization}
                    onChange={(e) =>
                      setEditDialog((prev) => ({
                        ...prev,
                        organization: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="address">Alamat</Label>
                  <Input
                    id="address"
                    value={editDialog.address}
                    onChange={(e) =>
                      setEditDialog((prev) => ({
                        ...prev,
                        address: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Role</Label>
                  <Select
                    value={editDialog.role}
                    onValueChange={(value) =>
                      setEditDialog((prev) => ({ ...prev, role: value }))
                    }
                  >
                    <SelectTrigger>
                      <span>{editDialog.role === "user" ? "User" : "Admin"}</span>
                    </SelectTrigger>
                    <SelectContent>
                      {editDialog.role === "user" ? (
                        <SelectItem value="admin">Admin</SelectItem>
                      ) : (
                        <SelectItem value="user">User</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Status</Label>
                  <Select
                    value={editDialog.status}
                    onValueChange={(value) =>
                      setEditDialog((prev) => ({ ...prev, status: value }))
                    }
                  >
                    <SelectTrigger>
                      <span>{editDialog.status === "active" ? "Active" : "Blocked"}</span>
                    </SelectTrigger>
                    <SelectContent>
                      {editDialog.status === "active" ? (
                        <SelectItem value="blocked">Blocked</SelectItem>
                      ) : (
                        <SelectItem value="active">Active</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() =>
                    setEditDialog((prev) => ({ ...prev, open: false }))
                  }
                >
                  Batal
                </Button>
                <Button onClick={handleEditSave}>Simpan</Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <DialogDescription className="py-4">
                Apakah Anda yakin ingin menyimpan perubahan data pengguna ini?
              </DialogDescription>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() =>
                    setEditDialog((prev) => ({ ...prev, showConfirm: false }))
                  }
                >
                  Kembali
                </Button>
                <Button onClick={handleEditSave}>Ya, Simpan</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog
        open={deleteDialog.open}
        onOpenChange={(open) => {
          setDeleteDialog((prev) => ({ ...prev, open, confirmText: "" }));
        }}
      >
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle className="text-destructive">
              Hapus Pengguna
            </DialogTitle>
            <DialogDescription>
              Anda akan menghapus pengguna{" "}
              <strong>{deleteDialog.userName}</strong>. Tindakan ini tidak dapat
              dibatalkan.
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
              onClick={handleDeleteUser}
              disabled={deleteDialog.confirmText !== "Delete"}
            >
              Hapus Pengguna
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function formatRole(role: string) {
  if (!role) return "User";
  return role
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getInitials(name: string) {
  const parts = name.split(" ");
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
