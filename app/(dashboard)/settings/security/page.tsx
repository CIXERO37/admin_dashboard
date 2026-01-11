"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Key, Smartphone, Clock } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

export default function SettingsSecurityPage() {
  const { t } = useTranslation();

  const loginHistory = [
    {
      device: "Chrome on Windows",
      location: "New York, US",
      time: "2 hours ago",
      current: true,
    },
    {
      device: "Safari on iPhone",
      location: "New York, US",
      time: "1 day ago",
      current: false,
    },
    {
      device: "Firefox on macOS",
      location: "Los Angeles, US",
      time: "3 days ago",
      current: false,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          {t("settings.security")}
        </h1>
        <p className="mt-1 text-muted-foreground">
          {t("settings.security_desc")}
        </p>
      </div>

      <div className="grid gap-6">
        {/* Password */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Key className="h-5 w-5" />
              {t("settings.change_password")}
            </CardTitle>
            <CardDescription>{t("settings.update_password")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword" className="text-foreground">
                {t("settings.current_password")}
              </Label>
              <Input
                id="currentPassword"
                type="password"
                className="bg-background border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword" className="text-foreground">
                {t("settings.new_password")}
              </Label>
              <Input
                id="newPassword"
                type="password"
                className="bg-background border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-foreground">
                {t("settings.confirm_password")}
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                className="bg-background border-border"
              />
            </div>
            <Button>{t("settings.update_password")}</Button>
          </CardContent>
        </Card>

        {/* Two-Factor Authentication */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Smartphone className="h-5 w-5" />
              {t("settings.two_factor")}
            </CardTitle>
            <CardDescription>{t("settings.add_layer")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="h-10 w-10 text-[var(--success)]" />
                <div>
                  <p className="font-medium text-foreground">
                    {t("settings.2fa_enabled")}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t("settings.2fa_enabled_msg")}
                  </p>
                </div>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Login History */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Clock className="h-5 w-5" />
              {t("settings.login_history")}
            </CardTitle>
            <CardDescription>{t("settings.recent_activity")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loginHistory.map((login, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg border border-border bg-background p-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground">
                        {login.device}
                      </p>
                      {login.current && (
                        <Badge className="bg-[var(--success)]/20 text-[var(--success)] border-[var(--success)]/30">
                          Current
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {login.location} • {login.time}
                    </p>
                  </div>
                  {!login.current && (
                    <Button variant="outline" size="sm">
                      {t("settings.revoke")}
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
