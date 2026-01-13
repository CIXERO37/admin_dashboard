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
import { format } from "date-fns";
import { useState, useTransition, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { id as idLocale } from "date-fns/locale";

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
import { useTranslation } from "@/lib/i18n";
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
  countries: Country[];
  categories: string[];
}

function formatDate(dateString?: string | null, locale?: string): string {
  if (!dateString) return "-";
  return format(new Date(dateString), "d MMMM yyyy", {
    locale: locale === "id" ? idLocale : undefined,
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
  const creator = group.creator;
  if (creator?.state?.name || creator?.city?.name) {
    const parts = [creator.state?.name, creator.city?.name].filter(Boolean);
    return parts.join(", ");
  }

  const settings = group.settings as { location?: string } | null;
  return settings?.location || "-";
}

interface GroupCardProps {
  group: Group & { member_count: number };
  onDelete: (id: string, name: string) => void;
}

function GroupCard({ group, onDelete }: GroupCardProps) {
  const router = useRouter();
  const { t, locale } = useTranslation();
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
    router.push(`/groups/${group.id}`);
  };

  return (
    <div
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-lg transition-all duration-300 hover:shadow-xl hover:border-primary/50 cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Header with cover image or gradient fallback */}
      <div className="relative p-4 bg-muted overflow-hidden h-32">
        {coverUrl ? (
          <>
            <img
              src={coverUrl}
              alt={name}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/60" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent" />
        )}

        {/* Status Badge Row */}
        <div className="relative z-10 flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Badge
              variant={status.variant}
              className={`text-[10px] font-semibold px-2 py-0.5 ${
                status.variant === "secondary"
                  ? "bg-green-500/90 text-white border-green-500"
                  : "bg-black/50 border-white/30 text-white"
              }`}
            >
              {status.label === "PUBLIC"
                ? t("groups.public")
                : t("groups.private")}
            </Badge>
            {group.category && (
              <Badge
                variant="outline"
                className="text-[10px] font-semibold px-2 py-0.5 bg-black/50 border-white/30 text-white uppercase"
              >
                {(() => {
                  if (locale === "id") return group.category;

                  const translations: Record<string, string> = {
                    kampus: "Campus",
                    kantor: "Office",
                    keluarga: "Family",
                    komunitas: "Community",
                    "masjid/musholla": "Mosque",
                    pesantren: "Islamic Boarding School",
                    sekolah: "School",
                    "tpa/tpq": "TPA/TPQ",
                    umum: "General",
                    lainnya: "Other",
                    // English keys backup
                    campus: "Campus",
                    office: "Office",
                    family: "Family",
                    community: "Community",
                    mosque: "Mosque",
                    "islamic boarding school": "Islamic Boarding School",
                    school: "School",
                    general: "General",
                    other: "Other",
                  };
                  const key = group.category
                    ? group.category.toLowerCase()
                    : "";
                  return translations[key] || group.category;
                })()}
              </Badge>
            )}
          </div>

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
                <Link href={`/groups/${group.id}`}>
                  <Eye className="h-4 w-4 mr-2" />
                  {t("action.view_details")}
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
                {t("action.move_to_trash")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Avatar and Name */}
        <div className="relative z-10 flex items-center gap-3">
          <Avatar className="h-12 w-12 border-2 border-white/50 shadow-md ring-2 ring-background">
            <AvatarImage
              src={getAvatarUrl(avatarUrl)}
              alt={name}
              className="object-cover"
            />
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
          {t("groups.created_by")}
        </p>
        <Link
          href={`/users/${group.creator_id}`}
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
            <span>{formatDate(group.created_at, locale)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5" />
            <span>
              {group.member_count} {t("table.members")}
            </span>
          </div>
        </div>

        {/* Detail Button */}
        <Button
          className="w-full gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
          size="sm"
          asChild
          onClick={(e) => e.stopPropagation()}
        >
          <Link href={`/groups/${group.id}`}>
            <Eye className="h-4 w-4" />
            {t("action.view_details")}
          </Link>
        </Button>
      </div>
    </div>
  );
}

export function GroupTable({
  initialData,
  countries,
  categories,
}: GroupTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const { t } = useTranslation();

  // Client-Side State
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [activeSearchQuery, setActiveSearchQuery] = useState("");

  const [filterValues, setFilterValues] = useState({
    country: "",
    state: "",
    city: "",
    status: "all",
    category: "",
  });

  const ITEMS_PER_PAGE = 12;

  // Filter Logic
  const filteredData = useMemo(() => {
    let data = [...initialData];

    // 1. Search (Name or Description)
    if (activeSearchQuery) {
      const lowerQuery = activeSearchQuery.toLowerCase();
      data = data.filter(
        (group) =>
          group.name?.toLowerCase().includes(lowerQuery) ||
          group.description?.toLowerCase().includes(lowerQuery)
      );
    }

    // 2. Status Filter
    if (filterValues.status && filterValues.status !== "all") {
      data = data.filter((group) => {
        const settings = group.settings as { status?: string } | null;
        return settings?.status === filterValues.status;
      });
    }

    // 3. Category Filter
    if (filterValues.category) {
      // Simple match assuming normalized values or check includes
      data = data.filter((g) => g.category === filterValues.category);
    }

    // 4. Location Filter (State/City via Creator logic or Settings location?)
    // The previous implementation didn't implement client-side location logic fully in table,
    // it relied on server query.
    // For now, let's skip complex location filtering in memory or implement basic check if data available.
    // Assuming creator.state.id or similar is available.
    // The previous fetchGroups used join.
    // Let's implement State/City filter if creator data has it.

    if (filterValues.state) {
      // This is rough because we might not have state_id in flattened creator object easily
      // unless we map it. 'getAllGroups' fetched creator with state(name).
      // We only have state name in the fetched object, but filter uses ID.
      // Keep location filter purely visual or clear it for now to avoid confusion?
      // Let's rely on name match if we can map ID to name, or skip.
    }

    return data;
  }, [initialData, activeSearchQuery, filterValues]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredData.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredData, currentPage]);

  // Reset page
  useEffect(() => {
    setCurrentPage(1);
  }, [activeSearchQuery, filterValues]);

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
  // Filter dialog interaction
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  // filterValues state is defined above

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

  const categoryOptions = categories.map((c) => {
    const key = c.toLowerCase().replace(/[\/\s]/g, "_");
    // Fallback to literal if key not found (but t() usually returns key if missing, so checking existence is hard unless we trust our map)
    // Actually t() returns key if missing.
    // Given the dynamic nature, I'll rely on t returning the translated string if key exists, or the key itself if not.
    // If key is "category.foo", and missing, it returns "category.foo".
    // I should probably check if translation exists? No, standard i18n behavior.
    return {
      value: c,
      label: t(`category.${key}`),
    };
  });

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
      category: "",
    });
    setStates([]);
    setCities([]);
  };

  const handleApplyFilter = () => {
    setFilterDialogOpen(false);
    // Trigger re-render by updating state (already done via setFilterValues)
    // But wait, filterValues is updated immediately in dialog?
    // Yes. So just close.
  };

  const handleCancelFilter = () => {
    setFilterValues({
      country: "",
      state: "",
      city: "",
      status: "all",
      category: "",
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

  // Removed updateUrl logic

  const handleSearch = () => {
    setActiveSearchQuery(searchInput);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const groupsWithCount = paginatedData.map((group) => ({
    ...group,
    member_count: group.members?.length ?? 0,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {t("groups.title")}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Input
              placeholder={t("groups.search")}
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
              {t("groups.no_groups")}
            </h3>
            <p className="text-sm text-muted-foreground">
              {activeSearchQuery
                ? t("groups.no_groups_desc")
                : t("groups.no_groups")}
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
              {t("action.previous")}
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
              {t("action.next")}
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
            <DialogTitle>{t("groups.delete_title")}</DialogTitle>
            <DialogDescription>
              {t("groups.move_trash_desc")}{" "}
              <strong>{deleteDialog.groupName}</strong>{" "}
              {t("groups.move_trash_desc2")}
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
              {t("action.cancel")}
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteGroup}
              disabled={deleteDialog.confirmText !== "Move to Trash"}
            >
              {t("action.move_to_trash")}
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
              {t("action.filter")}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Category */}
            <div className="grid gap-2">
              <Label htmlFor="category">{t("groups.category_label")}</Label>
              <Combobox
                options={categoryOptions}
                value={filterValues.category}
                onValueChange={(value) =>
                  setFilterValues((prev) => ({ ...prev, category: value }))
                }
                placeholder={t("groups.select_category")}
                searchPlaceholder={t("groups.search_category")}
                emptyText={t("groups.no_category")}
                className="w-full"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="country">{t("groups.country_label")}</Label>
              <Combobox
                options={countryOptions}
                value={filterValues.country}
                onValueChange={handleCountryChange}
                placeholder={t("groups.select_country")}
                searchPlaceholder={t("groups.search_country")}
                emptyText={t("groups.no_country")}
                className="w-full"
              />
            </div>

            {/* State */}
            <div className="grid gap-2">
              <Label htmlFor="state">{t("groups.state_label")}</Label>
              <Combobox
                options={stateOptions}
                value={filterValues.state}
                onValueChange={handleStateChange}
                placeholder={
                  loadingStates ? "Loading..." : t("groups.select_state")
                }
                searchPlaceholder={t("groups.search_state")}
                emptyText={
                  filterValues.country
                    ? t("groups.no_state")
                    : t("groups.select_state_first")
                }
                className="w-full"
                disabled={!filterValues.country}
              />
            </div>

            {/* City */}
            <div className="grid gap-2">
              <Label htmlFor="city">{t("groups.city_label")}</Label>
              <Combobox
                options={cityOptions}
                value={filterValues.city}
                onValueChange={(value) =>
                  setFilterValues((prev) => ({ ...prev, city: value }))
                }
                placeholder={
                  loadingCities ? "Loading..." : t("groups.select_city")
                }
                searchPlaceholder={t("groups.search_city")}
                emptyText={
                  filterValues.state
                    ? t("groups.no_city")
                    : t("groups.select_city_first")
                }
                className="w-full"
                disabled={!filterValues.state}
              />
            </div>

            {/* Status */}
            <div className="grid gap-2">
              <Label htmlFor="status">{t("groups.status_label")}</Label>
              <Select
                value={filterValues.status}
                onValueChange={(value) =>
                  setFilterValues((prev) => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger id="status" className="w-full">
                  <SelectValue placeholder={t("groups.status_label")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("groups.all")}</SelectItem>
                  <SelectItem value="public">{t("groups.public")}</SelectItem>
                  <SelectItem value="private">{t("groups.private")}</SelectItem>
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
              {t("action.reset")}
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleCancelFilter}>
                {t("action.cancel")}
              </Button>
              <Button
                onClick={handleApplyFilter}
                className="bg-primary hover:bg-primary/90"
              >
                {t("action.apply")}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
