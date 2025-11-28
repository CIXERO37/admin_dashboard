"use client"

import type React from "react"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface Column {
  key: string
  label: string
  render?: (value: unknown, row: Record<string, unknown>) => React.ReactNode
}

interface DataTableProps {
  columns: Column[]
  data: Record<string, unknown>[]
  className?: string
}

export function DataTable({ columns, data, className }: DataTableProps) {
  return (
    <div className={cn("rounded-xl border border-border bg-card overflow-hidden", className)}>
      <Table>
        <TableHeader>
          <TableRow className="border-border bg-secondary/50 hover:bg-secondary/50">
            {columns.map((column) => (
              <TableHead key={column.key} className="text-muted-foreground font-medium">
                {column.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, rowIndex) => (
            <TableRow key={rowIndex} className="border-border transition-colors hover:bg-secondary/60">
              {columns.map((column) => (
                <TableCell key={column.key} className="text-foreground">
                  {column.render ? column.render(row[column.key], row) : (row[column.key] as React.ReactNode)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

// Status badge helper
export function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, string> = {
    Active: "bg-[var(--success)]/20 text-[var(--success)] border-[var(--success)]/30",
    Pending: "bg-[var(--warning)]/20 text-[var(--warning)] border-[var(--warning)]/30",
    "In Progress": "bg-primary/20 text-primary border-primary/30",
    Resolved: "bg-[var(--success)]/20 text-[var(--success)] border-[var(--success)]/30",
    "Under Review": "bg-[var(--warning)]/20 text-[var(--warning)] border-[var(--warning)]/30",
    Hidden: "bg-muted text-muted-foreground border-border",
    Inactive: "bg-muted text-muted-foreground border-border",
    Draft: "bg-secondary text-secondary-foreground border-border",
  }

  return (
    <Badge variant="outline" className={cn("font-medium", variants[status] || variants["Inactive"])}>
      {status}
    </Badge>
  )
}

export function PriorityBadge({ priority }: { priority: string }) {
  const variants: Record<string, string> = {
    High: "bg-destructive/20 text-destructive border-destructive/30",
    Medium: "bg-[var(--warning)]/20 text-[var(--warning)] border-[var(--warning)]/30",
    Low: "bg-[var(--success)]/20 text-[var(--success)] border-[var(--success)]/30",
  }

  return (
    <Badge variant="outline" className={cn("font-medium", variants[priority] || "")}>
      {priority}
    </Badge>
  )
}
