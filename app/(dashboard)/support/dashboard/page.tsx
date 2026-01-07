"use client";

import { useEffect, useState, useCallback } from "react";
import { FileText, HelpCircle, Clock, Users } from "lucide-react";
import { isSameYear, subYears } from "date-fns";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { StatCard } from "@/components/dashboard/stat-card";
import { useReports } from "@/hooks/useReports";
import { SupportCharts } from "@/components/dashboard/support-charts";
import { fetchQuizApprovals } from "@/app/(dashboard)/quiz-approval/actions";
import { fetchGroups } from "@/app/(dashboard)/groups/actions";
import { fetchGroupCategoryCounts } from "@/app/(dashboard)/groups/stats-actions";
import { Skeleton } from "@/components/ui/skeleton";

export default function SupportDashboardPage() {
  const { data: reports, loading: reportsLoading } = useReports();
  const [approvalCount, setApprovalCount] = useState(0);
  const [groupCount, setGroupCount] = useState(0);
  const [timeRange, setTimeRange] = useState<"this-year" | "last-year" | "all">(
    "this-year"
  );
  const [groupStats, setGroupStats] = useState<
    { category: string; count: number }[]
  >([]);

  // Loading states for async data
  const [isLoadingApprovals, setIsLoadingApprovals] = useState(true);
  const [isLoadingGroups, setIsLoadingGroups] = useState(true);
  const [isLoadingGroupStats, setIsLoadingGroupStats] = useState(true);

  // Filter reports client-side
  const filteredReports = reports.filter((report) => {
    if (timeRange === "all") return true;
    if (!report.created_at) return false;
    const date = new Date(report.created_at);
    const now = new Date();

    if (timeRange === "this-year") {
      return isSameYear(date, now);
    }
    if (timeRange === "last-year") {
      return isSameYear(date, subYears(now, 1));
    }
    return true;
  });

  // Re-calculate stats based on filtered reports
  const filteredStats = {
    total: filteredReports.length,
    pending: filteredReports.filter(
      (r) => r.status === "pending" || r.status === "Pending"
    ).length,
    inProgress: filteredReports.filter(
      (r) => r.status === "in_progress" || r.status === "In Progress"
    ).length,
    resolved: filteredReports.filter(
      (r) => r.status === "resolved" || r.status === "Resolved"
    ).length,
  };

  // Fetch data with proper loading states
  const fetchData = useCallback(async () => {
    // Reset data immediately when filter changes to prevent stale data
    setApprovalCount(0);
    setGroupCount(0);
    setGroupStats([]);

    // Set loading states
    setIsLoadingApprovals(true);
    setIsLoadingGroups(true);
    setIsLoadingGroupStats(true);

    // Fetch all data in parallel
    const [approvalsRes, groupsRes, groupStatsRes] = await Promise.all([
      fetchQuizApprovals({ limit: 1, timeRange }),
      fetchGroups({ limit: 1, timeRange }),
      fetchGroupCategoryCounts(timeRange),
    ]);

    // Update state after all data is fetched (prevents flickering)
    setApprovalCount(approvalsRes.totalCount);
    setIsLoadingApprovals(false);

    setGroupCount(groupsRes.totalCount);
    setIsLoadingGroups(false);

    setGroupStats(groupStatsRes);
    setIsLoadingGroupStats(false);
  }, [timeRange]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Combined loading state for charts
  const isChartsLoading = reportsLoading || isLoadingGroupStats;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">
          Support Dashboard
        </h1>
        <Select
          value={timeRange}
          onValueChange={(val: "this-year" | "last-year" | "all") =>
            setTimeRange(val)
          }
        >
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Time Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="this-year">This Year</SelectItem>
            <SelectItem value="last-year">Last Year</SelectItem>
            <SelectItem value="all">All Time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {reportsLoading || isLoadingApprovals || isLoadingGroups ? (
          <>
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
          </>
        ) : (
          <>
            <StatCard
              title="Reports"
              value={filteredReports.length}
              icon={FileText}
            />
            <StatCard
              title="Pending Reports"
              value={filteredStats.pending}
              icon={Clock}
            />
            <StatCard
              title="Pending Approvals"
              value={approvalCount}
              icon={HelpCircle}
            />
            <StatCard title="Groups" value={groupCount} icon={Users} />
          </>
        )}
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-3">
        {isChartsLoading ? (
          <>
            <Skeleton className="h-[350px] rounded-xl" />
            <Skeleton className="h-[350px] rounded-xl" />
            <Skeleton className="h-[350px] rounded-xl" />
          </>
        ) : (
          <SupportCharts reports={filteredReports} groupStats={groupStats} />
        )}
      </div>
    </div>
  );
}
