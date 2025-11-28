"use client"
import { SectionHeader } from "@/components/dashboard/section-header"
import { DataTable, StatusBadge } from "@/components/dashboard/data-table"
import { adminUsers } from "@/lib/dummy-data"
import { Button } from "@/components/ui/button"
import { Plus, Download } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function AdministratorUserPage() {
  const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    {
      key: "role",
      label: "Role",
      render: (value: unknown) => {
        const colors: Record<string, string> = {
          "Super Admin": "bg-primary/20 text-primary border-primary/30",
          Manager: "bg-[var(--success)]/20 text-[var(--success)] border-[var(--success)]/30",
          Support: "bg-[var(--warning)]/20 text-[var(--warning)] border-[var(--warning)]/30",
          Billing: "bg-chart-2/20 text-chart-2 border-chart-2/30",
        }
        return (
          <Badge variant="outline" className={colors[value as string]}>
            {value as string}
          </Badge>
        )
      },
    },
    { key: "permissions", label: "Permissions" },
    { key: "lastLogin", label: "Last Login" },
    {
      key: "status",
      label: "Status",
      render: (value: unknown) => <StatusBadge status={value as string} />,
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Admin Users</h1>
        <p className="mt-1 text-muted-foreground">Manage all administrator accounts and permissions</p>
      </div>

      <SectionHeader
        title="All Admin Users"
        description={`${adminUsers.length} admin users`}
        action={
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Admin
            </Button>
          </div>
        }
      />

      <DataTable columns={columns} data={adminUsers as unknown as Record<string, unknown>[]} />
    </div>
  )
}
