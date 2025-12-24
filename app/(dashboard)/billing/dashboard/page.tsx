"use client";

import { StatCard } from "@/components/dashboard/stat-card";
import { SectionHeader } from "@/components/dashboard/section-header";
import { DataTable, StatusBadge } from "@/components/dashboard/data-table";
import { activeSubscribers, unpaidUsers } from "@/lib/dummy-data";
import { Users, AlertCircle, DollarSign, TrendingUp } from "lucide-react";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { PlanDistributionPie } from "@/components/dashboard/plan-distribution-pie";

export default function BillingDashboardPage() {
  const totalRevenue = activeSubscribers.reduce((sum, user) => {
    const amount = Number.parseInt(user.amount.replace(/[^0-9]/g, ""));
    return sum + amount;
  }, 0);

  const unpaidTotal = unpaidUsers.reduce((sum, user) => {
    const amount = Number.parseInt(user.amount.replace(/[^0-9]/g, ""));
    return sum + amount;
  }, 0);

  const recentSubscribersColumns = [
    { key: "name", label: "Company" },
    { key: "plan", label: "Plan" },
    { key: "amount", label: "Amount" },
    {
      key: "status",
      label: "Status",
      render: (value: unknown) => <StatusBadge status={value as string} />,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Billing Dashboard
        </h1>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Subscribers"
          value={activeSubscribers.length}
          change="+2 this week"
          changeType="increase"
          icon={Users}
        />
        <StatCard
          title="Monthly Revenue"
          value={`$${totalRevenue}/mo`}
          change="+12%"
          changeType="increase"
          icon={DollarSign}
        />
        <StatCard
          title="Unpaid Invoices"
          value={unpaidUsers.length}
          change={`$${unpaidTotal} pending`}
          changeType="decrease"
          icon={AlertCircle}
        />
        <StatCard
          title="MRR Growth"
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
          title="Recent Transactions"
          description="Latest subscription payments and invoices"
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
