import { getOwnProfile } from "@/lib/data/profiles";

export default async function ProfilePage(): Promise<React.JSX.Element> {
  const profile = await getOwnProfile();

  return (
    <div>
      <h1 className="font-display text-3xl">პროფილი</h1>
      <dl className="mt-8 grid gap-4 border border-border p-6 sm:grid-cols-2">
        <div>
          <dt className="text-xs uppercase tracking-wide text-ink-muted">სახელი</dt>
          <dd className="mt-1 text-ink">{profile?.full_name}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-ink-muted">როლი</dt>
          <dd className="mt-1 font-mono text-sm">{profile?.role}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-ink-muted">ქალაქი</dt>
          <dd className="mt-1 text-ink">{profile?.city ?? "—"}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-ink-muted">ტელეფონი</dt>
          <dd className="mt-1 text-ink">{profile?.phone ?? "—"}</dd>
        </div>
        {profile?.public_slug ? (
          <div className="sm:col-span-2">
            <dt className="text-xs uppercase tracking-wide text-ink-muted">საჯარო slug</dt>
            <dd className="mt-1 font-mono text-sm">/providers/{profile.public_slug}</dd>
          </div>
        ) : null}
      </dl>
      <p className="mt-4 text-sm text-ink-muted">რედაქტორის ფორმა Phase 3-ში დაემატება.</p>
    </div>
  );
}
