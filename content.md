# LAWMARKET — Content & Requirements

Referenced by every build prompt alongside BRAND.md. Services, lawyers, and the
guarantee below are approved placeholders — build with them exactly as written.
Agents must never invent ADDITIONAL services, prices, lawyers, or any reviews
beyond what this file contains.

## Product requirements (owner's preferences)

- The website must be very easy to use. Straightforward, no unnecessary sections,
  no unused blank space; clean spacing and clean typography above all.
- Homepage lists all services with a **real-time search** that filters the list as
  the user types.
- Every lawyer has a **dedicated profile page**: achievements and completed cases
  listed clearly (later fed from a database as completed services accumulate), plus
  a reviews section — the two as well-thought-out side-by-side registers that scroll
  together (see BRAND.md §4 "Lawyer profile pages" for the agreed layout).
- The whole website must feel branded: colors, layout patterns, and structure should
  be recognizable as LawMarket — "you feel you are on LawMarket, not some random
  website." One design language everywhere.
- **Custom icons are a must** — no icon libraries. Placeholder SVGs following the
  brand icon rules for now; final icons later.
- **Logo/favicon:** the letter L with its vertical stroke drawn as a classical
  pillar (sense of court). Brand must be present across the whole site.

## Scope & deadline

- **Target: fully built by August 20, 2026.** Production-ready design throughout —
  every page finished to the BRAND.md standard, consistent, clean typography.
- **"One step from live":** everything is built and working EXCEPT the real backend
  and the real payment connection. The MockProvider stands in for Flitt and typed
  data files stand in for the database — both behind interfaces (ENGINEERING.md
  §2–3) so going live is a swap, not a rework. Do not build the Flitt integration
  or any real backend now.
- Services and lawyers in this file are placeholders the owner will edit before
  launch; the guarantee copy is AI-drafted and owner-reviewed. Build with them as-is.

## Decisions (locked — agents must not revisit these)

- **Payments:** Flitt, test/sandbox mode for now, behind the provider interface
  (ENGINEERING.md §3). MockProvider until credentials arrive.
- **Accounts:** none — guest checkout only (ENGINEERING.md §4).
- **Notifications:** OUT OF SCOPE for the website. Do not build email/notification
  systems; the order record and Flitt merchant tools cover v1.
- **Content ops:** v1 is hand-edited typed data files (this stage tests demand);
  database comes later — hence the mandatory repository layer (ENGINEERING.md §2).
- **Hosting:** Vercel, auto-deploy from GitHub `main` — main stays shippable,
  feature branches + preview deployments for review.
- **Analytics:** privacy-friendly (Plausible/Umami) + Sentry; no cookie banner.

## Site map

- `/` — homepage: hero, services ledger with live search, guarantee clauses,
  lawyers register (preview), footer colophon
- `/services/[slug]` — service detail: what's included, price, guarantee terms,
  assigned lawyers, checkout entry
- `/lawyers` — the full bar register (all lawyers, rule-separated rows)
- `/lawyers/[slug]` — lawyer profile (case-file layout)
- `/checkout` — direct checkout, order summary typeset as engagement letter
- `/guarantee` — the guarantee explained in full
- `/about`, `/terms`, `/privacy`

## Services (PLACEHOLDER — owner will adjust names/prices before launch)

