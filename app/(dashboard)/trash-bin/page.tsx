import { Suspense } from "react";
import { Trash2 } from "lucide-react";
import { TrashBinTabs } from "./trash-bin-tabs";
import {
  fetchDeletedQuizzes,
  fetchDeletedUsers,
  fetchDeletedGroups,
} from "./actions";

export const dynamic = "force-dynamic";

export default async function TrashBinPage() {
  const [quizzes, users, groups] = await Promise.all([
    fetchDeletedQuizzes(),
    fetchDeletedUsers(),
    fetchDeletedGroups(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
            <Trash2 className="h-5 w-5 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Trash Bin</h1>
        </div>
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <TrashBinTabs
          initialQuizzes={quizzes}
          initialUsers={users}
          initialGroups={groups}
        />
      </Suspense>
    </div>
  );
}
