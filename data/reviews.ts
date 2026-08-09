import type { Review } from "./types";

export const reviews: Review[] = [
  {
    id: "rev-mikheil",
    authorName: "Mikheil T.",
    authorRole_en: "Small Business Owner",
    authorRole_ka: "მცირე ბიზნესის მფლობელი",
    rating: 5,
    quote_en:
      "Law Market connected me with an amazing lawyer who handled my LLC formation quickly and professionally. Everything was transparent from the first message.",
    quote_ka:
      "Law Market-მა დამაკავშირა შესანიშნავ იურისტთან, რომელმაც ჩემი შპს-ს დაფუძნება სწრაფად და პროფესიონალურად გააკეთა. ყველაფერი გამჭვირვალე იყო პირველივე შეტყობინებიდან.",
    serviceId: "srv-llc-formation",
    lawyerId: "law-nino-beridze",
  },
  {
    id: "rev-priya",
    authorName: "Priya S.",
    authorRole_en: "Entrepreneur",
    authorRole_ka: "მეწარმე",
    rating: 5,
    quote_en:
      "Transparent pricing, great communication, and real results. I highly recommend Law Market to anyone who needs a contract reviewed properly.",
    quote_ka:
      "გამჭვირვალე ფასები, შესანიშნავი კომუნიკაცია და რეალური შედეგები. მე ვურჩევდი Law Market-ს ყველას, ვისაც ხელშეკრულების სათანადოდ შემოწმება სჭირდება.",
    serviceId: "srv-contract-review",
    lawyerId: "law-mariam-chkheidze",
  },
  {
    id: "rev-james",
    authorName: "James W.",
    authorRole_en: "Startup Founder",
    authorRole_ka: "სტარტაპის დამფუძნებელი",
    rating: 5,
    quote_en:
      "I found the right lawyer for my business in less than 24 hours. Incredible experience from search to booking.",
    quote_ka:
      "ჩემი ბიზნესისთვის შესაფერისი იურისტი 24 საათზე ნაკლებ დროში ვიპოვე. დაუჯერებელი გამოცდილება ძებნიდან დაჯავშნამდე.",
    serviceId: "srv-trademark-registration",
    lawyerId: "law-nino-beridze",
  },
  {
    id: "rev-elene",
    authorName: "Elene Gogia",
    authorRole_en: "Client",
    authorRole_ka: "კლიენტი",
    rating: 5,
    quote_en:
      "Giorgi handled a very difficult time in my life with patience and genuine care. I always knew what was happening with my case.",
    quote_ka:
      "გიორგიმ ჩემი ცხოვრების ძალიან რთული პერიოდი მოთმინებითა და გულწრფელი ზრუნვით გაუძღვა. ყოველთვის ვიცოდი, რა ხდებოდა ჩემს საქმეში.",
    serviceId: "srv-divorce-filing",
    lawyerId: "law-giorgi-abashidze",
  },
  {
    id: "rev-thomas",
    authorName: "Thomas Berg",
    authorRole_en: "Remote Worker, relocated to Georgia",
    authorRole_ka: "დისტანციური მუშაკი, გადმოსახლდა საქართველოში",
    rating: 5,
    quote_en:
      "As a foreigner navigating residence permits for the first time, having Ana explain every step in plain English made all the difference.",
    quote_ka:
      "როგორც უცხოელისთვის, რომელიც პირველად აწყდებოდა ბინადრობის ნებართვის საკითხს, ანას მიერ ყოველი ნაბიჯის მარტივად ახსნამ დიდი განსხვავება შექმნა.",
    serviceId: "srv-visa-residence-permit",
    lawyerId: "law-ana-kapanadze",
  },
  {
    id: "rev-sopho",
    authorName: "Sopho Kiladze",
    authorRole_en: "First-time Homebuyer",
    authorRole_ka: "პირველად ბინის მყიდველი",
    rating: 4,
    quote_en:
      "Levan caught an issue in the property title that I would have completely missed. Worth every lari for the peace of mind.",
    quote_ka:
      "ლევანმა შენიშნა პრობლემა ქონების საკუთრებაში, რომელსაც მე საერთოდ ვერ შევამჩნევდი. ღირდა ყოველი გადახდილი ლარი სულის სიმშვიდისთვის.",
    serviceId: "srv-property-purchase-review",
    lawyerId: "law-levan-tsereteli",
  },
];
