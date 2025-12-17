"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Maximize2, X, Play, ChevronDown, ChevronUp } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getAvatarUrl } from "@/lib/utils";

// Map of referrer paths to display names and parent links
const referrerConfig: Record<
  string,
  { name: string; parentHref?: string; parentName?: string }
> = {
  "/administrator/user": {
    name: "Users",
    parentHref: "/administrator",
    parentName: "Administrator",
  },
  "/support/report": {
    name: "Report",
    parentHref: "/support",
    parentName: "Support",
  },
  "/support/quiz": {
    name: "Quiz Approval",
    parentHref: "/support",
    parentName: "Support",
  },
  "/groups": {
    name: "Groups",
  },
  "/master/quiz": {
    name: "Quiz",
    parentHref: "/master",
    parentName: "Master Data",
  },
  "/dashboard": { name: "Dashboard" },
};

interface ProfileBreadcrumbProps {
  name: string;
}

export function ProfileBreadcrumb({ name }: ProfileBreadcrumbProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const referrer = searchParams.get("from");

  // Get the config for the referrer
  const config = referrer ? referrerConfig[referrer] : null;

  // Check if referrer is already the Users page
  const isFromUsersPage = referrer === "/administrator/user";

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {config && (
          <>
            {/* Parent link (e.g., Administrator, Support, Master Data) */}
            {config.parentHref && config.parentName && (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link
                      href={config.parentHref}
                      className="hover:text-foreground transition-colors"
                    >
                      {config.parentName}
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </>
            )}
            {/* Referrer page link (e.g., Group, Report, Quiz) */}
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link
                  href={referrer!}
                  className="hover:text-foreground transition-colors"
                >
                  {config.name}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </>
        )}
        {/* Always show Users link (except when coming from Users page) */}
        {!isFromUsersPage && (
          <>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link
                  href="/administrator/user"
                  className="hover:text-foreground transition-colors"
                >
                  Users
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </>
        )}
        <BreadcrumbItem>
          <BreadcrumbPage>{name}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

interface AvatarDialogProps {
  avatarUrl?: string | null;
  fullname?: string | null;
}

export function AvatarDialog({ avatarUrl, fullname }: AvatarDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Avatar
        className="h-16 w-16 cursor-pointer hover:ring-2 hover:ring-primary transition-all"
        onClick={() => setOpen(true)}
      >
        <AvatarImage src={getAvatarUrl(avatarUrl)} />
        <AvatarFallback className="text-xl">
          {fullname?.[0] ?? "?"}
        </AvatarFallback>
      </Avatar>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md p-0 overflow-hidden bg-transparent border-none">
          <DialogTitle className="sr-only">Avatar {fullname}</DialogTitle>
          <div className="relative">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-2 right-2 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            <img
              src={getAvatarUrl(avatarUrl)}
              alt={fullname ?? "Avatar"}
              className="w-full h-auto rounded-xl"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

interface MapDialogProps {
  latitude: number;
  longitude: number;
  locationName: string;
}

export function MapDialog({
  latitude,
  longitude,
  locationName,
}: MapDialogProps) {
  const [open, setOpen] = useState(false);

  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${
    longitude - 0.5
  }%2C${latitude - 0.5}%2C${longitude + 0.5}%2C${
    latitude + 0.5
  }&layer=mapnik&marker=${latitude}%2C${longitude}`;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="p-2 rounded-lg hover:bg-secondary/60 transition-colors"
      >
        <Maximize2 className="h-5 w-5 text-muted-foreground" />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="!max-w-none w-screen h-screen p-0 overflow-hidden rounded-none border-none m-0 translate-x-0 translate-y-0 top-0 left-0">
          <DialogTitle className="sr-only">Map - {locationName}</DialogTitle>
          <div className="relative w-full h-full">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-card/90 backdrop-blur-sm border border-border text-foreground hover:bg-secondary transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[calc(50%+40px)] z-10 pointer-events-none">
              <div className="bg-card/95 backdrop-blur-sm rounded-lg px-4 py-2 border border-border shadow-lg">
                <p className="text-sm font-medium text-foreground whitespace-nowrap">
                  {locationName}
                </p>
              </div>
            </div>
            <iframe
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src={mapUrl}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

interface UserQuiz {
  id: string;
  title: string;
  play_count: number;
  avg_score: number;
}

interface TopQuizzesListProps {
  quizzes: UserQuiz[];
}

export function TopQuizzesList({ quizzes }: TopQuizzesListProps) {
  const [showAll, setShowAll] = useState(false);
  const INITIAL_COUNT = 3;

  const displayedQuizzes = showAll ? quizzes : quizzes.slice(0, INITIAL_COUNT);
  const hasMore = quizzes.length > INITIAL_COUNT;

  return (
    <div className="space-y-3">
      {displayedQuizzes.map((quiz, index) => (
        <div
          key={quiz.id}
          className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/50"
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
            {index + 1}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{quiz.title}</p>
            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
              <span>Average: {quiz.avg_score}</span>
              <div className="flex items-center gap-1">
                <Play className="h-3 w-3" />
                <span>{quiz.play_count.toLocaleString()}x played</span>
              </div>
            </div>
          </div>
        </div>
      ))}

      {hasMore && (
        <Button
          variant="ghost"
          className="w-full mt-2 text-muted-foreground hover:text-foreground"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? (
            <>
              <ChevronUp className="h-4 w-4 mr-2" />
              Show Less
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4 mr-2" />
              Show All ({quizzes.length})
            </>
          )}
        </Button>
      )}
    </div>
  );
}
