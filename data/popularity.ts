import type { Service } from "@/data/types";

/** Purchases weigh more than page views when ranking the homepage. */
export function popularityScore(service: Service) {
  return (service.purchaseCount ?? 0) * 10 + (service.viewCount ?? 0);
}

export function sortByPopularity(services: Service[]) {
  return [...services].sort((a, b) => {
    const diff = popularityScore(b) - popularityScore(a);
    if (diff !== 0) return diff;
    return a.price - b.price;
  });
}
