import { Skeleton } from "@/components/ui/skeleton";

export default function ManageSessionsLoading() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-9 w-48" />
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-64 rounded-md" />
          <Skeleton className="h-10 w-10 rounded-md" />
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="border border-border rounded-xl bg-card overflow-hidden">
        <div className="flex items-center h-12 bg-muted/50 px-4 border-b border-border">
          <Skeleton className="h-4 w-1/4 mr-4" />
          <Skeleton className="h-4 w-1/4 mr-4" />
          <Skeleton className="h-4 w-1/4 mr-4" />
          <Skeleton className="h-4 w-1/4" />
        </div>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-center h-16 px-4 border-b border-border/50">
            <Skeleton className="h-4 w-1/4 mr-4" />
            <Skeleton className="h-4 w-1/4 mr-4" />
            <Skeleton className="h-4 w-1/4 mr-4" />
            <Skeleton className="h-4 w-1/4" />
          </div>
        ))}
        <div className="flex items-center justify-between h-14 px-4 bg-muted/20">
          <Skeleton className="h-4 w-24" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
          </div>
        </div>
      </div>
    </div>
  );
}
