"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { LOCALES, type Locale } from "@/i18n/request";

export async function setLocale(locale: string) {
  if (!LOCALES.includes(locale as Locale)) return;
  const store = await cookies();
  store.set("NEXT_LOCALE", locale, { maxAge: 60 * 60 * 24 * 365, path: "/" });
  revalidatePath("/", "layout");
}
