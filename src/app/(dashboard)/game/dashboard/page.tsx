import { Suspense } from "react";
import { getGameDashboardStats } from "@/src/features/game/dashboard/actions";
import { GameDashboardSkeleton } from "@/src/features/game/dashboard/game-dashboard-client";
import { GameDashboardWrapper } from "@/src/features/game/dashboard/game-dashboard-wrapper";

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
    <div className="flex-1 p-8 pt-6">
      <Suspense fallback={<GameDashboardSkeleton />}>
        <GameDashboardWrapper initialData={stats} />
      </Suspense>
    </div>
  );
}
