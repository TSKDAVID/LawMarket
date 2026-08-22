"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import type { SiteSettings } from "@/lib/cms/types";
import { Input } from "@/components/ui/input";
import {
  CmsEditorShell,
  CmsSectionBlock,
} from "@/components/admin/cms-editor-shell";
import {
  saveSiteContact,
  type CmsState,
} from "@/app/[locale]/admin/content/actions";

const FORM_ID = "cms-contact-form";
const initial: CmsState = { error: null };

export function CmsContactForm({
  locale,
  settings,
}: {
  locale: string;
  settings: SiteSettings;
}) {
  const t = useTranslations("admin.content");
  const [state, action, pending] = useActionState(saveSiteContact, initial);

  const navSections = [
    { id: "cms-contact-display", label: t("sectionContactDisplay") },
    { id: "cms-contact-details", label: t("sectionContactDetails") },
    { id: "cms-contact-social", label: t("sectionSocial") },
    { id: "cms-contact-legal", label: t("sectionLegalDate") },
  ];

  return (
    <form id={FORM_ID} action={action}>
      <input type="hidden" name="locale" value={locale} />

      <CmsEditorShell
        formId={FORM_ID}
        sections={navSections}
        pending={pending}
        status={state}
      >
        <div className="space-y-10">
          <CmsSectionBlock
            id="cms-contact-display"
            title={t("sectionContactDisplay")}
          >
            <label className="flex items-center gap-2 font-body text-sm text-espresso">
              <input
                type="checkbox"
                name="banner_visible"
                defaultChecked={settings.banner_visible}
                className="h-4 w-4 rounded border-espresso/30"
              />
              {t("bannerVisible")}
            </label>
          </CmsSectionBlock>

          <CmsSectionBlock
            id="cms-contact-details"
            title={t("sectionContactDetails")}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block font-mono text-xs">
                  {t("contactEmail")}
                </label>
                <Input name="contact_email" defaultValue={settings.contact_email} />
              </div>
              <div>
                <label className="mb-1 block font-mono text-xs">
                  {t("contactPhone")}
                </label>
                <Input name="contact_phone" defaultValue={settings.contact_phone} />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block font-mono text-xs">
                  {t("contactPhoneHref")}
                </label>
                <Input
                  name="contact_phone_href"
                  defaultValue={settings.contact_phone_href}
                  placeholder="tel:+995322000000"
                />
              </div>
              <div>
                <label className="mb-1 block font-mono text-xs">
                  {t("locationEn")}
                </label>
                <Input
                  name="contact_location_en"
                  defaultValue={settings.contact_location_en}
                />
              </div>
              <div>
                <label className="mb-1 block font-mono text-xs">
                  {t("locationKa")}
                </label>
                <Input
                  name="contact_location_ka"
                  defaultValue={settings.contact_location_ka}
                />
              </div>
            </div>
          </CmsSectionBlock>

          <CmsSectionBlock id="cms-contact-social" title={t("sectionSocial")}>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-1 block font-mono text-xs">Facebook</label>
                <Input name="social_facebook" defaultValue={settings.social_facebook} />
              </div>
              <div>
                <label className="mb-1 block font-mono text-xs">Instagram</label>
                <Input name="social_instagram" defaultValue={settings.social_instagram} />
              </div>
              <div>
                <label className="mb-1 block font-mono text-xs">LinkedIn</label>
                <Input name="social_linkedin" defaultValue={settings.social_linkedin} />
              </div>
            </div>
          </CmsSectionBlock>

          <CmsSectionBlock id="cms-contact-legal" title={t("sectionLegalDate")}>
            <div>
              <label className="mb-1 block font-mono text-xs">
                {t("legalUpdated")}
              </label>
              <Input
                type="date"
                name="legal_updated_at"
                defaultValue={settings.legal_updated_at}
              />
            </div>
          </CmsSectionBlock>
        </div>
      </CmsEditorShell>
    </form>
  );
}
