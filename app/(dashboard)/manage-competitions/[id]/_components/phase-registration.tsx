"use client";

import { useTranslation } from "@/lib/i18n";
import { DummyPlayer } from "@/types/competition";
import { Users, Gamepad2, Trophy, Search } from "lucide-react";
import { useState } from "react";
import { TimeAgo } from "@/components/shared/time-ago";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SearchInput } from "@/components/shared/search-input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";

interface PhaseRegistrationProps {
  players: DummyPlayer[];
}

export function PhaseRegistration({ players }: PhaseRegistrationProps) {
  const { t, locale } = useTranslation();
  const [search, setSearch] = useState("");
  const [selectedPlayerForSessions, setSelectedPlayerForSessions] = useState<DummyPlayer | null>(null);

  const filtered = players.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => {
    if (b.gamesPlayed !== a.gamesPlayed) return b.gamesPlayed - a.gamesPlayed;
    return b.avgScore - a.avgScore;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">{t("competition.phase_registration")}</h2>
          <span className="text-sm text-muted-foreground">({players.length})</span>
        </div>
          <SearchInput
            placeholder={t("comp_detail.search_player")}
            value={search}
            onSearch={(val) => setSearch(val)}
            className="w-56 h-9"
          />
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px] text-center">#</TableHead>
              <TableHead>{t("comp_detail.table_player")}</TableHead>
              <TableHead>{t("Category") || "Category"}</TableHead>
              <TableHead className="text-center">{t("comp_detail.table_play")}</TableHead>
              <TableHead className="text-center">{t("comp_detail.table_avg")}</TableHead>
              <TableHead className="text-right">{t("comp_detail.table_registered")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-20 text-center text-muted-foreground">
                  {t("comp_detail.no_players")}
                </TableCell>
              </TableRow>
            ) : (
              sorted.map((player, idx) => {
                return (
                  <TableRow key={player.id}>
                    <TableCell className="text-center">
                      {idx < 3 ? (
                        <span className={`inline-flex items-center justify-center h-6 w-6 rounded-full text-xs font-bold ${
                          idx === 0 ? "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400" :
                          idx === 1 ? "bg-gray-300/20 text-gray-500" :
                          "bg-orange-500/20 text-orange-600 dark:text-orange-400"
                        }`}>{idx + 1}</span>
                      ) : (
                        <span className="text-sm text-muted-foreground">{idx + 1}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Link href={`/users/${player.userId || player.id}`} target="_blank" className="flex items-center gap-2 group p-1.5 -ml-1.5 rounded-md hover:bg-muted/50 transition-colors w-fit">
                        <Avatar className="h-7 w-7">
                          <AvatarImage src={player.avatar || ""} alt={player.name} className="object-cover" />
                          <AvatarFallback className="text-[10px]">
                            {player.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col min-w-0">
                          <span className="font-medium text-sm truncate group-hover:text-primary transition-colors" title={player.name}>{player.name}</span>
                          <span className="text-[10px] text-muted-foreground truncate" title={`@${player.username || player.name}`}>
                            @{player.username || player.name.toLowerCase().replace(/\s+/g, '')}
                          </span>
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell>
                      {player.category ? (
                        <Badge variant="outline" className="text-[10px] font-medium bg-muted/20">
                          {player.category}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-xs font-medium px-2">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <button 
                        onClick={() => setSelectedPlayerForSessions(player)}
                        className="flex items-center justify-center gap-1 w-full hover:bg-muted/50 p-1.5 rounded-md cursor-pointer transition-colors"
                        title="View Sessions"
                      >
                        <Gamepad2 className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-primary hover:underline">{player.gamesPlayed}</span>
                      </button>
                    </TableCell>
                    <TableCell className="text-center">
                      <button 
                        onClick={() => setSelectedPlayerForSessions(player)}
                        className="flex items-center justify-center gap-1 w-full hover:bg-muted/50 p-1.5 rounded-md cursor-pointer transition-colors"
                        title="View Sessions"
                      >
                        <Trophy className="h-3.5 w-3.5 text-yellow-500" />
                        <span className="font-medium text-primary hover:underline">{player.avgScore.toFixed(1)}</span>
                      </button>
                    </TableCell>
                    <TableCell className="text-right">
                      <TimeAgo date={player.registeredAt} className="text-xs text-muted-foreground" />
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selectedPlayerForSessions} onOpenChange={(open) => !open && setSelectedPlayerForSessions(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Gamepad2 className="h-5 w-5 text-primary" />
              <span>
                Sessions for <span className="text-primary">{selectedPlayerForSessions?.name}</span>
              </span>
            </DialogTitle>
          </DialogHeader>
          
          <ScrollArea className="h-[400px] mt-4 pr-4">
            {(!selectedPlayerForSessions?.sessions || selectedPlayerForSessions.sessions.length === 0) ? (
              <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                <p>No valid sessions found for this competition.</p>
                <p className="text-xs text-muted-foreground/70 mt-1">(Only finished sessions played after registration count)</p>
              </div>
            ) : (
              <div className="space-y-4">
                {selectedPlayerForSessions.sessions.map((sess, idx) => (
                  <div key={idx} className="flex flex-col gap-2 p-3 border rounded-lg bg-muted/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">#{idx + 1}</span>
                        <span className="font-medium text-sm truncate max-w-[220px]" title={sess.quizTitle || sess.application || "Unknown Quiz"}>
                          {sess.quizTitle || sess.application || "Unknown Quiz"}
                        </span>
                        {sess.application && sess.quizTitle && (
                          <span className="text-[10px] uppercase tracking-wider font-semibold border text-muted-foreground px-1.5 py-0.5 rounded-md bg-muted/10">
                            {sess.application}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(sess.createdAt), "d MMM yyyy, HH:mm")}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm mt-1">
                      <div className="flex items-center gap-1.5">
                        <Trophy className="h-3.5 w-3.5 text-yellow-500" />
                        <span className="font-semibold text-foreground">{sess.score}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <span>⏱️</span>
                        <span>{sess.timeSeconds >= 60 ? `${Math.floor(sess.timeSeconds / 60)}m ${sess.timeSeconds % 60}s` : `${sess.timeSeconds}s`}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
