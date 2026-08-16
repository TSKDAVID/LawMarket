"use client";

import { CalendarPlus } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  downloadIcs,
  googleCalendarUrl,
  type CalendarEvent,
} from "@/lib/calendar";
import { cn } from "@/lib/utils";

export function AddToCalendar({
  event,
  className,
  compact = false,
}: {
  event: CalendarEvent;
  className?: string;
  compact?: boolean;
}) {
  const t = useTranslations("booking");

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <button
        type="button"
        onClick={() => downloadIcs(event)}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-none border border-burgundy bg-burgundy font-mono text-sm tracking-wide text-cream hover:border-espresso hover:bg-espresso",
          compact ? "h-10 px-3" : "h-12 px-5"
        )}
      >
        <CalendarPlus className="h-4 w-4" />
        {t("addToCalendar")}
      </button>
      <a
        href={googleCalendarUrl(event)}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center justify-center font-mono text-xs tracking-wide text-burgundy underline-offset-4 hover:underline"
      >
        {t("addToGoogle")}
      </a>
    </div>
  );
}
