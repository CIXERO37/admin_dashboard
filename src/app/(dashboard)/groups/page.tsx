"use client";

import { GroupTable } from "@/src/features/groups/group-table";
import { Skeleton } from "@/src/components/ui/skeleton";
import { useDashboardData } from "@/contexts/dashboard-store";
import { useEffect, useState } from "react";
import { fetchCountries, fetchGroupCategories } from "@/src/features/groups/actions";
import { type Country } from "@/src/features/groups/types/group";
function GroupTableSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-9 w-32" />
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-64 rounded-md" />
          <Skeleton className="h-10 w-10 rounded-md" />
        </div>
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <Skeleton className="h-36 w-full rounded-none" />
            <div className="flex-1 p-4 pt-3">
               <Skeleton className="h-3 w-20 mb-3" />
               <div className="flex items-center gap-2">
                 <Skeleton className="h-8 w-8 rounded-full" />
                 <div className="space-y-1.5">
                   <Skeleton className="h-4 w-28" />
                   <Skeleton className="h-3 w-16" />
                 </div>
               </div>
            </div>
            <div className="px-4 py-3 border-t border-border/50 bg-muted/30">
               <div className="flex justify-between mb-3">
                 <Skeleton className="h-4 w-24" />
                 <Skeleton className="h-4 w-20" />
               </div>
               <Skeleton className="h-9 w-full rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function GroupsPage() {
  const { groups, isLoading } = useDashboardData();
  const [countries, setCountries] = useState<Country[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    // Fetch auxiliary filter data
    const loadFilters = async () => {
      const [c, cat] = await Promise.all([
        fetchCountries(),
        fetchGroupCategories(),
      ]);
      setCountries(c);
      setCategories(cat);
    };
    loadFilters();
  }, []);

  if (isLoading && groups.length === 0) {
    return <GroupTableSkeleton />;
  }

  return (
    <GroupTable
      initialData={groups}
      countries={countries}
      categories={categories}
    />
  );
}
