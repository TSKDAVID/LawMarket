import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button";
import { LogoMark } from "@/components/brand/logo-mark";
import { cn } from "@/lib/utils";

export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-6 py-24 text-center">
      <LogoMark className="h-12 w-12 text-burgundy" />
      <h1 className="mt-6 font-heading text-3xl font-semibold text-espresso">
        {t("title")}
      </h1>
      <p className="mt-3 font-body text-espresso/60">{t("subtitle")}</p>
      <Link href="/" className={cn(buttonVariants({ variant: "primary" }), "mt-8")}>
        {t("backHome")}
      </Link>
    </div>
  );
}
