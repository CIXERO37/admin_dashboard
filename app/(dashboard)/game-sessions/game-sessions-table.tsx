"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { format, formatDistanceToNow } from "date-fns";
import { id, enUS } from "date-fns/locale";
import {
  Search,
  Clock,
  Users,
  Gamepad2,
  FileQuestion,
  Globe,
  Filter,
  RotateCcw,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/dashboard/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "@/lib/i18n";
import { type GameSession } from "./actions";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface GameSessionsTableProps {
  initialData: GameSession[];
  totalPages: number;
  currentPage: number;
  totalCount: number;
  searchQuery: string;
  currentStatus: string;
  currentApplication: string;
  currentQuestions: string;
  currentDuration: string;
  currentSort: string;
  currentCategory: string;
}

export function GameSessionsTable({
  initialData,
  totalPages,
  currentPage,
  totalCount,
  searchQuery,
  currentStatus,
  currentApplication,
  currentQuestions,
  currentDuration,
  currentSort,
  currentCategory,
}: GameSessionsTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [searchInput, setSearchInput] = useState(searchQuery);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Temp state for dialog
  const [tempFilters, setTempFilters] = useState({
    status: currentStatus,
    application: currentApplication,
    questions: currentQuestions,
    duration: currentDuration,
    sort: currentSort,
    category: currentCategory,
  });

  // Sync temp state when dialog opens
  useEffect(() => {
    if (isFilterOpen) {
      setTempFilters({
        status: currentStatus,
        application: currentApplication,
        questions: currentQuestions,
        duration: currentDuration,
        sort: currentSort,
        category: currentCategory,
      });
    }
  }, [
    isFilterOpen,
    currentStatus,
    currentApplication,
    currentQuestions,
    currentDuration,
    currentSort,
    currentCategory,
  ]);

  const [selectedParticipants, setSelectedParticipants] = useState<
    GameSession["participants"] | null
  >(null);
  const { t, locale } = useTranslation();

  const updateUrl = (params: Record<string, string | number>) => {
    const newParams = new URLSearchParams(searchParams.toString());

    Object.entries(params).forEach(([key, value]) => {
      if (value && value !== "" && value !== "all" && value !== "newest") {
        newParams.set(key, String(value));
      } else {
        newParams.delete(key);
      }
    });

    startTransition(() => {
      router.push(`?${newParams.toString()}`);
    });
  };

  const handleApplyFilter = () => {
    updateUrl({
      page: 1,
      search: searchInput,
      status: tempFilters.status,
      application: tempFilters.application,
      questions: tempFilters.questions,
      duration: tempFilters.duration,
      sort: tempFilters.sort,
      category: tempFilters.category,
    });
    setIsFilterOpen(false);
  };

  const handleResetFilter = () => {
    setTempFilters({
      status: "all",
      application: "all",
      questions: "all",
      duration: "all",
      sort: "newest",
      category: "all",
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
    updateUrl({ page, search: searchQuery });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const formatDuration = (minutes: number | undefined) => {
    if (!minutes) return "-";
    if (minutes < 1) return "< 1";
    return String(minutes);
  };

  const columns = [
    {
      key: "quiz_title",
      label: t("game_sessions.quiz"),
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
      key: "category",
      label: t("table.category"),
      render: (value: unknown) => {
        const catKey = (value as string)?.toLowerCase();
        const label = catKey
          ? t(`category.${catKey}`) ||
            catKey.charAt(0).toUpperCase() + catKey.slice(1)
          : "-";
        return (
          <Badge
            variant="secondary"
            className="font-normal capitalize whitespace-nowrap"
            >
            {label}
          </Badge>
        );
      },
    },
    {
      key: "status",
      label: t("game_sessions.status"),
      render: (value: unknown) => {
        const status = (value as string) || "unknown";
        let className = "capitalize border ";

        switch (status) {
          case "playing":
            className +=
              "bg-blue-500/15 text-blue-600 border-blue-200 hover:bg-blue-500/25 dark:text-blue-400 dark:border-blue-800";
            break;
          case "waiting":
            className +=
              "bg-yellow-500/15 text-yellow-600 border-yellow-200 hover:bg-yellow-500/25 dark:text-yellow-400 dark:border-yellow-800";
            break;
          case "finished":
            className +=
              "bg-green-500/15 text-green-600 border-green-200 hover:bg-green-500/25 dark:text-green-400 dark:border-green-800";
            break;
          case "active":
            className +=
              "bg-purple-500/15 text-purple-600 border-purple-200 hover:bg-purple-500/25 dark:text-purple-400 dark:border-purple-800";
            break;
          default:
            className +=
              "bg-gray-500/15 text-gray-600 border-gray-200 hover:bg-gray-500/25 dark:text-gray-400 dark:border-gray-800";
        }

        const translatedStatus = t(`game_sessions.status_${status}`);
        const label = translatedStatus.includes("game_sessions.status_")
          ? status.charAt(0).toUpperCase() + status.slice(1)
          : translatedStatus;

        return (
          <Badge variant="outline" className={className}>
            {label}
          </Badge>
        );
      },
    },
    {
      key: "host",
      label: t("game_sessions.host"),
      render: (value: unknown) => {
        const host = value as GameSession["host"];
        if (!host) return <span className="text-muted-foreground">-</span>;
        return (
          <Link
            href={`/users/${host.id}`}
            className="text-sm font-medium hover:text-primary transition-colors"
            title={`${host.fullname} @${host.username}`}
            onClick={(e) => e.stopPropagation()}
          >
            {host.fullname || host.username}
          </Link>
        );
      },
    },
    {
      key: "application",
      label: t("game_sessions.application"),
      render: (value: unknown) => {
        const appName = (value as string) || "-";
        const displayName = appName.replace(/\.com$/i, "");
        return (
          <div className="flex items-center gap-1.5">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <span className="capitalize">{displayName}</span>
          </div>
        );
      },
    },
    {
      key: "participant_count",
      label: t("game_sessions.players"),
      render: (value: unknown, row: Record<string, unknown>) => {
        const count = value as number;
        const participants = row.participants as GameSession["participants"];

        return (
          <div
            className={`flex items-center gap-1.5 ${
              count > 0
                ? "cursor-pointer hover:text-primary transition-colors"
                : ""
            }`}
            onClick={(e) => {
              e.stopPropagation();
              if (count > 0 && participants) {
                setSelectedParticipants(participants);
              }
            }}
          >
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>{count}</span>
          </div>
        );
      },
    },
    {
      key: "total_questions",
      label: t("game_sessions.questions"),
      render: (value: unknown) => (
        <div className="flex items-center gap-1.5">
          <FileQuestion className="h-4 w-4 text-muted-foreground" />
          <span>{value as number}</span>
        </div>
      ),
    },
    {
      key: "duration_minutes",
      label: t("game_sessions.duration"),
      render: (value: unknown) => (
        <div className="flex items-center gap-1.5">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span>{formatDuration(value as number | undefined)}</span>
        </div>
      ),
    },
    {
      key: "created_at",
      label: t("game_sessions.date"),
      render: (value: unknown) => {
        const dateStr = value as string;
        if (!dateStr) return "-";
        const date = new Date(dateStr);
        const dateLocale = locale === "id" ? id : enUS;

        try {
          const timeAgo = formatDistanceToNow(date, {
            addSuffix: true,
            locale: dateLocale,
          })
            .replace(/^about /i, "")
            .replace(/^sekitar /i, "");

          // Format: Senin 5 January 2026 jam 12.00
          // Use 'id' format as requested if locale is ID, else standard English format
          const dateFormatStr =
            locale === "id"
              ? "EEEE d MMMM yyyy 'jam' HH.mm"
              : "EEEE, d MMM yyyy 'at' HH:mm";

          const fullDate = format(date, dateFormatStr, { locale: dateLocale });

          return (
            <span
              title={fullDate}
              className="cursor-help decoration-dashed decoration-muted-foreground/50 underline-offset-4 hover:underline"
            >
              {timeAgo}
            </span>
          );
        } catch (e) {
          return <span>{dateStr}</span>;
        }
      },
    },
  ];

  const tableData = initialData.map((session) => {
    return {
      id: session.id,
      quiz_title: session.quiz_title,
      category: session.category,
      game_pin: session.game_pin,
      host: session.host,
      status: session.status,
      participant_count: session.participant_count,
      participants: session.participants,
      total_questions: session.total_questions,
      application: session.application,
      duration_minutes: session.duration_minutes,
      created_at: session.created_at,
    };
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {t("game_sessions.title")}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Input
              placeholder={t("game_sessions.search_placeholder")}
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

          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 bg-black border-black hover:bg-black/80"
            onClick={() => setIsFilterOpen(true)}
          >
            <Filter className="h-4 w-4 text-white" />
          </Button>

          <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5 text-primary" />
                  {t("game_sessions.filter_title")}
                </DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                {/* Status */}
                <div className="grid gap-2">
                  <Label>{t("game_sessions.status")}</Label>
                  <Select
                    value={tempFilters.status}
                    onValueChange={(value) =>
                      setTempFilters((prev) => ({ ...prev, status: value }))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder={t("game_sessions.select_status")}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                        {t("filter.all_status")}
                      </SelectItem>
                      <SelectItem value="finished">
                        {t("game_sessions.status_finished")}
                      </SelectItem>
                      <SelectItem value="active">
                        {t("game_sessions.status_active")}
                      </SelectItem>
                      <SelectItem value="waiting">
                        {t("game_sessions.status_waiting")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Category */}
                <div className="grid gap-2">
                  <Label>{t("table.category")}</Label>
                  <Select
                    value={tempFilters.category}
                    onValueChange={(value) =>
                      setTempFilters((prev) => ({ ...prev, category: value }))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder={t("game_sessions.select_category")}
                      />
                    </SelectTrigger>
                    <SelectContent className="max-h-[200px]">
                      <SelectItem value="all">
                        {t("filter.all_categories")}
                      </SelectItem>
                      {[
                        "math",
                        "science",
                        "history",
                        "geography",
                        "technology",
                        "language",
                        "art",
                        "music",
                        "sports",
                        "general",
                        "business",
                      ].map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {t(`category.${cat}`) ||
                            cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Application */}
                <div className="grid gap-2">
                  <Label>{t("game_sessions.application")}</Label>
                  <Select
                    value={tempFilters.application}
                    onValueChange={(value) =>
                      setTempFilters((prev) => ({
                        ...prev,
                        application: value,
                      }))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder={t("game_sessions.select_application")}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                        {t("game_sessions.all_applications")}
                      </SelectItem>
                      <SelectItem value="Gameforsmart">Gameforsmart</SelectItem>
                      <SelectItem value="Space-Quiz">Space-Quiz</SelectItem>
                      <SelectItem value="Memoryquiz">Memoryquiz</SelectItem>
                      <SelectItem value="Crazyrace">Crazyrace</SelectItem>
                      <SelectItem value="Quizrush">Quizrush</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Questions */}
                <div className="grid gap-2">
                  <Label>{t("game_sessions.questions")}</Label>
                  <Select
                    value={tempFilters.questions}
                    onValueChange={(value) =>
                      setTempFilters((prev) => ({ ...prev, questions: value }))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder={t("game_sessions.select_questions")}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                        {t("game_sessions.all_questions")}
                      </SelectItem>
                      <SelectItem value="5">
                        {t("game_sessions.questions_count").replace(
                          "{{count}}",
                          "5",
                        )}
                      </SelectItem>
                      <SelectItem value="10">
                        {t("game_sessions.questions_count").replace(
                          "{{count}}",
                          "10",
                        )}
                      </SelectItem>
                      <SelectItem value="20">
                        {t("game_sessions.questions_count").replace(
                          "{{count}}",
                          "20",
                        )}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Duration */}
                <div className="grid gap-2">
                  <Label>{t("game_dashboard.avg_duration")}</Label>
                  <Select
                    value={tempFilters.duration}
                    onValueChange={(value) =>
                      setTempFilters((prev) => ({ ...prev, duration: value }))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder={t("game_sessions.select_duration")}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                        {t("game_sessions.all_durations")}
                      </SelectItem>
                      <SelectItem value="5">
                        {t("game_sessions.minutes_count").replace(
                          "{{count}}",
                          "5",
                        )}
                      </SelectItem>
                      <SelectItem value="10">
                        {t("game_sessions.minutes_count").replace(
                          "{{count}}",
                          "10",
                        )}
                      </SelectItem>
                      <SelectItem value="15">
                        {t("game_sessions.minutes_count").replace(
                          "{{count}}",
                          "15",
                        )}
                      </SelectItem>
                      <SelectItem value="20">
                        {t("game_sessions.minutes_count").replace(
                          "{{count}}",
                          "20",
                        )}
                      </SelectItem>
                      <SelectItem value="25">
                        {t("game_sessions.minutes_count").replace(
                          "{{count}}",
                          "25",
                        )}
                      </SelectItem>
                      <SelectItem value="30">
                        {t("game_sessions.minutes_count").replace(
                          "{{count}}",
                          "30",
                        )}
                      </SelectItem>
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
                  <Button
                    variant="outline"
                    onClick={() => setIsFilterOpen(false)}
                  >
                    {t("action.cancel")}
                  </Button>
                  <Button
                    onClick={handleApplyFilter}
                    className="bg-primary hover:bg-primary/90"
                  >
                    {t("action.apply_filter")}
                  </Button>
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
            onRowClick={(row) => router.push(`/game-sessions/${row.id as string}`)}
          />
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-border rounded-xl bg-card">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
              <Gamepad2 className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-base font-medium text-foreground mb-1">
              {t("game_sessions.no_sessions")}
            </h3>
            <p className="text-sm text-muted-foreground">
              {searchQuery
                ? t("game_sessions.no_match")
                : t("game_sessions.no_data")}
            </p>
          </div>
        )}
      </div>

      {/* Participants Dialog */}
      <Dialog
        open={!!selectedParticipants}
        onOpenChange={(open) => !open && setSelectedParticipants(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("game_sessions.players")}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[300px] w-full pr-4">
            <div className="space-y-4">
              {selectedParticipants?.map((p, index) => {
                const content = (
                  <>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={
                            p.avatar_url ||
                            `https://api.dicebear.com/9.x/avataaars/svg?seed=${
                              p.nickname || "user"
                            }`
                          }
                        />
                        <AvatarFallback>
                          {(p.nickname || "U").charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-sm group-hover:text-primary transition-colors">
                        {p.nickname || "Unknown Player"}
                      </span>
                    </div>
                    <div className="text-sm font-semibold text-primary">
                      {p.score || 0} pts
                    </div>
                  </>
                );

                if (p.user_id) {
                  return (
                    <Link
                      key={index}
                      href={`/users/${p.user_id}`}
                      className="group flex items-center justify-between p-2 rounded-lg border bg-card/50 hover:bg-primary/10 hover:border-primary transition-all cursor-pointer"
                      target="_blank"
                    >
                      {content}
                    </Link>
                  );
                }

                return (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 rounded-lg border bg-card/50"
                  >
                    {content}
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
