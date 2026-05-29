"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useTranslation } from "@/lib/i18n";

interface ParticipantsChartProps {
  data: { title: string; participants: number }[];
}

export function ParticipantsChart({ data }: ParticipantsChartProps) {
  const { locale } = useTranslation();

  const title = locale === "id" ? "Top Kompetisi" : "Top Competitions";
  const desc = locale === "id" 
    ? "Top 5 kompetisi dengan pendaftar terbanyak" 
    : "Top 5 competitions with the most registrants";
  const label = locale === "id" ? "Partisipan" : "Participants";

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{desc}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            participants: {
              label: label,
              color: "var(--chart-1)",
            },
          }}
          className="aspect-auto h-[300px] w-full"
        >
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 20, right: 20, bottom: 20, left: 10 }}
          >
            <CartesianGrid horizontal={false} />
            <XAxis type="number" hide />
            <YAxis
              dataKey="title"
              type="category"
              tickLine={false}
              axisLine={false}
              fontSize={12}
              tickFormatter={(value) => (value.length > 20 ? value.substring(0, 20) + "..." : value)}
              width={150}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey="participants" fill="var(--color-participants)" radius={[0, 4, 4, 0]} barSize={20} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
