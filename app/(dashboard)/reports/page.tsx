"use client";

import { ReportTable } from "./report-table";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardData } from "@/contexts/dashboard-store";

export default function SupportReportPage() {
  const { reports, isLoading } = useDashboardData();

  if (isLoading && reports.length === 0) {
    return <ReportTableSkeleton />;
  }

  return <ReportTable initialData={reports} />;
}

function ReportTableSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-4 w-64 mt-2" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-36" />
          <Skeleton className="h-10 w-36" />
        </div>
      </div>
      <Skeleton className="h-[600px] w-full rounded-xl" />
    </div>
  );
}