```
სამოქალაქო სამართალი / CIVIL LAW
§ 01 · იურიდიული კონსულტაცია · Legal Consultation · ₾ 80 · ერთსაათიანი კონსულტაცია იურისტთან თქვენს საკითხზე · A one-hour consultation with a lawyer on your matter
§ 02 · ხელშეკრულების მომზადება · Contract Drafting · ₾ 150 · ინდივიდუალურად შედგენილი ხელშეკრულება თქვენი გარიგებისთვის · A contract drafted individually for your transaction
§ 03 · ხელშეკრულების ანალიზი · Contract Review · ₾ 100 · არსებული ხელშეკრულების სამართლებრივი შეფასება რისკების მითითებით · Legal assessment of an existing contract with identified risks
§ 04 · სამართლებრივი პრეტენზია · Legal Demand Letter · ₾ 90 · ოფიციალური პრეტენზიის მომზადება და გაგზავნა · Preparation and dispatch of a formal demand letter
§ 05 · სარჩელის მომზადება · Court Claim Preparation · ₾ 250 · სარჩელისა და თანდართული დოკუმენტების მომზადება სასამართლოსთვის · Preparation of a claim and supporting documents for court
§ 06 · განქორწინების წარმოება · Divorce Proceedings · ₾ 400 · განქორწინების საქმის სრული სამართლებრივი წარმოება · Full legal handling of a divorce case
§ 07 · ალიმენტის დაკისრება · Child Support Claim · ₾ 300 · ალიმენტის მოთხოვნის საქმის წარმოება · Handling of a child support claim
§ 08 · მემკვიდრეობის გაფორმება · Inheritance Registration · ₾ 200 · სამკვიდრო მოწმობის მიღება და ქონების გადაფორმება · Obtaining the certificate of inheritance and re-registering assets
§ 09 · უძრავი ქონების ნასყიდობა · Real Estate Purchase Agreement · ₾ 180 · ნასყიდობის ხელშეკრულების მომზადება და რეგისტრაციის თანხლება · Purchase agreement drafting and registration support
§ 10 · იჯარის ხელშეკრულება · Lease Agreement · ₾ 120 · საცხოვრებელი ან კომერციული ფართის იჯარის ხელშეკრულება · Lease agreement for residential or commercial property
§ 11 · ზიანის ანაზღაურება · Damages Claim · ₾ 350 · მიყენებული ზიანის ანაზღაურების მოთხოვნის წარმოება · Pursuing compensation for damages suffered
§ 12 · მინდობილობის მომზადება · Power of Attorney · ₾ 60 · მინდობილობის ტექსტის მომზადება ნოტარიუსთან დასამოწმებლად · Power of attorney text prepared for notarization

შრომის სამართალი / LABOR LAW
§ 13 · შრომითი დავის კონსულტაცია · Labor Dispute Consultation · ₾ 120 · კონსულტაცია სამსახურიდან გათავისუფლების ან შრომითი დავის საკითხზე · Consultation on dismissal or a workplace dispute

კორპორატიული სამართალი / CORPORATE LAW
§ 14 · შპს რეგისტრაცია · LLC Registration · ₾ 250 · შპს-ის სრული რეგისტრაცია საჯარო რეესტრში · Full registration of an LLC with the Public Registry
§ 15 · ინდ. მეწარმის რეგისტრაცია · Sole Proprietor Registration · ₾ 100 · ინდივიდუალური მეწარმის რეგისტრაცია და საწყისი კონსულტაცია · Individual entrepreneur registration with initial guidance
```

## Lawyers (REAL partner lawyers — owner-provided, 2026-08-11)

The five lawyers below are LawMarket's actual partner lawyers. GBA bar numbers,
photos, and case histories are pending (the site hides the bar-number field until
real numbers arrive). Specialisations and service assignments are a provisional
distribution — owner: "distribute them however you wish for now" — and may be
reassigned freely. Case and review registers stay EMPTY until real completions
accumulate; nothing may be fabricated about these real people.

```
თამთა ბიბილურიძე / Tamta Bibiluridze · სახელშეკრულებო სამართალი / Contract Law · § 02, § 03, § 10
ლიზა გიკაშვილი / Liza Gikashvili · საოჯახო სამართალი / Family Law · § 06, § 07, § 08
მარიამ ზაკაიძე / Mariam Zakaidze · კორპორატიული და შრომის სამართალი / Corporate & Labor Law · § 13, § 14, § 15
თია ლაშქარიშვილი / Tia Lashkarishvili · სასამართლო დავები / Litigation · § 04, § 05, § 11
ქეთევან შაოშვილი / Ketevan Shaoshvili · სამოქალაქო სამართალი / Civil Law · § 01, § 09, § 12
```

## The guarantee (AI-drafted original — owner reviews and may edit)

**ქართული:**
ყოველ მომსახურებას LawMarket-ზე თან ახლავს წერილობითი გარანტია. თქვენ მიიღებთ
ზუსტად იმ მომსახურებას, რომელიც აღწერილია გვერდზე — შესრულებულს დანიშნული
იურისტის მიერ, მითითებულ ვადაში. თუ მომსახურება არ შესრულდა აღწერილი პირობებით,
ჩვენ სრულად დაგიბრუნებთ გადახდილ თანხას. ფასი, რომელსაც ხედავთ, არის პირობა,
რომელსაც ხელს ვაწერთ.

**English:**
Every service on LawMarket carries a written guarantee. You receive exactly the
service described on its page — performed by the assigned lawyer, within the stated
term. If the service is not delivered as described, we return the full amount you
paid. The price you see is a term we sign.

## Reviews (TODO — real reviews only)

No fabricated testimonials. Until real reviews exist, profile review registers show
a typeset empty state ("Reviews appear here as clients complete guaranteed
services") — never fake names or star ratings.
