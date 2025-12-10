"use client"

import { useState, useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  Users,
  Calendar,
  Copy,
  Check,
  Search,
  MoreVertical,
  Trash2,
  Shield,
  UserMinus,
  Crown,
  SlidersHorizontal,
} from "lucide-react"
import { format } from "date-fns"

import { cn, getAvatarUrl } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import {
  type GroupDetail,
  type GroupMember,
  removeGroupMember,
  updateMemberRole,
} from "../actions"

interface GroupDetailClientProps {
  group: GroupDetail
  members: GroupMember[]
  totalPages: number
  totalCount: number
  currentPage: number
  currentTab: string
  searchQuery: string
  roleFilter: string
}

function getGroupStatus(group: GroupDetail): { label: string; variant: "default" | "secondary" | "outline" } {
  const settings = group.settings as { status?: string } | null
  if (settings?.status === "private") {
    return { label: "PRIVATE", variant: "outline" }
  }
  return { label: "PUBLIC", variant: "secondary" }
}

function getLocation(group: GroupDetail): string {
  const settings = group.settings as { location?: string } | null
  return settings?.location || "Indonesia"
}

function getRoleBadgeStyle(role: string) {
  switch (role) {
    case "owner":
      return "bg-yellow-500/20 text-yellow-600 border-yellow-500/30"
    case "admin":
      return "bg-blue-500/20 text-blue-600 border-blue-500/30"
    default:
      return "bg-secondary text-secondary-foreground border-border"
  }
}

