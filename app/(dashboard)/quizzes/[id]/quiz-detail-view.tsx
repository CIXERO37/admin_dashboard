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
} from "date-fns";
import { useTranslation } from "@/lib/i18n";
import { Badge } from "@/components/ui/badge";
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
} from "lucide-react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { QuizSession } from "../actions";

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
  const { t } = useTranslation();
  const [expandedQ, setExpandedQ] = useState<number[]>([]);
  const [sessionFilter, setSessionFilter] = useState("all");

  const filteredSessions = sessions.filter((session) => {
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

  const questions = Array.isArray(quiz.questions) ? quiz.questions : [];
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

  return (
    <div className="container mx-auto py-6 space-y-6">
      <QuizBreadcrumb title={quiz.title} />

      {/* Header */}
      <div className="space-y-4">
        {/* Title */}
        <h1 className="text-2xl font-bold tracking-tight min-w-0 truncate" title={quiz.title}>
          {quiz.title}
        </h1>

        {/* Description */}
        {quiz.description && (
          <div className="max-w-4xl text-muted-foreground">
            <p className="line-clamp-3 leading-relaxed" title={quiz.description}>
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

      {/* Stat Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title={t("quiz.plays") || "Plays"}
          value={totalPlays}
          icon={Gamepad2}
        />
        <StatCard
          title={t("quiz.participants") || "Participants"}
          value={totalParticipants}
          icon={Users}
        />
        <StatCard
          title={t("quiz.avg_score") || "Avg Score"}
          value={avgScore}
          icon={Trophy}
        />
        <StatCard
          title={t("quiz.questions") || "Questions"}
          value={questions.length}
          icon={HelpCircle}
        />
      </div>

      {/* Two Column Layout */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Questions List - 3 cols */}
        <div className="lg:col-span-3 rounded-xl border border-border bg-card overflow-hidden">
          <div className="p-4 border-b border-border">
            <h3 className="font-semibold">
              {t("quiz.questions_list") || "Questions"} ({questions.length})
            </h3>
          </div>
          <div className="divide-y divide-border max-h-[600px] overflow-y-auto">
            {questions.length === 0 && (
              <p className="p-4 text-sm text-muted-foreground">
                {t("quiz.no_questions") || "No questions"}
              </p>
            )}
            {questions.map((question: unknown, index: number) => {
              const q = question as {
                question?: string;
                text?: string;
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
                  {isExpanded && options.length > 0 && (
                    <div className="px-3 pb-3 pl-13 space-y-1.5">
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
              );
            })}
          </div>
        </div>

        {/* Session History - 2 cols */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card overflow-hidden">
          <div className="p-4 border-b border-border flex items-center justify-between gap-2">
            <h3 className="font-semibold truncate">
              {t("quiz.session_history") || "Session History"} ({filteredSessions.length})
            </h3>
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
          <div className="divide-y divide-border max-h-[600px] overflow-y-auto">
            {filteredSessions.length === 0 && (
              <p className="p-4 text-sm text-muted-foreground">
                {sessionFilter === "all"
                  ? t("quiz.no_sessions") || "No sessions yet"
                  : t("quiz.no_match") || "No sessions found for this period"}
              </p>
            )}
            {filteredSessions.map((session) => {
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
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        PIN: {session.game_pin}
                      </span>
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
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {session.created_at
                        ? format(
                            new Date(session.created_at),
                            "d MMM yyyy, HH:mm"
                          )
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
        </div>
      </div>


    </div>
  );
}
