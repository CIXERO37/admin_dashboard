"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Profile } from "@/types/supabase";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { UserX } from "lucide-react";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useTranslation } from "@/lib/i18n";
import { Skeleton } from "@/components/ui/skeleton";

interface DemographicChartProps {
  profiles: Profile[];
  loading?: boolean;
}

// Extend Profile to include gender and grade
interface ProfileWithDemographics extends Profile {
  gender?: string | null;
  grade?: string | null;
  birthdate?: string | null;
}

const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

export function DemographicChart({ profiles, loading }: DemographicChartProps) {
  const { t } = useTranslation();

  const genderConfig = {
    male: {
      label: t("admin.male"),
      color: "var(--chart-1)",
    },
    female: {
      label: t("admin.female"),
      color: "var(--chart-2)",
    },
    other: {
      label: t("admin.other"),
      color: "var(--chart-3)",
    },
  } satisfies ChartConfig;

  const gradeConfig = {
    count: {
      label: t("admin.students"),
    },
    // We will dynamically assign colors for grades if needed, or use a palette
    "grade-1": { label: "1", color: "var(--chart-1)" },
    "grade-2": { label: "2", color: "var(--chart-2)" },
    "grade-3": { label: "3", color: "var(--chart-3)" },
    "grade-4": { label: "4", color: "var(--chart-4)" },
    "grade-5": { label: "5", color: "var(--chart-5)" },
  } satisfies ChartConfig;

  const ageConfig = {
    count: { label: t("admin.chart_age") },
    "0-12": { label: "0-12", color: "var(--chart-1)" },
    "13-18": { label: "13-18", color: "var(--chart-2)" },
    "19-24": { label: "19-24", color: "var(--chart-3)" },
    "25-40": { label: "25-40", color: "var(--chart-4)" },
    "41-60": { label: "41-60", color: "var(--chart-5)" },
    "61+": { label: "61+", color: "var(--chart-1)" }, // Reuse color 1
    Unknown: { label: t("admin.unknown"), color: "var(--muted)" },
  } satisfies ChartConfig;

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {/* Age Chart Skeleton */}
        <Card>
          <CardHeader>
            <CardTitle>{t("admin.chart_age")}</CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="mx-auto aspect-square max-h-[250px] w-full rounded-full" />
          </CardContent>
        </Card>

        {/* Gender Chart Skeleton */}
        <Card>
          <CardHeader>
            <CardTitle>{t("admin.chart_gender")}</CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="mx-auto aspect-square max-h-[250px] w-full rounded-full" />
          </CardContent>
        </Card>

        {/* Education Chart Skeleton */}
        <Card>
          <CardHeader>
            <CardTitle>{t("admin.chart_education")}</CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="mx-auto aspect-square max-h-[250px] w-full rounded-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Aggregate Gender
  const genderCounts: Record<string, number> = {};
  // Aggregate Grade (Education)
  const gradeCounts: Record<string, number> = {};
  // Aggregate Age
  const ageCounts: Record<string, number> = {};

  if (profiles) {
    (profiles as ProfileWithDemographics[]).forEach((profile) => {
      // Gender
      const gender = profile.gender || "Unknown";
      genderCounts[gender] = (genderCounts[gender] || 0) + 1;

      // Grade (Education)
      const grade = profile.grade || "Unknown";
      gradeCounts[grade] = (gradeCounts[grade] || 0) + 1;

      // Age
      let ageGroup = "Unknown";
      if (profile.birthdate) {
        const dob = new Date(profile.birthdate);
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const m = today.getMonth() - dob.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
          age--;
        }

        if (age >= 0 && age <= 12) ageGroup = "0-12";
        else if (age >= 13 && age <= 18) ageGroup = "13-18";
        else if (age >= 19 && age <= 24) ageGroup = "19-24";
        else if (age >= 25 && age <= 40) ageGroup = "25-40";
        else if (age >= 41 && age <= 60) ageGroup = "41-60";
        else if (age >= 61) ageGroup = "61+";
      }
      ageCounts[ageGroup] = (ageCounts[ageGroup] || 0) + 1;
    });
  }

  const genderData = Object.entries(genderCounts).map(
    ([name, value], index) => {
      // Translate gender names if they match keys
      let displayName = name;
      if (name.toLowerCase() === "male") displayName = t("admin.male");
      else if (name.toLowerCase() === "female") displayName = t("admin.female");
      else if (name.toLowerCase() === "other") displayName = t("admin.other");
      else if (name === "Unknown") displayName = t("admin.unknown");
      else displayName = name.charAt(0).toUpperCase() + name.slice(1);

      return {
        name: displayName,
        value,
        fill: COLORS[index % COLORS.length],
      };
    },
  );

  const gradeData = Object.entries(gradeCounts).map(([name, value], index) => ({
    name:
      name === "Unknown"
        ? t("admin.unknown")
        : name.charAt(0).toUpperCase() + name.slice(1),
    value,
    fill: COLORS[index % COLORS.length],
  }));

  const ageData = Object.entries(ageCounts)
    // Sort age groups: Unknown first, then alphanumeric
    .sort((a, b) => {
      if (a[0] === "Unknown") return -1;
      if (b[0] === "Unknown") return 1;
      return a[0].localeCompare(b[0]);
    })
    .map(([name, value], index) => ({
      name: name === "Unknown" ? t("admin.unknown") : name,
      value,
      fill: COLORS[index % COLORS.length],
    }));

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {/* Age Chart */}
      <Card>
        <CardHeader>
          <CardTitle>{t("admin.chart_age")}</CardTitle>
        </CardHeader>
        <CardContent>
          {ageData.length > 0 ? (
            <>
              <ChartContainer
                config={ageConfig}
                className="mx-auto aspect-square max-h-[250px] w-full"
              >
                <PieChart>
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel nameKey="name" />}
                  />
                  <Pie
                    data={ageData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60}
                    strokeWidth={5}
                  >
                    {ageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
              <div className="mt-4 flex flex-wrap justify-center gap-4">
                {ageData.map((entry, index) => (
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
            </>
          ) : (
            <div className="flex h-[250px] w-full flex-col items-center justify-center gap-2 text-muted-foreground">
              <UserX className="h-10 w-10 opacity-20" />
              <p className="text-sm">{t("admin.no_data_age")}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Gender Chart */}
      <Card>
        <CardHeader>
          <CardTitle>{t("admin.chart_gender")}</CardTitle>
        </CardHeader>
        <CardContent>
          {genderData.length > 0 ? (
            <>
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
            </>
          ) : (
            <div className="flex h-[250px] w-full flex-col items-center justify-center gap-2 text-muted-foreground">
              <UserX className="h-10 w-10 opacity-20" />
              <p className="text-sm">{t("admin.no_data_gender")}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Education Chart */}
      <Card>
        <CardHeader>
          <CardTitle>{t("admin.chart_education")}</CardTitle>
        </CardHeader>
        <CardContent>
          {gradeData.length > 0 ? (
            <>
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
            </>
          ) : (
            <div className="flex h-[250px] w-full flex-col items-center justify-center gap-2 text-muted-foreground">
              <UserX className="h-10 w-10 opacity-20" />
              <p className="text-sm">{t("admin.no_data_education")}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
