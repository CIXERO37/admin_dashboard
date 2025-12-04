"use client";

import { useState } from "react";
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
import Link from "next/link";

export function Header() {
  const { user, loading } = useCurrentUser();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

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

  const displayName = user?.fullname || user?.username || user?.email?.split("@")[0] || "Admin";
  const displayEmail = user?.email || "-";
  return (
    <header className="flex h-16 items-center justify-end border-b border-border bg-card px-6">
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center bg-primary text-primary-foreground">
                3
              </Badge>
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

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-2">
              {loading ? (
                <>
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="hidden md:flex flex-col gap-1">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-3 w-28" />
                  </div>
                </>
              ) : (
                <>
                  <Avatar className="h-8 w-8">
                    {user?.avatar_url && <AvatarImage src={user.avatar_url} alt={displayName} />}
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getInitials(user?.fullname ?? null, user?.email ?? null)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden flex-col items-start text-left md:flex">
                    <span className="text-sm font-medium text-foreground">
                      {displayName}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {displayEmail}
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
              Akun Saya
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem asChild className="text-foreground cursor-pointer">
              <Link href="/settings/profile">
                <User className="mr-2 h-4 w-4" />
                Profil
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="text-foreground cursor-pointer">
              <Link href="/settings">
                <Settings className="mr-2 h-4 w-4" />
                Pengaturan
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem
              className="text-destructive cursor-pointer"
              onClick={() => setShowLogoutDialog(true)}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Keluar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Keluar dari akun?</AlertDialogTitle>
              <AlertDialogDescription>
                Anda akan keluar dari dashboard admin.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <AlertDialogAction onClick={handleLogout}>
                Keluar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </header>
  );
}
