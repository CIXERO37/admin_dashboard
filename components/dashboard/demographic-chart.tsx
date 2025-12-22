"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Profile } from "@/types/supabase";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface DemographicChartProps {
  profiles: Profile[];
  loading?: boolean;
}

// Extend Profile to include gender and grade
interface ProfileWithDemographics extends Profile {
  gender?: string | null;
  grade?: string | null;
}

const genderConfig = {
  male: {
    label: "Male",
    color: "var(--chart-1)",
  },
  female: {
    label: "Female",
    color: "var(--chart-2)",
  },
  other: {
    label: "Other",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

const gradeConfig = {
  count: {
    label: "Students",
  },
  // We will dynamically assign colors for grades if needed, or use a palette
  "grade-1": { label: "1", color: "var(--chart-1)" },
  "grade-2": { label: "2", color: "var(--chart-2)" },
  "grade-3": { label: "3", color: "var(--chart-3)" },
  "grade-4": { label: "4", color: "var(--chart-4)" },
  "grade-5": { label: "5", color: "var(--chart-5)" },
} satisfies ChartConfig; // Simplified config, will map dynamically in render if needed

const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

export function DemographicChart({ profiles, loading }: DemographicChartProps) {
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="h-[300px] animate-pulse bg-muted/20" />
        <Card className="h-[300px] animate-pulse bg-muted/20" />
      </div>
    );
  }

  // Aggregate Gender
  const genderCounts: Record<string, number> = {};
  // Aggregate Grade
  const gradeCounts: Record<string, number> = {};

  if (profiles) {
    (profiles as ProfileWithDemographics[]).forEach((profile) => {
      // Gender
      const gender = profile.gender || "Unknown";
      genderCounts[gender] = (genderCounts[gender] || 0) + 1;

      // Grade
      const grade = profile.grade || "Unknown";
      gradeCounts[grade] = (gradeCounts[grade] || 0) + 1;
    });
  }

  const genderData = Object.entries(genderCounts).map(
    ([name, value], index) => ({
      name,
      value,
      fill: COLORS[index % COLORS.length],
    })
  );

  const gradeData = Object.entries(gradeCounts).map(([name, value], index) => ({
    name,
    value,
    fill: COLORS[index % COLORS.length], // Rotate colors
  }));

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Gender Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Gender</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={genderConfig}
            className="mx-auto aspect-square max-h-[250px] w-full"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel nameKey="name" />}
              />
              <Pie
                data={genderData}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                strokeWidth={5}
              >
                {genderData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
          <div className="mt-4 flex flex-wrap justify-center gap-4">
            {genderData.map((entry, index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: entry.fill }}
                />
                <span className="text-sm text-muted-foreground">
                  {entry.name}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Grade Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Grade</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={gradeConfig}
            className="mx-auto aspect-square max-h-[250px] w-full"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel nameKey="name" />}
              />
              <Pie
                data={gradeData}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                strokeWidth={5}
              >
                {gradeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
          <div className="mt-4 flex flex-wrap justify-center gap-4">
            {gradeData.map((entry, index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: entry.fill }}
                />
                <span className="text-sm text-muted-foreground">
                  {entry.name}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
