"use client";

import { Users, Trophy, Medal, Clock } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";

interface SessionStatsProps {
  totalPlayers: number;
  avgScore: number;
  maxScore: number;
  durationMinutes: number;
}

export function SessionStats({
  totalPlayers,
  avgScore,
  maxScore,
  durationMinutes,
}: SessionStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Players"
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
        title="Duration"
        value={`${durationMinutes}m`}
        icon={Clock}
      />
    </div>
  );
}
