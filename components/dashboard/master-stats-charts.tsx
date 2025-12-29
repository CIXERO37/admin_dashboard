"use client";

import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { Quiz, Profile } from "@/types/supabase";

interface MasterStatsChartsProps {
  quizzes: Quiz[];
  profiles: Profile[];
  sessionCounts: Record<string, number>;
}

const chartConfig = {
  value: {
    label: "Count",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

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
}: MasterStatsChartsProps) {
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
        return {
          name: quiz?.title || "Unknown Quiz",
          value: count,
        };
      })
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
        return {
          name: quiz?.title || "Unknown Quiz",
          value: count,
        };
      })
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [profiles, quizzes]);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* Category Chart */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Top Categories</CardTitle>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>

      {/* Popular Quiz Chart */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Most Played</CardTitle>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>

      {/* Favorite Quiz Chart */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Most Favorited</CardTitle>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>
    </div>
  );
}
