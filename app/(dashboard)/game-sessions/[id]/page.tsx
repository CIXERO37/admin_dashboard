
import { notFound } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";

import { getGameSessionById } from "../actions";
import { SessionStats } from "./session-stats";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default async function GameSessionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getGameSessionById(id);

  if (!session) {
    // Debug mode - show what's happening
    return (
      <div className="container mx-auto py-10 space-y-4">
        <div className="p-6 border border-red-500 rounded-lg bg-red-500/10">
          <h1 className="text-xl font-bold text-red-500 mb-2">Debug: Session Not Found</h1>
          <p className="text-muted-foreground">ID yang dicari: <code className="bg-muted px-2 py-1 rounded">{id}</code></p>
          <p className="text-sm text-muted-foreground mt-2">
            Data dengan ID ini tidak ditemukan di database. Kemungkinan:
          </p>
          <ul className="list-disc list-inside text-sm text-muted-foreground mt-1">
            <li>ID sudah dihapus</li>
            <li>ID salah/typo dari list</li>
            <li>Cache browser menampilkan data lama</li>
          </ul>
          <div className="mt-4">
            <a href="/game-sessions" className="text-primary hover:underline">← Kembali ke Game Sessions</a>
          </div>
        </div>
      </div>
    );
  }

  // Calculate specific stats
  const participants = session.participants || [];
  const scores = participants.map((p: any) => p.score || 0);
  const maxScore = scores.length > 0 ? Math.max(...scores) : 0;
  const avgScore =
    scores.length > 0
      ? Math.round(
          scores.reduce((a: number, b: number) => a + b, 0) / scores.length
        )
      : 0;

  // Sort by score
  const sortedParticipants = [...participants].sort(
    (a: any, b: any) => (b.score || 0) - (a.score || 0)
  );

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/game-sessions">Game Sessions</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{session.quiz_title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/game-sessions">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {session.quiz_title}
          </h1>
          <div className="flex items-center gap-2 text-muted-foreground text-sm flex-wrap">
            <span className="font-medium text-foreground">
              PIN: {session.game_pin}
            </span>
            <span>•</span>
            <span className="capitalize">{session.category}</span>
            <span>•</span>
            <span>
              {session.created_at
                ? format(new Date(session.created_at), "PPP p")
                : "-"}
            </span>
          </div>
        </div>
        <div className="ml-auto">
          {/* Status Badge */}
          <Badge
            variant={session.status === "finished" ? "default" : "outline"}
            className="capitalize"
          >
            {session.status}
          </Badge>
        </div>
      </div>

      {/* Stats Grid */}
      <SessionStats
        totalPlayers={participants.length}
        avgScore={avgScore}
        maxScore={maxScore}
        durationMinutes={session.duration_minutes || 0}
      />

      {/* Main Content: Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle>Leaderboard</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Rank</TableHead>
                <TableHead>Player</TableHead>
                <TableHead className="text-right">Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedParticipants.map((p: any, index: number) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    {index + 1}
                    {index === 0 && <span className="ml-2">🥇</span>}
                    {index === 1 && <span className="ml-2">🥈</span>}
                    {index === 2 && <span className="ml-2">🥉</span>}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={
                            p.avatar_url ||
                            `https://api.dicebear.com/9.x/avataaars/svg?seed=${
                              p.nickname || "user"
                            }`
                          }
                        />
                        <AvatarFallback>
                          {(p.nickname || "U")[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">
                        {p.nickname || "Unknown"}
                      </span>
                      {p.user_id && (
                        <Link
                          href={`/users/${p.user_id}`}
                          className="text-xs text-muted-foreground hover:underline ml-2"
                        >
                          View Profile
                        </Link>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-bold">
                    {p.score || 0}
                  </TableCell>
                </TableRow>
              ))}
              {sortedParticipants.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No participants found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
