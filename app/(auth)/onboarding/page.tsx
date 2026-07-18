import { redirect } from "next/navigation";
import { OnboardingForm } from "@/components/auth/onboarding-form";
import { getOwnProfile } from "@/lib/data/profiles";
import { createClient } from "@/lib/supabase/server";

export default async function OnboardingPage(): Promise<React.JSX.Element> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/onboarding");
  }

  const profile = await getOwnProfile();
  if (profile?.onboarding_completed) {
    redirect("/dashboard");
  }

  return (
    <div>
      <h1 className="font-display text-3xl text-ink">პროფილის შევსება</h1>
      <p className="mt-2 text-sm text-ink-muted">აირჩიეთ როლი და შეავსეთ ძირითადი მონაცემები.</p>
      <div className="mt-8">
        <OnboardingForm defaultName={profile?.full_name ?? ""} />
      </div>
    </div>
  );
}
