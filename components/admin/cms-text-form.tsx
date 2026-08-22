"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { CMS_CONTENT_GROUPS } from "@/lib/cms/content-groups";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  saveSiteText,
  type CmsState,
} from "@/app/[locale]/admin/content/actions";

const initial: CmsState = { error: null };

export function CmsTextForm({
  locale,
  values,
}: {
  locale: string;
  values: Record<string, { en: string; ka: string }>;
}) {
  const t = useTranslations("admin.content");
  const [state, action, pending] = useActionState(saveSiteText, initial);

  return (
    <form action={action} className="space-y-10">
      <input type="hidden" name="locale" value={locale} />

      {state.ok && (
        <p className="rounded-card border border-burgundy/20 bg-burgundy-tint/40 px-4 py-3 font-body text-sm text-burgundy-dark">
          {t("saved")}
        </p>
      )}
      {state.error && (
        <p className="rounded-card border border-burgundy/30 bg-burgundy-tint/50 px-4 py-3 font-body text-sm text-burgundy-dark">
          {t(state.error)}
        </p>
      )}

      {CMS_CONTENT_GROUPS.map((group) => (
        <section key={group.id} className="space-y-4">
          <h2 className="font-heading text-lg font-semibold text-espresso">
            {group.label}
          </h2>
          <div className="space-y-6">
            {group.fields.map((field) => (
              <div
                key={field.key}
                className="rounded-card border border-espresso/10 bg-white/50 p-4"
              >
                <p className="font-mono text-xs text-espresso/60">{field.key}</p>
                <p className="mt-1 font-heading text-sm font-semibold text-espresso">
                  {field.label}
                </p>
                {field.hint && (
                  <p className="mt-1 font-body text-xs text-espresso/60">
                    {field.hint}
                  </p>
                )}
                <div className="mt-3 grid gap-4 lg:grid-cols-2">
                  <div>
                    <label className="mb-1 block font-mono text-xs text-espresso/70">
                      {t("english")}
                    </label>
                    {field.multiline ? (
                      <Textarea
                        name={`${field.key}__en`}
                        rows={3}
                        defaultValue={values[field.key]?.en ?? ""}
                      />
                    ) : (
                      <Input
                        name={`${field.key}__en`}
                        defaultValue={values[field.key]?.en ?? ""}
                      />
                    )}
                  </div>
                  <div>
                    <label className="mb-1 block font-mono text-xs text-espresso/70">
                      {t("georgian")}
                    </label>
                    {field.multiline ? (
                      <Textarea
                        name={`${field.key}__ka`}
                        rows={3}
                        defaultValue={values[field.key]?.ka ?? ""}
                      />
                    ) : (
                      <Input
                        name={`${field.key}__ka`}
                        defaultValue={values[field.key]?.ka ?? ""}
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}

      <Button type="submit" disabled={pending}>
        {pending ? t("saving") : t("save")}
      </Button>
    </form>
  );
}
