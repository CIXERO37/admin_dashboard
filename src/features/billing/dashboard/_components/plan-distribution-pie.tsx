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

import { useTranslation } from "@/lib/i18n";

const rawPlanDistribution = [
  { key: "enterprise", value: 1, color: "oklch(0.7 0.15 180)" },
  { key: "business", value: 1, color: "oklch(0.65 0.18 280)" },
  { key: "pro", value: 1, color: "oklch(0.75 0.15 80)" },
  { key: "starter", value: 1, color: "oklch(0.6 0.2 30)" },
];

export function PlanDistributionPie() {
  const { t } = useTranslation();

  const planDistribution = rawPlanDistribution.map((item) => ({
    ...item,
    name: t(`plan.${item.key}`),
  }));

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>{t("billing.plan_distribution")}</CardTitle>
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
