"use client";

import type { CmsTextFieldValues } from "@/lib/cms/admin-data";
import { cmsFormFieldName } from "@/lib/cms/form-fields";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function CmsPageExtraFields({
  keys,
  values,
  englishLabel,
  georgianLabel,
}: {
  keys: string[];
  values: Record<string, CmsTextFieldValues>;
  englishLabel: string;
  georgianLabel: string;
}) {
  if (keys.length === 0) return null;

  return (
    <div className="space-y-4">
      {keys.map((key) => {
        const row = values[key];
        const multiline =
          /subtitle|description|note|hint|placeholder|message|lead|body|text/i.test(
            key
          ) && !/title|button|cta/i.test(key);

        return (
          <div
            key={key}
            className="rounded-card border border-espresso/8 bg-white/40 p-4"
          >
            <p className="font-mono text-xs text-espresso/60">{key}</p>
            <div className="mt-3 grid gap-4 lg:grid-cols-2">
              <div>
                <label className="mb-1 block font-mono text-xs text-espresso/70">
                  {englishLabel}
                </label>
                {multiline ? (
                  <Textarea
                    name={cmsFormFieldName(key, "en")}
                    rows={3}
                    defaultValue={row?.en ?? ""}
                  />
                ) : (
                  <Input
                    name={cmsFormFieldName(key, "en")}
                    defaultValue={row?.en ?? ""}
                  />
                )}
              </div>
              <div>
                <label className="mb-1 block font-mono text-xs text-espresso/70">
                  {georgianLabel}
                </label>
                {multiline ? (
                  <Textarea
                    name={cmsFormFieldName(key, "ka")}
                    rows={3}
                    defaultValue={row?.ka ?? ""}
                  />
                ) : (
                  <Input
                    name={cmsFormFieldName(key, "ka")}
                    defaultValue={row?.ka ?? ""}
                  />
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
