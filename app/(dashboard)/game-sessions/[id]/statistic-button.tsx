"use client";

import { useTranslation } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { BarChart2 } from "lucide-react";

interface StatisticButtonProps {
  sessionId: string;
}

export function StatisticButton({ sessionId }: StatisticButtonProps) {
  const { t } = useTranslation();
  // TODO: Move domain to env var if needed. Using screenshot domain as default.
  const mainAppUrl = "https://gameforsmart2026.vercel.app";

  return (
    <Button variant="outline" size="sm" className="gap-2" asChild>
      <a 
        href={`${mainAppUrl}/results/${sessionId}/question-stats`} 
        target="_blank" 
        rel="noopener noreferrer"
      >
        <BarChart2 className="h-4 w-4" />
        {t("game_session.statistics") || "Statistics"}
      </a>
    </Button>
  );
}
