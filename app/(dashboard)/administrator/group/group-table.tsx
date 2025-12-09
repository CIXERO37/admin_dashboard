"use client"

import {
  Search,
  Users,
  MoreVertical,
  Calendar,
  Eye,
  Trash2,
  SlidersHorizontal,
} from "lucide-react"
import { useState, useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"

import { getAvatarUrl } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { type Group, deleteGroupAction } from "./actions"

interface GroupTableProps {
  initialData: Group[]
  totalPages: number
  currentPage: number
  searchQuery: string
  statusFilter?: string
}

function formatDate(dateString?: string | null): string {
  if (!dateString) return "-"
  const date = new Date(dateString)
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

function getGroupStatus(group: Group): { label: string; variant: "default" | "secondary" | "outline" } {
  const settings = group.settings as { status?: string } | null
  
  if (settings?.status === "private") {
    return { label: "PRIVATE", variant: "outline" }
  }
  return { label: "PUBLIC", variant: "secondary" }
}

function getLocation(group: Group): string {
  const settings = group.settings as { location?: string } | null
  return settings?.location || "Indonesia"
}

interface GroupCardProps {
  group: Group & { member_count: number }
  onViewDetail: (group: Group & { member_count: number }) => void
  onDelete: (id: string, name: string) => void
}

function GroupCard({ group, onViewDetail, onDelete }: GroupCardProps) {
  const name = group.name || "Unknown Group"
  const avatarUrl = group.avatar_url
  const coverUrl = getAvatarUrl(group.cover_url)
  const status = getGroupStatus(group)
  const location = getLocation(group)
  const initials = name.split(" ").map((word) => word[0]).join("").slice(0, 3).toUpperCase()
  const creator = group.creator
  const creatorName = creator?.fullname || "Unknown"
  const creatorEmail = creator?.email || "-"
  const creatorInitials = creatorName.split(" ").map((word) => word[0]).join("").slice(0, 2).toUpperCase()

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-lg transition-all duration-300 hover:shadow-xl hover:border-primary/50">
      {/* Header with cover image or gradient fallback */}
      <div 
        className="relative p-4 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent"
        style={coverUrl ? {
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url(${coverUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        } : undefined}
      >
        {/* Status Badge Row */}
        <div className="flex items-center justify-between mb-3">
          <Badge
            variant={status.variant}
            className={`text-[10px] font-semibold px-2 py-0.5 ${
              status.variant === "secondary"
                ? "bg-green-500/90 text-white border-green-500"
                : "bg-black/50 border-white/30 text-white"
            }`}
          >
            {status.label}
          </Badge>

          {/* More Options */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={`h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity ${coverUrl ? "text-white hover:bg-white/20" : ""}`}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onViewDetail(group)} className="cursor-pointer">
                <Eye className="h-4 w-4 mr-2" />
                Detail
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onDelete(group.id, name)} className="cursor-pointer text-destructive focus:text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Group
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Avatar and Name */}
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 border-2 border-white/50 shadow-md ring-2 ring-background">
            <AvatarImage src={getAvatarUrl(avatarUrl)} alt={name} />
            <AvatarFallback className="bg-muted text-muted-foreground font-bold text-sm">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className={`font-bold text-base truncate leading-tight ${coverUrl ? "text-white" : "text-foreground"}`}>{name}</h3>
            <p className={`text-xs truncate mt-0.5 ${coverUrl ? "text-white/80" : "text-muted-foreground"}`}>{location}</p>
          </div>
        </div>
      </div>

      {/* Creator Info */}
      <div className="flex-1 p-4 pt-3">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Created by</p>
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8 border border-border">
            <AvatarImage src={getAvatarUrl(creator?.avatar_url)} alt={creatorName} />
            <AvatarFallback className="bg-muted text-muted-foreground text-xs font-medium">
              {creatorInitials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-foreground truncate">{creatorName}</p>
            <p className="text-xs text-muted-foreground truncate">{creatorEmail}</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-border/50 bg-muted/30">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            <span>{formatDate(group.created_at)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5" />
            <span>{group.member_count} Members</span>
          </div>
        </div>

        {/* Detail Button */}
        <Button 
          className="w-full gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium" 
          size="sm"
          onClick={() => onViewDetail(group)}
        >
          <Eye className="h-4 w-4" />
          Detail
        </Button>
      </div>
    </div>
  )
}

export function GroupTable({
  initialData,
  totalPages,
  currentPage,
  searchQuery,
  statusFilter = "all",
}: GroupTableProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [searchInput, setSearchInput] = useState(searchQuery)
  const { toast } = useToast()

  const [viewDialog, setViewDialog] = useState<{
    open: boolean
    group: (Group & { member_count: number }) | null
  }>({
    open: false,
    group: null,
  })

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean
    id: string
    groupName: string
    confirmText: string
  }>({
    open: false,
    id: "",
    groupName: "",
    confirmText: "",
  })

  const openViewDialog = (group: Group & { member_count: number }) => {
    setViewDialog({ open: true, group })
  }

  const openDeleteDialog = (id: string, groupName: string) => {
    setDeleteDialog({ open: true, id, groupName, confirmText: "" })
  }

  const handleDeleteGroup = async () => {
    if (deleteDialog.confirmText !== "Delete") return

    const { error } = await deleteGroupAction(deleteDialog.id)
    if (error) {
      toast({ title: "Error", description: "Failed to delete group", variant: "destructive" })
    } else {
      toast({ title: "Success", description: "Group deleted successfully" })
      router.refresh()
    }
    setDeleteDialog((prev) => ({ ...prev, open: false, confirmText: "" }))
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
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const handlePageChange = (page: number) => {
    updateUrl({ page, search: searchQuery, status: statusFilter })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const groupsWithCount = initialData.map((group) => ({
    ...group,
    member_count: group.members?.length ?? 0,
  }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Manage Groups</h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search group..."
                className="pl-10 w-64 bg-background border-border"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
            <Button size="icon" onClick={handleSearch} disabled={isPending}>
              <Search className="h-4 w-4" />
            </Button>
          </div>

          <Select value={statusFilter} onValueChange={(value) => updateUrl({ status: value, page: 1 })}>
            <SelectTrigger className="w-32">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                <SelectValue placeholder="Status" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="public">Public</SelectItem>
              <SelectItem value="private">Private</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Group Cards Grid */}
      <div className={isPending ? "opacity-60 pointer-events-none" : ""}>
        {groupsWithCount.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {groupsWithCount.map((group) => (
              <GroupCard 
                key={group.id} 
                group={group} 
                onViewDetail={openViewDialog}
                onDelete={openDeleteDialog}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-border rounded-lg">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
              <Users className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-base font-medium text-foreground mb-1">No groups found</h3>
            <p className="text-sm text-muted-foreground">
              {searchQuery ? "No groups match your search" : "No groups available yet"}
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1 || isPending}
          >
            Previous
          </Button>
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let page = i + 1
              if (totalPages > 5) {
                if (currentPage > 3) page = currentPage - 2 + i
                if (currentPage > totalPages - 2) page = totalPages - 4 + i
              }
              return (
                <Button
                  key={page}
                  variant={page === currentPage ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handlePageChange(page)}
                  disabled={isPending}
                  className="w-9 h-9"
                >
                  {page}
                </Button>
              )
            })}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages || isPending}
          >
            Next
          </Button>
        </div>
      )}

      {/* View Detail Dialog */}
      <Dialog open={viewDialog.open} onOpenChange={(open) => setViewDialog((prev) => ({ ...prev, open }))}>
        <DialogContent className="max-w-md p-0 overflow-hidden">
          <DialogTitle className="sr-only">Group Detail</DialogTitle>
          {viewDialog.group && (() => {
            const group = viewDialog.group
            const coverUrl = getAvatarUrl(group.cover_url)
            const status = getGroupStatus(group)
            return (
              <>
                {/* Cover Image Header */}
                <div 
                  className="relative h-32 bg-gradient-to-br from-primary/30 via-primary/20 to-primary/10"
                  style={coverUrl ? {
                    backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.4)), url(${coverUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  } : undefined}
                >
                  {/* Status Badge */}
                  <div className="absolute top-3 left-3">
                    <Badge
                      className={`text-xs font-semibold ${
                        status.variant === "secondary"
                          ? "bg-green-500 text-white border-green-500"
                          : "bg-black/60 text-white border-white/30"
                      }`}
                    >
                      {status.label}
                    </Badge>
                  </div>
                  
                  {/* Avatar - positioned at bottom overlapping */}
                  <div className="absolute -bottom-10 left-4">
                    <Avatar className="h-20 w-20 border-4 border-background shadow-lg">
                      <AvatarImage src={getAvatarUrl(group.avatar_url)} alt={group.name} />
                      <AvatarFallback className="text-xl font-bold bg-primary text-primary-foreground">
                        {group.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </div>

                {/* Content */}
                <div className="pt-12 px-4 pb-4">
                  {/* Group Name & Location */}
                  <div className="mb-4">
                    <h2 className="text-xl font-bold text-foreground">{group.name}</h2>
                    <p className="text-sm text-muted-foreground">{getLocation(group)}</p>
                  </div>

                  {/* Description */}
                  {group.description && (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{group.description}</p>
                  )}

                  {/* Stats Row */}
                  <div className="flex items-center gap-4 mb-4 pb-4 border-b">
                    <div className="flex items-center gap-2">
                      <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-lg font-semibold">{group.member_count}</p>
                        <p className="text-xs text-muted-foreground">Members</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                        <Calendar className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{formatDate(group.created_at)}</p>
                        <p className="text-xs text-muted-foreground">Created</p>
                      </div>
                    </div>
                  </div>

                  {/* Invite Code */}
                  <div className="mb-4 p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Invite Code</p>
                    <code className="text-sm font-mono font-semibold text-foreground">{group.invite_code}</code>
                  </div>

                  {/* Creator */}
                  <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <Avatar className="h-10 w-10 border border-border">
                      <AvatarImage src={getAvatarUrl(group.creator?.avatar_url)} />
                      <AvatarFallback className="text-sm">
                        {(group.creator?.fullname || "?").slice(0, 1)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{group.creator?.fullname || "Unknown"}</p>
                      <p className="text-xs text-muted-foreground truncate">{group.creator?.email || "-"}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">Creator</Badge>
                  </div>
                </div>

                {/* Footer */}
                <div className="px-4 pb-4">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setViewDialog((prev) => ({ ...prev, open: false }))}
                  >
                    Close
                  </Button>
                </div>
              </>
            )
          })()}
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog((prev) => ({ ...prev, open, confirmText: "" }))}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle className="text-destructive">Delete Group</DialogTitle>
            <DialogDescription>
              You are about to delete group <strong>{deleteDialog.groupName}</strong>. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2 py-4">
            <Label htmlFor="confirmDelete">
              Type <strong className="text-destructive">Delete</strong> to confirm
            </Label>
            <Input
              id="confirmDelete"
              value={deleteDialog.confirmText}
              onChange={(e) => setDeleteDialog((prev) => ({ ...prev, confirmText: e.target.value }))}
              placeholder="Type 'Delete' here"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog((prev) => ({ ...prev, open: false, confirmText: "" }))}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteGroup} disabled={deleteDialog.confirmText !== "Delete"}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
