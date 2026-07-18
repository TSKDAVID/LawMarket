-- LawMarket seed data: taxonomy, demo users, providers, services, verified cases.
-- Demo account password for all seeded users: Password123!

-- ---------------------------------------------------------------------------
-- Taxonomy
-- ---------------------------------------------------------------------------
insert into public.practice_areas (slug, name_ka, name_en) values
  ('corporate', 'კორპორატიული სამართალი', 'Corporate Law'),
  ('immigration', 'საიმიგრაციო სამართალი', 'Immigration Law'),
  ('tax', 'საგადასახადო სამართალი', 'Tax Law'),
  ('real-estate', 'უძრავი ქონება', 'Real Estate'),
  ('family', 'საოჯახო სამართალი', 'Family Law'),
  ('criminal', 'სისხლის სამართალი', 'Criminal Law'),
  ('labor', 'შრომის სამართალი', 'Labor Law'),
  ('ip', 'ინტელექტუალური საკუთრება', 'Intellectual Property')
on conflict (slug) do nothing;

insert into public.programs (slug, name_ka, name_en, description_ka, description_en) values
  ('standard', 'სტანდარტული იურიდიული მომსახურება', 'Standard Legal Services',
   'იურიდიული კონსულტაცია და წარმომადგენლობა საქართველოში.',
   'Legal consultation and representation in Georgia.'),
  ('expat', 'საკონსულტაციო პროგრამა უცხოელებისთვის', 'Expat Consultation Program',
   'დახმარება უცხოელებისთვის საქართველოში ბიზნესის დაწყებასა და ცხოვრებაში.',
   'Help for foreigners setting up or operating in Georgia.')
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------------
-- Demo auth users (password: Password123!)
-- ---------------------------------------------------------------------------
insert into auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at, confirmation_token, recovery_token,
  email_change, email_change_token_new
)
select
  u.id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
  u.email, extensions.crypt('Password123!', extensions.gen_salt('bf')),
  now(), '{"provider":"email","providers":["email"]}'::jsonb,
  jsonb_build_object('full_name', u.full_name, 'role', u.meta_role),
  now(), now(), '', '', '', ''
from (values
  ('a0000000-0000-4000-8000-000000000001'::uuid, 'admin@lawmarket.ge',    'ადმინისტრატორი',      'client'),
  ('b0000000-0000-4000-8000-000000000001'::uuid, 'nino@lawmarket.ge',     'ნინო ბერიძე',          'provider'),
  ('b0000000-0000-4000-8000-000000000002'::uuid, 'giorgi@lawmarket.ge',   'გიორგი კაპანაძე',      'provider'),
  ('b0000000-0000-4000-8000-000000000003'::uuid, 'tamar@lawmarket.ge',    'თამარ ლომიძე',         'provider'),
  ('c0000000-0000-4000-8000-000000000001'::uuid, 'client@lawmarket.ge',   'დავით წიკლაური',       'client')
) as u(id, email, full_name, meta_role)
on conflict (id) do nothing;

insert into auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
select gen_random_uuid(), u.id, u.id::text,
  jsonb_build_object('sub', u.id::text, 'email', u.email, 'email_verified', true),
  'email', now(), now(), now()
from auth.users u
where u.email like '%@lawmarket.ge'
on conflict do nothing;

update public.profiles set role = 'admin' where id = 'a0000000-0000-4000-8000-000000000001';

-- ---------------------------------------------------------------------------
-- Provider profiles
-- ---------------------------------------------------------------------------
insert into public.provider_profiles
  (id, slug, headline_ka, headline_en, bio_ka, bio_en, city, languages, years_experience, is_published, accepts_expat, subscription_status)
