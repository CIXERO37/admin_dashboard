"use client"

import { SectionHeader } from "@/components/dashboard/section-header"
import { DataTable } from "@/components/dashboard/data-table"
import { unpaidUsers } from "@/lib/dummy-data"
import { Button } from "@/components/ui/button"
import { Download, Mail } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function BillingUnpaidPage() {
  const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Company" },
    { key: "email", label: "Email" },
    { key: "plan", label: "Plan" },
    { key: "amount", label: "Amount" },
    { key: "dueDate", label: "Due Date" },
    {
      key: "daysPast",
      label: "Days Past",
      render: (value: unknown) => (
        <Badge variant="outline" className="bg-destructive/20 text-destructive border-destructive/30">
          {value as number} days
        </Badge>
      ),
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Unpaid Invoices</h1>
        <p className="mt-1 text-muted-foreground">Manage overdue payments and send reminders</p>
      </div>

      <SectionHeader
        title="All Unpaid Invoices"
        description={`${unpaidUsers.length} unpaid invoices`}
        action={
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Mail className="mr-2 h-4 w-4" />
              Send Reminders
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        }
      />

      <DataTable columns={columns} data={unpaidUsers as unknown as Record<string, unknown>[]} />
    </div>
  )
}
