"use client";

import { useState } from "react";
import {
  Search,
  Users,
  CreditCard,
  TrendingDown,
  MoreHorizontal,
  Filter,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { DataTable } from "@/components/dashboard/data-table";

// Dummy Data matching the design
const SUBSCRIPTIONS = [
  {
    id: "1",
    customer: {
      name: "Tech Corp",
      email: "billing@techcorp.com",
    },
    plan: "Enterprise",
    amount: "$299/mo",
    status: "Active",
    nextBilling: "2024-02-01",
  },
  {
    id: "2",
    customer: {
      name: "Startup Inc",
      email: "finance@startup.io",
    },
    plan: "Pro",
    amount: "$99/mo",
    status: "Active",
    nextBilling: "2024-02-05",
  },
  {
    id: "3",
    customer: {
      name: "Agency Plus",
      email: "accounts@agency.com",
    },
    plan: "Business",
    amount: "$199/mo",
    status: "Active",
    nextBilling: "2024-02-10",
  },
  {
    id: "4",
    customer: {
      name: "Solo Dev",
      email: "dev@solo.dev",
    },
    plan: "Starter",
    amount: "$29/mo",
    status: "Active",
    nextBilling: "2024-02-15",
  },
  {
    id: "5",
    customer: {
      name: "Pending Co",
      email: "info@pending.co",
    },
    plan: "Pro",
    amount: "$99",
    status: "Unpaid",
    nextBilling: "2024-01-10",
  },
  {
    id: "6",
    customer: {
      name: "Late LLC",
      email: "billing@late.llc",
    },
    plan: "Enterprise",
    amount: "$299",
    status: "Unpaid",
    nextBilling: "2024-01-05",
  },
  {
    id: "7",
    customer: {
      name: "Overdue Inc",
      email: "pay@overdue.inc",
    },
    plan: "Business",
    amount: "$199",
    status: "Unpaid",
    nextBilling: "2024-01-01",
  },
];

const STATS = [
  {
    title: "Total Active Subscriptions",
    value: "1,284",
    change: "+12%",
    changeType: "positive",
    description: "vs. previous month",
    icon: Users,
  },
  {
    title: "Monthly Recurring Revenue",
    value: "$48,290",
    change: "+5.4%",
    changeType: "positive",
    description: "vs. previous month",
    icon: CreditCard,
  },
  {
    title: "Churn Rate",
    value: "2.1%",
    change: "+0.2%",
    changeType: "negative",
    description: "vs. previous month",
    icon: TrendingDown,
  },
];

export default function SubscriptionsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const getPlanBadgeColor = (plan: string) => {
    switch (plan.toLowerCase()) {
      case "enterprise":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "pro":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "business":
        return "bg-indigo-500/10 text-indigo-500 border-indigo-500/20";
      case "starter":
        return "bg-slate-500/10 text-slate-500 border-slate-500/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const columns = [
    {
      key: "customer",
      label: "CUSTOMER",
      render: (value: unknown) => {
        const customer = value as { name: string; email: string };
        return (
          <div className="flex flex-col">
            <span className="font-medium text-foreground text-sm">
              {customer.name}
            </span>
            <span className="text-xs text-muted-foreground">
              {customer.email}
            </span>
          </div>
        );
      },
    },
    {
      key: "plan",
      label: "PLAN",
      render: (value: unknown) => {
        const plan = value as string;
        return (
          <Badge
            variant="outline"
            className={cn(
              "rounded-full font-normal text-xs px-2.5 py-0.5",
              getPlanBadgeColor(plan)
            )}
          >
            {plan}
          </Badge>
        );
      },
    },
    {
      key: "amount",
      label: "AMOUNT",
      render: (value: unknown) => (
        <span className="font-medium text-sm text-foreground">
          {value as string}
        </span>
      ),
    },
    {
      key: "status",
      label: "STATUS",
      render: (value: unknown) => {
        const status = value as string;
        return (
          <Badge
            className={cn(
              "rounded-sm px-2 py-0.5 text-xs font-medium shadow-none",
              status === "Active"
                ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                : "bg-red-900/40 text-red-500 hover:bg-red-900/60 border border-red-900/50"
            )}
          >
            {status}
          </Badge>
        );
      },
    },
    {
      key: "nextBilling",
      label: "NEXT BILLING",
      render: (value: unknown) => (
        <span className="text-muted-foreground text-sm">{value as string}</span>
      ),
    },
    {
      key: "actions",
      label: "ACTIONS",
      render: () => {
        return (
          <div className="text-right">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-8 w-8 p-0 hover:bg-muted cursor-pointer"
                >
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem className="cursor-pointer">
                  Permissions
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  Change Plan
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-500 cursor-pointer">
                  Cancel Subscription
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  const tableData = SUBSCRIPTIONS.map((sub) => ({
    customer: sub.customer,
    plan: sub.plan,
    amount: sub.amount,
    status: sub.status,
    nextBilling: sub.nextBilling,
    actions: sub.id,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Subscriptions
        </h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Input
              placeholder="Search subscriptions..."
              className="pr-10 w-64 bg-background border-border"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 flex items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer">
              <Search className="h-3.5 w-3.5" />
            </button>
          </div>
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 bg-black border-black hover:bg-black/80 cursor-pointer"
          >
            <Filter className="h-4 w-4 text-white" />
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {STATS.map((stat, i) => (
          <Card
            key={i}
            className="bg-card/50 hover:bg-card hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer group"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <div className="text-3xl font-bold text-foreground">
                  {stat.value}
                </div>
                <div
                  className={cn(
                    "text-xs font-medium px-1.5 py-0.5 rounded",
                    stat.changeType === "positive" &&
                      stat.title !== "Churn Rate"
                      ? "text-emerald-500 bg-emerald-500/10"
                      : "text-red-500 bg-red-500/10"
                  )}
                >
                  {stat.change}
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Table */}
      <DataTable
        columns={columns}
        data={tableData}
        currentPage={currentPage}
        totalPages={1} // Only 1 page for now
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
