"use client";

import { useEffect, useState } from "react";
import { Globe, Map, Building2, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { StatCard } from "@/components/dashboard/stat-card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "@/lib/i18n";
import { formatNumber } from "@/lib/utils";

interface DashboardData {
  kpi: {
    totalCountries: number;
    totalStates: number;
    totalCities: number;
    usersWithLocation: number;
  };
  charts: {
    topStates: { name: string; count: number }[];
    topCities: { name: string; count: number }[];
  };
}

export default function MasterDashboardPage() {
  const { t } = useTranslation();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("this-year");

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/master-dashboard?timeRange=${timeRange}`,
        );
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [timeRange]);

  const chartConfig = {
    count: {
      label: t("master_dashboard.users"),
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">
          {t("master_dashboard.title")}
        </h1>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[160px]" aria-label="Selected time range">
            <SelectValue placeholder={t("master.this_year")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="this-year">{t("master.this_year")}</SelectItem>
            <SelectItem value="last-year">{t("master.last_year")}</SelectItem>
            <SelectItem value="all">{t("master.all_time")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          <>
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
          </>
        ) : (
          <>
            <StatCard
              title={t("master_dashboard.countries")}
              value={formatNumber(data?.kpi.totalCountries || 0)}
              icon={Globe}
              href="/address/country"
            />
            <StatCard
              title={t("master_dashboard.states")}
              value={formatNumber(data?.kpi.totalStates || 0)}
              icon={Map}
              href="/address/state"
            />
            <StatCard
              title={t("master_dashboard.cities")}
              value={formatNumber(data?.kpi.totalCities || 0)}
              icon={Building2}
              href="/address/city"
            />
            <StatCard
              title={t("master_dashboard.users_with_location")}
              value={formatNumber(data?.kpi.usersWithLocation || 0)}
              icon={MapPin}
            />
          </>
        )}
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Top States Chart */}
        <Card>
          <CardHeader>
            <CardTitle>{t("master_dashboard.top_states")}</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-[220px] w-full" />
            ) : (data?.charts.topStates?.length || 0) > 0 ? (
              <ChartContainer
                config={chartConfig}
                className="aspect-auto h-[220px] w-full"
              >
                <BarChart
                  accessibilityLayer
                  data={data?.charts.topStates}
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

        {/* Top Cities Chart */}
        <Card>
          <CardHeader>
            <CardTitle>{t("master_dashboard.top_cities")}</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-[220px] w-full" />
            ) : (data?.charts.topCities?.length || 0) > 0 ? (
              <ChartContainer
                config={chartConfig}
                className="aspect-auto h-[220px] w-full"
              >
                <BarChart
                  accessibilityLayer
                  data={data?.charts.topCities}
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
