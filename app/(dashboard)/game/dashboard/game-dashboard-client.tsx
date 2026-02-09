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
import { useState } from "react";
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
import { useRouter } from "next/navigation";


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
      topCategories: { name: string; count: number }[];
      topStates: { name: string; count: number }[];
      topCities: { name: string; count: number }[];
      topCountries: { name: string; count: number }[];
    };
  } | null;
}

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"];

export function GameDashboardClient({ data }: GameDashboardProps) {
  const { t, locale } = useTranslation();
  const router = useRouter();
  const [activeLabel, setActiveLabel] = useState<string | null>(null);

  if (!data) return <GameDashboardSkeleton />;

  const { kpi, charts } = data;

  const chartConfig = {
    count: {
      label: "Count",
      color: "hsl(var(--primary))",
    },
  } satisfies ChartConfig;

  /* Navigations */
  const handleAppClick = (data: any) => {
    if (data && data.name) {
      router.push(`/game-sessions?application=${encodeURIComponent(data.name)}`);
    }
  };

  const handleHostClick = (data: any) => {
    if (data && data.id) {
      router.push(`/users/${data.id}`);
    }
  };

  const handleCategoryClick = (data: any) => {
    if (data && data.name) {
      router.push(`/quizzes?category=${encodeURIComponent(data.name)}`);
    }
  };

  const handleCountryClick = (data: any) => {
    if (data && data.name) {
       router.push(`/users?country=${encodeURIComponent(data.name)}`);
    }
  };

  const handleStateClick = (data: any) => {
    if (data && data.name) {
       router.push(`/users?state=${encodeURIComponent(data.name)}`);
    }
  };

  const handleCityClick = (data: any) => {
    if (data && data.name) {
       router.push(`/users?city=${encodeURIComponent(data.name)}`);
    }
  };

  const topHostsData =
    charts.topHosts?.map((h: any) => ({
      name: h.fullname,
      count: h.count,
      id: h.id,
    })) || [];

  const topAppsData =
    charts.apps?.map((a: any) => ({
      name: a.name,
      count: a.value,
    })) || [];

  const topCategoriesData = charts.topCategories || [];
  const topCountriesData = charts.topCountries || [];
  const topStatesData = charts.topStates || [];
  const topCitiesData = charts.topCities || [];

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
          title={t("game_dashboard.kpi_avg_duration")}
          value={`${kpi.avgDuration} min`}
          icon={Clock}
        />
        <StatCard
          title={t("game_dashboard.kpi_avg_questions")}
          value={kpi.avgQuestions.toString()}
          icon={HelpCircle}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Top Apps Chart (Left) */}
        <Card>
          <CardHeader>
            <CardTitle>{t("game_dashboard.top_apps")}</CardTitle>
          </CardHeader>
          <CardContent>
            {topAppsData.length > 0 ? (
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
                    width={180}
                    tick={(props) => (
                      <text
                        x={props.x}
                        y={props.y}
                        dy={4}
                        textAnchor="end"
                        fontSize={12}
                        className="fill-muted-foreground cursor-pointer"
                        style={{ fill: activeLabel === props.payload.value ? "#10b981" : undefined }}
                        fontWeight={activeLabel === props.payload.value ? 500 : 400}
                        onClick={() => handleAppClick({ name: props.payload.value })}
                        onMouseEnter={() => setActiveLabel(props.payload.value)}
                        onMouseLeave={() => setActiveLabel(null)}
                      >
                        {props.payload.value.length > 20
                          ? `${props.payload.value.slice(0, 20)}...`
                          : props.payload.value}
                        <title>{props.payload.value}</title>
                      </text>
                    )}
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
                    onClick={handleAppClick}
                    className="cursor-pointer"
                    style={{ outline: "none" }}
                    onMouseEnter={(data) => setActiveLabel(data.name || null)}
                    onMouseLeave={() => setActiveLabel(null)}
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

        {/* Top Hosts Chart (Right) */}
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
                    width={150}
                    tick={(props) => {
                      const host = topHostsData.find((h) => h.name === props.payload.value);
                      return (
                        <text
                          x={props.x}
                          y={props.y}
                          dy={4}
                          textAnchor="end"
                          fontSize={12}
                          className="fill-muted-foreground cursor-pointer"
                          style={{ fill: activeLabel === props.payload.value ? "#10b981" : undefined }}
                          fontWeight={activeLabel === props.payload.value ? 500 : 400}
                          onClick={() => host && handleHostClick(host)}
                          onMouseEnter={() => setActiveLabel(props.payload.value)}
                          onMouseLeave={() => setActiveLabel(null)}
                        >
                          {props.payload.value.length > 18
                            ? `${props.payload.value.slice(0, 18)}...`
                            : props.payload.value}
                          <title>{props.payload.value}</title>
                        </text>
                      );
                    }}

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
                    onClick={handleHostClick}
                    className="cursor-pointer"
                    style={{ outline: "none" }}
                    onMouseEnter={(data) => setActiveLabel(data.name || null)}
                    onMouseLeave={() => setActiveLabel(null)}
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

        {/* Top Categories Chart */}
        <Card>
          <CardHeader>
            <CardTitle>{t("stats.category_title")}</CardTitle>
          </CardHeader>
          <CardContent>
            {topCategoriesData.length > 0 ? (
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
                  data={topCategoriesData}
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
                    width={110}
                    tick={(props) => (
                      <text
                        x={props.x}
                        y={props.y}
                        dy={4}
                        textAnchor="end"
                        fontSize={12}
                        className="fill-muted-foreground cursor-pointer"
                        style={{ fill: activeLabel === props.payload.value ? "#10b981" : undefined }}
                        fontWeight={activeLabel === props.payload.value ? 500 : 400}
                        onClick={() => handleCategoryClick({ name: props.payload.value })}
                        onMouseEnter={() => setActiveLabel(props.payload.value)}
                        onMouseLeave={() => setActiveLabel(null)}
                      >
                        {props.payload.value.length > 14
                          ? `${props.payload.value.slice(0, 14)}...`
                          : props.payload.value}
                        <title>{props.payload.value}</title>
                      </text>
                    )}
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
                    onClick={handleCategoryClick}
                    className="cursor-pointer"
                    style={{ outline: "none" }}
                    onMouseEnter={(data) => setActiveLabel(data.name || null)}
                    onMouseLeave={() => setActiveLabel(null)}
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

      {/* Second Row: Location Charts */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Top Countries Chart */}
        <Card>
          <CardHeader>
            <CardTitle>{t("master.top_countries") === "master.top_countries" ? "Top Countries" : t("master.top_countries")}</CardTitle>
          </CardHeader>
          <CardContent>
            {topCountriesData.length > 0 ? (
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
                  data={topCountriesData}
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
                    width={140}
                    tick={(props) => (
                      <text
                        x={props.x}
                        y={props.y}
                        dy={4}
                        textAnchor="end"
                        fontSize={12}
                        className="fill-muted-foreground cursor-pointer"
                        style={{ fill: activeLabel === props.payload.value ? "#10b981" : undefined }}
                        fontWeight={activeLabel === props.payload.value ? 500 : 400}
                        onClick={() => handleCountryClick({ name: props.payload.value })}
                        onMouseEnter={() => setActiveLabel(props.payload.value)}
                        onMouseLeave={() => setActiveLabel(null)}
                      >
                        {props.payload.value.length > 18
                          ? `${props.payload.value.slice(0, 18)}...`
                          : props.payload.value}
                        <title>{props.payload.value}</title>
                      </text>
                    )}
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
                    onClick={handleCountryClick}
                    className="cursor-pointer"
                    style={{ outline: "none" }}
                    onMouseEnter={(data) => setActiveLabel(data.name || null)}
                    onMouseLeave={() => setActiveLabel(null)}
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

        {/* Top States Chart */}
        <Card>
          <CardHeader>
            <CardTitle>{t("master.top_states")}</CardTitle>
          </CardHeader>
          <CardContent>
            {topStatesData.length > 0 ? (
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
                  data={topStatesData}
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
                    width={140}
                    tick={(props) => (
                      <text
                        x={props.x}
                        y={props.y}
                        dy={4}
                        textAnchor="end"
                        fontSize={12}
                        className="fill-muted-foreground cursor-pointer"
                        style={{ fill: activeLabel === props.payload.value ? "#10b981" : undefined }}
                        fontWeight={activeLabel === props.payload.value ? 500 : 400}
                        onClick={() => handleStateClick({ name: props.payload.value })}
                        onMouseEnter={() => setActiveLabel(props.payload.value)}
                        onMouseLeave={() => setActiveLabel(null)}
                      >
                        {props.payload.value.length > 18
                          ? `${props.payload.value.slice(0, 18)}...`
                          : props.payload.value}
                        <title>{props.payload.value}</title>
                      </text>
                    )}
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
                    onClick={handleStateClick}
                    className="cursor-pointer"
                    style={{ outline: "none" }}
                    onMouseEnter={(data) => setActiveLabel(data.name || null)}
                    onMouseLeave={() => setActiveLabel(null)}
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

        {/* Top Cities Chart */}
        <Card>
          <CardHeader>
            <CardTitle>{t("master.top_cities")}</CardTitle>
          </CardHeader>
          <CardContent>
            {topCitiesData.length > 0 ? (
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
                  data={topCitiesData}
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
                    tick={(props) => (
                      <text
                        x={props.x}
                        y={props.y}
                        dy={4}
                        textAnchor="end"
                        fontSize={12}
                        className="fill-muted-foreground cursor-pointer"
                        style={{ fill: activeLabel === props.payload.value ? "#10b981" : undefined }}
                        fontWeight={activeLabel === props.payload.value ? 500 : 400}
                        onClick={() => handleCityClick({ name: props.payload.value })}
                        onMouseEnter={() => setActiveLabel(props.payload.value)}
                        onMouseLeave={() => setActiveLabel(null)}
                      >
                        {props.payload.value.length > 22
                          ? `${props.payload.value.slice(0, 22)}...`
                          : props.payload.value}
                        <title>{props.payload.value}</title>
                      </text>
                    )}
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
                    onClick={handleCityClick}
                    className="cursor-pointer"
                    style={{ outline: "none" }}
                    onMouseEnter={(data) => setActiveLabel(data.name || null)}
                    onMouseLeave={() => setActiveLabel(null)}
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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>{t("game_dashboard.top_apps")}</CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[220px] w-full" />
          </CardContent>
        </Card>
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
            <CardTitle>{t("stats.category_title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[220px] w-full" />
          </CardContent>
        </Card>
      </div>

      {/* Location Charts Skeleton */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t("master.top_states")}</CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[220px] w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t("master.top_cities")}</CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[220px] w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
