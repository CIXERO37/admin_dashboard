"use client";

import { useTranslation } from "@/lib/i18n";
import { Trophy, LayoutGrid, Users, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { useRouter } from "next/navigation";

export function StatCards({ stats }: { stats: any }) {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card 
        className="cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => router.push("/manage-competitions")}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Competitions
          </CardTitle>
          <Trophy className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalCompetitions}</div>
          <p className="text-xs text-muted-foreground mt-1">
            <span className="text-emerald-500 font-medium">{stats.publishedCompetitions} Published</span> • {stats.draftCompetitions} Draft
          </p>
        </CardContent>
      </Card>
      
      <Card 
        className="cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => router.push("/manage-competitions")}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Ongoing Competitions
          </CardTitle>
          <Activity className="h-4 w-4 text-emerald-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.ongoingCount}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Currently active
          </p>
        </CardContent>
      </Card>

      <Card 
        className="cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => router.push("/category")}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Categories
          </CardTitle>
          <LayoutGrid className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalCategories}</div>
          <p className="text-xs text-muted-foreground mt-1">
            <span className="text-blue-500 font-medium">{stats.activeCategories} Active</span> • {stats.inactiveCategories} Inactive
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Participants
          </CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalParticipants}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Registered users
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
