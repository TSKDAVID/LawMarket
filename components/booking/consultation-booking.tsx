"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { BookingModal } from "@/components/booking/booking-modal";
import { ConsultationClockIcon } from "@/components/shared/dossier-icon";
import type { Lawyer } from "@/data/types";
import { cn } from "@/lib/utils";

type ConsultationBookingProps = {
  lawyer: Pick<
    Lawyer,
    "id" | "name" | "initials" | "avatarColor" | "photoUrl"
  >;
  className?: string;
};

export function ConsultationBooking({
  lawyer,
  className,
}: ConsultationBookingProps) {
  const t = useTranslations("common");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (window.location.hash === "#consult") {
      setOpen(true);
    }
  }, []);

  return (
    <>
      <button
        type="button"
        id="consult"
        onClick={() => setOpen(true)}
        className={cn(
          "flex h-12 w-full items-center justify-center gap-2.5 rounded-none",
          "border-[1.5px] border-burgundy bg-transparent px-3",
          "font-body text-[13px] font-semibold text-burgundy sm:text-sm",
          "transition-colors duration-200 ease-out",
          "hover:bg-burgundy hover:text-cream",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-burgundy",
          className
        )}
      >
        <ConsultationClockIcon className="h-4 w-4" />
        {t("bookFreeConsultation")}
      </button>
      <BookingModal
        open={open}
        onClose={() => setOpen(false)}
        lawyer={lawyer}
        /* Prefill from the session once auth is wired. */
      />
    </>
  );
}
