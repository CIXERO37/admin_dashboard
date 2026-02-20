export default function CompetitionDashboardPage() {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Competition Dashboard</h2>
      </div>
      <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm min-h-[400px]">
        <div className="flex flex-col items-center gap-1 text-center">
          <h3 className="text-2xl font-bold tracking-tight">
            Coming Soon
          </h3>
          <p className="text-sm text-muted-foreground">
            This dashboard is under construction.
          </p>
        </div>
      </div>
    </div>
  )
}
