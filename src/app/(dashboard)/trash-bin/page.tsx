import { Suspense } from "react";

import { TrashBinTabs } from "@/src/features/trash-bin/trash-bin-tabs";
import {
  fetchDeletedQuizzes,
  fetchDeletedUsers,
  fetchDeletedGroups,
} from "@/src/features/trash-bin/actions";

export const dynamic = "force-dynamic";

export default async function TrashBinPage() {
  const [quizzes, users, groups] = await Promise.all([
    fetchDeletedQuizzes(),
    fetchDeletedUsers(),
    fetchDeletedGroups(),
  ]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TrashBinTabs
        initialQuizzes={quizzes}
        initialUsers={users}
        initialGroups={groups}
      />
    </Suspense>
  );
}
