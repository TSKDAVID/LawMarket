-- Site-wide settings (contact, social, hero media) and editable static pages.

create table if not exists public.site_settings (
  id smallint primary key default 1 check (id = 1),
  contact_email text not null default 'hello@lawmarket.ge',
  contact_phone text not null default '+995 322 000 000',
  contact_phone_href text not null default 'tel:+995322000000',
  contact_location_en text not null default 'Tbilisi, Georgia',
  contact_location_ka text not null default 'თბილისი, საქართველო',
  social_facebook text not null default '',
  social_instagram text not null default '',
  social_linkedin text not null default '',
  hero_media_type text not null default 'video'
    check (hero_media_type in ('video', 'image', 'embed', 'none')),
  hero_media_url text not null default '/videos/hero-breakdown.mp4',
  hero_poster_url text not null default '/images/hero-legal-placeholder.png',
  hero_embed_url text not null default '',
  legal_updated_at date not null default '2026-08-08',
  banner_visible boolean not null default true,
  updated_at timestamptz not null default now(),
  updated_by uuid references public.profiles(id) on delete set null
);

create or replace trigger site_settings_updated_at
  before update on public.site_settings
  for each row execute function public.set_updated_at();

insert into public.site_settings (id) values (1) on conflict (id) do nothing;

create table if not exists public.site_pages (
  slug text primary key,
  title_en text not null default '',
  title_ka text not null default '',
  subtitle_en text not null default '',
  subtitle_ka text not null default '',
  sections jsonb not null default '[]'::jsonb,
  notice_en text not null default '',
  notice_ka text not null default '',
  updated_at timestamptz not null default now(),
  updated_by uuid references public.profiles(id) on delete set null
);

create or replace trigger site_pages_updated_at
  before update on public.site_pages
  for each row execute function public.set_updated_at();

alter table public.site_settings enable row level security;
alter table public.site_pages enable row level security;

drop policy if exists "site settings: public read" on public.site_settings;
create policy "site settings: public read" on public.site_settings
  for select using (true);

drop policy if exists "site settings: admin write" on public.site_settings;
create policy "site settings: admin write" on public.site_settings
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "site pages: public read" on public.site_pages;
create policy "site pages: public read" on public.site_pages
  for select using (true);

drop policy if exists "site pages: admin write" on public.site_pages;
create policy "site pages: admin write" on public.site_pages
  for all using (public.is_admin()) with check (public.is_admin());

