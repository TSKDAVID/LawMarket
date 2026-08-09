import type { Lawyer } from "./types";

const photo = (id: string) =>
  `https://images.unsplash.com/${id}?w=400&h=500&fit=crop&crop=faces`;

export const lawyers: Lawyer[] = [
  {
    id: "law-nino-beridze",
    slug: "nino-beridze",
    name: "Nino Beridze",
    initials: "NB",
    avatarColor: "#6b1423",
    photoUrl: photo("photo-1573496359142-b8d87734a5a2"),
    headline_en: "Business & Corporate Lawyer",
    headline_ka: "ბიზნესის და კორპორატიული სამართლის იურისტი",
    bio_en:
      "Nino has spent over a decade helping founders register companies, structure investments, and protect their brands across Georgia. She is known for explaining complex corporate matters in plain language.",
    bio_ka:
      "ნინო ათ წელზე მეტია ეხმარება დამფუძნებლებს კომპანიების რეგისტრაციაში, ინვესტიციების სტრუქტურირებასა და ბრენდის დაცვაში საქართველოში. იგი ცნობილია რთული კორპორატიული საკითხების მარტივად ახსნით.",
    city: "Tbilisi",
    languages: ["Georgian", "English", "Russian"],
    yearsExperience: 11,
    practiceAreaIds: ["cat-business", "cat-contracts"],
    verified: true,
  },
  {
    id: "law-giorgi-abashidze",
    slug: "giorgi-abashidze",
    name: "Giorgi Abashidze",
    initials: "GA",
    avatarColor: "#1c1210",
    photoUrl: photo("photo-1560250097-0b93528c311a"),
    headline_en: "Family Law Attorney",
    headline_ka: "საოჯახო სამართლის ადვოკატი",
    bio_en:
      "Giorgi guides families through divorce, custody, and inheritance matters with a calm, practical approach, focused on protecting his clients and their children.",
    bio_ka:
      "გიორგი ოჯახებს უძღვება განქორწინების, მეურვეობისა და მემკვიდრეობის საკითხებში მშვიდი და პრაქტიკული მიდგომით, კლიენტებისა და მათი შვილების დაცვაზე ორიენტირებით.",
    city: "Tbilisi",
    languages: ["Georgian", "English"],
    yearsExperience: 9,
    practiceAreaIds: ["cat-family"],
    verified: true,
  },
  {
    id: "law-ana-kapanadze",
    slug: "ana-kapanadze",
    name: "Ana Kapanadze",
    initials: "AK",
    avatarColor: "#8a6d3b",
    photoUrl: photo("photo-1580489944761-15a19d654956"),
    headline_en: "Immigration Lawyer",
    headline_ka: "საიმიგრაციო იურისტი",
    bio_en:
      "Ana specializes in residence permits, visas, and citizenship applications for foreigners relocating to Georgia, with particular experience supporting remote workers and small business owners.",
    bio_ka:
      "ანა სპეციალიზირებულია ბინადრობის ნებართვების, ვიზებისა და მოქალაქეობის განაცხადებში საქართველოში გადმოსახლებული უცხოელებისთვის, განსაკუთრებული გამოცდილებით დისტანციური მუშაკებისა და მცირე ბიზნესის მფლობელების მხარდაჭერაში.",
    city: "Batumi",
    languages: ["Georgian", "English", "Turkish"],
    yearsExperience: 7,
    practiceAreaIds: ["cat-immigration"],
    verified: true,
  },
  {
    id: "law-levan-tsereteli",
    slug: "levan-tsereteli",
    name: "Levan Tsereteli",
    initials: "LT",
    avatarColor: "#6b1423",
    photoUrl: photo("photo-1472099645785-5658abf4ff4e"),
    headline_en: "Real Estate Lawyer",
    headline_ka: "უძრავი ქონების იურისტი",
    bio_en:
      "Levan reviews and negotiates property purchase agreements, leases, and landlord-tenant disputes, helping clients avoid costly mistakes before signing.",
    bio_ka:
      "ლევანი ამოწმებს და აწარმოებს მოლაპარაკებებს უძრავი ქონების ნასყიდობის ხელშეკრულებებზე, იჯარებსა და მეიჯარე-მოიჯარეს შორის დავებზე, ეხმარება კლიენტებს თავიდან აიცილონ ძვირადღირებული შეცდომები ხელმოწერამდე.",
    city: "Tbilisi",
    languages: ["Georgian", "English"],
    yearsExperience: 13,
    practiceAreaIds: ["cat-real-estate"],
    verified: true,
  },
  {
    id: "law-mariam-chkheidze",
    slug: "mariam-chkheidze",
    name: "Mariam Chkheidze",
    initials: "MC",
    avatarColor: "#1c1210",
    photoUrl: photo("photo-1594744803329-e58b31de8bf5"),
    headline_en: "Contracts Attorney",
    headline_ka: "სახელშეკრულებო სამართლის ადვოკატი",
    bio_en:
      "Mariam drafts and reviews employment, service, and partnership agreements for small businesses, making sure contracts are clear and enforceable for both sides.",
    bio_ka:
      "მარიამი ადგენს და ამოწმებს შრომით, სამომსახურეო და პარტნიორულ ხელშეკრულებებს მცირე ბიზნესებისთვის და უზრუნველყოფს, რომ ხელშეკრულებები ორივე მხარისთვის იყოს ნათელი და აღსრულებადი.",
    city: "Kutaisi",
    languages: ["Georgian", "English", "Russian"],
    yearsExperience: 8,
    practiceAreaIds: ["cat-contracts", "cat-business"],
    verified: true,
  },
  {
    id: "law-david-lomidze",
    slug: "david-lomidze",
    name: "David Lomidze",
    initials: "DL",
    avatarColor: "#8a6d3b",
    photoUrl: photo("photo-1519085360753-af0119f7cbe7"),
    headline_en: "Tax & Finance Lawyer",
    headline_ka: "საგადასახადო და საფინანსო იურისტი",
    bio_en:
      "David advises freelancers and small businesses on Georgia's small business tax status, international taxation, and financial compliance.",
    bio_ka:
      "დავითი კონსულტაციას უწევს ფრილანსერებსა და მცირე ბიზნესებს საქართველოს მცირე ბიზნესის საგადასახადო სტატუსზე, საერთაშორისო დაბეგვრასა და ფინანსურ შესაბამისობაზე.",
    city: "Tbilisi",
    languages: ["Georgian", "English"],
    yearsExperience: 10,
    practiceAreaIds: ["cat-tax"],
    verified: true,
  },
  {
    id: "law-ketevan-japaridze",
    slug: "ketevan-japaridze",
    name: "Ketevan Japaridze",
    initials: "KJ",
    avatarColor: "#6b1423",
    photoUrl: photo("photo-1438761681033-6461ffad8d80"),
    headline_en: "Criminal Defense Attorney",
    headline_ka: "სისხლის სამართლის ადვოკატი",
    bio_en:
      "Ketevan defends clients at every stage of criminal proceedings, from initial questioning through trial, with a strong record in procedural defense.",
    bio_ka:
      "ქეთევანი იცავს კლიენტებს სისხლის სამართლის პროცესის ყველა ეტაპზე, პირველადი დაკითხვიდან სასამართლო პროცესამდე, საპროცესო დაცვაში ძლიერი გამოცდილებით.",
    city: "Tbilisi",
    languages: ["Georgian", "Russian"],
    yearsExperience: 15,
    practiceAreaIds: ["cat-criminal"],
    verified: true,
  },
  {
    id: "law-irakli-mchedlishvili",
    slug: "irakli-mchedlishvili",
    name: "Irakli Mchedlishvili",
    initials: "IM",
    avatarColor: "#1c1210",
    photoUrl: photo("photo-1507003211169-0a1dd7228f2d"),
    headline_en: "Notary Services",
    headline_ka: "სანოტარო მომსახურება",
    bio_en:
      "Irakli provides notarization and certified translation of documents for individuals and businesses, including documents used abroad.",
    bio_ka:
      "ირაკლი უზრუნველყოფს დოკუმენტების ნოტარიულ დამოწმებასა და დამოწმებულ თარგმანს ფიზიკური და იურიდიული პირებისთვის, მათ შორის საზღვარგარეთ გამოსაყენებელი დოკუმენტებისთვის.",
    city: "Batumi",
    languages: ["Georgian", "English", "Turkish"],
    yearsExperience: 12,
    practiceAreaIds: ["cat-notary"],
    verified: true,
  },
];
