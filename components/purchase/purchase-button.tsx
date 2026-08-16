"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { PurchaseModal } from "@/components/purchase/purchase-modal";
import type { Lawyer } from "@/data/types";
import { cn } from "@/lib/utils";

type PurchaseButtonProps = {
  serviceTitle: string;
  price: number;
  lawyer: Pick<
    Lawyer,
    "id" | "name" | "initials" | "avatarColor" | "photoUrl"
  >;
  className?: string;
};

export function PurchaseButton({
  serviceTitle,
  price,
  lawyer,
  className,
}: PurchaseButtonProps) {
  const t = useTranslations("common");
  const [open, setOpen] = useState(false);

  /*
   * Service cards link to `/services/<slug>#buy`, so the modal has to open
   * both on arrival and when the hash changes while already on the page.
   * Reading the hash in a rAF callback (rather than the effect body) keeps
   * the server-rendered closed state and the client in agreement.
   */
  useEffect(() => {
    const syncFromHash = () => {
      if (window.location.hash === "#buy") setOpen(true);
    };
    const frame = window.requestAnimationFrame(syncFromHash);
    window.addEventListener("hashchange", syncFromHash);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("hashchange", syncFromHash);
    };
  }, []);

  return (
    <>
      <button
        type="button"
        id="buy"
        onClick={() => setOpen(true)}
        className={cn(
          "flex h-12 w-full items-center justify-center gap-2.5 rounded-none",
          "border-[1.5px] border-burgundy bg-burgundy px-3",
          "font-body text-[13px] font-semibold text-cream sm:text-sm",
          "transition-colors duration-200 ease-out",
          "hover:border-espresso hover:bg-espresso",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-burgundy",
          className
        )}
      >
        {t("buyNow")}
      </button>
      <PurchaseModal
        open={open}
        onClose={() => setOpen(false)}
        serviceTitle={serviceTitle}
        price={price}
        lawyer={lawyer}
        /* Prefill from the session once auth is wired. */
      />
    </>
  );
}
