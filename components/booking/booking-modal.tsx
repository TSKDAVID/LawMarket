"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { createPortal } from "react-dom";
import { Check, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Avatar } from "@/components/shared/avatar";
import {
  getLawyerAvailability,
  parseISODate,
  toISODate,
} from "@/data/availability";
import type { Lawyer, LawyerAvailability } from "@/data/types";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

type LawyerLite = Pick<
  Lawyer,
  "id" | "name" | "initials" | "avatarColor" | "photoUrl"
>;

type BookingModalProps = {
  open: boolean;
  onClose: () => void;
  lawyer: LawyerLite;
  defaultName?: string;
  defaultEmail?: string;
  defaultPhone?: string;
};

type Step = 1 | 2 | 3;

const fieldClass =
  "h-11 w-full rounded-none border border-espresso/20 bg-white px-3 font-body text-sm text-espresso outline-none transition-colors placeholder:text-espresso/35 focus:border-burgundy";

function intlLocale(locale: Locale) {
  return locale === "ka" ? "ka-GE" : "en-GB";
}

function formatLongDate(iso: string, locale: Locale) {
  return new Intl.DateTimeFormat(intlLocale(locale), {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(parseISODate(iso));
}

function monthLabel(year: number, month: number, locale: Locale) {
  return new Intl.DateTimeFormat(intlLocale(locale), {
    month: "long",
    year: "numeric",
  }).format(new Date(year, month, 1));
}

function weekdayLabels(locale: Locale) {
  const formatter = new Intl.DateTimeFormat(intlLocale(locale), {
    weekday: "short",
  });
  return Array.from({ length: 7 }, (_, i) =>
    formatter.format(new Date(2026, 0, 5 + i))
  );
}

function slotsForDate(availability: LawyerAvailability | null, iso: string) {
  return availability?.availableDates.find((d) => d.date === iso)?.slots ?? [];
}

export function BookingModal({
  open,
  onClose,
  lawyer,
  defaultName = "",
  defaultEmail = "",
  defaultPhone = "",
}: BookingModalProps) {
  const locale = useLocale() as Locale;
  const t = useTranslations("booking");
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  const [step, setStep] = useState<Step>(1);
  const [availability, setAvailability] = useState<LawyerAvailability | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [name, setName] = useState(defaultName);
  const [email, setEmail] = useState(defaultEmail);
  const [phone, setPhone] = useState(defaultPhone);
  const [notes, setNotes] = useState("");
  const [viewYear, setViewYear] = useState(() => new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(() => new Date().getMonth());

  const todayIso = toISODate(new Date());
  const weekdays = useMemo(() => weekdayLabels(locale), [locale]);

  const availableSet = useMemo(() => {
    return new Set(availability?.availableDates.map((d) => d.date) ?? []);
  }, [availability]);

  const monthBounds = useMemo(() => {
    const dates = availability?.availableDates.map((d) => d.date) ?? [todayIso];
    const first = dates[0] ?? todayIso;
    const last = dates[dates.length - 1] ?? todayIso;
    return { first, last };
  }, [availability, todayIso]);

  const canPrevMonth = useMemo(() => {
    const prev = new Date(viewYear, viewMonth, 1);
    prev.setMonth(prev.getMonth() - 1);
    const bound = parseISODate(monthBounds.first);
    return (
      prev.getFullYear() > bound.getFullYear() ||
      (prev.getFullYear() === bound.getFullYear() &&
        prev.getMonth() >= bound.getMonth())
    );
  }, [monthBounds.first, viewMonth, viewYear]);

  const canNextMonth = useMemo(() => {
    const next = new Date(viewYear, viewMonth, 1);
    next.setMonth(next.getMonth() + 1);
    const bound = parseISODate(monthBounds.last);
    return (
      next.getFullYear() < bound.getFullYear() ||
      (next.getFullYear() === bound.getFullYear() &&
        next.getMonth() <= bound.getMonth())
    );
  }, [monthBounds.last, viewMonth, viewYear]);

  const calendarCells = useMemo(() => {
    const first = new Date(viewYear, viewMonth, 1);
    const mondayOffset = (first.getDay() + 6) % 7;
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const cells: Array<{ iso: string; day: number; inMonth: boolean } | null> =
      [];
    for (let i = 0; i < mondayOffset; i++) cells.push(null);
    for (let day = 1; day <= daysInMonth; day++) {
      const iso = toISODate(new Date(viewYear, viewMonth, day));
      cells.push({ iso, day, inMonth: true });
    }
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }, [viewMonth, viewYear]);

  const daySlots = selectedDate
    ? slotsForDate(availability, selectedDate)
    : [];

  const reset = useCallback(() => {
    setStep(1);
    setSelectedDate(null);
    setSelectedTime(null);
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
    let cancelled = false;
    setLoading(true);
    getLawyerAvailability(lawyer.id).then((data) => {
      if (cancelled) return;
      setAvailability(data);
      setLoading(false);
      const first = data.availableDates[0]?.date;
      if (first) {
        const parsed = parseISODate(first);
        setViewYear(parsed.getFullYear());
        setViewMonth(parsed.getMonth());
      }
    });
    return () => {
      cancelled = true;
    };
  }, [lawyer.id, open]);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const toFocus = closeBtnRef.current;
    const t = window.setTimeout(() => toFocus?.focus(), 0);

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
      if (nodes.length === 0) return;
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
      window.clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [handleClose, open, step]);

  function handleConfirm(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // TODO: Replace with a real booking API call. Send lawyerId, selectedDate,
    // selectedTime, and the contact fields, then trigger the confirmation email
    // from the server. Keep this transition as the success path on resolve.
    setStep(3);
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
          "h-[100dvh] sm:h-auto sm:max-h-[90vh] sm:max-w-2xl"
        )}
      >
        <div aria-hidden="true" className="h-[3px] w-full shrink-0 bg-brass" />

        <div className="flex items-start gap-3 border-b border-espresso/10 px-5 py-4 sm:px-6">
          <Avatar
            initials={lawyer.initials}
            color={lawyer.avatarColor}
            photoUrl={lawyer.photoUrl}
            alt={lawyer.name}
            size="sm"
            className="rounded-full"
          />
          <div className="min-w-0 flex-1">
            <p className="font-heading text-base font-semibold leading-tight text-espresso">
              {lawyer.name}
            </p>
            <p id={titleId} className="mt-0.5 font-body text-sm text-espresso/55">
              {t("subtitle")}
            </p>
          </div>
          <button
            ref={closeBtnRef}
            type="button"
            onClick={handleClose}
            aria-label={t("close")}
            className="flex h-9 w-9 shrink-0 items-center justify-center text-espresso/50 transition-colors hover:bg-espresso/5 hover:text-espresso"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">
          {step === 1 && (
            <div className="animate-fade-up">
              <div className="grid gap-8 lg:grid-cols-[1fr_minmax(0,16rem)]">
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <p className="font-heading text-sm font-semibold text-espresso">
                      {monthLabel(viewYear, viewMonth, locale)}
                    </p>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        disabled={!canPrevMonth}
                        aria-label={t("prevMonth")}
                        onClick={() => {
                          const d = new Date(viewYear, viewMonth - 1, 1);
                          setViewYear(d.getFullYear());
                          setViewMonth(d.getMonth());
                        }}
                        className="flex h-8 w-8 items-center justify-center text-espresso disabled:text-espresso/25"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        disabled={!canNextMonth}
                        aria-label={t("nextMonth")}
                        onClick={() => {
                          const d = new Date(viewYear, viewMonth + 1, 1);
                          setViewYear(d.getFullYear());
                          setViewMonth(d.getMonth());
                        }}
                        className="flex h-8 w-8 items-center justify-center text-espresso disabled:text-espresso/25"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-7 gap-y-1">
                    {weekdays.map((label) => (
                      <span
                        key={label}
                        className="pb-1 text-center font-mono text-[10px] uppercase tracking-[0.12em] text-brass"
                      >
                        {label}
                      </span>
                    ))}
                    {calendarCells.map((cell, i) => {
                      if (!cell) {
                        return <span key={`e-${i}`} />;
                      }
                      const isPast = cell.iso < todayIso;
                      const bookable = !isPast && availableSet.has(cell.iso);
                      const selected = selectedDate === cell.iso;
                      return (
                        <button
                          key={cell.iso}
                          type="button"
                          disabled={!bookable}
                          onClick={() => {
                            setSelectedDate(cell.iso);
                            setSelectedTime(null);
                          }}
                          className={cn(
                            "relative mx-auto flex h-10 w-10 flex-col items-center justify-center font-body text-sm",
                            isPast && "cursor-not-allowed text-espresso/25",
                            !isPast &&
                              !bookable &&
                              "cursor-not-allowed text-espresso/30",
                            bookable &&
                              !selected &&
                              "text-espresso hover:bg-espresso/5",
                            selected && "bg-espresso text-cream"
                          )}
                        >
                          {cell.day}
                          {bookable && (
                            <span
                              aria-hidden="true"
                              className={cn(
                                "absolute bottom-1 h-1 w-1 rounded-full",
                                selected ? "bg-brass" : "bg-brass"
                              )}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                  {loading && (
                    <p className="mt-3 font-body text-xs text-espresso/45">
                      {t("loading")}
                    </p>
                  )}
                </div>

                <div>
                  <p className="mb-3 font-heading text-sm font-semibold text-espresso">
                    {selectedDate
                      ? formatLongDate(selectedDate, locale)
                      : t("pickTime")}
                  </p>
                  {!selectedDate && (
                    <p className="font-body text-sm text-espresso/45">
                      {t("pickDate")}
                    </p>
                  )}
                  {selectedDate && daySlots.length === 0 && (
                    <p className="font-body text-sm text-espresso/45">
                      {t("noTimes")}
                    </p>
                  )}
                  {selectedDate && daySlots.length > 0 && (
                    <div className="grid grid-cols-3 gap-2">
                      {daySlots.map((slot) => {
                        const selected = selectedTime === slot;
                        return (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setSelectedTime(slot)}
                            className={cn(
                              "h-10 rounded-full border font-body text-sm transition-colors",
                              selected
                                ? "border-burgundy bg-burgundy text-cream"
                                : "border-brass bg-transparent text-espresso hover:border-burgundy"
                            )}
                          >
                            {slot}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {step === 2 && selectedDate && selectedTime && (
            <div className="animate-fade-up">
              <div className="flex items-baseline justify-between gap-3 border border-espresso/15 bg-white px-4 py-3">
                <p className="min-w-0 font-body text-sm text-espresso">
                  <span className="font-medium">
                    {formatLongDate(selectedDate, locale)}, {selectedTime}
                  </span>
                  <span className="text-espresso/45">
                    {" "}
                    {t("summaryWith", { name: lawyer.name })}
                  </span>
                </p>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="shrink-0 font-body text-sm text-burgundy underline-offset-4 hover:underline"
                >
                  {t("change")}
                </button>
              </div>

              <form id="booking-contact" onSubmit={handleConfirm} className="mt-6 space-y-4">
                <div>
                  <label
                    htmlFor="booking-name"
                    className="mb-1.5 block font-body text-sm font-medium text-espresso"
                  >
                    {t("nameLabel")}
                  </label>
                  <input
                    id="booking-name"
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
                    htmlFor="booking-phone"
                    className="mb-1.5 block font-body text-sm font-medium text-espresso"
                  >
                    {t("phoneLabel")}
                  </label>
                  <input
                    id="booking-phone"
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
                    htmlFor="booking-email"
                    className="mb-1.5 block font-body text-sm font-medium text-espresso"
                  >
                    {t("emailLabel")}
                  </label>
                  <input
                    id="booking-email"
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
                    htmlFor="booking-notes"
                    className="mb-1.5 block font-body text-sm font-medium text-espresso"
                  >
                    {t("notesLabel")}
                  </label>
                  <textarea
                    id="booking-notes"
                    name="notes"
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={t("notesPlaceholder")}
                    className="w-full resize-y rounded-none border border-espresso/20 bg-white px-3 py-2.5 font-body text-sm text-espresso outline-none placeholder:text-espresso/35 focus:border-burgundy"
                  />
                </div>
              </form>
            </div>
          )}

          {step === 3 && selectedDate && selectedTime && (
            <div className="animate-fade-up py-6 text-center">
              <Check
                className="mx-auto h-10 w-10 text-brass"
                strokeWidth={1.5}
                aria-hidden="true"
              />
              <h3 className="mt-4 font-heading text-2xl font-semibold text-espresso">
                {t("successTitle")}
              </h3>
              <p className="mt-3 font-body text-sm text-espresso/70">
                {formatLongDate(selectedDate, locale)}, {selectedTime}
                <span className="text-espresso/45">
                  {" "}
                  {t("summaryWith", { name: lawyer.name })}
                </span>
              </p>
              <p className="mt-4 font-body text-sm text-espresso/55">
                {t("successEmail", { email })}
              </p>
              <p className="mt-1 font-body text-sm text-espresso/45">
                {t("successNote")}
              </p>
            </div>
          )}
        </div>

        <div className="border-t border-espresso/10 px-5 py-4 sm:px-6">
          {step === 1 && (
            <button
              type="button"
              disabled={!selectedDate || !selectedTime}
              onClick={() => setStep(2)}
              className={cn(
                "flex h-12 w-full items-center justify-center rounded-none bg-burgundy font-body text-sm font-semibold text-cream",
                "transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
              )}
            >
              {t("continue")}
              <span aria-hidden="true"> →</span>
            </button>
          )}
          {step === 2 && (
            <button
              type="submit"
              form="booking-contact"
              className="flex h-12 w-full items-center justify-center rounded-none bg-burgundy font-body text-sm font-semibold text-cream hover:bg-burgundy-dark"
            >
              {t("confirm")}
            </button>
          )}
          {step === 3 && (
            <button
              type="button"
              onClick={handleClose}
              className="flex h-12 w-full items-center justify-center rounded-none border border-espresso/20 font-body text-sm font-semibold text-espresso hover:border-espresso"
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
