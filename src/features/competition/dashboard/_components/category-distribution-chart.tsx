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

interface CategoryChartProps {
  data: { name: string; count: number }[];
}

export function CategoryDistributionChart({ data }: CategoryChartProps) {
  const { locale } = useTranslation();

  const title = locale === "id" ? "Distribusi Kategori" : "Category Distribution";
  const desc = locale === "id" 
    ? "Jumlah kompetisi berdasarkan setiap kategori" 
    : "Number of competitions based on each category";
  const label = locale === "id" ? "Jumlah Kompetisi" : "Total Competitions";

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{desc}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            count: {
              label: label,
              color: "var(--chart-1)",
            },
          }}
          className="aspect-auto h-[300px] w-full"
        >
          <BarChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: -20 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              fontSize={12}
              tickFormatter={(value) => (value.length > 15 ? value.substring(0, 15) + "..." : value)}
            />
            <YAxis tickLine={false} axisLine={false} tickMargin={10} allowDecimals={false} fontSize={12} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar dataKey="count" fill="var(--color-count)" radius={[4, 4, 0, 0]} barSize={40} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
