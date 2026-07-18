import { BadgeCheck } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { cn } from "@/lib/utils";

export async function VerifiedSeal({ className }: { className?: string }) {
  const t = await getTranslations("common");
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700",
        className,
      )}
    >
      <BadgeCheck className="h-3.5 w-3.5" />
      {t("verified")}
    </span>
  );
}
