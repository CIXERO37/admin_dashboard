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
  Activity,
  UserPlus,
  LogOut,
  Settings,
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
  const [activeTab, setActiveTab] = useState<"members" | "activity">("members");

  const [removeMemberDialog, setRemoveMemberDialog] = useState<{
    open: boolean;
    memberId: string;
    memberName: string;
  }>({ open: false, memberId: "", memberName: "" });

  const status = getGroupStatus(group);
  const location = getLocation(group);

  // ... (existing handlers)

  const updateUrl = (params: Record<string, string | number>) => {
    // ...
  };

  const handleSearch = () => {
    // ...
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // ...
  };

  const handlePageChange = (page: number) => {
    // ...
  };

  const handleRemoveMember = async () => {
    // ...
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    // ...
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "member_promoted":
        return <Shield className="h-5 w-5 text-blue-500" />;
      case "member_demoted":
        return <UserMinus className="h-5 w-5 text-orange-500" />;
      case "member_joined":
        return <UserPlus className="h-5 w-5 text-green-500" />;
      case "member_left":
      case "member_removed":
        return <LogOut className="h-5 w-5 text-red-500" />;
      default:
        return <Activity className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getActivityDescription = (activity: any) => {
    const username = activity.nama || "Unknown User";
    let action = activity.type.replace(/_/g, " ");

    switch (activity.type) {
      case "member_joined":
        action = "joined the group";
        break;
      case "member_left":
        action = "left the group";
        break;
      case "member_removed":
        action = "was kicked from the group";
        break;
      case "member_promoted":
        action = "was promoted to admin";
        break;
      case "member_demoted":
        action = "was demoted to member";
        break;
      case "member_kicked":
        action = "was kicked from the group";
        break;
    }

    return (
      <span>
        <span className="text-emerald-500 font-bold">{username}</span> {action}
      </span>
    );
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Breadcrumb ... (keep as is) */}
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

        {/* Header Profile Card */}
        <Card className="overflow-hidden border-border bg-card p-0 gap-0">
          <div className="relative h-32 md:h-48 w-full bg-muted">
            {group.cover_url ? (
              <>
                <img
                  src={getAvatarUrl(group.cover_url)}
                  alt={group.name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-black/10" />
              </>
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent" />
            )}
          </div>

          <div className="relative flex flex-col items-center px-6 pb-6 pt-0 text-center">
            <div className="-mt-12 mb-3">
              <Avatar className="h-24 w-24 border-4 border-card shadow-xl">
                <AvatarImage
                  src={getAvatarUrl(group.avatar_url)}
                  alt={group.name}
                  className="object-cover"
                />
                <AvatarFallback className="text-3xl font-bold bg-primary text-primary-foreground">
                  {group.name
                    .split(" ")
                    .map((w) => w[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>

            <h1 className="text-2xl font-bold text-foreground">{group.name}</h1>
            <p className="max-w-2xl text-muted-foreground mt-1 text-sm">
              {group.description || "No description available for this group."}
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
              {/* ... Metadata Row ... */}
              <div className="flex items-center gap-1.5">
                <Shield className="h-4 w-4" />
                <Badge
                  variant={status.variant}
                  className={cn(
                    "uppercase",
                    status.variant === "secondary" &&
                      "bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-900"
                  )}
                >
                  {status.label}
                </Badge>
              </div>

              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                <span>{location}</span>
              </div>

              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <span>
                  {group.created_at
                    ? format(new Date(group.created_at), "d MMMM yyyy")
                    : "-"}
                </span>
              </div>
            </div>

            {/* Tabs Navigation (Functional) */}
            <div className="mt-8 flex w-full max-w-lg items-center justify-center border-b border-border">
              <button
                onClick={() => setActiveTab("members")}
                className={cn(
                  "px-6 py-3 text-sm font-medium transition-colors border-b-2",
                  activeTab === "members"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                Members
              </button>

              <button
                onClick={() => setActiveTab("activity")}
                className={cn(
                  "px-6 py-3 text-sm font-medium transition-colors border-b-2",
                  activeTab === "activity"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                Activity
              </button>
            </div>
          </div>
        </Card>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12 pb-6 pt-0">
          {/* Left Sidebar (About/Creator) - ALways Visible */}
          <div className="md:col-span-4 lg:col-span-3 space-y-6">
            <Card>
              <CardContent className="space-y-4 pt-2">
                {/* ... (keep existing About content) ... */}
                <div>
                  <p className="text-sm font-medium text-foreground">Creator</p>
                  <Link
                    href={`/users/${group.creator_id}`}
                    className="flex items-center gap-3 mt-2 hover:bg-muted p-2 -mx-2 rounded-lg transition-colors group"
                  >
                    <Avatar className="h-8 w-8 border border-border">
                      <AvatarImage
                        src={getAvatarUrl(group.creator?.avatar_url)}
                      />
                      <AvatarFallback>
                        {(group.creator?.fullname || "?")
                          .slice(0, 1)
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="overflow-hidden">
                      <p
                        className="text-sm font-medium truncate group-hover:text-primary transition-colors"
                        title={group.creator?.fullname || "Unknown"}
                      >
                        {group.creator?.fullname || "Unknown"}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        @{group.creator?.username || "-"}
                      </p>
                    </div>
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg bg-muted p-3 text-center">
                    <p className="text-2xl font-bold">{group.member_count}</p>
                    <p className="text-xs text-muted-foreground">Members</p>
                  </div>
                  <div className="rounded-lg bg-muted p-3 text-center">
                    <p className="text-2xl font-bold">
                      {members.filter((m) => m.role === "admin").length}
                    </p>
                    <p className="text-xs text-muted-foreground">Admins</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Content - CONDITIONAL */}
          <div className="md:col-span-8 lg:col-span-9">
            {activeTab === "members" && (
              <Card>
                {/* ... (Existing Members List content) ... */}
                <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-col gap-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      Members List
                    </CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* ... Search & Filter ... */}
                    <div className="relative">
                      <Input
                        placeholder="Search member..."
                        className="pr-10 bg-background border-border w-48 lg:w-64"
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
                      onValueChange={(value) =>
                        updateUrl({ role: value, page: 1 })
                      }
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Roles</SelectItem>
                        <SelectItem value="owner">Owner</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="member">Member</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* ... (Existing Members List Map) ... */}
                  {members.length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
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
                            className="group relative flex items-start gap-3 rounded-xl border border-border bg-card p-4 transition-all hover:shadow-md hover:border-primary/50"
                          >
                            <Avatar className="h-10 w-10 border border-border shrink-0">
                              <AvatarImage
                                src={getAvatarUrl(member.avatar_url)}
                                alt={name}
                              />
                              <AvatarFallback>{initials}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1 pr-6">
                                <Link
                                  href={`/users/${member.user_id}`}
                                  className="font-medium truncate hover:text-primary transition-colors min-w-0"
                                  title={name}
                                >
                                  {name}
                                </Link>
                                <Badge
                                  variant="outline"
                                  className={
                                    getRoleBadgeStyle(member.role) +
                                    " text-[10px] px-1.5 py-0 h-5 shrink-0"
                                  }
                                >
                                  {member.role}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground truncate mb-2">
                                @{member.username || "-"}
                              </p>

                              {member.role !== "owner" && (
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                      >
                                        <MoreVertical className="h-3.5 w-3.5" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      {member.role !== "admin" && (
                                        <DropdownMenuItem
                                          onClick={() =>
                                            handleRoleChange(
                                              member.user_id,
                                              "admin"
                                            )
                                          }
                                        >
                                          <Shield className="h-4 w-4 mr-2" />{" "}
                                          Make Admin
                                        </DropdownMenuItem>
                                      )}
                                      {member.role === "admin" && (
                                        <DropdownMenuItem
                                          onClick={() =>
                                            handleRoleChange(
                                              member.user_id,
                                              "member"
                                            )
                                          }
                                        >
                                          <UserMinus className="h-4 w-4 mr-2" />{" "}
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
                                        className="text-destructive focus:text-destructive"
                                      >
                                        <Trash2 className="h-4 w-4 mr-2" />{" "}
                                        Remove
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-muted rounded-xl bg-muted/20">
                      <Users className="h-12 w-12 text-muted-foreground/50 mb-3" />
                      <p className="text-lg font-medium">No members found</p>
                      <p className="text-sm text-muted-foreground max-w-sm mt-1">
                        Try adjusting your filters or search query to find who
                        you're looking for.
                      </p>
                    </div>
                  )}

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-6">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1 || isPending}
                      >
                        Previous
                      </Button>
                      <div className="text-sm font-medium">
                        Page {currentPage} of {totalPages}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages || isPending}
                      >
                        Next
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {activeTab === "activity" && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {group.activities && group.activities.length > 0 ? (
                    <div className="space-y-6 relative ml-2">
                      <div className="absolute left-2.5 top-0 bottom-0 w-px bg-border" />
                      {group.activities
                        .sort(
                          (a, b) =>
                            new Date(b.created).getTime() -
                            new Date(a.created).getTime()
                        )
                        .map((activity, index) => (
                          <div
                            key={activity.id || index}
                            className="relative flex gap-4 items-start group"
                          >
                            <div className="absolute left-0 mt-0.5 h-5 w-5 rounded-full bg-background border border-border flex items-center justify-center z-10 group-hover:border-primary transition-colors">
                              {getActivityIcon(activity.type)}
                            </div>
                            <div className="flex-1 ml-6 rounded-lg border border-border bg-card/50 p-4 transition-all hover:bg-muted/50">
                              <div className="flex items-center justify-between mb-1">
                                <p className="font-medium text-sm">
                                  {getActivityDescription(activity)}
                                </p>
                                <span className="text-xs text-muted-foreground whitespace-nowrap">
                                  {format(
                                    new Date(activity.created),
                                    "d MMM yyyy, HH:mm"
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-muted rounded-xl bg-muted/20">
                      <Activity className="h-12 w-12 text-muted-foreground/50 mb-3" />
                      <p className="text-lg font-medium">
                        No activity recorded
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Activities will appear here when actions are taken in
                        this group.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* ... Dialog ... */}
        <Dialog
          open={removeMemberDialog.open}
          onOpenChange={(open) =>
            setRemoveMemberDialog({ open, memberId: "", memberName: "" })
          }
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Remove Member</DialogTitle>
              <DialogDescription>
                Are you sure you want to remove{" "}
                <strong>{removeMemberDialog.memberName}</strong> from this
                group?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
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
              <Button variant="destructive" onClick={handleRemoveMember}>
                Remove Member
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}
