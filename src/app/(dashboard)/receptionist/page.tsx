import { fetchCompetitions } from "@/src/features/receptionist/actions";
import { ReceptionistTable } from "@/src/features/receptionist/receptionist-table";

export default async function ReceptionistPage() {
  const { data, error } = await fetchCompetitions();

  return <ReceptionistTable initialData={data} initialError={error} />;
}
