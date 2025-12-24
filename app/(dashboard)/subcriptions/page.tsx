"use client";

import { useState } from "react";
import { Download, Search, Filter } from "lucide-react";
import { activeSubscribers, unpaidUsers } from "@/lib/dummy-data";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable } from "@/components/dashboard/data-table";

export default function SubscriptionsPage() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Combine data
  const allSubscriptions = [
    ...activeSubscribers.map((sub) => ({ ...sub, status: "Active" })),
    ...unpaidUsers.map((sub) => ({ ...sub, status: "Unpaid" })),
  ];

  // Filter data
  const filteredData = allSubscriptions.filter((sub) => {
    const matchesStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "active"
        ? sub.status === "Active"
        : sub.status === "Unpaid";

    const matchesSearch =
      sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.email.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const columns = [
    {
      key: "name",
      label: "Customer",
      render: (value: any, row: any) => (
        <div className="flex flex-col">
          <span className="font-medium text-foreground">{row.name}</span>
          <span className="text-xs text-muted-foreground">{row.email}</span>
        </div>
      ),
    },
    {
      key: "plan",
      label: "Plan",
      render: (value: any) => <span className="font-medium">{value}</span>,
    },
    {
      key: "amount",
      label: "Amount",
      render: (value: any) => <span>{value}</span>,
    },
    {
      key: "status",
      label: "Status",
      render: (value: any) => (
        <Badge
          variant={value === "Active" ? "default" : "destructive"}
          className={
            value === "Active" ? "bg-emerald-500 hover:bg-emerald-600" : ""
          }
        >
          {value}
        </Badge>
      ),
    },
    {
      key: "nextBilling",
      label: "Next Billing",
      render: (value: any, row: any) => (
        <span className="text-muted-foreground">
          {row.dueDate || row.nextBilling || "-"}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Subscriptions</h1>
      </div>

      <div className="flex items-center justify-end gap-2">
        <div className="relative">
          <Input
            placeholder="Search subscriptions..."
            className="pr-10 w-64 bg-background border-border"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 flex items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            tabIndex={-1}
          >
            <Search className="h-3.5 w-3.5" />
          </button>
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="unpaid">Unpaid</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="all">
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Plan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Plans</SelectItem>
            <SelectItem value="enterprise">Enterprise</SelectItem>
            <SelectItem value="business">Business</SelectItem>
            <SelectItem value="pro">Pro</SelectItem>
            <SelectItem value="starter">Starter</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <DataTable columns={columns} data={filteredData as any[]} />
      </div>
    </div>
  );
}
