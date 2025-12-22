"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Profile } from "@/types/supabase";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface LocationChartProps {
  profiles: Profile[];
  loading?: boolean;
}

// Helper specific type for profiles with joined data
interface ProfileWithLocation extends Profile {
  state?: { name: string } | null;
  city?: { name: string } | null;
}

const chartConfig = {
  count: {
    label: "Users",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function LocationChart({ profiles, loading }: LocationChartProps) {
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="h-[400px] animate-pulse bg-muted/20" />
        <Card className="h-[400px] animate-pulse bg-muted/20" />
      </div>
    );
  }

  // Aggregate data
  const stateCounts: Record<string, number> = {};
  const cityCounts: Record<string, number> = {};

  if (profiles) {
    (profiles as ProfileWithLocation[]).forEach((profile) => {
      if (profile.state?.name) {
        const stateName = profile.state.name;
        stateCounts[stateName] = (stateCounts[stateName] || 0) + 1;
      }
      if (profile.city?.name) {
        const cityName = profile.city.name;
        cityCounts[cityName] = (cityCounts[cityName] || 0) + 1;
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

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Top States</CardTitle>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top Cities</CardTitle>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>
    </div>
  );
}
