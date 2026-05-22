import { getCompetitionDashboardStats } from "@/src/features/competition/dashboard/actions";
import { CompetitionDashboardClient } from "@/src/features/competition/dashboard/competition-dashboard-client";

export default async function CompetitionDashboardPage() {
  const data = await getCompetitionDashboardStats();
  
  return <CompetitionDashboardClient initialData={data} />;
}
