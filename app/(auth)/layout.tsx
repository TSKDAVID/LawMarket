export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[70vh] items-start justify-center bg-slate-50/60 px-4 py-16">
      {children}
    </div>
  );
}