values
  ('b0000000-0000-4000-8000-000000000001', 'nino-beridze',
   'კორპორატიული და საგადასახადო სამართლის ექსპერტი', 'Corporate & Tax Law Expert',
   '12 წლიანი გამოცდილება კორპორატიულ სამართალში. ვეხმარები კომპანიებს დაფუძნებაში, რესტრუქტურიზაციასა და საგადასახადო დაგეგმვაში.',
   '12 years of experience in corporate law. I help companies with incorporation, restructuring and tax planning.',
   'თბილისი', array['ka','en','ru'], 12, true, true, 'active'),
  ('b0000000-0000-4000-8000-000000000002', 'giorgi-kapanadze',
   'საიმიგრაციო სამართალი და ბინადრობის ნებართვები', 'Immigration Law & Residence Permits',
   'ვსპეციალიზდები საიმიგრაციო სამართალში — ბინადრობის ნებართვები, მოქალაქეობა, ვიზები უცხოელებისთვის.',
   'I specialize in immigration law — residence permits, citizenship, and visas for foreigners.',
   'თბილისი', array['ka','en'], 8, true, true, 'active'),
  ('b0000000-0000-4000-8000-000000000003', 'tamar-lomidze',
   'უძრავი ქონება და საოჯახო სამართალი', 'Real Estate & Family Law',
   'ვეხმარები კლიენტებს უძრავი ქონების გარიგებებში, ქირავნობის ხელშეკრულებებსა და საოჯახო დავებში.',
   'I help clients with real-estate transactions, lease agreements and family disputes.',
   'ბათუმი', array['ka','en','tr'], 15, true, false, 'active')
on conflict (id) do nothing;

insert into public.provider_practice_areas (provider_id, practice_area_id)
select p.id, pa.id
from (values
  ('b0000000-0000-4000-8000-000000000001'::uuid, 'corporate'),
  ('b0000000-0000-4000-8000-000000000001'::uuid, 'tax'),
  ('b0000000-0000-4000-8000-000000000002'::uuid, 'immigration'),
  ('b0000000-0000-4000-8000-000000000002'::uuid, 'labor'),
  ('b0000000-0000-4000-8000-000000000003'::uuid, 'real-estate'),
  ('b0000000-0000-4000-8000-000000000003'::uuid, 'family')
) as v(pid, slug)
join public.provider_profiles p on p.id = v.pid
join public.practice_areas pa on pa.slug = v.slug
on conflict do nothing;

-- ---------------------------------------------------------------------------
-- Services
-- ---------------------------------------------------------------------------
insert into public.services (provider_id, program_id, title_ka, title_en, description_ka, description_en, price_gel, duration_min)
select v.pid, pr.id, v.title_ka, v.title_en, v.desc_ka, v.desc_en, v.price, v.dur
from (values
  ('b0000000-0000-4000-8000-000000000001'::uuid, 'standard',
   'კომპანიის დაფუძნება', 'Company Incorporation',
   'შპს-ის ან სააქციო საზოგადოების სრული რეგისტრაცია.', 'Full registration of an LLC or JSC.', 450.00, null::int),
  ('b0000000-0000-4000-8000-000000000001'::uuid, 'standard',
   'საგადასახადო კონსულტაცია', 'Tax Consultation',
   'საგადასახადო დაგეგმვა და შესაბამისობა.', 'Tax planning and compliance.', 200.00, 60),
  ('b0000000-0000-4000-8000-000000000001'::uuid, 'expat',
   'ბიზნესის დაწყება საქართველოში', 'Starting a Business in Georgia',
   'სრული მხარდაჭერა უცხოელი მეწარმეებისთვის.', 'Full support for foreign entrepreneurs.', 300.00, 90),
  ('b0000000-0000-4000-8000-000000000002'::uuid, 'standard',
   'შრომითი ხელშეკრულებების მომზადება', 'Employment Contract Drafting',
   'შრომითი ხელშეკრულებების შედგენა და განხილვა.', 'Drafting and review of employment contracts.', 150.00, null::int),
  ('b0000000-0000-4000-8000-000000000002'::uuid, 'expat',
   'ბინადრობის ნებართვის კონსულტაცია', 'Residence Permit Consultation',
   'ბინადრობის ნებართვის მოპოვების სრული პროცესი.', 'Complete residence-permit application process.', 250.00, 60),
  ('b0000000-0000-4000-8000-000000000003'::uuid, 'standard',
   'უძრავი ქონების გარიგების თანხლება', 'Real Estate Transaction Support',
   'ქონების შეძენის იურიდიული შემოწმება და გაფორმება.', 'Legal due diligence and closing for property purchases.', 500.00, null::int),
  ('b0000000-0000-4000-8000-000000000003'::uuid, 'standard',
   'საოჯახო სამართლის კონსულტაცია', 'Family Law Consultation',
   'განქორწინება, მეურვეობა, ალიმენტი.', 'Divorce, custody, alimony.', 180.00, 60)
) as v(pid, prog_slug, title_ka, title_en, desc_ka, desc_en, price, dur)
join public.programs pr on pr.slug = v.prog_slug;

