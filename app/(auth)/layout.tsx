import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <div className="border-b border-border px-4 py-4 sm:px-6">
        <Link href="/" className="font-display text-xl text-ink">
          LawMarket
        </Link>
      </div>
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-12">{children}</div>
    </div>
  );
}
