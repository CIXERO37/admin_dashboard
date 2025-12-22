"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Users,
  Calendar,
  Copy,
  Check,
  Search,
  MoreVertical,
  Trash2,
  Shield,
  UserMinus,
  Crown,
  SlidersHorizontal,
  MapPin,
} from "lucide-react";
import { format } from "date-fns";

import { cn, getAvatarUrl } from "@/lib/utils";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  type GroupDetail,
  type GroupMember,
  removeGroupMember,
  updateMemberRole,
} from "../actions";

interface GroupDetailClientProps {
  group: GroupDetail;
  members: GroupMember[];
  totalPages: number;
  currentPage: number;
  searchQuery: string;
  roleFilter: string;
}

function getGroupStatus(group: GroupDetail): {
  label: string;
  variant: "default" | "secondary" | "outline";
} {
  const settings = group.settings as { status?: string } | null;
  if (settings?.status === "private") {
    return { label: "PRIVATE", variant: "outline" };
  }
  return { label: "PUBLIC", variant: "secondary" };
}

function getLocation(group: GroupDetail): string {
  const creator = group.creator;
  if (creator?.state?.name || creator?.city?.name) {
    const parts = [creator.state?.name, creator.city?.name].filter(Boolean);
    return parts.join(", ");
  }

  const settings = group.settings as { location?: string } | null;
  return settings?.location || "Indonesia";
}

function getRoleBadgeStyle(role: string) {
  switch (role) {
    case "owner":
      return "bg-yellow-500/20 text-yellow-600 border-yellow-500/30";
    case "admin":
      return "bg-blue-500/20 text-blue-600 border-blue-500/30";
    default:
      return "bg-secondary text-secondary-foreground border-border";
  }
}

