/**
 * Emits supabase/migrations/0002_seed.sql from the placeholder data in data/.
 *
 * Foreign keys are resolved by slug subselect rather than by hardcoded UUID,
 * so the seed stays readable and survives being run against a database where
 * ids were generated independently.
 *
 * Usage: node --experimental-strip-types scripts/generate-seed.mjs
 */
import { writeFileSync } from "node:fs";
import { join } from "node:path";

const { categories } = await import("../data/categories.ts");
const { lawyers } = await import("../data/lawyers.ts");
const { services } = await import("../data/services.ts");
const { reviews } = await import("../data/reviews.ts");

const q = (v) => (v === undefined || v === null ? "null" : `'${String(v).replace(/'/g, "''")}'`);
const arr = (items = []) =>
  items.length === 0
    ? "'{}'"
    : `array[${items.map((i) => q(i)).join(", ")}]::text[]`;
const jsonb = (value) => `${q(JSON.stringify(value ?? []))}::jsonb`;
const bool = (v) => (v ? "true" : "false");
const num = (v) => (v === undefined || v === null ? "null" : String(v));

const categoryById = new Map(categories.map((c) => [c.id, c]));
const lawyerById = new Map(lawyers.map((l) => [l.id, l]));
const serviceById = new Map(services.map((s) => [s.id, s]));

const catRef = (id) => `(select id from public.categories where slug = ${q(categoryById.get(id).slug)})`;
const lawyerRef = (id) => `(select id from public.lawyers where slug = ${q(lawyerById.get(id).slug)})`;
const serviceRef = (id) => `(select id from public.services where slug = ${q(serviceById.get(id).slug)})`;

const lines = [];

lines.push("-- Law Market — seed data");
lines.push("--");
lines.push("-- Generated from data/*.ts by scripts/generate-seed.mjs.");
lines.push("-- Safe to re-run: every insert upserts on its natural key.");
lines.push("");

lines.push("-- Categories -------------------------------------------------------------");
lines.push("insert into public.categories (slug, name_en, name_ka, icon, sort_order) values");
lines.push(
  categories
    .map(
      (c, i) =>
        `  (${q(c.slug)}, ${q(c.name_en)}, ${q(c.name_ka)}, ${q(c.icon)}, ${i})`
    )
    .join(",\n") + "\non conflict (slug) do update set"
);
lines.push(
  "  name_en = excluded.name_en, name_ka = excluded.name_ka, icon = excluded.icon, sort_order = excluded.sort_order;"
);
lines.push("");

lines.push("-- Lawyers ----------------------------------------------------------------");
lines.push(
  "insert into public.lawyers (slug, name, initials, avatar_color, photo_url, headline_en, headline_ka, bio_en, bio_ka, city, languages, years_experience, verified, sort_order) values"
);
lines.push(
  lawyers
    .map(
      (l, i) =>
        `  (${q(l.slug)}, ${q(l.name)}, ${q(l.initials)}, ${q(l.avatarColor)}, ${q(l.photoUrl)}, ${q(l.headline_en)}, ${q(l.headline_ka)}, ${q(l.bio_en)}, ${q(l.bio_ka)}, ${q(l.city)}, ${arr(l.languages)}, ${num(l.yearsExperience)}, ${bool(l.verified)}, ${i})`
    )
    .join(",\n") + "\non conflict (slug) do update set"
);
lines.push(
  "  name = excluded.name, initials = excluded.initials, avatar_color = excluded.avatar_color,"
);
lines.push(
  "  photo_url = excluded.photo_url, headline_en = excluded.headline_en, headline_ka = excluded.headline_ka,"
);
lines.push(
  "  bio_en = excluded.bio_en, bio_ka = excluded.bio_ka, city = excluded.city, languages = excluded.languages,"
);
lines.push(
  "  years_experience = excluded.years_experience, verified = excluded.verified, sort_order = excluded.sort_order;"
);
lines.push("");

lines.push("-- Practice areas ---------------------------------------------------------");
const practiceRows = lawyers.flatMap((l) =>
  (l.practiceAreaIds ?? []).map(
    (catId) => `  (${lawyerRef(l.id)}, ${catRef(catId)})`
  )
);
lines.push("insert into public.lawyer_practice_areas (lawyer_id, category_id) values");
lines.push(practiceRows.join(",\n") + "\non conflict do nothing;");
lines.push("");

