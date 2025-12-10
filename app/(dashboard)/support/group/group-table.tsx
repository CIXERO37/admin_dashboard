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
import Link from "next/link"

import { cn, getAvatarUrl } from "@/lib/utils"
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
  onDelete: (id: string, name: string) => void
}

function GroupCard({ group, onDelete }: GroupCardProps) {
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
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href={`/support/group/${group.id}`}>
                  <Eye className="h-4 w-4 mr-2" />
                  Detail
                </Link>
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
          <p className="text-sm font-medium text-foreground truncate">{creatorName}</p>
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
          asChild
        >
          <Link href={`/support/group/${group.id}`}>
            <Eye className="h-4 w-4" />
            Detail
          </Link>
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
          <div className="relative">
            <Input
              placeholder="Search group..."
              className="pr-10 w-64 bg-background border-border"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              onClick={handleSearch}
              disabled={isPending}
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 flex items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              <Search className="h-3.5 w-3.5" />
            </button>
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
              {(() => {
                const pages: (number | string)[] = []

                if (totalPages <= 7) {
                  for (let i = 1; i <= totalPages; i++) {
                    pages.push(i)
                  }
                } else {
                  pages.push(1)

                  if (currentPage <= 3) {
                    pages.push(2, 3, 4, "...", totalPages)
                  } else if (currentPage >= totalPages - 2) {
                    pages.push("...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
                  } else {
                    pages.push("...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages)
                  }
                }

                return pages.map((page, index) => {
                  if (page === "...") {
                    return (
                      <span
                        key={`ellipsis-${index}`}
                        className="w-9 h-9 flex items-center justify-center text-sm text-muted-foreground"
                      >
                        ...
                      </span>
                    )
                  }

                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page as number)}
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
                })
              })()}
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
