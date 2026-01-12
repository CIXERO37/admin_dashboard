"use client";

import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { revenueData } from "@/lib/dummy-data";
import { useTranslation } from "@/lib/i18n";

const chartConfig = {
  revenue: {
    label: "Revenue", // This label might be used internally by chart lib, hard to translate dynamically in config const if outside component.
    // Usually ChartConfig label is just for display key. If we want it translated, we might need to move config inside component or handle translation in Tooltip/Legend.
    // However, looking at usage: <ChartTooltip ... /> and <Area ... />
    // The "Revenue" label typically shows up in the tooltip.
    // I can try to make chartConfig specific to the component or see if I can translate it elsewhere.
    color: "#2dd4bf",
  },
} satisfies ChartConfig;

export function RevenueChart() {
  const { t } = useTranslation();

  const dynamicChartConfig = {
    revenue: {
      label: t("revenue.label"),
      color: "#2dd4bf",
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("revenue.title")}</CardTitle>
        <CardDescription>{t("revenue.description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={dynamicChartConfig}
          className="h-[300px] w-full"
        >
          <AreaChart
            accessibilityLayer
            data={revenueData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <defs>
              <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-revenue)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-revenue)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `$${value / 1000}k`}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="revenue"
              type="natural"
              fill="url(#fillRevenue)"
              stroke="var(--color-revenue)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              {t("revenue.trending_up")} 5.2% {t("revenue.this_month")}{" "}
              <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              {t("revenue.period")}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
