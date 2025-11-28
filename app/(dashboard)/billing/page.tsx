"use client"

import { StatCard } from "@/components/dashboard/stat-card"
import { ActionCard } from "@/components/dashboard/action-card"
import { SectionHeader } from "@/components/dashboard/section-header"
import { DataTable, StatusBadge } from "@/components/dashboard/data-table"
import { activeSubscribers, unpaidUsers } from "@/lib/dummy-data"
import { Users, AlertCircle, DollarSign, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

export default function BillingDashboardPage() {
  const totalRevenue = activeSubscribers.reduce((sum, user) => {
    const amount = Number.parseInt(user.amount.replace(/[^0-9]/g, ""))
    return sum + amount
  }, 0)

  const unpaidTotal = unpaidUsers.reduce((sum, user) => {
    const amount = Number.parseInt(user.amount.replace(/[^0-9]/g, ""))
    return sum + amount
  }, 0)

  const planDistribution = [
    { name: "Enterprise", value: 1, color: "oklch(0.7 0.15 180)" },
    { name: "Business", value: 1, color: "oklch(0.65 0.18 280)" },
    { name: "Pro", value: 1, color: "oklch(0.75 0.15 80)" },
    { name: "Starter", value: 1, color: "oklch(0.6 0.2 30)" },
  ]

  const recentSubscribersColumns = [
    { key: "name", label: "Company" },
    { key: "plan", label: "Plan" },
    { key: "amount", label: "Amount" },
    {
      key: "status",
      label: "Status",
      render: (value: unknown) => <StatusBadge status={value as string} />,
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Billing Dashboard</h1>
        <p className="mt-1 text-muted-foreground">Overview of subscriptions and payments</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Subscribers"
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
        <StatCard title="MRR Growth" value="+15.3%" change="vs last month" changeType="increase" icon={TrendingUp} />
      </div>

      {/* Charts and Quick Access */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Plan Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
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
                    backgroundColor: "oklch(0.17 0.01 260)",
                    border: "1px solid oklch(0.28 0.01 260)",
                    borderRadius: "8px",
                    color: "oklch(0.95 0 0)",
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <SectionHeader title="Billing Modules" />
          <ActionCard
            title="Active Subscribers"
            description="View all active paying customers"
            href="/billing/active"
            icon={Users}
            stats={`${activeSubscribers.length} active`}
          />
          <ActionCard
            title="Unpaid Invoices"
            description="Manage overdue payments"
            href="/billing/unpaid"
            icon={AlertCircle}
            stats={`${unpaidUsers.length} unpaid`}
          />
        </div>
      </div>

      {/* Recent Subscribers */}
      <div>
        <SectionHeader title="Recent Subscribers" description="Latest active subscriptions" />
        <div className="mt-4">
          <DataTable
            columns={recentSubscribersColumns}
            data={activeSubscribers as unknown as Record<string, unknown>[]}
          />
        </div>
      </div>
    </div>
  )
}
