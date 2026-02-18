"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/i18n";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  AvatarDialog,
  ProfileBreadcrumb,
  TopQuizzesList,
} from "./profile-client";
import {
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Trophy,
  Gamepad2,
  CreditCard,
  BookOpen,
  FileQuestion,
  Zap,
  Monitor,
  Clock,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Profile {
  fullname?: string | null;
  username?: string | null;
  avatar_url?: string | null;
  email?: string | null;
  phone?: string | null;
  city?: { name: string } | null;
  state?: { name: string } | null;
  country?: { name: string } | null;
  organization?: string | null;
  role?: string | null;
  following_count?: number;
  followers_count?: number;
  friends_count?: number;
  created_at?: string | null;
  last_active?: string | null;
}

interface UserQuiz {
  id: string;
  title: string;
  play_count: number;
  avg_score: number;
}

interface CreatedQuiz {
  id: string;
  title: string;
  category: string | null;
  question_count: number;
}

interface UserGameActivity {
  total_sessions_hosted: number;
  total_games_played: number;
  top_applications: { name: string; count: number }[];
  recent_sessions: {
    id: string;
    game_pin: string;
    status: string;
    application?: string;
    created_at: string;
    participant_count: number;
  }[];
}

interface UserDetailClientProps {
  profile: Profile;
  userQuizzes: UserQuiz[];
  createdQuizzes: CreatedQuiz[];
  gameActivity: UserGameActivity;
}

export function UserDetailClient({
  profile,
  userQuizzes,
  createdQuizzes,
  gameActivity,
}: UserDetailClientProps) {
  const { t } = useTranslation();

  const locationParts = [profile.city?.name, profile.state?.name, profile.country?.name].filter(Boolean);

  return (
    <div className="space-y-4">
      <ProfileBreadcrumb
        name={profile.fullname || profile.username || t("page.users")}
      />

      {/* ===== TOP: Profile (left) + Stats (right) ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Profile Card */}
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-start gap-3">
              <div className="shrink-0">
                <AvatarDialog
                  avatarUrl={profile.avatar_url}
                  fullname={profile.fullname}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl font-bold truncate" title={profile.fullname ?? "-"}>
                    {profile.fullname ?? "-"}
                  </h1>
                  {profile.role && (
                    <Badge variant="secondary" className="text-xs capitalize">
                      {profile.role}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground truncate" title={`@${profile.username}`}>
                  @{profile.username}
                </p>
              </div>
            </div>

            {/* Contact Info */}
            <div className="mt-3 space-y-1.5 text-sm text-muted-foreground">
              {profile.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate" title={profile.email}>
                    {profile.email}
                  </span>
                </div>
              )}
              {profile.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 shrink-0" />
                  <span>{profile.phone}</span>
                </div>
              )}
              {locationParts.length > 0 && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 shrink-0" />
                  <span>{locationParts.join(", ")}</span>
                </div>
              )}
              {profile.organization && (
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-3.5 w-3.5 shrink-0" />
                  <span>{profile.organization}</span>
                </div>
              )}
            </div>

            {/* Social Stats */}
            <div className="flex gap-6 mt-3 pt-3 border-t">
              <div className="text-center">
                <p className="text-lg font-bold">{profile.following_count ?? 0}</p>
                <p className="text-[11px] text-muted-foreground">{t("users.following")}</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold">{profile.followers_count ?? 0}</p>
                <p className="text-[11px] text-muted-foreground">{t("users.followers")}</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold">{profile.friends_count ?? 0}</p>
                <p className="text-[11px] text-muted-foreground">{t("users.friends")}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Overview Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Zap className="h-4 w-4 text-violet-500" />
              {t("users.activity_overview") || "Activity Overview"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  title: t("users.created_quizzes") || "Created Quizzes",
                  value: createdQuizzes.length.toLocaleString(),
                  icon: BookOpen,
                  color: "text-blue-500",
                  bgColor: "bg-blue-500/10",
                },
                {
                  title: t("users.most_played") || "Most Played",
                  value: userQuizzes.length.toLocaleString(),
                  icon: Trophy,
                  color: "text-amber-500",
                  bgColor: "bg-amber-500/10",
                },
                {
                  title: t("users.sessions_hosted") || "Sessions Hosted",
                  value: gameActivity.total_sessions_hosted.toLocaleString(),
                  icon: Zap,
                  color: "text-violet-500",
                  bgColor: "bg-violet-500/10",
                },
                {
                  title: t("users.games_played") || "Games Played",
                  value: gameActivity.total_games_played.toLocaleString(),
                  icon: Gamepad2,
                  color: "text-emerald-500",
                  bgColor: "bg-emerald-500/10",
                },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className="group relative overflow-hidden rounded-xl border border-border bg-card p-4 transition-all duration-300 hover:border-primary hover:shadow-md hover:shadow-primary/10"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-secondary/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="relative flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground truncate max-w-[100px]" title={stat.title}>
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold tracking-tight text-foreground">
                        {stat.value}
                      </p>
                    </div>
                    <div className={`rounded-lg p-2 transition-all duration-300 group-hover:scale-110 ${stat.bgColor}`}>
                      <stat.icon className={`h-4 w-4 transition-colors ${stat.color}`} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ===== MAIN CONTENT: 2 Columns ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Most Played Quizzes */}
        <Card>
          <CardHeader className="flex-row items-center justify-between pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Trophy className="h-4 w-4 text-amber-500" />
              {t("users.most_played")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {userQuizzes.length > 0 ? (
              <TopQuizzesList quizzes={userQuizzes} />
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <Gamepad2 className="h-8 w-8 text-muted-foreground/30 mb-1.5" />
                <p className="text-sm text-muted-foreground">
                  {t("users.no_played")}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Created Quizzes */}
        <Card>
          <CardHeader className="flex-row items-center justify-between pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-blue-500" />
              {t("users.created_quizzes")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {createdQuizzes.length > 0 ? (
              <div className="space-y-2">
                {createdQuizzes.map((quiz, index) => (
                  <Link
                    key={quiz.id}
                    href={`/quizzes/${quiz.id}`}
                    className="flex items-center gap-3 p-2 rounded-lg bg-muted/50 hover:bg-muted/80 transition-colors group"
                  >
                    <div className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-500/10 text-blue-500 font-bold text-xs shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate group-hover:text-primary transition-colors" title={quiz.title}>
                        {quiz.title}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                        {quiz.category && (
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                            {quiz.category}
                          </Badge>
                        )}
                        <div className="flex items-center gap-1">
                          <FileQuestion className="h-3 w-3" />
                          <span>
                            {quiz.question_count} {t("users.questions")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <BookOpen className="h-8 w-8 text-muted-foreground/30 mb-1.5" />
                <p className="text-sm text-muted-foreground">
                  {t("users.no_created")}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ===== BOTTOM ROW: Top Applications + Recent Sessions ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top Applications */}
        <Card>
          <CardHeader className="flex-row items-center justify-between pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Monitor className="h-4 w-4 text-cyan-500" />
              {t("quiz.top_application") || "Top Application"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {gameActivity.top_applications.length > 0 ? (
              <div className="space-y-2.5">
                {gameActivity.top_applications.map((app, idx) => {
                  const maxCount = gameActivity.top_applications[0]?.count || 1;
                  return (
                    <div key={app.name} className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium capitalize">{app.name}</span>
                        <span className="text-xs text-muted-foreground tabular-nums">
                          {app.count} {app.count === 1 ? "session" : "sessions"}
                        </span>
                      </div>
                      <div className="h-2 rounded-full overflow-hidden bg-secondary/50">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${
                            idx === 0
                              ? "bg-cyan-500"
                              : idx === 1
                              ? "bg-blue-500"
                              : idx === 2
                              ? "bg-violet-500"
                              : "bg-slate-400"
                          }`}
                          style={{ width: `${(app.count / maxCount) * 100}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <Monitor className="h-8 w-8 text-muted-foreground/30 mb-1.5" />
                <p className="text-sm text-muted-foreground">
                  {t("quiz.no_data") || "No data yet"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Sessions */}
        <Card>
          <CardHeader className="flex-row items-center justify-between pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-4 w-4 text-orange-500" />
              {t("users.recent_sessions") || "Recent Sessions"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {gameActivity.recent_sessions.length > 0 ? (
              <div className="space-y-2">
                {gameActivity.recent_sessions.map((session) => (
                  <Link
                    key={session.id}
                    href={`/game-sessions/${session.id}`}
                    className="flex items-center justify-between p-2 rounded-lg bg-muted/50 hover:bg-muted/80 transition-colors group"
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
                          className={`text-[10px] ${
                            session.status === "finished"
                              ? "bg-emerald-500/20 text-emerald-500 border-emerald-500/30"
                              : "bg-blue-500/20 text-blue-500 border-blue-500/30"
                          }`}
                        >
                          {session.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {formatDistanceToNow(new Date(session.created_at), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                    <div className="text-right shrink-0 ml-3">
                      <p className="text-sm font-medium">
                        {session.participant_count}{" "}
                        <span className="text-muted-foreground font-normal text-xs">
                          players
                        </span>
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <Clock className="h-8 w-8 text-muted-foreground/30 mb-1.5" />
                <p className="text-sm text-muted-foreground">
                  {t("users.no_sessions") || "No sessions yet"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ===== TRANSACTION HISTORY ===== */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-green-500" />
            {t("users.transaction_history")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <CreditCard className="h-8 w-8 text-muted-foreground/30 mb-1.5" />
            <p className="text-sm text-muted-foreground">
              {t("users.no_transactions")}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
