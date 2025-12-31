"use client";

import { useEffect, useState } from "react";
import {
  FileText,
  HelpCircle,
  AlertTriangle,
  Clock,
  CheckCircle,
  Users,
} from "lucide-react";

import { StatCard } from "@/components/dashboard/stat-card";
import { useReports } from "@/hooks/useReports";
import { SupportCharts } from "@/components/dashboard/support-charts";
import { fetchQuizApprovals } from "@/app/(dashboard)/quiz-approval/actions";
import { fetchGroups } from "@/app/(dashboard)/groups/actions";
import { fetchGroupCategoryCounts } from "@/app/(dashboard)/groups/stats-actions";

export default function SupportDashboardPage() {
  const { data: reports, loading, error, stats } = useReports();
  const [approvalCount, setApprovalCount] = useState(0);
  const [groupCount, setGroupCount] = useState(0);
  const [groupStats, setGroupStats] = useState<
    { category: string; count: number }[]
  >([]);

  useEffect(() => {
    fetchQuizApprovals({ limit: 1 }).then((res) => {
      setApprovalCount(res.totalCount);
    });
    fetchGroups({ limit: 1 }).then((res) => {
      setGroupCount(res.totalCount);
    });
    fetchGroupCategoryCounts().then((res) => {
      setGroupStats(res);
    });
  }, []);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Support Dashboard
        </h1>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Reports" value={stats.total} icon={FileText} />
        <StatCard title="Pending Reports" value={stats.pending} icon={Clock} />
        <StatCard
          title="Pending Approvals"
          value={approvalCount}
          icon={HelpCircle}
        />
        <StatCard title="Groups" value={groupCount} icon={Users} />
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-3">
        <SupportCharts reports={reports} groupStats={groupStats} />
      </div>
    </div>
  );
}
