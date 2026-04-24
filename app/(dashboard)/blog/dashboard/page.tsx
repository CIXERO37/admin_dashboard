"use client";

import { useTranslation } from "@/lib/i18n";
import { BarChart3, FileText, TrendingUp, Eye } from "lucide-react";

export default function BlogDashboardPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-foreground">
        {t("nav.blog") || "Blog"} {t("nav.dashboard") || "Dashboard"}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: "Total Articles",
            value: "—",
            icon: FileText,
            color: "text-blue-500",
          },
          {
            title: "Published",
            value: "—",
            icon: TrendingUp,
            color: "text-emerald-500",
          },
          {
            title: "Total Views",
            value: "—",
            icon: Eye,
            color: "text-purple-500",
          },
          {
            title: "Engagement",
            value: "—",
            icon: BarChart3,
            color: "text-orange-500",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="rounded-xl border bg-card p-6 space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground font-medium">
                {stat.title}
              </span>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <p className="text-3xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border bg-card p-12 flex flex-col items-center justify-center text-center">
        <BarChart3 className="h-16 w-16 text-muted-foreground/20 mb-4" />
        <h3 className="text-lg font-semibold text-muted-foreground">
          Coming Soon
        </h3>
        <p className="text-sm text-muted-foreground/60 mt-1 max-w-md">
          Blog analytics, top articles by engagement, and publishing trends will
          be available here once the interaction system is implemented.
        </p>
      </div>
    </div>
  );
}
