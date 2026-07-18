import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { CheckCircle2, CreditCard, Info } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { payBookingStub } from "@/lib/actions/booking";
import { formatGel, pickLocale } from "@/lib/utils";

export default async function PayPage({
  params,
  searchParams,
}: {
  params: Promise<{ bookingId: string }>;
  searchParams: Promise<{ success?: string }>;
}) {
  const { bookingId } = await params;
  const { success } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect(`/login?next=/pay/${bookingId}`);

  const locale = await getLocale();
  const t = await getTranslations("payment");

  const { data: booking } = await supabase
    .from("bookings")
    .select(
      `id, amount_gel, payment_status, client_id, note,
       services ( title_ka, title_en ),
       provider_profiles ( profiles ( full_name ) )`,
    )
    .eq("id", bookingId)
    .maybeSingle();

  if (!booking || booking.client_id !== user.id) notFound();

  const service = booking.services as unknown as {
    title_ka: string;
    title_en: string;
  } | null;
  const provider = booking.provider_profiles as unknown as {
    profiles: { full_name: string } | null;
  } | null;

  const isPaid = booking.payment_status === "paid";

  if (isPaid || success === "1") {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center sm:px-6">
        <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-500" />
        <h1 className="mt-5 font-serif text-3xl font-bold text-slate-900">
          {t("success")}
        </h1>
        <p className="mt-3 text-slate-600">{t("successText")}</p>
        <Link href="/dashboard/bookings" className="mt-8 inline-block">
          <Button size="lg">{t("backToBookings")}</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <h1 className="font-serif text-3xl font-bold tracking-tight text-slate-900">
        {t("title")}
      </h1>

      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
          {t("summary")}
        </h2>
        <div className="mt-4 space-y-2 border-b border-slate-100 pb-5 text-sm">
          {service && (
            <p className="font-medium text-slate-900">
              {pickLocale(locale, service.title_ka, service.title_en)}
            </p>
          )}
          <p className="text-slate-500">{provider?.profiles?.full_name}</p>
        </div>

        <div className="mt-5 flex items-center justify-between">
          <span className="text-slate-600">{t("total")}</span>
          <span className="text-2xl font-bold text-brand-900">
            {formatGel(Number(booking.amount_gel), locale)}
          </span>
        </div>

        <form action={payBookingStub} className="mt-6">
          <input type="hidden" name="booking_id" value={booking.id} />
          <Button type="submit" size="lg" className="w-full">
            <CreditCard className="h-4 w-4" />
            {t("payButton")}
          </Button>
        </form>

        <p className="mt-4 flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2.5 text-xs leading-relaxed text-amber-700">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          {t("stubNotice")}
        </p>
      </div>
    </div>
  );
}
