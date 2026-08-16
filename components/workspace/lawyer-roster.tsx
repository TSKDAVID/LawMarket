"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FormMessage } from "@/components/workspace/workspace-shell";
import {
  manageLawyer,
  type AdminState,
  type RosterLawyer,
} from "@/app/[locale]/admin/actions";
import { cn } from "@/lib/utils";

function ActionButton({
  intent,
  label,
  variant = "outline",
  confirm,
}: {
  intent: string;
  label: string;
  variant?: "outline" | "primary";
  confirm?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      name="intent"
      value={intent}
      size="sm"
      variant={variant}
      disabled={pending}
      className="rounded-none font-mono text-[11px] uppercase tracking-[0.14em]"
      onClick={
        confirm
          ? (event) => {
              if (!window.confirm(confirm)) event.preventDefault();
            }
          : undefined
      }
    >
      {label}
    </Button>
  );
}

function LawyerCard({ lawyer }: { lawyer: RosterLawyer }) {
  const t = useTranslations("admin");
  const locale = useLocale();
  const [state, action] = useActionState<AdminState, FormData>(manageLawyer, {
    error: null,
  });

  return (
    <li className="px-5 py-5">
      <form action={action} className="space-y-4">
        <input type="hidden" name="locale" value={locale} />
        <input type="hidden" name="id" value={lawyer.id} />
        <FormMessage
          error={state.error ? t(state.error) : null}
          ok={state.ok}
          okText={t("updated")}
        />
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="font-heading font-semibold text-espresso">
              {lawyer.name}
            </p>
            <p className="mt-1 font-body text-xs text-espresso/65">
              {lawyer.email ?? t("noLogin")}
              {lawyer.city ? ` · ${lawyer.city}` : ""}
              {lawyer.serviceCount
                ? ` · ${t("serviceCount", { count: lawyer.serviceCount })}`
                : ""}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {lawyer.suspended ? (
              <Badge variant="burgundy">{t("statusSuspended")}</Badge>
            ) : lawyer.published ? (
              <Badge variant="espresso">{t("statusLive")}</Badge>
            ) : (
              <Badge variant="outline">{t("statusHidden")}</Badge>
            )}
            {lawyer.verified ? (
              <Badge variant="gold">{t("statusVerified")}</Badge>
            ) : (
              <Badge variant="outline">{t("statusUnverified")}</Badge>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {lawyer.suspended ? (
            <ActionButton intent="restore" label={t("restore")} />
          ) : (
            <>
              {lawyer.published ? (
                <ActionButton intent="hide" label={t("hide")} />
              ) : (
                <ActionButton intent="show" label={t("show")} />
              )}
              <ActionButton intent="suspend" label={t("suspend")} />
            </>
          )}
          {lawyer.verified ? (
            <ActionButton intent="unverify" label={t("unverify")} />
          ) : (
            <ActionButton intent="verify" label={t("verify")} />
          )}
          <Link
            href={`/lawyers/${lawyer.slug}`}
            className={cn(
              "inline-flex h-9 items-center border border-espresso/20 px-4",
              "font-mono text-[11px] uppercase tracking-[0.14em] text-espresso",
              "transition-colors hover:border-burgundy hover:text-burgundy"
            )}
          >
            {t("viewProfile")}
          </Link>
          <ActionButton
            intent="delete"
            label={t("delete")}
            confirm={t("deleteConfirm", { name: lawyer.name })}
          />
        </div>

        {lawyer.hasLogin && (
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Input
              name="password"
              type="password"
              minLength={8}
              autoComplete="new-password"
              placeholder={t("newPassword")}
              className="h-9 max-w-xs rounded-none"
            />
            <ActionButton intent="resetPassword" label={t("resetPassword")} />
          </div>
        )}
      </form>
    </li>
  );
}

export function LawyerRoster({ lawyers }: { lawyers: RosterLawyer[] }) {
  if (lawyers.length === 0) {
    return null;
  }

  return (
    <ul className="mt-4 divide-y divide-espresso/15 border border-espresso/20 bg-white/70">
      {lawyers.map((lawyer) => (
        <LawyerCard key={lawyer.id} lawyer={lawyer} />
      ))}
    </ul>
  );
}
