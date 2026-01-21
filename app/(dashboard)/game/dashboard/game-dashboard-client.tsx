"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Gamepad2,
  Users,
  Clock,
  Trophy,
  HelpCircle,
  Activity,
  Calendar,
} from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { formatNumber } from "@/lib/utils";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { StatCard } from "@/components/dashboard/stat-card";
import { Skeleton } from "@/components/ui/skeleton";

interface GameDashboardProps {
  data: {
    kpi: {
      totalSessions: number;
      totalParticipants: number;
      avgDuration: number;
      avgQuestions: number;
    };
    charts: {
      trend: { date: string; count: number }[];
      apps: { name: string; value: number }[];
      topHosts: any[];
      recentActivity: any[];
    };
  } | null;
}

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"];

export function GameDashboardClient({ data }: GameDashboardProps) {
  const { t, locale } = useTranslation();
  if (!data) return <GameDashboardSkeleton />;

  const { kpi, charts } = data;

  const chartConfig = {
    count: {
      label: "Count",
      color: "hsl(var(--primary))",
    },
  } satisfies ChartConfig;

  const topHostsData =
    charts.topHosts?.map((h: any) => ({
      name: h.fullname,
      count: h.count,
    })) || [];

  const topAppsData =
    charts.apps?.map((a: any) => ({
      name: a.name,
      count: a.value,
    })) || [];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title={t("game_dashboard.sessions")}
          value={formatNumber(kpi.totalSessions)}
          icon={Gamepad2}
          href="/game-sessions?status=finished"
        />
        <StatCard
          title={t("game_dashboard.participants")}
          value={formatNumber(kpi.totalParticipants)}
          icon={Users}
        />
        <StatCard
          title={t("game_dashboard.avg_duration")}
          value={`${kpi.avgDuration} min`}
          icon={Clock}
        />
        <StatCard
          title={t("game_dashboard.avg_questions")}
          value={kpi.avgQuestions.toString()}
          icon={HelpCircle}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Top Hosts Chart (Horizontal Bar like Top States) */}
        <Card>
          <CardHeader>
            <CardTitle>{t("game_dashboard.top_hosts")}</CardTitle>
          </CardHeader>
          <CardContent>
            {topHostsData.length > 0 ? (
              <ChartContainer
                config={{
                  count: {
                    label: t("game_dashboard.sessions"),
                    color: "var(--chart-1)",
                  },
                }}
                className="aspect-auto h-[220px] w-full"
              >
                <BarChart
                  accessibilityLayer
                  data={topHostsData}
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
                    width={120}
                    tickFormatter={(value) =>
                      value.length > 20 ? `${value.slice(0, 20)}...` : value
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
              <div className="flex h-[220px] items-center justify-center text-muted-foreground">
                {t("msg.no_data")}
              </div>
            )}
          </CardContent>
        </Card>

        {/* App Distribution Chart (Horizontal Bar Chart) */}
        <Card>
          <CardHeader>
            <CardTitle>{t("game_dashboard.top_apps")}</CardTitle>
          </CardHeader>
          <CardContent>
            {topAppsData.length > 0 ? (
              <ChartContainer
                config={{
                  count: {
                    label: t("game_dashboard.games_count"),
                    color: "var(--chart-1)",
                  },
                }}
                className="aspect-auto h-[220px] w-full"
              >
                <BarChart
                  accessibilityLayer
                  data={topAppsData}
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
                    width={120}
                    tickFormatter={(value) =>
                      value.length > 20 ? `${value.slice(0, 20)}...` : value
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
              <div className="flex h-[220px] items-center justify-center text-muted-foreground">
                {t("msg.no_data")}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function GameDashboardSkeleton() {
  const { t } = useTranslation();
  return (
    <div className="space-y-6">
      {/* KPI Cards Skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Skeleton className="h-32 rounded-xl" />
        <Skeleton className="h-32 rounded-xl" />
        <Skeleton className="h-32 rounded-xl" />
        <Skeleton className="h-32 rounded-xl" />
      </div>

      {/* Charts Skeleton */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t("game_dashboard.top_hosts")}</CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[220px] w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t("game_dashboard.top_apps")}</CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[220px] w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
