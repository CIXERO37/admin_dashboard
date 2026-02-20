"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format, formatDistanceToNow } from "date-fns";
import { enUS } from "date-fns/locale";
import {
  Trash2,
  CheckSquare,
  AlertTriangle,
  RefreshCw,
  Users,
  Timer,
  Globe,
  Search,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DataTable } from "@/components/dashboard/data-table";

import { clearSessions, type StaleSession } from "./actions";

interface ManageSessionsTableProps {
  initialData: StaleSession[];
  initialError: string | null;
}

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

export function ManageSessionsTable({
  initialData,
  initialError,
}: ManageSessionsTableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [showConfirm, setShowConfirm] = useState(false);
  const [clearMode, setClearMode] = useState<"selected" | "all">("selected");
  const [clearResult, setClearResult] = useState<{
    cleared: number;
    error: string | null;
  } | null>(null);

  // Auto-dismiss clear result after 5 seconds
  useEffect(() => {
    if (clearResult) {
      const timer = setTimeout(() => {
        setClearResult(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [clearResult]);
  
  // Client-side filtering state
  const [searchInput, setSearchInput] = useState("");
  const [activeSearchQuery, setActiveSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState(initialData);

  const ITEMS_PER_PAGE = 15;
  const [currentPage, setCurrentPage] = useState(1);

  // Sync initialData
  useEffect(() => {
    setFilteredData(initialData);
    setCurrentPage(1);
  }, [initialData]);

  // Apply filters
  useEffect(() => {
    let result = initialData;

    if (activeSearchQuery) {
      const lowerQuery = activeSearchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.quiz_title.toLowerCase().includes(lowerQuery) ||
          item.host_name.toLowerCase().includes(lowerQuery) ||
          item.game_pin.includes(lowerQuery)
      );
    }

    setFilteredData(result);
    setCurrentPage(1); // Reset to first page on filter change
  }, [activeSearchQuery, initialData]);

  const handleSearch = () => {
    setActiveSearchQuery(searchInput);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Pagination Logic
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const isPageSelected =
    paginatedData.length > 0 &&
    paginatedData.every((item) => selected.has(item.id));

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectPage = () => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (isPageSelected) {
        // Deselect all on this page
        paginatedData.forEach((item) => next.delete(item.id));
      } else {
        // Select all on this page
        paginatedData.forEach((item) => next.add(item.id));
      }
      return next;
    });
  };

  const handleClear = (mode: "selected" | "all") => {
    setClearMode(mode);
    setShowConfirm(true);
  };

  const confirmClear = async () => {
    setShowConfirm(false);
    
    // Clear visible/filtered items if "All" is selected, or specifically selected items
    const idsToClear =
      clearMode === "all"
        ? filteredData.map((s) => s.id)
        : Array.from(selected);

    if (idsToClear.length === 0) return;

    startTransition(async () => {
      const result = await clearSessions(idsToClear);
      setClearResult(result);
      setSelected(new Set());
      router.refresh();
    });
  };

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  const columns = [
    {
      key: "quiz_title",
      label: "Quiz",
      render: (value: unknown, row: Record<string, unknown>) => (
        <div className="flex flex-col min-w-0">
          <span
            className="font-medium truncate max-w-[200px]"
            title={value as string}
          >
            {value as string}
          </span>
          <span className="text-xs text-muted-foreground">
            PIN: {row.game_pin as string}
          </span>
        </div>
      ),
    },
    {
      key: "host",
      label: "Host",
      render: (_: unknown, row: Record<string, unknown>) => (
            <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
                <AvatarImage src={row.avatar_url as string} />
                <AvatarFallback className="text-[10px]">
                {(row.host_name as string).substring(0, 2).toUpperCase()}
                </AvatarFallback>
            </Avatar>
            <span className="truncate max-w-[150px] text-sm font-medium">
                {row.host_name as string}
            </span>
            </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: () => (
        <Badge
          variant="outline"
          className="bg-yellow-500/15 text-yellow-600 border-yellow-200 hover:bg-yellow-500/25 dark:text-yellow-400 dark:border-yellow-800 capitalize"
        >
          Waiting
        </Badge>
      ),
    },
    {
      key: "application",
      label: "Application",
      render: (value: unknown) => (
        <div className="flex items-center gap-1.5">
          <Globe className="h-4 w-4 text-muted-foreground" />
          <span className="capitalize text-sm">
            {(value as string).replace(/\.com$/i, "")}
          </span>
        </div>
      ),
    },
    {
      key: "waiting_duration_minutes",
      label: "Duration",
      render: (value: unknown) => (
        <div className="flex items-center gap-1.5 text-sm">
          <Timer className="h-4 w-4 text-muted-foreground" />
          <span>{formatDuration(value as number)}</span>
        </div>
      ),
    },
    {
      key: "participant_count",
      label: "Players",
      render: (value: unknown) => (
        <div className="flex items-center gap-1.5 text-sm">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span>{value as number}</span>
        </div>
      ),
    },
    {
      key: "created_at",
      label: "Created",
      render: (value: unknown) => {
        const date = new Date(value as string);
        const fullDate = format(date, "EEEE, d MMMM yyyy 'at' HH:mm", { locale: enUS });
        
        return (
          <span
            className="text-sm font-medium whitespace-nowrap cursor-help decoration-dashed decoration-muted-foreground/50 underline-offset-4 hover:underline"
            title={fullDate}
            suppressHydrationWarning
          >
            {formatDistanceToNow(date, { addSuffix: true })}
          </span>
        );
      },
    },
    {
      key: "select",
      label: (
        <div className="flex justify-center pr-4">
          <Checkbox
            checked={isPageSelected}
            onCheckedChange={toggleSelectPage}
            aria-label="Select all on page"
            className="h-4 w-4 border-muted-foreground/50 data-[state=checked]:bg-primary data-[state=checked]:border-primary translate-y-[2px]"
          />
        </div>
      ) as unknown as string,
      render: (_: unknown, row: Record<string, unknown>) => (
        <div className="flex justify-center pr-4">
          <Checkbox
            checked={selected.has(row.id as string)}
            onCheckedChange={() => toggleSelect(row.id as string)}
            onClick={(e) => e.stopPropagation()}
            aria-label="Select row"
            className="h-4 w-4 border-muted-foreground/50 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
          />
        </div>
      ),
    },
  ];

  // Convert paginatedData to generic Record for DataTable
  const tableData = paginatedData.map(item => ({
      ...item,
  })) as unknown as Record<string, unknown>[];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Manage Sessions</h2>
        </div>
        <div className="flex items-center gap-3">
          {/* Search Box */}
          <div className="relative hidden md:block">
            <Input
              placeholder="Search sessions..."
              className="pr-10 w-64 bg-background border-border"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button 
              onClick={handleSearch}
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 flex items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
               <Search className="h-3.5 w-3.5" />
            </button>
          </div>
        
          <div className="flex items-center gap-2">
            {filteredData.length > 0 && (
                <>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleClear("selected")}
                    disabled={selected.size === 0 || isPending}
                    className="text-destructive hover:text-destructive border-destructive/20 hover:bg-destructive/10"
                >
                    <Trash2 className="h-4 w-4 mr-1.5" />
                    Clear ({selected.size})
                </Button>
                <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleClear("all")}
                    disabled={isPending}
                >
                    <Trash2 className="h-4 w-4 mr-1.5" />
                    Clear All
                </Button>
                </>
            )}
            <Button
                variant="outline"
                size="icon"
                onClick={handleRefresh}
                disabled={isPending}
                title="Refresh"
                className="h-9 w-9"
            >
                <RefreshCw
                className={`h-4 w-4 ${isPending ? "animate-spin" : ""}`}
                />
                <span className="sr-only">Refresh</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Result Toast */}
      {clearResult && (
        <div
          className={`flex items-center gap-2 p-3 rounded-lg text-sm border animate-in fade-in slide-in-from-top-2 ${
            clearResult.error
              ? "bg-destructive/10 text-destructive border-destructive/20"
              : "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
          }`}
        >
          {clearResult.error ? (
            <AlertTriangle className="h-4 w-4 shrink-0" />
          ) : (
            <CheckSquare className="h-4 w-4 shrink-0" />
          )}
          <span className="font-medium">
            {clearResult.error
              ? `Error: ${clearResult.error}`
              : `Successfully cleared ${clearResult.cleared} session(s)`}
          </span>
          <button
            onClick={() => setClearResult(null)}
            className="ml-auto text-xs underline opacity-70 hover:opacity-100"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Error */}
      {initialError && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm border border-destructive/20">
          <AlertTriangle className="h-4 w-4" />
          {initialError}
        </div>
      )}

      {/* Sessions Table */}
        <DataTable
            columns={columns as any}
            data={tableData}
            currentPage={currentPage}
            totalPages={totalPages || 1}
            onPageChange={(page) => setCurrentPage(page)}
            // onRowClick={(row) => toggleSelect(row.id as string)} // Optional: click row to select
        />

      {/* Confirm Dialog */}
      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear Sessions</AlertDialogTitle>
            <AlertDialogDescription>
              {clearMode === "all"
                ? `Are you sure you want to clear all ${filteredData.length} visible stale waiting session(s)? This action cannot be undone.`
                : `Are you sure you want to clear ${selected.size} selected session(s)? This action cannot be undone.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmClear}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              <Trash2 className="h-4 w-4 mr-1.5" />
              Clear
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
