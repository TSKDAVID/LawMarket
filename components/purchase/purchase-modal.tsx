"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { createPortal } from "react-dom";
import { Check, Info, ShieldCheck, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Avatar } from "@/components/shared/avatar";
import type { Lawyer } from "@/data/types";
import { cn, formatPrice } from "@/lib/utils";

type LawyerLite = Pick<
  Lawyer,
  "id" | "name" | "initials" | "avatarColor" | "photoUrl"
>;

type PurchaseModalProps = {
  open: boolean;
  onClose: () => void;
  serviceTitle: string;
  price: number;
  lawyer: LawyerLite;
  defaultName?: string;
  defaultEmail?: string;
  defaultPhone?: string;
};

const fieldClass =
  "h-11 w-full rounded-none border border-espresso/20 bg-white px-3 font-body text-sm text-espresso outline-none transition-colors placeholder:text-espresso/50 focus:border-burgundy";

export function PurchaseModal({
  open,
  onClose,
  serviceTitle,
  price,
  lawyer,
  defaultName = "",
  defaultEmail = "",
  defaultPhone = "",
}: PurchaseModalProps) {
  const t = useTranslations("purchase");
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  const [placed, setPlaced] = useState(false);
  const [name, setName] = useState(defaultName);
  const [email, setEmail] = useState(defaultEmail);
  const [phone, setPhone] = useState(defaultPhone);
  const [notes, setNotes] = useState("");

  const reset = useCallback(() => {
    setPlaced(false);
    setName(defaultName);
    setEmail(defaultEmail);
    setPhone(defaultPhone);
    setNotes("");
  }, [defaultEmail, defaultName, defaultPhone]);

  const handleClose = useCallback(() => {
    onClose();
    reset();
  }, [onClose, reset]);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const toFocus = closeBtnRef.current;
    const focusTimer = window.setTimeout(() => toFocus?.focus(), 0);

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        handleClose();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const nodes = [
        ...panelRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
        ),
      ].filter((el) => !el.hasAttribute("disabled") && el.tabIndex !== -1);
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (!first || !last) return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [handleClose, open, placed]);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // TODO: Replace with a real order API call. Send the serviceId, lawyerId and
    // the contact fields, then hand off to the payment provider. Keep this
    // transition as the success path on resolve.
    setPlaced(true);
  }

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center sm:p-6">
      <button
        type="button"
        aria-label={t("close")}
        className="absolute inset-0 bg-espresso/50"
        onClick={handleClose}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={cn(
          "relative z-10 flex w-full flex-col overflow-hidden rounded-none border border-espresso bg-cream shadow-[8px_8px_0_0_rgba(28,18,16,0.18)]",
          "h-[100dvh] sm:h-auto sm:max-h-[90vh] sm:max-w-lg"
        )}
      >
        <div aria-hidden="true" className="h-[3px] w-full shrink-0 bg-brass" />

        <div className="flex items-start gap-3 border-b border-espresso/10 px-5 py-4 sm:px-6">
          <div className="min-w-0 flex-1">
            <p
              id={titleId}
              className="font-mono text-[10px] uppercase tracking-[0.16em] text-brass"
            >
              {t("title")}
            </p>
            <p className="mt-1 font-heading text-base font-semibold leading-tight text-espresso">
              {serviceTitle}
            </p>
          </div>
          <button
            ref={closeBtnRef}
            type="button"
            onClick={handleClose}
            aria-label={t("close")}
            className="flex h-9 w-9 shrink-0 items-center justify-center text-espresso/65 transition-colors hover:bg-espresso/5 hover:text-espresso"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">
          {!placed && (
            <div className="animate-fade-up">
              {/* Order ledger — provider, then the one number that matters */}
              <div className="border border-espresso/15 bg-white">
                <div className="flex items-center gap-3 px-4 py-3">
                  <Avatar
                    initials={lawyer.initials}
                    color={lawyer.avatarColor}
                    photoUrl={lawyer.photoUrl}
                    alt={lawyer.name}
                    size="sm"
                    className="rounded-full"
                  />
                  <div className="min-w-0">
                    <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-espresso/65">
                      {t("providedBy")}
                    </p>
                    <p className="font-heading text-sm font-semibold text-espresso">
                      {lawyer.name}
                    </p>
                  </div>
                </div>
                <div className="flex items-baseline justify-between gap-3 border-t border-espresso/15 px-4 py-3">
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-espresso/65">
                    {t("total")} · {t("fixedPrice")}
                  </span>
                  <span className="font-heading text-2xl font-semibold text-burgundy">
                    {formatPrice(price)}
                  </span>
                </div>
              </div>

              <form
                id="purchase-contact"
                onSubmit={handleSubmit}
                className="mt-6 space-y-4"
              >
                <div>
                  <label
                    htmlFor="purchase-name"
                    className="mb-1.5 block font-body text-sm font-medium text-espresso"
                  >
                    {t("nameLabel")}
                  </label>
                  <input
                    id="purchase-name"
                    required
                    name="name"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={fieldClass}
                  />
                </div>
                <div>
                  <label
                    htmlFor="purchase-phone"
                    className="mb-1.5 block font-body text-sm font-medium text-espresso"
                  >
                    {t("phoneLabel")}
                  </label>
                  <input
                    id="purchase-phone"
                    required
                    type="tel"
                    name="phone"
                    autoComplete="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={fieldClass}
                  />
                </div>
                <div>
                  <label
                    htmlFor="purchase-email"
                    className="mb-1.5 block font-body text-sm font-medium text-espresso"
                  >
                    {t("emailLabel")}
                  </label>
                  <input
                    id="purchase-email"
                    required
                    type="email"
                    name="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={fieldClass}
                  />
                </div>
                <div>
                  <label
                    htmlFor="purchase-notes"
                    className="mb-1.5 block font-body text-sm font-medium text-espresso"
                  >
                    {t("notesLabel")}
                  </label>
                  <textarea
                    id="purchase-notes"
                    name="notes"
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={t("notesPlaceholder")}
                    className="w-full resize-y rounded-none border border-espresso/20 bg-white px-3 py-2.5 font-body text-sm text-espresso outline-none placeholder:text-espresso/50 focus:border-burgundy"
                  />
                </div>
              </form>

              <p className="mt-4 flex items-start gap-2 font-body text-xs leading-relaxed text-espresso/70">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                {t("paymentNote", { name: lawyer.name })}
              </p>
            </div>
          )}

          {placed && (
            <div className="animate-fade-up py-6 text-center">
              <Check
                className="mx-auto h-10 w-10 text-brass"
                strokeWidth={1.5}
                aria-hidden="true"
              />
              <h3 className="mt-4 font-heading text-2xl font-semibold text-espresso">
                {t("successTitle")}
              </h3>
              <p className="mt-3 font-body text-sm text-espresso/80">
                {serviceTitle} · {formatPrice(price)}
              </p>
              <p className="mt-4 font-body text-sm text-espresso/70">
                {t("successEmail", { email })}
              </p>
              <p className="mt-1 font-body text-sm text-espresso/70">
                {t("successNote", { name: lawyer.name })}
              </p>
              <p className="mt-5 inline-flex items-start gap-2 border border-espresso/15 bg-white px-3 py-2 text-left font-body text-xs leading-relaxed text-espresso/70">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-brass" />
                {t("guaranteeNote")}
              </p>
            </div>
          )}
        </div>

        <div className="border-t border-espresso/10 px-5 py-4 sm:px-6">
          {!placed ? (
            <button
              type="submit"
              form="purchase-contact"
              className="flex h-12 w-full items-center justify-center rounded-none bg-burgundy font-body text-sm font-semibold text-cream transition-colors hover:bg-burgundy-dark"
            >
              {t("confirm")}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleClose}
              className="flex h-12 w-full items-center justify-center rounded-none border border-espresso/20 font-body text-sm font-semibold text-espresso transition-colors hover:border-espresso"
            >
              {t("close")}
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
