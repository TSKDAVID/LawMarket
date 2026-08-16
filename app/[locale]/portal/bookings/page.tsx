import { getTranslations, setRequestLocale } from "next-intl/server";
import { getOwnLawyer } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { WorkspaceHeading } from "@/components/workspace/workspace-shell";
import { AddToCalendar } from "@/components/booking/add-to-calendar";
import { toISODate } from "@/data/availability";
import type { BookingRow } from "@/lib/supabase/database.types";
import type { Locale } from "@/i18n/routing";

export const dynamic = "force-dynamic";

function formatDay(iso: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "ka" ? "ka-GE" : "en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(new Date(`${iso}T12:00:00`));
}

export default async function PortalBookingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const loc = locale as Locale;
  const t = await getTranslations("portal");
  const tBook = await getTranslations("booking");
  const lawyer = await getOwnLawyer();

  if (!lawyer) {
    return (
      <p className="font-body text-sm text-espresso/75">{t("noLawyerProfile")}</p>
    );
  }

  const supabase = await createClient();
  const today = toISODate(new Date());
  const { data } = await supabase
    .from("bookings")
    .select("*")
    .eq("lawyer_id", lawyer.id)
    .gte("date", today)
    .order("date", { ascending: true })
    .order("time", { ascending: true });

  const bookings = (data ?? []) as BookingRow[];

  return (
    <div>
      <WorkspaceHeading
        title={t("bookingsTitle")}
        description={t("bookingsSubtitle")}
      />
      {bookings.length === 0 ? (
        <p className="font-body text-sm text-espresso/60">{t("emptyBookings")}</p>
      ) : (
        <ul className="divide-y divide-espresso/10 border border-espresso/12 border-t-[3px] border-t-burgundy bg-white">
          {bookings.map((booking) => (
            <li
              key={booking.id}
              className="flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5"
            >
              <div className="min-w-0">
                <p className="font-heading font-semibold text-espresso">
                  {booking.name}
                </p>
                <p className="mt-1 font-mono text-sm text-espresso/70">
                  {formatDay(booking.date, loc)} · {booking.time}
                </p>
                <p className="mt-1 font-body text-xs text-espresso/55">
                  {booking.email}
                  {booking.phone ? ` · ${booking.phone}` : ""}
                </p>
              </div>
              <AddToCalendar
                compact
                className="sm:items-end"
                event={{
                  title: tBook("calendarTitleLawyer", { name: booking.name }),
                  description: tBook("calendarDescriptionLawyer", {
                    name: booking.name,
                  }),
                  date: booking.date,
                  time: booking.time,
                }}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
