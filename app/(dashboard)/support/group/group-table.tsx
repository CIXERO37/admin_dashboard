"use client";

import {
  Search,
  Users,
  MoreVertical,
  Calendar,
  Eye,
  Trash2,
  SlidersHorizontal,
  Filter,
  RotateCcw,
} from "lucide-react";
import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

import { cn, getAvatarUrl } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Combobox } from "@/components/ui/combobox";
import {
  type Group,
  type Country,
  type State,
  type City,
  deleteGroupAction,
} from "./actions";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

interface GroupTableProps {
  initialData: Group[];
  totalPages: number;
  currentPage: number;
  searchQuery: string;
  statusFilter?: string;
  countries: Country[];
}

function formatDate(dateString?: string | null): string {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getGroupStatus(group: Group): {
  label: string;
  variant: "default" | "secondary" | "outline";
} {
  const settings = group.settings as { status?: string } | null;

  if (settings?.status === "private") {
    return { label: "PRIVATE", variant: "outline" };
  }
  return { label: "PUBLIC", variant: "secondary" };
}

function getLocation(group: Group): string {
  const settings = group.settings as { location?: string } | null;
  return settings?.location || "Indonesia";
}

interface GroupCardProps {
  group: Group & { member_count: number };
  onDelete: (id: string, name: string) => void;
}

function GroupCard({ group, onDelete }: GroupCardProps) {
  const router = useRouter();
  const name = group.name || "Unknown Group";
  const avatarUrl = group.avatar_url;
  const coverUrl = getAvatarUrl(group.cover_url);
  const status = getGroupStatus(group);
  const location = getLocation(group);
  const initials = name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();
  const creator = group.creator;
  const creatorName = creator?.fullname || "Unknown";
  const creatorEmail = creator?.email || "-";
  const creatorInitials = creatorName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleCardClick = () => {
    router.push(`/support/group/${group.id}`);
  };

  return (
    <div
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-lg transition-all duration-300 hover:shadow-xl hover:border-primary/50 cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Header with cover image or gradient fallback */}
      <div
        className="relative p-4 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent"
        style={
          coverUrl
            ? {
                backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url(${coverUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : undefined
        }
      >
        {/* Status Badge Row */}
        <div className="flex items-center justify-between mb-3">
          <Badge
            variant={status.variant}
            className={`text-[10px] font-semibold px-2 py-0.5 ${
              status.variant === "secondary"
                ? "bg-green-500/90 text-white border-green-500"
                : "bg-black/50 border-white/30 text-white"
            }`}
          >
            {status.label}
          </Badge>

          {/* More Options */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button
                variant="ghost"
                size="icon"
                className={`h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity ${
                  coverUrl ? "text-white hover:bg-white/20" : ""
                }`}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href={`/support/group/${group.id}`}>
                  <Eye className="h-4 w-4 mr-2" />
                  Detail
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(group.id, name);
                }}
                className="cursor-pointer text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Move to Trash
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Avatar and Name */}
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 border-2 border-white/50 shadow-md ring-2 ring-background">
            <AvatarImage src={getAvatarUrl(avatarUrl)} alt={name} />
            <AvatarFallback className="bg-muted text-muted-foreground font-bold text-sm">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3
              className={`font-bold text-base truncate leading-tight ${
                coverUrl ? "text-white" : "text-foreground"
              }`}
              title={name}
            >
              {name}
            </h3>
            <p
              className={`text-xs truncate mt-0.5 ${
                coverUrl ? "text-white/80" : "text-muted-foreground"
              }`}
              title={location}
            >
              {location}
            </p>
          </div>
        </div>
      </div>

      {/* Creator Info */}
      <div className="flex-1 p-4 pt-3">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">
          Created by
        </p>
        <Link
          href={`/profiles/${group.creator_id}`}
          className="flex items-center gap-2 hover:bg-muted/50 rounded-lg p-1 -m-1 transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          <Avatar className="h-8 w-8 border border-border">
            <AvatarImage
              src={getAvatarUrl(creator?.avatar_url)}
              alt={creatorName}
            />
            <AvatarFallback className="bg-muted text-muted-foreground text-xs font-medium">
              {creatorInitials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p
              className="text-sm font-medium text-foreground truncate hover:text-primary transition-colors"
              title={creatorName}
            >
              {creatorName}
            </p>
            <p
              className="text-xs text-muted-foreground truncate"
              title={`@${creator?.username || "-"}`}
            >
              @{creator?.username || "-"}
            </p>
          </div>
        </Link>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-border/50 bg-muted/30">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            <span>{formatDate(group.created_at)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5" />
            <span>{group.member_count} Members</span>
          </div>
        </div>

        {/* Detail Button */}
        <Button
          className="w-full gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
          size="sm"
          asChild
          onClick={(e) => e.stopPropagation()}
        >
          <Link href={`/support/group/${group.id}`}>
            <Eye className="h-4 w-4" />
            Detail
          </Link>
        </Button>
      </div>
    </div>
  );
}

export function GroupTable({
  initialData,
  totalPages,
  currentPage,
  searchQuery,
  statusFilter = "all",
  countries,
}: GroupTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [searchInput, setSearchInput] = useState(searchQuery);
  const { toast } = useToast();

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    id: string;
    groupName: string;
    confirmText: string;
  }>({
    open: false,
    id: "",
    groupName: "",
    confirmText: "",
  });

  // Filter dialog state
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [filterValues, setFilterValues] = useState({
    country: searchParams.get("country") || "",
    state: searchParams.get("state") || "",
    city: searchParams.get("city") || "",
    status: statusFilter,
  });

  // Location data state
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);

  // Convert countries to combobox options
  const countryOptions = countries.map((c) => ({
    value: String(c.id),
    label: c.name,
  }));

  const stateOptions = states.map((s) => ({
    value: String(s.id),
    label: s.name,
  }));

  const cityOptions = cities.map((c) => ({
    value: String(c.id),
    label: c.name,
  }));

  // Handle country change - fetch states directly from client
  const handleCountryChange = async (countryId: string) => {
    setFilterValues((prev) => ({
      ...prev,
      country: countryId,
      state: "",
      city: "",
    }));
    setStates([]);
    setCities([]);

    if (countryId) {
      setLoadingStates(true);
      const supabase = getSupabaseBrowserClient();
      const { data } = await supabase
        .from("states")
        .select("id, name, country_id")
        .eq("country_id", Number(countryId))
        .order("name");
      setStates(data ?? []);
      setLoadingStates(false);
    }
  };

  // Handle state change - fetch cities directly from client
  const handleStateChange = async (stateId: string) => {
    setFilterValues((prev) => ({
      ...prev,
      state: stateId,
      city: "",
    }));
    setCities([]);

    if (stateId) {
      setLoadingCities(true);
      const supabase = getSupabaseBrowserClient();
      const { data } = await supabase
        .from("cities")
        .select("id, name, state_id")
        .eq("state_id", Number(stateId))
        .order("name");
      setCities(data ?? []);
      setLoadingCities(false);
    }
  };

  const openDeleteDialog = (id: string, groupName: string) => {
    setDeleteDialog({ open: true, id, groupName, confirmText: "" });
  };

  const handleResetFilter = () => {
    setFilterValues({
      country: "",
      state: "",
      city: "",
      status: "all",
    });
    setStates([]);
    setCities([]);
  };

  const handleApplyFilter = () => {
    updateUrl({
      country: filterValues.country,
      state: filterValues.state,
      city: filterValues.city,
      status: filterValues.status,
      page: 1,
    });
    setFilterDialogOpen(false);
  };

  const handleCancelFilter = () => {
    // Reset to current URL params
    setFilterValues({
      country: searchParams.get("country") || "",
      state: searchParams.get("state") || "",
      city: searchParams.get("city") || "",
      status: statusFilter,
    });
    setFilterDialogOpen(false);
  };

  const handleDeleteGroup = async () => {
    if (deleteDialog.confirmText !== "Move to Trash") return;

    const { error } = await deleteGroupAction(deleteDialog.id);
    if (error) {
      toast({
        title: "Error",
        description: "Failed to move group to trash",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Group moved to trash successfully",
      });
      router.refresh();
    }
    setDeleteDialog((prev) => ({ ...prev, open: false, confirmText: "" }));
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
    updateUrl({ page, search: searchQuery, status: statusFilter });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const groupsWithCount = initialData.map((group) => ({
    ...group,
    member_count: group.members?.length ?? 0,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Manage Groups</h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Input
              placeholder="Search group..."
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

          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 bg-black border-black hover:bg-black/80"
            onClick={() => setFilterDialogOpen(true)}
          >
            <Filter className="h-4 w-4 text-white" />
          </Button>
        </div>
      </div>

      {/* Group Cards Grid */}
      <div className={isPending ? "opacity-60 pointer-events-none" : ""}>
        {groupsWithCount.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {groupsWithCount.map((group) => (
              <GroupCard
                key={group.id}
                group={group}
                onDelete={openDeleteDialog}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-border rounded-lg">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
              <Users className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-base font-medium text-foreground mb-1">
              No groups found
            </h3>
            <p className="text-sm text-muted-foreground">
              {searchQuery
                ? "No groups match your search"
                : "No groups available yet"}
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between rounded-xl border border-border bg-card px-6 py-4">
        <div className="text-sm text-muted-foreground">
          Page{" "}
          <span className="font-medium text-foreground">{currentPage}</span> of{" "}
          <span className="font-medium text-foreground">{totalPages || 1}</span>
        </div>

        {totalPages > 1 && (
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
              {(() => {
                const pages: (number | string)[] = [];

                if (totalPages <= 7) {
                  for (let i = 1; i <= totalPages; i++) {
                    pages.push(i);
                  }
                } else {
                  pages.push(1);

                  if (currentPage <= 3) {
                    pages.push(2, 3, 4, "...", totalPages);
                  } else if (currentPage >= totalPages - 2) {
                    pages.push(
                      "...",
                      totalPages - 3,
                      totalPages - 2,
                      totalPages - 1,
                      totalPages
                    );
                  } else {
                    pages.push(
                      "...",
                      currentPage - 1,
                      currentPage,
                      currentPage + 1,
                      "...",
                      totalPages
                    );
                  }
                }

                return pages.map((page, index) => {
                  if (page === "...") {
                    return (
                      <span
                        key={`ellipsis-${index}`}
                        className="w-9 h-9 flex items-center justify-center text-sm text-muted-foreground"
                      >
                        ...
                      </span>
                    );
                  }

                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page as number)}
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
                });
              })()}
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
        )}
      </div>

      {/* Delete Dialog */}
      <Dialog
        open={deleteDialog.open}
        onOpenChange={(open) =>
          setDeleteDialog((prev) => ({ ...prev, open, confirmText: "" }))
        }
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Move to Trash</DialogTitle>
            <DialogDescription>
              Are you sure you want to move{" "}
              <strong>{deleteDialog.groupName}</strong> to the trash bin? You
              can restore it later.
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
          <DialogFooter className="gap-2 sm:gap-0">
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
              onClick={handleDeleteGroup}
              disabled={deleteDialog.confirmText !== "Move to Trash"}
            >
              Move to Trash
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Filter Dialog */}
      <Dialog open={filterDialogOpen} onOpenChange={setFilterDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-primary" />
              Filter
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Country */}
            <div className="grid gap-2">
              <Label htmlFor="country">Country</Label>
              <Combobox
                options={countryOptions}
                value={filterValues.country}
                onValueChange={handleCountryChange}
                placeholder="Select Country"
                searchPlaceholder="Search country..."
                emptyText="No country found."
                className="w-full"
              />
            </div>

            {/* State */}
            <div className="grid gap-2">
              <Label htmlFor="state">State</Label>
              <Combobox
                options={stateOptions}
                value={filterValues.state}
                onValueChange={handleStateChange}
                placeholder={loadingStates ? "Loading..." : "Select State"}
                searchPlaceholder="Search state..."
                emptyText={
                  filterValues.country
                    ? "No state found."
                    : "Select country first"
                }
                className="w-full"
              />
            </div>

            {/* City */}
            <div className="grid gap-2">
              <Label htmlFor="city">City</Label>
              <Combobox
                options={cityOptions}
                value={filterValues.city}
                onValueChange={(value) =>
                  setFilterValues((prev) => ({ ...prev, city: value }))
                }
                placeholder={loadingCities ? "Loading..." : "Select City"}
                searchPlaceholder="Search city..."
                emptyText={
                  filterValues.state ? "No city found." : "Select state first"
                }
                className="w-full"
              />
            </div>

            {/* Status */}
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={filterValues.status}
                onValueChange={(value) =>
                  setFilterValues((prev) => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger id="status" className="w-full">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="flex-row gap-2 sm:justify-between">
            <Button
              variant="ghost"
              onClick={handleResetFilter}
              className="gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleCancelFilter}>
                Cancel
              </Button>
              <Button
                onClick={handleApplyFilter}
                className="bg-primary hover:bg-primary/90"
              >
                Apply
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
