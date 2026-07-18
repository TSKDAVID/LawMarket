"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function createBooking(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const serviceId = String(formData.get("service_id") ?? "");
  if (!user) redirect(`/login?next=/lawyers`);

  const { data: service } = await supabase
    .from("services")
    .select("id, provider_id, price_gel")
    .eq("id", serviceId)
    .single();

  if (!service) redirect("/lawyers");

  const { data: booking, error } = await supabase
    .from("bookings")
    .insert({
      client_id: user.id,
      provider_id: service.provider_id,
      service_id: service.id,
      amount_gel: service.price_gel,
      note: String(formData.get("note") ?? "").trim() || null,
    })
    .select("id")
    .single();

  if (error || !booking) redirect("/lawyers");

  redirect(`/pay/${booking.id}`);
}

/**
 * Stub payment: marks the booking paid and records a fake payment.
 * Replaced by BOG iPay checkout + webhook in a later phase.
 */
export async function payBookingStub(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const bookingId = String(formData.get("booking_id") ?? "");

  const { data: booking } = await supabase
    .from("bookings")
    .select("id, client_id, amount_gel, payment_status")
    .eq("id", bookingId)
    .single();

  if (!booking || booking.client_id !== user.id) redirect("/dashboard/bookings");

  if (booking.payment_status !== "paid") {
    await supabase.from("payments").insert({
      booking_id: booking.id,
      amount_gel: booking.amount_gel,
      status: "paid",
      external_id: `stub_${Date.now()}`,
    });
    await supabase
      .from("bookings")
      .update({ payment_status: "paid", status: "confirmed" })
      .eq("id", booking.id);
  }

  redirect(`/pay/${booking.id}?success=1`);
}

export async function updateBookingStatus(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const bookingId = String(formData.get("booking_id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!["confirmed", "completed", "cancelled"].includes(status)) return;

  await supabase.from("bookings").update({ status }).eq("id", bookingId);
  revalidatePath("/dashboard/bookings");
}
