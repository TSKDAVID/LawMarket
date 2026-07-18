import Link from "next/link";
import { ProviderCard } from "@/components/marketplace/provider-card";
import { listPracticeAreas, listPublishedProviders } from "@/lib/data/providers";

export default async function ProvidersPage({
  searchParams,
}: {
  searchParams: Promise<{ city?: string; practice?: string; lang?: string }>;
}): Promise<React.JSX.Element> {
  const params = await searchParams;
  const [providers, practiceAreas] = await Promise.all([
    listPublishedProviders({
      city: params.city,
      practiceArea: params.practice,
      language: params.lang,
    }),
    listPracticeAreas(),
  ]);

  const cities = ["თბილისი", "ბათუმი"];
  const languages = [
    { value: "ka", label: "ქართული" },
    { value: "en", label: "English" },
    { value: "ru", label: "Русский" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-widest text-ink-muted">Marketplace</p>
        <h1 className="mt-2 text-4xl">პროვაიდერები</h1>
        <p className="mt-3 text-ink-muted">
          გაფილტრეთ პრაქტიკის სფეროთი, ქალაქითა და ენით. დემო მონაცემები ტესტირებისთვის.
        </p>
      </div>

      <form className="mt-8 flex flex-wrap items-end gap-3 border border-border bg-paper-alt/40 p-4">
        <label className="space-y-1 text-sm">
          <span className="font-mono text-xs uppercase text-ink-muted">პრაქტიკა</span>
          <select
            name="practice"
            defaultValue={params.practice ?? ""}
            className="block h-10 min-w-[12rem] rounded-sm border border-border bg-paper px-3 text-sm"
          >
            <option value="">ყველა</option>
            {practiceAreas.map((pa) => (
              <option key={pa.id} value={pa.slug}>
                {pa.name}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-1 text-sm">
          <span className="font-mono text-xs uppercase text-ink-muted">ქალაქი</span>
          <select
            name="city"
            defaultValue={params.city ?? ""}
            className="block h-10 min-w-[10rem] rounded-sm border border-border bg-paper px-3 text-sm"
          >
            <option value="">ყველა</option>
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-1 text-sm">
          <span className="font-mono text-xs uppercase text-ink-muted">ენა</span>
          <select
            name="lang"
            defaultValue={params.lang ?? ""}
            className="block h-10 min-w-[10rem] rounded-sm border border-border bg-paper px-3 text-sm"
          >
            <option value="">ყველა</option>
            {languages.map((l) => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
          </select>
        </label>
        <button
          type="submit"
          className="h-10 rounded-sm bg-seal px-4 text-sm text-paper hover:bg-seal/90"
        >
          გაფილტვრა
        </button>
        {(params.city || params.practice || params.lang) && (
          <Link href="/providers" className="h-10 px-3 text-sm leading-10 text-seal hover:underline">
            გასუფთავება
          </Link>
        )}
      </form>

      {providers.length === 0 ? (
        <p className="mt-12 text-ink-muted">პროვაიდერი ვერ მოიძებნა.</p>
      ) : (
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {providers.map((p) => (
            <ProviderCard key={p.id} provider={p} />
          ))}
        </div>
      )}
    </div>
  );
}
