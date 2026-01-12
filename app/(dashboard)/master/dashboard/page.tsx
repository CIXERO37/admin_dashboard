"use client";

import { useState } from "react";
import { BookOpen, Globe, Layers, Lock } from "lucide-react";
import { isSameYear, subYears } from "date-fns";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { StatCard } from "@/components/dashboard/stat-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuizzes } from "@/hooks/useQuizzes";
import { useProfiles } from "@/hooks/useProfiles";
import { useGameStats } from "@/hooks/useGameStats";
import { MasterStatsCharts } from "@/components/dashboard/master-stats-charts";
import { useTranslation } from "@/lib/i18n";

export default function MasterDashboardPage() {
  const { t } = useTranslation();
  const { data: quizzes, loading: quizzesLoading } = useQuizzes();
  const {
    data: profiles,
    aggregates,
    loading: profilesLoading,
  } = useProfiles();
  const {
    sessionCounts,
    topPlayers,
    topHosts,
    loading: gameStatsLoading,
  } = useGameStats();
  const [timeRange, setTimeRange] = useState("this-year");

  const loading = quizzesLoading || profilesLoading;

  const checkDate = (dateStr: string | null | undefined, range: string) => {
    if (range === "all") return true;
    if (!dateStr) return false;

    const date = new Date(dateStr);
    const now = new Date();

    if (range === "this-year") {
      return isSameYear(date, now);
    }
    if (range === "last-year") {
      return isSameYear(date, subYears(now, 1));
    }
    return true;
  };

  const filteredQuizzes = quizzes.filter((quiz) =>
    checkDate(quiz.created_at, timeRange)
  );

  const publicQuizzes = filteredQuizzes.filter((quiz) => quiz.is_public);
  const privateCount = filteredQuizzes.length - publicQuizzes.length;
  const categoriesCount = new Set(
    filteredQuizzes.map((q) => q.category).filter(Boolean)
  ).size;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">
          {t("master.title")}
        </h1>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[160px]" aria-label="Select a value">
            <SelectValue placeholder={t("master.this_year")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="this-year">{t("master.this_year")}</SelectItem>
            <SelectItem value="last-year">{t("master.last_year")}</SelectItem>
            <SelectItem value="all">{t("master.all_time")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          <>
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
          </>
        ) : (
          <>
            <StatCard
              title={t("stats.quizzes")}
              value={filteredQuizzes.length}
              icon={BookOpen}
            />
            <StatCard
              title={t("stats.categories")}
              value={categoriesCount}
              icon={Layers}
            />
            <StatCard
              title={t("stats.public")}
              value={publicQuizzes.length}
              icon={Globe}
            />
            <StatCard
              title={t("stats.private")}
              value={privateCount}
              icon={Lock}
            />
          </>
        )}
      </div>

      {/* Charts */}
      <div>
        {loading || gameStatsLoading ? (
          <div className="grid gap-6 lg:grid-cols-2">
            <Skeleton className="h-[400px] rounded-xl" />
            <Skeleton className="h-[400px] rounded-xl" />
          </div>
        ) : (
          <MasterStatsCharts
            quizzes={filteredQuizzes}
            profiles={profiles}
            sessionCounts={sessionCounts}
            topPlayers={topPlayers}
            topHosts={topHosts}
          />
        )}
      </div>
    </div>
  );
}
