export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}): Promise<React.JSX.Element> {
  return <div className="min-h-screen bg-paper">{children}</div>;
}
