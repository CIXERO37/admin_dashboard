"use client"

import Link from "next/link"
import { type LucideIcon, ArrowRight } from "lucide-react"

interface ActionCardProps {
  title: string
  description: string
  href: string
  icon: LucideIcon
  stats?: string
}

export function ActionCard({ title, description, href, icon: Icon, stats }: ActionCardProps) {
  return (
    <Link href={href}>
      <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-1">
        <div className="relative space-y-4">
          <div className="flex items-center justify-between">
            <div className="rounded-lg bg-secondary p-3 transition-all duration-300 group-hover:bg-primary group-hover:scale-110">
              <Icon className="h-5 w-5 text-primary transition-colors group-hover:text-primary-foreground" />
            </div>
            {stats && <span className="text-sm font-medium text-muted-foreground">{stats}</span>}
          </div>

          <div>
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{title}</h3>
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{description}</p>
          </div>

          <div className="flex items-center text-sm font-medium text-primary opacity-0 transition-all duration-300 group-hover:opacity-100">
            <span>View details</span>
            <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </Link>
  )
}
