"use client"
import { StatCard } from "@/components/dashboard/stat-card"
import { ActionCard } from "@/components/dashboard/action-card"
import { SectionHeader } from "@/components/dashboard/section-header"
import { DataTable, StatusBadge } from "@/components/dashboard/data-table"
import { adminUsers } from "@/lib/dummy-data"
import { Users, Shield, UserCheck, UserX } from "lucide-react"

export default function AdministratorDashboardPage() {
  const activeAdmins = adminUsers.filter((a) => a.status === "Active").length
  const inactiveAdmins = adminUsers.filter((a) => a.status === "Inactive").length

  const roleStats = adminUsers.reduce(
    (acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const recentAdminsColumns = [
    { key: "name", label: "Name" },
    { key: "role", label: "Role" },
    { key: "lastLogin", label: "Last Login" },
    {
      key: "status",
      label: "Status",
      render: (value: unknown) => <StatusBadge status={value as string} />,
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Administrator Dashboard</h1>
        <p className="mt-1 text-muted-foreground">Manage admin users and permissions</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Admins" value={adminUsers.length} icon={Users} />
        <StatCard
          title="Active Admins"
          value={activeAdmins}
          change="Online now"
          changeType="increase"
          icon={UserCheck}
        />
        <StatCard title="Inactive Admins" value={inactiveAdmins} change="Offline" changeType="neutral" icon={UserX} />
        <StatCard
          title="Super Admins"
          value={roleStats["Super Admin"] || 0}
          change="Full access"
          changeType="neutral"
          icon={Shield}
        />
      </div>

      {/* Quick Access */}
      <div>
        <SectionHeader title="Admin Modules" />
        <div className="mt-4">
          <ActionCard
            title="User Management"
            description="View and manage all admin users"
            href="/administrator/user"
            icon={Users}
            stats={`${adminUsers.length} admins`}
          />
        </div>
      </div>

      {/* Admin Table */}
      <div>
        <SectionHeader title="Admin Users" description="All administrator accounts" />
        <div className="mt-4">
          <DataTable columns={recentAdminsColumns} data={adminUsers as unknown as Record<string, unknown>[]} />
        </div>
      </div>
    </div>
  )
}