export function GroupDetailClient({
  group,
  members,
  totalPages,
  totalCount,
  currentPage,
  currentTab,
  searchQuery,
  roleFilter,
}: GroupDetailClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()
  
  const [copied, setCopied] = useState(false)
  const [searchInput, setSearchInput] = useState(searchQuery)

  const [removeMemberDialog, setRemoveMemberDialog] = useState<{
    open: boolean
    memberId: string
    memberName: string
  }>({ open: false, memberId: "", memberName: "" })

  const status = getGroupStatus(group)
  const location = getLocation(group)
  const coverUrl = getAvatarUrl(group.cover_url)

  const copyInviteCode = () => {
    navigator.clipboard.writeText(group.invite_code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const updateUrl = (params: Record<string, string | number>) => {
    const newParams = new URLSearchParams(searchParams.toString())
    Object.entries(params).forEach(([key, value]) => {
      if (value && value !== "" && value !== "all") {
        newParams.set(key, String(value))
      } else {
        newParams.delete(key)
      }
    })
    startTransition(() => {
      router.push(`?${newParams.toString()}`)
    })
  }

  const handleSearch = () => {
    updateUrl({ search: searchInput, page: 1 })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch()
  }

  const handlePageChange = (page: number) => {
    updateUrl({ page, search: searchQuery, role: roleFilter })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleTabChange = (tab: string) => {
    updateUrl({ tab, page: 1, search: "", role: "all" })
    setSearchInput("")
  }

  const handleRemoveMember = async () => {
    const { error } = await removeGroupMember(group.id, removeMemberDialog.memberId)
    if (error) {
      toast({ title: "Error", description: "Failed to remove member", variant: "destructive" })
    } else {
      toast({ title: "Success", description: "Member removed successfully" })
      router.refresh()
    }
    setRemoveMemberDialog({ open: false, memberId: "", memberName: "" })
  }

  const handleRoleChange = async (userId: string, newRole: string) => {
    const { error } = await updateMemberRole(group.id, userId, newRole)
    if (error) {
      toast({ title: "Error", description: "Failed to update role", variant: "destructive" })
    } else {
      toast({ title: "Success", description: "Role updated successfully" })
      router.refresh()
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/support/group">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-foreground">Group Detail</h1>
        </div>
      </div>

      {/* Group Info Card */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {/* Cover */}
        <div 
          className="h-40 bg-gradient-to-br from-primary/30 via-primary/20 to-primary/10"
          style={coverUrl ? {
            backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.4)), url(${coverUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          } : undefined}
        />

        {/* Info */}
        <div className="relative px-6 pb-6">
          {/* Avatar */}
          <div className="absolute -top-12 left-6">
            <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
              <AvatarImage src={getAvatarUrl(group.avatar_url)} alt={group.name} />
              <AvatarFallback className="text-2xl font-bold bg-primary text-primary-foreground">
                {group.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Details */}
          <div className="pt-14 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-foreground">{group.name}</h2>
                <Badge
                  className={`text-xs font-semibold ${
                    status.variant === "secondary"
                      ? "bg-green-500 text-white border-green-500"
                      : "bg-muted text-muted-foreground border-border"
                  }`}
                >
                  {status.label}
                </Badge>
              </div>
              {group.description && (
                <p className="text-muted-foreground max-w-xl">{group.description}</p>
              )}
              <p className="text-sm text-muted-foreground">{location}</p>
            </div>


          </div>

          {/* Invite Code & Creator */}
          <div className="mt-6 flex flex-col md:flex-row gap-4">
            <div className="flex-1 p-4 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Invite Code</p>
              <div className="flex items-center gap-2">
                <code className="text-lg font-mono font-semibold text-foreground">{group.invite_code}</code>
                <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer" onClick={copyInviteCode}>
                  {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="flex-1 p-4 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Created by</p>
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border border-border">
                  <AvatarImage src={getAvatarUrl(group.creator?.avatar_url)} />
                  <AvatarFallback className="text-sm">
                    {(group.creator?.fullname || "?").slice(0, 1)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{group.creator?.fullname || "Unknown"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={currentTab} onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="members">Members ({totalCount})</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Tab Content */}
      {currentTab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{group.member_count}</p>
                <p className="text-sm text-muted-foreground">Total Members</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-bold">
                  {group.created_at ? format(new Date(group.created_at), "dd MMMM yyyy") : "-"}
                </p>
                <p className="text-sm text-muted-foreground">Date Created</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-bold capitalize">{status.label.toLowerCase()}</p>
                <p className="text-sm text-muted-foreground">Privacy</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {currentTab === "members" && (
        <div className="space-y-4">
          {/* Search & Filter */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Input
                placeholder="Search member..."
                className="pr-10 bg-background border-border"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button
                onClick={handleSearch}
                disabled={isPending}
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 flex items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors cursor-pointer"
              >
                <Search className="h-3.5 w-3.5" />
              </button>
            </div>

            <Select value={roleFilter} onValueChange={(value) => updateUrl({ role: value, page: 1 })}>
              <SelectTrigger className="w-36">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4" />
                  <SelectValue placeholder="Role" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="owner">Owner</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="member">Member</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Members List */}
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            {members.length > 0 ? (
              <div className="divide-y divide-border">
                {members.map((member, index) => {
                  const name = member.fullname || member.username || "Unknown"
                  const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
                  
                  return (
                    <div key={member.user_id || index} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border border-border">
                          <AvatarImage src={getAvatarUrl(member.avatar_url)} alt={name} />
                          <AvatarFallback className="text-sm">{initials}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{name}</p>
                            {member.role === "owner" && <Crown className="h-4 w-4 text-yellow-500" />}
                          </div>
                          <p className="text-sm text-muted-foreground">@{member.username || "-"}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className={getRoleBadgeStyle(member.role)}>
                          {member.role}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {member.joined_at ? format(new Date(member.joined_at), "dd MMM yyyy") : "-"}
                        </span>

                        {member.role !== "owner" && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {member.role !== "admin" && (
                                <DropdownMenuItem onClick={() => handleRoleChange(member.user_id, "admin")} className="cursor-pointer">
                                  <Shield className="h-4 w-4 mr-2" />
                                  Make Admin
                                </DropdownMenuItem>
                              )}
                              {member.role === "admin" && (
                                <DropdownMenuItem onClick={() => handleRoleChange(member.user_id, "member")} className="cursor-pointer">
                                  <UserMinus className="h-4 w-4 mr-2" />
                                  Remove Admin
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => setRemoveMemberDialog({ open: true, memberId: member.user_id, memberName: name })}
                                className="cursor-pointer text-destructive focus:text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Remove from Group
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Users className="h-12 w-12 text-muted-foreground mb-3" />
                <h3 className="font-medium">No members found</h3>
                <p className="text-sm text-muted-foreground">
                  {searchQuery ? "Try a different search" : "This group has no members yet"}
                </p>
              </div>
            )}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between rounded-xl border border-border bg-card px-6 py-4">
            <div className="text-sm text-muted-foreground">
              Page <span className="font-medium text-foreground">{currentPage}</span> of{" "}
              <span className="font-medium text-foreground">{totalPages || 1}</span>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1 || isPending}
                  className={cn(
                    "px-3 py-1.5 text-sm font-medium rounded-lg border transition-colors",
                    currentPage === 1 || isPending
                      ? "border-border bg-secondary/50 text-muted-foreground cursor-not-allowed"
                      : "border-border bg-card text-foreground hover:bg-secondary/80 cursor-pointer"
                  )}
                >
                  Previous
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let page = i + 1
                    if (totalPages > 5) {
                      if (currentPage > 3) page = currentPage - 2 + i
                      if (currentPage > totalPages - 2) page = totalPages - 4 + i
                    }
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        disabled={isPending}
                        className={cn(
                          "w-9 h-9 text-sm font-medium rounded-lg border transition-colors cursor-pointer",
                          currentPage === page
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-card text-foreground hover:bg-secondary/80"
                        )}
                      >
                        {page}
                      </button>
                    )
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages || isPending}
                  className={cn(
                    "px-3 py-1.5 text-sm font-medium rounded-lg border transition-colors",
                    currentPage === totalPages || isPending
                      ? "border-border bg-secondary/50 text-muted-foreground cursor-not-allowed"
                      : "border-border bg-card text-foreground hover:bg-secondary/80 cursor-pointer"
                  )}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Remove Member Dialog */}
      <Dialog open={removeMemberDialog.open} onOpenChange={(open) => setRemoveMemberDialog({ open, memberId: "", memberName: "" })}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Remove Member</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove <strong>{removeMemberDialog.memberName}</strong> from this group?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRemoveMemberDialog({ open: false, memberId: "", memberName: "" })}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRemoveMember}>
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
