"use client";
import { StatCard } from "@/components/dashboard/stat-card";
import { LocationChart } from "@/components/dashboard/location-chart";
import { DemographicChart } from "@/components/dashboard/demographic-chart";

import { useProfiles } from "@/hooks/useProfiles";
import { Users, Shield, UserCheck, UserX } from "lucide-react";

export default function AdministratorDashboardPage() {
  const { data: profiles, loading } = useProfiles();

  const userCount = profiles.filter(
    (p) => !p.role || p.role.toLowerCase() === "user"
  ).length;
  const adminCount = profiles.filter(
    (p) => p.role?.toLowerCase() === "admin"
  ).length;
  const activeCount = profiles.filter((p) => !p.is_blocked).length;
  const blockedCount = profiles.filter((p) => p.is_blocked).length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Administrator Dashboard
        </h1>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="User"
          value={loading ? 0 : userCount}
          icon={Users}
          href="/administrator/user?role=user"
        />
        <StatCard
          title="Admin"
          value={loading ? 0 : adminCount}
          icon={Shield}
          href="/administrator/user?role=admin"
        />
        <StatCard
          title="Active"
          value={loading ? 0 : activeCount}
          icon={UserCheck}
          href="/administrator/user?status=active"
        />
        <StatCard
          title="Blocked"
          value={loading ? 0 : blockedCount}
          icon={UserX}
          href="/administrator/user?status=blocked"
        />
      </div>

      {/* Location Charts */}
      <LocationChart profiles={profiles} loading={loading} />

      {/* Demographic Charts */}
      <DemographicChart profiles={profiles} loading={loading} />
    </div>
  );
}
