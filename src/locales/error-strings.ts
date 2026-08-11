/**
 * The one dictionary slice that must live in the client bundle: error
 * boundaries render client-side and cannot reach the server dictionaries.
 * Keep in sync with `errorPage` in ka.json / en.json.
 */
export const errorStrings = {
  ka: {
    eyebrow: "§ 500",
    title: "დოკუმენტის დამუშავება შეფერხდა.",
    body: "დაფიქსირდა გაუთვალისწინებელი შეცდომა. სცადეთ ხელახლა — ან დაუბრუნდით რეესტრს.",
    retry: "თავიდან ცდა",
    home: "მთავარ გვერდზე დაბრუნება",
  },
  en: {
    eyebrow: "§ 500",
    title: "The document could not be processed.",
    body: "An unexpected error occurred. Try again — or return to the register.",
    retry: "Try again",
    home: "Return to the front page",
  },
} as const;
