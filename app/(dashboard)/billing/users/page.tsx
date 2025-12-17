"use client"
import { SectionHeader } from "@/components/dashboard/section-header"
import { DataTable, StatusBadge } from "@/components/dashboard/data-table"
import { activeSubscribers, unpaidUsers } from "@/lib/dummy-data"
import { Button } from "@/components/ui/button"
import { Download, Plus } from "lucide-react"

export default function BillingUsersPage() {
  const allUsers = [
    ...activeSubscribers.map((user) => ({
      ...user,
      status: "Active",
    })),
    ...unpaidUsers.map((user) => ({
      ...user,
      status: "Unpaid",
    })),
  ]

  const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Company" },
    { key: "email", label: "Email" },
    { key: "plan", label: "Plan" },
    { key: "amount", label: "Amount" },
    {
      key: "status",
      label: "Status",
      render: (value: unknown) => <StatusBadge status={value as string} />,
    },
  ]

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Billing Users</h1>
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>


      <DataTable columns={columns} data={allUsers as unknown as Record<string, unknown>[]} />
    </div>
  )
}
