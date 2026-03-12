"use client";

import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  format,
  subMonths,
  eachMonthOfInterval,
  startOfYear,
  endOfYear,
} from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/lib/i18n";
import type { Quiz, Profile } from "@/types/supabase";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { MapPinOff, BarChart2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface QuizStatsChartsProps {
  quizzes: Quiz[];
  timeRange: string;
  profiles: Profile[];
  sessionCounts: Record<string, number>;
  loading?: boolean;
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

export function QuizStatsCharts({
  quizzes,
  timeRange,
  profiles,
  sessionCounts,
  loading,
}: QuizStatsChartsProps) {
  const { t } = useTranslation();

  const chartConfig = {
    count: {
      label: "Count",
      color: "var(--chart-1)",
    },
    value: {
      label: t("stats.count"),
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig;

  // 1. Most Played Quizzes (Popular)
  const popularData = useMemo(() => {
    return Object.entries(sessionCounts)
      .map(([quizId, count]) => {
        const quiz = quizzes.find((q) => q.id === quizId);
        if (!quiz) return null;
        return {
          name: quiz.title,
          count: count,
        };
      })
      .filter((item): item is { name: string; count: number } => item !== null)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [sessionCounts, quizzes]);

  // 2. Most Favorited Quizzes
  const favoriteData = useMemo(() => {
    const counts: Record<string, number> = {};
    profiles.forEach((profile) => {
      const rawFavs = profile["favorite_quiz"] as any;
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
          count: count,
        };
      })
      .filter((item): item is { name: string; count: number } => item !== null)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [profiles, quizzes]);

  // 3. Top Creators
  const creatorData = useMemo(() => {
    const counts: Record<string, number> = {};
    quizzes.forEach((quiz) => {
      const name = quiz.creator?.fullname || quiz.creator?.email || "Unknown";
      counts[name] = (counts[name] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [quizzes]);

  // 4. Creation Trend (Monthly)
  const trendData = useMemo(() => {
    let start = subMonths(new Date(), 11);
    let end = new Date();

    if (timeRange === "this-year") {
      start = startOfYear(new Date());
      end = new Date();
    } else if (timeRange === "last-year") {
      const now = new Date();
      start = startOfYear(subMonths(now, 12));
      end = endOfYear(subMonths(now, 12));
    }

    const months = eachMonthOfInterval({ start, end });

    const data = months
      .map((month) => {
        const monthStr = format(month, "MMM");
        const count = quizzes.filter((q) => {
          if (!q.created_at) return false;
          const d = new Date(q.created_at);
          return format(d, "yyyy-MM") === format(month, "yyyy-MM");
        }).length;

        return { name: monthStr, count };
      })
      .filter((item) => item.count > 0)
      .sort((a, b) => b.count - a.count);

    return data;
  }, [quizzes, timeRange]);

  // 5. Top Categories
  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    quizzes.forEach((q) => {
      const cat = q.category || "Uncategorized";
      counts[cat] = (counts[cat] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([name, count]) => {
        const capitalized = name.charAt(0).toUpperCase() + name.slice(1);
        return { name: capitalized, count };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [quizzes]);

  // 6. Top Languages
  const languageData = useMemo(() => {
    const counts: Record<string, number> = {};
    quizzes.forEach((q) => {
      const lang = q.language || "Unknown";
      counts[lang] = (counts[lang] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([name, count]) => {
        const capitalized = name.charAt(0).toUpperCase() + name.slice(1);
        return { name: capitalized, count };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [quizzes]);

  // Loading Skeleton State MOVED HERE
  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* 1. Most Played Skeleton */}
        <Card>
          <CardHeader>
            <CardTitle>{t("master.most_played")}</CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[250px] w-full" />
          </CardContent>
        </Card>
        {/* 2. Most Favorited Skeleton */}
        <Card>
          <CardHeader>
            <CardTitle>{t("master.most_favorited")}</CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[250px] w-full" />
          </CardContent>
        </Card>
        {/* 3. Top Creators Skeleton */}
        <Card>
          <CardHeader>
            <CardTitle>{t("master.top_creators")}</CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[250px] w-full" />
          </CardContent>
        </Card>
        {/* 4. Trend Skeleton */}
        <Card>
          <CardHeader>
            <CardTitle>{t("stats.trend_title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[250px] w-full" />
          </CardContent>
        </Card>
        {/* 5. Categories Skeleton */}
        <Card>
          <CardHeader>
            <CardTitle>{t("stats.category_title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[250px] w-full" />
          </CardContent>
        </Card>
        {/* 6. Languages Skeleton */}
        <Card>
          <CardHeader>
            <CardTitle>{t("stats.language_title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[250px] w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {/* 1. Most Played */}
      <Card>
        <CardHeader>
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
                <XAxis dataKey="count" type="number" hide />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar
                  dataKey="count"
                  fill="var(--color-count)"
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

      {/* 2. Most Favorited */}
      <Card>
        <CardHeader>
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
                <XAxis dataKey="count" type="number" hide />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar
                  dataKey="count"
                  fill="var(--color-count)"
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

      {/* 3. Top Creators */}
      <Card>
        <CardHeader>
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
                <XAxis dataKey="count" type="number" hide />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar
                  dataKey="count"
                  fill="var(--color-count)"
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

      {/* 4. Creation Trend */}
      <Card>
        <CardHeader>
          <CardTitle>{t("stats.trend_title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <BarChart
              accessibilityLayer
              data={trendData}
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
                width={50}
                interval={0}
              />
              <XAxis dataKey="count" type="number" hide />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar
                dataKey="count"
                fill="var(--color-count)"
                radius={[0, 4, 4, 0]}
                barSize={30}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* 5. Top Categories */}
      <Card>
        <CardHeader>
          <CardTitle>{t("stats.category_title")}</CardTitle>
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
                  width={100}
                  tickFormatter={(value) =>
                    value.length > 15 ? `${value.slice(0, 15)}...` : value
                  }
                />
                <XAxis dataKey="count" type="number" hide />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar
                  dataKey="count"
                  fill="var(--color-count)"
                  radius={[0, 4, 4, 0]}
                  barSize={20}
                />
              </BarChart>
            </ChartContainer>
          ) : (
            <div className="flex h-[250px] w-full flex-col items-center justify-center gap-2 text-muted-foreground">
              <MapPinOff className="h-10 w-10 opacity-20" />
              <p className="text-sm">No category data</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 6. Top Languages */}
      <Card>
        <CardHeader>
          <CardTitle>{t("stats.language_title")}</CardTitle>
        </CardHeader>
        <CardContent>
          {languageData.length > 0 ? (
            <ChartContainer
              config={chartConfig}
              className="aspect-auto h-[250px] w-full"
            >
              <BarChart
                accessibilityLayer
                data={languageData}
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
                  width={80}
                  tickFormatter={(value) =>
                    value.length > 10 ? `${value.slice(0, 10)}...` : value
                  }
                />
                <XAxis dataKey="count" type="number" hide />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar
                  dataKey="count"
                  fill="var(--color-count)"
                  radius={[0, 4, 4, 0]}
                  barSize={30}
                />
              </BarChart>
            </ChartContainer>
          ) : (
            <div className="flex h-[250px] w-full flex-col items-center justify-center gap-2 text-muted-foreground">
              <MapPinOff className="h-10 w-10 opacity-20" />
              <p className="text-sm">No language data</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
