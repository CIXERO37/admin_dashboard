"use client";

import * as React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  LabelList,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface SupportChartsProps {
  reports: any[];
  groupStats?: { category: string; count: number }[];
}

export function SupportCharts({ reports, groupStats }: SupportChartsProps) {
  const typeData = React.useMemo(() => {
    const counts: Record<string, number> = {};
    reports.forEach((r) => {
      let type = r.report_type || "Unknown";
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
  }, [reports]);

  const chartConfig = {
    count: {
      label: "Reports",
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Reports by Type</CardTitle>
        </CardHeader>
        <CardContent>
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
                fill="var(--color-count)"
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
        </CardContent>
      </Card>

      {groupStats && groupStats.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Top Group Categories</CardTitle>
          </CardHeader>
          <CardContent>
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
                  fill="var(--color-count)"
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
          </CardContent>
        </Card>
      )}
    </>
  );
}
