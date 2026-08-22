"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  submitContactMessage,
  type CmsState,
} from "@/app/[locale]/admin/content/actions";

const initial: CmsState = { error: null };

export function ContactForm() {
  const t = useTranslations("contact");
  const tAdmin = useTranslations("admin.content");
  const [state, action, pending] = useActionState(submitContactMessage, initial);

  if (state.ok) {
    return (
      <div className="flex flex-col items-center rounded-card border border-espresso/8 bg-white/60 px-6 py-16 text-center">
        <CheckCircle2 className="h-10 w-10 text-burgundy" />
        <p className="mt-4 font-heading text-lg font-semibold text-espresso">
          {t("successTitle")}
        </p>
        <p className="mt-2 max-w-sm font-body text-sm text-espresso/70">
          {t("successNote")}
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-5">
      {state.error && (
        <p className="rounded-card border border-burgundy/30 bg-burgundy-tint/50 px-4 py-3 font-body text-sm text-burgundy-dark">
          {tAdmin(state.error)}
        </p>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="contact-name"
            className="mb-2 block font-mono text-sm text-espresso"
          >
            {t("nameLabel")}
          </label>
          <Input id="contact-name" required name="name" autoComplete="name" />
        </div>
        <div>
          <label
            htmlFor="contact-email"
            className="mb-2 block font-mono text-sm text-espresso"
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
          className="mb-2 block font-mono text-sm text-espresso"
        >
          {t("subjectLabel")}
        </label>
        <Input id="contact-subject" required name="subject" />
      </div>

      <div>
        <label
          htmlFor="contact-message"
          className="mb-2 block font-mono text-sm text-espresso"
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

      <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={pending}>
        {pending ? tAdmin("saving") : t("submit")}
      </Button>
    </form>
  );
}
