import Link from "next/link";
import { VerifiedSeal } from "@/components/marketplace/VerifiedSeal";
import type { ProviderListItem } from "@/lib/data/providers";

export function ProviderCard({ provider }: { provider: ProviderListItem }): React.JSX.Element {
  const areas = (provider.provider_practice_areas ?? [])
    .map((p) => p.practice_areas?.name)
    .filter(Boolean)
    .slice(0, 3);
  const languages = provider.provider_details?.languages ?? [];
  const verified = provider.provider_details?.identity_verified;

  return (
    <Link
      href={`/providers/${provider.public_slug}`}
      className="group block border border-border bg-paper p-5 transition-colors hover:bg-paper-alt/60"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-xl text-ink group-hover:text-seal transition-colors">
            {provider.full_name}
          </h2>
          {provider.provider_details?.law_firm ? (
            <p className="mt-1 text-sm text-ink-muted">{provider.provider_details.law_firm}</p>
          ) : null}
        </div>
        {verified ? <VerifiedSeal size={36} /> : null}
      </div>

      <dl className="mt-4 grid gap-2 text-sm">
        <div className="flex gap-2">
          <dt className="font-mono text-xs uppercase tracking-wide text-ink-muted">ქალაქი</dt>
          <dd className="text-ink">{provider.city ?? "—"}</dd>
        </div>
        {provider.provider_details?.years_experience != null ? (
          <div className="flex gap-2">
            <dt className="font-mono text-xs uppercase tracking-wide text-ink-muted">გამოცდილება</dt>
            <dd className="font-mono text-ink">{provider.provider_details.years_experience} წელი</dd>
          </div>
        ) : null}
      </dl>

      {areas.length > 0 ? (
        <p className="mt-4 text-sm text-ink-muted">{areas.join(" · ")}</p>
      ) : null}

      {languages.length > 0 ? (
        <p className="mt-2 font-mono text-xs uppercase tracking-wide text-brass">
          {languages.join(" / ")}
        </p>
      ) : null}
    </Link>
  );
}
