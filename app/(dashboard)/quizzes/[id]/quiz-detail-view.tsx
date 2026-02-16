"use client";

import Link from "next/link";
import {
  format,
  isToday,
  isYesterday,
  isThisWeek,
  isThisMonth,
  isThisYear,
  subWeeks,
  subYears,
  startOfWeek,
  endOfWeek,
  startOfYear,
  endOfYear,
  isWithinInterval,
  formatDistanceToNow,
} from "date-fns";
import { id as idLocale, enUS as enLocale } from "date-fns/locale";
import { useTranslation } from "@/lib/i18n";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAvatarUrl } from "@/lib/utils";
import { QuizBreadcrumb } from "./quiz-client";
import { StatCard } from "@/components/dashboard/stat-card";
import {
  Gamepad2,
  Users,
  Trophy,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Search,
  BarChart3,
  Target,
  TrendingUp,
} from "lucide-react";
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { fetchQuizSessions, type QuizSession } from "../actions";
import { ImageZoomDialog } from "@/components/ui/image-zoom-dialog";

// --- Interfaces ---

interface QuizCreator {
  id: string;
  fullname: string | null;
  username: string | null;
  avatar_url: string | null;
}

interface Quiz {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  language: string | null;
  is_public: boolean;
  status: string;
  created_at: string;
  creator?: QuizCreator | null;
  questions?: unknown[] | null;
}

interface QuizDetailViewProps {
  quiz: Quiz;
  sessions: QuizSession[];
}

// --- Component ---

