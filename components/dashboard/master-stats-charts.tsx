"use client";

import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { BarChart2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { Quiz } from "@/types/supabase";
import { useTranslation } from "@/lib/i18n";

interface MasterStatsChartsProps {
  quizzes: Quiz[];
}

// Helper for truncated Y-axis labels with wrapping
const CustomYAxisTick = (props: any) => {
  const { x, y, payload } = props;
  const value = payload.value as string;

  // Simple word wrap logic
  const words = value.split(" ");
  let lines: string[] = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    if ((currentLine + " " + words[i]).length <= 15) {
      currentLine += " " + words[i];
    } else {
      lines.push(currentLine);
      currentLine = words[i];
    }
  }
  lines.push(currentLine);

  // Max 2 lines. If more, join rest and truncate.
  if (lines.length > 2) {
    const rest = lines.slice(1).join(" ");
    lines = [lines[0], rest.length > 15 ? rest.slice(0, 15) + "..." : rest];
  } else if (lines.length === 2 && lines[1].length > 15) {
    lines[1] = lines[1].slice(0, 15) + "...";
  } else if (lines.length === 1 && lines[0].length > 20) {
    // Force split or truncate single long word
    lines = [lines[0].slice(0, 20) + "..."];
  }

  const startDy = lines.length === 1 ? 4 : -2;

  return (
    <g transform={`translate(${x},${y})`}>
      <title>{value}</title>
      <text
        textAnchor="end"
        className="fill-muted-foreground text-xs capitalize"
      >
        {lines.map((line, index) => (
          <tspan x={-10} dy={index === 0 ? startDy : 14} key={index}>
            {line}
          </tspan>
        ))}
      </text>
    </g>
  );
};

export function MasterStatsCharts({ quizzes }: MasterStatsChartsProps) {
  const { t } = useTranslation();

  const chartConfig = {
    value: {
      label: t("stats.count"),
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig;

  // 1. Top Quiz Categories
  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    quizzes.forEach((quiz) => {
      const category = quiz.category || "Uncategorized";
      counts[category] = (counts[category] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [quizzes]);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* Category Chart */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>{t("master.top_categories")}</CardTitle>
        </CardHeader>
        <CardContent>
          {categoryData.length > 0 ? (
            <ChartContainer
              config={chartConfig}
              className="aspect-auto h-[250px] w-full"
            >
              <BarChart
                accessibilityLayer
                data={categoryData}
                layout="vertical"
                margin={{ top: 0, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid horizontal={false} />
                <YAxis
                  dataKey="name"
                  type="category"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  width={160}
                  tick={CustomYAxisTick}
                />
                <XAxis dataKey="value" type="number" hide />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar
                  dataKey="value"
                  fill="var(--color-value)"
                  radius={[0, 4, 4, 0]}
                  barSize={20}
                />
              </BarChart>
            </ChartContainer>
          ) : (
            <div className="flex h-[250px] w-full flex-col items-center justify-center gap-2 text-muted-foreground">
              <BarChart2 className="h-10 w-10 opacity-20" />
              <p className="text-sm">{t("master.no_data_category")}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
