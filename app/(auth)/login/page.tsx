import { LoginForm } from "@/components/auth/auth-forms";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}): Promise<React.JSX.Element> {
  const params = await searchParams;

  return (
    <div>
      <h1 className="font-display text-3xl text-ink">შესვლა</h1>
      <p className="mt-2 text-sm text-ink-muted">შედით თქვენს LawMarket ანგარიშში.</p>
      <div className="mt-8">
        <LoginForm nextPath={params.next} />
      </div>
    </div>
  );
}
