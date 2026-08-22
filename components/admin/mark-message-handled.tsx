"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  markContactMessageHandled,
  type CmsState,
} from "@/app/[locale]/admin/content/actions";

const initial: CmsState = { error: null };

export function MarkMessageHandledButton({
  locale,
  id,
}: {
  locale: string;
  id: string;
}) {
  const t = useTranslations("admin.content");
  const [state, action, pending] = useActionState(
    markContactMessageHandled,
    initial
  );

  return (
    <form action={action}>
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="id" value={id} />
      <Button type="submit" size="sm" variant="outline" disabled={pending}>
        {pending ? t("saving") : t("markHandled")}
      </Button>
      {state.error && (
        <p className="mt-1 font-body text-xs text-burgundy">{t(state.error)}</p>
      )}
    </form>
  );
}
