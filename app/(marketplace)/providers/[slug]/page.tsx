import Link from "next/link";
import { notFound } from "next/navigation";
import { CaseCard } from "@/components/marketplace/case-card";
import { ServiceCard } from "@/components/marketplace/service-card";
import { VerifiedSeal } from "@/components/marketplace/VerifiedSeal";
import { Button } from "@/components/ui/button";
import { getProviderPublicProfile } from "@/lib/data/providers";

export default async function ProviderProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<React.JSX.Element> {
  const { slug } = await params;
  const data = await getProviderPublicProfile(slug);
  if (!data) notFound();

  const { profile, services, cases } = data;
  const areas = (profile.provider_practice_areas ?? [])
    .map((p) => p.practice_areas?.name)
    .filter(Boolean);
  const languages = profile.provider_details?.languages ?? [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <Link href="/providers" className="text-sm text-seal hover:underline">
        ← პროვაიდერები
      </Link>

      <header className="mt-6 grid gap-8 border-b border-border pb-10 lg:grid-cols-[1.4fr_0.6fr] lg:items-end">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-4xl sm:text-5xl">{profile.full_name}</h1>
            {profile.provider_details?.identity_verified ? <VerifiedSeal size={48} /> : null}
          </div>
          {profile.provider_details?.law_firm ? (
            <p className="mt-2 text-ink-muted">{profile.provider_details.law_firm}</p>
          ) : null}
          <p className="mt-4 max-w-[65ch] text-base leading-relaxed text-ink-muted">{profile.bio}</p>
          <div className="mt-6 flex flex-wrap gap-4 text-sm">
            <span className="font-mono text-ink">{profile.city}</span>
            {profile.provider_details?.years_experience != null ? (
              <span className="font-mono text-ink-muted">
                {profile.provider_details.years_experience} წელი
              </span>
            ) : null}
            {languages.length > 0 ? (
              <span className="font-mono text-xs uppercase tracking-wide text-brass">
                {languages.join(" / ")}
              </span>
            ) : null}
          </div>
          {areas.length > 0 ? (
            <p className="mt-3 text-sm text-ink-muted">{areas.join(" · ")}</p>
          ) : null}
        </div>
        <aside className="border border-border bg-paper-alt/50 p-5">
          <p className="font-mono text-xs uppercase tracking-widest text-ink-muted">შემდეგი ნაბიჯი</p>
          <p className="mt-2 text-sm text-ink-muted">
            დაჯავშნა და მესიჯები მალე დაემატება. ახლა შეგიძლიათ ანგარიში შექმნათ.
          </p>
          <Button asChild className="mt-4" size="sm">
            <Link href="/signup">რეგისტრაცია</Link>
          </Button>
        </aside>
      </header>

      <section className="py-12">
        <h2 className="text-2xl">სერვისები</h2>
        {services.length === 0 ? (
          <p className="mt-4 text-sm text-ink-muted">გამოქვეყნებული სერვისი ჯერ არ არის.</p>
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {services.map((s) => (
              <ServiceCard key={s.id} service={s} />
            ))}
          </div>
        )}
      </section>

      <section className="border-t border-border py-12">
        <h2 className="text-2xl">დადასტურებული საქმეები</h2>
        {cases.length === 0 ? (
          <p className="mt-4 text-sm text-ink-muted">საჯარო დადასტურებული საქმე ჯერ არ არის.</p>
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {cases.map((c) => (
              <CaseCard key={c.id} caseItem={c} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
