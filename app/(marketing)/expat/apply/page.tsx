import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { ExpatApplyForm } from "@/components/expat/apply-form";

export default async function ExpatApplyPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=/expat/apply");

  const t = await getTranslations("expat.form");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <h1 className="font-serif text-3xl font-bold tracking-tight text-slate-900">
        {t("title")}
      </h1>
      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
        <ExpatApplyForm
          defaults={{
            fullName: profile?.full_name ?? "",
            email: user.email ?? "",
          }}
        />
      </div>
    </div>
  );
}
