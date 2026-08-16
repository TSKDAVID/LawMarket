"use client";

import { useId, useState } from "react";
import { createPortal } from "react-dom";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { X } from "lucide-react";
import { Avatar } from "@/components/shared/avatar";
import { BookingModal } from "@/components/booking/booking-modal";
import { PurchaseModal } from "@/components/purchase/purchase-modal";
import { acceptProposal } from "@/app/[locale]/cases/actions";
import { localizedServiceTitle } from "@/data/localize";
import type { Lawyer, Service } from "@/data/types";
import type { Locale } from "@/i18n/routing";
import { formatPrice } from "@/lib/utils";
import { formatServicePrice, servicePricingMode } from "@/lib/service-pricing";

type LawyerLite = Pick<
  Lawyer,
  "id" | "name" | "slug" | "initials" | "avatarColor" | "photoUrl" | "city"
>;

type Contact = {
  defaultName?: string;
  defaultEmail?: string;
  defaultPhone?: string;
};

type Step = "closed" | "choose" | "services";

function ActionRow({
  title,
  hint,
  onClick,
  disabled,
  primary,
}: {
  title: string;
  hint: string;
  onClick: () => void;
  disabled?: boolean;
  primary?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={
        primary
          ? "w-full border border-burgundy bg-burgundy px-4 py-3.5 text-left text-cream transition-colors hover:border-espresso hover:bg-espresso disabled:opacity-40"
          : "w-full border border-espresso/15 bg-white px-4 py-3.5 text-left transition-colors hover:border-burgundy hover:bg-cream/80 disabled:opacity-40"
      }
    >
      <span className="block font-mono text-sm tracking-wide">{title}</span>
      <span
        className={
          primary
            ? "mt-1 block font-body text-xs leading-snug text-cream/80"
            : "mt-1 block font-body text-xs leading-snug text-espresso/60"
        }
      >
        {hint}
      </span>
    </button>
  );
}

