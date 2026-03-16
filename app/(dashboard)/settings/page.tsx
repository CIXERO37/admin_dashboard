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
import { useTranslation } from "@/lib/i18n";

export default function SettingsDashboardPage() {
  const { t } = useTranslation();

  const systemStatus = [
    { name: t("settings.service_email"), status: "Active", icon: CheckCircle },
    {
      name: t("settings.service_payment"),
      status: "Active",
      icon: CheckCircle,
    },
    {
      name: t("settings.service_storage"),
      status: "Active",
      icon: CheckCircle,
    },
    { name: t("settings.service_api"), status: "Warning", icon: AlertTriangle },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          {t("settings.title")}
        </h1>
        <p className="mt-1 text-muted-foreground">
          {t("settings.description")}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title={t("settings.profile_completion")}
          value="85%"
          change={t("settings.update_profile")}
          changeType="neutral"
          icon={User}
        />
        <StatCard
          title={t("settings.security_score")}
          value="Good"
          change={t("settings.2fa_enabled")}
          changeType="increase"
          icon={Shield}
        />
        <StatCard
          title={t("settings.system_health")}
          value="98%"
          change={t("settings.all_operational")}
          changeType="increase"
          icon={Settings}
        />
      </div>

      {/* System Status */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">
            {t("settings.system_status")}
          </CardTitle>
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
                    {item.status === "Active"
                      ? t("stats.active")
                      : t("settings.status.warning") || item.status}
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
          title={t("settings.modules_title")}
          description={t("settings.modules_desc")}
        />
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <ActionCard
            title={t("settings.profile")}
            description={t("settings.profile_desc")}
            href="/settings/profile"
            icon={User}
          />
          <ActionCard
            title={t("settings.appearance")}
            description={t("settings.appearance_desc")}
            href="/appearance"
            icon={Palette}
          />
          <ActionCard
            title={t("settings.security")}
            description={t("settings.security_desc")}
            href="/settings/security"
            icon={Shield}
          />
        </div>
      </div>
    </div>
  );
}
