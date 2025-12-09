"use client";

import { StatCard } from "@/components/dashboard/stat-card";
import { ActionCard } from "@/components/dashboard/action-card";
import { SectionHeader } from "@/components/dashboard/section-header";
import { DataTable } from "@/components/dashboard/data-table";
import { revenueData } from "@/lib/dummy-data";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import {
  Users,
  ShieldCheck,
  FileQuestion,
  AlertTriangle,
  Headphones,
  Database,
  Settings,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

export default function GlobalDashboardPage() {
  const { stats, recentActivity, userGrowthData, loading } =
    useDashboardStats();

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
        };
        return (
          <span
            className={`capitalize font-medium ${
              typeColors[value as string] || ""
            }`}
          >
            {value as string}
          </span>
        );
      },
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Global Dashboard</h1>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          <>
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
          </>
        ) : (
          <>
            <StatCard
              title="Users"
              value={stats.totalUsers.toLocaleString("id-ID")}
              icon={Users}
            />
            <StatCard
              title="Admins"
              value={stats.totalAdmins.toLocaleString("id-ID")}
              icon={ShieldCheck}
            />
            <StatCard
              title="Quizzes"
              value={stats.totalQuizzes.toLocaleString("id-ID")}
              icon={FileQuestion}
            />
            <StatCard
              title="Reports"
              value={stats.pendingReports.toLocaleString("id-ID")}
              description="pending"
              icon={AlertTriangle}
            />
          </>
        )}
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
                    <stop
                      offset="5%"
                      stopColor="oklch(0.7 0.15 180)"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="oklch(0.7 0.15 180)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="oklch(0.28 0.01 260)"
                />
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
            <CardTitle className="text-foreground">User Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={userGrowthData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="oklch(0.28 0.01 260)"
                  />
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
                  <Bar
                    dataKey="users"
                    fill="oklch(0.65 0.18 280)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Access Cards */}
      <div>
        <SectionHeader
          title="Quick Access"
          description="Navigate to different modules"
        />
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ActionCard
            title="Support Center"
            description="Manage user reports and quiz issues"
            href="/support"
            icon={Headphones}
            stats={loading ? "..." : `${stats.pendingReports} pending`}
          />
          <ActionCard
            title="Users"
            description="Manage users and admins"
            href="/administrator/user"
            icon={Users}
            stats={
              loading
                ? "..."
                : `${stats.totalUsers.toLocaleString("id-ID")} users`
            }
          />
          <ActionCard
            title="Master Data"
            description="Manage quizzes, countries, and provinces"
            href="/master"
            icon={Database}
            stats={
              loading
                ? "..."
                : `${stats.totalQuizzes.toLocaleString("id-ID")} quizzes`
            }
          />
          <ActionCard
            title="Settings"
            description="Configure system preferences"
            href="/settings"
            icon={Settings}
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <SectionHeader
          title="Recent Activity"
          description="Latest actions across the platform"
        />
        <div className="mt-4">
          {loading ? (
            <Skeleton className="h-48 w-full rounded-xl" />
          ) : (
            <DataTable
              columns={activityColumns}
              data={recentActivity as unknown as Record<string, unknown>[]}
            />
          )}
        </div>
      </div>
    </div>
  );
}
