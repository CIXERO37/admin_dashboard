"use client";

import { useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "@/lib/i18n";
import {
  GameDashboardClient,
  GameDashboardSkeleton,
} from "./game-dashboard-client";

interface GameDashboardWrapperProps {
  initialData: {
    kpi: {
      totalSessions: number;
      totalParticipants: number;
      avgDuration: number;
      avgQuestions: number;
    };
    charts: {
      trend: { date: string; count: number }[];
      apps: { name: string; value: number }[];
      topHosts: any[];
      recentActivity: any[];
      topCategories: { name: string; count: number }[];
      topStates: { name: string; count: number }[];
      topCities: { name: string; count: number }[];
      topCountries: { name: string; count: number }[];
    };
  } | null;
}

export function GameDashboardWrapper({
  initialData,
}: GameDashboardWrapperProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentRange = searchParams.get("timeRange") || "this-year";

  const [isPending, startTransition] = useTransition();

  const handleFilterChange = (val: string) => {
    startTransition(() => {
      router.push(`?timeRange=${val}`);
    });
  };

  return (
    <div className="flex-1 space-y-4">
      {/* Header with Filter */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Game Dashboard</h2>
        <Select value={currentRange} onValueChange={handleFilterChange}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder={t("master.this_year") || "This Year"} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="this-year">
              {t("master.this_year") || "This Year"}
            </SelectItem>
            <SelectItem value="last-year">
              {t("master.last_year") || "Last Year"}
            </SelectItem>
            <SelectItem value="all">
              {t("master.all_time") || "All Time"}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Content: Show Skeleton when filter is changing */}
      {isPending ? (
        <GameDashboardSkeleton />
      ) : (
        <GameDashboardClient data={initialData} />
      )}
    </div>
  );
}
