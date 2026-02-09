"use client";

import { GameDashboardSkeleton } from "./game-dashboard-client";

export default function Loading() {
  return (
    <div className="flex-1 p-8 pt-6">
      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Game Dashboard</h2>
        </div>
        <GameDashboardSkeleton />
      </div>
    </div>
  );
}
