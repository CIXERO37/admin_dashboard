"use client"

import type React from "react"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Headphones,
  FileText,
  HelpCircle,
  CreditCard,
  Users,
  AlertCircle,
  Database,
  BookOpen,
  MapPin,
  Globe,
  Map,
  Building2,
  UserCog,
  Settings,
  User,
  Sliders,
  Shield,
  ChevronDown,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface NavChild {
  title: string
  href: string
  icon: React.ElementType
  children?: { title: string; href: string; icon: React.ElementType }[]
}

interface NavItem {
  title: string
  href: string
  icon: React.ElementType
  children?: NavChild[]
}

const navigation: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Support",
    href: "/support",
    icon: Headphones,
    children: [
      { title: "Report", href: "/support/report", icon: FileText },
      { title: "Quiz", href: "/support/quiz", icon: HelpCircle },
    ],
  },
  {
    title: "Billing",
    href: "/billing",
    icon: CreditCard,
    children: [
      { title: "Active", href: "/billing/active", icon: Users },
      { title: "Unpaid", href: "/billing/unpaid", icon: AlertCircle },
    ],
  },
  {
    title: "Master Data",
    href: "/master",
    icon: Database,
    children: [
      { title: "Quiz", href: "/master/quiz", icon: BookOpen },
      { 
        title: "Address", 
        href: "/master/address", 
        icon: MapPin,
        children: [
          { title: "Country", href: "/master/address/country", icon: Globe },
          { title: "State", href: "/master/address/state", icon: Map },
          { title: "City", href: "/master/address/city", icon: Building2 },
        ],
      },
    ],
  },
  {
    title: "Administrator",
    href: "/administrator",
    icon: UserCog,
    children: [{ title: "User", href: "/administrator/user", icon: User }],
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
    children: [
      { title: "Profile", href: "/settings/profile", icon: User },
      { title: "General", href: "/settings/general", icon: Sliders },
      { title: "Security", href: "/settings/security", icon: Shield },
    ],
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [openMenus, setOpenMenus] = useState<string[]>([])
  const [mounted, setMounted] = useState(false)

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard"
    return pathname.startsWith(href)
  }

  const isChildActive = (item: NavItem | NavChild): boolean => {
    return item.children?.some((child) => 
      pathname === child.href || 
      pathname.startsWith(child.href + "/") ||
      (child.children && child.children.some(grandChild => pathname === grandChild.href))
    ) ?? false
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    
    const activeMenus: string[] = []
    
    navigation.forEach((item) => {
      if (item.children) {
        const childActive = item.children.some((child) => 
          pathname === child.href || 
          pathname.startsWith(child.href + "/") ||
          (child.children && child.children.some(grandChild => pathname === grandChild.href))
        )
        if (childActive) {
          activeMenus.push(item.title)
          item.children.forEach((child) => {
            if (child.children?.some(grandChild => pathname === grandChild.href || pathname.startsWith(grandChild.href + "/"))) {
              activeMenus.push(child.title)
            }
          })
        }
      }
    })
    
    setOpenMenus(activeMenus)
  }, [pathname, mounted])

  const toggleMenu = (title: string) => {
    setOpenMenus((prev) => (prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]))
  }

  return (
    <aside
      className={cn(
        "flex flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300",
        collapsed ? "w-16" : "w-64",
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
        {!collapsed && (
          <Link href="/dashboard" className="flex items-center gap-2">
            <Image src="/icons/icon-32x32.png" alt="Gameforsmart" width={32} height={32} />
            <span className="font-semibold text-sidebar-foreground">Gameforsmart</span>
          </Link>
        )}
        {collapsed && (
          <Image src="/icons/icon-32x32.png" alt="Gameforsmart" width={32} height={32} className="mx-auto" />
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {navigation.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)
          const hasChildren = item.children && item.children.length > 0
          const isOpen = mounted ? openMenus.includes(item.title) : false

          if (hasChildren && !collapsed) {
            // Render static button before mount to avoid hydration mismatch
            if (!mounted) {
              return (
                <div key={item.title}>
                  <button
                    className={cn(
                      "flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      active || isChildActive(item)
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground hover:bg-secondary hover:text-foreground",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </div>
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </div>
              )
            }

            return (
              <Collapsible key={item.title} open={isOpen} onOpenChange={() => toggleMenu(item.title)}>
                <CollapsibleTrigger asChild>
                  <button
                    className={cn(
                      "flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      active || isChildActive(item)
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground hover:bg-secondary hover:text-foreground",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </div>
                    <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-1 space-y-1 pl-4">
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                      pathname === item.href
                        ? "bg-sidebar-primary text-sidebar-primary-foreground"
                        : "text-sidebar-foreground hover:bg-secondary hover:text-foreground",
                    )}
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                  {item.children?.map((child) => {
                    const ChildIcon = child.icon
                    const hasNestedChildren = child.children && child.children.length > 0
                    const isNestedOpen = mounted ? openMenus.includes(child.title) : false

                    if (hasNestedChildren) {
                      return (
                        <Collapsible 
                          key={child.title} 
                          open={isNestedOpen} 
                          onOpenChange={() => toggleMenu(child.title)}
                        >
                          <CollapsibleTrigger asChild>
                            <button
                              className={cn(
                                "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors",
                                isNestedOpen || pathname.startsWith(child.href)
                                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                  : "text-sidebar-foreground hover:bg-secondary hover:text-foreground",
                              )}
                            >
                              <div className="flex items-center gap-3">
                                <ChildIcon className="h-4 w-4" />
                                <span>{child.title}</span>
                              </div>
                              <ChevronDown className={cn("h-3 w-3 transition-transform", isNestedOpen && "rotate-180")} />
                            </button>
                          </CollapsibleTrigger>
                          <CollapsibleContent className="mt-1 space-y-1 pl-4">
                            {child.children?.map((grandChild) => {
                              const GrandChildIcon = grandChild.icon
                              return (
                                <Link
                                  key={grandChild.href}
                                  href={grandChild.href}
                                  className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                                    pathname === grandChild.href
                                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                                      : "text-sidebar-foreground hover:bg-secondary hover:text-foreground",
                                  )}
                                >
                                  <GrandChildIcon className="h-4 w-4" />
                                  <span>{grandChild.title}</span>
                                </Link>
                              )
                            })}
                          </CollapsibleContent>
                        </Collapsible>
                      )
                    }

                    return (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                          pathname === child.href
                            ? "bg-sidebar-primary text-sidebar-primary-foreground"
                            : "text-sidebar-foreground hover:bg-secondary hover:text-foreground",
                        )}
                      >
                        <ChildIcon className="h-4 w-4" />
                        <span>{child.title}</span>
                      </Link>
                    )
                  })}
                </CollapsibleContent>
              </Collapsible>
            )
          }

          return (
            <Link
              key={item.title}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-secondary hover:text-foreground",
                collapsed && "justify-center px-2",
              )}
              title={collapsed ? item.title : undefined}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {!collapsed && <span>{item.title}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-3">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-center text-sidebar-foreground hover:bg-secondary hover:text-foreground"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <PanelLeft className="h-4 w-4" />
          ) : (
            <>
              <PanelLeftClose className="h-4 w-4 mr-2" />
              <span>Collapse</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  )
}
