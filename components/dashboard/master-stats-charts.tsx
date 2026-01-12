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
import type { Quiz, Profile } from "@/types/supabase";
import { useTranslation } from "@/lib/i18n";

interface MasterStatsChartsProps {
  quizzes: Quiz[];
  profiles: Profile[];
  sessionCounts: Record<string, number>;
  topPlayers?: { name: string; value: number }[];
  topHosts?: { name: string; value: number }[];
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

export function MasterStatsCharts({
  quizzes,
  profiles,
  sessionCounts,
  topPlayers = [],
  topHosts = [],
}: MasterStatsChartsProps) {
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

  // 2. Most Played Quizzes (Popular)
  const popularData = useMemo(() => {
    return Object.entries(sessionCounts)
      .map(([quizId, count]) => {
        const quiz = quizzes.find((q) => q.id === quizId);
        if (!quiz) return null;
        return {
          name: quiz.title,
          value: count,
        };
      })
      .filter((item): item is { name: string; value: number } => item !== null)
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [sessionCounts, quizzes]);

  // 3. Most Favorited Quizzes
  const favoriteData = useMemo(() => {
    const counts: Record<string, number> = {};
    profiles.forEach((profile) => {
      const rawFavs = profile.favorite_quiz as any;
      let favorites: string[] = [];

      if (rawFavs && Array.isArray(rawFavs.favorites)) {
        favorites = rawFavs.favorites;
      } else if (Array.isArray(rawFavs)) {
        favorites = rawFavs;
      }

      favorites.forEach((quizId) => {
        if (typeof quizId === "string") {
          counts[quizId] = (counts[quizId] || 0) + 1;
        }
      });
    });

    return Object.entries(counts)
      .map(([quizId, count]) => {
        const quiz = quizzes.find((q) => q.id === quizId);
        if (!quiz) return null;
        return {
          name: quiz.title,
          value: count,
        };
      })
      .filter((item): item is { name: string; value: number } => item !== null)
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [profiles, quizzes]);

  // 4. Top Creators
  const creatorData = useMemo(() => {
    const counts: Record<string, number> = {};
    quizzes.forEach((quiz) => {
      const name = quiz.creator?.fullname || quiz.creator?.email || "Unknown";
      counts[name] = (counts[name] || 0) + 1;
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

      {/* Popular Quiz Chart */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>{t("master.most_played")}</CardTitle>
        </CardHeader>
        <CardContent>
          {popularData.length > 0 ? (
            <ChartContainer
              config={chartConfig}
              className="aspect-auto h-[250px] w-full"
            >
              <BarChart
                accessibilityLayer
                data={popularData}
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
              <p className="text-sm">{t("master.no_data_play")}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Favorite Quiz Chart */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>{t("master.most_favorited")}</CardTitle>
        </CardHeader>
        <CardContent>
          {favoriteData.length > 0 ? (
            <ChartContainer
              config={chartConfig}
              className="aspect-auto h-[250px] w-full"
            >
              <BarChart
                accessibilityLayer
                data={favoriteData}
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
              <p className="text-sm">{t("master.no_data_favorite")}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Top Creators Chart */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>{t("master.top_creators")}</CardTitle>
        </CardHeader>
        <CardContent>
          {creatorData.length > 0 ? (
            <ChartContainer
              config={chartConfig}
              className="aspect-auto h-[250px] w-full"
            >
              <BarChart
                accessibilityLayer
                data={creatorData}
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
              <p className="text-sm">{t("master.no_data_creator")}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Top Hosts Chart */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>{t("master.top_hosts")}</CardTitle>
        </CardHeader>
        <CardContent>
          {topHosts.length > 0 ? (
            <ChartContainer
              config={chartConfig}
              className="aspect-auto h-[250px] w-full"
            >
              <BarChart
                accessibilityLayer
                data={topHosts}
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
              <p className="text-sm">{t("master.no_data_host")}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Top Players Chart */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>{t("master.top_players")}</CardTitle>
        </CardHeader>
        <CardContent>
          {topPlayers.length > 0 ? (
            <ChartContainer
              config={chartConfig}
              className="aspect-auto h-[250px] w-full"
            >
              <BarChart
                accessibilityLayer
                data={topPlayers}
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
              <p className="text-sm">{t("master.no_data_player")}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
