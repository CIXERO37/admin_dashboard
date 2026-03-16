"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "@/lib/i18n";

export function DashboardFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentRange = searchParams.get("timeRange") || "this-year";
  const { t, locale } = useTranslation();

  const handleChange = (val: string) => {
    router.push(`?timeRange=${val}`);
  };

  // Translations keys based on master (ref: admin dashboard)
  // master.this_year, master.last_year, master.all_time

  return (
    <Select value={currentRange} onValueChange={handleChange}>
      <SelectTrigger className="w-[160px]">
        <SelectValue placeholder={t("master.this_year") || "This Year"} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="this-year">
          {t("master.this_year") || "This Year"}
        </SelectItem>
        <SelectItem value="last-year">
          {t("master.last_year") || "Last Year"}
        </SelectItem>
        <SelectItem value="all">
          {t("master.all_time") || "All Time"}
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
