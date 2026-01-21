import { Suspense } from "react";
import { getGameDashboardStats } from "./actions";
import {
  GameDashboardClient,
  GameDashboardSkeleton,
} from "./game-dashboard-client";
import { DashboardFilter } from "./dashboard-filter";

export const metadata = {
  title: "Game Dashboard",
  description: "Overview of game sessions statistics",
};

export default async function GameDashboardPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const range =
    typeof searchParams.timeRange === "string"
      ? searchParams.timeRange
      : "this-year";

  const stats = await getGameDashboardStats(range);

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Game Dashboard</h2>
        <DashboardFilter />
      </div>
      <Suspense fallback={<GameDashboardSkeleton />}>
        <GameDashboardClient data={stats} />
      </Suspense>
    </div>
  );
}
