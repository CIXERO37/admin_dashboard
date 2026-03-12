"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { Search, Dices, Activity, Users, Clock, CalendarDays } from "lucide-react";
import { formatDistanceToNow, startOfDay, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, subWeeks, subMonths, subYears } from "date-fns";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchGameApplications, type GameApplication } from "./actions";

const ACCENT_COLORS = [
  "border-l-cyan-500",
  "border-l-violet-500",
  "border-l-amber-500",
  "border-l-emerald-500",
  "border-l-rose-500",
  "border-l-blue-500",
  "border-l-orange-500",
  "border-l-pink-500",
];

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
      return {
        start: startOfDay(now).toISOString(),
        end: now.toISOString(),
      };
    case "yesterday": {
      const yesterday = subDays(now, 1);
      return {
        start: startOfDay(yesterday).toISOString(),
        end: startOfDay(now).toISOString(),
      };
    }
    case "this_week":
      return {
        start: startOfWeek(now, { weekStartsOn: 1 }).toISOString(),
        end: now.toISOString(),
      };
    case "last_week": {
      const lastWeek = subWeeks(now, 1);
      return {
        start: startOfWeek(lastWeek, { weekStartsOn: 1 }).toISOString(),
        end: endOfWeek(lastWeek, { weekStartsOn: 1 }).toISOString(),
      };
    }
    case "this_month":
      return {
        start: startOfMonth(now).toISOString(),
        end: now.toISOString(),
      };
    case "last_month": {
      const lastMonth = subMonths(now, 1);
      return {
        start: startOfMonth(lastMonth).toISOString(),
        end: endOfMonth(lastMonth).toISOString(),
      };
    }
    case "this_year":
      return {
        start: startOfYear(now).toISOString(),
        end: now.toISOString(),
      };
    case "last_year": {
      const lastYear = subYears(now, 1);
      return {
        start: startOfYear(lastYear).toISOString(),
        end: endOfYear(lastYear).toISOString(),
      };
    }
    case "all_time":
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

export default function GamesPage() {
  const [apps, setApps] = useState<GameApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("this_month");

  const loadData = useCallback((filter: TimeFilter) => {
    setLoading(true);
    const { start, end } = getDateRange(filter);
    fetchGameApplications(start, end).then(({ data }) => {
      setApps(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    loadData(timeFilter);
  }, [timeFilter, loadData]);

  const filteredData = useMemo(() => {
    if (!activeSearch) return apps;
    const q = activeSearch.toLowerCase();
    return apps.filter((app) =>
      formatAppName(app.name).toLowerCase().includes(q)
    );
  }, [apps, activeSearch]);

  const handleSearch = () => setActiveSearch(searchInput);
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-9 w-40" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-10 w-64" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 9 }).map((_, i) => (
            <Skeleton key={i} className="h-36 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Games</h1>
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Input
              placeholder="Search application..."
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

          {/* Time Filter */}
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
      </div>

      {/* Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredData.map((app, idx) => {
          const accent = ACCENT_COLORS[idx % ACCENT_COLORS.length];
          const completionRate =
            app.total_sessions > 0
              ? Math.round(
                  (app.finished_sessions / app.total_sessions) * 100
                )
              : 0;

          return (
            <Link key={app.name} href={`/games/${encodeURIComponent(app.name)}`}>
            <Card
              className={`border-l-4 ${accent} group overflow-hidden transition-all duration-200 hover:shadow-md hover:shadow-primary/5 cursor-pointer`}
            >
              <CardContent className="pt-0 pb-0 space-y-3">
                {/* App Name */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Dices className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    <h3 className="font-semibold text-[15px] group-hover:text-primary transition-colors">
                      {formatAppName(app.name)}
                    </h3>
                  </div>
                  {app.active_sessions > 0 && (
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                    </span>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Activity className="h-3 w-3" />
                      <span className="text-[11px]">Sessions</span>
                    </div>
                    <p className="text-lg font-bold tabular-nums leading-tight">
                      {app.total_sessions.toLocaleString()}
                    </p>
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Users className="h-3 w-3" />
                      <span className="text-[11px]">Players</span>
                    </div>
                    <p className="text-lg font-bold tabular-nums leading-tight">
                      {app.total_players.toLocaleString()}
                    </p>
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Dices className="h-3 w-3" />
                      <span className="text-[11px]">Done</span>
                    </div>
                    <p className="text-lg font-bold tabular-nums leading-tight">
                      {completionRate}
                      <span className="text-xs font-normal text-muted-foreground">
                        %
                      </span>
                    </p>
                  </div>
                </div>

                {/* Last Active */}
                {app.last_session && (
                  <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground pt-1.5 border-t border-border/50">
                    <Clock className="h-3 w-3" />
                    <span>
                      Last active{" "}
                      {formatDistanceToNow(new Date(app.last_session), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
            </Link>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredData.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Dices className="h-12 w-12 text-muted-foreground/30 mb-3" />
          <p className="text-muted-foreground">No applications found</p>
        </div>
      )}
    </div>
  );
}
