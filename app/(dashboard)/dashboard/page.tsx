import Link from "next/link";
import { getOwnProfile } from "@/lib/data/profiles";

export default async function DashboardPage(): Promise<React.JSX.Element> {
  const profile = await getOwnProfile();

  return (
    <div>
      <h1 className="font-display text-3xl">პანელი</h1>
      <p className="mt-2 text-ink-muted">
        გამარჯობა, {profile?.full_name ?? "მომხმარებელო"}. როლი:{" "}
        <span className="font-mono text-sm text-ink">{profile?.role}</span>
      </p>
      <ul className="mt-8 space-y-3 border border-border divide-y divide-border">
        <li className="p-4">
          <Link href="/dashboard/profile" className="text-seal hover:underline">
            პროფილის რედაქტირება →
          </Link>
        </li>
        <li className="p-4">
          <Link href="/dashboard/expat-applications" className="text-seal hover:underline">
            ექსპატების განაცხადები →
          </Link>
        </li>
        <li className="p-4">
          <Link href="/expat-consultations" className="text-seal hover:underline">
            ექსპატების კრიტერიუმების ნახვა →
          </Link>
        </li>
      </ul>
    </div>
  );
}
