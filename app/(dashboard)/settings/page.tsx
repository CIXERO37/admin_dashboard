"use client";

import { StatCard } from "@/components/dashboard/stat-card";
import { ActionCard } from "@/components/dashboard/action-card";
import { SectionHeader } from "@/components/dashboard/section-header";
import {
  User,
  Sliders,
  Shield,
  CheckCircle,
  AlertTriangle,
  Settings,
  Palette,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function SettingsDashboardPage() {
  const systemStatus = [
    { name: "Email Service", status: "Active", icon: CheckCircle },
    { name: "Payment Gateway", status: "Active", icon: CheckCircle },
    { name: "Storage", status: "Active", icon: CheckCircle },
    { name: "API Rate Limit", status: "Warning", icon: AlertTriangle },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Settings Dashboard
        </h1>
        <p className="mt-1 text-muted-foreground">
          System configuration and preferences
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Profile Completion"
          value="85%"
          change="Update profile"
          changeType="neutral"
          icon={User}
        />
        <StatCard
          title="Security Score"
          value="Good"
          change="2FA enabled"
          changeType="increase"
          icon={Shield}
        />
        <StatCard
          title="System Health"
          value="98%"
          change="All systems operational"
          changeType="increase"
          icon={Settings}
        />
      </div>

      {/* System Status */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">System Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {systemStatus.map((item) => {
              const Icon = item.icon;
              const isActive = item.status === "Active";
              return (
                <div
                  key={item.name}
                  className="flex items-center justify-between rounded-lg border border-border bg-background p-4"
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`h-5 w-5 ${
                        isActive
                          ? "text-[var(--success)]"
                          : "text-[var(--warning)]"
                      }`}
                    />
                    <span className="font-medium text-foreground">
                      {item.name}
                    </span>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      isActive
                        ? "bg-[var(--success)]/20 text-[var(--success)] border-[var(--success)]/30"
                        : "bg-[var(--warning)]/20 text-[var(--warning)] border-[var(--warning)]/30"
                    }
                  >
                    {item.status}
                  </Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quick Access */}
      <div>
        <SectionHeader
          title="Settings Modules"
          description="Configure your system"
        />
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <ActionCard
            title="Profile Settings"
            description="Update your profile information"
            href="/settings/profile"
            icon={User}
          />
          <ActionCard
            title="Appearance"
            description="Customize the appearance of the app"
            href="/appearance"
            icon={Palette}
          />
          <ActionCard
            title="Security Settings"
            description="Manage security and authentication"
            href="/settings/security"
            icon={Shield}
          />
        </div>
      </div>
    </div>
  );
}
