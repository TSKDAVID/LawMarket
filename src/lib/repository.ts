import { practiceAreas } from "@/data/practice-areas";
import { services } from "@/data/services";
import { lawyers } from "@/data/lawyers";
import type { Lawyer, PracticeArea, Service } from "@/schemas";

/**
 * The single access layer over the typed data modules (ENGINEERING.md §2).
 * Pages never import src/data/* directly — when the database arrives,
 * only this file changes.
 */

export function getPracticeAreas(): PracticeArea[] {
  return [...practiceAreas].sort((a, b) => a.order - b.order);
}

export function getPracticeArea(id: string): PracticeArea | undefined {
  return practiceAreas.find((area) => area.id === id);
}

export function getServices(): Service[] {
  return [...services].sort((a, b) => a.number - b.number);
}

export function getService(slug: string): Service | undefined {
  return services.find((service) => service.slug === slug);
}

export function getServiceById(id: string): Service | undefined {
  return services.find((service) => service.id === id);
}

export function getServicesByPracticeArea(areaId: string): Service[] {
  return getServices().filter((service) => service.practiceAreaId === areaId);
}

/** Ledger structure: areas in order, each with its services. */
export function getLedger(): { area: PracticeArea; services: Service[] }[] {
  return getPracticeAreas().map((area) => ({
    area,
    services: getServicesByPracticeArea(area.id),
  }));
}

export function getLawyers(): Lawyer[] {
  return [...lawyers];
}

export function getLawyer(slug: string): Lawyer | undefined {
  return lawyers.find((lawyer) => lawyer.slug === slug);
}

export function getLawyerById(id: string): Lawyer | undefined {
  return lawyers.find((lawyer) => lawyer.id === id);
}

export function getLawyersForService(service: Service): Lawyer[] {
  return service.lawyerIds
    .map((id) => getLawyerById(id))
    .filter((lawyer): lawyer is Lawyer => lawyer !== undefined);
}

export function getServicesForLawyer(lawyer: Lawyer): Service[] {
  return getServices().filter((service) => service.lawyerIds.includes(lawyer.id));
}

/** Price bounds across the register, for organisation-level metadata. */
export function getPriceRange(): { min: number; max: number } {
  const prices = services.map((service) => service.priceGel);
  return { min: Math.min(...prices), max: Math.max(...prices) };
}
