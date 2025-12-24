"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatCard } from "@/components/dashboard/stat-card";
import { LocationChart } from "@/components/dashboard/location-chart";
import { DemographicChart } from "@/components/dashboard/demographic-chart";

import { useProfiles } from "@/hooks/useProfiles";
import { Users, Shield, UserCheck, UserX } from "lucide-react";

export default function AdministratorDashboardPage() {
  const [timeRange, setTimeRange] = useState("all");
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
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">
          Administrator Dashboard
        </h1>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[130px] rounded-lg"
            aria-label="Select a value"
          >
            <SelectValue placeholder="All Time" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="all" className="rounded-lg">
              All Time
            </SelectItem>
            <SelectItem value="this-year" className="rounded-lg">
              This Year
            </SelectItem>
            <SelectItem value="last-year" className="rounded-lg">
              Last Year
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="User"
          value={loading ? 0 : userCount}
          icon={Users}
          href="/users?role=user"
        />
        <StatCard
          title="Admin"
          value={loading ? 0 : adminCount}
          icon={Shield}
          href="/users?role=admin"
        />
        <StatCard
          title="Active"
          value={loading ? 0 : activeCount}
          icon={UserCheck}
          href="/users?status=active"
        />
        <StatCard
          title="Blocked"
          value={loading ? 0 : blockedCount}
          icon={UserX}
          href="/users?status=blocked"
        />
      </div>

      {/* Location Charts */}
      <LocationChart
        profiles={profiles}
        loading={loading}
        timeRange={timeRange}
      />

      {/* Demographic Charts */}
      <DemographicChart profiles={profiles} loading={loading} />
    </div>
  );
}