-- ---------------------------------------------------------------------------
-- Verified (approved) cases + one pending case for the admin queue demo
-- ---------------------------------------------------------------------------
insert into public.cases
  (provider_id, case_number, title_ka, title_en, summary_ka, summary_en, practice_area_id, year, registry_url, status, reviewed_by, reviewed_at)
select v.pid, v.case_number, v.title_ka, v.title_en, v.sum_ka, v.sum_en, pa.id, v.year, v.url,
  v.status::public.case_status,
  case when v.status = 'approved' then 'a0000000-0000-4000-8000-000000000001'::uuid end,
  case when v.status = 'approved' then now() end
from (values
  ('b0000000-0000-4000-8000-000000000001'::uuid, '2/1234-23',
   'კორპორატიული დავა აქციონერებს შორის', 'Shareholder Dispute Resolution',
   'წარმატებით დავიცავით უმცირესობის აქციონერის ინტერესები კორპორაციულ დავაში.',
   'Successfully defended a minority shareholder''s interests in a corporate dispute.',
   'corporate', 2023, 'https://ecd.court.ge', 'approved'),
  ('b0000000-0000-4000-8000-000000000001'::uuid, '3/5678-24',
   'საგადასახადო დავის მოგება', 'Tax Dispute Victory',
   'გავაუქმეთ 250,000 ლარის საგადასახადო დარიცხვა სააპელაციო საბჭოში.',
   'Overturned a GEL 250,000 tax assessment at the appeals board.',
   'tax', 2024, 'https://ecd.court.ge', 'approved'),
  ('b0000000-0000-4000-8000-000000000002'::uuid, '4/9012-23',
   'ბინადრობის ნებართვის უარის გასაჩივრება', 'Residence Permit Refusal Appeal',
   'წარმატებით გავასაჩივრეთ ბინადრობის ნებართვაზე უარი; კლიენტმა მიიღო მუდმივი ბინადრობა.',
   'Successfully appealed a residence-permit refusal; the client received permanent residency.',
   'immigration', 2023, 'https://ecd.court.ge', 'approved'),
  ('b0000000-0000-4000-8000-000000000003'::uuid, '5/3456-24',
   'უძრავი ქონების საკუთრების დავა', 'Property Ownership Dispute',
   'დავიცავით კლიენტის საკუთრების უფლება სადავო მიწის ნაკვეთზე.',
   'Protected the client''s ownership rights over a disputed land plot.',
   'real-estate', 2024, 'https://ecd.court.ge', 'approved'),
  ('b0000000-0000-4000-8000-000000000002'::uuid, '6/7890-25',
   'შრომითი დავა უკანონო გათავისუფლებაზე', 'Wrongful Termination Case',
   'მიმდინარე საქმე უკანონო გათავისუფლების შესახებ.',
   'Ongoing wrongful-termination case.',
   'labor', 2025, null, 'pending')
) as v(pid, case_number, title_ka, title_en, sum_ka, sum_en, pa_slug, year, url, status)
left join public.practice_areas pa on pa.slug = v.pa_slug;
