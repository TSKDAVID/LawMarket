import type { Category, Lawyer, LawyerCase, Locale, Review, Service, ServiceFaq } from "./types";

export function localizedCategoryName(category: Category, locale: Locale) {
  return locale === "ka" ? category.name_ka : category.name_en;
}

export function localizedServiceTitle(service: Service, locale: Locale) {
  return locale === "ka" ? service.title_ka : service.title_en;
}

export function localizedServiceDescription(service: Service, locale: Locale) {
  return locale === "ka" ? service.description_ka : service.description_en;
}

export function localizedLawyerHeadline(lawyer: Lawyer, locale: Locale) {
  return locale === "ka" ? lawyer.headline_ka : lawyer.headline_en;
}

export function localizedLawyerBio(lawyer: Lawyer, locale: Locale) {
  return locale === "ka" ? lawyer.bio_ka : lawyer.bio_en;
}

export function localizedReviewQuote(review: Review, locale: Locale) {
  return locale === "ka" ? review.quote_ka : review.quote_en;
}

export function localizedReviewRole(review: Review, locale: Locale) {
  return locale === "ka" ? review.authorRole_ka : review.authorRole_en;
}

export function localizedServiceIncludes(
  service: Service,
  locale: Locale
): string[] {
  return locale === "ka"
    ? (service.includes_ka ?? [])
    : (service.includes_en ?? []);
}

export function localizedServiceFaq(
  service: Service,
  locale: Locale
): ServiceFaq[] {
  return locale === "ka" ? (service.faq_ka ?? []) : (service.faq_en ?? []);
}

function pickLocalized(
  locale: Locale,
  ka: string,
  en: string
) {
  if (locale === "ka") return ka;
  return en.trim() ? en : ka;
}

export function localizedCaseTitle(item: LawyerCase, locale: Locale) {
  return pickLocalized(locale, item.title_ka, item.title_en);
}

export function localizedCaseDescription(item: LawyerCase, locale: Locale) {
  return pickLocalized(locale, item.description_ka, item.description_en);
}

export function localizedCaseOutcome(item: LawyerCase, locale: Locale) {
  return pickLocalized(locale, item.outcome_ka, item.outcome_en);
}
