"use client"
import { SectionHeader } from "@/components/dashboard/section-header"
import { DataTable, StatusBadge } from "@/components/dashboard/data-table"
import { activeSubscribers } from "@/lib/dummy-data"
import { Button } from "@/components/ui/button"
import { Download, Plus } from "lucide-react"

export default function BillingActivePage() {
  const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Company" },
    { key: "email", label: "Email" },
    { key: "plan", label: "Plan" },
    { key: "amount", label: "Amount" },
    { key: "nextBilling", label: "Next Billing" },
    {
      key: "status",
      label: "Status",
      render: (value: unknown) => <StatusBadge status={value as string} />,
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Active Subscribers</h1>
        <p className="mt-1 text-muted-foreground">Manage all active paying customers</p>
      </div>

      <SectionHeader
        title="All Active Subscribers"
        description={`${activeSubscribers.length} active subscriptions`}
        action={
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Subscriber
            </Button>
          </div>
        }
      />

      <DataTable columns={columns} data={activeSubscribers as unknown as Record<string, unknown>[]} />
    </div>
  )
}
