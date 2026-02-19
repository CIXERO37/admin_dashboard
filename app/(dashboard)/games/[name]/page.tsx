"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Activity,
  Users,
  UserCheck,
  Timer,
  CheckCircle2,
  Clock,
  Search,
  Trophy,
  Zap,
  CalendarDays,
  BookOpen,
  MapPin,
  GraduationCap,
  PersonStanding,
  Globe,
} from "lucide-react";
import {
  startOfDay,
  subDays,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  subWeeks,
  subMonths,
  subYears,
  formatDistanceToNow,
} from "date-fns";

import { Card, CardContent } from "@/components/ui/card";
import { StatCard } from "@/components/dashboard/stat-card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import {
  fetchGameDetail,
  fetchPlayerDemographics,
  type GameDetailStats,
  type GameDetailSession,
  type PlayerDemographics,
} from "./actions";

// --- Time Filter ---

type TimeFilter =
  | "today"
  | "yesterday"
  | "this_week"
  | "last_week"
  | "this_month"
  | "last_month"
  | "this_year"
  | "last_year"
  | "all_time";

const TIME_FILTER_LABELS: Record<TimeFilter, string> = {
  today: "Today",
  yesterday: "Yesterday",
  this_week: "This Week",
  last_week: "Last Week",
  this_month: "This Month",
  last_month: "Last Month",
  this_year: "This Year",
  last_year: "Last Year",
  all_time: "All Time",
};

function getDateRange(filter: TimeFilter): { start?: string; end?: string } {
  const now = new Date();
  switch (filter) {
    case "today":
      return { start: startOfDay(now).toISOString(), end: now.toISOString() };
    case "yesterday": {
      const y = subDays(now, 1);
      return { start: startOfDay(y).toISOString(), end: startOfDay(now).toISOString() };
    }
    case "this_week":
      return { start: startOfWeek(now, { weekStartsOn: 1 }).toISOString(), end: now.toISOString() };
    case "last_week": {
      const lw = subWeeks(now, 1);
      return { start: startOfWeek(lw, { weekStartsOn: 1 }).toISOString(), end: endOfWeek(lw, { weekStartsOn: 1 }).toISOString() };
    }
    case "this_month":
      return { start: startOfMonth(now).toISOString(), end: now.toISOString() };
    case "last_month": {
      const lm = subMonths(now, 1);
      return { start: startOfMonth(lm).toISOString(), end: endOfMonth(lm).toISOString() };
    }
    case "this_year":
      return { start: startOfYear(now).toISOString(), end: now.toISOString() };
    case "last_year": {
      const ly = subYears(now, 1);
      return { start: startOfYear(ly).toISOString(), end: endOfYear(ly).toISOString() };
    }
    default:
      return {};
  }
}

