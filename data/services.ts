import type { Service } from "./types";

export const services: Service[] = [
  {
    id: "srv-llc-formation",
    slug: "llc-formation",
    categoryId: "cat-business",
    title_en: "LLC Formation",
    title_ka: "შპს-ს დაფუძნება",
    description_en:
      "Full company registration service: name reservation, founding documents, and registration with the Public Registry, so your LLC is ready to operate.",
    description_ka:
      "კომპანიის სრული რეგისტრაციის სერვისი: სახელის დაჯავშნა, დამფუძნებელი დოკუმენტები და რეგისტრაცია საჯარო რეესტრში, რათა თქვენი შპს მზად იყოს საქმიანობისთვის.",
    price: 799,
    currency: "GEL",
    durationMinutes: null,
    lawyerId: "law-nino-beridze",
    popular: true,
    includes_en: [
      "Company name availability check",
      "Founding documents drafted and filed",
      "Public Registry registration",
      "Bank-ready company extract",
    ],
    includes_ka: [
      "კომპანიის სახელის ხელმისაწვდომობის შემოწმება",
      "დამფუძნებელი დოკუმენტების მომზადება და წარდგენა",
      "საჯარო რეესტრში რეგისტრაცია",
      "ბანკისთვის გამოსაყენებელი ამონაწერი",
    ],
    faq_en: [
      {
        q: "How long does LLC registration take?",
        a: "Most registrations complete within 5–10 business days after documents are submitted.",
      },
      {
        q: "Do I need to visit in person?",
        a: "In most cases, registration can be handled remotely with a power of attorney.",
      },
    ],
    faq_ka: [
      {
        q: "რამდენ ხანში დასრულდება შპს-ს რეგისტრაცია?",
        a: "დოკუმენტების წარდგენის შემდეგ რეგისტრაცია ჩვეულებრივ 5–10 სამუშაო დღეში სრულდება.",
      },
      {
        q: "საჭიროა პირადად მოსვლა?",
        a: "უმეტეს შემთხვევაში რეგისტრაცია დისტანციურადაც შეიძლება, მინდობილობის საფუძველზე.",
      },
    ],
  },
  {
    id: "srv-contract-review",
    slug: "contract-review",
    categoryId: "cat-contracts",
    title_en: "Contract Review",
    title_ka: "ხელშეკრულების შემოწმება",
    description_en:
      "A thorough review of any contract before you sign, with plain-language notes on risks, unusual clauses, and suggested changes.",
    description_ka:
      "ნებისმიერი ხელშეკრულების საფუძვლიანი შემოწმება ხელმოწერამდე, რისკებზე, უჩვეულო პუნქტებზე და შესაძლო ცვლილებებზე გასაგებ ენაზე შენიშვნებით.",
    price: 349,
    currency: "GEL",
    durationMinutes: 60,
    lawyerId: "law-mariam-chkheidze",
    popular: true,
    includes_en: [
      "Full clause-by-clause review",
      "Risk summary in plain language",
      "Suggested edits and redlines",
      "30-minute follow-up call",
    ],
    includes_ka: [
      "პუნქტ-პუნქტოვანი სრული შემოწმება",
      "რისკების მოკლე შეჯამება გასაგებ ენაზე",
      "შემოთავაზებული ცვლილებები და შენიშვნები",
      "30-წუთიანი დამატებითი კონსულტაცია",
    ],
    faq_en: [
      {
        q: "What types of contracts can you review?",
        a: "Employment, service, lease, partnership, and commercial agreements of any length.",
      },
      {
        q: "How fast is the turnaround?",
        a: "Standard review is delivered within 2 business days of receiving the document.",
      },
    ],
    faq_ka: [
      {
        q: "რა ტიპის ხელშეკრულებებს ამოწმებთ?",
        a: "შრომით, სამომსახურეო, იჯარის, პარტნიორულ და სავაჭრო ხელშეკრულებებს ნებისმიერი მოცულობით.",
      },
      {
        q: "რამდენ ხანში მივიღებ შედეგს?",
        a: "სტანდარტული შემოწმება დოკუმენტის მიღებიდან 2 სამუშაო დღეში ეგზავნება.",
      },
    ],
  },
  {
    id: "srv-divorce-filing",
    slug: "divorce-filing",
    categoryId: "cat-family",
    title_en: "Divorce Filing",
    title_ka: "განქორწინების საქმის წარმოება",
    description_en:
      "End-to-end support for filing an uncontested divorce, including document preparation and court filing, handled with care and confidentiality.",
    description_ka:
      "სრული მხარდაჭერა შეუთანხმებელი განქორწინების საქმის წარსადგენად, დოკუმენტების მომზადებისა და სასამართლოში წარდგენის ჩათვლით, ყურადღებითა და კონფიდენციალურობით.",
    price: 899,
    currency: "GEL",
    durationMinutes: null,
    lawyerId: "law-giorgi-abashidze",
    popular: true,
    includes_en: [
      "Initial consultation and case assessment",
      "All required court documents prepared",
      "Filing with the relevant court",
      "Status updates until judgment",
    ],
    includes_ka: [
      "საწყისი კონსულტაცია და საქმის შეფასება",
      "სასამართლოსთვის საჭირო ყველა დოკუმენტის მომზადება",
      "შესაბამის სასამართლოში წარდგენა",
      "გადაწყვეტილებამდე სტატუსის განახლებები",
    ],
    faq_en: [
      {
        q: "Is this for contested divorces?",
        a: "This service covers uncontested divorces. Contested cases require a separate consultation.",
      },
      {
        q: "How long does the process take?",
        a: "Timelines vary by court, but uncontested cases typically resolve in 2–4 months.",
      },
    ],
    faq_ka: [
      {
        q: "ეს შეუთანხმებელი განქორწინებისთვისაა?",
        a: "ეს სერვისი მოიცავს შეთანხმებით განქორწინებას. დავიანი შემთხვევები ცალკე კონსულტაციას საჭიროებს.",
      },
      {
        q: "რამდენ ხანს გრძელდება პროცესი?",
        a: "ვადები სასამართლოზეა დამოკიდებული, მაგრამ შეთანხმებით შემთხვევები ჩვეულებრივ 2–4 თვეში სრულდება.",
      },
    ],
  },
  {
    id: "srv-trademark-registration",
    slug: "trademark-registration",
    categoryId: "cat-business",
    title_en: "Trademark Registration",
    title_ka: "სასაქონლო ნიშნის რეგისტრაცია",
    description_en:
      "Protect your brand name and logo with a full trademark search and registration application with the National Intellectual Property Center.",
    description_ka:
      "დაიცავით თქვენი ბრენდის სახელი და ლოგო სასაქონლო ნიშნის სრული ძიებითა და საქართველოს ინტელექტუალური საკუთრების ეროვნულ ცენტრში რეგისტრაციის განაცხადით.",
    price: 649,
    currency: "GEL",
    durationMinutes: null,
    lawyerId: "law-nino-beridze",
    popular: true,
    includes_en: [
      "Trademark availability search",
      "Application drafted and filed with Sakpatenti",
      "Response to basic office actions",
      "Registration certificate guidance",
    ],
    includes_ka: [
      "სასაქონლო ნიშნის ხელმისაწვდომობის ძიება",
      "განაცხადის მომზადება და წარდგენა საქპატენტოში",
      "საწყისი ოფისის მოთხოვნებზე პასუხი",
      "რეგისტრაციის მოწმობის მიღების რჩევები",
    ],
    faq_en: [
      {
        q: "How long does trademark registration take?",
        a: "The full process typically takes 8–12 months depending on examination.",
      },
      {
        q: "Can I register a logo and a name together?",
        a: "Yes — combined or separate applications can be filed depending on your brand strategy.",
      },
    ],
    faq_ka: [
      {
        q: "რამდენ ხანში სრულდება სასაქონლო ნიშნის რეგისტრაცია?",
        a: "სრული პროცესი ჩვეულებრივ 8–12 თვეს გრძელდება განხილვის მიხედვით.",
      },
      {
        q: "შემიძლია ლოგოსა და სახელის ერთად რეგისტრაცია?",
        a: "დიახ — შესაძლებელია როგორც ერთიანი, ისე ცალკე განაცხადების წარდგენა.",
      },
    ],
  },
  {
    id: "srv-will-estate-planning",
    slug: "will-estate-planning",
    categoryId: "cat-family",
    title_en: "Will & Estate Planning",
    title_ka: "ანდერძი და მემკვიდრეობის დაგეგმვა",
    description_en:
      "Draft a legally sound will that reflects your wishes and protects your family, with guidance on estate planning options.",
    description_ka:
      "შეადგინეთ იურიდიულად უზადო ანდერძი, რომელიც ასახავს თქვენს სურვილებს და იცავს თქვენს ოჯახს, მემკვიდრეობის დაგეგმვის ვარიანტებზე კონსულტაციით.",
    price: 599,
    currency: "GEL",
    durationMinutes: null,
    lawyerId: "law-giorgi-abashidze",
    popular: true,
    includes_en: [
      "Consultation on your wishes and assets",
      "Will drafted to Georgian law standards",
      "Notarization guidance",
      "One round of revisions included",
    ],
    includes_ka: [
      "კონსულტაცია თქვენს სურვილებსა და აქტივებზე",
      "ანდერძის შედგენა საქართველოს კანონმდებლობის მიხედვით",
      "ნოტარიულად დამოწმების რჩევები",
      "ერთი რევიზიის რაუნდი ჩართულია",
    ],
    faq_en: [
      {
        q: "Is notarization included in the price?",
        a: "Notary fees are separate; we guide you through the process and required documents.",
      },
      {
        q: "Can this cover property abroad?",
        a: "We can address Georgian assets fully; foreign assets may need coordination with local counsel.",
      },
    ],
    faq_ka: [
      {
        q: "ნოტარიუსის ფასი ფასში შედის?",
        a: "ნოტარიუსის საფასური ცალკეა; ჩვენ გიყვანთ პროცესში და საჭირო დოკუმენტებში.",
      },
      {
        q: "შეიძლება საზღვარგარეთის ქონების ჩართვა?",
        a: "საქართველოს აქტივებს სრულად ვაფარებთ; უცხოური აქტივები შეიძლება საჭიროებდეს ადგილობრივ იურისტს.",
      },
    ],
  },
  {
    id: "srv-visa-residence-permit",
    slug: "visa-residence-permit-filing",
    categoryId: "cat-immigration",
    title_en: "Visa & Residence Permit Filing",
    title_ka: "ვიზისა და ბინადრობის ნებართვის განაცხადი",
    description_en:
      "Preparation and submission of your residence permit or visa application, including document checklists tailored to your situation.",
    description_ka:
      "თქვენი ბინადრობის ნებართვის ან ვიზის განაცხადის მომზადება და წარდგენა, თქვენს სიტუაციაზე მორგებული საბუთების ჩამონათვალის ჩათვლით.",
    price: 549,
    currency: "GEL",
    durationMinutes: null,
    lawyerId: "law-ana-kapanadze",
    popular: true,
    includes_en: [
      "Eligibility assessment for your situation",
      "Document checklist and preparation",
      "Application filed with relevant authority",
      "Follow-up until decision",
    ],
    includes_ka: [
      "თქვენს სიტუაციაზე უფლებამოსილების შეფასება",
      "საბუთების ჩამონათვალი და მომზადება",
      "განაცხადის წარდგენა შესაბამის ორგანოში",
      "გადაწყვეტამდე თანაგზობა",
    ],
    faq_en: [
      {
        q: "Which residence permits do you handle?",
        a: "Work, study, family reunification, and special-category permits for Georgia.",
      },
      {
        q: "Can you help if my application was rejected?",
        a: "Yes — we can review the decision and advise on appeal or reapplication options.",
      },
    ],
    faq_ka: [
      {
        q: "რომელი ბინადრობის ნებართვებს ამზადებთ?",
        a: "სამუშაო, სწავლის, ოჯახის შეხვედრისა და სპეციალური კატეგორიის ნებართვებს საქართველოში.",
      },
      {
        q: "დამეხმარებით, თუ განაცხადი უარყოფილია?",
        a: "დიახ — გადაწყვეტილებას გავაანალიზებთ და გირჩევთ სააპელაციო ან ხელახალი განაცხადის ვარიანტებს.",
      },
    ],
  },
  {
    id: "srv-property-purchase-review",
    slug: "property-purchase-agreement-review",
    categoryId: "cat-real-estate",
    title_en: "Property Purchase Agreement Review",
    title_ka: "უძრავი ქონების ნასყიდობის ხელშეკრულების შემოწმება",
    description_en:
      "Independent review of a property purchase agreement to check ownership history, encumbrances, and contract terms before you buy.",
    description_ka:
      "უძრავი ქონების ნასყიდობის ხელშეკრულების დამოუკიდებელი შემოწმება საკუთრების ისტორიის, ტვირთის და ხელშეკრულების პირობების დასადგენად შეძენამდე.",
    price: 449,
    currency: "GEL",
    durationMinutes: 90,
    lawyerId: "law-levan-tsereteli",
  },
  {
    id: "srv-business-registration-consult",
    slug: "business-registration-consultation",
    categoryId: "cat-business",
    title_en: "Business Registration Consultation",
    title_ka: "ბიზნესის რეგისტრაციის კონსულტაცია",
    description_en:
      "A one-on-one session to choose the right business structure and understand the registration process before you commit.",
    description_ka:
      "პირადი კონსულტაცია სწორი ბიზნეს-სტრუქტურის შესარჩევად და რეგისტრაციის პროცესის გასაგებად გადაწყვეტილების მიღებამდე.",
    price: 199,
    currency: "GEL",
    durationMinutes: 45,
    lawyerId: "law-nino-beridze",
  },
  {
    id: "srv-child-custody-consult",
    slug: "child-custody-consultation",
    categoryId: "cat-family",
    title_en: "Child Custody Consultation",
    title_ka: "მეურვეობის საკითხზე კონსულტაცია",
    description_en:
      "A confidential session to understand your rights and options in a custody matter, and what to expect from the process.",
    description_ka:
      "კონფიდენციალური კონსულტაცია მეურვეობის საკითხში თქვენი უფლებებისა და შესაძლებლობების გასაგებად და პროცესისგან მოსალოდნელის გასაცნობად.",
    price: 249,
    currency: "GEL",
    durationMinutes: 45,
    lawyerId: "law-giorgi-abashidze",
  },
  {
    id: "srv-employment-contract-drafting",
    slug: "employment-contract-drafting",
    categoryId: "cat-contracts",
    title_en: "Employment Contract Drafting",
    title_ka: "შრომითი ხელშეკრულების შედგენა",
    description_en:
      "A custom employment agreement drafted for your business, compliant with Georgian labor law and tailored to the role.",
    description_ka:
      "თქვენი ბიზნესისთვის მორგებული შრომითი ხელშეკრულების შედგენა, საქართველოს შრომის კანონმდებლობასთან შესაბამისობით.",
    price: 399,
    currency: "GEL",
    durationMinutes: null,
    lawyerId: "law-mariam-chkheidze",
  },
  {
    id: "srv-tax-consultation-small-business",
    slug: "tax-consultation-small-business",
    categoryId: "cat-tax",
    title_en: "Tax Consultation for Small Business",
    title_ka: "საგადასახადო კონსულტაცია მცირე ბიზნესისთვის",
    description_en:
      "Understand your tax obligations, including small business status eligibility, and get a clear plan for staying compliant.",
    description_ka:
      "გაიგეთ თქვენი საგადასახადო ვალდებულებები, მცირე ბიზნესის სტატუსის შესაბამისობის ჩათვლით, და მიიღეთ მკაფიო გეგმა შესაბამისობის შესანარჩუნებლად.",
    price: 299,
    currency: "GEL",
    durationMinutes: 45,
    lawyerId: "law-david-lomidze",
  },
  {
    id: "srv-criminal-defense-consult",
    slug: "criminal-defense-consultation",
    categoryId: "cat-criminal",
    title_en: "Criminal Defense Consultation",
    title_ka: "სისხლის სამართლის დაცვის კონსულტაცია",
    description_en:
      "An urgent, confidential consultation to understand the charges against you and your immediate options and rights.",
    description_ka:
      "სასწრაფო, კონფიდენციალური კონსულტაცია თქვენს წინააღმდეგ წაყენებული ბრალდებისა და თქვენი უშუალო შესაძლებლობებისა და უფლებების გასაცნობად.",
    price: 349,
    currency: "GEL",
    durationMinutes: 30,
    lawyerId: "law-ketevan-japaridze",
  },
  {
    id: "srv-notarized-translation",
    slug: "notarized-document-translation",
    categoryId: "cat-notary",
    title_en: "Notarized Document Translation",
    title_ka: "დოკუმენტის ნოტარიულად დამოწმებული თარგმანი",
    description_en:
      "Certified translation and notarization of personal or business documents for use in Georgia or abroad.",
    description_ka:
      "პირადი ან ბიზნეს დოკუმენტების დამოწმებული თარგმანი და ნოტარიული დამოწმება საქართველოში ან საზღვარგარეთ გამოსაყენებლად.",
    price: 149,
    currency: "GEL",
    durationMinutes: null,
    lawyerId: "law-irakli-mchedlishvili",
  },
  {
    id: "srv-landlord-tenant-dispute",
    slug: "landlord-tenant-dispute-resolution",
    categoryId: "cat-real-estate",
    title_en: "Landlord-Tenant Dispute Resolution",
    title_ka: "მეიჯარე-მოიჯარეს დავის მოგვარება",
    description_en:
      "Guidance and representation for resolving disputes over deposits, repairs, or lease terms between landlords and tenants.",
    description_ka:
      "კონსულტაცია და წარმომადგენლობა დეპოზიტების, შეკეთებების ან იჯარის პირობებთან დაკავშირებული დავების მოსაგვარებლად მეიჯარესა და მოიჯარეს შორის.",
    price: 499,
    currency: "GEL",
    durationMinutes: null,
    lawyerId: "law-levan-tsereteli",
  },
  {
    id: "srv-citizenship-application",
    slug: "citizenship-application-assistance",
    categoryId: "cat-immigration",
    title_en: "Citizenship Application Assistance",
    title_ka: "მოქალაქეობის განაცხადის მხარდაჭერა",
    description_en:
      "Complete support through the citizenship application process, from eligibility review to document submission.",
    description_ka:
      "სრული მხარდაჭერა მოქალაქეობის განაცხადის პროცესში, უფლებამოსილების შემოწმებიდან დოკუმენტების წარდგენამდე.",
    price: 799,
    currency: "GEL",
    durationMinutes: null,
    lawyerId: "law-ana-kapanadze",
  },
  {
    id: "srv-prenuptial-agreement",
    slug: "prenuptial-agreement-drafting",
    categoryId: "cat-family",
    title_en: "Prenuptial Agreement Drafting",
    title_ka: "საქორწინო კონტრაქტის შედგენა",
    description_en:
      "A clear, fair prenuptial agreement drafted to protect both partners' interests before marriage.",
    description_ka:
      "ნათელი და სამართლიანი საქორწინო კონტრაქტის შედგენა, რომელიც დაიცავს ორივე პარტნიორის ინტერესებს ქორწინებამდე.",
    price: 449,
    currency: "GEL",
    durationMinutes: null,
    lawyerId: "law-giorgi-abashidze",
  },
];
