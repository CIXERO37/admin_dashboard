"use client";

import { Users, Trophy, Medal, Clock, FileQuestion } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";

interface SessionStatsProps {
  totalPlayers: number;
  avgScore: number;
  maxScore: number;
  questionsCount: number;
  duration: string;
}

export function SessionStats({
  totalPlayers,
  avgScore,
  maxScore,
  questionsCount,
  duration,
}: SessionStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      <StatCard
        title="Players"
        value={totalPlayers}
        icon={Users}
      />
      <StatCard
        title="Average Score"
        value={avgScore}
        icon={Trophy}
      />
      <StatCard
        title="Highest Score"
        value={maxScore}
        icon={Medal}
      />
      <StatCard
        title="Questions"
        value={questionsCount}
        icon={FileQuestion}
      />
      <StatCard
        title="Duration"
        value={duration}
        icon={Clock}
      />
    </div>
  );
}
