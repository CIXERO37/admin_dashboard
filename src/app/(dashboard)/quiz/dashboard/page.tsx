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
} from "@/src/components/ui/select";

import { StatCard } from "@/components/dashboard/stat-card";
import { Skeleton } from "@/src/components/ui/skeleton";
import { useGameStats } from "@/src/features/quiz/dashboard/_hooks/useGameStats";
import { useDashboardData } from "@/contexts/dashboard-store";
import { useTranslation } from "@/lib/i18n";
import { QuizStatsCharts } from "@/features/quiz/dashboard/_components/quiz-stats-charts";
import { useQuizCalculations } from "@/features/quiz/dashboard/_hooks/useQuizCalculations";

export default function QuizDashboardPage() {
  const { t } = useTranslation();
  const { quizzes, users, isLoading: dashboardLoading } = useDashboardData();
  const { sessionCounts, loading: gameStatsLoading } = useGameStats();

  const isLoading = dashboardLoading || gameStatsLoading;

  const [timeRange, setTimeRange] = useState("this-year");

  const { 
    filteredQuizzes, 
    pendingQuizzes, 
    totalQuizzes, 
    publicQuizzes, 
    privateQuizzes, 
  } = useQuizCalculations(quizzes, timeRange);
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
        <QuizStatsCharts
          quizzes={filteredQuizzes}
          timeRange={timeRange}
          profiles={users as any}
          sessionCounts={sessionCounts}
          loading={isLoading}
        />
      </div>
    </div>
  );
}
