"use client";

import { BookOpen, Globe, MapPin, Database } from "lucide-react";

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
  const countriesCount = aggregates?.countries.length ?? 0;
  const provincesCount = aggregates?.provinces.length ?? 0;
  const totalRecords = quizzes.length + countriesCount + provincesCount;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Master Data Dashboard
        </h1>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Quizzes"
          value={quizzes.length}
          change={`${activeQuizzes.length} visible`}
          changeType="neutral"
          icon={BookOpen}
        />
        <StatCard title="Countries" value={countriesCount} icon={Globe} />
        <StatCard title="Locations" value={provincesCount} icon={MapPin} />
        <StatCard
          title="Records"
          value={totalRecords}
          change="Quizzes + locations"
          changeType="neutral"
          icon={Database}
        />
      </div>

      {/* Charts */}
      <div>
        <MasterStatsCharts
          quizzes={quizzes}
          profiles={profiles}
          sessionCounts={sessionCounts}
        />
      </div>

      {/* Quick Access Cards */}
      <div>
        <SectionHeader
          title="Master Data Modules"
          description="Quick access to all master data"
        />
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <ActionCard
            title="Quiz Data"
            description="Manage quiz content and settings"
            href="/master/quiz"
            icon={BookOpen}
            stats={`${quizzes.length} quizzes`}
          />
          <ActionCard
            title="Country Data"
            description="Aggregate users per country"
            href="/master/country"
            icon={Globe}
            stats={`${countriesCount} countries`}
          />
          <ActionCard
            title="Location Data"
            description="Profile locations with coordinates"
            href="/master/province"
            icon={MapPin}
            stats={`${provincesCount} locations`}
          />
        </div>
      </div>
    </div>
  );
}
