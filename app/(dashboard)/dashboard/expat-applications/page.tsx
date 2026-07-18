import Link from "next/link";
import { listOwnExpatApplications } from "@/lib/data/expat-applications";
import { ExpatApplyForm } from "@/components/expat/apply-form";

export default async function ExpatApplicationsPage(): Promise<React.JSX.Element> {
  const apps = await listOwnExpatApplications();

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display text-3xl">ექსპატების განაცხადები</h1>
        <p className="mt-2 text-sm text-ink-muted">
          შეავსეთ განაცხადი. ადმინი განიხილავს — მიღების შემდეგ გადახდა Phase 4-ში.
        </p>
        <Link href="/expat-consultations" className="mt-2 inline-block text-sm text-seal hover:underline">
          კრიტერიუმების ნახვა →
        </Link>
      </div>

      <ExpatApplyForm />

      <section>
        <h2 className="font-display text-xl">ჩემი განაცხადები</h2>
        {apps.length === 0 ? (
          <p className="mt-3 text-sm text-ink-muted">ჯერ არ გაქვთ განაცხადი.</p>
        ) : (
          <ul className="mt-4 divide-y divide-border border border-border">
            {apps.map((app) => (
              <li key={app.id} className="flex items-center justify-between gap-4 p-4 text-sm">
                <span className="font-mono text-xs text-ink-muted">
                  {new Date(app.created_at).toLocaleDateString("ka-GE")}
                </span>
                <span className="font-mono text-xs uppercase tracking-wide text-brass">{app.status}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
