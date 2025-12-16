import { Suspense } from "react";
import { notFound } from "next/navigation";

import {
  fetchProfileById,
  fetchUserQuizzes,
  fetchCreatedQuizzes,
} from "../actions";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AvatarDialog,
  ProfileBreadcrumb,
  TopQuizzesList,
} from "./profile-client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Gamepad2,
  Trophy,
  BookOpen,
  FileQuestion,
} from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

const mockTransactions = [
  {
    id: 1,
    product: "Mock premium pack",
    status: "pending",
    date: "12/10/2025",
    amount: "$39.50",
  },
  {
    id: 2,
    product: "Enterprise plan subscription",
    status: "paid",
    date: "11/15/2025",
    amount: "$159.90",
  },
  {
    id: 3,
    product: "Business board pro license",
    status: "paid",
    date: "07/13/2025",
    amount: "$89.00",
  },
  {
    id: 4,
    product: "Custom integration package",
    status: "failed",
    date: "06/13/2025",
    amount: "$299.90",
  },
  {
    id: 5,
    product: "Developer toolkit license",
    status: "paid",
    date: "08/15/2025",
    amount: "$129.90",
  },
  {
    id: 6,
    product: "Support package renewal",
    status: "pending",
    date: "07/22/2025",
    amount: "$19.90",
  },
];

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-600 border-yellow-500/30",
  paid: "bg-green-500/20 text-green-600 border-green-500/30",
  failed: "bg-red-500/20 text-red-600 border-red-500/30",
};

export default async function ProfileDetailPage({ params }: PageProps) {
  const { id } = await params;
  const [profileResult, quizzesResult, createdQuizzesResult] =
    await Promise.all([
      fetchProfileById(id),
      fetchUserQuizzes(id),
      fetchCreatedQuizzes(id),
    ]);

  const { data: profile, error } = profileResult;
  const { data: userQuizzes } = quizzesResult;
  const { data: createdQuizzes } = createdQuizzesResult;

  if (error || !profile) {
    notFound();
  }

  const profileCompletion = 86;
  const role = profile.role === "admin" ? "Administrator" : "Project Manager";

  return (
    <div className="space-y-4">
      <Suspense
        fallback={
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Users</BreadcrumbPage>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>
                  {profile.fullname || profile.username || "Unknown"}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        }
      >
        <ProfileBreadcrumb
          name={profile.fullname || profile.username || "Unknown"}
        />
      </Suspense>

      <div className="flex flex-col lg:flex-row lg:items-start gap-6">
        {/* Left Sidebar */}
        <div className="lg:w-80">
          {/* Profile Card */}
          <Card>
            <CardContent className="pt-6 pb-6">
              <div className="flex flex-col items-center text-center">
                <AvatarDialog
                  avatarUrl={profile.avatar_url}
                  fullname={profile.fullname}
                />
                <h2 className="mt-2 text-xl font-semibold">
                  {profile.fullname ?? "-"}
                </h2>
                <p className="text-sm text-muted-foreground">
                  @{profile.username}
                </p>

                {/* Stats */}
                <div className="flex justify-center gap-6 mt-2 pt-2 border-t w-full">
                  <div className="text-center">
                    <p className="text-xl font-bold">
                      {profile.following_count ?? 0}
                    </p>
                    <p className="text-xs text-muted-foreground">Following</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold">
                      {profile.followers_count ?? 0}
                    </p>
                    <p className="text-xs text-muted-foreground">Followers</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold">
                      {profile.friends_count
                        ? `${(profile.friends_count / 1000).toFixed(1)}K`
                        : "0"}
                    </p>
                    <p className="text-xs text-muted-foreground">Friends</p>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="mt-3 space-y-1.5 text-sm">
                {profile.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground truncate">
                      {profile.email}
                    </span>
                  </div>
                )}
                {profile.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {profile.phone}
                    </span>
                  </div>
                )}
                {(profile.city || profile.state || profile.country) && (
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {[profile.city?.name, profile.state?.name]
                        .filter(Boolean)
                        .join(", ") || "-"}
                    </span>
                  </div>
                )}
                {profile.organization && (
                  <div className="flex items-center gap-3">
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {profile.organization}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Quiz Terbanyak Dimainkan */}
          <Card>
            <CardHeader className="flex-row items-center justify-between pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Trophy className="h-4 w-4 text-amber-500" />
                Most Played Quizzes
              </CardTitle>
            </CardHeader>
            <CardContent>
              {userQuizzes.length > 0 ? (
                <TopQuizzesList quizzes={userQuizzes} />
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Gamepad2 className="h-12 w-12 text-muted-foreground/50 mb-3" />
                  <p className="text-muted-foreground">No quizzes played yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Transaction History & Connections - Full Width */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Transaction History */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockTransactions.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell className="text-blue-500 font-medium">
                      {tx.product}
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[tx.status]}>
                        {tx.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {tx.date}
                    </TableCell>
                    <TableCell className="text-right">{tx.amount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Quiz yang Dibuat */}
        <Card>
          <CardHeader className="flex-row items-center justify-between pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-blue-500" />
              Created Quizzes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {createdQuizzes.length > 0 ? (
              <div className="space-y-3">
                {createdQuizzes.map((quiz, index) => (
                  <div
                    key={quiz.id}
                    className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/10 text-blue-500 font-bold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{quiz.title}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                        {quiz.category && (
                          <Badge variant="secondary" className="text-xs">
                            {quiz.category}
                          </Badge>
                        )}
                        <div className="flex items-center gap-1">
                          <FileQuestion className="h-3 w-3" />
                          <span>{quiz.question_count} questions</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <BookOpen className="h-12 w-12 text-muted-foreground/50 mb-3" />
                <p className="text-muted-foreground">No quizzes created yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
