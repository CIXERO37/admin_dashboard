
import { notFound } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";

import { getGameSessionById } from "../actions";
import { SessionStats } from "./session-stats";
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
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { StatisticButton } from "./statistic-button";

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
  const questionLimit = parseInt(session.question_limit || "0", 10) || 0;


  
  const rawParticipants = session.participants || [];
  const participants = rawParticipants.map((p: any) => {
    // Use raw score from DB
    const finalScore = p.score || 0;
    
    // Calculate duration in ms
    let durationMs = 0;
    if (p.started && p.ended) {
      durationMs = new Date(p.ended).getTime() - new Date(p.started).getTime();
    } else if (p.started_at && p.ended_at) { // Fallback just in case
        durationMs = new Date(p.ended_at).getTime() - new Date(p.started_at).getTime();
    }

    return {
      ...p,
      finalScore,
      durationMs
    };
  });

  const scores = participants.map((p: any) => p.finalScore);
  const maxScore = scores.length > 0 ? Math.max(...scores) : 0;
  const avgScore =
    scores.length > 0
      ? Math.round(
          scores.reduce((a: number, b: number) => a + b, 0) / scores.length
        )
      : 0;

  // Calculate session duration string (Session Metadata only)
  let sessionDuration = "0m";
  if (session.started_at && session.ended_at) {
    const start = new Date(session.started_at).getTime();
    const end = new Date(session.ended_at).getTime();
    const diff = Math.floor((end - start) / 1000);
    const m = Math.floor(diff / 60);
    const s = diff % 60;
    sessionDuration = s > 0 ? `${m}m ${s}s` : `${m}m`;
  } else if (session.total_time_minutes) {
    sessionDuration = `${session.total_time_minutes}m`;
  }

  // Sort by score (DESC) then duration (ASC - faster is better)
  const sortedParticipants = [...participants].sort(
    (a: any, b: any) => {
      if (b.finalScore !== a.finalScore) {
        return b.finalScore - a.finalScore;
      }
      // If scores are equal, faster time wins (smaller durationMs is better)
      // If duration is 0 (invalid), it should be last
      if (!a.durationMs) return 1;
      if (!b.durationMs) return -1;
      return a.durationMs - b.durationMs;
    }
  );

  const formatDuration = (ms: number) => {
    if (!ms) return "-";
    const seconds = ms / 1000;
    if (seconds < 60) return `${seconds.toFixed(2)}s`;
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}m ${s}s`;
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
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
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
        <h1 className="text-2xl font-bold tracking-tight">
          {session.quiz_title}
        </h1>
        <div className="flex items-center gap-2 text-muted-foreground text-sm flex-wrap mt-1">
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
          <span>•</span>
          <Badge
            variant={session.status === "finished" ? "default" : "outline"}
            className="capitalize"
          >
            {session.status}
          </Badge>
        </div>
      </div>
      <StatisticButton sessionId={id} />
      </div>

      {/* Stats Grid */}
      <SessionStats
        totalPlayers={participants.length}
        avgScore={avgScore}
        maxScore={maxScore}
        questionsCount={questionLimit}
        duration={sessionDuration}
      />

      {/* Main Content: Leaderboard */}
      <Card>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Rank</TableHead>
                <TableHead>Player</TableHead>
                <TableHead className="text-right">Time</TableHead>
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
                      {p.user_id ? (
                        <Link
                          href={`/users/${p.user_id}`}
                          className="font-medium hover:text-emerald-500 transition-colors"
                        >
                          {p.nickname || "Unknown"}
                        </Link>
                      ) : (
                        <span className="font-medium">
                          {p.nickname || "Unknown"}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-muted-foreground">
                    {formatDuration(p.durationMs)}
                  </TableCell>
                  <TableCell className="text-right font-bold">
                    {p.finalScore}
                  </TableCell>
                </TableRow>
              ))}
              {sortedParticipants.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={4}
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