lines.push("-- Services ---------------------------------------------------------------");
lines.push(
  "insert into public.services (slug, category_id, lawyer_id, title_en, title_ka, description_en, description_ka, price, currency, duration_minutes, popular, includes_en, includes_ka, faq_en, faq_ka, sort_order) values"
);
lines.push(
  services
    .map(
      (s, i) =>
        `  (${q(s.slug)}, ${catRef(s.categoryId)}, ${lawyerRef(s.lawyerId)}, ${q(s.title_en)}, ${q(s.title_ka)}, ${q(s.description_en)}, ${q(s.description_ka)}, ${num(s.price)}, ${q(s.currency)}, ${num(s.durationMinutes)}, ${bool(s.popular)}, ${arr(s.includes_en)}, ${arr(s.includes_ka)}, ${jsonb(s.faq_en)}, ${jsonb(s.faq_ka)}, ${i})`
    )
    .join(",\n") + "\non conflict (slug) do update set"
);
lines.push(
  "  category_id = excluded.category_id, lawyer_id = excluded.lawyer_id, title_en = excluded.title_en,"
);
lines.push(
  "  title_ka = excluded.title_ka, description_en = excluded.description_en, description_ka = excluded.description_ka,"
);
lines.push(
  "  price = excluded.price, duration_minutes = excluded.duration_minutes, popular = excluded.popular,"
);
lines.push(
  "  includes_en = excluded.includes_en, includes_ka = excluded.includes_ka, faq_en = excluded.faq_en,"
);
lines.push("  faq_ka = excluded.faq_ka, sort_order = excluded.sort_order;");
lines.push("");

lines.push("-- Reviews ----------------------------------------------------------------");
lines.push("delete from public.reviews;");
lines.push(
  "insert into public.reviews (author_name, author_role_en, author_role_ka, rating, quote_en, quote_ka, service_id, lawyer_id, featured, sort_order) values"
);
lines.push(
  reviews
    .map(
      (r, i) =>
        `  (${q(r.authorName)}, ${q(r.authorRole_en)}, ${q(r.authorRole_ka)}, ${num(r.rating)}, ${q(r.quote_en)}, ${q(r.quote_ka)}, ${r.serviceId ? serviceRef(r.serviceId) : "null"}, ${r.lawyerId ? lawyerRef(r.lawyerId) : "null"}, ${bool(i === 0)}, ${i})`
    )
    .join(",\n") + ";"
);
lines.push("");

lines.push("-- Editable site copy -----------------------------------------------------");
lines.push(
  "insert into public.site_content (key, value_en, value_ka, description) values"
);
const siteContent = [
  [
    "hero.title",
    "Legal help at a fixed price",
    "იურიდიული დახმარება ფიქსირებული ფასით",
    "Homepage hero headline",
  ],
  [
    "hero.subtitle",
    "Find verified lawyers, compare services, and book with a satisfaction guarantee.",
    "იპოვეთ დადასტურებული იურისტები, შეადარეთ სერვისები და დაჯავშნეთ კმაყოფილების გარანტიით.",
    "Homepage hero subtitle",
  ],
  [
    "banner.text",
    "Free 15-minute consultation on every service",
    "15-წუთიანი უფასო კონსულტაცია ყოველ სერვისზე",
    "Sitewide top banner",
  ],
  [
    "guarantee.title",
    "Every service is covered by our satisfaction guarantee",
    "ყველა სერვისი დაფარულია კმაყოფილების გარანტიით",
    "Guarantee band heading",
  ],
];
lines.push(
  siteContent
    .map(
      ([key, en, ka, desc]) => `  (${q(key)}, ${q(en)}, ${q(ka)}, ${q(desc)})`
    )
    .join(",\n") + "\non conflict (key) do nothing;"
);
lines.push("");

writeFileSync(
  join(process.cwd(), "supabase", "migrations", "0002_seed.sql"),
  lines.join("\n") + "\n"
);
console.log("wrote supabase/migrations/0002_seed.sql");
