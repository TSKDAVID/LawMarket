import { categories } from "./categories";
import { lawyers } from "./lawyers";
import { reviews } from "./reviews";
import { services } from "./services";
import type { Category, Lawyer, Review, Service } from "./types";

/**
 * These functions are shaped like async database queries so that swapping
 * in a real database later (e.g. Supabase/Postgres) only requires changing
 * the implementation here, not the call sites.
 */

export async function getCategories(): Promise<Category[]> {
  return categories;
}

export async function getCategoryBySlug(
  slug: string
): Promise<Category | undefined> {
  return categories.find((c) => c.slug === slug);
}

export async function getCategoryById(
  id: string
): Promise<Category | undefined> {
  return categories.find((c) => c.id === id);
}

export async function getServices(): Promise<Service[]> {
  return services;
}

export async function getPopularServices(): Promise<Service[]> {
  return services.filter((s) => s.popular);
}

export async function getServiceBySlug(
  slug: string
): Promise<Service | undefined> {
  return services.find((s) => s.slug === slug);
}

export async function getServicesByCategory(
  categoryId: string
): Promise<Service[]> {
  return services.filter((s) => s.categoryId === categoryId);
}

export async function getServicesByLawyer(
  lawyerId: string
): Promise<Service[]> {
  return services.filter((s) => s.lawyerId === lawyerId);
}

export async function getRelatedServices(
  service: Service,
  limit = 3
): Promise<Service[]> {
  return services
    .filter((s) => s.categoryId === service.categoryId && s.id !== service.id)
    .slice(0, limit);
}

export async function getLawyers(): Promise<Lawyer[]> {
  return lawyers;
}

export async function getLawyerBySlug(
  slug: string
): Promise<Lawyer | undefined> {
  return lawyers.find((l) => l.slug === slug);
}

export async function getLawyerById(id: string): Promise<Lawyer | undefined> {
  return lawyers.find((l) => l.id === id);
}

export async function getVerifiedLawyers(): Promise<Lawyer[]> {
  return lawyers.filter((l) => l.verified);
}

export async function getReviews(): Promise<Review[]> {
  return reviews;
}

export async function getReviewsByLawyer(
  lawyerId: string
): Promise<Review[]> {
  return reviews.filter((r) => r.lawyerId === lawyerId);
}

export async function getCities(): Promise<string[]> {
  return Array.from(new Set(lawyers.map((l) => l.city))).sort();
}

export async function getLanguages(): Promise<string[]> {
  return Array.from(new Set(lawyers.flatMap((l) => l.languages))).sort();
}

export type LawyerRating = {
  average: number;
  count: number;
};

export async function getLawyerRatings(): Promise<Map<string, LawyerRating>> {
  const map = new Map<string, { sum: number; count: number }>();

  for (const review of reviews) {
    if (!review.lawyerId) continue;
    const current = map.get(review.lawyerId) ?? { sum: 0, count: 0 };
    current.sum += review.rating;
    current.count += 1;
    map.set(review.lawyerId, current);
  }

  const ratings = new Map<string, LawyerRating>();
  for (const [lawyerId, { sum, count }] of map) {
    ratings.set(lawyerId, {
      average: Math.round((sum / count) * 10) / 10,
      count,
    });
  }

  return ratings;
}

