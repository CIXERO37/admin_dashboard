"use client"

import { Bell, Search, User } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export function Header() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6">
      {/* Search */}
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search..." className="pl-10 bg-background border-border" />
      </div>

      {/* Actions */}
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
          <DropdownMenuContent align="end" className="w-80 bg-popover border-border">
            <DropdownMenuLabel className="text-foreground">Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem className="text-foreground">
              <div className="flex flex-col gap-1">
                <span className="font-medium">New report submitted</span>
                <span className="text-xs text-muted-foreground">2 minutes ago</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-foreground">
              <div className="flex flex-col gap-1">
                <span className="font-medium">Payment received</span>
                <span className="text-xs text-muted-foreground">1 hour ago</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-foreground">
              <div className="flex flex-col gap-1">
                <span className="font-medium">New user registered</span>
                <span className="text-xs text-muted-foreground">3 hours ago</span>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground">AD</AvatarFallback>
              </Avatar>
              <div className="hidden flex-col items-start text-left md:flex">
                <span className="text-sm font-medium text-foreground">Admin User</span>
                <span className="text-xs text-muted-foreground">admin@saas.com</span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-popover border-border">
            <DropdownMenuLabel className="text-foreground">My Account</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem className="text-foreground">
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="text-foreground">Settings</DropdownMenuItem>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem className="text-destructive">Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
