"use client";

import { CategoryDistributionChart } from "./category-distribution-chart";
import { ParticipantsChart } from "./participants-chart";

interface DashboardChartsProps {
  categoriesChart: { name: string; count: number }[];
  participantsChart: { title: string; participants: number }[];
}

export function DashboardCharts({ categoriesChart, participantsChart }: DashboardChartsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {categoriesChart && categoriesChart.length > 0 && (
        <CategoryDistributionChart data={categoriesChart} />
      )}
      {participantsChart && participantsChart.length > 0 && (
        <ParticipantsChart data={participantsChart} />
      )}
    </div>
  );
}
