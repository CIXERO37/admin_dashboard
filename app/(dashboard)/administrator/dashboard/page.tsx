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
import { Skeleton } from "@/components/ui/skeleton";

import { useProfiles } from "@/hooks/useProfiles";
import { Users, Shield, UserCheck, UserX } from "lucide-react";
import { isSameYear, subYears } from "date-fns";

export default function AdministratorDashboardPage() {
  const [timeRange, setTimeRange] = useState("this-year");
  const { data: profiles, loading } = useProfiles();

  const checkDate = (dateStr: string | null | undefined, range: string) => {
    if (range === "all") return true;
    if (!dateStr) return false;

    const date = new Date(dateStr);
    const now = new Date();

    if (range === "this-year") {
      return isSameYear(date, now);
    }
    if (range === "last-year") {
      return isSameYear(date, subYears(now, 1));
    }
    return true;
  };

  const filteredProfiles = profiles.filter((profile) =>
    checkDate(profile.created_at as string, timeRange)
  );

  const userCount = filteredProfiles.filter(
    (p) => !p.role || p.role.toLowerCase() === "user"
  ).length;
  const adminCount = profiles.filter(
    (p) =>
      p.role?.toLowerCase() === "admin" &&
      checkDate(p.admin_since as string, timeRange)
  ).length;
  const activeCount = filteredProfiles.filter((p) => !p.is_blocked).length;

  const blockedCount = profiles.filter(
    (p) => p.is_blocked && checkDate(p.blocked_at as string, timeRange)
  ).length;

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
            <SelectValue placeholder="This Year" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="this-year" className="rounded-lg">
              This Year
            </SelectItem>
            <SelectItem value="last-year" className="rounded-lg">
              Last Year
            </SelectItem>
            <SelectItem value="all" className="rounded-lg">
              All Time
            </SelectItem>
          </SelectContent>
        </Select>
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
              title="User"
              value={userCount}
              icon={Users}
              href="/users?role=user"
            />
            <StatCard
              title="Admin"
              value={adminCount}
              icon={Shield}
              href="/users?role=admin"
            />
            <StatCard
              title="Active"
              value={activeCount}
              icon={UserCheck}
              href="/users?status=active"
            />
            <StatCard
              title="Blocked"
              value={blockedCount}
              icon={UserX}
              href="/users?status=blocked"
            />
          </>
        )}
      </div>

      {/* Location Charts */}
      <LocationChart
        profiles={filteredProfiles}
        loading={loading}
        timeRange={timeRange}
      />

      {/* Demographic Charts */}
      <DemographicChart profiles={filteredProfiles} loading={loading} />
    </div>
  );
}
