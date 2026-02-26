"use client";

import { useState, useEffect } from "react";
import { format, formatDistanceToNow } from "date-fns";
import { id, enUS } from "date-fns/locale";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useTranslation } from "@/lib/i18n";
import { toast } from "sonner";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";
import { generateXID } from "@/lib/id-generator";
import {
  CalendarDays,
  Users,
  CreditCard,
  Trophy,
  Gamepad2,
  Search,
  ChevronRight,
  Edit,
  ExternalLink,
  Banknote,
  Gift,
  Trash2,
  Upload,
  X,
  MoreHorizontal,
  GraduationCap,
  BookOpen,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

// --- DUMMY DATA ---
interface Player {
  id: string;
  name: string;
  avatar: string | null;
  gamesPlayed: number;
  avgScore: number;
  paid: boolean;
  registeredAt: string;
  isFinalist?: boolean;
  education?: string;
  class?: string;
}

const DUMMY_DETAIL = {
  title: "Cerdas Cermat Online - Sains",
  description: "Kompetisi cerdas cermat online bidang sains untuk siswa SD se-Indonesia. Kompetisi ini bertujuan untuk meningkatkan minat belajar sains dan mengasah kemampuan berpikir kritis para peserta melalui pertanyaan-pertanyaan yang menantang dan edukatif.",
  rules: [
    "Setiap peserta hanya boleh mendaftar satu kali",
    "Peserta wajib membayar biaya pendaftaran sebelum kompetisi dimulai",
    "Kompetisi terdiri dari 3 babak: Penyisihan, Semifinal, dan Final",
    "Setiap babak memiliki batas waktu 30 menit",
    "Peserta yang ketahuan menggunakan alat bantu akan didiskualifikasi",
    "Keputusan juri bersifat final dan tidak dapat diganggu gugat",
  ],
  status: "published" as const,
  startDate: "2026-03-10T08:00:00Z",
  endDate: "2026-03-12T17:00:00Z",
  posterUrl: "/images/poster1.jpg",
  registrationFee: 50000,
  prizePool: 5000000,
  registrationLink: "https://forms.google.com/example-registration",
};

const DUMMY_PLAYERS: Player[] = [
  { id: "p1", name: "Muhammad Khoirul H.", avatar: null, gamesPlayed: 12, avgScore: 85.3, paid: true, registeredAt: "2026-01-15T10:30:00Z", isFinalist: true },
  { id: "p2", name: "Aluna Kynan", avatar: null, gamesPlayed: 8, avgScore: 92.1, paid: true, registeredAt: "2026-01-16T08:15:00Z" },
  { id: "p3", name: "Apin Ridwan", avatar: null, gamesPlayed: 15, avgScore: 78.6, paid: false, registeredAt: "2026-01-18T14:00:00Z" },
  { id: "p4", name: "Kizuko Mellbringer", avatar: null, gamesPlayed: 5, avgScore: 91.0, paid: true, registeredAt: "2026-01-20T09:45:00Z", isFinalist: true },
  { id: "p5", name: "Zubaidillah", avatar: null, gamesPlayed: 20, avgScore: 67.4, paid: true, registeredAt: "2026-01-22T11:20:00Z", isFinalist: true },
  { id: "p6", name: "Lint More", avatar: null, gamesPlayed: 3, avgScore: 55.2, paid: false, registeredAt: "2026-01-25T16:30:00Z" },
  { id: "p7", name: "Siti Nurhaliza", avatar: null, gamesPlayed: 10, avgScore: 88.9, paid: true, registeredAt: "2026-02-01T07:50:00Z" },
  { id: "p8", name: "Budi Santoso", avatar: null, gamesPlayed: 7, avgScore: 73.5, paid: false, registeredAt: "2026-02-03T13:10:00Z" },
];

export default function CompetitionDetailPage() {
  const { t, locale } = useTranslation();
  const params = useParams();
  const router = useRouter();
  const compId = params.id as string;
  const supabase = getSupabaseBrowserClient();

  const [detail, setDetail] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dummyPlayers, setDummyPlayers] = useState<Player[]>(DUMMY_PLAYERS);


  useEffect(() => {
    async function getDetail() {
      const { data, error } = await supabase
        .from("competitions")
        .select("*")
        .eq("id", compId)
        .single();
      
      if (error) {
        toast.error("Competition not found");
        router.push("/manage-competitions");
        return;
      }
      
      setDetail(data);

      setIsLoading(false);
    }
    getDetail();
  }, [compId, supabase, router]);
  
  const statusConfig: Record<string, any> = {
    published: { label: t("comp_detail.status_published") || "Published", className: "bg-emerald-500/15 text-emerald-600 border-emerald-200 dark:text-emerald-400 dark:border-emerald-800" },
    draft: { label: t("comp_detail.status_draft") || "Draft", className: "bg-gray-500/15 text-gray-500 border-gray-200 dark:text-gray-400 dark:border-gray-700" },
    completed: { label: t("comp_detail.status_completed") || "Completed", className: "bg-blue-500/15 text-blue-600 border-blue-200 dark:text-blue-400 dark:border-blue-800" },
    coming_soon: { label: t("comp_detail.status_coming_soon") || "Coming Soon", className: "bg-orange-500/15 text-orange-600 border-orange-200 dark:text-orange-400 dark:border-orange-800" },
  };

  function formatCurrency(amount: number) {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount);
  }

  const getEducationLabel = (edu: string) => {
    switch (edu) {
      case "SD": return t("manage_competitions.form_education_sd") || "Elementary School";
      case "SMP": return t("manage_competitions.form_education_smp") || "Junior High School";
      case "SMA": return t("manage_competitions.form_education_sma") || "Senior High School";
      case "College": return t("manage_competitions.form_education_college") || "College/University";
      case "Others": return t("manage_competitions.form_education_others") || "Others";
      default: return edu;
    }
  };

  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"registered" | "paid" | "finalist">("registered");
  const [playerToToggle, setPlayerToToggle] = useState<Player | null>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [filterEducation, setFilterEducation] = useState<string>("all");
  const [filterClass, setFilterClass] = useState<string>("all");

  const handleSearch = () => setSearchQuery(searchInput);
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  if (isLoading || !detail) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-muted-foreground animate-pulse">Loading competition details...</p>
      </div>
    );
  }

  const cfg = statusConfig[detail.status] || statusConfig.draft;

  const totalRegistered = dummyPlayers.length;
  const totalPaid = dummyPlayers.filter((p) => p.paid).length;
  const totalFinalist = dummyPlayers.filter((p) => p.isFinalist).length;
  const paidPercentage = totalRegistered > 0 ? Math.round((totalPaid / totalRegistered) * 100) : 0;

  // Sort players by avg score descending for ranking
  const rankedPlayers = [...dummyPlayers].sort((a, b) => b.avgScore - a.avgScore);

  // Filter players based on tab, search, education and class
  const filteredPlayers = rankedPlayers.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "registered" || (activeTab === "paid" && p.paid) || (activeTab === "finalist" && p.isFinalist);
    const matchesEducation = filterEducation === "all" || p.education === filterEducation;
    const matchesClass = filterClass === "all" || p.class === filterClass;
    return matchesSearch && matchesTab && matchesEducation && matchesClass;
  });

  const getRank = (playerId: string) => rankedPlayers.findIndex((p) => p.id === playerId) + 1;

  const handleToggleFinalist = () => {
    if (!playerToToggle) return;
    
    setDummyPlayers(prev => prev.map(p => {
      if (p.id === playerToToggle.id) {
        const newStatus = !p.isFinalist;
        toast.success(newStatus ? (t("comp_detail.added_finalist") || "Moved to Finalist") : (t("comp_detail.removed_finalist") || "Removed from Finalist"));
        return { ...p, isFinalist: newStatus };
      }
      return p;
    }));
    setPlayerToToggle(null);
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/manage-competitions" className="hover:text-foreground transition-colors cursor-pointer">
          {t("manage_competitions.title") || "Manage Competitions"}
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground font-medium">{t("comp_detail.breadcrumb") || "Competition Detail"}</span>
      </nav>

      {/* Title + Actions */}
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-foreground">{detail.title}</h1>
            <Badge variant="outline" className={`capitalize border ${cfg.className}`}>
              {cfg.label}
            </Badge>
          </div>

          {/* Inline Stats */}
          <div className="flex items-center gap-x-3 gap-y-2 text-sm text-muted-foreground flex-wrap">
            <div className="flex items-center gap-1.5">
              <Users className="h-4 w-4" />
              <span><strong className="text-foreground">{totalRegistered.toLocaleString("id-ID")}</strong> {t("comp_detail.registered") || "Registered"}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <CreditCard className="h-4 w-4 text-emerald-500" />
              <span><strong className="text-foreground">{totalPaid.toLocaleString("id-ID")}</strong> {t("comp_detail.paid") || "Paid"}</span>
              <div className="flex items-center gap-1.5 ml-1">
                <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all"
                    style={{ width: `${paidPercentage}%` }}
                  />
                </div>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">{paidPercentage}%</span>
              </div>
            </div>
            <span>•</span>
            {(detail.education || detail.class) && (
              <>
                <div className="flex items-center gap-1.5 pl-1.5">
                  <GraduationCap className="h-4 w-4 text-purple-500" />
                  <span>
                    {detail.education ? getEducationLabel(detail.education) : "All Education"}
                    {detail.class ? ` — ${t("manage_competitions.class_level") || "Grade"} ${detail.class}` : ""}
                  </span>
                </div>
                <span>•</span>
              </>
            )}
            <div className="flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4 text-blue-500" />
              <span>{format(new Date(detail.start_date), "d MMM yyyy")} — {format(new Date(detail.end_date), "d MMM yyyy")}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <Banknote className="h-4 w-4 text-yellow-500" />
              <span>{formatCurrency(detail.registration_fee || 0)}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <Gift className="h-4 w-4 text-rose-500" />
              <span>{t("comp_detail.prize_pool") || "Total Prize"}: <strong className="text-foreground">{formatCurrency(detail.prize_pool || 0)}</strong></span>
            </div>
          </div>
        </div>

        <div className="shrink-0 flex items-center gap-2">
          <Button size="sm" className="gap-1.5" onClick={() => router.push(`/manage-competitions/${compId}/edit`)}>
            <Edit className="h-4 w-4" />
            {t("comp_detail.edit") || "Edit"}
          </Button>
        </div>
      </div>

      {/* Poster + Description + Rules + Registration Link */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Poster */}
        <div className="lg:col-span-1">
          <div className="rounded-lg overflow-hidden border bg-muted">
            <img
              src={detail.poster_url || "/images/poster1.jpg"}
              alt={detail.title}
              className="w-full object-cover"
            />
          </div>
        </div>

        {/* Info */}
        <div className="lg:col-span-2 space-y-5">
          <div>
            <h3 className="text-sm font-semibold mb-1.5">{t("comp_detail.description") || "Description"}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{detail.description}</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-1.5">{t("comp_detail.rules") || "Rules"}</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              {(detail.rules || []).map((rule: string, i: number) => (
                <li key={i}>{rule}</li>
              ))}
            </ul>
          </div>

          {detail.registration_link && (
            <div>
              <h3 className="text-sm font-semibold mb-1.5">{t("comp_detail.reg_link") || "Registration Link"}</h3>
              <a
                href={detail.registration_link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline cursor-pointer break-all"
              >
                <ExternalLink className="h-3.5 w-3.5 flex-shrink-0" />
                {detail.registration_link}
              </a>
            </div>
          )}
        </div>
      </div>

      <Separator />

      {/* Players Section */}
      <div className="space-y-4">
        {/* Tabs + Search */}
        <div className="flex items-center justify-between">
          <div className="flex items-center border rounded-lg overflow-hidden">
            <button
              onClick={() => setActiveTab("registered")}
              className={`px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
                activeTab === "registered"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted"
              }`}
            >
              {t("comp_detail.tab_daftar") || "Registered"} ({totalRegistered})
            </button>
            <button
              onClick={() => setActiveTab("paid")}
              className={`px-4 py-2 text-sm font-medium transition-colors border-l cursor-pointer ${
                activeTab === "paid"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted"
              }`}
            >
              {t("comp_detail.tab_paid") || "Paid"} ({totalPaid})
            </button>
            <button
              onClick={() => setActiveTab("finalist")}
              className={`px-4 py-2 text-sm font-medium transition-colors border-l cursor-pointer ${
                activeTab === "finalist"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted"
              }`}
            >
              {t("comp_detail.tab_finalist") || "Finalist"} ({totalFinalist})
            </button>
          </div>
          {/* Search + Filters grouped together */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Input
                placeholder={t("comp_detail.search_player") || "Search player..."}
                className="pr-10 w-56 h-9 bg-background border-border"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button
                onClick={handleSearch}
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 flex items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer"
              >
                <Search className="h-3.5 w-3.5" />
              </button>
            </div>

            <Select value={filterEducation} onValueChange={(val) => { setFilterEducation(val); setFilterClass("all"); }}>
              <SelectTrigger className="w-[180px] h-9">
                <SelectValue placeholder={t("manage_competitions.form_education") || "Grade"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("comp_detail.filter_all_education") || "All Grades"}</SelectItem>
                <SelectItem value="SD">{t("manage_competitions.form_education_sd") || "Elementary School"}</SelectItem>
                <SelectItem value="SMP">{t("manage_competitions.form_education_smp") || "Junior High School"}</SelectItem>
                <SelectItem value="SMA">{t("manage_competitions.form_education_sma") || "Senior High School"}</SelectItem>
                <SelectItem value="College">{t("manage_competitions.form_education_college") || "College/University"}</SelectItem>
                <SelectItem value="Others">{t("manage_competitions.form_education_others") || "Others"}</SelectItem>
              </SelectContent>
            </Select>

            {/* Class Filter */}
            <Select value={filterClass} onValueChange={setFilterClass} disabled={filterEducation === "all" || filterEducation === "College" || filterEducation === "Others"}>
              <SelectTrigger className="w-[150px] h-9">
                <SelectValue placeholder={t("manage_competitions.form_class") || "Class"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("comp_detail.filter_all_class") || "All Classes"}</SelectItem>
                {filterEducation === "SD" && (
                  <>
                    <SelectItem value="1">{t("manage_competitions.class_level") || "Grade"} 1</SelectItem>
                    <SelectItem value="2">{t("manage_competitions.class_level") || "Grade"} 2</SelectItem>
                    <SelectItem value="3">{t("manage_competitions.class_level") || "Grade"} 3</SelectItem>
                    <SelectItem value="4">{t("manage_competitions.class_level") || "Grade"} 4</SelectItem>
                    <SelectItem value="5">{t("manage_competitions.class_level") || "Grade"} 5</SelectItem>
                    <SelectItem value="6">{t("manage_competitions.class_level") || "Grade"} 6</SelectItem>
                  </>
                )}
                {filterEducation === "SMP" && (
                  <>
                    <SelectItem value="7">{t("manage_competitions.class_level") || "Grade"} 7</SelectItem>
                    <SelectItem value="8">{t("manage_competitions.class_level") || "Grade"} 8</SelectItem>
                    <SelectItem value="9">{t("manage_competitions.class_level") || "Grade"} 9</SelectItem>
                  </>
                )}
                {filterEducation === "SMA" && (
                  <>
                    <SelectItem value="10">{t("manage_competitions.class_level") || "Grade"} 10</SelectItem>
                    <SelectItem value="11">{t("manage_competitions.class_level") || "Grade"} 11</SelectItem>
                    <SelectItem value="12">{t("manage_competitions.class_level") || "Grade"} 12</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Players Table */}
        <div className="rounded-md border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px] text-center">#</TableHead>
                <TableHead>{t("comp_detail.table_player") || "Player"}</TableHead>
                <TableHead className="text-center">{t("comp_detail.table_play") || "Play"}</TableHead>
                <TableHead className="text-center">{t("comp_detail.table_avg") || "Avg Score"}</TableHead>
                <TableHead className="text-right">{t("comp_detail.table_registered") || "Registered"}</TableHead>
                <TableHead className="text-right w-[60px]">{t("action.action") || "Action"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPlayers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-20 text-center text-muted-foreground">
                    {t("comp_detail.no_players") || "No players found."}
                  </TableCell>
                </TableRow>
              ) : (
                filteredPlayers.map((player) => {
                  const rank = getRank(player.id);
                  const registeredDate = new Date(player.registeredAt);
                  const dateLocale = locale === "id" ? id : enUS;
                  
                  const timeAgo = formatDistanceToNow(registeredDate, { addSuffix: true, locale: dateLocale })
                    .replace(/^about /i, "")
                    .replace(/^sekitar /i, "");
                  
                  // Same parsing exact logic from game-sessions
                  const dateFormatStr = locale === "id"
                    ? "EEEE d MMMM yyyy 'jam' HH.mm"
                    : "EEEE, d MMM yyyy 'at' HH:mm";

                  const fullDate = format(registeredDate, dateFormatStr, { locale: dateLocale });

                  return (
                    <TableRow key={player.id}>
                      {/* Rank */}
                      <TableCell className="text-center">
                        {rank <= 3 ? (
                          <span className={`inline-flex items-center justify-center h-6 w-6 rounded-full text-xs font-bold ${
                            rank === 1 ? "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400" :
                            rank === 2 ? "bg-gray-300/20 text-gray-500" :
                            "bg-orange-500/20 text-orange-600 dark:text-orange-400"
                          }`}>
                            {rank}
                          </span>
                        ) : (
                          <span className="text-sm text-muted-foreground">{rank}</span>
                        )}
                      </TableCell>

                      {/* Player */}
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-7 w-7">
                            <AvatarImage src={player.avatar || undefined} />
                            <AvatarFallback className="text-[10px]">
                              {player.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <Link href={`/users/${player.id}`} className="font-medium text-sm hover:text-primary transition-colors cursor-pointer">
                            {player.name}
                          </Link>
                        </div>
                      </TableCell>

                      {/* Games Played */}
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1 text-muted-foreground">
                          <Gamepad2 className="h-3.5 w-3.5" />
                          <span>{player.gamesPlayed}</span>
                        </div>
                      </TableCell>

                      {/* Avg Score */}
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Trophy className="h-3.5 w-3.5 text-yellow-500" />
                          <span className="font-medium">{player.avgScore.toFixed(1)}</span>
                        </div>
                      </TableCell>

                      {/* Registration Date */}
                      <TableCell className="text-right text-xs text-muted-foreground whitespace-nowrap">
                        <span
                          title={fullDate}
                          className="cursor-help decoration-dashed decoration-muted-foreground/50 underline-offset-4 hover:underline"
                        >
                          {timeAgo}
                        </span>
                      </TableCell>

                      {/* Action */}
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted/50 cursor-pointer">
                              <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => {
                              setPlayerToToggle(player);
                              setIsAlertOpen(true);
                            }}>
                              {player.isFinalist 
                                ? (t("action.remove_from_finalist") || "Remove from Finalist")
                                : (t("action.move_to_finalist") || "Move to Finalist")}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>


      {/* Alert Dialog using Shadcn */}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {playerToToggle?.isFinalist ? (t("comp_detail.remove_confirm_title") || "Remove from Finalist?") : (t("comp_detail.add_confirm_title") || "Move to Finalist?")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {playerToToggle?.isFinalist 
                ? (t("comp_detail.remove_confirm_desc") || `Are you sure you want to remove ${playerToToggle?.name || "this player"} from the finalist list?`)
                : (t("comp_detail.add_confirm_desc") || `Are you sure you want to move ${playerToToggle?.name || "this player"} to the finalist list?`)}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button variant="outline" onClick={() => setPlayerToToggle(null)}>
                {t("action.cancel") || "Cancel"}
              </Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button onClick={handleToggleFinalist}>
                {t("action.confirm") || "Confirm"}
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
