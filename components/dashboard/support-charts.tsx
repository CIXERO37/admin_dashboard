"use client";

import * as React from "react";
import { BarChart2, FileX, TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  LabelList,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useTranslation } from "@/lib/i18n";

interface SupportChartsProps {
  reports: any[];
  groupStats?: { category: string; count: number }[];
}

export function SupportCharts({ reports, groupStats }: SupportChartsProps) {
  const { t } = useTranslation();

  const typeData = React.useMemo(() => {
    const counts: Record<string, number> = {};
    reports.forEach((r) => {
      let type = r.report_type || t("admin.unknown");
      // Format readable
      type = type
        .replace(/_/g, " ")
        .replace(/\b\w/g, (l: string) => l.toUpperCase());
      counts[type] = (counts[type] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // Top 5
  }, [reports, t]);

  const monthlyData = React.useMemo(() => {
    const counts: Record<number, number> = {};
    reports.forEach((r) => {
      if (!r.created_at) return;
      const d = new Date(r.created_at);
      const m = d.getMonth(); // 0-11
      counts[m] = (counts[m] || 0) + 1;
    });

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return months.map((name, index) => ({
      name,
      count: counts[index] || 0,
    }));
  }, [reports]);

  const chartConfig = {
    count: {
      label: t("stats.reports"),
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{t("stats.reports_by_type")}</CardTitle>
        </CardHeader>
        <CardContent>
          {typeData.length > 0 ? (
            <ChartContainer
              config={chartConfig}
              className="aspect-auto h-[250px] w-full"
            >
              <BarChart
                accessibilityLayer
                data={typeData}
                layout="vertical"
                margin={{ left: 20, right: 30 }}
              >
                <CartesianGrid horizontal={false} />
                <YAxis
                  dataKey="type"
                  type="category"
                  tickLine={false}
                  axisLine={false}
                  width={140}
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) =>
                    value.length > 20 ? `${value.slice(0, 20)}...` : value
                  }
                />
                <XAxis type="number" hide />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar
                  dataKey="count"
                  fill="#14b8a6"
                  radius={[0, 4, 4, 0]}
                  barSize={32}
                >
                  <LabelList
                    dataKey="count"
                    position="right"
                    fontSize={12}
                    fill="var(--foreground)"
                  />
                </Bar>
              </BarChart>
            </ChartContainer>
          ) : (
            <div className="flex h-[250px] w-full flex-col items-center justify-center gap-2 text-muted-foreground">
              <FileX className="h-10 w-10 opacity-20" />
              <p className="text-sm">{t("msg.no_reports")}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("stats.top_group_categories")}</CardTitle>
        </CardHeader>
        <CardContent>
          {groupStats && groupStats.length > 0 ? (
            <ChartContainer
              config={chartConfig}
              className="aspect-auto h-[250px] w-full"
            >
              <BarChart
                accessibilityLayer
                data={groupStats}
                layout="vertical"
                margin={{ left: 20, right: 30 }}
              >
                <CartesianGrid horizontal={false} />
                <YAxis
                  dataKey="category"
                  type="category"
                  tickLine={false}
                  axisLine={false}
                  width={140}
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) =>
                    value.length > 20 ? `${value.slice(0, 20)}...` : value
                  }
                />
                <XAxis type="number" hide />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar
                  dataKey="count"
                  fill="#14b8a6"
                  radius={[0, 4, 4, 0]}
                  barSize={32}
                >
                  <LabelList
                    dataKey="count"
                    position="right"
                    fontSize={12}
                    fill="var(--foreground)"
                  />
                </Bar>
              </BarChart>
            </ChartContainer>
          ) : (
            <div className="flex h-[250px] w-full flex-col items-center justify-center gap-2 text-muted-foreground">
              <BarChart2 className="h-10 w-10 opacity-20" />
              <p className="text-sm">{t("msg.no_groups_data")}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("stats.activity")}</CardTitle>
        </CardHeader>
        <CardContent>
          {monthlyData.some((d) => d.count > 0) ? (
            <ChartContainer
              config={chartConfig}
              className="aspect-auto h-[250px] w-full"
            >
              <LineChart
                accessibilityLayer
                data={monthlyData}
                margin={{ left: 20, right: 20, top: 20, bottom: 20 }}
              >
                <CartesianGrid vertical={false} />
                <YAxis
                  dataKey="count"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  allowDecimals={false}
                />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Line
                  dataKey="count"
                  type="monotone"
                  stroke="#14b8a6"
                  strokeWidth={2}
                  dot={{ r: 4, fill: "#14b8a6" }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ChartContainer>
          ) : (
            <div className="flex h-[250px] w-full flex-col items-center justify-center gap-2 text-muted-foreground">
              <TrendingUp className="h-10 w-10 opacity-20" />
              <p className="text-sm">{t("msg.no_activity_trend")}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
