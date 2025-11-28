"use client"

import { Download, Plus } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

import { SectionHeader } from "@/components/dashboard/section-header"
import { DataTable, StatusBadge } from "@/components/dashboard/data-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useProfiles } from "@/hooks/useProfiles"

const roleColors: Record<string, string> = {
  admin: "bg-primary/20 text-primary border-primary/30",
  manager: "bg-[var(--success)]/20 text-[var(--success)] border-[var(--success)]/30",
  support: "bg-[var(--warning)]/20 text-[var(--warning)] border-[var(--warning)]/30",
  billing: "bg-chart-2/20 text-chart-2 border-chart-2/30",
}

export default function AdministratorUserPage() {
  const { data: profiles, loading, error } = useProfiles()

  const columns = [
    {
      key: "account",
      label: "Account",
      render: (_: unknown, row: Record<string, unknown>) => {
        const name = (row.fullname as string) || (row.username as string) || "Unknown user"
        const email = (row.email as string) || "No email"
        const avatar = row.avatar as string | undefined
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src={avatar} alt={name} />
              <AvatarFallback>{getInitials(name)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium leading-tight">{name}</p>
              <p className="text-xs text-muted-foreground">{email}</p>
            </div>
          </div>
        )
      },
    },
    { key: "username", label: "Username" },
    {
      key: "role",
      label: "Role",
      render: (value: unknown) => {
        const role = (value as string) || "user"
        return (
          <Badge
            variant="outline"
            className={roleColors[role.toLowerCase()] ?? "bg-secondary text-secondary-foreground border-border"}
          >
            {formatRole(role)}
          </Badge>
        )
      },
    },
    { key: "lastActive", label: "Last Active" },
    {
      key: "status",
      label: "Status",
      render: (value: unknown) => <StatusBadge status={value as string} />,
    },
  ]

  const tableData =
    profiles.map((profile) => ({
      id: profile.id,
      account: profile.id,
      avatar: profile.avatar_url ?? undefined,
      fullname: profile.fullname,
      username: profile.username ?? "—",
      email: profile.email,
      role: profile.role ?? "user",
      lastActive: profile.last_active ? formatDistanceToNow(new Date(profile.last_active), { addSuffix: true }) : "Never",
      status: profile.is_blocked ? "Inactive" : "Active",
    })) ?? []

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Admin Users</h1>
        <p className="mt-1 text-muted-foreground">Manage all administrator accounts and permissions</p>
      </div>

      <SectionHeader
        title="All Admin Users"
        description={`${profiles.length} admin users`}
        action={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button size="sm" disabled>
              <Plus className="mr-2 h-4 w-4" />
              Add Admin
            </Button>
          </div>
        }
      />

      {error ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : (
        <DataTable columns={columns} data={(loading ? [] : (tableData as Record<string, unknown>[]))} />
      )}

      {loading && <p className="text-sm text-muted-foreground">Loading administrator data...</p>}
    </div>
  )
}

function formatRole(role: string) {
  if (!role) return "User"
  return role
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

function getInitials(name: string) {
  const parts = name.split(" ")
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}
