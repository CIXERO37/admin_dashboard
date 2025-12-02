"use client"
import { StatCard } from "@/components/dashboard/stat-card"
import { ActionCard } from "@/components/dashboard/action-card"
import { SectionHeader } from "@/components/dashboard/section-header"
import { useProfiles } from "@/hooks/useProfiles"
import { Users, Shield, UserCheck, UserX } from "lucide-react"

export default function AdministratorDashboardPage() {
  const { data: profiles, loading } = useProfiles()

  const userCount = profiles.filter((p) => !p.role || p.role.toLowerCase() === "user").length
  const adminCount = profiles.filter((p) => p.role?.toLowerCase() === "admin").length
  const activeCount = profiles.filter((p) => !p.is_blocked).length
  const blockedCount = profiles.filter((p) => p.is_blocked).length

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Administrator Dashboard</h1>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="User" value={loading ? 0 : userCount} icon={Users} />
        <StatCard title="Admin" value={loading ? 0 : adminCount} icon={Shield} />
        <StatCard title="Active" value={loading ? 0 : activeCount} icon={UserCheck} />
        <StatCard title="Blocked" value={loading ? 0 : blockedCount} icon={UserX} />
      </div>

      {/* Quick Access */}
      <div>
        <SectionHeader title="Admin Modules" />
        <div className="mt-4">
          <ActionCard
            title="User Management"
            description="View and manage all users"
            href="/administrator/user"
            icon={Users}
            stats={`${profiles.length} users`}
          />
        </div>
      </div>
    </div>
  )
}
