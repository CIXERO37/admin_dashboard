"use client";

import { BookOpen, Globe, Layers, Lock } from "lucide-react";

import { StatCard } from "@/components/dashboard/stat-card";
import { ActionCard } from "@/components/dashboard/action-card";
import { SectionHeader } from "@/components/dashboard/section-header";
import { useQuizzes } from "@/hooks/useQuizzes";
import { useProfiles } from "@/hooks/useProfiles";
import { useGameStats } from "@/hooks/useGameStats";
import { MasterStatsCharts } from "@/components/dashboard/master-stats-charts";

export default function MasterDashboardPage() {
  const { data: quizzes } = useQuizzes();
  const { data: profiles, aggregates } = useProfiles();
  const { sessionCounts } = useGameStats();

  const activeQuizzes = quizzes.filter((quiz) => !(quiz.is_hidden ?? false));
  const hiddenQuizzes = quizzes.length - activeQuizzes.length;
  const categoriesCount = new Set(
    quizzes.map((q) => q.category).filter(Boolean)
  ).size;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Master Data Dashboard
        </h1>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Quizzes" value={quizzes.length} icon={BookOpen} />
        <StatCard title="Categories" value={categoriesCount} icon={Layers} />
        <StatCard title="Public" value={activeQuizzes.length} icon={Globe} />
        <StatCard title="Private" value={hiddenQuizzes} icon={Lock} />
      </div>

      {/* Charts */}
      <div>
        <MasterStatsCharts
          quizzes={quizzes}
          profiles={profiles}
          sessionCounts={sessionCounts}
        />
      </div>
    </div>
  );
}
