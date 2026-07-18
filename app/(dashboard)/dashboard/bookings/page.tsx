import Link from "next/link";
import { redirect } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { updateBookingStatus } from "@/lib/actions/booking";
import { formatDate, formatGel, pickLocale } from "@/lib/utils";

const STATUS_VARIANT = {
  pending: "warning",
  confirmed: "default",
  completed: "success",
  cancelled: "outline",
} as const;

const PAYMENT_VARIANT = {
  pending: "warning",
  paid: "success",
  failed: "destructive",
  refunded: "outline",
} as const;

export default async function BookingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const locale = await getLocale();
  const t = await getTranslations("dashboard.bookings");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  const isProvider = profile?.role === "provider";

  const { data: bookings } = await supabase
    .from("bookings")
    .select(
      `id, status, payment_status, amount_gel, note, created_at, scheduled_at,
       client_id, provider_id, expat_application_id,
       services ( title_ka, title_en ),
       client:profiles!bookings_client_id_fkey ( full_name ),
       provider_profiles ( slug, profiles ( full_name ) )`,
    )
    .or(`client_id.eq.${user.id},provider_id.eq.${user.id}`)
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-slate-900">
        {t("title")}
      </h1>

      <div className="mt-6 space-y-4">
        {(bookings ?? []).length === 0 && (
          <p className="text-sm text-slate-500">{t("empty")}</p>
        )}
        {(bookings ?? []).map((b) => {
          const service = b.services as unknown as {
            title_ka: string;
            title_en: string;
          } | null;
          const client = b.client as unknown as { full_name: string } | null;
          const provider = b.provider_profiles as unknown as {
            slug: string;
            profiles: { full_name: string } | null;
          } | null;

          const iAmProvider = b.provider_id === user.id;
          const iAmClient = b.client_id === user.id;

          return (
            <Card key={b.id}>
              <CardContent className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-slate-900">
                      {service
                        ? pickLocale(locale, service.title_ka, service.title_en)
                        : t("expatConsultation")}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      {iAmProvider
                        ? `${t("client")}: ${client?.full_name ?? ""}`
                        : `${t("provider")}: ${provider?.profiles?.full_name ?? ""}`}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      {formatDate(b.created_at, locale)}
                    </p>
                    {b.note && (
                      <p className="mt-2 text-sm text-slate-600">{b.note}</p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="font-bold text-brand-900">
                      {formatGel(Number(b.amount_gel), locale)}
                    </span>
                    <div className="flex gap-1.5">
                      <Badge
                        variant={
                          STATUS_VARIANT[
                            b.status as keyof typeof STATUS_VARIANT
                          ]
                        }
                      >
                        {t(`status.${b.status}`)}
                      </Badge>
                      <Badge
                        variant={
                          PAYMENT_VARIANT[
                            b.payment_status as keyof typeof PAYMENT_VARIANT
                          ]
                        }
                      >
                        {t(`paymentStatus.${b.payment_status}`)}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {iAmClient && b.payment_status === "pending" && b.status !== "cancelled" && (
                    <Link href={`/pay/${b.id}`}>
                      <Button size="sm">{t("pay")}</Button>
                    </Link>
                  )}
                  {iAmProvider && b.status === "confirmed" && (
                    <form action={updateBookingStatus}>
                      <input type="hidden" name="booking_id" value={b.id} />
                      <input type="hidden" name="status" value="completed" />
                      <Button size="sm" variant="outline" type="submit">
                        {t("complete")}
                      </Button>
                    </form>
                  )}
                  {b.status === "pending" && (
                    <form action={updateBookingStatus}>
                      <input type="hidden" name="booking_id" value={b.id} />
                      <input type="hidden" name="status" value="cancelled" />
                      <Button size="sm" variant="ghost" type="submit">
                        {t("cancel")}
                      </Button>
                    </form>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
