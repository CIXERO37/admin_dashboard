"use client";

import { useState } from "react";
import { BookOpen, HelpCircle, Globe, Lock, Clock } from "lucide-react";
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
import { useGameStats } from "@/hooks/useGameStats";
import { useDashboardData } from "@/contexts/dashboard-store";
import { useTranslation } from "@/lib/i18n";
import { QuizStatsCharts } from "@/components/dashboard/quiz-stats-charts";

export default function QuizDashboardPage() {
  const { t } = useTranslation();
  const { quizzes, users, isLoading: dashboardLoading } = useDashboardData();
  const { sessionCounts, loading: gameStatsLoading } = useGameStats();

  const isLoading = dashboardLoading || gameStatsLoading;

  const [timeRange, setTimeRange] = useState("this-year");

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

  const pendingQuizzes = filteredQuizzes.filter(
    (q) => q.request === true
  ).length;

  // Statistics Calculation
  const totalQuizzes = filteredQuizzes.length;
  const publicQuizzes = filteredQuizzes.filter((q) => q.is_public).length;
  const privateQuizzes = totalQuizzes - publicQuizzes;

  const totalQuestions = filteredQuizzes.reduce((acc, quiz) => {
    const qCount = Array.isArray(quiz.questions) ? quiz.questions.length : 0;
    return acc + qCount;
  }, 0);

  // Safe division
  const avgQuestions =
    totalQuizzes > 0 ? Math.round(totalQuestions / totalQuizzes) : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {t("quiz.dashboard_title")}
          </h1>
        </div>

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
        {isLoading ? (
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
              value={totalQuizzes}
              icon={BookOpen}
              description={
                timeRange === "all" ? "All time" : "In selected period"
              }
              href="/quizzes"
            />
            <StatCard
              title={t("status.public")}
              value={publicQuizzes}
              icon={Globe}
              changeType="neutral"
              description={`${(
                (publicQuizzes / (totalQuizzes || 1)) *
                100
              ).toFixed(0)}% of total`}
              href="/quizzes?visibility=publik"
            />
            <StatCard
              title={t("status.pending")}
              value={pendingQuizzes}
              icon={Clock}
              description={`${(
                (pendingQuizzes / (totalQuizzes || 1)) *
                100
              ).toFixed(0)}% of total`}
              href="/quiz-approval"
            />
            <StatCard
              title={t("status.private")}
              value={privateQuizzes}
              icon={Lock}
              description={`${(
                (privateQuizzes / (totalQuizzes || 1)) *
                100
              ).toFixed(0)}% of total`}
              href="/quizzes?visibility=private"
            />
          </>
        )}
      </div>

      {/* Charts */}
      <div>
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2">
            <Skeleton className="h-[400px] rounded-xl" />
            <Skeleton className="h-[400px] rounded-xl" />
          </div>
        ) : (
          <QuizStatsCharts
            quizzes={filteredQuizzes}
            timeRange={timeRange}
            profiles={users as any}
            sessionCounts={sessionCounts}
          />
        )}
      </div>
    </div>
  );
}
