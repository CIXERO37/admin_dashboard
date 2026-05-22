"use client";

import { useTranslation } from "@/lib/i18n";
import { StatCards } from "./_components/stat-cards";
import { StatusList } from "./_components/status-list";
import { AlertCircle } from "lucide-react";

export function CompetitionDashboardClient({ initialData }: { initialData: any }) {
  const { t } = useTranslation();

  if (initialData.error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] border border-dashed rounded-lg p-8">
        <AlertCircle className="h-10 w-10 text-destructive mb-4" />
        <h3 className="text-xl font-semibold mb-2">Error loading dashboard</h3>
        <p className="text-muted-foreground">{initialData.error}</p>
      </div>
    );
  }

  const { stats, lists } = initialData;

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-foreground">
          {t("nav.competition") || "Competition Dashboard"}
        </h2>
      </div>
      
      <StatCards stats={stats} />
      
      <StatusList lists={lists} />
    </div>
  );
}
