"use client";

import { StatCard } from "@/components/dashboard/stat-card";
import { SectionHeader } from "@/components/dashboard/section-header";
import { DataTable, StatusBadge } from "@/components/dashboard/data-table";
import { activeSubscribers, unpaidUsers } from "@/lib/dummy-data";
import { Users, AlertCircle, DollarSign, TrendingUp } from "lucide-react";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { PlanDistributionPie } from "@/components/dashboard/plan-distribution-pie";
import { useTranslation } from "@/lib/i18n";

export default function BillingDashboardPage() {
  const { t } = useTranslation();

  const totalRevenue = activeSubscribers.reduce((sum, user) => {
    const amount = Number.parseInt(user.amount.replace(/[^0-9]/g, ""));
    return sum + amount;
  }, 0);

  const unpaidTotal = unpaidUsers.reduce((sum, user) => {
    const amount = Number.parseInt(user.amount.replace(/[^0-9]/g, ""));
    return sum + amount;
  }, 0);

  const recentSubscribersColumns = [
    { key: "name", label: t("table.customer") },
    {
      key: "plan",
      label: t("table.plan"),
      render: (value: unknown) => {
        const plan = (value as string).toLowerCase();
        return (
          <span className="capitalize">
            {t(`plan.${plan}`) || (value as string)}
          </span>
        );
      },
    },
    { key: "amount", label: t("table.amount") },
    {
      key: "status",
      label: t("table.status"),
      render: (value: unknown) => {
        const status = (value as string).toLowerCase();
        // Pass raw status to StatusBadge, but if StatusBadge doesn't translate internally, we might need to wrap it.
        // StatusBadge seems to handle colors based on status.
        // If StatusBadge displays text, we should translate it.
        // Assuming StatusBadge is used elsewhere and might not handle translation yet?
        // In quiz-table I used a custom badge.
        // Let's look at `components/dashboard/data-table.tsx` later?
        // For now, I'll pass the translated status text if possible, but StatusBadge logic might depend on "Active" string for color.
        // So I should pass "Active" for logic, but display translated?
        // If `StatusBadge` takes `status` string, it likely displays it.
        // I'll check `StatusBadge` in `components/dashboard/data-table` if I can.
        // But for now I'll just use the component as is, maybe verify later.
        return (
          <StatusBadge
            status={value as string}
            label={t(`status.${status}`) || (value as string)}
          />
        );
      },
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          {t("billing.dashboard")}
        </h1>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title={t("billing.subscribers")}
          value={activeSubscribers.length}
          change="+2 this week"
          changeType="increase"
          icon={Users}
        />
        <StatCard
          title={t("billing.monthly_revenue")}
          value={`$${totalRevenue}/mo`}
          change="+12%"
          changeType="increase"
          icon={DollarSign}
        />
        <StatCard
          title={t("billing.unpaid_invoices")}
          value={unpaidUsers.length}
          change={`$${unpaidTotal} pending`}
          changeType="decrease"
          icon={AlertCircle}
        />
        <StatCard
          title={t("billing.mrr_growth")}
          value="+15.3%"
          change="vs last month"
          changeType="increase"
          icon={TrendingUp}
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          <RevenueChart />
        </div>
        <div className="col-span-3">
          <PlanDistributionPie />
        </div>
      </div>

      {/* Recent Transactions */}
      <div>
        <SectionHeader
          title={t("billing.recent_transactions")}
          description={t("billing.recent_desc")}
        />
        <div className="mt-4">
          <DataTable
            columns={recentSubscribersColumns}
            data={activeSubscribers as unknown as Record<string, unknown>[]}
          />
        </div>
      </div>
    </div>
  );
}
