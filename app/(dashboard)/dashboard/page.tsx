"use client"

import { StatCard } from "@/components/dashboard/stat-card"
import { ActionCard } from "@/components/dashboard/action-card"
import { SectionHeader } from "@/components/dashboard/section-header"
import { DataTable } from "@/components/dashboard/data-table"
import { globalStats, recentActivity, revenueData } from "@/lib/dummy-data"
import { Users, DollarSign, CreditCard, AlertTriangle, Headphones, Database, Settings } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

export default function GlobalDashboardPage() {
  const activityColumns = [
    { key: "action", label: "Action" },
    { key: "user", label: "User" },
    { key: "time", label: "Time" },
    {
      key: "type",
      label: "Type",
      render: (value: unknown) => {
        const typeColors: Record<string, string> = {
          billing: "text-[var(--success)]",
          support: "text-[var(--warning)]",
          content: "text-primary",
          user: "text-chart-2",
        }
        return <span className={`capitalize font-medium ${typeColors[value as string] || ""}`}>{value as string}</span>
      },
    },
  ]

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Global Dashboard</h1>
        <p className="mt-1 text-muted-foreground">Overview of your entire SaaS platform</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={globalStats.totalUsers.toLocaleString("en-US")}
          change="+12.5%"
          changeType="increase"
          description="from last month"
          icon={Users}
        />
        <StatCard
          title="Active Subscribers"
          value={globalStats.activeSubscribers.toLocaleString("en-US")}
          change="+8.2%"
          changeType="increase"
          description="from last month"
          icon={CreditCard}
        />
        <StatCard
          title="Monthly Revenue"
          value={`$${globalStats.monthlyRevenue.toLocaleString("en-US")}`}
          change="+15.3%"
          changeType="increase"
          description="from last month"
          icon={DollarSign}
        />
        <StatCard
          title="Pending Reports"
          value={globalStats.pendingReports}
          change="-3"
          changeType="decrease"
          description="from yesterday"
          icon={AlertTriangle}
        />
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="oklch(0.7 0.15 180)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="oklch(0.7 0.15 180)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.28 0.01 260)" />
                <XAxis dataKey="month" stroke="oklch(0.65 0 0)" />
                <YAxis stroke="oklch(0.65 0 0)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "oklch(0.17 0.01 260)",
                    border: "1px solid oklch(0.28 0.01 260)",
                    borderRadius: "8px",
                    color: "oklch(0.95 0 0)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="oklch(0.7 0.15 180)"
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">User Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.28 0.01 260)" />
                <XAxis dataKey="month" stroke="oklch(0.65 0 0)" />
                <YAxis stroke="oklch(0.65 0 0)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "oklch(0.17 0.01 260)",
                    border: "1px solid oklch(0.28 0.01 260)",
                    borderRadius: "8px",
                    color: "oklch(0.95 0 0)",
                  }}
                />
                <Bar dataKey="users" fill="oklch(0.65 0.18 280)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Quick Access Cards */}
      <div>
        <SectionHeader title="Quick Access" description="Navigate to different modules" />
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ActionCard
            title="Support Center"
            description="Manage user reports and quiz issues"
            href="/support"
            icon={Headphones}
            stats={`${globalStats.pendingReports} pending`}
          />
          <ActionCard
            title="Billing"
            description="View subscriptions and payments"
            href="/billing"
            icon={CreditCard}
            stats={`${globalStats.activeSubscribers.toLocaleString("en-US")} active`}
          />
          <ActionCard
            title="Master Data"
            description="Manage quizzes, countries, and provinces"
            href="/master"
            icon={Database}
            stats={`${globalStats.totalQuizzes} quizzes`}
          />
          <ActionCard title="Settings" description="Configure system preferences" href="/settings" icon={Settings} />
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <SectionHeader title="Recent Activity" description="Latest actions across the platform" />
        <div className="mt-4">
          <DataTable columns={activityColumns} data={recentActivity as unknown as Record<string, unknown>[]} />
        </div>
      </div>
    </div>
  )
}
