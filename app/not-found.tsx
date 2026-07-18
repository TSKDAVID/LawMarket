import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";

export default async function NotFound() {
  const t = await getTranslations("common");

  return (
    <div className="mx-auto max-w-md px-4 py-32 text-center">
      <p className="font-serif text-6xl font-bold text-brand-100">404</p>
      <h1 className="mt-4 font-serif text-2xl font-bold text-slate-900">
        {t("notFound")}
      </h1>
      <Link href="/" className="mt-8 inline-block">
        <Button>{t("back")}</Button>
      </Link>
    </div>
  );
}
