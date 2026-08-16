"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { BookingModal } from "@/components/booking/booking-modal";
import type { Lawyer } from "@/data/types";
import { cn } from "@/lib/utils";

type LawyerLite = Pick<
  Lawyer,
  "id" | "name" | "initials" | "avatarColor" | "photoUrl"
>;

export function CaseConsultButton({
  lawyer,
  clientCaseId,
  defaultName,
  defaultEmail,
  defaultPhone,
  label,
  variant = "button",
  className,
}: {
  lawyer: LawyerLite;
  clientCaseId: string;
  defaultName?: string;
  defaultEmail?: string;
  defaultPhone?: string;
  label?: string;
  variant?: "button" | "text";
  className?: string;
}) {
  const t = useTranslations("cases");
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          variant === "text"
            ? "font-mono text-sm tracking-wide text-burgundy underline-offset-4 hover:underline"
            : "inline-flex h-12 w-full shrink-0 items-center justify-center rounded-none border border-burgundy px-4 font-mono text-sm tracking-wide text-burgundy transition-colors hover:bg-burgundy hover:text-cream",
          className
        )}
      >
        {label ?? (variant === "text" ? t("bookIntro") : t("bookShort"))}
      </button>
      <BookingModal
        open={open}
        onClose={() => setOpen(false)}
        lawyer={lawyer}
        clientCaseId={clientCaseId}
        defaultName={defaultName}
        defaultEmail={defaultEmail}
        defaultPhone={defaultPhone}
      />
    </>
  );
}
