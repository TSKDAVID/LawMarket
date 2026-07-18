-- Demo seed for local/testing visibility (idempotent-ish via fixed UUIDs)
-- Passwords for all demo accounts: DemoPass123!

create extension if not exists pgcrypto;

do $$
declare
  v_instance uuid := '00000000-0000-0000-0000-000000000000';
  u1 uuid := '11111111-1111-4111-8111-111111111111';
  u2 uuid := '22222222-2222-4222-8222-222222222222';
  u3 uuid := '33333333-3333-4333-8333-333333333333';
  u4 uuid := '44444444-4444-4444-8444-444444444444'; -- demo client
  prog_standard uuid;
  prog_expat uuid;
  pa_corp uuid;
  pa_imm uuid;
  pa_labor uuid;
  pa_re uuid;
  pw text := crypt('DemoPass123!', gen_salt('bf'));
begin
  select id into prog_standard from public.programs where slug = 'standard_legal';
  select id into prog_expat from public.programs where slug = 'expat_consultation';
  select id into pa_corp from public.practice_areas where slug = 'corporate';
  select id into pa_imm from public.practice_areas where slug = 'immigration';
  select id into pa_labor from public.practice_areas where slug = 'labor';
  select id into pa_re from public.practice_areas where slug = 'real-estate';

  -- ── Auth users ───────────────────────────────────────────────
  insert into auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
    confirmation_token, recovery_token, email_change_token_new, email_change
  )
  values
    (v_instance, u1, 'authenticated', 'authenticated', 'nino.beridze@demo.lawmarket.ge', pw, now(),
     '{"provider":"email","providers":["email"]}'::jsonb,
     '{"full_name":"ნინო ბერიძე"}'::jsonb, now(), now(), '', '', '', ''),
    (v_instance, u2, 'authenticated', 'authenticated', 'giorgi.kapanadze@demo.lawmarket.ge', pw, now(),
     '{"provider":"email","providers":["email"]}'::jsonb,
     '{"full_name":"გიორგი კაპანაძე"}'::jsonb, now(), now(), '', '', '', ''),
    (v_instance, u3, 'authenticated', 'authenticated', 'anna.smith@demo.lawmarket.ge', pw, now(),
     '{"provider":"email","providers":["email"]}'::jsonb,
     '{"full_name":"Anna Smith"}'::jsonb, now(), now(), '', '', '', ''),
    (v_instance, u4, 'authenticated', 'authenticated', 'client.demo@demo.lawmarket.ge', pw, now(),
     '{"provider":"email","providers":["email"]}'::jsonb,
     '{"full_name":"დემო კლიენტი"}'::jsonb, now(), now(), '', '', '', '')
  on conflict (id) do nothing;

  insert into auth.identities (
    id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
  )
  values
    (u1, u1, format('{"sub":"%s","email":"%s"}', u1, 'nino.beridze@demo.lawmarket.ge')::jsonb, 'email', u1::text, now(), now(), now()),
    (u2, u2, format('{"sub":"%s","email":"%s"}', u2, 'giorgi.kapanadze@demo.lawmarket.ge')::jsonb, 'email', u2::text, now(), now(), now()),
    (u3, u3, format('{"sub":"%s","email":"%s"}', u3, 'anna.smith@demo.lawmarket.ge')::jsonb, 'email', u3::text, now(), now(), now()),
    (u4, u4, format('{"sub":"%s","email":"%s"}', u4, 'client.demo@demo.lawmarket.ge')::jsonb, 'email', u4::text, now(), now(), now())
  on conflict do nothing;

  -- Trigger may have created profiles; ensure rows exist then upgrade providers
  insert into public.profiles (id, full_name, role)
  values
    (u1, 'ნინო ბერიძე', 'client'),
    (u2, 'გიორგი კაპანაძე', 'client'),
    (u3, 'Anna Smith', 'client'),
    (u4, 'დემო კლიენტი', 'client')
  on conflict (id) do nothing;

  update public.profiles set
    role = 'provider',
    public_slug = 'nino-beridze',
    city = 'თბილისი',
    phone = '+995 555 11 22 33',
    bio = 'კორპორაციული და კომერციული სამართლის ადვოკატი 12+ წლიანი გამოცდილებით. ხელით დადასტურებული საქმეები და გამჭვირვალე პროფილი.',
    onboarding_completed = true,
    is_active = true
  where id = u1;

  update public.profiles set
    role = 'provider',
    public_slug = 'giorgi-kapanadze',
    city = 'ბათუმი',
    phone = '+995 555 44 55 66',
    bio = 'უძრავი ქონებისა და სამშენებლო დავების სპეციალისტი. მუშაობს ქართულად და რუსულად.',
    onboarding_completed = true,
    is_active = true
  where id = u2;

  update public.profiles set
    role = 'provider',
    public_slug = 'anna-smith',
    city = 'თბილისი',
    phone = '+995 555 77 88 99',
    bio = 'Immigration and business setup for expats. English-first consultations; Georgian court work with local counsel.',
    onboarding_completed = true,
    is_active = true
  where id = u3;

  update public.profiles set
    role = 'client',
    city = 'თბილისი',
    onboarding_completed = true,
    is_active = true
  where id = u4;

  insert into public.provider_details (profile_id, law_firm, years_experience, languages, subscription_status, identity_verified)
  values
    (u1, 'Beridze & Partners', 12, array['ka','en'], 'active', true),
    (u2, 'Kapanadze Law', 8, array['ka','ru'], 'active', true),
    (u3, 'Smith Legal Georgia', 6, array['en','ka'], 'active', true)
  on conflict (profile_id) do update set
    law_firm = excluded.law_firm,
    years_experience = excluded.years_experience,
    languages = excluded.languages,
    subscription_status = excluded.subscription_status,
    identity_verified = excluded.identity_verified;

  -- Practice areas
  insert into public.provider_practice_areas (provider_id, practice_area_id)
  values
    (u1, pa_corp), (u1, pa_labor),
    (u2, pa_re), (u2, pa_corp),
    (u3, pa_imm), (u3, pa_corp)
  on conflict do nothing;

  -- Clear prior demo services/cases for these providers (safe re-seed)
  delete from public.cases where provider_id in (u1, u2, u3);
  delete from public.services where provider_id in (u1, u2, u3);

  insert into public.services (provider_id, program_id, practice_area_id, title, description, pricing_model, price_gel, is_published)
  values
    (u1, prog_standard, pa_corp, 'შპს რეგისტრაცია', 'სრული რეგისტრაცია, წესდება და საბანკო გახსნის მხარდაჭერა.', 'fixed', 450, true),
    (u1, prog_standard, pa_labor, 'შრომითი ხელშეკრულების მომზადება', 'ინდივიდუალური ან შაბლონური ხელშეკრულება კანონმდებლობის შესაბამისად.', 'fixed', 200, true),
    (u1, prog_expat, pa_corp, 'ექსპატების ბიზნეს კონსულტაცია', 'უცხოელი დამფუძნებლისთვის კომპანიის გახსნა და საგადასახადო მიმოხილვა.', 'fixed', 100, true),
    (u2, prog_standard, pa_re, 'უძრავი ქონების გარიგების შემოწმება', 'საკადასტრო და იურიდიული რისკების შემოწმება ყიდვამდე.', 'fixed', 350, true),
    (u2, prog_standard, pa_re, 'იჯარის ხელშეკრულება', 'საცხოვრებელი ან კომერციული იჯარა.', 'fixed', 180, true),
    (u3, prog_expat, pa_imm, 'Residence permit consultation', 'Document checklist and strategy call for temporary residence.', 'fixed', 100, true),
    (u3, prog_standard, pa_imm, 'Visa appeal support', 'Written appeal package for refused visa decisions.', 'quote', null, true),
    (u3, prog_standard, pa_corp, 'Foreign founder company setup', 'LLC registration with non-resident founder.', 'fixed', 550, true);

  insert into public.cases (
    provider_id, practice_area_id, case_number, title, summary,
    public_decision_reference, verification_status, is_public, verified_at, requires_client_consent
  )
  values
    (u1, pa_corp, 'C-2024-0142', 'შპს წილის გადაცემის დავა',
     'კლიენტისთვის დაცულია წილის გადაცემის ხელშეკრულების ძალა და აღსრულება.',
     'https://example.com/decisions/c-2024-0142', 'verified', true, now(), false),
    (u1, pa_labor, 'C-2023-0881', 'უკანონო გათავისუფლება',
     'სასამართლომ დააკმაყოფილა მოთხოვნა სამსახურში აღდგენის თაობაზე.',
     'https://example.com/decisions/c-2023-0881', 'verified', true, now(), false),
    (u2, pa_re, 'C-2024-2201', 'უძრავი ქონების საკუთრების აღიარება',
     'დადასტურდა კლიენტის საკუთრება სადავო ბინაზე.',
     'https://example.com/decisions/c-2024-2201', 'verified', true, now(), false),
    (u3, pa_imm, 'C-2025-0033', 'Temporary residence approval',
     'Successful residence permit after prior refusal; case summary published with consent waived (demo).',
     'https://example.com/decisions/c-2025-0033', 'verified', true, now(), false);
end $$;
