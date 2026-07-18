export default function ComingSoonPage({
  title,
  body,
}: {
  title: string;
  body: string;
}): React.JSX.Element {
  return (
    <div>
      <h1 className="font-display text-3xl">{title}</h1>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-muted">{body}</p>
      <p className="mt-6 font-mono text-xs uppercase tracking-widest text-ink-muted">Coming soon</p>
    </div>
  );
}