-- Seed legal / about / how-it-works pages (body text editable in admin).
insert into public.site_pages (slug, title_en, title_ka, subtitle_en, subtitle_ka, notice_en, notice_ka, sections) values
(
  'terms',
  'Terms of Service',
  'მომსახურების პირობები',
  '',
  '',
  'This is placeholder legal text for prototype purposes only and should be replaced with reviewed legal copy before launch.',
  'ეს არის დროებითი იურიდიული ტექსტი პროტოტიპისთვის და უნდა შეიცვალოს გაშვებამდე.',
  '[
    {"title_en":"1. Using Law Market","title_ka":"1. Law Market-ის გამოყენება","body_en":"Law Market is a marketplace connecting clients with independent, verified lawyers. By using the platform, you agree to interact respectfully and provide accurate information when booking services.","body_ka":"Law Market არის მარკეტპლეისი, რომელიც კლიენტებს უკავშირდება დამოუკიდებელ, დადასტურებულ იურისტებს."},
    {"title_en":"2. Services and payments","title_ka":"2. სერვისები და გადახდები","body_en":"Services listed on Law Market are provided by independent lawyers, not by Law Market itself. Prices are shown upfront; payment handling and booking confirmation will be described here once available.","body_ka":"სერვისები მოწოდებულია დამოუკიდებელი იურისტების მიერ, არა Law Market-ის მიერ."},
    {"title_en":"3. Verification and guarantee","title_ka":"3. დადასტურება და გარანტია","body_en":"Lawyers are reviewed before joining the platform. Details of the satisfaction guarantee, refund conditions, and dispute resolution will be described here.","body_ka":"იურისტები გადაიხედება პლატფორმაზე გამოჩენამდე."},
    {"title_en":"4. Limitation of liability","title_ka":"4. პასუხისმგებლობის შეზღუდვა","body_en":"Law Market facilitates connections between clients and lawyers but is not itself a law firm and does not provide legal advice.","body_ka":"Law Market არ არის იურიდიული ფირმა და არ აწვდის იურიდიულ რჩევას."}
  ]'::jsonb
),
(
  'privacy',
  'Privacy Policy',
  'კონფიდენციალურობის პოლიტიკა',
  '',
  '',
  'This is placeholder legal text for prototype purposes only and should be replaced with reviewed legal copy before launch.',
  'ეს არის დროებითი იურიდიული ტექსტი პროტოტიპისთვის და უნდა შეიცვალოს გაშვებამდე.',
  '[
    {"title_en":"1. Information we collect","title_ka":"1. რა ინფორმაციას ვაგროვებთ","body_en":"We collect information you provide directly, such as your name, contact details, and information related to the services you search for or book.","body_ka":"ჩვენ ვაგროვებთ ინფორმაციას, რომელიც პირდაპირ მოგაწვდით."},
    {"title_en":"2. How we use information","title_ka":"2. როგორ ვიყენებთ ინფორმაციას","body_en":"Information is used to operate the platform, connect clients with lawyers, and improve our services.","body_ka":"ინფორმაცია გამოიყენება პლატფორმის მუშაობისთვის."},
    {"title_en":"3. Data sharing","title_ka":"3. მონაცემების გაზიარება","body_en":"We do not sell personal information. Limited information is shared with lawyers you choose to book, solely to fulfill your request.","body_ka":"ჩვენ არ ვყიდით პირად ინფორმაციას."},
    {"title_en":"4. Your rights","title_ka":"4. თქვენი უფლებები","body_en":"You may request access to, correction of, or deletion of your personal data at any time by contacting us.","body_ka":"შეგიძლიათ მოითხოვოთ თქვენი მონაცემების წვდომა, შესწორება ან წაშლა."}
  ]'::jsonb
),
(
  'about',
  'About Law Market',
  'Law Market-ის შესახებ',
  'Making trusted legal help easier to find, for everyone.',
  'სანდო იურიდიული დახმარების მოძიება ყველასთვის.',
  '',
  '',
  '[
    {"title_en":"Our mission","title_ka":"ჩვენი მიზანი","body_en":"Law Market connects people and businesses in Georgia with verified, experienced lawyers — with transparent, fixed pricing and no surprises.","body_ka":"Law Market უკავშირდება ადამიანებს და ბიზნესებს საქართველოში დადასტურებულ იურისტებთან."},
    {"title_en":"Verification first","title_ka":"პირველ რიგში დადასტურება","body_en":"Every lawyer is reviewed before they can list a single service.","body_ka":"ყოველი იურისტი გადაიხედება სერვისის გამოქვეყნებამდე."},
    {"title_en":"Transparent pricing","title_ka":"გამჭვირვალე ფასები","body_en":"Prices are fixed and visible upfront — no hidden consultation fees.","body_ka":"ფასები ფიქსირებულია და ხილულია წინასწარ."},
    {"title_en":"Guaranteed satisfaction","title_ka":"კმაყოფილების გარანტია","body_en":"If something goes wrong, our team steps in to make it right.","body_ka":"თუ რამე არასწორია, ჩვენი გუნდი ჩართება."}
  ]'::jsonb
),
(
  'how-it-works',
  'How it works',
  'როგორ მუშაობს',
  'Three simple steps to find and book the right legal help.',
  'სამი მარტივი ნაბიჯი სწორი იურიდიული დახმარების მოსაძებნად.',
  '',
  '',
  '[
    {"title_en":"1. Search and compare","title_ka":"1. ძებნა და შედარება","body_en":"Browse services by category or search for what you need. Compare fixed prices and lawyer profiles side by side.","body_ka":"დაათვალიერეთ სერვისები კატეგორიებით ან მოძებნეთ საჭირო."},
    {"title_en":"2. Choose your lawyer","title_ka":"2. აირჩიეთ იურისტი","body_en":"Read reviews, check experience, and pick the lawyer who fits your case and budget.","body_ka":"წაიკითხეთ მიმოხილვები და აირჩიეთ იურისტი."},
    {"title_en":"3. Book with confidence","title_ka":"3. დაჯავშნეთ თავდაჯერებით","body_en":"Book a free 15-minute consultation or purchase the service directly. Every booking is backed by our satisfaction guarantee.","body_ka":"დაჯავშნეთ უფასო კონსულტაცია ან შეიძინეთ სერვისი."}
  ]'::jsonb
)
on conflict (slug) do nothing;
