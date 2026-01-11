"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Camera, Save } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

export default function SettingsProfilePage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          {t("settings.profile")}
        </h1>
        <p className="mt-1 text-muted-foreground">
          {t("settings.profile_desc")}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Photo */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">
              {t("settings.photo")}
            </CardTitle>
            <CardDescription>{t("settings.update_photo")}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <div className="relative">
              <Avatar className="h-32 w-32">
                <AvatarFallback className="bg-primary text-primary-foreground text-3xl">
                  AD
                </AvatarFallback>
              </Avatar>
              <Button
                size="icon"
                className="absolute bottom-0 right-0 rounded-full"
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            <Button variant="outline" size="sm">
              {t("settings.upload_photo")}
            </Button>
          </CardContent>
        </Card>

        {/* Profile Info */}
        <Card className="border-border bg-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-foreground">
              {t("settings.personal_info")}
            </CardTitle>
            <CardDescription>{t("settings.update_personal")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-foreground">
                  {t("settings.first_name")}
                </Label>
                <Input
                  id="firstName"
                  defaultValue="Admin"
                  className="bg-background border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-foreground">
                  {t("settings.last_name")}
                </Label>
                <Input
                  id="lastName"
                  defaultValue="User"
                  className="bg-background border-border"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                defaultValue="admin@saas.com"
                className="bg-background border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-foreground">
                {t("settings.phone")}
              </Label>
              <Input
                id="phone"
                type="tel"
                defaultValue="+1 234 567 890"
                className="bg-background border-border"
              />
            </div>
            <Button>
              <Save className="mr-2 h-4 w-4" />
              {t("settings.save")}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
