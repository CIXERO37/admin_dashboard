import { getGameDashboardStats } from './src/features/game/dashboard/actions';
async function main() {
  const data = await getGameDashboardStats("this-year");
  console.log(JSON.stringify(data?.charts.apps, null, 2));
}
main();
