"use client";

import { useState, useEffect } from "react";
import { Bell, User, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { logout } from "@/app/login/actions";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { getAvatarUrl } from "@/lib/utils";
import Link from "next/link";

import { ThemeCustomizer } from "@/components/theme-customizer";
import { ModeToggle } from "@/components/mode-toggle";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { useTranslation } from "@/lib/i18n";
import { useSidebar } from "@/components/ui/sidebar";
import Image from "next/image";

export function Header() {
  const { t } = useTranslation();
  const { user, loading } = useCurrentUser();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { open } = useSidebar();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Show loading state on SSR and until mounted to prevent hydration mismatch
  const isLoading = !mounted || loading;

  const handleLogout = async () => {
    await logout();
  };

  const getInitials = (name: string | null, email: string | null) => {
    if (name) {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    if (email) {
      return email.slice(0, 2).toUpperCase();
    }
    return "AD";
  };

  const displayName =
    user?.fullname || user?.username || user?.email?.split("@")[0] || "Admin";
  const displayEmail = user?.email || "-";

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6">
      <div className="flex items-center">
        {/* Show logo only when sidebar is collapsed (!open) */}
        {!open && mounted && (
          <Link href="/dashboard" className="flex items-center">
            <Image
              src="/icons/gameforsmartlogo.webp"
              alt="Gameforsmart"
              width={150}
              height={32}
              className="object-contain"
            />
          </Link>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* ... existing right content ... */}
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              suppressHydrationWarning
            >
              <Bell className="h-5 w-5 text-muted-foreground" />
              <Badge className="absolute -right-1 -top-1 h-2 w-2 rounded-full p-0 bg-red-500 border-2 border-background" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-80 bg-popover border-border"
          >
            <DropdownMenuLabel className="text-foreground">
              Notifications
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem className="text-foreground">
              <div className="flex flex-col gap-1">
                <span className="font-medium">New report submitted</span>
                <span className="text-xs text-muted-foreground">
                  2 minutes ago
                </span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-foreground">
              <div className="flex flex-col gap-1">
                <span className="font-medium">Payment received</span>
                <span className="text-xs text-muted-foreground">
                  1 hour ago
                </span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-foreground">
              <div className="flex flex-col gap-1">
                <span className="font-medium">New user registered</span>
                <span className="text-xs text-muted-foreground">
                  3 hours ago
                </span>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Mode Toggle */}
        <ModeToggle />

        {/* Language Switcher */}
        <LanguageSwitcher />

        {/* Settings */}
        <ThemeCustomizer />

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 px-2"
              suppressHydrationWarning
            >
              {isLoading ? (
                <>
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="hidden md:flex flex-col gap-1">
                    <Skeleton className="h-4 w-24" />
                  </div>
                </>
              ) : (
                <>
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={getAvatarUrl(user?.avatar_url)}
                      alt={displayName}
                    />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getInitials(user?.fullname ?? null, user?.email ?? null)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden flex-col items-start text-left md:flex">
                    <span className="text-sm font-medium text-foreground">
                      {displayName}
                    </span>
                  </div>
                </>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 bg-popover border-border"
          >
            <DropdownMenuLabel className="text-foreground">
              {t("header.my_account")}
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem
              asChild
              className="text-foreground cursor-pointer"
            >
              <Link href="/settings/profile">
                <User className="mr-2 h-4 w-4" />
                {t("header.profile")}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              asChild
              className="text-foreground cursor-pointer"
            >
              <Link href="/settings">
                <Settings className="mr-2 h-4 w-4" />
                {t("header.settings")}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem
              className="text-destructive cursor-pointer"
              onClick={() => setShowLogoutDialog(true)}
            >
              <LogOut className="mr-2 h-4 w-4" />
              {t("header.logout")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t("header.logout_title")}</AlertDialogTitle>
              <AlertDialogDescription>
                {t("header.logout_desc")}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t("header.cancel")}</AlertDialogCancel>
              <AlertDialogAction onClick={handleLogout}>
                {t("header.logout")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </header>
  );
}
