import { getTranslations } from "next-intl/server";
import { LoginForm } from "@/components/auth/auth-forms";

export async function generateMetadata() {
  const t = await getTranslations("auth");
  return { title: t("loginTitle") };
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const t = await getTranslations("auth");

  return (
    <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <h1 className="font-serif text-2xl font-bold text-slate-900">
        {t("loginTitle")}
      </h1>
      <p className="mt-1 text-sm text-slate-500">{t("loginSubtitle")}</p>
      <div className="mt-6">
        <LoginForm next={next} />
      </div>
    </div>
  );
}
