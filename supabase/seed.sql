insert into public.practice_areas (slug, name) values
  ('corporate', 'კორპორაციული სამართალი'),
  ('immigration', 'იმიგრაცია'),
  ('labor', 'შრომის სამართალი'),
  ('real-estate', 'უძრავი ქონება'),
  ('family', 'ოჯახის სამართალი'),
  ('litigation', 'სასამართლო წარმოება')
on conflict (slug) do nothing;

insert into public.programs (slug, name, description, config) values
  (
    'standard_legal',
    'სტანდარტული იურიდიული მომსახურება',
    'ზოგადი იურიდიული სერვისები პროვაიდერებისგან',
    '{"requires_scheduling": false}'::jsonb
  ),
  (
    'expat_consultation',
    'ექსპატების კონსულტაცია',
    'უცხოელებისთვის — განაცხადი, მიღება, შემდეგ გადახდა და ზარი',
    '{
      "requires_scheduling": true,
      "requires_application": true,
      "price_gel": 100,
      "eligibility_criteria": [
        {"id": "residency", "label_ka": "ცხოვრობთ საქართველოში როგორც უცხოელი / ექსპატი", "type": "boolean", "required": true},
        {"id": "matter_type", "label_ka": "საკითხის ტიპი", "type": "select", "options": ["ვიზა", "ბინადრობა", "შრომა", "ბიზნესი", "სხვა"], "required": true},
        {"id": "urgency", "label_ka": "სასწრაფოა თუ არა", "type": "boolean", "required": false}
      ]
    }'::jsonb
  )
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  config = excluded.config;