export function GroupDetailClient({
  group,
  members,
  totalPages,
  currentPage,
  searchQuery,
  roleFilter,
}: GroupDetailClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const [searchInput, setSearchInput] = useState(searchQuery);

  const [removeMemberDialog, setRemoveMemberDialog] = useState<{
    open: boolean;
    memberId: string;
    memberName: string;
  }>({ open: false, memberId: "", memberName: "" });

  const status = getGroupStatus(group);
  const location = getLocation(group);

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
    if (e.key === "Enter") handleSearch();
  };

  const handlePageChange = (page: number) => {
    updateUrl({ page, search: searchQuery, role: roleFilter });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRemoveMember = async () => {
    const { error } = await removeGroupMember(
      group.id,
      removeMemberDialog.memberId
    );
    if (error) {
      toast({
        title: "Error",
        description: "Failed to remove member",
        variant: "destructive",
      });
    } else {
      toast({ title: "Success", description: "Member removed successfully" });
      router.refresh();
    }
    setRemoveMemberDialog({ open: false, memberId: "", memberName: "" });
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    const { error } = await updateMemberRole(group.id, userId, newRole);
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
  };

  return (
    <div className="space-y-4">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/groups">Groups</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{group.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col lg:flex-row lg:items-start gap-6">
        {/* Left Sidebar */}
        <div className="lg:w-80">
          <Card className="overflow-hidden border-border bg-card py-0 gap-0">
            {/* Cover Image Banner */}
            <div className="relative h-32 w-full bg-muted">
              {group.cover_url ? (
                <>
                  <img
                    src={getAvatarUrl(group.cover_url)}
                    alt={group.name}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/40" />
                </>
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent" />
              )}
            </div>

            <CardContent className="pt-0 pb-6 px-6 relative">
              <div className="flex flex-col items-center text-center -mt-10">
                <Avatar className="h-20 w-20 border-4 border-card shadow-lg relative z-10">
                  <AvatarImage
                    src={getAvatarUrl(group.avatar_url)}
                    alt={group.name}
                    className="object-cover"
                  />
                  <AvatarFallback className="text-xl font-bold bg-primary text-primary-foreground">
                    {group.name
                      .split(" ")
                      .map((w) => w[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <h2 className="mt-3 text-lg font-bold">{group.name}</h2>
                {group.description && (
                  <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
                    {group.description}
                  </p>
                )}

                {/* Stats */}
                <div className="flex justify-center gap-6 mt-4 pt-4 border-t w-full">
                  <div className="text-center">
                    <p className="text-lg font-bold">{group.member_count}</p>
                    <p className="text-xs text-muted-foreground">Members</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold">
                      {members.filter((m) => m.role === "admin").length}
                    </p>
                    <p className="text-xs text-muted-foreground">Admins</p>
                  </div>
                </div>
              </div>

              {/* Group Info */}
              <div className="mt-4 space-y-3 text-sm border-t pt-4">
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-muted-foreground truncate">
                    {location}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="h-4 w-4 text-muted-foreground shrink-0" />
                  <Badge
                    className={`text-xs font-semibold ${
                      status.variant === "secondary"
                        ? "bg-green-500 text-white border-green-500"
                        : "bg-muted text-muted-foreground border-border"
                    }`}
                  >
                    {status.label}
                  </Badge>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-muted-foreground">
                    {group.created_at
                      ? format(new Date(group.created_at), "d MMM yyyy")
                      : "-"}
                  </span>
                </div>
              </div>

              {/* Creator */}
              <div className="mt-4 pt-4 border-t">
                <p className="text-xs text-muted-foreground mb-2">Created by</p>
                <Link
                  href={`/users/${group.creator_id}`}
                  className="flex items-center gap-3 hover:bg-muted rounded-lg p-2 -mx-2 transition-colors"
                >
                  <Avatar className="h-8 w-8 border border-border">
                    <AvatarImage
                      src={getAvatarUrl(group.creator?.avatar_url)}
                      className="object-cover"
                    />
                    <AvatarFallback className="text-xs">
                      {(group.creator?.fullname || "?").slice(0, 1)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="overflow-hidden">
                    <p className="font-medium text-sm hover:text-primary transition-colors truncate">
                      {group.creator?.fullname || "Unknown"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      @{group.creator?.username || "-"}
                    </p>
                  </div>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Members Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                Members
              </CardTitle>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Input
                    placeholder="Search member..."
                    className="pr-10 bg-background border-border w-48"
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
                  value={roleFilter}
                  onValueChange={(value) => updateUrl({ role: value, page: 1 })}
                >
                  <SelectTrigger className="w-32 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <SlidersHorizontal className="h-4 w-4" />
                      <SelectValue placeholder="Role" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all" className="cursor-pointer">
                      All Roles
                    </SelectItem>
                    <SelectItem value="owner" className="cursor-pointer">
                      Owner
                    </SelectItem>
                    <SelectItem value="admin" className="cursor-pointer">
                      Admin
                    </SelectItem>
                    <SelectItem value="member" className="cursor-pointer">
                      Member
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {/* Members List */}
              {members.length > 0 ? (
                <div className="space-y-2 max-h-[343px] overflow-y-auto pr-1">
                  {members.map((member, index) => {
                    const name =
                      member.fullname || member.username || "Unknown";
                    const initials = name
                      .split(" ")
                      .map((w) => w[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase();

                    return (
                      <div
                        key={member.user_id || index}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-muted/50"
                      >
                        <Link
                          href={`/users/${member.user_id}`}
                          className="flex items-center gap-3"
                        >
                          <Avatar className="h-10 w-10 border border-border">
                            <AvatarImage
                              src={getAvatarUrl(member.avatar_url)}
                              alt={name}
                              className="object-cover"
                            />
                            <AvatarFallback className="text-sm">
                              {initials}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium hover:text-primary transition-colors">
                                {member.fullname || "Unknown"}
                              </p>
                              {member.role === "owner" && (
                                <Crown className="h-4 w-4 text-yellow-500" />
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              @{member.username || "-"}
                            </p>
                          </div>
                        </Link>

                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={getRoleBadgeStyle(member.role)}
                          >
                            {member.role}
                          </Badge>

                          {member.role !== "owner" && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 cursor-pointer"
                                >
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {member.role !== "admin" && (
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleRoleChange(member.user_id, "admin")
                                    }
                                    className="cursor-pointer"
                                  >
                                    <Shield className="h-4 w-4 mr-2" />
                                    Make Admin
                                  </DropdownMenuItem>
                                )}
                                {member.role === "admin" && (
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleRoleChange(member.user_id, "member")
                                    }
                                    className="cursor-pointer"
                                  >
                                    <UserMinus className="h-4 w-4 mr-2" />
                                    Remove Admin
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() =>
                                    setRemoveMemberDialog({
                                      open: true,
                                      memberId: member.user_id,
                                      memberName: name,
                                    })
                                  }
                                  className="cursor-pointer text-destructive focus:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Remove from Group
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Users className="h-12 w-12 text-muted-foreground/50 mb-3" />
                  <p className="text-muted-foreground">
                    {searchQuery
                      ? "No members found"
                      : "This group has no members yet"}
                  </p>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    Page{" "}
                    <span className="font-medium text-foreground">
                      {currentPage}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium text-foreground">
                      {totalPages}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1 || isPending}
                      className={cn(
                        "px-3 py-1.5 text-sm font-medium rounded-lg border transition-colors",
                        currentPage === 1 || isPending
                          ? "border-border bg-secondary/50 text-muted-foreground cursor-not-allowed"
                          : "border-border bg-card text-foreground hover:bg-secondary/80 cursor-pointer"
                      )}
                    >
                      Previous
                    </button>

                    <div className="flex items-center gap-1">
                      {Array.from(
                        { length: Math.min(totalPages, 5) },
                        (_, i) => {
                          let page = i + 1;
                          if (totalPages > 5) {
                            if (currentPage > 3) page = currentPage - 2 + i;
                            if (currentPage > totalPages - 2)
                              page = totalPages - 4 + i;
                          }
                          return (
                            <button
                              key={page}
                              onClick={() => handlePageChange(page)}
                              disabled={isPending}
                              className={cn(
                                "w-9 h-9 text-sm font-medium rounded-lg border transition-colors cursor-pointer",
                                currentPage === page
                                  ? "border-primary bg-primary text-primary-foreground"
                                  : "border-border bg-card text-foreground hover:bg-secondary/80"
                              )}
                            >
                              {page}
                            </button>
                          );
                        }
                      )}
                    </div>

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages || isPending}
                      className={cn(
                        "px-3 py-1.5 text-sm font-medium rounded-lg border transition-colors",
                        currentPage === totalPages || isPending
                          ? "border-border bg-secondary/50 text-muted-foreground cursor-not-allowed"
                          : "border-border bg-card text-foreground hover:bg-secondary/80 cursor-pointer"
                      )}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Remove Member Dialog */}
      <Dialog
        open={removeMemberDialog.open}
        onOpenChange={(open) =>
          setRemoveMemberDialog({ open, memberId: "", memberName: "" })
        }
      >
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Remove Member</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove{" "}
              <strong>{removeMemberDialog.memberName}</strong> from this group?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              className="cursor-pointer"
              onClick={() =>
                setRemoveMemberDialog({
                  open: false,
                  memberId: "",
                  memberName: "",
                })
              }
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="cursor-pointer"
              onClick={handleRemoveMember}
            >
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
