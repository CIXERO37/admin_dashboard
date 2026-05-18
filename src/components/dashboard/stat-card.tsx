"use client"

import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"
import Link from "next/link"

interface StatCardProps {
  title: string
  value: string | number
  change?: string
  changeType?: "increase" | "decrease" | "neutral"
  icon: LucideIcon
  description?: string
  href?: string
}

export function StatCard({ title, value, change, changeType = "neutral", icon: Icon, description, href }: StatCardProps) {
  const cardClassName = cn(
    "group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary hover:shadow-xl hover:shadow-primary/20",
    href && "cursor-pointer block"
  )

  const cardContent = (
    <>
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/80 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold tracking-tight text-foreground" suppressHydrationWarning>
            {value}
          </p>
          {change && (
            <div className="flex items-center gap-1">
              <span
                className={cn(
                  "text-xs font-medium",
                  changeType === "increase" && "text-[var(--success)]",
                  changeType === "decrease" && "text-destructive",
                  changeType === "neutral" && "text-muted-foreground",
                )}
              >
                {change}
              </span>
              {description && <span className="text-xs text-muted-foreground">{description}</span>}
            </div>
          )}
        </div>
        <div className="rounded-lg bg-primary/10 p-3 transition-all duration-300 group-hover:bg-primary group-hover:scale-110">
          <Icon className="h-5 w-5 text-primary transition-colors group-hover:text-primary-foreground" />
        </div>
      </div>
    </>
  )

  if (href) {
    return (
      <Link href={href} className={cardClassName}>
        {cardContent}
      </Link>
    )
  }

  return (
    <div className={cardClassName}>
      {cardContent}
    </div>
  )
}