export function ProposalFollowUp({
  mode,
  caseId,
  proposalId,
  lawyer,
  services,
  price,
  clientCaseId,
  contact,
}: {
  mode: "accept" | "matched";
  caseId: string;
  proposalId: string;
  lawyer: LawyerLite;
  services: Service[];
  price: number;
  clientCaseId: string;
  contact: Contact;
}) {
  const t = useTranslations("cases");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const titleId = useId();
  const [step, setStep] = useState<Step>("closed");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [buyService, setBuyService] = useState<Service | null>(null);

  async function ensureAccepted() {
    if (mode === "matched") return true;
    setBusy(true);
    setError(null);
    const fd = new FormData();
    fd.set("locale", locale);
    fd.set("id", proposalId);
    fd.set("case_id", caseId);
    const result = await acceptProposal({ error: null }, fd);
    setBusy(false);
    if (result.error) {
      setError(t(`errors.${result.error}`));
      return false;
    }
    router.refresh();
    return true;
  }

  async function onConsult() {
    if (!(await ensureAccepted())) return;
    setStep("closed");
    setBookingOpen(true);
  }

  async function onBuy() {
    if (!(await ensureAccepted())) return;
    if (services.length === 1) {
      setStep("closed");
      setBuyService(services[0] ?? null);
      return;
    }
    if (services.length === 0) {
      setStep("choose");
      return;
    }
    setStep("services");
  }

  async function onLater() {
    if (!(await ensureAccepted())) return;
    setStep("closed");
  }

  const dialogOpen = step !== "closed";

  return (
    <>
      {mode === "accept" ? (
        <button
          type="button"
          onClick={() => {
            setError(null);
            setStep("choose");
          }}
          className="inline-flex h-12 w-full items-center justify-center rounded-none border border-burgundy bg-burgundy px-5 font-mono text-sm tracking-wide text-cream hover:border-espresso hover:bg-espresso"
        >
          {t("accept")}
        </button>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setBookingOpen(true)}
            className="inline-flex h-12 w-full items-center justify-center rounded-none border border-burgundy bg-burgundy px-5 font-mono text-sm tracking-wide text-cream hover:border-espresso hover:bg-espresso"
          >
            {t("ctaConsult")}
          </button>
          <button
            type="button"
            disabled={services.length === 0}
            onClick={() => {
              if (services.length === 1) {
                setBuyService(services[0] ?? null);
              } else if (services.length > 1) {
                setError(null);
                setStep("services");
              }
            }}
            className="inline-flex h-12 w-full items-center justify-center rounded-none border border-burgundy bg-white px-5 font-mono text-sm tracking-wide text-burgundy hover:bg-burgundy hover:text-cream disabled:cursor-not-allowed disabled:border-espresso/20 disabled:text-espresso/35 disabled:hover:bg-white disabled:hover:text-espresso/35"
          >
            {t("ctaBuy")}
          </button>
        </div>
      )}

      {dialogOpen && typeof document !== "undefined"
        ? createPortal(
            <div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center sm:p-6">
              <button
                type="button"
                aria-label={t("cancelEdit")}
                className="absolute inset-0 bg-espresso/50"
                onClick={() => setStep("closed")}
              />
              <div
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                className="relative z-10 w-full overflow-hidden rounded-none border border-espresso bg-cream shadow-[8px_8px_0_0_rgba(28,18,16,0.18)] sm:max-w-lg"
              >
                <div aria-hidden="true" className="h-[3px] w-full bg-brass" />
                <div className="flex items-start gap-3 border-b border-espresso/10 px-5 py-4">
                  <Avatar
                    initials={lawyer.initials}
                    color={lawyer.avatarColor}
                    photoUrl={lawyer.photoUrl}
                    alt={lawyer.name}
                    size="sm"
                  />
                  <div className="min-w-0 flex-1">
                    <p
                      id={titleId}
                      className="font-heading text-base font-semibold text-espresso"
                    >
                      {step === "services" ? t("chooseService") : t("acceptTitle")}
                    </p>
                    <p className="mt-0.5 font-body text-sm text-espresso/65">
                      {lawyer.name}
                      {" · "}
                      {formatPrice(price)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep("closed")}
                    className="flex h-9 w-9 items-center justify-center text-espresso/60 hover:bg-espresso/5 hover:text-espresso"
                    aria-label={t("cancelEdit")}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="space-y-3 px-5 py-5">
                  {error && (
                    <p
                      role="alert"
                      className="border-l-[3px] border-burgundy bg-burgundy-tint px-4 py-3 font-body text-sm text-burgundy-dark"
                    >
                      {error}
                    </p>
                  )}
                  {step === "choose" && (
                    <>
                      <p className="font-body text-sm leading-relaxed text-espresso/75">
                        {t("acceptBody", {
                          name: lawyer.name,
                          price: formatPrice(price),
                        })}
                      </p>
                      <ActionRow
                        primary
                        title={t("acceptConsult")}
                        hint={t("acceptConsultHint")}
                        onClick={onConsult}
                        disabled={busy}
                      />
                      <ActionRow
                        title={t("acceptBuy")}
                        hint={
                          services.length === 0
                            ? t("noCatalogServices")
                            : t("acceptBuyHint")
                        }
                        onClick={onBuy}
                        disabled={busy || services.length === 0}
                      />
                      {mode === "accept" && (
                        <ActionRow
                          title={t("acceptLater")}
                          hint={t("acceptLaterHint")}
                          onClick={onLater}
                          disabled={busy}
                        />
                      )}
                    </>
                  )}
                  {step === "services" && (
                    <ul className="divide-y divide-espresso/10 border border-espresso/15">
                      {services.map((service) => (
                        <li key={service.id}>
                          <button
                            type="button"
                            onClick={() => {
                              setStep("closed");
                              setBuyService(service);
                            }}
                            className="flex w-full items-baseline justify-between gap-4 px-4 py-3 text-left hover:bg-cream/80"
                          >
                            <span className="font-body text-sm font-medium text-espresso">
                              {localizedServiceTitle(service, locale)}
                            </span>
                            <span className="shrink-0 font-mono text-sm text-burgundy">
                              {formatServicePrice(service, locale)}
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>,
            document.body
          )
        : null}

      <BookingModal
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
        lawyer={lawyer}
        clientCaseId={clientCaseId}
        defaultName={contact.defaultName}
        defaultEmail={contact.defaultEmail}
        defaultPhone={contact.defaultPhone}
      />
      {buyService && (
        <PurchaseModal
          open
          onClose={() => setBuyService(null)}
          serviceTitle={localizedServiceTitle(buyService, locale)}
          price={buyService.price}
          priceLabel={formatServicePrice(buyService, locale)}
          pricingMode={servicePricingMode(buyService)}
          lawyer={lawyer}
          defaultName={contact.defaultName}
          defaultEmail={contact.defaultEmail}
          defaultPhone={contact.defaultPhone}
        />
      )}
    </>
  );
}
