"use client";

import { useTranslation } from "@/lib/i18n";
import { Trophy, LayoutGrid, Users, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { useRouter } from "next/navigation";

export function StatCards({ stats }: { stats: any }) {
  const { t, locale } = useTranslation();
  const router = useRouter();

  const textTotalCompetitions = locale === "id" ? "Total Kompetisi" : "Total Competitions";
  const textPublished = locale === "id" ? "Dipublikasi" : "Published";
  const textDraft = locale === "id" ? "Draf" : "Draft";
  const textOngoing = locale === "id" ? "Kompetisi Berlangsung" : "Ongoing Competitions";
  const textCurrentlyActive = locale === "id" ? "Sedang aktif" : "Currently active";
  const textTotalCategories = locale === "id" ? "Total Kategori" : "Total Categories";
  const textActive = locale === "id" ? "Aktif" : "Active";
  const textInactive = locale === "id" ? "Tidak Aktif" : "Inactive";
  const textTotalParticipants = locale === "id" ? "Total Partisipan" : "Total Participants";
  const textRegisteredUsers = locale === "id" ? "Pengguna terdaftar" : "Registered users";

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card 
        className="cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => router.push("/manage-competitions")}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {textTotalCompetitions}
          </CardTitle>
          <Trophy className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalCompetitions}</div>
          <p className="text-xs text-muted-foreground mt-1">
            <span className="text-emerald-500 font-medium">{stats.publishedCompetitions} {textPublished}</span> • {stats.draftCompetitions} {textDraft}
          </p>
        </CardContent>
      </Card>
      
      <Card 
        className="cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => router.push("/manage-competitions")}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {textOngoing}
          </CardTitle>
          <Activity className="h-4 w-4 text-emerald-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.ongoingCount}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {textCurrentlyActive}
          </p>
        </CardContent>
      </Card>

      <Card 
        className="cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => router.push("/category")}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {textTotalCategories}
          </CardTitle>
          <LayoutGrid className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalCategories}</div>
          <p className="text-xs text-muted-foreground mt-1">
            <span className="text-blue-500 font-medium">{stats.activeCategories} {textActive}</span> • {stats.inactiveCategories} {textInactive}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {textTotalParticipants}
          </CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalParticipants}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {textRegisteredUsers}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
