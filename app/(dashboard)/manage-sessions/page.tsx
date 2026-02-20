import { fetchStaleWaitingSessions } from "./actions";
import { ManageSessionsTable } from "./manage-sessions-table";

export default async function ManageSessionsPage() {
  const { data, error } = await fetchStaleWaitingSessions();

  return (
    <ManageSessionsTable initialData={data} initialError={error} />
  );
}
