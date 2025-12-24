"use client";

import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const planDistribution = [
  { name: "Enterprise", value: 1, color: "oklch(0.7 0.15 180)" },
  { name: "Business", value: 1, color: "oklch(0.65 0.18 280)" },
  { name: "Pro", value: 1, color: "oklch(0.75 0.15 80)" },
  { name: "Starter", value: 1, color: "oklch(0.6 0.2 30)" },
];

export function PlanDistributionPie() {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Plan Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={planDistribution}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {planDistribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                borderColor: "hsl(var(--border))",
                borderRadius: "var(--radius)",
                color: "hsl(var(--popover-foreground))",
              }}
              itemStyle={{ color: "hsl(var(--popover-foreground))" }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