export function QuizDetailView({ quiz, sessions }: QuizDetailViewProps) {
  const { t, locale } = useTranslation();
  const dateLocale = locale === "id" ? idLocale : enLocale;
  const [expandedQ, setExpandedQ] = useState<number[]>([]);
  const [sessionFilter, setSessionFilter] = useState("month");
  const questions = Array.isArray(quiz.questions) ? quiz.questions : [];
  
  const handleToggleAllQuestions = () => {
    if (expandedQ.length === questions.length) {
      setExpandedQ([]);
    } else {
      setExpandedQ(questions.map((_, i) => i));
    }
  }

  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingEllipsis, setEditingEllipsis] = useState<number | null>(null);
  const [jumpPage, setJumpPage] = useState("");
  const itemsPerPage = 10;
  const [isDescOpen, setIsDescOpen] = useState(false);
  const [currentSessions, setCurrentSessions] = useState<QuizSession[]>(sessions);

  // Auto-refresh sessions every 15 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const freshSessions = await fetchQuizSessions(quiz.id);
        setCurrentSessions(freshSessions);
      } catch (error) {
        console.error("Auto-refresh failed:", error);
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [quiz.id]);

  useEffect(() => {
    setCurrentPage(1);
  }, [sessionFilter]);

  const filteredSessions = currentSessions.filter((session) => {
    if (sessionFilter === "all") return true;
    if (!session.created_at) return false;
    const date = new Date(session.created_at);
    const now = new Date();

    if (sessionFilter === "today") return isToday(date);
    if (sessionFilter === "yesterday") return isYesterday(date);
    if (sessionFilter === "week") return isThisWeek(date);
    if (sessionFilter === "last_week") {
      const start = startOfWeek(subWeeks(now, 1));
      const end = endOfWeek(subWeeks(now, 1));
      return isWithinInterval(date, { start, end });
    }
    if (sessionFilter === "month") return isThisMonth(date);
    if (sessionFilter === "year") return isThisYear(date);
    if (sessionFilter === "last_year") {
      const start = startOfYear(subYears(now, 1));
      const end = endOfYear(subYears(now, 1));
      return isWithinInterval(date, { start, end });
    }
    return true;
  });

  const totalPages = Math.ceil(filteredSessions.length / itemsPerPage);

  const pageNumbers = (() => {
    if (totalPages <= 5)
      return Array.from({ length: totalPages }, (_, i) => i + 1);

    if (currentPage <= 3) return [1, 2, 3, "...", totalPages];

    if (currentPage >= totalPages - 2)
      return [1, "...", totalPages - 2, totalPages - 1, totalPages];

    return [
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      totalPages,
    ];
  })();

  const handleJumpToPage = (e: React.FormEvent) => {
    e.preventDefault();
    const pageNum = parseInt(jumpPage, 10);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
    setEditingEllipsis(null);
    setJumpPage("");
  };

  const paginatedSessions = filteredSessions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );


  const visibility = quiz.is_public ? t("status.public") : t("status.private");
  const statusLabel =
    quiz.status === "block" ? t("status.blocked") : t("status.active");

  // --- Analytics ---
  const totalPlays = filteredSessions.length;
  const finishedSessions = filteredSessions.filter((s) => s.status === "finished");

  const allParticipants = filteredSessions.flatMap((s) => s.participants || []);
  const totalParticipants = allParticipants.length;

  const allScores = allParticipants
    .map((p) => p.score ?? 0)
    .filter((s) => s > 0);
  const avgScore =
    allScores.length > 0
      ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length)
      : 0;

  // Enhanced Analytics
  const completionRate =
    totalPlays > 0
      ? Math.round((finishedSessions.length / totalPlays) * 100)
      : 0;
  const waitingSessions = filteredSessions.filter(
    (s) => s.status === "waiting"
  ).length;
  const activeSessions = totalPlays - finishedSessions.length - waitingSessions;

  const bestScore = allScores.length > 0 ? Math.max(...allScores) : 0;
  const lowestScore = allScores.length > 0 ? Math.min(...allScores) : 0;

  const avgPlayersPerSession =
    totalPlays > 0 ? Math.round(totalParticipants / totalPlays) : 0;

  // Top Players
  const topPlayers = allParticipants
    .filter((p) => (p.score ?? 0) > 0)
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
    .slice(0, 5);

  // Top Applications
  const appCounts = filteredSessions.reduce((acc, s) => {
    const app = s.application || "Unknown";
    acc[app] = (acc[app] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const topApplications = Object.entries(appCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);
  const maxAppCount = topApplications.length > 0 ? topApplications[0][1] : 0;

  return (
    <div className="container mx-auto py-0 space-y-6">
      <QuizBreadcrumb title={t("quiz.detail_title") || "Quiz Detail"} />

      {/* Header */}
      <div className="space-y-4">
        {/* Title & Toggle */}
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight truncate" title={quiz.title}>
            {quiz.title}
          </h1>
          {quiz.description && (
            <Button
              variant="secondary"
              size="icon"
              className="h-6 w-6 shrink-0 rounded-md"
              onClick={() => setIsDescOpen(!isDescOpen)}
              title={isDescOpen ? "Hide Description" : "Show Description"}
            >
              {isDescOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          )}
        </div>

        {/* Description */}
        {quiz.description && isDescOpen && (
          <div className="max-w-4xl text-muted-foreground animate-in fade-in slide-in-from-top-1 duration-200">
            <p className="leading-relaxed whitespace-pre-wrap text-sm md:text-base border-l-2 border-primary/20 pl-4 py-1">
              {quiz.description}
            </p>
          </div>
        )}

        {/* Metadata */}
        <div className="flex items-center gap-x-3 gap-y-2 text-sm text-muted-foreground flex-wrap">
          {quiz.creator && (
            <>
              <Link
                href={`/users/${quiz.creator.id}`}
                className="flex items-center gap-2 group text-foreground"
              >
                <Avatar className="h-6 w-6">
                  <AvatarImage src={getAvatarUrl(quiz.creator.avatar_url)} />
                  <AvatarFallback className="text-[10px]">
                    {quiz.creator.fullname?.[0] ?? "?"}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium group-hover:text-primary transition-colors">
                  {quiz.creator.fullname}
                </span>
              </Link>
              <span>•</span>
            </>
          )}
          {quiz.category && (
            <span className="capitalize">{quiz.category}</span>
          )}
          {quiz.category && <span>•</span>}
          <span className="uppercase">{quiz.language ?? "ID"}</span>
          <span>•</span>
          <span className="flex items-center gap-1" title={`${(quiz.questions || []).length} Questions`}>
            {(quiz.questions || []).length} {t("quiz.questions") || "Questions"}
          </span>
          <span>•</span>
          <Badge
            variant="outline"
            className={
              quiz.is_public
                ? "bg-[var(--success)]/20 text-[var(--success)] border-[var(--success)]/30"
                : "bg-[var(--warning)]/20 text-[var(--warning)] border-[var(--warning)]/30"
            }
          >
            {visibility}
          </Badge>
          <Badge
            variant="outline"
            className={
              quiz.status === "block"
                ? "bg-red-500/20 text-red-500 border-red-500/30"
                : "bg-blue-500/20 text-blue-500 border-blue-500/30"
            }
          >
            {statusLabel}
          </Badge>
          {quiz.created_at && (
            <>
              <span>•</span>
              <span>
                {format(new Date(quiz.created_at), "d MMM yyyy")}
              </span>
            </>
          )}
        </div>
      </div>



      {/* Two Column Layout */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Questions List - 3 cols */}
        <div className="lg:col-span-3 rounded-xl border border-border bg-card overflow-hidden flex flex-col max-h-[600px]">
          <div className="p-4 border-b border-border shrink-0 flex items-center justify-between">
            <h3 className="font-semibold">
              {t("quiz.questions_list") || "Questions"} ({questions.length})
            </h3>
            {questions.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleToggleAllQuestions}
                className="h-8 text-xs gap-1.5 bg-background"
              >
                {expandedQ.length === questions.length ? (
                  <>
                    {t("action.collapse_all") || "Collapse All"}
                    <ChevronUp className="h-4 w-4 ml-1.5" />
                  </>
                ) : (
                  <>
                    {t("action.expand_all") || "Expand All"}
                    <ChevronDown className="h-4 w-4 ml-1.5" />
                  </>
                )}
              </Button>
            )}
          </div>
          <div className="divide-y divide-border flex-1 overflow-y-auto">
            {questions.length === 0 && (
              <p className="p-4 text-sm text-muted-foreground">
                {t("quiz.no_questions") || "No questions"}
              </p>
            )}
            {questions.map((question: unknown, index: number) => {
              const q = question as {
                question?: string;
                text?: string;
                image?: string;
                image_url?: string;
                img?: string;
                options?: (
                  | string
                  | { id?: string; answer?: string }
                )[];
                answers?: (
                  | string
                  | { id?: string; answer?: string }
                )[];
                correct_answer?: number | string;
                correctAnswer?: number | string;
                correct?: number | string;
              };
              const questionText = q.question || q.text || "-";
              const questionImage = q.image || q.image_url || q.img;
              const options = q.options || q.answers || [];
              const correctAnswerValue =
                q.correct_answer ?? q.correctAnswer ?? q.correct;
                  const isExpanded = expandedQ.includes(index);

              return (
                <div key={index} className="group">
                  <button
                    onClick={() =>
                      setExpandedQ((prev) =>
                        prev.includes(index)
                          ? prev.filter((i) => i !== index)
                          : [...prev, index]
                      )
                    }
                    className="w-full p-3 flex items-center gap-3 text-left hover:bg-secondary/30 transition-colors"
                  >
                    <span className="flex-shrink-0 w-7 h-7 rounded-md bg-primary/10 text-primary font-medium flex items-center justify-center text-xs">
                      {index + 1}
                    </span>
                    <span
                      className={`flex-1 text-sm ${
                        isExpanded ? "whitespace-pre-wrap break-words" : "truncate"
                      }`}
                      title={questionText}
                    >
                      {questionText}
                    </span>
                    <span className="text-muted-foreground">
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </span>
                  </button>
                  {isExpanded && (questionImage || options.length > 0) && (
                    <div className="px-3 pb-3 space-y-3">
                      {questionImage && (
                        <div className="ml-10 rounded-lg overflow-hidden border border-border bg-muted/30 relative group/image max-w-2xl">
                          <img
                            src={questionImage}
                            alt={`Question ${index + 1}`}
                            loading="lazy"
                            className="w-full h-auto max-h-[400px] object-contain bg-background/50 cursor-pointer hover:brightness-90 transition-all active:scale-[0.99]"
                            onClick={() => setZoomedImage(questionImage)}
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display =
                                "none";
                            }}
                          />
                        </div>
                      )}
                      
                      {options.length > 0 && (
                        <div className="space-y-1.5">
                          {options.map((option, optIndex: number) => {
                            const optionText =
                              typeof option === "string"
                                ? option
                                : option?.answer || "-";
                            const optionId =
                              typeof option === "object" ? option?.id : null;
                            const isCorrect =
                              correctAnswerValue === optIndex ||
                              correctAnswerValue === optionId;

                            return (
                              <div
                                key={optIndex}
                                className={`ml-10 p-2 rounded-md text-sm flex items-center gap-2 ${
                                  isCorrect
                                    ? "bg-[var(--success)]/10 text-[var(--success)]"
                                    : "bg-secondary/50 text-muted-foreground"
                                }`}
                              >
                                {isCorrect ? (
                                  <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0" />
                                ) : (
                                  <XCircle className="h-3.5 w-3.5 flex-shrink-0 opacity-40" />
                                )}
                                <span>
                                  {String.fromCharCode(65 + optIndex)}.{" "}
                                  {optionText}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Session History - 2 cols */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card overflow-hidden flex flex-col max-h-[600px]">
          <div className="p-4 border-b border-border flex items-center justify-between gap-2 shrink-0">
            <h3 className="font-semibold truncate">
              {t("quiz.session_history") || "Game Sessions"} ({filteredSessions.length})
            </h3>
            <div className="flex items-center gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 gap-2 bg-background">
                    <BarChart3 className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">{t("quiz.statistics") || "Statistics"}</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[750px]">
                  <DialogHeader>
                    <DialogTitle>{t("quiz.quiz_stats") || "Statistics"}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-5 py-2">

                    {/* Key Metrics — Compact Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { label: t("quiz.plays") || "Plays", val: totalPlays, icon: Gamepad2, color: "text-blue-400" },
                        { label: t("quiz.participants") || "Participants", val: totalParticipants, icon: Users, color: "text-violet-400" },
                        { label: t("quiz.avg_score") || "Avg Score", val: avgScore, icon: Trophy, color: "text-amber-400" },
                        { label: t("quiz.completion_rate") || "Completion", val: `${completionRate}%`, icon: Target, color: "text-emerald-400" },
                      ].map((item, idx) => (
                        <div key={idx} className="rounded-lg border border-border bg-card/50 p-3 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] text-muted-foreground font-medium">{item.label}</span>
                            <item.icon className={`h-3.5 w-3.5 ${item.color}`} />
                          </div>
                          <p className="text-xl font-bold tracking-tight">{item.val}</p>
                        </div>
                      ))}
                    </div>

                    {/* Session Status Breakdown */}
                    <div className="rounded-lg border border-border bg-card/50 p-4 space-y-3">
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        {t("quiz.session_status") || "Session Status"}
                      </h4>
                      {totalPlays > 0 ? (
                        <>
                          <div className="h-3 rounded-full overflow-hidden flex bg-secondary/50">
                            {finishedSessions.length > 0 && (
                              <div
                                className="h-full bg-emerald-500 transition-all duration-500"
                                style={{ width: `${(finishedSessions.length / totalPlays) * 100}%` }}
                              />
                            )}
                            {waitingSessions > 0 && (
                              <div
                                className="h-full bg-amber-500 transition-all duration-500"
                                style={{ width: `${(waitingSessions / totalPlays) * 100}%` }}
                              />
                            )}
                            {activeSessions > 0 && (
                              <div
                                className="h-full bg-blue-500 transition-all duration-500"
                                style={{ width: `${(activeSessions / totalPlays) * 100}%` }}
                              />
                            )}
                          </div>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
                            <div className="flex items-center gap-1.5">
                              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                              <span className="text-muted-foreground">{t("quiz.finished") || "Finished"}</span>
                              <span className="font-semibold">{finishedSessions.length}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                              <span className="text-muted-foreground">{t("quiz.waiting") || "Waiting"}</span>
                              <span className="font-semibold">{waitingSessions}</span>
                            </div>
                            {activeSessions > 0 && (
                              <div className="flex items-center gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                                <span className="text-muted-foreground">{t("quiz.active_status") || "Active"}</span>
                                <span className="font-semibold">{activeSessions}</span>
                              </div>
                            )}
                          </div>
                        </>
                      ) : (
                        <p className="text-sm text-muted-foreground">{t("quiz.no_data") || "No data yet"}</p>
                      )}
                    </div>

                    {/* Bottom Row: Score Range + Top Players */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Top Application */}
                      <div className="rounded-lg border border-border bg-card/50 p-4 space-y-3">
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          {t("quiz.top_application") || "Top Application"}
                        </h4>
                        {topApplications.length > 0 ? (
                          <div className="space-y-2.5">
                            {topApplications.map(([appName, count], idx) => (
                              <div key={appName} className="space-y-1">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm capitalize truncate">{appName}</span>
                                  <span className="text-xs font-semibold tabular-nums text-muted-foreground">
                                    {count} {count === 1 ? "session" : "sessions"}
                                  </span>
                                </div>
                                <div className="h-1.5 rounded-full overflow-hidden bg-secondary/50">
                                  <div
                                    className={`h-full rounded-full transition-all duration-500 ${
                                      idx === 0 ? "bg-blue-500" : idx === 1 ? "bg-violet-500" : idx === 2 ? "bg-cyan-500" : "bg-slate-400"
                                    }`}
                                    style={{ width: `${(count / maxAppCount) * 100}%` }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">{t("quiz.no_data") || "No data yet"}</p>
                        )}
                      </div>

                      {/* Top Players */}
                      <div className="rounded-lg border border-border bg-card/50 p-4 space-y-3">
                        <div className="flex items-center gap-1.5">
                          <TrendingUp className="h-3.5 w-3.5 text-amber-400" />
                          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            {t("quiz.top_players") || "Top Players"}
                          </h4>
                        </div>
                        {topPlayers.length > 0 ? (
                          <div className="space-y-2">
                            {topPlayers.map((player, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                                  idx === 0 ? "bg-amber-500/20 text-amber-400" :
                                  idx === 1 ? "bg-slate-400/20 text-slate-300" :
                                  idx === 2 ? "bg-orange-500/20 text-orange-400" :
                                  "bg-secondary text-muted-foreground"
                                }`}>
                                  {idx + 1}
                                </span>
                                <span className="flex-1 text-sm truncate">{player.nickname || "Player"}</span>
                                <span className="text-sm font-semibold tabular-nums">{player.score ?? 0}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">{t("quiz.no_players") || "No players yet"}</p>
                        )}
                      </div>
                    </div>

                  </div>
                </DialogContent>
              </Dialog>
              <Select value={sessionFilter} onValueChange={setSessionFilter}>
                <SelectTrigger className="w-[120px] h-8 text-xs bg-background">
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {t("time.all_time") || "All Time"}
                </SelectItem>
                <SelectItem value="today">
                  {t("master.today") || "Today"}
                </SelectItem>
                <SelectItem value="yesterday">
                  {t("master.yesterday") || "Yesterday"}
                </SelectItem>
                <SelectItem value="week">
                  {t("master.this_week") || "This Week"}
                </SelectItem>
                <SelectItem value="last_week">
                  {t("master.last_week") || "Last Week"}
                </SelectItem>
                <SelectItem value="month">
                  {t("master.this_month") || "This Month"}
                </SelectItem>
                <SelectItem value="year">
                  {t("master.this_year") || "This Year"}
                </SelectItem>
                <SelectItem value="last_year">
                  {t("master.last_year") || "Last Year"}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
          <div className="divide-y divide-border flex-1 overflow-y-auto">
            {filteredSessions.length === 0 && (
              <p className="p-4 text-sm text-muted-foreground">
                {sessionFilter === "all"
                  ? t("quiz.no_sessions") || "No sessions yet"
                  : t("quiz.no_match") || "No sessions found for this period"}
              </p>
            )}
            {paginatedSessions.map((session) => {
              const participants = session.participants || [];
              const playerCount = participants.length;
              const sessionScores = participants
                .map((p) => p.score ?? 0)
                .filter((s) => s > 0);
              const sessionAvg =
                sessionScores.length > 0
                  ? Math.round(
                      sessionScores.reduce((a, b) => a + b, 0) /
                        sessionScores.length
                    )
                  : 0;

              return (
                <Link
                  key={session.id}
                  href={`/game-sessions/${session.id}`}
                  className="flex items-center justify-between p-3 hover:bg-secondary/30 transition-colors group"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium">
                        PIN: {session.game_pin}
                      </span>
                      {session.application && (
                        <span className="capitalize px-1.5 py-0.5 rounded text-[10px] font-medium border border-border/50 bg-blue-500/10 text-blue-600 dark:text-blue-400">
                          {session.application}
                        </span>
                      )}
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          session.status === "finished"
                            ? "bg-[var(--success)]/20 text-[var(--success)] border-[var(--success)]/30"
                            : "bg-blue-500/20 text-blue-500 border-blue-500/30"
                        }`}
                      >
                        {session.status}
                      </Badge>
                    </div>
                    <p
                      className="text-xs text-muted-foreground mt-0.5"
                      title={
                        session.created_at
                          ? format(
                              new Date(session.created_at),
                              "EEEE, d MMMM yyyy, HH:mm",
                              { locale: dateLocale }
                            )
                          : undefined
                      }
                    >
                      {session.created_at
                        ? formatDistanceToNow(new Date(session.created_at), {
                            addSuffix: true,
                            locale: dateLocale,
                          })
                        : "-"}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-medium">
                      {playerCount}{" "}
                      <span className="text-muted-foreground font-normal text-xs">
                        players
                      </span>
                    </p>
                    {sessionAvg > 0 && (
                      <p className="text-xs text-muted-foreground">
                        avg: {sessionAvg}
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 border-t border-border bg-muted/20">
              <div className="text-xs text-muted-foreground order-2 sm:order-1">
                Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filteredSessions.length)} -{" "}
                {Math.min(currentPage * itemsPerPage, filteredSessions.length)} of {filteredSessions.length}
              </div>

              <div className="flex items-center gap-1 order-1 sm:order-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 rounded-lg"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                {pageNumbers.map((page, i) => {
                  if (page === "...") {
                    if (editingEllipsis === i) {
                      return (
                        <form
                          key={i}
                          onSubmit={handleJumpToPage}
                          className="relative"
                        >
                          <Search className="absolute left-1.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                          <input
                            type="number"
                            min={1}
                            max={totalPages}
                            value={jumpPage}
                            onChange={(e) => setJumpPage(e.target.value)}
                            onBlur={() => {
                              setEditingEllipsis(null);
                              setJumpPage("");
                            }}
                            autoFocus
                            className="w-14 h-9 pl-6 pr-1 text-sm text-center font-medium rounded-lg border border-primary bg-card text-foreground focus:outline-none focus:ring-1 focus:ring-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                        </form>
                      );
                    }

                    return (
                      <Button
                        key={i}
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 hover:bg-muted rounded-lg"
                        onClick={() => setEditingEllipsis(i)}
                        title="Go to page"
                      >
                        <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                        <span className="sr-only">More pages</span>
                      </Button>
                    );
                  }

                  return (
                    <Button
                      key={i}
                      variant={currentPage === page ? "default" : "outline"}
                      size="icon"
                      className={`h-9 w-9 text-sm rounded-lg ${
                        currentPage === page
                          ? "bg-primary text-primary-foreground hover:bg-primary/90"
                          : "hover:bg-accent text-muted-foreground"
                      }`}
                      onClick={() => setCurrentPage(page as number)}
                    >
                      {page}
                    </Button>
                  );
                })}

                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 rounded-lg"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <ImageZoomDialog 
        open={!!zoomedImage} 
        onOpenChange={(open) => !open && setZoomedImage(null)} 
        src={zoomedImage || ""} 
      />
    </div>
  );
}
