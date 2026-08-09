"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { CheckCircle2, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export function ContactForm() {
  const t = useTranslations("contact");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center rounded-card border border-espresso/8 bg-white/60 px-6 py-16 text-center">
        <CheckCircle2 className="h-10 w-10 text-burgundy" />
        <p className="mt-4 font-heading text-lg font-semibold text-espresso">
          {t("successTitle")}
        </p>
        <p className="mt-2 max-w-sm font-body text-sm text-espresso/55">
          {t("successNote")}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="contact-name"
            className="mb-2 block font-body text-sm font-medium text-espresso/70"
          >
            {t("nameLabel")}
          </label>
          <Input id="contact-name" required name="name" autoComplete="name" />
        </div>
        <div>
          <label
            htmlFor="contact-email"
            className="mb-2 block font-body text-sm font-medium text-espresso/70"
          >
            {t("emailLabel")}
          </label>
          <Input
            id="contact-email"
            required
            type="email"
            name="email"
            autoComplete="email"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="contact-subject"
          className="mb-2 block font-body text-sm font-medium text-espresso/70"
        >
          {t("subjectLabel")}
        </label>
        <Input id="contact-subject" required name="subject" />
      </div>

      <div>
        <label
          htmlFor="contact-message"
          className="mb-2 block font-body text-sm font-medium text-espresso/70"
        >
          {t("messageLabel")}
        </label>
        <Textarea
          id="contact-message"
          required
          name="message"
          rows={5}
          placeholder={t("messagePlaceholder")}
        />
      </div>

      <Button type="submit" size="lg" className="w-full sm:w-auto">
        {t("submit")}
      </Button>

      <p className="flex items-start gap-2 font-body text-xs leading-relaxed text-espresso/45">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        {t("note")}
      </p>
    </form>
  );
}
