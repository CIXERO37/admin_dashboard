import { fetchStaleWaitingSessions } from "@/src/features/manage-sessions/actions";
import { ManageSessionsTable } from "@/src/features/manage-sessions/manage-sessions-table";

export default async function ManageSessionsPage() {
  const { data, error } = await fetchStaleWaitingSessions();

  return (
    <ManageSessionsTable initialData={data} initialError={error} />
  );
}
