import { Skeleton } from "@/components/ui/skeleton";

export default function TrashBinLoading() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-9 w-48" />
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-64 rounded-md" />
          <Skeleton className="h-10 w-32 rounded-md" />
        </div>
      </div>

      {/* Tabs Skeleton */}
      <div className="flex gap-4 border-b border-border mb-4 pb-2">
         <Skeleton className="h-8 w-24" />
         <Skeleton className="h-8 w-24" />
         <Skeleton className="h-8 w-24" />
      </div>

      {/* Table Skeleton */}
      <div className="border border-border rounded-xl bg-card overflow-hidden">
        <div className="flex items-center h-12 bg-muted/50 px-4 border-b border-border">
          <Skeleton className="h-4 w-1/3 mr-4" />
          <Skeleton className="h-4 w-1/3 mr-4" />
          <Skeleton className="h-4 w-1/3" />
        </div>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-center h-16 px-4 border-b border-border/50">
            <Skeleton className="h-4 w-1/3 mr-4" />
            <Skeleton className="h-4 w-1/3 mr-4" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        ))}
      </div>
    </div>
  );
}