function formatAppName(name: string): string {
  return name
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

const STATUS_STYLES: Record<string, string> = {
  finished: "bg-emerald-500/20 text-emerald-500 border-emerald-500/30",
  active: "bg-blue-500/20 text-blue-500 border-blue-500/30",
  waiting: "bg-amber-500/20 text-amber-500 border-amber-500/30",
};

// --- Component ---

export default function GameDetailPage() {
  const params = useParams();
  const appName = decodeURIComponent(params.name as string);

  const [stats, setStats] = useState<GameDetailStats | null>(null);
  const [sessions, setSessions] = useState<GameDetailSession[]>([]);
  const [demographics, setDemographics] = useState<PlayerDemographics | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("this_month");
  const [searchInput, setSearchInput] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const loadData = useCallback(
    (filter: TimeFilter) => {
      setLoading(true);
      const { start, end } = getDateRange(filter);
      Promise.all([
        fetchGameDetail(appName, start, end),
        fetchPlayerDemographics(appName, start, end),
      ]).then(([gameData, demo]) => {
        setStats(gameData.stats);
        setSessions(gameData.sessions);
        setDemographics(demo);
        setLoading(false);
      });
    },
    [appName]
  );

  useEffect(() => {
    loadData(timeFilter);
  }, [timeFilter, loadData]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeSearch]);

  const filteredSessions = useMemo(() => {
    if (!activeSearch) return sessions;
    const q = activeSearch.toLowerCase();
    return sessions.filter(
      (s) =>
        s.quiz_title?.toLowerCase().includes(q) ||
        s.game_pin?.includes(q) ||
        s.status.toLowerCase().includes(q)
    );
  }, [sessions, activeSearch]);

  const totalPages = Math.ceil(filteredSessions.length / itemsPerPage);
  const paginatedSessions = filteredSessions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSearch = () => setActiveSearch(searchInput);
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  if (loading || !stats) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-9 w-64" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
        <Skeleton className="h-96 rounded-xl" />
      </div>
    );
  }

  const completionRate =
    stats.total_sessions > 0
      ? Math.round((stats.finished_sessions / stats.total_sessions) * 100)
      : 0;

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/games">Games</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Game Detail</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Title + Filter */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">
          {formatAppName(appName)}
        </h1>
        <Select
          value={timeFilter}
          onValueChange={(val) => setTimeFilter(val as TimeFilter)}
        >
          <SelectTrigger className="w-fit gap-1 bg-background border-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(TIME_FILTER_LABELS).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Sessions"
          value={stats.total_sessions.toLocaleString()}
          icon={Activity}
        />
        <StatCard
          title="Players"
          value={stats.total_players.toLocaleString()}
          icon={Users}
        />
        <StatCard
          title="Completion"
          value={`${completionRate}%`}
          icon={CheckCircle2}
        />
        <StatCard
          title="Avg Duration"
          value={`${stats.avg_duration_minutes} min`}
          icon={Timer}
        />
      </div>

      {/* Middle: Top Quizzes + Session Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top Quizzes */}
        <Card>
          <CardContent className="pt-4 pb-4 space-y-3">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-blue-500" />
              <h3 className="font-semibold text-sm">Top Quizzes</h3>
            </div>
            {stats.top_quizzes.length > 0 ? (
              <div className="space-y-2.5">
                {stats.top_quizzes.map((quiz, idx) => {
                  const maxCount = stats.top_quizzes[0].count;
                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <span
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                              idx === 0
                                ? "bg-amber-500/20 text-amber-400"
                                : idx === 1
                                ? "bg-slate-400/20 text-slate-300"
                                : idx === 2
                                ? "bg-orange-500/20 text-orange-400"
                                : "bg-secondary text-muted-foreground"
                            }`}
                          >
                            {idx + 1}
                          </span>
                          <span className="text-sm truncate">{quiz.title}</span>
                          {quiz.category && (
                            <Badge
                              variant="outline"
                              className="text-[10px] px-1.5 py-0 shrink-0"
                            >
                              {quiz.category}
                            </Badge>
                          )}
                        </div>
                        <span className="text-xs font-semibold tabular-nums text-muted-foreground ml-2">
                          {quiz.count}x
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden bg-secondary/50 ml-7">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            idx === 0
                              ? "bg-blue-500"
                              : idx === 1
                              ? "bg-violet-500"
                              : idx === 2
                              ? "bg-cyan-500"
                              : "bg-slate-400"
                          }`}
                          style={{
                            width: `${(quiz.count / maxCount) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No data</p>
            )}
          </CardContent>
        </Card>

        {/* Session Status + Difficulty */}
        <div className="space-y-4">
          {/* Session Status */}
          <Card>
            <CardContent className="pt-4 pb-4 space-y-3">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-emerald-500" />
                <h3 className="font-semibold text-sm">Session Status</h3>
              </div>
              {stats.total_sessions > 0 ? (
                <>
                  <div className="h-3 rounded-full overflow-hidden flex bg-secondary/50">
                    {stats.finished_sessions > 0 && (
                      <div
                        className="h-full bg-emerald-500"
                        style={{
                          width: `${(stats.finished_sessions / stats.total_sessions) * 100}%`,
                        }}
                      />
                    )}
                    {stats.waiting_sessions > 0 && (
                      <div
                        className="h-full bg-amber-500"
                        style={{
                          width: `${(stats.waiting_sessions / stats.total_sessions) * 100}%`,
                        }}
                      />
                    )}
                    {stats.active_sessions > 0 && (
                      <div
                        className="h-full bg-blue-500"
                        style={{
                          width: `${(stats.active_sessions / stats.total_sessions) * 100}%`,
                        }}
                      />
                    )}
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      <span className="text-muted-foreground">Finished</span>
                      <span className="font-semibold">
                        {stats.finished_sessions}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                      <span className="text-muted-foreground">Waiting</span>
                      <span className="font-semibold">
                        {stats.waiting_sessions}
                      </span>
                    </div>
                    {stats.active_sessions > 0 && (
                      <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                        <span className="text-muted-foreground">Active</span>
                        <span className="font-semibold">
                          {stats.active_sessions}
                        </span>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">No data</p>
              )}
            </CardContent>
          </Card>

          {/* Gender Distribution */}
          {demographics && demographics.genders.length > 0 && (
            <Card>
              <CardContent className="pt-4 pb-4 space-y-3">
                <div className="flex items-center gap-2">
                  <PersonStanding className="h-4 w-4 text-pink-500" />
                  <h3 className="font-semibold text-sm">Gender</h3>
                </div>
                <div className="space-y-3">
                  {(() => {
                    const total = demographics.genders.reduce((a, b) => a + b.count, 0);
                    const GENDER_COLORS: Record<string, string> = {
                      male: "bg-blue-500",
                      female: "bg-pink-500",
                      unknown: "bg-slate-400",
                    };
                    return (
                      <>
                        <div className="h-4 rounded-full overflow-hidden flex">
                          {demographics.genders.map((g) => (
                            <div
                              key={g.gender}
                              className={`h-full ${GENDER_COLORS[g.gender.toLowerCase()] || "bg-slate-400"}`}
                              style={{ width: `${(g.count / total) * 100}%` }}
                            />
                          ))}
                        </div>
                        <div className="flex flex-wrap gap-x-5 gap-y-2">
                          {demographics.genders.map((g) => {
                            const pct = Math.round((g.count / total) * 100);
                            return (
                              <div key={g.gender} className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${GENDER_COLORS[g.gender.toLowerCase()] || "bg-slate-400"}`} />
                                <span className="text-sm capitalize">{g.gender}</span>
                                <span className="text-xs font-semibold tabular-nums text-muted-foreground">{g.count} ({pct}%)</span>
                              </div>
                            );
                          })}
                        </div>
                      </>
                    );
                  })()}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Player Locations + Education Distribution */}
      {demographics && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Player Locations */}
          {demographics.locations.length > 0 && (
            <Card>
              <CardContent className="pt-4 pb-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-blue-500" />
                  <h3 className="font-semibold text-sm">Player Locations</h3>
                  <span className="text-xs text-muted-foreground">({demographics.locations.reduce((a, b) => a + b.count, 0)} players)</span>
                </div>
                <div className="space-y-2">
                  {demographics.locations.map((loc, idx) => {
                    const maxCount = demographics.locations[0].count;
                    const total = demographics.locations.reduce((a, b) => a + b.count, 0);
                    const pct = Math.round((loc.count / total) * 100);
                    return (
                      <div key={loc.iso3} className="flex items-center gap-3">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                          idx === 0 ? "bg-blue-500/20 text-blue-400" :
                          idx === 1 ? "bg-violet-500/20 text-violet-400" :
                          idx === 2 ? "bg-cyan-500/20 text-cyan-400" :
                          "bg-secondary text-muted-foreground"
                        }`}>{idx + 1}</span>
                        <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <span className="text-sm w-24 truncate shrink-0">{loc.country}</span>
                        <div className="flex-1 h-2.5 rounded-full overflow-hidden bg-secondary/30">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ${
                              idx === 0 ? "bg-blue-500" :
                              idx === 1 ? "bg-violet-500" :
                              idx === 2 ? "bg-cyan-500" :
                              "bg-slate-500"
                            }`}
                            style={{ width: `${(loc.count / maxCount) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold tabular-nums w-8 text-right">{loc.count}</span>
                        <span className="text-[10px] text-muted-foreground tabular-nums w-8 text-right">({pct}%)</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Education Distribution */}
          {demographics.grades.length > 0 && (
            <Card>
              <CardContent className="pt-4 pb-4 space-y-3">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-indigo-500" />
                  <h3 className="font-semibold text-sm">Education</h3>
                </div>
                <div className="space-y-2">
                  {demographics.grades.map((g) => {
                    const maxG = demographics.grades[0].count;
                    const total = demographics.grades.reduce((a, b) => a + b.count, 0);
                    const pct = Math.round((g.count / total) * 100);
                    return (
                      <div key={g.grade} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm capitalize">{g.grade}</span>
                          <span className="text-xs text-muted-foreground tabular-nums">{g.count} ({pct}%)</span>
                        </div>
                        <div className="h-2 rounded-full overflow-hidden bg-secondary/50">
                          <div className="h-full rounded-full bg-indigo-500 transition-all duration-500" style={{ width: `${(g.count / maxG) * 100}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Recent Sessions */}
      <Card>
        <CardContent className="pt-4 pb-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-primary" />
              <h3 className="font-semibold text-sm">
                Recent Sessions ({filteredSessions.length})
              </h3>
            </div>
            <div className="relative">
              <Input
                placeholder="Search quiz or PIN..."
                className="pr-10 w-56 h-8 text-xs bg-background border-border"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button
                onClick={handleSearch}
                className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 flex items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <Search className="h-3 w-3" />
              </button>
            </div>
          </div>

          {/* Session Table */}
          <div className="rounded-lg border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-secondary/50 text-muted-foreground">
                  <th className="text-left px-4 py-2.5 font-medium">PIN</th>
                  <th className="text-left px-4 py-2.5 font-medium">Quiz</th>
                  <th className="text-left px-4 py-2.5 font-medium">Status</th>
                  <th className="text-left px-4 py-2.5 font-medium">Players</th>
                  <th className="text-left px-4 py-2.5 font-medium">Difficulty</th>
                  <th className="text-left px-4 py-2.5 font-medium">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paginatedSessions.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No sessions found
                    </td>
                  </tr>
                )}
                {paginatedSessions.map((s) => (
                  <tr
                    key={s.id}
                    className="hover:bg-secondary/30 transition-colors"
                  >
                    <td className="px-4 py-2.5">
                      <span className="font-mono text-xs font-semibold">
                        {s.game_pin || "—"}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="max-w-[200px]">
                        <p className="truncate text-sm" title={s.quiz_title || ""}>
                          {s.quiz_title || "—"}
                        </p>
                        {s.quiz_category && (
                          <span className="text-[10px] text-muted-foreground capitalize">
                            {s.quiz_category}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-2.5">
                      <Badge
                        variant="outline"
                        className={`text-[11px] capitalize ${
                          STATUS_STYLES[s.status] || ""
                        }`}
                      >
                        {s.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="tabular-nums font-medium">
                        {s.participant_count}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="text-xs capitalize text-muted-foreground">
                        {s.difficulty || "—"}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(s.created_at), {
                          addSuffix: true,
                        })}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
