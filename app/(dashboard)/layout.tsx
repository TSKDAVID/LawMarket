import Link from "next/link";
import { redirect } from "next/navigation";
import { logoutAction } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";
import { getOwnProfile } from "@/lib/data/profiles";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}): Promise<React.JSX.Element> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/dashboard");
  }

  const profile = await getOwnProfile();
  if (profile && !profile.onboarding_completed) {
    redirect("/onboarding");
  }

  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b border-border">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-6">
            <Link href="/" className="font-display text-lg text-ink">
              LawMarket
            </Link>
            <nav className="hidden gap-4 text-sm text-ink-muted sm:flex">
              <Link href="/dashboard" className="hover:text-ink">
                მიმოხილვა
              </Link>
              <Link href="/dashboard/profile" className="hover:text-ink">
                პროფილი
              </Link>
              <Link href="/dashboard/expat-applications" className="hover:text-ink">
                ექსპატები
              </Link>
              {profile?.role === "provider" ? (
                <>
                  <Link href="/dashboard/services" className="hover:text-ink">
                    სერვისები
                  </Link>
                  <Link href="/dashboard/cases" className="hover:text-ink">
                    საქმეები
                  </Link>
                </>
              ) : null}
              {profile?.role === "admin" ? (
                <Link href="/admin/verifications" className="hover:text-ink">
                  ადმინი
                </Link>
              ) : null}
            </nav>
          </div>
          <form action={logoutAction}>
            <Button type="submit" variant="ghost" size="sm">
              გამოსვლა
            </Button>
          </form>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">{children}</div>
    </div>
  );
}
