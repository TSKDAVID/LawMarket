import type { Tables } from "@/types/database.types";

function formatPrice(service: Tables<"services">): string {
  if (service.pricing_model === "quote" || service.price_gel == null) {
    return "შეთანხმებით";
  }
  const amount = Number(service.price_gel).toFixed(0);
  if (service.pricing_model === "hourly") {
    return `${amount} ₾ / საათი`;
  }
  return `${amount} ₾`;
}

export function ServiceCard({ service }: { service: Tables<"services"> }): React.JSX.Element {
  return (
    <article className="border border-border p-5">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="font-display text-lg text-ink">{service.title}</h3>
        <p className="shrink-0 font-mono text-sm text-ink">{formatPrice(service)}</p>
      </div>
      {service.description ? (
        <p className="mt-2 max-w-[60ch] text-sm leading-relaxed text-ink-muted">{service.description}</p>
      ) : null}
    </article>
  );
}
