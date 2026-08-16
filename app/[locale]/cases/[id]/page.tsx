import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PageShell } from "@/components/layout/page-shell";
import { ProposalForm } from "@/components/cases/proposal-form";
import { CaseConsultButton } from "@/components/cases/case-consult-button";
import { CaseOwnerEditor } from "@/components/cases/case-owner-editor";
import { ProposalFollowUp } from "@/components/cases/proposal-follow-up";
import { CaseStatus } from "@/components/cases/case-ui";
import { AddToCalendar } from "@/components/booking/add-to-calendar";
import { Avatar } from "@/components/shared/avatar";
import { withdrawProposal } from "@/app/[locale]/cases/actions";
import { getSessionUser, getOwnLawyer } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getCategories, getServices, getVerifiedLawyers } from "@/data/queries";
import { localizedCategoryName } from "@/data/localize";
import { caseStillEditable, editDeadline, minutesToDays } from "@/lib/cases";
import { formatPrice } from "@/lib/utils";
import type { Locale } from "@/i18n/routing";
import type {
  BookingRow,
  CaseProposalRow,
  ClientCaseRow,
} from "@/lib/supabase/database.types";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "cases" });
  return { title: t("platformKicker") };
}

function formatPosted(iso: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "ka" ? "ka-GE" : "en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export default async function CaseDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations("cases");
  const tBook = await getTranslations("booking");
  const user = await getSessionUser();
  if (!user) {
    redirect(`/${locale}/login/?next=/${locale}/cases/${id}/`);
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("client_cases")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!data) notFound();
  const row = data as ClientCaseRow;

  const lawyer = await getOwnLawyer();
  const isOwner = row.client_id === user.id;
  const isAdmin = user.profile?.role === "admin";
  const isLawyerView = Boolean(lawyer) && !isOwner;
  const canEdit = isOwner && caseStillEditable(row);

  const [
    { data: proposalRows },
    { data: bookingRows },
    categories,
    lawyers,
    catalog,
  ] = await Promise.all([
    supabase
      .from("case_proposals")
      .select("*")
      .eq("case_id", id)
      .order("created_at", { ascending: false }),
    supabase
      .from("bookings")
      .select("*")
      .eq("client_case_id", id)
      .order("created_at", { ascending: false }),
    getCategories(),
    getVerifiedLawyers(),
    getServices(),
  ]);

  const proposals = (proposalRows ?? []) as CaseProposalRow[];
  const bookings = (bookingRows ?? []) as BookingRow[];
  const lawyerById = new Map(lawyers.map((item) => [item.id, item]));
  const ownProposal = lawyer
    ? proposals.find((item) => item.lawyer_id === lawyer.id)
    : undefined;
  const pendingOwn =
    ownProposal?.status === "pending" ? ownProposal : undefined;
  const acceptedProposal = proposals.find((item) => item.status === "accepted");
  const acceptedLawyer = acceptedProposal
    ? lawyerById.get(acceptedProposal.lawyer_id)
    : undefined;
  const servicesFor = (lawyerId: string) =>
    catalog.filter((service) => service.lawyerId === lawyerId);

  const category = row.category_id
    ? categories.find((item) => item.id === row.category_id)
    : undefined;
  const loc = locale as Locale;
  const meta = [
    formatPosted(row.created_at, loc),
    row.city,
    category ? localizedCategoryName(category, loc) : null,
  ]
    .filter(Boolean)
    .join(" · ");

  const matched = lawyers.filter((item) => {
    if (row.category_id && item.practiceAreaIds.includes(row.category_id)) {
      return true;
    }
    if (row.city && item.city === row.city) return true;
    return false;
  });
  const consultLawyers = (matched.length > 0 ? matched : lawyers).slice(0, 6);
  const showWaitingConsult =
    isOwner && row.status === "open" && proposals.length === 0;

  const statusLabel =
    row.status === "closed"
      ? t("statusClosed")
      : row.status === "matched"
        ? t("statusMatched")
        : t("statusOpen");

  const contact = {
    defaultName: user.profile?.full_name ?? "",
    defaultEmail: user.email ?? "",
    defaultPhone: user.profile?.phone ?? "",
  };

  return (
    <PageShell className="py-8 lg:py-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/cases"
            className="font-mono text-sm tracking-wide text-espresso/70 hover:text-burgundy"
          >
            ← {t("back")}
          </Link>
          <CaseStatus status={row.status} label={statusLabel} />
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_19rem]">
          <div className="space-y-6">
            <div className="border border-espresso/15 bg-white">
              {isOwner ? (
                <CaseOwnerEditor
                  row={row}
                  categories={categories}
                  canEdit={canEdit}
                  locale={locale}
                  editUntil={formatPosted(
                    editDeadline(row.created_at).toISOString(),
                    loc
                  )}
                  meta={meta}
                />
              ) : (
                <>
                  <header className="border-b border-espresso/15 px-5 py-5 sm:px-7 sm:py-6">
                    <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-espresso/50">
                      {meta}
                    </p>
                    <h1 className="mt-2 font-heading text-2xl font-semibold leading-snug tracking-tight text-espresso sm:text-3xl">
                      {row.title}
                    </h1>
                  </header>
                  <div className="px-5 py-6 sm:px-7">
                    <p className="whitespace-pre-wrap font-body text-[15px] leading-relaxed text-espresso/80">
                      {row.description}
                    </p>
                  </div>
                </>
              )}
            </div>

            {isOwner && acceptedLawyer && acceptedProposal && (
              <section className="border border-espresso/15 bg-white">
                <div className="border-b border-espresso/15 px-5 py-5 sm:px-7">
                  <h2 className="font-heading text-xl font-semibold text-espresso">
                    {t("matchedTitle")}
                  </h2>
                  <p className="mt-1 font-body text-sm text-espresso/70">
                    {t("matchedBody")}
                  </p>
                </div>
                <div className="flex items-center gap-4 px-5 py-5 sm:px-7">
                  <Avatar
                    initials={acceptedLawyer.initials}
                    color={acceptedLawyer.avatarColor}
                    photoUrl={acceptedLawyer.photoUrl}
                    alt={acceptedLawyer.name}
                    size="md"
                  />
                  <div className="min-w-0">
                    <p className="font-heading text-lg font-semibold text-espresso">
                      {acceptedLawyer.name}
                    </p>
                    <p className="mt-0.5 font-mono text-sm text-espresso/70">
                      {formatPrice(Number(acceptedProposal.price))}
                      {minutesToDays(acceptedProposal.duration_minutes)
                        ? ` · ${t("durationDays", {
                            count:
                              minutesToDays(acceptedProposal.duration_minutes) ??
                              0,
                          })}`
                        : ""}
                    </p>
                    <Link
                      href={`/lawyers/${acceptedLawyer.slug}`}
                      className="mt-1 inline-block font-mono text-[11px] uppercase tracking-[0.12em] text-burgundy"
                    >
                      {t("seeLawyer")}
                    </Link>
                  </div>
                </div>
                <div className="border-t border-espresso/15 bg-cream/40 px-5 py-4 sm:px-7">
                  <ProposalFollowUp
                    mode="matched"
                    caseId={row.id}
                    proposalId={acceptedProposal.id}
                    lawyer={acceptedLawyer}
                    services={servicesFor(acceptedLawyer.id)}
                    price={Number(acceptedProposal.price)}
                    clientCaseId={row.id}
                    contact={contact}
                  />
                </div>
              </section>
            )}

            {bookings.length > 0 && (
              <section className="border border-espresso/15 bg-parchment px-5 py-4 sm:px-7">
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-espresso/50">
                  {t("consultTitle")}
                </p>
                <ul className="mt-3 space-y-3">
                  {bookings.map((booking) => {
                    const bookedLawyer = lawyerById.get(booking.lawyer_id);
                    const otherName = isLawyerView
                      ? booking.name
                      : (bookedLawyer?.name ?? "");
                    return (
                      <li
                        key={booking.id}
                        className="flex flex-col gap-3 border border-espresso/10 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <p className="font-body text-sm text-espresso/80">
                          {t("consultBooked", {
                            date: booking.date,
                            time: booking.time,
                          })}
                          {otherName ? ` · ${otherName}` : ""}
                        </p>
                        {otherName ? (
                          <AddToCalendar
                            compact
                            className="sm:items-end"
                            event={{
                              title: isLawyerView
                                ? tBook("calendarTitleLawyer", {
                                    name: booking.name,
                                  })
                                : tBook("calendarTitle", { name: otherName }),
                              description: isLawyerView
                                ? tBook("calendarDescriptionLawyer", {
                                    name: booking.name,
                                  })
                                : tBook("calendarDescription", {
                                    name: otherName,
                                  }),
                              date: booking.date,
                              time: booking.time,
                            }}
                          />
                        ) : null}
                      </li>
                    );
                  })}
                </ul>
              </section>
            )}

            {showWaitingConsult && (
              <section className="border border-espresso/15 bg-white">
                <div className="border-b border-espresso/15 px-5 py-5 sm:px-7">
                  <h2 className="font-heading text-xl font-semibold text-espresso">
                    {t("consultTitle")}
                  </h2>
                  <p className="mt-1 font-body text-sm text-espresso/70">
                    {t("consultWhileWaiting")}
                  </p>
                </div>
                <ul className="divide-y divide-espresso/10">
                  {consultLawyers.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-center justify-between gap-4 px-5 py-4 sm:px-7"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <Avatar
                          initials={item.initials}
                          color={item.avatarColor}
                          photoUrl={item.photoUrl}
                          alt={item.name}
                          size="sm"
                        />
                        <div className="min-w-0">
                          <p className="truncate font-body text-sm font-medium text-espresso">
                            {item.name}
                          </p>
                          <Link
                            href={`/lawyers/${item.slug}`}
                            className="font-mono text-[10px] uppercase tracking-[0.12em] text-burgundy"
                          >
                            {t("seeLawyer")}
                          </Link>
                        </div>
                      </div>
                      <CaseConsultButton
                        className="w-auto"
                        lawyer={item}
                        clientCaseId={row.id}
                        {...contact}
                      />
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {(isOwner || isAdmin) && (
              <section>
                <div className="mb-4">
                  <h2 className="font-heading text-xl font-semibold text-espresso sm:text-2xl">
                    {t("proposalsTitle")}
                  </h2>
                  <p className="mt-1 font-body text-sm text-espresso/70">
                    {proposals.length === 0
                      ? t("noProposals")
                      : t("proposalsLead")}
                  </p>
                </div>
                {proposals.length > 0 && (
                  <ul className="space-y-4">
                    {proposals.map((proposal) => {
                      const author = lawyerById.get(proposal.lawyer_id);
                      const days = minutesToDays(proposal.duration_minutes);
                      return (
                        <li
                          key={proposal.id}
                          className="border border-espresso/15 bg-white"
                        >
                          <div className="flex flex-wrap items-start justify-between gap-3 px-5 py-5 sm:px-6">
                            <div className="min-w-0">
                              <p className="font-heading text-lg font-semibold text-espresso">
                                {author?.name ?? t("yourProposal")}
                              </p>
                              <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.12em] text-espresso/50">
                                {t(proposal.status)}
                                {days
                                  ? ` · ${t("durationDays", { count: days })}`
                                  : ` · ${t("durationOpen")}`}
                                {author ? (
                                  <>
                                    {" · "}
                                    <Link
                                      href={`/lawyers/${author.slug}`}
                                      className="text-burgundy"
                                    >
                                      {t("seeLawyer")}
                                    </Link>
                                  </>
                                ) : null}
                              </p>
                            </div>
                            <p className="font-mono text-xl font-semibold text-burgundy">
                              {formatPrice(Number(proposal.price))}
                            </p>
                          </div>
                          <p className="px-5 pb-5 font-body text-sm leading-relaxed text-espresso/80 sm:px-6">
                            {proposal.message}
                          </p>
                          {row.status === "open" &&
                            proposal.status === "pending" &&
                            isOwner &&
                            author && (
                              <div className="grid grid-cols-1 gap-3 border-t border-espresso/15 bg-cream/40 px-5 py-4 sm:grid-cols-2 sm:px-6">
                                <ProposalFollowUp
                                  mode="accept"
                                  caseId={row.id}
                                  proposalId={proposal.id}
                                  lawyer={author}
                                  services={servicesFor(author.id)}
                                  price={Number(proposal.price)}
                                  clientCaseId={row.id}
                                  contact={contact}
                                />
                                <CaseConsultButton
                                  className="w-full"
                                  lawyer={author}
                                  clientCaseId={row.id}
                                  {...contact}
                                />
                              </div>
                            )}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </section>
            )}

            {isLawyerView && (
              <section className="border border-espresso/15 bg-white">
                <div className="border-b border-espresso/15 px-5 py-5 sm:px-7">
                  <h2 className="font-heading text-xl font-semibold text-espresso">
                    {t("yourProposal")}
                  </h2>
                </div>
                <div className="px-5 py-6 sm:px-7">
                  {ownProposal?.status === "accepted" && (
                    <p className="mb-5 font-body text-sm leading-relaxed text-espresso/75">
                      {t("lawyerAccepted")}
                    </p>
                  )}
                  {ownProposal?.status === "declined" && (
                    <p className="mb-5 font-body text-sm text-espresso/65">
                      {t("lawyerDeclined")}
                    </p>
                  )}
                  {pendingOwn ? (
                    <div>
                      <p className="font-mono text-2xl font-semibold text-burgundy">
                        {formatPrice(Number(pendingOwn.price))}
                      </p>
                      <p className="mt-2 font-body text-sm text-espresso/70">
                        {t("proposalDuration")}:{" "}
                        {minutesToDays(pendingOwn.duration_minutes)
                          ? t("durationDays", {
                              count:
                                minutesToDays(pendingOwn.duration_minutes) ?? 0,
                            })
                          : t("durationOpen")}
                      </p>
                      <p className="mt-3 whitespace-pre-wrap font-body text-sm leading-relaxed text-espresso/80">
                        {pendingOwn.message}
                      </p>
                      <form action={withdrawProposal} className="mt-6">
                        <input type="hidden" name="locale" value={locale} />
                        <input type="hidden" name="id" value={pendingOwn.id} />
                        <input type="hidden" name="case_id" value={row.id} />
                        <button
                          type="submit"
                          className="inline-flex h-12 items-center justify-center rounded-none border border-burgundy px-5 font-mono text-sm tracking-wide text-burgundy hover:bg-burgundy hover:text-cream"
                        >
                          {t("withdraw")}
                        </button>
                      </form>
                    </div>
                  ) : row.status === "open" ? (
                    <ProposalForm caseId={row.id} />
                  ) : ownProposal ? (
                    <p className="font-mono text-2xl font-semibold text-burgundy">
                      {formatPrice(Number(ownProposal.price))}
                    </p>
                  ) : null}
                </div>
              </section>
            )}
          </div>

          <aside className="border border-espresso/15 bg-white p-5 lg:sticky lg:top-24">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-espresso/50">
              {t("platformKicker")}
            </p>
            <div className="mt-4 space-y-3 font-body text-sm text-espresso/75">
              <p>
                <span className="block font-mono text-[10px] uppercase tracking-[0.14em] text-espresso/45">
                  {statusLabel}
                </span>
                {row.city ?? "—"}
              </p>
              {category && (
                <p>{localizedCategoryName(category, loc)}</p>
              )}
              <p>
                {t("proposalsTitle")}
                {": "}
                {proposals.length}
              </p>
              <p className="border-t border-espresso/10 pt-3 text-xs leading-relaxed text-espresso/55">
                {isLawyerView ? t("boardSubtitle") : t("privacyNote")}
              </p>
            </div>
          </aside>
        </div>
    </PageShell>
  );
}
