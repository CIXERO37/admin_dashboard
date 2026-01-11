"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Profile } from "@/types/supabase";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { MapPinOff } from "lucide-react";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { isSameYear, subYears } from "date-fns";
import { useTranslation } from "@/lib/i18n";

interface LocationChartProps {
  profiles: Profile[];
  loading?: boolean;
  timeRange: string;
}

// Helper specific type for profiles with joined data
interface ProfileWithLocation extends Profile {
  state?: { name: string } | null;
  city?: { name: string } | null;
  country?: { name: string } | null;
  created_at?: string | null;
}

const filterProfiles = (profiles: ProfileWithLocation[], range: string) => {
  if (!profiles) return [];
  if (range === "all") return profiles;

  const now = new Date();
  const lastYearDate = subYears(now, 1);

  return profiles.filter((profile) => {
    if (!profile.created_at) return false;
    const date = new Date(profile.created_at);

    if (range === "this-year") {
      return isSameYear(date, now);
    }
    if (range === "last-year") {
      return isSameYear(date, lastYearDate);
    }
    return true;
  });
};

export function LocationChart({
  profiles,
  loading,
  timeRange,
}: LocationChartProps) {
  const { t } = useTranslation();

  const chartConfig = {
    count: {
      label: t("stats.user"),
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig;

  const filteredData = useMemo(() => {
    return filterProfiles(profiles as ProfileWithLocation[], timeRange);
  }, [profiles, timeRange]);

  // Aggregate data for TOP STATES
  const stateCounts: Record<string, number> = {};
  // Aggregate data for TOP CITIES
  const cityCounts: Record<string, number> = {};
  // Aggregate data for TOP COUNTRIES
  const countryCounts: Record<string, number> = {};

  if (filteredData) {
    filteredData.forEach((profile) => {
      // State
      if (profile.state?.name) {
        const stateName = profile.state.name;
        stateCounts[stateName] = (stateCounts[stateName] || 0) + 1;
      }
      // City
      if (profile.city?.name) {
        const cityName = profile.city.name;
        cityCounts[cityName] = (cityCounts[cityName] || 0) + 1;
      }
      // Country
      if (profile.country?.name) {
        const countryName = profile.country.name;
        countryCounts[countryName] = (countryCounts[countryName] || 0) + 1;
      }
    });
  }

  const topStates = Object.entries(stateCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const topCities = Object.entries(cityCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const topCountries = Object.entries(countryCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="h-[400px] animate-pulse bg-muted/20" />
        <Card className="h-[400px] animate-pulse bg-muted/20" />
        <Card className="h-[400px] animate-pulse bg-muted/20" />
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {/* Top Countries Chart */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>{t("admin.top_countries")}</CardTitle>
        </CardHeader>
        <CardContent>
          {topCountries.length > 0 ? (
            <ChartContainer
              config={chartConfig}
              className="aspect-auto h-[250px] w-full"
            >
              <BarChart
                accessibilityLayer
                data={topCountries}
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
            <div className="flex h-[250px] w-full flex-col items-center justify-center gap-2 text-muted-foreground">
              <MapPinOff className="h-10 w-10 opacity-20" />
              <p className="text-sm">{t("admin.no_data_country")}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Top States Chart */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>{t("admin.top_states")}</CardTitle>
        </CardHeader>
        <CardContent>
          {topStates.length > 0 ? (
            <ChartContainer
              config={chartConfig}
              className="aspect-auto h-[250px] w-full"
            >
              <BarChart
                accessibilityLayer
                data={topStates}
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
            <div className="flex h-[250px] w-full flex-col items-center justify-center gap-2 text-muted-foreground">
              <MapPinOff className="h-10 w-10 opacity-20" />
              <p className="text-sm">{t("admin.no_data_state")}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Top Cities Chart */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>{t("admin.top_cities")}</CardTitle>
        </CardHeader>
        <CardContent>
          {topCities.length > 0 ? (
            <ChartContainer
              config={chartConfig}
              className="aspect-auto h-[250px] w-full"
            >
              <BarChart
                accessibilityLayer
                data={topCities}
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
            <div className="flex h-[250px] w-full flex-col items-center justify-center gap-2 text-muted-foreground">
              <MapPinOff className="h-10 w-10 opacity-20" />
              <p className="text-sm">{t("admin.no_data_city")}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
