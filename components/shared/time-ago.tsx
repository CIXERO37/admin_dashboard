"use client";

import { useEffect, useState } from "react";
import { formatDistanceToNow, format } from "date-fns";
import { id, enUS } from "date-fns/locale";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useTranslation } from "@/lib/i18n";

interface TimeAgoProps {
  date: Date | string | number | null | undefined;
  className?: string;
  fallback?: string;
}

export function TimeAgo({ date, className, fallback = "-" }: TimeAgoProps) {
  const { locale } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!date) {
    return <span className={className}>{fallback}</span>;
  }

  const dateFnsLocale = locale === "id" ? id : enUS;

  if (!mounted) {
    return <span className={className}>...</span>;
  }

  try {
    const dateObj = new Date(date);
    // ensure valid date
    if (isNaN(dateObj.getTime())) {
      return <span className={className}>{fallback}</span>;
    }
    return (
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className={`cursor-help border-b border-dotted border-muted-foreground/50 ${className || ""}`}>
              {formatDistanceToNow(dateObj, { addSuffix: true, locale: dateFnsLocale })}
            </span>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p>{format(dateObj, "PPpp", { locale: dateFnsLocale })}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  } catch (err) {
    return <span className={className}>{fallback}</span>;
  }
}
